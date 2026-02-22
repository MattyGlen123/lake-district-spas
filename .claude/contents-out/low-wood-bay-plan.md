# Low Wood Bay Update — Implementation Plan

## What changes and why

Low Wood Bay has three distinct areas. The site currently treats all spa access as paid-for-guests, which is wrong. The correct model is:

| Area                                                                                                                     | Access                                                     |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| **Resort Leisure Area** (indoor pool, Infrared sauna, jacuzzi, steam room)                                               | Complimentary for all hotel guests — restricted hours only |
| **Outdoor Spa** (vitality pool, outdoor infinity pool, experience shower, outdoor hot tubs, fellside sauna, outdoor bar) | Paid — combined thermal journey ticket                     |
| **Indoor Thermal Spa** (indoor infinity pool, steam cabin, dry salt sauna, herbal lounge, mud room)                      | Paid — same combined thermal journey ticket                |

Hotel guests also get 25% off the thermal journey Mon–Thu. Day passes include the combined Outdoor + Indoor Thermal Spa. The Resort Leisure Area hours are restricted (7:30–10:00am all guests, 5:30–8:00pm adults only — no midday session).

---

## Phase 1 — Type system (foundation for everything else)

**File: `src/types/spa.ts`**

1. Add `'partial-for-guests'` to the `AccessLabel` union type.
2. Add a new entry to `accessLabelConfig` for `'partial-for-guests'`:
   - `label`: `'Partial spa access for hotel guests'`
   - `shortLabel`: `'Partial for guests'`
   - `color`: `'bg-spa-orange'`
   - `dot`: `'🟠'`
   - `badgeText`: `'LEISURE AREA INCLUDED FOR HOTEL GUESTS'`
   - `category`: `'hotel'`
3. Add `'bg-spa-orange'` → `'bg-orange-50 text-black border border-orange-200'` to the `badgeColorMap` in `SpaAccessBadges.tsx`.

---

## Phase 2 — Filter UI

**File: `src/components/FilterModal.tsx`**

Add `'partial-for-guests'` to the hardcoded `AccessLabel[]` array (line 92–98). The label will automatically appear in the filter list and display via `accessLabelConfig`.

---

## Phase 3 — Core spa data (`src/data/spas.ts`, spa id 7)

### `accessLabels`

Change from: `['paid-for-guests', 'day-passes-available']`
Change to: `['partial-for-guests', 'day-passes-available']`

### `metaDescription`

Update to reflect the leisure area is included for hotel guests.
Draft: _"Windermere's premium spa with complimentary leisure pool for hotel guests, plus a paid thermal journey with two outdoor infinity pools and stunning lake views. 16+ only."_

### `intro` (full rewrite)

Structure: paragraph 1 = overview of tiered access, paragraph 2 = what's included free, paragraph 3 = what's in the paid thermal journey.

Draft:

```
Low Wood Bay Resort & Spa operates a three-tier access model that sets it apart from most Lake District spa hotels. The Resort Leisure Area — including the indoor swimming pool, infra-red sauna, jacuzzi, and steam room — is complimentary for all hotel guests during opening hours. The full spa experience, comprising the Outdoor Spa and Indoor Thermal Spa, is purchased separately as a thermal journey.

The complimentary Resort Leisure Area is open for all guests 7:30am to 10:00am (last entry 9:30am), and adults-only from 5:30pm to 8:00pm (last entry 7:30pm). There is no midday session for hotel guests. It's worth knowing this before you book, especially if mid-afternoon pool access matters to you.

The paid thermal journey unlocks both the Outdoor Spa and Indoor Thermal Spa as one combined experience. Outdoors: a heated infinity pool (35°C) with panoramic Windermere views, a vitality pool with massage jets, two elevated hot tubs, the Fellside Sauna with a traditional log burner, and an experience shower. Indoors: an indoor infinity pool, coconut and vanilla steam cabin, Himalayan dry salt sauna, the herbal lounge with suspended loungers (45–50°C), and the private Mud Room. Hotel guests receive 25% off the thermal journey Monday to Thursday. Day spa packages are available for non-residents from 10am to 8pm. This is a 16+ spa.
```

### `keyFeatures`

```
[
  'Resort Leisure Area included free for all hotel guests (restricted hours)',
  'Paid thermal journey with two outdoor infinity pools and indoor infinity pool',
  'Six thermal experiences including outdoor Fellside Sauna with log burner',
  'Watersports spa packages: sailing, kayaking, and paddleboarding on Windermere',
]
```

### `thermalFacilities`

Reorganise with `details` field annotated to distinguish complimentary vs paid:

```ts
thermalFacilities: [
  {
    name: 'Infra-red Sauna',
    details: 'Complimentary for hotel guests — part of the Resort Leisure Area',
  },
  {
    name: 'Steam Room',
    details: 'Complimentary for hotel guests — part of the Resort Leisure Area',
  },
  {
    name: 'Fellside Sauna',
    details: 'Paid (thermal journey) — outdoor sauna warmed by a traditional log burner, with views across Lake Windermere to the Lakeland fells',
  },
  {
    name: 'Dry Salt Sauna',
    details: 'Paid (thermal journey) — lined with Himalayan salt bricks, supporting respiratory health and skin clarity',
  },
  {
    name: 'Steam Cabin',
    details: 'Paid (thermal journey) — coconut and vanilla-infused steam room that soothes the senses and detoxifies the skin',
  },
  {
    name: 'Herbal Lounge',
    details: 'Paid (thermal journey) — gently heated sanctuary (45–50°C) with suspended loungers and calming herbs',
  },
  {
    name: 'Mud Room',
    details: 'Paid (thermal journey) — private, bookable experience with mineral-rich muds and aromatic steam',
  },
  {
    name: 'Experience Showers',
    details: 'Paid (thermal journey) — multi-sensory showers, indoor and outdoor',
  },
],
```

### `poolFeatures`

```ts
poolFeatures: [
  {
    name: 'Indoor Swimming Pool',
    details: 'Complimentary for hotel guests — Resort Leisure Area pool, open 7:30–10:00am (all guests) and 5:30–8:00pm (adults only)',
  },
  {
    name: 'Jacuzzi / Hot Tub',
    details: 'Complimentary for hotel guests — part of Resort Leisure Area',
  },
  {
    name: 'Outdoor Infinity Pool',
    details: 'Paid (thermal journey) — heated to 35°C, panoramic views across Lake Windermere to the Langdale Pikes',
  },
  {
    name: 'Vitality Pool',
    details: 'Paid (thermal journey) — outdoor pool with built-in massage jets and seating areas',
  },
  {
    name: 'Outdoor Hot Tubs',
    details: 'Paid (thermal journey) — two elevated jacuzzis with views across the Cumbrian landscape',
  },
  {
    name: 'Indoor Infinity Pool',
    details: 'Paid (thermal journey) — heated indoor pool with lake and fell views',
  },
],
```

### `accessPolicy`

```ts
accessPolicy: [
  {
    name: 'Hotel Guests — Leisure Area',
    details: 'Resort Leisure Area (indoor pool, Infrared sauna, jacuzzi, steam room) included free for all hotel guests during opening hours',
    accessType: 'hotel',
  },
  {
    name: 'Leisure Area Hours',
    details: 'Open 7:30am–10:00am (last entry 9:30am, all guests) and 5:30pm–8:00pm (last entry 7:30pm, adults only). No midday session.',
    accessType: 'spa-hours',
  },
  {
    name: 'Hotel Guest Discount',
    details: '25% off thermal journey (Outdoor Spa + Indoor Thermal Spa) when booked separately, Monday to Thursday',
    accessType: 'general',
  },
  {
    name: 'Day Passes',
    details: 'Thermal journey (Outdoor Spa + Indoor Thermal Spa combined) available for public, various packages 10am–8pm',
    accessType: 'day-pass',
  },
  {
    name: 'Age Restriction',
    details: '16+ only (no children allowed)',
    accessType: 'age-restriction',
  },
  {
    name: 'Spa Hours',
    details: 'Treatments 9:30am–7:30pm and spa days 10am–8pm',
    accessType: 'spa-hours',
  },
  {
    name: 'Footwear',
    details: 'No slippers provided — bring flip flops or purchase on-site',
    accessType: 'general',
  },
  {
    name: 'Pregnancy',
    details: 'No thermal cabins, hot tubs or mud rooms',
    accessType: 'general',
  },
],
```

---

## Phase 4 — Spa FAQs

**File: `src/data/faqs/spa-7-faqs.tsx`**

Several FAQs need updating to reflect that hotel guests get partial complimentary access:

- **FAQ: "What's included in a spa day"** — current text says all spa days include the thermal facilities. This is accurate for day pass holders but needs to distinguish from hotel guest access. Add a sentence noting the Resort Leisure Area is complimentary for hotel guests during restricted hours, while the thermal journey is what day passes cover.

- **FAQ: "Do I need to book in advance"** — current text says "Hotel guests can add spa access separately with 25% discount Mon–Thu". Update to: hotel guests get the leisure area free, but need to book the thermal journey separately (with 25% Mon–Thu discount).

- **FAQ: "Can teenagers use the spa"** — current text is accurate (16+). No change needed for the age restriction itself, but update any references to "all spa facilities" being paid to note the leisure area is complimentary.

---

## Phase 5 — Location FAQs

**File: `src/data/location-faqs/windermere-faqs.tsx`**

- **Line ~81 / schemaText**: Change "Low Wood Bay charges separately" to reflect partial access. Draft: _"Beech Hill includes complimentary spa access for all hotel guests, while Low Wood Bay includes its Resort Leisure Area (pool, Infrared sauna, jacuzzi, steam room) free for hotel guests — the main Outdoor Spa and Indoor Thermal Spa cost extra."_
- **Line ~96 / schemaText**: Same correction — replace "while Low Wood Bay charges separately" with nuanced version.

---

## Phase 6 — Blog posts

**File: `content/blog/spa-access-included-vs-extra-charge.mdx`**

- **Line 49**: Currently says _"Every guest pays for spa access"_ — update to note the leisure area is complimentary but the full spa/thermal journey costs extra.
- **Line 81**: Low Wood Bay listed under spas where access costs extra — move it to a "partially included" category or add a parenthetical noting the leisure area is free.

**File: `content/blog/windermere-spas-guide.mdx`**

- **Line 39**: _"Spa access is not included with standard room bookings"_ — update to: _"Hotel guests get complimentary access to the Resort Leisure Area (indoor pool, Infrared sauna, jacuzzi, steam room) during restricted hours (7:30–10am and 5:30–8pm). The full thermal spa experience — two outdoor infinity pools, fellside sauna, indoor infinity pool, salt sauna, steam cabin, herbal lounge — costs extra."_
- Update any nearby text that says guests always pay for access.

---

## Phase 7 — Windermere location page

**File: `src/app/location/spas-in-windermere/page.tsx`**

- **`introContent` paragraph about Low Wood Bay (lines 39–41)**: Add that the Resort Leisure Area is included for hotel guests during restricted hours, and the full thermal journey is purchased separately.

---

## Phase 8 — Tests

**File: `src/__tests__/spa-data.test.ts`**

- Add `'partial-for-guests'` to the `validAccessLabels` array (line ~73).

**File: `src/__tests__/filtering.test.ts`**

- Add `'partial-for-guests'` to the `allLabels` / `allPossibleLabels` array in tests that enumerate all possible labels (lines ~212 and ~503–508).
- Consider adding a test case: _"should filter by 'partial-for-guests' access label"_ to match the existing `paid-for-guests` test pattern.

---

## File change summary

| File                                                   | Type of change                                                                                                 |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `src/types/spa.ts`                                     | Add `partial-for-guests` to type union + `accessLabelConfig`                                                   |
| `src/components/SpaAccessBadges.tsx`                   | Add `bg-spa-orange` colour mapping                                                                             |
| `src/components/FilterModal.tsx`                       | Add `partial-for-guests` to label list                                                                         |
| `src/data/spas.ts` (spa id 7)                          | `accessLabels`, `metaDescription`, `intro`, `keyFeatures`, `thermalFacilities`, `poolFeatures`, `accessPolicy` |
| `src/data/faqs/spa-7-faqs.tsx`                         | Update hotel guest access references                                                                           |
| `src/data/location-faqs/windermere-faqs.tsx`           | Update "charges separately" text                                                                               |
| `content/blog/spa-access-included-vs-extra-charge.mdx` | Correct Low Wood Bay access description                                                                        |
| `content/blog/windermere-spas-guide.mdx`               | Correct "not included" statement                                                                               |
| `src/app/location/spas-in-windermere/page.tsx`         | Update intro paragraph about Low Wood Bay                                                                      |
| `src/__tests__/spa-data.test.ts`                       | Add `partial-for-guests` to valid labels                                                                       |
| `src/__tests__/filtering.test.ts`                      | Add `partial-for-guests` to all-labels arrays + new test                                                       |

Total: **11 files**.

---

## Execution order

1. Type system (`spa.ts` type + `SpaAccessBadges.tsx`) — everything depends on the new label existing
2. Filter UI (`FilterModal.tsx`) — uses the type
3. Core spa data (`spas.ts`) — uses the type
4. Tests — update to expect new label and not expect `paid-for-guests` for spa 7
5. FAQs and location FAQs — content updates
6. Blog posts — content updates
7. Location page — content update
8. Run `npm run typecheck && npm test` to verify
