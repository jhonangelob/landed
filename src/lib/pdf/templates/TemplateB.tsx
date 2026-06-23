import type { CvContent } from '#/types'
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

/**
 * Harvard CV — "Crimson Column" variant.
 *
 * Differences from Template B (Harvard FAS):
 *  - A 3pt crimson left border anchors each section heading instead of a
 *    full-width bottom rule, giving the page a vertical rhythm.
 *  - Name is left-aligned (not centred) in a slightly larger cut; a thin
 *    rule separates the header block from the body.
 *  - Contact line is left-aligned, using a spaced middot separator.
 *  - Section titles are small-caps style (uppercase + reduced fontSize)
 *    with letter-spacing, prefixed by the crimson bar.
 *  - Entry org label is bold but NOT all-caps — role is italic as before.
 *  - Dates sit in a fixed-width right column (52pt) so every date aligns.
 *  - Bullets use an en-dash (–) instead of a bullet dot for a cleaner look.
 *  - Skills rows have a hairline separator between each row.
 */

const CRIMSON = '#8B0000'

const s = StyleSheet.create({
  page: {
    fontSize: 10,
    color: '#111111',
    paddingTop: 30,
    paddingBottom: 28,
    paddingHorizontal: 44,
    lineHeight: 1.3,
    fontFamily: 'Times-Roman',
  },

  // ── header ────────────────────────────────────────────────
  header: {
    marginBottom: 6,
    paddingBottom: 6,
    borderBottom: `1pt solid #111111`,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Times-Bold',
    textAlign: 'left',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 10,
    fontFamily: 'Times-Italic',
    color: CRIMSON,
    marginBottom: 2,
  },
  contactLine: {
    fontSize: 9,
    color: '#333333',
    textAlign: 'left',
  },

  // ── section ───────────────────────────────────────────────
  section: {
    marginBottom: 5,
  },
  sectionTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 4,
  },
  sectionBar: {
    width: 3,
    backgroundColor: CRIMSON,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Times-Bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingTop: 2,
    paddingBottom: 2,
    flex: 1,
    borderBottom: `0.5pt solid #CCCCCC`,
  },

  // ── entry ─────────────────────────────────────────────────
  entry: {
    marginBottom: 3,
    paddingLeft: 9,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  // org row — bold left (not all-caps), italic location right
  orgLeft: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    flex: 1,
    paddingRight: 8,
  },
  orgRight: {
    fontSize: 9,
    fontFamily: 'Times-Italic',
    color: '#444444',
    textAlign: 'right',
    flexShrink: 0,
  },

  // role row — italic left, dates right in fixed column
  roleLeft: {
    fontSize: 10,
    fontFamily: 'Times-Italic',
    flex: 1,
    paddingRight: 8,
  },
  roleRight: {
    fontSize: 9,
    fontFamily: 'Times-Roman',
    color: '#444444',
    textAlign: 'right',
    flexShrink: 0,
  },

  plainLine: {
    fontSize: 9.5,
    marginTop: 1,
    color: '#333333',
    paddingLeft: 0,
  },

  // ── bullets ───────────────────────────────────────────────
  bullets: {
    marginTop: 2,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 1,
    paddingLeft: 4,
  },
  bulletDash: {
    width: 12,
    fontSize: 10,
    color: CRIMSON,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    textAlign: 'justify',
    color: '#222222',
  },

  // ── skills ────────────────────────────────────────────────
  skillRow: {
    flexDirection: 'row',
    paddingVertical: 2,
    paddingLeft: 9,
    borderBottom: `0.5pt solid #EEEEEE`,
  },
  skillLabel: {
    fontFamily: 'Times-BoldItalic',
    fontSize: 9.5,
    color: CRIMSON,
    width: 90,
  },
  skillValue: {
    fontSize: 9.5,
    flex: 1,
    color: '#222222',
  },
})

// ─── sub-components ────────────────────────────────────────────────────────────

function SectionHeading({ title }: { title: string }) {
  return (
    <View style={s.sectionTitleWrapper}>
      <View style={s.sectionBar} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  )
}

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
          <Text style={s.bulletDash}>–</Text>
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

export function TemplateB({ content }: Props) {
  return (
    <Document title="CV" creator="Harvard CV — Crimson Column">
      <Page size="LETTER" style={s.page}>
        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.name}>{content.name}</Text>
          {content.headline ? (
            <Text style={s.headline}>{content.headline}</Text>
          ) : null}
          <Text style={s.contactLine}>
            {[
              content.contact.location,
              content.contact.email,
              content.contact.phone,
            ]
              .filter(Boolean)
              .join('  ·  ')}
          </Text>
          {content.links.length > 0 && (
            <Text style={s.contactLine}>{content.links.join('  ·  ')}</Text>
          )}
        </View>

        {/* ── Summary ── */}
        {content.summary ? (
          <View style={s.section}>
            <SectionHeading title="Summary" />
            <Text style={{ ...s.plainLine, paddingLeft: 9 }}>
              {content.summary}
            </Text>
          </View>
        ) : null}

        {/* ── Education ── */}
        {content.education.length > 0 && (
          <View style={s.section}>
            <SectionHeading title="Education" />
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

        {/* ── Certifications ── */}
        {content.certifications && content.certifications.length > 0 && (
          <View style={s.section}>
            <SectionHeading title="Certifications" />
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

        {/* ── Experience ── */}
        {content.experience.length > 0 && (
          <View style={s.section}>
            <SectionHeading title="Experience" />
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

        {/* ── Leadership and Activities ── */}
        {/* {content.leadership && content.leadership.length > 0 && (
          <View style={s.section}>
            <SectionHeading title="Leadership and Activities" />
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

        {/* ── Projects ── */}
        {content.projects && content.projects.length > 0 && (
          <View style={s.section}>
            <SectionHeading title="Projects" />
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

        {/* ── Skills & Interests ── */}
        {(content.skills.length > 0 ||
          (content.skillGroups && content.skillGroups.length > 0)) && (
          <View style={s.section}>
            <SectionHeading title="Skills &amp; Interests" />
            {content.skillGroups && content.skillGroups.length > 0 ? (
              content.skillGroups.map((g, i) => (
                <View key={i} style={s.skillRow}>
                  <Text style={s.skillLabel}>{g.label}</Text>
                  <Text style={s.skillValue}>{g.value}</Text>
                </View>
              ))
            ) : (
              <View style={s.skillRow}>
                <Text style={s.skillLabel}>Skills</Text>
                <Text style={s.skillValue}>{content.skills.join(', ')}</Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  )
}
