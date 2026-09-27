import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// 上线前把 site 改成你的真实域名（需带 https://，结尾不要带斜杠）
// sitemap、RSS、OG 链接都由它推导
export default defineConfig({
  site: 'https://yourdomain.com',
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
