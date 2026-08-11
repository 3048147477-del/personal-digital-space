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

## 交互与体验

- 明暗主题跟随系统并允许手动切换，选择保存在本地。
- 动效使用 CSS + 原生 `IntersectionObserver`，不引入 GSAP、Framer Motion、Lenis、WebGL 或滚动劫持。
- 必要信息不依赖 hover 或动画；键盘可访问主要导航与链接。
- 触摸目标至少 44×44px，并完整支持 `prefers-reduced-motion`。
- 图片使用稳定尺寸、异步解码与按需懒加载，避免布局跳动。

## 安全与隐私

- 客户端页面不能直接读取网易云或微信读书的登录 Cookie。
- 收藏同步只读取用户明确提供的公开链接或本地导入文件。
- 不把密码、Cookie、Token、私密账号数据写进源码、JSON、Git 或长期上下文。
- 对外部 URL 使用来源白名单、字段校验、体积/超时限制和重复检查。

## 常用验证

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd run content:sync:test
npm.cmd run content:sync -- --dry-run <公开链接>
```

涉及 UI 的修改还需至少检查桌面端、390px 移动端、明暗主题、键盘路径和浏览器控制台错误。

## 依赖与变更规则

- 先尝试现有能力与平台原生 API；没有明确收益时不新增依赖。
- 重大技术修改前说明原因、改动文件与影响范围。
- 不因某个 skill 推荐 Tailwind、Framer Motion 等工具就自动改变技术栈。
- 部署、数据库、登录或第三方授权属于新的明确目标，需要单独规划。
