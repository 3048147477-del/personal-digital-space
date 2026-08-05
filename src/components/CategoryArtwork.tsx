import type { CollectionKind } from '../types'

interface CategoryArtworkProps {
  kind: CollectionKind
  mark: string
}

export function CategoryArtwork({ kind, mark }: CategoryArtworkProps) {
  return (
    <div className={`category-art category-art--${kind}`} aria-hidden="true">
      <span className="category-art__mark">{mark}</span>
      <span className="category-art__line category-art__line--one" />
      <span className="category-art__line category-art__line--two" />
      <span className="category-art__shape category-art__shape--one" />
      <span className="category-art__shape category-art__shape--two" />
    </div>
  )
}
