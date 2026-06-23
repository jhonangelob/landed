import type { CvContent } from '#/types'
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

/**
 * Harvard CV template (Harvard FAS Mignone Center for Career Success layout).
 *
 * Layout characteristics faithfully reproduced from the source PDF:
 *  - Centered name at the top, centered contact line beneath it.
 *  - Each section opens with a left-aligned, all-caps heading that spans
 *    the full content width with a hairline rule beneath it.
 *  - Each entry has a two-column header row: bold/uppercase organization on
 *    the left, italic location on the right; then italic position/role on
 *    the left with the italic date range on the right.
 *  - Bulleted descriptions use a round "•" marker, hanging indent.
 *  - Skills & Interests rows use an italic-bold label followed by plain value.
 *
 * Single-page safety: tight, deterministic spacing, no min-heights, wrap
 * disabled on logical blocks so a row never splits across a page break.
 */

const COLORS = {
  ink: '#000000',
  rule: '#000000',
  note: '#555555',
}

const s = StyleSheet.create({
  page: {
    fontSize: 11,
    color: COLORS.ink,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 44,
    lineHeight: 1.35,
    fontFamily: 'Times-Roman',
  },

  // ── header ────────────────────────────────────────────────
  header: {
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  headline: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginTop: 6,
  },
  contactLine: {
    fontSize: 10,
    textAlign: 'center',
  },

  // ── section ───────────────────────────────────────────────
  section: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    borderBottom: '1pt solid #000000',
    paddingBottom: 2,
    marginBottom: 4,
  },

  // ── entry ─────────────────────────────────────────────────
  entry: {
    marginBottom: 5,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  // org row — bold + uppercase left, italic right
  orgLeft: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    flex: 1,
    paddingRight: 8,
  },
  orgRight: {
    fontSize: 10,
    fontFamily: 'Times-Italic',
    textAlign: 'right',
  },

  // role row — italic left, italic right
  roleLeft: {
    fontSize: 11,
    fontFamily: 'Times-Italic',
    flex: 1,
    paddingRight: 8,
  },
  roleRight: {
    fontSize: 10,
    fontFamily: 'Times-Italic',
    textAlign: 'right',
  },

  // single supplementary line (thesis, coursework, study abroad detail)
  plainLine: {
    fontSize: 10,
    marginTop: 1,
    textAlign: 'justify',
  },

  // ── bullets ───────────────────────────────────────────────
  bullets: {
    marginTop: 2,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 12,
  },
  bulletDot: {
    width: 10,
    fontSize: 11,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    textAlign: 'justify',
  },

  // ── skills & interests ────────────────────────────────────
  skillRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  skillValue: {
    fontSize: 10,
    flex: 1,
  },
  skillLabel: {
    fontFamily: 'Times-BoldItalic',
    fontSize: 10,
  },
})

// ─── sub-components ────────────────────────────────────────────────────────────

interface EntryHeaderProps {
  org: string
  location?: string
  role?: string
  dates?: string
}

function EntryHeader({ org, location, role, dates }: EntryHeaderProps) {
  return (
    <>
      <View style={s.rowBetween}>
        <Text style={s.orgLeft}>{org}</Text>
        {location ? <Text style={s.orgRight}>{location}</Text> : null}
      </View>
      {(role || dates) && (
        <View style={s.rowBetween}>
          <Text style={s.roleLeft}>{role}</Text>
          {dates ? <Text style={s.roleRight}>{dates}</Text> : null}
        </View>
      )}
    </>
  )
}

function Bullets({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <View style={s.bullets}>
      {items.map((b, j) => (
        <View key={j} style={s.bullet} wrap={false}>
          <Text style={s.bulletDot}>•</Text>
          <Text style={s.bulletText}>{b}</Text>
        </View>
      ))}
    </View>
  )
}

// ─── main component ────────────────────────────────────────────────────────────

interface Props {
  content: CvContent
}

export function TemplateA({ content }: Props) {
  const contactLine1 = [
    content.contact.location,
    content.contact.email,
    content.contact.phone,
  ]

  return (
    <Document title="CV" creator="Harvard CV">
      <Page size="LETTER" style={s.page}>
        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.name}>{content.name}</Text>
          <Text style={s.headline}>{content.headline}</Text>
          {contactLine1.length > 0 && (
            <Text style={s.contactLine}>{contactLine1.join(' • ')}</Text>
          )}
          {content.links.length > 0 && (
            <Text style={s.contactLine}>{content.links.join(' • ')}</Text>
          )}
        </View>

        {/* ── Summary ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Summary</Text>
          <Text style={s.plainLine}>{content.summary}</Text>
        </View>

        {/* ── Skills & Interests ── */}
        {(content.skills.length > 0 ||
          (content.skillGroups && content.skillGroups.length > 0)) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills &amp; Interests</Text>
            {content.skillGroups && content.skillGroups.length > 0 ? (
              content.skillGroups.map((g, i) => (
                <View key={i} style={s.skillRow}>
                  <Text style={s.skillValue}>
                    <Text style={s.skillLabel}>{g.label}: </Text>
                    {g.value}
                  </Text>
                </View>
              ))
            ) : (
              <View style={s.skillRow}>
                <Text style={s.skillValue}>
                  <Text style={s.skillLabel}>Skills: </Text>
                  {content.skills.join(', ')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── Experience ── */}
        {content.experience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Experience</Text>
            {content.experience.map((exp, i) => (
              <View key={i} style={s.entry} wrap={false}>
                <EntryHeader
                  org={exp.company}
                  location={exp.location}
                  role={exp.role}
                  dates={exp.dates}
                />
                <Bullets items={exp.bullets} />
              </View>
            ))}
          </View>
        )}

        {/* ── Projects ── */}
        {content.projects && content.projects.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Projects</Text>
            {content.projects.map((proj, i) => (
              <View key={i} style={s.entry} wrap={false}>
                <EntryHeader
                  org={proj.name}
                  location={proj.url}
                  role={proj.role}
                  dates={proj.dates}
                />
                <Bullets items={proj.bullets ?? []} />
              </View>
            ))}
          </View>
        )}

        {/* ── Certifications ── */}
        {content.certifications && content.certifications.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Certifications</Text>
            {content.certifications.map((cert, i) => (
              <View key={i} style={s.entry} wrap={false}>
                <EntryHeader
                  org={cert.name}
                  role={cert.issuer}
                  dates={cert.date}
                />
              </View>
            ))}
          </View>
        )}

        {/* ── Projects & Activities ── */}
        {/* {content.leadership && content.leadership.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Projects and Activities</Text>
            {content.leadership.map((act, i) => (
              <View key={i} style={s.entry} wrap={false}>
                <EntryHeader
                  org={act.organization}
                  location={act.location}
                  role={act.role}
                  dates={act.dates}
                />
                <Bullets items={act.bullets ?? []} />
              </View>
            ))}
          </View>
        )} */}

        {/* ── Education ── */}
        {content.education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Education</Text>
            {content.education.map((edu, i) => (
              <View key={i} style={s.entry} wrap={false}>
                <EntryHeader
                  org={edu.institution}
                  location={edu.location}
                  role={edu.degree}
                  dates={edu.year}
                />
                {edu.detail ? (
                  <Text style={s.plainLine}>{edu.detail}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}
