# Clarifying Questions — Location FAQs Skill

## 1. Location page structure & linking

The location pages currently have three sections: `LocationHero`, `LocationIntro`, and `LocationFeaturedSpas`. There's no FAQ component rendered on them yet.

- **Where should the FAQs sit on the location page?** After `LocationFeaturedSpas` (mirroring how spa FAQs sit after the main content)? Yes

- **Should I create a new `LocationFAQs` component, or reuse the existing `FAQs` component from the spa pages?** The existing `FAQs` component already handles Schema.org markup and the `FAQ[]` interface — it could likely be reused as-is. Yes, reuse it

## 2. Internal linking within location FAQs

Spa FAQs link to on-page anchors (`#treatments`, `#day-passes`, `#thermal`, etc.) because those sections exist on the spa detail page. Location pages don't have those sections.

- **Should location FAQ links point to the individual spa detail pages instead?** e.g. `<Link href="/spa/low-wood-bay#treatments">` rather than `#treatments`. If a treatment or day pass is included in a location FAQ then it should link to the treatment or day pass on the spa detail page e.g "/spa/low-wood-bay-spa#low-wood-bay-sail-spa"

- **Should location FAQs also link to other location pages** where relevant? e.g. a Windermere FAQ mentioning nearby Bowness spas could link to `/location/spas-in-bowness-on-windermere`. Yes

## 3. Function signature for location FAQ generators

Spa FAQ generators receive a single `Spa` object: `getSpa6FAQs(spa: Spa): FAQ[]`. Location FAQs will need access to multiple spas for that location.

- **Should the generator function receive the array of spas for that location?** e.g. `getWindermereFAQs(spas: Spa[]): FAQ[]` — or should it receive a location slug/name and look up spas internally from `spaData`? An array of spas for that location is fine
- **Should there be a location identifier type** (e.g. a `Location` type or just the string key from `locationPageSlugs`)? Use the string key

## 4. Helper reuse & new helpers

The existing `helpers.ts` in `src/data/faqs/` has helpers scoped to a single spa (they take `spaId`). Location FAQs will need to aggregate across multiple spas — e.g. "prices range from X to Y across Windermere spas" or "there are N thermal facilities across the area".

- **Should I add new location-level helpers to the existing `helpers.ts`, or create a separate `src/data/location-faqs/helpers.ts`?** Keeping them separate matches the directory separation you described, but some helpers (like `getDayPassPrice`) will be reused directly. Create location specfic helper and reuse existing ones where possible

- **Are there specific aggregate data points you want surfaced?** e.g. cheapest day pass across the location, total number of treatments, range of age policies. No, that can all depend on the keyword and then the decision can be made on which data is relevant and should be included

## 5. Avoiding overlap with spa FAQs

You mentioned location FAQs should target different keywords and not overlap with spa FAQs.

- **Is the overlap avoidance purely at the keyword/topic level** (i.e. don't target the same search queries), or should the FAQ content also avoid repeating the same factual statements that appear in spa FAQs? Just the keyword/topic, if the same facts are valuable for a different keyword, then it's fine to reuse them

- **Should the skill actively read the existing spa FAQ files for the relevant spas** as part of its analysis step, so it can list what's already covered and steer keyword suggestions away from those topics? Yes

## 6. Number of keywords and FAQ count

You said max 8 keywords to research and 4 FAQs per location.

- **Should all 4 FAQs map to researched keywords, or can some be editorially chosen** (e.g. a general "which spa in [location] is best for couples?" that may not map to a specific keyword)? Stick to the keywords as much as possible.

- **If the keyword research comes back thin for a location** (e.g. only 1-2 viable low-competition keywords), should we still aim for 4 FAQs, or reduce to match what's supported by data? Still aim for 4 FAQs, just extend the scope to target the keywords with medium competition

## 7. File naming convention

- **Should files follow the location slug** (e.g. `windermere-faqs.tsx`, `bowness-on-windermere-faqs.tsx`), or use a numeric ID system like the spa FAQs (`spa-1-faqs.tsx`)? slug based is fine

## 8. Rollout scope

- **Are we building this to work across all 13 locations, or starting with a subset?** Some locations only have 1 spa (e.g. Backbarrow, Borrowdale) — the FAQ content would be quite limited and might overlap heavily with that spa's existing FAQs.
- **Is there a minimum number of spas a location needs before it warrants location FAQs?** No, we still want location faqs for all locations.
