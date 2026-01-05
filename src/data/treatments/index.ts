import { Treatment } from '@/types/spa';
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
