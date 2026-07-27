# Portal-JSON fetch tier

Status: ready-for-agent
Type: AFK
Assignee: (unclaimed)

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
