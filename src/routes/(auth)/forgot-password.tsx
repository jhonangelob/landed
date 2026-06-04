import { useState } from 'react'

import { useForm } from '@tanstack/react-form'
import { Link, createFileRoute, redirect } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

import { getSession } from '#/server/session'

import { requestPasswordReset } from '#/lib/auth/client'
import { cn } from '#/lib/utils'

import { forgotPasswordSchema } from '#/validators/account'

import logo from '/landed.svg'

export const Route = createFileRoute('/(auth)/forgot-password')({
  head: () => ({
    meta: [
      {
        title: 'Landed | Forgot Password',
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
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSent, setIsSent] = useState(false)

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      setErrorMessage('')

      const res = await requestPasswordReset({
        email: value.email,
        redirectTo: '/reset-password',
      })

      if (res.error) {
        setErrorMessage(res.error.message || '')
      } else {
        setIsSent(true)
      }

      setIsLoading(false)
    },
  })

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
            Forgot Password
          </p>
          <p
            className={cn(
              'font-display text-center text-[12px] font-medium',
              errorMessage.length > 0
                ? 'text-destructive'
                : 'text-muted-foreground',
            )}
          >
            {errorMessage ||
              (isSent
                ? 'Check your inbox for a link to reset your password'
                : "Enter your email and we'll send you a reset link")}
          </p>
        </div>

        {!isSent && (
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

            <Button type="submit" className="">
              {isLoading ? 'Loading...' : 'Send Password Reset Link'}
            </Button>
          </form>
        )}

        <p className="text-muted-foreground text-center font-sans text-[13px]">
          Remember your password?{' '}
          <Link
            className="text-primary cursor-pointer font-sans text-[13px] font-medium hover:underline"
            to="/login"
          >
            Sign in.
          </Link>
        </p>
      </div>
    </div>
  )
}
