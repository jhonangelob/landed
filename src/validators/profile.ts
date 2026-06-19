import { PROFILE_LIMITS } from '#/config'
import { z } from 'zod'

import {
  certificationSchema,
  educationSchema,
  experienceSchema,
  linksSchema,
  preferencesSchema,
  projectSchema,
} from './shared'

export const pilotProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number is required')
    .max(13, 'Phone is too long'),
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
    .max(PROFILE_LIMITS.skills, `Maximum ${PROFILE_LIMITS.skills} skills`),
  experience: z
    .array(experienceSchema)
    .min(1, 'Add at least one work experience')
    .max(
      PROFILE_LIMITS.experience,
      `Maximum ${PROFILE_LIMITS.experience} experience entries`,
    ),
  certifications: z
    .array(certificationSchema)
    .max(
      PROFILE_LIMITS.certifications,
      `Maximum ${PROFILE_LIMITS.certifications} certifications`,
    ),
  projects: z
    .array(projectSchema)
    .max(
      PROFILE_LIMITS.projects,
      `Maximum ${PROFILE_LIMITS.projects} projects`,
    ),
  education: z
    .array(educationSchema)
    .min(1, 'Add at least one education entry')
    .max(
      PROFILE_LIMITS.education,
      `Maximum ${PROFILE_LIMITS.education} education entries`,
    ),
  links: z
    .array(linksSchema)
    .min(1, 'Add at least one link entry')
    .max(PROFILE_LIMITS.links, `Maximum ${PROFILE_LIMITS.links} links entries`),
  preferences: preferencesSchema,
  updatedAt: z.date(),
})

export const savePilotProfileSchema = pilotProfileSchema.omit({
  id: true,
  updatedAt: true,
})

// Lenient schema matching the partial shape returned by the CV-parse prompt
// (buildParseFileSystemPrompt). The parse handler normalises every field
// defensively afterward, so this only confirms the overall JSON shape and
// must NOT enforce the full-profile constraints.
export const parsedCvSchema = z.object({
  headline: z.string().optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  skills: z.array(z.unknown()).optional(),
  experience: z.array(z.record(z.string(), z.unknown())).optional(),
  education: z.array(z.record(z.string(), z.unknown())).optional(),
  certifications: z.array(z.record(z.string(), z.unknown())).optional(),
  projects: z.array(z.record(z.string(), z.unknown())).optional(),
  links: z.array(z.record(z.string(), z.unknown())).optional(),
})
