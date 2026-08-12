import { useEffect } from 'react'
import { CollectionPage } from '../components/CollectionPage'
import { ArrowUpRight } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { music, profile } from '../data/content'
import { Link } from '../router'
import type { Music } from '../types'

const formatIndex = (index: number) => String(index + 1).padStart(2, '0')
const addedDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})
const formatAddedDate = (date: string) => addedDateFormatter.format(new Date(`${date}T00:00:00`))

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
  const markedFeaturedMusic = music.filter((track) => track.featured)
  const featuredMusic = markedFeaturedMusic.length > 0 ? markedFeaturedMusic.slice(0, 6) : music.slice(0, 6)
  const artistCount = new Set(featuredMusic.map((track) => track.artist)).size
  const addedMusicCount = music.reduce((count, track) => count + (track.addedAt ? 1 : 0), 0)

  useEffect(() => {
    document.title = `音乐｜${profile.name}`
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
              {featuredMusic.length} 首歌，{artistCount} 位音乐人。这里没有播放次数和排行榜，只把那份歌单里真实留下的声音摊开。
            </p>
          </Reveal>

          <ol className="music-foldout" aria-label={`2025 年度歌单中的 ${featuredMusic.length} 首歌`}>
            {featuredMusic.map((track, index) => {
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
              <h2>{addedMusicCount > 0 ? '年度六首之后，新的声音继续加入。' : '摊开以后，是六首歌的名字。'}</h2>
            </Reveal>
            <Reveal delay={100}>
              {addedMusicCount > 0 ? (
                <p>
                  首屏仍保留 2025 年度歌单；后来加入的 {addedMusicCount} 首按首次进入本站的日期记录，不把它写成真实收听时间。
                </p>
              ) : (
                <p>
                  它们都来自同一份 2025 年度歌单。逐条保留歌曲、音乐人和原始平台入口，不替过去的自己补写新的理由。
                </p>
              )}
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
                        <span>
                          {track.artist} · {track.kind}
                          {track.addedAt ? ` · ${formatAddedDate(track.addedAt)}加入本站` : ''}
                        </span>
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
                        <span>
                          {track.artist} · {track.kind}
                          {track.addedAt ? ` · ${formatAddedDate(track.addedAt)}加入本站` : ''}
                        </span>
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
            <h2>{addedMusicCount > 0 ? `现在，这里有 ${music.length} 首。` : '这页先停在这六首。'}</h2>
          </Reveal>
          <Reveal className="music-outro__body" delay={100}>
            <p>
              {addedMusicCount > 0
                ? '年度歌单没有被新记录替换；它留在开头，后面的声音继续按真实资料加入。'
                : '新的真实记录会继续放进收藏馆；现在可以回到歌单原页，或者去看看别的收藏。'}
            </p>
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
