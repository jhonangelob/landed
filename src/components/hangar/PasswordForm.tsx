import type z from 'zod'

import { useForm } from '@tanstack/react-form'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

import { updatePasswordSchema } from '#/validators/account'

interface PasswordFormProps {
  onUpdatePassword: (value: z.infer<typeof updatePasswordSchema>) => void
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
            <Label
              htmlFor="currentPassword"
              className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3px] uppercase"
            >
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="*****"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="h-10.5 rounded-md py-2.75 shadow-none"
            />
            {field.state.meta.errors.map((err, i) => (
              <p key={i} className="text-destructive text-xs">
                {err?.message as string}
              </p>
            ))}
          </div>
        )}
      />
      <div className="flex flex-row gap-4">
        <form.Field
          name="newPassword"
          children={(field) => (
            <div className="w-full space-y-1.5">
              <Label
                htmlFor="newPassword"
                className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3px] uppercase"
              >
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="*****"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="h-10.5 rounded-md py-2.75 shadow-none placeholder:italic"
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
              <Label
                htmlFor="confirmPassword"
                className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3px] uppercase"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                placeholder="*****"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="h-10.5 rounded-md py-2.75 shadow-none"
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
          selector={(s) => [s.isSubmitting, s.isDirty]}
          children={([isSubmitting, isDirty]) => (
            <Button
              type="submit"
              variant="outline"
              className="cursor-pointer text-[12px] uppercase shadow-none"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>
          )}
        />
      </div>
    </form>
  )
}
