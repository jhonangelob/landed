import { cn } from '#/lib/utils'

import type { Application } from '#/validators/application'

interface StageTimelineProps {
  data: Application
}

const STAGES = [
  { label: 'Applied', key: 'appliedAt' },
  { label: 'Interview', key: 'interviewAt' },
  { label: 'Offer', key: 'offerAt' },
] as const satisfies { label: string; key: keyof Application }[]

function formatDate(date: Date | string | null): string {
  if (!date) return 'Not set'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function StageTimeline({ data }: StageTimelineProps) {
  return (
    <div className="min-w-full overflow-hidden rounded-lg border bg-white shadow-none!">
      <div className="border-b p-4">
        <p className="text-[14px] font-medium">Stage timeline</p>
      </div>

      {STAGES.map(({ label, key }) => {
        const date = data[key]
        const reached = !!date

        return (
          <div
            key={key}
            className={cn('flex items-center justify-between px-4 py-1.5')}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={cn(
                  'h-2 w-2 shrink-0 rounded-full',
                  reached ? 'bg-green-400' : 'bg-muted-foreground/40',
                )}
              />
              <div className="-space-y-1">
                <p
                  className={cn(
                    'font-sans text-[13px] font-medium',
                    reached ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </p>
                <p className="text-muted-foreground font-mono text-[12px]">
                  {formatDate(date)}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
