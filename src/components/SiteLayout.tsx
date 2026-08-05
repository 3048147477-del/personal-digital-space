import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from '../router'
import { ArrowUpRight, CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons'

const navItems = [
  { label: '首页', path: '/' },
  { label: '关于我', path: '/about' },
  { label: '经历', path: '/journey' },
  { label: '收藏馆', path: '/shelf' },
]

type Theme = 'light' | 'dark'

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

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 32)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    setTone('default')
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-tone]'))
    if (!scenes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries.find((entry) => entry.isIntersecting)
        if (!active) return
        setTone(active.target.getAttribute('data-nav-tone') === 'inverse' ? 'inverse' : 'default')
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
      <header
        className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}
        data-tone={tone}
      >
        <div className="site-header__inner container">
          <Link className="site-mark" to="/" aria-label="返回首页">
            <span className="site-mark__dot" aria-hidden="true" />
            <span>个人数字空间</span>
          </Link>

          <nav className="desktop-nav" aria-label="主导航">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
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
          <span>导航</span>
          <button className="menu-toggle" type="button" onClick={closeMenu} aria-label="关闭导航菜单">
            <CloseIcon />
          </button>
        </div>
        <nav className="mobile-menu__nav" aria-label="移动端主导航">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={closeMenu}>
              <span>{item.label}</span>
              <ArrowUpRight />
            </NavLink>
          ))}
        </nav>
        <div className="mobile-menu__footer">
          <span>主题</span>
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </dialog>
    </>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__statement">
          <p>如果你对这里的某段经历或某样收藏感兴趣，欢迎回来继续看看。</p>
          <span>公开联系方式待补充</span>
        </div>
        <div className="site-footer__links">
          <Link to="/about">关于我</Link>
          <Link to="/journey">经历</Link>
          <Link to="/shelf">收藏馆</Link>
        </div>
        <div className="site-footer__meta">
          <span>个人数字空间</span>
          <span>内容持续整理中</span>
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
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )

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
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <ScrollRestoration />
      <Header theme={theme} onThemeToggle={toggleTheme} />
      <main id="main-content" className="page-shell" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}
