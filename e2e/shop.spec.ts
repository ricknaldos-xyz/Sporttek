import { test, expect } from '@playwright/test'

test.describe('Shop - Tienda', () => {
  test('shop page loads and shows products', async ({ page }) => {
    await page.goto('/tienda')
    await expect(page.locator('h1')).toBeVisible()
    // Should have at least one product link or empty state
    const productLinks = page.locator('a[href*="/tienda/"]')
    const emptyState = page.getByText(/no hay productos/i)
    const hasProducts = (await productLinks.count()) > 0
    const hasEmpty = await emptyState.isVisible().catch(() => false)
    expect(hasProducts || hasEmpty).toBeTruthy()
  })

  test('shop has search bar', async ({ page }) => {
    await page.goto('/tienda')
    await expect(page.getByPlaceholder(/buscar/i)).toBeVisible()
  })

  test('product detail page loads from shop', async ({ page }) => {
    await page.goto('/tienda')
    const firstProduct = page.locator('a[href*="/tienda/"]').first()
    if (await firstProduct.isVisible().catch(() => false)) {
      const href = await firstProduct.getAttribute('href')
      expect(href).toBeTruthy()
      await firstProduct.click()
      await expect(page.locator('h1')).toBeVisible()
      // Should show price or add to cart button
      const hasPrice = await page.getByText(/S\//).first().isVisible().catch(() => false)
      const hasButton = await page.getByRole('button', { name: /agregar al carrito/i }).isVisible().catch(() => false)
      expect(hasPrice || hasButton).toBeTruthy()
    }
  })

  test('cart page loads', async ({ page }) => {
    await page.goto('/tienda/carrito')
    // May redirect to login or show empty cart
    const url = page.url()
    if (url.includes('/login')) {
      expect(url).toContain('/login')
    } else {
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('shop API returns products', async ({ page }) => {
    const response = await page.request.get('/api/shop/products')
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data).toHaveProperty('products')
    expect(Array.isArray(data.products)).toBe(true)
  })
})
