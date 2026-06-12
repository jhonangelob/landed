import { z } from 'zod'

export const PROFILE_LIMITS = {
  skills: 30,
  experience: 8,
  bullets: 6,
  education: 4,
  certifications: 10,
  roles: 5,
  links: 5,
  wordsToAvoid: 10,
  projects: 4,
}

export const applicationStageSchema = z.enum([
  'spotted',
  'applied',
  'in_flight',
  'interview',
  'offer',
  'landed',
  'rejected',
  'withdrawn',
])

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  dates: z.string().min(1, 'Date range is required'),
  bullets: z
    .array(z.string().min(1, 'Bullet point cannot be empty'))
    .min(1, 'Add at least one bullet point')
    .max(
      PROFILE_LIMITS.bullets,
      `Maximum ${PROFILE_LIMITS.bullets} bullet points per role`,
    ),
})

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  year: z.string().min(1, 'Year is required'),
})

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string(),
  url: z.string().url('Must be a valid URL').or(z.literal('')),
})

export const linksSchema = z.object({
  name: z.string().min(1, 'Link name is required'),
  url: z.string().url('Must be a valid URL').or(z.literal('')),
})

export const projectSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
  role: z.string().optional(),
  dates: z.string().optional(),
  highlights: z.string().optional(),
  bullets: z.array(z.string()).min(1),
})

export const preferencesSchema = z.object({
  roles: z
    .array(z.string().min(1))
    .min(1, 'Add at least one preferred role')
    .max(
      PROFILE_LIMITS.roles,
      `Maximum ${PROFILE_LIMITS.roles} preferred roles`,
    ),
  preferredVoice: z.string().max(50, 'Too long').or(z.literal('')),
  wordsToAvoid: z
    .array(
      z.string().min(1, 'Skill cannot be empty').max(20, 'Skill name too long'),
    )
    .max(
      PROFILE_LIMITS.skills,
      `Maximum ${PROFILE_LIMITS.wordsToAvoid} words to avoid`,
    ),
})

export const documentTypeSchema = z.enum(['cv', 'cover_letter'])

export const templateSchema = z
  .enum(['classic', 'modern', 'minimal'])
  .default('classic')

export const applicationSearchSchema = z.object({
  applicationId: z.string().uuid().optional(),
  stage: applicationStageSchema.optional(),
})
