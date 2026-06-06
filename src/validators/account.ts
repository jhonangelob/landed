import { z } from 'zod'

const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be 72 characters or less')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')

const confirmPasswordField = z.string().min(8, 'Please confirm your password')

export const accountSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullable().optional(),
  username: z.string().min(3).max(30).or(z.literal('')),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.string().default('seeker'),
  hasOnboarded: z.boolean().default(false),
})

export const createAccountSchema = accountSchema
  .pick({
    name: true,
    email: true,
  })
  .extend({
    password: passwordField,
    confirmPassword: confirmPasswordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const updateAccountSchema = accountSchema.pick({
  name: true,
  username: true,
  email: true,
})

export const loginSchema = accountSchema
  .pick({
    email: true,
  })
  .extend({
    password: passwordField,
  })

export const forgotPasswordSchema = accountSchema.pick({
  email: true,
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is missing or invalid'),
    password: passwordField,
    confirmPassword: confirmPasswordField,
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
})

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.union([z.literal(''), passwordField]),
    confirmPassword: confirmPasswordField,
  })
  .refine((d) => !d.newPassword || d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((d) => !d.newPassword || d.currentPassword !== d.newPassword, {
    message: 'New password must be different from your current password',
    path: ['newPassword'],
  })
