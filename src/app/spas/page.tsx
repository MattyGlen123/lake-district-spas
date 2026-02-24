'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FilterButton from '@/components/FilterButton';
import FilterModal from '@/components/FilterModal';
import SpaGrid from '@/components/SpaGrid';
import SortMenu from '@/components/listing/SortMenu';
import PaginationControls from '@/components/listing/PaginationControls';
import { useDraftFilters } from '@/hooks/listing/useDraftFilters';
import { usePagination } from '@/hooks/listing/usePagination';
import { spaData } from '@/data/spas';
import { AccessLabel } from '@/types/spa';
import {
  SpaSortOption,
  applyFilters,
  countActiveFilters,
  createDefaultSpaFilters,
  sortSpas,
  spaSortOptions,
} from '@/lib/spa-catalog';

export default function SpasPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [sortBy, setSortBy] = useState<SpaSortOption>('name-asc');
  const itemsPerPage = 12;

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
    () => spaData.filter((spa) => applyFilters(spa, filters)),
    [filters]
  );

  const tempFilteredCount = useMemo(
    () => spaData.filter((spa) => applyFilters(spa, tempFilters)).length,
    [tempFilters]
  );

  const sortedSpas = useMemo(
    () => sortSpas(filteredSpas, sortBy),
    [filteredSpas, sortBy]
  );

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedSpas,
    pageTokens,
    setCurrentPage,
    goToPreviousPage,
    goToNextPage,
  } = usePagination({
    items: sortedSpas,
    itemsPerPage,
    resetDeps: [filters, sortBy],
  });

  const activeFilterCount = countActiveFilters(filters);

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

  const scrollToGridTop = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToGridTop();
  };

  const handlePreviousPage = () => {
    goToPreviousPage();
    scrollToGridTop();
  };

  const handleNextPage = () => {
    goToNextPage();
    scrollToGridTop();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden min-h-[560px] md:min-h-[680px] flex items-center">
          <Image
            src="/images/pages/ullswater-shoreline-lake-district-spa-breaks.jpg"
            alt="Clear water lapping over pebbles on the shore of Ullswater looking across the calm lake toward wooded banks and gentle rounded fells under a bright blue summer sky in the eastern Lake District National Park"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center w-full">
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-sm">
                Lake District Spa Directory
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-8xl text-white tracking-tight leading-[1.1] mb-8">
              The Spa <br />
              <span className="italic font-medium text-white/90">Collection</span>
            </h1>

            <p className="max-w-2xl mx-auto text-white/80 text-lg md:text-xl font-light leading-relaxed mb-12 italic">
              Browse and compare all Lake District spa hotels — filter by facilities, location, and
              access type.
            </p>

            <div className="h-px w-24 bg-white/40 mx-auto" />
          </div>
        </section>

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
                    Showing <span className="text-stone-900">{filteredSpas.length}</span>{' '}
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
        {paginatedSpas.length > 0 ? (
          <>
            {/* Results Count — mobile only, above grid */}
            <div className="md:hidden container mx-auto px-4 pt-8 pb-4">
              <div className="text-stone-500 text-[12px] font-bold uppercase tracking-widest">
                Showing <span className="text-stone-900">{filteredSpas.length}</span>{' '}
                {filteredSpas.length === 1 ? 'spa' : 'spas'}
              </div>
            </div>

            <SpaGrid
              spas={paginatedSpas}
              showHeading={false}
              className="container mx-auto px-4 pb-16 md:pt-16"
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="container mx-auto px-4 md:px-8 pb-16">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageTokens={pageTokens}
                  onPageChange={handlePageChange}
                  onPreviousPage={handlePreviousPage}
                  onNextPage={handleNextPage}
                  previousNextClassName="px-4 py-2 rounded-full bg-emerald-950 text-white font-bold text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-900 transition-colors"
                />
              </div>
            )}
          </>
        ) : (
          <div className="container mx-auto px-4 md:px-8 py-20 text-center">
            <p className="text-stone-500 text-lg mb-4">No spas match your filters</p>
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
          onApply={handleApplyFilters}
          selectedAccessLabels={tempFilters.accessLabels}
          onAccessLabelChange={handleTempAccessLabelChange}
          selectedLocation={tempFilters.location}
          onLocationChange={handleTempLocationChange}
          selectedFacilities={tempFilters.facilities}
          onFacilityChange={handleTempFacilityChange}
          onClearFilters={handleTempClearFilters}
          filteredCount={tempFilteredCount}
        />
      </main>

      <Footer />
    </div>
  );
}
