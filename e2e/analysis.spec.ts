import { test, expect } from '@playwright/test'

test.describe('Analysis', () => {
  test('analyze page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/analyze')
    await page.waitForURL(/\/login/, { timeout: 10000 })
    expect(page.url()).toContain('/login')
  })

  test('analyses list redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/analyses')
    await page.waitForURL(/\/login/, { timeout: 10000 })
    expect(page.url()).toContain('/login')
  })
})
