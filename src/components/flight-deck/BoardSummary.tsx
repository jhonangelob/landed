import { isActiveStage } from '#/helper/application'
import type { Application } from '#/types'

interface BoardSummaryProps {
  applications: Application[]
}

export default function BoardSummary({ applications }: BoardSummaryProps) {
  const active = applications.filter((a) => isActiveStage(a.stage)).length
  const interview = applications.filter((a) => a.stage === 'interview').length
  const offer = applications.filter((a) => a.stage === 'offer').length
  const landed = applications.filter((a) => a.stage === 'landed').length

  const segments: { label: string; color?: string }[] = [
    { label: `${active} active application${active === 1 ? '' : 's'}` },
  ]
  if (interview > 0)
    segments.push({
      label: `${interview} interview${interview === 1 ? '' : 's'}`,
      color: '#d97706',
    })
  if (offer > 0)
    segments.push({
      label: `${offer} offer${offer === 1 ? '' : 's'}`,
      color: '#059669',
    })
  if (landed > 0) segments.push({ label: `${landed} landed`, color: '#0091ff' })

  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] leading-[1.4] tracking-[0.7px]">
      {segments.map((segment, index) => (
        <div key={segment.label} className="flex items-center gap-2.5">
          {index > 0 && <span className="text-muted/40">·</span>}
          <span className="text-ink-strong flex items-center gap-1.5">
            {segment.color && (
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
            )}
            <span
              className={
                index === 0 ? 'text-ink-strong font-medium' : 'text-muted'
              }
            >
              {segment.label}
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}
