import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('homepage loads and shows key content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Lake District Spas/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Lake District Spas');
    await expect(page.getByText('Find the perfect spa for you')).toBeVisible();
  });

  test('spas listing page loads', async ({ page }) => {
    await page.goto('/spas');
    await expect(page).toHaveTitle(/Lake District|Spas|Directory/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('spa detail page loads', async ({ page }) => {
    await page.goto('/spa/lodore-falls-spa');
    await expect(page).toHaveURL(/\/spa\/lodore-falls-spa/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
