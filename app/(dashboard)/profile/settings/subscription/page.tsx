import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'
import Link from 'next/link'
import { CancelSubscriptionButton } from './cancel-button'

export const metadata: Metadata = {
  title: 'Gestionar Suscripcion | SportTech',
  description: 'Administra tu suscripcion y metodo de pago.',
}

export default async function SubscriptionPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      subscription: true,
      culqiSubscriptionId: true,
      culqiCurrentPeriodEnd: true,
    },
  })

  if (!user) redirect('/login')

  const isFreePlan = user.subscription === 'FREE'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <GlassButton variant="ghost" size="icon" asChild>
          <Link href="/profile/settings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </GlassButton>
        <div>
          <h1 className="text-2xl font-bold">Gestionar Suscripcion</h1>
          <p className="text-muted-foreground">
            Administra tu plan y metodo de pago
          </p>
        </div>
      </div>

      <GlassCard intensity="light" padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="glass-primary border-glass rounded-lg p-1.5">
            <CreditCard className="h-4 w-4 text-primary" />
          </div>
          <h2 className="font-semibold">Plan actual</h2>
          <GlassBadge variant="primary">{user.subscription}</GlassBadge>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-medium">
              {user.subscription === 'FREE' && 'Plan gratuito con funciones basicas'}
              {user.subscription === 'PRO' && 'Plan Pro con analisis ilimitados'}
              {user.subscription === 'ELITE' && 'Plan Elite con todas las funciones'}
            </p>
          </div>

          {user.culqiCurrentPeriodEnd && (
            <div className="p-3 rounded-lg bg-secondary/30">
              <p className="text-sm text-muted-foreground">
                Tu suscripcion se renueva el{' '}
                <span className="font-medium text-foreground">
                  {new Date(user.culqiCurrentPeriodEnd).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {isFreePlan ? (
              <GlassButton variant="solid" asChild>
                <Link href="/pricing">Mejorar Plan</Link>
              </GlassButton>
            ) : (
              <>
                <GlassButton variant="outline" asChild>
                  <Link href="/pricing">Cambiar Plan</Link>
                </GlassButton>
                <CancelSubscriptionButton />
              </>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
