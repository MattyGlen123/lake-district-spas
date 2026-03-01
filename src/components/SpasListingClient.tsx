'use client';

import { useState, useMemo, useRef } from 'react';
import FilterButton from '@/components/FilterButton';
import FilterModal from '@/components/FilterModal';
import SpaGrid from '@/components/SpaGrid';
import SortMenu from '@/components/listing/SortMenu';
import { useDraftFilters } from '@/hooks/listing/useDraftFilters';
import { AccessLabel, Spa } from '@/types/spa';
import {
  SpaSortOption,
  applyFilters,
  countActiveFilters,
  createDefaultSpaFilters,
  sortSpas,
  spaSortOptions,
} from '@/lib/spa-catalog';

interface SpasListingClientProps {
  spas: Spa[];
}

export default function SpasListingClient({ spas }: SpasListingClientProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [sortBy, setSortBy] = useState<SpaSortOption>('featured');

  const {
    isOpen: isFilterModalOpen,
    activeFilters: filters,
    draftFilters: tempFilters,
    setDraftFilters: setTempFilters,
    openDraft: handleOpenModal,
    closeDraft: handleCloseModal,
    applyDraft: handleApplyFilters,
    resetBoth: resetBothFilters,
  } = useDraftFilters(createDefaultSpaFilters());

  const filteredSpas = useMemo(
    () => spas.filter((spa) => applyFilters(spa, filters)),
    [spas, filters]
  );

  const tempFilteredCount = useMemo(
    () => spas.filter((spa) => applyFilters(spa, tempFilters)).length,
    [spas, tempFilters]
  );

  const sortedSpas = useMemo(
    () => sortSpas(filteredSpas, sortBy),
    [filteredSpas, sortBy]
  );

  const activeFilterCount = countActiveFilters(filters);

  const scrollToGridTop = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleApplyFiltersWithScroll = () => {
    handleApplyFilters();
    scrollToGridTop();
  };

  const handleClearFilters = () => {
    resetBothFilters(createDefaultSpaFilters());
  };

  const handleTempAccessLabelChange = (label: AccessLabel) => {
    setTempFilters((prev) => ({
      ...prev,
      accessLabels: prev.accessLabels.includes(label)
        ? prev.accessLabels.filter((l) => l !== label)
        : [...prev.accessLabels, label],
    }));
  };

  const handleTempLocationChange = (location: string) => {
    setTempFilters((prev) => ({ ...prev, location }));
  };

  const handleTempFacilityChange = (facility: string) => {
    setTempFilters((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleTempClearFilters = () => {
    setTempFilters(createDefaultSpaFilters());
  };

  return (
    <>
      <div ref={gridRef} className="scroll-mt-24" />

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-20 bg-soft-cream border-y border-stone-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            {/* Mobile: Filter and Sort Row */}
            <div className="flex flex-row items-center justify-between gap-6 md:hidden">
              <FilterButton
                onClick={handleOpenModal}
                activeFilterCount={activeFilterCount}
              />
              <SortMenu
                value={sortBy}
                options={spaSortOptions}
                onChange={setSortBy}
              />
            </div>

            {/* Desktop: Three Column Layout */}
            <div className="hidden md:flex md:flex-row md:items-center md:justify-between md:w-full">
              <div className="flex-shrink-0">
                <FilterButton
                  onClick={handleOpenModal}
                  activeFilterCount={activeFilterCount}
                />
              </div>

              <div className="flex-1 flex justify-center">
                <div className="text-stone-500 text-[12px] font-bold uppercase tracking-widest whitespace-nowrap">
                  Showing{' '}
                  <span className="text-stone-900">{filteredSpas.length}</span>{' '}
                  {filteredSpas.length === 1 ? 'spa' : 'spas'}
                </div>
              </div>

              <div className="flex-shrink-0">
                <SortMenu
                  value={sortBy}
                  options={spaSortOptions}
                  onChange={setSortBy}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spa Grid */}
      {sortedSpas.length > 0 ? (
        <>
          {/* Results Count — mobile only, above grid */}
          <div className="md:hidden container mx-auto px-4 pt-8 pb-4">
            <div className="text-stone-500 text-[12px] font-bold uppercase tracking-widest">
              Showing{' '}
              <span className="text-stone-900">{filteredSpas.length}</span>{' '}
              {filteredSpas.length === 1 ? 'spa' : 'spas'}
            </div>
          </div>

          <SpaGrid
            spas={sortedSpas}
            showHeading={false}
            className="container mx-auto px-4 pb-16 md:pt-16"
          />
        </>
      ) : (
        <div className="container mx-auto px-4 md:px-8 py-20 text-center">
          <p className="text-stone-500 text-lg mb-4">
            No spas match your filters
          </p>
          <button
            onClick={handleClearFilters}
            className="text-amber-700 underline hover:text-amber-800"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={handleCloseModal}
        onApply={handleApplyFiltersWithScroll}
        selectedAccessLabels={tempFilters.accessLabels}
        onAccessLabelChange={handleTempAccessLabelChange}
        selectedLocation={tempFilters.location}
        onLocationChange={handleTempLocationChange}
        selectedFacilities={tempFilters.facilities}
        onFacilityChange={handleTempFacilityChange}
        onClearFilters={handleTempClearFilters}
        filteredCount={tempFilteredCount}
      />
    </>
  );
}
