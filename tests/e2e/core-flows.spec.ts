import { test, expect } from '@playwright/test';

// N/A pathways (confirmed absent after codebase review):
// - Forms: no form submissions exist in this app (partnership link goes offsite)
// - Authentication: no login or admin flows exist

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // --- SEO ---

  test('page title contains "Lake District Spas"', async ({ page }) => {
    await expect(page).toHaveTitle(/Lake District Spas/i);
  });

  test('has meta description', async ({ page }) => {
    const meta = page.locator('meta[name="description"]');
    await expect(meta).toHaveCount(1);
    const content = await meta.getAttribute('content');
    expect(content?.length).toBeGreaterThan(50);
  });

  test('has Open Graph title and image', async ({ page }) => {
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  });

  test('has Organization JSON-LD schema', async ({ page }) => {
    const schemaScript = page.locator('script[type="application/ld+json"]');
    await expect(schemaScript).toHaveCount(1);
    const content = await schemaScript.textContent();
    const schema = JSON.parse(content!);
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('Lake District Spas');
  });

  // --- Hero ---

  test('hero renders H1, subtitles, and CTA link', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: 'Lake District Spas' }),
    ).toBeVisible();
    await expect(page.getByText('Find the perfect spa for you')).toBeVisible();
    await expect(
      page.getByText('Compare spa facilities and access policies'),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /see all spas/i }).first(),
    ).toBeVisible();
  });

  test('hero CTA navigates to /spas', async ({ page }) => {
    // Use .first() — both hero and featured grid have "See all spas" links
    await page.getByRole('link', { name: /see all spas/i }).first().click();
    await expect(page).toHaveURL('/spas');
  });

  // --- Featured Spas ---

  test('featured spas section shows heading and 6 spa cards', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: 'Explore the Collection' }),
    ).toBeVisible();
    // article nested inside /spa/ link = SpaCard structure only.
    // DayPassCard puts the /spa/ link *inside* the article, so it won't be counted here.
    const spaCards = page.locator('a[href^="/spa/"] article');
    await expect(spaCards).toHaveCount(6);
  });

  // --- Blog section ---

  test('blog section shows heading and article links', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Latest Spa Guides' }),
    ).toBeVisible();
    // /blog/:slug links (not /blog itself) confirm posts are rendered
    await expect(page.locator('a[href^="/blog/"]').first()).toBeVisible();
  });

  test('"View All Articles" link points to /blog', async ({ page }) => {
    const link = page.getByRole('link', { name: /view all articles/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/blog');
  });

  // --- Featured Locations ---

  test('locations section shows heading and 3 location cards', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: 'Featured Spa Locations' }),
    ).toBeVisible();
    // Scope to the section to avoid matching nav/footer location links
    const locationsSection = page
      .locator('section')
      .filter({ has: page.getByRole('heading', { name: 'Featured Spa Locations' }) });
    await expect(locationsSection.locator('a[href^="/location/spas-in-"]')).toHaveCount(3);
  });

  test('"View All Locations" link points to /locations', async ({ page }) => {
    const link = page.getByRole('link', { name: /view all locations/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/locations');
  });

  // --- Day Passes section ---

  test('day passes section shows heading and CTA', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Spa Day Experiences' }),
    ).toBeVisible();
    const cta = page.getByRole('link', { name: /see all day passes/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/spa-days');
  });
});
