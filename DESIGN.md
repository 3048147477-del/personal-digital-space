# DESIGN.md

> Quiet Reveal / 安静显影：以暖白留白承载真实内容，让经历与收藏在滚动中逐层出现，而不是用特效抢走注意力。

## 1. Visual Theme & Atmosphere

**Style**: Quiet Reveal / 安静显影  
**Keywords**: 暖白、干净、克制、不对称、编辑感、逐层显现、单一强调色、一次反转  
**Tone**: 安静但不寡淡，个人而不商业，精确但不冷漠 — NOT SaaS 模板、暗黑科技、玻璃拟态、炫技作品集  
**Feel**: 像打开一本留白充足的个人档案，页面先保持安静，内容随着阅读一步步浮现。

**Visitor Mode**: Experience 为主，Read 为辅。访客先感受到“这是一个人的空间”，再阅读经历和兴趣记录。  
**Interaction Tier**: 克制的 L2 流畅交互  
**Dependencies**: CSS + 原生 IntersectionObserver；不引入 GSAP、Framer Motion、Lenis 或 WebGL

### Reference Translation

- 参考截图提供白色基底、清楚层级、直接的按钮和大面积留白。
- Poppr 提供慢速缓动、大字与图片叠放、章节状态变化的节奏参考。
- 不复制 Poppr 的暗色主视觉、3D 画廊、自定义光标、多彩强调色和高密度持续动画。
- 参考站字体和品牌素材不进入本项目；所有内容与组件重新设计。

### Design Dials

| Dimension | Value | Meaning |
| --- | ---: | --- |
| Design variance | 7 / 10 | 桌面端明显不对称，但不牺牲阅读顺序 |
| Motion intensity | 4 / 10 | 滚动显影与背景切换，无持续循环动画 |
| Visual density | 3 / 10 | 留白充足，一屏只承担一个主要信息任务 |

## 2. Color Palette & Roles

~~~css
:root {
  color-scheme: light;

  /* Backgrounds */
  --bg: #fafaf6;
  --surface: #ffffff;
  --surface-alt: #f1f1ec;
  --surface-hover: #e9eae4;
  --surface-inverse: #1d1d1f;
  --surface-inverse-raised: #28282b;

  /* Borders */
  --border: #d9dad3;
  --border-strong: #a9aba4;
  --border-inverse: #444448;

  /* Text */
  --text: #1d1d1f;
  --text-secondary: #555750;
  --text-tertiary: #7a7d75;
  --text-on-inverse: #fafaf6;
  --text-secondary-on-inverse: #c1c2bc;

  /* Single accent */
  --accent: #0b866f;
  --accent-hover: #086b5a;
  --accent-soft: #dcefe9;
  --accent-on-inverse: #45c7ad;

  /* Semantic */
  --success: #2d775c;
  --warning: #9a681f;
  --error: #ad4747;
  --focus-ring: #0b866f;

  /* RGB variants */
  --bg-rgb: 250, 250, 246;
  --surface-rgb: 255, 255, 255;
  --text-rgb: 29, 29, 31;
  --accent-rgb: 11, 134, 111;
  --inverse-rgb: 29, 29, 31;

  /* Shared shape and motion tokens */
  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;
  --ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-reveal: cubic-bezier(0.19, 1, 0.22, 1);
  --duration-fast: 180ms;
  --duration-standard: 320ms;
  --duration-reveal: 900ms;
}

:root[data-theme='dark'] {
  color-scheme: dark;

  --bg: #1d1d1f;
  --surface: #252527;
  --surface-alt: #2d2d30;
  --surface-hover: #36363a;
  --surface-inverse: #fafaf6;
  --surface-inverse-raised: #ffffff;

  --border: #3d3d41;
  --border-strong: #68696d;
  --border-inverse: #d9dad3;

  --text: #fafaf6;
  --text-secondary: #c1c2bc;
  --text-tertiary: #979991;
  --text-on-inverse: #1d1d1f;
  --text-secondary-on-inverse: #555750;

  --accent: #45c7ad;
  --accent-hover: #6bd5c0;
  --accent-soft: #163f37;
  --accent-on-inverse: #0b866f;

  --focus-ring: #45c7ad;
  --bg-rgb: 29, 29, 31;
  --surface-rgb: 37, 37, 39;
  --text-rgb: 250, 250, 246;
  --accent-rgb: 69, 199, 173;
  --inverse-rgb: 250, 250, 246;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    color-scheme: dark;
    --bg: #1d1d1f;
    --surface: #252527;
    --surface-alt: #2d2d30;
    --surface-hover: #36363a;
    --surface-inverse: #fafaf6;
    --surface-inverse-raised: #ffffff;
    --border: #3d3d41;
    --border-strong: #68696d;
    --border-inverse: #d9dad3;
    --text: #fafaf6;
    --text-secondary: #c1c2bc;
    --text-tertiary: #979991;
    --text-on-inverse: #1d1d1f;
    --text-secondary-on-inverse: #555750;
    --accent: #45c7ad;
    --accent-hover: #6bd5c0;
    --accent-soft: #163f37;
    --accent-on-inverse: #0b866f;
    --focus-ring: #45c7ad;
    --bg-rgb: 29, 29, 31;
    --surface-rgb: 37, 37, 39;
    --text-rgb: 250, 250, 246;
    --accent-rgb: 69, 199, 173;
    --inverse-rgb: 250, 250, 246;
  }
}
~~~

### Color Rules

- 页面主色始终是暖白与炭黑；不使用纯白满屏配纯黑，也不使用冷蓝灰。
- 全站只使用一个薄荷青强调色，用于链接、焦点、活跃态和少量关键词。
- 首页只允许一次整段深色反转，默认落在“收藏馆预览”；暗黑模式中反转为暖白。
- 不使用紫蓝霓虹、彩虹渐变、发光描边或大面积品牌色底。
- 所有实现颜色必须引用 CSS 变量，组件内部禁止新增硬编码颜色。
- 成功、警告和错误色只用于真实语义状态，不作为装饰。

## 3. Typography Rules

### Font Stack

~~~css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap');

:root {
  --font-sans: 'Noto Sans SC', 'Manrope', 'PingFang SC',
    'Microsoft YaHei', system-ui, sans-serif;
  --font-meta: 'Manrope', 'Noto Sans SC', system-ui, sans-serif;
}

body {
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75;
  letter-spacing: 0.015em;
}
~~~

| Role | Font | Size | Weight | Line Height | Letter Spacing |
| --- | --- | --- | ---: | ---: | ---: |
| Hero H1 | Noto Sans SC | clamp(3rem, 7vw, 6.75rem) | 700 | 1.02 | -0.045em |
| Section H2 | Noto Sans SC | clamp(2.25rem, 4.8vw, 4.5rem) | 600 | 1.08 | -0.035em |
| H3 | Noto Sans SC | clamp(1.5rem, 2.4vw, 2.25rem) | 600 | 1.25 | -0.02em |
| Body Large | Noto Sans SC | clamp(1.125rem, 1.6vw, 1.375rem) | 400 | 1.75 | 0.01em |
| Body | Noto Sans SC | clamp(1rem, 1.1vw, 1.125rem) | 400 | 1.75 | 0.015em |
| Label | Manrope + Noto Sans SC | 0.75rem–0.875rem | 600 | 1.4 | 0.12em |
| Metadata / Numbers | Manrope + Noto Sans SC | 0.8125rem–1rem | 500 | 1.5 | 0.02em |

### Typography Rules

- 中文正文最大行宽 38 个汉字左右；长简介容器不超过 44rem。
- 大标题可以跨两至三行，但单行不超过 12 个汉字；禁止靠无限放大制造层级。
- 数字、年份、游戏时长统一使用 Manrope，保持表格感但不做终端风。
- 标题与正文通过字号、留白和字重建立层级，不依赖颜色堆叠。
- 中文不做逐字跳动；滚动显影按行或整块触发。
- 正文字号不得低于 16px，辅助标签不得低于 12px。
- **Never use**: Inter、Times New Roman、装饰性手写体、像素字体作为全站正文。

### Text Decoration

- Hero H1：无渐变、无投影；允许一个短语切换为强调色。
- Section H2：无渐变、无投影；编号或 eyebrow 使用强调色。
- 正文：不添加投影、渐变或背景高亮。
- 文本链接：使用颜色变化与偏移下划线，不使用发光。
- 小节标签：可以使用 2px 强调色短线，不使用胶囊底色。

## 4. Component Stylings

### Global Focus

~~~css
:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 4px;
}
~~~

### Buttons

~~~css
.button {
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.75rem 1.125rem;
  border: 1px solid transparent;
  border-radius: 999px;
  font: 600 0.9375rem/1 var(--font-sans);
  text-decoration: none;
  cursor: pointer;
  transition:
    color var(--duration-fast) ease,
    background-color var(--duration-fast) ease,
    border-color var(--duration-fast) ease,
    transform var(--duration-fast) var(--ease-standard);
}

.button--primary {
  color: var(--text-on-inverse);
  background: var(--surface-inverse);
}

.button--primary:hover {
  color: #fafaf6;
  background: var(--accent);
  transform: translateY(-2px);
}

.button--primary:active {
  transform: translateY(0) scale(0.98);
}

.button--secondary {
  color: var(--text);
  background: transparent;
  border-color: var(--border);
}

.button--secondary:hover {
  color: var(--accent-hover);
  background: var(--accent-soft);
  border-color: var(--accent);
  transform: translateY(-2px);
}

.button--secondary:active {
  transform: translateY(0) scale(0.98);
}

.button:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 4px;
}

.button:disabled,
.button[aria-disabled='true'] {
  color: var(--text-tertiary);
  background: var(--surface-alt);
  border-color: var(--border);
  cursor: not-allowed;
  opacity: 0.65;
  transform: none;
}
~~~

### Collection and Media Cards

Cards are image-led links, not generic white boxes. Text stays outside the image surface.

~~~css
.media-card {
  display: grid;
  gap: 1rem;
  color: inherit;
  text-decoration: none;
}

.media-card__cover {
  position: relative;
  overflow: hidden;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition:
    border-color var(--duration-standard) ease,
    transform var(--duration-standard) var(--ease-standard);
}

.media-card__cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.001);
  transition: transform 700ms var(--ease-standard);
}

.media-card:hover .media-card__cover,
.media-card:focus-visible .media-card__cover {
  border-color: var(--border-strong);
  transform: translateY(-4px);
}

.media-card:hover .media-card__cover img,
.media-card:focus-visible .media-card__cover img {
  transform: scale(1.025);
}

.media-card:active .media-card__cover {
  transform: translateY(-1px) scale(0.99);
}

.media-card[aria-disabled='true'] {
  pointer-events: none;
  opacity: 0.55;
}

.media-card--game .media-card__cover { aspect-ratio: 16 / 10; }
.media-card--book .media-card__cover { aspect-ratio: 3 / 4; }
.media-card--music .media-card__cover { aspect-ratio: 1; }
.media-card--film .media-card__cover { aspect-ratio: 2 / 3; }
~~~

### Navigation

~~~css
.site-nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 20;
  color: var(--text);
  background: transparent;
  border-bottom: 1px solid transparent;
  transition:
    color var(--duration-standard) ease,
    background-color var(--duration-standard) ease,
    border-color var(--duration-standard) ease;
}

.site-nav.is-scrolled {
  background: rgba(var(--bg-rgb), 0.86);
  border-bottom-color: var(--border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.site-nav[data-tone='inverse'] {
  color: var(--text-on-inverse);
}

.site-nav__link {
  color: inherit;
  text-decoration: none;
  opacity: 0.72;
  transition: opacity var(--duration-fast) ease;
}

.site-nav__link:hover,
.site-nav__link:focus-visible,
.site-nav__link[aria-current='page'] {
  opacity: 1;
}

.site-nav__link[aria-current='page'] {
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-underline-offset: 0.45rem;
  text-decoration-thickness: 2px;
}
~~~

### Text Links

~~~css
.text-link {
  color: var(--text);
  text-decoration-line: underline;
  text-decoration-color: rgba(var(--accent-rgb), 0.45);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.3em;
  transition:
    color var(--duration-fast) ease,
    text-decoration-color var(--duration-fast) ease,
    text-underline-offset var(--duration-fast) ease;
}

.text-link:hover,
.text-link:focus-visible {
  color: var(--accent-hover);
  text-decoration-color: currentColor;
  text-underline-offset: 0.42em;
}

.text-link:active {
  text-underline-offset: 0.25em;
}

.text-link[aria-disabled='true'] {
  color: var(--text-tertiary);
  pointer-events: none;
  text-decoration-color: var(--border);
}
~~~

### Tags and Status

~~~css
.meta-tag {
  display: inline-flex;
  align-items: center;
  min-height: 1.75rem;
  padding: 0.25rem 0;
  color: var(--text-tertiary);
  border-bottom: 1px solid var(--border);
  font: 600 0.75rem/1.35 var(--font-meta);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.meta-tag[data-active='true'] {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
~~~

### Timeline

~~~css
.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: minmax(8rem, 2fr) minmax(0, 7fr);
  gap: clamp(1.5rem, 4vw, 5rem);
  padding-block: clamp(2rem, 5vw, 4.5rem);
  border-top: 1px solid var(--border);
}

.timeline-item::before {
  content: '';
  position: absolute;
  top: -0.3rem;
  left: 0;
  width: 0.625rem;
  height: 0.625rem;
  border: 2px solid var(--bg);
  border-radius: 50%;
  background: var(--border-strong);
  box-shadow: 0 0 0 1px var(--border-strong);
  transition: background-color var(--duration-standard) ease;
}

.timeline-item.is-visible::before {
  background: var(--accent);
}
~~~

### Theme Toggle

~~~css
.theme-toggle {
  width: 2.75rem;
  height: 2.75rem;
  display: inline-grid;
  place-items: center;
  color: inherit;
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.72;
  transition:
    opacity var(--duration-fast) ease,
    transform var(--duration-fast) var(--ease-standard);
}

.theme-toggle:hover,
.theme-toggle:focus-visible {
  opacity: 1;
  transform: rotate(8deg);
}

.theme-toggle:active {
  transform: rotate(0) scale(0.94);
}

.theme-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.35;
  transform: none;
}
~~~

### Empty States

~~~css
.empty-state {
  max-width: 42rem;
  padding-block: clamp(4rem, 10vw, 8rem);
  border-top: 1px solid var(--border);
}

.empty-state p {
  max-width: 34rem;
  color: var(--text-secondary);
}
~~~

Empty states use direct copy such as “这里还没有公开记录”，never fabricated cover art, counts, reviews or dates.

## 5. Layout Principles

### Container

- Main max width: 90rem / 1440px
- Reading max width: 44rem / 704px
- Horizontal padding: clamp(1.25rem, 4vw, 4rem)
- Section padding: clamp(6rem, 13vw, 12.5rem)
- Header height: 4.75rem desktop, 4rem mobile

### Spacing Scale

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
}

.container {
  width: min(100% - 2 * clamp(1.25rem, 4vw, 4rem), 90rem);
  margin-inline: auto;
}

.reading-width {
  width: min(100%, 44rem);
}

.section {
  padding-block: clamp(6rem, 13vw, 12.5rem);
}
~~~

### Grid

~~~css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 2rem);
}

.hero__copy {
  grid-column: 1 / span 8;
  align-self: end;
}

.hero__aside {
  grid-column: 10 / -1;
  align-self: end;
}

.about-preview__portrait {
  grid-column: 1 / span 5;
}

.about-preview__copy {
  grid-column: 7 / -1;
}

.shelf-grid {
  display: grid;
  grid-template-columns: 1.4fr 0.9fr;
  gap: clamp(1.25rem, 3vw, 3rem);
}

.shelf-grid > :nth-child(3) {
  grid-column: 1 / 2;
  margin-left: 14%;
}

.shelf-grid > :nth-child(4) {
  grid-column: 2 / 3;
  margin-top: -12%;
}
~~~

### Composition Rules

- Hero 不居中：标题占左侧 7–8 列，右侧只放当前状态或一个真实素材。
- 一屏只设置一个主要焦点，避免标题、数据、按钮和图片同时争抢。
- 收藏分类采用 7/5、5/7 或错位排列，不使用四张等宽模板卡片。
- 图片比例来自内容本身：游戏横向、书籍与电影纵向、音乐方形。
- 分组优先使用留白、细线和排版，不为每组内容添加容器背景。
- 深色反转 section 必须覆盖完整视口宽度，内容仍遵循同一网格。

## 6. Depth & Elevation

| Level | Treatment | Use |
| --- | --- | --- |
| Flat | 无阴影，靠留白或 1px 分隔线 | 正文、经历、标签、普通分组 |
| Image | 0 1.5rem 4rem rgba(29, 29, 31, 0.08) | 仅用于真实封面或人物图 |
| Navigation | 0 0.25rem 1.25rem rgba(29, 29, 31, 0.05) | 导航滚动状态，可选 |
| Overlay | 0 2rem 5rem rgba(29, 29, 31, 0.14) | 仅用于移动导航抽屉 |

~~~css
:root {
  --shadow-image: 0 1.5rem 4rem rgba(29, 29, 31, 0.08);
  --shadow-nav: 0 0.25rem 1.25rem rgba(29, 29, 31, 0.05);
  --shadow-overlay: 0 2rem 5rem rgba(29, 29, 31, 0.14);
}
~~~

### Elevation Rules

- 不使用外发光、霓虹阴影或大面积玻璃模糊。
- 卡片默认无阴影；只有真实媒体图像可以获得轻微浮起。
- 暗黑模式中阴影降低透明度，主要通过边框区分层级。
- 层级顺序固定：内容 0、粘性导航 20、移动抽屉 30、跳过链接 40。

## 7. Animation & Interaction

**Motion Philosophy**: 内容先可读，再轻缓显现；每次移动都说明阅读顺序或状态变化。  
**Tier**: 克制 L2  
**Dependencies**: 无第三方依赖

### Initial Page Setup

Only add the JS class when JavaScript is available. Without JavaScript, all content remains visible.

~~~html
<script>document.documentElement.classList.add('js');</script>
~~~

### Reveal System

~~~css
.js .reveal {
  opacity: 0;
  transform: translateY(1.5rem);
  transition:
    opacity var(--duration-reveal) var(--ease-reveal),
    transform var(--duration-reveal) var(--ease-reveal);
  transition-delay: var(--reveal-delay, 0ms);
}

.js .reveal[data-reveal='line'] {
  clip-path: inset(0 0 100% 0);
  transform: translateY(1rem);
  transition:
    clip-path 1000ms var(--ease-reveal),
    transform 1000ms var(--ease-reveal);
}

.js .reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
  clip-path: inset(0);
}

.reveal-group > * {
  transition-delay: var(--reveal-delay, 0ms);
}
~~~

~~~js
export function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const groups = document.querySelectorAll('.reveal-group');

  groups.forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      const delay = Math.min(index * 70, 280);
      child.style.setProperty('--reveal-delay', String(delay) + 'ms');
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );

  items.forEach((item) => observer.observe(item));
  return () => observer.disconnect();
}
~~~

### Section Tone and Navigation Change

Sections own their background. IntersectionObserver only updates the fixed navigation tone.

~~~css
.scene {
  color: var(--text);
  background: var(--bg);
  transition:
    color 600ms var(--ease-standard),
    background-color 600ms var(--ease-standard);
}

.scene[data-tone='muted'] {
  background: var(--surface-alt);
}

.scene[data-tone='inverse'] {
  color: var(--text-on-inverse);
  background: var(--surface-inverse);
}
~~~

~~~js
export function initSceneTone(nav) {
  const scenes = document.querySelectorAll('[data-nav-tone]');
  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (active) {
        nav.dataset.tone = active.target.dataset.navTone || 'default';
      }
    },
    { threshold: [0.45, 0.6, 0.75] }
  );

  scenes.forEach((scene) => observer.observe(scene));
  return () => observer.disconnect();
}
~~~

### Navigation Scroll State

~~~js
export function initNavigationState(nav) {
  const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 32);
  update();
  window.addEventListener('scroll', update, { passive: true });
  return () => window.removeEventListener('scroll', update);
}
~~~

### Low-Amplitude Media Parallax

Only one homepage media region may use this effect.

~~~css
@supports (animation-timeline: view()) {
  .parallax-media {
    animation: quietParallax linear both;
    animation-timeline: view();
    animation-range: entry 0% exit 100%;
  }

  @keyframes quietParallax {
    from { transform: translateY(1.125rem); }
    to { transform: translateY(-1.125rem); }
  }
}
~~~

### Hover and Press

- Media covers move no more than 4px and scale no more than 1.025.
- Buttons move no more than 2px and scale to 0.98 on active.
- Text links change underline offset; they do not slide or scramble.
- Theme toggle may rotate 8 degrees; no looping icon animation.

### Page Entry

~~~css
.page-shell {
  animation: pageEnter 420ms var(--ease-standard) both;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
~~~

### Reduced Motion

~~~css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
  }

  .js .reveal,
  .js .reveal[data-reveal='line'] {
    opacity: 1;
    transform: none;
    clip-path: none;
  }

  .parallax-media {
    animation: none;
    transform: none;
  }
}
~~~

### Motion Budget

- 首页最多使用 3 组 reveal 编排：Hero、经历预览、收藏预览。
- 同一视口最多 6 个元素参与 stagger，延迟上限 280ms。
- 不对正文逐字拆分，不自动播放轮播，不创建无限 marquee。
- 动画只改变 transform、opacity、clip-path、color 和 background-color。
- 实现代码必须返回清理函数，路由切换时解除 observer 与 scroll listener。

## 8. Do's and Don'ts

### Do

- 用暖白、炭黑和单一薄荷青建立稳定识别。
- 用不对称网格、真实图片比例和大留白制造设计感。
- 把首页深色反转留给收藏馆预览，形成唯一强节奏点。
- 让标题、正文、图片按照阅读顺序逐层出现。
- 使用真实个人资料、经历、封面和可核实的游戏时长。
- 为所有 hover 行为提供等价 focus-visible 状态。
- 在无 JavaScript或减少动画模式下保持全部内容可见。
- 移动端主动收敛为单列，不保留桌面端错位。
- 空内容使用诚实说明，或在上线前隐藏入口。

### Don't

- ❌ 不复制 Poppr 的品牌色、字体、3D 画廊或页面结构。
- ❌ 不使用紫蓝 AI 渐变、霓虹外发光或彩虹文字。
- ❌ 不使用纯黑背景、纯白大卡片堆叠或冷灰 SaaS 配色。
- ❌ 不把 Hero 做成常见的居中标题、两颗按钮和假产品截图。
- ❌ 不使用四张等宽圆角卡片表达四类收藏。
- ❌ 不使用玻璃拟态、过量胶囊标签或所有容器 24px 大圆角。
- ❌ 不使用自定义光标、磁吸按钮、3D 倾斜或鼠标图片拖尾。
- ❌ 不引入 GSAP、Framer Motion、Lenis、Three.js 或动画组件库。
- ❌ 不做滚动劫持、水平滚动替代纵向滚动或 section pin。
- ❌ 不使用无限循环、自动轮播、自动播放音乐或背景视频。
- ❌ 不在移动元素上使用 filter: blur()。
- ❌ 不为了填满界面编造名字、产品、评价、评分、时长或统计数字。
- ❌ 不让动画延迟必要内容超过 1 秒。
- ❌ 不依赖 hover 才能看到标题、时长或操作入口。

## 9. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
| --- | --- | --- |
| Wide Desktop | ≥ 1200px | 12 栏不对称网格，完整错位与单次低幅视差 |
| Tablet / Laptop | 768–1199px | 8 栏网格，减少负空间与图片错位，导航保持横向 |
| Mobile | < 768px | 单列内容，关闭视差和负 margin，使用移动导航抽屉 |
| Small Mobile | < 480px | 收紧标题字号与水平 padding，按钮允许整行排列 |

### Touch Targets

- 所有按钮、导航项、主题切换和排序控件最小 44 × 44px。
- 相邻触摸目标之间至少保留 8px。
- 卡片整块可点击，但内部文本仍保持语义标题结构。

### Collapsing Strategy

~~~css
@media (max-width: 1199px) {
  .grid-12 {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  .hero__copy {
    grid-column: 1 / span 6;
  }

  .hero__aside {
    grid-column: 7 / -1;
  }
}

@media (max-width: 767px) {
  .container {
    width: min(100% - 2.5rem, 90rem);
  }

  .section {
    padding-block: clamp(4.5rem, 20vw, 7rem);
  }

  .grid-12,
  .shelf-grid,
  .timeline-item {
    grid-template-columns: 1fr;
  }

  .hero {
    min-height: 100svh;
    padding-top: 6rem;
  }

  .hero__copy,
  .hero__aside,
  .about-preview__portrait,
  .about-preview__copy,
  .shelf-grid > :nth-child(n) {
    grid-column: 1;
    margin: 0;
  }

  .hero__aside {
    align-self: end;
  }

  .timeline-item {
    gap: 1rem;
  }

  .parallax-media {
    animation: none;
    transform: none;
  }

  .site-nav__desktop-links {
    display: none;
  }

  .button {
    min-height: 2.875rem;
  }
}

@media (max-width: 479px) {
  .container {
    width: min(100% - 2rem, 90rem);
  }

  .button-row {
    display: grid;
    grid-template-columns: 1fr;
  }

  .button {
    width: 100%;
  }
}
~~~

### Responsive Content Rules

- Hero 标题移动端最多三行；超出时缩短文案，不继续减小字体。
- 经历时间置于内容上方，不压缩成窄侧栏。
- 收藏馆顺序固定为游戏、书籍、音乐、电影；视觉错位不改变 DOM 顺序。
- 游戏封面保持横向，书籍与电影保持纵向，不在移动端统一裁成方形。
- 暗色反转 section 在移动端保留，但取消内部视差与错位。
- 移动导航打开后锁定背景滚动，Escape 可关闭，焦点限制在抽屉内。

## Implementation Acceptance

- 所有页面仅使用本文件定义的颜色、字体、间距、圆角与动效 Token。
- 首页首屏不是居中 SaaS Hero；收藏馆不是等宽卡片网格。
- 浅色模式包含一次深色反转；暗色模式包含对应的暖白反转。
- 导航在滚动与反转场景中保持可读。
- 无 JavaScript、减少动画和移动端模式均可完整访问内容。
- Lighthouse 或等价检查中不存在由动效造成的布局偏移。
- 真实素材不足时使用明确占位或隐藏入口，不生成虚假事实。
