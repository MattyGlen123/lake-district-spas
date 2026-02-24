'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Ticket } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FilterButton from '@/components/FilterButton';
import DayPassFilters from '@/components/DayPassFilters';
import DayPassCard from '@/components/DayPassCard';
import { getAllDayPassesWithSpa } from '@/data/day-passes';
import { spaData } from '@/data/spas';
import SortMenu from '@/components/listing/SortMenu';
import PaginationControls from '@/components/listing/PaginationControls';
import { useDraftFilters } from '@/hooks/listing/useDraftFilters';
import { usePagination } from '@/hooks/listing/usePagination';
import {
  DayPassSortOption,
  applyDayPassFilters,
  countActiveDayPassFilters,
  createDefaultDayPassFilters,
  dayPassSortOptions,
  sortDayPasses,
} from '@/lib/day-pass-catalog';

export default function SpaDaysPage() {
  const allDayPasses = useMemo(() => getAllDayPassesWithSpa(spaData), []);
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [sortBy, setSortBy] = useState<DayPassSortOption>('price-high-low');
  const itemsPerPage = 12;

  // Calculate available options
  const availableDurations = useMemo(() => {
    const durations = new Set(allDayPasses.map((p) => p.spaDuration));
    return Array.from(durations).sort((a, b) => a - b);
  }, [allDayPasses]);

  const availableSpas = useMemo(() => {
    const spaMap = new Map<number, string>();
    allDayPasses.forEach((p) => {
      if (!spaMap.has(p.spa.id)) {
        spaMap.set(p.spa.id, p.spa.name);
      }
    });
    return Array.from(spaMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allDayPasses]);

  const maxPrice = useMemo(() => {
    if (allDayPasses.length === 0) return 500;
    return Math.ceil(Math.max(...allDayPasses.map((p) => p.priceGBP), 0) / 50) * 50;
  }, [allDayPasses]);

  const initialFilters = useMemo(
    () =>
      createDefaultDayPassFilters(
        maxPrice,
        availableSpas.map((spa) => spa.id)
      ),
    [maxPrice, availableSpas]
  );
  const {
    isOpen: isFilterModalOpen,
    activeFilters: filters,
    draftFilters: tempFilters,
    setDraftFilters: setTempFilters,
    openDraft: handleOpenModal,
    closeDraft: handleCloseModal,
    applyDraft: handleApplyFilters,
    resetBoth: resetBothFilters,
  } = useDraftFilters(initialFilters);

  // Filter logic
  const filteredDayPasses = useMemo(
    () => allDayPasses.filter((pass) => applyDayPassFilters(pass, filters)),
    [allDayPasses, filters]
  );

  // Sort logic
  const sortedDayPasses = useMemo(
    () => sortDayPasses(filteredDayPasses, sortBy),
    [filteredDayPasses, sortBy]
  );

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedDayPasses,
    pageTokens,
    setCurrentPage,
    goToPreviousPage,
    goToNextPage,
  } = usePagination({
    items: sortedDayPasses,
    itemsPerPage,
    resetDeps: [filters, sortBy],
  });

  // Calculate temp filtered count (for modal display)
  const tempFilteredCount = useMemo(() => {
    return allDayPasses.filter((pass) => applyDayPassFilters(pass, tempFilters)).length;
  }, [allDayPasses, tempFilters]);

  const handleClearFilters = () => {
    resetBothFilters(
      createDefaultDayPassFilters(
        maxPrice,
        availableSpas.map((spa) => spa.id)
      )
    );
  };

  // Filter change handlers
  const handleTempMaxPriceChange = (price: number) => {
    setTempFilters((prev) => ({ ...prev, maxPrice: price }));
  };

  const handleTempDurationChange = (duration: number) => {
    setTempFilters((prev) => ({
      ...prev,
      durations: prev.durations.includes(duration)
        ? prev.durations.filter((d) => d !== duration)
        : [...prev.durations, duration],
    }));
  };

  const handleTempTreatmentsIncludedChange = (value: boolean | null) => {
    setTempFilters((prev) => ({ ...prev, treatmentsIncluded: value }));
  };

  const handleTempRefreshmentsIncludedChange = (value: boolean | null) => {
    setTempFilters((prev) => ({ ...prev, refreshmentsIncluded: value }));
  };

  const handleTempMealIncludedChange = (value: boolean | null) => {
    setTempFilters((prev) => ({ ...prev, mealIncluded: value }));
  };

  const handleTempPartyTypeChange = (type: string) => {
    setTempFilters((prev) => ({
      ...prev,
      partyTypes: prev.partyTypes.includes(type)
        ? prev.partyTypes.filter((t) => t !== type)
        : [...prev.partyTypes, type],
    }));
  };

  const handleTempFacilityChange = (facility: string) => {
    setTempFilters((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleTempSpaChange = (spaId: number) => {
    setTempFilters((prev) => ({
      ...prev,
      spas: prev.spas.includes(spaId)
        ? prev.spas.filter((id) => id !== spaId)
        : [...prev.spas, spaId],
    }));
  };

  const handleSelectAllSpas = () => {
    setTempFilters((prev) => ({
      ...prev,
      spas: availableSpas.map((s) => s.id),
    }));
  };

  const handleDeselectAllSpas = () => {
    setTempFilters((prev) => ({ ...prev, spas: [] }));
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

  // Calculate active filter count
  const activeFilterCount = countActiveDayPassFilters(
    filters,
    maxPrice,
    availableSpas.length
  );

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
                <Ticket className="h-3 w-3 mr-2" />
                Lake District Day Spa Directory
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-8xl text-white tracking-tight leading-[1.1] mb-8">
              The Day Pass <br />
              <span className="italic font-medium text-white/90">Collection</span>
            </h1>

            <p className="max-w-2xl mx-auto text-white/80 text-lg md:text-xl font-light leading-relaxed mb-12 italic">
              Browse and compare luxury day spa packages from the finest hotels in the Lake
              District. All in one place, with clear pricing and inclusions.
            </p>

            <div className="h-px w-24 bg-white/40 mx-auto" />
          </div>
        </section>

        <div ref={gridRef} className="scroll-mt-24" />

        {/* Filter Bar */}
        <div className="sticky top-0 z-20 bg-soft-cream border-y border-stone-100">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              {/* Mobile: Filter and Sort Row */}
              <div className="flex flex-row items-center justify-between gap-6 md:hidden">
                {/* Filter Button */}
                <FilterButton
                  onClick={handleOpenModal}
                  activeFilterCount={activeFilterCount}
                />

                {/* Sort Dropdown */}
                <SortMenu
                  value={sortBy}
                  options={dayPassSortOptions}
                  onChange={setSortBy}
                />
              </div>

              {/* Desktop: Three Column Layout */}
              <div className="hidden md:flex md:flex-row md:items-center md:justify-between md:w-full">
                {/* Left: Filter Button */}
                <div className="flex-shrink-0">
                  <FilterButton
                    onClick={handleOpenModal}
                    activeFilterCount={activeFilterCount}
                  />
                </div>

                {/* Center: Results Count */}
                <div className="flex-1 flex justify-center">
                  <div className="text-stone-500 text-[12px] font-bold uppercase tracking-widest whitespace-nowrap">
                    Showing <span className="text-stone-900">{filteredDayPasses.length}</span>{' '}
                    {filteredDayPasses.length === 1 ? 'day pass' : 'day passes'}
                  </div>
                </div>

                {/* Right: Sort Dropdown */}
                <div className="flex-shrink-0">
                  <SortMenu
                    value={sortBy}
                    options={dayPassSortOptions}
                    onChange={setSortBy}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Day Passes Grid */}
        {paginatedDayPasses.length > 0 ? (
          <>
            {/* Results Count - Mobile only, above grid */}
            <div className="md:hidden container mx-auto px-4 pt-8 pb-4">
              <div className="text-stone-500 text-[12px] font-bold uppercase tracking-widest">
                Showing <span className="text-stone-900">{filteredDayPasses.length}</span>{' '}
                {filteredDayPasses.length === 1 ? 'day pass' : 'day passes'}
              </div>
            </div>
            <div className="container mx-auto px-4 pb-16 md:pt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-x-6">
                {paginatedDayPasses.map((pass) => (
                  <DayPassCard key={pass.id} dayPass={pass} spa={pass.spa} />
                ))}
              </div>
            </div>

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
            <p className="text-stone-500 text-lg mb-4">No day passes match your filters</p>
            <button
              onClick={handleClearFilters}
              className="text-amber-700 underline hover:text-amber-800"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Filter Modal */}
        <DayPassFilters
          isOpen={isFilterModalOpen}
          onClose={handleCloseModal}
          onApply={handleApplyFilters}
          onClearFilters={handleClearFilters}
          filteredCount={tempFilteredCount}
          maxPrice={maxPrice}
          selectedMaxPrice={tempFilters.maxPrice}
          onMaxPriceChange={handleTempMaxPriceChange}
          availableDurations={availableDurations}
          selectedDurations={tempFilters.durations}
          onDurationChange={handleTempDurationChange}
          selectedTreatmentsIncluded={tempFilters.treatmentsIncluded}
          onTreatmentsIncludedChange={handleTempTreatmentsIncludedChange}
          selectedRefreshmentsIncluded={tempFilters.refreshmentsIncluded}
          onRefreshmentsIncludedChange={handleTempRefreshmentsIncludedChange}
          selectedMealIncluded={tempFilters.mealIncluded}
          onMealIncludedChange={handleTempMealIncludedChange}
          selectedPartyTypes={tempFilters.partyTypes}
          onPartyTypeChange={handleTempPartyTypeChange}
          selectedFacilities={tempFilters.facilities}
          onFacilityChange={handleTempFacilityChange}
          availableSpas={availableSpas}
          selectedSpas={tempFilters.spas}
          onSpaChange={handleTempSpaChange}
          onSelectAllSpas={handleSelectAllSpas}
          onDeselectAllSpas={handleDeselectAllSpas}
        />
      </main>

      <Footer />
    </div>
  );
}

