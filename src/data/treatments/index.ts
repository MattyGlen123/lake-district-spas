import { Treatment, Spa } from '@/types/spa';
import { spa1Treatments } from './spa-1-treatments';
import { spa2Treatments } from './spa-2-treatments';
import { spa3Treatments } from './spa-3-treatments';
import { spa4Treatments } from './spa-4-treatments';
import { spa5Treatments } from './spa-5-treatments';
import { spa6Treatments } from './spa-6-treatments';
import { spa7Treatments } from './spa-7-treatments';
import { spa8Treatments } from './spa-8-treatments';
import { spa9Treatments } from './spa-9-treatments';
import { spa10Treatments } from './spa-10-treatments';
import { spa12Treatments } from './spa-12-treatments';
import { spa13Treatments } from './spa-13-treatments';
import { spa14Treatments } from './spa-14-treatments';
import { spa15Treatments } from './spa-15-treatments';
import { spa16Treatments } from './spa-16-treatments';
import { spa17Treatments } from './spa-17-treatments';
import { spa18Treatments } from './spa-18-treatments';
import { spa19Treatments } from './spa-19-treatments';

// Map of spa IDs to their treatments
const treatmentsBySpaId: Record<number, Treatment[]> = {
  1: spa1Treatments,
  2: spa2Treatments,
  3: spa3Treatments,
  4: spa4Treatments,
  5: spa5Treatments,
  6: spa6Treatments,
  7: spa7Treatments,
  8: spa8Treatments,
  9: spa9Treatments,
  10: spa10Treatments,
  12: spa12Treatments,
  13: spa13Treatments,
  14: spa14Treatments,
  15: spa15Treatments,
  16: spa16Treatments,
  17: spa17Treatments,
  18: spa18Treatments,
  19: spa19Treatments,
};

/**
 * Get treatments for a specific spa
 * @param spaId - The ID of the spa
 * @returns Array of treatments for the spa, or empty array if none exist
 */
export function getTreatmentsBySpaId(spaId: number): Treatment[] {
  return treatmentsBySpaId[spaId] || [];
}

/**
 * Get all treatments across all spas
 * @returns Array of all treatments
 */
export function getAllTreatments(): Treatment[] {
  return Object.values(treatmentsBySpaId).flat();
}

/**
 * Flattened treatment with parent spa data
 */
export interface TreatmentWithSpa extends Treatment {
  spa: Spa;
}

/**
 * Parse a treatment price string (e.g. "£100") to a number.
 * Returns 0 if parsing fails.
 */
export function parseTreatmentPrice(price: string): number {
  return parseInt(price.replace(/[£,\s]/g, ''), 10) || 0;
}

/**
 * Get all treatments flattened with their parent spa data.
 * Only returns treatments that have a price value.
 * @param spaData - Array of all spa data
 * @returns Array of treatments with parent spa info
 */
export function getAllTreatmentsWithSpa(spaData: Spa[]): TreatmentWithSpa[] {
  const result: TreatmentWithSpa[] = [];

  for (const [spaIdStr, treatments] of Object.entries(treatmentsBySpaId)) {
    const spa = spaData.find((s) => s.id === Number(spaIdStr));
    if (!spa) continue;

    for (const treatment of treatments) {
      if (!treatment.price) continue;
      result.push({ ...treatment, spa });
    }
  }

  return result;
}
