// app/lib/pdf/templates/modern.tsx
//
// RUNWAY PLAN template
// Two column layout — sidebar on the left for contact,
// skills and education. Main column for summary and experience.
// Great for tech and design roles.
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { CvContent } from '#/validators/documents'

const SIDEBAR_WIDTH = 175
const SIDEBAR_BG = '#0c1f35'
const ACCENT = '#0ea5e9'

const s = StyleSheet.create({
  page: {
    fontSize: 10,
    lineHeight: 1.5,
    flexDirection: 'row',
    fontFamily: 'Helvetica',
  },

  // ── sidebar (left)
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: SIDEBAR_BG,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    minHeight: '100%',
  },
  sidebarName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#f0f9ff',
    lineHeight: 1.2,
    marginBottom: 4,
  },
  sidebarRole: {
    fontSize: 9,
    color: '#7dd3fc',
    marginBottom: 24,
    lineHeight: 1.4,
  },
  sidebarSectionTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: ACCENT,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 18,
    borderBottom: '0.5pt solid #1e4a7a',
    paddingBottom: 3,
  },
  sidebarText: {
    fontSize: 8.5,
    color: '#94c8e8',
    marginBottom: 3,
    lineHeight: 1.5,
  },
  sidebarSkillPill: {
    backgroundColor: 'rgba(14,165,233,.18)',
    color: '#7dd3fc',
    fontSize: 8,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 3,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  sidebarEduDegree: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#f0f9ff',
    marginBottom: 1,
  },
  sidebarEduInst: {
    fontSize: 8,
    color: '#94c8e8',
  },
  sidebarEduYear: {
    fontSize: 7.5,
    color: '#5a7a99',
    marginTop: 1,
    marginBottom: 8,
  },
  accentLine: {
    height: 2,
    width: 28,
    backgroundColor: ACCENT,
    borderRadius: 1,
    marginBottom: 16,
  },

  // ── main column (right)
  main: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 28,
    backgroundColor: '#ffffff',
  },
  mainSectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0284c7',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 18,
    borderBottom: '0.5pt solid #e0f2fe',
    paddingBottom: 3,
  },
  summary: {
    fontSize: 9.5,
    color: '#3d6080',
    lineHeight: 1.65,
    marginTop: 2,
  },
  expBlock: { marginBottom: 12 },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  expRole: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: '#0c1f35' },
  expDates: { fontSize: 8.5, color: '#5a7a99' },
  expCompany: { fontSize: 9.5, color: '#0284c7', marginBottom: 4 },
  bullet: { flexDirection: 'row', marginBottom: 2, paddingLeft: 6 },
  bulletDot: { width: 10, fontSize: 9, color: ACCENT },
  bulletText: { flex: 1, fontSize: 9.5, color: '#3d6080' },
})

interface Props {
  content: CvContent
  email?: string
}

export function ModernTemplate({ content, email }: Props) {
  return (
    <Document title="CV — Landed" creator="Landed App">
      <Page size="A4" style={s.page}>
        {/* ── SIDEBAR ── */}
        <View style={s.sidebar}>
          <Text style={s.sidebarName}>{content.headline}</Text>
          <View style={s.accentLine} />

          {/* Contact */}
          {email && (
            <>
              <Text style={s.sidebarSectionTitle}>Contact</Text>
              <Text style={s.sidebarText}>{email}</Text>
              <Text style={s.sidebarText}>Open to remote</Text>
            </>
          )}

          {/* Skills */}
          {content.skills.length > 0 && (
            <>
              <Text style={s.sidebarSectionTitle}>Skills</Text>
              {content.skills.map((skill, i) => (
                <View key={i} style={s.sidebarSkillPill}>
                  <Text>{skill}</Text>
                </View>
              ))}
            </>
          )}

          {/* Education */}
          {content.education.length > 0 && (
            <>
              <Text style={s.sidebarSectionTitle}>Education</Text>
              {content.education.map((edu, i) => (
                <View key={i}>
                  <Text style={s.sidebarEduDegree}>{edu.degree}</Text>
                  <Text style={s.sidebarEduInst}>{edu.institution}</Text>
                  <Text style={s.sidebarEduYear}>{edu.year}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* ── MAIN COLUMN ── */}
        <View style={s.main}>
          {/* Summary */}
          {content.summary && (
            <>
              <Text style={[s.mainSectionTitle, { marginTop: 0 }]}>
                Summary
              </Text>
              <Text style={s.summary}>{content.summary}</Text>
            </>
          )}

          {/* Experience */}
          {content.experience.length > 0 && (
            <>
              <Text style={s.mainSectionTitle}>Experience</Text>
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
            </>
          )}
        </View>
      </Page>
    </Document>
  )
}
