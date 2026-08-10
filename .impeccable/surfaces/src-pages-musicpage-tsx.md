---
version: 1
slug: "src-pages-musicpage-tsx"
primary_target: "src/pages/MusicPage.tsx"
related_targets: ["src/App.tsx","src/styles.css","src/data/content.ts"]
---

# 音乐页 V2 Surface Brief

- **Scope:** `/shelf/music` 整页重构；不改变全站视觉系统，不修改游戏页或音乐数据模型。
- **Visitor mode:** Experience。
- **Audience / job:** 对旺角西多士感兴趣的访客；在一屏内看见 2025 年度歌单的 6 首真实记录，并能继续逐条浏览或打开网易云。
- **Actions:** 打开单曲网易云页面、打开公开网易云主页、返回收藏馆。
- **Proof / content:** 6 首真实单曲、5 位音乐人、6 张真实封面、统一的“收录在我的 2025 年度歌单”来源说明。
- **Constraints:** 不托管或播放音频；不编造播放次数、排名、类型、感想或偏好；远程封面失效时保留文字与入口；移动端与暗黑模式等价。
- **Direction contract:** 延续 Quiet Reveal，采用“年度歌单折页”；第一视口用平面六格风琴折同时呈现全部封面，第二段将同一编号展开为可访问的逐条索引，不使用通用卡片网格。
- **Memorable moment:** 标题左窄、六格封面右宽，六条细折线将真实封面连成一张被摊开的年度内页。
- **Approved comp:** `.impeccable/mocks/music-comp-2.png`。
- **Concept seed:** `a9e52f2e`，grounded structure 4。
- **Unresolved:** 等待用户审阅实现后的具体密度与封面顺序；不影响首版实现。

## Approved-comp inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Header | 复用现有站点导航与主题切换 | Existing React/CSS |
| Hero headline | 左侧窄列，桌面端最多三行，移动端自然换行 | Semantic HTML/CSS |
| Six-panel foldout | 右侧一排 6 个等分方形封面，细竖线和编号形成折页；移动端改为 3×2 | Semantic links + existing raster covers + CSS Grid |
| Track ledger | 01–06 与折页一一对应；封面、标题、音乐人、类型、网易云动作清楚可扫读 | Semantic list/links + CSS Grid |
| Corner / lines | 使用既有中等图片圆角、1px 边线、克制图片阴影 | Existing tokens |
| Motion | 折页一次错峰显影；列表沿用 Reveal；不做自动播放或持续动画 | Existing Reveal + CSS transforms/opacity |
| Final actions | 网易云公开主页与返回收藏馆 | Semantic links |
