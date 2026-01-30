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
} from 'lucide-react'

export interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  tourId: string
}

export const sportNavigation: NavItem[] = [
  { name: 'Nuevo Analisis', href: '/analyze', icon: Video, tourId: 'new-analysis' },
  { name: 'Mis Analisis', href: '/analyses', icon: History, tourId: 'analyses' },
  { name: 'Entrenamiento', href: '/training', icon: Dumbbell, tourId: 'training' },
  { name: 'Objetivos', href: '/goals', icon: Target, tourId: 'goals' },
]

export const competitionNavigation: NavItem[] = [
  { name: 'Rankings', href: '/rankings', icon: Trophy, tourId: 'rankings' },
  { name: 'Matchmaking', href: '/matchmaking', icon: Swords, tourId: 'matchmaking' },
  { name: 'Desafios', href: '/challenges', icon: Flag, tourId: 'challenges' },
  { name: 'Torneos', href: '/tournaments', icon: Medal, tourId: 'tournaments' },
  { name: 'Partidos', href: '/matches', icon: CircleDot, tourId: 'matches' },
]

export const globalNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, tourId: 'dashboard' },
  { name: 'Comunidad', href: '/community', icon: Users, tourId: 'community' },
  { name: 'Notificaciones', href: '/notifications', icon: Bell, tourId: 'notifications' },
  { name: 'Canchas', href: '/courts', icon: MapPin, tourId: 'courts' },
  { name: 'Tienda', href: '/tienda', icon: ShoppingBag, tourId: 'shop' },
  { name: 'Encordado', href: '/encordado', icon: Wrench, tourId: 'stringing' },
]

export const profileNavigation: NavItem[] = [
  { name: 'Mi Perfil', href: '/profile', icon: User, tourId: 'profile' },
]

export const SPORT_EMOJI: Record<string, string> = {
  tennis: '🎾',
  padel: '🏓',
  pickleball: '🏸',
  futbol: '⚽',
}
