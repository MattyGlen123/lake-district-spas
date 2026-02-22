# SEO Audit Implementation Plan

Source: `.claude/contents-in/seo-report.md` (HREF audit)

---

## Overview of Issues

| #   | Issue                                           | Pages Affected | Priority  |
| --- | ----------------------------------------------- | -------------- | --------- |
| 1   | Meta descriptions too long (>160 chars)         | 11 pages       | High      |
| 2   | Page titles not matching SERP (Google rewrites) | 4 pages        | Medium    |
| 3   | SERP title changed notifications                | 2 pages        | Info only |
| 4   | Meta description changed notification           | 1 page         | No action |
| 5   | Indexable page not in sitemap                   | 1 page         | High      |

---

## Issue 1 — Meta Descriptions Too Long

All descriptions must be ≤160 characters. Changes are ordered by file type.

### 1a. Spa Detail Pages

**File**: `src/data/spas.ts` — `metaDescription` field for Low Wood Bay

|                          |                                                                                                                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page**                 | `/spa/low-wood-bay-spa`                                                                                                                                                       |
| **Current** (171 chars)  | `Windermere's premium spa with a complimentary leisure pool for hotel guests, plus a paid thermal journey with two outdoor infinity pools and stunning lake views. 16+ only.` |
| **Proposed** (160 chars) | `Windermere's premium spa: free leisure pool for hotel guests, plus a paid thermal journey with two outdoor infinity pools and stunning lake views. 16+ only.`                |

Note: "16+ only." has been kept — it's a meaningful differentiator (one of the few non-18+ spas in the region) and fits within the 160-char limit.

---

### 1b. Location Pages

Each is a static `export const metadata` in its own page file.

**Page**: `/location/spas-in-newby-bridge`
**File**: `src/app/location/spas-in-newby-bridge/page.tsx`
Current (167 chars): `Discover spas in Newby Bridge at the southern tip of Lake Windermere. Outdoor thermal bathing, indoor pools and Elemis treatments where the lake meets the River Leven.`
Proposed (154 chars): `Spas in Newby Bridge at the southern tip of Lake Windermere. Outdoor thermal bathing, indoor pools and Elemis treatments where lake meets the River Leven.`

---

**Page**: `/location/spas-in-bassenthwaite`
**File**: `src/app/location/spas-in-bassenthwaite/page.tsx`
Current (168 chars): `Discover Armathwaite Hall Spa on Bassenthwaite Lake. Outdoor infinity pools, Amethyst Crystal Cave steam room, and 400 acres of deer park in the northern Lake District.`
Proposed (159 chars): `Armathwaite Hall Spa on Bassenthwaite Lake. Outdoor infinity pools, Amethyst Crystal Cave steam room, and 400 acres of deer park in the northern Lake District.`

---

**Page**: `/location/spas-in-penrith`
**File**: `src/app/location/spas-in-penrith/page.tsx`
Current (163 chars): `Discover North Lakes Hotel & Spa in Penrith, gateway to Ullswater and the northern Lake District. Pool, thermal facilities and Caudalie treatments just off the M6.`
Proposed (154 chars): `North Lakes Hotel & Spa in Penrith, gateway to Ullswater and the northern Lake District. Pool, thermal facilities and Caudalie treatments just off the M6.`

---

**Page**: `/location/spas-in-grasmere`
**File**: `src/app/location/spas-in-grasmere/page.tsx`
Current (167 chars): `Discover spas in Grasmere, Wordsworth's beloved Lake District village. Two spa hotels offer thermal pools, saunas and treatments between literary sites and fell walks.`
Proposed (157 chars): `Spas in Grasmere, Wordsworth's beloved Lake District village. Two spa hotels with thermal pools, saunas and treatments between literary sites and fell walks.`

---

**Page**: `/location/spas-in-grange-over-sands`
**File**: `src/app/location/spas-in-grange-over-sands/page.tsx`
Current (163 chars): `Discover spas in Grange-over-Sands, an Edwardian coastal town on Morecambe Bay. Two Victorian spa hotels offer pools, thermal suites and treatments with bay views.`
Proposed (145 chars): `Spas in Grange-over-Sands, an Edwardian town on Morecambe Bay. Two Victorian spa hotels with pools, thermal suites and treatments with bay views.`

---

**Page**: `/location/spas-in-bowness-on-windermere`
**File**: `src/app/location/spas-in-bowness-on-windermere/page.tsx`
Current (162 chars): `Discover two spas in Bowness-on-Windermere at the heart of Lake Windermere. Historic lakeside elegance at the Old England or poolside prosecco at the Lakes Hotel.`
Proposed (152 chars): `Two spas in Bowness-on-Windermere at the heart of Lake Windermere. Historic lakeside elegance at the Old England or poolside prosecco at the Lakes Hotel.`

---

**Page**: `/location/spas-in-great-langdale`
**File**: `src/app/location/spas-in-great-langdale/page.tsx`
Current (167 chars): `Discover Brimstone Spa in Great Langdale, the Lake District's premier walking valley. Seven thermal experiences beneath the Langdale Pikes, exclusive to estate guests.`
Proposed (158 chars): `Brimstone Spa in Great Langdale, the Lake District's premier walking valley. Seven thermal experiences beneath the Langdale Pikes, exclusive to estate guests.`

---

### 1c. Blog Posts

Meta descriptions are in MDX frontmatter (`seoDescription` field).

> **OG description check (required before editing):** The SEO report calls out that Facebook uses the meta description for link previews only when no `og:description` is set. In Next.js App Router, `metadata.description` and `metadata.openGraph.description` are separate fields. Before editing each page, check whether an `openGraph.description` field exists in the page file or MDX frontmatter. If it does, update both. For blog posts, the `generateMetadata()` function in `src/app/blog/[slug]/page.tsx` should be checked to confirm whether it sets `openGraph.description` independently.

**Page**: `/blog/spa-resort-couples-getaway`
**File**: `content/blog/spa-resort-couples-getaway.mdx`
Current (175 chars): `Find the best Lake District spa resort for a couples getaway. Swim-through pools, riverside jacuzzis, couples treatments, and thermal circuits across four standout properties.`
Proposed (159 chars): `The best Lake District spa resorts for couples. Swim-through pools, riverside jacuzzis, couples treatments and thermal circuits across four standout properties.`

---

**Page**: `/blog/thermal-suites-explained`
**File**: `content/blog/thermal-suites-explained.mdx`
Current (167 chars): `Learn what a thermal suite includes at Lake District spas, with saunas, steam rooms, ice fountains, and heated loungers explained plus tips and the best spas to visit.`
Proposed (148 chars): `What a thermal suite includes at Lake District spas — saunas, steam rooms, ice fountains and heated loungers explained, plus the best spas to visit.`

---

### 1d. Couples Spa Page

**File**: `src/app/couples-spa-lake-district/page.tsx`

**Page**: `/couples-spa-lake-district`
Current (168 chars): `Outdoor infinity pools, lakeside hot tubs, and thermal suites designed for reconnection. Discover our curated selection of the Lake District's most romantic spa hotels.`
Proposed (152 chars): `Outdoor infinity pools, lakeside hot tubs and thermal suites for couples. Discover our curated selection of the Lake District's most romantic spa hotels.`

---

## Issue 2 — Page Titles Not Matching SERP

Google is rewriting these titles, indicating it doesn't trust them. Fix by making titles accurate, non-keyword-stuffed, and including the brand name where missing.

### 2a. Homepage

**File**: `src/app/layout.tsx`

|                   |                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------- |
| **Current title** | `Lake District Spa Hotels & Day Spas - Complete Access Guide`                               |
| **Google SERP**   | `Lake District Spas 2025 - Complete Access Guide`                                           |
| **Problem**       | Google sees "Spa Hotels & Day Spas" as keyword-stuffed; it drops it and adds freshness year |
| **Proposed**      | `Lake District Spas — Hotels, Day Passes & Treatments Guide`                                |

The brand-first format aligns with what Google is already preferring. Keep the em dash for readability.

---

### 2b. Appleby-in-Westmorland Location Page

**File**: `src/app/location/spas-in-appleby-in-westmorland/page.tsx`

|                   |                                                                             |
| ----------------- | --------------------------------------------------------------------------- |
| **Current title** | `Spas in Appleby-in-Westmorland \| Lake District Spas`                      |
| **Google SERP**   | `Spas in Appleby-in-Westmorland - Lake District Spas`                       |
| **Problem**       | Google replaces `\|` with `-` — minor preference for dash as separator here |
| **Proposed**      | `Spas in Appleby-in-Westmorland - Lake District Spas`                       |

Note: Most other location pages use `|` and Google accepts them. This page's keyword (`appleby manor spa`, position 54) may also benefit from keeping the title exactly as Google is already showing it.

---

### 2c. Keswick Spas Guide

**File**: `content/blog/keswick-spas-guide.mdx`

**Frontmatter field to update**: Open the MDX file first. If a `seoTitle` field is present, update that. If only `title` exists (no `seoTitle`), update `title`. The blog's `generateMetadata()` uses `seoTitle` with `title` as fallback — updating the wrong field has no effect.

|                   |                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------- |
| **Current title** | `Spas Near Keswick: Complete Guide to Borrowdale & Bassenthwaite Spas`                 |
| **Google SERP**   | `Spas Near Keswick: Your Complete Guide - Lake District Spas`                          |
| **Problem**       | Title lacks brand name — Google appends it. 69 chars is long for a title without brand |
| **Proposed**      | `Spas Near Keswick: Complete Guide \| Lake District Spas`                              |

---

### 2d. Windermere Spas Guide

**File**: `content/blog/windermere-spas-guide.mdx`

**Frontmatter field to update**: Same rule as 2c — check for `seoTitle` first; update `title` only if `seoTitle` is absent.

|                   |                                                                            |
| ----------------- | -------------------------------------------------------------------------- |
| **Current title** | `Windermere Spa Guide: Best Spas on Lake Windermere`                       |
| **Google SERP**   | `Windermere Spa Guide 2025 - Lake District Spas`                           |
| **Problem**       | Title lacks brand name — Google appends it and adds year freshness         |
| **Proposed**      | `Windermere Spa Guide: Best Spas on Lake Windermere \| Lake District Spas` |

---

## Issue 3 — SERP Title Changed (Notifications)

These are informational notices only.

- **`/`** — Overlaps with Issue 2a above. Action taken there.
- **`/location/spas-in-great-langdale`** — Google has reverted to using our original title (`|` format). **No action needed.** Note: position moved from 30 → 42 (a slight ranking dip, not an improvement — lower numbers are better in Google ranking). This is worth monitoring but not a reason to change the title, since Google is now accepting our format.

---

## Issue 4 — Meta Description Changed

- **`/spa/low-wood-bay-spa`** — The description changed because the spa data was intentionally updated (guest access policy changed: leisure area is now shown as complimentary). This is expected behaviour. **No action needed** beyond the length fix in Issue 1a above.

---

## Issue 5 — Indexable Page Not in Sitemap

**File**: `src/app/sitemap.ts`

**Page**: `/couples-spa-lake-district`
Has 44 inlinks and is indexable but is absent from the sitemap.

Add an entry to the `MetadataRoute.Sitemap` array in `sitemap.ts`:

```ts
{
  url: `${baseUrl}/couples-spa-lake-district`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.8,
},
```

The priority of `0.8` is appropriate — this is a high-value editorial page comparable to `/spa-days`.

---

## Implementation Order

**Pre-flight**: Check `src/app/blog/[slug]/page.tsx` `generateMetadata()` to confirm whether `openGraph.description` is set independently from `description`. If so, all blog/page metadata edits below must update both fields.

1. **`src/app/sitemap.ts`** — Add couples page (5 min, no risk)
2. **`src/data/spas.ts`** — Shorten Low Wood Bay `metaDescription` (5 min)
3. **`src/app/couples-spa-lake-district/page.tsx`** — Shorten description; also check and update `openGraph.description` if set (5 min)
4. **`src/app/layout.tsx`** — Update homepage title (5 min, verify nothing else inherits this)
5. **8× location page files** — Shorten descriptions in each; check for `openGraph.description` in each file (30 min total)
   - `spas-in-newby-bridge/page.tsx`
   - `spas-in-bassenthwaite/page.tsx`
   - `spas-in-penrith/page.tsx`
   - `spas-in-grasmere/page.tsx`
   - `spas-in-grange-over-sands/page.tsx`
   - `spas-in-bowness-on-windermere/page.tsx`
   - `spas-in-great-langdale/page.tsx`
   - `spas-in-appleby-in-westmorland/page.tsx` (title change to dash too)
6. **`content/blog/spa-resort-couples-getaway.mdx`** — Shorten `seoDescription` (5 min)
7. **`content/blog/thermal-suites-explained.mdx`** — Shorten `seoDescription` (5 min)
8. **`content/blog/keswick-spas-guide.mdx`** — Open file; update `seoTitle` if present, else update `title` (5 min)
9. **`content/blog/windermere-spas-guide.mdx`** — Open file; update `seoTitle` if present, else update `title` (5 min)
10. **Validation** — Run `npm run typecheck` and `npm run build` to confirm no TypeScript errors. Manually verify the final character count of each new description (≤160) before committing.

---

## Notes

- All proposed descriptions have been character-counted and are ≤160 chars.
- The pattern of removing "Discover" from location page descriptions (replacing with a direct opening) consistently saves ~9 chars and reads more naturally.
- Blog `seoTitle` additions follow the existing pattern used by other blog posts on the site — check `content/blog/*.mdx` to confirm the field name before editing.
- After deploying, re-submit the sitemap in Google Search Console to accelerate discovery of the couples page.
