export const cvToHtml = (cv: any): string => {
  return `
    <h1>${cv.headline}</h1>
    <p>${cv.summary}</p>

    <h2>Experience</h2>
    ${cv.experience
      .map(
        (exp: any) => `
      <h3>${exp.role} · ${exp.company}</h3>
      <p>${exp.dates}</p>
      <ul>
        ${exp.bullets.map((b: any) => `<li>${b}</li>`).join('')}
      </ul>
    `,
      )
      .join('')}

    <h2>Skills</h2>
    <p>${cv.skills.join(', ')}</p>

    <h2>Education</h2>
    ${cv.education
      .map(
        (edu: any) => `
      <p><strong>${edu.degree}</strong> · ${edu.institution} · ${edu.year}</p>
    `,
      )
      .join('')}
  `.trim()
}

export const clToHtml = (cl: any): string =>
  `
    <p>${cl.opening}</p>
    <br />
    <p>${cl.body}</p>
    <br />
    <p>${cl.closing}</p>
  `.trim()
