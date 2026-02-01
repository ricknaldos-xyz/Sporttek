import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

// Map sport/technique to relevant product categories
function getRelevantCategories(sportName: string, techniqueName: string): string[] {
  const lower = techniqueName.toLowerCase()
  const categories: string[] = []

  // Racket-related techniques suggest rackets and strings
  if (lower.includes('golpe') || lower.includes('drive') || lower.includes('reves') || lower.includes('saque') || lower.includes('volea') || lower.includes('smash')) {
    categories.push('RACKETS', 'STRINGS', 'GRIPS')
  }

  // Footwork/movement techniques suggest shoes
  if (lower.includes('movimiento') || lower.includes('pie') || lower.includes('desplazamiento')) {
    categories.push('SHOES')
  }

  // Default: show accessories and featured items
  if (categories.length === 0) {
    categories.push('RACKETS', 'ACCESSORIES')
  }

  return categories
}

interface ShopRecommendationsProps {
  sportName: string
  techniqueName: string
}

export async function ShopRecommendations({ sportName, techniqueName }: ShopRecommendationsProps) {
  const categories = getRelevantCategories(sportName, techniqueName)

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { in: categories as never[] },
      stock: { gt: 0 },
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: 3,
    select: {
      slug: true,
      name: true,
      brand: true,
      priceCents: true,
      comparePriceCents: true,
      thumbnailUrl: true,
    },
  })

  if (products.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Equipamiento recomendado</h2>
        </div>
        <GlassButton variant="ghost" size="sm" asChild>
          <Link href="/tienda">Ver tienda</Link>
        </GlassButton>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {products.map((product) => (
          <GlassCard key={product.slug} intensity="ultralight" padding="sm" hover="lift" asChild>
            <Link href={`/tienda/${product.slug}`}>
              {product.thumbnailUrl && (
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.thumbnailUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">{product.brand}</p>
              <p className="text-sm font-medium truncate">{product.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold">
                  S/ {(product.priceCents / 100).toFixed(2)}
                </span>
                {product.comparePriceCents && (
                  <span className="text-xs text-muted-foreground line-through">
                    S/ {(product.comparePriceCents / 100).toFixed(2)}
                  </span>
                )}
              </div>
            </Link>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
