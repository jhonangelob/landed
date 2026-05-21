import { useState } from 'react'

import { PlusIcon, XIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'

import SectionCard from '#/components/layout/SectionCard'
import SectionHeader from '#/components/layout/SectionHeader'

import { getAccountDetails } from '#/server/account'
import { getProfile, saveProfile, updateProfile } from '#/server/profile'

import { pilotProfileSchema } from '#/validators/profile'
import type { PilotProfile } from '#/lib/db/schema'

export const Route = createFileRoute('/(app)/profile')({
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

const labelClass = 'font-sans font-medium text-[12px] text-muted-foreground'
const inputClass = 'bg-white shadow-none placeholder:text-sm text-sm'

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
    mutationFn: async (value: typeof form.state.values) => {
      await saveProfile({ data: value })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: () => {
      form.reset()
    },
  })

  const { mutateAsync: updateProfileDetails } = useMutation({
    mutationFn: async (value: typeof form.state.values) => {
      await updateProfile({ data: value })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: () => {
      form.reset()
    },
  })

  const [skillInput, setSkillInput] = useState('')
  const [roleInput, setRoleInput] = useState('')

  const form = useForm({
    defaultValues: {
      fullName: account?.name ?? '',
      email: account?.email ?? '',
      location: profile?.location ?? '',
      headline: profile?.headline ?? '',
      summary: profile?.summary ?? '',
      skills: profile?.skills ?? [],
      experience: profile?.experience ?? [
        { company: '', role: '', dates: '', bullets: [''] },
      ],
      education: profile?.education ?? [
        { institution: '', degree: '', year: '' },
      ],
      links: profile?.links ?? { github: '', linkedin: '', portfolio: '' },
      preferences: (profile?.preferences as {
        roles: string[]
        salaryRange: string
      } | null) ?? { roles: [] as string[], salaryRange: '' },
    },
    validators: {
      onSubmit: pilotProfileSchema,
    },
    onSubmit: async ({ value }) => {
      if (profile?.id) {
        await updateProfileDetails(value)
      } else {
        await saveProfileDetails(value)
      }
    },
  })

  return (
    <div className="section max-w-3xl">
      <SectionHeader
        title="Pilot Profile"
        description="Your master CV data. Co-Pilot uses this to tailor every document it generates."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="flex flex-col gap-6"
      >
        <SectionCard title="Personal Info">
          <div className="flex gap-4">
            <form.Field
              name="fullName"
              children={(field) => (
                <div className="w-full space-y-1.5">
                  <Label htmlFor="fullName" className={labelClass}>
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Jane Doe"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={inputClass}
                  />
                  {field.state.meta.errors.map((err, i) => (
                    <p key={i} className="text-destructive text-xs">
                      {err?.message as string}
                    </p>
                  ))}
                </div>
              )}
            />
            <form.Field
              name="email"
              children={(field) => (
                <div className="w-full space-y-1.5">
                  <Label htmlFor="email" className={labelClass}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={inputClass}
                  />
                  {field.state.meta.errors.map((err, i) => (
                    <p key={i} className="text-destructive text-xs">
                      {err?.message as string}
                    </p>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="flex gap-4">
            <form.Field
              name="location"
              children={(field) => (
                <div className="w-full space-y-1.5">
                  <Label htmlFor="location" className={labelClass}>
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="San Francisco, CA"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={inputClass}
                  />
                  {field.state.meta.errors.map((err, i) => (
                    <p key={i} className="text-destructive text-xs">
                      {err?.message as string}
                    </p>
                  ))}
                </div>
              )}
            />
            <form.Field
              name="headline"
              children={(field) => (
                <div className="w-full space-y-1.5">
                  <Label htmlFor="headline" className={labelClass}>
                    Headline
                  </Label>
                  <Input
                    id="headline"
                    placeholder="Senior Frontend Engineer"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={inputClass}
                  />
                  {field.state.meta.errors.map((err, i) => (
                    <p key={i} className="text-destructive text-xs">
                      {err?.message as string}
                    </p>
                  ))}
                </div>
              )}
            />
          </div>

          <form.Field
            name="summary"
            children={(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="summary" className={labelClass}>
                  Summary
                </Label>
                <Textarea
                  id="summary"
                  rows={5}
                  placeholder="Brief professional summary (50–600 characters)..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={inputClass}
                />
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-destructive text-xs">
                    {err?.message as string}
                  </p>
                ))}
              </div>
            )}
          />
        </SectionCard>

        <SectionCard title="Skills">
          <form.Field
            name="skills"
            children={(field) => (
              <div className="space-y-3">
                <div className="flex min-h-6 flex-wrap gap-2">
                  {field.state.value.map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="bg-secondary text-foreground flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => form.removeFieldValue('skills', i)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill and press Enter..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault()
                        const v = skillInput.trim().replace(/,$/, '')
                        if (v) {
                          form.pushFieldValue('skills', v)
                          setSkillInput('')
                        }
                      }
                    }}
                    className={inputClass}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const v = skillInput.trim()
                      if (v) {
                        form.pushFieldValue('skills', v)
                        setSkillInput('')
                      }
                    }}
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                </div>
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-destructive text-xs">
                    {err?.message as string}
                  </p>
                ))}
              </div>
            )}
          />
        </SectionCard>

        <SectionCard title="Work Experience">
          <form.Field
            name="experience"
            children={(field) => (
              <div className="flex flex-col gap-4">
                {field.state.value.map((_, i) => (
                  <div
                    key={i}
                    className="relative flex flex-col gap-3 rounded-md border p-4"
                  >
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => form.removeFieldValue('experience', i)}
                        className="text-muted-foreground hover:text-destructive absolute top-3 right-3"
                      >
                        <XIcon className="size-4" />
                      </button>
                    )}

                    <div className="flex gap-4">
                      <form.Field
                        name={`experience[${i}].company`}
                        children={(f) => (
                          <div className="w-full space-y-1.5">
                            <Label className={labelClass}>Company</Label>
                            <Input
                              placeholder="Acme Corp"
                              value={f.state.value}
                              onChange={(e) => f.handleChange(e.target.value)}
                              onBlur={f.handleBlur}
                              className={inputClass}
                            />
                            {f.state.meta.errors.map((err, j) => (
                              <p key={j} className="text-destructive text-xs">
                                {err?.message as string}
                              </p>
                            ))}
                          </div>
                        )}
                      />
                      <form.Field
                        name={`experience[${i}].role`}
                        children={(f) => (
                          <div className="w-full space-y-1.5">
                            <Label className={labelClass}>Role</Label>
                            <Input
                              placeholder="Software Engineer"
                              value={f.state.value}
                              onChange={(e) => f.handleChange(e.target.value)}
                              onBlur={f.handleBlur}
                              className={inputClass}
                            />
                            {f.state.meta.errors.map((err, j) => (
                              <p key={j} className="text-destructive text-xs">
                                {err?.message as string}
                              </p>
                            ))}
                          </div>
                        )}
                      />
                    </div>

                    <form.Field
                      name={`experience[${i}].dates`}
                      children={(f) => (
                        <div className="w-1/2 space-y-1.5">
                          <Label className={labelClass}>Dates</Label>
                          <Input
                            placeholder="Jan 2022 – Present"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
                            className={inputClass}
                          />
                          {f.state.meta.errors.map((err, j) => (
                            <p key={j} className="text-destructive text-xs">
                              {err?.message as string}
                            </p>
                          ))}
                        </div>
                      )}
                    />

                    <form.Field
                      name={`experience[${i}].bullets`}
                      children={(bulletsField) => (
                        <div className="flex flex-col gap-2">
                          <Label className={labelClass}>Bullet Points</Label>
                          {bulletsField.state.value.map((__, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <form.Field
                                name={`experience[${i}].bullets[${j}]`}
                                children={(bf) => (
                                  <Input
                                    placeholder="Achieved X by doing Y, resulting in Z..."
                                    value={bf.state.value}
                                    onChange={(e) =>
                                      bf.handleChange(e.target.value)
                                    }
                                    onBlur={bf.handleBlur}
                                    className={`flex-1 ${inputClass}`}
                                  />
                                )}
                              />
                              {j > 0 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    form.removeFieldValue(
                                      `experience[${i}].bullets`,
                                      j,
                                    )
                                  }
                                  className="text-muted-foreground hover:text-destructive shrink-0"
                                >
                                  <XIcon className="size-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-fit text-xs"
                            onClick={() =>
                              form.pushFieldValue(
                                `experience[${i}].bullets`,
                                '',
                              )
                            }
                          >
                            <PlusIcon className="size-3" /> Add bullet
                          </Button>
                          {bulletsField.state.meta.errors.map((err, j) => (
                            <p key={j} className="text-destructive text-xs">
                              {err?.message as string}
                            </p>
                          ))}
                        </div>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-fit text-sm"
                  onClick={() =>
                    form.pushFieldValue('experience', {
                      company: '',
                      role: '',
                      dates: '',
                      bullets: [''],
                    })
                  }
                >
                  <PlusIcon className="size-4" /> Add Experience
                </Button>
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-destructive text-xs">
                    {err?.message as string}
                  </p>
                ))}
              </div>
            )}
          />
        </SectionCard>

        <SectionCard title="Education">
          <form.Field
            name="education"
            children={(field) => (
              <div className="flex flex-col gap-4">
                {field.state.value.map((_, i) => (
                  <div
                    key={i}
                    className="relative grid grid-cols-3 gap-4 rounded-md border p-4"
                  >
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => form.removeFieldValue('education', i)}
                        className="text-muted-foreground hover:text-destructive absolute top-3 right-3"
                      >
                        <XIcon className="size-4" />
                      </button>
                    )}
                    <form.Field
                      name={`education[${i}].institution`}
                      children={(f) => (
                        <div className="space-y-1.5">
                          <Label className={labelClass}>Institution</Label>
                          <Input
                            placeholder="MIT"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
                            className={inputClass}
                          />
                          {f.state.meta.errors.map((err, j) => (
                            <p key={j} className="text-destructive text-xs">
                              {err?.message as string}
                            </p>
                          ))}
                        </div>
                      )}
                    />
                    <form.Field
                      name={`education[${i}].degree`}
                      children={(f) => (
                        <div className="space-y-1.5">
                          <Label className={labelClass}>Degree</Label>
                          <Input
                            placeholder="B.S. Computer Science"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
                            className={inputClass}
                          />
                          {f.state.meta.errors.map((err, j) => (
                            <p key={j} className="text-destructive text-xs">
                              {err?.message as string}
                            </p>
                          ))}
                        </div>
                      )}
                    />
                    <form.Field
                      name={`education[${i}].year`}
                      children={(f) => (
                        <div className="space-y-1.5">
                          <Label className={labelClass}>Year</Label>
                          <Input
                            placeholder="2020"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
                            className={inputClass}
                          />
                          {f.state.meta.errors.map((err, j) => (
                            <p key={j} className="text-destructive text-xs">
                              {err?.message as string}
                            </p>
                          ))}
                        </div>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-fit text-sm"
                  onClick={() =>
                    form.pushFieldValue('education', {
                      institution: '',
                      degree: '',
                      year: '',
                    })
                  }
                >
                  <PlusIcon className="size-4" /> Add Education
                </Button>
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-destructive text-xs">
                    {err?.message as string}
                  </p>
                ))}
              </div>
            )}
          />
        </SectionCard>

        <SectionCard title="Links">
          {(['github', 'linkedin', 'portfolio'] as const).map((key) => (
            <form.Field
              key={key}
              name={`links.${key}`}
              children={(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={key} className={`${labelClass} capitalize`}>
                    {key}
                  </Label>
                  <Input
                    id={key}
                    placeholder={`https://${key}.com/...`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={inputClass}
                  />
                  {field.state.meta.errors.map((err, i) => (
                    <p key={i} className="text-destructive text-xs">
                      {err?.message as string}
                    </p>
                  ))}
                </div>
              )}
            />
          ))}
        </SectionCard>

        <SectionCard title="Preferences">
          <form.Field
            name="preferences.salaryRange"
            children={(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="salaryRange" className={labelClass}>
                  Salary Range
                </Label>
                <Input
                  id="salaryRange"
                  placeholder="$120k – $160k"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={inputClass}
                />
              </div>
            )}
          />

          <form.Field
            name="preferences.roles"
            children={(field) => (
              <div className="space-y-3">
                <Label className={labelClass}>Preferred Roles</Label>
                <div className="flex min-h-6 flex-wrap gap-2">
                  {field.state.value.map((role, i) => (
                    <span
                      key={i}
                      className="bg-secondary text-foreground flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() =>
                          form.removeFieldValue('preferences.roles', i)
                        }
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add preferred role and press Enter..."
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const v = roleInput.trim()
                        if (v) {
                          form.pushFieldValue('preferences.roles', v)
                          setRoleInput('')
                        }
                      }
                    }}
                    className={inputClass}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const v = roleInput.trim()
                      if (v) {
                        form.pushFieldValue('preferences.roles', v)
                        setRoleInput('')
                      }
                    }}
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                </div>
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-destructive text-xs">
                    {err?.message as string}
                  </p>
                ))}
              </div>
            )}
          />
        </SectionCard>

        <div className="flex justify-end pb-8">
          <form.Subscribe
            selector={(s) => [s.isSubmitting, s.isDirty]}
            children={([isSubmitting, isDirty]) => (
              <Button
                type="submit"
                className="text-[13px] uppercase"
                disabled={isSubmitting || !isDirty}
              >
                {profile?.id ? 'Save Changes' : 'Submit'}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  )
}
