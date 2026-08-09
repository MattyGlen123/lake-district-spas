# Portal-JSON fetch tier

Status: wontfix — split, do not implement as written
Type: AFK
Assignee: (unclaimed)

## SPLIT (2026-08-09)

Superseded by [03a](03a-portal-onejourney-ssr.md), [03b](03b-portal-trybe-jsonld.md) and
[03c](03c-portal-lakeside-shell.md). Two agents failed this ticket; a spike found out why.

**The premise below is wrong.** "Read prices from the embedded booking-engine JSON (prices in
pence)" describes exactly ONE of the four spas. The four do not split by vendor — they split by
whether the tenant server-renders, which cuts *across* both vendors:

| spa | vendor | server-rendered? | price units | slice |
| --- | --- | --- | --- | --- |
| Appleby (15) | onejourney | ✅ React-Query `dehydratedState` | **pence** (`"amount":12500`) | 03a |
| Lakeside (9) | onejourney | ❌ empty SSR, identical shell for every item | — | 03c |
| Underscar (19) | try.be | ✅ JSON-LD `Product` | **pounds** (`"lowPrice":100`) | 03b |
| North Lakes (12) | try.be | ✅ JSON-LD `Product` | **pounds** | 03b |

Three consequences that make one ticket unbuildable:

1. Two different extraction rules and two different JSON shapes, neither guessable from the other.
2. try.be's whole-pound integers fit **no existing arithmetic mode** — 03b needs a new one in
   `gate.mjs`; 03a needs no gate change at all. Opposite requirements in one ticket.
3. Lakeside is a research problem, not an implementation one, and it sits behind the same vendor
   name as the easiest spa — which is precisely the trap.

Acceptance criterion "a run on Lakeside produces a grounded PR" made the hardest spa the demo.

Original text retained below for reference.

---

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §2 (portal tier), §3 rule 5, §5 gate 1.

## What to build

Support the four `portal` spas (Lakeside 9, North Lakes 12, Appleby 15, Underscar 19) whose prices live only in try.be/onejourney booking portals: fetch each pass's `bookingUrl` instead of `dayPassUrl`, read prices from the embedded booking-engine JSON (prices in pence), and ground quotes as raw JSON fragments greppable in the saved artifact — the gate's pence→GBP case does the conversion check. Normalization rules from the PRD apply unchanged ("from £X" floor, promo-as-note, per-couple shape).

Demo: a run on Lakeside produces a grounded PR.

## Acceptance criteria

- [ ] `/refresh-day-passes --spa 9` (and `--tier portal`) fetches bookingUrls, saves artifacts, and grounds every price via raw-JSON-fragment quotes with pence conversion verified by script
- [ ] Portal fetch failure for one pass flags that pass, doesn't sink the spa
- [ ] Evidence and PR rendering identical in shape to the html tier

## Blocked by

- [01 Walking skeleton](01-walking-skeleton.md)
- [02 Gate suite](02-gate-suite.md)
