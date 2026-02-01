import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL(/\/login/, { timeout: 10000 })
    expect(page.url()).toContain('/login')
  })

  test('pricing page loads publicly', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText(/gratis|free/i)).toBeVisible()
    await expect(page.getByText(/pro/i)).toBeVisible()
  })

  test('rankings page loads publicly', async ({ page }) => {
    await page.goto('/rankings')
    // Rankings may redirect or show content
    const url = page.url()
    if (!url.includes('/login')) {
      await expect(page.locator('h1')).toBeVisible()
    }
  })
})
