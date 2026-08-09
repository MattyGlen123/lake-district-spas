# Portal tier — Lakeside (9), onejourney tenant with no SSR payload

Status: needs-triage
Type: AFK
Assignee: (unclaimed)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §2 (portal tier).
Split out of [03 Portal tier](03-portal-tier.md) — see that file for why.

## Scope

Lakeside Hotel (9) only. 6 passes on `lakesidehotel.onejourney.travel/spa/days/<item-id>`.

**This is the only genuinely hard spa of the four.** It is the reason 03 kept failing: it looks
identical to Appleby (same vendor, same URL shape) but behaves completely differently.

## The problem (spike-verified 2026-08-09)

All six Lakeside `bookingUrl`s return HTTP 200 and a **byte-identical 120,593-byte shell** — the
same bytes for item 7198, 7203, 7685, 7202, 7326 and 7328. The SSR slot is empty:

```
"dehydratedState":{"mutations":[],"queries":[]}
```

versus Appleby's populated `"queries":[{"state":{"data":{"id":6712,…`. The item payload is fetched
client-side. The shell *does* contain `"price":{…,"amount":N}` fragments, but those are the Elemis
**retail shop products** (£34–£110), not day passes — quoting one would ground a real-looking
figure to the wrong thing. The string `Afternoon Tea` does not appear in the artifact at all.

**Any approach that greps the curl artifact for a price is not just unworkable here, it is
actively dangerous** — the page is full of plausible wrong numbers.

## Options evaluated

| | approach | verdict |
| --- | --- | --- |
| a | Playwright render → scrape DOM | Works, reuses the `blocked`-tier script. Artifact is rendered HTML — greppable, but DOM-shaped and brittle to restyling. |
| b | Playwright, capture the XHR/fetch JSON response as the artifact | **Recommended.** Keeps JSON-fragment grounding and the `pence` case, so evidence is shaped exactly like 03a. Needs a small addition to `fetch-playwright.mjs` to save a matched response body instead of `page.content()`. |
| c | Call the JSON API directly with curl | Cleanest if the path can be found. Partially scoped: the API is real, unauthenticated, and reachable at `https://api.onejourney.travel/…`, but **requires a vendored Accept header** — `application/vnd.onejourney.latest+json` (or `…v2.1+json`); plain `application/json` 400s. `/store/pages/site/lakesidehotel/modules` returns 200 with that header. The spa-package path was not found by guessing (5 shapes tried, all 404). Lakeside is property id **340**, and the SSR query key on a working tenant is `["spaPackage",320,6712,"en",null,null]` — so the path exists; finding it means reading `build/assets/app-*.js`. Timeboxed out of the spike. |
| d | Out of scope, always-flag | Acceptable fallback. Costs 6 passes' freshness; they simply never get a `lastVerified` bump. |

**Recommendation: try (c) for one timeboxed pass — read `app-*.js` for the spaPackage route — and
fall back to (b).** (c) gives the cleanest, smallest, most durable artifact; (b) is the guaranteed
landing spot and still produces JSON evidence.

Do **not** attempt this slice by pointing the existing html-tier fetch at the bookingUrl.

## Acceptance criteria

- [ ] Lakeside's 6 passes ground against a JSON artifact that actually contains the day-pass items
- [ ] The wrong-number hazard is closed: no check can ground against an Elemis shop product
- [ ] Fetch failure flags the pass, doesn't sink the spa
- [ ] `npm run typecheck && npm test` green; `check-invariant.mjs` 0 violations

## Blocked by

- [01 Walking skeleton](01-walking-skeleton.md)
- [02 Gate suite](02-gate-suite.md)
