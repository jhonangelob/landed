import z from 'zod'

import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import NewApplication from '#/components/co-pilot/NewApplication'
import UpdateApplication from '#/components/co-pilot/UpdateApplication'

import {
  getApplicationDetails,
  saveApplication,
  updateApplication,
} from '#/server/applications'
import {
  // generateDocuments,
  getDocuments,
} from '#/server/co-pilot'
import { getProfile } from '#/server/profile'

import { createApplicationSchema } from '#/validators/application'

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
          queryFn: () => getApplicationDetails({ data: { id: applicationId } }),
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
  const navigate = useNavigate()
  const { applicationId } = Route.useSearch()

  const isEditMode = !!applicationId

  const { data: profile } = useSuspenseQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  })

  const { data: documents } = useQuery({
    queryKey: ['documents', applicationId ?? 'skip'],
    queryFn: () => {
      if (!applicationId) return Promise.resolve(null)
      return getDocuments({ data: { id: applicationId } })
    },
    enabled: isEditMode,
  })

  console.log(documents)

  const { data: application } = useQuery({
    queryKey: ['application', applicationId ?? 'skip'],
    queryFn: () => {
      if (!applicationId) return Promise.resolve(null)
      return getApplicationDetails({ data: { id: applicationId } })
    },
    enabled: isEditMode,
  })

  // const { mutateAsync: generateDocument } = useMutation({
  //   mutationFn: async (value: typeof form.state.values) => {
  //     return await generateDocuments({ data: value })
  //   },
  //   onSuccess: (data) => {
  //     navigate({
  //       to: '/co-pilot',
  //       search: { applicationId: data.id },
  //     })
  //   },
  //   onError: () => {
  //     form.reset()
  //   },
  // })

  const { mutateAsync: updateApplicationDetails } = useMutation({
    mutationFn: async (value: typeof form.state.values) => {
      return await updateApplication({
        data: {
          id: applicationId!,
          companyName: value.companyName,
          jobTitle: value.jobTitle,
          jobUrl: value.jobUrl || null,
          location: application?.location ?? null,
          salaryRange: value.salaryRange || null,
          notes: application?.notes ?? null,
          status: application?.status ?? 'spotted',
        },
      })
    },
    onError: () => {
      form.reset()
    },
  })

  const { mutateAsync: saveApplicationDetails } = useMutation({
    mutationFn: async (value: typeof form.state.values) => {
      return await saveApplication({ data: value })
    },
    onSuccess: (data) => {
      navigate({
        to: '/co-pilot',
        search: { applicationId: data.id },
      })
    },
    onError: () => {
      form.reset()
    },
  })

  const form = useForm({
    defaultValues: {
      companyName: application?.company || '',
      jobTitle: application?.role || '',
      jobDescription: application?.jobPostText || '',
      jobUrl: application?.jobUrl || '',
      salaryRange: application?.salaryRange || '',
    },
    validators: {
      onSubmit: createApplicationSchema,
    },
    onSubmit: ({ value }) => {
      if (isEditMode) {
        updateApplicationDetails(value)
      } else {
        saveApplicationDetails(value)
      }
    },
  })

  // const handleGenerateDocuments = () => {
  //   generateDocument(form.state.values)
  // }

  return (
    <div className="section">
      {isEditMode ? (
        <UpdateApplication
          applicationId={applicationId}
          application={application ?? undefined}
        />
      ) : (
        <NewApplication hasProfile={profile != null} />
      )}
    </div>
  )
}
