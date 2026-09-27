# 个人站点 · AI 交付工作室

Astro 5 + MDX 静态站。定位是**一人公司的官网 + 内容获客系统**，不是博客。

技术栈：Astro 5 · MDX · 手写 CSS（亮/暗双主题，零 UI 框架依赖）· 内容集合（Content Collections）

---

## 文档导航

| 文档 | 看什么 |
|---|---|
| 本文件 | 部署、配置、目录结构、合规 |
| **[CONTENT-GUIDE.md](./CONTENT-GUIDE.md)** | **日常怎么更新内容、多久更新、按什么标准写** |

如果你是回来更新内容的，直接看 `CONTENT-GUIDE.md` 的速查表。

---

## 一、上线前必须改的 5 处

按优先级排列，改完就能上线。

### 1. `src/config/site.ts` —— 全站唯一配置源

| 字段 | 说明 |
|---|---|
| `name` / `author` | 品牌名与你的名字。**默认 `你的名字` 是占位，必须改** |
| `url` | 真实域名，带 `https://`，结尾不带斜杠。sitemap / RSS / OG 全靠它 |
| `CONTACT.email` / `wechat` | 留空字符串会自动隐藏对应入口 |
| `CONTACT.formEndpoint` | 留空则联系页走 `mailto:`；填上就变成真正的在线表单 |
| `CHANNELS[].url` | 留空则不展示该渠道卡片 |
| `FOOTER.icp` | 国内服务器必填备案号 |

### 2. `astro.config.mjs` —— 把 `site` 改成同一个域名

### 3. `public/robots.txt` —— Sitemap 地址里的域名

### 4. `src/data/cases.ts` —— **案例里的数字是示例占位**

客户名已做脱敏。两件事要做：
- 把 `metrics` 换成真实数据（虚假数据比没有数据更伤信任）
- 客户允许公开的话，把 `client` 改成真实品牌名，说服力提升明显

### 5. `src/data/profile.ts` —— `STATS` 数字替换成真实经历

---

## 二、本地开发

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # 产物在 dist/
npm run preview        # 本地预览构建产物
npm run new -- "标题"   # 新建文章，详见 CONTENT-GUIDE.md
npm run check:content  # 发布前体检：查占位内容、frontmatter、SEO 长度
```

Node 版本要求 18+。若本地 `127.0.0.1` 打不开，换成 `localhost` 试试（某些代理环境会拦截 IPv4）。

---

## 三、目录结构

```
src/
├── config/site.ts        # 全站配置：品牌、联系、导航、备案
├── data/
│   ├── services.ts       # 服务与报价、合作流程、FAQ 数据源
│   ├── cases.ts          # 案例库
│   └── profile.ts        # 关于页内容、技能、能力矩阵、统计数字
├── content/blog/*.mdx    # 文章（Markdown/MDX，frontmatter 定义元数据）
├── components/           # Header / Footer / CTA / Icon / CaseVisual / BaseHead
├── layouts/BaseLayout.astro
├── pages/                # index / services / work / blog / about / contact / 404 / rss
└── styles/global.css     # 设计系统（改配色只需要动顶部 :root 变量）
public/                   # favicon.svg、robots.txt、放图片
```

**改配色**：只动 `src/styles/global.css` 顶部的 `:root` 与 `[data-theme='dark']` 两组变量。目前主色是 `#4f46e5`（靛蓝）。

**改首屏那句话**：`src/config/site.ts` 里的 `HERO`。改这里等于改全站定位。

---

## 四、日常内容维护

### 4.1 为什么没有后台管理页面

本站是纯静态站，**没有数据库、没有登录、没有 `/admin`**。这是刻意的设计：

| | 静态站 + Markdown | 带后台的 CMS |
|---|---|---|
| 部署 | 对象存储 / CDN，月成本几块钱 | Node 服务 + 数据库，月成本几十到几百 |
| 运维 | 几乎为零 | 要管进程、备份、安全更新 |
| 安全面 | 没有登录入口，也就没有攻击面 | 需要防暴力破解、XSS、越权 |
| 写作体验 | Markdown，能用 AI 直接生成 | 可视化编辑器，但很多人最后还是在 Markdown 框里写 |
| 适合 | 一人更新、一周几篇 | 多人协作、非技术同事也要发内容 |

对一人公司来说，前四项全是净收益。**等你真的需要"在手机上发文章"或"请人帮你发内容"时，再上后台不迟**（升级路径见 4.5）。

### 4.2 写文章：一条命令

```bash
npm run new -- "用 AI 做交付的 6 条硬规则" -s ai-delivery-rules -t "AI 编程,方法论"
```

| 参数 | 作用 |
|---|---|
| 第一个位置参数 | 文章标题（中文没问题） |
| `-s, --slug` | URL 用的英文标识。**中文标题建议手动指定**，否则会生成 `post-20260914-x7f` 这种随机名 |
| `-t, --tags` | 标签，逗号分隔 |
| `-d, --desc` | 一句话摘要，同时用于 SEO description 和 RSS |
| `--draft` | 存为草稿，不上线 |

脚本会在 `src/content/blog/` 生成带完整 frontmatter 的 `.mdx` 文件。**文件名就是 URL**：`ai-delivery-rules.mdx` → `/blog/ai-delivery-rules`。

手改文件名等于改 URL，改完记得检查有没有地方引用了旧链接。

frontmatter 字段：

```yaml
---
title: '标题'
description: '摘要'
pubDate: 2026-09-14
updatedDate: 2026-09-20   # 可选，有则显示"更新于"
tags: ['AI 编程', '方法论']
draft: false              # true 则不上线，方便写好先存着
---
```

### 4.2.1 发布前先体检

```bash
npm run check:content
```

会检查配置里的占位内容（作者名、域名、邮箱）、备案号、文章 frontmatter 完整性、标题与摘要长度、文件名是否是英文 slug、有没有遗忘的草稿。

**标 ✗ 的问题建议处理完再上线。** 它主要用来拦住"网站带着 `你的名字` 上线"这类事故。

### 4.3 用 AI 写，才是你真正的效率来源

你已经在用 Claude Code / CodeBuddy，那维护内容的最快路径其实是：

> 直接让 AI 在 `src/content/blog/` 下写 `.mdx` 文件，或者把草稿丢给它润色、扩写、改标题。

比起在任何后台里敲字，这条路快一个量级。需要它遵守格式时，把上面那段 frontmatter 贴给它就行。

### 4.4 其他内容改哪里

| 想改什么 | 改哪个文件 |
|---|---|
| 品牌名、联系方式、首屏那句话、导航、备案号 | `src/config/site.ts` |
| 服务条目、报价、合作流程 | `src/data/services.ts` |
| 常见问题 FAQ | `src/pages/services.astro` 里的 `FAQ` 数组 |
| 案例 | `src/data/cases.ts` |
| 关于页文字、技能清单、统计数字 | `src/data/profile.ts` |
| 首页能力矩阵 | `src/data/profile.ts` 的 `CAPABILITIES` |

改完 `npm run dev` 边看边调，保存即热更新。

### 4.5 写完怎么上线

静态站的发布流程就是「构建 → 传文件」：

```bash
npm run build     # 产物在 dist/
```

手动上传 `dist/` 也能用，但推荐接 CI：把仓库推到 GitHub / CNB / 工蜂，配一条流水线做 `npm install && npm run build`，再把 `dist/` 同步到对象存储。

仓库已带 `.gitignore`，`node_modules/`、`dist/`、`.astro/` 都已排除。提交前确认它生效：

```bash
git status --short    # 不应出现 node_modules 或 dist
```

示例（GitHub Actions 骨架，按你的平台改最后一步）：

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm run build
      # 这里换成你的上传方式：OSS / COS / 服务器 scp / Pages
```

配好之后，**日常更新就是 `git push`，两分钟后线上生效**。

### 4.6 如果你确实想要后台

按代价从低到高：

1. **Keystatic / Decap CMS**（推荐）—— 提供可视化后台界面，但内容仍然写回 Git 仓库的 Markdown。部署依旧是静态站，不需要数据库。适合单人但想要界面的人。
2. **无头 CMS**（Contentful / Sanity / Strapi）—— 内容存云端，构建时拉 API。可以多人、可以手机上发。代价是多一个服务依赖和月度账单，构建也要联网。
3. **自建后台**（Astro SSR + 数据库 + 登录）—— 完全可控，但要改 `output: 'server'`，部署从静态托管变成 Node 服务，运维量上一个台阶。

需要哪种告诉我，我直接接上。

---

## 五、部署

### 方案 A：国内服务器（推荐，客户在大陆）

1. 域名在阿里云/腾讯云完成 **ICP 备案**（1–3 周，提前规划）
2. `npm run build`，把 `dist/` 传上去
3. 推荐组合：
   - **对象存储 + CDN**：成本最低，静态站首选（OSS / COS 静态网站托管 + CDN 加速）
   - **轻量应用服务器 + Nginx**：可控性最好，适合以后要加后端接口
4. 上线后 30 日内完成**公安备案**，备案号填进 `FOOTER.police`

### 方案 B：海外 / 免备案

Vercel、Netlify、Cloudflare Pages 都能直接连 Git 仓库自动构建。

**但注意**：大陆访问不稳定，做商业转化有风险。只建议作为技术展示或面向海外客户。

### 方案 C：微信生态内嵌

静态资源放微信云开发 COS（永久 HTTPS 链接），可配合公众号菜单。已有成熟链路。

---

## 六、后续可以加什么（按优先级，不要一次全做）

1. **在线表单真正可用** —— `CONTACT.formEndpoint` 填 Formspree / 腾讯云函数 / 自建接口，把询盘沉淀成线索
2. **访问统计** —— 加 Umami 或百度统计，先知道流量从哪来
3. **OG 图片自动生成** —— `@vercel/og` 或 satori，提升社交分享点击率
4. **知识付费** —— 接入支付后再做。个人主体可选微信支付小微商户；公司主体注册完成后再上更规范
5. **会员与付费墙** —— 需要后端与登录体系。此时建议评估从 Astro 迁到 Next.js（内容层 MDX 可复用）

**建议顺序：先跑通第一条有效询盘，再决定 2–5 做不做。** 没有流量验证就上支付，大概率白写。

---

## 七、合规提醒（重要）

- **ICP 备案**：服务器在大陆必须备案，未备案无法用国内 CDN
- **公安备案**：网站上线后 30 日内办理
- **知识付费**：线上课程/付费内容有资质与内容合规要求，个人与公司主体能做的范围不同
- **一人公司**：注册后主体变化会影响支付接口、开票与合同签署，建议注册完成后同步更新站点主体信息
- **内容代运营**：接广告类内容时注意《广告法》禁用词与平台规则，极限词风险由发布主体承担

以上为一般性提醒，具体以当地监管部门口径和专业顾问意见为准。

---

## 八、已内置的 SEO 能力

- 每页独立 title / description / canonical
- Open Graph + Twitter Card 元数据
- sitemap-index.xml 自动生成
- RSS：`/rss.xml`
- 语义化 HTML + 无 JS 依赖首屏

**注意**：`og:image` 目前未设置。等你有了品牌封面图，在 `BaseHead.astro` 里加一行 meta 即可。
