import type { CollectionKind } from '../types'

interface CategoryArtworkProps {
  kind: CollectionKind
  mark: string
  images?: Array<{
    src: string
    label: string
  }>
}

export function CategoryArtwork({ kind, mark, images = [] }: CategoryArtworkProps) {
  const mediaLimit = kind === 'music' ? 6 : kind === 'games' ? 4 : 1
  const visibleImages = images.slice(0, mediaLimit)
  const hasMedia = visibleImages.length > 0

  return (
    <div
      className={`category-art category-art--${kind}${hasMedia ? ' category-art--has-media' : ''}`}
      aria-hidden="true"
    >
      <span className="category-art__mark">{mark}</span>
      <span className="category-art__line category-art__line--one" />
      <span className="category-art__line category-art__line--two" />
      <span className="category-art__shape category-art__shape--one" />
      <span className="category-art__shape category-art__shape--two" />
      {hasMedia && (
        <div className="category-art__media">
          {visibleImages.map((image) => (
            <img
              key={image.src}
              src={image.src}
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.hidden = true
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
