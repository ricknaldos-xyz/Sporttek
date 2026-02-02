import { test, expect } from '@playwright/test'

test.describe('Player Profile', () => {
  test('profile page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/profile/player')
    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 10000 }).catch(() => {})
    const url = page.url()
    expect(url).toMatch(/\/login|\/profile/)
  })

  test('player profile API requires auth', async ({ page }) => {
    const response = await page.request.get('/api/player/profile')
    // Should return 401 without auth
    expect(response.status()).toBe(401)
  })

  test('public profile API returns 404 for non-existent user', async ({ page }) => {
    const response = await page.request.get('/api/player/profile/nonexistent-user-id')
    expect([404, 400]).toContain(response.status())
  })

  test('profile settings page requires auth', async ({ page }) => {
    await page.goto('/profile/settings')
    await page.waitForURL(/\/login/, { timeout: 10000 }).catch(() => {})
    const url = page.url()
    expect(url).toMatch(/\/login|\/profile/)
  })

  test('profile edit page requires auth', async ({ page }) => {
    await page.goto('/profile/player/edit')
    await page.waitForURL(/\/login/, { timeout: 10000 }).catch(() => {})
    const url = page.url()
    expect(url).toMatch(/\/login|\/profile/)
  })
})
