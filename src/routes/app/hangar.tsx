import {
  accountQueryKey,
  useAccountDetailsQuery,
  useDeleteAccountMutation,
  useUpdateAccountMutation,
  useUpdatePasswordMutation,
} from '#/hooks/useAccountQueries'
import {
  activitiesQueryKey,
  useActivitiesQuery,
} from '#/hooks/useActivityQueries'
import {
  subscriptionQueryKey,
  useSubscriptionQuery,
} from '#/hooks/useSubscriptionQueries'
import { MoveRightIcon } from 'lucide-react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

import AccountForm from '#/components/hangar/AccountForm'
import ActivityCardGroup from '#/components/hangar/ActivityCardGroup'
import PasswordForm from '#/components/hangar/PasswordForm'
import SubscriptionCard from '#/components/hangar/SubscriptionCard'
import SectionCard from '#/components/layout/SectionCard'
import SectionHeader from '#/components/layout/SectionHeader'

import { getAccountDetails } from '#/server/account'
import { getActivities } from '#/server/activity'
import { getSubscription } from '#/server/subscription'

import { useModal } from '#/lib/store/modal'

import { PLANS } from '#/constants/plan'

export const Route = createFileRoute('/app/hangar')({
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
        queryKey: accountQueryKey,
        queryFn: () => getAccountDetails(),
      }),
      queryClient.ensureQueryData({
        queryKey: activitiesQueryKey,
        queryFn: () => getActivities(),
      }),
      queryClient.ensureQueryData({
        queryKey: subscriptionQueryKey,
        queryFn: () => getSubscription(),
      }),
    ]),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const { data: activities } = useActivitiesQuery()
  const { data: account } = useAccountDetailsQuery()
  const { data: subscription } = useSubscriptionQuery()

  const { mutateAsync: updateAccount } = useUpdateAccountMutation()
  const { mutateAsync: deleteUserAccount } = useDeleteAccountMutation()
  const { mutateAsync: updatePassword } = useUpdatePasswordMutation()

  const { open } = useModal()

  const activitySince = new Date(subscription.startedAt).toLocaleDateString(
    'en-GB',
    { day: 'numeric', month: 'long' },
  )

  const handlePlanUpgrade = () => {
    navigate({
      to: '/payment/checkout',
    })
  }
  return (
    <div className="section">
      <SectionHeader
        subTitle="Settings & billing"
        title1="The"
        title2="Hangar"
        description="Account settings, your subscription, and the controls you rarely need to touch."
      />
      <div className="flex flex-col gap-4 lg:flex-row">
        <SectionCard
          variant="hangar"
          label="Bay 01 · Account"
          title="Account details"
          description="The name printed on every CV and Cover Letter Co-Pilot generates. Use the name you would want a recruiter to call out on a phone screen."
          order={1}
          className="w-full lg:w-3/5"
        >
          <AccountForm data={account} onConfirmUpdate={updateAccount} />
        </SectionCard>
        <SectionCard
          variant="hangar"
          label="Bay 02 · Security"
          title="Password "
          description="Lock down access. Two-factor is on by default for accounts older than 30 days."
          order={2}
          className="w-full lg:w-2/5"
        >
          <PasswordForm onUpdatePassword={updatePassword} />
        </SectionCard>
      </div>
      <SectionCard
        variant="hangar"
        label="Bay 03 · Subscription"
        title="Choose your plan"
        description="Every plan includes unlimited applications, the Flight Deck, and the Pilot Profile. Co-Pilot generations and extras vary."
        order={3}
        className="space-y-4"
      >
        <div className="flex flex-col gap-4 lg:flex-row">
          {PLANS.map((item) => (
            <SubscriptionCard
              data={item}
              current={subscription.planId === item.id}
              onSelect={() =>
                subscription.planId !== item.id &&
                open('planInformation', {
                  currentPlan: PLANS.find(
                    (it) => it.id === subscription.planId,
                  )!,
                  newPlan: item,
                  currentExpiresAt: subscription.expiresAt,
                })
              }
              key={item.id}
            />
          ))}
        </div>
        <div className="flex">
          <Button
            className="ml-auto font-mono text-[12px] leading-[1.4] font-semibold tracking-[0.7px] uppercase"
            onClick={handlePlanUpgrade}
          >
            Upgrade Plan <MoveRightIcon />
          </Button>
        </div>
      </SectionCard>
      <div className="flex flex-col gap-4 lg:flex-row">
        <SectionCard
          variant="hangar"
          label="Bay 04 · Usage this month"
          title="Activity"
          description={`Your activity since ${activitySince}. Resets monthly.`}
          order={4}
          className="w-full lg:w-3/5"
        >
          <ActivityCardGroup data={activities} />
        </SectionCard>
        <SectionCard
          variant="hangar"
          label="Bay 05 · Delete account"
          title="Delete account"
          description="Permanently delete your Pilot Profile, application history, and every document Co-Pilot has generated. This cannot be undone."
          order={5}
          className="border-border-danger! bg-surface-danger! w-full lg:w-2/5"
        >
          <div className="mt-auto flex flex-row items-end justify-between">
            <p className="text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.1px] uppercase">
              This cannot be undone.
            </p>
            <Button
              className="bg-destructive hover:bg-destructive/80 rounded-md font-mono text-[12px] leading-[1.4] font-medium tracking-[0.9px] text-white uppercase"
              type="reset"
              onClick={() =>
                open('deleteAccount', { onDelete: deleteUserAccount })
              }
            >
              Delete Account...
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
