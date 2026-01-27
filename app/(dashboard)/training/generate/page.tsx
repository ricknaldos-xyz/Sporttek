'use client'

import { Suspense } from 'react'
import { GeneratePlanForm } from './generate-form'
import { GlassCard } from '@/components/ui/glass-card'
import { Loader2 } from 'lucide-react'

function GenerateLoading() {
  return (
    <div className="max-w-2xl mx-auto">
      <GlassCard intensity="medium" padding="lg" className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </GlassCard>
    </div>
  )
}

export default function GeneratePlanPage() {
  return (
    <Suspense fallback={<GenerateLoading />}>
      <GeneratePlanForm />
    </Suspense>
  )
}
