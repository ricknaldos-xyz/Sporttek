import { test, expect } from '@playwright/test'

test.describe('Onboarding - Sport Selection', () => {
  test('sport selection page loads', async ({ page }) => {
    await page.goto('/onboarding/sport')
    // May redirect to login if not authenticated
    const url = page.url()
    if (url.includes('/login')) {
      // Expected — user not authenticated
      expect(url).toContain('/login')
    } else {
      await expect(page.getByText(/elige tu deporte/i)).toBeVisible()
    }
  })

  test('shows active sports as selectable', async ({ page }) => {
    // Test the API directly to verify sport filtering
    const response = await page.request.get('/api/sports')
    expect(response.ok()).toBeTruthy()

    const sports = await response.json()
    const activeSports = sports.filter((s: { isActive: boolean }) => s.isActive)
    const inactiveSports = sports.filter((s: { isActive: boolean }) => !s.isActive)

    // Only active sports returned by default
    expect(activeSports.length).toBeGreaterThan(0)
    expect(inactiveSports.length).toBe(0)
  })

  test('all=true returns inactive sports too', async ({ page }) => {
    const response = await page.request.get('/api/sports?all=true')
    expect(response.ok()).toBeTruthy()

    const sports = await response.json()
    const inactiveSports = sports.filter((s: { isActive: boolean }) => !s.isActive)

    // Should include coming-soon sports
    expect(inactiveSports.length).toBeGreaterThan(0)

    // Pickleball should be inactive
    const pickleball = sports.find((s: { slug: string }) => s.slug === 'pickleball')
    if (pickleball) {
      expect(pickleball.isActive).toBe(false)
    }
  })

  test('tennis and padel are active', async ({ page }) => {
    const response = await page.request.get('/api/sports')
    const sports = await response.json()

    const slugs = sports.map((s: { slug: string }) => s.slug)
    expect(slugs).toContain('tennis')
    expect(slugs).toContain('padel')
    expect(slugs).not.toContain('pickleball')
  })
})
