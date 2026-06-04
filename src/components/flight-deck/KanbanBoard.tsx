import { useNavigate } from '@tanstack/react-router'

import type { Application } from '#/validators/application'

import { KANBAN_COLUMNS } from '#/constants/stage'

import KanbanItem from './KanbanItem'

interface KanbanBoardProps {
  applications: Application[]
}

export default function KanbanBoard({ applications }: KanbanBoardProps) {
  const navigate = useNavigate()

  const handleNewApplication = () => {
    navigate({ to: '/app/co-pilot' })
  }

  return (
    <div className="flex max-h-[calc(100vh-250px)] max-w-full flex-1 flex-row gap-4 overflow-scroll pr-12">
      {KANBAN_COLUMNS.map((stage, index) => (
        <div className="flex flex-col gap-4.5" key={index}>
          <div className="flex flex-row items-center gap-2">
            <p className="text-muted-foreground font-sans text-[13px] leading-[1.4] font-semibold tracking-[-0.1px]">
              {stage.label}
            </p>
            <div className="text-muted-foreground ml-auto rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] leading-4">
              {applications.filter((a) => a.stage === stage.stage).length}
            </div>
          </div>
          <div className="flex w-60 flex-col gap-3">
            {applications.map(
              (application, i) =>
                application.stage === stage.stage && (
                  <KanbanItem data={application} key={i} />
                ),
            )}

            <div
              className="group hover:border-primary flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-2 text-center hover:bg-white"
              onClick={handleNewApplication}
            >
              <p className="text-muted group-hover:text-primary font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase">
                Add
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
