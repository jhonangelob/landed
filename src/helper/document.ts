import type { CoverLetterContent, CvContent } from '#/validators/documents'

// Escape user/AI-derived text before interpolating it into HTML. The result is
// stored as `contentHtml` and rendered via dangerouslySetInnerHTML, so every
// interpolated value must be escaped to prevent stored XSS.
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

export const cvToHtml = (cv: CvContent): string => {
  return `
    <h1>${esc(cv.headline)}</h1>
    <p>${esc(cv.summary)}</p>

    <h2>Experience</h2>
    ${cv.experience
      .map(
        (exp) => `
      <h3>${esc(exp.role)} · ${esc(exp.company)}</h3>
      <p>${esc(exp.dates)}</p>
      <ul>
        ${exp.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
      </ul>
    `,
      )
      .join('')}

    <h2>Skills</h2>
    <p>${cv.skills.map((s) => esc(s)).join(', ')}</p>

    <h2>Education</h2>
    ${cv.education
      .map(
        (edu) => `
      <p><strong>${esc(edu.degree)}</strong> · ${esc(edu.institution)} · ${esc(edu.year)}</p>
    `,
      )
      .join('')}
  `.trim()
}

export const clToHtml = (cl: CoverLetterContent): string =>
  `
    <p>${esc(cl.opening)}</p>
    <br />
    <p>${esc(cl.body)}</p>
    <br />
    <p>${esc(cl.closing)}</p>
  `.trim()
