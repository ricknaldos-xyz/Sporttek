'use server'

import { cookies } from 'next/headers'
import { LOCALES, type Locale } from '@/i18n/locale'

export async function setLocaleAction(locale: string) {
  if (!LOCALES.includes(locale as Locale)) return
  const cookieStore = await cookies()
  cookieStore.set('locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
}
