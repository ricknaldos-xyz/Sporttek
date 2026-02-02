import { cookies } from 'next/headers'

export const LOCALES = ['es', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'es'

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value
  if (locale && LOCALES.includes(locale as Locale)) {
    return locale as Locale
  }
  return DEFAULT_LOCALE
}
