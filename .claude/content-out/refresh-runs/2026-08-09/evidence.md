# Day-pass refresh — evidence — 2026-08-09

## Appleby Manor Hotel & Garden Spa (15) — `portal-onejourney` tier

- **Source:** per-pass `bookingUrl` on `applebymanor.onejourney.travel` (NOT `dayPassUrl`)
- **Artifacts:** one per pass, `.claude/content-out/refresh-runs/2026-08-09/spa-15-<item>.html` — all HTTP 200
- **Gate results:** `.claude/content-out/refresh-runs/2026-08-09/spa-15-gate-results.json` (merged); per-pass alongside
- **Fetch timestamp:** 2026-08-09 13:03 BST
- **Grounded:** 11 / 11 · **Flagged:** 0
- **Price changes:** 0 — every source figure equals the stored figure
- **Matching:** 11/11 at tier 1 (booking-item id); 0 tier-2, 0 tier-3, 0 missing, 0 unmatched-fetched
- **Renames applied:** 11 (all tier-1 auto-applies — the portal now suffixes every package with its availability window)

### Per-pass

#### `appleby-indulgence-friday-sunday`

- Matching tier: **1** (booking item `6712`)
- Rename applied: `appleby-indulgence-weekend` → `appleby-indulgence-friday-sunday`
  - name: "Indulgence" → "Indulgence | Friday - Sunday"
- Stored → source: **£125 → £125** (unchanged; no movePct)
- Artifact: `spa-15-6712.html`
- Arithmetic: `pence` — span shows `12500`, ÷100 = £125
- Gate verdict: **grounded ✅ verified unchanged** — `lastVerified` bumped to 2026-08-09

  Quote (verbatim span, truncated here for readability — full span in `spa-15-checks.json`):

  > "name":"Indulgence | Friday - Sunday","description":"For those who want to indulge themselves without feeling guilty that they’ve spent too much time on themselves. \n\nBegin the day by shedding your outdoor wear and changing into\na warm, fluffy robe. \nSpend time in the Aqua Thermal area - \nYour 
  >   … [1933 chars] …
  > rience.","termsAndConditions":null,"image":{"externalKey":"1939a9cbcbd779b4ffa9377df95b76fd","url":"https://hcommerce-live.s3.amazonaws.com/1939a9cbcbd779b4ffa9377df95b76fd.jpg"},"numberOfGuests":1,"durationText":"full_day","gender":null,"displayOrder":2,"telephoneOnly":false,"price":{"amount":12500

#### `appleby-indulgence-monday-thursday`

- Matching tier: **1** (booking item `6713`)
- Rename applied: `appleby-indulgence-weekday` → `appleby-indulgence-monday-thursday`
  - name: "Indulgence" → "Indulgence | Monday - Thursday"
- Stored → source: **£115 → £115** (unchanged; no movePct)
- Artifact: `spa-15-6713.html`
- Arithmetic: `pence` — span shows `11500`, ÷100 = £115
- Gate verdict: **grounded ✅ verified unchanged** — `lastVerified` bumped to 2026-08-09

  Quote (verbatim span, truncated here for readability — full span in `spa-15-checks.json`):

  > "name":"Indulgence | Monday - Thursday","description":"For those who want to indulge themselves without feeling guilty that they’ve spent too much time on themselves. \n\nBegin the day by shedding your outdoor wear and changing into\na warm, fluffy robe. \nSpend time in the Aqua Thermal area - \nYou
  >   … [1935 chars] …
  > rience.","termsAndConditions":null,"image":{"externalKey":"1165e890b941e8176227d861b0754aed","url":"https://hcommerce-live.s3.amazonaws.com/1165e890b941e8176227d861b0754aed.jpg"},"numberOfGuests":1,"durationText":"full_day","gender":null,"displayOrder":2,"telephoneOnly":false,"price":{"amount":11500

#### `appleby-luxuriance-including-a-back-neck-and-shoulder-massage-monday-thursday`

- Matching tier: **1** (booking item `11233`)
- Rename applied: `appleby-luxuriance-massage-weekday` → `appleby-luxuriance-including-a-back-neck-and-shoulder-massage-monday-thursday`
  - name: "Luxuriance Including a Back, Neck and Shoulder Massage" → "Luxuriance Including a Back, Neck and Shoulder Massage | Monday - Thursday"
- Stored → source: **£99 → £99** (unchanged; no movePct)
- Artifact: `spa-15-11233.html`
- Arithmetic: `pence` — span shows `9900`, ÷100 = £99
- Gate verdict: **grounded ✅ verified unchanged** — `lastVerified` bumped to 2026-08-09

  Quote (verbatim span, truncated here for readability — full span in `spa-15-checks.json`):

  > "name":"Luxuriance Including a Back, Neck and Shoulder Massage | Monday - Thursday","description":"Choose to use your time, your way.\n\nBegin the day by shedding your outdoor wear and changing into a warm, fluffy robe. Spend time in the Aqua Thermal area - Your experience begins in the Aroma Salt i
  >   … [1940 chars] …
  > erience.","termsAndConditions":null,"image":{"externalKey":"72c7188ae5ada929fe7c376baea1e9c4","url":"https://hcommerce-live.s3.amazonaws.com/72c7188ae5ada929fe7c376baea1e9c4.jpg"},"numberOfGuests":1,"durationText":"half_day","gender":null,"displayOrder":5,"telephoneOnly":false,"price":{"amount":9900

#### `appleby-luxuriance-including-a-back-neck-and-shoulder-massage-friday-sunday`

- Matching tier: **1** (booking item `11232`)
- Rename applied: `appleby-luxuriance-massage-weekend` → `appleby-luxuriance-including-a-back-neck-and-shoulder-massage-friday-sunday`
  - name: "Luxuriance Including a Back, Neck and Shoulder Massage" → "Luxuriance Including a Back, Neck and Shoulder Massage Friday - Sunday"
- Stored → source: **£109 → £109** (unchanged; no movePct)
- Artifact: `spa-15-11232.html`
- Arithmetic: `pence` — span shows `10900`, ÷100 = £109
- Gate verdict: **grounded ✅ verified unchanged** — `lastVerified` bumped to 2026-08-09

  Quote (verbatim span, truncated here for readability — full span in `spa-15-checks.json`):

  > "name":"Luxuriance Including a Back, Neck and Shoulder Massage Friday - Sunday","description":"Choose to use your time, your way.\n\nBegin the day by shedding your outdoor wear and changing into a warm, fluffy robe. Spend time in the Aqua Thermal area - Your experience begins in the Aroma Salt inhal
  >   … [1937 chars] …
  > rience.","termsAndConditions":"\n","image":{"externalKey":"76fbfe991091376cdf0f82cbe08d13ea","url":"https://hcommerce-live.s3.amazonaws.com/76fbfe991091376cdf0f82cbe08d13ea.jpg"},"numberOfGuests":1,"durationText":"half_day","gender":null,"displayOrder":6,"telephoneOnly":false,"price":{"amount":10900

#### `appleby-luxurience-friday-sunday`

- Matching tier: **1** (booking item `6714`)
- Rename applied: `appleby-luxurience-weekend` → `appleby-luxurience-friday-sunday`
  - name: "Luxurience" → "Luxurience | Friday - Sunday"
- Stored → source: **£99 → £99** (unchanged; no movePct)
- Artifact: `spa-15-6714.html`
- Arithmetic: `pence` — span shows `9900`, ÷100 = £99
- Gate verdict: **grounded ✅ verified unchanged** — `lastVerified` bumped to 2026-08-09

  Quote (verbatim span, truncated here for readability — full span in `spa-15-checks.json`):

  > "name":"Luxurience | Friday - Sunday","description":"Choose to use your time, your way.\n\nBegin the day by shedding your outdoor wear and changing into a warm, fluffy robe. Spend time in the Aqua Thermal area - Your experience begins in the Aroma Salt inhalation Room, a warm, gentle heat. Time to e
  >   … [2101 chars] …
  > erience.","termsAndConditions":null,"image":{"externalKey":"2ed9df0c921ef3d7d336c4005b47ee1d","url":"https://hcommerce-live.s3.amazonaws.com/2ed9df0c921ef3d7d336c4005b47ee1d.jpg"},"numberOfGuests":1,"durationText":"half_day","gender":null,"displayOrder":5,"telephoneOnly":false,"price":{"amount":9900

#### `appleby-luxurience-monday-thursday`

- Matching tier: **1** (booking item `6715`)
- Rename applied: `appleby-luxurience-weekday` → `appleby-luxurience-monday-thursday`
  - name: "Luxurience" → "Luxurience | Monday - Thursday"
- Stored → source: **£89 → £89** (unchanged; no movePct)
- Artifact: `spa-15-6715.html`
- Arithmetic: `pence` — span shows `8900`, ÷100 = £89
- Gate verdict: **grounded ✅ verified unchanged** — `lastVerified` bumped to 2026-08-09

  Quote (verbatim span, truncated here for readability — full span in `spa-15-checks.json`):

  > "name":"Luxurience | Monday - Thursday","description":"Choose to use your time, your way.\n\nBegin the day by shedding your outdoor wear and changing into a warm, fluffy robe. Spend time in the Aqua Thermal area - Your experience begins in the Aroma Salt inhalation Room, a warm, gentle heat. Time to
  >   … [2103 chars] …
  > erience.","termsAndConditions":null,"image":{"externalKey":"0323fca8dc233b5235c9007262c60583","url":"https://hcommerce-live.s3.amazonaws.com/0323fca8dc233b5235c9007262c60583.jpg"},"numberOfGuests":1,"durationText":"half_day","gender":null,"displayOrder":5,"telephoneOnly":false,"price":{"amount":8900

#### `appleby-aqua-thermal-journey-light-afternoon-tea-fri-sun`

- Matching tier: **1** (booking item `12307`)
- Rename applied: `appleby-thermal-light-tea-weekend` → `appleby-aqua-thermal-journey-light-afternoon-tea-fri-sun`
  - name: "Aqua Thermal Journey & Light Afternoon Tea" → "Aqua Thermal Journey & Light Afternoon Tea Fri-sun"
- Stored → source: **£59 → £59** (unchanged; no movePct)
- Artifact: `spa-15-12307.html`
- Arithmetic: `pence` — span shows `5900`, ÷100 = £59
- Gate verdict: **grounded ✅ verified unchanged** — `lastVerified` bumped to 2026-08-09

  Quote (verbatim span, truncated here for readability — full span in `spa-15-checks.json`):

  > "name":"Aqua Thermal Journey \u0026 Light Afternoon Tea Fri-sun","description":"Shed your outdoor wear and changing into a warm, fluffy robe. Spend time in the Aqua Thermal area - Your experience begins in the Aroma Salt inhalation Room, a warm, gentle heat. Time to enjoy the relaxing massaging jets
  >   … [763 chars] …
  > m - 5.00pm \n ","termsAndConditions":null,"image":{"externalKey":"67e6af1102cd85d5df11ea6b1212996c","url":"https://hcommerce-live.s3.amazonaws.com/67e6af1102cd85d5df11ea6b1212996c.jpg"},"numberOfGuests":1,"durationText":null,"gender":null,"displayOrder":6,"telephoneOnly":false,"price":{"amount":5900

#### `appleby-aqua-thermal-journey-light-afternoon-tea-monday-thursday`

- Matching tier: **1** (booking item `9278`)
- Rename applied: `appleby-thermal-light-tea-weekday` → `appleby-aqua-thermal-journey-light-afternoon-tea-monday-thursday`
  - name: "Aqua Thermal Journey & Light Afternoon Tea" → "Aqua Thermal Journey & Light Afternoon Tea Monday - Thursday"
- Stored → source: **£49 → £49** (unchanged; no movePct)
- Artifact: `spa-15-9278.html`
- Arithmetic: `pence` — span shows `4900`, ÷100 = £49
- Gate verdict: **grounded ✅ verified unchanged** — `lastVerified` bumped to 2026-08-09

  Quote (verbatim span, truncated here for readability — full span in `spa-15-checks.json`):

  > "name":"Aqua Thermal Journey \u0026 Light Afternoon Tea Monday - Thursday","description":"Shed your outdoor wear and changing into a warm, fluffy robe. Spend time in the Aqua Thermal area - Your experience begins in the Aroma Salt inhalation Room, a warm, gentle heat. Time to enjoy the relaxing mass
  >   … [773 chars] …
  > m - 5.00pm \n ","termsAndConditions":null,"image":{"externalKey":"bfaf8748eab2880b8edbe4da7f92dfeb","url":"https://hcommerce-live.s3.amazonaws.com/bfaf8748eab2880b8edbe4da7f92dfeb.jpg"},"numberOfGuests":1,"durationText":null,"gender":null,"displayOrder":6,"telephoneOnly":false,"price":{"amount":4900

#### `appleby-aqua-thermal-spa-experience-with-lunch-or-afternoon-tea-friday-sunday`

- Matching tier: **1** (booking item `6706`)
- Rename applied: `appleby-thermal-meal-weekend` → `appleby-aqua-thermal-spa-experience-with-lunch-or-afternoon-tea-friday-sunday`
  - name: "Aqua Thermal Spa Experience with Lunch or Afternoon Tea" → "Aqua Thermal Spa Experience with Lunch or Afternoon Tea | Friday - Sunday"
- Stored → source: **£65 → £65** (unchanged; no movePct)
- Artifact: `spa-15-6706.html`
- Arithmetic: `pence` — span shows `6500`, ÷100 = £65
- Gate verdict: **grounded ✅ verified unchanged** — `lastVerified` bumped to 2026-08-09

  Quote (verbatim span, truncated here for readability — full span in `spa-15-checks.json`):

  > "name":"Aqua Thermal Spa Experience with Lunch or Afternoon Tea | Friday - Sunday","description":"Enjoy a Two hour Aqua Thermal Journey Followed by either a Two Course Lunch or Afternoon Tea (the food choice is linked to the arrival time, if booking the 10am session then lunch will be booked if book
  >   … [2077 chars] …
  > e experience.","termsAndConditions":null,"image":{"externalKey":"59fec50c159dc0e4d648854a8af56fb1","url":"https://hcommerce-live.s3.amazonaws.com/59fec50c159dc0e4d648854a8af56fb1.jpg"},"numberOfGuests":1,"durationText":null,"gender":null,"displayOrder":13,"telephoneOnly":false,"price":{"amount":6500

#### `appleby-aqua-thermal-spa-experience-with-lunch-or-afternoon-tea-monday-thursday`

- Matching tier: **1** (booking item `6707`)
- Rename applied: `appleby-thermal-meal-weekday` → `appleby-aqua-thermal-spa-experience-with-lunch-or-afternoon-tea-monday-thursday`
  - name: "Aqua Thermal Spa Experience with Lunch or Afternoon Tea" → "Aqua Thermal Spa Experience with Lunch or Afternoon Tea | Monday - Thursday"
- Stored → source: **£60 → £60** (unchanged; no movePct)
- Artifact: `spa-15-6707.html`
- Arithmetic: `pence` — span shows `6000`, ÷100 = £60
- Gate verdict: **grounded ✅ verified unchanged** — `lastVerified` bumped to 2026-08-09

  Quote (verbatim span, truncated here for readability — full span in `spa-15-checks.json`):

  > "name":"Aqua Thermal Spa Experience with Lunch or Afternoon Tea | Monday - Thursday","description":"Enjoy a Two hour Aqua Thermal Journey Followed by either a Two Course Lunch or Afternoon Tea (the food choice is linked to the arrival time, if booking the 10am session then lunch will be booked if bo
  >   … [2077 chars] …
  > ble experience.","termsAndConditions":"","image":{"externalKey":"cec361c8538288b74d5191cabe8735ef","url":"https://hcommerce-live.s3.amazonaws.com/cec361c8538288b74d5191cabe8735ef.jpg"},"numberOfGuests":1,"durationText":null,"gender":null,"displayOrder":13,"telephoneOnly":false,"price":{"amount":6000

#### `appleby-aqua-thermal-journey-monday-to-sunday`

- Matching tier: **1** (booking item `9279`)
- Rename applied: `appleby-thermal-only` → `appleby-aqua-thermal-journey-monday-to-sunday`
  - name: "Aqua Thermal Journey" → "Aqua Thermal Journey Monday to Sunday"
- Stored → source: **£45 → £45** (unchanged; no movePct)
- Artifact: `spa-15-9279.html`
- Arithmetic: `pence` — span shows `4500`, ÷100 = £45
- Gate verdict: **grounded ✅ verified unchanged** — `lastVerified` bumped to 2026-08-09

  Quote (verbatim span, truncated here for readability — full span in `spa-15-checks.json`):

  > "name":"Aqua Thermal Journey Monday to Sunday","description":"Spend time in the Aqua Thermal area - \nYour experience begins in the Aroma Salt inhalation Room, a\nwarm, gentle heat. \nTime to enjoy the relaxing massaging jets of the Pedidarium on your feet,\nmove on to the warm, moist heat of\nthe s
  >   … [1421 chars] …
  > e experience.","termsAndConditions":null,"image":{"externalKey":"fd5eb51bd7801876bb80858b77250e6c","url":"https://hcommerce-live.s3.amazonaws.com/fd5eb51bd7801876bb80858b77250e6c.jpg"},"numberOfGuests":1,"durationText":null,"gender":null,"displayOrder":16,"telephoneOnly":false,"price":{"amount":4500

### ⚠️ Prose-mention flags (never rewritten)

25 distinct file:line mentions of renamed package names.

**22 in `src/data/faqs/spa-15-faqs.tsx`** — Appleby's own FAQ prose still uses the short package names ("Indulgence", "Luxurience", "Aqua Thermal Journey"). Mechanical id references were rewritten automatically; this prose was not. Reads fine as-is — the short names are what guests call them — so this is a review item, not a defect.

- `src/data/faqs/spa-15-faqs.tsx:18` — "Indulgence" — const indulgenceWeekendPrice = getDayPassPrice(spa.id, 'appleby-indulgence-friday-sunday');
- `src/data/faqs/spa-15-faqs.tsx:19` — "Indulgence" — const indulgenceWeekdayPrice = getDayPassPrice(spa.id, 'appleby-indulgence-weekday');
- `src/data/faqs/spa-15-faqs.tsx:20` — "Indulgence" — const indulgenceDuration = getDayPassDuration(spa.id, 'appleby-indulgence-friday-sunday');
- `src/data/faqs/spa-15-faqs.tsx:45` — "Indulgence" — <Link href="#appleby-indulgence-friday-sunday" className="underline">
- `src/data/faqs/spa-15-faqs.tsx:46` — "Indulgence" — Indulgence
- `src/data/faqs/spa-15-faqs.tsx:48` — "Indulgence" — at {indulgenceWeekendPrice || '£125'} per person on weekends ({indulgenceWeekdayPrice || '£115'} weekdays), wh
- `src/data/faqs/spa-15-faqs.tsx:65` — "Indulgence" — schemaText: `Spa day packages at ${spa.name} start from ${thermalOnlyPrice || '£45'} per person for a ${therma
- `src/data/faqs/spa-15-faqs.tsx:81` — "Indulgence" — to full {indulgenceDuration || '5 hour'} experiences with treatments and dining included. All packages must be
- `src/data/faqs/spa-15-faqs.tsx:21` — "Luxurience" — const luxurienceWeekdayPrice = getDayPassPrice(spa.id, 'appleby-luxurience-weekday');
- `src/data/faqs/spa-15-faqs.tsx:22` — "Luxurience" — const luxurienceWeekendPrice = getDayPassPrice(spa.id, 'appleby-luxurience-friday-sunday');
- `src/data/faqs/spa-15-faqs.tsx:23` — "Luxurience" — const luxurienceDuration = getDayPassDuration(spa.id, 'appleby-luxurience-weekday');
- `src/data/faqs/spa-15-faqs.tsx:52` — "Luxurience" — <Link href="#appleby-luxurience-weekday" className="underline">
- `src/data/faqs/spa-15-faqs.tsx:53` — "Luxurience" — Luxurience packages
- `src/data/faqs/spa-15-faqs.tsx:55` — "Luxurience" — offer a {luxurienceDuration || '3 hour'} thermal journey with a {treatment25Min || '25 minute'} treatment and 
- `src/data/faqs/spa-15-faqs.tsx:191` — "Luxurience" — <Link href="#appleby-luxurience-weekday" className="underline">
- `src/data/faqs/spa-15-faqs.tsx:192` — "Luxurience" — Luxurience packages
- `src/data/faqs/spa-15-faqs.tsx:194` — "Luxurience" — from {luxurienceWeekdayPrice || '£89'} also offer the lunch or afternoon tea choice, and add a {treatment25Min
- `src/data/faqs/spa-15-faqs.tsx:204` — "Luxurience" — schemaText: `Yes, several Garden Spa day packages include afternoon tea. The Aqua Thermal Journey with Light A
- `src/data/faqs/spa-15-faqs.tsx:188` — "Aqua Thermal Spa Experience with Lunch or Afternoon Tea" — Aqua Thermal Spa Experience with Lunch or Afternoon Tea
- `src/data/faqs/spa-15-faqs.tsx:42` — "Aqua Thermal Journey" — Aqua Thermal Journey
- `src/data/faqs/spa-15-faqs.tsx:181` — "Aqua Thermal Journey" — Aqua Thermal Journey with Light Afternoon Tea
- `src/data/faqs/spa-15-faqs.tsx:197` — "Aqua Thermal Journey" — All afternoon tea options pair with the full Aqua Thermal Journey including the hydrotherapy pool, outdoor spa

**3 false positives at other spas** — the ordinary English word "indulgence", unrelated to Appleby's package. No action.

- `src/data/faqs/spa-12-faqs.tsx:79` — For the ultimate indulgence, the{' '}
- `src/data/faqs/spa-4-faqs.tsx:151` — (from {champagneTrufflesPrice || '£121'}). For the ultimate indulgence, the{' '}
- `src/data/faqs/spa-4-faqs.tsx:165` — schemaText: `${spa.name} offers 33 spa treatments using${brandsText ? ` ${brandsText}` : ' Temple Spa products

### Invariant check

```
node .claude/skills/refresh-day-passes/scripts/check-invariant.mjs \
  ".claude/content-out/refresh-runs/2026-08-09" "2026-08-09" "15"

{ "runDate": "2026-08-09", "ok": true,
  "report": [ { "spaId": "15", "fetched": true, "passes": 11, "violations": [] } ] }
exit 0 — invariant holds, 0 violations
```

