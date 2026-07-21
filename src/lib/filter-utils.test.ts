import { countActiveFilters, countIf, countSelected } from '@/lib/filter-utils';

describe('filter-utils', () => {
  type Filters = { tags: string[]; enabled: boolean };

  it('sums per-field counters', () => {
    const filters: Filters = { tags: ['a', 'b'], enabled: true };
    const result = countActiveFilters(filters, [
      countSelected((f) => f.tags),
      countIf((f) => f.enabled),
    ]);
    expect(result).toBe(3);
  });

  it('returns 0 when no counters are active', () => {
    const filters: Filters = { tags: [], enabled: false };
    const result = countActiveFilters(filters, [
      countSelected((f) => f.tags),
      countIf((f) => f.enabled),
    ]);
    expect(result).toBe(0);
  });

  it('countIf counts as exactly 1 regardless of how "active" the condition is', () => {
    const filters: Filters = { tags: ['a', 'b', 'c'], enabled: true };
    expect(countIf<Filters>((f) => f.tags.length > 0)(filters)).toBe(1);
  });
});
