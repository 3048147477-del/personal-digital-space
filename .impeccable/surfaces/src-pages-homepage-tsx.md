---
version: 1
slug: "src-pages-homepage-tsx"
primary_target: "src/pages/HomePage.tsx"
related_targets: ["src/styles.css","src/components/SiteLayout.tsx","src/App.tsx"]
---

# 首页 V3 Surface Brief

- **Route:** `/`
- **Mode:** Experience
- **Audience / job:** 第一次来到网站的人，要在 30 秒内认识旺角西多士，并看见真实公开收藏而不是职业包装。
- **Primary actions:** 进入收藏馆或继续阅读关于我；所有入口保持键盘与触摸可用。
- **Proof:** 22 岁、海南文昌、学习成为 AI 训练师、4 款游戏、12 本书、6 首音乐、2,434.2 小时，以及现有头像和真实媒体。
- **Chosen direction:** Living Index / 生长索引；批准构图为 `.impeccable/mocks/home-living-index-b.png`。首页像一份当期个人年刊，超大中文封面之后立即进入事实索引和深色收藏接触表。
- **Memorable moment:** 首屏只用一个居中的完整昵称悬在大块白色留白中；自然滚动让昵称退场，先后收到 `HI,` 与 `你好。` 的双语问候，再由一句短自我介绍邀请继续向下。身份 Folio 随后进入，头像才在卡片内部从下向上裁切显现，再取出事实台账，完成后进入深色 SHELF。
- **Constraints:** 不复制参考站品牌；不编造封面、日期或身份；不新增依赖；不劫持滚轮；暗色、键盘和减少动态完整可用。移动端开发与验收按用户要求暂停。
- **Unresolved:** 无；用户已将构图选择委托给实现方，B 为正式选择。

## Direction Contract

- **THESIS:** 一份持续生长的个人索引，以人物封面和真实收藏拒绝米色卡片式个人作品集。
- **OWN-WORLD:** 纯白画布、炭黑大字、中性浅灰章节、钴蓝与珊瑚衬纸、细规则线、媒体接触表、括号导航。
- **STORY:** 先认识这个人，再看见他把时间留给了什么，最后进入完整收藏或关于页。
- **FIRST VIEWPORT:** 64px 导航；正文区域只有居中的完整昵称与底部轻量滚动提示，其余保持纯白编辑留白。`HI,` 与 `你好。` 在未滚动时完整隐藏，并随原生滚动分别从下向上显现；眉题、侧边标记、头像、索引封面、Folio、事实台账和深色收藏段均不进入初始视口。
- **FORM:** 自有候选 7，Living Index；方向 seed `ec48047a`；批准构图 B。

## Comp Fidelity Inventory

| Visible ingredient | Commitment | Implementation medium |
| --- | --- | --- |
| Thin editorial navigation | Nickname left, parenthetical active nav centered, page position and theme control right | Semantic React + CSS; existing SVG theme icon |
| Progressive bilingual greeting | Cobalt `HI,` followed by indented black `你好。`, restrained scale and loose inter-line rhythm | Semantic `h1`; Latin + Noto Sans SC display weights; native scroll writes bounded clip progress |
| Minimal scroll cue | Small label, one progress rule and a rotated authored arrow | Semantic button + existing SVG; remains keyboard equivalent to the same native scroll stages |
| Identity folio | One pure-white ruled sheet, real avatar, factual rows, coral/cobalt under-sheets; enters at cover step 03 | Existing avatar raster + semantic `aside/dl` + CSS pseudo layers |
| Facts ledger | One horizontal rule with five true facts; enters at cover step 04 | Semantic list; data derived from current collections |
| Dark SHELF fold | Single full-width near-black peak after the progressive cover completes | Semantic section + CSS inverse tokens |
| Game field | Largest 16:9 field and verified hours | Existing real game artwork/cover |
| Book field | Vertical 25:36 covers, visibly denser than one card | Existing WeRead covers; no generated titles |
| Music field | Square cover contact sheet | Existing NetEase covers |
| Category actions | Chinese label, true count, directional arrow; no extra CTA clutter | Semantic links + existing authored SVG arrow |
| Later ABOUT / recent / closing sections | Same rules, outline English markers and changing density | Semantic HTML/CSS; no new raster assets |

Lower homepage motion is authored by content type: `SHELF` uses an editorial rule reveal followed by cropped media windows; `ABOUT` separates the vertical marker from the story block; `OPEN PAGES` and `RECENT` enter as bounded-stagger ledger rows. These are one paper-reveal language, not one repeated fade preset.

The comp's synthetic covers and altered avatar are not implementation assets. Every visible media slot is replaced with current verified project data.

## Full Experience Fidelity Inventory

| Layer | Required behavior | Source principle |
| --- | --- | --- |
| First load | Original `OPEN` index waits for document/font readiness, shows bounded progress, then clears before the cover choreography | Analogue + Tomoya entry rhythm, not their assets |
| Progressive cover | Native document scroll and one button share four reveal states; no wheel listener, snapping or forced pagination | Tomoya sequencing translated into the site's own folio logic |
| Progressive keyboard path | Stage control precedes revealed links in DOM order; final action hands focus to the labelled SHELF section | Native focus order + explicit section focus handoff |
| Route navigation | Parenthetical active state, persistent current-page index, short native page reveal | Tomoya Okada v6 |
| Scroll state | A 2px cobalt rule reports native document progress without hijacking scroll | Tomoya progress grammar |
| Mobile menu | Opaque full-screen index, oversized links, explicit CLOSE control, focus-managed dialog | Tomoya Okada v6 + Sena Doi |
| Buttons | Rectangular outline/solid controls, lateral fill on hover/focus, 1px physical press on active | Analogue |
| Text links | Underline draw and arrow travel; complete label remains visible without hover | Analogue + FOLLOW.ART |
| Media | Fixed true aspect ratios, mild crop zoom, numbered order, explicit previous/next where browsing is local | Analogue + Sena Doi |
| Micro-components | Real counts, section marker, current-record star/registration mark, no invented favorite state | Sena Doi |
| Identity | One consolidated folio with avatar and factual rows, reused directional action grammar | FOLLOW.ART |
| Footer | Oversized contact close, email, route index, no fake newsletter or social CTA | Analogue + Sena Doi |

The later `OPEN PAGES` section may use clearly labeled editorial prompts to reserve space, but those prompts must not be presented as verified personal facts. No copied brand assets, no sound, no mini-game, no autoplay, no scroll hijacking, and no new animation dependency.
