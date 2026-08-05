interface EmptyStateProps {
  title: string
  description: string
  fields?: string[]
}

export function EmptyState({ title, description, fields = [] }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {fields.length > 0 && (
        <div className="empty-state__fields" aria-label="需要准备的信息">
          {fields.map((field) => (
            <span key={field}>{field}</span>
          ))}
        </div>
      )}
    </div>
  )
}
