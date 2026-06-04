import { useApplicationsQuery } from '#/hooks/useApplicationQueries'

import { createFileRoute } from '@tanstack/react-router'

import KanbanBoard from '#/components/flight-deck/KanbanBoard'
import SectionHeader from '#/components/layout/SectionHeader'

import { getApplications } from '#/server/applications'
import { getSession } from '#/server/session'

export const Route = createFileRoute('/app/')({
  head: () => ({
    meta: [
      {
        title: 'Landed | Flight Deck',
      },
    ],
  }),
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: ['applications'],
      queryFn: () => getApplications(),
    }),
  beforeLoad: async () => {
    const session = await getSession()

    if (!session?.user.hasOnboarded) {
      console.log('unimplemented: show onboarding')
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data: applications } = useApplicationsQuery()

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
