import { useApplicationsQuery } from '#/hooks/useApplicationQueries'
import { useEffect, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import KanbanBoard from '#/components/flight-deck/KanbanBoard'
import SectionHeader from '#/components/layout/SectionHeader'

import { getApplications } from '#/server/applications'
import { getSession } from '#/server/session'
import { SearchIcon } from 'lucide-react'
import { Input } from '#/components/ui/input'

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
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.body.classList.add('overflow-hidden')
    return () => document.body.classList.remove('overflow-hidden')
  }, [])

  return (
    <div className="section gap-6!">
      <SectionHeader
        subTitle="Dashboard"
        title1="Flight "
        title2="Deck"
        description="Real-time telemetry for your professional trajectory."
      />
      <div className="flex h-12 flex-row items-center justify-between rounded-lg border bg-white px-3.5 py-3">
        <div className="flex flex-row items-center gap-2">
          <SearchIcon className="stroke-muted size-4" />
          <Input
            className="h-5 border-none bg-transparent"
            placeholder="Search by company or role..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <KanbanBoard applications={applications} query={query} />
    </div>
  )
}
