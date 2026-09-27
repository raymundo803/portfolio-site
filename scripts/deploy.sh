#!/usr/bin/env bash
#
# 本地构建 → 上传 dist/ 到轻量应用服务器
#
# 用法：
#   ./scripts/deploy.sh -h 43.xxxx.xxx -u root [-p /var/www/yourdomain]
#   SSH_KEY=~/.ssh/id_ed25519_portable ./scripts/deploy.sh -h 1.2.3.4 -u root
#
# 依赖：本地 node/npm、服务器 ssh、本地 rsync（macOS/Linux 自带）
# 前置：服务器已安装 nginx，且站点根目录存在、有写入权限

set -euo pipefail

HOST=""
USER="root"
REMOTE_DIR="/var/www/html"
SSH_KEY="${SSH_KEY:-}"
SSH_PORT="${SSH_PORT:-22}"
NODE_CMD="node"

usage() {
  cat <<'EOF'
部署脚本（本地构建 → 上传静态文件）

  -h   服务器公网 IP            （必填）
  -u   SSH 用户名               默认 root
  -p   服务器上的目标目录       默认 /var/www/html
  -P   SSH 端口                 默认 22
  -k   SSH 私钥路径
  -n   Node 命令路径            默认 node（服务器上）
  -f   只构建不上传
  -v   部署后访问校验

环境变量：
  SSH_PORT       SSH 端口
  SSH_KEY        SSH 私钥路径
EOF
  exit 0
}

while getopts "h:u:p:P:k:n:fvh" opt; do
  case "$opt" in
    h) HOST="$OPTARG" ;;
    u) USER="$OPTARG" ;;
    p) REMOTE_DIR="$OPTARG" ;;
    P) SSH_PORT="$OPTARG" ;;
    k) SSH_KEY="$OPTARG" ;;
    n) NODE_CMD="$OPTARG" ;;
    f) BUILD_ONLY=1 ;;
    v) VERIFY=1 ;;
    h) usage ;;
    *) usage ;;
  esac
done

[ -n "${HOST:-}" ] || { echo "错误：缺少 -h 服务器 IP"; usage; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# ---------- 1. 构建 ----------
echo "▸ 构建静态站点..."
npm run build
DIST="$ROOT/dist"
[ -d "$DIST" ] || { echo "✗ dist/ 不存在，构建失败"; exit 1; }

COUNT=$(find "$DIST" -type f | wc -l | tr -d ' ')
echo "  构建完成，共 $COUNT 个文件"

[ -n "${BUILD_ONLY:-}" ] && { echo "✓ 仅构建模式，未上传"; exit 0; }

# ---------- 2. 预检远程目录 ----------
echo "▸ 检查服务器远程目录 ${USER}@${HOST}:${REMOTE_DIR} ..."
SSH_BASE=(ssh -o StrictHostKeyChecking=accept-new -o LogLevel=ERROR)
[ -n "$SSH_KEY" ] && SSH_BASE+=(-i "$SSH_KEY")
SSH_BASE+=(-p "$SSH_PORT")

"${SSH_BASE[@]}" "${USER}@${HOST}" \
  "test -d '${REMOTE_DIR}' && echo OK || echo MISSING" | grep -q OK \
  || { echo "✗ 远程目录不存在或无法访问：${REMOTE_DIR}"; echo "  先手动创建：ssh ... mkdir -p ${REMOTE_DIR}"; exit 1; }

# ---------- 3. 上传 ----------
echo "▸ 上传文件..."
RSYNC_BASE=(rsync -az --delete --compress)
[ -n "$SSH_KEY" ] && RSYNC_BASE+=(-e "ssh -i $SSH_KEY -p $SSH_PORT -o StrictHostKeyChecking=accept-new")
[ -z "$SSH_KEY" ] && RSYNC_BASE+=(-e "ssh -p $SSH_PORT -o StrictHostKeyChecking=accept-new")

"${RSYNC_BASE[@]}" "$DIST/" "${USER}@${HOST}:${REMOTE_DIR}/"

echo "✓ 上传完成"

# ---------- 4. 访问校验 ----------
if [ -n "${VERIFY:-}" ]; then
  echo "▸ 校验站点可访问..."
  CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "http://${HOST}/" || echo "000")
  echo "  首页 HTTP 状态：$CODE"
  [ "$CODE" = "200" ] || echo "  ⚠ 未返回 200，检查 nginx 配置与防火墙"
fi

echo ""
echo "完成。若访问异常，检查："
echo "  1. 腾讯云控制台 → 防火墙是否放行 80/443"
echo "  2. nginx 站点配置 root 是否指向 ${REMOTE_DIR}"
echo "  3. 是否已做 ICP 备案（大陆节点绑域名必须）"
