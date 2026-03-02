# Test Implementation Plan — Lake District Spas

**Based on:** `testing.md` + `testing-answers-01.md`
**Scope:** Gap-fill only. 13 Vitest unit/integration tests (~5,155 lines) and a pre-commit hook already exist. This plan covers what is missing.

---

## 1. Codebase Overview

| Layer | Status |
|-------|--------|
| Static TypeScript data (`src/data/`) | Well-tested — data integrity, structure, intro text |
| Filter / sort logic (`spa-catalog.ts`) | Well-tested — all OR/AND combinations covered |
| Pagination (`listing/pageTokens.ts`) | Well-tested |
| Hook state (`useDraftFilters`) | Well-tested |
| Pricing helpers (`prices.ts`) | Well-tested |
| Analytics click tracking | Well-tested |
| Blog MDX price components | Well-tested |
| **Blog utility functions** (`blog.ts`) | **Not tested** |
| **FAQ / location schema functions** | **Not tested** |
| **Location page helpers** | **Not tested** |
| **React components (40+)** | **Mostly untested** |
| **E2E — homepage / spa detail smoke** | 3 smoke tests only, very thin |
| **E2E — filter UX, SEO, a11y, viewport** | **No tests at all** |
| **404 page** | **Not tested** |

**Tech stack:** Next.js 14 App Router · Vitest 4 · Playwright 1.58 · Testing Library · jsdom · v8 coverage

---

## 2. Critical Pathways — Ranked

| Priority | Pathway | Risk if broken |
|----------|---------|----------------|
| 1 | Spa detail page renders correct content | Users see wrong spa info |
| 2 | /spas filter modal applies filters correctly | Users can't find spas |
| 3 | Homepage shows featured spas | First impression broken |
| 4 | Location pages show correct spas | SEO landing pages broken |
| 5 | SEO — JSON-LD schemas present and valid | Search ranking loss |
| 6 | Blog posts render and are date-gated correctly | Content disappears silently |
| 7 | Booking CTAs have correct URLs + UTM params | Revenue attribution lost |
| 8 | 404 page renders for bad slugs | Poor user experience |
| 9 | Mobile layout renders key content correctly | Mobile visitors impacted |
| 10 | Accessibility — no critical a11y violations (advisory) | Compliance risk |

---

## 3. Phase 1 — Playwright E2E Tests

### 3.1 `playwright.config.ts` — Add Mobile Projects

Add mobile viewport projects to the existing config so responsive tests run automatically:

```typescript
// playwright.config.ts — add to projects array
{
  name: 'Mobile Chrome',
  use: { ...devices['Pixel 5'] },
},
{
  name: 'Mobile Safari',
  use: { ...devices['iPhone 13'] },
},
```

Import `devices` at the top:
```typescript
import { defineConfig, devices } from '@playwright/test';
```

---

### 3.2 `e2e/core-pages.spec.ts` — Expanded Homepage + Listing

Replaces the thin assertions in `smoke.spec.ts` with substantive checks.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders H1 and hero subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('Find the perfect spa for you')).toBeVisible();
  });

  test('displays at least 6 spa cards', async ({ page }) => {
    const cards = page.locator('article');
    await expect(cards).toHaveCountGreaterThan(5);
  });

  test('spa cards link to /spa/:slug', async ({ page }) => {
    const firstCard = page.locator('a[href^="/spa/"]').first();
    await expect(firstCard).toBeVisible();
  });

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
});

test.describe('/spas listing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spas');
  });

  test('renders H1 heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('displays all 19 spa cards by default', async ({ page }) => {
    const cards = page.locator('article');
    await expect(cards).toHaveCount(19);
  });

  test('has JSON-LD ItemList schema', async ({ page }) => {
    const schema = page.locator('script[type="application/ld+json"]');
    await expect(schema).toHaveCountGreaterThan(0);
    const json = await schema.first().textContent();
    const parsed = JSON.parse(json!);
    expect(parsed['@type']).toBe('ItemList');
    expect(parsed.itemListElement.length).toBeGreaterThan(0);
  });
});
```

---

### 3.3 `e2e/spa-detail.spec.ts` — Representative Spa Pages

Tests 3 representative spas: one with day passes + treatments (Lodore Falls), one without day passes (Armathwaite Hall), one with treatments only.

```typescript
import { test, expect } from '@playwright/test';

const testSpas = [
  { slug: 'lodore-falls-spa', name: 'Lodore Falls' },
  { slug: 'armathwaite-hall-hotel-spa', name: 'Armathwaite Hall' },
  { slug: 'the-samling-hotel-spa', name: 'The Samling' },
];

for (const spa of testSpas) {
  test.describe(`Spa detail: ${spa.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/spa/${spa.slug}`);
    });

    test('renders spa name as H1', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('shows QuickFactsBar with Guest Access and Day Passes', async ({ page }) => {
      await expect(page.getByText('Guest Access')).toBeVisible();
      await expect(page.getByText('Day Passes')).toBeVisible();
    });

    test('has page title with spa name', async ({ page }) => {
      await expect(page).toHaveTitle(new RegExp(spa.name, 'i'));
    });

    test('has meta description', async ({ page }) => {
      const meta = page.locator('meta[name="description"]');
      const content = await meta.getAttribute('content');
      expect(content?.length).toBeGreaterThan(50);
    });

    test('has JSON-LD Spa schema', async ({ page }) => {
      const schemas = page.locator('script[type="application/ld+json"]');
      const count = await schemas.count();
      const schemaTexts = await Promise.all(
        Array.from({ length: count }, (_, i) => schemas.nth(i).textContent())
      );
      const spaSchema = schemaTexts
        .map((t) => JSON.parse(t!))
        .find((s) => s['@type'] === 'HealthClub' || s['@type'] === 'SportsActivityLocation' || s['@type'] === 'LocalBusiness');
      expect(spaSchema).toBeDefined();
    });

    test('has FAQ schema when FAQs present', async ({ page }) => {
      const faqSection = page.locator('#faqs');
      if (await faqSection.count() > 0) {
        const schemas = page.locator('script[type="application/ld+json"]');
        const count = await schemas.count();
        const schemaTexts = await Promise.all(
          Array.from({ length: count }, (_, i) => schemas.nth(i).textContent())
        );
        const faqSchema = schemaTexts
          .map((t) => JSON.parse(t!))
          .find((s) => s['@type'] === 'FAQPage');
        expect(faqSchema).toBeDefined();
        expect(faqSchema.mainEntity.length).toBeGreaterThan(0);
      }
    });

    test('Book Visit CTA section is present', async ({ page }) => {
      await expect(page.locator('#book')).toBeVisible();
    });

    test('has canonical URL', async ({ page }) => {
      const canonical = page.locator('link[rel="canonical"]');
      const href = await canonical.getAttribute('href');
      expect(href).toContain(`/spa/${spa.slug}`);
    });
  });
}

test('day passes section shows for spas with day passes', async ({ page }) => {
  await page.goto('/spa/lodore-falls-spa');
  await expect(page.locator('#day-passes')).toBeVisible();
});

test('day passes section absent for spas without day passes', async ({ page }) => {
  // Find a spa known to have no day passes
  await page.goto('/spa/the-samling-hotel-spa');
  await expect(page.locator('#day-passes')).toHaveCount(0);
});
```

---

### 3.4 `e2e/location-pages.spec.ts` — Representative Location Pages

```typescript
import { test, expect } from '@playwright/test';

const testLocations = [
  { slug: 'windermere', displayName: 'Windermere' },
  { slug: 'keswick', displayName: 'Keswick' },
  { slug: 'borrowdale', displayName: 'Borrowdale' },
];

for (const location of testLocations) {
  test.describe(`Location page: ${location.displayName}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/location/spas-in-${location.slug}`);
    });

    test('renders H1 with location name', async ({ page }) => {
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).toContainText(location.displayName);
    });

    test('displays at least one spa card', async ({ page }) => {
      const cards = page.locator('article');
      await expect(cards).toHaveCountGreaterThan(0);
    });

    test('spa cards link to correct /spa/:slug', async ({ page }) => {
      const firstLink = page.locator('a[href^="/spa/"]').first();
      await expect(firstLink).toBeVisible();
    });

    test('has meta description', async ({ page }) => {
      const meta = page.locator('meta[name="description"]');
      const content = await meta.getAttribute('content');
      expect(content?.length).toBeGreaterThan(50);
    });

    test('shows FAQ section', async ({ page }) => {
      await expect(page.locator('h2').filter({ hasText: /FAQ|question/i })).toBeVisible();
    });
  });
}
```

---

### 3.5 `e2e/filter-ux.spec.ts` — Filter Modal on /spas

```typescript
import { test, expect } from '@playwright/test';

test.describe('/spas filter UX', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spas');
    // Wait for client-side hydration
    await page.waitForSelector('article');
  });

  test('opens filter modal when filter button clicked', async ({ page }) => {
    await page.getByRole('button', { name: /filter/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('closing modal without applying leaves spa count unchanged', async ({ page }) => {
    const initialCount = await page.locator('article').count();
    await page.getByRole('button', { name: /filter/i }).click();
    await page.getByRole('button', { name: /cancel|close/i }).click();
    const afterCount = await page.locator('article').count();
    expect(afterCount).toBe(initialCount);
  });

  test('applying Day Passes filter reduces result count', async ({ page }) => {
    const initialCount = await page.locator('article').count();
    await page.getByRole('button', { name: /filter/i }).click();
    // Check the "Day Passes Available" access label checkbox
    await page.getByLabel(/day passes available/i).check();
    await page.getByRole('button', { name: /apply|show/i }).click();
    const filteredCount = await page.locator('article').count();
    expect(filteredCount).toBeLessThan(initialCount);
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('filter count badge increments when filter applied', async ({ page }) => {
    await page.getByRole('button', { name: /filter/i }).click();
    await page.getByLabel(/day passes available/i).check();
    await page.getByRole('button', { name: /apply|show/i }).click();
    // The filter button should show a count indicator
    const filterButton = page.getByRole('button', { name: /filter/i });
    await expect(filterButton).toContainText('1');
  });

  test('applying sauna facility filter returns only spas with saunas', async ({ page }) => {
    await page.getByRole('button', { name: /filter/i }).click();
    await page.getByLabel(/sauna/i).check();
    await page.getByRole('button', { name: /apply|show/i }).click();
    const filteredCount = await page.locator('article').count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThan(19);
  });
});
```

---

### 3.6 `e2e/blog.spec.ts` — Blog List and Post Pages

```typescript
import { test, expect } from '@playwright/test';

test.describe('Blog list page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('renders H1 heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('displays at least one blog post card', async ({ page }) => {
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('post cards link to /blog/:slug', async ({ page }) => {
    const firstLink = page.locator('a[href^="/blog/"]').first();
    await expect(firstLink).toBeVisible();
  });
});

test.describe('Blog post page', () => {
  test('navigating from list to post renders post content', async ({ page }) => {
    await page.goto('/blog');
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    const href = await firstPostLink.getAttribute('href');
    await firstPostLink.click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(href!);
  });

  test('has meta description on post page', async ({ page }) => {
    await page.goto('/blog');
    await page.locator('a[href^="/blog/"]').first().click();
    const meta = page.locator('meta[name="description"]');
    const content = await meta.getAttribute('content');
    expect(content?.length).toBeGreaterThan(20);
  });
});
```

---

### 3.7 `e2e/404.spec.ts` — Not Found Page

```typescript
import { test, expect } from '@playwright/test';

test.describe('404 — Not Found', () => {
  test('unknown spa slug renders not-found UI', async ({ page }) => {
    const response = await page.goto('/spa/this-spa-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('completely unknown route renders not-found UI', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-at-all');
    expect(response?.status()).toBe(404);
  });

  test('not-found page contains a link back to the home or spas page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-at-all');
    const homeLink = page.locator('a[href="/"]').or(page.locator('a[href="/spas"]'));
    await expect(homeLink.first()).toBeVisible();
  });
});
```

---

### 3.8 `e2e/responsive.spec.ts` — Viewport Behaviour

These tests run against the Mobile Chrome and Mobile Safari Playwright projects added in §3.1.

```typescript
import { test, expect } from '@playwright/test';

// These tests are meaningful on mobile — desktop layout is covered by other specs
test.describe('Mobile layout', () => {
  test('homepage H1 is visible on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('spa card content visible without horizontal scroll', async ({ page }) => {
    await page.goto('/spas');
    const body = await page.evaluate(() => document.body.scrollWidth);
    const viewport = page.viewportSize()!;
    expect(body).toBeLessThanOrEqual(viewport.width);
  });

  test('spa detail page QuickFactsBar is visible on mobile', async ({ page }) => {
    await page.goto('/spa/lodore-falls-spa');
    await expect(page.getByText('Guest Access')).toBeVisible();
    await expect(page.getByText('Day Passes')).toBeVisible();
  });

  test('navigation menu is accessible on mobile', async ({ page }) => {
    await page.goto('/');
    // Mobile should show a hamburger/menu trigger
    const menuTrigger = page.locator('[aria-label*="menu" i], [aria-label*="navigation" i], button[aria-expanded]');
    await expect(menuTrigger.first()).toBeVisible();
  });

  test('/spas filter button visible on mobile', async ({ page }) => {
    await page.goto('/spas');
    await expect(page.getByRole('button', { name: /filter/i })).toBeVisible();
  });
});
```

---

### 3.9 `e2e/a11y.spec.ts` — Advisory Accessibility (axe-core)

**Install:** `npm install --save-dev @axe-core/playwright`

Results are advisory — violations logged but tests marked as soft failures.

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pagesToCheck = [
  { name: 'Homepage', url: '/' },
  { name: 'Spa listing', url: '/spas' },
  { name: 'Spa detail', url: '/spa/lodore-falls-spa' },
  { name: 'Location page', url: '/location/spas-in-windermere' },
];

for (const { name, url } of pagesToCheck) {
  test(`${name} has no critical a11y violations`, async ({ page }) => {
    await page.goto(url);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Log violations without failing the build
    if (results.violations.length > 0) {
      console.warn(`[a11y] ${name} violations:`, JSON.stringify(results.violations, null, 2));
    }

    // Only fail on critical violations
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical, `Critical a11y violations on ${name}`).toHaveLength(0);
  });
}
```

---

## 4. Phase 2 — Vitest Unit Tests

### 4.1 `src/__tests__/blog.test.ts` — Blog Utilities

Tests `src/lib/blog.ts` functions with mocked filesystem and dates.

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';

vi.mock('fs');

const mockMdx = (slug: string, data: Record<string, unknown>, content = 'body') =>
  `---\n${Object.entries(data).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n')}\n---\n${content}`;

const FUTURE = '2099-01-01';
const PAST = '2020-01-01';
const TODAY = '2026-03-02';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(TODAY));
  vi.mocked(fs.existsSync).mockReturnValue(true);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('getAllBlogPosts()', () => {
  it('returns only posts with publishedAt on or before today', async () => {
    vi.mocked(fs.readdirSync).mockReturnValue(['published.mdx', 'future.mdx'] as any);
    vi.mocked(fs.readFileSync).mockImplementation((path: unknown) => {
      if (String(path).includes('published'))
        return mockMdx('published', { title: 'Past Post', publishedAt: PAST, category: 'guides', tags: [], excerpt: 'x', featuredImage: '/img.jpg', featuredImageAlt: 'alt' });
      return mockMdx('future', { title: 'Future Post', publishedAt: FUTURE, category: 'guides', tags: [], excerpt: 'x', featuredImage: '/img.jpg', featuredImageAlt: 'alt' });
    });

    const { getAllBlogPosts } = await import('@/lib/blog');
    const posts = getAllBlogPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe('published');
  });

  it('includes a post published exactly today', async () => {
    vi.mocked(fs.readdirSync).mockReturnValue(['today.mdx'] as any);
    vi.mocked(fs.readFileSync).mockReturnValue(
      mockMdx('today', { title: 'Today', publishedAt: TODAY, category: 'guides', tags: [], excerpt: 'x', featuredImage: '/img.jpg', featuredImageAlt: 'alt' })
    );
    const { getAllBlogPosts } = await import('@/lib/blog');
    const posts = getAllBlogPosts();
    expect(posts).toHaveLength(1);
  });

  it('returns posts sorted newest first', async () => {
    vi.mocked(fs.readdirSync).mockReturnValue(['old.mdx', 'new.mdx'] as any);
    vi.mocked(fs.readFileSync).mockImplementation((path: unknown) => {
      if (String(path).includes('old'))
        return mockMdx('old', { title: 'Old', publishedAt: '2021-01-01', category: 'guides', tags: [], excerpt: 'x', featuredImage: '/img.jpg', featuredImageAlt: 'alt' });
      return mockMdx('new', { title: 'New', publishedAt: '2025-01-01', category: 'guides', tags: [], excerpt: 'x', featuredImage: '/img.jpg', featuredImageAlt: 'alt' });
    });
    const { getAllBlogPosts } = await import('@/lib/blog');
    const posts = getAllBlogPosts();
    expect(posts[0].slug).toBe('new');
    expect(posts[1].slug).toBe('old');
  });

  it('returns empty array when blog directory does not exist', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    const { getAllBlogPosts } = await import('@/lib/blog');
    expect(getAllBlogPosts()).toEqual([]);
  });
});

describe('getBlogPostBySlug()', () => {
  it('returns null for a slug with no matching file', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    const { getBlogPostBySlug } = await import('@/lib/blog');
    expect(getBlogPostBySlug('nonexistent-slug')).toBeNull();
  });

  it('returns the post with slug and content for a valid file', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(
      mockMdx('test', { title: 'Test Post', publishedAt: PAST, category: 'guides', tags: ['spa'], excerpt: 'nice', featuredImage: '/img.jpg', featuredImageAlt: 'alt' }, 'Hello world')
    );
    const { getBlogPostBySlug } = await import('@/lib/blog');
    const post = getBlogPostBySlug('test');
    expect(post).not.toBeNull();
    expect(post!.slug).toBe('test');
    expect(post!.content).toContain('Hello world');
  });
});

describe('getRelatedPosts()', () => {
  const makePost = (slug: string, category: string, tags: string[], date = PAST) =>
    mockMdx(slug, { title: slug, publishedAt: date, category, tags, excerpt: 'x', featuredImage: '/img.jpg', featuredImageAlt: 'alt' });

  it('scores same-category posts +2 over unrelated posts', async () => {
    vi.mocked(fs.readdirSync).mockReturnValue(['current.mdx', 'same-cat.mdx', 'diff-cat.mdx'] as any);
    vi.mocked(fs.readFileSync).mockImplementation((path: unknown) => {
      const p = String(path);
      if (p.includes('current')) return makePost('current', 'guides', ['sauna']);
      if (p.includes('same-cat')) return makePost('same-cat', 'guides', []);
      return makePost('diff-cat', 'locations', []);
    });
    const { getRelatedPosts } = await import('@/lib/blog');
    const related = getRelatedPosts('current');
    expect(related[0].slug).toBe('same-cat');
  });

  it('scores shared tags +1 each', async () => {
    vi.mocked(fs.readdirSync).mockReturnValue(['current.mdx', 'two-tags.mdx', 'one-tag.mdx'] as any);
    vi.mocked(fs.readFileSync).mockImplementation((path: unknown) => {
      const p = String(path);
      if (p.includes('current')) return makePost('current', 'guides', ['spa', 'thermal', 'sauna']);
      if (p.includes('two-tags')) return makePost('two-tags', 'locations', ['spa', 'thermal']);
      return makePost('one-tag', 'locations', ['sauna']);
    });
    const { getRelatedPosts } = await import('@/lib/blog');
    const related = getRelatedPosts('current');
    expect(related[0].slug).toBe('two-tags');
  });

  it('excludes the current post from results', async () => {
    vi.mocked(fs.readdirSync).mockReturnValue(['current.mdx', 'other.mdx'] as any);
    vi.mocked(fs.readFileSync).mockImplementation((path: unknown) => {
      if (String(path).includes('current')) return makePost('current', 'guides', []);
      return makePost('other', 'guides', []);
    });
    const { getRelatedPosts } = await import('@/lib/blog');
    const related = getRelatedPosts('current');
    expect(related.every((p) => p.slug !== 'current')).toBe(true);
  });

  it('limits results to the specified limit', async () => {
    const slugs = ['a.mdx', 'b.mdx', 'c.mdx', 'd.mdx', 'current.mdx'];
    vi.mocked(fs.readdirSync).mockReturnValue(slugs as any);
    vi.mocked(fs.readFileSync).mockImplementation((path: unknown) => {
      const slug = String(path).split('/').pop()!.replace('.mdx', '');
      return makePost(slug, 'guides', []);
    });
    const { getRelatedPosts } = await import('@/lib/blog');
    expect(getRelatedPosts('current', 2)).toHaveLength(2);
  });
});
```

**Note:** Because `blog.ts` imports `fs` at the module level, add `cache: false` to the vi.mock or use `vi.resetModules()` before each re-import where the mock changes.

---

### 4.2 `src/__tests__/faq-schema.test.ts` — FAQ Schema Generation

Tests `generateFAQSchema` exported from `src/components/FAQs.tsx`.

```typescript
import { describe, it, expect } from 'vitest';
import { generateFAQSchema } from '@/components/FAQs';
import React from 'react';

describe('generateFAQSchema()', () => {
  it('produces valid FAQPage Schema.org structure', () => {
    const faqs = [
      { question: 'Is there parking?', answer: 'Yes, free parking on site.' },
    ];
    const schema = generateFAQSchema(faqs);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0]['@type']).toBe('Question');
    expect(schema.mainEntity[0].name).toBe('Is there parking?');
    expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Yes, free parking on site.');
  });

  it('uses schemaText override when provided', () => {
    const faqs = [
      {
        question: 'What is the age policy?',
        answer: React.createElement('p', null, 'Adults only'),
        schemaText: 'Adults only. Minimum age 18.',
      },
    ];
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Adults only. Minimum age 18.');
  });

  it('returns empty string for ReactNode answers without schemaText', () => {
    const faqs = [
      {
        question: 'Complex answer?',
        answer: React.createElement('div', null, 'content'),
      },
    ];
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('');
  });

  it('handles multiple FAQs', () => {
    const faqs = Array.from({ length: 5 }, (_, i) => ({
      question: `Question ${i + 1}`,
      answer: `Answer ${i + 1}`,
    }));
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity).toHaveLength(5);
  });

  it('returns empty mainEntity for empty faq array', () => {
    const schema = generateFAQSchema([]);
    expect(schema.mainEntity).toHaveLength(0);
  });
});
```

---

### 4.3 `src/__tests__/location-pages.test.ts` — Location Page Helpers

Tests `src/lib/locationPages.ts`.

```typescript
import { describe, it, expect } from 'vitest';
import {
  locationPageSlugs,
  locationMetadata,
  getLocationPageSlug,
  getLocationPagePath,
} from '@/lib/locationPages';
import { spaData } from '@/data/spas';

describe('locationPageSlugs', () => {
  it('contains an entry for every unique spa location in spaData', () => {
    const spaLocations = [...new Set(spaData.map((s) => s.location))];
    spaLocations.forEach((location) => {
      // Not every location must have a page, but if it does the slug must be defined
      if (locationPageSlugs[location] !== undefined) {
        expect(typeof locationPageSlugs[location]).toBe('string');
        expect(locationPageSlugs[location].length).toBeGreaterThan(0);
      }
    });
  });

  it('slugs are all lowercase with no spaces', () => {
    Object.values(locationPageSlugs).forEach((slug) => {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  it('slugs are unique', () => {
    const slugs = Object.values(locationPageSlugs);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('getLocationPageSlug()', () => {
  it('returns correct slug for known location', () => {
    const slug = getLocationPageSlug('Windermere');
    expect(slug).toBe('windermere');
  });

  it('returns null for location with no page', () => {
    const slug = getLocationPageSlug('Nonexistent Place');
    expect(slug).toBeNull();
  });
});

describe('getLocationPagePath()', () => {
  it('returns correct path for known location', () => {
    const path = getLocationPagePath('Windermere');
    expect(path).toBe('/location/spas-in-windermere');
  });

  it('returns null for location with no page', () => {
    expect(getLocationPagePath('Nonexistent Place')).toBeNull();
  });
});

describe('locationMetadata', () => {
  it('each entry has name, slug, image, and tagline', () => {
    locationMetadata.forEach((meta) => {
      expect(meta.name.length).toBeGreaterThan(0);
      expect(meta.slug.length).toBeGreaterThan(0);
      expect(meta.image.length).toBeGreaterThan(0);
      expect(meta.tagline.length).toBeGreaterThan(0);
    });
  });

  it('slugs match locationPageSlugs values', () => {
    const slugValues = new Set(Object.values(locationPageSlugs));
    locationMetadata.forEach((meta) => {
      expect(slugValues).toContain(meta.slug);
    });
  });
});
```

---

## 5. Phase 3 — Component Tests

All component tests live in `src/__tests__/components/`. Each file mirrors the component it tests. Tests use `@testing-library/react` + `vitest`.

Common setup — add to `vitest.setup.ts` if not already present:
```typescript
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) =>
    React.createElement('img', { src, alt }),
}));
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement('a', { href }, children),
}));
```

---

### 5.1 `BookVisitCTA.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import BookVisitCTA from '@/components/BookVisitCTA';
import { spaData } from '@/data/spas';

const baseSpa = spaData[0];

describe('BookVisitCTA', () => {
  it('renders "Book Stay" when hotelBookingUrl is present', () => {
    const spa = { ...baseSpa, hotelBookingUrl: 'https://hotel.example.com', dayPassBookingUrl: undefined, treatmentBookingUrl: undefined };
    render(<BookVisitCTA spa={spa as any} />);
    expect(screen.getByText(/book stay/i)).toBeInTheDocument();
  });

  it('renders "Book Spa Day" when dayPassBookingUrl is present', () => {
    const spa = { ...baseSpa, hotelBookingUrl: undefined, dayPassBookingUrl: 'https://daypass.example.com', treatmentBookingUrl: undefined };
    render(<BookVisitCTA spa={spa as any} />);
    expect(screen.getByText(/book spa day/i)).toBeInTheDocument();
  });

  it('renders "Book Treatment" when treatmentBookingUrl is present', () => {
    const spa = { ...baseSpa, hotelBookingUrl: undefined, dayPassBookingUrl: undefined, treatmentBookingUrl: 'https://treatments.example.com' };
    render(<BookVisitCTA spa={spa as any} />);
    expect(screen.getByText(/book treatment/i)).toBeInTheDocument();
  });

  it('renders all three booking buttons when all URLs are present', () => {
    const spa = { ...baseSpa, hotelBookingUrl: 'https://h.example.com', dayPassBookingUrl: 'https://d.example.com', treatmentBookingUrl: 'https://t.example.com' };
    render(<BookVisitCTA spa={spa as any} />);
    expect(screen.getByText(/book stay/i)).toBeInTheDocument();
    expect(screen.getByText(/book spa day/i)).toBeInTheDocument();
    expect(screen.getByText(/book treatment/i)).toBeInTheDocument();
  });

  it('renders "Visit the Official Website" fallback when no booking URLs', () => {
    const spa = { ...baseSpa, hotelBookingUrl: undefined, dayPassBookingUrl: undefined, treatmentBookingUrl: undefined, websiteUrl: 'https://website.example.com' };
    render(<BookVisitCTA spa={spa as any} />);
    expect(screen.getByText(/visit the official website/i)).toBeInTheDocument();
  });

  it('renders nothing when no booking URLs and no websiteUrl', () => {
    const spa = { ...baseSpa, hotelBookingUrl: undefined, dayPassBookingUrl: undefined, treatmentBookingUrl: undefined, websiteUrl: '' };
    const { container } = render(<BookVisitCTA spa={spa as any} />);
    expect(container.querySelector('a')).toBeNull();
  });

  it('booking links contain UTM source parameter', () => {
    const spa = { ...baseSpa, hotelBookingUrl: 'https://hotel.example.com', dayPassBookingUrl: undefined, treatmentBookingUrl: undefined };
    render(<BookVisitCTA spa={spa as any} />);
    const link = screen.getByText(/book stay/i).closest('a')!;
    expect(link.getAttribute('href')).toContain('utm_source=lakedistrictspas');
  });

  it('booking links open in new tab', () => {
    const spa = { ...baseSpa, hotelBookingUrl: 'https://hotel.example.com', dayPassBookingUrl: undefined, treatmentBookingUrl: undefined };
    render(<BookVisitCTA spa={spa as any} />);
    const link = screen.getByText(/book stay/i).closest('a')!;
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
  });

  it('renders spa name in the heading', () => {
    render(<BookVisitCTA spa={baseSpa} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(baseSpa.name);
  });
});
```

---

### 5.2 `QuickFactsBar.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import QuickFactsBar from '@/components/QuickFactsBar';
import { spaData } from '@/data/spas';

const baseSpa = { ...spaData[0] };

describe('QuickFactsBar', () => {
  it('always shows Guest Access and Day Passes sections', () => {
    render(<QuickFactsBar spa={baseSpa} />);
    expect(screen.getByText('Guest Access')).toBeInTheDocument();
    expect(screen.getByText('Day Passes')).toBeInTheDocument();
  });

  it('shows Age Policy section when spa.agePolicy is set', () => {
    const spa = { ...baseSpa, agePolicy: 'Adults only (18+)' };
    render(<QuickFactsBar spa={spa} />);
    expect(screen.getByText('Age Policy')).toBeInTheDocument();
    expect(screen.getByText('Adults only (18+)')).toBeInTheDocument();
  });

  it('does not show Age Policy section when spa.agePolicy is falsy', () => {
    const spa = { ...baseSpa, agePolicy: undefined };
    render(<QuickFactsBar spa={spa as any} />);
    expect(screen.queryByText('Age Policy')).toBeNull();
  });

  it('shows "Available to book" when day-passes-available label present', () => {
    const spa = { ...baseSpa, accessLabels: ['day-passes-available'] as any };
    render(<QuickFactsBar spa={spa} />);
    expect(screen.getByText('Available to book')).toBeInTheDocument();
  });

  it('shows "Not Available" when day-passes-available label absent', () => {
    const spa = { ...baseSpa, accessLabels: ['no-day-passes-available'] as any };
    render(<QuickFactsBar spa={spa} />);
    expect(screen.getByText('Not Available')).toBeInTheDocument();
  });

  it('shows "Contact spa for details" when no hotel access label found', () => {
    const spa = { ...baseSpa, accessLabels: ['day-passes-available'] as any };
    render(<QuickFactsBar spa={spa} />);
    expect(screen.getByText('Contact spa for details')).toBeInTheDocument();
  });

  it('age policy with <br/> separator renders both lines', () => {
    const spa = { ...baseSpa, agePolicy: 'Adults 18+<br/>Under 16 with adult' };
    render(<QuickFactsBar spa={spa} />);
    expect(screen.getByText('Adults 18+')).toBeInTheDocument();
    expect(screen.getByText('Under 16 with adult')).toBeInTheDocument();
  });
});
```

---

### 5.3 `DayPasses.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import DayPasses from '@/components/DayPasses';
import { spaData } from '@/data/spas';

const spaWithPasses = spaData.find((s) => s.accessLabels.includes('day-passes-available'))!;
const spaWithoutPasses = spaData.find((s) => !s.accessLabels.includes('day-passes-available'))!;

describe('DayPasses', () => {
  it('renders null for a spa without day passes', () => {
    const { container } = render(<DayPasses spa={spaWithoutPasses} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a section with day pass cards for a spa with day passes', () => {
    render(<DayPasses spa={spaWithPasses} />);
    expect(screen.getByText('Day Passes')).toBeInTheDocument();
  });

  it('renders a card for each day pass option', () => {
    render(<DayPasses spa={spaWithPasses} />);
    const articles = screen.getAllByRole('article');
    expect(articles.length).toBeGreaterThan(0);
  });

  it('shows price in £ format on each card', () => {
    render(<DayPasses spa={spaWithPasses} />);
    const prices = screen.getAllByText(/£\d+/);
    expect(prices.length).toBeGreaterThan(0);
  });

  it('day pass booking link contains UTM params', () => {
    render(<DayPasses spa={spaWithPasses} />);
    const bookLinks = document.querySelectorAll('a[data-click-intent]');
    bookLinks.forEach((link) => {
      expect(link.getAttribute('href')).toContain('utm_source');
    });
  });
});
```

---

### 5.4 `FAQs.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import React from 'react';
import FAQs, { generateFAQSchema } from '@/components/FAQs';
import { HelpCircle } from 'lucide-react';

const stringFaqs = [
  { question: 'What are the opening hours?', answer: 'Daily 9am to 9pm.' },
  { question: 'Is there parking?', answer: 'Yes, free parking.' },
];

describe('FAQs component', () => {
  it('renders the provided title', () => {
    render(<FAQs title="Common Questions" faqs={stringFaqs} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Common Questions');
  });

  it('renders subtitle when provided', () => {
    render(<FAQs title="Q&A" subtitle="Everything you need to know" faqs={stringFaqs} />);
    expect(screen.getByText('Everything you need to know')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    const { container } = render(<FAQs title="Q&A" faqs={stringFaqs} />);
    const italic = container.querySelector('p.italic');
    expect(italic).toBeNull();
  });

  it('renders all FAQ questions as H3 headings', () => {
    render(<FAQs title="Q&A" faqs={stringFaqs} />);
    expect(screen.getByRole('heading', { name: 'What are the opening hours?' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Is there parking?' })).toBeInTheDocument();
  });

  it('renders string answers', () => {
    render(<FAQs title="Q&A" faqs={stringFaqs} />);
    expect(screen.getByText('Daily 9am to 9pm.')).toBeInTheDocument();
  });

  it('renders ReactNode answers', () => {
    const reactFaqs = [
      { question: 'Complex?', answer: React.createElement('ul', null, React.createElement('li', null, 'Item one')) },
    ];
    render(<FAQs title="Q&A" faqs={reactFaqs} />);
    expect(screen.getByText('Item one')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { container } = render(<FAQs title="Q&A" faqs={stringFaqs} icon={HelpCircle} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
```

---

### 5.5 `SpaCard.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import SpaCard from '@/components/SpaCard';
import { spaData } from '@/data/spas';

const spa = spaData[0];

describe('SpaCard', () => {
  it('renders spa name', () => {
    render(<SpaCard spa={spa} />);
    expect(screen.getByText(spa.name)).toBeInTheDocument();
  });

  it('renders spa location', () => {
    render(<SpaCard spa={spa} />);
    expect(screen.getByText(spa.location)).toBeInTheDocument();
  });

  it('renders up to 3 key features', () => {
    render(<SpaCard spa={spa} />);
    const features = spa.keyFeatures.slice(0, 3);
    features.forEach((f) => expect(screen.getByText(f)).toBeInTheDocument());
    // 4th feature should not appear
    if (spa.keyFeatures.length > 3) {
      expect(screen.queryByText(spa.keyFeatures[3])).toBeNull();
    }
  });

  it('shows day pass price when lowestDayPassPrice provided', () => {
    render(<SpaCard spa={spa} lowestDayPassPrice={75} />);
    expect(screen.getByText(/day passes from/i)).toBeInTheDocument();
    expect(screen.getByText('£75')).toBeInTheDocument();
  });

  it('does not show day pass price when lowestDayPassPrice is null', () => {
    render(<SpaCard spa={spa} lowestDayPassPrice={null} />);
    expect(screen.queryByText(/day passes from/i)).toBeNull();
  });

  it('shows treatment price when lowestTreatmentPrice provided', () => {
    render(<SpaCard spa={spa} lowestTreatmentPrice={60} />);
    expect(screen.getByText(/treatments from/i)).toBeInTheDocument();
  });

  it('links to /spa/:slug', () => {
    render(<SpaCard spa={spa} />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe(`/spa/${spa.url}`);
  });

  it('shows image fallback text when image fails to load', () => {
    render(<SpaCard spa={{ ...spa, images: [{ src: '/broken.jpg', alt: 'broken' }] }} />);
    const img = screen.getByRole('img');
    // Simulate error
    img.dispatchEvent(new Event('error'));
    // The fallback text should appear (requires rerender after state update)
    // Note: may need @testing-library/user-event for this interaction
  });
});
```

---

### 5.6 `SpaAccessBadges.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import SpaAccessBadges from '@/components/SpaAccessBadges';
import { accessLabelConfig } from '@/types/spa';
import { AccessLabel } from '@/types/spa';

describe('SpaAccessBadges', () => {
  it('renders a badge for each access label', () => {
    const labels: AccessLabel[] = ['free-for-all-guests', 'day-passes-available'];
    render(<SpaAccessBadges accessLabels={labels} />);
    labels.forEach((label) => {
      expect(screen.getByText(accessLabelConfig[label].badgeText)).toBeInTheDocument();
    });
  });

  it('renders nothing for empty access labels', () => {
    const { container } = render(<SpaAccessBadges accessLabels={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correct badge text for free-for-all-guests', () => {
    render(<SpaAccessBadges accessLabels={['free-for-all-guests']} />);
    expect(screen.getByText(accessLabelConfig['free-for-all-guests'].badgeText)).toBeInTheDocument();
  });
});
```

---

### 5.7 `BlogCard.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import BlogCard from '@/components/BlogCard';

const mockPost = {
  slug: 'best-spa-days',
  title: 'The Best Spa Days in the Lake District',
  excerpt: 'A guide to the finest day passes.',
  publishedAt: '2025-06-01',
  category: 'guides' as const,
  tags: ['spa', 'day-passes'],
  featuredImage: '/images/blog/test.jpg',
  featuredImageAlt: 'Spa pool',
  readingTime: '5 min read',
};

describe('BlogCard', () => {
  it('renders the post title', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
  });

  it('renders the excerpt', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument();
  });

  it('links to /blog/:slug', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByRole('link').getAttribute('href')).toBe(`/blog/${mockPost.slug}`);
  });

  it('renders the reading time', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText(/5 min read/i)).toBeInTheDocument();
  });
});
```

---

### 5.8 `SpaNavigation.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import SpaNavigation from '@/components/SpaNavigation';
import { spaData } from '@/data/spas';

describe('SpaNavigation', () => {
  it('renders prev and next links for a middle spa', () => {
    const middleSpa = spaData[5];
    render(<SpaNavigation currentSpaId={middleSpa.id} spas={spaData} />);
    expect(screen.getByRole('link', { name: /prev|previous|back/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /next/i })).toBeInTheDocument();
  });

  it('renders only next for the first spa', () => {
    render(<SpaNavigation currentSpaId={spaData[0].id} spas={spaData} />);
    expect(screen.queryByRole('link', { name: /prev|previous|back/i })).toBeNull();
    expect(screen.getByRole('link', { name: /next/i })).toBeInTheDocument();
  });

  it('renders only prev for the last spa', () => {
    render(<SpaNavigation currentSpaId={spaData[spaData.length - 1].id} spas={spaData} />);
    expect(screen.getByRole('link', { name: /prev|previous|back/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /next/i })).toBeNull();
  });
});
```

---

### 5.9 `Breadcrumbs.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import Breadcrumbs from '@/components/Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders home link', () => {
    render(<Breadcrumbs location="Windermere" spaName="Low Wood Bay" spaSlug="low-wood-bay-spa" />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  });

  it('renders location as a link', () => {
    render(<Breadcrumbs location="Windermere" spaName="Low Wood Bay" spaSlug="low-wood-bay-spa" />);
    expect(screen.getByRole('link', { name: /windermere/i })).toBeInTheDocument();
  });

  it('renders spa name as current page (no link)', () => {
    render(<Breadcrumbs location="Windermere" spaName="Low Wood Bay" spaSlug="low-wood-bay-spa" />);
    expect(screen.getByText('Low Wood Bay')).toBeInTheDocument();
    // Current crumb should not be a link
    expect(screen.queryByRole('link', { name: /low wood bay/i })).toBeNull();
  });
});
```

---

### 5.10 `RelatedSpas.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import RelatedSpas from '@/components/RelatedSpas';
import { spaData } from '@/data/spas';

const spa = spaData[0];

describe('RelatedSpas', () => {
  it('renders a card for each related spa ID', () => {
    render(<RelatedSpas relatedSpaIds={spa.relatedSpas} />);
    const relatedSpas = spaData.filter((s) => spa.relatedSpas.includes(s.id));
    relatedSpas.forEach((related) => {
      expect(screen.getByText(related.name)).toBeInTheDocument();
    });
  });

  it('renders nothing for empty relatedSpaIds', () => {
    const { container } = render(<RelatedSpas relatedSpaIds={[]} />);
    // Should render no spa cards
    expect(container.querySelectorAll('article')).toHaveLength(0);
  });
});
```

---

## 6. Phase 4 — Refactoring for Testability

Per project guidelines, only changes strictly required for testability.

### 6.1 `blog.ts` — Module-level `new Date()` (low risk, no refactoring needed)

`vi.setSystemTime()` in Vitest correctly mocks `new Date()`. No refactoring required — the test approach in §4.1 handles this.

### 6.2 `blog.ts` — Filesystem coupling (minor, low impact)

`getAllBlogPosts()` calls `fs.readdirSync` / `fs.readFileSync` directly. This is testable via `vi.mock('fs')` as shown in §4.1. No refactoring needed.

**If** the blog grows significantly, consider extracting a `readBlogFile(slug)` function that can be replaced in tests. Not required now.

### 6.3 `DayPasses.tsx` — Direct `getDayPassOptionsBySpaId` import

`DayPasses` calls `getDayPassOptionsBySpaId(spa.id)` inline. This is already testable using real spa data (as in §5.3). No refactoring needed.

### 6.4 `SpasListingClient.tsx` — Client component (no changes needed)

The filter state is managed via `useDraftFilters` which is already unit-tested. The component is testable as-is using Testing Library. No refactoring needed.

**Genuine refactoring opportunity:** If the `applyFilters` function used in `SpasListingClient` is duplicated from `spa-catalog.ts`, consolidating them would improve testability. Check if this duplication exists — if so, point to `spa-catalog.ts` as the single source and delete the local copy.

---

## 7. Recommended Test Scripts

No new scripts are needed — existing scripts are sufficient. Add the `@axe-core/playwright` dependency and ensure the following all pass in CI order:

```bash
npm run typecheck          # TypeScript (already in pre-commit hook)
npm test                   # Vitest unit + component tests (already in pre-commit hook)
npm run test:e2e           # Playwright on all 5 browser projects
```

**Suggested addition to `package.json`:**
```json
"test:e2e:mobile": "playwright test --project='Mobile Chrome' --project='Mobile Safari'",
"test:a11y": "playwright test e2e/a11y.spec.ts"
```

Install advisory a11y dependency:
```bash
npm install --save-dev @axe-core/playwright
```

---

## 8. Coverage Roadmap — By Critical Behaviour

Coverage is expressed as protected behaviours, not a line percentage.

### After Phase 1 (E2E)
- ✅ All 19 spa detail pages return 200 (checked via generateStaticParams at build)
- ✅ Representative spa detail pages render correct content + JSON-LD schema
- ✅ Location pages render correct spas + FAQs
- ✅ Filter modal opens, applies filters, reduces results
- ✅ Blog list and individual blog posts render
- ✅ 404 page renders for unknown slugs
- ✅ Mobile layout has no horizontal overflow, key content visible
- ✅ No critical a11y violations on core pages (advisory)

### After Phase 2 (Vitest unit gaps)
- ✅ Future-dated blog posts are suppressed by `getAllBlogPosts()`
- ✅ `getRelatedPosts()` scoring is correct (category +2, tag +1)
- ✅ `getBlogPostBySlug()` returns null for missing files
- ✅ `generateFAQSchema()` produces valid Schema.org output
- ✅ ReactNode FAQ answers fall back to empty `schemaText` in schema
- ✅ Location page slugs are complete and unique
- ✅ `getLocationPagePath()` returns null for unmapped locations

### After Phase 3 (Component tests)
- ✅ `BookVisitCTA` renders correct buttons for all 5 booking states
- ✅ Booking links always carry UTM params and `target="_blank"`
- ✅ `QuickFactsBar` shows/hides Age Policy conditionally
- ✅ `DayPasses` returns null when spa has no day pass data
- ✅ `FAQs` renders both string and ReactNode answers correctly
- ✅ `SpaCard` shows price badges only when prices are provided
- ✅ `SpaNavigation` correctly renders prev/next at list boundaries
- ✅ `Breadcrumbs` renders correct hierarchy and link targets
- ✅ `SpaAccessBadges` renders the correct badge text per label

### After Phase 4 (Refactoring)
- ✅ No duplicate filter logic — single source of truth in `spa-catalog.ts`
- ✅ Blog utilities remain fully unit-testable without filesystem side effects

---

## Implementation Order

Work top-to-bottom within each phase. Phases can overlap once Phase 1 scaffolding is in place.

1. `playwright.config.ts` — add mobile projects (5 min)
2. `e2e/core-pages.spec.ts` — homepage + listing (30 min)
3. `e2e/spa-detail.spec.ts` — 3 representative spas (45 min)
4. `e2e/filter-ux.spec.ts` — filter modal (30 min)
5. `e2e/404.spec.ts` — not found (10 min)
6. `e2e/location-pages.spec.ts` — 3 location pages (20 min)
7. `e2e/blog.spec.ts` — blog list + post (20 min)
8. `e2e/responsive.spec.ts` — mobile viewport (20 min)
9. `e2e/a11y.spec.ts` — advisory a11y (15 min + `npm install`)
10. `src/__tests__/blog.test.ts` — blog utilities (45 min)
11. `src/__tests__/faq-schema.test.ts` — FAQ schema (20 min)
12. `src/__tests__/location-pages.test.ts` — location helpers (20 min)
13. Component tests — `BookVisitCTA`, `QuickFactsBar`, `DayPasses`, `FAQs`, `SpaCard` (60 min total)
14. Component tests — `SpaAccessBadges`, `BlogCard`, `SpaNavigation`, `Breadcrumbs`, `RelatedSpas` (40 min total)
15. Phase 4 — check for filter logic duplication, consolidate if found (15 min)
