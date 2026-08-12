import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from '../router'
import { profile } from '../data/content'
import { ArrowUpRight, CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons'
import { SiteIntro } from './SiteIntro'

const navItems = [
  { index: '01', label: '首页', latin: 'HOME', path: '/' },
  { index: '02', label: '关于我', latin: 'ABOUT', path: '/about' },
  { index: '03', label: '收藏馆', latin: 'SHELF', path: '/shelf' },
]

type Theme = 'light' | 'dark'

const getPageIndex = (pathname: string) => {
  if (pathname === '/') return '01'
  if (pathname === '/about') return '02'
  if (pathname.startsWith('/shelf')) return '03'
  return '—'
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const nextTheme = theme === 'light' ? '暗色' : '亮色'

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={`切换到${nextTheme}模式`}
      title={`切换到${nextTheme}模式`}
    >
      <span>{theme === 'light' ? 'DARK' : 'LIGHT'}</span>
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

function Header({ theme, onThemeToggle }: { theme: Theme; onThemeToggle: () => void }) {
  const location = useLocation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [tone, setTone] = useState<'default' | 'inverse'>('default')
  const [sectionIndex, setSectionIndex] = useState('01')
  const pageIndex = getPageIndex(location.pathname)

  useEffect(() => {
    let animationFrame = 0
    const update = () => {
      setIsScrolled(window.scrollY > 24)
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1)
      document.documentElement.style.setProperty('--scroll-progress', String(progress))
    }
    const requestUpdate = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      document.documentElement.style.removeProperty('--scroll-progress')
    }
  }, [])

  useEffect(() => {
    setTone('default')
    setSectionIndex('01')
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-tone]'))
    if (!scenes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries.find((entry) => entry.isIntersecting)
        if (!active) return
        const element = active.target as HTMLElement
        setTone(element.dataset.navTone === 'inverse' ? 'inverse' : 'default')
        if (element.dataset.indexSection) setSectionIndex(element.dataset.indexSection)
      },
      { rootMargin: '-46% 0px -46% 0px', threshold: 0 },
    )

    scenes.forEach((scene) => observer.observe(scene))
    return () => observer.disconnect()
  }, [location.pathname])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (menuOpen && !dialog.open) {
      dialog.showModal()
      document.body.classList.add('menu-is-open')
    } else if (!menuOpen && dialog.open) {
      dialog.close()
      document.body.classList.remove('menu-is-open')
    }

    return () => document.body.classList.remove('menu-is-open')
  }, [menuOpen])

  useEffect(() => setMenuOpen(false), [location.pathname])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`} data-tone={tone}>
        <div className="site-header__inner container">
          <Link className="site-mark" to="/" aria-label="返回首页">
            <span className="site-mark__kicker">INDEX OF</span>
            <strong>{profile.name}</strong>
          </Link>

          <nav className="desktop-nav" aria-label="主导航">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}>
                <span aria-hidden="true">{item.index}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <span className="site-progress" role="status" aria-label={`第 ${pageIndex} 页，当前章节 ${sectionIndex}`}>
              <strong>{pageIndex}</strong><span>/03</span><i>{sectionIndex}</i>
            </span>
            <div className="desktop-theme-toggle">
              <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            </div>
            <button
              className="menu-toggle"
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="打开导航菜单"
              aria-expanded={menuOpen}
            >
              <span>MENU</span>
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        className="mobile-menu"
        onClose={() => setMenuOpen(false)}
        onCancel={closeMenu}
      >
        <div className="mobile-menu__top">
          <div>
            <span>PERSONAL INDEX</span>
            <strong>{profile.name}</strong>
          </div>
          <button className="menu-toggle menu-toggle--close" type="button" onClick={closeMenu} aria-label="关闭导航菜单">
            <span>CLOSE</span>
            <CloseIcon />
          </button>
        </div>
        <nav className="mobile-menu__nav" aria-label="移动端主导航">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={closeMenu}>
              <i>{item.index}</i>
              <span>{item.label}</span>
              <small>{item.latin}</small>
              <ArrowUpRight />
            </NavLink>
          ))}
        </nav>
        <div className="mobile-menu__footer">
          <span>PAGE {pageIndex} / 03</span>
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </dialog>
    </>
  )
}

function Footer() {
  const email = profile.links.find((link) => link.href.startsWith('mailto:'))

  return (
    <footer className="site-footer" data-nav-tone="inverse">
      <div className="container site-footer__inner">
        <p className="site-footer__eyebrow">（KEEP IN TOUCH）</p>
        <h2 aria-hidden="true">SAY<br />HELLO.</h2>
        <div className="site-footer__statement">
          <p>想聊聊游戏、音乐，或者只是想认识我，都可以写信来。</p>
          {email ? <a className="footer-email" href={email.href}>{email.label}<ArrowUpRight /></a> : null}
        </div>
        <nav className="site-footer__links" aria-label="页尾导航">
          {navItems.map((item) => <Link key={item.path} to={item.path}>{item.index} {item.label}</Link>)}
        </nav>
        <div className="site-footer__meta">
          <span>{profile.name}的个人数字空间</span>
          <span>真实记录，继续生长</span>
        </div>
      </div>
    </footer>
  )
}

function ScrollRestoration() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [introVisible, setIntroVisible] = useState(() =>
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [siteReady, setSiteReady] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )

  useEffect(() => {
    document.documentElement.classList.toggle('site-is-ready', siteReady)
    document.body.classList.toggle('site-is-loading', !siteReady)

    return () => {
      document.documentElement.classList.remove('site-is-ready')
      document.body.classList.remove('site-is-loading')
    }
  }, [siteReady])

  const completeIntro = useCallback(() => {
    setSiteReady(true)
    setIntroVisible(false)
  }, [])

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.dataset.theme = nextTheme
    try {
      localStorage.setItem('personal-space-theme', nextTheme)
    } catch {
      // Theme still works for the current visit when storage is unavailable.
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <ScrollRestoration />
      <Header theme={theme} onThemeToggle={toggleTheme} />
      <main id="main-content" className="page-shell" tabIndex={-1}>{children}</main>
      <Footer />
      {introVisible ? <SiteIntro onComplete={completeIntro} /> : null}
    </>
  )
}
