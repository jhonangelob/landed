import type { Plan } from '#/validators/subscription'

export const PLANS: Plan[] = [
  {
    id: 'free' as const,
    name: 'Free',
    price: 0,
    currency: 'PHP',
    duration: null,
    generations: 10,
    applications: 10,
    features: [
      '10 AI generations',
      '10 applications',
      'PDF export',
      'Flight Deck kanban',
    ],
    isCurrent: true,
  },
  {
    id: 'runway' as const,
    name: 'Runway',
    price: 299,
    currency: 'PHP',
    duration: 30,
    generations: 50,
    applications: null,
    features: [
      '50 AI generations',
      'Unlimited applications',
      'PDF export',
      'Version history',
      'Priority support',
    ],
    isCurrent: false,
  },
  {
    id: 'runway_3mo' as const,
    name: 'Runway 3 Months',
    price: 799,
    currency: 'PHP',
    duration: 90,
    generations: 50,
    applications: null,
    features: [
      '50 AI generations/month',
      'Unlimited applications',
      'PDF export',
      'Version history',
      'Priority support',
      '3-month billing (~₱266/mo)',
    ],
    isCurrent: false,
  },
]

export const FREE_PLAN = PLANS[0]
export const PAID_PLAN = PLANS[1]
export const PAID_PLAN_3MO = PLANS[2]

export const getPlanById = (id: string) =>
  PLANS.find((p) => p.id === id) ?? FREE_PLAN
