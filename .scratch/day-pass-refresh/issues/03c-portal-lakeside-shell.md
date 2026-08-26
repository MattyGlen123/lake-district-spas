# Portal tier — Lakeside (9), onejourney tenant with no SSR payload

Status: ready-for-human — built (portal-onejourney-api tier), awaiting review
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

- [x] Lakeside's passes ground against a JSON artifact that actually contains the day-pass items —
      4/4 grounded. Six of the original passes no longer exist at source (see below); the four that
      do are grounded against `spa-9.json`.
- [x] The wrong-number hazard is closed: no check can ground against an Elemis shop product —
      closed structurally, not by convention. `fetch-onejourney.mjs` parses and validates before
      writing, so a non-JSON or non-spa-package body fails with exit 2 and produces no artifact.
- [x] Fetch failure flags the pass, doesn't sink the spa — a withdrawn item simply is not in the
      catalogue artifact, so it takes no quote and gate 1 demotes it to a ⚠️ flag.
- [x] `npm run typecheck && npm test` green (793 tests); `check-invariant.mjs` exit 0, 0 violations

## Spike 2 — 2026-08-26: route FOUND, and the catalogue has been replaced

Two findings. The first solves the ticket as written. The second means solving it does not
actually refresh any Lakeside price.

### 1. Option (c) works. The API route is found, and plain curl is enough.

The ticket guessed a Vite `build/assets/app-*.js`. The storefront is in fact **Next.js**, so the
route lives in `_next/static/chunks/pages/_app-<hash>.js`. Deminified:

```js
async function g(e, t, n, r, o) {
  let a = "".concat(e, "/spa-packages/").concat(t, "/").concat(n); // propertyId / itemId / lang
  …
}
let z = (e, t, n, r, o) => ["spaPackage", e, t, n, r, o];          // the SSR query key
```

which resolves the known-good Appleby key `["spaPackage",320,6712,"en",null,null]` to
`320/spa-packages/6712/en`. `baseURL` is the page's `runtimeConfig.BACKEND_URL` =
`https://api.onejourney.travel`. **There is no `/store` prefix on this route family** — that
prefix belongs only to the site-level routes (`/store/pages/site/<tenant>/…`), which is why the
earlier guesses 404'd.

```
GET https://api.onejourney.travel/<propertyId>/spa-packages/<itemId>/<lang>
```

Verified live:

| request | result |
| --- | --- |
| `…/320/spa-packages/6712/en` (Appleby) | 200, 16,891 B JSON |
| `…/340/spa-packages/18912/en` (Lakeside) | 200, 6,044 B JSON |
| `…/340/spa-packages/en` (list, all packages) | 200, 2,505 B JSON |
| `…/store/340/spa-packages/en` | 404 |

A Playwright run confirms this is exactly what the real page fetches:
`https://api.onejourney.travel/340/spa-packages/18912/en?fallback=1`.

**The vendored `Accept` header is not required on this route family.** `application/json`, the
vendored types, and no `Accept` header at all each return 200. (It *is* required on
`/store/pages/site/…`, which is where the earlier finding came from.) Sending
`application/vnd.onejourney.v2.1+json` anyway is free and matches the app.

So option (c) lands: a small, pure-JSON, no-browser artifact. The wrong-number hazard closes
structurally — the Elemis retail products are simply not in this response.

### 2. Lakeside's six stored passes no longer exist.

All six stored booking-item ids **404 on the API**, and the live booking pages render
`404 This page could not be found.`:

```
340/spa-packages/{7198,7203,7685,7202,7326,7328}/en  ->  404 × 6
```

The property is right (the shell's own payload says `"property":{"id":340,"name":"Lakeside Hotel
and Spa"}`), the route is right (18912 works on the same property), and the ids are dead. The
catalogue has been replaced wholesale. Current contents of `340/spa-packages/en` (`total: 4`;
unchanged under `per-page=100`, `fallback=1` and `allow-non-web-packages=1`):

| id | name | price |
| --- | --- | --- |
| 18902 | Fizz and Float | £39 |
| 18904 | Dip & Dine | £25 |
| 18905 | Express Escape | £70 |
| 18912 | Signature Sanctuary Spa Day | £95 (`full_day`) |

Against our six stored passes (Afternoon Tea £150 · Seasonal £90 · Group £340 · Revitalising £135
· Steam And Swim £30 · Twilight Swim & Steam £30) there is **no name overlap and no price
overlap**.

The hotel's own `dayPassUrl` (`lakesidehotel.co.uk/spa/spa-day/`) is also client-rendered and
carries no pass names or prices in its HTML, so it corroborates nothing either way.

### What this means for the pipeline

Building the tier is still correct, but the run it enables produces **6 vanished existing passes
and 4 unmatched fetched passes**. `classifySuccessors`' strict-1:1 rule demotes all of them to
plain `missingFlags`. So a compliant Lakeside run is, by design:

- 0 price changes, 0 `lastVerified` bumps
- 6 ⚠️ missing-flags, data untouched

That is the pipeline behaving correctly, not a failure. The acceptance criteria above are all
still meetable — criterion 1 ("ground against a JSON artifact that actually contains the
day-pass items") is met for the items that *exist*.

The stale data itself is out of scope here: the iron rule forbids adding or deleting entries, and
six dead `bookingUrl`s on the live site is a content problem, not a refresh problem. Filed
separately as [13 Lakeside catalogue replaced](13-lakeside-catalogue-replaced.md).

## Outcome (2026-08-26)

Built as the **`portal-onejourney-api`** tier — option (c), the cleanest of the four.

- `scripts/fetch-onejourney.mjs` (new). Fetches the property's whole day-pass catalogue in ONE
  call, so a portal spa is now one small artifact with no `trim-artifact.mjs` step at all.
  Lakeside: **2.5 KB, 1 file** (compare Appleby's SSR run: 1,233 KB / 52 files before trimming,
  148 KB / 7 after).
- It **validates before it saves** — that is what closes this ticket's hazard for good rather than
  relying on a documented warning. `notJson` / `unexpectedShape` are exit-2 failures with no
  artifact written.
- No gate change was needed: `price.amount` is pence, reusing gate 1's existing `pence` case.
- 16 unit tests in `tests/unit/refresh-day-passes-fetch-onejourney.test.ts`, run against a
  loopback HTTP server so no network is required. The refusal paths are tested with the real
  Elemis-shell shape.
- SKILL.md documents the tier, the route, how it was recovered, and the withdrawn-pass rule.

Note for whoever runs this next: the tier serves **any** onejourney tenant, Appleby included
(`320/spa-packages/6712/en` returns 200). Appleby was deliberately left on the SSR tier — moving
it means re-verifying all 11 passes, so it should be its own change, not a side effect of this one.

Lakeside's data could not simply be refreshed: see finding 2 below and
[issue 13](13-lakeside-catalogue-replaced.md), applied in the same PR.

### Decision (resolved 2026-08-26)

Build now, and rewrite Lakeside to the four live packages (issue 13, option **a**). Both done.

### Decision needed before build

Build the `portal-onejourney-api` fetch tier now (it is small, it closes the hazard permanently,
and it would also shrink Appleby's run from 11 HTML pages / 1,233 KB to a handful of small JSON
files) — or defer it until the Lakeside content question in issue 13 is settled, since no price
moves until then either way.

## Blocked by

- [01 Walking skeleton](01-walking-skeleton.md)
- [02 Gate suite](02-gate-suite.md)
