#!/usr/bin/env node
/**
 * 发布前体检：node scripts/check-content.mjs
 *
 * 检查三件事：
 *   1. 配置里的占位内容有没有替换掉（最容易带着上线的一类错误）
 *   2. 文章 frontmatter 是否完整、是否符合 SEO 基本要求
 *   3. 有没有被遗忘的草稿
 *
 * 退出码：0 = 全部通过或仅有提示；1 = 存在必须修的问题
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');
const SITE_TS = join(ROOT, 'src', 'config', 'site.ts');

const errors = [];
const warnings = [];
const infos = [];
const oks = [];

const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const info = (m) => infos.push(m);
const ok = (m) => oks.push(m);

/* ---------- 1. 配置占位检查 ---------- */
if (existsSync(SITE_TS)) {
  const src = readFileSync(SITE_TS, 'utf8');
  const grab = (key) => {
    const m = src.match(new RegExp(`${key}:\\s*'([^']*)'`));
    return m ? m[1] : null;
  };

  const author = grab('author');
  if (author === '你的名字' || !author) {
    err(`site.ts → author 还是占位值「${author ?? '空'}」，上线前必须改成真实姓名或品牌名`);
  } else {
    ok(`作者名：${author}`);
  }

  const url = grab('url');
  if (!url || url.includes('yourdomain.com')) {
    err(`site.ts → url 还是占位域名「${url}」，sitemap / RSS / OG 全靠它`);
  } else {
    ok(`站点域名：${url}`);
  }

  const email = grab('email');
  if (!email || email.includes('yourdomain.com')) {
    err(`site.ts → CONTACT.email 还是占位邮箱「${email}」，客户会联系不上你`);
  } else {
    ok(`联系邮箱：${email}`);
  }

  const icp = grab('icp');
  if (!icp) {
    warn('site.ts → FOOTER.icp 为空。若服务器在大陆，未备案无法上线');
  } else {
    ok(`备案号：${icp}`);
  }

  const formEndpoint = grab('formEndpoint');
  if (!formEndpoint) {
    info('site.ts → formEndpoint 为空，联系页当前走 mailto: 方案。接上后端后这里会变成真正的表单');
  } else {
    ok(`表单后端：已配置`);
  }
} else {
  err('找不到 src/config/site.ts');
}

/* ---------- 2. 文章检查 ---------- */
if (!existsSync(BLOG_DIR)) {
  warn('src/content/blog 不存在，还没有任何文章');
} else {
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  if (files.length === 0) {
    warn('还没有任何文章');
  }

  let draftCount = 0;
  const slugs = new Set();

  for (const f of files) {
    const raw = readFileSync(join(BLOG_DIR, f), 'utf8');
    const slug = f.replace(/\.(mdx|md)$/, '');

    if (slugs.has(slug)) err(`重复文件名：${f}（文件名即 URL，会互相覆盖）`);
    slugs.add(slug);

    const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fmMatch) {
      err(`${f}：缺少 frontmatter（文件开头必须有 --- 包裹的元数据块）`);
      continue;
    }
    const fm = fmMatch[1];
    const field = (k) => {
      const m = fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'));
      return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
    };

    const title = field('title');
    const desc = field('description');
    const pubDate = field('pubDate');
    const draft = field('draft') === 'true';
    const body = raw.slice(fmMatch[0].length).trim();

    if (!title) err(`${f}：缺少 title`);
    else if (title.length > 60) warn(`${f}：标题 ${title.length} 字，超过 60 字在搜索结果里会被截断`);

    if (!desc) err(`${f}：缺少 description（用于 SEO 摘要与 RSS）`);
    else if (desc.length < 20) warn(`${f}：description 只有 ${desc.length} 字，建议 40–80 字`);
    else if (desc.length > 160) warn(`${f}：description ${desc.length} 字，超过 160 字会被搜索引擎截断`);

    if (!pubDate) err(`${f}：缺少 pubDate`);
    else if (Number.isNaN(Date.parse(pubDate))) err(`${f}：pubDate 格式不对，应为 2026-09-14`);

    if (!/[a-zA-Z0-9_-]/.test(slug) || /[^\x00-\x7F]/.test(slug)) {
      err(`${f}：文件名含中文或空格。文件名即 URL，请用英文 slug 并改文件名`);
    }

    if (draft) {
      draftCount++;
      info(`${f}：草稿状态（draft: true），不会出现在列表和 RSS 里`);
    } else if (body.length < 300) {
      warn(`${f}：正文仅 ${body.length} 字，太短的文章既难获客也不利于 SEO`);
    }
  }

  ok(`文章共 ${files.length} 篇${draftCount ? `（其中 ${draftCount} 篇为草稿）` : ''}`);
}

/* ---------- 3. 输出 ---------- */
const line = (arr, mark, color) => {
  for (const m of arr) {
    const code = color === 'red' ? '\x1b[31m' : color === 'yellow' ? '\x1b[33m' : color === 'blue' ? '\x1b[36m' : '\x1b[32m';
    console.log(`${code}${mark}\x1b[0m ${m}`);
  }
};

console.log('\n内容体检报告');
console.log('─'.repeat(56));
line(oks, '✓', 'green');
line(infos, 'ℹ', 'blue');
line(warnings, '!', 'yellow');
line(errors, '✗', 'red');
console.log('─'.repeat(56));

if (errors.length === 0 && warnings.length === 0) {
  console.log('\x1b[32m全部通过，可以发布。\x1b[0m\n');
} else {
  console.log(
    `\n${errors.length} 个必须修的问题，${warnings.length} 个建议优化。\n` +
      '标 ✗ 的项目建议处理完再上线；标 ! 的可自行判断。\n'
  );
}

process.exit(errors.length > 0 ? 1 : 0);
