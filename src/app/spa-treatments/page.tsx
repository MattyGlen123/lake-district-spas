'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FilterButton from '@/components/FilterButton';
import TreatmentFilters, {
  PriceBracket,
} from '@/components/TreatmentFilters';
import TreatmentPickCard from '@/components/TreatmentPickCard';
import { getAllTreatmentsWithSpa } from '@/data/treatments';
import { spaData } from '@/data/spas';
import SortMenu from '@/components/listing/SortMenu';
import PaginationControls from '@/components/listing/PaginationControls';
import { useDraftFilters } from '@/hooks/listing/useDraftFilters';
import { usePagination } from '@/hooks/listing/usePagination';
import {
  TreatmentSortOption,
  buildInitialTreatmentFilters,
  countActiveTreatmentFilters,
  filterTreatments,
  sortTreatments,
  treatmentSortOptions,
} from '@/lib/treatment-catalog';

export default function SpaTreatmentsPage() {
  const allTreatments = useMemo(() => getAllTreatmentsWithSpa(spaData), []);
  const gridRef = useRef<HTMLDivElement>(null);

  const availableSpas = useMemo(() => {
    const spaMap = new Map<number, string>();
    allTreatments.forEach((t) => {
      if (!spaMap.has(t.spa.id)) spaMap.set(t.spa.id, t.spa.name);
    });
    return Array.from(spaMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allTreatments]);

  const [sortBy, setSortBy] = useState<TreatmentSortOption>('name-asc');
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
  } = useDraftFilters(buildInitialTreatmentFilters(availableSpas));

  const filteredTreatments = useMemo(
    () => filterTreatments(allTreatments, filters),
    [allTreatments, filters]
  );

  const tempFilteredCount = useMemo(
    () => filterTreatments(allTreatments, tempFilters).length,
    [allTreatments, tempFilters]
  );

  const sortedTreatments = useMemo(
    () => sortTreatments(filteredTreatments, sortBy),
    [filteredTreatments, sortBy]
  );

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedTreatments,
    pageTokens,
    setCurrentPage,
    goToPreviousPage,
    goToNextPage,
  } = usePagination({
    items: sortedTreatments,
    itemsPerPage,
    resetDeps: [filters, sortBy],
  });

  const activeFilterCount =
    countActiveTreatmentFilters(filters, availableSpas.length);

  const handleClearFilters = () => {
    resetBothFilters(buildInitialTreatmentFilters(availableSpas));
  };

  // Temp filter change handlers
  const handleTempPriceBracketChange = (bracket: PriceBracket) => {
    setTempFilters((prev) => ({
      ...prev,
      priceBrackets: prev.priceBrackets.includes(bracket)
        ? prev.priceBrackets.filter((b) => b !== bracket)
        : [...prev.priceBrackets, bracket],
    }));
  };

  const handleTempCategoryChange = (groupLabel: string) => {
    setTempFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(groupLabel)
        ? prev.categories.filter((c) => c !== groupLabel)
        : [...prev.categories, groupLabel],
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden min-h-[560px] md:min-h-[680px] flex items-center">
          <Image
            src="/images/pages/windermere-aerial-lake-district-spa-breaks.jpg"
            alt="Aerial view looking north along Lake Windermere with sunlight glinting off the deep blue water, wooded shorelines curving into the distance and green Lakeland fells rising beyond on a clear summer afternoon"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center w-full">
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-sm">
                <Sparkles className="h-3 w-3 mr-2" />
                Lake District Spa Treatments
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-8xl text-white tracking-tight leading-[1.1] mb-8">
              The Treatment <br />
              <span className="italic font-medium text-white/90">
                Collection
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-white/80 text-lg md:text-xl font-light leading-relaxed mb-12 italic">
              From hot stone massages to bespoke facials, explore treatments
              from the Lake District&apos;s finest hotel spas.
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
                  options={treatmentSortOptions}
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
                    <span className="text-stone-900">
                      {filteredTreatments.length}
                    </span>{' '}
                    {filteredTreatments.length === 1
                      ? 'treatment'
                      : 'treatments'}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <SortMenu
                    value={sortBy}
                    options={treatmentSortOptions}
                    onChange={setSortBy}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Treatments Grid */}
        {paginatedTreatments.length > 0 ? (
          <>
            {/* Results Count — mobile only, above grid */}
            <div className="md:hidden container mx-auto px-4 pt-8 pb-4">
              <div className="text-stone-500 text-[12px] font-bold uppercase tracking-widest">
                Showing{' '}
                <span className="text-stone-900">
                  {filteredTreatments.length}
                </span>{' '}
                {filteredTreatments.length === 1 ? 'treatment' : 'treatments'}
              </div>
            </div>

            <div className="container mx-auto px-4 pb-16 md:pt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-x-6">
                {paginatedTreatments.map((t) => (
                  <TreatmentPickCard
                    key={`${t.spaId}-${t.name}`}
                    treatment={t}
                    spa={t.spa}
                  />
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
                />
              </div>
            )}
          </>
        ) : (
          <div className="container mx-auto px-4 md:px-8 py-20 text-center">
            <p className="text-stone-500 text-lg mb-4">
              No treatments match your filters
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
        <TreatmentFilters
          isOpen={isFilterModalOpen}
          onClose={handleCloseModal}
          onApply={handleApplyFilters}
          onClearFilters={handleClearFilters}
          filteredCount={tempFilteredCount}
          selectedPriceBrackets={tempFilters.priceBrackets}
          onPriceBracketChange={handleTempPriceBracketChange}
          selectedCategories={tempFilters.categories}
          onCategoryChange={handleTempCategoryChange}
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
