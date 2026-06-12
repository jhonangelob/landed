import {
  BUSINESS_DURATION_DAYS,
  BUSINESS_PRICE_PHP,
  FREE_APPLICATION_LIMIT,
  FREE_GENERATION_LIMIT,
  PREMIUM_DURATION_DAYS,
  PREMIUM_PRICE_PHP,
} from '#/config'
import type { Plan } from '#/types'

export const PLANS: Plan[] = [
  {
    id: 'economy' as const,
    name: 'Economy',
    price: 0,
    currency: 'PHP',
    duration: null,
    generations: FREE_GENERATION_LIMIT,
    applications: FREE_APPLICATION_LIMIT,
    features: [
      `${FREE_GENERATION_LIMIT} AI generations`,
      `${FREE_APPLICATION_LIMIT} applications`,
      'Classic CV template',
      'PDF export',
      'Flight Deck kanban',
    ],
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: PREMIUM_PRICE_PHP,
    currency: 'PHP',
    duration: PREMIUM_DURATION_DAYS,
    generations: null,
    applications: null,
    features: [
      'Unlimited AI generations',
      'Unlimited applications',
      'All CV templates',
      'PDF export',
      'Version history',
    ],
  },
  {
    id: 'business' as const,
    name: 'Business',
    price: BUSINESS_PRICE_PHP,
    currency: 'PHP',
    duration: BUSINESS_DURATION_DAYS,
    generations: null,
    applications: null,
    features: [
      'Unlimited AI generations',
      'Unlimited applications',
      'All CV templates',
      'PDF export',
      'Version history',
      `3-month access (~₱${Math.round(BUSINESS_PRICE_PHP / 3)}/mo)`,
    ],
  },
]

export const FREE_PLAN = PLANS[0]
export const PAID_PLAN = PLANS[1]
export const PAID_PLAN_3MO = PLANS[2]

export const getPlanById = (id: string) =>
  PLANS.find((p) => p.id === id) ?? FREE_PLAN
