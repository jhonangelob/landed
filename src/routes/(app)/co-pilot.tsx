import { useApplicationQuery } from '#/hooks/useApplicationQueries'
import { useDocumentsQuery } from '#/hooks/useDocumentQueries'
import { useProfileQuery } from '#/hooks/useProfileQueries'
import z from 'zod'

import { createFileRoute } from '@tanstack/react-router'

import NewApplication from '#/components/co-pilot/NewApplication'
import UpdateApplication from '#/components/co-pilot/UpdateApplication'

import { getApplicationById } from '#/server/applications'
import { getDocuments } from '#/server/documents'
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

  const { data: profile } = useProfileQuery()
  const { data: application } = useApplicationQuery(applicationId)
  const { data: documents } = useDocumentsQuery(applicationId)

  return (
    <div className="section">
      {isEditMode ? (
        <UpdateApplication
          key={application?.updatedAt?.getTime()}
          applicationId={applicationId}
          documents={documents}
          application={application}
        />
      ) : (
        <NewApplication profile={profile} />
      )}
    </div>
  )
}
