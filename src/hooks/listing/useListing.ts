'use client';

import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useDraftFilters } from '@/hooks/listing/useDraftFilters';
import { usePagination } from '@/hooks/listing/usePagination';
import { PageToken } from '@/lib/listing/pageTokens';

interface UseListingOptions<T, F, S> {
  items: T[];
  initialFilters: F;
  /** Array-in/array-out so it can wrap either a per-item predicate or a bespoke filter fn (e.g. filterTreatments). */
  filterFn: (items: T[], filters: F) => T[];
  initialSortBy: S;
  sortFn: (items: T[], sortBy: S) => T[];
  itemsPerPage: number;
  /**
   * false renders the full filtered/sorted list with no paging. Must be passed
   * explicitly (default true) — silently never calling usePagination is the bug
   * this hook exists to prevent. /spas passes false: ~22 spas total, small
   * enough that paging would only add clicks with no benefit.
   */
  paginate?: boolean;
}

interface UseListingResult<T, F, S> {
  // Filter state (passthrough from useDraftFilters)
  isOpen: boolean;
  activeFilters: F;
  draftFilters: F;
  setDraftFilters: Dispatch<SetStateAction<F>>;
  openDraft: () => void;
  closeDraft: () => void;
  applyDraft: () => void;
  resetBoth: (nextFilters: F) => void;
  /** Live count of what draftFilters would match, for the "N results" preview inside the filter modal. */
  draftResultCount: number;

  // Sort state
  sortBy: S;
  setSortBy: Dispatch<SetStateAction<S>>;

  // Derived results
  filteredItems: T[];
  sortedItems: T[];
  paginatedItems: T[];
  /** filteredItems.length — the "Showing N results" count, independent of pagination. */
  resultCount: number;

  // Pagination (passthrough from usePagination; totalPages caps at 1 when paginate is false)
  currentPage: number;
  totalPages: number;
  pageTokens: PageToken[];
  setCurrentPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

export function useListing<T, F, S>({
  items,
  initialFilters,
  filterFn,
  initialSortBy,
  sortFn,
  itemsPerPage,
  paginate = true,
}: UseListingOptions<T, F, S>): UseListingResult<T, F, S> {
  const [sortBy, setSortBy] = useState<S>(initialSortBy);

  const {
    isOpen,
    activeFilters,
    draftFilters,
    setDraftFilters,
    openDraft,
    closeDraft,
    applyDraft,
    resetBoth,
  } = useDraftFilters(initialFilters);

  const filteredItems = useMemo(
    () => filterFn(items, activeFilters),
    [items, activeFilters, filterFn]
  );

  const draftResultCount = useMemo(
    () => filterFn(items, draftFilters).length,
    [items, draftFilters, filterFn]
  );

  const sortedItems = useMemo(
    () => sortFn(filteredItems, sortBy),
    [filteredItems, sortBy, sortFn]
  );

  const {
    currentPage,
    totalPages,
    paginatedItems,
    pageTokens,
    setCurrentPage,
    goToPreviousPage,
    goToNextPage,
  } = usePagination({
    items: sortedItems,
    // paginate=false: one page sized to fit everything, rather than a second code path.
    itemsPerPage: paginate ? itemsPerPage : Math.max(sortedItems.length, 1),
    resetDeps: [activeFilters, sortBy],
  });

  return {
    isOpen,
    activeFilters,
    draftFilters,
    setDraftFilters,
    openDraft,
    closeDraft,
    applyDraft,
    resetBoth,
    draftResultCount,
    sortBy,
    setSortBy,
    filteredItems,
    sortedItems,
    paginatedItems,
    resultCount: filteredItems.length,
    currentPage,
    totalPages,
    pageTokens,
    setCurrentPage,
    goToPreviousPage,
    goToNextPage,
  };
}
