Status: completed

# Update spa 14 FAQ for new treatment menu and day passes

## Parent

`.scratch/update-another-place-spa-14/PRD.md`

## What to build

Update `spa-14-faqs.tsx` to reflect the new treatment menu (issue 01) and Day Pass changes (issue 02). All changes are to dynamic lookups and prose — no new logic is introduced.

**Day pass changes:**
- Rename variable `dayMembershipLunchPrice` → `swimAndDinePrice`; update the lookup ID from `'another-place-day-membership-lunch'` to `'another-place-swim-and-dine'`
- Update the anchor href `#another-place-day-membership-lunch` → `#another-place-swim-and-dine`
- Rewrite the "How much does a spa day cost?" FAQ answer: replace the "Day Membership with Treatment & Lunch (£120, one-course lunch)" section with a description of Swim & Dine (£60 per person, 3-course dinner at Rampsbeck Restaurant, arrive from 6pm, Sunday–Thursday outside school holidays, minimum 2 people)

**Treatment lookup changes:**
- `getTreatmentDuration(spa.id, '60 minute')` → `getTreatmentDuration(spa.id, '50 minute')`
- `getTreatmentDuration(spa.id, '120 minute')` → `getTreatmentDuration(spa.id, '105 minute')`; fallback string `'120 minutes'` → `'105 minutes'`
- `getTreatmentPrice(spa.id, 'land&water drench facial')` → `getTreatmentPrice(spa.id, 'Drench Facial')`
- `getTreatmentIdByName(spa.id, 'land&water drench facial')` → `getTreatmentIdByName(spa.id, 'Drench Facial')`
- `getTreatmentIdByName(spa.id, 'Side by Side')` → `getTreatmentIdByName(spa.id, 'Side by side massage')` (to anchor to the massage entry specifically)
- Side-by-side price fallback `|| '£170'` → `|| '£85'` (price is now per person)

**Treatment count:**
- Hardcoded `"18 spa treatments"` → `"14 spa treatments"` in both the JSX answer and the `schemaText` field

## Acceptance criteria

- [ ] FAQ "How much does a spa day cost?" describes Swim & Dine (not Day Membership with Treatment & Lunch)
- [ ] Swim & Dine anchor href is `#another-place-swim-and-dine`
- [ ] Treatment duration references use `'50 minute'` and `'105 minute'` lookups
- [ ] `schemaText` and JSX answer both state 14 treatments (not 18)
- [ ] Side-by-side couples price fallback is `'£85'`
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes

## Blocked by

- `.scratch/update-another-place-spa-14/issues/01-treatment-data-rewrite.md`
- `.scratch/update-another-place-spa-14/issues/02-day-pass-swim-and-dine.md`
