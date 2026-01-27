import { describe, it, expect } from 'vitest'
import { normalizeEmail, validatePassword } from '@/lib/validation'

describe('normalizeEmail', () => {
  it('lowercases the email', () => {
    expect(normalizeEmail('User@Example.COM')).toBe('user@example.com')
  })

  it('trims whitespace', () => {
    expect(normalizeEmail('  user@example.com  ')).toBe('user@example.com')
  })

  it('handles already normalized email', () => {
    expect(normalizeEmail('user@example.com')).toBe('user@example.com')
  })

  it('handles mixed case and whitespace', () => {
    expect(normalizeEmail(' Test@Gmail.Com ')).toBe('test@gmail.com')
  })
})

describe('validatePassword', () => {
  it('returns null for valid password (8+ characters)', () => {
    expect(validatePassword('12345678')).toBeNull()
    expect(validatePassword('a very long password')).toBeNull()
  })

  it('returns error message for short password', () => {
    expect(validatePassword('1234567')).toBe('La contrasena debe tener al menos 8 caracteres')
    expect(validatePassword('')).toBe('La contrasena debe tener al menos 8 caracteres')
    expect(validatePassword('abc')).toBe('La contrasena debe tener al menos 8 caracteres')
  })

  it('exactly 8 characters is valid', () => {
    expect(validatePassword('abcdefgh')).toBeNull()
  })
})
