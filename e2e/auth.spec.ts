import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('register page loads', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('login page loads', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('register form has required fields', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByLabel(/nombre/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/contraseña|password/i).first()).toBeVisible()
  })

  test('login form has required fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/contraseña|password/i).first()).toBeVisible()
  })

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('invalid@test.com')
    await page.getByLabel(/contraseña|password/i).first().fill('wrongpassword')
    await page.getByRole('button', { name: /iniciar|entrar|login/i }).click()
    await expect(page.getByText(/error|invalido|incorrecto/i)).toBeVisible({ timeout: 10000 })
  })

  test('register with short password shows validation', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel(/nombre/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    const passwordFields = page.getByLabel(/contraseña|password/i)
    await passwordFields.first().fill('123')
    if (await passwordFields.nth(1).isVisible()) {
      await passwordFields.nth(1).fill('123')
    }
    await page.getByRole('button', { name: /registrar|crear/i }).click()
    await expect(page.getByText(/minimo|caracteres|corta/i)).toBeVisible({ timeout: 5000 })
  })
})
