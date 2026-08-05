import { useEffect, type ReactNode } from 'react'
import { Reveal } from './Reveal'

interface PageHeaderProps {
  title: string
  description: string
  meta?: ReactNode
  documentTitle?: string
}

export function PageHeader({ title, description, meta, documentTitle }: PageHeaderProps) {
  useEffect(() => {
    document.title = `${documentTitle ?? title}｜个人数字空间`
  }, [documentTitle, title])

  return (
    <section className="page-hero scene" data-nav-tone="default">
      <div className="container grid-12 page-hero__grid">
        <Reveal className="page-hero__copy" variant="line">
          <h1>{title}</h1>
          <p>{description}</p>
        </Reveal>
        {meta && <Reveal className="page-hero__meta" delay={100}>{meta}</Reveal>}
      </div>
    </section>
  )
}
