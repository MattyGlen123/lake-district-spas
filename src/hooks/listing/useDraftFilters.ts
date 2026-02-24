'use client';

import { Dispatch, SetStateAction, useState } from 'react';

interface UseDraftFiltersResult<T> {
  isOpen: boolean;
  activeFilters: T;
  draftFilters: T;
  setActiveFilters: Dispatch<SetStateAction<T>>;
  setDraftFilters: Dispatch<SetStateAction<T>>;
  openDraft: () => void;
  closeDraft: () => void;
  applyDraft: () => void;
  resetBoth: (nextFilters: T) => void;
}

export function useDraftFilters<T>(initialFilters: T): UseDraftFiltersResult<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);

  const openDraft = () => {
    setDraftFilters(activeFilters);
    setIsOpen(true);
  };

  const closeDraft = () => {
    setDraftFilters(activeFilters);
    setIsOpen(false);
  };

  const applyDraft = () => {
    setActiveFilters(draftFilters);
    setIsOpen(false);
  };

  const resetBoth = (nextFilters: T) => {
    setDraftFilters(nextFilters);
    setActiveFilters(nextFilters);
  };

  return {
    isOpen,
    activeFilters,
    draftFilters,
    setActiveFilters,
    setDraftFilters,
    openDraft,
    closeDraft,
    applyDraft,
    resetBoth,
  };
}
