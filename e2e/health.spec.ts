import { test, expect } from '@playwright/test'

test.describe('Health Check', () => {
  test('health endpoint returns status', async ({ page }) => {
    const response = await page.request.get('/api/health')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data.status).toBeDefined()
    expect(data.timestamp).toBeDefined()
    expect(data.checks).toBeDefined()
    expect(data.checks.database).toBe('ok')
    expect(data.checks.env).toBe('ok')
  })
})
