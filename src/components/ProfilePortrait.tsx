interface ProfilePortraitProps {
  src?: string
  name: string
  tall?: boolean
  priority?: boolean
}

export function ProfilePortrait({
  src,
  name,
  tall = false,
  priority = false,
}: ProfilePortraitProps) {
  if (src) {
    return (
      <figure className={`profile-portrait${tall ? ' profile-portrait--tall' : ''}`}>
        <img
          src={src}
          alt={`${name}的头像：一只穿着西装的柴犬`}
          width="736"
          height="736"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
        />
      </figure>
    )
  }

  return (
    <div
      className={`portrait-placeholder${tall ? ' portrait-placeholder--tall' : ''}`}
      role="img"
      aria-label="人物图片待补充"
    >
      <span className="portrait-placeholder__name">YOU</span>
      <span className="portrait-placeholder__note">人物图片待补充</span>
      <span className="portrait-placeholder__orbit" aria-hidden="true" />
    </div>
  )
}
