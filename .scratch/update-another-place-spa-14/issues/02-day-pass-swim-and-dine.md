Status: completed

# Replace Day Membership with Treatment & Lunch with Swim & Dine

## Parent

`.scratch/update-another-place-spa-14/PRD.md`

## What to build

Update the Day Pass data for spa 14. Two changes:

**1. Update `another-place-day-membership-treatment`:**
- Change the included list entry from "60-minute treatment of choice" to "50-minute treatment of choice"
- Set `lastVerified: '2026-04-27'`

**2. Replace `another-place-day-membership-lunch` wholesale with `another-place-swim-and-dine`:**

The Day Membership with Treatment & Lunch (£120, one-course lunch, all-day) no longer exists. It has been replaced by Swim & Dine — an evening package at £60 per person with a three-course dinner. Key values for the new entry:

- `id`: `another-place-swim-and-dine`
- `packageName`: `Swim & Dine`
- `priceGBP`: 60
- `spaDuration`: 3 (arrive from 6pm, Swim Club closes 9pm)
- `treatmentsIncluded`: false
- `mealIncluded`: true
- `refreshmentsIncluded`: true
- `requiredNumbers`: `'Minimum 2 people'`
- `daysAvailable`: `'Sunday - Thursday (outside school holidays)'`
- `ageRestriction`: `'18+'`
- `bookingRequired`: true
- `dayPassUrl` and `bookingUrl`: `https://another.place/the-lake/swim-club/swim-and-dine`
- `lastVerified`: `'2026-04-27'`

Included list should reflect: Swim Club access, 20-metre lake-view swimming pool, outdoor hot tub, three-course dinner at Rampsbeck Restaurant.

Add a collocated test file alongside the day passes data file.

## Acceptance criteria

- [ ] Spa 14 has exactly 2 Day Pass options
- [ ] No Day Pass with `id: 'another-place-day-membership-lunch'` exists
- [ ] A Day Pass with `id: 'another-place-swim-and-dine'` exists
- [ ] `another-place-swim-and-dine` has `priceGBP: 60`, `treatmentsIncluded: false`, `mealIncluded: true`, `spaDuration: 3`
- [ ] `another-place-day-membership-treatment` included list contains the string `'50-minute'` and does not contain `'60-minute'`
- [ ] All of the above are covered by a collocated test file that passes with `npm test`
- [ ] `npm run typecheck` passes

## Blocked by

None — can start immediately.
