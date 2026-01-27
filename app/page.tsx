import type { Metadata } from 'next'
import { LandingHeader } from '@/components/landing/LandingHeader'

export const metadata: Metadata = {
  title: 'SportTech - Analisis Deportivo con IA',
  description: 'Mejora tu tecnica deportiva con analisis de video impulsado por inteligencia artificial. Entrenamiento personalizado, rankings y comunidad.',
  openGraph: {
    title: 'SportTech - Analisis Deportivo con IA',
    description: 'Mejora tu tecnica deportiva con analisis de video impulsado por inteligencia artificial. Entrenamiento personalizado, rankings y comunidad.',
    type: 'website',
    locale: 'es_PE',
    siteName: 'SportTech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportTech - Analisis Deportivo con IA',
    description: 'Mejora tu tecnica deportiva con analisis de video impulsado por inteligencia artificial.',
  },
}
import { HeroSection } from '@/components/landing/HeroSection'
import { RankingPreview } from '@/components/landing/RankingPreview'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { CTASection } from '@/components/landing/CTASection'
import { LandingFooter } from '@/components/landing/LandingFooter'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <RankingPreview />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
