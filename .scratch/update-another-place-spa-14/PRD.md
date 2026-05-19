Status: ready-for-agent

# PRD: Update Another Place, The Lake (Spa 14) — Treatment & Day Pass Refresh

## Problem Statement

Another Place, The Lake has changed their Treatment and Day Pass offering. The site currently shows stale data: 19 treatments with incorrect durations, obsolete packages that no longer exist, and a Day Pass option that has been replaced. A member of the spa's marketing team sent a full briefing with the changes. Without updating the data, visitors see wrong prices, wrong durations, and broken references to treatments that can no longer be booked.

## Solution

Update all data files for spa 14 to reflect the new offering:

- Reduce the treatment menu from 19 to 14 entries, with corrected durations, descriptions, and prices sourced directly from the spa's live booking system.
- Replace the "Day Membership with Treatment & Lunch" Day Pass with the "Swim & Dine" evening package.
- Update the FAQ content component to reference the correct Day Pass ID, correct treatment durations, and the new treatment count.
- Rewrite the affected paragraph in one blog post that references two treatments being removed.

## User Stories

1. As a visitor to Another Place, The Lake's spa page, I want to see accurate treatment durations, so that I can plan my visit time correctly.
2. As a visitor, I want to see that massages are now 50 minutes (not 60), so that I book the right amount of time.
3. As a visitor, I want to see that short treatments are now 25 minutes (not 30), so that I am not misled about session length.
4. As a visitor, I want to see The Works listed as 105 minutes (not 120), so that I can accurately compare it against other packages.
5. As a visitor, I want to see the land&water Full Body Wrap (75 min, £140) instead of the old land&water body entry, so that I can make an informed decision about booking it.
6. As a visitor, I want Side by Side Massage and Side by Side Facial listed as separate treatments in the correct categories, so that I can distinguish them and book the right one.
7. As a visitor, I want the Back, Face and Scalp Massage shown at 25 minutes and £50, so that I see the correct duration and price (not the incorrect 60 min / £90 previously recorded).
8. As a visitor researching pregnancy treatments, I want the blog post to reflect that Another Place offers one pregnancy treatment (Pregnancy Massage), not three, so that I am not misled into expecting treatments that no longer exist.
9. As a visitor comparing Day Pass options, I want to see the Swim & Dine evening package (£60pp, 3-course dinner, Sunday–Thursday outside school holidays), not the retired Day Membership with Treatment & Lunch, so that I book a package that actually exists.
10. As a visitor comparing Day Pass options, I want the Day Membership with Treatment to correctly state a 50-minute treatment is included (not 60), so that I have accurate expectations before arriving.
11. As a visitor reading the FAQ "How much does a spa day cost?", I want it to describe Swim & Dine accurately, so that I understand what the evening package includes and when it is available.
12. As a visitor reading the FAQ "What treatments are available?", I want it to state 14 treatments (not 18), so that the count matches the actual offering.
13. As a visitor reading the FAQ "What treatments are available?", I want the side-by-side couples option to show £85 per person, so that I understand the per-person pricing.
14. As a site editor, I want all TreatmentLink and TreatmentPrice MDX components in blog posts to reference treatment names that exist, so that they render correctly rather than silently returning nothing.
15. As a site editor, I want Day Pass anchor links in the FAQ to use the correct ID (`another-place-swim-and-dine`), so that in-page navigation works correctly.

## Implementation Decisions

### Module 1: Treatment data (`spa-14-treatments.ts`)

Complete rewrite of the treatment array. 19 → 14 treatments.

**Removals (6 treatments not present in spa's live booking system):**
- Back, Neck and Shoulders Massage & Mini Facial
- Mini Facial
- Back, Neck and Shoulders Massage
- Neck and Scalp Massage
- Drench Facial (Pregnancy)
- land&water hands and feet (Pregnancy)

**Duration updates — all 60-minute treatments become 50 minutes:**
- Full Body Massage, Freestyle Massage, Hot Rocks Detox Massage, Fell Walkers Massage, Pregnancy Massage, Drench Facial (land&water brand, renamed — see below)

**Duration updates — all 30-minute treatments become 25 minutes:**
- land&water feet, land&water hands

**Individual treatment changes:**
- `land&water body` → replaced in-place by `land&water Full body wrap`: 75 min, £140, new description, same `brand: 'land&water'`, same `category: 'Body Treatments'`
- `land&water drench facial` → renamed to `Drench Facial`: 60→50 min, keep `brand: 'land&water'`, `category: 'Facial Treatments'`
- `land&water hands and feet` (non-pregnancy) → renamed to `land&water hand and feet` (matching live booking system spelling): 60→50 min
- `Back, Face and Scalp Massage` → data quality correction: was incorrectly recorded as 60 min / £90; correct values are 25 min / £50
- `The Works` → 120→105 min
- `Side by Side Massage/Facials` (single entry, Facial Treatments, £170) → split into two separate treatments:
  - `Side by side massage`: 50 min, £85, `category: 'Massage Therapies'`
  - `Side by Side Facial`: 50 min, £85, `category: 'Facial Treatments'`

All descriptions updated with copy sourced from the spa's live booking system.

### Module 2: Day pass data (`spa-14-day-passes.ts`)

Two options before; two options after.

**`another-place-day-membership-treatment` (update):**
- `included` list: change "60-minute treatment of choice" → "50-minute treatment of choice"
- `lastVerified: '2026-04-27'`

**`another-place-day-membership-lunch` → replaced with `another-place-swim-and-dine`:**
- `id`: `another-place-swim-and-dine`
- `packageName`: `Swim & Dine`
- `priceGBP`: 60
- `spaDuration`: 3 (arrive from 6pm, Swim Club closes 9pm)
- `treatmentsIncluded`: false
- `mealIncluded`: true
- `refreshmentsIncluded`: true
- `requiredNumbers`: `'Minimum 2 people'`
- `daysAvailable`: `'Sunday - Thursday (outside school holidays)'`
- `bookingUrl` / `dayPassUrl`: `https://another.place/the-lake/swim-club/swim-and-dine`
- `lastVerified: '2026-04-27'`

### Module 3: FAQ content (`spa-14-faqs.tsx`)

Shallow content layer — no new logic, just updated lookups and prose:

- Variable `dayMembershipLunchPrice` renamed to `swimAndDinePrice`; lookup changed to `'another-place-swim-and-dine'`
- Anchor href `#another-place-day-membership-lunch` → `#another-place-swim-and-dine`
- FAQ 2 answer rewritten: replaces "Day Membership with Treatment & Lunch / £120 / one-course lunch" with Swim & Dine description (£60pp, 3-course dinner at Rampsbeck, arrive from 6pm, Sunday–Thursday outside school holidays, minimum 2 people)
- `getTreatmentDuration` call searching `'60 minute'` → `'50 minute'`
- `getTreatmentDuration` call searching `'120 minute'` → `'105 minute'`; fallback `'120 minutes'` → `'105 minutes'`
- Hardcoded treatment count `"18 spa treatments"` → `"14 spa treatments"` (appears in both JSX answer and schemaText)
- `getTreatmentPrice`/`getTreatmentIdByName` for `'land&water drench facial'` → `'Drench Facial'` (treatment was renamed)
- `getTreatmentIdByName` for `'Side by Side'` → `'Side by side massage'` (to anchor correctly to the massage, not the facial)
- Side-by-side couples price fallback `|| '£170'` → `|| '£85'` (price is now per person)

### Module 4: Blog post (`how-to-treat-your-pregnant-wife.mdx`)

Content-only change. The paragraph attributing three pregnancy-safe treatments to Another Place is rewritten to mention only `Pregnancy Massage`. The "widest range of any Lake District spa" claim is removed. The `TreatmentLink` and `TreatmentPrice` component references for `Drench Facial (Pregnancy)` and `land&water hands and feet (Pregnancy)` are removed.

## Testing Decisions

Good tests verify external behaviour — what the data exports, not how the file is structured.

**Module 1 — Treatment data:**

Tests should assert:
- Spa 14 has exactly 14 treatments
- No treatment has a duration of `'60 minutes'`
- No treatment has a duration of `'30 minutes'`
- `The Works` has a duration of `'105 minutes'`
- `land&water Full body wrap` has a price of `'£140'` and duration `'75 minutes'`
- `Back, Face and Scalp Massage` has a duration of `'25 minutes'` and price `'£50'`
- `Side by side massage` has `category: 'Massage Therapies'`
- `Side by Side Facial` has `category: 'Facial Treatments'`
- No treatment named `'Drench Facial (Pregnancy)'`, `'land&water hands and feet (Pregnancy)'`, `'Mini Facial'`, `'Neck and Scalp Massage'`, or `'Back, Neck and Shoulders Massage'` exists

Prior art: `src/data/spas.test.ts` — same data-validation pattern, collocated alongside source, using Vitest.

**Module 2 — Day pass data:**

Tests should assert:
- Spa 14 has exactly 2 Day Pass options
- No Day Pass with id `'another-place-day-membership-lunch'` exists
- A Day Pass with id `'another-place-swim-and-dine'` exists
- `another-place-swim-and-dine` has `priceGBP: 60`, `treatmentsIncluded: false`, `mealIncluded: true`, `spaDuration: 3`
- `another-place-day-membership-treatment` included list contains the string `'50-minute'` (not `'60-minute'`)

Prior art: `src/data/spas.test.ts`; collocate test alongside `spa-14-day-passes.ts`.

**Modules 3 & 4 — FAQ and blog:**

No new isolated tests required. The FAQ dynamic helpers read from the treatment and day pass data — correctness flows from Modules 1 and 2. The blog post is content-only. The existing test suite (`npm test`) passing after all changes serves as the regression check.

## Out of Scope

- Adding `bookingUrl` fields to individual treatment entries (the scraped data includes booking URLs per treatment; the email did not request this and no existing treatments have them)
- Updating the spa's `intro` text in `spas.ts` (no treatment durations or Day Pass names are mentioned there)
- Changes to any other spa's data
- Any changes to the spa's facility flags, pool features, thermal facilities, or access policy

## Further Notes

- Source of changes: email from Stephanie Baker (marketing, Watergate Bay Hotel / Another Place group), dated 27 April 2026
- Authoritative treatment list: spa's live booking system at `https://book.onagilysys.eu/onecart/spa/services/10278/TheLake`
- The `Back, Face and Scalp Massage` correction (60 min / £90 → 25 min / £50) is a data quality fix, not an instruction from the email. The email's "all 30-minute treatments become 25 minutes" rule confirms the correct baseline duration was 30 minutes.
- `lastVerified` on both Day Pass options should be set to `'2026-04-27'` (date of the email).
