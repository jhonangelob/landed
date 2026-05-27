import { z } from 'zod'

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  dates: z.string().min(1, 'Date range is required'),
  bullets: z
    .array(z.string().min(1, 'Bullet point cannot be empty'))
    .min(1, 'Add at least one bullet point')
    .max(6, 'Maximum 6 bullet points per role'),
})

export type ExperienceInput = z.infer<typeof experienceSchema>

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  year: z.string().min(1, 'Year is required'),
})

export type EducationInput = z.infer<typeof educationSchema>

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string(),
  url: z.string().url('Must be a valid URL').or(z.literal('')),
})

export type CertificationInput = z.infer<typeof certificationSchema>

export const linksSchema = z.object({
  github: z.string().url('Must be a valid URL').or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').or(z.literal('')),
  portfolio: z.string().url('Must be a valid URL').or(z.literal('')),
})

export type LinksInput = z.infer<typeof linksSchema>

export const preferencesSchema = z.object({
  roles: z
    .array(z.string().min(1))
    .min(1, 'Add at least one preferred role')
    .max(5, 'Maximum 5 preferred roles'),
  salaryRange: z.string(),
})

export type PreferencesInput = z.infer<typeof preferencesSchema>

export const pilotProfileSchema = z.object({
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
  skills: z
    .array(
      z.string().min(1, 'Skill cannot be empty').max(50, 'Skill name too long'),
    )
    .min(1, 'Add at least one skill')
    .max(30, 'Maximum 30 skills'),
  experience: z
    .array(experienceSchema)
    .min(1, 'Add at least one work experience')
    .max(8, 'Maximum 8 experience entries'),
  certifications: z
    .array(certificationSchema)
    .max(10, 'Maximum 10 certifications'),
  education: z
    .array(educationSchema)
    .min(1, 'Add at least one education entry')
    .max(4, 'Maximum 4 education entries'),
  links: linksSchema,
  preferences: preferencesSchema,
})

export type PilotProfileInput = z.infer<typeof pilotProfileSchema>

export const updatePilotProfileSchema = pilotProfileSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export type UpdatePilotProfileInput = z.infer<typeof updatePilotProfileSchema>

export type PilotProfile = z.infer<typeof pilotProfileSchema>
