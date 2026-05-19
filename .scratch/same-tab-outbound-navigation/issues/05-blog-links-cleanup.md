Status: completed

## Parent

`.scratch/same-tab-outbound-navigation/PRD.md`

## What to build

Update the blog post page to remove same-tab navigation attributes from all three external link types rendered in MDX content.

Affected link renderers in the blog page:

1. **MDX prose links** — the generic `<a>` renderer used for any external URL embedded in blog article body text (e.g. references, citations). Remove `target="_blank"` and `rel="noopener noreferrer"`.

2. **`DayPassLink` MDX component** — renders a tracked booking link for a specific Day Pass. Remove `target="_blank"` and `rel="noopener noreferrer"`. This link carries `data-spa-id` so the GA tracker handles delayed navigation.

3. **`TreatmentLink` MDX component** — renders a tracked booking link for a specific Treatment. Remove `target="_blank"` and `rel="noopener noreferrer"`. This link carries `data-spa-id` so the GA tracker handles delayed navigation.

No icons to remove in this file — none of these renderers use the `ExternalLink` icon.

## Acceptance criteria

- [x] MDX prose external links no longer have `target="_blank"` or `rel`
- [x] `DayPassLink` rendered anchors no longer have `target="_blank"` or `rel`
- [x] `TreatmentLink` rendered anchors no longer have `target="_blank"` or `rel`
- [x] `DayPassLink` and `TreatmentLink` retain their `data-spa-id`, `data-click-intent`, and `data-product-name` attributes
- [x] Existing blog page tests continue to pass

## Blocked by

`.scratch/same-tab-outbound-navigation/issues/01-ga-tracker-delay-navigation.md`
