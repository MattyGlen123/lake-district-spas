/**
 * Shared "active filter count" plumbing used by spa-catalog.ts, day-pass-catalog.ts,
 * and treatment-catalog.ts. Each module's filters have genuinely different fields, and
 * even within one module, fields count differently — a multi-select array (e.g.
 * facilities) counts once per selection, while a threshold/boolean field (e.g.
 * maxPrice, treatmentsIncluded) counts once when active. This file only shares the
 * "sum a list of per-field counters" part; each module declares its own field rules.
 */

export type FilterCounter<T> = (filters: T) => number;

export function countActiveFilters<T>(filters: T, counters: FilterCounter<T>[]): number {
  return counters.reduce((total, counter) => total + counter(filters), 0);
}

/** Counter for a multi-select field where every selected item counts as one active filter. */
export function countSelected<T, V>(selector: (filters: T) => V[]): FilterCounter<T> {
  return (filters) => selector(filters).length;
}

/** Counter for a field that counts as a single active filter once its condition is true. */
export function countIf<T>(predicate: (filters: T) => boolean): FilterCounter<T> {
  return (filters) => (predicate(filters) ? 1 : 0);
}
