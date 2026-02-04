'use client'

import { Suspense } from 'react'
import { RegisterForm } from './register-form'
import { Loader2 } from 'lucide-react'

function RegisterLoading() {
  return (
    <div className="w-full max-w-5xl">
      <div className="rounded-[var(--radius-card)] bg-background shadow-2xl flex items-center justify-center min-h-[650px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  )
}
