# Portal tier — onejourney server-rendered (Appleby 15)

Status: closed — merged in PR #32 (2026-08-26)
Type: AFK
Assignee: (unclaimed)

## Outcome (2026-08-09)

Built and run. 11/11 fetched, 11/11 grounded, 0 flags, 0 price changes, 11 `lastVerified` bumps,
11 tier-1 renames applied. `check-invariant.mjs` exit 0. Typecheck clean, 758 tests pass.

One bug found and fixed en route: `applyRenameToFiles` replaced `packageName` **globally**, so
renaming one of a weekday/weekend pair that shares a package name clobbered its twin and left the
twin's own rename with nothing to match. Appleby has five such pairs — it would have corrupted the
data file. The rewrite is now scoped to the renamed entry's own option block, with a regression
test (`tests/unit/refresh-day-passes-rename.test.ts`).

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §2 (portal tier), §3 rule 5, §5 gate 1.
Split out of [03 Portal tier](03-portal-tier.md) — see that file for why.

## Scope

**Appleby Manor (15) only.** 11 passes, all on `applebymanor.onejourney.travel/spa/days/<item-id>`.

Lakeside (9) is also onejourney but is NOT in scope — its tenant serves no SSR payload. See [03c](03c-portal-lakeside-shell.md).

## What to build

Plain curl + browser UA on each pass's `bookingUrl` (never `dayPassUrl`). Exit criteria of the
existing `html` tier apply unchanged — this is the `html` fetch script pointed at a different URL,
plus a documented extraction rule.

**Extraction rule (spike-verified 2026-08-09).** The page embeds a React-Query SSR payload:

```
"dehydratedState":{"mutations":[],"queries":[{"state":{"data":{"id":<item>,"categories":[…],
"name":"<item name>","description":"…",…,"price":{"amount":<pence>…
```

Quote = the contiguous span from `"name":"<item name>"` through `"price":{"amount":<pence>`.
`arithmetic: "pence"`, `quotedFigure` = the pence integer. This is exactly the case gate 1 already
implements — **no gate change is needed for this slice.**

**Gotcha (cost the spike two false failures):** the artifact JSON-escapes non-ASCII, so `&` appears
as `&`. `passName` in `checks.json` must be the name **as it literally appears in the artifact**
(`Aqua Thermal Journey & Light Afternoon Tea Fri-sun`), not the JSON-decoded form — gate 2
normalization decodes HTML entities, not JSON escapes.

**Second gotcha:** the payload is emitted twice, once camelCase (`currencyCode`) and once snake_case
(`currency_code`). Quote from the camelCase copy; gate 3 scans every occurrence of a repeated span,
so a span present in both copies is poison-checked in both — this is fine and was verified clean.

## Spike evidence (2026-08-09)

All 11 items fetched HTTP 200 with a populated SSR payload, and all 11 source amounts equal the
currently stored `priceGBP` — this slice is expected to produce **zero price changes**, 11 ✅
verified-unchanged rows and 11 `lastVerified` bumps.

| item | name | source | stored |
| --- | --- | --- | --- |
| 6712 | Indulgence \| Friday - Sunday | 12500 | £125 |
| 6713 | Indulgence \| Monday - Thursday | 11500 | £115 |
| 11233 | Luxuriance … \| Monday - Thursday | 9900 | £99 |
| 11232 | Luxuriance … Friday - Sunday | 10900 | £109 |
| 6714 | Luxurience \| Friday - Sunday | 9900 | £99 |
| 6715 | Luxurience \| Monday - Thursday | 8900 | £89 |
| 12307 | Aqua Thermal Journey & Light Afternoon Tea Fri-sun | 5900 | £59 |
| 9278 | Aqua Thermal Journey & Light Afternoon Tea Monday - Thursday | 4900 | £49 |
| 6706 | Aqua Thermal Spa Experience with Lunch or Afternoon Tea \| Friday - Sunday | 6500 | £65 |
| 6707 | Aqua Thermal Spa Experience with Lunch or Afternoon Tea \| Monday - Thursday | 6000 | £60 |
| 9279 | Aqua Thermal Journey Monday to Sunday | 4500 | £45 |

Candidate quotes built by this rule were run through the real `gate.mjs`: 9/11 PASS outright;
the 2 exceptions were the `&` gotcha above, not a design problem.

Note the source names carry a ` | Friday - Sunday` / ` | Monday - Thursday` suffix that stored
`packageName`s do not. Matching is tier 1 (booking-item id) so this auto-applies **as a rename** —
expect rename churn and prose flags. Consider whether these renames are wanted before applying;
if not, the run should flag rather than rename.

## Acceptance criteria

- [ ] `/refresh-day-passes --spa 15` (and `--tier portal`) fetches bookingUrls, saves one artifact
      per pass, grounds every price via raw-JSON-fragment quotes with `arithmetic: "pence"`
- [ ] Portal fetch failure for one pass flags that pass, doesn't sink the spa
- [ ] Evidence and PR rendering identical in shape to the html tier
- [ ] `npm run typecheck && npm test` green; `check-invariant.mjs` 0 violations
- [ ] No change to `gate.mjs`

## Blocked by

- [01 Walking skeleton](01-walking-skeleton.md)
- [02 Gate suite](02-gate-suite.md)
