import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const applicationStatusEnum = pgEnum('application_status', [
  'spotted',
  'applied',
  'in_flight',
  'interview',
  'offer',
  'landed',
  'rejected',
  'withdrawn',
])

export const docTypeEnum = pgEnum('doc_type', ['cv', 'cover_letter'])

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  username: text('username').unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

interface Experience {
  company: string
  role: string
  dates: string
  bullets: string[]
}

interface Education {
  institution: string
  degree: string
  year: string
}

interface Links {
  github: string
  linkedin: string
  portfolio: string
}

interface Preferences {
  roles: string[]
  remote: boolean
  salaryRange: string
  interviewReminders: boolean
}

interface Certifications {
  name: string
  issuer: string
  issueDate: string
  expiryDate: string
  url: string
}

export const pilotProfiles = pgTable('pilot_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  headline: text('headline'),
  summary: text('summary'),
  skills: text('skills').array(),
  experience: jsonb('experience').$type<Experience[]>(),
  education: jsonb('education').$type<Education[]>(),
  certifications: jsonb('certifications').$type<Certifications[]>(),
  links: jsonb('links').$type<Links>(),
  preferences: jsonb('preferences').$type<Preferences>(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  location: text('location'),
  timezone: text('timezone'),
})

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  company: text('company').notNull(),
  role: text('role').notNull(),
  jobUrl: text('job_url'),
  jobPostText: text('job_post_text'),
  status: applicationStatusEnum('status').notNull().default('spotted'),
  subStatus: text('sub_status'),
  notes: text('notes'),
  salaryRange: text('salary_range'),
  location: text('location'),

  appliedAt: timestamp('applied_at').defaultNow().notNull(),
  interviewAt: timestamp('interview_at'),
  offerAt: timestamp('offer_at'),
  landedAt: timestamp('landed_at'),
  rejectedAt: timestamp('rejected_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})

export const generatedDocs = pgTable('generated_docs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  applicationId: uuid('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  type: docTypeEnum('type').notNull(),
  contentJson: jsonb('content_json').$type<Record<string, unknown>>().notNull(),
  contentHtml: text('content_html').notNull(),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const touchdownShares = pgTable('touchdown_shares', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  applicationId: uuid('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  statsSnapshot: jsonb('stats_snapshot').notNull(),
  cardImageUrl: text('card_image_url'),
  shareToken: text('share_token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ one, many }) => ({
  pilotProfile: one(pilotProfiles, {
    fields: [users.id],
    references: [pilotProfiles.userId],
  }),
  applications: many(applications),
  generatedDocs: many(generatedDocs),
  touchdownShares: many(touchdownShares),
  sessions: many(sessions),
  accounts: many(accounts),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const pilotProfilesRelations = relations(pilotProfiles, ({ one }) => ({
  user: one(users, { fields: [pilotProfiles.userId], references: [users.id] }),
}))

export const applicationsRelations = relations(
  applications,
  ({ one, many }) => ({
    user: one(users, { fields: [applications.userId], references: [users.id] }),
    generatedDocs: many(generatedDocs),
    touchdownShare: one(touchdownShares, {
      fields: [applications.id],
      references: [touchdownShares.applicationId],
    }),
  }),
)

export const generatedDocsRelations = relations(generatedDocs, ({ one }) => ({
  user: one(users, { fields: [generatedDocs.userId], references: [users.id] }),
  application: one(applications, {
    fields: [generatedDocs.applicationId],
    references: [applications.id],
  }),
}))

export const touchdownSharesRelations = relations(
  touchdownShares,
  ({ one }) => ({
    user: one(users, {
      fields: [touchdownShares.userId],
      references: [users.id],
    }),
    application: one(applications, {
      fields: [touchdownShares.applicationId],
      references: [applications.id],
    }),
  }),
)

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  planId: text('plan_id').notNull().default('free'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'), // null = free plan
  isActive: boolean('is_active').notNull().default(true),
  generationsUsed: integer('generations_used').notNull().default(0),
  generationsLimit: integer('generations_limit').notNull().default(10),
  paymentRef: text('payment_ref'), // PayMongo payment ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Session = typeof sessions.$inferSelect
export type Account = typeof accounts.$inferSelect

export type PilotProfile = typeof pilotProfiles.$inferSelect
export type NewPilotProfile = typeof pilotProfiles.$inferInsert

export type Application = typeof applications.$inferSelect
export type NewApplication = typeof applications.$inferInsert
export type ApplicationStatus =
  (typeof applicationStatusEnum.enumValues)[number]

export type GeneratedDoc = typeof generatedDocs.$inferSelect
export type NewGeneratedDoc = typeof generatedDocs.$inferInsert

export type TouchdownShare = typeof touchdownShares.$inferSelect
export type NewTouchdownShare = typeof touchdownShares.$inferInsert
