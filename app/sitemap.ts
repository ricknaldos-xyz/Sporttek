import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sporttek.xyz'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/rankings`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/tienda`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/encordado`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/tournaments`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/courts`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
  ]

  // Dynamic: public tournaments
  let tournamentPages: MetadataRoute.Sitemap = []
  try {
    const tournaments = await prisma.tournament.findMany({
      where: { status: { in: ['REGISTRATION', 'IN_PROGRESS', 'COMPLETED'] } },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    })
    tournamentPages = tournaments.map((t) => ({
      url: `${baseUrl}/tournaments/${t.id}`,
      lastModified: t.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  } catch {
    // DB may not be available during build
  }

  // Dynamic: coach profiles
  let coachPages: MetadataRoute.Sitemap = []
  try {
    const coaches = await prisma.coachProfile.findMany({
      where: { verificationStatus: 'VERIFIED' },
      select: { userId: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    })
    coachPages = coaches.map((c) => ({
      url: `${baseUrl}/marketplace/${c.userId}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  } catch {
    // DB may not be available during build
  }

  return [...staticPages, ...tournamentPages, ...coachPages]
}
