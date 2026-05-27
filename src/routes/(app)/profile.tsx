import { useAccountDetailsQuery } from '#/hooks/useAccountQueries'
import {
  useProfileQuery,
  useSaveProfileMutation,
} from '#/hooks/useProfileQueries'

import { createFileRoute } from '@tanstack/react-router'

import SectionHeader from '#/components/layout/SectionHeader'
import ProfileForm from '#/components/profile/ProfileForm'

import { getAccountDetails } from '#/server/account'
import { getProfile } from '#/server/profile'

import type { PilotProfileInput } from '#/validators/profile'

export const Route = createFileRoute('/(app)/profile')({
  head: () => ({
    meta: [
      {
        title: 'Landed | Profile',
      },
    ],
  }),
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['profile'],
        queryFn: () => getProfile(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['account_details'],
        queryFn: () => getAccountDetails(),
      }),
    ]),
  component: RouteComponent,
})

function RouteComponent() {
  const { data: profile } = useProfileQuery()
  const { data: account } = useAccountDetailsQuery()

  const { mutateAsync: saveProfileDetails } = useSaveProfileMutation()

  const handleSave = async (value: PilotProfileInput) => {
    await saveProfileDetails(value)
  }

  return (
    <div className="section">
      <SectionHeader
        subTitle="Master profile"
        title1="Pilot"
        title2="Profile"
        description="Your master CV data. Co-Pilot uses this to tailor every document it generates."
      />
      <ProfileForm
        key={profile?.updatedAt.getTime() ?? 'new'}
        profile={profile}
        account={account}
        onSave={handleSave}
      />
    </div>
  )
}
