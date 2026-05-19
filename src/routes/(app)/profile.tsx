import { useState } from 'react'
import SectionHeader from '#/components/layout/SectionHeader'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { Switch } from '#/components/ui/switch'
import { pilotProfileSchema, pilotProfileDefaults } from '#/validators/profile'
import { XIcon, PlusIcon } from 'lucide-react'
import { SectionCard } from '#/components/layout/SectionCard'

export const Route = createFileRoute('/(app)/profile')({
  component: RouteComponent,
})

const labelClass = 'font-sans font-medium text-[12px] text-muted-foreground'
const inputClass = 'bg-white shadow-none placeholder:text-sm text-sm'

function FieldError({ errors }: { errors: unknown[] }) {
  if (!errors.length) return null
  return <p className="text-xs text-destructive">{errors[0] as string}</p>
}

function RouteComponent() {
  const [skillInput, setSkillInput] = useState('')
  const [roleInput, setRoleInput] = useState('')

  const form = useForm({
    defaultValues: pilotProfileDefaults,
    validators: {
      onSubmit: ({ value }) => {
        const result = pilotProfileSchema.safeParse(value)
        if (!result.success) return result.error.issues[0]?.message
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      console.log(value)
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
        {/* ── Personal Info ─────────────────────────── */}
        <SectionCard title="Personal Info">
          <div className="flex gap-4">
            <form.Field
              name="fullName"
              children={(field) => (
                <div className="space-y-1.5 w-full">
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
                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            />
            <form.Field
              name="email"
              children={(field) => (
                <div className="space-y-1.5 w-full">
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
                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            />
          </div>

          <div className="flex gap-4">
            <form.Field
              name="location"
              children={(field) => (
                <div className="space-y-1.5 w-full">
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
                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            />
            <form.Field
              name="headline"
              children={(field) => (
                <div className="space-y-1.5 w-full">
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
                  <FieldError errors={field.state.meta.errors} />
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
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          />
        </SectionCard>

        {/* ── Skills ────────────────────────────────── */}
        <SectionCard title="Skills">
          <form.Field
            name="skills"
            children={(field) => (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 min-h-6">
                  {field.state.value.map((skill, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 text-[12px] font-medium bg-secondary text-foreground rounded-md px-2 py-1"
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
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          />
        </SectionCard>

        {/* ── Work Experience ───────────────────────── */}
        <SectionCard title="Work Experience">
          <form.Field
            name="experience"
            children={(field) => (
              <div className="flex flex-col gap-4">
                {field.state.value.map((_, i) => (
                  <div
                    key={i}
                    className="relative flex flex-col gap-3 border rounded-md p-4"
                  >
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => form.removeFieldValue('experience', i)}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
                      >
                        <XIcon className="size-4" />
                      </button>
                    )}

                    <div className="flex gap-4">
                      <form.Field
                        name={`experience[${i}].company`}
                        children={(f) => (
                          <div className="space-y-1.5 w-full">
                            <Label className={labelClass}>Company</Label>
                            <Input
                              placeholder="Acme Corp"
                              value={f.state.value}
                              onChange={(e) => f.handleChange(e.target.value)}
                              onBlur={f.handleBlur}
                              className={inputClass}
                            />
                            <FieldError errors={f.state.meta.errors} />
                          </div>
                        )}
                      />
                      <form.Field
                        name={`experience[${i}].role`}
                        children={(f) => (
                          <div className="space-y-1.5 w-full">
                            <Label className={labelClass}>Role</Label>
                            <Input
                              placeholder="Software Engineer"
                              value={f.state.value}
                              onChange={(e) => f.handleChange(e.target.value)}
                              onBlur={f.handleBlur}
                              className={inputClass}
                            />
                            <FieldError errors={f.state.meta.errors} />
                          </div>
                        )}
                      />
                    </div>

                    <form.Field
                      name={`experience[${i}].dates`}
                      children={(f) => (
                        <div className="space-y-1.5 w-1/2">
                          <Label className={labelClass}>Dates</Label>
                          <Input
                            placeholder="Jan 2022 – Present"
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
                            className={inputClass}
                          />
                          <FieldError errors={f.state.meta.errors} />
                        </div>
                      )}
                    />

                    <form.Field
                      name={`experience[${i}].bullets`}
                      children={(bulletsField) => (
                        <div className="flex flex-col gap-2">
                          <Label className={labelClass}>Bullet Points</Label>
                          {bulletsField.state.value.map((_, j) => (
                            <div key={j} className="flex gap-2 items-center">
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
                          <FieldError errors={bulletsField.state.meta.errors} />
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
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          />
        </SectionCard>

        {/* ── Education ─────────────────────────────── */}
        <SectionCard title="Education">
          <form.Field
            name="education"
            children={(field) => (
              <div className="flex flex-col gap-4">
                {field.state.value.map((_, i) => (
                  <div
                    key={i}
                    className="relative grid grid-cols-3 gap-4 border rounded-md p-4"
                  >
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => form.removeFieldValue('education', i)}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
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
                          <FieldError errors={f.state.meta.errors} />
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
                          <FieldError errors={f.state.meta.errors} />
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
                          <FieldError errors={f.state.meta.errors} />
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
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          />
        </SectionCard>

        {/* ── Links ─────────────────────────────────── */}
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
                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            />
          ))}
        </SectionCard>

        {/* ── Preferences ───────────────────────────── */}
        <SectionCard title="Preferences">
          <form.Field
            name="preferences.remote"
            children={(field) => (
              <div className="flex items-center justify-between">
                <Label className={labelClass}>Open to Remote</Label>
                <Switch
                  checked={field.state.value}
                  onCheckedChange={(v) => field.handleChange(v)}
                />
              </div>
            )}
          />

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
                  value={field.state.value ?? ''}
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
                <div className="flex flex-wrap gap-2 min-h-6">
                  {field.state.value.map((role, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 text-[12px] font-medium bg-secondary text-foreground rounded-md px-2 py-1"
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
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          />
        </SectionCard>

        <div className="flex justify-end pb-8">
          <Button type="submit" className="text-[12px]">
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  )
}
