import { formatNumberCompact } from '#/helper/number'
import type { Application } from '#/types'

import { useNavigate } from '@tanstack/react-router'

import { KANBAN_COLUMNS } from '#/constants/stage'

export interface KanbanItemProps {
  data: Application
}

export type KanbanItemBadgeProps = {
  label: string
  variant: string
}

export default function KanbanItem({ data }: KanbanItemProps) {
  const navigate = useNavigate()

  const stageColor =
    KANBAN_COLUMNS.find((col) => col.stage === data.stage)?.color ?? '#94a3b8'

  const handleClickApplicationItem = () => {
    navigate({
      to: '/app/co-pilot',
      search: { applicationId: data.id },
    })
  }

  return (
    <div
      className="hover:border-primary/70 border-divider/50 flex cursor-pointer flex-col rounded-lg border bg-white px-3.5 pt-3.5 pb-3"
      onClick={handleClickApplicationItem}
    >
      <div className="flex flex-col gap-1 border-b border-dashed pb-2">
        <p className="font-display text-primary-text truncate text-[15px] leading-[1.3] font-bold tracking-[-0.1px]">
          {data.role}
        </p>
        <p className="text-muted flex flex-row font-mono text-[11px] leading-[1.4] tracking-[0.4px]">
          {data.company} ·{' '}
          {new Date(data.appliedAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
          })}
        </p>
      </div>

      <div className="flex flex-row items-center justify-between pt-2">
        <p className="text-primary-text font-mono text-[13px] leading-[1.4] font-medium">
          ₱{formatNumberCompact(Number(data.salaryRange))}
        </p>
        <div className="flex flex-row items-end gap-1">
          <div
            className="mb-1 h-1.25 w-1.25 rounded-full"
            style={{ backgroundColor: stageColor }}
          />
          <p className="text-muted font-sans text-[12px] leading-[1.4] font-normal">
            {data.status || 'Spotted'}
          </p>
        </div>
      </div>
    </div>
  )
}
