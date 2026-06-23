import type { CvContent } from '#/types'
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

/**
 * "Modern Slate" template.
 *
 * Design characteristics:
 *  - Sans-serif (Helvetica) for a clean contemporary feel vs. A/B serif.
 *  - Thin navy rule across the top anchors the page.
 *  - Name left-aligned in navy; headline below in regular weight.
 *  - Section titles: uppercase, navy, with a navy bottom border.
 *  - Entry layout inverted vs. A/B: Role (bold) on top, then Company · Location
 *    below it in italic — dates sit right-aligned on the role line.
 *  - Bullets use a navy › chevron marker.
 *  - Skills rendered as label-value rows (skillGroups) or comma-separated fallback.
 */

const NAVY = '#1E3A5F'

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1A1A1A',
    paddingTop: 0,
    paddingBottom: 28,
    paddingHorizontal: 44,
    lineHeight: 1.3,
  },

  // ── top rule ──────────────────────────────────────────────
  topRule: {
    height: 4,
    backgroundColor: NAVY,
    marginBottom: 10,
  },

  // ── header ────────────────────────────────────────────────
  header: {
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  headline: {
    fontSize: 10,
    color: '#444444',
    marginBottom: 2,
  },
  contactLine: {
    fontSize: 9,
    color: '#555555',
    marginBottom: 1,
  },

  // ── section ───────────────────────────────────────────────
  section: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: NAVY,
    borderBottom: `1.5pt solid ${NAVY}`,
    paddingBottom: 2,
    marginBottom: 4,
  },

  // ── entry ─────────────────────────────────────────────────
  entry: {
    marginBottom: 4,
  },
  entryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  roleText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    flex: 1,
    paddingRight: 8,
    color: '#1A1A1A',
  },
  datesText: {
    fontSize: 9,
    color: NAVY,
    flexShrink: 0,
  },
  orgLine: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Oblique',
    color: '#444444',
    marginBottom: 1,
  },
  plainLine: {
    fontSize: 9.5,
    color: '#333333',
    marginTop: 1,
  },

  // ── bullets ───────────────────────────────────────────────
  bullets: {
    marginTop: 2,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 1,
    paddingLeft: 8,
  },
  bulletChevron: {
    width: 10,
    fontSize: 9,
    color: NAVY,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: '#333333',
    textAlign: 'justify',
  },

  // ── skills ────────────────────────────────────────────────
  skillRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  skillLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: NAVY,
    width: 90,
  },
  skillValue: {
    fontSize: 9.5,
    flex: 1,
    color: '#333333',
  },
})

// ─── sub-components ────────────────────────────────────────────────────────────

function Bullets({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <View style={s.bullets}>
      {items.map((b, i) => (
        <View key={i} style={s.bullet} wrap={false}>
          <Text style={s.bulletChevron}>›</Text>
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

export function TemplateC({ content }: Props) {
  const contactParts = [
    content.contact.location,
    content.contact.email,
    content.contact.phone,
  ].filter(Boolean)

  return (
    <Document title="CV — Landed" creator="Landed App">
      <Page size="LETTER" style={s.page}>
        {/* ── Top accent rule ── */}
        <View style={s.topRule} />

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.name}>{content.name}</Text>
          {content.headline ? (
            <Text style={s.headline}>{content.headline}</Text>
          ) : null}
          {contactParts.length > 0 && (
            <Text style={s.contactLine}>{contactParts.join('  ·  ')}</Text>
          )}
          {content.links.length > 0 && (
            <Text style={s.contactLine}>{content.links.join('  ·  ')}</Text>
          )}
        </View>

        {/* ── Summary ── */}
        {content.summary ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Summary</Text>
            <Text style={s.plainLine}>{content.summary}</Text>
          </View>
        ) : null}

        {/* ── Experience ── */}
        {content.experience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Experience</Text>
            {content.experience.map((exp, i) => (
              <View key={i} style={s.entry} wrap={false}>
                <View style={s.entryTopRow}>
                  <Text style={s.roleText}>{exp.role}</Text>
                  <Text style={s.datesText}>{exp.dates}</Text>
                </View>
                <Text style={s.orgLine}>
                  {[exp.company, exp.location].filter(Boolean).join('  ·  ')}
                </Text>
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
                <View style={s.entryTopRow}>
                  <Text style={s.roleText}>{proj.name}</Text>
                  {proj.dates ? (
                    <Text style={s.datesText}>{proj.dates}</Text>
                  ) : null}
                </View>
                {[proj.role, proj.url].filter(Boolean).length > 0 && (
                  <Text style={s.orgLine}>
                    {[proj.role, proj.url].filter(Boolean).join('  ·  ')}
                  </Text>
                )}
                <Bullets items={proj.bullets ?? []} />
              </View>
            ))}
          </View>
        )}

        {/* ── Education ── */}
        {content.education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Education</Text>
            {content.education.map((edu, i) => (
              <View key={i} style={s.entry} wrap={false}>
                <View style={s.entryTopRow}>
                  <Text style={s.roleText}>{edu.degree}</Text>
                  <Text style={s.datesText}>{edu.year}</Text>
                </View>
                <Text style={s.orgLine}>
                  {[edu.institution, edu.location]
                    .filter(Boolean)
                    .join('  ·  ')}
                </Text>
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
            <Text style={s.sectionTitle}>Certifications</Text>
            {content.certifications.map((cert, i) => (
              <View key={i} style={s.entry} wrap={false}>
                <View style={s.entryTopRow}>
                  <Text style={s.roleText}>{cert.name}</Text>
                  {cert.date ? (
                    <Text style={s.datesText}>{cert.date}</Text>
                  ) : null}
                </View>
                {cert.issuer ? (
                  <Text style={s.orgLine}>{cert.issuer}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* ── Skills ── */}
        {(content.skills.length > 0 ||
          (content.skillGroups && content.skillGroups.length > 0)) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            {content.skillGroups && content.skillGroups.length > 0 ? (
              content.skillGroups.map((g, i) => (
                <View key={i} style={s.skillRow}>
                  <Text style={s.skillLabel}>{g.label}</Text>
                  <Text style={s.skillValue}>{g.value}</Text>
                </View>
              ))
            ) : (
              <View style={s.skillRow}>
                <Text style={s.skillValue}>{content.skills.join('  ·  ')}</Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  )
}
