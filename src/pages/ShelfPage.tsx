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
const bookPreview = [...books]
  .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
  .slice(0, 4)
const syncedMusicCount = music.reduce((count, track) => count + (track.addedAt ? 1 : 0), 0)
const readingBookCount = books.filter((book) => book.status === '在读').length
const finishedBookCount = books.filter((book) => book.status === '读完').length
const wantToReadBookCount = books.filter((book) => book.status === '想读').length

const formatHours = (hours: number) => new Intl.NumberFormat('zh-CN', {
  maximumFractionDigits: 1,
}).format(hours)

const shelfFacts = [
  ['公开记录', `${totalRecords} 条`],
  ['游戏', `${games.length} 款`],
  ...(books.length > 0 ? [['书籍', `${books.length} 本`]] : []),
  ['音乐', `${music.length} 首`],
  ...(films.length > 0 ? [['电影', `${films.length} 部`]] : []),
  ['Steam 记录', `${formatHours(totalGameHours)} 小时`],
]

const bookStatusSummary = [
  readingBookCount > 0 ? `${readingBookCount} 本在读` : null,
  finishedBookCount > 0 ? `${finishedBookCount} 本读完` : null,
  wantToReadBookCount > 0 ? `${wantToReadBookCount} 本想读` : null,
].filter(Boolean).join(' · ')

export function ShelfPage() {
  useEffect(() => {
    document.title = `收藏馆｜${profile.name}`
  }, [])

  return (
    <>
      <section className="shelf-archive-hero scene" data-nav-tone="default" data-index-section="01">
        <div className="container grid-12 shelf-archive-hero__grid">
          <div className="shelf-archive-hero__copy">
            <p className="eyebrow">（COLLECTION DIRECTORY / 03）</p>
            <h1>
              <span>这些是我，</span>
              <span>认真喜欢过的东西。</span>
            </h1>
            <p>
              这里先放下 {games.length} 款游戏、{books.length} 本书和 {music.length} 首歌。
              顺着这些真实记录，可以看到我把时间留给了什么。
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

      <nav className="shelf-directory container" aria-label="收藏分类目录">
        <a href="#games"><span>01</span><strong>游戏</strong><small>{games.length} 款</small><ArrowUpRight size={18} /></a>
        <a href="#books"><span>02</span><strong>书籍</strong><small>{books.length} 本</small><ArrowUpRight size={18} /></a>
        <a href="#music"><span>03</span><strong>音乐</strong><small>{music.length} 首</small><ArrowUpRight size={18} /></a>
      </nav>

      <section id="games" className="shelf-room shelf-room--games scene" data-nav-tone="default" data-index-section="02">
        <div className="container">
          <Reveal className="shelf-room__heading" variant="line">
            <div>
              <span className="outline-marker outline-marker--small" aria-hidden="true">GAMES</span>
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

      {books.length > 0 ? (
        <section id="books" className="shelf-room shelf-room--books scene" data-nav-tone="default" data-index-section="03">
          <div className="container grid-12 shelf-books__grid">
            <Reveal className="shelf-books__copy" variant="line">
              <span className="outline-marker outline-marker--small" aria-hidden="true">BOOKS</span>
              <h2>正在读的，已经读完的。</h2>
              <p>
                先摊开书架里的四本。这里只保留书名、作者和真实阅读状态，完整书架里还有其余记录。
              </p>
              <span className="shelf-stat-badge">{bookStatusSummary}</span>
              <Link className="text-link" to="/shelf/books">
                查看完整书架 <ArrowUpRight size={18} />
              </Link>
            </Reveal>

            <div className="shelf-book-sheet">
              {bookPreview.map((book, index) => (
                <Reveal key={book.id} delay={Math.min(index * 70, 210)}>
                  <Link
                    className="shelf-book-record"
                    to="/shelf/books"
                    aria-label={`查看书籍记录：${book.title}，${book.author}`}
                  >
                    <div className="shelf-book-record__media">
                      <img
                        src={book.cover}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          event.currentTarget.hidden = true
                        }}
                      />
                    </div>
                    <div className="shelf-book-record__caption">
                      <span>{book.status}</span>
                      <h3>{book.title}</h3>
                      <p>{book.author}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="music" className="shelf-room shelf-room--music scene" data-nav-tone="default" data-index-section="04">
        <div className="container grid-12 shelf-music__grid">
          <Reveal className="shelf-music__copy" variant="line">
            <span className="outline-marker outline-marker--small" aria-hidden="true">MUSIC</span>
            <h2>反复听过的声音</h2>
            <p>
              {syncedMusicCount > 0
                ? `从 2025 年度歌单开始，后来又有 ${syncedMusicCount} 首真实记录加入。这里不代表完整品味，只留下可以确认的名字。`
                : '现在收录的是我的 2025 年度歌单片段。它们不代表完整品味，只是这一阶段确实留下来的声音。'}
            </p>
            <span className="shelf-stat-badge">{music.length} 首公开记录</span>
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

      <section className="section scene shelf-recent" data-nav-tone="default" data-index-section="05">
        <div className="container">
          <Reveal className="shelf-recent__heading" variant="line">
            <h2>最近整理的记录</h2>
            <p>按公开数据的更新时间排列。以后新增的收藏，也会从这里留下痕迹。</p>
          </Reveal>
          <RecentCollectionList />
        </div>
      </section>

      {films.length === 0 ? (
        <aside className="shelf-coda scene" data-nav-tone="default">
          <div className="container">
            <Reveal className="shelf-coda__note" variant="line">
              <strong>电影会晚一点出现。</strong>
              <p>等我真正想留下一部电影，它再加入这张收藏台。</p>
            </Reveal>
          </div>
        </aside>
      ) : null}
    </>
  )
}
