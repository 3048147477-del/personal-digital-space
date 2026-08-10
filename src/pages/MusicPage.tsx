import { useEffect } from 'react'
import { CollectionPage } from '../components/CollectionPage'
import { ArrowUpRight } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { music, profile } from '../data/content'
import { Link } from '../router'
import type { Music } from '../types'

const DIRECTION_CONTRACT = `
MUSIC PAGE V2
THESIS: Six verified songs become one unfolded annual-playlist insert; refuse the generic media-card grid.
OWN-WORLD: Quiet Reveal paper, charcoal type, mint details, square covers, fine fold rules, restrained image lift.
STORY: See the complete 2025 set, follow each numbered record, then continue on NetEase Cloud Music or return to the shelf.
FIRST VIEWPORT: Narrow headline at left; six equal cover panels form one wide accordion fold at right; the ledger begins below.
FORM: Grounded structure 4, flat six-panel foldout, seed a9e52f2e.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
`.trim()

const formatIndex = (index: number) => String(index + 1).padStart(2, '0')

function MusicCover({ track, loading = 'lazy' }: { track: Music; loading?: 'eager' | 'lazy' }) {
  return (
    <span className="music-cover">
      <img
        src={track.cover}
        alt={`${track.title}封面`}
        loading={loading}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={(event) => {
          event.currentTarget.hidden = true
        }}
      />
    </span>
  )
}

export function MusicPage() {
  const cloudProfile = profile.links.find((link) => link.label === '网易云音乐')
  const artistCount = new Set(music.map((track) => track.artist)).size

  useEffect(() => {
    document.title = `音乐｜${profile.name}`

    const contractComment = document.createComment(DIRECTION_CONTRACT)
    document.body.insertBefore(contractComment, document.body.firstChild)

    return () => {
      contractComment.remove()
    }
  }, [])

  if (music.length === 0) {
    return <CollectionPage kind="music" />
  }

  return (
    <>
      <section className="music-hero scene" data-nav-tone="default">
        <div className="container grid-12 music-hero__grid">
          <Reveal className="music-hero__copy" variant="line">
            <h1>
              <span>六首歌，</span>
              <span>来自我的</span>{' '}
              <span>2025 年度歌单。</span>
            </h1>
            <p>
              {music.length} 首歌，{artistCount} 位音乐人。这里没有播放次数和排行榜，只把那份歌单里真实留下的声音摊开。
            </p>
          </Reveal>

          <ol className="music-foldout" aria-label="2025 年度歌单中的六首歌">
            {music.map((track, index) => {
              const content = (
                <>
                  <MusicCover track={track} loading="eager" />
                  <span className="music-foldout__caption">
                    <span aria-hidden="true">{formatIndex(index)}</span>
                    <strong>{track.title}</strong>
                  </span>
                </>
              )

              return (
                <li key={track.id}>
                  <Reveal delay={index * 55}>
                    {track.externalUrl ? (
                      <a
                        href={track.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`在网易云音乐查看${track.title}`}
                      >
                        {content}
                      </a>
                    ) : (
                      <div>{content}</div>
                    )}
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="music-ledger scene" data-nav-tone="default">
        <div className="container">
          <div className="music-ledger__heading">
            <Reveal variant="line">
              <h2>摊开以后，是六首歌的名字。</h2>
            </Reveal>
            <Reveal delay={100}>
              <p>
                它们都来自同一份 2025 年度歌单。逐条保留歌曲、音乐人和原始平台入口，不替过去的自己补写新的理由。
              </p>
            </Reveal>
          </div>

          <ol className="music-track-list">
            {music.map((track, index) => (
              <li key={track.id}>
                <Reveal delay={Math.min(index * 60, 240)}>
                  {track.externalUrl ? (
                    <a
                      className="music-track"
                      href={track.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="music-track__number" aria-hidden="true">
                        {formatIndex(index)}
                      </span>
                      <MusicCover track={track} />
                      <span className="music-track__copy">
                        <strong>{track.title}</strong>
                        <span>{track.artist} · {track.kind}</span>
                      </span>
                      <span className="music-track__action">
                        在网易云音乐查看 <ArrowUpRight size={18} />
                      </span>
                    </a>
                  ) : (
                    <article className="music-track">
                      <span className="music-track__number" aria-hidden="true">
                        {formatIndex(index)}
                      </span>
                      <MusicCover track={track} />
                      <span className="music-track__copy">
                        <strong>{track.title}</strong>
                        <span>{track.artist} · {track.kind}</span>
                      </span>
                    </article>
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="music-outro scene" data-nav-tone="default">
        <div className="container music-outro__grid">
          <Reveal variant="line">
            <h2>这页先停在这六首。</h2>
          </Reveal>
          <Reveal className="music-outro__body" delay={100}>
            <p>新的真实记录会继续放进收藏馆；现在可以回到歌单原页，或者去看看别的收藏。</p>
            <div className="music-outro__actions">
              {cloudProfile && (
                <a href={cloudProfile.href} target="_blank" rel="noreferrer">
                  打开我的网易云主页 <ArrowUpRight size={18} />
                </a>
              )}
              <Link to="/shelf">
                返回收藏馆 <ArrowUpRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
