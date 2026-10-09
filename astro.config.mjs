import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/**
 * 一套代码，两种部署。用环境变量切换，不在源码里写死。
 *
 *   腾讯云 / 自有域名（根路径部署）
 *     npm run build              → base "/"，site 走下面默认值
 *
 *   GitHub Pages（子路径部署）
 *     BASE_PATH=/portfolio-site SITE_URL=https://raymundo803.github.io npm run build
 *
 * .github/workflows/deploy.yml 已按上面方式注入，无需手动执行。
 */
const BASE_PATH = process.env.BASE_PATH || '/';
const SITE_URL = process.env.SITE_URL || 'https://yourdomain.com';

export default defineConfig({
  base: BASE_PATH,
  site: SITE_URL,
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
  build: {
    format: 'directory',
  },
});
