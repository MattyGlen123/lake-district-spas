'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageToken, getPageTokens } from '@/lib/listing/pageTokens';

interface UsePaginationOptions<T> {
  items: T[];
  itemsPerPage: number;
  resetDeps: unknown[];
}

interface UsePaginationResult<T> {
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  pageTokens: PageToken[];
  setCurrentPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

export function usePagination<T>({
  items,
  itemsPerPage,
  resetDeps,
}: UsePaginationOptions<T>): UsePaginationResult<T> {
  const [currentPage, setCurrentPageState] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const pageTokens = useMemo(
    () => getPageTokens(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const setCurrentPage = (page: number) => {
    if (totalPages === 0) {
      setCurrentPageState(1);
      return;
    }
    setCurrentPageState(Math.max(1, Math.min(totalPages, page)));
  };

  const goToPreviousPage = () => {
    setCurrentPageState((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPageState((prev) => Math.min(totalPages, prev + 1));
  };

  useEffect(() => {
    setCurrentPageState(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDeps);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    pageTokens,
    setCurrentPage,
    goToPreviousPage,
    goToNextPage,
  };
}
