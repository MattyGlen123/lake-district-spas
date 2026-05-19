Status: completed

# Update treatment data for Another Place, The Lake

## Parent

`.scratch/update-another-place-spa-14/PRD.md`

## What to build

Rewrite the treatment array for spa 14 from 19 to 14 entries, using descriptions sourced from the spa's live booking system and instructions from the spa's marketing team (email dated 27 April 2026).

**Remove 6 treatments** no longer offered:
- Back, Neck and Shoulders Massage & Mini Facial
- Mini Facial
- Back, Neck and Shoulders Massage
- Neck and Scalp Massage
- Drench Facial (Pregnancy)
- land&water hands and feet (Pregnancy)

**Update durations across the board:**
- All treatments previously at 60 minutes → 50 minutes (Full Body Massage, Freestyle Massage, Hot Rocks Detox Massage, Fell Walkers Massage, Pregnancy Massage, Drench Facial)
- All treatments previously at 30 minutes → 25 minutes (land&water feet, land&water hands)
- The Works: 120 → 105 minutes

**Individual treatment changes:**
- `land&water body` replaced in-place by `land&water Full body wrap`: 75 min, £140, new description; keep same brand (`land&water`) and category (`Body Treatments`)
- `land&water drench facial` renamed to `Drench Facial`: 50 min, retain `brand: 'land&water'`
- `land&water hands and feet` (non-pregnancy) renamed to `land&water hand and feet` (matching live booking system spelling): 50 min
- `Back, Face and Scalp Massage`: data quality correction — was wrongly recorded as 60 min / £90; correct values are 25 min / £50
- `Side by Side Massage/Facials` (single entry, Facial Treatments, £170) split into two:
  - `Side by side massage` — 50 min, £85, category `Massage Therapies`
  - `Side by Side Facial` — 50 min, £85, category `Facial Treatments`

Update all descriptions with copy from the spa's live booking system (provided in `.claude/contents-in/update-spa.md`).

Add a collocated test file alongside the treatments data file. Tests should assert on external behaviour only — what the export returns — not on file structure.

## Acceptance criteria

- [ ] Spa 14 has exactly 14 treatments
- [ ] No treatment has `duration: '60 minutes'`
- [ ] No treatment has `duration: '30 minutes'`
- [ ] `The Works` has `duration: '105 minutes'`
- [ ] `land&water Full body wrap` has `price: '£140'` and `duration: '75 minutes'`
- [ ] `Back, Face and Scalp Massage` has `duration: '25 minutes'` and `price: '£50'`
- [ ] `Side by side massage` has `category: 'Massage Therapies'`
- [ ] `Side by Side Facial` has `category: 'Facial Treatments'`
- [ ] No treatment named `Drench Facial (Pregnancy)`, `land&water hands and feet (Pregnancy)`, `Mini Facial`, `Neck and Scalp Massage`, or `Back, Neck and Shoulders Massage` exists
- [ ] All of the above are covered by a collocated test file that passes with `npm test`
- [ ] `npm run typecheck` passes

## Blocked by

None — can start immediately.
