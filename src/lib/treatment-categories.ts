/**
 * Treatment category/price domain vocabulary. Lives in lib (not the TreatmentFilters
 * component) so business logic in treatment-catalog.ts doesn't depend upward on a
 * presentation component. TreatmentFilters.tsx imports these for rendering.
 */

export type PriceBracket = 'under-75' | '75-100' | '100-150' | '150-plus';

export const CATEGORY_GROUPS: { label: string; categories: string[] }[] = [
  { label: 'Body & Massage', categories: ['Massage Therapies', 'Body Treatments'] },
  { label: 'Facial Treatments', categories: ['Facial Treatments'] },
  { label: 'Hands & Feet', categories: ['Hands & Feet Treatments'] },
];

export const ALL_CATEGORY_GROUP_LABELS = CATEGORY_GROUPS.map((g) => g.label);
