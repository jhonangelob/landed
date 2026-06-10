import { useState } from 'react'

import { useCreateSubscriptionMutation } from '#/hooks/useSubscriptionQueries'
import type { CreateAccountInput } from '#/types'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

import { getSession } from '#/server/session'

import { signUp } from '#/lib/auth/client'
import { notify } from '#/lib/toast'
import { cn } from '#/lib/utils'

import { createAccountSchema } from '#/validators/account'

import logo from '/landed.svg'

export const Route = createFileRoute('/(auth)/signup')({
  head: () => ({
    meta: [
      {
        title: 'Landed | Signup',
      },
    ],
  }),
  beforeLoad: async () => {
    const session = await getSession()

    if (session) {
      throw redirect({ to: '/app' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { mutateAsync: createSubscription } = useCreateSubscriptionMutation()

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    } satisfies CreateAccountInput,
    validators: {
      onSubmit: createAccountSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      const res = await signUp.email({
        email: value.email,
        password: value.password,
        callbackURL: '/email-verified',
        name: value.name,
      })

      if (res.data) {
        notify.success(
          'Account created',
          'Check your inbox to verify your email address.',
        )

        try {
          await createSubscription({ userId: res.data.user.id })
          navigate({ to: '/app' })
        } catch (er) {
          setErrorMessage(
            'Account created but setup failed. Please contact support.',
          )
        } finally {
          setIsLoading(false)
        }
      }

      if (res.error) {
        setErrorMessage(res.error.message || '')
      }

      setIsLoading(false)
    },
  })

  const handleSignIn = () => {
    navigate({ to: '/login' })
  }

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-start gap-4 p-12 md:justify-center">
      <img
        src={logo}
        alt="Landed Logo"
        className="mb-4 h-10 min-w-fit md:h-14"
      />

      <div className="flex w-100 flex-col gap-6 rounded-xl border bg-white px-7 py-5">
        <div className="flex flex-col gap-2">
          <p className="font-display text-primary-text text-center text-[24px] font-bold">
            Create an Account
          </p>

          <p
            className={cn(
              'font-display text-center text-[12px] font-medium',
              errorMessage.length > 0
                ? 'text-destructive'
                : 'text-muted-foreground',
            )}
          >
            {errorMessage || 'Start tracking your job search today'}
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
            name="name"
            children={(field) => (
              <div className="w-full space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Juan Dela Cruz"
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

          <form.Field
            name="email"
            children={(field) => (
              <div className="w-full space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="jane@email.com"
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

          <form.Field
            name="password"
            children={(field) => (
              <div className="w-full space-y-1.5">
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
                    placeholder="••••••••"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    type={showConfirm ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
                  >
                    {showConfirm ? (
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

          <Button type="submit" className="mt-1">
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
        </form>

        <p className="text-muted-foreground text-center font-sans text-[13px]">
          Already have an account?{' '}
          <span
            className="text-primary cursor-pointer font-sans text-[13px] font-medium hover:underline"
            onClick={handleSignIn}
          >
            Sign in.
          </span>
        </p>
      </div>
    </div>
  )
}
