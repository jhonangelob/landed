type ActivityData = {
  activeInterviewCount: number
  applicationCount: number
  documentCount: number
  lastDocGenerated: Date | null
}

const CARD_CLASS =
  'flex h-23.5 flex-col gap-2 rounded-md border bg-surface-muted px-4 py-3.5 shadow-none'
const LABEL_CLASS =
  'text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.1px] uppercase'
const VALUE_CLASS =
  'font-display leading-none font-bold tracking-[-0.8px] text-ink-strong'

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
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards(data).map(({ value, label }) => (
        <div key={label} className={CARD_CLASS}>
          <p
            className={`${VALUE_CLASS} text-[${typeof value === 'string' ? '24px' : '30px'}]`}
          >
            {value}
          </p>
          <p className={LABEL_CLASS}>{label}</p>
        </div>
      ))}
    </div>
  )
}
