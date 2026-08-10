import { Link } from '../router'
import { ArrowRight } from '../components/Icons'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'

export function NotFoundPage() {
  return (
    <>
      <PageHeader
        title="这里没有这一页"
        description="地址可能写错了，也可能是内容还没有公开。可以从下面两个入口继续浏览。"
        documentTitle="页面不存在"
        meta={<span className="not-found-code">404</span>}
      />
      <section className="section scene not-found-actions" data-nav-tone="default">
        <div className="container">
          <Reveal className="not-found-actions__grid">
            <Link className="button button--primary" to="/">
              返回首页 <ArrowRight />
            </Link>
            <Link className="button button--secondary" to="/shelf">
              进入收藏馆
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
