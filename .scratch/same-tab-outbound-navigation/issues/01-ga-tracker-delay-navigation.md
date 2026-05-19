Status: completed

## Parent

`.scratch/same-tab-outbound-navigation/PRD.md`

## What to build

Update the GA outbound click tracker (embedded in the `GoogleAnalytics` component) to intercept same-tab navigation for tracked booking links and ensure the analytics event dispatches before the page unloads.

For HTTP/HTTPS external links that have a `data-spa-id` attribute: call `event.preventDefault()` to stop the browser navigating immediately, push the `spa_outbound_click` event to `dataLayer`, then after a 200ms delay navigate via `window.location.href`.

For `mailto:` and `tel:` links with `data-spa-id`: push the event to `dataLayer` only — do not call `preventDefault` or redirect. These open native apps and do not cause a page unload, so the event is never at risk.

For links without `data-spa-id`: no change — the tracker returns early as it does today.

The `dataLayer` event shape is unchanged: `{ event: 'spa_outbound_click', spa_id, click_intent, product_name }`.

Add the following unit tests to the existing `GoogleAnalytics` test file:

- `preventDefault` is called on click of an HTTP/HTTPS external link with `data-spa-id`
- Navigation fires after 200ms: `window.location.href` is set to the link's href after advancing fake timers by 200ms
- Navigation does not fire before 200ms: at 199ms `window.location.href` has not been set
- `mailto:` links: GA event fires, `preventDefault` is not called, no redirect occurs
- `tel:` links: GA event fires, `preventDefault` is not called, no redirect occurs

Use `vi.useFakeTimers()` and `vi.advanceTimersByTime()`. Follow the existing `initializeClickTracker` helper pattern and `dataLayer` mock setup already in that test file.

## Acceptance criteria

- [x] HTTP/HTTPS external links with `data-spa-id` have `preventDefault` called on click
- [x] Navigation to the correct URL occurs after exactly 200ms
- [x] Navigation does not occur before 200ms has elapsed
- [x] `mailto:` links fire the GA event but are not intercepted (no `preventDefault`, no redirect)
- [x] `tel:` links fire the GA event but are not intercepted (no `preventDefault`, no redirect)
- [x] All existing `GoogleAnalytics` tests continue to pass
- [x] 5 new unit tests added and passing

## Blocked by

None — can start immediately.
