import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'

interface RouterState {
  pathname: string
  navigate: (to: string) => void
}

const RouterContext = createContext<RouterState | null>(null)

const basePath = import.meta.env.BASE_URL === '/'
  ? ''
  : import.meta.env.BASE_URL.replace(/\/+$/, '')

const toBrowserPath = (pathname: string) => {
  if (!basePath) return pathname
  return pathname === '/' ? `${basePath}/` : `${basePath}${pathname}`
}

const getPathname = () => {
  const browserPathname = window.location.pathname || '/'
  const pathname = basePath && browserPathname.startsWith(`${basePath}/`)
    ? browserPathname.slice(basePath.length) || '/'
    : browserPathname === basePath ? '/' : browserPathname
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => unknown
}

const commitWithTransition = (update: () => void) => {
  const transitionDocument = document as TransitionDocument
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!transitionDocument.startViewTransition || reduceMotion) {
    update()
    return
  }
  transitionDocument.startViewTransition(() => flushSync(update))
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(getPathname)

  useEffect(() => {
    const handlePopState = () => commitWithTransition(() => setPathname(getPathname()))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const value = useMemo<RouterState>(
    () => ({
      pathname,
      navigate: (to) => {
        const nextPath = to.length > 1 ? to.replace(/\/+$/, '') : to
        if (nextPath === pathname) return
        commitWithTransition(() => {
          window.history.pushState(null, '', toBrowserPath(nextPath))
          setPathname(nextPath)
        })
      },
    }),
    [pathname],
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useLocation() {
  const context = useContext(RouterContext)
  if (!context) throw new Error('useLocation must be used inside RouterProvider')
  return { pathname: context.pathname }
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
}

export function Link({ to, onClick, target, children, ...props }: LinkProps) {
  const context = useContext(RouterContext)
  if (!context) throw new Error('Link must be used inside RouterProvider')

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === '_blank'
    ) {
      return
    }

    event.preventDefault()
    context.navigate(to)
  }

  return (
    <a {...props} href={toBrowserPath(to)} target={target} onClick={handleClick}>
      {children}
    </a>
  )
}

interface NavLinkProps extends LinkProps {
  end?: boolean
}

export function NavLink({ to, end = false, className = '', ...props }: NavLinkProps) {
  const { pathname } = useLocation()
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)
  const classes = `${className} ${isActive ? 'active' : ''}`.trim()

  return <Link {...props} to={to} className={classes} aria-current={isActive ? 'page' : undefined} />
}
