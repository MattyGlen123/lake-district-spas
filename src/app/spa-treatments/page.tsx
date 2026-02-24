'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FilterButton from '@/components/FilterButton';
import TreatmentFilters, {
  PriceBracket,
  CATEGORY_GROUPS,
  ALL_CATEGORY_GROUP_LABELS,
} from '@/components/TreatmentFilters';
import TreatmentPickCard from '@/components/TreatmentPickCard';
import {
  getAllTreatmentsWithSpa,
  parseTreatmentPrice,
} from '@/data/treatments';
import { spaData } from '@/data/spas';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortOption = 'name-asc' | 'price-low-high' | 'price-high-low';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'A–Z' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
];

function matchesPriceBracket(price: string, bracket: PriceBracket): boolean {
  const n = parseTreatmentPrice(price);
  switch (bracket) {
    case 'under-75':
      return n < 75;
    case '75-100':
      return n >= 75 && n <= 100;
    case '100-150':
      return n > 100 && n <= 150;
    case '150-plus':
      return n > 150;
  }
}

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

  const buildInitialFilters = (spas: { id: number; name: string }[]) => ({
    priceBrackets: [] as PriceBracket[],
    categories: [...ALL_CATEGORY_GROUP_LABELS],
    spas: spas.map((s) => s.id),
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState(() => buildInitialFilters([]));
  const [tempFilters, setTempFilters] = useState(() => buildInitialFilters([]));

  // Initialise filter state once spa list is ready
  useEffect(() => {
    if (availableSpas.length > 0 && filters.spas.length === 0) {
      const initial = buildInitialFilters(availableSpas);
      setFilters(initial);
      setTempFilters(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableSpas]);

  // Core filter function — reused for both active and temp counts
  function applyFilters(f: {
    priceBrackets: PriceBracket[];
    categories: string[];
    spas: number[];
  }) {
    return allTreatments.filter((t) => {
      // Price bracket (OR across selected brackets; no filter if none selected)
      if (f.priceBrackets.length > 0) {
        if (!t.price) return false;
        const matchesAny = f.priceBrackets.some((b) =>
          matchesPriceBracket(t.price!, b)
        );
        if (!matchesAny) return false;
      }

      // Category (OR across selected groups; always at least one selected)
      if (f.categories.length < ALL_CATEGORY_GROUP_LABELS.length) {
        const allowedCategories = CATEGORY_GROUPS.filter((g) =>
          f.categories.includes(g.label)
        ).flatMap((g) => g.categories);
        if (!allowedCategories.includes(t.category)) return false;
      }

      // Spas (OR)
      if (f.spas.length > 0 && !f.spas.includes(t.spa.id)) return false;

      return true;
    });
  }

  const filteredTreatments = useMemo(
    () => applyFilters(filters),
    [allTreatments, filters]
  );

  const tempFilteredCount = useMemo(
    () => applyFilters(tempFilters).length,
    [allTreatments, tempFilters]
  );

  const sortedTreatments = useMemo(() => {
    const sorted = [...filteredTreatments];
    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-low-high':
        return sorted.sort(
          (a, b) =>
            parseTreatmentPrice(a.price ?? '0') -
            parseTreatmentPrice(b.price ?? '0')
        );
      case 'price-high-low':
        return sorted.sort(
          (a, b) =>
            parseTreatmentPrice(b.price ?? '0') -
            parseTreatmentPrice(a.price ?? '0')
        );
      default:
        return sorted;
    }
  }, [filteredTreatments, sortBy]);

  const totalPages = Math.ceil(sortedTreatments.length / itemsPerPage);

  const paginatedTreatments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedTreatments.slice(start, start + itemsPerPage);
  }, [sortedTreatments, currentPage]);

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  // Scroll to top of grid when page changes
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  const activeFilterCount =
    (filters.priceBrackets.length > 0 ? 1 : 0) +
    (filters.categories.length < ALL_CATEGORY_GROUP_LABELS.length ? 1 : 0) +
    (filters.spas.length < availableSpas.length ? 1 : 0);

  // Pagination page numbers
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  // Modal handlers
  const handleOpenModal = () => {
    setTempFilters(filters);
    setIsFilterModalOpen(true);
  };

  const handleCloseModal = () => {
    setTempFilters(filters);
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    const cleared = buildInitialFilters(availableSpas);
    setTempFilters(cleared);
    setFilters(cleared);
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

  const currentSortLabel =
    sortOptions.find((o) => o.value === sortBy)?.label ?? 'Sort';

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

        {/* Sticky Filter Bar */}
        <div
          className="sticky top-0 z-20 bg-soft-cream border-y border-stone-100"
          ref={gridRef}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              {/* Mobile: Filter and Sort Row */}
              <div className="flex flex-row items-center justify-between gap-6 md:hidden">
                <FilterButton
                  onClick={handleOpenModal}
                  activeFilterCount={activeFilterCount}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 text-stone-700 text-sm font-medium hover:text-stone-900">
                    <span>{currentSortLabel}</span>
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[200px]">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={
                          sortBy === option.value ? 'bg-stone-100' : ''
                        }
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 text-stone-700 text-sm font-medium hover:text-stone-900">
                      <span>{currentSortLabel}</span>
                      <ChevronRight className="h-4 w-4 rotate-90" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[200px]">
                      {sortOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={
                            sortBy === option.value ? 'bg-stone-100' : ''
                          }
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-full bg-emerald-950 text-white font-bold text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 text-stone-400"
                        >
                          ...
                        </span>
                      );
                    }
                    const pageNum = page as number;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-colors ${
                          currentPage === pageNum
                            ? 'bg-emerald-950 text-white underline'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-full bg-emerald-950 text-white font-bold text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
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
