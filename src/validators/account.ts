import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email address'),

  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const loginDefaults: LoginInput = {
  email: '',
  password: '',
}

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .max(100, 'Full name must be 100 characters or less'),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Must be a valid email address'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be 72 characters or less')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),

    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignupInput = z.infer<typeof signupSchema>

export const signupDefaults: SignupInput = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),

    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be 72 characters or less')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),

    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: 'New password must be different from your current password',
    path: ['newPassword'],
  })

export type PasswordInput = z.infer<typeof passwordSchema>

export const notificationsSchema = z.object({
  interviewReminders: z.boolean().default(true),
})

export type NotificationsInput = z.infer<typeof notificationsSchema>

export const socialProviderEnum = z.enum(['google', 'github', 'linkedin'])

export type SocialProvider = z.infer<typeof socialProviderEnum>

export const ssoSchema = z.object({
  provider: socialProviderEnum,
  callbackUrl: z
    .string()
    .url('Must be a valid callback URL')
    .default('/hangar'),
})

export type SsoInput = z.infer<typeof ssoSchema>

export const hangarSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be 100 characters or less'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email address'),
  location: z
    .string()
    .max(100, 'Location must be 100 characters or less')
    .optional()
    .or(z.literal('')),
  timezone: z
    .string()
    .max(60, 'Timezone must be 60 characters or less')
    .optional()
    .or(z.literal('')),
  password: passwordSchema,
  notifications: notificationsSchema,
  sso: ssoSchema,
})

export type HangarInput = z.infer<typeof hangarSchema>

export const updateHangarSchema = hangarSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export type UpdateHangarInput = z.infer<typeof updateHangarSchema>

export const hangarDefaults: HangarInput = {
  fullName: '',
  email: '',
  location: '',
  timezone: '',

  password: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },

  notifications: {
    interviewReminders: true,
  },

  sso: {
    provider: 'google',
    callbackUrl: '/hangar',
  },
}
