'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider'
import { CelebrationOverlay } from '@/components/gamification/CelebrationOverlay'
import { useState } from 'react'
import { X, Target, LayoutDashboard, Video, History, Dumbbell, User, Trophy, Swords, Flag, Users, ShoppingBag, Wrench, Medal, CircleDot, Bell, GraduationCap, Shield } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BottomNav } from '@/components/layout/BottomNav'

const mainNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Nuevo Analisis', href: '/analyze', icon: Video },
  { name: 'Mis Analisis', href: '/analyses', icon: History },
  { name: 'Entrenamiento', href: '/training', icon: Dumbbell },
]

const competitionNavigation = [
  { name: 'Rankings', href: '/rankings', icon: Trophy },
  { name: 'Matchmaking', href: '/matchmaking', icon: Swords },
  { name: 'Desafios', href: '/challenges', icon: Flag },
  { name: 'Torneos', href: '/tournaments', icon: Medal },
  { name: 'Partidos', href: '/matches', icon: CircleDot },
]

const communityNavigation = [
  { name: 'Comunidad', href: '/community', icon: Users },
  { name: 'Notificaciones', href: '/notifications', icon: Bell },
]

const servicesNavigation = [
  { name: 'Tienda', href: '/tienda', icon: ShoppingBag },
  { name: 'Encordado', href: '/encordado', icon: Wrench },
]

const profileNavigation = [
  { name: 'Mi Perfil', href: '/profile', icon: User },
]

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user as { hasCoachProfile?: boolean; role?: string } | undefined

  const roleNavigation: { name: string; href: string; icon: React.ComponentType<{ className?: string }> }[] = []
  if (user?.hasCoachProfile) {
    roleNavigation.push({ name: 'Coach Dashboard', href: '/coach/dashboard', icon: GraduationCap })
  }
  if (user?.role === 'ADMIN') {
    roleNavigation.push({ name: 'Admin', href: '/admin', icon: Shield })
  }

  if (!open) return null

  const sections = [
    { items: mainNavigation },
    { items: competitionNavigation },
    { items: communityNavigation },
    { items: servicesNavigation },
    ...(roleNavigation.length > 0 ? [{ items: roleNavigation }] : []),
    { items: profileNavigation },
  ]

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SportTech</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-3 py-4 space-y-1 overflow-y-auto flex-1">
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {sectionIdx > 0 && <hr className="border-border my-2" />}
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    (pathname === item.href || pathname.startsWith(item.href + '/'))
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const isNewUser = !session?.user?.hasPlayerProfile

  return (
    <OnboardingProvider isNewUser={isNewUser}>
      {children}
    </OnboardingProvider>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <div className="min-h-screen bg-background">
          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Mobile menu */}
          <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

          {/* Main content */}
          <div className="lg:pl-64">
            <Header onMenuClick={() => setMobileMenuOpen(true)} />
            <main className="p-4 lg:p-6 pb-20 lg:pb-6">
              <OnboardingWrapper>
                {children}
              </OnboardingWrapper>
            </main>
          </div>

          {/* Celebration Overlay */}
          <CelebrationOverlay />

          {/* Bottom Navigation */}
          <BottomNav />
        </div>
      </SessionProvider>
    </QueryClientProvider>
  )
}
