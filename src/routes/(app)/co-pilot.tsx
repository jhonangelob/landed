import z from 'zod'

import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import NewApplication from '#/components/co-pilot/NewApplication'
import UpdateApplication from '#/components/co-pilot/UpdateApplication'

import { getApplicationById } from '#/server/applications'
import { getDocuments } from '#/server/documents'
import { getProfile } from '#/server/profile'

export const Route = createFileRoute('/(app)/co-pilot')({
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
      queries.push(
        queryClient.ensureQueryData({
          queryKey: ['generated_docs', applicationId],
          queryFn: () => getDocuments({ data: { id: applicationId } }),
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

  const { data: profile } = useSuspenseQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  })

  const { data: application } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => getApplicationById({ data: { id: applicationId! } }),
    enabled: !!applicationId,
  })

  return (
    <div className="section">
      {isEditMode ? (
        <UpdateApplication
          applicationId={applicationId}
          application={application}
        />
      ) : (
        <NewApplication profile={profile} />
      )}
    </div>
  )
}
