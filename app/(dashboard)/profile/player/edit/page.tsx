import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Editar Perfil de Jugador | SportTek',
  description: 'Actualiza la informacion de tu perfil de jugador en SportTek.',
}
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileSetupForm } from '@/components/player/ProfileSetupForm'

export default async function EditPlayerProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const profile = await prisma.playerProfile.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="max-w-2xl mx-auto">
      <ProfileSetupForm
        initialData={profile ? {
          displayName: profile.displayName,
          region: profile.region,
          city: profile.city,
          playStyle: profile.playStyle,
          dominantHand: profile.dominantHand,
          backhandType: profile.backhandType,
          yearsPlaying: profile.yearsPlaying,
          ageGroup: profile.ageGroup,
          latitude: profile.latitude,
          longitude: profile.longitude,
        } : undefined}
        isEdit={!!profile}
      />
    </div>
  )
}
