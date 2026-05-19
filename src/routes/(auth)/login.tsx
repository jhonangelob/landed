import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import logo from '/landed.svg'
import { useForm } from '@tanstack/react-form'
import { loginDefaults, loginSchema } from '#/validators/account'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { signIn } from '#/lib/auth/client'
import { getSession } from '#/lib/auth/session'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/(auth)/login')({
  beforeLoad: async () => {
    const session = await getSession()
    if (session) {
      throw redirect({ to: '/flight-deck' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm({
    defaultValues: loginDefaults,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      const res = await signIn.email({
        email: value.email,
        password: value.password,
        callbackURL: '/flight-deck',
      })

      if (res.error) {
        setErrorMessage(res.error.message || '')
      }

      setIsLoading(false)
    },
  })

  const handleForgotPassword = () => {
    console.log('unimplemented: Forgot Password')
  }

  const handleCreateAccount = () => {
    navigate({ to: '/signup' })
  }

  return (
    <div className="bg-background h-screen flex flex-col justify-start md:justify-center items-center gap-4 p-12">
      <img
        src={logo}
        alt="FlightDeck Logo"
        className="min-w-fit h-10 md:h-14 mb-4"
      />

      <div className="w-100 border bg-white py-5 px-7 rounded-xl flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="font-display text-[24px] font-bold text-primary-text text-center">
            Welcome Back
          </p>
          <p
            className={cn(
              'font-display text-[12px] font-medium text-center',
              errorMessage.length > 0
                ? 'text-destructive'
                : 'text-muted-foreground',
            )}
          >
            {errorMessage || 'Sign in to your account to continue'}
          </p>
        </div>

        {/* <div className="flex flex-col gap-2">
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
        </div> */}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <form.Field
            name="email"
            children={(field) => (
              <div className="space-y-1.5 w-full">
                <Label
                  htmlFor="email"
                  className="font-sans font-medium text-[13px] text-muted-foreground"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="juan@email.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white shadow-none text-sm"
                />
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-[13px] text-destructive">
                    {err?.message as string}
                  </p>
                ))}
              </div>
            )}
          />
          <form.Field
            name="password"
            children={(field) => (
              <div className="space-y-1.5 w-full flex flex-col">
                <Label
                  htmlFor="password"
                  className="font-sans font-medium text-[13px] text-muted-foreground"
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
                <div className="flex flex-row justify-between items-center">
                  {field.state.meta.errors.map((err, i) => (
                    <p key={i} className="text-[13px] text-destructive">
                      {err?.message as string}
                    </p>
                  ))}

                  <Label
                    className="ml-auto text-primary font-normal font-sans text-[13px] cursor-pointer"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </Label>
                </div>
              </div>
            )}
          />
          <Button type="submit" className="cursor-pointer">
            {isLoading ? 'Loading...' : 'Sign in'}
          </Button>
        </form>

        <p className="font-sans text-[13px] text-muted-foreground text-center">
          Don't have an account?{' '}
          <span
            className="font-sans font-medium text-[13px] text-primary cursor-pointer"
            onClick={handleCreateAccount}
          >
            Create one.
          </span>
        </p>
      </div>
    </div>
  )
}
