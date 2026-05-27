import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import KanbanBoard from '#/components/flight-deck/KanbanBoard'
import SectionHeader from '#/components/layout/SectionHeader'

import { getApplications } from '#/server/applications'

export const Route = createFileRoute('/(app)/flight-deck')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: ['applications'],
      queryFn: () => getApplications(),
    }),
  component: RouteComponent,
})

function RouteComponent() {
  const { data: applications } = useSuspenseQuery({
    queryKey: ['applications'],
    queryFn: () => getApplications(),
  })

  return (
    <div className="section">
      <SectionHeader
        subTitle="Dashboard"
        title1="Flight "
        title2="Deck"
        description="Real-time telemetry for your professional trajectory."
      />
      <KanbanBoard applications={applications} />
    </div>
  )
}
