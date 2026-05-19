import { SectionCard } from '#/components/layout/SectionCard'
import SectionHeader from '#/components/layout/SectionHeader'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Switch } from '#/components/ui/switch'
import { hangarDefaults, hangarSchema } from '#/validators/account'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/hangar')({
  component: RouteComponent,
})

const labelClass = 'font-sans font-medium text-[12px] text-muted-foreground'
const inputClass = 'bg-white shadow-none placeholder:text-sm text-sm'

function FieldError({ errors }: { errors: unknown[] }) {
  if (!errors.length) return null
  return <p className="text-xs text-destructive">{errors[0] as string}</p>
}

const FEATURES = [
  'Unlimited applications',
  '50 AI generations / month',
  'PDF + DOCX export',
  'Version history',
]

function RouteComponent() {
  const form = useForm({
    defaultValues: hangarDefaults,
    validators: {
      onSubmit: ({ value }) => {
        const result = hangarSchema.safeParse(value)
        if (!result.success) return result.error.issues[0]?.message
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  const handleDeleteAccount = () => {
    console.log('unimplemented: Delete account')
  }

  const handleUpgradePlan = () => {
    console.log('unimplemented: Upgrade Plan')
  }

  return (
    <div className="section">
      <SectionHeader
        title="Hangar"
        description="Account settings and preferences."
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="flex flex-col gap-6"
          >
            {/* ── Profile ───────────────────────────────── */}
            <SectionCard title="Profile">
              <div className="flex flex-col lg:flex-row gap-4">
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
                        disabled
                      />
                      <Label className="font-sans text-[11px] text-foreground-soft2">
                        Contact support to change your email.
                      </Label>
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
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
                  name="timezone"
                  children={(field) => (
                    <div className="space-y-1.5 w-full">
                      <Label htmlFor="timezone" className={labelClass}>
                        Timezone
                      </Label>
                      <Input
                        id="timezone"
                        placeholder="America/Los_Angeles"
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
            </SectionCard>

            {/* ── Password ──────────────────────────────── */}
            <SectionCard title="Change Password">
              <form.Field
                name="password.currentPassword"
                children={(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPassword" className={labelClass}>
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className={inputClass}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                )}
              />

              <div className="flex gap-4">
                <form.Field
                  name="password.newPassword"
                  children={(field) => (
                    <div className="space-y-1.5 w-full">
                      <Label htmlFor="newPassword" className={labelClass}>
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
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
                  name="password.confirmPassword"
                  children={(field) => (
                    <div className="space-y-1.5 w-full">
                      <Label htmlFor="confirmPassword" className={labelClass}>
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
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
            </SectionCard>

            {/* ── Notifications ─────────────────────────── */}
            <SectionCard title="Notifications">
              <form.Field
                name="notifications.interviewReminders"
                children={(field) => (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary-text">
                        Interview Reminders
                      </p>
                      <p className={labelClass}>
                        Get notified before upcoming interview dates.
                      </p>
                    </div>
                    <Switch
                      checked={field.state.value}
                      onCheckedChange={(v) => field.handleChange(v)}
                    />
                  </div>
                )}
              />
            </SectionCard>

            <div className="flex justify-end pb-8">
              <Button type="submit" className="uppercase text-[12px]">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="border border-primary/40 bg-primary/10 p-5 rounded-lg w-full flex flex-row justify-between items-center">
            <div className="text-primary">
              <p className="font-bold text-[14px] font-display">Free Plan</p>
              <span className="text-[13px]">
                3 of 10 AI generations used this month · Resets June 1
              </span>
            </div>
            <div className="px-3 py-1 text-[12px] text-muted-foreground border-foreground-soft2 font-mono font-medium border rounded-full text-nowrap">
              Current Plan
            </div>
          </div>
          <div className="border bg-white p-5 rounded-lg w-full flex flex-row justify-between items-center">
            <div className="flex flex-col gap-2">
              <div className="text-primary-text font-semibold text-[16px]">
                First Officer
              </div>
              <div className="flex flex-col gap-1">
                {FEATURES.map((item, index) => (
                  <div
                    className="text-[12px] text-muted-foreground"
                    key={index}
                  >
                    <span className="text-primary font-bold mr-2">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-primary-text font-display font-bold text-[32px]">
                $12
                <span className="text-[16px] font-normal text-muted-foreground">
                  /mo
                </span>
              </div>
              <div className="text-[12px] text-muted-foreground">
                or $99/yr — save 30%
              </div>
              <Button
                onClick={handleUpgradePlan}
                className="cursor-pointer rounded-lg"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
          <div className="mt-auto mb-24">
            <p className="font-mono uppercase font-medium text-[12px] text-destructive">
              Danger Zone
            </p>
            <div className="border border-destructive rounded-lg bg-white p-5 mt-3 flex flex-row gap-2 items-center justify-between">
              <div>
                <p className="font-sans text-primary-text font-semibold text-[14px]">
                  Delete account
                </p>
                <span className="font-sans text-muted-foreground text-[12px]">
                  Permanently removes your account, all applications, and
                  documents. This <br /> cannot be undone.
                </span>
              </div>
              <Button
                variant="destructive"
                className="rounded-lg cursor-pointer"
                onClick={handleDeleteAccount}
              >
                Delete account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
