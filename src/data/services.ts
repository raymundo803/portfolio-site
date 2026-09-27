/**
 * 服务与报价。
 * 价格为锚点区间，作用是过滤无效客户、降低决策成本 —— 请按你的真实成本调整。
 */

export type Service = {
  id: string;
  name: string;
  tagline: string;
  featured?: boolean;
  deliverables: string[];
  priceFrom: string;
  priceNote: string;
  timeline: string;
  fitFor: string;
};

export const SERVICES: Service[] = [
  {
    id: 'ai-engineering',
    name: 'AI 编程交付',
    tagline: '从需求到上线，一个人跑完全流程',
    featured: true,
    deliverables: [
      '需求拆解与技术方案（含取舍说明，不堆术语）',
      '小程序 / Web 应用 / 内部工具的完整实现',
      '云函数、数据库、存储、部署与域名接入',
      'AI 辅助编码 + 人工审查，交付可维护的源码与文档',
      '上线后 30 天免费缺陷修复',
    ],
    priceFrom: '¥8,000',
    priceNote: '项目制，按需求复杂度报价；也可按 1,500 元/天 计技术咨询',
    timeline: '典型周期 2–6 周',
    fitFor: '中小企业、个体老板、需要把业务流程搬到线上的传统行业',
  },
  {
    id: 'ai-video',
    name: 'AI 视频制作',
    tagline: '脚本、分镜、成片一条龙，不用你养团队',
    deliverables: [
      '选题策划与脚本撰写（含钩子与节奏设计）',
      '角色设定、分镜、画面风格统一',
      'AI 生成 + 剪辑 + 配音 + 字幕成片',
      '竖屏 9:16 / 横屏 16:9 多版本输出',
    ],
    priceFrom: '¥2,000',
    priceNote: '单条成片；系列内容可打包，5 条起享整体折扣',
    timeline: '单条 3–7 天',
    fitFor: '餐饮、本地生活、品牌宣传、个人 IP 内容矩阵',
  },
  {
    id: 'ai-media',
    name: 'AI 自媒体代运营',
    tagline: '不是代发，是把内容生产变成可复用的流程',
    deliverables: [
      '账号定位与人设梳理',
      '选题库搭建（一次性交付 30+ 选题）',
      '内容生产与排版规范',
      '发布节奏、评论区运营、数据复盘',
      '把跑通的流程沉淀成 SOP 交接给你',
    ],
    priceFrom: '¥3,000',
    priceNote: '按月计费；含内容生产与复盘，不含平台投流费用',
    timeline: '按月合作，起 3 个月',
    fitFor: '想做但没时间做内容的实体店主与品牌方',
  },
  {
    id: 'coaching',
    name: '知识付费与陪跑',
    tagline: '把我的方法论装进你的工作流',
    deliverables: [
      '1v1 诊断：你现在卡在哪一步',
      'AI 工具链配置（模型选型、成本控制、提示词库）',
      '陪跑期内不限次答疑',
      '交付一套可复用的模板与脚本',
    ],
    priceFrom: '¥999',
    priceNote: '单次咨询 499 元/小时；陪跑按月计费',
    timeline: '咨询 1 小时起，陪跑 1–3 个月',
    fitFor: '想自己上手 AI 的个人开发者与内容创作者',
  },
];

/** 合作流程，展示在 /services 与首页。 */
export const PROCESS = [
  {
    step: '01',
    title: '说清问题',
    desc: '一通电话或一份表单，先聊业务目标，不聊技术选型。这一步免费。',
  },
  {
    step: '02',
    title: '给方案与报价',
    desc: '48 小时内给出范围、周期、报价与风险点。不合适我会直说。',
  },
  {
    step: '03',
    title: '分阶段交付',
    desc: '拆成可见的里程碑，每个阶段都能看到能跑的东西，而不是等最后验收。',
  },
  {
    step: '04',
    title: '交接与陪跑',
    desc: '文档、源码、部署权限全部交给你。后续可按需续约维护。',
  },
];
