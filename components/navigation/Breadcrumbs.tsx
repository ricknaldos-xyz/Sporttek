'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  showHome?: boolean
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  analyze: 'Nuevo Analisis',
  analyses: 'Mis Analisis',
  training: 'Entrenamiento',
  profile: 'Perfil',
  settings: 'Configuracion',
  pricing: 'Precios',
  generate: 'Generar Plan',
}

export function Breadcrumbs({ items, showHome = true }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbs: BreadcrumbItem[] = items || []

  if (!items && pathname) {
    const segments = pathname.split('/').filter(Boolean)
    let currentPath = ''

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // Skip dynamic segments (like [id])
      if (segment.startsWith('[') && segment.endsWith(']')) {
        return
      }

      // Check if segment is a UUID (skip it but show parent label)
      const isUuid = /^[0-9a-f-]{36}$/i.test(segment)
      if (isUuid) {
        return
      }

      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

      breadcrumbs.push({
        label,
        href: currentPath,
      })
    })
  }

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-4">
      {showHome && (
        <>
          <Link
            href="/dashboard"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbs.length > 0 && (
            <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
          )}
        </>
      )}

      {breadcrumbs.map((item, index) => (
        <Fragment key={item.href}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium truncate">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors truncate"
            >
              {item.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
