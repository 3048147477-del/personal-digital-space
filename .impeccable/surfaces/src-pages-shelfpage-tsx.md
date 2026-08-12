---
version: 1
slug: "src-pages-shelfpage-tsx"
primary_target: "src/pages/ShelfPage.tsx"
related_targets: ["src/styles.css","src/components/RecentCollectionList.tsx","src/components/SiteLayout.tsx"]
---

# 收藏馆 V3 Surface Brief

- **Route:** `/shelf`
- **Mode:** Experience
- **Surface job:** 把游戏、书籍和音乐作为同一份个人索引的三种真实媒体记录，让访客清楚进入分类页。
- **Primary actions:** 进入 `/shelf/games`、`/shelf/books`、`/shelf/music`；媒体和文字入口均可键盘访问。
- **Proof:** 4 款游戏、12 本书、6 首音乐、22 条公开记录、2,434.2 小时及对应真实封面和状态。
- **Direction:** Living Index；延续批准的 B 构图语法。收藏馆是展开后的目录页：大号标题与统计开场，游戏横幅、书籍竖封、音乐方封按三种比例连续编目。
- **Memorable moment:** 三类媒体在同一页面依次改变密度与色纸角色——钴蓝游戏、日光黄书籍、薄荷音乐——同时保持一套细线、编号、括号和箭头。
- **Constraints:** 不虚构评分、状态或日期；电影无真实记录前没有入口；不新增依赖；移动端顺序固定且无横向溢出。
- **Unresolved:** 无；V3 替换旧 Quiet Reveal 方向。

## Interaction Inventory

- 顶部显示括号导航与当前页编号；移动端使用焦点受控的全屏目录。
- 三个媒体章节都有真实数量、连续编号和明确的进入箭头；所有关键信息常显。
- 游戏、书籍、音乐图像保持 16:9、25:36、1:1，hover/focus 只做轻微裁切变化。
- 章节预览使用显式上一项/下一项或可见顺序，不自动轮播，不制造收藏/喜欢状态。
- 按钮和链接共享横向填充、箭头位移和按下反馈；键盘与触摸反馈等价。
- 最近记录以细线台账结束；电影仅诚实说明，不出现空入口。
