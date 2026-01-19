import { SpaDayPasses, DayPassOption } from '@/types/spa';
import { spa1DayPasses } from './spa-1-day-passes';

// Map of spa IDs to their day passes
const dayPassesBySpaId: Record<number, SpaDayPasses> = {
  1: spa1DayPasses,
};

/**
 * Get day passes for a specific spa
 * @param spaId - The ID of the spa
 * @returns SpaDayPasses object, or null if none exist
 */
export function getDayPassesBySpaId(spaId: number): SpaDayPasses | null {
  return dayPassesBySpaId[spaId] || null;
}

/**
 * Get all day pass options for a specific spa
 * @param spaId - The ID of the spa
 * @returns Array of day pass options, or empty array if none exist
 */
export function getDayPassOptionsBySpaId(spaId: number): DayPassOption[] {
  return dayPassesBySpaId[spaId]?.options || [];
}

/**
 * Get all spas that offer day passes
 * @returns Array of spa IDs that have day pass options
 */
export function getSpasWithDayPasses(): number[] {
  return Object.keys(dayPassesBySpaId).map(Number);
}

/**
 * Get all day passes across all spas
 * @returns Array of all SpaDayPasses
 */
export function getAllDayPasses(): SpaDayPasses[] {
  return Object.values(dayPassesBySpaId);
}

