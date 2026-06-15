import { useApplicationQuery } from '#/hooks/useApplicationQueries'
import { useProfileQuery } from '#/hooks/useProfileQueries'

import { createFileRoute } from '@tanstack/react-router'

import NewApplication from '#/components/co-pilot/NewApplication'
import UpdateApplication from '#/components/co-pilot/UpdateApplication'

import { getApplicationById } from '#/server/applications'
import { getProfile } from '#/server/profile'

import { applicationSearchSchema } from '#/validators/shared'

export const Route = createFileRoute('/app/co-pilot')({
  head: () => ({
    meta: [
      {
        title: 'Landed | Co-Pilot',
      },
    ],
  }),
  validateSearch: applicationSearchSchema,
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
  const { applicationId, stage } = Route.useSearch()

  const isEditMode = !!applicationId

  const { data: profile } = useProfileQuery()
  const { data: application } = useApplicationQuery(applicationId)

  const normalizedApplication = application
    ? {
        ...application,
        url: application.url ?? '',
        location: application.location ?? '',
        salaryRange: application.salaryRange ?? '',
        notes: application.notes ?? '',
        status: application.status ?? '',
        description: application.description ?? '',
      }
    : undefined

  return (
    <div className="section overflow-visible">
      {isEditMode ? (
        <UpdateApplication
          key={application?.updatedAt.getTime()}
          applicationId={applicationId}
          application={normalizedApplication}
        />
      ) : (
        <NewApplication profile={profile} stage={stage} />
      )}
    </div>
  )
}
