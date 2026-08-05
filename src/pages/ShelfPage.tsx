import { Link } from '../router'
import { CategoryArtwork } from '../components/CategoryArtwork'
import { ArrowUpRight } from '../components/Icons'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { collectionMeta, collections } from '../data/content'

export function ShelfPage() {
  const total = collectionMeta.reduce((sum, item) => sum + collections[item.kind].length, 0)

  return (
    <>
      <PageHeader
        title="收藏馆"
        description="游戏、书籍、音乐和电影分开整理，但它们共同组成一个人的长期偏好。"
        meta={
          <div className="page-count">
            <strong>{total}</strong>
            <span>条公开收藏</span>
          </div>
        }
      />

      <section className="section scene shelf-index" data-nav-tone="default">
        <div className="container shelf-index__list">
          {collectionMeta.map((item, index) => (
            <Reveal key={item.kind} delay={Math.min(index * 70, 210)}>
              <Link className={`shelf-index__item shelf-index__item--${item.kind}`} to={item.path}>
                <CategoryArtwork kind={item.kind} mark={item.mark} />
                <div className="shelf-index__body">
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </div>
                  <div className="shelf-index__meta">
                    <span>{collections[item.kind].length} 条记录</span>
                    <span className="shelf-index__action">
                      {item.action} <ArrowUpRight />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
