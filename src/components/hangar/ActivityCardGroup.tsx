type ActivityData = {
  activeInterviewCount: number
  applicationCount: number
  documentCount: number
  lastDocGenerated: Date | null
}

const cards = (data: ActivityData) => [
  { value: data.applicationCount, label: 'Applications Submitted' },
  { value: data.documentCount, label: 'Documents Generated' },
  { value: data.activeInterviewCount, label: 'Active Interviews' },
  {
    value: data.lastDocGenerated
      ? new Date(data.lastDocGenerated).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '—',
    label: 'Last Generation',
  },
]

export default function ActivityCardGroup({ data }: { data: ActivityData }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards(data).map(({ value, label }) => (
        <div
          key={label}
          className="md:bg-surface-muted md: flex h-10 flex-row items-center justify-between gap-2 rounded-none border-b bg-white px-1 py-1 shadow-none md:h-23.5 md:flex-col md:items-start md:rounded-md md:border md:px-4 md:py-3.5"
        >
          <p
            className={`font-display text-ink-strong leading-none font-bold tracking-[-0.8px] text-[${typeof value === 'string' ? '12px' : '14px'}] md:text-[${typeof value === 'string' ? '24px' : '30px'}]`}
          >
            {value}
          </p>
          <p className="text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.1px] uppercase">
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}
