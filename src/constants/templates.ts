import { ClassicTemplate } from '#/lib/pdf/templates/classic'
import { MinimalTemplate } from '#/lib/pdf/templates/minimal'
import { ModernTemplate } from '#/lib/pdf/templates/modern'

import type { CvContent } from '#/validators/documents'
import type { PlanId } from '#/validators/subscription'

export interface CvTemplate {
  id: string
  name: string
  description: string
  plan: PlanId
  preview: string
}

export const CV_TEMPLATES: CvTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description:
      'Single column, traditional layout. ATS-friendly and safe for any industry.',
    plan: 'economy',
    preview: '📄',
  },
  {
    id: 'modern',
    name: 'Modern',
    description:
      'Two column with sidebar. Visually distinct, great for tech and design roles.',
    plan: 'premium',
    preview: '📋',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean lines, generous whitespace. Lets your content breathe.',
    plan: 'premium',
    preview: '🗒️',
  },
] as const

export type CvTemplateId = (typeof CV_TEMPLATES)[number]['id']

export const FREE_TEMPLATES = CV_TEMPLATES.filter((t) => t.plan === 'economy')
export const PAID_TEMPLATES = CV_TEMPLATES.filter((t) => t.plan !== 'economy')

export const getTemplateById = (id: string): CvTemplate | undefined =>
  CV_TEMPLATES.find((t) => t.id === id)

export const isTemplateLocked = (
  templateId: string,
  planId: PlanId,
): boolean => {
  const template = getTemplateById(templateId)
  if (!template) return true
  if (template.plan === 'economy') return false
  return planId === 'economy'
}

export const TEMPLATE_MAP: Record<
  CvTemplateId,
  React.ComponentType<{ content: CvContent; email?: string }>
> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
}
