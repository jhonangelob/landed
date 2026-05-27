import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import type { CvContent } from '#/validators/documents'

const s = StyleSheet.create({
  page: {
    fontSize: 10,
    color: '#1a1a1a',
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 64,
    lineHeight: 1.6,
    fontFamily: 'Helvetica',
    backgroundColor: '#fafafa',
  },

  // ── header
  header: {
    marginBottom: 32,
  },
  name: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: '#0c0c0c',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    fontSize: 9,
    color: '#666666',
  },

  // ── divider
  divider: {
    height: 0.75,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  thinDivider: {
    height: 0.5,
    backgroundColor: '#eeeeee',
    marginBottom: 10,
  },

  // ── section
  section: {
    marginBottom: 22,
  },
  sectionRow: {
    flexDirection: 'row',
    gap: 28,
  },
  sectionLabel: {
    width: 80,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#999999',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingTop: 1,
    flexShrink: 0,
  },
  sectionContent: {
    flex: 1,
  },

  // ── summary
  summary: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.7,
  },

  // ── experience
  expBlock: { marginBottom: 14 },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  expRole: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: '#0c0c0c' },
  expDates: { fontSize: 9, color: '#999999' },
  expCompany: { fontSize: 9.5, color: '#666666', marginBottom: 5 },
  bullet: { flexDirection: 'row', marginBottom: 2.5, paddingLeft: 0 },
  bulletDot: { width: 12, fontSize: 9, color: '#bbbbbb' },
  bulletText: { flex: 1, fontSize: 9.5, color: '#444444', lineHeight: 1.55 },

  // ── skills — inline comma separated, no pills
  skillsText: {
    fontSize: 9.5,
    color: '#333333',
    lineHeight: 1.7,
  },

  // ── education
  eduBlock: { marginBottom: 8 },
  eduDegree: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0c0c0c' },
  eduInst: { fontSize: 9.5, color: '#666666' },
  eduYear: { fontSize: 9, color: '#999999', marginTop: 1 },
})

interface Props {
  content: CvContent
  email?: string
}

export function MinimalTemplate({ content, email }: Props) {
  return (
    <Document title="CV — Landed" creator="Landed App">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.name}>{content.headline}</Text>
          <View style={s.contactRow}>
            {email && <Text>{email}</Text>}
            <Text>Open to remote</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* Summary */}
        {content.summary && (
          <View style={[s.section, s.sectionRow]}>
            <Text style={s.sectionLabel}>Summary</Text>
            <View style={s.sectionContent}>
              <Text style={s.summary}>{content.summary}</Text>
            </View>
          </View>
        )}

        {/* Experience */}
        {content.experience.length > 0 && (
          <View style={s.section}>
            <View style={s.thinDivider} />
            <View style={s.sectionRow}>
              <Text style={s.sectionLabel}>Experience</Text>
              <View style={s.sectionContent}>
                {content.experience.map((exp, i) => (
                  <View key={i} style={s.expBlock}>
                    <View style={s.expHeader}>
                      <Text style={s.expRole}>{exp.role}</Text>
                      <Text style={s.expDates}>{exp.dates}</Text>
                    </View>
                    <Text style={s.expCompany}>{exp.company}</Text>
                    {exp.bullets.map((b, j) => (
                      <View key={j} style={s.bullet}>
                        <Text style={s.bulletDot}>–</Text>
                        <Text style={s.bulletText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Skills */}
        {content.skills.length > 0 && (
          <View style={s.section}>
            <View style={s.thinDivider} />
            <View style={s.sectionRow}>
              <Text style={s.sectionLabel}>Skills</Text>
              <View style={s.sectionContent}>
                {/* comma separated — no pills, clean and ATS-friendly */}
                <Text style={s.skillsText}>{content.skills.join('  ·  ')}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Education */}
        {content.education.length > 0 && (
          <View style={s.section}>
            <View style={s.thinDivider} />
            <View style={s.sectionRow}>
              <Text style={s.sectionLabel}>Education</Text>
              <View style={s.sectionContent}>
                {content.education.map((edu, i) => (
                  <View key={i} style={s.eduBlock}>
                    <Text style={s.eduDegree}>{edu.degree}</Text>
                    <Text style={s.eduInst}>{edu.institution}</Text>
                    <Text style={s.eduYear}>{edu.year}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}
