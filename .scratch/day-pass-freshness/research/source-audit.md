# Day Pass Source Audit — 2026-07-24

Ticket: `.scratch/day-pass-freshness/issues/02-source-audit.md`. Method: read all 15 `src/data/day-passes/spa-*.ts` files (110 pass entries), WebFetched each distinct `dayPassUrl` once (24 distinct URLs).

## Per-spa table

| Spa (id) | #Passes | Source URL(s) | Fetch status | HTML/PDF | Pricing structure on page | Drift spotted |
|---|---|---|---|---|---|---|
| Lodore Falls Hotel Spa (1) | 5 | lakedistrictspa.co.uk — 5 per-package URLs | 3 OK, **2 × 404** (derwent-delight-for-2, rasul-ritual-spa-day) | HTML | Flat £pp + promo code discount (20% off Black Friday, code SAVE20) | Morning Renew £150→**£165**; Restart £180→**£205**; Twilight £75 OK. lastVerified 2025-01-19 (18mo stale) |
| Armathwaite Hall (2) | 12 | armathwaite-hall.com/spa/spa-day-experience/ | OK — but **no prices in HTML** | **PDF** ("2531014-Spa-Brochure-October-V8.2.pdf" holds pricing); page says "call The Spa" | Unknown from HTML; our data models weekday/weekend + bank-holiday via duplicate entries | Can't verify prices w/o PDF parse. New package on page not in our data: "Head Spa & Reset" |
| Daffodil Hotel Spa (4) | 10 | crerarhotels.com — 7 distinct URLs | 5 OK, **2 × 404** (it-s-all-good-spa-day, do-not-disturb-spa-day) | HTML | Mixed: Spa Facilities = flat weekday/weekend split (£35/£45, matches); offers = "**from £X** per person" (£70/£60/£40 match as floors); Mud Rasul = **per couple** "from £125" (matches) | 4 of 10 passes point at dead URLs (both It's All Good + both Do Not Disturb variants) |
| Swan Hotel Spa (5) | 8 | swanhotel.com/spa/ (single URL, all 8) | OK | HTML + PDF (treatment brochure July 2026 — treatments, not day passes) | Flat £pp; **seasonal package churn** | **Winter Glow gone** — replaced by "Spring Awakening Spa Escape" £150. Champagne & Truffle £150 OK, Thermal+AT £65 OK. Twilight Sessions, Treatment & Thermal, Full Works, Holte Restorative Ritual **not on page** (live only in onejourney portal). New unpriced: "Holte After Hours"/"Holte Socials" |
| Macdonald Old England (6) | 6 | macdonaldhotels.co.uk/old-england/spa-leisure/spa/days | **403 Forbidden** (bot-blocked) | — | Unverifiable via plain fetch | Unverifiable — fetch-mechanism problem, not proof of staleness |
| Low Wood Bay Spa (7) | 17 | englishlakes.co.uk/.../spa-days (single URL) | OK | HTML | "**From £Xpp**" on every package; weekday/weekend as separate packages | **9 of 17 drifted**: Recharge £175→195, Rise & Dine £95→110, Twilight Thermal £60→69, Twilight+Dinner £95→99, Wkday Ult S&D £135→140, Wkend Ult S&D £150→155, Wkday Thermal+Lunch £125→130, Wkend £130→135, Sunday Lunch £130→135. 5 new packages not in data (Open Water Swim & Spa, Paddle & Stretch, Active Day Retreat, Sunset Sessions, Friday Twilight). lastVerified 2025-01-19 (18mo stale) |
| Lakeside Hotel Spa (9) | 6 | lakesidehotel.co.uk/spa/spa-day/ | OK — but **no packages/prices in HTML** | HTML (prices live only in onejourney booking portal) | Not visible on page | Unverifiable from dayPassUrl; would need to fetch booking portal |
| Beech Hill Hotel Spa (10) | 4 | beechhillhotel.co.uk/spa/ | OK | HTML | Flat £pp, no splits | **None** — £140/£115/£45 all match |
| North Lakes Hotel Spa (12) | 10 | northlakeshotel.co.uk/spa-treatments/spa-days-breaks | OK — but page truncated, **no prices visible** | HTML | Not visible (long page / JS) | Unverifiable from single fetch |
| Whitewater Hotel (13) | 4 | whitewater-hotel.co.uk/spa-fitness/newby-bridge-spa/ | OK | HTML + **PDF** (Cascades Health Spa brochure) | Flat £pp; Couples quoted **per person** | **Worst drift**: Luxurious Spa w/ AT £60→**£75** (+25%); Weekday Escape £90→**£105**; Couples Retreat £220/2 → **£130pp (£260)**; **Pure Pampering gone** from page |
| Another Place, The Lake (14) | 2 | another.place — swim-club/ + swim-and-dine | Both OK | HTML | Flat £pp | None — £110 & £60 match. New variant not in data: £120pp day membership w/ treatment + lunch |
| Appleby Manor (15) | 11 | applebymanor.co.uk/garden-spa | **301 redirect** (apex → `http://www.` — non-HTTPS) then OK — **no prices in HTML** | HTML (prices only in onejourney portal) | Not visible on page | dayPassUrl should be `https://www.applebymanor.co.uk/garden-spa`; prices unverifiable from page |
| Netherwood Hotel Spa (16) | 6 | netherwood-hotel.co.uk/spa-fitness/spa-days/ | OK | HTML | Per person, **tiered by duration** + "**£10pp per hour**" extension add-on | Thermal 60min £20 OK, 90min £25 OK; **2.5hr £40 tier not on page** (replaced by £10/hr add-on). Half Day £55 OK. **Spa Relaxation £75 & Couples Unwind £160 gone** from page |
| Grange Hotel Spa (17) | 2 | grange-hotel.co.uk — 2 per-package URLs | Both OK | HTML | Flat £pp + food-credit allocation | **None** — £25 (+£15 credit) & £59 match |
| The Spa at Underscar (19) | 7 | underscar.co.uk/spa/ | OK — but **no prices in HTML** | HTML (prices only in try.be booking widget) | Not visible on page | Unverifiable; page only names 2 of 7 packages ("Twilight", "Serenity") |

## Summary

### Fetch status (24 distinct URLs)
- **Dead (404): 4** — Lodore derwent-delight-for-2, Lodore rasul-ritual-spa-day, Daffodil it-s-all-good-spa-day, Daffodil do-not-disturb-spa-day. Affects 6 pass entries.
- **Blocked (403): 1** — Macdonald Old England (bot protection; needs browser-grade fetch or different mechanism).
- **Redirect: 1** — applebymanor.co.uk → `http://www.applebymanor.co.uk` (apex 301s to non-HTTPS www; our URL should be updated).
- **Loads but prices NOT in HTML: 5 spas** — Armathwaite (PDF only), Lakeside, North Lakes, Appleby, Underscar (all price only inside booking portals: onejourney.travel / try.be). For these, auditing the dayPassUrl alone can never verify prices — the bookingUrl (try.be/onejourney) is the real price source.
- **Fully verifiable HTML pricing: 8 spas** — Lodore (3/5 pages), Daffodil (5/7), Swan, Low Wood Bay, Beech Hill, Whitewater, Another Place, Netherwood, Grange.

### PDFs
**3 spas** publish spa pricing/menus in PDFs: Armathwaite Hall (spa brochure **with day-pass pricing** — the only HTML-less price source), Whitewater (Cascades brochure alongside HTML prices), Swan (treatment brochure — treatments only). Only Armathwaite *requires* PDF parsing for day-pass prices.

### Pricing structures our single `priceGBP` can't represent
1. **"From £X" floor prices** — Low Wood Bay (all 22 packages on page), Daffodil offers. Our flat number silently becomes wrong the moment the floor moves.
2. **Weekday/weekend/bank-holiday splits** — currently faked with duplicated pass entries (Armathwaite ×12, North Lakes, Appleby, Daffodil). Works but triples entry count and drifts pairwise.
3. **Promo/discount codes** — Lodore 20% off code stacked on top of list price.
4. **Per-hour extension pricing** — Netherwood "£10pp per hour" add-on replaced their fixed 2.5hr tier.
5. **Seasonal package churn** — Swan renames the same slot each season (Winter Glow → Spring Awakening); price stays, name breaks matching.
6. **Per-couple vs per-person quoting** — Whitewater now quotes couples pp (£130pp) where we store total (£220); `pricePerPerson` exists but total-vs-pp source ambiguity caused real drift.

### Worst drift examples
1. **Whitewater (13)** — every surviving package up 17–25%: £60→£75, £90→£105, couples £220→£260; Pure Pampering delisted. lastVerified 2026-01-22 yet badly stale.
2. **Low Wood Bay (7)** — 9 of 17 passes underpriced by £4–20 (e.g. Recharge £175→£195, Rise & Dine £95→£110); 5 new packages missing. lastVerified 2025-01-19 — oldest in dataset (with Lodore).
3. **Lodore Falls (1)** — Restart £180→£205 (+14%), Morning Renew £150→£165 (+10%), plus 2 of 5 dayPassUrls dead. lastVerified 2025-01-19.
4. **Daffodil (4)** — 4 of 10 passes (both It's All Good + both Do Not Disturb variants) point at 404s; packages may be discontinued.
5. **Swan (5)** — Winter Glow delisted (seasonal churn) and 4 of 8 passes exist only in the booking portal, invisible to a dayPassUrl audit.

### Implications for fetch mechanism
- One fetch of the dayPassUrl verifies prices for only ~8 of 15 spas; 5 spas need booking-portal (try.be / onejourney) fetches, 1 needs PDF parsing (Armathwaite), 1 needs bot-evasion or manual check (Old England 403).
- try.be and onejourney URLs embedded in `bookingUrl` are the authoritative price sources for exactly the spas whose marketing pages hide prices — the freshness pipeline should fetch bookingUrl, not dayPassUrl, for those.
- `lastVerified` dates correlate with drift: both 2025-01-19 spas (Lodore, Low Wood Bay) are heavily drifted; but 2026-01-22 is no guarantee (Whitewater).
