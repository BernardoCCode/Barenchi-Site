export const COMPANY = {
  name: 'Barenchi',
  email: 'barenchisoftware@gmail.com',
  tagline: 'Software, design and technology for businesses that want to move forward.',
  whatsapp: {
    e164: '5521987704552',
    display: '+55 21 98770-4552',
  },
  instagram: {
    handle: '@barenchi.tech',
    href: 'https://www.instagram.com/barenchi.tech',
  },
} as const

export function whatsappHref(text?: string) {
  const base = `https://wa.me/${COMPANY.whatsapp.e164}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
