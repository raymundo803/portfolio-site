/**
 * 案例库。
 * 注意：metrics 里的数字是示例占位，请替换成真实数据。
 * 客户名做了脱敏处理，若对方允许公开，直接改成品牌名会显著提升说服力。
 */

export type Case = {
  id: string;
  title: string;
  client: string;
  category: 'AI 自媒体' | 'AI 编程' | 'AI 视频';
  year: string;
  summary: string;
  challenge: string;
  approach: string[];
  metrics: { label: string; value: string }[];
  stack: string[];
};

export const CASES: Case[] = [
  {
    id: 'quartz-xhs',
    title: '县域建材品牌的小红书代运营',
    client: '某零硅石英石品牌（华中）',
    category: 'AI 自媒体',
    year: '2026',
    summary:
      '从零搭建账号定位与选题库，用 AI 辅助生产内容，把「产品参数」翻译成业主听得懂的避坑语言。',
    challenge:
      '产品技术参数扎实，但内容全是厂家视角的术语。目标用户是装修业主，看不懂也不关心，笔记发出去没有互动。',
    approach: [
      '重做账号定位：从「卖板材」切换到「帮业主避坑」',
      '搭建 30+ 条选题库，按装修决策阶段分层',
      '把技术参数改写成业主视角的痛点钩子',
      '用 AI 生成初稿 + 人工改写，保证语气不模板化',
      '建立数据复盘节奏，按互动率淘汰选题方向',
    ],
    metrics: [
      { label: '累计笔记', value: '40+' },
      { label: '选题库储备', value: '30+' },
      { label: '内容生产耗时', value: '↓ 60%' },
    ],
    stack: ['小红书', '选题矩阵', 'AI 辅助写作', '数据复盘'],
  },
  {
    id: 'xiba-reports',
    title: '县级篮球联赛的赛事内容中台',
    client: '某县级男子篮球联赛',
    category: 'AI 编程',
    year: '2026',
    summary:
      '把每天散落的比分、数据表做成自动化流水线，赛事战报与积分榜当天产出，不再靠人肉熬夜排版。',
    challenge:
      '赛程密集，数据分散在多张表里。人工整理一份战报要两小时，发布时热点已经过了。',
    approach: [
      '统一数据表结构，把比分、积分、赛程收敛成单一数据源',
      '写脚本自动计算积分与排名，避免人工算错',
      '用模板生成战报初稿，人工只做事实校对与润色',
      '输出可直接发布的排版成品',
    ],
    metrics: [
      { label: '单篇产出耗时', value: '2h → 20min' },
      { label: '数据差错', value: '0' },
      { label: '发布时效', value: '当日完赛当日发' },
    ],
    stack: ['Node.js', '数据流水线', '模板引擎', '公众号排版'],
  },
  {
    id: 'moffeni-miniapp',
    title: '家居品牌产品展示小程序',
    client: '某石英石家居品牌',
    category: 'AI 编程',
    year: '2026',
    summary:
      '从产品目录到云函数到分享卡片，全栈自建。解决了一类很典型的问题：分享出去的卡片别人看不到图。',
    challenge:
      '产品数据分散在四个地方，中英文描述两套 schema 并存；分享卡片图片发送方可见、接收方不可见，试了图床、临时链接、云函数代理都不行。',
    approach: [
      '收敛数据：把分散在产品文件、云函数、页面里的目录数据统一到云数据库',
      '统一中英文描述字段结构，消除双 schema 歧义',
      '排查分享链路，定位到必须使用云存储永久 HTTPS 链接',
      '用云存储直出图片地址彻底解决分享卡片问题',
    ],
    metrics: [
      { label: '产品 SKU', value: '11' },
      { label: '数据分散位置', value: '4 → 1' },
      { label: '分享卡片', value: '全链路可见' },
    ],
    stack: ['微信小程序', 'CloudBase', '云函数', 'COS 存储'],
  },
  {
    id: 'moffeni-video',
    title: '品牌 AI 短片（邵氏武侠风格）',
    client: '某家居品牌宣传短片',
    category: 'AI 视频',
    year: '2026',
    summary:
      '从脚本、角色设定到分镜与数据可视化，全流程 AI 制作，用统一风格解决 AI 视频最致命的画面跳变问题。',
    challenge:
      'AI 生成视频最常见的失败是镜头之间人物和色调对不上，看起来像拼贴。客户要的是能直接投放的成品。',
    approach: [
      '先定风格基调（邵氏武侠 + Technicolor 色调）再生成任何画面',
      '锁定角色设定，保证跨镜头一致性',
      '分镜脚本逐镜头写，控制时长与信息密度',
      '数据可视化段落单独制作，避免风格割裂',
      '9:16 竖屏原生制作，不做横屏裁切',
    ],
    metrics: [
      { label: '成片规格', value: '9:16 竖屏' },
      { label: '制作周期', value: '短于传统拍摄' },
      { label: '风格一致性', value: '跨镜头统一' },
    ],
    stack: ['AI 视频生成', '分镜设计', '风格控制', '剪辑合成'],
  },
];

export const CATEGORIES = ['全部', 'AI 编程', 'AI 视频', 'AI 自媒体'] as const;
