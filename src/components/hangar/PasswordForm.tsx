import { useForm } from '@tanstack/react-form'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

import { updatePasswordSchema } from '#/validators/account'
import type { UpdatePasswordInput } from '#/validators/account'

interface PasswordFormProps {
  onUpdatePassword: (value: UpdatePasswordInput) => void
}

export default function PasswordForm({ onUpdatePassword }: PasswordFormProps) {
  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: { onSubmit: updatePasswordSchema },
    onSubmit: async ({ value }) => {
      await onUpdatePassword(value)
      form.reset()
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col gap-6"
    >
      <form.Field
        name="currentPassword"
        children={(field) => (
          <div className="w-full space-y-1.5">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="*****"
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
      <div className="flex flex-col gap-4 lg:flex-row">
        <form.Field
          name="newPassword"
          children={(field) => (
            <div className="w-full space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="*****"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="h-10.5 rounded-md py-2.75 placeholder:italic"
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                placeholder="*****"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                type="password"
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

      <div className="flex justify-end gap-3">
        <form.Subscribe
          selector={(s) => ({ isSubmitting: s.isSubmitting, values: s.values })}
          children={({ isSubmitting, values }) => {
            const hasValues =
              values.currentPassword !== '' &&
              values.newPassword !== '' &&
              values.confirmPassword !== ''
            return (
              <Button
                type="submit"
                variant="outline"
                className="text-[12px] uppercase"
                disabled={isSubmitting || !hasValues}
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
            )
          }}
        />
      </div>
    </form>
  )
}
