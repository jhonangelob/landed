interface SectionCardProps {
  title: string
  children: React.ReactNode
}

export default function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="island-shell flex flex-col gap-4 rounded-lg p-6 shadow-none!">
      <h3 className="font-display text-primary-text text-sm font-semibold">
        {title}
      </h3>
      {children}
    </div>
  )
}
