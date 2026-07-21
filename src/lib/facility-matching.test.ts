import { matchesFacilityFilters, SpaFacilities } from '@/lib/facility-matching';

function makeFacilities(overrides: Partial<SpaFacilities> = {}): SpaFacilities {
  return {
    sauna: false,
    steamRoom: false,
    iceRoom: false,
    hotTub: false,
    indoorPool: false,
    outdoorPool: false,
    coldPlunge: false,
    thermalSuite: false,
    infraredSauna: false,
    ...overrides,
  };
}

describe('matchesFacilityFilters (shared Pool Features / Thermal Suite rule)', () => {
  it('matches everything when no facilities are selected', () => {
    expect(matchesFacilityFilters(makeFacilities(), [])).toBe(true);
  });

  describe('Pool Features OR logic', () => {
    it('matches when the spa has the single selected pool', () => {
      const facilities = makeFacilities({ indoorPool: true });
      expect(matchesFacilityFilters(facilities, ['indoorPool'])).toBe(true);
    });

    it('does not match when the spa lacks the single selected pool', () => {
      const facilities = makeFacilities({ outdoorPool: true });
      expect(matchesFacilityFilters(facilities, ['indoorPool'])).toBe(false);
    });

    it('matches on EITHER pool when both indoorPool and outdoorPool are selected', () => {
      const indoorOnly = makeFacilities({ indoorPool: true });
      const outdoorOnly = makeFacilities({ outdoorPool: true });
      const neither = makeFacilities();

      expect(matchesFacilityFilters(indoorOnly, ['indoorPool', 'outdoorPool'])).toBe(true);
      expect(matchesFacilityFilters(outdoorOnly, ['indoorPool', 'outdoorPool'])).toBe(true);
      expect(matchesFacilityFilters(neither, ['indoorPool', 'outdoorPool'])).toBe(false);
    });
  });

  describe('ice room / cold plunge OR logic', () => {
    it('matches a spa with iceRoom but no coldPlunge', () => {
      const facilities = makeFacilities({ iceRoom: true });
      expect(matchesFacilityFilters(facilities, ['iceRoom'])).toBe(true);
    });

    it('matches a spa with coldPlunge but no iceRoom (the special-case rule)', () => {
      const facilities = makeFacilities({ coldPlunge: true });
      expect(matchesFacilityFilters(facilities, ['iceRoom'])).toBe(true);
    });

    it('does not match a spa with neither iceRoom nor coldPlunge', () => {
      const facilities = makeFacilities();
      expect(matchesFacilityFilters(facilities, ['iceRoom'])).toBe(false);
    });
  });

  describe('other facilities AND logic', () => {
    it('requires every non-pool, non-iceRoom facility to be present', () => {
      const missingOne = makeFacilities({ sauna: true });
      const hasBoth = makeFacilities({ sauna: true, steamRoom: true });

      expect(matchesFacilityFilters(missingOne, ['sauna', 'steamRoom'])).toBe(false);
      expect(matchesFacilityFilters(hasBoth, ['sauna', 'steamRoom'])).toBe(true);
    });
  });

  describe('combined selections', () => {
    it('applies pool OR, ice-room OR, and other-facility AND together', () => {
      const facilities = makeFacilities({
        outdoorPool: true,
        coldPlunge: true,
        sauna: true,
        hotTub: true,
      });

      expect(
        matchesFacilityFilters(facilities, [
          'indoorPool',
          'outdoorPool',
          'iceRoom',
          'sauna',
          'hotTub',
        ])
      ).toBe(true);

      // Fails once an AND-logic facility (hotTub) is missing.
      const missingHotTub = makeFacilities({
        outdoorPool: true,
        coldPlunge: true,
        sauna: true,
      });
      expect(
        matchesFacilityFilters(missingHotTub, [
          'indoorPool',
          'outdoorPool',
          'iceRoom',
          'sauna',
          'hotTub',
        ])
      ).toBe(false);
    });
  });
});
