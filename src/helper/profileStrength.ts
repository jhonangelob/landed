/**
 * Minimal structural shape the strength checks read from. Both the saved
 * `PilotProfile` and the in-progress form values (`UpdatePilotProfileInput`)
 * are assignable to it, so strength can be computed live as fields change.
 */
export interface ProfileStrengthInput {
  name?: string | null
  email?: string | null
  phone?: string | null
  location?: string | null
  headline?: string | null
  experience?: readonly unknown[] | null
  skills?: readonly unknown[] | null
  links?: readonly { url?: string | null }[] | null
  preferences?: { preferredVoice?: string | null } | null
}

export const profileChecklist: {
  label: string
  check: (p?: ProfileStrengthInput | null) => boolean
}[] = [
  {
    label: 'Contact details',
    check: (p) => !!(p?.name && p.email && p.phone && p.location),
  },
  {
    label: 'Headline written',
    check: (p) => !!p?.headline,
  },
  {
    label: '2+ roles detailed',
    check: (p) => (p?.experience?.length ?? 0) >= 2,
  },
  {
    label: '6+ skills listed',
    check: (p) => (p?.skills?.length ?? 0) >= 6,
  },
  {
    label: 'Profile links added',
    check: (p) => (p?.links?.filter((l) => l.url).length ?? 0) >= 1,
  },
  {
    label: 'Voice & tone set',
    check: (p) => !!p?.preferences?.preferredVoice,
  },
]

export function strengthLabel(percent: number) {
  if (percent === 100) return 'Flight-ready'
  if (percent >= 80) return 'Almost ready'
  if (percent >= 60) return 'Looking good'
  if (percent >= 40) return 'Building up'
  return 'Getting started'
}

/**
 * Encodes the checklist outcome as a string of '1'/'0' (one char per item).
 * A primitive return keeps form subscriptions cheap: the form only re-renders
 * when a check actually flips, not on every keystroke.
 */
export function strengthSignature(p?: ProfileStrengthInput | null): string {
  return profileChecklist.map((item) => (item.check(p) ? '1' : '0')).join('')
}

export function strengthFromSignature(signature: string) {
  const checks = profileChecklist.map((_, i) => signature[i] === '1')
  const completedCount = checks.filter(Boolean).length
  const percent = Math.round((completedCount / profileChecklist.length) * 100)
  return { checks, percent }
}
