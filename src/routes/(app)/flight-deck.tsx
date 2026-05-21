import { dummyApplications } from '#/dummy/data'
import { PlusIcon } from 'lucide-react'

import { createFileRoute, useRouter } from '@tanstack/react-router'

import KanbanItem from '#/components/kanban/KanbanItem'
import SectionHeader from '#/components/layout/SectionHeader'

import { ApplicationStatusEnum } from '#/types/application'

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
  const router = useRouter()

  const handleNewApplication = () => {
    router.navigate({ to: '/co-pilot' })
  }

  return (
    <div className="section">
      <SectionHeader
        title="Flight Deck"
        description="Real-time telemetry for your professional trajectory."
      />
      <div className="flex max-h-[calc(100vh-250px)] max-w-full flex-1 flex-row gap-4 overflow-scroll pr-24">
        {Object.values(ApplicationStatusEnum).map((status, index) => (
          <div className="flex flex-col gap-4" key={status + index}>
            <div className="flex flex-row items-center gap-2 uppercase">
              <div
                className={`h-2 w-2 rounded-full ${statusDotClass[status]}`}
              />
              <p className="text-muted-foreground font-sans text-[13px] leading-[19.5px] uppercase">
                {status}
              </p>
              <div className="text-muted-foreground ml-auto rounded-md bg-[#EDEDF6] px-1.5 py-0.5 font-mono text-[12px] leading-4">
                2
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {dummyApplications.map(
                (application, i) =>
                  application.status === status && (
                    <KanbanItem data={application} key={i} />
                  ),
              )}
              {status === ApplicationStatusEnum.SPOTTED && (
                <div
                  className="group hover:border-primary flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 text-center hover:bg-white"
                  onClick={handleNewApplication}
                >
                  <PlusIcon className="text-muted-foreground group-hover:text-primary size-4" />
                  <p className="text-muted-foreground group-hover:text-primary font-sans text-[13px] font-semibold">
                    New Application
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
