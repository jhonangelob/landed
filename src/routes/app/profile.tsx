import {
  useProfileQuery,
  useSaveProfileMutation,
} from '#/hooks/useProfileQueries'
import type { PilotProfileInput } from '#/types'

import { createFileRoute } from '@tanstack/react-router'

import SectionHeader from '#/components/layout/SectionHeader'
import ProfileForm from '#/components/profile/ProfileForm'

import { getProfile } from '#/server/profile'

export const Route = createFileRoute('/app/profile')({
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
    ]),
  component: RouteComponent,
})

function RouteComponent() {
  const { data: profile } = useProfileQuery()

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
        onSaveProfile={handleSave}
      />
    </div>
  )
}
