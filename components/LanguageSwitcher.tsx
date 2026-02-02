'use client'

import { useTransition } from 'react'
import { useLocale } from 'next-intl'
import { GlassButton } from '@/components/ui/glass-button'
import { Globe } from 'lucide-react'
import { setLocaleAction } from '@/app/actions/locale'

export function LanguageSwitcher() {
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const nextLocale = locale === 'es' ? 'en' : 'es'
  const label = locale === 'es' ? 'EN' : 'ES'

  return (
    <GlassButton
      variant="ghost"
      size="icon"
      disabled={isPending}
      aria-label={`Cambiar idioma a ${nextLocale === 'es' ? 'Espanol' : 'English'}`}
      onClick={() => {
        startTransition(async () => {
          await setLocaleAction(nextLocale)
        })
      }}
    >
      <Globe className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </GlassButton>
  )
}
