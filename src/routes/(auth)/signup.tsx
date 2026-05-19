import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import logo from '/landed.svg'
import { useForm } from '@tanstack/react-form'
import { signupSchema, signupDefaults } from '#/validators/account'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export const Route = createFileRoute('/(auth)/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm({
    defaultValues: signupDefaults,
    validators: {
      onSubmit: ({ value }) => {
        const result = signupSchema.safeParse(value)
        if (!result.success) return result.error.issues[0]?.message
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  const handleSignIn = () => {
    console.log('unimplemented: Sign In')
  }

  return (
    <div className="bg-background h-screen flex flex-col justify-start md:justify-center items-center gap-4 p-12">
      <img
        src={logo}
        alt="Landed Logo"
        className="min-w-fit h-10 md:h-14 mb-4"
      />

      <div className="w-100 border bg-white py-5 px-7 rounded-xl flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="font-display text-[24px] font-bold text-primary-text text-center">
            Create an Account
          </p>
          <p className="font-display text-[12px] text-muted-foreground text-center">
            Start tracking your job search today
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="rounded-lg shadow-none cursor-pointer bg-white font-sans"
            variant="outline"
          >
            Continue with Google
          </Button>
          <Button
            className="rounded-lg shadow-none cursor-pointer bg-white font-sans"
            variant="outline"
          >
            Continue with Github
          </Button>
        </div>

        <div className="font-mono text-center text-muted-foreground text-[12px]">
          or
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <form.Field
            name="fullName"
            children={(field) => (
              <div className="space-y-1.5 w-full">
                <Label
                  htmlFor="fullName"
                  className="font-sans font-medium text-[12px] text-muted-foreground"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="Jane Doe"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white shadow-none text-sm"
                />
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-xs text-destructive">
                    {err as string}
                  </p>
                ))}
              </div>
            )}
          />

          <form.Field
            name="email"
            children={(field) => (
              <div className="space-y-1.5 w-full">
                <Label
                  htmlFor="email"
                  className="font-sans font-medium text-[12px] text-muted-foreground"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="jane@email.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white shadow-none text-sm"
                />
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-xs text-destructive">
                    {err as string}
                  </p>
                ))}
              </div>
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <div className="space-y-1.5 w-full">
                <Label
                  htmlFor="password"
                  className="font-sans font-medium text-[12px] text-muted-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="••••••••"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="bg-white shadow-none text-sm pr-9"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-xs text-destructive">
                    {err as string}
                  </p>
                ))}
              </div>
            )}
          />

          <form.Field
            name="confirmPassword"
            children={(field) => (
              <div className="space-y-1.5 w-full">
                <Label
                  htmlFor="confirmPassword"
                  className="font-sans font-medium text-[12px] text-muted-foreground"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="bg-white shadow-none text-sm pr-9"
                    type={showConfirm ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showConfirm ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-xs text-destructive">
                    {err as string}
                  </p>
                ))}
              </div>
            )}
          />

          <Button type="submit" className="mt-1">
            Create Account
          </Button>
        </form>

        <p className="font-sans text-[12px] text-muted-foreground text-center">
          Already have an account?{' '}
          <span
            className="font-sans font-medium text-[12px] text-primary cursor-pointer"
            onClick={handleSignIn}
          >
            Sign in.
          </span>
        </p>
      </div>
    </div>
  )
}
