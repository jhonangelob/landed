// ── Free plan limits ──────────────────────────────────────────────────────────

/** Monthly AI generation quota for the free (Economy) plan. */
export const FREE_GENERATION_LIMIT = 5

/** Maximum applications a free-plan user can create. */
export const FREE_APPLICATION_LIMIT = 9999

// ── Rate limiting ─────────────────────────────────────────────────────────────

/** Rolling window used for per-user generation rate limiting, in minutes. */
export const RATE_LIMIT_WINDOW_MINUTES = 30

/** Maximum document generations allowed within the rate-limit window. */
export const RATE_LIMIT_MAX_GENERATIONS = 10

// ── Plan pricing (PHP) ────────────────────────────────────────────────────────

export const PREMIUM_PRICE_PHP = 399
export const BUSINESS_PRICE_PHP = 899

// ── Plan durations (days) ─────────────────────────────────────────────────────

export const PREMIUM_DURATION_DAYS = 30
export const BUSINESS_DURATION_DAYS = 90
