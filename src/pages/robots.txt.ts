import type { APIRoute } from 'astro';
import { withBase } from '../utils/url';

/**
 * robots.txt 在构建时生成。
 *
 * 原来放在 public/ 里是死的：Sitemap 地址写死后，子路径部署会指向错误位置。
 * 这里用 withBase 拼出实际地址，两种部署方式都对。
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site ?? 'https://yourdomain.com';
  const sitemap = new URL(withBase('/sitemap-index.xml'), origin).href;

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemap}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
