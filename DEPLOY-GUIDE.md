# 部署指南

站点是纯静态的，同一份代码可以同时部署到两个地方，互不冲突：

| 方式 | 用途 | 触发 |
|---|---|---|
| **GitHub Pages** | 免费备用站、技术展示、海外访问 | push 到 main 后自动构建部署 |
| **腾讯云轻量** | 商业主站，大陆秒开 | 本地 `npm run deploy` 手动上传 |

两者唯一的差别是**部署路径**：Pages 挂在子路径 `/portfolio-site/` 下，腾讯云在根路径。
链接前缀由 `src/utils/url.ts` 的 `withBase()` 统一处理，两处都不用改源码。

---

## 一、GitHub Pages

流水线已配好：`.github/workflows/deploy.yml`，push 到 main 就自动构建并发布。

**首次启用只需做一次：**

1. 打开 https://github.com/raymundo803/portfolio-site/settings/pages
2. **Source** 选 `GitHub Actions`（不要选 Deploy from a branch）
3. 去 https://github.com/raymundo803/portfolio-site/actions 看流水线跑完
4. 访问 https://raymundo803.github.io/portfolio-site/

之后每次 push 都会自动重新部署，不用再管。

想在本地预览 Pages 版本（子路径）的效果：

```bash
npm run build:pages && npm run preview
```

**日后改仓库名或换自定义域名时**，改 workflow 里这两行即可：

```yaml
BASE_PATH: /portfolio-site                    # 改成 /<新仓库名>；用自定义域名则改回 /
SITE_URL: https://raymundo803.github.io       # 改成你的域名
```

---

## 二、腾讯云轻量应用服务器

采用「本地构建 + 上传静态文件」方案：服务器只装 nginx，不装 Node。
构建环境留在本机，好处是安全面最小、2G 内存的机器也不会在构建时 OOM，
坏处是每次更新要跑一次 `npm run deploy`。

腾讯云走根路径，不要设 `BASE_PATH`，`npm run build` 的默认行为就是对的。

---

## 三、你需要在服务器上跑一次的命令

登录服务器（`ssh root@你的IP`），逐条执行。这些只需要做一次。

```bash
# 1. 安装 nginx（镜像自带则跳过）
apt update && apt install -y nginx      # Debian/Ubuntu
# 或：yum install -y nginx              # CentOS

# 2. 建站点目录
mkdir -p /var/www/html

# 3. 写配置
cp /dev/null /etc/nginx/conf.d/site.conf
# 把 scripts/nginx.conf 的内容贴进去，改掉 server_name

# 4. 启用
nginx -t && systemctl enable --now nginx

# 5. 目录权限（若用非 root 用户上传）
chmod 755 /var/www/html && chmod 644 /var/www/html/*
```

**腾讯云轻量应用服务器要单独放行端口**：控制台 → 轻量应用服务器 → 实例 →
防火墙 → 添加规则。默认安全组可能只开了 22/80/443，若开了「全部端口」可跳过。

---

## 四、本地部署

```bash
npm run deploy -- -h 你的服务器IP -u root -p /var/www/html -v
```

参数：

| 参数 | 说明 | 默认 |
|---|---|---|
| `-h` | 服务器公网 IP（必填） | — |
| `-u` | SSH 用户名 | `root` |
| `-p` | 服务器上的目标目录 | `/var/www/html` |
| `-P` | SSH 端口 | `22` |
| `-k` | SSH 私钥路径 | — |
| `-v` | 上传后校验首页 HTTP 状态 | — |

脚本做的事：构建 → 检查远程目录 → `rsync --delete` 同步 → 可选校验。
`--delete` 会删除服务器上不属于本次构建的文件，所以旧的构建产物会被清掉，
这是想要的行为；但**不要把其他站点目录指成目标目录**。

用了非 root 用户、或 SSH 端口改过时：

```bash
SSH_PORT=2222 SSH_KEY=~/.ssh/xxx npm run deploy -- -h 1.2.3.4 -u ubuntu -v
```

---

## 五、绑定域名与备案

**这是最容易卡住的一步。** 大陆节点的服务器绑定域名必须先完成 ICP 备案，
周期通常 1–3 周。顺序建议：

1. 先买域名 → 提交备案 → 备案期间用 **IP 访问**验证部署是否正常
2. 备案下来后 → 域名解析到服务器 IP → 改 nginx 的 `server_name`
3. 最后申请证书上 HTTPS

备案没下来之前别急着把 `server_name` 配成真实域名，腾讯云会返回一个拦截页，
容易误判成部署失败。

---

## 六、HTTPS

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d 你的域名 -d www.你的域名
```

certbot 会自动改配置并写续期定时任务。证书 90 天到期，自动续期默认已配好，
用 `certbot renew --dry-run` 验证一下即可。

---

## 七、日常更新

改了内容之后：

```bash
npm run check:content   # 先体检，防止占位内容上线
npm run deploy -- -h <IP> -v
```

严格来说，改内容应先提交再部署，让仓库始终是唯一事实来源：

```bash
git add -A && git commit -m "更新：..."
npm run deploy -- -h <IP> -v
```

---

## 八、出问题先查这三样

| 现象 | 原因 |
|---|---|
| 首页 403 | nginx 配置里 root 路径写错，或目录权限不足 |
| 首页 404 | 上传没成功，或 root 指向的目录不对 |
| 能访问但样式全丢 | 浏览器缓存了旧 CSS；强制刷新或清缓存 |
| 域名打不开、IP 能开 | 未备案，或 DNS 没生效 |
| 连不上服务器 | 防火墙没放行，或 IP/端口填错 |
