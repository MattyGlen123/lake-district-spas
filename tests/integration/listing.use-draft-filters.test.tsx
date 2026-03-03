import { act, renderHook } from '@testing-library/react';
import { useDraftFilters } from '@/hooks/listing/useDraftFilters';

interface TestFilters {
  maxPrice: number;
  spas: number[];
}

describe('useDraftFilters', () => {
  const initialFilters: TestFilters = {
    maxPrice: 200,
    spas: [1, 2],
  };

  it('keeps draft changes isolated until apply', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));

    act(() => result.current.openDraft());
    act(() =>
      result.current.setDraftFilters((prev) => ({
        ...prev,
        maxPrice: 100,
      }))
    );

    expect(result.current.activeFilters.maxPrice).toBe(200);
    expect(result.current.draftFilters.maxPrice).toBe(100);

    act(() => result.current.applyDraft());
    expect(result.current.activeFilters.maxPrice).toBe(100);
  });

  it('discards draft changes on close', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));

    act(() => result.current.openDraft());
    act(() =>
      result.current.setDraftFilters((prev) => ({
        ...prev,
        spas: [1],
      }))
    );
    expect(result.current.draftFilters.spas).toEqual([1]);

    act(() => result.current.closeDraft());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.draftFilters.spas).toEqual([1, 2]);
    expect(result.current.activeFilters.spas).toEqual([1, 2]);
  });

  it('resets both active and draft in one operation', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));

    act(() => result.current.resetBoth({ maxPrice: 250, spas: [1, 2, 3] }));

    expect(result.current.activeFilters).toEqual({ maxPrice: 250, spas: [1, 2, 3] });
    expect(result.current.draftFilters).toEqual({ maxPrice: 250, spas: [1, 2, 3] });
  });
});
