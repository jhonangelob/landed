import { useState } from 'react'

import { getTimeSince } from '#/helper/date'
import { formatNumber, parseNumber } from '#/helper/number'
import { PlusIcon, XIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'

import SectionCard from '#/components/profile/SectionCard'

import type { PilotProfile } from '#/lib/db/schema'
import { cn } from '#/lib/utils'

import { pilotProfileSchema } from '#/validators/profile'
import type { PilotProfileInput } from '#/validators/profile'

interface ProfileFormProps {
  profile: PilotProfile | null
  account: any
  onSave: (value: PilotProfileInput) => Promise<void> | void
}

export default function ProfileForm({
  profile,
  account,
  onSave,
}: ProfileFormProps) {
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
      certifications: profile?.certifications ?? [],
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
      await onSave(value)
    },
  })

  return (
    <form
      className="flex max-w-4xl flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <SectionCard
        order={1}
        title="Identity"
        description="How Co-Pilot refers to you on every document."
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <form.Field
            name="fullName"
            children={(field) => (
              <div className="w-full space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Jane Doe"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
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
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  placeholder="Software Engineer"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
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
        <div className="flex flex-col gap-4 md:flex-row">
          <form.Field
            name="email"
            children={(field) => (
              <div className="w-full space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@example.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
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
            name="location"
            children={(field) => (
              <div className="w-full space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Manila, Philippines"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
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
        <div className="flex flex-col gap-4 md:flex-row">
          <form.Field
            name="links.github"
            children={(field) => (
              <div className="w-full space-y-1.5">
                <Label htmlFor="github">Github</Label>
                <Input
                  id="github"
                  placeholder="https://github.com/..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
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
            name="links.linkedin"
            children={(field) => (
              <div className="w-full space-y-1.5">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
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
          name="links.portfolio"
          children={(field) => (
            <div className="w-full space-y-1.5">
              <Label htmlFor="portfolio">Portfolio</Label>
              <Input
                id="portfolio"
                placeholder="https://portfolio.com/..."
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
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
          name="summary"
          children={(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                rows={10}
                placeholder="Brief professional summary (50–600 characters)..."
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
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

      <SectionCard
        order={2}
        title="Experience"
        description="The most recent appears first."
      >
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
                  <div className="flex flex-col gap-4 md:flex-row">
                    <form.Field
                      name={`experience[${i}].company`}
                      children={(f) => (
                        <div className="w-full space-y-1.5">
                          <Label>Company</Label>
                          <Input
                            placeholder="Company"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
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
                          <Label>Role</Label>
                          <Input
                            placeholder="Software Engineer"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
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
                      <div className="w-full space-y-1.5 md:w-1/2">
                        <Label>Dates</Label>
                        <Input
                          placeholder="Jan 2022 – Present"
                          value={f.state.value}
                          onChange={(e) => f.handleChange(e.target.value)}
                          onBlur={f.handleBlur}
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
                        <Label>Bullet Points</Label>
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
                                  className="flex-1"
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
                          className="w-fit text-xs shadow-none"
                          onClick={() =>
                            form.pushFieldValue(`experience[${i}].bullets`, '')
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
                className="w-fit text-sm shadow-none"
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

      <SectionCard
        order={3}
        title="Skills"
        description="Type a skill and press Enter. Co-Pilot picks which to surface per job."
      >
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
                  className="h-10.5 shadow-none"
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

      <SectionCard order={4} title="Education" description="Education">
        <form.Field
          name="education"
          children={(field) => (
            <div className="flex flex-col gap-4">
              {field.state.value.map((_, i) => (
                <div
                  key={i}
                  className="relative flex flex-col gap-4 rounded-md border p-4"
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
                        <Label>University</Label>
                        <Input
                          placeholder="MIT"
                          value={f.state.value}
                          onChange={(e) => f.handleChange(e.target.value)}
                          onBlur={f.handleBlur}
                        />
                        {f.state.meta.errors.map((err, j) => (
                          <p key={j} className="text-destructive text-xs">
                            {err?.message as string}
                          </p>
                        ))}
                      </div>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <form.Field
                      name={`education[${i}].degree`}
                      children={(f) => (
                        <div className="space-y-1.5">
                          <Label>Degree</Label>
                          <Input
                            placeholder="B.S. Computer Science"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
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
                          <Label>Year</Label>
                          <Input
                            placeholder="2020"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
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
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-fit text-sm shadow-none"
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

      <SectionCard
        order={5}
        title="Certifications"
        description="Licenses and certifications to strengthen your profile."
      >
        <form.Field
          name="certifications"
          children={(field) => (
            <div className="flex flex-col gap-4">
              {field.state.value.map((_, i) => (
                <div
                  key={i}
                  className="relative flex flex-col gap-4 rounded-md border p-4"
                >
                  <button
                    type="button"
                    onClick={() => form.removeFieldValue('certifications', i)}
                    className="text-muted-foreground hover:text-destructive absolute top-3 right-3"
                  >
                    <XIcon className="size-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <form.Field
                      name={`certifications[${i}].name`}
                      children={(f) => (
                        <div className="space-y-1.5">
                          <Label>Name</Label>
                          <Input
                            placeholder="AWS Certified Solutions Architect"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
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
                      name={`certifications[${i}].issuer`}
                      children={(f) => (
                        <div className="space-y-1.5">
                          <Label>Issuer</Label>
                          <Input
                            placeholder="Amazon Web Services"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
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
                  <div className="grid grid-cols-3 gap-4">
                    <form.Field
                      name={`certifications[${i}].issueDate`}
                      children={(f) => (
                        <div className="space-y-1.5">
                          <Label>Issue Date</Label>
                          <Input
                            placeholder="2023-06"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
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
                      name={`certifications[${i}].expiryDate`}
                      children={(f) => (
                        <div className="space-y-1.5">
                          <Label>Expiry Date</Label>
                          <Input
                            placeholder="2026-06 (optional)"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
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
                      name={`certifications[${i}].url`}
                      children={(f) => (
                        <div className="space-y-1.5">
                          <Label>URL</Label>
                          <Input
                            placeholder="https://... (optional)"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
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
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-fit text-sm shadow-none"
                onClick={() =>
                  form.pushFieldValue('certifications', {
                    name: '',
                    issuer: '',
                    issueDate: '',
                    expiryDate: '',
                    url: '',
                  })
                }
              >
                <PlusIcon className="size-4" /> Add Certification
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

      <SectionCard
        order={6}
        title="Preferences"
        description="Target roles and salary range Co-Pilot uses to tailor your documents."
      >
        <form.Field
          name="preferences.roles"
          children={(field) => (
            <div className="space-y-3">
              <Label>Preferred Roles</Label>
              <div className="flex min-h-6 flex-wrap gap-2">
                {field.state.value.map((role: string, i: number) => (
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
                  placeholder="Add a role and press Enter..."
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault()
                      const v = roleInput.trim().replace(/,$/, '')
                      if (v) {
                        form.pushFieldValue('preferences.roles', v)
                        setRoleInput('')
                      }
                    }
                  }}
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
                  className="h-10.5 shadow-none"
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
        <form.Field
          name="preferences.salaryRange"
          children={(field) => (
            <div className="space-y-1.5">
              <Label>Salary Range</Label>
              <Input
                id="salaryRange"
                placeholder="e.g. 120,000"
                value={formatNumber(field.state.value)}
                onChange={(e) =>
                  field.handleChange(parseNumber(e.target.value))
                }
                onBlur={field.handleBlur}
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

      <form.Subscribe
        selector={(s) => ({
          isSubmitting: s.isSubmitting,
          isDirty: s.isDirty,
        })}
        children={({ isSubmitting, isDirty }) => (
          <div className="sticky bottom-4 flex items-center justify-between rounded-lg border bg-white p-4">
            <div className="flex flex-row items-center gap-3.5">
              <div
                className={cn(
                  'h-2.5 w-2.5 rounded-full outline-3',
                  isDirty
                    ? 'bg-[#e0a11b] outline-[#e0a11b]/20'
                    : 'bg-primary outline-primary/20',
                )}
              />
              <p className="text-primary-text font-mono text-[11px] leading-[1.4] tracking-[0.9px] uppercase">
                {isDirty
                  ? 'Unsaved Changes'
                  : `All changes saved · ${profile?.updatedAt ? getTimeSince(profile.updatedAt) : ''}`}
              </p>
            </div>
            <Button
              type="submit"
              className="text-[12px] uppercase"
              disabled={isSubmitting || !isDirty}
            >
              {profile?.id ? 'Save Changes' : 'Submit'}
            </Button>
          </div>
        )}
      />
    </form>
  )
}
