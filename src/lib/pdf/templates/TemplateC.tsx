// app/lib/pdf/templates/harvard.tsx
//
// Harvard-style CV template.
// Centered serif header, full-width ruled section headings,
// right-aligned dates. The format used by Harvard's career
// office handouts — maximally ATS-safe and recruiter-familiar.
//
// Uses the same CvContent shape as every other template.
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import type { CvContent } from '#/validators/documents'

const s = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 10.5,
    color: '#1a1a1a',
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 58,
    lineHeight: 1.4,
  },

  // ── header (centered)
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  name: {
    fontFamily: 'Times-Bold',
    fontSize: 19,
    letterSpacing: 0.5,
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  contactLine: {
    fontSize: 9.5,
    color: '#333333',
    textAlign: 'center',
  },

  // ── section heading — full-width rule under a small-caps title
  section: {
    marginBottom: 11,
  },
  sectionTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#000000',
    borderBottom: '1pt solid #000000',
    paddingBottom: 2,
    marginBottom: 6,
  },

  // ── summary
  summary: {
    fontSize: 10.5,
    color: '#1a1a1a',
    lineHeight: 1.5,
    textAlign: 'justify',
  },

  // ── entry (experience / education) — title left, dates right
  entry: {
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  entryTitleWrap: {
    flex: 1,
    paddingRight: 8,
  },
  entryRole: {
    fontFamily: 'Times-Bold',
    fontSize: 10.5,
    color: '#000000',
  },
  entryOrg: {
    fontFamily: 'Times-Italic',
    fontSize: 10.5,
    color: '#1a1a1a',
  },
  entryDates: {
    fontSize: 10,
    color: '#333333',
    flexShrink: 0,
  },

  // ── bullets
  bullet: {
    flexDirection: 'row',
    marginBottom: 1.5,
    paddingLeft: 10,
  },
  bulletDot: {
    width: 12,
    fontSize: 10,
    color: '#1a1a1a',
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: '#1a1a1a',
    lineHeight: 1.45,
  },

  // ── skills — inline, comma separated (ATS-friendly)
  skillsText: {
    fontSize: 10.5,
    color: '#1a1a1a',
    lineHeight: 1.5,
  },
})

interface Props {
  content: CvContent
  email?: string
}

export function TemplateC({ content, email }: Props) {
  return (
    <Document title="CV — Landed" creator="Landed App">
      <Page size="A4" style={s.page}>
        {/* Header — centered name + contact line */}
        <View style={s.header}>
          <Text style={s.name}>{content.headline}</Text>
          <Text style={s.contactLine}>
            {[email, 'Open to remote'].filter(Boolean).join('  ·  ')}
          </Text>
        </View>

        {/* Summary */}
        {content.summary && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Summary</Text>
            <Text style={s.summary}>{content.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {content.experience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Experience</Text>
            {content.experience.map((exp, i) => (
              <View key={i} style={s.entry}>
                <View style={s.entryHeader}>
                  <View style={s.entryTitleWrap}>
                    <Text style={s.entryRole}>{exp.role}</Text>
                    <Text style={s.entryOrg}>{exp.company}</Text>
                  </View>
                  <Text style={s.entryDates}>{exp.dates}</Text>
                </View>
                {exp.bullets.map((b, j) => (
                  <View key={j} style={s.bullet}>
                    <Text style={s.bulletDot}>•</Text>
                    <Text style={s.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {content.education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Education</Text>
            {content.education.map((edu, i) => (
              <View key={i} style={s.entry}>
                <View style={s.entryHeader}>
                  <View style={s.entryTitleWrap}>
                    <Text style={s.entryRole}>{edu.institution}</Text>
                    <Text style={s.entryOrg}>{edu.degree}</Text>
                  </View>
                  <Text style={s.entryDates}>{edu.year}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {content.skills.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            <Text style={s.skillsText}>{content.skills.join('  ·  ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
