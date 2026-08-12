import { useEffect } from 'react'
import { ArrowUpRight } from '../components/Icons'
import { ProfilePortrait } from '../components/ProfilePortrait'
import { Reveal } from '../components/Reveal'
import { profile } from '../data/content'

const identityFacts = [
  ['公开昵称', profile.name],
  ['年龄', '22 岁'],
  ['来自', '海南文昌'],
  ['现在', '学习成为 AI 训练师'],
]

const aboutNotes = [
  {
    title: '慢一点，也没关系',
    description: '22 岁的我还有许多事情刚刚开始接触。慢并不只有遗憾，它也让我仍能认真体会一些对别人来说早已普通的事。',
  },
  {
    title: '现在在学什么',
    description: '我目前正在学习成为一名 AI 训练师。这是我现在在做的事，但不是我的全部身份。比起急着定义未来，我更想先理解眼前的新事物。',
  },
  {
    title: '希望你记住什么',
    description: '比起一个职业标签，我更希望来访的人记住我身上的独特气质。它很难靠一句话说清楚，会在我经历过、玩过和听过的东西里慢慢显出来。',
  },
]

export function AboutPage() {
  useEffect(() => {
    document.title = `关于我｜个人数字空间`
  }, [])

  return (
    <>
      <section className="about-archive-hero scene" data-nav-tone="default">
        <div className="container grid-12 about-archive-hero__grid">
          <div className="about-archive-hero__copy">
            <h1 className="about-archive-hero__title">
              <span>我暂时不急着，</span>
              <span>给自己下定义。</span>
            </h1>
            <p>
              我是旺角西多士。这里先说清楚我从哪里来、正在学什么，以及为什么还在慢慢寻找自己的生活。
            </p>
          </div>

          <aside className="about-archive-hero__index" aria-label="个人事实">
            <dl>
              {identityFacts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="about-portrait-story scene" data-nav-tone="default">
        <div className="container grid-12 about-portrait-story__grid">
          <Reveal className="about-portrait-story__media">
            <ProfilePortrait src={profile.avatar} name={profile.name} priority />
            <p>目前的公开头像：一只穿着西装的柴犬。</p>
          </Reveal>

          <Reveal className="about-portrait-story__copy" delay={100}>
            <h2>成长得慢一些，世界也还新鲜。</h2>
            <p>{profile.longBio}</p>
            <div className="about-current">
              <span>现在正在做</span>
              <strong>{profile.currentStatus}</strong>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section scene about-reflections" data-nav-tone="default">
        <div className="container">
          <Reveal className="about-reflections__heading" variant="line">
            <h2>我现在这样理解自己。</h2>
            <p>这些不是固定答案，只是我在这个阶段愿意认真说出来的部分。</p>
          </Reveal>

          <div className="about-reflections__list">
            {aboutNotes.map((note, index) => (
              <Reveal key={note.title} delay={Math.min(index * 80, 160)}>
                <article className="about-reflection">
                  <h3>{note.title}</h3>
                  <p>{note.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-contact scene" data-nav-tone="default">
        <div className="container grid-12 about-contact__grid">
          <Reveal className="about-contact__copy" variant="line">
            <h2>想聊聊游戏、音乐，或者只是认识一下我。</h2>
          </Reveal>
          <Reveal className="about-contact__links" delay={100}>
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
