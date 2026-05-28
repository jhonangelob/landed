import { useApplicationQuery } from '#/hooks/useApplicationQueries'
import { useProfileQuery } from '#/hooks/useProfileQueries'
import z from 'zod'

import { createFileRoute } from '@tanstack/react-router'

import NewApplication from '#/components/co-pilot/NewApplication'
import UpdateApplication from '#/components/co-pilot/UpdateApplication'

import { getApplicationById } from '#/server/applications'
import { getProfile } from '#/server/profile'

export const Route = createFileRoute('/(app)/co-pilot')({
  head: () => ({
    meta: [
      {
        title: 'Landed | Co-Pilot',
      },
    ],
  }),
  validateSearch: z.object({
    applicationId: z.string().uuid().optional(),
  }),
  loader: ({ context: { queryClient }, location }) => {
    const { applicationId } = location.search as { applicationId?: string }

    const queries = [
      queryClient.ensureQueryData({
        queryKey: ['profile'],
        queryFn: () => getProfile(),
      }),
    ]

    if (applicationId) {
      queries.push(
        queryClient.ensureQueryData({
          queryKey: ['application', applicationId],
          queryFn: () => getApplicationById({ data: { id: applicationId } }),
        }),
      )
    }

    return Promise.all(queries)
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { applicationId } = Route.useSearch()

  const isEditMode = !!applicationId

  const { data: profile } = useProfileQuery()
  const { data: application } = useApplicationQuery(applicationId)

  return (
    <div className="section">
      {isEditMode ? (
        <UpdateApplication
          key={application?.updatedAt?.getTime()}
          applicationId={applicationId}
          application={application}
        />
      ) : (
        <NewApplication profile={profile} />
      )}
    </div>
  )
}
