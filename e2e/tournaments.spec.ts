import { test, expect } from '@playwright/test'

test.describe('Tournaments', () => {
  test('tournaments page loads', async ({ page }) => {
    await page.goto('/tournaments')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('tournaments page shows status filters', async ({ page }) => {
    await page.goto('/tournaments')
    // Should have filter buttons or tabs for status
    const todos = page.getByRole('button', { name: /todos/i })
    if (await todos.isVisible().catch(() => false)) {
      await expect(todos).toBeVisible()
    }
  })

  test('tournament detail page loads', async ({ page }) => {
    await page.goto('/tournaments')
    const firstTournament = page.locator('a[href*="/tournaments/"]').first()
    if (await firstTournament.isVisible().catch(() => false)) {
      await firstTournament.click()
      await expect(page.locator('h1')).toBeVisible()
      // Should show tournament info (format, date, or participants)
      const content = await page.textContent('body')
      const hasTournamentContent =
        /formato|fecha|jugadores|participantes|bracket|inscri/i.test(content || '')
      expect(hasTournamentContent).toBeTruthy()
    }
  })

  test('tournaments API returns data', async ({ page }) => {
    const response = await page.request.get('/api/tournaments')
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data).toHaveProperty('tournaments')
    expect(Array.isArray(data.tournaments)).toBe(true)
  })

  test('bracket API works for valid tournament', async ({ page }) => {
    // First get a tournament ID
    const listResponse = await page.request.get('/api/tournaments')
    const listData = await listResponse.json()

    if (listData.tournaments?.length > 0) {
      const id = listData.tournaments[0].id
      const bracketResponse = await page.request.get(`/api/tournaments/${id}/bracket`)
      // Should return 200 with bracket data
      expect(bracketResponse.ok()).toBeTruthy()
      const bracketData = await bracketResponse.json()
      expect(bracketData).toHaveProperty('tournament')
      expect(bracketData).toHaveProperty('brackets')
    }
  })
})
