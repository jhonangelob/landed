import { useNavigate } from '@tanstack/react-router'

import { KANBAN_COLUMNS } from '#/constants/stage'

import KanbanItem from './KanbanItem'
import type { Application } from '#/types'

interface KanbanBoardProps {
  applications: Application[]
  query?: string
}

function matchesQuery(app: Application, query: string) {
  const q = query.toLowerCase()
  return (
    app.company.toLowerCase().includes(q) || app.role.toLowerCase().includes(q)
  )
}

export default function KanbanBoard({
  applications,
  query = '',
}: KanbanBoardProps) {
  const navigate = useNavigate()
  const isFiltering = query.trim() !== ''

  const handleNewApplication = (stage: any) => {
    navigate({ to: '/app/co-pilot', search: { stage } })
  }

  return (
    <div className="flex h-full max-h-[calc(100vh-250px)] flex-1 flex-col gap-6">
      <div className="flex min-h-0 flex-1 flex-row gap-4 overflow-x-auto pr-12">
        {KANBAN_COLUMNS.map((col, index) => {
          const colApps = applications.filter((a) => a.stage === col.stage)
          const visibleCount = isFiltering
            ? colApps.filter((a) => matchesQuery(a, query)).length
            : colApps.length

          return (
            <div key={index} className="flex min-h-0 flex-col gap-4.5">
              <div className="flex flex-row items-center justify-between gap-2 border-b pb-2">
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <p className="text-ink-strong font-sans text-[13px] leading-[1.4] font-semibold tracking-[-0.1px]">
                  {col.label}
                </p>
                <div className="text-muted-foreground rounded-md px-1.5 py-0.5 font-mono text-[11px] leading-4">
                  {visibleCount}
                </div>
              </div>
              <div className="flex min-h-0 w-60 flex-1 flex-col overflow-y-auto pb-2">
                {colApps.map((application) => {
                  const visible =
                    !isFiltering || matchesQuery(application, query)
                  return (
                    <div
                      key={application.id}
                      className="grid transition-all duration-200"
                      style={{
                        gridTemplateRows: visible ? '1fr' : '0fr',
                        opacity: visible ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-2">
                          <KanbanItem data={application} />
                        </div>
                      </div>
                    </div>
                  )
                })}

                {index + 1 !== KANBAN_COLUMNS.length && (
                  <div
                    className="group hover:border-primary flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-2 text-center hover:bg-white"
                    onClick={() => handleNewApplication(col.stage)}
                  >
                    <p className="text-muted group-hover:text-primary font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase">
                      Add
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
