import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('una sola plataforma')
  })

  test('shows both CTA buttons', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /soy jugador/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /soy entrenador/i })).toBeVisible()
  })

  test('navigates to register from player CTA', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /soy jugador/i }).click()
    await expect(page).toHaveURL(/\/register/)
  })

  test('shows pricing section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Gratis')).toBeVisible()
  })

  test('does not mention pickleball as active sport', async ({ page }) => {
    await page.goto('/')
    const heroText = await page.locator('section').first().textContent()
    expect(heroText).not.toContain('pickleball')
  })

  test('FAQ section is interactive', async ({ page }) => {
    await page.goto('/')
    const faqQuestion = page.getByText('Que es SportTek exactamente?')
    if (await faqQuestion.isVisible()) {
      await faqQuestion.click()
      await expect(page.getByText('plataforma integral')).toBeVisible()
    }
  })
})
