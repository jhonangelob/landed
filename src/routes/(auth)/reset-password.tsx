import { useState } from 'react'

import type { ResetPasswordInput } from '#/types'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

import { getSession } from '#/server/session'

import { resetPassword } from '#/lib/auth/client'
import { cn } from '#/lib/utils'

import {
  resetPasswordSchema,
  resetPasswordSearchSchema,
} from '#/validators/account'

import logo from '/landed.svg'

export const Route = createFileRoute('/(auth)/reset-password')({
  head: () => ({
    meta: [
      {
        title: 'Landed | Reset Password',
      },
    ],
  }),
  validateSearch: resetPasswordSearchSchema,
  beforeLoad: async ({ search }) => {
    const session = await getSession()

    if (session) {
      throw redirect({ to: '/app' })
    }

    if (!search.token) {
      throw redirect({ to: '/forgot-password' })
    }
  },

  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { token } = Route.useSearch()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm({
    defaultValues: {
      token: token ?? '',
      password: '',
      confirmPassword: '',
    } satisfies ResetPasswordInput,
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      setErrorMessage('')

      const res = await resetPassword({
        token: value.token,
        newPassword: value.password,
      })

      if (res.error) {
        setErrorMessage(res.error.message || '')
        setIsLoading(false)
        return
      }

      navigate({ to: '/login' })
    },
  })

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-start gap-4 p-6 md:justify-center md:p-12">
      <img
        src={logo}
        alt="Landed Logo"
        className="mb-4 h-10 min-w-fit md:h-14"
      />

      <div className="flex w-full max-w-100 flex-col gap-6 rounded-xl border bg-white px-7 py-5">
        <div className="flex flex-col gap-2">
          <p className="font-display text-primary-text text-center text-[24px] font-bold">
            Reset Password
          </p>
          <p
            className={cn(
              'font-display text-center text-[12px] font-medium',
              errorMessage.length > 0
                ? 'text-destructive'
                : 'text-muted-foreground',
            )}
          >
            {errorMessage || 'Enter a new password for your account'}
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
            name="password"
            children={(field) => (
              <div className="w-full space-y-1.5">
                <Label htmlFor="password">New Password</Label>
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
            {isLoading ? 'Loading...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}
