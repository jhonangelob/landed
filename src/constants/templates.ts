import type { CvContent } from '#/types'

import { TemplateA } from '#/lib/pdf/templates/TemplateA'
import { TemplateB } from '#/lib/pdf/templates/TemplateB'
import { TemplateC } from '#/lib/pdf/templates/TemplateC'

export interface CvTemplate {
  id: string
  name: string
  description: string
  plan: string
  preview: string
  enabled: boolean
}

export const CV_TEMPLATES: CvTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description:
      'Single column, traditional layout. ATS-friendly and safe for any industry.',
    plan: 'economy',
    preview: '📄',
    enabled: true,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean lines, generous whitespace. Lets your content breathe.',
    plan: 'economy',
    preview: '🗒️',
    enabled: true,
  },
  {
    id: 'modern',
    name: 'Modern',
    description:
      'Two column with sidebar. Visually distinct, great for tech and design roles.',
    plan: 'economy',
    preview: '📋',
    enabled: true,
  },
] as const

export type CvTemplateId = (typeof CV_TEMPLATES)[number]['id']

export const FREE_TEMPLATES = CV_TEMPLATES.filter((t) => t.plan === 'economy')
export const PAID_TEMPLATES = CV_TEMPLATES.filter((t) => t.plan !== 'economy')

export const getTemplateById = (id: string): CvTemplate | undefined =>
  CV_TEMPLATES.find((t) => t.id === id)

export const isTemplateLocked = (
  templateId: string,
  planId: string,
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
  classic: TemplateA,
  minimal: TemplateB,
  modern: TemplateC,
}
