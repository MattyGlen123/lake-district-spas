import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePagination } from '@/hooks/listing/usePagination'

const makeItems = (n: number) => Array.from({ length: n }, (_, i) => i + 1)

describe('usePagination', () => {
  // --- Happy path ---

  it('starts on page 1 with correct initial state', () => {
    const items = makeItems(25)
    const { result } = renderHook(() =>
      usePagination({ items, itemsPerPage: 10, resetDeps: [] })
    )

    expect(result.current.currentPage).toBe(1)
    expect(result.current.totalPages).toBe(3)
    expect(result.current.paginatedItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('goToNextPage advances to the next page', () => {
    const { result } = renderHook(() =>
      usePagination({ items: makeItems(20), itemsPerPage: 10, resetDeps: [] })
    )

    act(() => { result.current.goToNextPage() })

    expect(result.current.currentPage).toBe(2)
  })

  it('goToPreviousPage goes back to the previous page', () => {
    const { result } = renderHook(() =>
      usePagination({ items: makeItems(20), itemsPerPage: 10, resetDeps: [] })
    )

    act(() => { result.current.goToNextPage() })
    act(() => { result.current.goToPreviousPage() })

    expect(result.current.currentPage).toBe(1)
  })

  it('setCurrentPage jumps to the specified page', () => {
    const { result } = renderHook(() =>
      usePagination({ items: makeItems(30), itemsPerPage: 10, resetDeps: [] })
    )

    act(() => { result.current.setCurrentPage(3) })

    expect(result.current.currentPage).toBe(3)
  })

  it('paginatedItems returns the correct slice for page 2', () => {
    const { result } = renderHook(() =>
      usePagination({ items: makeItems(25), itemsPerPage: 10, resetDeps: [] })
    )

    act(() => { result.current.setCurrentPage(2) })

    expect(result.current.paginatedItems).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
  })

  it('calculates totalPages correctly when items do not divide evenly', () => {
    const { result } = renderHook(() =>
      usePagination({ items: makeItems(23), itemsPerPage: 10, resetDeps: [] })
    )

    expect(result.current.totalPages).toBe(3)
  })

  it('last page contains only the remaining items when count is uneven', () => {
    const { result } = renderHook(() =>
      usePagination({ items: makeItems(23), itemsPerPage: 10, resetDeps: [] })
    )

    act(() => { result.current.setCurrentPage(3) })

    expect(result.current.paginatedItems).toEqual([21, 22, 23])
  })

  // --- Edge cases ---

  it('returns empty paginatedItems and totalPages 0 when items is empty', () => {
    const { result } = renderHook(() =>
      usePagination({ items: [], itemsPerPage: 10, resetDeps: [] })
    )

    expect(result.current.paginatedItems).toEqual([])
    expect(result.current.totalPages).toBe(0)
  })

  it('setCurrentPage resets to 1 when totalPages is 0', () => {
    const { result } = renderHook(() =>
      usePagination({ items: [], itemsPerPage: 10, resetDeps: [] })
    )

    act(() => { result.current.setCurrentPage(5) })

    expect(result.current.currentPage).toBe(1)
  })

  it('setCurrentPage clamps to 1 when given a value below 1', () => {
    const { result } = renderHook(() =>
      usePagination({ items: makeItems(20), itemsPerPage: 10, resetDeps: [] })
    )

    act(() => { result.current.setCurrentPage(0) })

    expect(result.current.currentPage).toBe(1)
  })

  it('setCurrentPage clamps to totalPages when given a value above totalPages', () => {
    const { result } = renderHook(() =>
      usePagination({ items: makeItems(20), itemsPerPage: 10, resetDeps: [] })
    )

    act(() => { result.current.setCurrentPage(99) })

    expect(result.current.currentPage).toBe(2)
  })

  it('goToPreviousPage stays on page 1 when already on page 1', () => {
    const { result } = renderHook(() =>
      usePagination({ items: makeItems(20), itemsPerPage: 10, resetDeps: [] })
    )

    act(() => { result.current.goToPreviousPage() })

    expect(result.current.currentPage).toBe(1)
  })

  it('goToNextPage stays on the last page when already on the last page', () => {
    const { result } = renderHook(() =>
      usePagination({ items: makeItems(20), itemsPerPage: 10, resetDeps: [] })
    )

    act(() => { result.current.goToNextPage() })
    act(() => { result.current.goToNextPage() }) // page 2 is the last

    expect(result.current.currentPage).toBe(2)
  })

  it('returns all items when count fits within a single page', () => {
    const items = makeItems(5)
    const { result } = renderHook(() =>
      usePagination({ items, itemsPerPage: 10, resetDeps: [] })
    )

    expect(result.current.totalPages).toBe(1)
    expect(result.current.paginatedItems).toEqual(items)
  })

  // --- State / branching ---

  it('resets to page 1 when resetDeps change', () => {
    let dep = 'initial'
    const { result, rerender } = renderHook(() =>
      usePagination({ items: makeItems(30), itemsPerPage: 10, resetDeps: [dep] })
    )

    act(() => { result.current.setCurrentPage(3) })
    expect(result.current.currentPage).toBe(3)

    dep = 'changed'
    rerender()

    expect(result.current.currentPage).toBe(1)
  })

  it('pageTokens update to reflect the current page', () => {
    // 100 items / 10 per page = 10 pages, enough to trigger ellipsis logic
    const { result } = renderHook(() =>
      usePagination({ items: makeItems(100), itemsPerPage: 10, resetDeps: [] })
    )

    const tokensOnPage1 = result.current.pageTokens

    act(() => { result.current.setCurrentPage(5) })

    expect(result.current.pageTokens).not.toEqual(tokensOnPage1)
    expect(result.current.pageTokens).toContain(5)
  })
})
