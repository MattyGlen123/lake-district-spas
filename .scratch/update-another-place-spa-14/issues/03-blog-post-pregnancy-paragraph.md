Status: completed

# Fix broken pregnancy treatment references in blog post

## Parent

`.scratch/update-another-place-spa-14/PRD.md`

## What to build

Rewrite the Another Place, The Lake paragraph in the blog post `how-to-treat-your-pregnant-wife.mdx`.

The paragraph currently states that Another Place offers "three pregnancy-safe treatments, the widest range of any Lake District spa" and uses `TreatmentLink` and `TreatmentPrice` MDX components pointing to `Drench Facial (Pregnancy)` and `land&water hands and feet (Pregnancy)` — both of which are removed in issue 01. Only `Pregnancy Massage` remains.

The rewrite should:
- Reference only `Pregnancy Massage` for Another Place
- Remove the "three treatments / widest range" claim
- Keep the `TreatmentLink`, `TreatmentDuration`, and `TreatmentPrice` components for `Pregnancy Massage` (these remain valid)
- Maintain the editorial tone of the surrounding paragraphs

## Acceptance criteria

- [ ] The Another Place paragraph references only `Pregnancy Massage` — no references to `Drench Facial (Pregnancy)` or `land&water hands and feet (Pregnancy)` remain
- [ ] The "three pregnancy-safe treatments" / "widest range" claim is removed
- [ ] `TreatmentLink`, `TreatmentDuration`, and `TreatmentPrice` components for `Pregnancy Massage` at `another-place-the-lake` remain in place
- [ ] `npm run build` passes (no broken MDX component references)

## Blocked by

`.scratch/update-another-place-spa-14/issues/01-treatment-data-rewrite.md`
