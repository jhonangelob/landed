import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'

import {
  deleteAccount,
  getAccountDetails,
  updateAccountDetails,
} from '#/server/account'

import type { UpdateAccountInput } from '#/validators/account'

export const accountQueryKey = ['account_details'] as const

export function useAccountDetailsQuery() {
  return useSuspenseQuery({
    queryKey: accountQueryKey,
    queryFn: () => getAccountDetails(),
  })
}

export function useUpdateAccountMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (value: UpdateAccountInput) =>
      updateAccountDetails({ data: value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountQueryKey })
    },
  })
}

export function useDeleteAccountMutation() {
  return useMutation({
    mutationFn: () => deleteAccount(),
  })
}
