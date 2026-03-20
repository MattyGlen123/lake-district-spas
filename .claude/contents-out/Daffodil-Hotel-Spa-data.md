# Daffodil Hotel Spa Data — Implementation Plan

## Summary

Fix misleading rasul content for spa id 4 (Daffodil Hotel Spa) across three files. The rasul mud chamber is an additional-charge add-on, not part of standard spa access. Also add the missing "Mud Rasul & Spa Access for Two" day pass package.

**Scope:** `src/data/spas.ts`, `src/data/day-passes/spa-4-day-passes.ts`, `content/blog/what-is-a-rasul-treatment.mdx`

---

## 1. `src/data/spas.ts` — keyFeatures

**Change:** Add "(additional charge)" to the rasul keyFeature.

```diff
- 'Rasul mud chamber',
+ 'Rasul mud chamber (additional charge)',
```

---

## 2. `src/data/day-passes/spa-4-day-passes.ts` — new package

**Add** the following entry to the `options` array (insert after `daffodil-simply-spa-time`, before `daffodil-twilight-spa` to keep packages roughly ordered by price):

```typescript
{
  id: 'daffodil-mud-rasul-spa-for-two',
  packageName: 'Mud Rasul & Spa Access for Two',
  priceGBP: 125,
  pricePerPerson: 62,
  spaDuration: 2,
  requiredNumbers: '2',
  treatmentsIncluded: true,
  refreshmentsIncluded: false,
  mealIncluded: true,
  included: [
    'Self-administered Mud Rasul treatment',
    '2-hour spa access (10am-4pm)',
    '2-course lunch per person',
    'Complimentary robes and slippers',
  ],
  description:
    'Nourishing mineral muds for face and body inside a steam-heated rasul chamber, combined with two hours of spa access and a two-course lunch for two.',
  daysAvailable: 'Monday-Sunday',
  ageRestriction: '16+',
  bookingRequired: true,
  bookingEmail: 'thespateam@daffodilhotel.com',
  dayPassUrl:
    'https://www.crerarhotels.com/collection/daffodil-hotel-and-spa/offers/mud-rasul-and-spa-access-for-two/',
  lastVerified: '2026-03-20',
},
```

---

## 3. `content/blog/what-is-a-rasul-treatment.mdx` — two fixes

### Fix A — paragraph starting "Daffodil Hotel Spa includes…" (line 52)

**Current:**
> Daffodil Hotel Spa includes a Rasul Mud Chamber as part of its thermal suite, alongside a Finnish sauna, steam room, tepidarium, and 33ft hydrotherapy pool. The chamber is a tranquil tiled room for self-applied mineral mud. Hotel guests have access from 2pm on arrival through midday on departure at no additional cost. Day passes for non-residents cost ...

**Replace with:**
> Daffodil Hotel Spa has a Rasul Mud Chamber available at additional charge, alongside a Finnish sauna, steam room, tepidarium, and 33ft hydrotherapy pool. The chamber is a tranquil tiled room for self-applied mineral mud. Hotel guests have full access to the thermal suite from 2pm on arrival through midday on departure, but the rasul chamber is booked and paid for separately. Day passes for non-residents cost <DayPassPrice spaSlug="daffodil-hotel-spa" dayPassId="daffodil-spa-facilities-weekday" /> per person on weekdays or <DayPassPrice spaSlug="daffodil-hotel-spa" dayPassId="daffodil-spa-facilities-weekend" /> at weekends for three hours of access from 10am to 4pm. For a combined rasul and spa day, the Mud Rasul & Spa Access for Two costs <DayPassPrice spaSlug="daffodil-hotel-spa" dayPassId="daffodil-mud-rasul-spa-for-two" /> per couple and includes two hours of spa access, a two-course lunch per person, and robes and slippers. The Twilight Spa pass runs from 4pm to 7:45pm for <DayPassPrice spaSlug="daffodil-hotel-spa" dayPassId="daffodil-twilight-spa" /> and includes a glass of prosecco. Daffodil is a 16+ spa, open 8am to 8pm daily.

### Fix B — "Practical notes" paragraph (line 60)

**Current:**
> At Daffodil, the rasul chamber is accessible throughout your spa session, so you can fit it in whenever suits you.

**Replace with:**
> At Daffodil, once you have booked the rasul package, you can use the chamber at any point during your two-hour spa access window.

---

## Decisions recorded

| Q | Answer | Decision |
|---|--------|----------|
| Q1 | A | keyFeatures: `'Rasul mud chamber (additional charge)'` |
| Q2 | B | `priceGBP: 125, pricePerPerson: 62` |
| Q3 | A | `treatmentsIncluded: true` |
| Q4 | A | Blog wording fix + new package `<DayPassPrice>` |
| Q5 | C | No FAQ changes |
| Q6 | A | `bookingEmail` only |
| Q7 | A | `requiredNumbers: '2'` |
| Q8 | B | Scope: three files only |
