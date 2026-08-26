# Lakeside (9) — booking catalogue replaced, all 6 stored passes are dead links

Status: ready-for-human — option (a) applied, awaiting review
Type: human decision (content), not an AFK refresh task
Assignee: (unclaimed)

## Parent

Found during the [03c](03c-portal-lakeside-shell.md) spike, 2026-08-26. Not a `/refresh-day-passes`
task — the refresh iron rule (PRD §1) forbids adding or deleting entries, and this needs both.

## What happened

Lakeside Hotel's onejourney tenant has replaced its entire spa-day catalogue. Every booking item
id we store returns 404 from the portal API **and** renders `404 This page could not be found.` in
the browser.

```
GET https://api.onejourney.travel/340/spa-packages/{7198,7203,7685,7202,7326,7328}/en  ->  404 × 6
```

Property 340 is correct and the route is correct — id 18912 on the same property returns 200. The
ids are simply gone.

## Impact on the live site

All six `bookingUrl`s in `src/data/day-passes/spa-9-day-passes.ts` are dead. A visitor who clicks
"Book" on any Lakeside pass lands on a 404 page. Six of six.

`lastVerified` on all six is `2026-01-22`.

## Stored vs. live

| stored pass | stored price | live equivalent |
| --- | --- | --- |
| Afternoon Tea Spa Day (7198) | £150 | — |
| Seasonal Spa Day (7203) | £90 | — |
| Group Spa Day (7685) | £340 (£85 pp, min 4) | — |
| Revitalising Spa Day (7202) | £135 | — |
| Steam And Swim (7326) | £30 | — |
| Twilight Swim & Steam (7328) | £30 | — |

Live catalogue — `GET https://api.onejourney.travel/340/spa-packages/en` (`total: 4`, stable under
`per-page=100`, `fallback=1`, `allow-non-web-packages=1`):

| id | name | price | duration |
| --- | --- | --- | --- |
| 18902 | Fizz and Float | £39 | — |
| 18904 | Dip & Dine | £25 | — |
| 18905 | Express Escape | £70 | — |
| 18912 | Signature Sanctuary Spa Day | £95 | `full_day` |

No name overlap. No price overlap. Six passes vanished, four appeared — so the strict-1:1
successor rule (PRD §4) correctly refuses to guess any pairing, and an automated refresh can only
ever flag all six.

The hotel's own page (`lakesidehotel.co.uk/spa/spa-day/`) is client-rendered and lists no names or
prices in its HTML, so it can't be used to cross-check.

## Decision needed

Replacing six entries with four is a content rewrite — new `included` lists, durations,
descriptions, age policy, `spaDuration`, plus the `spa-9` intro-text assertions that
`tests/unit/spa-intro-validation.test.ts` checks against pass counts. It also affects any blog or
FAQ prose referencing the old names.

Options:

- **a** — Rewrite spa 9's day passes against the four live packages. Biggest job, leaves the site
  correct.
- **b** — Remove the six dead entries now, add the four later. Stops the 404s immediately.
- **c** — Leave the data, strip or neutralise the six dead `bookingUrl`s only. Smallest change,
  keeps stale prices visible.

Whichever is chosen, the [03c](03c-portal-lakeside-shell.md) API fetch tier is what keeps it
verified afterwards.

## Outcome (2026-08-26) — option (a) applied

Spa 9's six dead entries were replaced with the four live packages. All four prices are grounded
against the API artifact through the real gate (4/4 grounded, 0 flags);
`check-invariant.mjs` exit 0, 0 violations. Full working:
`.claude/content-out/refresh-runs/2026-08-26-lakeside-rewrite/evidence.md`.

Files changed beyond the day-pass data — the old names and ids were referenced in prose and
schema text in four places, all of which would otherwise have rendered dead anchors or stale
prices:

- `src/data/faqs/spa-9-faqs.tsx` — FAQ 1 (pricing) and FAQ 5 (afternoon tea) rewritten. FAQ 1 said
  "six different packages"; both FAQs linked `#`-anchors that no longer exist.
- `src/data/location-faqs/newby-bridge-faqs.tsx` — Lakeside price lookups and anchors swapped;
  "Steam and Swim at £30" → "Dip & Dine at £25" in prose and schema text.
- `content/blog/windermere-spas-guide.mdx` — the Lakeside paragraph named two withdrawn packages
  with **hardcoded** prices, against the rule in CLAUDE.md. Now uses `<DayPassPrice>` /
  `<DayPassLink>`, so it tracks the data from here on. Two literal `£30`s elsewhere in the post
  updated to `£25` (one is frontmatter `seoDescription`, where a component cannot be used).

`src/data/priced-content.test.ts` is what caught every dangling reference — it failed with 8
unresolved lookups the moment the data changed, and is green now.

Two things for a human to confirm — both flagged in evidence.md:

1. **Express Escape `spaDuration: 3` is inferred, not quoted.** The source states no access hours
   for that package; 3 is the standard block at this property.
2. **Fizz and Float has released no availability** on any of the next 14 days, though it is listed
   and priced. It is included as a live product, but may not be genuinely bookable.

## Reproduce

```bash
curl -s -H 'Accept: application/vnd.onejourney.v2.1+json' \
  'https://api.onejourney.travel/340/spa-packages/en' | jq '.total, .data[].name'
curl -s -o /dev/null -w '%{http_code}\n' -H 'Accept: application/vnd.onejourney.v2.1+json' \
  'https://api.onejourney.travel/340/spa-packages/7198/en'
```
