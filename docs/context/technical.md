# 技术与工程基线

> 仅在任务涉及代码、依赖、数据流、构建、同步或部署时读取。

## 技术栈

- React 19 + Vite 8 + TypeScript 7。
- 样式使用原生 CSS 与 CSS 变量；不默认引入 Tailwind、组件库或 CSS-in-JS。
- 依赖保持精简；当前业务运行时依赖只有 `react` 与 `react-dom`。
- 首版是静态前端，不接 CMS、数据库、账号系统或常驻后端。

## 路由与页面

- 使用项目内基于浏览器 History API 的轻量路由层，不使用 React Router。
- 支持干净 URL、前进后退、活动导航和 404。
- 已保留全部规划路由；没有真实内容的路由可以存在，但不进入主导航和推荐入口。

## 数据流

- `src/types.ts` 定义内容模型。
- `src/data/content.ts` 组合个人资料、游戏及收藏数据，页面只从统一导出读取。
- `src/data/library.json` 保存可持续新增的书籍与音乐数据。
- 最近记录、数量和总时长必须从同一数据源计算，不能维护多份手写统计。
- 本地同步脚本位于 `scripts/content-sync.mjs`，测试位于 `scripts/content-sync.test.mjs`，使用说明见 `CONTENT_SYNC.md`。
- 同步脚本支持网易云公开单曲、公开页面可暴露曲目的歌单、微信读书公开分享页和本地 JSON 文件；写入前默认需要终端确认。
- 网易云公开单曲与重复/新增 dry-run 已用真实页面验证；微信读书在没有用户真实分享链接前以公开字段契约和本地测试样例验证，缺字段时转为 JSON 导入。
- 项目级 `.agents/skills/weread` 来自腾讯官方 `Tencent/WeChatReading`，当前版本 1.0.4；它通过官方 Agent API Gateway 读取书架、封面和阅读字段。
- 微信读书授权只使用本机用户环境变量 `WEREAD_API_KEY`。密钥不写入 `.env`、源码、JSON、Git 或长期上下文；调用结果先过滤 `secret == 0` 的公开书籍，再进入本站预览确认流程。
- 官方书架字段可以作为候选证据，但本站的“在读 / 读完 / 想读”仍需本人确认后才能写入 `src/data/library.json`。

## 交互与体验

- 明暗主题跟随系统并允许手动切换，选择保存在本地。
- 动效使用 CSS + 原生 `IntersectionObserver`，不引入 GSAP、Framer Motion、Lenis、WebGL 或滚动劫持。`SiteIntro` 在每次硬加载时等待页面与字体就绪，以 980–1850ms 的有上限进度序列退出；内部路由继续使用 View Transition 渐进增强，不重复加载层。
- `SiteLayout` 用原生滚动事件和 `requestAnimationFrame` 更新 `--scroll-progress`，只驱动导航底部 2px 进度线，不改变滚动位置或触发 React 高频内容渲染。
- 首页桌面封面由 `HomePage` 读取 `scrollY` 并通过 `requestAnimationFrame` 驱动两层进度：约前 14% 让居中的完整昵称锚点退出，约 8%–38% 连续写入 `HI,` 与 `你好。` 的纵向 `clip-path`、透明度与轻微纵向位移，之后映射为 0–3 四个离散内容阶段。阶段 1 只显示双语问候和简短自我介绍，阶段 2 才显示动作入口与身份 Folio，阶段 3 展开事实台账。头像只在 Folio 已进入后于卡片内部以纵向 `clip-path` 和轻微缩放显现。点击控制只调用原生 `scrollTo` 前往相同阈值。实现不注册 `wheel`、不使用 scroll snap、不修改滚动速度，减少动态时取消长滚动舞台并直接显示必要信息。
- 首页下方继续使用同一个 `Reveal` 基元，但按内容职责区分 `editorial`、`media`、`marker`、`story` 与 `row`：收藏标题、媒体窗、自述章节字、正文故事块和连续台账不会再套同一种淡入。每个实例以 `IntersectionObserver` 为主，并用只读滚动位置检查兜底程序化定位；显现后立即解绑，不形成持续监听负担。
- 阶段控制在 DOM 中位于渐进内容之前，确保展开后 Tab 顺序进入新出现的主动作；最终进入收藏时通过 `ref` 将焦点移交给带 `aria-labelledby="home-shelf-title"` 的收藏 `section`。
- 必要信息不依赖 hover 或动画；键盘可访问主要导航与链接。
- 触摸目标至少 44×44px，并完整支持 `prefers-reduced-motion`。
- 图片使用稳定尺寸、异步解码与按需懒加载，避免布局跳动。
- 微信读书封面使用当前可访问的最高公开 `t9` 规格（约 428px 宽）；书籍页将显示宽度限制为 18rem，并按 3 / 2 / 1 列响应式收敛，避免低分辨率图片被半屏放大。

## 安全与隐私

- 客户端页面不能直接读取网易云或微信读书的登录 Cookie。
- 收藏同步只读取用户明确提供的公开链接、本地导入文件，或通过腾讯官方微信读书 API Key 返回且标记为公开的书架条目。
- 不把密码、Cookie、Token、私密账号数据写进源码、JSON、Git 或长期上下文。
- 对外部 URL 使用来源白名单、字段校验、体积/超时限制和重复检查。

## 常用验证

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd run build:pages
npm.cmd run content:sync:test
npm.cmd run content:sync -- --dry-run <公开链接>
```

当前 UI 阶段只检查 1440px 桌面端、桌面明暗主题、键盘路径、减少动态和浏览器控制台错误。按用户最新要求，移动端开发与验收完全暂停；不得把 390px 检查作为当前任务的默认步骤，直到用户明确恢复。

## 部署

- 生产站使用 GitHub Pages，地址为 `https://3048147477-del.github.io/personal-digital-space/`，发布源为 `gh-pages` 分支根目录，强制 HTTPS。
- `vite.config.ts` 只在 `github-pages` mode 下使用 `/personal-digital-space/` base；本地开发和普通生产构建仍使用根路径。
- `src/router.tsx` 在浏览器地址中保留 Pages 项目前缀，在应用内部继续使用 `/about`、`/shelf` 等原有路由键。
- `npm.cmd run build:pages` 通过 `scripts/prepare-pages.mjs` 为正式内页生成静态入口与 `404.html`，确保直接访问或刷新内页返回可加载的应用入口。
- 发布产物只进入 `gh-pages`，源码与长期文档保存在 `main`；不得把 `dist` 加入源码分支。

## 依赖与变更规则

- 先尝试现有能力与平台原生 API；没有明确收益时不新增依赖。
- 重大技术修改前说明原因、改动文件与影响范围。
- 不因某个 skill 推荐 Tailwind、Framer Motion 等工具就自动改变技术栈。
- 部署、数据库、登录或第三方授权属于新的明确目标，需要单独规划。
