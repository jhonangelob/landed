// app/lib/pdf/templates/classic.tsx
//
// FREE PLAN template
// Single column, traditional layout.
// Clean and ATS-friendly for any industry.

import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { CvContent } from '#/validators/documents'

const s = StyleSheet.create({
  page: {
    fontSize: 10,
    color: '#0c1f35',
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 52,
    lineHeight: 1.5,
    fontFamily: 'Helvetica',
  },

  // ── header
  header: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottom: '1pt solid #c8e0f4',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0c1f35',
    marginBottom: 3,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 9,
    color: '#5a7a99',
  },
  contactSep: {
    color: '#c8e0f4',
  },

  // ── section
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0284c7',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 6,
    borderBottom: '0.5pt solid #e0f2fe',
    paddingBottom: 3,
  },

  // ── summary
  summary: {
    fontSize: 9.5,
    color: '#3d6080',
    lineHeight: 1.65,
  },

  // ── experience
  expBlock: { marginBottom: 10 },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  expRole: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: '#0c1f35' },
  expDates: { fontSize: 9, color: '#5a7a99' },
  expCompany: { fontSize: 9.5, color: '#3d6080', marginBottom: 4 },
  bullet: { flexDirection: 'row', marginBottom: 2, paddingLeft: 6 },
  bulletDot: { width: 10, fontSize: 9, color: '#0ea5e9' },
  bulletText: { flex: 1, fontSize: 9.5, color: '#3d6080' },

  // ── skills
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 2 },
  skillPill: {
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    fontSize: 8.5,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },

  // ── education
  eduHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  eduDegree: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0c1f35' },
  eduYear: { fontSize: 9, color: '#5a7a99' },
  eduInst: { fontSize: 9.5, color: '#3d6080' },
})

interface Props {
  content: CvContent
  email?: string
}

export function ClassicTemplate({ content, email }: Props) {
  return (
    <Document title="CV — Landed" creator="Landed App">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.name}>{content.headline}</Text>
          <View style={s.contactRow}>
            {email && <Text>{email}</Text>}
            {email && <Text style={s.contactSep}>·</Text>}
            <Text>Open to remote</Text>
          </View>
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
              <View key={i} style={s.expBlock}>
                <View style={s.expHeader}>
                  <Text style={s.expRole}>{exp.role}</Text>
                  <Text style={s.expDates}>{exp.dates}</Text>
                </View>
                <Text style={s.expCompany}>{exp.company}</Text>
                {exp.bullets.map((b, j) => (
                  <View key={j} style={s.bullet}>
                    <Text style={s.bulletDot}>▸</Text>
                    <Text style={s.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {content.skills.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            <View style={s.skillsRow}>
              {content.skills.map((skill, i) => (
                <View key={i} style={s.skillPill}>
                  <Text>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Education */}
        {content.education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Education</Text>
            {content.education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={s.eduHeader}>
                  <Text style={s.eduDegree}>{edu.degree}</Text>
                  <Text style={s.eduYear}>{edu.year}</Text>
                </View>
                <Text style={s.eduInst}>{edu.institution}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}
