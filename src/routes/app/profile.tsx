import {
  useProfileQuery,
  useSaveProfileMutation,
} from '#/hooks/useProfileQueries'
import type { PilotProfileInput } from '#/types'

import { createFileRoute } from '@tanstack/react-router'

import { BatteryMediumIcon, CheckIcon, UploadIcon } from 'lucide-react'

import SectionHeader from '#/components/layout/SectionHeader'
import ProfileForm from '#/components/profile/ProfileForm'
import SecondarySectionCard from '#/components/profile/SecondarySectionCard'
import { Dropzone } from '#/components/ui/dropzone'

import { getProfile } from '#/server/profile'
import { useParseCvMutation } from '#/hooks/useParseQueries'
import { cn } from '#/lib/utils'
import { Progress } from '#/components/ui/progress'

export const Route = createFileRoute('/app/profile')({
  head: () => ({
    meta: [{ title: 'Landed | Profile' }],
  }),
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: ['profile'],
      queryFn: () => getProfile(),
    }),
  component: RouteComponent,
})

const profileChecklist = [
  { label: 'Contact details' },
  { label: 'Headline written' },
  { label: '2+ roles detailed' },
  { label: '6+ skills listed' },
  { label: 'Profile links added' },
  { label: 'Voice & tone set' },
]

function RouteComponent() {
  const { data: profile } = useProfileQuery()
  const { mutateAsync: saveProfileDetails } = useSaveProfileMutation()

  const { parse, isParsing } = useParseCvMutation()

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
      <div className="flex flex-row gap-4">
        <ProfileForm
          key={profile?.updatedAt.getTime() ?? 'new'}
          profile={profile}
          onSaveProfile={handleSave}
          className="w-2/3"
        />
        <div className="sticky top-20 flex w-1/3 flex-col gap-4 self-start">
          <SecondarySectionCard
            title="Import File"
            subTitle="Auto-fill"
            icon={
              <UploadIcon className="bg-primary/20 border-primary/10 text-primary size-6 rounded-md border p-1" />
            }
          >
            <Dropzone
              accept={['.pdf', '.docx']}
              disabled={isParsing}
              onFileAccepted={parse}
            />
          </SecondarySectionCard>

          <SecondarySectionCard
            title="Profile Strength"
            icon={
              <BatteryMediumIcon className="bg-primary/20 border-primary/10 text-primary size-6 rounded-md border p-1" />
            }
          >
            <div className="space-y-4">
              <div>
                <div className="space-x-4">
                  <span className="font-display text-ink-strong text-[34px] leading-[1.4] font-bold tracking-[-0.8px]">
                    100%
                  </span>
                  <span className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1.2px] uppercase">
                    Flight-ready
                  </span>
                </div>
                <Progress value={0} className="w-full" />
              </div>
              <div>
                {profileChecklist.map((item, index) => (
                  <div
                    className={cn(
                      'text-ink-muted flex flex-row items-center gap-3 py-2.25 text-[13px] leading-[1.4]',
                      index + 1 !== profileChecklist.length &&
                        'border-b border-dashed',
                    )}
                  >
                    <CheckIcon className="size-4.5 rounded-full bg-green-800 stroke-4 p-1 text-white" />{' '}
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </SecondarySectionCard>
        </div>
      </div>
    </div>
  )
}
