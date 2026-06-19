import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import type { z } from 'zod'

import type {
  applications,
  generatedDocs,
  pilotProfiles,
  subscriptions,
  users,
} from '#/lib/db/schema'

import type {
  accountSchema,
  createAccountSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  updateAccountSchema,
  updatePasswordSchema,
} from '#/validators/account'
import type {
  applicationWithDocStatusSchema,
  deleteApplicationSchema,
  newApplicationSchema,
  quickApplicationSchema,
  updateApplicationSchema,
  updateApplicationStageSchema,
} from '#/validators/application'
import type {
  coverLetterSchema,
  cvSchema,
  exportCoverLetterSchema,
  exportDocumentSchema,
  generateDocumentSchema,
  getDocumentSchema,
  parseFileSchema,
} from '#/validators/documents'
import type { savePilotProfileSchema } from '#/validators/profile'
import type {
  applicationStageSchema,
  certificationSchema,
  documentTypeSchema,
  educationSchema,
  experienceSchema,
  linksSchema,
  preferencesSchema,
  projectSchema,
  templateSchema,
} from '#/validators/shared'
import type {
  createPaymentSchema,
  createSubscriptionSchema,
  planSchema,
  updateSubscriptionSchema,
} from '#/validators/subscription'
import type { statsSnapshotSchema } from '#/validators/touchdown'

// ── Drizzle inferred types ────────────────────────────────────────────────────
export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>
export type PilotProfile = InferSelectModel<typeof pilotProfiles>
export type NewPilotProfile = InferInsertModel<typeof pilotProfiles>
export type Application = InferSelectModel<typeof applications>
export type NewApplication = InferInsertModel<typeof applications>
export type GeneratedDoc = InferSelectModel<typeof generatedDocs>
export type Subscription = InferSelectModel<typeof subscriptions>

// ── Zod sub-types ─────────────────────────────────────────────────────────────
export type Experience = z.infer<typeof experienceSchema>
export type Education = z.infer<typeof educationSchema>
export type Certification = z.infer<typeof certificationSchema>
export type Links = z.infer<typeof linksSchema>
export type Preferences = z.infer<typeof preferencesSchema>
export type Project = z.infer<typeof projectSchema>

// ── Application ───────────────────────────────────────────────────────────────
export type ApplicationInput = z.input<typeof newApplicationSchema>
export type QuickApplicationInput = z.input<typeof quickApplicationSchema>
export type UpdateApplicationInput = z.input<typeof updateApplicationSchema>
export type DeleteApplicationInput = z.input<typeof deleteApplicationSchema>
export type UpdateApplicationStageInput = z.input<
  typeof updateApplicationStageSchema
>
export type ApplicationStage = z.infer<typeof applicationStageSchema>
export type ApplicationWithDocStatus = z.infer<
  typeof applicationWithDocStatusSchema
>

// ── Account ───────────────────────────────────────────────────────────────────
export type Account = z.infer<typeof accountSchema>
export type CreateAccountInput = z.input<typeof createAccountSchema>
export type LoginInput = z.input<typeof loginSchema>
export type ForgotPasswordInput = z.input<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.input<typeof resetPasswordSchema>
export type UpdatePasswordInput = z.input<typeof updatePasswordSchema>
export type UpdateAccountInput = z.input<typeof updateAccountSchema>

// ── Profile ───────────────────────────────────────────────────────────────────
export type PilotProfileInput = z.input<typeof savePilotProfileSchema>
export type UpdatePilotProfileInput = z.input<typeof savePilotProfileSchema>

// ── Plan ──────────────────────────────────────────────────────────────────────
export type Plan = z.infer<typeof planSchema>

// ── Subscription ──────────────────────────────────────────────────────────────
export type CreateSubscriptionInput = z.input<typeof createSubscriptionSchema>
export type UpdateSubscriptionInput = z.input<typeof updateSubscriptionSchema>

export type CreatePaymentInput = z.input<typeof createPaymentSchema>

// ── Documents ─────────────────────────────────────────────────────────────────
export type CvContent = z.infer<typeof cvSchema>
export type CoverLetterContent = z.infer<typeof coverLetterSchema>
export type DocumentContent = CvContent | CoverLetterContent
export type DocumentType = z.infer<typeof documentTypeSchema>
export type Template = z.infer<typeof templateSchema>
export type GenerateDocumentInput = z.input<typeof generateDocumentSchema>
export type GetDocumentsInput = z.input<typeof getDocumentSchema>
export type ExportDocumentInput = z.input<typeof exportDocumentSchema>

export type ExportCoverLetterInput = z.input<typeof exportCoverLetterSchema>
export type ParseFileInput = z.input<typeof parseFileSchema>

// ── Touchdown ─────────────────────────────────────────────────────────────────
export type StatsSnapshot = z.infer<typeof statsSnapshotSchema>
