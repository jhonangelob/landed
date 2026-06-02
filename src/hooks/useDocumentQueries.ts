import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  exportCvPdf,
  generateDocuments,
  getDocuments,
} from '#/server/documents'

import { parseError } from '#/lib/error'
import { openUsageLimitModal } from '#/lib/store/usage-limit'
import { notify } from '#/lib/toast'

import type {
  ExportDocumentInput,
  GenerateDocumentInput,
} from '#/validators/documents'

import { subscriptionQueryKey } from './useSubscriptionQueries'

/** Below this many remaining generations we nudge the user with a heads-up. */
const LOW_GENERATION_THRESHOLD = 2

export const documentsQueryKey = (applicationId: string | undefined) =>
  ['generated_docs', applicationId] as const

export function useDocumentsQuery(applicationId: string | undefined) {
  return useQuery({
    queryKey: documentsQueryKey(applicationId),
    queryFn: () => getDocuments({ data: { id: applicationId } }),
    enabled: !!applicationId,
  })
}

export function useGenerateDocumentsMutation(applicationId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (value: GenerateDocumentInput) =>
      generateDocuments({ data: value }),
    onMutate: () => {
      const toastId = notify.loading(
        'Generating documents',
        'Tailoring your CV and Cover Letter to this role...',
      )
      return { toastId }
    },
    onSuccess: (data, variables, context) => {
      const id = applicationId ?? variables.applicationId

      queryClient.invalidateQueries({ queryKey: documentsQueryKey(id) })
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKey })

      notify.dismiss(context.toastId)
      notify.generationDone()

      const { usage } = data

      if (!usage.unlimited && usage.remaining <= LOW_GENERATION_THRESHOLD) {
        notify.headsUp(usage.remaining, usage.resetAt)
      }
    },
    onError: (error, _variables, context) => {
      notify.dismiss(context?.toastId)

      const { code, message } = parseError(error)

      if (code === 'GENERATION_LIMIT_REACHED') {
        openUsageLimitModal(queryClient, 'generation')
        return
      }

      if (code === 'RATE_LIMIT_EXCEEDED') {
        notify.error('Slow down a moment', message)
        return
      }

      notify.fromError(error, 'Could not generate documents')
    },
  })
}

export function useExportDocumentsMutation() {
  return useMutation({
    mutationFn: (value: ExportDocumentInput) => exportCvPdf({ data: value }),
    onSuccess: () => {
      notify.success('Export ready', 'Your PDF download has started.')
    },
    onError: (error) => {
      notify.fromError(error, 'Could not export document')
    },
  })
}
