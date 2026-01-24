import { SpaDayPasses, DayPassOption } from '@/types/spa';
import { spa1DayPasses } from './spa-1-day-passes';
import { spa2DayPasses } from './spa-2-day-passes';
import { spa4DayPasses } from './spa-4-day-passes';
import { spa5DayPasses } from './spa-5-day-passes';
import { spa6DayPasses } from './spa-6-day-passes';
import { spa7DayPasses } from './spa-7-day-passes';
import { spa9DayPasses } from './spa-9-day-passes';
import { spa10DayPasses } from './spa-10-day-passes';
import { spa12DayPasses } from './spa-12-day-passes';
import { spa13DayPasses } from './spa-13-day-passes';
import { spa14DayPasses } from './spa-14-day-passes';
import { spa15DayPasses } from './spa-15-day-passes';
import { spa16DayPasses } from './spa-16-day-passes';
import { spa17DayPasses } from './spa-17-day-passes';

// Map of spa IDs to their day passes
const dayPassesBySpaId: Record<number, SpaDayPasses> = {
  1: spa1DayPasses,
  2: spa2DayPasses,
  4: spa4DayPasses,
  5: spa5DayPasses,
  6: spa6DayPasses,
  7: spa7DayPasses,
  9: spa9DayPasses,
  10: spa10DayPasses,
  12: spa12DayPasses,
  13: spa13DayPasses,
  14: spa14DayPasses,
  15: spa15DayPasses,
  16: spa16DayPasses,
  17: spa17DayPasses,
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

