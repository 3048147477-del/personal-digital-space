import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight } from '../components/Icons'
import { ProfilePortrait } from '../components/ProfilePortrait'
import { RecentCollectionList } from '../components/RecentCollectionList'
import { Reveal } from '../components/Reveal'
import { books, games, music, profile } from '../data/content'
import { Link } from '../router'

const totalGameHours = games.reduce((sum, game) => sum + (game.hours ?? 0), 0)
const totalRecords = games.length + books.length + music.length
const formatHours = (hours: number) => new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 1 }).format(hours)

const archiveFacts = [
  { label: 'AGE', value: '22 岁' },
  { label: 'FROM', value: '海南文昌' },
  { label: 'CURRENT', value: '学习成为 AI 训练师' },
  { label: 'RECORDS', value: `${totalRecords} 条公开记录` },
  { label: 'STEAM', value: `${formatHours(totalGameHours)} 小时` },
]

const collectionPanels = [
  {
    kind: 'games', index: '01', latin: 'GAMES', title: '游戏', path: '/shelf/games',
    detail: `${games.length} 款 · ${formatHours(totalGameHours)} 小时`,
    items: games.slice(0, 2).map((item) => ({ id: item.id, title: item.title, src: item.artwork ?? item.cover })),
  },
  {
    kind: 'books', index: '02', latin: 'BOOKS', title: '书籍', path: '/shelf/books',
    detail: `${books.length} 本公开书籍`,
    items: books.slice(0, 3).map((item) => ({ id: item.id, title: item.title, src: item.cover })),
  },
  {
    kind: 'music', index: '03', latin: 'MUSIC', title: '音乐', path: '/shelf/music',
    detail: `${music.length} 首公开记录`,
    items: music.slice(0, 3).map((item) => ({ id: item.id, title: item.title, src: item.cover })),
  },
]

const pendingPersonalNotes = [
  {
    index: '01',
    label: 'CURRENT PRACTICE',
    title: '最近正在认真学什么？',
    description: '这里会留给一件你此刻真正投入的事。以后可以换成具体课程、练习、卡住的问题，以及为什么还愿意继续。',
  },
  {
    index: '02',
    label: 'SMALL OBSERVATION',
    title: '最近反复想到的一件小事',
    description: '这里可以是一段很短的生活观察：一次散步、一顿饭、一句话，或者某个让你突然停下来的瞬间。',
  },
  {
    index: '03',
    label: 'NEXT CHAPTER',
    title: '接下来想慢慢完成什么？',
    description: '这里先替未来留一页。等你想清楚后，再换成真正想去的地方、想做的项目，或想成为的那种人。',
  },
]

const coverStepLabels = ['打个招呼', '看看现在的我', '展开事实台账', '进入收藏']
const coverCueLabels = ['向下滚动', '继续往下', '再往下一点', '进入收藏']
const coverStepOffsets = [0, 0.44, 0.66, 0.86]

export function HomePage() {
  const [activePanel, setActivePanel] = useState(0)
  const [coverStep, setCoverStep] = useState(0)
  const coverRef = useRef<HTMLElement>(null)
  const shelfRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.title = `${profile.name}｜个人数字空间`
  }, [])

  useEffect(() => {
    const cover = coverRef.current
    if (!cover) return

    const desktopQuery = window.matchMedia('(min-width: 768px)')
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = 0

    const update = () => {
      if (!desktopQuery.matches || reduceMotionQuery.matches) {
        setCoverStep(3)
        cover.style.setProperty('--cover-progress', '1')
        return
      }

      const range = Math.max(cover.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max((window.scrollY - cover.offsetTop) / range, 0), 1)
      const nextStep = progress < 0.4 ? 0 : progress < 0.62 ? 1 : progress < 0.82 ? 2 : 3
      const firstLineProgress = Math.min(Math.max((progress - 0.08) / 0.16, 0), 1)
      const secondLineProgress = Math.min(Math.max((progress - 0.2) / 0.18, 0), 1)
      const standbyProgress = Math.min(Math.max((progress - 0.03) / 0.11, 0), 1)

      cover.style.setProperty('--cover-progress', String(progress))
      cover.style.setProperty('--title-line-one-clip', `${(1 - firstLineProgress) * 100}%`)
      cover.style.setProperty('--title-line-two-clip', `${(1 - secondLineProgress) * 100}%`)
      cover.style.setProperty('--title-line-one-opacity', String(firstLineProgress))
      cover.style.setProperty('--title-line-two-opacity', String(secondLineProgress))
      cover.style.setProperty('--title-line-one-y', `${(1 - firstLineProgress) * 0.28}em`)
      cover.style.setProperty('--title-line-two-y', `${(1 - secondLineProgress) * 0.38}em`)
      cover.style.setProperty('--cover-standby-opacity', String(1 - standbyProgress))
      cover.style.setProperty('--cover-standby-y', `${standbyProgress * -1.2}rem`)
      setCoverStep((current) => current === nextStep ? current : nextStep)
    }

    const requestUpdate = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    desktopQuery.addEventListener('change', requestUpdate)
    reduceMotionQuery.addEventListener('change', requestUpdate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      desktopQuery.removeEventListener('change', requestUpdate)
      reduceMotionQuery.removeEventListener('change', requestUpdate)
    }
  }, [])

  const stepPanel = (direction: number) => {
    setActivePanel((current) => (current + direction + collectionPanels.length) % collectionPanels.length)
  }

  const advanceCover = () => {
    const cover = coverRef.current
    if (!cover) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const progressiveDesktop = window.matchMedia('(min-width: 768px)').matches && !reduceMotion

    if (!progressiveDesktop || coverStep >= 3) {
      const shelf = shelfRef.current
      shelf?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
      shelf?.focus({ preventScroll: true })
      return
    }

    const targetStep = Math.min(coverStep + 1, 3)
    const range = Math.max(cover.offsetHeight - window.innerHeight, 1)
    const targetTop = cover.offsetTop + range * coverStepOffsets[targetStep]
    window.scrollTo({ top: targetTop, behavior: 'smooth' })
  }

  return (
    <>
      <section
        ref={coverRef}
        className="home-cover scene"
        data-nav-tone="default"
        data-index-section="01"
        data-cover-step={coverStep}
      >
        <div className="home-cover__sticky">
          <div className="container home-cover__inner">
            <button className="home-cover__advance" type="button" onClick={advanceCover} aria-label={coverStepLabels[coverStep]}>
              <span>{coverCueLabels[coverStep]}</span>
              <i aria-hidden="true" />
              <ArrowRight />
              <strong className="sr-only" aria-live="polite">{coverStepLabels[coverStep]}</strong>
            </button>
            <div className="home-cover__standby" aria-hidden="true">
              <strong>{profile.name}</strong>
            </div>
            <div className="home-cover__copy">
              <h1>
                <span className="home-cover__title-line home-cover__title-line--one">HI,</span>
                <span className="home-cover__title-line home-cover__title-line--two">你好。</span>
              </h1>
              <p className="home-cover__intro">我是旺角西多士。再往下一点，先看看现在的我。</p>
              <div className="home-cover__actions">
                <Link className="button button--primary" to="/shelf">打开收藏馆 <ArrowRight /></Link>
                <Link className="text-link" to="/about">继续认识我 <ArrowUpRight size={18} /></Link>
              </div>
            </div>

            <aside className="identity-folio" aria-label="个人索引卡">
              <div className="identity-folio__paper">
                <div className="identity-folio__topline"><span>PUBLIC FILE</span><strong>01 / 03</strong></div>
                <div className="identity-folio__portrait">
                  <ProfilePortrait src={profile.avatar} name={profile.name} priority />
                  <span aria-hidden="true">CURRENT</span>
                </div>
                <div className="identity-folio__identity">
                  <p>NAME / 公开昵称</p><h2>{profile.name}</h2>
                </div>
                <dl>
                  <div><dt>来自</dt><dd>海南文昌</dd></div>
                  <div><dt>现在</dt><dd>学习成为 AI 训练师</dd></div>
                </dl>
              </div>
            </aside>

            <dl className="home-ledger">
              {archiveFacts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
            </dl>
          </div>
        </div>
      </section>

      <section
        ref={shelfRef}
        className="home-shelf scene"
        data-nav-tone="inverse"
        data-index-section="02"
        tabIndex={-1}
        aria-labelledby="home-shelf-title"
      >
        <div className="container">
          <Reveal className="section-intro section-intro--inverse" variant="editorial">
            <div className="section-intro__title"><h2 id="home-shelf-title">SHELF</h2><span>02 / COLLECTION</span></div>
            <div className="section-intro__copy">
              <h3>玩过、读过、听过，都是我留下的时间。</h3>
              <p>真实封面、公开数量和可核实时长，比一张“兴趣标签”更接近我。</p>
            </div>
          </Reveal>

          <Reveal className="shelf-switcher" variant="row" role="group" aria-label="收藏分类预览">
            <div className="shelf-switcher__status" aria-live="polite">
              <span>{collectionPanels[activePanel].index} / 03</span>
              <strong>{collectionPanels[activePanel].latin}</strong>
            </div>
            <div className="shelf-switcher__controls">
              <button type="button" onClick={() => stepPanel(-1)} aria-label="上一个收藏分类"><ArrowRight className="arrow-back" /></button>
              <button type="button" onClick={() => stepPanel(1)} aria-label="下一个收藏分类"><ArrowRight /></button>
            </div>
          </Reveal>

          <div className="collection-contact-sheet" data-active-kind={collectionPanels[activePanel].kind}>
            {collectionPanels.map((panel, index) => (
              <Reveal key={panel.kind} className={`collection-panel collection-panel--${panel.kind}${activePanel === index ? ' is-active' : ''}`} delay={index * 120} variant="media">
                <Link to={panel.path} aria-label={`查看${panel.title}收藏`} onMouseEnter={() => setActivePanel(index)} onFocus={() => setActivePanel(index)}>
                  <div className="collection-panel__media">
                    {panel.items.map((item, itemIndex) => (
                      <span key={item.id} className={`collection-panel__image collection-panel__image--${itemIndex + 1}`}>
                        <img src={item.src} alt={item.title} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.hidden = true }} />
                      </span>
                    ))}
                  </div>
                  <div className="collection-panel__meta">
                    <span>{panel.index}</span><div><h3>{panel.title}</h3><p>{panel.detail}</p></div><ArrowUpRight />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="home-shelf__action" variant="row"><Link className="button button--paper" to="/shelf">进入完整收藏馆 <ArrowRight /></Link></Reveal>
        </div>
      </section>

      <section className="home-about scene" data-nav-tone="default" data-index-section="03">
        <div className="container grid-12 home-about__grid">
          <Reveal className="home-about__marker" variant="marker">
            <div className="outline-marker" aria-hidden="true">ABOUT</div>
            <span>03 / ABOUT</span>
          </Reveal>
          <Reveal className="home-about__copy" delay={120} variant="story">
            <blockquote>很多别人早已习惯的事物，对我还很新鲜。我想从这些迟来的第一次出发，慢慢找到自己的生活。</blockquote>
            <p>成长得慢一些，不只意味着错过，也让我还能认真感受许多第一次。</p>
            <Link className="text-link" to="/about">阅读关于我 <ArrowUpRight size={18} /></Link>
          </Reveal>
        </div>
      </section>

      <section className="home-notes scene" data-nav-tone="default" data-index-section="04">
        <div className="container">
          <Reveal className="section-heading home-notes__heading" variant="editorial">
            <div className="section-heading__title"><h2>还没写完的几页</h2><span>04 / OPEN PAGES</span></div>
            <p>这三段是明确标记的占位文案，不冒充你的经历。等你想好了，我们再把问题和答案一起换成真正属于你的文字。</p>
          </Reveal>

          <div className="home-notes__list">
            {pendingPersonalNotes.map((note, index) => (
              <Reveal key={note.index} delay={Math.min(index * 110, 220)} variant="row">
                <article className="home-note">
                  <span>{note.index}</span>
                  <div><small>{note.label}</small><h3>{note.title}</h3></div>
                  <p>{note.description}</p>
                  <i>PLACEHOLDER</i>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-recent scene" data-nav-tone="default" data-index-section="05">
        <div className="container">
          <Reveal className="section-heading" variant="editorial">
            <div className="section-heading__title"><h2>最近留下的</h2><span>05 / RECENT</span></div>
            <p>按公开记录的更新时间排列。它会随着收藏增加，慢慢变成一份生活日志。</p>
          </Reveal>
          <RecentCollectionList revealVariant="row" />
        </div>
      </section>
    </>
  )
}
