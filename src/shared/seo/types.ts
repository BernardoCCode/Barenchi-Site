export type SeoPageId = 'home' | 'about' | 'services' | 'contact' | 'notfound'

export type SeoCopy = {
  title: string
  description: string
  heading?: string
  lead?: string
  crumb: string
}

export type ResolvedSeo = {
  id: SeoPageId
  canonicalPath: string
  title: string
  description: string
  crumb: string
}
