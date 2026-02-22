# Related Locations Image Cards — Implementation Plan

## Overview

Add landscape hero images to the `RelatedLocations` component cards. Each related location slug maps directly to an existing image file at `/images/locations/{slug}-lake-district-spa-breaks.jpg`. One exception: `borrowdale` maps to `borrowdale-valley-lake-district-spa-breaks.jpg`.

## Image Mapping

All 13 locations have images at `/images/locations/`:

| Slug | Image filename |
|---|---|
| `windermere` | `windermere-lake-district-spa-breaks.jpg` |
| `bowness-on-windermere` | `bowness-on-windermere-lake-district-spa-breaks.jpg` |
| `ambleside` | `ambleside-lake-district-spa-breaks.jpg` |
| `appleby-in-westmorland` | `appleby-in-westmorland-lake-district-spa-breaks.jpg` |
| `backbarrow` | `backbarrow-lake-district-spa-breaks.jpg` |
| `bassenthwaite` | `bassenthwaite-lake-district-spa-breaks.jpg` |
| `borrowdale` | **`borrowdale-valley-lake-district-spa-breaks.jpg`** ← exception |
| `grange-over-sands` | `grange-over-sands-lake-district-spa-breaks.jpg` |
| `grasmere` | `grasmere-lake-district-spa-breaks.jpg` |
| `great-langdale` | `great-langdale-lake-district-spa-breaks.jpg` |
| `newby-bridge` | `newby-bridge-lake-district-spa-breaks.jpg` |
| `penrith` | `penrith-lake-district-spa-breaks.jpg` |
| `ullswater` | `ullswater-lake-district-spa-breaks.jpg` |

Images are 1200×800 (3:2 ratio).

## Changes Required

### 1. `src/components/location/RelatedLocations.tsx`

**Interface update** — add optional `image` field:

```ts
interface RelatedLocation {
  name: string;
  slug: string;
  distance: string;
  image?: string;
}
```

**Component redesign** — replace the current text-only card with an image card:

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

// Card structure:
// - rounded-2xl overflow-hidden wrapper
// - Top: relative aspect-[3/2] image section with subtle bottom gradient
// - Bottom: p-5 content area with location name (serif) + distance
```

Card layout:

```
┌─────────────────────────────────┐
│                                 │
│      [landscape image]          │  ← aspect-[3/2], object-cover
│                                 │
│  ██████████████████████████████ │  ← subtle gradient fade-to-white at bottom
├─────────────────────────────────┤
│  Location Name          📍      │  ← serif text-xl + MapPin icon
│  6 miles north                  │  ← text-sm text-stone-500
└─────────────────────────────────┘
```

Full updated component:

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

interface RelatedLocation {
  name: string;
  slug: string;
  distance: string;
  image?: string;
}

interface RelatedLocationsProps {
  currentLocation: string;
  locations: RelatedLocation[];
  backgroundColor?: string;
}

export default function RelatedLocations({
  currentLocation: _currentLocation,
  locations,
  backgroundColor = 'bg-[#F6F7F6]',
}: RelatedLocationsProps) {
  return (
    <section className={`${backgroundColor} py-20`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-px w-12 bg-amber-700 opacity-30" />
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
            Nearby Areas
          </span>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-8">
          Explore More of the Lake District
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locations.map((location) => (
            <Link
              key={location.slug}
              href={`/location/spas-in-${location.slug}/`}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm"
            >
              {location.image && (
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={location.image}
                    alt={`Spa breaks in ${location.name}, Lake District`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                </div>
              )}
              <div className="flex items-start justify-between p-5">
                <div>
                  <h3 className="font-serif text-xl text-stone-900 mb-1">
                    {location.name}
                  </h3>
                  <p className="text-sm text-stone-500">{location.distance}</p>
                </div>
                <MapPin className="h-5 w-5 text-amber-600 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 2. All 13 location page files

Add `image` to each entry in the `relatedLocations` array. Each page has 3 related locations.

The image path pattern: `/images/locations/{slug}-lake-district-spa-breaks.jpg`
Exception: `borrowdale` slug → `borrowdale-valley-lake-district-spa-breaks.jpg`

**Pages to update:**

1. `src/app/location/spas-in-windermere/page.tsx`
2. `src/app/location/spas-in-bowness-on-windermere/page.tsx`
3. `src/app/location/spas-in-ambleside/page.tsx`
4. `src/app/location/spas-in-appleby-in-westmorland/page.tsx`
5. `src/app/location/spas-in-backbarrow/page.tsx`
6. `src/app/location/spas-in-bassenthwaite/page.tsx`
7. `src/app/location/spas-in-borrowdale/page.tsx`
8. `src/app/location/spas-in-grange-over-sands/page.tsx`
9. `src/app/location/spas-in-grasmere/page.tsx`
10. `src/app/location/spas-in-great-langdale/page.tsx`
11. `src/app/location/spas-in-newby-bridge/page.tsx`
12. `src/app/location/spas-in-penrith/page.tsx`
13. `src/app/location/spas-in-ullswater/page.tsx`

Example diff for `spas-in-windermere/page.tsx`:

```diff
 const relatedLocations = [
   {
     name: 'Bowness on Windermere',
     slug: 'bowness-on-windermere',
     distance: '1 mile south',
+    image: '/images/locations/bowness-on-windermere-lake-district-spa-breaks.jpg',
   },
-  { name: 'Ambleside', slug: 'ambleside', distance: '6 miles north' },
-  { name: 'Newby Bridge', slug: 'newby-bridge', distance: '6 miles south' },
+  { name: 'Ambleside', slug: 'ambleside', distance: '6 miles north', image: '/images/locations/ambleside-lake-district-spa-breaks.jpg' },
+  { name: 'Newby Bridge', slug: 'newby-bridge', distance: '6 miles south', image: '/images/locations/newby-bridge-lake-district-spa-breaks.jpg' },
 ];
```

## Notes

- The `image` field is optional (`image?`) so the component degrades gracefully if an image is missing — it falls back to the text-only card (no image section renders).
- The `borrowdale` slug is the only exception to the naming convention. Pages referencing Borrowdale as a related location must explicitly use `borrowdale-valley-lake-district-spa-breaks.jpg`.
- No new images needed — all 13 already exist in `/public/images/locations/`.
- `sizes="(max-width: 768px) 100vw, 33vw"` is appropriate since cards stack to full-width on mobile and show 3-up on desktop.
- No `priority` on these images — they are below the fold.
