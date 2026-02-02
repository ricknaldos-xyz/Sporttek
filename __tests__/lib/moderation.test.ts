import { describe, it, expect } from 'vitest'
import { containsBannedWords, sanitizeText } from '@/lib/moderation'

describe('containsBannedWords', () => {
  it('returns true for text containing a banned word', () => {
    expect(containsBannedWords('eres un idiota')).toBe(true)
  })

  it('returns false for clean text', () => {
    expect(containsBannedWords('buen partido hoy')).toBe(false)
  })

  it('is case-insensitive', () => {
    expect(containsBannedWords('IDIOTA total')).toBe(true)
    expect(containsBannedWords('Pendejo')).toBe(true)
  })

  it('returns false for empty string', () => {
    expect(containsBannedWords('')).toBe(false)
  })

  it('detects word embedded in longer text', () => {
    expect(containsBannedWords('queconchatumadrees')).toBe(true)
  })
})

describe('sanitizeText', () => {
  it('replaces a banned word with asterisks of the same length', () => {
    const result = sanitizeText('eres idiota')
    expect(result).toBe('eres ******')
  })

  it('replaces multiple banned words', () => {
    const result = sanitizeText('idiota y pendejo')
    expect(result).toContain('******')
    expect(result).toContain('*******')
    expect(result).not.toContain('idiota')
    expect(result).not.toContain('pendejo')
  })

  it('is case-insensitive in replacement', () => {
    const result = sanitizeText('IDIOTA')
    expect(result).toBe('******')
  })

  it('returns clean text unchanged', () => {
    const text = 'buen partido hoy'
    expect(sanitizeText(text)).toBe(text)
  })

  it('returns empty string unchanged', () => {
    expect(sanitizeText('')).toBe('')
  })
})
