import { Spa } from '@/types/spa';

export type SpaFacilities = Spa['facilities'];

const POOL_FACILITY_KEYS = ['indoorPool', 'outdoorPool'];
const ICE_ROOM_KEY = 'iceRoom';

/**
 * Shared Pool Features / Thermal Suite facility-matching rule used by both the Spa
 * listing filter (spa-catalog.ts) and the Day Pass listing filter (day-pass-catalog.ts).
 *
 * Default logic is AND — every selected facility must be present. Two exceptions:
 * - Pool Features (`indoorPool`, `outdoorPool`): OR logic — matches if the spa has
 *   ANY selected pool.
 * - Thermal Suite `iceRoom`: also matches spas with `coldPlunge` (OR), since both read
 *   as "cold facility" to users. See CONTEXT.md Thermal Suite / Pool Features.
 */
export function matchesFacilityFilters(
  facilities: SpaFacilities,
  selectedFacilities: string[]
): boolean {
  if (selectedFacilities.length === 0) return true;

  const selectedPools = selectedFacilities.filter((f) => POOL_FACILITY_KEYS.includes(f));
  const hasIceRoomFilter = selectedFacilities.includes(ICE_ROOM_KEY);
  const otherFacilities = selectedFacilities.filter(
    (f) => !POOL_FACILITY_KEYS.includes(f) && f !== ICE_ROOM_KEY
  );

  if (selectedPools.length > 0) {
    const hasAnyPool = selectedPools.some(
      (pool) => facilities[pool as keyof SpaFacilities]
    );
    if (!hasAnyPool) return false;
  }

  if (hasIceRoomFilter && !facilities.iceRoom && !facilities.coldPlunge) {
    return false;
  }

  if (otherFacilities.length > 0) {
    const hasAllOtherFacilities = otherFacilities.every(
      (facility) => facilities[facility as keyof SpaFacilities]
    );
    if (!hasAllOtherFacilities) return false;
  }

  return true;
}
