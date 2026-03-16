import { act, renderHook } from '@testing-library/react';
import { useDraftFilters } from '@/hooks/listing/useDraftFilters';

interface TestFilters {
  maxPrice: number;
  spas: number[];
}

const initialFilters: TestFilters = {
  maxPrice: 200,
  spas: [1, 2],
};

describe('useDraftFilters', () => {
  // --- Initial state ---

  it('initialises isOpen as false', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    expect(result.current.isOpen).toBe(false);
  });

  it('initialises activeFilters from initialFilters', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    expect(result.current.activeFilters).toEqual(initialFilters);
  });

  it('initialises draftFilters from initialFilters', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    expect(result.current.draftFilters).toEqual(initialFilters);
  });

  // --- openDraft ---

  it('openDraft sets isOpen to true', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    act(() => result.current.openDraft());
    expect(result.current.isOpen).toBe(true);
  });

  it('openDraft syncs draft filters from the current active filters', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    // Advance active without opening draft
    act(() => result.current.setActiveFilters({ maxPrice: 150, spas: [3] }));
    act(() => result.current.openDraft());
    expect(result.current.draftFilters).toEqual({ maxPrice: 150, spas: [3] });
  });

  it('openDraft called a second time re-syncs draft to active, discarding in-progress edits', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    act(() => result.current.openDraft());
    act(() => result.current.setDraftFilters((prev) => ({ ...prev, maxPrice: 50 })));
    // Second open — should reset draft back to active
    act(() => result.current.openDraft());
    expect(result.current.draftFilters).toEqual(initialFilters);
  });

  // --- Draft isolation ---

  it('draft changes do not affect active filters', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    act(() => result.current.openDraft());
    act(() => result.current.setDraftFilters((prev) => ({ ...prev, maxPrice: 100 })));
    expect(result.current.activeFilters.maxPrice).toBe(200);
  });

  // --- applyDraft ---

  it('applyDraft promotes draft filters to active filters', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    act(() => result.current.openDraft());
    act(() => result.current.setDraftFilters((prev) => ({ ...prev, maxPrice: 100 })));
    act(() => result.current.applyDraft());
    expect(result.current.activeFilters.maxPrice).toBe(100);
  });

  it('applyDraft sets isOpen to false', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    act(() => result.current.openDraft());
    act(() => result.current.applyDraft());
    expect(result.current.isOpen).toBe(false);
  });

  // --- closeDraft ---

  it('closeDraft sets isOpen to false', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    act(() => result.current.openDraft());
    act(() => result.current.closeDraft());
    expect(result.current.isOpen).toBe(false);
  });

  it('closeDraft resets draft filters to the current active filters', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    act(() => result.current.openDraft());
    act(() => result.current.setDraftFilters((prev) => ({ ...prev, spas: [1] })));
    act(() => result.current.closeDraft());
    expect(result.current.draftFilters).toEqual(initialFilters);
  });

  it('closeDraft does not change active filters', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    act(() => result.current.openDraft());
    act(() => result.current.setDraftFilters((prev) => ({ ...prev, spas: [1] })));
    act(() => result.current.closeDraft());
    expect(result.current.activeFilters).toEqual(initialFilters);
  });

  // --- resetBoth ---

  it('resetBoth sets active filters to the provided value', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    act(() => result.current.resetBoth({ maxPrice: 250, spas: [1, 2, 3] }));
    expect(result.current.activeFilters).toEqual({ maxPrice: 250, spas: [1, 2, 3] });
  });

  it('resetBoth sets draft filters to the provided value', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    act(() => result.current.resetBoth({ maxPrice: 250, spas: [1, 2, 3] }));
    expect(result.current.draftFilters).toEqual({ maxPrice: 250, spas: [1, 2, 3] });
  });

  it('resetBoth does not change isOpen', () => {
    const { result } = renderHook(() => useDraftFilters(initialFilters));
    act(() => result.current.openDraft());
    act(() => result.current.resetBoth({ maxPrice: 250, spas: [1, 2, 3] }));
    expect(result.current.isOpen).toBe(true);
  });
});
