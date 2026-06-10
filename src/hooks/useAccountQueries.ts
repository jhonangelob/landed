import type { UpdateAccountInput, UpdatePasswordInput } from '#/types'

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import {
  deleteAccount,
  getAccountDetails,
  updateAccountDetails,
} from '#/server/account'

import { changePassword, signOut } from '#/lib/auth/client'
import { notify } from '#/lib/toast'
import { revokeSession } from 'better-auth/api'

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
      notify.success('Account Update', 'Successfully updated Account details')
    },
  })
}

export function useDeleteAccountMutation() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => deleteAccount(),
    onSuccess: () => {
      revokeSession()
      signOut()
      navigate({ to: '/login' })
    },
  })
}

export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: (value: UpdatePasswordInput) =>
      changePassword({ ...value, revokeOtherSessions: true }),
    onSuccess: () => {
      notify.success('Account Update', 'Successfully updated password')
    },
  })
}
