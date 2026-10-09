/**
 * 站内链接前缀处理。
 *
 * 站点要同时支持两种部署方式：
 *   根路径部署（腾讯云 / 自有域名）  → BASE_URL 为 "/"
 *   子路径部署（GitHub Pages 项目页）→ BASE_URL 为 "/portfolio-site/"
 *
 * Astro 只会给 import 进来的资源和 CSS 里的 url() 自动补前缀，
 * 模板中手写的 "/work" 它不管。子路径部署时不补就会全站 404，
 * 所以站内链接一律走这里。
 */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * 给站内路径加上部署前缀。
 *
 *   withBase('/work')         根路径下 → '/work'
 *                             子路径下 → '/portfolio-site/work'
 *   withBase('https://a.com') 外链原样返回
 *   withBase('mailto:...')    协议链接原样返回
 *   withBase('#top')          纯锚点原样返回
 */
export function withBase(path: string): string {
  if (!path) return BASE || '/';

  // 带协议的绝对地址、协议相对地址、纯锚点，都不该被改写
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;

  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${normalized}`;
}
