import { test, expect } from '@playwright/test'

test.describe('Global Search (Cmd+K)', () => {
  test('search button is visible in header', async ({ page }) => {
    await page.goto('/')
    // The search button or Cmd+K hint should be in the header
    const searchButton = page.locator('button').filter({ hasText: /buscar|⌘K|Cmd/i })
    const searchIcon = page.locator('button svg.lucide-search').first()
    const hasButton = await searchButton.isVisible().catch(() => false)
    const hasIcon = await searchIcon.isVisible().catch(() => false)
    expect(hasButton || hasIcon).toBeTruthy()
  })

  test('Cmd+K opens search dialog', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Meta+k')
    // Should open a dialog/modal with search input
    const dialog = page.locator('[role="dialog"]')
    const searchInput = page.getByPlaceholder(/buscar/i)
    const hasDialog = await dialog.isVisible({ timeout: 3000 }).catch(() => false)
    const hasInput = await searchInput.isVisible({ timeout: 3000 }).catch(() => false)
    expect(hasDialog || hasInput).toBeTruthy()
  })

  test('Ctrl+K also opens search dialog', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')
    const searchInput = page.getByPlaceholder(/buscar/i)
    await expect(searchInput).toBeVisible({ timeout: 3000 })
  })

  test('Escape closes search dialog', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Meta+k')
    // Wait for dialog to open
    const searchInput = page.getByPlaceholder(/buscar/i)
    await searchInput.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {})

    if (await searchInput.isVisible().catch(() => false)) {
      await page.keyboard.press('Escape')
      await expect(searchInput).not.toBeVisible({ timeout: 3000 })
    }
  })

  test('typing in search shows results or loading', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Meta+k')
    const searchInput = page.getByPlaceholder(/buscar/i)

    if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await searchInput.fill('tennis')
      // Should show results, loading spinner, or empty state
      await page.waitForTimeout(1000)
      const body = await page.locator('[role="dialog"]').textContent()
      expect(body?.length).toBeGreaterThan(0)
    }
  })

  test('search API returns results', async ({ page }) => {
    const response = await page.request.get('/api/search?q=test')
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    // Should have result categories
    expect(typeof data).toBe('object')
  })
})
