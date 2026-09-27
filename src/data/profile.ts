/**
 * 关于页与首页的自我介绍内容。
 * 数字为示例占位，请替换为真实经历与真实数据。
 */

export const PROFILE = {
  intro: [
    '我是独立开发者，写代码也写内容。主线是用 AI 做真实交付 —— 不是演示一个炫技的 Demo，而是交付客户能直接用、能自己维护的东西。',
    '做过小程序全栈、云函数与数据流水线，也做过县域品牌的小红书代运营和县级联赛的赛事内容系统。这些经历让我习惯从业务目标倒推技术方案，而不是先挑一个好看的框架。',
    '现在在准备注册一人公司，把 AI 编程、AI 视频、AI 自媒体三条线做成可持续的个人生意。',
  ],
  beliefs: [
    {
      title: '先问业务目标，再谈技术选型',
      desc: '框架之争没有意义。能最快跑通、长期维护成本最低的那个，就是对的那个。',
    },
    {
      title: '交付可维护的东西，不是能跑的 Demo',
      desc: '源码、文档、部署权限全部交出去。客户被锁死不是本事，是隐患。',
    },
    {
      title: 'AI 是产能杠杆，不是替罪羊',
      desc: 'AI 出初稿，人负责判断与兜底。错了是我的责任，不是模型的。',
    },
    {
      title: '不合适就直说',
      desc: '需求不清晰、预算不匹配、我做不了的，第一次沟通就会告诉你。',
    },
  ],
} as const;

export const SKILL_GROUPS = [
  {
    name: '前端与全栈',
    items: ['TypeScript / JavaScript', 'Vue 3 / React', 'Node.js', '小程序原生开发', 'Vite'],
  },
  {
    name: '云端与后端',
    items: ['微信云开发 CloudBase', '云函数', '云数据库', '对象存储 / COS', 'REST API 设计'],
  },
  {
    name: 'AI 工具链',
    items: ['Claude Code / CodeBuddy', '提示词工程', '本地模型部署（Ollama）', '模型成本与选型', 'Agent 工作流编排'],
  },
  {
    name: '内容与视频',
    items: ['小红书运营', '公众号长文', 'AI 视频脚本与分镜', '风格一致性控制', '数据复盘'],
  },
] as const;

/** 首页信任条数字，请换成真实数据。留空则不展示。 */
export const STATS = [
  { value: '10+', label: '年开发经验' },
  { value: '4', label: '条业务线并行' },
  { value: '11', label: '产品 SKU 全栈自建' },
  { value: '1人', label: '从需求到上线全流程' },
] as const;

/** 能力矩阵，首页核心区块。 */
export const CAPABILITIES = [
  {
    icon: 'code',
    title: 'AI 编程交付',
    desc: '小程序、Web 应用、内部工具，从需求拆解到部署上线一人跑通。AI 辅助编码，人工负责架构与审查。',
    href: '/services#ai-engineering',
  },
  {
    icon: 'video',
    title: 'AI 视频制作',
    desc: '脚本、角色、分镜、成片全流程。重点解决 AI 视频最容易翻车的跨镜头风格一致性问题。',
    href: '/services#ai-video',
  },
  {
    icon: 'megaphone',
    title: 'AI 自媒体运营',
    desc: '定位、选题库、内容生产、发布节奏、数据复盘。交付的不只是内容，是一套你能接手的 SOP。',
    href: '/services#ai-media',
  },
  {
    icon: 'graduation',
    title: '知识付费与陪跑',
    desc: '把 AI 装进你的工作流：工具链配置、成本控制、提示词库，陪你跑完第一个真实项目。',
    href: '/services#coaching',
  },
] as const;
