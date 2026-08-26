# Day-pass refresh — evidence — 2026-08-26

Tier: `portal-trybe` (issue 03b). Prices read from the server-rendered
`application/ld+json` `Product` block on each booking item, `arithmetic: "gbp-integer"`.

## North Lakes Hotel Spa (12)

- **Source:** per-pass `bookingUrl` on try.be (NOT `dayPassUrl`)
- **Booking items:** 5 distinct, for 10 passes — fan-out, weekday=`lowPrice` / weekend=`highPrice`
- **Artifacts:** `.claude/content-out/refresh-runs/2026-08-26/spa-12-<item>.html` — all HTTP 200
- **Gate results:** `.claude/content-out/refresh-runs/2026-08-26/spa-12-gate-results.json`
- **Fetch timestamp:** 2026-08-26 21:06 BST
- **Grounded:** 10 / 10 · **Flagged:** 0
- **Price changes:** 10
- **Matching:** 10/10 at tier 1 (synthetic per-variant booking id); 0 tier-3, 0 missing, 0 unmatched-fetched

### Per-pass

#### `north-lakes-simple-ritual-weekday`

- Matching tier: **1** (booking item `simple-ritual`, variant `weekday` → `offers.lowPrice`)
- Source item name: "Simple Ritual" (stored `packageName`: "The Simple Ritual")
- Booking URL: https://northlakeshotel.try.be/items/66d86135b55c898c4c09db14/simple-ritual
- Stored → source: **£63 → £68** — 💷 changed, movePct 7.9%
- Artifact: `spa-12-simple-ritual.html`
- Arithmetic: `gbp-integer` — span shows `68`, identity conversion to £68
- Gate verdict: **grounded ✅** — price updated, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Simple Ritual","description":"<div><p>For those looking to enjoy a day by the pool, using our stunning facilities, this is the perfect day for you to unwind. Your day includes full use of the Spa facilities and a light lunch or afternoon tea.<\/p><p>Please be advised that our aqua classes run at the following times:<\/p><p>MONDAY &ndash; 12:15pm - 1:00pm<\/p><p>TUESDAY &ndash; 12:30pm - 1:15pm<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/43789\/547475a9-935d-4599-b83c-27a5616003f4.jpg","sku":"SIMPLERITUAL","offers":{"@type":"AggregateOffer","lowPrice":68

#### `north-lakes-simple-ritual-weekend`

- Matching tier: **1** (booking item `simple-ritual`, variant `weekend` → `offers.highPrice`)
- Source item name: "Simple Ritual" (stored `packageName`: "The Simple Ritual")
- Booking URL: https://northlakeshotel.try.be/items/66d86135b55c898c4c09db14/simple-ritual
- Stored → source: **£73 → £78** — 💷 changed, movePct 6.8%
- Artifact: `spa-12-simple-ritual.html`
- Arithmetic: `gbp-integer` — span shows `78`, identity conversion to £78
  - ℹ️ this span also contains `"lowPrice":68` (it precedes `highPrice` in the JSON); the gate proves the claimed £78 is present, but the span is not exclusive
- Gate verdict: **grounded ✅** — price updated, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Simple Ritual","description":"<div><p>For those looking to enjoy a day by the pool, using our stunning facilities, this is the perfect day for you to unwind. Your day includes full use of the Spa facilities and a light lunch or afternoon tea.<\/p><p>Please be advised that our aqua classes run at the following times:<\/p><p>MONDAY &ndash; 12:15pm - 1:00pm<\/p><p>TUESDAY &ndash; 12:30pm - 1:15pm<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/43789\/547475a9-935d-4599-b83c-27a5616003f4.jpg","sku":"SIMPLERITUAL","offers":{"@type":"AggregateOffer","lowPrice":68,"highPrice":78

#### `north-lakes-morning-ritual-weekday`

- Matching tier: **1** (booking item `morning-ritual`, variant `weekday` → `offers.lowPrice`)
- Source item name: "Morning Ritual"
- Booking URL: https://northlakeshotel.try.be/items/66d86135b55c898c4c09db16/morning-ritual
- Stored → source: **£126 → £139** — 💷 changed, movePct 10.3%
- Artifact: `spa-12-morning-ritual.html`
- Arithmetic: `gbp-integer` — span shows `139`, identity conversion to £139
- Gate verdict: **grounded ✅** — price updated, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Morning Ritual","description":"<div><p>Experience a morning of relaxation with a 50 minute treatment or a choice of two 25 minute treatments, along with full use of our Spa facilities and a light lunch.<\/p>\n<p>Please be advised that our aqua classes run at the following times:<\/p>\n<p>MONDAY &ndash; 12:15pm - 1:00pm<\/p>\n<p>TUESDAY &ndash; 12.30pm &ndash; 1:15pm<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/43792\/b1d91263-0cac-46da-93b5-66bdcb420117.jpg","sku":"MORNINGRITUAL","offers":{"@type":"AggregateOffer","lowPrice":139

#### `north-lakes-morning-ritual-weekend`

- Matching tier: **1** (booking item `morning-ritual`, variant `weekend` → `offers.highPrice`)
- Source item name: "Morning Ritual"
- Booking URL: https://northlakeshotel.try.be/items/66d86135b55c898c4c09db16/morning-ritual
- Stored → source: **£136 → £149** — 💷 changed, movePct 9.6%
- Artifact: `spa-12-morning-ritual.html`
- Arithmetic: `gbp-integer` — span shows `149`, identity conversion to £149
  - ℹ️ this span also contains `"lowPrice":139` (it precedes `highPrice` in the JSON); the gate proves the claimed £149 is present, but the span is not exclusive
- Gate verdict: **grounded ✅** — price updated, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Morning Ritual","description":"<div><p>Experience a morning of relaxation with a 50 minute treatment or a choice of two 25 minute treatments, along with full use of our Spa facilities and a light lunch.<\/p>\n<p>Please be advised that our aqua classes run at the following times:<\/p>\n<p>MONDAY &ndash; 12:15pm - 1:00pm<\/p>\n<p>TUESDAY &ndash; 12.30pm &ndash; 1:15pm<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/43792\/b1d91263-0cac-46da-93b5-66bdcb420117.jpg","sku":"MORNINGRITUAL","offers":{"@type":"AggregateOffer","lowPrice":139,"highPrice":149

#### `north-lakes-afternoon-ritual-weekday`

- Matching tier: **1** (booking item `afternoon-ritual`, variant `weekday` → `offers.lowPrice`)
- Source item name: "Afternoon Ritual"
- Booking URL: https://northlakeshotel.try.be/items/66d86135b55c898c4c09db18/afternoon-ritual
- Stored → source: **£126 → £139** — 💷 changed, movePct 10.3%
- Artifact: `spa-12-afternoon-ritual.html`
- Arithmetic: `gbp-integer` — span shows `139`, identity conversion to £139
- Gate verdict: **grounded ✅** — price updated, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Afternoon Ritual","description":"<div><p>If you are looking for a leisurely swim and relaxing spa treatment, followed by a delicious afternoon tea whilst tucked up in your robe and slippers overlooking the pool, then this is perfect Spa Day for you. With full use of the Spa facilities, 
  >   … [156 chars] …
  > h family and friends.<\/p>\n<p>Please be advised that our aqua classes run at the following times:<\/p>\n<p>MONDAY &ndash; 12:15pm - 1:00pm<\/p>\n<p>TUESDAY &ndash; 12:30pm - 1:15pm<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/43795\/9e690a3b-5059-4e56-97d3-9ad07cd517b2.jpg","sku":"AFTERNOONRITUAL","offers":{"@type":"AggregateOffer","lowPrice":139

#### `north-lakes-afternoon-ritual-weekend`

- Matching tier: **1** (booking item `afternoon-ritual`, variant `weekend` → `offers.highPrice`)
- Source item name: "Afternoon Ritual"
- Booking URL: https://northlakeshotel.try.be/items/66d86135b55c898c4c09db18/afternoon-ritual
- Stored → source: **£136 → £149** — 💷 changed, movePct 9.6%
- Artifact: `spa-12-afternoon-ritual.html`
- Arithmetic: `gbp-integer` — span shows `149`, identity conversion to £149
  - ℹ️ this span also contains `"lowPrice":139` (it precedes `highPrice` in the JSON); the gate proves the claimed £149 is present, but the span is not exclusive
- Gate verdict: **grounded ✅** — price updated, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Afternoon Ritual","description":"<div><p>If you are looking for a leisurely swim and relaxing spa treatment, followed by a delicious afternoon tea whilst tucked up in your robe and slippers overlooking the pool, then this is perfect Spa Day for you. With full use of the Spa facilities, 
  >   … [172 chars] …
  > ends.<\/p>\n<p>Please be advised that our aqua classes run at the following times:<\/p>\n<p>MONDAY &ndash; 12:15pm - 1:00pm<\/p>\n<p>TUESDAY &ndash; 12:30pm - 1:15pm<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/43795\/9e690a3b-5059-4e56-97d3-9ad07cd517b2.jpg","sku":"AFTERNOONRITUAL","offers":{"@type":"AggregateOffer","lowPrice":139,"highPrice":149

#### `north-lakes-twilight-ritual-weekday`

- Matching tier: **1** (booking item `twilight-ritual`, variant `weekday` → `offers.lowPrice`)
- Source item name: "Twilight Ritual"
- Booking URL: https://northlakeshotel.try.be/items/66d86136b55c898c4c09db1a/twilight-ritual
- Stored → source: **£126 → £139** — 💷 changed, movePct 10.3%
- Artifact: `spa-12-twilight-ritual.html`
- Arithmetic: `gbp-integer` — span shows `139`, identity conversion to £139
- Gate verdict: **grounded ✅** — price updated, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Twilight Ritual","description":"<div><p>What better way to escape the hustle and bustle of a busy working week than with our Twilight Spa Day?<\/p>\n<p>Arrive any time after 4 pm and change into your robe and slippers, before taking a dip in the pool.<\/p>\n<p>Enjoy a 50 minute treatmen
  >   … [319 chars] …
  > o&hellip;just perfect.<\/p>\n<p>Please be advised that our aqua classes run at the following times:<\/p>\n<p>MONDAY &ndash; 12:15pm - 1:00pm<\/p>\n<p>TUESDAY &ndash; 12:30pm - 1:15pm<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/43796\/eec945dc-be17-477e-9737-ca8d5c068535.jpg","sku":"TWILIGHTRITUAL","offers":{"@type":"AggregateOffer","lowPrice":139

#### `north-lakes-twilight-ritual-weekend`

- Matching tier: **1** (booking item `twilight-ritual`, variant `weekend` → `offers.highPrice`)
- Source item name: "Twilight Ritual"
- Booking URL: https://northlakeshotel.try.be/items/66d86136b55c898c4c09db1a/twilight-ritual
- Stored → source: **£136 → £149** — 💷 changed, movePct 9.6%
- Artifact: `spa-12-twilight-ritual.html`
- Arithmetic: `gbp-integer` — span shows `149`, identity conversion to £149
  - ℹ️ this span also contains `"lowPrice":139` (it precedes `highPrice` in the JSON); the gate proves the claimed £149 is present, but the span is not exclusive
- Gate verdict: **grounded ✅** — price updated, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Twilight Ritual","description":"<div><p>What better way to escape the hustle and bustle of a busy working week than with our Twilight Spa Day?<\/p>\n<p>Arrive any time after 4 pm and change into your robe and slippers, before taking a dip in the pool.<\/p>\n<p>Enjoy a 50 minute treatmen
  >   … [335 chars] …
  > rfect.<\/p>\n<p>Please be advised that our aqua classes run at the following times:<\/p>\n<p>MONDAY &ndash; 12:15pm - 1:00pm<\/p>\n<p>TUESDAY &ndash; 12:30pm - 1:15pm<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/43796\/eec945dc-be17-477e-9737-ca8d5c068535.jpg","sku":"TWILIGHTRITUAL","offers":{"@type":"AggregateOffer","lowPrice":139,"highPrice":149

#### `north-lakes-pure-luxury-weekday`

- Matching tier: **1** (booking item `pure-luxury-spa-experience`, variant `weekday` → `offers.lowPrice`)
- Source item name: "Pure Luxury Spa Experience"
- Booking URL: https://northlakeshotel.try.be/items/66d86136b55c898c4c09db1e/pure-luxury-spa-experience
- Stored → source: **£250 → £280** — 💷 changed, movePct 12%
- Artifact: `spa-12-pure-luxury-spa-experience.html`
- Arithmetic: `gbp-integer` — span shows `280`, identity conversion to £280
- Gate verdict: **grounded ✅** — price updated, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Pure Luxury Spa Experience","description":"<div><p>This therapeutic Spa day provides you with the opportunity to experience our most exclusive Spa treatments.<\/p>\n<p>Your day includes four hours to relax and enjoy the Spa facilities before you indulge in the full body exfoliation, pur
  >   … [174 chars] …
  > with a cream tea.<\/p>\n<p>Please be advised that our aqua classes run at the following times:<\/p>\n<p>MONDAY &ndash; 12:15pm - 1:00pm<\/p>\n<p>TUESDAY &ndash; 12:30pm - 1:15pm<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/43801\/c0518639-a4fe-419a-a116-9a056626e18b.jpg","sku":"PURELUXURYSPAACCESS","offers":{"@type":"AggregateOffer","lowPrice":280

#### `north-lakes-pure-luxury-weekend`

- Matching tier: **1** (booking item `pure-luxury-spa-experience`, variant `weekend` → `offers.highPrice`)
- Source item name: "Pure Luxury Spa Experience"
- Booking URL: https://northlakeshotel.try.be/items/66d86136b55c898c4c09db1e/pure-luxury-spa-experience
- Stored → source: **£260 → £290** — 💷 changed, movePct 11.5%
- Artifact: `spa-12-pure-luxury-spa-experience.html`
- Arithmetic: `gbp-integer` — span shows `290`, identity conversion to £290
  - ℹ️ this span also contains `"lowPrice":280` (it precedes `highPrice` in the JSON); the gate proves the claimed £290 is present, but the span is not exclusive
- Gate verdict: **grounded ✅** — price updated, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Pure Luxury Spa Experience","description":"<div><p>This therapeutic Spa day provides you with the opportunity to experience our most exclusive Spa treatments.<\/p>\n<p>Your day includes four hours to relax and enjoy the Spa facilities before you indulge in the full body exfoliation, pur
  >   … [190 chars] …
  > .<\/p>\n<p>Please be advised that our aqua classes run at the following times:<\/p>\n<p>MONDAY &ndash; 12:15pm - 1:00pm<\/p>\n<p>TUESDAY &ndash; 12:30pm - 1:15pm<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/43801\/c0518639-a4fe-419a-a116-9a056626e18b.jpg","sku":"PURELUXURYSPAACCESS","offers":{"@type":"AggregateOffer","lowPrice":280,"highPrice":290

### ⚠️ Possible renames — SUGGESTED, NOT APPLIED

- `north-lakes-simple-ritual-weekday`: "The Simple Ritual" → "Simple Ritual"
- `north-lakes-simple-ritual-weekend`: "The Simple Ritual" → "Simple Ritual"

Both passes above are weekday/weekend variants of ONE booking item, so they share a
`packageName`. Applying the rename re-slugs BOTH to the same id —
`planRename` returns `{ applied: true, newId: "north-lakes-simple-ritual" }` for each —
producing duplicate ids and stripping the weekday/weekend distinction the source does not
carry. Suppressed per the fan-out rule in SKILL.md; code-level guard filed as issue 12.

## Underscar (19)

- **Source:** per-pass `bookingUrl` on try.be (NOT `dayPassUrl`)
- **Booking items:** 7 distinct, for 7 passes — 1:1
- **Artifacts:** `.claude/content-out/refresh-runs/2026-08-26/spa-19-<item>.html` — all HTTP 200
- **Gate results:** `.claude/content-out/refresh-runs/2026-08-26/spa-19-gate-results.json`
- **Fetch timestamp:** 2026-08-26 21:06 BST
- **Grounded:** 7 / 7 · **Flagged:** 0
- **Price changes:** 0
- **Matching:** 7/7 at tier 1 (synthetic per-variant booking id); 0 tier-3, 0 missing, 0 unmatched-fetched
- **`lowPrice === highPrice` verified on all 7 items** — single-variant, so reading `lowPrice` loses nothing

### Per-pass

#### `underscar-twilight-spa`

- Matching tier: **1** (booking item `twilight-spa-experience`, variant `single` → `offers.lowPrice`)
- Source item name: "Twilight Spa Experience"
- Booking URL: https://underscar.try.be/items/65b4f16e90dd65ddf90f8f26/twilight-spa-experience
- Stored → source: **£55 → £55** — unchanged
- Artifact: `spa-19-twilight-spa-experience.html`
- Arithmetic: `gbp-integer` — span shows `55`, identity conversion to £55
- Gate verdict: **grounded ✅** — verified unchanged, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Twilight Spa Experience","description":"<div><p>Nestled under the slopes of Skiddaw and Latrigg just on the out skirts of Keswick immerse yourself in a day of calm with our Twilight Spa Experience, a package tailored to provide the ultimate relaxation for mind, body and spirit. <br>\n <
  >   … [37 chars] …
  > r facilities, featuring:<br>\nPool, Jacuzzi, Sauna, Steam Room, and a fully-equipped Gym.<\/p>\n<p>Includes towel, robe and slippers.<br>\n <br>\nALL spa day guests MUST BE 16 years old and over.<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/29391\/91d5d620-e4c6-4bcc-8a92-fca161c78542.jpg","sku":null,"offers":{"@type":"AggregateOffer","lowPrice":55

#### `underscar-harmonie-half-day`

- Matching tier: **1** (booking item `harmonie-half-spa-day`, variant `single` → `offers.lowPrice`)
- Source item name: "Harmonie Half Spa Day"
- Booking URL: https://underscar.try.be/items/6581b78cd738b4eec60662d7/harmonie-half-spa-day
- Stored → source: **£80 → £80** — unchanged
- Artifact: `spa-19-harmonie-half-spa-day.html`
- Arithmetic: `gbp-integer` — span shows `80`, identity conversion to £80
- Gate verdict: **grounded ✅** — verified unchanged, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Harmonie Half Spa Day","description":"<div><p>Indulge in a half-day retreat with our Harmonie half spa day package. Immerse yourself in our luxury facilities featuring: Pool, Jacuzzi, Sauna, Steam Room, and a state-of-the-art Gym. We are located on the outskirts of Keswick under the slo
  >   … [669 chars] …
  > es a drink (hot drink or fresh orange\/apple juice) and a slice of traybake <br>\nTowel, robe and slippers <br>\n30 minute treatment. <br>\n <br>\nALL spa day guests MUST BE 16 years old and over<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/29794\/4e29c52f-2b9a-428a-a5fd-c0517fc35e47.jpg","sku":null,"offers":{"@type":"AggregateOffer","lowPrice":80

#### `underscar-serenity-half-day`

- Matching tier: **1** (booking item `serenity-half-spa-day`, variant `single` → `offers.lowPrice`)
- Source item name: "Serenity Half Spa Day"
- Booking URL: https://underscar.try.be/items/657242904ea5689b6c06e573/serenity-half-spa-day
- Stored → source: **£90 → £90** — unchanged
- Artifact: `spa-19-serenity-half-spa-day.html`
- Arithmetic: `gbp-integer` — span shows `90`, identity conversion to £90
- Gate verdict: **grounded ✅** — verified unchanged, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Serenity Half Spa Day","description":"<div><p>Unwind at the Spa at Underscar just beyond Keswick, nestled in a stunning natural setting. Embark on a journey to serenity with our Serenity Half Spa Day, carefully crafted to envelop you in an oasis of calm. Immerse yourself in our faciliti
  >   … [928 chars] …
  > drink (hot drink or fresh orange\/apple juice) and a slice of traybake &nbsp;<br>\nTowel, robe and slippers<br>\n30 minute treatment.<br>\n <br>\nALL spa day guests MUST BE 16 years old and over.<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/29390\/a6945ad8-bbe0-43a0-8217-6290f1aff78f.jpg","sku":null,"offers":{"@type":"AggregateOffer","lowPrice":90

#### `underscar-mindfulness-half-day`

- Matching tier: **1** (booking item `mindfulness-half-spa-day`, variant `single` → `offers.lowPrice`)
- Source item name: "Mindfulness Half Spa Day"
- Booking URL: https://underscar.try.be/items/65723dc3210eadd5d500250c/mindfulness-half-spa-day
- Stored → source: **£100 → £100** — unchanged
- Artifact: `spa-19-mindfulness-half-spa-day.html`
- Arithmetic: `gbp-integer` — span shows `100`, identity conversion to £100
- Gate verdict: **grounded ✅** — verified unchanged, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Mindfulness Half Spa Day","description":"<div><p>Embark on a journey of profound relaxation with our exclusive Mindfulness Half Spa Day, set against the beautiful backdrop of Skiddaw just outside the market town of Keswick. Every detail is brought together to transport you to a realm of
  >   … [987 chars] …
  > apple juice) and a slice of traybake &nbsp;<br>\nTowel, robe and slippers<br>\n30 minute Back Massage using a NEOM treatment candle.<br>\n <br>\nALL spa day guests MUST BE 16 years old and over.<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/29725\/881f4858-021d-48b1-8112-d61b73c9cf68.jpg","sku":null,"offers":{"@type":"AggregateOffer","lowPrice":100

#### `underscar-wellbeing-full-day`

- Matching tier: **1** (booking item `wellbeing-full-spa-day`, variant `single` → `offers.lowPrice`)
- Source item name: "Wellbeing Full Spa Day"
- Booking URL: https://underscar.try.be/items/65724105e24a2fe9550692e6/wellbeing-full-spa-day
- Stored → source: **£150 → £150** — unchanged
- Artifact: `spa-19-wellbeing-full-spa-day.html`
- Arithmetic: `gbp-integer` — span shows `150`, identity conversion to £150
- Gate verdict: **grounded ✅** — verified unchanged, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Wellbeing Full Spa Day","description":"<div><p>Indulge in a luxurious spa day where all your senses are pampered. <br>\n <br>\nCreated by the Neom team of 11 experts, these treatments combine 6 of the most effective therapies &ndash; Meditation, Shiatsu, Cranio, Thai Massage, Trigger Po
  >   … [369 chars] …
  > obe and slippers<br>\n1 hour NEOM Treatment<br>\n <br>\nChoose one of the following:<br>\n- De-Stress<br>\n- Sleep<br>\n- Mood Boost<br>\n <br>\nALL spa day guests MUST BE 16 years old and over.<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/29797\/7dfdad20-ceeb-49f8-8408-eac581634669.jpg","sku":null,"offers":{"@type":"AggregateOffer","lowPrice":150

#### `underscar-peaceful-full-day`

- Matching tier: **1** (booking item `peaceful-full-spa-day`, variant `single` → `offers.lowPrice`)
- Source item name: "Peaceful Full Spa Day"
- Booking URL: https://underscar.try.be/items/657626bf1363da0fcf0b156f/peaceful-full-spa-day
- Stored → source: **£170 → £170** — unchanged
- Artifact: `spa-19-peaceful-full-spa-day.html`
- Arithmetic: `gbp-integer` — span shows `170`, identity conversion to £170
- Gate verdict: **grounded ✅** — verified unchanged, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Peaceful Full Spa Day","description":"<div><p>Nestled under the slopes of Skiddaw and Latrigg just on the out skirts of Keswick immerse yourself in a day of calm with our Peaceful Full Spa Day, a package tailored to provide the ultimate relaxation for mind, body and spirit. <br>\n <br>\
  >   … [728 chars] …
  >  the Pool, Jacuzzi, Sauna, Steam Room and Gym <br>\n9am-5:15pm<br>\nHigh Tea<br>\nTowel, robe and slippers<br>\n1 Hour of Treatment <br>\n <br>\nALL spa day guests MUST BE 16 years old and over.<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/29391\/91d5d620-e4c6-4bcc-8a92-fca161c78542.jpg","sku":null,"offers":{"@type":"AggregateOffer","lowPrice":170

#### `underscar-reflection-full-day`

- Matching tier: **1** (booking item `reflection-full-spa-day`, variant `single` → `offers.lowPrice`)
- Source item name: "Reflection Full Spa Day"
- Booking URL: https://underscar.try.be/items/65785b1f4e416d55710c20f2/reflection-full-spa-day
- Stored → source: **£210 → £210** — unchanged
- Artifact: `spa-19-reflection-full-spa-day.html`
- Arithmetic: `gbp-integer` — span shows `210`, identity conversion to £210
- Gate verdict: **grounded ✅** — verified unchanged, `lastVerified` bumped to 2026-08-26

  Quote (verbatim span):

  > {"@context":"https:\/\/schema.org\/","@type":"Product","name":"Reflection Full Spa Day","description":"<div><p>Relax and unwind fully with our Reflection Full Spa Day, treat yourself to the lavish escape you deserve &nbsp;&ndash; a day designed to rejuvenate your mind, body, and soul. From 9 am to 5:15 pm, immerse yourself in the spa world, taking 
  >   … [804 chars] …
  > e Pool, Jacuzzi, Sauna, Steam Room and Gym <br>\n9am-5:15pm<br>\nHigh Tea<br>\nTowel, robe and slippers<br>\nTwo hours of Treatment.<br>\n <br>\nALL spa day guests MUST BE 16 years old and over.<\/p><\/div>\n","image":"https:\/\/cdn.try.be\/29392\/840caaee-fa13-488a-a45a-8a1cbecd89b0.jpg","sku":null,"offers":{"@type":"AggregateOffer","lowPrice":210

## ℹ️ Note — stale fallback literals (not edited)

`src/data/faqs/spa-12-faqs.tsx` uses `{helper || '£63'}` fallback defaults that still carry
the old figures (£63/£73/£126/£136/£250/£260). These render only if the price helper returns
nothing, so pages show the new prices; the literals are dead defaults. Left untouched — the
iron rule limits this diff to `priceGBP` and `lastVerified`. Worth a separate tidy-up.

The prose claim "weekday prices typically £10 less than weekends" still holds after the rise
(68/78, 139/149, 280/290).

## Invariant check

```
node .claude/skills/refresh-day-passes/scripts/check-invariant.mjs \
  ".claude/content-out/refresh-runs/2026-08-26" "2026-08-26" "12,19"

{ "runDate": "2026-08-26", "ok": true, "report": [
  { "spaId": "12", "fetched": true, "passes": 10, "violations": [] },
  { "spaId": "19", "fetched": true, "passes": 7,  "violations": [] } ] }
exit 0 — invariant holds, 0 violations
```

