import {
  Video,
  History,
  Dumbbell,
  Target,
  Trophy,
  Swords,
  Flag,
  Medal,
  CircleDot,
  LayoutDashboard,
  Users,
  Bell,
  MapPin,
  ShoppingBag,
  Wrench,
  User,
  GraduationCap,
  Shield,
  BarChart3,
  UserCheck,
  Building2,
  Inbox,
  AlertTriangle,
  CalendarDays,
  FileText,
  Settings,
  Award,
} from 'lucide-react'

export interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  tourId: string
}

// CORE — Always visible, primary actions
export const coreNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, tourId: 'dashboard' },
  { name: 'Nuevo Analisis', href: '/analyze', icon: Video, tourId: 'new-analysis' },
  { name: 'Mis Analisis', href: '/analyses', icon: History, tourId: 'analyses' },
  { name: 'Entrenamiento', href: '/training', icon: Dumbbell, tourId: 'training' },
  { name: 'Objetivos', href: '/goals', icon: Target, tourId: 'goals' },
]

// DISCOVER — Competition and community
export const discoverNavigation: NavItem[] = [
  { name: 'Rankings', href: '/rankings', icon: Trophy, tourId: 'rankings' },
  { name: 'Matchmaking', href: '/matchmaking', icon: Swords, tourId: 'matchmaking' },
  { name: 'Torneos', href: '/tournaments', icon: Medal, tourId: 'tournaments' },
  { name: 'Desafios', href: '/challenges', icon: Flag, tourId: 'challenges' },
  { name: 'Partidos', href: '/matches', icon: CircleDot, tourId: 'matches' },
  { name: 'Comunidad', href: '/community', icon: Users, tourId: 'community' },
  { name: 'Badges', href: '/badges', icon: Award, tourId: 'badges' },
]

// SERVICES — Marketplace and services
export const servicesNavigation: NavItem[] = [
  { name: 'Coaches', href: '/marketplace', icon: GraduationCap, tourId: 'coaches' },
  { name: 'Canchas', href: '/courts', icon: MapPin, tourId: 'courts' },
  { name: 'Tienda', href: '/tienda', icon: ShoppingBag, tourId: 'shop' },
  { name: 'Encordado', href: '/encordado', icon: Wrench, tourId: 'stringing' },
]

// ACCOUNT — Profile and notifications
export const accountNavigation: NavItem[] = [
  { name: 'Notificaciones', href: '/notifications', icon: Bell, tourId: 'notifications' },
  { name: 'Mi Perfil', href: '/profile', icon: User, tourId: 'profile' },
]

export const coachNavigation: NavItem[] = [
  { name: 'Coach Dashboard', href: '/coach/dashboard', icon: GraduationCap, tourId: 'coach-dashboard' },
  { name: 'Mis Alumnos', href: '/coach/students', icon: Users, tourId: 'coach-students' },
  { name: 'Configuracion', href: '/coach/settings', icon: Settings, tourId: 'coach-settings' },
]

export const providerCourtNavigation: NavItem[] = [
  { name: 'Mis Canchas', href: '/provider/courts', icon: MapPin, tourId: 'provider-courts' },
]

export const providerWorkshopNavigation: NavItem[] = [
  { name: 'Mis Talleres', href: '/provider/workshops', icon: Wrench, tourId: 'provider-workshops' },
]

export const adminNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: Shield, tourId: 'admin' },
  { name: 'Usuarios', href: '/admin/users', icon: Users, tourId: 'admin-users' },
  { name: 'Moderacion', href: '/admin/moderation', icon: AlertTriangle, tourId: 'admin-moderation' },
  { name: 'Torneos', href: '/admin/tournaments', icon: Medal, tourId: 'admin-tournaments' },
  { name: 'Partidos', href: '/admin/matches', icon: Swords, tourId: 'admin-matches' },
  { name: 'Analiticas', href: '/admin/analytics', icon: BarChart3, tourId: 'admin-analytics' },
  { name: 'Coaches', href: '/admin/coaches', icon: UserCheck, tourId: 'admin-coaches' },
  { name: 'Proveedores', href: '/admin/providers', icon: Building2, tourId: 'admin-providers' },
  { name: 'Reservas', href: '/admin/bookings', icon: CalendarDays, tourId: 'admin-bookings' },
  { name: 'Notificaciones', href: '/admin/notifications', icon: Bell, tourId: 'admin-notifications' },
  { name: 'Ejercicios', href: '/admin/exercise-templates', icon: Dumbbell, tourId: 'admin-exercises' },
  { name: 'Knowledge Base', href: '/admin/knowledge-base', icon: FileText, tourId: 'admin-kb' },
  { name: 'Tienda', href: '/admin/tienda', icon: ShoppingBag, tourId: 'admin-shop' },
  { name: 'Encordado', href: '/admin/encordado', icon: Wrench, tourId: 'admin-stringing' },
  { name: 'Canchas', href: '/admin/courts', icon: MapPin, tourId: 'admin-courts' },
]

export interface NavSection {
  items: NavItem[]
  label?: string
  collapsible?: boolean
}

interface SessionUser {
  hasPlayerProfile?: boolean
  hasCoachProfile?: boolean
  isProvider?: boolean
  providerTypes?: string[]
  role?: string
}

export function getNavigationSections(user: SessionUser | undefined, sportLabel: string): NavSection[] {
  const sections: NavSection[] = []

  // Core section: primary actions (always visible for players/coaches)
  if (user?.hasPlayerProfile || user?.hasCoachProfile) {
    sections.push({ items: coreNavigation, label: sportLabel })
  } else {
    // Minimal core for users without sport profile
    sections.push({
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, tourId: 'dashboard' },
      ],
    })
  }

  // Discover: competition and community (collapsible)
  sections.push({ items: discoverNavigation, label: 'Descubrir', collapsible: true })

  // Services: marketplace (collapsible)
  sections.push({ items: servicesNavigation, label: 'Servicios', collapsible: true })

  // Coach management
  if (user?.hasCoachProfile) {
    sections.push({ items: [...coachNavigation, { name: 'Solicitudes', href: '/coach/requests', icon: Inbox, tourId: 'coach-requests' }], label: 'Gestion Coach' })
  }

  // Provider management
  if (user?.isProvider) {
    const providerItems: NavItem[] = []
    if (user.providerTypes?.includes('COURT')) {
      providerItems.push(...providerCourtNavigation)
    }
    if (user.providerTypes?.includes('WORKSHOP')) {
      providerItems.push(...providerWorkshopNavigation)
    }
    if (providerItems.length > 0) {
      sections.push({ items: providerItems, label: 'Proveedor' })
    }
  }

  // Admin
  if (user?.role === 'ADMIN') {
    sections.push({ items: adminNavigation, label: 'Administracion', collapsible: true })
  }

  // Account (always last)
  sections.push({ items: accountNavigation })

  return sections
}

export const SPORT_EMOJI: Record<string, string> = {
  tennis: '🎾',
  padel: '🏓',
  pickleball: '🏸',
  futbol: '⚽',
}
