import { useForm } from '@tanstack/react-form'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

import { updatePasswordSchema } from '#/validators/account'
import type { UpdatePasswordInput } from '#/validators/account'
import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

interface PasswordFormProps {
  onUpdatePassword: (value: UpdatePasswordInput) => any
}

export default function PasswordForm({ onUpdatePassword }: PasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: { onSubmit: updatePasswordSchema },
    onSubmit: async ({ value }) => {
      const res = await onUpdatePassword(value)

      if (res.error) {
        if (res.error.code === 'INVALID_PASSWORD') {
          setErrorMessage('The current password you entered is incorrect.')
        } else {
          setErrorMessage(res.error.message)
        }
      }

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
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="*****"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((v) => !v)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
              >
                {showCurrentPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </button>
            </div>
            {field.state.meta.errors.map((err, i) => (
              <p key={i} className="text-destructive text-xs">
                {err?.message as string}
              </p>
            ))}

            {errorMessage && (
              <p className="text-destructive text-xs">{errorMessage}</p>
            )}
          </div>
        )}
      />
      <div className="flex flex-col gap-4 lg:flex-row">
        <form.Field
          name="newPassword"
          children={(field) => (
            <div className="w-full space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="*****"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="h-10.5 rounded-md py-2.75 placeholder:italic"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
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
          name="confirmPassword"
          children={(field) => (
            <div className="w-full space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  placeholder="*****"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  type={showConfirmPassword ? 'text' : 'password'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
              </div>
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
