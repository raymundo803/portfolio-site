/**
 * 全站唯一配置源。
 * 上线前必改：name / author / url / contact 四块，其余可按需要微调。
 */

export const SITE = {
  name: 'AI 交付工作室',
  shortName: 'AI交付',
  author: '你的名字',
  role: '独立开发者 · AI 交付工程师',
  url: 'https://yourdomain.com',
  locale: 'zh-CN',
  description:
    '用 AI 把想法做成能跑的东西。承接 AI 编程交付、AI 视频制作、AI 自媒体代运营，从需求到上线一人全流程。',
  keywords: [
    'AI 编程',
    'AI 视频',
    'AI 自媒体',
    '独立开发者',
    '小程序开发',
    '知识付费',
    '一人公司',
  ],
} as const;

/** 首屏那一句话。改这里就等于改了全站的定位。 */
export const HERO = {
  eyebrow: 'AI 编程 · AI 视频 · AI 自媒体',
  title: '用 AI 把想法，做成能跑的东西',
  subtitle:
    '我是独立开发者，不做 PPT 式咨询。从需求梳理到上线交付，一个人跑完全流程 —— 你要的是结果，不是聊天记录。',
  primaryCta: { text: '看我能交付什么', href: '/services' },
  secondaryCta: { text: '聊聊你的需求', href: '/contact' },
} as const;

/** 联系方式。留空字符串即可自动隐藏对应入口。 */
export const CONTACT = {
  wechat: '', // 微信号，例如 'your_wechat_id'
  wechatQr: '', // 微信二维码图片地址，例如 '/wechat-qr.png'（放 public 目录）
  email: 'hello@yourdomain.com',
  phone: '',
  city: '湖北 · 浠水',
  /** 咨询表单提交到哪里。留空则展示邮箱地址让访客直接发信。 */
  formEndpoint: '', // 例如 Formspree / 自建云函数的地址
} as const;

/** 内容平台，用于首页与页脚的流量互导。 */
export const CHANNELS = [
  { name: '微信公众号', desc: '地方事件报道与 AI 实操', url: '', handle: '' },
  { name: '小红书', desc: 'AI 工具实操与本地内容代运营', url: '', handle: '' },
  { name: '视频号 / 抖音', desc: 'AI 视频作品集', url: '', handle: '' },
  { name: 'GitHub', desc: '开源与代码片段', url: '', handle: '' },
] as const;

export const NAV = [
  { text: '首页', href: '/' },
  { text: '服务', href: '/services' },
  { text: '案例', href: '/work' },
  { text: '文章', href: '/blog' },
  { text: '关于', href: '/about' },
  { text: '联系', href: '/contact' },
] as const;

/** 页脚备案信息。国内服务器必填 ICP 备案号。 */
export const FOOTER = {
  icp: '', // 例如 '鄂ICP备12345678号-1'
  police: '', // 公安备案号（可选）
  since: 2026,
} as const;
