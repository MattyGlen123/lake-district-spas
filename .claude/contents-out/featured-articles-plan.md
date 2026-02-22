# Featured Articles Section — Implementation Plan

## Summary

Add a `FeaturedArticles` component that shows the 2 most recent blog posts, used in two places:

1. **Homepage** — below the spa grid, always shows 2 most recent
2. **Blog post page** — below the "Spas Mentioned" section, shows 2 most recent excluding the current post

---

## Architectural Note: Homepage Refactor Required

`src/app/page.tsx` is currently a `'use client'` component (needed for filter state). `FeaturedArticles` must call `getAllBlogPosts()` which uses Node.js `fs` — this cannot run in a browser bundle.

The correct Next.js 14 App Router pattern is to extract the interactive filter logic into its own Client Component, leaving `page.tsx` as a Server Component free to render server components like `FeaturedArticles`.

This refactor is small and self-contained:

- New file: `src/components/SpaFilterSection.tsx` (client component — moves all filter state/logic out of page.tsx)
- `src/app/page.tsx` becomes a lean server component

---

## Files to Create

### 1. `src/components/FeaturedArticles.tsx` (Server Component)

**Props:**
```ts
interface FeaturedArticlesProps {
  excludeSlug?: string; // omit current article on blog post pages
}
```

**Logic:**
```ts
const posts = getAllBlogPosts()
  .filter(p => p.slug !== excludeSlug)
  .slice(0, 2);

if (posts.length === 0) return null;
```

**Markup — mirrors RelatedSpas.tsx pattern:**
- Section bg: `bg-slate-50 py-32`
- Amber decorative line + uppercase tracking label: `"From The Blog"`
- Serif heading: `"Latest Spa Guides"` — with "View All Articles →" link to `/blog` on the right
- 2-col grid: `grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8`
- Each cell: `<BlogCard post={post} />`

### 2. `src/components/SpaFilterSection.tsx` (Client Component)

Move the following out of `page.tsx` into this new component:
- All `useState` declarations
- All handler functions (`handleOpenModal`, `handleCloseModal`, etc.)
- The `useMemo` filtered spa computation
- The sticky filter bar + `SpaGrid` + `FilterModal` JSX

Component signature:
```tsx
'use client';
export default function SpaFilterSection() { ... }
```

---

## Files to Modify

### 3. `src/app/page.tsx` — Convert to Server Component

Remove `'use client'` directive. Replace the existing body with:

```tsx
import Hero from '@/components/Hero';
import SpaFilterSection from '@/components/SpaFilterSection';
import FeaturedArticles from '@/components/FeaturedArticles';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// keep existing organizationSchema jsonLd

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <script ... jsonLd ... />
      <Header />
      <main>
        <Hero />
        <SpaFilterSection />
        <FeaturedArticles />
      </main>
      <Footer />
    </div>
  );
}
```

### 4. `src/app/blog/[slug]/page.tsx` — Add FeaturedArticles after Spas Mentioned section

After the closing `</section>` of the "Spas Mentioned in This Article" block (around line 641), add:

```tsx
import FeaturedArticles from '@/components/FeaturedArticles';

// inside the JSX, after mentionedSpas section:
<FeaturedArticles excludeSlug={post.slug} />
```

---

## Implementation Order

1. Create `SpaFilterSection.tsx` (copy logic from current page.tsx)
2. Refactor `page.tsx` to server component
3. Verify homepage still works (build/typecheck)
4. Create `FeaturedArticles.tsx`
5. Add to `page.tsx`
6. Add to `blog/[slug]/page.tsx`
7. Run `npm run typecheck && npm test`

---

## Styling Reference

Section header pattern (from RelatedSpas):
```tsx
<div className="flex items-center space-x-4 mb-6">
  <div className="h-px w-12 bg-amber-700 opacity-30" />
  <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
    From The Blog
  </span>
</div>
<div className="flex items-end justify-between">
  <h2 className="font-serif text-4xl md:text-5xl text-stone-900">
    Latest Spa Guides
  </h2>
  <Link href="/blog" className="text-stone-900 font-semibold flex items-center text-sm">
    View All Articles
    <ChevronRight className="h-4 w-4 ml-1" />
  </Link>
</div>
```

Grid (2 cols, matches existing blog listing and RelatedSpas):
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
  {posts.map(post => <BlogCard key={post.slug} post={post} />)}
</div>
```
