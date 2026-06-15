import type { UpdateAccountInput, UpdatePasswordInput } from '#/types'
import { revokeSession } from 'better-auth/api'

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import {
  completeOnboarding,
  deleteAccount,
  getAccountDetails,
  updateAccountDetails,
} from '#/server/account'

import { changePassword, signOut } from '#/lib/auth/client'
import { parseError } from '#/lib/error'
import { notify } from '#/lib/toast'

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
      notify.promise(updateAccountDetails({ data: value }), {
        loading: 'Updating account details...',
        success: 'Account updated',
        error: (err) =>
          parseError(err).message || 'Successfully updated Account details',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountQueryKey })
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

export function useCompleteOnboardingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => completeOnboarding(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountQueryKey })
    },
  })
}

export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: (value: UpdatePasswordInput) =>
      notify.promise(changePassword({ ...value, revokeOtherSessions: true }), {
        loading: 'Updating password...',
        success: 'Successfully updated password',
        error: (err) => parseError(err).message || 'Failed to update password',
      }),
  })
}
