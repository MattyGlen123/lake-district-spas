import { Treatment } from '@/types/spa';
import { spa1Treatments } from './spa-1-treatments';
import { spa2Treatments } from './spa-2-treatments';
import { spa3Treatments } from './spa-3-treatments';
import { spa4Treatments } from './spa-4-treatments';
import { spa5Treatments } from './spa-5-treatments';
import { spa6Treatments } from './spa-6-treatments';
import { spa7Treatments } from './spa-7-treatments';
import { spa8Treatments } from './spa-8-treatments';

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
