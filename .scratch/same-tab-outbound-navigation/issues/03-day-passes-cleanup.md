Status: completed

## Parent

`.scratch/same-tab-outbound-navigation/PRD.md`

## What to build

Update the Day Passes section component and the Day Pass card component to remove same-tab navigation attributes and the misleading external link icon.

Affected links across both components:
- The section-level "Book Day Pass" CTA (links to `dayPassBookingUrl`)
- The per-card "More info" inline link (links to `dayPassUrl`)
- The per-card "Book Pass" button (links to `bookingUrl`)
- The per-card "Email Us" button (links to `mailto:bookingEmail`) — remove `target` and `rel` only; no icon to remove here

For each of these `<a>` elements:
- Remove `target="_blank"`
- Remove `rel="noopener noreferrer"` entirely
- Remove the `ExternalLink` Lucide icon from button/link content where present

The navigation behaviour is handled centrally by the GA outbound click tracker — no click handler logic is needed in these components.

## Acceptance criteria

- [x] No `<a>` element in either component has `target="_blank"`
- [x] No `<a>` element in either component has a `rel` attribute
- [x] The `ExternalLink` icon is removed from all booking buttons and inline links where it appeared
- [x] All booking links retain their `data-spa-id`, `data-click-intent`, and `data-product-name` attributes
- [x] The `ExternalLink` import is removed from each file if no longer used
- [x] Existing tests for these components continue to pass

## Blocked by

`.scratch/same-tab-outbound-navigation/issues/01-ga-tracker-delay-navigation.md`
