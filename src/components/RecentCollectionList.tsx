import { ArrowUpRight } from './Icons'
import { Reveal } from './Reveal'
import { collections, publicCollectionMeta } from '../data/content'
import { Link } from '../router'

const formatHours = (hours: number) => new Intl.NumberFormat('zh-CN', {
  maximumFractionDigits: 1,
}).format(hours)

const formatRecordDate = (date: string) => new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'short',
}).format(new Date(`${date}T00:00:00`))

export function RecentCollectionList({ limit = 4 }: { limit?: number }) {
  const recentItems = publicCollectionMeta
    .flatMap((meta) => collections[meta.kind].map((item) => ({
      id: `${meta.kind}-${item.id}`,
      title: item.title,
      category: meta.title,
      path: meta.path,
      updatedAt: item.updatedAt,
      cover: 'poster' in item ? item.poster : item.cover,
      detail: 'hours' in item && typeof item.hours === 'number'
        ? `${formatHours(item.hours)} 小时`
        : 'artist' in item
          ? item.artist
          : 'author' in item
            ? `${item.author} · ${item.status}`
            : 'director' in item
              ? item.director
              : undefined,
    })))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit)

  return (
    <div className="recent-list">
      {recentItems.map((item, index) => (
        <Reveal key={item.id} delay={Math.min(index * 70, 210)}>
          <Link className="recent-item" to={item.path}>
            <span className="recent-item__image">
              <img
                src={item.cover}
                alt=""
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.hidden = true
                }}
              />
            </span>
            <span className="recent-item__category">{item.category}</span>
            <div>
              <h3>{item.title}</h3>
              {item.detail && <p>{item.detail}</p>}
            </div>
            <time dateTime={item.updatedAt}>{formatRecordDate(item.updatedAt)}</time>
            <ArrowUpRight size={19} />
          </Link>
        </Reveal>
      ))}
    </div>
  )
}
