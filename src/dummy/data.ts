// Ready-to-use dummy data for the Flight Deck kanban board.
// Covers every status so all columns have cards on load.
//
// Usage:
//   import { dummyApplications, getApplicationsByStatus } from '~/lib/data/dummy-applications'

// ─────────────────────────────────────────────
// TYPE
// ─────────────────────────────────────────────

export type ApplicationStatus =
  | 'spotted'
  | 'applied'
  | 'in_flight'
  | 'interview'
  | 'offer'
  | 'landed'
  | 'rejected'
  | 'withdrawn'

export interface Application {
  id: string
  user_id: string
  company: string
  role: string
  job_url: string | null
  status: ApplicationStatus
  notes: string | null
  salary_range: string | null
  location: string
  is_remote: boolean
  applied_at: Date | null
  interview_at: Date | null
  offer_at: Date | null
  landed_at: Date | null
  rejected_at: Date | null
  created_at: Date
  updated_at: Date
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

function daysFromNow(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d
}

const USER_ID = 'user-juan-dela-cruz-001'

// ─────────────────────────────────────────────
// DUMMY APPLICATIONS
// ─────────────────────────────────────────────

export const dummyApplications: Application[] = [
  // ── SPOTTED (3 cards) ─────────────────────
  {
    id: 'app-001',
    user_id: USER_ID,
    company: 'Stripe',
    role: 'Senior Frontend Engineer',
    job_url: 'https://stripe.com/jobs',
    status: 'spotted',
    notes:
      'Strong match on TypeScript + React. Check team fit before applying.',
    salary_range: '$130k – $160k',
    location: 'Remote',
    is_remote: true,
    applied_at: null,
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(7),
    updated_at: daysAgo(7),
  },
  {
    id: 'app-002',
    user_id: USER_ID,
    company: 'Vercel',
    role: 'Developer Experience Engineer',
    job_url: 'https://vercel.com/careers',
    status: 'spotted',
    notes: 'DX role — perfect for TanStack + Next.js background.',
    salary_range: '$120k – $150k',
    location: 'Remote',
    is_remote: true,
    applied_at: null,
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
  },
  {
    id: 'app-003',
    user_id: USER_ID,
    company: 'Planetscale',
    role: 'Software Engineer, Platform',
    job_url: 'https://planetscale.com/careers',
    status: 'spotted',
    notes: 'Database-adjacent role. Good for systems depth.',
    salary_range: '$125k – $155k',
    location: 'Remote',
    is_remote: true,
    applied_at: null,
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
  },

  // ── APPLIED (3 cards) ─────────────────────
  {
    id: 'app-004',
    user_id: USER_ID,
    company: 'Shopify',
    role: 'Full Stack Developer',
    job_url: 'https://shopify.com/careers',
    status: 'applied',
    notes: 'Applied via LinkedIn. CV tailored with Co-Pilot.',
    salary_range: '$110k – $140k',
    location: 'Remote — Canada',
    is_remote: true,
    applied_at: daysAgo(10),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(12),
    updated_at: daysAgo(10),
  },
  {
    id: 'app-005',
    user_id: USER_ID,
    company: 'Figma',
    role: 'Software Engineer, Plugins',
    job_url: 'https://figma.com/careers',
    status: 'applied',
    notes: 'TypeScript-heavy role on the plugins platform.',
    salary_range: '$140k – $170k',
    location: 'San Francisco, CA — Hybrid',
    is_remote: false,
    applied_at: daysAgo(11),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(13),
    updated_at: daysAgo(11),
  },
  {
    id: 'app-006',
    user_id: USER_ID,
    company: 'Resend',
    role: 'Frontend Engineer',
    job_url: 'https://resend.com/careers',
    status: 'applied',
    notes: 'Small team, great product. Applied cold via email.',
    salary_range: '$100k – $130k',
    location: 'Remote',
    is_remote: true,
    applied_at: daysAgo(8),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(10),
    updated_at: daysAgo(8),
  },

  {
    id: 'app-016',
    user_id: USER_ID,
    company: 'Clerk',
    role: 'Frontend Engineer',
    job_url: 'https://clerk.com/careers',
    status: 'applied',
    notes: 'Auth-focused stack, great DX culture.',
    salary_range: '$115k – $145k',
    location: 'Remote',
    is_remote: true,
    applied_at: daysAgo(3),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(4),
    updated_at: daysAgo(3),
  },
  {
    id: 'app-017',
    user_id: USER_ID,
    company: 'Turso',
    role: 'Software Engineer, Platform',
    job_url: 'https://turso.tech/careers',
    status: 'applied',
    notes: 'SQLite-at-edge product. Interesting distributed systems work.',
    salary_range: '$120k – $150k',
    location: 'Remote',
    is_remote: true,
    applied_at: daysAgo(5),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(6),
    updated_at: daysAgo(5),
  },
  {
    id: 'app-018',
    user_id: USER_ID,
    company: 'Supabase',
    role: 'Frontend Engineer',
    job_url: 'https://supabase.com/careers',
    status: 'applied',
    notes: 'Open-source Firebase alternative. Remote-first team.',
    salary_range: '$125k – $155k',
    location: 'Remote',
    is_remote: true,
    applied_at: daysAgo(2),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(3),
    updated_at: daysAgo(2),
  },
  {
    id: 'app-019',
    user_id: USER_ID,
    company: 'Neon',
    role: 'Software Engineer',
    job_url: 'https://neon.tech/careers',
    status: 'applied',
    notes: 'Serverless Postgres — great infra challenge.',
    salary_range: '$130k – $160k',
    location: 'Remote',
    is_remote: true,
    applied_at: daysAgo(7),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(8),
    updated_at: daysAgo(7),
  },
  {
    id: 'app-020',
    user_id: USER_ID,
    company: 'Liveblocks',
    role: 'Developer Experience Engineer',
    job_url: 'https://liveblocks.io/careers',
    status: 'applied',
    notes: 'Real-time collaboration APIs. DX-heavy role, strong fit.',
    salary_range: '$120k – $145k',
    location: 'Remote — Europe',
    is_remote: true,
    applied_at: daysAgo(9),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(10),
    updated_at: daysAgo(9),
  },
  {
    id: 'app-021',
    user_id: USER_ID,
    company: 'Dub',
    role: 'Full Stack Engineer',
    job_url: 'https://dub.co/careers',
    status: 'applied',
    notes: 'Link management platform. Small team, fast shipping culture.',
    salary_range: '$110k – $140k',
    location: 'Remote',
    is_remote: true,
    applied_at: daysAgo(4),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(5),
    updated_at: daysAgo(4),
  },
  {
    id: 'app-022',
    user_id: USER_ID,
    company: 'Trigger.dev',
    role: 'Software Engineer',
    job_url: 'https://trigger.dev/careers',
    status: 'applied',
    notes: 'Background jobs platform. Open-source, TypeScript-native.',
    salary_range: '$115k – $140k',
    location: 'Remote',
    is_remote: true,
    applied_at: daysAgo(6),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(7),
    updated_at: daysAgo(6),
  },
  {
    id: 'app-023',
    user_id: USER_ID,
    company: 'Encore',
    role: 'Frontend Engineer',
    job_url: 'https://encore.dev/careers',
    status: 'applied',
    notes: 'Backend framework with built-in infra. Interesting product angle.',
    salary_range: '$120k – $150k',
    location: 'Remote — Sweden',
    is_remote: true,
    applied_at: daysAgo(1),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(2),
    updated_at: daysAgo(1),
  },
  {
    id: 'app-024',
    user_id: USER_ID,
    company: 'Outerbase',
    role: 'Software Engineer, Frontend',
    job_url: 'https://outerbase.com/careers',
    status: 'applied',
    notes: 'Database UI tooling. Heavy on React and data visualization.',
    salary_range: '$110k – $135k',
    location: 'Remote',
    is_remote: true,
    applied_at: daysAgo(3),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(4),
    updated_at: daysAgo(3),
  },
  {
    id: 'app-025',
    user_id: USER_ID,
    company: 'Tinybird',
    role: 'Software Engineer',
    job_url: 'https://tinybird.co/careers',
    status: 'applied',
    notes: 'Real-time analytics platform. SQL + streaming data stack.',
    salary_range: '$125k – $155k',
    location: 'Remote — Spain',
    is_remote: true,
    applied_at: daysAgo(8),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(9),
    updated_at: daysAgo(8),
  },

  // ── IN FLIGHT (2 cards) ───────────────────
  {
    id: 'app-007',
    user_id: USER_ID,
    company: 'Linear',
    role: 'Product Engineer',
    job_url: 'https://linear.app/careers',
    status: 'in_flight',
    notes: 'Application acknowledged. Recruiter said 2-week review.',
    salary_range: '$130k – $160k',
    location: 'Remote',
    is_remote: true,
    applied_at: daysAgo(15),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(18),
    updated_at: daysAgo(5),
  },
  {
    id: 'app-008',
    user_id: USER_ID,
    company: 'Raycast',
    role: 'Software Engineer',
    job_url: 'https://raycast.com/careers',
    status: 'in_flight',
    notes: 'Sent follow-up email. Waiting on response.',
    salary_range: '$120k – $145k',
    location: 'Remote — Europe/US',
    is_remote: true,
    applied_at: daysAgo(14),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(16),
    updated_at: daysAgo(4),
  },

  // ── INTERVIEW (2 cards) ───────────────────
  {
    id: 'app-009',
    user_id: USER_ID,
    company: 'Notion',
    role: 'Software Engineer',
    job_url: 'https://notion.so/careers',
    status: 'interview',
    notes: 'Technical screen scheduled. Prep: LeetCode medium + system design.',
    salary_range: '$150k – $180k',
    location: 'New York — Hybrid',
    is_remote: false,
    applied_at: daysAgo(18),
    interview_at: daysFromNow(2),
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(21),
    updated_at: daysAgo(2),
  },
  {
    id: 'app-010',
    user_id: USER_ID,
    company: 'Loom',
    role: 'Frontend Engineer',
    job_url: 'https://loom.com/careers',
    status: 'interview',
    notes: 'Final round next week. 3 interviewers — EM + 2 ICs.',
    salary_range: '$120k – $145k',
    location: 'Remote',
    is_remote: true,
    applied_at: daysAgo(20),
    interview_at: daysFromNow(4),
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(25),
    updated_at: daysAgo(1),
  },

  // ── OFFER (1 card) ────────────────────────
  {
    id: 'app-011',
    user_id: USER_ID,
    company: 'Anthropic',
    role: 'Software Engineer, Product',
    job_url: 'https://anthropic.com/careers',
    status: 'offer',
    notes:
      'Offer letter received! Reviewing comp + equity. Decision by Friday.',
    salary_range: '$180k – $220k',
    location: 'San Francisco, CA — Hybrid',
    is_remote: false,
    applied_at: daysAgo(25),
    interview_at: daysAgo(10),
    offer_at: daysAgo(1),
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(30),
    updated_at: daysAgo(1),
  },

  // ── LANDED (1 card) ───────────────────────
  {
    id: 'app-012',
    user_id: USER_ID,
    company: 'Vercel',
    role: 'Software Engineer',
    job_url: 'https://vercel.com/careers',
    status: 'landed',
    notes: '🛬 Signed the offer! Starting June 1. Dream role.',
    salary_range: '$140k – $165k',
    location: 'Remote',
    is_remote: true,
    applied_at: daysAgo(55),
    interview_at: daysAgo(30),
    offer_at: daysAgo(5),
    landed_at: daysAgo(3),
    rejected_at: null,
    created_at: daysAgo(60),
    updated_at: daysAgo(3),
  },

  // ── REJECTED (2 cards) ────────────────────
  {
    id: 'app-013',
    user_id: USER_ID,
    company: 'Airbnb',
    role: 'Software Engineer II',
    job_url: 'https://careers.airbnb.com',
    status: 'rejected',
    notes:
      'Rejected after technical screen. Feedback: system design needs work.',
    salary_range: '$160k – $190k',
    location: 'San Francisco, CA',
    is_remote: false,
    applied_at: daysAgo(30),
    interview_at: daysAgo(15),
    offer_at: null,
    landed_at: null,
    rejected_at: daysAgo(8),
    created_at: daysAgo(35),
    updated_at: daysAgo(8),
  },
  {
    id: 'app-014',
    user_id: USER_ID,
    company: 'Spotify',
    role: 'Web Engineer',
    job_url: 'https://spotify.com/jobs',
    status: 'rejected',
    notes: 'No feedback given. Role may have been filled internally.',
    salary_range: '$125k – $155k',
    location: 'New York — Hybrid',
    is_remote: false,
    applied_at: daysAgo(40),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: daysAgo(25),
    created_at: daysAgo(45),
    updated_at: daysAgo(25),
  },

  // ── WITHDRAWN (1 card) ────────────────────
  {
    id: 'app-015',
    user_id: USER_ID,
    company: 'Meta',
    role: 'Software Engineer, Frontend',
    job_url: 'https://metacareers.com',
    status: 'withdrawn',
    notes: 'Withdrew — role required full relocation, not feasible right now.',
    salary_range: '$170k – $200k',
    location: 'Menlo Park, CA',
    is_remote: false,
    applied_at: daysAgo(35),
    interview_at: null,
    offer_at: null,
    landed_at: null,
    rejected_at: null,
    created_at: daysAgo(40),
    updated_at: daysAgo(12),
  },
]

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

// Group all applications by status — use this to
// populate each kanban column directly
export function getApplicationsByStatus(): Record<
  ApplicationStatus,
  Application[]
> {
  const groups: Record<ApplicationStatus, Application[]> = {
    spotted: [],
    applied: [],
    in_flight: [],
    interview: [],
    offer: [],
    landed: [],
    rejected: [],
    withdrawn: [],
  }

  for (const app of dummyApplications) {
    groups[app.status].push(app)
  }

  return groups
}

// Get a single application by id
export function getApplicationById(id: string): Application | undefined {
  return dummyApplications.find((a) => a.id === id)
}

// Stats for the strip at the top of Flight Deck
export const dummyStats = {
  total: dummyApplications.length,
  interviews: dummyApplications.filter((a) =>
    ['interview', 'offer', 'landed'].includes(a.status),
  ).length,
  offers: dummyApplications.filter((a) =>
    ['offer', 'landed'].includes(a.status),
  ).length,
  responseRate: '47%',
}

// Kanban column config — import this alongside the data
// to render column headers without hardcoding them
export const KANBAN_COLUMNS: {
  status: ApplicationStatus
  label: string
  color: string
}[] = [
  { status: 'spotted', label: 'Spotted', color: '#94a3b8' },
  { status: 'applied', label: 'Applied', color: '#0ea5e9' },
  { status: 'in_flight', label: 'In Flight', color: '#7c3aed' },
  { status: 'interview', label: 'Interview', color: '#d97706' },
  { status: 'offer', label: 'Offer', color: '#059669' },
  { status: 'landed', label: 'Landed', color: '#059669' },
  { status: 'rejected', label: 'Rejected', color: '#dc2626' },
  { status: 'withdrawn', label: 'Withdrawn', color: '#94a3b8' },
]
