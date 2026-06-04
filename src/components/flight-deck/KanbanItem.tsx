import { formatNumberCompact } from '#/helper/number'

import { useNavigate } from '@tanstack/react-router'

import type { Application } from '#/validators/application'

export interface KanbanItemProps {
  data: Application
}

export type KanbanItemBadgeProps = {
  label: string
  variant: string
}

export default function KanbanItem({ data }: KanbanItemProps) {
  const navigate = useNavigate()

  const handleClickApplicationItem = () => {
    navigate({
      to: '/app/co-pilot',
      search: { applicationId: data.id },
    })
  }

  return (
    <div
      className="hover:border-primary-text flex cursor-pointer flex-col rounded-md border bg-white px-3.5 pt-3.5 pb-3"
      onClick={handleClickApplicationItem}
    >
      <div className="text-muted flex flex-row justify-between gap-3 pb-1 font-mono text-[11px] leading-[1.4] tracking-[0.4px]">
        <p className="truncate">{data.company}</p>
        <p className="text-nowrap">
          {data.appliedAt &&
            new Date(data.appliedAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
            })}
        </p>
      </div>
      <p className="font-display text-primary-text max-w-3/4 pb-2.5 text-[15px] leading-[1.3] font-bold tracking-[-0.1px]">
        {data.role}
      </p>

      <p className="text-primary-text items-center border-t pt-2 font-mono text-[13px] leading-[1.4] font-medium">
        <span>₱{formatNumberCompact(Number(data.salaryRange))} - </span>

        <span className="text-muted font-sans text-[12px] leading-[1.4] font-normal">
          {data.status || ''}
        </span>
      </p>
    </div>
  )
}
