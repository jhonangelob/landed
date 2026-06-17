import { useApplicationsQuery } from '#/hooks/useApplicationQueries'

import { createFileRoute } from '@tanstack/react-router'

import KanbanBoard from '#/components/flight-deck/KanbanBoard'
import KanbanBoardEmpty from '#/components/flight-deck/KanbanBoardEmpty'
import SectionHeader from '#/components/layout/SectionHeader'

import { getApplications } from '#/server/applications'

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
  component: RouteComponent,
})

function RouteComponent() {
  const { data: applications } = useApplicationsQuery()

  return (
    <div className="section gap-6! overflow-hidden">
      <SectionHeader
        subTitle="Dashboard"
        title1="Flight "
        title2="Deck"
        description="Every application — and the CV and cover letter Co-Pilot tailored for it — tracked from spotted to landed."
      />

      {applications.length > 0 ? (
        <KanbanBoard applications={applications} />
      ) : (
        <KanbanBoardEmpty />
      )}
    </div>
  )
}
