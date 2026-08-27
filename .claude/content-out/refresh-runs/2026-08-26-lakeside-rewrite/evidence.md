# Lakeside (9) — catalogue rewrite evidence, 2026-08-26

**This is not a `/refresh-day-passes` run.** It adds and removes entries, which the refresh iron
rule (PRD §1) forbids, so it is a hand-made content change carried out under
[issue 13](../../../../.scratch/day-pass-refresh/issues/13-lakeside-catalogue-replaced.md). The
price grounding below still goes through the real gate, unchanged.

## Source

- Spa: Lakeside Hotel & Spa (9), onejourney property **340**
- Tier: `portal-onejourney-api` (built in this PR — issue 03c)
- Source URL: `https://api.onejourney.travel/340/spa-packages/en`
- Artifact: `spa-9.json` — HTTP 200, 2,505 B raw, pretty-printed on save by `fetch-onejourney.mjs`, plus the `availabilityProbe` block it writes
- Fetch log: `spa-9-fetch-log.json` — 1 attempt, `packageCount: 4`, `packageIds: [18902, 18904, 18905, 18912]`
- Gate results: `spa-9-gate-results.json`
- Fetched: 2026-08-26 22:04 BST

## Why the data changed

All six previously stored booking items are withdrawn at source:

```
340/spa-packages/{7198,7203,7685,7202,7326,7328}/en  ->  404 × 6
```

The live storefront confirms it — `lakesidehotel.onejourney.travel/spa/days/7198` renders
`404 This page could not be found.` after its XHR to
`api.onejourney.travel/340/spa-packages/7198/en?fallback=1` returns 404. Every "Book" button on
our Lakeside page was therefore dead. Property 340 is correct (the storefront's own payload says
`"property":{"id":340,"name":"Lakeside Hotel and Spa"}`) and the route is correct (18912 returns
200 on the same property), so this is a withdrawn catalogue, not a bad request.

Removed (6, all withdrawn at source): `lakeside-afternoon-tea-spa-day` £150 · `lakeside-seasonal-spa-day` £90 ·
`lakeside-group-spa-day` £340 · `lakeside-revitalising-spa-day` £135 · `lakeside-steam-and-swim`
£30 · `lakeside-twilight-swim-steam` £30.

No name or price overlap with the live catalogue, so no rename or successor pairing is claimed —
`classifySuccessors`' strict-1:1 rule would demote all six to plain `missingFlags`, which is why
this could not be done as a refresh run.

## Per-pass grounding — 3/3 grounded, 0 flags

All three use `arithmetic: "pence"` (`price.amount` is pence), the same gate 1 case as the SSR
onejourney tier.

### `lakeside-dip-and-dine` — Dip & Dine — £25 (new entry)

> `"name": "Dip & Dine",` … `"price": {` `"amount": 2500`

Gate: grounded. Item 18904.

### `lakeside-express-escape` — Express Escape — £70 (new entry)

> `"name": "Express Escape",` … `"price": {` `"amount": 7000`

Gate: grounded. Item 18905.

### `lakeside-signature-sanctuary-spa-day` — Signature Sanctuary Spa Day — £95 (new entry)

> `"name": "Signature Sanctuary Spa Day",` … `"price": {` `"amount": 9500`

Gate: grounded. Item 18912.

## Non-price content — where each field came from

`included`, `spaDuration` and `description` are not gated (the PRD gates prices only). They were
written from the per-item detail endpoint,
`https://api.onejourney.travel/340/spa-packages/<id>/en`, read as working files and not committed
(re-fetchable from the URLs above). Specifically:

- **`spaDuration: 3`** for Dip & Dine and Signature Sanctuary is the source's own
  `configurationGroups` option **"Use Of Spa 3 Hours Access"**, and for Signature Sanctuary also
  its description ("three hours' access").
- ⚠️ **Express Escape `spaDuration: 3` is an inference, not a quote.** Its configuration groups
  list only "Afternoon Tea" plus the treatment choice — no access-hours option — and its
  description says "Full Spa Access" and "the perfect half day" without stating hours. 3 is the
  standard access block at this property. **Worth confirming with the hotel.**
- **Treatment choices** are the `minimumSelections: 1 / maximumSelections: 1` option groups
  verbatim (30-minute options for Express Escape; 60-minute for Signature Sanctuary).
- **`mealIncluded: false` for Dip & Dine** — the source gives a **£15 food credit**, not a meal;
  the guest may pay more. The credit is stated in `included` instead.
- **`ageRestriction: 'All ages'`** is carried over from the previous entries. The API exposes no
  age policy (`gender: null` on all of them), and it describes the venue rather than the package.

## Availability — now checked automatically (gate 6)

`fetch-onejourney.mjs` probes each package's real timeslot endpoint
(`/340/spa-packages/<id>/<date>/timeslots?quantity=1`) across 14 days from 2026-08-27 and writes
the counts into the artifact's `availabilityProbe` block. Gate 6 reads that block; nobody has to
click through a booking calendar by hand.

| item | daysWithSlots / daysProbed | gate 6 |
| --- | --- | --- |
| 18904 Dip & Dine | 10 / 14 | grounded |
| 18905 Express Escape | 10 / 14 | grounded |
| 18912 Signature Sanctuary | 11 / 14 | grounded |
| 18902 Fizz and Float | **0 / 14** | ⚠️ `no-availability` |

The first days of the window are empty for every package, consistent with the 48-hour notice in
the terms — the gate only cares whether the *whole* window is empty.

### Fizz and Float (18902) — listed, priced, unbookable, and removed

£39, a live booking page, and **not one bookable date in the fortnight**. Confirmed with the hotel
that it never has availability, so it is **not** in `spa-9-day-passes.ts`. It remains in the
source catalogue, so it appears in the artifact and would show as an ℹ️ `unmatchedFetched` note on
a future run — which is right: it exists, we just don't sell it.

Gate 6 was verified against this exact live artifact rather than only against fixtures:

```
grounded: false | gate: 6 | reason: no-availability | slots: 0/14
```

This is the class of problem gates 1–5 structurally cannot see. The £39 really is on the page, so
grounding, contiguity, poison words and plausibility all pass. Without gate 6 we would have kept
re-verifying and publishing a price nobody can buy, indefinitely, and only a human clicking
through would ever have noticed.

ℹ️ Node's `fetch` and `curl` get *different* bodies from the timeslots endpoint (`{"data":[]}` vs a
populated array) for the same URL and headers. The probe uses curl, as the rest of the pipeline
does, and `countSlots` accepts both shapes.

## Invariant check

```
node .claude/skills/refresh-day-passes/scripts/check-invariant.mjs \
  ".claude/content-out/refresh-runs/2026-08-26-lakeside-rewrite" "2026-08-26" "9"
```

`{ "runDate": "2026-08-26", "ok": true, report: [{ spaId: "9", fetched: true, passes: 3, violations: [] }] }` — exit 0, **0 violations**.
