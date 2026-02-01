'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { logger } from '@/lib/logger'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { OrderStatusBadge } from '@/components/shop/OrderStatusBadge'
import { ClipboardList, Loader2, Package, ChevronLeft, ChevronRight } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  status: string
  totalCents: number
  createdAt: string
  items: {
    id: string
    quantity: number
    productName: string
    product: {
      name: string
      thumbnailUrl: string | null
    }
  }[]
}

const STATUS_TABS = [
  { value: '', label: 'Todos' },
  { value: 'PAID', label: 'Pagados' },
  { value: 'PROCESSING', label: 'En proceso' },
  { value: 'SHIPPED', label: 'Enviados' },
  { value: 'DELIVERED', label: 'Entregados' },
  { value: 'CANCELLED', label: 'Cancelados' },
]

function formatPrice(cents: number): string {
  return `S/ ${(cents / 100).toFixed(2)}`
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchOrders = useCallback(async (signal?: AbortSignal) => {
    setError(null)
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      })
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`/api/shop/orders?${params}`, { signal })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders)
        setTotalPages(data.totalPages || 1)
      } else {
        setError('No se pudo cargar los datos')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      logger.error('Failed to fetch orders')
      setError('No se pudo cargar los datos')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, page])

  useEffect(() => {
    const controller = new AbortController()
    fetchOrders(controller.signal)
    return () => controller.abort()
  }, [fetchOrders])

  function handleStatusChange(value: string) {
    setStatusFilter(value)
    setPage(1)
  }

  if (error && !loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Mis pedidos</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <GlassButton variant="outline" onClick={() => { setError(null); fetchOrders() }}>
            Reintentar
          </GlassButton>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ClipboardList className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">Mis pedidos</h1>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <GlassButton
            key={tab.value}
            variant={statusFilter === tab.value ? 'solid' : 'ghost'}
            size="sm"
            onClick={() => handleStatusChange(tab.value)}
          >
            {tab.label}
          </GlassButton>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : orders.length === 0 ? (
        <GlassCard intensity="light" padding="xl">
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg font-medium mb-2">
              {statusFilter ? 'No hay pedidos con este estado' : 'No tienes pedidos aun'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {statusFilter
                ? 'Prueba con otro filtro o revisa todos tus pedidos'
                : 'Cuando realices una compra, tus pedidos apareceran aqui'}
            </p>
            {!statusFilter && (
              <Link href="/tienda">
                <GlassButton variant="solid" size="sm">
                  Ir a la tienda
                </GlassButton>
              </Link>
            )}
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

            return (
              <Link key={order.id} href={`/tienda/pedidos/${order.id}`}>
                <GlassCard intensity="light" padding="md" hover="lift">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-sm">
                          {order.orderNumber}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('es-PE', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">{formatPrice(order.totalCents)}</p>
                    </div>
                  </div>

                  {/* Product thumbnails */}
                  <div className="flex gap-2 mt-3">
                    {order.items.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="relative h-10 w-10 rounded-lg bg-secondary/50 overflow-hidden flex-shrink-0 flex items-center justify-center"
                      >
                        {item.product.thumbnailUrl ? (
                          <Image
                            src={item.product.thumbnailUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <Package className="h-4 w-4 text-muted-foreground/40" />
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-muted-foreground">
                          +{order.items.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <GlassButton
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </GlassButton>
          <span className="text-sm text-muted-foreground">
            Pagina {page} de {totalPages}
          </span>
          <GlassButton
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </GlassButton>
        </div>
      )}
    </div>
  )
}
