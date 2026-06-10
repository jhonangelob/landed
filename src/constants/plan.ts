import type { Plan } from '#/types'

export const PLANS: Plan[] = [
  {
    id: 'economy' as const,
    name: 'Economy',
    price: 0,
    currency: 'PHP',
    duration: null,
    generations: 10,
    applications: 10,
    features: [
      '10 AI generations',
      '10 applications',
      'Classic CV template',
      'PDF export',
      'Flight Deck kanban',
    ],
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: 299,
    currency: 'PHP',
    duration: 30,
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
    price: 799,
    currency: 'PHP',
    duration: 90,
    generations: null,
    applications: null,
    features: [
      'Unlimited AI generations',
      'Unlimited applications',
      'All CV templates',
      'PDF export',
      'Version history',
      '3-month access (~₱266/mo)',
    ],
  },
]

export const FREE_PLAN = PLANS[0]
export const PAID_PLAN = PLANS[1]
export const PAID_PLAN_3MO = PLANS[2]

export const getPlanById = (id: string) =>
  PLANS.find((p) => p.id === id) ?? FREE_PLAN
