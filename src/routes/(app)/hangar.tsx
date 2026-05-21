import { useState } from 'react'

import { ACCOUNT_DELETION_WARNING_LIST } from '#/constant/account'
import { XIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'

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

import { SectionCard } from '#/components/layout/SectionCard'
import SectionHeader from '#/components/layout/SectionHeader'

import {
  deleteAccount,
  getAccountDetails,
  updateAccountDetails,
} from '#/server/account'

import { changePassword, signOut } from '#/lib/auth/client'

import { updateAccountSchema } from '#/validators/account'

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
      <div className="flex flex-col gap-6 lg:flex-row">
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="flex flex-col gap-6"
          >
            <SectionCard title="Profile">
              <div className="flex flex-col gap-4 lg:flex-row">
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
                        disabled
                      />
                      <Label className="text-foreground-soft2 font-sans text-[11px]">
                        Contact support to change your email.
                      </Label>
                      {field.state.meta.errors.map((err, i) => (
                        <p key={i} className="text-destructive text-xs">
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
                <p className="font-display text-destructive text-[12px] font-medium">
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
                      <p key={i} className="text-destructive text-xs">
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
                    <div className="w-full space-y-1.5">
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
                        <p key={i} className="text-destructive text-xs">
                          {err?.message as string}
                        </p>
                      ))}
                    </div>
                  )}
                />
                <form.Field
                  name="confirmPassword"
                  children={(field) => (
                    <div className="w-full space-y-1.5">
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
                        <p key={i} className="text-destructive text-xs">
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
                    className="text-[12px] uppercase"
                    disabled={isSubmitting || !isDirty}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              />
            </div>
          </form>
          <div className="mt-auto mb-24">
            <p className="text-destructive font-mono text-[12px] font-medium uppercase">
              Danger Zone
            </p>
            <div className="border-destructive mt-3 flex flex-row items-center justify-between gap-2 rounded-lg border bg-white p-5">
              <div>
                <p className="text-primary-text font-sans text-[14px] font-semibold">
                  Delete account
                </p>
                <span className="text-muted-foreground font-sans text-[12px]">
                  Permanently removes your account, all applications, and
                  documents. This <br /> cannot be undone.
                </span>
              </div>

              <Dialog>
                <DialogTrigger>
                  <Button
                    variant="destructive"
                    className="cursor-pointer rounded-lg"
                  >
                    Delete account
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-110 space-y-4">
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="font-medium">
                      This will permanently delete your Landed account and all
                      associated data. This action{' '}
                      <span className="font-bold">cannot be undone.</span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="border-destructive flex flex-col gap-1 rounded-md border bg-red-200 p-3">
                    {ACCOUNT_DELETION_WARNING_LIST.map((item) => (
                      <div className="text-destructive flex flex-row items-center gap-2 font-sans text-[13px] font-medium">
                        <XIcon className="h-4 w-4" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="flex items-end gap-1 font-sans text-[13px]">
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
                    className="ml-auto w-fit cursor-pointer text-[13px] uppercase"
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

        <div className="flex flex-1 flex-col gap-4">
          <div className="border-primary/40 bg-primary/10 flex w-full flex-row items-center justify-between rounded-lg border p-5">
            <div className="text-primary">
              <p className="font-display text-[14px] font-bold">Free Plan</p>
              <span className="text-[13px]">
                3 of 10 AI generations used this month · Resets June 1
              </span>
            </div>
            <div className="text-muted-foreground border-foreground-soft2 rounded-full border px-3 py-1 font-mono text-[12px] font-medium text-nowrap">
              Current Plan
            </div>
          </div>
          <div className="flex w-full flex-row items-center justify-between rounded-lg border bg-white p-5">
            <div className="flex flex-col gap-2">
              <div className="text-primary-text text-[16px] font-semibold">
                First Officer
              </div>
              <div className="flex flex-col gap-1">
                {FEATURES.map((item, index) => (
                  <div
                    className="text-muted-foreground text-[12px]"
                    key={index}
                  >
                    <span className="text-primary mr-2 font-bold">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-primary-text font-display text-[32px] font-bold">
                $12
                <span className="text-muted-foreground text-[16px] font-normal">
                  /mo
                </span>
              </div>
              <div className="text-muted-foreground text-[12px]">
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
        </div>
      </div>
    </div>
  )
}
