import { Spa } from '@/types/spa';
import { getDayPassOptionsBySpaId } from '@/data/day-passes';
import { getTreatmentsBySpaId } from '@/data/treatments';

/**
 * Location-specific helper functions for location FAQs.
 *
 * For single-spa helpers (getDayPassPrice, getTreatmentPrice, etc.),
 * import directly from '@/data/faqs/helpers' instead.
 *
 * This file is for aggregate helpers that operate across multiple spas
 * within a location.
 */

/**
 * Get the cheapest day pass price across all spas in a location
 * @param spas - Array of spas for the location
 * @returns Formatted price string (e.g., "£60"), or null if no day passes found
 */
export function getCheapestDayPassPrice(spas: Spa[]): string | null {
  let cheapest: number | null = null;

  for (const spa of spas) {
    const dayPasses = getDayPassOptionsBySpaId(spa.id);
    for (const pass of dayPasses) {
      const price = pass.pricePerPerson ?? pass.priceGBP;
      if (price !== undefined && (cheapest === null || price < cheapest)) {
        cheapest = price;
      }
    }
  }

  return cheapest !== null ? `£${cheapest}` : null;
}

/**
 * Get the total number of unique treatment brands across all spas in a location
 * @param spas - Array of spas for the location
 * @returns Array of unique brand names
 */
export function getLocationTreatmentBrands(spas: Spa[]): string[] {
  const brands = new Set<string>();

  for (const spa of spas) {
    const treatments = getTreatmentsBySpaId(spa.id);
    for (const treatment of treatments) {
      if (treatment.brand) {
        brands.add(treatment.brand);
      }
    }
  }

  return Array.from(brands);
}

/**
 * Get the total count of day pass options across all spas in a location
 * @param spas - Array of spas for the location
 * @returns Total number of day pass options
 */
export function getLocationDayPassCount(spas: Spa[]): number {
  let count = 0;

  for (const spa of spas) {
    const dayPasses = getDayPassOptionsBySpaId(spa.id);
    count += dayPasses.length;
  }

  return count;
}

/**
 * Get total count of treatments across all spas in a location
 * @param spas - Array of spas for the location
 * @returns Total number of treatments
 */
export function getLocationTreatmentCount(spas: Spa[]): number {
  let count = 0;

  for (const spa of spas) {
    const treatments = getTreatmentsBySpaId(spa.id);
    count += treatments.length;
  }

  return count;
}
