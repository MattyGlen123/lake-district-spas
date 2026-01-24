'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FilterButton from '@/components/FilterButton';
import DayPassFilters from '@/components/DayPassFilters';
import DayPassCard from '@/components/DayPassCard';
import { getAllDayPassesWithSpa } from '@/data/day-passes';
import { spaData } from '@/data/spas';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortOption = 'price-high-low' | 'price-low-high' | 'duration-shortest' | 'duration-longest';

export default function SpaDaysPage() {
  const allDayPasses = useMemo(() => getAllDayPassesWithSpa(spaData), []);
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('price-high-low');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Temp filter state (for modal) - will be initialized via useEffect
  const [tempFilters, setTempFilters] = useState({
    maxPrice: 500,
    durations: [] as number[],
    treatmentsIncluded: null as boolean | null,
    refreshmentsIncluded: null as boolean | null,
    mealIncluded: null as boolean | null,
    partyTypes: [] as string[],
    facilities: [] as string[],
    spas: [] as number[],
  });

  // Active filter state - will be initialized via useEffect
  const [filters, setFilters] = useState({
    maxPrice: 500,
    durations: [] as number[],
    treatmentsIncluded: null as boolean | null,
    refreshmentsIncluded: null as boolean | null,
    mealIncluded: null as boolean | null,
    partyTypes: [] as string[],
    facilities: [] as string[],
    spas: [] as number[],
  });

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

  // Initialize filters with computed values
  const initialFilters = useMemo(() => {
    const initialMaxPrice = allDayPasses.length > 0
      ? Math.ceil(Math.max(...allDayPasses.map((p) => p.priceGBP), 0) / 50) * 50
      : 500;
    const initialSpas = allDayPasses.length > 0
      ? Array.from(new Set(allDayPasses.map((p) => p.spa.id)))
      : [];
    
    return {
      maxPrice: initialMaxPrice,
      durations: [] as number[],
      treatmentsIncluded: null as boolean | null,
      refreshmentsIncluded: null as boolean | null,
      mealIncluded: null as boolean | null,
      partyTypes: [] as string[],
      facilities: [] as string[],
      spas: initialSpas,
    };
  }, [allDayPasses]);

  // Initialize filter state
  useEffect(() => {
    if (tempFilters.maxPrice === 0 || tempFilters.spas.length === 0) {
      setTempFilters(initialFilters);
    }
    if (filters.maxPrice === 0 || filters.spas.length === 0) {
      setFilters(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters]);

  // Filter logic
  const filteredDayPasses = useMemo(() => {
    return allDayPasses.filter((pass) => {
      // Price filter
      if (pass.priceGBP > filters.maxPrice) {
        return false;
      }

      // Duration filter (OR logic)
      if (filters.durations.length > 0) {
        if (!filters.durations.includes(pass.spaDuration)) {
          return false;
        }
      }

      // Inclusions filter (AND logic - if multiple checked, pass must have ALL)
      const inclusionFilters: boolean[] = [];
      if (filters.treatmentsIncluded === true) {
        inclusionFilters.push(pass.treatmentsIncluded);
      }
      if (filters.refreshmentsIncluded === true) {
        inclusionFilters.push(pass.refreshmentsIncluded);
      }
      if (filters.mealIncluded === true) {
        inclusionFilters.push(pass.mealIncluded);
      }
      if (inclusionFilters.length > 0 && inclusionFilters.some((v) => !v)) {
        return false;
      }

      // Party type filter (OR logic)
      if (filters.partyTypes.length > 0) {
        let matchesPartyType = false;
        for (const type of filters.partyTypes) {
          if (type === 'Single') {
            if (!pass.requiredNumbers && !pass.pricePerPerson) {
              matchesPartyType = true;
              break;
            }
          } else if (type === 'Couples') {
            if (
              pass.requiredNumbers?.includes('2') ||
              pass.requiredNumbers?.toLowerCase().includes('couple')
            ) {
              matchesPartyType = true;
              break;
            }
          } else if (type === 'Groups') {
            if (
              pass.requiredNumbers?.includes('-') ||
              pass.requiredNumbers?.toLowerCase().includes('group')
            ) {
              matchesPartyType = true;
              break;
            }
          }
        }
        if (!matchesPartyType) {
          return false;
        }
      }

      // Facilities filter (AND logic for non-pool, OR for pools, OR for ice room)
      if (filters.facilities.length > 0) {
        const poolFilters = ['indoorPool', 'outdoorPool'];
        const selectedPools = filters.facilities.filter((f) => poolFilters.includes(f));
        const hasIceRoomFilter = filters.facilities.includes('iceRoom');
        const otherFacilities = filters.facilities.filter(
          (f) => !poolFilters.includes(f) && f !== 'iceRoom'
        );

        // Check pools with OR logic
        if (selectedPools.length > 0) {
          const hasAnyPool = selectedPools.some((pool) => {
            const poolKey = pool as keyof typeof pass.spa.facilities;
            return pass.spa.facilities[poolKey];
          });
          if (!hasAnyPool) {
            return false;
          }
        }

        // Check ice room filter with OR logic (iceRoom OR coldPlunge)
        if (hasIceRoomFilter) {
          if (!pass.spa.facilities.iceRoom && !pass.spa.facilities.coldPlunge) {
            return false;
          }
        }

        // Check other facilities with AND logic
        if (otherFacilities.length > 0) {
          const hasAllOtherFacilities = otherFacilities.every((facility) => {
            const facilityKey = facility as keyof typeof pass.spa.facilities;
            return pass.spa.facilities[facilityKey];
          });
          if (!hasAllOtherFacilities) {
            return false;
          }
        }
      }

      // Spas filter (OR logic)
      if (filters.spas.length > 0 && !filters.spas.includes(pass.spa.id)) {
        return false;
      }

      return true;
    });
  }, [allDayPasses, filters]);

  // Sort logic
  const sortedDayPasses = useMemo(() => {
    const sorted = [...filteredDayPasses];
    switch (sortBy) {
      case 'price-high-low':
        return sorted.sort((a, b) => b.priceGBP - a.priceGBP);
      case 'price-low-high':
        return sorted.sort((a, b) => a.priceGBP - b.priceGBP);
      case 'duration-shortest':
        return sorted.sort((a, b) => a.spaDuration - b.spaDuration);
      case 'duration-longest':
        return sorted.sort((a, b) => b.spaDuration - a.spaDuration);
      default:
        return sorted;
    }
  }, [filteredDayPasses, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedDayPasses.length / itemsPerPage);
  const paginatedDayPasses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedDayPasses.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedDayPasses, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  // Scroll to top of grid when page changes
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Calculate temp filtered count (for modal display)
  const tempFilteredCount = useMemo(() => {
    return allDayPasses.filter((pass) => {
      if (pass.priceGBP > tempFilters.maxPrice) return false;
      if (tempFilters.durations.length > 0 && !tempFilters.durations.includes(pass.spaDuration)) {
        return false;
      }
      const inclusionFilters: boolean[] = [];
      if (tempFilters.treatmentsIncluded === true) inclusionFilters.push(pass.treatmentsIncluded);
      if (tempFilters.refreshmentsIncluded === true) inclusionFilters.push(pass.refreshmentsIncluded);
      if (tempFilters.mealIncluded === true) inclusionFilters.push(pass.mealIncluded);
      if (inclusionFilters.length > 0 && inclusionFilters.some((v) => !v)) return false;
      if (tempFilters.partyTypes.length > 0) {
        let matches = false;
        for (const type of tempFilters.partyTypes) {
          if (type === 'Single' && !pass.requiredNumbers && !pass.pricePerPerson) {
            matches = true;
            break;
          } else if (
            type === 'Couples' &&
            (pass.requiredNumbers?.includes('2') ||
              pass.requiredNumbers?.toLowerCase().includes('couple'))
          ) {
            matches = true;
            break;
          } else if (
            type === 'Groups' &&
            (pass.requiredNumbers?.includes('-') ||
              pass.requiredNumbers?.toLowerCase().includes('group'))
          ) {
            matches = true;
            break;
          }
        }
        if (!matches) return false;
      }
      if (tempFilters.facilities.length > 0) {
        const poolFilters = ['indoorPool', 'outdoorPool'];
        const selectedPools = tempFilters.facilities.filter((f) => poolFilters.includes(f));
        const hasIceRoomFilter = tempFilters.facilities.includes('iceRoom');
        const otherFacilities = tempFilters.facilities.filter(
          (f) => !poolFilters.includes(f) && f !== 'iceRoom'
        );
        if (selectedPools.length > 0) {
          const hasAnyPool = selectedPools.some((pool) => {
            const poolKey = pool as keyof typeof pass.spa.facilities;
            return pass.spa.facilities[poolKey];
          });
          if (!hasAnyPool) return false;
        }
        if (hasIceRoomFilter) {
          if (!pass.spa.facilities.iceRoom && !pass.spa.facilities.coldPlunge) return false;
        }
        if (otherFacilities.length > 0) {
          const hasAll = otherFacilities.every((facility) => {
            const facilityKey = facility as keyof typeof pass.spa.facilities;
            return pass.spa.facilities[facilityKey];
          });
          if (!hasAll) return false;
        }
      }
      if (tempFilters.spas.length > 0 && !tempFilters.spas.includes(pass.spa.id)) return false;
      return true;
    }).length;
  }, [allDayPasses, tempFilters]);

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
    const cleared = {
      maxPrice,
      durations: [] as number[],
      treatmentsIncluded: null as boolean | null,
      refreshmentsIncluded: null as boolean | null,
      mealIncluded: null as boolean | null,
      partyTypes: [] as string[],
      facilities: [] as string[],
      spas: availableSpas.map((s) => s.id),
    };
    setTempFilters(cleared);
    setFilters(cleared);
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

  // Calculate active filter count
  const activeFilterCount =
    (filters.maxPrice < maxPrice ? 1 : 0) +
    filters.durations.length +
    (filters.treatmentsIncluded === true ? 1 : 0) +
    (filters.refreshmentsIncluded === true ? 1 : 0) +
    (filters.mealIncluded === true ? 1 : 0) +
    filters.partyTypes.length +
    filters.facilities.length +
    (filters.spas.length < availableSpas.length ? 1 : 0);

  // Pagination helpers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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

  const sortOptions = [
    { value: 'price-high-low' as SortOption, label: 'Price: High to Low' },
    { value: 'price-low-high' as SortOption, label: 'Price: Low to High' },
    { value: 'duration-shortest' as SortOption, label: 'Duration: Shortest First' },
    { value: 'duration-longest' as SortOption, label: 'Duration: Longest First' },
  ];

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || 'Sort';

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden bg-white">
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-black uppercase tracking-[0.3em] text-amber-900 shadow-sm">
                <Ticket className="h-3 w-3 mr-2" />
                Lake District Day Spa Directory
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-8xl text-stone-900 tracking-tight leading-[1.1] mb-8">
              The Day Pass <br />
              <span className="italic font-medium text-emerald-950">Collection</span>
            </h1>

            <p className="max-w-2xl mx-auto text-stone-500 text-lg md:text-xl font-light leading-relaxed mb-12 italic">
              Browse and compare luxury day spa packages from the finest hotels in the Lake
              District. All in one place, with clear pricing and inclusions.
            </p>

            <div className="h-px w-24 bg-amber-200 mx-auto" />
          </div>
        </section>

        {/* Filter Bar */}
        <div className="sticky top-0 z-20 bg-soft-cream border-y border-stone-100" ref={gridRef}>
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
                        className={sortBy === option.value ? 'bg-stone-100' : ''}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                          className={sortBy === option.value ? 'bg-stone-100' : ''}
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
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-full bg-emerald-950 text-white font-bold text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-900 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-2 text-stone-400">
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
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-full bg-emerald-950 text-white font-bold text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-900 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
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

