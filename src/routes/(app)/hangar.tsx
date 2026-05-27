import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

import AccountForm from '#/components/hangar/AccountForm'
import ActivityCardGroup from '#/components/hangar/ActivityCardGroup'
import DeleteAccountDialog from '#/components/hangar/DeleteAccountDialog'
import PasswordForm from '#/components/hangar/PasswordForm'
import SectionCard from '#/components/hangar/SectionCard'
import SubscriptionCard from '#/components/hangar/SubscriptionCard'
import SectionHeader from '#/components/layout/SectionHeader'

import {
  deleteAccount,
  getAccountDetails,
  updateAccountDetails,
} from '#/server/account'
import { getActivities } from '#/server/activity'

import { changePassword, signOut } from '#/lib/auth/client'

import type {
  UpdateAccountInput,
  UpdatePasswordInput,
} from '#/validators/account'

import { PLANS } from '#/constants/plan'

export const Route = createFileRoute('/(app)/hangar')({
  head: () => ({
    meta: [
      {
        title: 'Landed | Hangar',
      },
    ],
  }),
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['account_details'],
        queryFn: () => getAccountDetails(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['activities'],
        queryFn: () => getActivities(),
      }),
    ]),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: activities } = useSuspenseQuery({
    queryKey: ['activities'],
    queryFn: () => getActivities(),
  })

  const { data: account } = useSuspenseQuery({
    queryKey: ['account_details'],
    queryFn: () => getAccountDetails(),
  })

  const { mutateAsync: updateAccountPassword } = useMutation({
    mutationFn: async (value: UpdatePasswordInput) => {
      await changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        revokeOtherSessions: true,
      })
    },
  })

  const { mutateAsync: updateAccount } = useMutation({
    mutationFn: async (value: UpdateAccountInput) => {
      await updateAccountDetails({ data: value })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account_details'] })
    },
  })

  const { mutateAsync: deleteUserAccount } = useMutation({
    mutationFn: async () => {
      await deleteAccount()
    },
    onSuccess: () => {
      signOut()
      navigate({ to: '/login' })
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        subTitle="Settings & billing"
        title1="The"
        title2="Hangar"
        description="Account settings, your subscription, and the controls you rarely need to touch."
      />
      <div className="flex flex-col gap-4 lg:flex-row">
        <SectionCard
          subTitle="Bay 01 · Account"
          title="Account details"
          description="The name printed on every CV and cover letter Co-Pilot generates. Use the name you'd want a recruiter to call out on a phone screen."
          order={1}
          className="w-full lg:w-3/5"
        >
          <AccountForm data={account} onConfirmUpdate={updateAccount} />
        </SectionCard>
        <SectionCard
          subTitle="Bay 02 · Security"
          title="Password "
          description="Lock down access. Two-factor is on by default for accounts older than 30 days."
          order={2}
          className="w-full lg:w-2/5"
        >
          <PasswordForm onUpdatePassword={updateAccountPassword} />
        </SectionCard>
      </div>
      <SectionCard
        subTitle="Bay 03 · Subscription"
        title="Choose your plan"
        description="Every plan includes unlimited applications, the Flight Deck, and the Pilot Profile. Co-Pilot generations and extras vary."
        order={3}
      >
        <div className="flex flex-col gap-4 lg:flex-row">
          {PLANS.map((item) => (
            <SubscriptionCard
              data={item}
              current={item.isCurrent}
              onSelect={() => console.log('unimplemented: select')}
              key={item.id}
            />
          ))}
        </div>
      </SectionCard>
      <div className="flex flex-col gap-4 lg:flex-row">
        <SectionCard
          subTitle="Bay 04 · Usage this month"
          title="Activity"
          description="Your activity since 19 May. Resets monthly."
          order={4}
          className="w-full lg:w-3/5"
        >
          <ActivityCardGroup data={activities} />
        </SectionCard>
        <SectionCard
          subTitle="Bay 05 · Delete account"
          title="Delete account"
          description="Permanently delete your Pilot Profile, application history, and every document Co-Pilot has generated. This cannot be undone."
          order={5}
          className="w-full border-[#e4b9ba]! bg-[#fef1f0]! lg:w-2/5"
        >
          <div className="mt-auto flex flex-row items-end justify-between">
            <p className="text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.1px] uppercase">
              This cannot be undone.
            </p>
            <DeleteAccountDialog onDelete={deleteUserAccount}>
              <Button
                className="bg-destructive hover:bg-destructive/80 rounded-md font-mono text-[12px] leading-[1.4] font-medium tracking-[0.9px] text-white uppercase"
                type="reset"
              >
                Delete Account...
              </Button>
            </DeleteAccountDialog>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
