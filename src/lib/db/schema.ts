import type {
  Certification,
  CoverLetterContent,
  CvContent,
  Education,
  Experience,
  Links,
  Preferences,
  Project,
} from '#/types'
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

// ─── Enums ────────────────────────────────────────────────────────────────────

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

export const planTypeEnum = pgEnum('plan_id', [
  'economy',
  'premium',
  'business',
])

export const docTypeEnum = pgEnum('doc_type', ['cv', 'cover_letter'])

// ─── Auth Tables ──────────────────────────────────────────────────────────────

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  username: text('username').unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  role: text('role').notNull().default('seeker'),
  hasOnboarded: boolean('has_onboarded').notNull().default(false),
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

// ─── Pilot Profiles ───────────────────────────────────────────────────────────

export const pilotProfiles = pgTable('pilot_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  headline: text('headline'),
  summary: text('summary'),
  location: text('location'),
  phone: text('phone'),
  timezone: text('timezone'),
  skills: text('skills').array(),
  experience: jsonb('experience').$type<Experience[]>(),
  education: jsonb('education').$type<Education[]>(),
  projects: jsonb('projects').$type<Project[]>(),
  certifications: jsonb('certifications').$type<Certification[]>(),
  links: jsonb('links').$type<Links[]>(),
  preferences: jsonb('preferences').$type<Preferences>(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── Applications ─────────────────────────────────────────────────────────────

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  company: text('company').notNull(),
  role: text('role').notNull(),
  url: text('url'),
  description: text('description'),
  stage: applicationStatusEnum('stage').notNull().default('spotted'),
  status: text('status'),
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

// ─── Generated Docs ───────────────────────────────────────────────────────────

export const generatedDocs = pgTable('generated_docs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  applicationId: uuid('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  type: docTypeEnum('type').notNull(),
  contentJson: jsonb('content_json')
    .$type<CvContent | CoverLetterContent>()
    .notNull(),
  contentHtml: text('content_html').notNull(),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── Touchdown Shares ─────────────────────────────────────────────────────────

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

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  planId: planTypeEnum('plan_id').notNull().default('economy'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').notNull().default(true),
  generationsUsed: integer('generations_used').notNull().default(0),
  generationsLimit: integer('generations_limit'),
  paymentRef: text('payment_ref'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── AI Usage ─────────────────────────────────────────────────────────────────

export const aiUsage = pgTable('ai_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  model: text('model').notNull(),
  kind: text('kind').notNull(),
  inputTokens: integer('input_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  totalTokens: integer('total_tokens').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Relations ────────────────────────────────────────────────────────────────

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

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}))
