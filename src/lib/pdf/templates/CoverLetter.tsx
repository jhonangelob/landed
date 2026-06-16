import type { CoverLetterContent } from '#/types'
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

/**
 * Cover letter as a standard business letter: sender block, date, recipient
 * block, greeting, opening + body + closing paragraphs, then a "Sincerely,"
 * sign-off with the candidate's name. Mirrors the HTML preview (clToHtml) so
 * the download matches what the user sees on screen.
 */

const s = StyleSheet.create({
  page: {
    fontSize: 11,
    color: '#000000',
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 44,
    lineHeight: 1.35,
    fontFamily: 'Times-Roman',
  },
  block: { marginBottom: 14 },
  name: { fontFamily: 'Times-Bold' },
  date: { marginBottom: 14 },
  greeting: { marginBottom: 10 },
  para: { marginBottom: 10, textAlign: 'justify', lineHeight: 1.35 },
  signoff: { marginTop: 14 },
})

const splitParagraphs = (text: string): string[] =>
  text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

interface Props {
  content: CoverLetterContent
}

export function CoverLetter({ content }: Props) {
  const { sender, date, recipient, greeting, opening, body, closing } = content

  return (
    <Document title="Cover Letter" creator="Landed">
      <Page size="LETTER" style={s.page}>
        {/* ── Sender ── */}
        <View style={s.block}>
          {sender.name ? <Text style={s.name}>{sender.name}</Text> : null}
          {sender.location ? <Text>{sender.location}</Text> : null}
          {sender.phone ? <Text>{sender.phone}</Text> : null}
          {sender.email ? <Text>{sender.email}</Text> : null}
        </View>

        {/* ── Date ── */}
        {date ? <Text style={s.date}>{date}</Text> : null}

        {/* ── Recipient ── */}
        <View style={s.block}>
          {recipient.name ? <Text>{recipient.name}</Text> : null}
          {recipient.title ? <Text>{recipient.title}</Text> : null}
          {recipient.company ? <Text>{recipient.company}</Text> : null}
          {recipient.address ? <Text>{recipient.address}</Text> : null}
        </View>

        {/* ── Greeting ── */}
        {greeting ? <Text style={s.greeting}>{greeting}</Text> : null}

        {/* ── Body ── */}
        {splitParagraphs(opening).map((p, i) => (
          <Text key={`o${i}`} style={s.para}>
            {p}
          </Text>
        ))}
        {splitParagraphs(body).map((p, i) => (
          <Text key={`b${i}`} style={s.para}>
            {p}
          </Text>
        ))}
        {splitParagraphs(closing).map((p, i) => (
          <Text key={`c${i}`} style={s.para}>
            {p}
          </Text>
        ))}

        {/* ── Sign-off ── */}
        <View style={s.signoff}>
          <Text>Sincerely,</Text>
          {sender.name ? <Text>{sender.name}</Text> : null}
        </View>
      </Page>
    </Document>
  )
}
