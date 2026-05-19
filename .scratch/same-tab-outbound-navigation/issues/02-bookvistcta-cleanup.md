Status: completed

## Parent

`.scratch/same-tab-outbound-navigation/PRD.md`

## What to build

Update the main Spa booking CTA component to remove same-tab navigation attributes and the misleading external link icon.

For every `<a>` element in this component (hotel stay, day pass booking, treatment booking, and the website fallback):
- Remove `target="_blank"`
- Remove `rel="noopener noreferrer"` entirely
- Remove the `ExternalLink` Lucide icon from the button content

The navigation behaviour (delayed same-tab redirect) is handled centrally by the GA outbound click tracker — no click handler logic is needed in this component.

## Acceptance criteria

- [x] No `<a>` element in the component has `target="_blank"`
- [x] No `<a>` element in the component has a `rel` attribute
- [x] The `ExternalLink` icon is removed from all booking buttons
- [x] All booking buttons retain their `data-spa-id` and `data-click-intent` attributes
- [x] The `ExternalLink` import is removed if no longer used in the file
- [x] Existing tests for this component continue to pass

## Blocked by

`.scratch/same-tab-outbound-navigation/issues/01-ga-tracker-delay-navigation.md`
