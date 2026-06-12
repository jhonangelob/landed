import type {
  ApplicationInput,
  DeleteApplicationInput,
  UpdateApplicationInput,
  UpdateApplicationStageInput,
} from '#/types'

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  updateApplication,
  updateApplicationStage,
} from '#/server/applications'

import { parseError } from '#/lib/error'
import { maybeCelebrateLanded } from '#/lib/store/landed'
import { openUsageLimitModal } from '#/lib/store/usage-limit'
import { notify } from '#/lib/toast'

export const applicationsQueryKey = ['applications'] as const
export const applicationQueryKey = (id: string) => ['application', id] as const

export function useApplicationsQuery() {
  return useSuspenseQuery({
    queryKey: applicationsQueryKey,
    queryFn: () => getApplications(),
  })
}

export function useApplicationQuery(id: string | undefined) {
  return useQuery({
    queryKey: applicationQueryKey(id ?? ''),
    queryFn: () => getApplicationById({ data: { id: id! } }),
    enabled: !!id,
  })
}

export function useCreateApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (value: ApplicationInput) =>
      notify.promise(createApplication({ data: value }), {
        loading: 'Creating application...',
        success: 'Application created',
        error: (err) => parseError(err).message || 'Failed to add application',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },
    onError: (error) => {
      if (parseError(error).code === 'GENERATION_LIMIT_REACHED') {
        openUsageLimitModal(queryClient, 'application')
      }
    },
  })
}

export function useUpdateApplicationMutation(applicationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: UpdateApplicationInput) =>
      notify.promise(
        updateApplication({ data: { ...values, id: applicationId } }),
        {
          loading: 'Saving changes…',
          success: 'Application updated',
          error: (err) =>
            parseError(err).message || 'Could not update application',
        },
      ),
    onSuccess: async (_, values) => {
      await maybeCelebrateLanded(queryClient, applicationId, values.stage)
      queryClient.invalidateQueries({
        queryKey: applicationQueryKey(applicationId),
      })
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },
  })
}

export function useUpdateApplicationStageMutation(applicationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: UpdateApplicationStageInput) => {
      const label =
        values.stage.charAt(0).toUpperCase() +
        values.stage.slice(1).replace('_', ' ')
      return notify.promise(updateApplicationStage({ data: values }), {
        loading: 'Updating stage…',
        success: `Moved to ${label}`,
        error: (err) => parseError(err).message || 'Could not update stage',
      })
    },
    onSuccess: async (_, values) => {
      await maybeCelebrateLanded(queryClient, applicationId, values.stage)
      queryClient.invalidateQueries({
        queryKey: applicationQueryKey(applicationId),
      })
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },
  })
}

export function useDeleteApplicationMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (values: DeleteApplicationInput) =>
      notify.promise(deleteApplication({ data: values }), {
        loading: 'Deleting application…',
        success: 'Application deleted',
        error: (err) =>
          parseError(err).message || 'Could not delete application',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
      navigate({ to: '/app' })
    },
  })
}
