import { useEffect } from 'react'
import { CollectionPage } from '../components/CollectionPage'
import { ArrowUpRight } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { games, profile } from '../data/content'
import { Link } from '../router'
import type { Game } from '../types'

const formatHours = (hours: number) => new Intl.NumberFormat('zh-CN', {
  maximumFractionDigits: 1,
}).format(hours)

const formatRecordDate = (date: string) => new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
}).format(new Date(`${date}T00:00:00`))

function GameArtwork({ game, priority = false }: { game: Game; priority?: boolean }) {
  return (
    <img
      src={game.artwork ?? game.cover}
      alt={`${game.title} 的 Steam 游戏画面`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(event) => {
        if (event.currentTarget.dataset.fallback !== 'true' && game.artwork) {
          event.currentTarget.dataset.fallback = 'true'
          event.currentTarget.src = game.cover
          return
        }
        event.currentTarget.hidden = true
      }}
    />
  )
}

export function GamesPage() {
  useEffect(() => {
    document.title = `游戏与时长｜${profile.name}`
  }, [])

  const [featuredGame, ...otherGames] = games

  if (!featuredGame) return <CollectionPage kind="games" />

  const totalHours = games.reduce((sum, game) => sum + (game.hours ?? 0), 0)
  const reviewGames = games.filter((game) => game.note)
  const steamProfile = profile.links.find((link) => link.label === 'Steam')

  return (
    <>
      <section className="games-hero scene" data-nav-tone="default">
        <div className="container grid-12 games-hero__grid">
          <div className="games-hero__copy">
            <h1>
              <span>我把 {formatHours(totalHours)} 小时，</span>
              <span>留在了四个世界里。</span>
            </h1>
            <p>
              没有评分榜，也不替过去的自己总结喜好。这里只按公开、可核实的游玩时长，看看时间真正去了哪里。
            </p>
          </div>

          <article className="games-feature">
            <div className="games-feature__media">
              <GameArtwork game={featuredGame} priority />
            </div>
            <div className="games-feature__caption">
              <div>
                <h2>{featuredGame.title}</h2>
                <p>{featuredGame.platforms?.join(' / ')}</p>
              </div>
              {typeof featuredGame.hours === 'number' && (
                <strong>{formatHours(featuredGame.hours)} 小时</strong>
              )}
            </div>
          </article>
        </div>
      </section>

      <section className="games-chapters scene" data-nav-tone="default">
        <div className="container">
          <Reveal className="games-chapters__heading" variant="line">
            <h2>另外三段时间，也都留下来。</h2>
            <p>
              当前记录按公开时长排列。平台和更新时间只说明这份档案从哪里来，不代替我对游戏状态的判断。
            </p>
          </Reveal>

          <div className="games-chapters__list">
            {otherGames.map((game, index) => (
              <Reveal key={game.id} delay={Math.min(index * 80, 160)}>
                <article className="games-chapter">
                  <div className="games-chapter__media">
                    <GameArtwork game={game} />
                  </div>
                  <div className="games-chapter__body">
                    <h3>{game.title}</h3>
                    {typeof game.hours === 'number' && (
                      <p className="games-chapter__hours">{formatHours(game.hours)} 小时</p>
                    )}
                    <dl>
                      {game.platforms && (
                        <div>
                          <dt>平台</dt>
                          <dd>{game.platforms.join(' / ')}</dd>
                        </div>
                      )}
                      <div>
                        <dt>资料更新</dt>
                        <dd>{formatRecordDate(game.updatedAt)}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {reviewGames.length > 0 && (
        <section className="games-quotes scene" data-nav-tone="inverse">
          <div className="container grid-12 games-quotes__grid">
            <Reveal className="games-quotes__heading" variant="line">
              <h2>玩过以后，我确实留下过这两句话。</h2>
              <p>这里只保留我在 Steam 公开写过的原话，不替现在的自己补写评价。</p>
            </Reveal>

            <div className="games-quotes__list">
              {reviewGames.map((game, index) => (
                <Reveal key={game.id} delay={index * 90}>
                  <blockquote>
                    <p>{game.note}</p>
                    <footer>{game.title}</footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>

            <Reveal className="games-quotes__actions">
              {steamProfile && (
                <a href={steamProfile.href} target="_blank" rel="noreferrer">
                  打开我的 Steam 主页 <ArrowUpRight size={18} />
                </a>
              )}
              <Link to="/shelf">
                返回收藏馆 <ArrowUpRight size={18} />
              </Link>
            </Reveal>
          </div>
        </section>
      )}
    </>
  )
}
