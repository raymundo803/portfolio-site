#!/usr/bin/env node
/**
 * 新建文章：node scripts/new-post.mjs "标题" [--slug xxx] [--tags a,b] [--draft]
 *
 * 生成的文件位于 src/content/blog/<slug>.mdx，文件名即 URL。
 * 例：slug 为 ai-delivery-rules → /blog/ai-delivery-rules
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');

function parseArgs(argv) {
  const args = { positional: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--slug' || a === '-s') args.slug = argv[++i];
    else if (a === '--tags' || a === '-t') args.tags = argv[++i];
    else if (a === '--desc' || a === '-d') args.desc = argv[++i];
    else if (a === '--draft') args.draft = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else args.positional.push(a);
  }
  return args;
}

const USAGE = `
用法：npm run new -- "文章标题" [选项]

选项：
  -s, --slug <slug>     URL 用的英文标识，默认自动生成
  -t, --tags <a,b>      标签，逗号分隔
  -d, --desc <text>     一句话摘要（SEO description）
      --draft           存为草稿，不发布
  -h, --help            查看帮助

示例：
  npm run new -- "用 AI 做交付的 6 条硬规则" -s ai-delivery-rules -t "AI 编程,方法论"
`;

const args = parseArgs(process.argv.slice(2));

if (args.help || args.positional.length === 0) {
  console.log(USAGE);
  process.exit(args.help ? 0 : 1);
}

const title = args.positional.join(' ').trim().replace(/^["']|["']$/g, '');
const today = new Date();
const pad = (n) => String(n).padStart(2, '0');
const dateStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
const stamp = `${today.getFullYear()}${pad(today.getMonth() + 1)}${pad(today.getDate())}`;

const slug =
  (args.slug || '').trim() ||
  `post-${stamp}-${Math.random().toString(36).slice(2, 5)}`;

if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
  console.error(`✗ slug 只能包含字母、数字、连字符和下划线：${slug}`);
  console.error('  中文标题请用 -s 手动指定英文 slug，例如 -s ai-delivery-rules');
  process.exit(1);
}

const file = join(BLOG_DIR, `${slug}.mdx`);
if (existsSync(file)) {
  console.error(`✗ 文件已存在：src/content/blog/${slug}.mdx`);
  process.exit(1);
}

const tags = (args.tags || '未分类')
  .split(/[,，]/)
  .map((t) => t.trim())
  .filter(Boolean);

const desc = (args.desc || '').trim() || '一句话说清这篇文章解决什么问题。';

const content = `---
title: '${title.replace(/'/g, "''")}'
description: '${desc.replace(/'/g, "''")}'
pubDate: ${dateStr}
tags: [${tags.map((t) => `'${t.replace(/'/g, "''")}'`).join(', ')}]
draft: ${args.draft ? 'true' : 'false'}
---

## 小标题

正文。写的时候记住一件事：读者是来解决问题的，不是来听你复述官方文档的。

- 可以列要点
- 可以贴代码

\`\`\`js
const hello = 'world';
\`\`
`;

if (!existsSync(BLOG_DIR)) mkdirSync(BLOG_DIR, { recursive: true });
writeFileSync(file, content, 'utf8');

console.log(`✓ 已创建：src/content/blog/${slug}.mdx`);
console.log(`  访问地址：/blog/${slug}`);
console.log(`  发布状态：${args.draft ? '草稿（把 draft 改成 false 即上线）' : '已发布'}`);
console.log(`\n下一步：npm run dev，然后打开 http://127.0.0.1:4321/blog/${slug} 边写边看`);
