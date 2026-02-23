# Implementation Plan: Locations Listing Page (`/locations`)

## Overview

Create a `/locations` page that lists all 13 Lake District spa locations as cards. The page uses a short hero (homepage style), a responsive grid of location cards, the existing `FeaturedArticles` component, and the standard `Footer`. No intro text section. No Schema.org markup.

---

## Files to Create

### 1. `src/components/location/LocationsGrid.tsx`

New server component. Renders a responsive grid of all 13 location cards.

**Data sources:**
- Location names and slugs from `locationPageSlugs` in `src/lib/locationPages.ts`
- Images and taglines from a new `locationMetadata` export added to `src/lib/locationPages.ts` (see modification below)
- Spa counts computed at render time by filtering `spaData` against each location name

**Card design** (based on `RelatedLocations` card style):
- `rounded-2xl` card with white background and `border border-stone-200 shadow-sm`
- Top image at `aspect-[3/2]` with `object-cover` and a subtle gradient overlay
- Card body (p-5):
  - Location name in `font-serif text-xl text-stone-900`
  - Tagline in `text-sm text-stone-500 mt-1`
  - Spa count line in `text-xs font-bold uppercase tracking-[0.2em] text-amber-700 mt-3` — e.g. `"2 Spas"`
- `MapPin` icon (lucide-react, amber-600, top-right of card body)
- Full card is a `<Link>` to `/location/spas-in-{slug}/`
- No distance field

**Grid layout:**
- `grid-cols-1` (mobile) → `grid-cols-2` (sm) → `grid-cols-3` (md) → `grid-cols-4` (xl)
- `gap-6`
- Wraps in a `<section>` with `bg-soft-cream py-20`
- Section label above grid: amber line + uppercase tracking label "Lake District" then serif heading "Browse Spa Locations"

---

### 2. `src/app/locations/page.tsx`

Static page file. Server component.

**Metadata export:**
```
title: "Spa Locations in the Lake District | Lake District Spas"
description: "Browse all Lake District spa locations. Find spas in Windermere, Ambleside, Grasmere and more."
```

**Page structure:**
```
<Header />
<main>
  <LocationsHero />     {/* inline hero component, see below */}
  <LocationsGrid />
  <FeaturedArticles />
</main>
<Footer />
```

**Hero** (inline, not a separate file — same pattern as `src/components/Hero.tsx`):
- Image: `/images/blog/lake-district-spas_blog-hotel-spa-extension-golden-hour.jpg`
- Alt text: descriptive alt for that image
- Height: `h-[300px] md:h-[400px]` (matches homepage hero)
- Dark overlay: `bg-gradient-to-b from-foreground/40 to-foreground/70`
- Copy:
  - `<h1>` (serif): `"Lake District Spa Locations"`
  - `<p>` (subheading): `"Browse spas by area"`
  - No description line (per Q7/Q8 answers — keep it lean)

---

## Files to Modify

### 3. `src/lib/locationPages.ts`

Add a new `locationMetadata` export — an array of objects with `name`, `slug`, `image`, and `tagline` for all 13 locations. The existing `locationPageSlugs` record and helper functions remain untouched.

**Data to add:**

| Name | Slug | Image | Tagline |
|---|---|---|---|
| Windermere | windermere | `/images/locations/windermere-lake-district-spa-breaks.jpg` | England's largest lake, with world-class spas to match |
| Ambleside | ambleside | `/images/locations/ambleside-lake-district-spa-breaks.jpg` | A charming fell-side town with tranquil spa retreats |
| Bowness-on-Windermere | bowness-on-windermere | `/images/locations/bowness-on-windermere-lake-district-spa-breaks.jpg` | Lakeside village with boutique wellness escapes |
| Grasmere | grasmere | `/images/locations/grasmere-lake-district-spa-breaks.jpg` | Wordsworth's village, surrounded by dramatic fells |
| Borrowdale | borrowdale | `/images/locations/borrowdale-valley-lake-district-spa-breaks.jpg` | A secluded valley of ancient oak woods and quiet spas |
| Great Langdale | great-langdale | `/images/locations/great-langdale-lake-district-spa-breaks.jpg` | Wild fell country at the heart of the Lake District |
| Ullswater | ullswater | `/images/locations/ullswater-lake-district-spa-breaks.jpg` | England's most beautiful lake and outstanding spa destinations |
| Bassenthwaite | bassenthwaite | `/images/locations/bassenthwaite-lake-district-spa-breaks.jpg` | Remote lakeside tranquillity in the northern Lakes |
| Penrith | penrith | `/images/locations/penrith-lake-district-spa-breaks.jpg` | The gateway to the Lake District, close to Ullswater |
| Newby Bridge | newby-bridge | `/images/locations/newby-bridge-lake-district-spa-breaks.jpg` | Where the southern Lakes meet open countryside |
| Backbarrow | backbarrow | `/images/locations/backbarrow-lake-district-spa-breaks.jpg` | A quiet corner of the Furness Fells, near Windermere |
| Grange-over-Sands | grange-over-sands | `/images/locations/grange-over-sands-lake-district-spa-breaks.jpg` | An elegant Edwardian resort town on Morecambe Bay |
| Appleby-in-Westmorland | appleby-in-westmorland | `/images/locations/appleby-in-westmorland-lake-district-spa-breaks.jpg` | A historic market town on the edge of the Lakes |

**TypeScript type:**
```ts
export interface LocationMeta {
  name: string;
  slug: string;
  image: string;
  tagline: string;
}

export const locationMetadata: LocationMeta[] = [ ... ];
```

---

### 4. `src/app/sitemap.ts`

Add a single new entry in the existing pattern, inserted alongside `aboutPage`/`blogPage` etc.:

```ts
const locationsPage = {
  url: `${baseUrl}/locations`,
  lastModified: new Date(),
  changeFrequency: 'monthly' as const,
  priority: 0.8,
};
```

Add `locationsPage` to the returned array.

---

## Implementation Order

1. **`src/lib/locationPages.ts`** — add `LocationMeta` type and `locationMetadata` array (no breaking changes)
2. **`src/components/location/LocationsGrid.tsx`** — create grid component consuming the new data
3. **`src/app/locations/page.tsx`** — create page file
4. **`src/app/sitemap.ts`** — add `/locations` entry

---

## Notes & Constraints

- The hero image path begins with `/images/blog/...` — verify the file exists at `public/images/blog/lake-district-spas_blog-hotel-spa-extension-golden-hour.jpg` before implementing.
- Borrowdale's image filename is `borrowdale-valley-lake-district-spa-breaks.jpg` (note the "valley"), not `borrowdale-lake-district-spa-breaks.jpg` — confirmed from location page source.
- Spa counts are computed dynamically (filter `spaData` by `location === name`) — no hardcoded numbers.
- No nav change is required (user didn't request a header link). The page will be discoverable via the footer and sitemap.
- No Schema.org structured data on this page.
- `LocationsGrid` is a server component — no `'use client'` directive needed.
- The existing tests do not cover location listing pages, so no test changes are needed.
