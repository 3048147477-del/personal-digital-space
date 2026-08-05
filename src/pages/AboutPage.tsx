import { ArrowUpRight } from '../components/Icons'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { profile } from '../data/content'

const aboutPrompts = [
  ['身份与经历', '你希望别人首先知道的身份，以及它们之间的关系。'],
  ['在意的事情', '长期影响你选择、创作和生活方式的几件事。'],
  ['现在的状态', '此刻正在做什么，正在学习什么，或者正在等待什么。'],
]

export function AboutPage() {
  return (
    <>
      <PageHeader
        title="关于我"
        description="这个页面不会用几个标签快速定义一个人。它会从真实经历、选择与日常兴趣开始。"
        meta={<span className="meta-line">个人资料待补充</span>}
      />

      <section className="section scene about-story" data-nav-tone="default">
        <div className="container grid-12">
          <Reveal className="about-story__portrait">
            <div className="portrait-placeholder portrait-placeholder--tall" role="img" aria-label="人物图片待补充">
              <span className="portrait-placeholder__name">YOU</span>
              <span className="portrait-placeholder__note">人物图片待补充</span>
              <span className="portrait-placeholder__orbit" aria-hidden="true" />
            </div>
          </Reveal>
          <Reveal className="about-story__copy" delay={100}>
            <h2>{profile.name}</h2>
            <p>{profile.longBio}</p>
            <div className="about-story__status">
              <span>当前状态</span>
              <strong>{profile.currentStatus}</strong>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section scene about-prompts" data-nav-tone="default">
        <div className="container">
          <div className="about-prompt-list">
            {aboutPrompts.map(([title, description], index) => (
              <Reveal key={title} delay={Math.min(index * 70, 140)}>
                <article className="about-prompt">
                  <h2>{title}</h2>
                  <p>{description}</p>
                  <span>等待真实内容</span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section scene contact-panel" data-nav-tone="inverse">
        <div className="container grid-12">
          <Reveal className="contact-panel__copy" variant="line">
            <h2>如果想继续了解我，联系方式会放在这里。</h2>
          </Reveal>
          <Reveal className="contact-panel__links" delay={100}>
            {profile.links.length > 0 ? (
              profile.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label} <ArrowUpRight />
                </a>
              ))
            ) : (
              <p>邮箱与公开社交账号待补充。</p>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
