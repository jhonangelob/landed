interface SectionCardProps {
  title: string
  children: React.ReactNode
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="island-shell rounded-lg p-6 flex flex-col gap-4 shadow-none!">
      <h3 className="font-display font-semibold text-sm text-primary-text">
        {title}
      </h3>
      {children}
    </div>
  )
}
