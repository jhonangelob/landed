import {
  useProfileQuery,
  useSaveProfileMutation,
} from '#/hooks/useProfileQueries'
import type { PilotProfile, PilotProfileInput } from '#/types'

import { createFileRoute } from '@tanstack/react-router'

import { BatteryMediumIcon, CheckIcon, CircleIcon, UploadIcon } from 'lucide-react'

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

const profileChecklist: {
  label: string
  check: (p: PilotProfile | null) => boolean
}[] = [
  {
    label: 'Contact details',
    check: (p) => !!(p?.name && p?.email && p?.phone && p?.location),
  },
  {
    label: 'Headline written',
    check: (p) => !!(p?.headline),
  },
  {
    label: '2+ roles detailed',
    check: (p) => (p?.experience?.length ?? 0) >= 2,
  },
  {
    label: '6+ skills listed',
    check: (p) => (p?.skills?.length ?? 0) >= 6,
  },
  {
    label: 'Profile links added',
    check: (p) => (p?.links?.filter((l) => l.url)?.length ?? 0) >= 1,
  },
  {
    label: 'Voice & tone set',
    check: (p) => !!(p?.preferences?.preferredVoice),
  },
]

function strengthLabel(percent: number) {
  if (percent === 100) return 'Flight-ready'
  if (percent >= 80) return 'Almost ready'
  if (percent >= 60) return 'Looking good'
  if (percent >= 40) return 'Building up'
  return 'Getting started'
}

function RouteComponent() {
  const { data: profile } = useProfileQuery()
  const { mutateAsync: saveProfileDetails } = useSaveProfileMutation()

  const { parse, isParsing, data: parsedData } = useParseCvMutation()

  const handleSave = async (value: PilotProfileInput) => {
    await saveProfileDetails(value)
  }

  const checks = profileChecklist.map((item) => item.check(profile))
  const completedCount = checks.filter(Boolean).length
  const strengthPercent = Math.round(
    (completedCount / profileChecklist.length) * 100,
  )

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
          parsedData={parsedData}
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
                    {strengthPercent}%
                  </span>
                  <span className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1.2px] uppercase">
                    {strengthLabel(strengthPercent)}
                  </span>
                </div>
                <Progress value={strengthPercent} className="w-full" />
              </div>
              <div>
                {profileChecklist.map((item, index) => (
                  <div
                    key={item.label}
                    className={cn(
                      'text-ink-muted flex flex-row items-center gap-3 py-2.25 text-[13px] leading-[1.4]',
                      index + 1 !== profileChecklist.length &&
                        'border-b border-dashed',
                    )}
                  >
                    {checks[index] ? (
                      <CheckIcon className="size-4.5 shrink-0 rounded-full bg-green-800 stroke-4 p-1 text-white" />
                    ) : (
                      <CircleIcon className="text-muted-foreground size-4.5 shrink-0" />
                    )}
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
