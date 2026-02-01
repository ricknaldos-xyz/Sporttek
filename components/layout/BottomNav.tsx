'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Trophy, Bell, Video, User } from 'lucide-react'

const tabs = [
  { name: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Rankings', href: '/rankings', icon: Trophy },
  { name: 'Analizar', href: '/analyze', icon: Video, primary: true },
  { name: 'Avisos', href: '/notifications', icon: Bell },
  { name: 'Perfil', href: '/profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function fetchUnreadCount() {
      try {
        const res = await fetch('/api/notifications?limit=1')
        if (res.ok) {
          const data = await res.json()
          setUnreadCount(data.unreadCount ?? 0)
        }
      } catch {
        // silently fail
      }
    }
    fetchUnreadCount()
  }, [pathname])

  return (
    <nav aria-label="Navegacion rapida" className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-medium border-t border-glass pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
          return (
            <Link
              key={tab.name}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 w-full h-full text-[11px] font-medium transition-colors',
                tab.primary && !isActive
                  ? 'text-primary'
                  : isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <span className="relative">
                {tab.primary ? (
                  <span className={cn(
                    'flex items-center justify-center w-10 h-10 -mt-4 rounded-full shadow-glass',
                    isActive ? 'glass-primary border-glass shadow-glass-glow' : 'glass-primary border-glass'
                  )}>
                    <tab.icon className="h-5 w-5 text-primary" />
                  </span>
                ) : (
                  <tab.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                )}
                {tab.href === '/notifications' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </span>
              <span className={tab.primary ? '-mt-1' : ''}>{tab.name}</span>
              {isActive && <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
