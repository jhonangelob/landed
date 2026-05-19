// app/lib/validators/pilot-profile.ts

import { z } from 'zod'

// ─────────────────────────────────────────────
// SUB-SCHEMAS
// Nested objects within the profile
// ─────────────────────────────────────────────

export const experienceSchema = z.object({
  id: z.string().optional(), // for tracking edits on existing items
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  dates: z.string().min(1, 'Date range is required'),
  bullets: z
    .array(z.string().min(1, 'Bullet point cannot be empty'))
    .min(1, 'Add at least one bullet point')
    .max(6, 'Maximum 6 bullet points per role'),
})

export type ExperienceInput = z.infer<typeof experienceSchema>

// ─────────────────────────────────────────────

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  year: z.string().min(1, 'Year is required'),
})

export type EducationInput = z.infer<typeof educationSchema>

// ─────────────────────────────────────────────

export const linksSchema = z.object({
  github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

export type LinksInput = z.infer<typeof linksSchema>

// ─────────────────────────────────────────────

export const preferencesSchema = z.object({
  roles: z
    .array(z.string().min(1))
    .min(1, 'Add at least one preferred role')
    .max(5, 'Maximum 5 preferred roles'),
  remote: z.boolean().default(true),
  salaryRange: z.string().optional(),
})

export type PreferencesInput = z.infer<typeof preferencesSchema>

// ─────────────────────────────────────────────
// PILOT PROFILE SCHEMA
// ─────────────────────────────────────────────

export const pilotProfileSchema = z.object({
  // ── Personal info
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Name is too long'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email address'),

  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location is too long'),

  headline: z
    .string()
    .min(1, 'Headline is required')
    .max(120, 'Headline must be 120 characters or less'),

  summary: z
    .string()
    .min(50, 'Summary must be at least 50 characters')
    .max(600, 'Summary must be 600 characters or less'),

  // ── Skills
  skills: z
    .array(
      z.string().min(1, 'Skill cannot be empty').max(50, 'Skill name too long'),
    )
    .min(1, 'Add at least one skill')
    .max(30, 'Maximum 30 skills'),

  // ── Work experience
  experience: z
    .array(experienceSchema)
    .min(1, 'Add at least one work experience')
    .max(8, 'Maximum 8 experience entries'),

  // ── Education
  education: z
    .array(educationSchema)
    .min(1, 'Add at least one education entry')
    .max(4, 'Maximum 4 education entries'),

  // ── Links
  links: linksSchema,

  // ── Preferences
  preferences: preferencesSchema,
})

export type PilotProfileInput = z.infer<typeof pilotProfileSchema>

// ─────────────────────────────────────────────
// PARTIAL UPDATE SCHEMA
// For saving individual sections without
// requiring the full profile to be complete
// ─────────────────────────────────────────────

export const updatePilotProfileSchema = pilotProfileSchema
  .partial()
  .extend({
    // at least one field must be present
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export type UpdatePilotProfileInput = z.infer<typeof updatePilotProfileSchema>

// ─────────────────────────────────────────────
// DEFAULT VALUES
// Use these as initialValues in TanStack Form
// ─────────────────────────────────────────────

export const pilotProfileDefaults: PilotProfileInput = {
  fullName: '',
  email: '',
  location: '',
  headline: '',
  summary: '',
  skills: [],
  experience: [
    {
      company: '',
      role: '',
      dates: '',
      bullets: [''],
    },
  ],
  education: [
    {
      institution: '',
      degree: '',
      year: '',
    },
  ],
  links: {
    github: '',
    linkedin: '',
    portfolio: '',
  },
  preferences: {
    roles: [],
    remote: true,
    salaryRange: '',
  },
}
