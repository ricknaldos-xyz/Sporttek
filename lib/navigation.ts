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

type TranslationFn = (key: string) => string

// Default fallback translator (returns Spanish strings)
const defaultT: TranslationFn = (key: string) => {
  const defaults: Record<string, string> = {
    dashboard: 'Dashboard', newAnalysis: 'Nuevo Analisis', myAnalyses: 'Mis Analisis',
    training: 'Entrenamiento', goals: 'Objetivos', rankings: 'Rankings',
    matchmaking: 'Matchmaking', tournaments: 'Torneos', challenges: 'Desafios',
    matches: 'Partidos', community: 'Comunidad', badges: 'Badges',
    coaches: 'Coaches', courts: 'Canchas', shop: 'Tienda', stringing: 'Encordado',
    notifications: 'Notificaciones', profile: 'Mi Perfil',
    coachDashboard: 'Coach Dashboard', myStudents: 'Mis Alumnos', settings: 'Configuracion',
    requests: 'Solicitudes', myCourts: 'Mis Canchas', myWorkshops: 'Mis Talleres',
    discover: 'Descubrir', services: 'Servicios', coachManagement: 'Gestion Coach',
    provider: 'Proveedor', admin: 'Administracion',
  }
  return defaults[key] || key
}

// CORE — Always visible, primary actions
export function getCoreNavigation(t: TranslationFn = defaultT): NavItem[] {
  return [
    { name: t('dashboard'), href: '/dashboard', icon: LayoutDashboard, tourId: 'dashboard' },
    { name: t('newAnalysis'), href: '/analyze', icon: Video, tourId: 'new-analysis' },
    { name: t('myAnalyses'), href: '/analyses', icon: History, tourId: 'analyses' },
    { name: t('training'), href: '/training', icon: Dumbbell, tourId: 'training' },
    { name: t('goals'), href: '/goals', icon: Target, tourId: 'goals' },
  ]
}

// DISCOVER — Competition and community
export function getDiscoverNavigation(t: TranslationFn = defaultT): NavItem[] {
  return [
    { name: t('rankings'), href: '/rankings', icon: Trophy, tourId: 'rankings' },
    { name: t('matchmaking'), href: '/matchmaking', icon: Swords, tourId: 'matchmaking' },
    { name: t('tournaments'), href: '/tournaments', icon: Medal, tourId: 'tournaments' },
    { name: t('challenges'), href: '/challenges', icon: Flag, tourId: 'challenges' },
    { name: t('matches'), href: '/matches', icon: CircleDot, tourId: 'matches' },
    { name: t('community'), href: '/community', icon: Users, tourId: 'community' },
    { name: t('badges'), href: '/badges', icon: Award, tourId: 'badges' },
  ]
}

// SERVICES — Marketplace and services
export function getServicesNavigation(t: TranslationFn = defaultT): NavItem[] {
  return [
    { name: t('coaches'), href: '/marketplace', icon: GraduationCap, tourId: 'coaches' },
    { name: t('courts'), href: '/courts', icon: MapPin, tourId: 'courts' },
    { name: t('shop'), href: '/tienda', icon: ShoppingBag, tourId: 'shop' },
    { name: t('stringing'), href: '/encordado', icon: Wrench, tourId: 'stringing' },
  ]
}

// ACCOUNT — Profile and notifications
export function getAccountNavigation(t: TranslationFn = defaultT): NavItem[] {
  return [
    { name: t('notifications'), href: '/notifications', icon: Bell, tourId: 'notifications' },
    { name: t('profile'), href: '/profile', icon: User, tourId: 'profile' },
  ]
}

export function getCoachNavigation(t: TranslationFn = defaultT): NavItem[] {
  return [
    { name: t('coachDashboard'), href: '/coach/dashboard', icon: GraduationCap, tourId: 'coach-dashboard' },
    { name: t('myStudents'), href: '/coach/students', icon: Users, tourId: 'coach-students' },
    { name: t('settings'), href: '/coach/settings', icon: Settings, tourId: 'coach-settings' },
  ]
}

export function getProviderCourtNavigation(t: TranslationFn = defaultT): NavItem[] {
  return [
    { name: t('myCourts'), href: '/provider/courts', icon: MapPin, tourId: 'provider-courts' },
  ]
}

export function getProviderWorkshopNavigation(t: TranslationFn = defaultT): NavItem[] {
  return [
    { name: t('myWorkshops'), href: '/provider/workshops', icon: Wrench, tourId: 'provider-workshops' },
  ]
}

// Admin navigation stays in Spanish (admin-only, not translated)
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

// Keep old exports for backward compatibility
export const coreNavigation = getCoreNavigation()
export const discoverNavigation = getDiscoverNavigation()
export const servicesNavigation = getServicesNavigation()
export const accountNavigation = getAccountNavigation()
export const coachNavigation = getCoachNavigation()
export const providerCourtNavigation = getProviderCourtNavigation()
export const providerWorkshopNavigation = getProviderWorkshopNavigation()

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

export function getNavigationSections(user: SessionUser | undefined, sportLabel: string, t?: TranslationFn): NavSection[] {
  const sections: NavSection[] = []

  const core = t ? getCoreNavigation(t) : coreNavigation
  const discover = t ? getDiscoverNavigation(t) : discoverNavigation
  const services = t ? getServicesNavigation(t) : servicesNavigation
  const coach = t ? getCoachNavigation(t) : coachNavigation
  const account = t ? getAccountNavigation(t) : accountNavigation
  const provCourts = t ? getProviderCourtNavigation(t) : providerCourtNavigation
  const provWorkshops = t ? getProviderWorkshopNavigation(t) : providerWorkshopNavigation

  // Core section: primary actions (always visible for players/coaches)
  if (user?.hasPlayerProfile || user?.hasCoachProfile) {
    sections.push({ items: core, label: sportLabel })
  } else {
    // Minimal core for users without sport profile
    sections.push({
      items: [
        { name: t ? t('dashboard') : 'Dashboard', href: '/dashboard', icon: LayoutDashboard, tourId: 'dashboard' },
      ],
    })
  }

  // Discover: competition and community (collapsible)
  sections.push({ items: discover, label: t ? t('discover') : 'Descubrir', collapsible: true })

  // Services: marketplace (collapsible)
  sections.push({ items: services, label: t ? t('services') : 'Servicios', collapsible: true })

  // Coach management
  if (user?.hasCoachProfile) {
    sections.push({
      items: [...coach, { name: t ? t('requests') : 'Solicitudes', href: '/coach/requests', icon: Inbox, tourId: 'coach-requests' }],
      label: t ? t('coachManagement') : 'Gestion Coach',
    })
  }

  // Provider management
  if (user?.isProvider) {
    const providerItems: NavItem[] = []
    if (user.providerTypes?.includes('COURT')) {
      providerItems.push(...provCourts)
    }
    if (user.providerTypes?.includes('WORKSHOP')) {
      providerItems.push(...provWorkshops)
    }
    if (providerItems.length > 0) {
      sections.push({ items: providerItems, label: t ? t('provider') : 'Proveedor' })
    }
  }

  // Admin
  if (user?.role === 'ADMIN') {
    sections.push({ items: adminNavigation, label: t ? t('admin') : 'Administracion', collapsible: true })
  }

  // Account (always last)
  sections.push({ items: account })

  return sections
}

export const SPORT_EMOJI: Record<string, string> = {
  tennis: '🎾',
  padel: '🏓',
  pickleball: '🏸',
  futbol: '⚽',
}
