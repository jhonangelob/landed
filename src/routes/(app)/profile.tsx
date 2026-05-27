import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import SectionHeader from '#/components/layout/SectionHeader'
import ProfileForm from '#/components/profile/ProfileForm'

import { getAccountDetails } from '#/server/account'
import { getProfile, saveProfile, updateProfile } from '#/server/profile'

import type { PilotProfile } from '#/lib/db/schema'

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
  const queryClient = useQueryClient()

  const { data: profile } = useSuspenseQuery({
    queryKey: ['profile'],
    queryFn: (): Promise<PilotProfile | null> => getProfile(),
  })

  const { data: account } = useSuspenseQuery({
    queryKey: ['account_details'],
    queryFn: () => getAccountDetails(),
  })

  const { mutateAsync: saveProfileDetails } = useMutation({
    mutationFn: async (value: PilotProfileInput) => {
      await saveProfile({ data: value })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const { mutateAsync: updateProfileDetails } = useMutation({
    mutationFn: async (value: PilotProfileInput) => {
      await updateProfile({ data: value })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const handleSave = (value: PilotProfileInput) => {
    if (profile?.id) {
      updateProfileDetails(value)
    } else {
      saveProfileDetails(value)
    }
  }

  return (
    <div className="section">
      <SectionHeader
        subTitle="Master profile"
        title1="Pilot"
        title2="Profile"
        description="Your master CV data. Co-Pilot uses this to tailor every document it generates."
      />
      <ProfileForm profile={profile} account={account} onSave={handleSave} />
    </div>
  )
}
