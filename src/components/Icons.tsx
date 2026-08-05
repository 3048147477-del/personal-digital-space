interface IconProps {
  size?: number
  className?: string
}

const iconProps = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className,
  'aria-hidden': true,
})

export function ArrowRight({ size = 20, className }: IconProps) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  )
}

export function ArrowUpRight({ size = 20, className }: IconProps) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )
}

export function MenuIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M4 8h16" />
      <path d="M4 16h16" />
    </svg>
  )
}

export function CloseIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  )
}

export function SunIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...iconProps(size, className)}>
      <circle cx="12" cy="12" r="3.25" />
      <path d="M12 2.5v2" />
      <path d="M12 19.5v2" />
      <path d="m5.3 5.3 1.4 1.4" />
      <path d="m17.3 17.3 1.4 1.4" />
      <path d="M2.5 12h2" />
      <path d="M19.5 12h2" />
      <path d="m5.3 18.7 1.4-1.4" />
      <path d="m17.3 6.7 1.4-1.4" />
    </svg>
  )
}

export function MoonIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...iconProps(size, className)}>
      <path d="M20.2 15.2A8.2 8.2 0 0 1 8.8 3.8 8.2 8.2 0 1 0 20.2 15.2Z" />
    </svg>
  )
}
