# Lakeside (9) — booking catalogue replaced, all 6 stored passes are dead links

Status: needs-triage
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

## Reproduce

```bash
curl -s -H 'Accept: application/vnd.onejourney.v2.1+json' \
  'https://api.onejourney.travel/340/spa-packages/en' | jq '.total, .data[].name'
curl -s -o /dev/null -w '%{http_code}\n' -H 'Accept: application/vnd.onejourney.v2.1+json' \
  'https://api.onejourney.travel/340/spa-packages/7198/en'
```
