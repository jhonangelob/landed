import { useEffect, useState } from 'react'

import { getTimeSince } from '#/helper/date'
import type {
  PilotProfile,
  PilotProfileInput,
  UpdatePilotProfileInput,
} from '#/types'
import { PlusIcon, XIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'

import SectionCard from '#/components/profile/SectionCard'

import { cn } from '#/lib/utils'

import { savePilotProfileSchema } from '#/validators/profile'
import { PROFILE_LIMITS } from '#/validators/shared'

interface ProfileFormProps {
  profile: PilotProfile | null
  parsedData?: Partial<PilotProfileInput> | null
  onSaveProfile: (value: PilotProfileInput) => Promise<void> | void
  className: string
}

export default function ProfileForm({
  profile,
  parsedData,
  onSaveProfile,
  className,
}: ProfileFormProps) {
  const [skillInput, setSkillInput] = useState('')
  const [roleInput, setRoleInput] = useState('')
  const [wordInput, setWordInput] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm({
    defaultValues: {
      name: profile?.name ?? '',
      email: profile?.email ?? '',
      location: profile?.location ?? '',
      headline: profile?.headline ?? '',
      summary: profile?.summary ?? '',
      skills: profile?.skills ?? [],
      phone: profile?.phone ?? '',
      experience: profile?.experience ?? [
        { company: '', role: '', dates: '', bullets: [''] },
      ],
      education: profile?.education ?? [
        { institution: '', degree: '', year: '' },
      ],
      certifications: profile?.certifications ?? [],
      links: Array.isArray(profile?.links)
        ? profile.links
        : [{ name: '', url: '' }],
      preferences: profile?.preferences ?? {
        roles: [],
        wordsToAvoid: [],
        preferredVoice: '',
      },
    } satisfies UpdatePilotProfileInput,
    validators: {
      onSubmit: savePilotProfileSchema,
    },
    onSubmit: async ({ value }) => {
      await onSaveProfile(value)
    },
  })

  useEffect(() => {
    if (!parsedData) return
    const knownKeys = ['headline', 'summary', 'location', 'phone', 'skills', 'experience', 'education', 'certifications', 'links'] as const
    for (const key of knownKeys) {
      const value = parsedData[key]
      if (value !== undefined && value !== null) {
        form.setFieldValue(key, value as never)
      }
    }
  }, [parsedData])

  return (
    <form
      className={cn('flex max-w-4xl flex-col gap-4', className)}
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
            name="name"
            children={(field) => (
              <div className="w-full space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Juan Dela Cruz"
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
        <form.Field
          name="phone"
          children={(field) => (
            <div className="w-full space-y-1.5">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                placeholder="+639..."
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
          name="links"
          children={(field) => (
            <div className="space-y-3">
              <Label>Links</Label>
              <div className="flex flex-col gap-3">
                {field.state.value.map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <form.Field
                      name={`links[${i}].name`}
                      children={(f) => (
                        <div className="w-1/3 space-y-1.5">
                          <Input
                            placeholder="GitHub"
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
                      name={`links[${i}].url`}
                      children={(f) => (
                        <div className="flex-1 space-y-1.5">
                          <Input
                            placeholder="https://github.com/username"
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
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => form.removeFieldValue('links', i)}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <XIcon className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit text-xs"
                disabled={field.state.value.length >= PROFILE_LIMITS.links}
                onClick={() =>
                  form.pushFieldValue('links', { name: '', url: '' })
                }
              >
                <PlusIcon className="size-3" /> Add link
              </Button>
              {field.state.value.length >= PROFILE_LIMITS.links && (
                <p className="text-muted-foreground text-xs">
                  Maximum {PROFILE_LIMITS.links} links reached.
                </p>
              )}
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
                rows={4}
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
                          className="w-fit text-xs"
                          disabled={
                            bulletsField.state.value.length >=
                            PROFILE_LIMITS.bullets
                          }
                          onClick={() =>
                            form.pushFieldValue(`experience[${i}].bullets`, '')
                          }
                        >
                          <PlusIcon className="size-3" /> Add bullet
                        </Button>
                        {bulletsField.state.value.length >=
                          PROFILE_LIMITS.bullets && (
                          <p className="text-muted-foreground text-xs">
                            Maximum {PROFILE_LIMITS.bullets} bullet points per
                            role.
                          </p>
                        )}
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
                disabled={field.state.value.length >= PROFILE_LIMITS.experience}
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
              {field.state.value.length >= PROFILE_LIMITS.experience && (
                <p className="text-muted-foreground text-xs">
                  Maximum {PROFILE_LIMITS.experience} experience entries
                  reached.
                </p>
              )}
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
          children={(field) => {
            const atLimit = field.state.value.length >= PROFILE_LIMITS.skills
            return (
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
                    disabled={atLimit}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault()
                        const v = skillInput.trim().replace(/,$/, '')
                        if (v && !atLimit) {
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
                    disabled={atLimit}
                    onClick={() => {
                      const v = skillInput.trim()
                      if (v && !atLimit) {
                        form.pushFieldValue('skills', v)
                        setSkillInput('')
                      }
                    }}
                    className="h-10.5"
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                </div>
                {atLimit && (
                  <p className="text-muted-foreground text-xs">
                    Maximum {PROFILE_LIMITS.skills} skills reached.
                  </p>
                )}
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-destructive text-xs">
                    {err?.message as string}
                  </p>
                ))}
              </div>
            )
          }}
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
                className="w-fit text-sm"
                disabled={field.state.value.length >= PROFILE_LIMITS.education}
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
              {field.state.value.length >= PROFILE_LIMITS.education && (
                <p className="text-muted-foreground text-xs">
                  Maximum {PROFILE_LIMITS.education} education entries reached.
                </p>
              )}
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
        title="Certifications & Trainings"
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
                className="w-fit text-sm"
                disabled={
                  field.state.value.length >= PROFILE_LIMITS.certifications
                }
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
              {field.state.value.length >= PROFILE_LIMITS.certifications && (
                <p className="text-muted-foreground text-xs">
                  Maximum {PROFILE_LIMITS.certifications} certifications
                  reached.
                </p>
              )}
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
        description="Target roles, writing voice, and words Co-Pilot avoids when tailoring your documents."
      >
        <form.Field
          name="preferences.roles"
          children={(field) => {
            const atLimit = field.state.value.length >= PROFILE_LIMITS.roles
            return (
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
                    disabled={atLimit}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault()
                        const v = roleInput.trim().replace(/,$/, '')
                        if (v && !atLimit) {
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
                    disabled={atLimit}
                    onClick={() => {
                      const v = roleInput.trim()
                      if (v && !atLimit) {
                        form.pushFieldValue('preferences.roles', v)
                        setRoleInput('')
                      }
                    }}
                    className="h-10.5"
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                </div>
                {atLimit && (
                  <p className="text-muted-foreground text-xs">
                    Maximum {PROFILE_LIMITS.roles} preferred roles reached.
                  </p>
                )}
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-destructive text-xs">
                    {err?.message as string}
                  </p>
                ))}
              </div>
            )
          }}
        />
        <form.Field
          name="preferences.preferredVoice"
          children={(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="preferredVoice">Preferred Voice</Label>
              <Textarea
                id="preferredVoice"
                rows={2}
                placeholder="e.g. Confident and concise, results-oriented, no buzzwords..."
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
          name="preferences.wordsToAvoid"
          children={(field) => {
            const words = field.state.value
            const addWord = () => {
              const v = wordInput.trim().replace(/,$/, '')
              if (v) {
                field.handleChange([...words, v])
                setWordInput('')
              }
            }
            return (
              <div className="space-y-3">
                <Label>Words to Avoid</Label>
                <div className="flex min-h-6 flex-wrap gap-2">
                  {words.map((word, i) => (
                    <span
                      key={i}
                      className="bg-secondary text-foreground flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium"
                    >
                      {word}
                      <button
                        type="button"
                        onClick={() =>
                          field.handleChange(words.filter((_, j) => j !== i))
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
                    placeholder="Add a word and press Enter..."
                    value={wordInput}
                    onChange={(e) => setWordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault()
                        addWord()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addWord}
                    className="h-10.5"
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
            )
          }}
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
                    ? 'bg-warning outline-warning/20'
                    : 'bg-primary outline-primary/20',
                )}
              />
              <p className="text-primary-text font-mono text-[11px] leading-[1.4] tracking-[0.9px] uppercase">
                {isDirty
                  ? 'Unsaved Changes'
                  : `All changes saved${mounted && profile?.updatedAt ? ` · ${getTimeSince(profile.updatedAt)}` : ''}`}
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
