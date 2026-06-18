// ── Free plan limits ──────────────────────────────────────────────────────────

/** Monthly AI generation quota for the free (Economy) plan. */
export const FREE_GENERATION_LIMIT = 5

/** Maximum applications a free-plan user can create. */
export const FREE_APPLICATION_LIMIT = 9999

// ── Rate limiting ─────────────────────────────────────────────────────────────

/** Rolling window used for per-user generation rate limiting, in minutes. */
export const RATE_LIMIT_WINDOW_MINUTES = 30

export const LOW_GENERATION_THRESHOLD = 2

/** Maximum document generations allowed within the rate-limit window. */
export const RATE_LIMIT_MAX_GENERATIONS = 10

/** Rolling window used for per-user CV-parse rate limiting, in minutes. */
export const PARSE_RATE_LIMIT_WINDOW_MINUTES = 60

/** Maximum CV parses allowed within the parse rate-limit window. */
export const PARSE_RATE_LIMIT_MAX = 10

// ── Plan pricing (PHP) ────────────────────────────────────────────────────────

export const PREMIUM_PRICE_PHP = 349
export const BUSINESS_PRICE_PHP = 999

// ── Plan durations (days) ─────────────────────────────────────────────────────

export const PREMIUM_DURATION_DAYS = 30
export const BUSINESS_DURATION_DAYS = 90

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
