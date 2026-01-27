import { prisma } from '@/lib/prisma'

export async function isBlocked(profileId1: string, profileId2: string): Promise<boolean> {
  const block = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: profileId1, blockedId: profileId2 },
        { blockerId: profileId2, blockedId: profileId1 },
      ]
    }
  })
  return !!block
}

export async function getBlockedProfileIds(profileId: string): Promise<string[]> {
  const blocks = await prisma.block.findMany({
    where: {
      OR: [
        { blockerId: profileId },
        { blockedId: profileId },
      ]
    },
    select: { blockerId: true, blockedId: true }
  })

  const ids = new Set<string>()
  for (const block of blocks) {
    if (block.blockerId !== profileId) ids.add(block.blockerId)
    if (block.blockedId !== profileId) ids.add(block.blockedId)
  }
  return Array.from(ids)
}
