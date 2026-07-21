import { act, renderHook } from '@testing-library/react';
import { useListing } from '@/hooks/listing/useListing';

interface Item {
  id: number;
  category: string;
}

interface TestFilters {
  category: string | null;
}

type TestSort = 'id-asc' | 'id-desc';

const makeItems = (n: number, category = 'all'): Item[] =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, category }));

const filterFn = (items: Item[], filters: TestFilters) =>
  filters.category ? items.filter((item) => item.category === filters.category) : items;

const sortFn = (items: Item[], sortBy: TestSort) =>
  [...items].sort((a, b) => (sortBy === 'id-asc' ? a.id - b.id : b.id - a.id));

describe('useListing', () => {
  // --- Composition: filter -> sort -> paginate ---

  it('returns all items filtered, sorted and paginated by default', () => {
    const items = makeItems(25);
    const { result } = renderHook(() =>
      useListing({
        items,
        initialFilters: { category: null } as TestFilters,
        filterFn,
        initialSortBy: 'id-asc' as TestSort,
        sortFn,
        itemsPerPage: 10,
      })
    );

    expect(result.current.resultCount).toBe(25);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.paginatedItems).toHaveLength(10);
    expect(result.current.paginatedItems[0].id).toBe(1);
  });

  it('applies sortFn to the paginated slice', () => {
    const items = makeItems(5);
    const { result } = renderHook(() =>
      useListing({
        items,
        initialFilters: { category: null } as TestFilters,
        filterFn,
        initialSortBy: 'id-desc' as TestSort,
        sortFn,
        itemsPerPage: 10,
      })
    );

    expect(result.current.paginatedItems.map((i) => i.id)).toEqual([5, 4, 3, 2, 1]);
  });

  it('setSortBy re-sorts the results', () => {
    const items = makeItems(5);
    const { result } = renderHook(() =>
      useListing({
        items,
        initialFilters: { category: null } as TestFilters,
        filterFn,
        initialSortBy: 'id-asc' as TestSort,
        sortFn,
        itemsPerPage: 10,
      })
    );

    act(() => result.current.setSortBy('id-desc'));

    expect(result.current.paginatedItems.map((i) => i.id)).toEqual([5, 4, 3, 2, 1]);
  });

  // --- Draft filters (applyDraft only affects results after apply) ---

  it('does not affect filteredItems until applyDraft is called', () => {
    const items = [...makeItems(3, 'spa'), ...makeItems(2, 'hotel')];
    const { result } = renderHook(() =>
      useListing({
        items,
        initialFilters: { category: null } as TestFilters,
        filterFn,
        initialSortBy: 'id-asc' as TestSort,
        sortFn,
        itemsPerPage: 10,
      })
    );

    act(() => result.current.openDraft());
    act(() => result.current.setDraftFilters({ category: 'hotel' }));

    expect(result.current.resultCount).toBe(5);
    expect(result.current.draftResultCount).toBe(2);

    act(() => result.current.applyDraft());

    expect(result.current.resultCount).toBe(2);
  });

  it('resetBoth restores both active and draft filters', () => {
    const items = [...makeItems(3, 'spa'), ...makeItems(2, 'hotel')];
    const { result } = renderHook(() =>
      useListing({
        items,
        initialFilters: { category: null } as TestFilters,
        filterFn,
        initialSortBy: 'id-asc' as TestSort,
        sortFn,
        itemsPerPage: 10,
      })
    );

    act(() => result.current.resetBoth({ category: 'spa' }));

    expect(result.current.activeFilters).toEqual({ category: 'spa' });
    expect(result.current.draftFilters).toEqual({ category: 'spa' });
    expect(result.current.resultCount).toBe(3);
  });

  // --- Pagination reset on filter/sort change ---

  it('resets to page 1 when applyDraft changes the active filters', () => {
    const items = makeItems(30);
    const { result } = renderHook(() =>
      useListing({
        items,
        initialFilters: { category: null } as TestFilters,
        filterFn,
        initialSortBy: 'id-asc' as TestSort,
        sortFn,
        itemsPerPage: 10,
      })
    );

    act(() => result.current.setCurrentPage(3));
    expect(result.current.currentPage).toBe(3);

    act(() => result.current.openDraft());
    act(() => result.current.setDraftFilters({ category: null }));
    act(() => result.current.applyDraft());

    expect(result.current.currentPage).toBe(1);
  });

  it('resets to page 1 when sortBy changes', () => {
    const items = makeItems(30);
    const { result } = renderHook(() =>
      useListing({
        items,
        initialFilters: { category: null } as TestFilters,
        filterFn,
        initialSortBy: 'id-asc' as TestSort,
        sortFn,
        itemsPerPage: 10,
      })
    );

    act(() => result.current.setCurrentPage(3));
    act(() => result.current.setSortBy('id-desc'));

    expect(result.current.currentPage).toBe(1);
  });

  // --- paginate: false ---

  it('paginate false returns every filtered/sorted item on a single page', () => {
    const items = makeItems(22);
    const { result } = renderHook(() =>
      useListing({
        items,
        initialFilters: { category: null } as TestFilters,
        filterFn,
        initialSortBy: 'id-asc' as TestSort,
        sortFn,
        itemsPerPage: 10,
        paginate: false,
      })
    );

    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginatedItems).toHaveLength(22);
  });

  it('paginate false with an empty result set does not blow up', () => {
    const items = makeItems(3, 'spa');
    const { result } = renderHook(() =>
      useListing({
        items,
        initialFilters: { category: 'nonexistent' } as TestFilters,
        filterFn,
        initialSortBy: 'id-asc' as TestSort,
        sortFn,
        itemsPerPage: 10,
        paginate: false,
      })
    );

    expect(result.current.resultCount).toBe(0);
    expect(result.current.paginatedItems).toEqual([]);
    expect(result.current.totalPages).toBe(0);
  });
});
