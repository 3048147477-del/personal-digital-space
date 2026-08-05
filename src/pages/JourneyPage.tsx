import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { experiences } from '../data/content'

export function JourneyPage() {
  return (
    <>
      <PageHeader
        title="我的经历"
        description="按时间留下学习、工作、转折和重要选择。这里记录发生了什么，也记录为什么值得记住。"
        meta={<span className="meta-line">{experiences.length} 个公开节点</span>}
      />

      <section className="section scene journey-page" data-nav-tone="default">
        <div className="container">
          {experiences.length === 0 ? (
            <Reveal>
              <EmptyState
                title="时间线还没有真实节点"
                description="先准备四到六段经历和准确时间。每段只需要说清发生了什么，以及它怎样改变了你。"
                fields={['起止时间', '事件名称', '组织或地点', '具体说明', '可选图片或链接']}
              />
            </Reveal>
          ) : (
            <div className="timeline-list timeline-list--full">
              {experiences.map((item, index) => (
                <Reveal key={item.id} delay={Math.min(index * 70, 280)}>
                  <article className="timeline-item">
                    <time>
                      {item.startDate}
                      {item.endDate && ` — ${item.endDate}`}
                    </time>
                    <div>
                      <h2>{item.title}</h2>
                      {item.organization && <span>{item.organization}</span>}
                      <p>{item.description}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
