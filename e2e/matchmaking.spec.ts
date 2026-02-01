import { test, expect } from '@playwright/test'

test.describe('Matchmaking', () => {
  test('matchmaking page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/matchmaking')
    await page.waitForURL(/\/login/, { timeout: 10000 })
    expect(page.url()).toContain('/login')
  })

  test('matchmaking discover API requires auth', async ({ page }) => {
    const response = await page.request.get('/api/matchmaking/discover?sport=tennis')
    expect(response.status()).toBe(401)
  })
})
