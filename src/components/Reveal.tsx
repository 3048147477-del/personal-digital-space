import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'

export type RevealVariant = 'soft' | 'line' | 'editorial' | 'media' | 'marker' | 'row' | 'story'

interface RevealProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode
  className?: string
  delay?: number
  variant?: RevealVariant
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'soft',
  style: providedStyle,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observedElement = element

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    let animationFrame = 0
    let hasRevealed = false
    let observer: IntersectionObserver | undefined

    function reveal() {
      if (hasRevealed) return
      hasRevealed = true
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestCheck)
      window.removeEventListener('resize', requestCheck)
      observer?.disconnect()
      setIsVisible(true)
    }

    function checkBounds() {
      const bounds = observedElement.getBoundingClientRect()
      if (bounds.top < window.innerHeight * 0.94 && bounds.bottom > window.innerHeight * 0.04) reveal()
    }

    function requestCheck() {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(checkBounds)
    }

    checkBounds()
    if (hasRevealed) return

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        reveal()
      },
      { threshold: 0.04, rootMargin: '0px 0px -4% 0px' },
    )

    observer.observe(observedElement)
    window.addEventListener('scroll', requestCheck, { passive: true })
    window.addEventListener('resize', requestCheck)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestCheck)
      window.removeEventListener('resize', requestCheck)
      observer?.disconnect()
    }
  }, [delay, variant])

  const style = { ...providedStyle, '--reveal-delay': `${delay}ms` } as CSSProperties

  return (
    <div
      {...rest}
      ref={ref}
      className={`reveal reveal--${variant} ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  )
}
