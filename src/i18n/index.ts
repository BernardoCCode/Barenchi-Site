import { en } from './locales/en'
import { ptBR } from './locales/pt-BR'
import type { Locale, Messages } from './types'

export type { Locale, Messages }

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALES: Record<Locale, Messages> = {
  en,
  'pt-BR': ptBR,
}

export function resolveLocale(input: string | null | undefined): Locale {
  if (!input) return DEFAULT_LOCALE
  return input.toLowerCase().startsWith('pt') ? 'pt-BR' : DEFAULT_LOCALE
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  return resolveLocale(window.navigator.languages?.[0] ?? window.navigator.language)
}

export function getMessages(locale: Locale): Messages {
  return LOCALES[locale]
}

export { I18nProvider, useI18n } from './I18nProvider'
