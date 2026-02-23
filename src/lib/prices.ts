import { getDayPassOptionsBySpaId } from '@/data/day-passes';
import { getTreatmentsBySpaId } from '@/data/treatments';
import { Treatment } from '@/types/spa';

function isAddOnTreatment(treatment: Pick<Treatment, 'name' | 'description'>): boolean {
  const normalizedText = `${treatment.name} ${treatment.description}`
    .toLowerCase()
    .trim();

  return (
    /\badd[\s-]*on\b/i.test(normalizedText) ||
    normalizedText.includes('combined with your main treatment') ||
    normalizedText.includes('cannot be taken on its own') ||
    normalizedText.includes('in conjunction with')
  );
}

/**
 * Get the lowest day pass price for a spa.
 * Returns null if no day pass data exists.
 */
export function getLowestDayPassPrice(spaId: number): number | null {
  const dayPassOptions = getDayPassOptionsBySpaId(spaId);
  if (!dayPassOptions || dayPassOptions.length === 0) {
    return null;
  }

  const prices = dayPassOptions.map((option) => option.priceGBP);
  return Math.min(...prices);
}

/**
 * Get the lowest treatment price for a spa.
 * Parses price strings (e.g., '£105') to extract numeric values.
 * Returns null if no treatment price data exists.
 */
export function getLowestTreatmentPrice(spaId: number): number | null {
  const treatments = getTreatmentsBySpaId(spaId);
  if (!treatments || treatments.length === 0) {
    return null;
  }

  const prices = treatments
    .filter((treatment) => treatment.price && !isAddOnTreatment(treatment))
    .map((treatment) => {
      // Parse price string like '£105' or '£110' to number
      const priceStr = treatment.price!.replace(/[£,]/g, ''); // Remove £ and commas
      return parseFloat(priceStr);
    })
    .filter((price) => !isNaN(price)); // Filter out invalid prices

  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices);
}
