import { useEffect } from 'react'
import { ArrowUpRight } from '../components/Icons'
import { RecentCollectionList } from '../components/RecentCollectionList'
import { Reveal } from '../components/Reveal'
import { books, films, games, music, profile } from '../data/content'
import { Link } from '../router'

const totalGameHours = games.reduce((sum, game) => sum + (game.hours ?? 0), 0)
const totalRecords = games.length + books.length + music.length + films.length
const musicPreview = [...music]
  .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
  .slice(0, 6)
const syncedMusicCount = music.reduce((count, track) => count + (track.addedAt ? 1 : 0), 0)

const formatHours = (hours: number) => new Intl.NumberFormat('zh-CN', {
  maximumFractionDigits: 1,
}).format(hours)

const shelfFacts = [
  ['公开记录', `${totalRecords} 条`],
  ['游戏', `${games.length} 款`],
  ['音乐', `${music.length} 首`],
  ...(books.length > 0 ? [['书籍', `${books.length} 本`]] : []),
  ...(films.length > 0 ? [['电影', `${films.length} 部`]] : []),
  ['Steam 记录', `${formatHours(totalGameHours)} 小时`],
]

export function ShelfPage() {
  useEffect(() => {
    document.title = `收藏馆｜${profile.name}`
  }, [])

  return (
    <>
      <section className="shelf-archive-hero scene" data-nav-tone="default">
        <div className="container grid-12 shelf-archive-hero__grid">
          <div className="shelf-archive-hero__copy">
            <h1>
              <span>这些是我，</span>
              <span>认真喜欢过的东西。</span>
            </h1>
            <p>
              {books.length > 0
                ? '目前公开游戏、音乐与书籍。电影不会用占位填满，等我真正留下第一条记录后再加入。'
                : '目前先公开游戏与音乐。书籍和电影不会用占位填满，等我真正留下第一条记录后再加入。'}
            </p>
          </div>

          <aside className="shelf-archive-hero__facts" aria-label="收藏统计">
            <dl>
              {shelfFacts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="shelf-room shelf-room--games scene" data-nav-tone="default">
        <div className="container">
          <Reveal className="shelf-room__heading" variant="line">
            <div>
              <h2>游戏与时长</h2>
              <p>比起一张“最喜欢”清单，我更想先留下真正花过的时间。</p>
            </div>
            <span>{games.length} 款 · {formatHours(totalGameHours)} 小时</span>
          </Reveal>

          <div className="shelf-game-sheet">
            {games.map((game, index) => (
              <Reveal key={game.id} delay={index * 80}>
                <Link
                  className="shelf-game-record"
                  to="/shelf/games"
                  aria-label={`查看游戏记录：${game.title}`}
                >
                  <div className="shelf-game-record__media">
                    <img
                      src={game.artwork ?? game.cover}
                      alt=""
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(event) => {
                        if (event.currentTarget.src !== game.cover) event.currentTarget.src = game.cover
                        else event.currentTarget.hidden = true
                      }}
                    />
                  </div>
                  <div className="shelf-game-record__caption">
                    <h3>{game.title}</h3>
                    {typeof game.hours === 'number' && <span>{formatHours(game.hours)} 小时</span>}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="shelf-room__action">
            <Link className="text-link" to="/shelf/games">
              查看全部游戏记录 <ArrowUpRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="shelf-room shelf-room--music scene" data-nav-tone="default">
        <div className="container grid-12 shelf-music__grid">
          <Reveal className="shelf-music__copy" variant="line">
            <h2>反复听过的声音</h2>
            <p>
              {syncedMusicCount > 0
                ? `从 2025 年度歌单开始，后来又有 ${syncedMusicCount} 首真实记录加入。这里不代表完整品味，只留下可以确认的名字。`
                : '现在收录的是我的 2025 年度歌单片段。它们不代表完整品味，只是这一阶段确实留下来的声音。'}
            </p>
            <span>{music.length} 首公开记录</span>
            <Link className="text-link" to="/shelf/music">
              查看全部音乐记录 <ArrowUpRight size={18} />
            </Link>
          </Reveal>

          <div className="shelf-music-sheet">
            {musicPreview.map((track, index) => (
              <Reveal key={track.id} delay={Math.min(index * 60, 240)}>
                <Link
                  className="shelf-music-record"
                  to="/shelf/music"
                  aria-label={`查看音乐记录：${track.title}，${track.artist}`}
                >
                  <div className="shelf-music-record__media">
                    <img
                      src={track.cover}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(event) => {
                        event.currentTarget.hidden = true
                      }}
                    />
                  </div>
                  <div className="shelf-music-record__caption">
                    <h3>{track.title}</h3>
                    <span>{track.artist}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section scene shelf-recent" data-nav-tone="default">
        <div className="container">
          <Reveal className="shelf-recent__heading" variant="line">
            <h2>最近整理的记录</h2>
            <p>按公开数据的更新时间排列。以后新增的收藏，也会从这里留下痕迹。</p>
          </Reveal>
          <RecentCollectionList />
        </div>
      </section>

      {(books.length === 0 || films.length === 0) ? (
        <section className="shelf-future scene" data-nav-tone="inverse">
          <div className="container grid-12 shelf-future__grid">
            <Reveal className="shelf-future__copy" variant="line">
              <h2>{books.length > 0 ? '书架打开了，电影还空着。' : '还有两层，先空着。'}</h2>
            </Reveal>
            <Reveal className="shelf-future__note" delay={100}>
              <p>
                {books.length > 0
                  ? `书架已经有 ${books.length} 本真实记录；电影会在第一条记录出现后再开放。`
                  : '书籍和电影会在我真正想留下一条记录时出现。在那之前，这里不摆假封面。'}
              </p>
              {books.length > 0 ? (
                <div className="music-outro__actions">
                  <Link to="/shelf/books">
                    查看书籍记录 <ArrowUpRight size={18} />
                  </Link>
                </div>
              ) : null}
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  )
}
