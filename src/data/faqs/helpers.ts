import { Spa } from '@/types/spa';
import { getTreatmentsBySpaId } from '@/data/treatments';

/**
 * Get spa access duration in hours for hotel guests
 * @param spa - The spa object
 * @returns Duration in hours as a number, or null if not available
 */
export function getSpaAccessDuration(spa: Spa): number | null {
  return spa.spaAccessForHotelGuest?.durationHours ?? null;
}

/**
 * Get spa access duration formatted as text (e.g., "2 hours", "2-hour")
 * @param spa - The spa object
 * @returns Formatted duration string, or null if not available
 */
export function getSpaAccessDurationText(spa: Spa): string | null {
  const duration = getSpaAccessDuration(spa);
  if (duration === null) return null;
  return `${duration} hour${duration !== 1 ? 's' : ''}`;
}

/**
 * Get spa access duration formatted with hyphen (e.g., "2-hour")
 * @param spa - The spa object
 * @returns Formatted duration string with hyphen, or null if not available
 */
export function getSpaAccessDurationHyphenated(spa: Spa): string | null {
  const duration = getSpaAccessDuration(spa);
  if (duration === null) return null;
  return `${duration}-hour`;
}

/**
 * Get weekday spa access price for hotel guests
 * @param spa - The spa object
 * @returns Price in GBP, or null if not available
 */
export function getSpaAccessWeekdayPrice(spa: Spa): number | null {
  return spa.spaAccessForHotelGuest?.weekdayPriceGBP ?? null;
}

/**
 * Get weekend spa access price for hotel guests
 * @param spa - The spa object
 * @returns Price in GBP, or null if not available
 */
export function getSpaAccessWeekendPrice(spa: Spa): number | null {
  return spa.spaAccessForHotelGuest?.weekendPriceGBP ?? null;
}

/**
 * Get spa access price range formatted as text (e.g., "£35-40", "£35 per person Monday to Thursday, or £40 per person Friday to Sunday")
 * @param spa - The spa object
 * @returns Formatted price range string, or null if not available
 */
export function getSpaAccessPriceRange(spa: Spa): string | null {
  const weekday = getSpaAccessWeekdayPrice(spa);
  const weekend = getSpaAccessWeekendPrice(spa);

  if (weekday === null && weekend === null) return null;
  if (weekday === null) return `£${weekend} per person`;
  if (weekend === null) return `£${weekday} per person`;

  if (weekday === weekend) {
    return `£${weekday} per person`;
  }

  return `£${weekday} per person Monday to Thursday, or £${weekend} per person Friday to Sunday`;
}

/**
 * Get spa access price range formatted as short text (e.g., "£35-40")
 * @param spa - The spa object
 * @returns Formatted short price range string, or null if not available
 */
export function getSpaAccessPriceRangeShort(spa: Spa): string | null {
  const weekday = getSpaAccessWeekdayPrice(spa);
  const weekend = getSpaAccessWeekendPrice(spa);

  if (weekday === null && weekend === null) return null;
  if (weekday === null) return `£${weekend}`;
  if (weekend === null) return `£${weekday}`;

  if (weekday === weekend) {
    return `£${weekday}`;
  }

  return `£${weekday}-${weekend}`;
}

/**
 * Get count of thermal facilities
 * @param spa - The spa object
 * @returns Number of thermal facilities
 */
export function getThermalFacilitiesCount(spa: Spa): number {
  return spa.thermalFacilities.length;
}

/**
 * Get treatment brands as a formatted string (e.g., "Elemis and ishga products")
 * @param spaId - The spa ID
 * @param maxBrands - Maximum number of brands to include (default: 2)
 * @returns Formatted brands string, or null if no brands found
 */
export function getTreatmentBrandsText(spaId: number, maxBrands: number = 2): string | null {
  const treatments = getTreatmentsBySpaId(spaId);
  const brands = Array.from(
    new Set(
      treatments
        .map((t) => t.brand)
        .filter((b): b is string => Boolean(b))
    )
  ).slice(0, maxBrands);

  if (brands.length === 0) return null;
  if (brands.length === 1) return `${brands[0]} products`;
  if (brands.length === 2) return `${brands[0]} and ${brands[1]} products`;
  
  // If more than maxBrands, use "and more"
  return `${brands.slice(0, maxBrands - 1).join(', ')}, and ${brands[maxBrands - 1]} products`;
}

/**
 * Get age policy text
 * @param spa - The spa object
 * @returns Age policy string, or null if not available
 */
export function getAgePolicy(spa: Spa): string | null {
  return spa.agePolicy ?? null;
}

