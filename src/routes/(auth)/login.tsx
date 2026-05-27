import { useState } from 'react'

import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

import { signIn } from '#/lib/auth/client'
import { getSession } from '#/lib/auth/session'
import { cn } from '#/lib/utils'

import { loginSchema } from '#/validators/account'

import logo from '/landed.svg'

export const Route = createFileRoute('/(auth)/login')({
  head: () => ({
    meta: [
      {
        title: 'Landed | Login',
      },
    ],
  }),
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
    defaultValues: { email: '', password: '' },
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

  const handleCreateAccount = () => {
    navigate({ to: '/signup' })
  }

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-start gap-4 p-12 md:justify-center">
      <img
        src={logo}
        alt="FlightDeck Logo"
        className="mb-4 h-10 min-w-fit md:h-14"
      />

      <div className="flex w-100 flex-col gap-6 rounded-xl border bg-white px-7 py-5">
        <div className="flex flex-col gap-2">
          <p className="font-display text-primary-text text-center text-[24px] font-bold">
            Welcome Back
          </p>
          <p
            className={cn(
              'font-display text-center text-[12px] font-medium',
              errorMessage.length > 0
                ? 'text-destructive'
                : 'text-muted-foreground',
            )}
          >
            {errorMessage || 'Sign in to your account to continue'}
          </p>
        </div>

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
              <div className="w-full space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="juan@email.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-destructive text-[13px]">
                    {err?.message as string}
                  </p>
                ))}
              </div>
            )}
          />
          <form.Field
            name="password"
            children={(field) => (
              <div className="flex w-full flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="••••••••"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
                <div className="flex flex-row items-center justify-between">
                  {field.state.meta.errors.map((err, i) => (
                    <p key={i} className="text-destructive text-[13px]">
                      {err?.message as string}
                    </p>
                  ))}

                  {/* <div onClick={handleForgotPassword}>Forgot Password?</div> */}
                </div>
              </div>
            )}
          />
          <Button type="submit" className="">
            {isLoading ? 'Loading...' : 'Sign in'}
          </Button>
        </form>

        <p className="text-muted-foreground text-center font-sans text-[13px]">
          Don't have an account?{' '}
          <span
            className="text-primary cursor-pointer font-sans text-[13px] font-medium hover:underline"
            onClick={handleCreateAccount}
          >
            Create one.
          </span>
        </p>
      </div>
    </div>
  )
}
