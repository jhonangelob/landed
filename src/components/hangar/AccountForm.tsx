import type z from 'zod'

import { useForm } from '@tanstack/react-form'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

import { updateAccountSchema } from '#/validators/account'

interface AccountFormProps {
  data: any
  onConfirmUpdate: (value: z.infer<typeof updateAccountSchema>) => void
}

export default function AccountForm({
  data,
  onConfirmUpdate,
}: AccountFormProps) {
  const form = useForm({
    defaultValues: {
      fullName: data.name ?? '',
      username: data.username ?? '',
      email: data.email ?? '',
    },
    validators: { onSubmit: updateAccountSchema },
    onSubmit: async ({ value }) => {
      await onConfirmUpdate(value)
      form.reset()
    },
  })

  const handleDiscard = () => {
    form.reset()
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col gap-5"
    >
      <form.Field
        name="fullName"
        children={(field) => (
          <div className="w-full space-y-1.5">
            <Label
              htmlFor="fullName"
              className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3px] uppercase"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Jane Doe"
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
      <div className="flex flex-col gap-4 lg:flex-row">
        <form.Field
          name="username"
          children={(field) => (
            <div className="w-full space-y-1.5">
              <Label
                htmlFor="username"
                className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3px] uppercase"
              >
                Username
              </Label>
              <Input
                id="username"
                placeholder="@"
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
          name="email"
          children={(field) => (
            <div className="w-full space-y-1.5">
              <Label
                htmlFor="email"
                className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3px] uppercase"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="h-10.5 rounded-md py-2.75 shadow-none"
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

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer bg-white text-[12px] font-normal uppercase shadow-none"
          onClick={handleDiscard}
        >
          Discard
        </Button>
        <form.Subscribe
          selector={(s) => ({ isSubmitting: s.isSubmitting, values: s.values })}
          children={({ isSubmitting, values }) => {
            const hasChanges =
              values.fullName !== (data.name ?? '') ||
              values.username !== (data.username ?? '')
            return (
              <Button
                type="submit"
                className="cursor-pointer text-[12px] uppercase shadow-none"
                disabled={isSubmitting || !hasChanges}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            )
          }}
        />
      </div>
    </form>
  )
}
