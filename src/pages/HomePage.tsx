import { useEffect } from 'react'
import { Link } from '../router'
import { CategoryArtwork } from '../components/CategoryArtwork'
import { EmptyState } from '../components/EmptyState'
import { ArrowRight, ArrowUpRight } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import {
  collectionMeta,
  collections,
  experiences,
  profile,
} from '../data/content'

const journeyPrompts = [
  {
    title: '从哪里开始',
    description: '一段学习、生活或职业起点。',
  },
  {
    title: '哪次选择改变了方向',
    description: '一段值得留下的转折与原因。',
  },
  {
    title: '现在走到哪里',
    description: '正在做的事，以及下一步想去的地方。',
  },
]

export function HomePage() {
  useEffect(() => {
    document.title = '个人数字空间｜经历与长期收藏'
  }, [])

  return (
    <>
      <section className="hero scene" data-nav-tone="default">
        <div className="container grid-12 hero__grid">
          <div className="hero__copy">
            <h1
              className="hero__title"
              aria-label="这里记录我走过的路，和认真喜欢过的东西。"
            >
              <span className="hero__title-desktop">这里记录我走过的路，</span>
              <span className="hero__title-desktop">和认真喜欢过的东西。</span>
              <span className="hero__title-mobile" aria-hidden="true">走过的路，</span>
              <span className="hero__title-mobile" aria-hidden="true">认真喜欢过的东西，</span>
              <span className="hero__title-mobile" aria-hidden="true">都留在这里。</span>
            </h1>
            <p className="hero__description">
              一个慢慢长出来的个人数字空间。关于经历、创造，也关于游戏、书籍、音乐和电影。
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" to="/about">
                认识我 <ArrowRight />
              </Link>
              <Link className="button button--secondary" to="/shelf">
                逛逛收藏馆 <ArrowUpRight />
              </Link>
            </div>
          </div>

          <aside className="hero__aside" aria-label="当前状态">
            <span className="status-note__label">现在</span>
            <p>{profile.currentStatus}</p>
            <span className="status-note__hint">等待你提供一条真实近况</span>
          </aside>

          <div className="hero__trace" aria-hidden="true">
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="section scene about-preview" data-nav-tone="default">
        <div className="container grid-12">
          <Reveal className="about-preview__portrait parallax-media">
            <div className="portrait-placeholder" role="img" aria-label="人物图片待补充">
              <span className="portrait-placeholder__name">YOU</span>
              <span className="portrait-placeholder__note">人物图片待补充</span>
              <span className="portrait-placeholder__orbit" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal className="about-preview__copy" delay={100}>
            <h2>先认识一个具体的人。</h2>
            <p>{profile.shortBio}</p>
            <Link className="text-link" to="/about">
              继续认识我 <ArrowUpRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section scene journey-preview" data-nav-tone="default">
        <div className="container">
          <Reveal className="section-heading" variant="line">
            <h2>经历会说明，我是怎么走到这里的。</h2>
            <Link className="text-link" to="/journey">
              查看完整经历 <ArrowUpRight size={18} />
            </Link>
          </Reveal>

          {experiences.length > 0 ? (
            <div className="timeline-list">
              {experiences.slice(0, 3).map((item, index) => (
                <Reveal key={item.id} delay={index * 70}>
                  <article className="timeline-item">
                    <time>{item.startDate}</time>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="journey-prompts">
              {journeyPrompts.map((item, index) => (
                <Reveal key={item.title} delay={index * 70}>
                  <article className="journey-prompt">
                    <span className="journey-prompt__marker" aria-hidden="true" />
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span>内容待补充</span>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section scene shelf-preview" data-nav-tone="inverse">
        <div className="container">
          <Reveal className="shelf-preview__heading" variant="line">
            <h2>收藏不是清单，<br />是时间留下的形状。</h2>
            <p>从玩过的游戏，到读过、听过和看过的内容。每一类都单独展开，不挤在一张页面里。</p>
          </Reveal>

          <div className="shelf-grid">
            {collectionMeta.map((item, index) => (
              <Reveal key={item.kind} delay={Math.min(index * 70, 210)}>
                <Link className={`shelf-card shelf-card--${item.kind}`} to={item.path}>
                  <CategoryArtwork kind={item.kind} mark={item.mark} />
                  <div className="shelf-card__body">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div className="shelf-card__meta">
                      <span>{collections[item.kind].length} 条记录</span>
                      <ArrowUpRight />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="shelf-preview__action">
            <Link className="button button--inverse" to="/shelf">
              进入收藏馆 <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section scene recent-section" data-nav-tone="default">
        <div className="container">
          <Reveal className="section-heading" variant="line">
            <h2>最近记录</h2>
            <p>这里会按更新时间，从四类收藏中自动取出最近内容。</p>
          </Reveal>
          <Reveal>
            <EmptyState
              title="还没有最近记录"
              description="添加第一批游戏、书籍、音乐或电影后，这个区域会自动出现，不需要重复维护。"
            />
          </Reveal>
        </div>
      </section>
    </>
  )
}
