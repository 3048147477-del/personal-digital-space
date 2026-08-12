# DESIGN.md

> Living Index / 生长索引：把网站做成一份正在更新的个人年刊。人物是一张可打开的索引卡，游戏、书籍和音乐是连续编目的真实记录；大字、编号、细线、彩色衬纸和媒体接触表共同形成全站语言。

**Version**: V3.3 desktop baseline — full scroll story edition
**Product mode**: Experience first, Read second
**Interaction tier**: L2 流畅交互
**Dependencies**: React + 原生 CSS + 原生 `IntersectionObserver` + 渐进 View Transition；不新增动画或滚动依赖

## 1. Visual Theme & Atmosphere

### Direction

**Style**: Living Index / 生长索引
**Keywords**: 个人年刊、索引卡、接触表、括号导航、连续编号、彩色衬纸、编辑留白、认真但有玩心
**Tone**: 清醒、直接、有文化感、有一点古怪 — NOT 米色卡片模板、SaaS 仪表盘、赛博终端、儿童贴纸册
**Feel**: 像一本由本人持续编辑的独立年刊：封面克制，翻开后有鲜明的大字、图像、目录、边注和偶尔露出的彩色纸页。

### Product Truth

- 这不是职业作品集，而是旺角西多士的个人数字空间。
- 访客来认识一个具体的人，并浏览他真实玩过、读过、听过的内容。
- “真实记录”比视觉填充重要；没有资料就隐藏或诚实说明，不编造经历、评价或统计。
- 独特机制是：**把一个人的当下与长期兴趣编成一份可持续生长的公开索引**。
- 主要使用场景是陌生访客在手机或桌面上随意翻看，不是购买服务、创建账户或操作复杂工具。

### Reference Translation

| Reference | Transferable principle | Translation for this site | Intentionally not copied |
| --- | --- | --- | --- |
| [FOLLOW.ART](https://follow.art/) | 一张身份卡承载一个人的公开实践；数字、目录和重复媒体形成连续系统 | Hero 使用“个人索引卡”，所有收藏沿同一编目逻辑展开 | 商业会员、定价、艺术家平台文案、品牌资产 |
| [Tomoya Okada v6](https://v6.usestate.org/) | 超大版本文字与单个物件形成极强首屏；括号式标签贯穿导航 | 使用克制的双语互动问候、`（首页）` 等括号标签与当前位置编号 | `VER.6`、吊牌造型、WebGL、滚动劫持及原站加载器造型 |
| [Analogue](https://madebyanalogue.co.uk/) | 严谨网格中加入玩心；描边标签、按钮反馈、强烈媒体段落 | 彩色衬纸、硬边按钮、会在 hover / focus 时归正的身份 Folio | 工作室文案、品牌字体、小游戏、无限跑马灯、商业客户展示 |
| [Sena Doi](https://doisena.jp/) | 清楚的作品索引、真实数量、媒体接触表、轮廓章节字和旋转名片 | 收藏馆以真实媒体比例组织接触表；章节用英文轮廓字 + 中文实心字 | 插画作品、星标系统、品牌 Logo、原站版式的一比一复刻 |

2026-08-12 已在桌面浏览器实测四站的刷新瞬间、进入中段与稳定首屏；FOLLOW.ART 的橙色加载符号、满宽标题与前景卡片层次可正常观察。本项目只翻译可见的进入节奏与构图原则，不复制品牌资产、配色或商业文案。

### Interaction Responsibility Map

四个参考站不仅影响身份卡和排版，也共同约束整套体验；每一种动作只由一个主要参考承担，避免做成拼贴：

| Experience layer | Lead reference | Translation for this site |
| --- | --- | --- |
| Opening, navigation and route state | Tomoya Okada v6 + Analogue | 首次硬加载用原创 `OPEN` 索引层建立进入节奏；括号式当前项、页码位置、顶部滚动进度与短促纸页揭开承担后续状态反馈 |
| Button and link feedback | Analogue | 描边或实心矩形按钮，hover 时底色横向扫入、箭头位移，按下时 `translateY(1px)` / `scale(.98)`；不复制黑色投影造型 |
| Media browsing | Analogue + Sena Doi | 图像在固定裁切窗内轻微放大；首页收藏预览提供明确的上一项 / 下一项按钮、当前分类和顺序编号，不自动播放 |
| Counts and micro-widgets | Sena Doi | 分类名旁显示真实数量；导航页码、当前章节、收藏切换状态和目录细线共同承担微型状态反馈，不创造星标或收藏状态 |
| Identity and repeated actions | FOLLOW.ART | 一个集中身份 Folio、一套重复使用的进入/继续箭头动作；资料不会散落成多张重复卡片 |
| Mobile adaptation | Tomoya + Sena Doi | 全屏不透明菜单、巨大单列链接、顶部 CLOSE、底部页码与主题开关；桌面错位在移动端归为稳定单列 |
| Footer closure | Analogue + Sena Doi | 超大联系标题、明确邮箱和站点索引，形成完整封底；不加入订阅表单或无真实用途的社交按钮 |

实现采用原生 CSS、`IntersectionObserver` 与浏览器 View Transition API 的渐进增强；不照搬 GSAP、Swup、WebGL、声音、小游戏或滚动平滑库。

### Visual Mechanism

全站只使用一套机制，不为每个页面发明新主题：

1. **Opening Gate**：首次硬加载先出现 `OPEN`、真实资源就绪进度和站点三段索引；结束后再启动首屏编排，不在内部路由重复播放。
2. **Index Line**：导航、章节起点和页尾都出现“当前位置 / 总条目 / 更新时间”式细线索引，顶部 2px 钴蓝线持续反馈滚动位置。
3. **Identity Folio**：人物事实放进一张可翻阅但不伪装成真实证件的索引卡；头像是其中一格，不是独立悬浮卡片。
4. **Contact Sheet**：游戏、书籍和音乐保持自身比例，以接触表而不是通用圆角卡片展示。
5. **Color Slip**：每个主要场景最多露出一张彩色衬纸，颜色只标记章节，不承载全部背景。
6. **Editorial Marker**：括号、小号编号、箭头和轮廓英文词作为边注；中文内容始终是主角。

### Non-negotiable Hero Rules

- `scrollY = 0` 时互动问候完整隐藏；除共享导航外，页面只显示居中的完整昵称和轻量滚动提示，不显示眉题、边栏、索引封面、头像、人物事实或残缺文字。
- `HI,` 与 `你好。` 只能使用纵向遮罩逐行显现；禁止横向裁切字母、汉字或短语。
- 头像不得作为首页初始主体；它只存在于身份 Folio 内，并在 Folio 已进入后从下向上裁切出现。
- 首屏同一时刻只有一个主重心：初始是完整昵称，标题阶段是互动问候，身份阶段是 Folio。
- 所有参考转译必须区分原站事实与本站设计；Tomoya 的吊牌只提供“单一物件与标题的关系”，不等于人物肖像。
- 当前只验收桌面；移动端保持现状且完全暂停专项开发。

### Design Dials

| Dimension | Value | Meaning |
| --- | ---: | --- |
| Design variance | 8 / 10 | 大字、错位和媒体比例明显，但 DOM 顺序始终清楚 |
| Motion intensity | 6 / 10 | 有首次打开、首屏编排、滚动显影和媒体反馈，无滚动劫持或大面积持续炫技 |
| Visual density | 6 / 10 | 首屏克制，收藏区明显变密；空白与密集段落交替 |
| Color intensity | 5 / 10 | 以墨色和纸色稳定全局，彩色只作为章节衬纸和状态 |

### Page Composition

#### 首页 `/`

1. **Cover / 首屏**：桌面未滚动时只在大块纯白留白中居中显示完整昵称，底部保留一条小号滚动提示；不再放置索引封面、眉题、竖向边栏或人物事实。自然滚动让昵称退场，先后从下向上揭开钴蓝 `HI,` 与错位的黑色 `你好。`，再显示“我是旺角西多士。再往下一点，先看看现在的我。”；问候阶段不出现动作入口，进入身份 Folio 阶段后才显示入口。头像只在 Folio 进入后于卡片内部从下向上显现并轻微缩放归位，随后展开事实台账并进入收藏区。点击控制驱动同一原生滚动进度，页面不监听或改写 `wheel`。
2. **Collection feature / 收藏主场**：全页唯一深色场景。先用纵向纸页遮罩揭开 `SHELF` 与中文陈述，再出现状态线，最后让游戏横幅、书封和音乐封面从裁切窗内分批显现；桌面 hover / focus 和上一项 / 下一项按钮共同更新当前分类状态。收藏区在封面四阶段完成后出现。
3. **Statement / 自述**：左侧轮廓字 `ABOUT` 从下向上抽出，右侧完整自述随后以轻微失焦到清晰的故事块进入；两者错峰但仍是一段连续阅读。
4. **Open pages / 待写页**：章节标题先揭开，三条带明确 `PLACEHOLDER` 标签的编辑提问以连续台账行进行有上限的错峰进入；不冒充本人事实，以后直接替换标题与正文。
5. **Recent index / 最近记录**：回到明亮纸面，标题先揭开，真实记录按 01–04 台账行错峰进入；不做卡片列表。
6. **Closing / 联系**：共享页尾使用超大 `SAY HELLO` 轮廓字、自然中文邀请、公开邮箱和站点索引，像年刊封底。

#### 关于我 `/about`

- 首屏使用一句完整自我主张和事实索引，不重复首页布局。
- 人物头像与长文组成 5/7 编辑跨页；头像下保留“当前暂用柴犬头像”的真实说明。
- 三段自我理解以宽窄不同的文本栏和连续编号展开，不使用三张同款卡片。
- 联系方式是页尾索引的一部分，不改造成商业 CTA。

#### 收藏馆 `/shelf`

- 首屏用 `22 条公开记录`、游戏/书籍/音乐数量与真实累计时长建立目录感。
- 游戏是一列横向接触表；书籍是纵向封面书架；音乐是方形封面矩阵。三种媒体不套统一尺寸。
- 每一类都由大号轮廓英文词、中文标题、真实数量、一个箭头入口和一张局部彩色衬纸组成。
- 1440×1000 下 `BOOKS` 与 `MUSIC` 轮廓章节标记统一为 86.4px；状态徽记与进入链接各占一行，避免挤成一组按钮。
- 书籍标题保留两行的编辑节奏，音乐标题保持一行，防止不同媒体的文字密度趋同。
- 最近更新用连续编号台账收束；电影只保留一次非交互说明，等有真实内容后再开放。

#### 分类页 `/shelf/games`、`/shelf/books`、`/shelf/music`

- 沿用同一 Index Line、章节字和编号规则。
- 游戏：累计时长是大号数字；16:9 横幅交错编排；两条真实 Steam 评测集中到一个深色尾章。
- 书籍：三列 / 两列 / 单列封面书架；封面保持 `25 / 36`；状态像馆藏章但只显示本人确认信息。
- 音乐：六张封面形成 3×2 或 6 格折页；下方 01–06 曲目台账与封面一一对应。
- 经历和电影页在真实内容不足时不进入正式导航，保留现有路由和诚实说明。

## 2. Color Palette & Roles

~~~css
:root {
  color-scheme: light;

  /* Core paper and ink */
  --canvas: #ffffff;
  --paper: #ffffff;
  --paper-muted: #f1f1ee;
  --ink: #111111;
  --ink-soft: #4f4f4c;
  --ink-muted: #6b6b66;
  --rule: #c7c7c2;
  --rule-strong: #111111;

  /* Registration colors */
  --cobalt: #4058b8;
  --cobalt-soft: #dce2f3;
  --coral: #e76a4b;
  --coral-soft: #f3d1c4;
  --sun: #e5c64f;
  --sun-soft: #f1e5aa;
  --mint: #acd0b5;
  --mint-soft: #dbe9dd;

  /* Inverse scene */
  --inverse: #17191b;
  --inverse-raised: #282a2d;
  --on-inverse: #ffffff;
  --on-inverse-muted: #c9c9c5;

  /* Semantic */
  --focus: #4058b8;
  --success: #287558;
  --warning: #93661c;
  --error: #ad443f;

  /* RGB helpers */
  --canvas-rgb: 255, 255, 255;
  --paper-rgb: 255, 255, 255;
  --ink-rgb: 17, 17, 17;
  --cobalt-rgb: 64, 88, 184;

  /* Shape, line and motion */
  --radius-xs: 0.25rem;
  --radius-sm: 0.5rem;
  --line: 1px;
  --line-strong: 1.5px;
  --offset-sm: 0.375rem;
  --offset-md: 0.75rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 160ms;
  --duration-medium: 360ms;
  --duration-reveal: 760ms;
}

html[data-theme='dark'] {
  color-scheme: dark;

  --canvas: #11110f;
  --paper: #1b1a17;
  --paper-muted: #282621;
  --ink: #f3eee4;
  --ink-soft: #c3bcaf;
  --ink-muted: #948d82;
  --rule: #48453e;
  --rule-strong: #f3eee4;

  --cobalt: #92a5ff;
  --cobalt-soft: #293052;
  --coral: #ff8467;
  --coral-soft: #492a22;
  --sun: #efd66f;
  --sun-soft: #40391f;
  --mint: #9bc7a7;
  --mint-soft: #24362a;

  --inverse: #eee8dc;
  --inverse-raised: #fffaf0;
  --on-inverse: #151515;
  --on-inverse-muted: #5f5a52;

  --focus: #92a5ff;
  --canvas-rgb: 17, 17, 15;
  --paper-rgb: 27, 26, 23;
  --ink-rgb: 243, 238, 228;
  --cobalt-rgb: 146, 165, 255;
}
~~~

### Color Rules

- 亮色主题采用约 **65% pure white / 20% neutral gray / 10% media color / 5% registration color** 的分配；基础画布和主纸都是真正的白色，不再回到米黄纸色。
- `cobalt` 是交互和定位主色；`coral` 标记人物与当下；`sun` 标记书籍；`mint` 标记音乐。一个视口最多出现两种登记色。
- 彩色优先作为衬纸、细线、编号圆点或状态章，不作为大段正文底色。
- 每个长页面最多一次整段 `inverse`；暗色模式中这一次反转为明亮纸面，形成等价节奏。
- 真实游戏画面、书封和音乐封面是主要色彩来源；不对图片统一加色罩。
- 所有实现颜色必须引用变量；组件内部禁止硬编码 hex。
- 不使用高饱和渐变文字、霓虹外发光或紫蓝 AI 渐变。

### Background Material

- 页面以纯白为主但不是无层次长卷：Hero 通过纸面边界、横向规则线、局部衬纸和下一个深色章节的提前露出建立层次。
- 不使用铺满页面的两轴装饰网格；登记线只是一到两条与标题或事实台账对齐的方向线。
- 纸张层次靠 1–1.5px 实线、6–12px 硬偏移和彩色衬纸建立，不靠大面积模糊阴影。
- 每个 section 最多一个主要纸面或衬纸；禁止多重伪元素堆成“卡片后还有卡片”。
- 背景变化必须对应内容语义：人物 = coral，游戏 = cobalt，书籍 = sun，音乐 = mint，最近记录 = neutral paper。

## 3. Typography Rules

### Font Stack

~~~css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;600;700;800;900&display=swap');

:root {
  --font-cn: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  --font-latin: 'Archivo', 'Noto Sans SC', system-ui, sans-serif;
}

body {
  font-family: var(--font-cn);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: 0.005em;
}
~~~

| Role | Font | Size | Weight | Line Height | Letter Spacing |
| --- | --- | --- | ---: | ---: | ---: |
| Hero Chinese H1 | Noto Sans SC | `clamp(3.5rem, 9.5vw, 9rem)` | 800 | 0.96 | -0.06em |
| Hero Latin marker | Archivo | `clamp(3.75rem, 11vw, 10rem)` | 800 | 0.88 | -0.07em |
| Section Chinese H2 | Noto Sans SC | `clamp(2rem, 4.6vw, 4.5rem)` | 700 | 1.05 | -0.045em |
| Section outline marker | Archivo | `clamp(3rem, 7vw, 7rem)` | 800 | 0.9 | -0.055em |
| H3 | Noto Sans SC | `clamp(1.25rem, 2.2vw, 2rem)` | 650 | 1.2 | -0.025em |
| Body large | Noto Sans SC | `clamp(1.125rem, 1.6vw, 1.375rem)` | 400 | 1.75 | 0 |
| Body | Noto Sans SC | `clamp(1rem, 1.05vw, 1.125rem)` | 400 | 1.7 | 0.005em |
| Index / nav | Archivo + Noto Sans SC | `0.75rem–0.875rem` | 650 | 1.25 | 0.04em |
| Data / count | Archivo | `0.8125rem–1rem` | 600 | 1.25 | -0.01em |

### Typography Rules

- 中文 Hero 用两到三行建立轮廓，桌面单行不超过 9 个汉字；移动端不超过 7 个汉字。
- 中文是内容主角；英文只作为 `ABOUT`、`SHELF`、`INDEX` 等章节标记，不制造双语重复正文。
- 英文轮廓字只出现于章节开头或页尾，一屏最多一个；正文绝不描边。
- 数字、编号和括号导航统一使用 Archivo，形成可识别的编目语法。
- 正文宽度控制在 34–40 个汉字；长文最大 44rem。
- 正文字号不低于 16px，辅助文本不低于 12px。
- **Never use**：Inter 作为主字体、仿手写字体作为正文、等宽终端字体作为全站语言。

### Text Decoration

- Hero H1：纯色、无渐变、无投影；允许一行落在彩色衬纸上或被细线穿过。
- 英文章节标记：允许 `-webkit-text-stroke: 1px currentColor` + 透明填充；暗色模式保持可读轮廓。
- Section H2：实心，无阴影；与编号或短横线形成组合。
- 重点短语可使用硬边底色高亮，内边距不超过 `0.08em 0.18em`，不做胶囊。
- 文本链接使用偏移下划线和箭头位移；不使用发光或渐变。

## 4. Component Stylings

### Global Focus

~~~css
:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 4px;
}
~~~

### Press Buttons

~~~css
.button {
  position: relative;
  z-index: 0;
  min-height: 2.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 0.78rem 1.05rem;
  color: var(--paper);
  background: var(--ink);
  border: var(--line-strong) solid var(--ink);
  border-radius: var(--radius-xs);
  font: 700 0.8rem/1 var(--font-latin);
  letter-spacing: 0.04em;
  text-decoration: none;
  overflow: hidden;
  isolation: isolate;
  cursor: pointer;
  transition:
    color var(--duration-fast) ease,
    transform var(--duration-fast) var(--ease-out);
}

.button::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--cobalt);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-medium) var(--ease-out);
}

.button:hover,
.button:focus-visible {
  color: var(--paper);
  transform: translateY(-1px);
}

.button:hover::before,
.button:focus-visible::before { transform: scaleX(1); }

.button:active {
  transform: translateY(1px) scale(0.98);
}

.button--paper {
  color: var(--inverse);
  background: var(--on-inverse);
  border-color: var(--on-inverse);
}

.button--paper::before { background: var(--coral); }
~~~

### Identity Folio

~~~css
.identity-folio {
  position: relative;
  z-index: 3;
  min-width: 16rem;
  color: var(--ink);
  transform: rotate(1deg);
  transition: transform var(--duration-medium) var(--ease-out);
}

.identity-folio::before,
.identity-folio::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border: var(--line-strong) solid var(--rule-strong);
  border-radius: var(--radius-sm);
}

.identity-folio::before {
  background: var(--coral-soft);
  transform: translate(-0.7rem, 0.62rem) rotate(-2.5deg);
}

.identity-folio::after {
  background: var(--cobalt-soft);
  transform: translate(0.58rem, 0.75rem) rotate(2deg);
}

.identity-folio__paper {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 0.65rem;
  padding: 1rem;
  background: var(--paper);
  border: var(--line-strong) solid var(--rule-strong);
  border-radius: var(--radius-sm);
}

.identity-folio:hover,
.identity-folio:focus-within {
  transform: rotate(0deg) translateY(-0.25rem);
}
~~~

The folio is a profile index, not an official ID. Its built stack is an opaque pure-white paper above coral and cobalt registration slips; the slips must remain visibly separate instead of blending into one generic card. It must not imitate government documents, display fake serial numbers or imply verification.

### Media Records and Contact Sheet

~~~css
.collection-panel > a,
.shelf-game-record,
.shelf-book-record,
.shelf-music-record,
.media-entry {
  display: grid;
  gap: 0.8rem;
  color: inherit;
  text-decoration: none;
}

.collection-panel__image,
.shelf-game-record__media,
.shelf-book-record__media,
.shelf-music-record__media,
.media-entry__cover {
  overflow: hidden;
  background: var(--paper-muted);
  border: var(--line-strong) solid currentColor;
  border-radius: var(--radius-xs);
}

.collection-panel img,
.shelf-game-record img,
.shelf-book-record img,
.shelf-music-record img,
.media-entry img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.001);
  transition: transform 560ms var(--ease-out);
}

.collection-panel a:hover img,
.collection-panel a:focus-visible img,
.shelf-game-record:hover img,
.shelf-game-record:focus-visible img,
.shelf-book-record:hover img,
.shelf-music-record:hover img,
.media-entry:hover img {
  transform: scale(1.035);
}

.shelf-game-record__media { aspect-ratio: 16 / 9; }
.shelf-book-record__media { aspect-ratio: 25 / 36; }
.shelf-music-record__media { aspect-ratio: 1; }
~~~

### Navigation

~~~css
.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  height: var(--header-height);
  color: var(--ink);
  background: rgba(var(--canvas-rgb), 0.94);
  border-bottom: var(--line) solid transparent;
  backdrop-filter: blur(10px);
}

.site-header__inner {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(11rem, 1fr) auto minmax(11rem, 1fr);
  align-items: center;
  gap: 1.5rem;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2.6vw, 2.8rem);
}

.desktop-nav a {
  color: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
}

.desktop-nav a > span:last-child::before,
.desktop-nav a > span:last-child::after {
  display: inline-block;
  opacity: 0;
  transition: opacity var(--duration-fast) ease, transform var(--duration-fast) ease;
}

.desktop-nav a > span:last-child::before { content: '（'; transform: translateX(0.2rem); }
.desktop-nav a > span:last-child::after { content: '）'; transform: translateX(-0.2rem); }

.desktop-nav a.active > span:last-child::before,
.desktop-nav a.active > span:last-child::after,
.desktop-nav a:hover > span:last-child::before,
.desktop-nav a:hover > span:last-child::after { opacity: 1; transform: none; }
~~~

### Directory and Recent Index Rows

~~~css
.shelf-directory {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: var(--line-strong) solid var(--rule-strong);
  border-bottom: var(--line-strong) solid var(--rule-strong);
}

.recent-item {
  display: grid;
  grid-template-columns: 3rem 7rem 8rem 1fr auto 1.5rem;
  gap: clamp(0.75rem, 1.5vw, 1.5rem);
  align-items: center;
  min-height: 7.5rem;
  border-bottom: var(--line) solid var(--rule);
  color: inherit;
  text-decoration: none;
  transition: transform var(--duration-medium) var(--ease-out), background-color var(--duration-fast) ease;
}

.recent-item:hover,
.recent-item:focus-visible { background: var(--canvas); transform: translateX(0.45rem); }
~~~

### Theme Toggle

~~~css
.theme-toggle {
  min-width: 2.75rem;
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.55rem 0.7rem;
  color: inherit;
  background: transparent;
  border: var(--line-strong) solid currentColor;
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: color var(--duration-fast) ease, background-color var(--duration-fast) ease, transform var(--duration-fast) var(--ease-out);
}

.theme-toggle:hover,
.theme-toggle:focus-visible { color: var(--canvas); background: var(--ink); transform: translateY(-1px); }
.theme-toggle:active { transform: translateY(1px) scale(0.97); }
~~~

## 5. Layout Principles

### Container and Spacing

~~~css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4.5rem;
  --space-9: 7rem;
  --space-10: 10rem;
  --space-11: 14rem;
}

.container {
  width: min(100% - 2 * clamp(1rem, 3.5vw, 3.5rem), 100rem);
  margin-inline: auto;
}

.reading-width { width: min(100%, 44rem); }
.section { padding-block: clamp(5rem, 11vw, 11rem); }

.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(0.75rem, 1.6vw, 1.75rem);
}
~~~

### Composition Rules

- 主容器上限 1600px；让大字和媒体在宽屏上保持力度，不无限拉长正文。
- 首页 Hero 由左上双语问候与右下 4 栏身份 Folio 形成阶段性交接；问候、入口与索引卡不在同一阶段争夺重心。
- 长页面使用“疏—密—疏—密—疏”节奏：大字封面 → 深色媒体接触表 → 自述 → 低密台账 → 大字封底。
- 章节起点由轮廓英文词、中文标题、真实数量和一条横线共同定义；不再为每节增加独立圆角外壳。
- 媒体接触表允许不等宽，但 DOM 顺序必须与阅读顺序一致。
- 每一屏只有一个主动作；进入分类页的箭头不与额外按钮竞争。
- 所有错位、旋转和重叠只发生在装饰衬纸或媒体外框，不改变文本可读性。

### Grid Examples

~~~css
.home-cover__copy { grid-column: 1 / span 9; grid-row: 1 / span 2; }
.identity-folio { grid-column: 9 / -1; grid-row: 2; align-self: end; }
.home-ledger { grid-column: 1 / -1; grid-row: 3; }

.home-about .outline-marker { grid-column: 1 / span 4; }
.home-about__copy { grid-column: 5 / span 7; }

.collection-panel--games { grid-column: 1 / span 6; }
.collection-panel--books { grid-column: 7 / span 3; }
.collection-panel--music { grid-column: 10 / -1; }

.about-portrait-story__media { grid-column: 1 / span 5; }
.about-portrait-story__copy { grid-column: 7 / -1; }
~~~

## 6. Depth & Elevation

| Level | Treatment | Use |
| --- | --- | --- |
| Canvas | Pure white without decorative grid | Page background and generous gutters |
| Rule | 1px neutral or 1.5px ink line | Structure, table rows, media frames |
| Slip | 6–12px hard offset with one registration color | Identity folio, one featured media group per scene |
| Media | Crisp frame; color comes from real covers and nearby slips | Real covers and avatar only |
| Overlay | Opaque inverse sheet in the browser top layer | Mobile navigation dialog only |

### Elevation Rules

- 默认卡片没有柔焦阴影；深度优先来自遮挡、硬偏移、比例和空白。
- 媒体图使用清晰边框，不叠加柔焦投影、渐变蒙版、玻璃和发光。
- 彩色衬纸必须露出明确边缘，不能退化成看不出用途的背景色块。
- 暗色模式主要通过纸面明度和边线分层，不用更重的阴影补偿。
- 层级固定：内容 0，装饰衬纸 -1，粘性导航 30，移动菜单使用原生 `dialog` 顶层，跳过链接 100。

## 7. Animation & Interaction

**Motion philosophy**: 像翻开、对齐和抽出一份年刊；动作短、硬朗、可理解，不漂浮。
**Tier**: L2
**Dependencies**: CSS + 原生 `IntersectionObserver`；支持时由 View Transition API 渐进增强内部路由

### Required Motion Roles

| Role | Treatment | Location |
| --- | --- | --- |
| First-load opener | 等待 `window.load` 与 `document.fonts.ready`，最短约 980ms、最长 1850ms；`OPEN`、进度线与三段索引完成后向上裁切退出 | 每次硬加载；内部路由不重复 |
| Hero anchor + greeting | 加载层退出后只留下完整昵称与滚动提示；滚动先让昵称退出，再用纵向遮罩依次显现 `HI,` 与 `你好。`，问候完成后才显示简短自我介绍，动作入口延后到 Folio 阶段 | 首页首屏 |
| Progressive cover | 约 320svh 的桌面自然滚动范围对应四个离散阶段；滚动只读取页面位置，点击按钮平滑前往同一阶段，不劫持滚轮、不强制翻页 | 首页桌面封面 |
| Editorial heading | 标题与下方规则线像纸页一起从下向上揭开，不逐字拆分 | 收藏、待写页、最近记录章节起点 |
| Media window | 游戏、书籍、音乐面板保持真实比例，从裁切窗内自下而上显现，三组延迟总量不超过 240ms | 首页收藏预览 |
| Story split | 竖向 `ABOUT` 章节字先抽出，正文以轻微失焦到清晰的遮罩进入 | 首页自述 |
| Ledger row | 整行从下向上揭开，连续记录使用有上限的兄弟错峰 | 待写页、最近记录 |
| Element feedback | 箭头横移、图片轻微缩放、按钮抬起与按下反馈 | 所有可交互元素 |
| Interactive component | Identity Folio 从轻微错位归正；hover/focus 只旋正 1.25° | 首页人物卡 |
| Route transition | View Transition 使用 180ms 淡出 + 420ms 纸页揭开；不支持时回退到 520ms `.route-stage` 入场，减少动态时即时切换 | 全部内部路由 |
| Scroll progress | 粘性导航底部 2px 钴蓝线读取原生滚动比例；不修改滚动行为、不承担必要信息 | 全站长页面 |
| Menu transition | 不透明菜单以 440ms 裁切揭开；原生 `dialog` 管理焦点、Escape 与关闭 | 移动端导航 |
| Media browse | 上一项/下一项更新本地分类索引；三类真实媒体仍在场，当前项在桌面轻微抬起并提高不透明度，按钮始终可见 | 首页收藏预览 |

### Reveal System

~~~css
.js .reveal {
  opacity: 0;
  transform: translateY(1rem);
  transition:
    opacity var(--duration-reveal) var(--ease-out),
    transform var(--duration-reveal) var(--ease-out);
  transition-delay: var(--reveal-delay, 0ms);
}

.js .reveal--line {
  clip-path: inset(0 0 100% 0);
  transform: translateY(1.5rem);
}

.js .reveal--editorial,
.js .reveal--row,
.js .reveal--story {
  clip-path: inset(0 0 100% 0);
}

.js .reveal--media,
.js .reveal--marker {
  clip-path: inset(100% 0 0);
}

.js .reveal--story { filter: blur(5px); }

.js .reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
  clip-path: inset(0);
  filter: blur(0);
}

~~~

~~~tsx
// Reveal.tsx：每个实例只观察自己；delay 与语义 variant 由页面显式传入。
const observer = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) return;
    setIsVisible(true);
    observer.disconnect();
  },
  { threshold: 0.04, rootMargin: '0px 0px -4% 0px' },
);

// 原生滚动位置检查与 observer 共用同一个 reveal()，覆盖程序化章节定位。
window.addEventListener('scroll', requestCheck, { passive: true });

// 减少动态、不支持 IntersectionObserver，或元素已在视口时直接显示。
if (reduceMotion || !('IntersectionObserver' in window) || alreadyInViewport) {
  setIsVisible(true);
}
~~~

### Section Index State

~~~tsx
// SiteLayout.tsx
useEffect(() => {
  const sections = Array.from(document.querySelectorAll('[data-index-section]'));
  const observer = new IntersectionObserver(
    (entries) => {
      const current = entries.find((entry) => entry.isIntersecting);
      if (current) setSectionIndex(current.target.dataset.indexSection ?? '01');
    },
    { rootMargin: '-46% 0px -46% 0px', threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
  return () => observer.disconnect();
}, [pathname]);
~~~

The index is a subtle delight, not required information. Screen-reader page structure must remain complete without it.

### Signature Moments

1. 首次硬加载先出现整屏 `OPEN` 索引；退出后只留下一个居中完整昵称。访客滚动后先收到 `HI,` / `你好。` 的双语问候，再被短句引导到个人索引卡和事实台账。
2. 首页收藏段从明亮纸面切进唯一深色接触表，先揭开章节标题，再从裁切窗内取出真实封面，形成页面色彩峰值。
3. 自述将竖向 `ABOUT` 与故事正文错峰展开；待写页和最近记录沿连续台账行逐条进入，不再共用一套淡入。
4. 收藏馆三种媒体比例在同一目录中清楚切换，章节衬纸颜色跟随分类变化。
5. 页尾超大轮廓字、带下划线的公开邮箱与站点索引形成封底，不用普通三栏 footer 草草结束。
6. 移动端打开菜单时，一张高对比索引纸覆盖页面，当前路由、页码、主题开关和 CLOSE 都在同一视野。

### Motion Budget

- 同一视口最多 6 个元素参与延迟，延迟上限 280ms。
- 首次加载器每次硬加载只播放一次；桌面渐进封面最多四个离散状态，向上滚动可自然退回前一状态；内部路由只播放纸页过渡。
- 不注册 `wheel` 监听器，不修改滚动速度，不用 section snap 或强制翻页；点击只是前往与自然滚动相同的位置。
- 阶段按钮在 DOM 中先于逐步出现的入口；键盘激活第 2 阶段后，下一次 Tab 会进入新出现的主动作。第 4 阶段进入收藏后，程序焦点同步到带 `SHELF` 标题的收藏章节。
- hover 位移不超过 8px，旋转不超过 2.5°；主要媒体缩放约 1.035–1.04，最近记录缩略图最高 1.08。
- 动画只修改 `transform`、`opacity`、`clip-path`、受控 `filter`、`color` 和 `background-color`；`filter` 只用于一次自述故事块，并在进入完成后归零。
- 不使用滚动劫持、section pin、全局自定义光标、WebGL 或移动模糊层。

### Reduced Motion

~~~css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
    scroll-behavior: auto !important;
  }

  .js .reveal,
  .js .reveal--line {
    opacity: 1;
    transform: none;
    clip-path: none;
  }

  .identity-folio,
  .identity-folio::before,
  .identity-folio::after {
    transform: none;
  }
}
~~~

## 8. Do's and Don'ts

### Do

- 用一套 Index Line、连续编号和括号导航贯穿所有路由。
- 让真实封面、游戏画面、头像和时长数据承担页面的视觉重量。
- 在大段留白和高密接触表之间制造明显节奏，而不是平均铺卡片。
- 用硬边衬纸、细线和媒体遮挡建立层次；让每一层有清楚语义。
- 中文主标题直接、巨大、有信心；英文只做索引和章节标记。
- 为 hover 提供等价的 `focus-visible`，为触摸端保留明确按压反馈。
- 明暗主题保持相同信息结构，但允许深浅反转的节奏不同。
- 无 JavaScript、图片失败和减少动态时仍完整显示必要内容。
- 空内容隐藏入口或自然说明，不以占位卡补齐网格。

### Don't

- ❌ 不把四个参考站拼贴成四套互不相关的 section 风格。
- ❌ 不复制对方的 Logo、字体文件、插画、吊牌、文案、小游戏或品牌专属动效。
- ❌ 不继续使用大面积纯色 section 作为唯一层次来源。
- ❌ 不为每一段内容增加白色圆角卡、阴影和双层伪元素。
- ❌ 不做四张等宽的收藏分类卡或典型 Bento dashboard。
- ❌ 不使用玻璃拟态、渐变文字、外发光、3D 倾斜和鼠标拖尾。
- ❌ 不把 Hero 做成居中标题、两颗胶囊按钮和装饰截图。
- ❌ 不使用任意版本号、虚假证件号、评分、播放量、收藏日期或未经确认的身份信息。
- ❌ 不让英语大字压过中文内容，也不重复翻译每段文案。
- ❌ 不让描边字、旋转和错位影响正文阅读或移动端触摸。
- ❌ 不依赖 hover 才显示名称、数量、时长或入口。
- ❌ 不引入 GSAP、Lenis、Framer Motion、Three.js 或新组件库来完成本次视觉重构。
- ❌ 不做滚动劫持、强制横向滚动、自动播放媒体或连续循环背景。

## 9. Responsive Behavior

当前交付范围只包含 1440px 桌面网页端。按用户最新要求，移动端开发、截图、验收和专项修复完全暂停；桌面新机制只以断点条件隔离，不能借本轮继续调整手机视觉。

### Breakpoints

| Name | Width | Key changes |
| --- | --- | --- |
| Wide desktop | > 1100px | 12 栏；完整大字、错位衬纸、不等宽接触表和桌面导航 |
| Tablet / laptop | 768–1100px | 隐藏桌面导航并启用菜单；减少大字尺寸与重叠；媒体保持 2–3 列 |
| Mobile | < 768px | 单列阅读；Hero 标题后紧接索引卡；分类接触表最多两列 |
| Small mobile | < 430px | 进一步收紧 padding；按钮可全宽；章节英文标记不超过视口 |

### Responsive CSS

~~~css
@media (max-width: 1100px) {
  .site-header__inner { grid-template-columns: 1fr auto; }
  .desktop-nav { display: none; }
  .menu-toggle { display: inline-flex; }
  .site-progress { display: none; }
  .home-cover__copy { grid-column: 1 / span 8; }
  .identity-folio { grid-column: 8 / -1; }
}

@media (max-width: 767px) {
  .container { width: min(calc(100% - 2rem), 100rem); }
  .grid-12 { grid-template-columns: 1fr; gap: 1.5rem; }
  .home-cover__inner { min-height: auto; display: flex; flex-direction: column; }
  .home-cover__copy { display: contents; }
  .identity-folio { transform: none; }
  .collection-contact-sheet { grid-template-columns: repeat(2, 1fr); }
  .shelf-directory,
  .shelf-game-sheet { grid-template-columns: 1fr; }
  .shelf-book-sheet,
  .shelf-music-sheet { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 429px) {
  .container { width: min(100% - 1.5rem, 100rem); }
  .button { width: 100%; }
}
~~~

### Mobile Rules

- 移动端不是桌面缩小版：标题 → 索引卡 → 事实 → 主动作严格单列，不保留互相遮挡。
- 游戏横幅始终横向；书籍始终纵向；音乐始终方形。不能为了两列而把比例裁成统一方块。
- 首页收藏接触表最多两列；书籍详情页在 390px 下单列，避免 428px 源封面被过度放大或压缩。
- Mobile menu 是不透明纸面抽屉；可由 `Escape` 关闭，打开时锁定背景滚动并管理焦点。
- 导航、菜单和主题开关保留清楚的触摸区域；更严格的 44×44px 全站触摸目标审计留到后续手机端专项精修。
- 移动端关闭装饰性错位动画与任何视差；彩色衬纸保留为静态层次。
- 暗色模式、无 JS 和 `prefers-reduced-motion` 下的内容顺序与明亮桌面端一致。

## Implementation Acceptance

- 最终 1440×1000 桌面 finish review 必须为 PASS；当前 built baseline 已满足该结论。
- 首页首屏能在 30 秒内回答“我是谁、这里记录什么、可以从哪里继续看”。
- 导航、Hero、章节标题、媒体目录和页尾都能识别为同一个 Living Index 系统。
- 页面层次来自排版、密度、媒体比例、规则线和衬纸，而不是连续纯色背景或重复卡片。
- 四个参考站的设计原则可辨认，但不存在一比一复制的品牌资产、结构或动效。
- 首页、关于页、收藏馆、游戏、书籍和音乐页共享 Token 与组件语法，同时保留各媒体真实比例。
- 当前桌面验收覆盖 1440px 的首页、关于我、收藏馆、游戏、书籍和音乐页；这些路由不得横向溢出。
- 交付前通过 TypeScript 检查与生产构建，不以开发服务器可见代替工程验收。
- 暗色模式与减少动态仍属于桌面验收；移动端开发和验收不属于当前阶段，恢复时间由用户另行确认。
- 图片有稳定尺寸与失败回退；动画不制造布局偏移。
- 不新增运行时依赖，不修改真实内容，不公开没有证据的个人事实。
