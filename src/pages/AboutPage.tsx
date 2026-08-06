import { ArrowUpRight } from '../components/Icons'
import { PageHeader } from '../components/PageHeader'
import { ProfilePortrait } from '../components/ProfilePortrait'
import { Reveal } from '../components/Reveal'
import { profile } from '../data/content'

const aboutNotes = [
  ['慢一点，也没关系', '22 岁的我还有许多事情刚刚开始接触。慢并不只有遗憾，它也让我仍能认真体会一些对别人来说早已普通的事。', '关于成长'],
  ['正在学习', '我目前正在学习成为一名 AI 训练师。比起急着定义未来，我更想先理解眼前的新事物，再决定自己要走向哪里。', '现在'],
  ['想留下的印象', '比起一个职业标签，我更希望来访的人记住我身上独特的气质。它不急着被总结，会在经历和收藏里慢慢显出来。', '关于气质'],
]

export function AboutPage() {
  return (
    <>
      <PageHeader
        title="关于我"
        description="我是旺角西多士。这里不急着给我下定义，只先说清楚我从哪里来、正在学什么，以及为什么还在慢慢寻找自己的生活。"
        meta={<span className="meta-line">{profile.name} · {profile.location}</span>}
      />

      <section className="section scene about-story" data-nav-tone="default">
        <div className="container grid-12">
          <Reveal className="about-story__portrait">
            <ProfilePortrait src={profile.avatar} name={profile.name} tall />
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
            {aboutNotes.map(([title, description, label], index) => (
              <Reveal key={title} delay={Math.min(index * 70, 140)}>
                <article className="about-prompt">
                  <h2>{title}</h2>
                  <p>{description}</p>
                  <span>{label}</span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section scene contact-panel" data-nav-tone="inverse">
        <div className="container grid-12">
          <Reveal className="contact-panel__copy" variant="line">
            <h2>如果想继续聊聊，可以给我写封邮件。</h2>
          </Reveal>
          <Reveal className="contact-panel__links" delay={100}>
            {profile.links.length > 0 ? (
              profile.links.map((link) => {
                const opensNewTab = link.href.startsWith('http')

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target={opensNewTab ? '_blank' : undefined}
                    rel={opensNewTab ? 'noreferrer' : undefined}
                  >
                    {link.label} <ArrowUpRight />
                  </a>
                )
              })
            ) : (
              <p>邮箱与公开社交账号待补充。</p>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
