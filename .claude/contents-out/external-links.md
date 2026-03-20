# External Links — Implementation Plan

## Summary

Remove `target="_blank"` and `rel="noopener noreferrer"` from all external booking links across the site. The original requirement calls for a **brief delay before navigation** so analytics events have time to fire — this is satisfied by `navigator.sendBeacon()`, which queues the hit and guarantees delivery even after same-tab page unload, making a blocking delay unnecessary. Remove `ExternalLink` icons from all updated links. Update affected tests.

---

## 0. Analytics consistency audit (gap closure for R3)

Before touching any code, audit which links currently have `data-spa-id` (required for the tracker to fire) vs. which don't.

| Link location | Has `data-spa-id`? | Tracker fires? |
|---|---|---|
| `BookVisitCTA` — all 4 booking buttons | ✅ yes | ✅ |
| `DayPasses` — Book Day Pass CTA, More info, Book Pass | ✅ yes | ✅ |
| `DayPassCard` — More info, Book Pass | ✅ yes | ✅ |
| `Treatments` — Book Treatment CTA, Book Now (card) | ✅ yes | ✅ |
| `TreatmentPickCard` — Book Now | ✅ yes | ✅ |
| `blog/[slug]` — `DayPassLink` component | ✅ yes | ✅ |
| `blog/[slug]` — `TreatmentLink` component | ✅ yes | ✅ |
| `blog/[slug]` — generic MDX `a` renderer | ❌ no | ❌ intentional — general prose links in blog posts are not spa booking actions |

**Conclusion:** All booking/product links already carry `data-spa-id`. The blog's generic `a` renderer intentionally omits it (prose links in articles aren't conversion events). No data attribute backfill needed. The "inconsistency" in the original request refers to same-tab navigation causing GTM to miss the event before unload — sendBeacon fixes this.

---

## 1. GoogleAnalytics.tsx — Tracker rewrite

**File:** `src/components/GoogleAnalytics.tsx`

### Why sendBeacon replaces the delay

The original requirement asks for "a brief delay before navigation to allow time for the analytics custom events data to be fired and return successfully." With `target="_blank"` the old tab stays open so GTM has time to process the event — removing it breaks this. A `setTimeout` delay would work but blocks the user. `navigator.sendBeacon()` solves this without any delay: it queues the hit and the browser guarantees completion even after page unload, so the user navigates immediately with no lag.

The `spa-outbound-click-tracker` inline script currently calls `window.dataLayer.push()` synchronously on click. With same-tab navigation the browser may unload before GTM processes the event. The fix: keep `dataLayer.push()` as primary and add `sendBeacon()` as the guaranteed-delivery fallback.

### Prerequisite — GA4 credentials

> ⚠️ **Blocker:** Retrieve the GA4 Measurement ID (format `G-XXXXXXXXXX`) from GTM container `GTM-55LJRB7F`. The Measurement Protocol also requires an API Secret from GA4 Admin → Data Streams → Measurement Protocol. Both are embedded in the tracker script (not sensitive — measurement ID is already in page source; API secret only allows event ingestion, not data read).
>
> **If credentials are unavailable:** Use the fallback approach in section 1b instead.

### 1a. Tracker with sendBeacon (preferred)

```javascript
(function() {
  var GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // replace with real value
  var GA4_API_SECRET = 'XXXXXXXXXXXX';      // replace with real value

  window.dataLayer = window.dataLayer || [];

  function isExternalUrl(url) { /* unchanged from current implementation */ }
  function isProtocolHandler(url) { /* unchanged */ }

  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (!link || !link.href) return;

    var href = link.href;
    var isExternal = isExternalUrl(href);
    var isProtocol = isProtocolHandler(href);
    if (!isExternal && !isProtocol) return;

    var spaId = link.dataset.spaId || '';
    if (!spaId) return;

    var clickIntent = link.dataset.clickIntent || 'external-link';
    var productName = link.dataset.productName || 'none';

    var payload = {
      event: 'spa_outbound_click',
      spa_id: spaId,
      click_intent: clickIntent,
      product_name: productName
    };

    // Primary: dataLayer for GTM (fires if GTM has time before unload)
    window.dataLayer.push(payload);

    // Guaranteed delivery: sendBeacon survives same-tab page unload
    // This replaces the need for a navigation delay — no user-visible lag
    if (navigator.sendBeacon) {
      var beaconUrl = 'https://www.google-analytics.com/mp/collect'
        + '?measurement_id=' + GA4_MEASUREMENT_ID
        + '&api_secret=' + GA4_API_SECRET;
      navigator.sendBeacon(
        beaconUrl,
        JSON.stringify({
          client_id: (document.cookie.match(/_ga=GA\d+\.\d+\.(\d+\.\d+)/) || ['','unknown'])[1],
          events: [{
            name: 'spa_outbound_click',
            params: {
              spa_id: spaId,
              click_intent: clickIntent,
              product_name: productName
            }
          }]
        })
      );
    }
  });
})();
```

> **Note on `client_id`:** Reads from the GA cookie to stitch hits into sessions. Falls back to `'unknown'` if the cookie pattern doesn't match — events still record but won't join existing sessions. A more robust option: expose `ga.getAll()[0].get('clientId')` via `window.gaClientId` in a GTM Custom JS variable at page load.

### 1b. Fallback — if GA4 credentials unavailable

If the Measurement ID or API Secret cannot be retrieved before implementation, use a **300ms setTimeout delay** instead. This blocks navigation briefly but guarantees GTM has time to process `dataLayer.push()`:

```javascript
document.addEventListener('click', function(e) {
  var link = e.target.closest('a');
  if (!link || !link.href) return;
  /* ... same external/protocol/spaId checks ... */

  // Prevent default navigation
  e.preventDefault();
  var destination = link.href;

  // Fire event first
  window.dataLayer.push({ event: 'spa_outbound_click', spa_id: spaId, click_intent: clickIntent, product_name: productName });

  // Navigate after GTM has time to flush (300ms is GTM's recommended minimum)
  setTimeout(function() { window.location.href = destination; }, 300);
});
```

> ⚠️ `e.preventDefault()` on `mailto:` and `tel:` links will suppress the OS dialog. Exclude protocol handlers from the delayed-navigation path — only apply the delay to `http/https` external URLs.

---

## 2. Component changes — remove `target="_blank"`

For each link: remove `target="_blank"`, remove `rel="noopener noreferrer"`, remove `<ExternalLink>` icon element. Remove `ExternalLink` from the `import` statement when no longer used anywhere in the file.

### 2a. `src/components/BookVisitCTA.tsx`

4 links to update:
- `hotelBookingUrl` → Book Stay button
- `dayPassBookingUrl` → Book Spa Day button
- `treatmentBookingUrl` → Book Treatment button
- `websiteUrl` fallback → Visit the Official Website

`ExternalLink` is only imported for these 4 links — remove from lucide-react import entirely.

### 2b. `src/components/DayPasses.tsx`

3 links to update:
- `spa.dayPassBookingUrl` → "Book Day Pass" CTA button
- `option.dayPassUrl` → "More info" inline link
- `option.bookingUrl` → "Book Pass" button

Remove `ExternalLink` from import. `option.bookingEmail` mailto link has no `target="_blank"` — leave unchanged.

### 2c. `src/components/DayPassCard.tsx`

2 links to update:
- `dayPass.dayPassUrl` → "More info" inline link
- `dayPass.bookingUrl` → "Book Pass" button

Remove `ExternalLink` from import. `dayPass.bookingEmail` mailto link — leave unchanged.

### 2d. `src/components/Treatments.tsx`

3 links to update:
- `spa.treatmentBookingUrl` → "Book Treatment" section CTA
- `treatment.bookingUrl` → "Book Now" inside TreatmentCard
- `spa.treatmentBookingUrl` fallback inside TreatmentCard → "Book Now"

Remove `ExternalLink` from import. `ChevronDown`, `Clock`, `Tag` remain in use — keep those. `spa.treatmentBookingPhone` tel link has no `target="_blank"` — leave unchanged.

### 2e. `src/components/TreatmentPickCard.tsx`

1 link to update:
- `spa.treatmentBookingUrl` → "Book Now" button

Remove `ExternalLink` from import. `spa.treatmentBookingPhone` tel link — leave unchanged.

### 2f. `src/app/blog/[slug]/page.tsx`

3 locations to update:

**Location 1 — MDX generic `a` component renderer (~line 196):**
```tsx
// Remove target="_blank" and rel="noopener noreferrer"
// Note: these links have no data-spa-id — tracker won't fire for them (intentional)
<a
  href={href}
  className="text-emerald-700 hover:text-emerald-900 underline font-medium"
  {...props}
>
  {children}
</a>
```

**Location 2 — `DayPassLink` component (~line 428):**
Remove `target="_blank"` and `rel="noopener noreferrer"`. Has `data-spa-id` — tracker fires. ✅

**Location 3 — `TreatmentLink` component (~line 461):**
Remove `target="_blank"` and `rel="noopener noreferrer"`. Has `data-spa-id` — tracker fires. ✅

---

## 3. Test updates

### 3a. `src/components/BookVisitCTA.test.tsx`

**Lines 90–96** assert `target="_blank"` — update:

```typescript
// BEFORE
it('booking links have target="_blank" and rel="noopener noreferrer"', () => {
  ...
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

// AFTER
it('booking links open in the same tab', () => {
  const spa = { ...baseSpa, hotelBookingUrl: 'https://hotel.com/book' };
  render(<BookVisitCTA spa={spa} />);
  const link = screen.getByRole('link', { name: /book stay/i });
  expect(link).not.toHaveAttribute('target', '_blank');
  expect(link).not.toHaveAttribute('rel', 'noopener noreferrer');
});
```

### 3b. `src/components/GoogleAnalytics.test.ts`

The existing test file has two helper functions — `initializeClickTracker()` and `initializeClickTrackerWithLocation()` — each ~80 lines duplicating the tracker logic. Both must be updated to add the `navigator.sendBeacon()` call after `dataLayer.push()`.

**Step 1 — Update both `initializeClickTracker` helpers** to add, after `win.dataLayer.push(...)`:

```typescript
if (navigator.sendBeacon) {
  navigator.sendBeacon(
    'https://www.google-analytics.com/mp/collect?measurement_id=G-XXXXXXXXXX&api_secret=XXXXXXXXXXXX',
    JSON.stringify({
      client_id: 'test-client-id',
      events: [{
        name: 'spa_outbound_click',
        params: { spa_id: spaId, click_intent: clickIntent, product_name: productName }
      }]
    })
  );
}
```

**Step 2 — Add `navigator.sendBeacon` mock to `beforeEach`:**

```typescript
let mockSendBeacon: ReturnType<typeof vi.fn>;

beforeEach(() => {
  // existing dataLayer setup...
  mockSendBeacon = vi.fn().mockReturnValue(true);
  Object.defineProperty(navigator, 'sendBeacon', {
    value: mockSendBeacon,
    writable: true,
    configurable: true,
  });
});
```

**Step 3 — Add new describe block** for sendBeacon-specific assertions:

```typescript
describe('navigator.sendBeacon delivery', () => {
  beforeEach(() => {
    initializeClickTracker();
  });

  it('calls sendBeacon on external link click with data-spa-id', () => {
    const link = document.createElement('a');
    link.setAttribute('data-spa-id', 'lodore-falls-spa');
    link.setAttribute('data-click-intent', 'book-stay');
    link.href = 'https://example.com/book';
    document.body.appendChild(link);
    link.click();

    expect(mockSendBeacon).toHaveBeenCalledTimes(1);
    const [url, body] = mockSendBeacon.mock.calls[0];
    expect(url).toContain('google-analytics.com/mp/collect');
    const parsed = JSON.parse(body as string);
    expect(parsed.events[0].name).toBe('spa_outbound_click');
    expect(parsed.events[0].params.spa_id).toBe('lodore-falls-spa');
    expect(parsed.events[0].params.click_intent).toBe('book-stay');
    expect(parsed.events[0].params.product_name).toBe('none');

    document.body.removeChild(link);
  });

  it('does not call sendBeacon when data-spa-id is absent', () => {
    const link = document.createElement('a');
    link.href = 'https://example.com/book';
    document.body.appendChild(link);
    link.click();

    expect(mockSendBeacon).not.toHaveBeenCalled();
    document.body.removeChild(link);
  });

  it('calls both dataLayer.push and sendBeacon on click', () => {
    const link = document.createElement('a');
    link.setAttribute('data-spa-id', 'lodore-falls-spa');
    link.setAttribute('data-click-intent', 'book-day-pass');
    link.href = 'https://example.com/book-day-pass';
    document.body.appendChild(link);
    link.click();

    expect(mockDataLayerPush).toHaveBeenCalledTimes(1);
    expect(mockSendBeacon).toHaveBeenCalledTimes(1);
    document.body.removeChild(link);
  });

  it('does not call sendBeacon for internal links', () => {
    const link = document.createElement('a');
    link.setAttribute('data-spa-id', 'lodore-falls-spa');
    link.href = '/spa/lodore-falls-spa'; // internal
    document.body.appendChild(link);
    link.click();

    expect(mockSendBeacon).not.toHaveBeenCalled();
    document.body.removeChild(link);
  });

  it('does not call sendBeacon for mailto links (protocol handler — no page unload)', () => {
    const link = document.createElement('a');
    link.setAttribute('data-spa-id', 'lodore-falls-spa');
    link.setAttribute('data-click-intent', 'specific-product-click');
    link.href = 'mailto:info@example.com';
    document.body.appendChild(link);
    link.click();

    // mailto doesn't navigate away — dataLayer is enough, no beacon needed
    expect(mockSendBeacon).not.toHaveBeenCalled();
    expect(mockDataLayerPush).toHaveBeenCalledTimes(1);
    document.body.removeChild(link);
  });
});
```

> **Note on mailto/tel and sendBeacon:** `mailto:` and `tel:` links don't navigate away from the page, so GTM has time to process `dataLayer.push()` without beacon backup. Filter them out of the `sendBeacon` path in the tracker script (check `isProtocol` and skip beacon for those).

**Step 4 — Update existing tests** that currently pass without `mockSendBeacon` — add `expect(mockSendBeacon).toHaveBeenCalledTimes(1)` to the real-world scenario tests where a valid `data-spa-id` external link is clicked, to confirm dual firing.

---

## 4. Implementation order

1. **Retrieve GA4 Measurement ID + API Secret** (blocker for section 1a; use 1b fallback if unavailable)
2. Update `GoogleAnalytics.tsx` — tracker script (add sendBeacon)
3. Update `GoogleAnalytics.test.ts` — update both `initializeClickTracker` helpers, add mock, add new describe block
4. Update `BookVisitCTA.tsx` → update `BookVisitCTA.test.tsx`
5. Update `DayPasses.tsx`, `DayPassCard.tsx`
6. Update `Treatments.tsx`, `TreatmentPickCard.tsx`
7. Update `blog/[slug]/page.tsx`
8. `npm test` — all tests must pass
9. `npm run typecheck` — no errors

---

## 5. Risks and notes

| Risk | Mitigation |
|---|---|
| GA4 Measurement ID / API Secret not available | Use section 1b setTimeout fallback (300ms delay, skip beacon) |
| `client_id` cookie parse misses some GA cookie formats | Falls back to `'unknown'` — events recorded but not session-stitched; acceptable for conversion tracking |
| `navigator.sendBeacon` unsupported (very old browsers) | `if (navigator.sendBeacon)` guard present; `dataLayer.push` still fires |
| `setTimeout` fallback (1b) blocks `mailto:`/`tel:` OS dialogs | Filter: only apply `e.preventDefault()` + delay to `http/https` external URLs; let protocol handlers proceed normally |
| Removing `ExternalLink` icon changes visual affordance | Intentional per Q6:A — links no longer signal "opens new tab" |
| Blog MDX generic `a` renderer: no `data-spa-id` so tracker never fires | Intentional — prose blog links are not conversion events; confirmed in section 0 audit |
| `initializeClickTracker` helper is duplicated in test file | Both copies must be updated in sync; consider refactoring into a single shared helper within the test file |
