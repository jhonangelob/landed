import type { CoverLetterContent, CvContent } from '#/types'

const esc = (value: unknown): string =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c] as string,
  )

/**
 * Inline styles that mirror the Harvard CV PDF (TemplateA) so the preview HTML
 * matches the exported document. Inline so they win over the `prose` wrapper in
 * FilePreview (Tailwind Typography uses `:where()` selectors with ~0 specificity).
 * Values use `pt` to stay 1:1 with TemplateA's react-pdf style sheet.
 */
const S = {
  page: 'font-family:"Times New Roman",Times,serif;color:#000;font-size:11pt;line-height:1.35;',
  header: 'margin:0 0 10pt;',
  name: 'font-size:18pt;font-weight:bold;text-align:center;margin:0 0 3pt;',
  headline: 'font-size:10pt;font-weight:bold;text-align:center;margin:0 0 0 0;',
  contact: 'font-size:10pt;text-align:center;margin:0;',
  section: 'margin:0 0 5pt;',
  sectionTitle:
    'font-size:11pt;font-weight:bold;letter-spacing:0.6px;text-transform:uppercase;border-bottom:1pt solid #000;padding-bottom:2pt;margin:0 0 4pt;',
  entry: 'margin:0 0 5pt;',
  row: 'display:flex;justify-content:space-between;align-items:flex-start;',
  orgLeft:
    'font-size:11pt;font-weight:bold;text-transform:uppercase;flex:1;padding-right:8pt;margin:0;',
  orgRight:
    'font-size:10pt;font-style:italic;text-align:right;margin:0;white-space:nowrap;',
  roleLeft:
    'font-size:11pt;font-style:italic;flex:1;padding-right:8pt;margin:0;',
  roleRight:
    'font-size:10pt;font-style:italic;text-align:right;margin:0;white-space:nowrap;',
  plainLine: 'font-size:10pt;text-align:justify;margin:1pt 0 0;',
  bullets: 'margin:2pt 0 0;',
  bullet: 'display:flex;margin:0 0 2pt;padding-left:12pt;',
  bulletDot: 'width:10pt;font-size:11pt;flex:0 0 auto;',
  bulletText: 'flex:1;font-size:10pt;text-align:justify;margin:0;',
  skillRow: 'display:flex;margin:0 0 1pt;',
  skillValue: 'font-size:10pt;flex:1;margin:0;',
  skillLabel: 'font-weight:bold;font-style:italic;',
}

interface EntryHeaderArgs {
  org: string
  location?: string
  role?: string
  dates?: string
}

const entryHeader = ({ org, location, role, dates }: EntryHeaderArgs): string =>
  `
    <div style="${S.row}">
      <p style="${S.orgLeft}">${esc(org)}</p>
      ${location ? `<p style="${S.orgRight}">${esc(location)}</p>` : ''}
    </div>
    ${
      role || dates
        ? `<div style="${S.row}">
      <p style="${S.roleLeft}">${esc(role)}</p>
      ${dates ? `<p style="${S.roleRight}">${esc(dates)}</p>` : ''}
    </div>`
        : ''
    }`

const bulletList = (items: string[]): string =>
  items.length === 0
    ? ''
    : `<div style="${S.bullets}">${items
        .map(
          (b) =>
            `<div style="${S.bullet}"><span style="${S.bulletDot}">•</span><span style="${S.bulletText}">${esc(b)}</span></div>`,
        )
        .join('')}</div>`

const section = (title: string, body: string): string =>
  `<div style="${S.section}"><p style="${S.sectionTitle}">${title}</p>${body}</div>`

export function cvToHtml(cv: CvContent): string {
  const contactLine = [cv.contact.location, cv.contact.email, cv.contact.phone]
    .filter(Boolean)
    .map(esc)
    .join(' • ')

  const header = `
    <div style="${S.header}">
      <p style="${S.name}">${esc(cv.name)}</p>
      ${cv.headline ? `<p style="${S.headline}">${esc(cv.headline)}</p>` : ''}
      ${contactLine ? `<p style="${S.contact}">${contactLine}</p>` : ''}
      ${cv.links.length ? `<p style="${S.contact}">${cv.links.map(esc).join(' • ')}</p>` : ''}
    </div>`

  const summary = cv.summary
    ? section('Summary', `<p style="${S.plainLine}">${esc(cv.summary)}</p>`)
    : ''

  const education =
    cv.education.length > 0
      ? section(
          'Education',
          cv.education
            .map(
              (edu) =>
                `<div style="${S.entry}">${entryHeader({
                  org: edu.institution,
                  location: edu.location,
                  role: edu.degree,
                  dates: edu.year,
                })}${edu.detail ? `<p style="${S.plainLine}">${esc(edu.detail)}</p>` : ''}</div>`,
            )
            .join(''),
        )
      : ''

  const experience =
    cv.experience.length > 0
      ? section(
          'Experience',
          cv.experience
            .map(
              (exp) =>
                `<div style="${S.entry}">${entryHeader({
                  org: exp.company,
                  location: exp.location,
                  role: exp.role,
                  dates: exp.dates,
                })}${bulletList(exp.bullets)}</div>`,
            )
            .join(''),
        )
      : ''

  const certifications =
    cv.certifications && cv.certifications.length > 0
      ? section(
          'Certifications',
          cv.certifications
            .map(
              (cert) =>
                `<div style="${S.entry}">${entryHeader({
                  org: cert.name,
                  role: cert.issuer,
                  dates: cert.date,
                })}</div>`,
            )
            .join(''),
        )
      : ''

  const hasSkills =
    cv.skills.length > 0 || (cv.skillGroups && cv.skillGroups.length > 0)
  const skills = hasSkills
    ? section(
        'Skills &amp; Interests',
        cv.skillGroups && cv.skillGroups.length > 0
          ? cv.skillGroups
              .map(
                (g) =>
                  `<div style="${S.skillRow}"><p style="${S.skillValue}"><span style="${S.skillLabel}">${esc(g.label)}: </span>${esc(g.value)}</p></div>`,
              )
              .join('')
          : `<div style="${S.skillRow}"><p style="${S.skillValue}"><span style="${S.skillLabel}">Skills: </span>${cv.skills.map(esc).join(', ')}</p></div>`,
      )
    : ''

  return `<div style="${S.page}">${header}${summary}${education}${experience}${certifications}${skills}</div>`.trim()
}

/** Business-letter styles for the cover letter — reuse the serif page from S. */
const CL = {
  block: 'margin:0 0 14pt;',
  line: 'font-size:11pt;line-height:1.35;margin:0;',
  nameLine: 'font-size:11pt;line-height:1.35;font-weight:bold;margin:0;',
  date: 'font-size:11pt;line-height:1.35;margin:0 0 14pt;',
  para: 'font-size:11pt;line-height:1.5;text-align:justify;margin:0 0 10pt;',
  signoff: 'margin:14pt 0 0;',
}

export const clToHtml = (cl: CoverLetterContent): string => {
  const line = (value: string | undefined, style: string = CL.line): string =>
    value ? `<p style="${style}">${esc(value)}</p>` : ''

  // Sender block: name, city & ZIP, phone, email.
  const senderBlock = [
    line(cl.sender.name, CL.nameLine),
    line(cl.sender.location),
    line(cl.sender.phone),
    line(cl.sender.email),
  ].join('')

  // Recipient block: contact name, title, company, address. Any unknown line
  // is omitted rather than shown as a placeholder.
  const recipientBlock = [
    line(cl.recipient.name),
    line(cl.recipient.title),
    line(cl.recipient.company),
    line(cl.recipient.address),
  ].join('')

  const paragraphs = (text: string): string =>
    text
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p style="${CL.para}">${esc(p)}</p>`)
      .join('')

  return `<div style="${S.page}">
      <div style="${CL.block}">${senderBlock}</div>
      ${line(cl.date, CL.date)}
      <div style="${CL.block}">${recipientBlock}</div>
      ${line(cl.greeting, CL.para)}
      ${paragraphs(cl.opening)}
      ${paragraphs(cl.body)}
      ${paragraphs(cl.closing)}
      <div style="${CL.signoff}">
        <p style="${CL.line}">Sincerely,</p>
        ${line(cl.sender.name)}
      </div>
    </div>`.trim()
}
