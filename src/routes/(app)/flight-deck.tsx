import KanbanItem from '#/components/kanban/KanbanItem'
import SectionHeader from '#/components/layout/SectionHeader'
import { dummyApplications } from '#/dummy/data'
import { ApplicationStatusEnum } from '#/types/application'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/flight-deck')({
  component: RouteComponent,
})

const statusDotClass: Record<ApplicationStatusEnum, string> = {
  [ApplicationStatusEnum.SPOTTED]: 'bg-status-spotted',
  [ApplicationStatusEnum.APPLIED]: 'bg-status-applied',
  [ApplicationStatusEnum.INFLIGHT]: 'bg-status-in-flight',
  [ApplicationStatusEnum.INTERVIEW]: 'bg-status-interviewing',
  [ApplicationStatusEnum.OFFER]: 'bg-status-offer',
  [ApplicationStatusEnum.LANDED]: 'bg-status-landed',
}

function RouteComponent() {
  return (
    <div className="section">
      <SectionHeader
        title="Flight Deck"
        description="Real-time telemetry for your professional trajectory."
      />
      <div className="flex flex-row gap-4 max-w-full overflow-scroll flex-1 pr-24">
        {Object.values(ApplicationStatusEnum).map((status, index) => (
          <div className="flex flex-col gap-4" key={status + index}>
            <div className="uppercase flex flex-row gap-2 items-center">
              <div
                className={`rounded-full w-2 h-2 ${statusDotClass[status]}`}
              />
              <p className="font-sans text-[13px] uppercase leading-[19.5px] text-muted-foreground">
                {status}
              </p>
              <div className="font-mono text-[12px] leading-4 py-0.5 px-1.5 ml-auto bg-[#EDEDF6] text-muted-foreground rounded-md">
                2
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {dummyApplications.map(
                (application) =>
                  application.status === status && (
                    <KanbanItem data={application} />
                  ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
