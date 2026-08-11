import { Link } from '../router'
import { collections, getCollectionMeta } from '../data/content'
import type { Book, CollectionKind, Film, Game, Music } from '../types'
import { ArrowUpRight } from './Icons'
import { EmptyState } from './EmptyState'
import { PageHeader } from './PageHeader'
import { Reveal } from './Reveal'

type CollectionItem = Game | Book | Music | Film

const getCover = (item: CollectionItem) => ('poster' in item ? item.poster : item.cover)
const getArtwork = (item: CollectionItem) => ('artwork' in item && item.artwork ? item.artwork : getCover(item))
const getExternalLinkLabel = (kind: CollectionKind) => {
  if (kind === 'books') return '在微信读书查看'
  if (kind === 'music') return '在网易云音乐查看'
  return '查看原始页面'
}

const getDetails = (kind: CollectionKind, item: CollectionItem) => {
  if (kind === 'games') {
    const game = item as Game
    return [game.platforms?.join(' / '), typeof game.hours === 'number' ? `${game.hours} 小时` : undefined, game.status]
  }
  if (kind === 'books') {
    const book = item as Book
    return [book.author, book.status]
  }
  if (kind === 'music') {
    const track = item as Music
    return [track.artist, track.kind]
  }
  if (kind === 'films') {
    const film = item as Film
    return [film.releaseYear?.toString(), film.director]
  }
  return []
}

export function CollectionPage({ kind }: { kind: CollectionKind }) {
  const meta = getCollectionMeta(kind)
  const items = collections[kind] as CollectionItem[]
  const totalHours = kind === 'games'
    ? (collections.games as Game[]).reduce((total, game) => total + (game.hours ?? 0), 0)
    : 0

  return (
    <>
      <PageHeader
        title={meta.title}
        description={meta.description}
        meta={
          <div className="page-count">
            <strong>{items.length}</strong>
            <span>条公开记录</span>
            {kind === 'games' && totalHours > 0 && <span>{totalHours} 小时</span>}
          </div>
        }
      />

      <section className="scene collection-content" data-nav-tone="default">
        <div className="container">
          {items.length === 0 ? (
            <Reveal>
              <EmptyState
                title={meta.emptyTitle}
                description={meta.emptyDescription}
                fields={meta.fields}
              />
            </Reveal>
          ) : (
            <div className={`media-grid media-grid--${kind}`}>
              {items.map((item, index) => (
                <Reveal key={item.id} delay={Math.min(index * 70, 280)}>
                  <article className={`media-entry media-entry--${kind}`}>
                    <div className="media-entry__cover">
                      <img
                        src={getArtwork(item)}
                        alt={`${item.title}封面`}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          const fallback = getCover(item)
                          if (event.currentTarget.dataset.fallback !== 'true' && event.currentTarget.src !== fallback) {
                            event.currentTarget.dataset.fallback = 'true'
                            event.currentTarget.src = fallback
                            return
                          }
                          event.currentTarget.hidden = true
                        }}
                      />
                    </div>
                    <div className="media-entry__body">
                      <h2>{item.title}</h2>
                      <div className="media-entry__meta">
                        {getDetails(kind, item).filter(Boolean).map((detail) => (
                          <span key={detail}>{detail}</span>
                        ))}
                      </div>
                      {'note' in item && item.note && <p>{item.note}</p>}
                      {'externalUrl' in item && item.externalUrl && (
                        <a
                          className="media-entry__link"
                          href={item.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {getExternalLinkLabel(kind)} <ArrowUpRight size={17} />
                        </a>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          <div className="section-return">
            <Link className="text-link" to="/shelf">
              返回收藏馆 <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
