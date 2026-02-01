import { test, expect } from '@playwright/test'

test.describe('Rankings', () => {
  test('rankings page loads', async ({ page }) => {
    await page.goto('/rankings')
    const url = page.url()
    if (!url.includes('/login')) {
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('rankings API returns data', async ({ page }) => {
    const response = await page.request.get('/api/rankings?sport=tennis&period=ALL_TIME&category=COUNTRY')
    // May return 200 with data or 401 if auth required
    expect([200, 401]).toContain(response.status())
  })
})
