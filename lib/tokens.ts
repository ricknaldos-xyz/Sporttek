import { randomBytes } from 'crypto'
import { prisma } from './prisma'
import { TokenType } from '@prisma/client'

const TOKEN_EXPIRY = {
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hour
  EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
}

export async function generateToken(
  userId: string,
  type: TokenType
): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY[type])

  // Invalidate any existing tokens of the same type for this user
  await prisma.verificationToken.updateMany({
    where: {
      userId,
      type,
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  })

  // Create new token
  await prisma.verificationToken.create({
    data: {
      token,
      type,
      userId,
      expiresAt,
    },
  })

  return token
}

export async function verifyToken(
  token: string,
  type: TokenType
): Promise<{ valid: boolean; userId?: string; error?: string }> {
  const tokenRecord = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!tokenRecord) {
    return { valid: false, error: 'Token no encontrado' }
  }

  if (tokenRecord.type !== type) {
    return { valid: false, error: 'Tipo de token invalido' }
  }

  if (tokenRecord.usedAt) {
    return { valid: false, error: 'Este enlace ya ha sido utilizado' }
  }

  if (tokenRecord.expiresAt < new Date()) {
    return { valid: false, error: 'Este enlace ha expirado' }
  }

  return { valid: true, userId: tokenRecord.userId }
}

export async function markTokenAsUsed(token: string): Promise<void> {
  await prisma.verificationToken.update({
    where: { token },
    data: { usedAt: new Date() },
  })
}

export async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.verificationToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { usedAt: { not: null } },
      ],
    },
  })

  return result.count
}
