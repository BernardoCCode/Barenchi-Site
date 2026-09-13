export type WhatsAppCopy = {
  morning: string
  afternoon: string
  evening: string
  called: string
  email: string
  intent: string
}

export type WhatsAppDraft = {
  name: string
  email: string
  intent: string
  hour?: number
}

export function greetingForHour(hour: number, copy: Pick<WhatsAppCopy, 'morning' | 'afternoon' | 'evening'>) {
  if (hour >= 5 && hour < 12) return copy.morning
  if (hour >= 12 && hour < 18) return copy.afternoon
  return copy.evening
}

function collapse(text: string) {
  return text.replace(/\s+/g, ' ').trim()
}

function ensureSentence(text: string) {
  return /[.!?…]$/.test(text) ? text : `${text}.`
}

function joinIntent(lead: string, body: string) {
  const intent = collapse(body)
  const prefix = collapse(lead)
  if (!intent) return ensureSentence(prefix)

  const alreadyLeads = intent.toLocaleLowerCase().startsWith(prefix.toLocaleLowerCase())
  return ensureSentence(alreadyLeads ? intent : `${prefix} ${intent}`)
}

export function composeWhatsAppMessage(copy: WhatsAppCopy, draft: WhatsAppDraft) {
  const hour = draft.hour ?? new Date().getHours()
  const greeting = greetingForHour(hour, copy)
  const name = collapse(draft.name)
  const email = collapse(draft.email)

  return [
    `${greeting}, ${copy.called} ${name}.`,
    `${copy.email} ${email}.`,
    joinIntent(copy.intent, draft.intent),
  ].join(' ')
}
