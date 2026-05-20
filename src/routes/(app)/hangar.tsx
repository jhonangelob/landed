import { SectionCard } from '#/components/layout/SectionCard'
import SectionHeader from '#/components/layout/SectionHeader'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { ACCOUNT_DELETION_WARNING_LIST } from '#/constant/account'
import { changePassword, signOut } from '#/lib/auth/client'
import {
  deleteAccount,
  getAccountDetails,
  updateAccountDetails,
} from '#/server/account'
import { updateAccountSchema } from '#/validators/account'
import { useForm } from '@tanstack/react-form'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { XIcon } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/(app)/hangar')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: ['account_details'],
      queryFn: () => getAccountDetails(),
    }),
  component: RouteComponent,
})

const labelClass = 'font-sans font-medium text-[12px] text-muted-foreground'
const inputClass = 'bg-white shadow-none placeholder:text-sm text-sm'

const FEATURES = [
  'Unlimited applications',
  '50 AI generations / month',
  'PDF + DOCX export',
  'Version history',
]

function RouteComponent() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [passwordUpdateError, setPasswordUpdateError] = useState('')
  const [deleteInput, setDeleteInput] = useState('')

  const { data: account } = useSuspenseQuery({
    queryKey: ['account_details'],
    queryFn: () => getAccountDetails(),
  })

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: async (value: typeof form.state.values) => {
      await updateAccountDetails({ data: value })

      if (value.currentPassword) {
        const { error } = await changePassword({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
          revokeOtherSessions: true,
        })

        if (error) throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account_details'] })
      setPasswordUpdateError('')
    },
    onError: (err) => {
      setPasswordUpdateError(err.message)
      form.resetField('currentPassword')
      form.resetField('newPassword')
      form.resetField('confirmPassword')
    },
  })

  const { mutateAsync: deleteUserProfile } = useMutation({
    mutationFn: async (value: string) => {
      console.log({ value })
      if (value === 'DELETE') {
        await deleteAccount()
      }
    },
    onSuccess: () => {
      signOut()
      router.navigate({ to: '/co-pilot' })
    },
    onError: () => {},
  })

  const form = useForm({
    defaultValues: {
      fullName: account[0].name,
      email: account[0].email,
      currentPassword: '',
      confirmPassword: '',
      newPassword: '',
    },
    validators: { onSubmit: updateAccountSchema },
    onSubmit: async ({ value, formApi }) => {
      await updateProfile(value)
      formApi.reset({
        ...value,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    },
  })

  const handleConfirmDeleteAccount = () => {
    deleteUserProfile(deleteInput)
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
                      {field.state.meta.errors.map((err, i) => (
                        <p key={i} className="text-xs text-destructive">
                          {err?.message as string}
                        </p>
                      ))}
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
                      {field.state.meta.errors.map((err, i) => (
                        <p key={i} className="text-xs text-destructive">
                          {err?.message as string}
                        </p>
                      ))}
                    </div>
                  )}
                />
              </div>
            </SectionCard>

            <SectionCard title="Change Password">
              {passwordUpdateError && (
                <p className="font-display text-[12px] font-medium text-destructive">
                  {passwordUpdateError}
                </p>
              )}

              <form.Field
                name="currentPassword"
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
                    {field.state.meta.errors.map((err, i) => (
                      <p key={i} className="text-xs text-destructive">
                        {err?.message as string}
                      </p>
                    ))}
                  </div>
                )}
              />

              <div className="flex gap-4">
                <form.Field
                  name="newPassword"
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
                      {field.state.meta.errors.map((err, i) => (
                        <p key={i} className="text-xs text-destructive">
                          {err?.message as string}
                        </p>
                      ))}
                    </div>
                  )}
                />
                <form.Field
                  name="confirmPassword"
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
                      {field.state.meta.errors.map((err, i) => (
                        <p key={i} className="text-xs text-destructive">
                          {err?.message as string}
                        </p>
                      ))}
                    </div>
                  )}
                />
              </div>
            </SectionCard>

            {/* <SectionCard title="Notifications">
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
            </SectionCard> */}

            <div className="flex justify-end pb-8">
              <form.Subscribe
                selector={(s) => [s.isSubmitting, s.isDirty]}
                children={([isSubmitting, isDirty]) => (
                  <Button
                    type="submit"
                    className="uppercase text-[12px]"
                    disabled={isSubmitting || !isDirty}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              />
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

              <Dialog>
                <DialogTrigger>
                  <Button
                    variant="destructive"
                    className="rounded-lg cursor-pointer"
                  >
                    Delete account
                  </Button>
                </DialogTrigger>
                <DialogContent className="space-y-4 w-110">
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="font-medium">
                      This will permanently delete your Landed account and all
                      associated data. This action{' '}
                      <span className="font-bold">cannot be undone.</span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="border p-3 flex flex-col gap-1 rounded-md border-destructive bg-red-200">
                    {ACCOUNT_DELETION_WARNING_LIST.map((item) => (
                      <div className="text-destructive font-sans text-[13px] font-medium flex flex-row gap-2 items-center">
                        <XIcon className="w-4 h-4" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="flex gap-1 items-end text-[13px] font-sans">
                      Type
                      <span className="text-destructive font-mono font-medium">
                        DELETE
                      </span>
                      to confirm
                    </p>
                    <Input
                      placeholder="DELETE"
                      value={deleteInput}
                      onChange={(e) => setDeleteInput(e.target.value)}
                    />
                    <p className="text-muted-foreground font-sans text-[13px]">
                      This action is permanent and cannot be reversed
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    className="uppercase cursor-pointer w-fit ml-auto text-[13px]"
                    disabled={deleteInput !== 'DELETE'}
                    onClick={handleConfirmDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
