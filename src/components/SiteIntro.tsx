import { useEffect, useState, type CSSProperties } from 'react'

interface SiteIntroProps {
  onComplete: () => void
}

export function SiteIntro({ onComplete }: SiteIntroProps) {
  const [progress, setProgress] = useState(0)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete()
      return
    }

    let animationFrame = 0
    let leaveTimer = 0
    let completeTimer = 0
    let loadReady = document.readyState === 'complete'
    let fontsReady = !document.fonts
    const startedAt = performance.now()

    const markLoadReady = () => {
      loadReady = true
    }

    window.addEventListener('load', markLoadReady, { once: true })
    document.fonts?.ready.then(() => {
      fontsReady = true
    }).catch(() => {
      fontsReady = true
    })

    const finish = () => {
      setProgress(100)
      leaveTimer = window.setTimeout(() => setIsLeaving(true), 120)
      completeTimer = window.setTimeout(onComplete, 860)
    }

    const tick = (now: number) => {
      const elapsed = now - startedAt
      const resourcesReady = loadReady && fontsReady
      const waitingProgress = Math.min(94, Math.round((elapsed / 1350) * 94))
      const readyProgress = Math.min(99, Math.max(waitingProgress, Math.round((elapsed / 980) * 100)))

      setProgress(resourcesReady ? readyProgress : waitingProgress)

      if ((resourcesReady && elapsed >= 980) || elapsed >= 1850) {
        finish()
        return
      }

      animationFrame = window.requestAnimationFrame(tick)
    }

    animationFrame = window.requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('load', markLoadReady)
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(leaveTimer)
      window.clearTimeout(completeTimer)
    }
  }, [onComplete])

  const progressStyle = { '--intro-progress': progress / 100 } as CSSProperties

  return (
    <div className={`site-intro${isLeaving ? ' is-leaving' : ''}`} role="status" aria-live="polite">
      <span className="sr-only">正在打开个人索引</span>
      <div className="site-intro__top" aria-hidden="true">
        <span>PERSONAL INDEX</span>
        <span>ISSUE 01 / CURRENT</span>
      </div>

      <div className="site-intro__word" aria-hidden="true">
        <span>OPEN</span>
        <small>把散落的生活，按次序展开。</small>
      </div>

      <div className="site-intro__bottom" aria-hidden="true">
        <p>01 PERSON&nbsp;&nbsp;·&nbsp;&nbsp;02 SHELF&nbsp;&nbsp;·&nbsp;&nbsp;03 NOTES</p>
        <div className="site-intro__meter">
          <i style={progressStyle} />
        </div>
        <strong>{String(progress).padStart(2, '0')}%</strong>
      </div>
    </div>
  )
}
