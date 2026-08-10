import { useEffect } from 'react'
import { Link } from '../router'
import { CategoryArtwork } from '../components/CategoryArtwork'
import { ArrowRight, ArrowUpRight } from '../components/Icons'
import { ProfilePortrait } from '../components/ProfilePortrait'
import { RecentCollectionList } from '../components/RecentCollectionList'
import { Reveal } from '../components/Reveal'
import {
  collections,
  games,
  getCollectionArtworkItems,
  music,
  profile,
  publicCollectionMeta,
} from '../data/content'

const totalGameHours = games.reduce((sum, game) => sum + (game.hours ?? 0), 0)

const formatHours = (hours: number) => new Intl.NumberFormat('zh-CN', {
  maximumFractionDigits: 1,
}).format(hours)

const archiveFacts = [
  { label: '现在', value: '学习成为 AI 训练师' },
  { label: '来自', value: '海南文昌' },
  { label: '公开收藏', value: `${games.length} 款游戏 · ${music.length} 首音乐` },
  { label: 'Steam 记录', value: `${formatHours(totalGameHours)} 小时` },
]

export function HomePage() {
  useEffect(() => {
    document.title = `${profile.name}｜个人数字空间`
  }, [])

  return (
    <>
      <section className="archive-hero scene" data-nav-tone="default">
        <div className="container grid-12 archive-hero__grid">
          <div className="archive-hero__copy">
            <h1 className="archive-hero__title">
              <span>慢慢认识世界，</span>
              <span>认真留下生活。</span>
            </h1>
            <p className="archive-hero__description">
              我是旺角西多士，22 岁，来自海南文昌。这里记录我正在经历的生活，也整理那些真正花过时间的游戏和音乐。
            </p>
            <div className="archive-hero__actions">
              <Link className="button button--primary" to="/shelf">
                浏览我的收藏 <ArrowRight />
              </Link>
              <Link className="text-link" to="/about">
                继续认识我 <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>

          <aside className="archive-hero__record" aria-label="个人档案摘要">
            <div className="archive-hero__portrait">
              <ProfilePortrait src={profile.avatar} name={profile.name} priority />
              <p>暂时用这只穿西装的柴犬代表我。</p>
            </div>
            <dl className="archive-facts">
              {archiveFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="archive-note scene" data-nav-tone="default">
        <div className="container grid-12 archive-note__grid">
          <Reveal className="archive-note__copy" variant="line">
            <blockquote>
              很多别人早已习惯的事物，对我还很新鲜。我想从这些迟来的第一次出发，慢慢找到自己的生活。
            </blockquote>
          </Reveal>
          <Reveal className="archive-note__aside" delay={100}>
            <p>成长得慢一些，不只意味着错过，也让我还能认真感受许多第一次。</p>
            <Link className="text-link" to="/about">
              阅读关于我 <ArrowUpRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="archive-shelf scene" data-nav-tone="inverse">
        <div className="container">
          <Reveal className="archive-shelf__heading" variant="line">
            <h2>时间花在哪里，偏爱就留在哪里。</h2>
            <p>现在先公开游戏与音乐。没有内容的分类暂时不占位置，等真正留下记录后再出现。</p>
          </Reveal>

          <div className="archive-shelf__grid">
            {publicCollectionMeta.map((item, index) => {
              const isGames = item.kind === 'games'
              const detail = isGames
                ? `${collections[item.kind].length} 款 · ${formatHours(totalGameHours)} 小时`
                : `${collections[item.kind].length} 首公开记录`

              return (
                <Reveal key={item.kind} delay={index * 100}>
                  <Link
                    className={`archive-shelf__link archive-shelf__link--${item.kind}`}
                    to={item.path}
                  >
                    <CategoryArtwork
                      kind={item.kind}
                      mark={item.mark}
                      images={getCollectionArtworkItems(item.kind)}
                    />
                    <div className="archive-shelf__body">
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                      <span className="archive-shelf__meta">
                        {detail} <ArrowUpRight size={18} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>

          <Reveal className="archive-shelf__action">
            <Link className="button button--inverse" to="/shelf">
              进入收藏馆 <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section scene archive-recent" data-nav-tone="default">
        <div className="container">
          <Reveal className="archive-recent__heading" variant="line">
            <h2>最近留下的</h2>
            <p>按公开记录的更新时间排列。这里会随着收藏增加，慢慢变成一份生活日志。</p>
          </Reveal>
          <RecentCollectionList />
        </div>
      </section>
    </>
  )
}
