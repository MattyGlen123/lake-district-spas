'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FilterButton from '@/components/FilterButton';
import FilterModal from '@/components/FilterModal';
import SpaGrid from '@/components/SpaGrid';
import Footer from '@/components/Footer';
import { spaData } from '@/data/spas';
import { AccessLabel, Spa } from '@/types/spa';

export default function Home() {
  const [selectedAccessLabels, setSelectedAccessLabels] = useState<
    AccessLabel[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    accessLabels: [] as AccessLabel[],
    location: 'All Locations',
    facilities: [] as string[],
  });

  const handleAccessLabelChange = (label: AccessLabel) => {
    setSelectedAccessLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  const handleFacilityChange = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  const handleClearFilters = () => {
    setSelectedAccessLabels([]);
    setSelectedLocation('All Locations');
    setSelectedFacilities([]);
  };

  // Modal handlers
  const handleOpenModal = () => {
    // Copy current filters to temp state when opening
    setTempFilters({
      accessLabels: selectedAccessLabels,
      location: selectedLocation,
      facilities: selectedFacilities,
    });
    setIsFilterModalOpen(true);
  };

  const handleCloseModal = () => {
    // Discard temp filters (reset to main filters)
    setTempFilters({
      accessLabels: selectedAccessLabels,
      location: selectedLocation,
      facilities: selectedFacilities,
    });
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = () => {
    // Apply temp filters to main filters
    setSelectedAccessLabels(tempFilters.accessLabels);
    setSelectedLocation(tempFilters.location);
    setSelectedFacilities(tempFilters.facilities);
    setIsFilterModalOpen(false);
  };

  // Temp filter handlers (for modal)
  const handleTempAccessLabelChange = (label: AccessLabel) => {
    setTempFilters((prev) => ({
      ...prev,
      accessLabels: prev.accessLabels.includes(label)
        ? prev.accessLabels.filter((l) => l !== label)
        : [...prev.accessLabels, label],
    }));
  };

  const handleTempLocationChange = (location: string) => {
    setTempFilters((prev) => ({
      ...prev,
      location,
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

  const handleTempClearFilters = () => {
    setTempFilters({
      accessLabels: [],
      location: 'All Locations',
      facilities: [],
    });
  };

  const filteredSpas = useMemo(() => {
    return spaData.filter((spa: Spa) => {
      // Filter by access labels (OR logic - show if spa has ANY selected label)
      if (selectedAccessLabels.length > 0) {
        const hasAnyLabel = spa.accessLabels.some((label) =>
          selectedAccessLabels.includes(label)
        );
        if (!hasAnyLabel) {
          return false;
        }
      }

      if (
        selectedLocation !== 'All Locations' &&
        spa.location !== selectedLocation
      ) {
        return false;
      }

      // Filter by facilities - ALL selected facilities must be present
      // EXCEPT for pools: if both indoorPool and outdoorPool are selected, use OR logic
      // EXCEPT for ice room: if iceRoom is selected, show spas with either iceRoom OR coldPlunge
      if (selectedFacilities.length > 0) {
        const poolFilters = ['indoorPool', 'outdoorPool'];
        const selectedPools = selectedFacilities.filter((f) =>
          poolFilters.includes(f)
        );
        const hasIceRoomFilter = selectedFacilities.includes('iceRoom');
        const otherFacilities = selectedFacilities.filter(
          (f) => !poolFilters.includes(f) && f !== 'iceRoom'
        );

        // Check pools with OR logic if any are selected
        if (selectedPools.length > 0) {
          const hasAnyPool = selectedPools.some((pool) => {
            const poolKey = pool as keyof typeof spa.facilities;
            return spa.facilities[poolKey];
          });
          if (!hasAnyPool) {
            return false;
          }
        }

        // Check ice room filter with OR logic (iceRoom OR coldPlunge)
        if (hasIceRoomFilter) {
          if (!spa.facilities.iceRoom && !spa.facilities.coldPlunge) {
            return false;
          }
        }

        // Check other facilities with AND logic
        if (otherFacilities.length > 0) {
          const hasAllOtherFacilities = otherFacilities.every((facility) => {
            const facilityKey = facility as keyof typeof spa.facilities;
            return spa.facilities[facilityKey];
          });
          if (!hasAllOtherFacilities) {
            return false;
          }
        }
      }

      return true;
    });
  }, [selectedAccessLabels, selectedLocation, selectedFacilities]);

  // Calculate filtered count based on temp filters (for modal display)
  const tempFilteredCount = useMemo(() => {
    return spaData.filter((spa: Spa) => {
      // Filter by access labels (OR logic)
      if (tempFilters.accessLabels.length > 0) {
        const hasAnyLabel = spa.accessLabels.some((label) =>
          tempFilters.accessLabels.includes(label)
        );
        if (!hasAnyLabel) {
          return false;
        }
      }

      if (
        tempFilters.location !== 'All Locations' &&
        spa.location !== tempFilters.location
      ) {
        return false;
      }

      // Filter by facilities - ALL selected facilities must be present
      // EXCEPT for pools: if both indoorPool and outdoorPool are selected, use OR logic
      // EXCEPT for ice room: if iceRoom is selected, show spas with either iceRoom OR coldPlunge
      if (tempFilters.facilities.length > 0) {
        const poolFilters = ['indoorPool', 'outdoorPool'];
        const selectedPools = tempFilters.facilities.filter((f) =>
          poolFilters.includes(f)
        );
        const hasIceRoomFilter = tempFilters.facilities.includes('iceRoom');
        const otherFacilities = tempFilters.facilities.filter(
          (f) => !poolFilters.includes(f) && f !== 'iceRoom'
        );

        // Check pools with OR logic if any are selected
        if (selectedPools.length > 0) {
          const hasAnyPool = selectedPools.some((pool) => {
            const poolKey = pool as keyof typeof spa.facilities;
            return spa.facilities[poolKey];
          });
          if (!hasAnyPool) {
            return false;
          }
        }

        // Check ice room filter with OR logic (iceRoom OR coldPlunge)
        if (hasIceRoomFilter) {
          if (!spa.facilities.iceRoom && !spa.facilities.coldPlunge) {
            return false;
          }
        }

        // Check other facilities with AND logic
        if (otherFacilities.length > 0) {
          const hasAllOtherFacilities = otherFacilities.every((facility) => {
            const facilityKey = facility as keyof typeof spa.facilities;
            return spa.facilities[facilityKey];
          });
          if (!hasAllOtherFacilities) {
            return false;
          }
        }
      }

      return true;
    }).length;
  }, [tempFilters]);

  // Calculate active filter count
  const activeFilterCount =
    selectedAccessLabels.length +
    (selectedLocation !== 'All Locations' ? 1 : 0) +
    selectedFacilities.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Hero />

        <div className="sticky top-0 z-20 mx-auto bg-gray-100 border-b border-gray-300">
          <div className="mx-auto container flex justify-end px-4 py-3">
            <FilterButton
              onClick={handleOpenModal}
              activeFilterCount={activeFilterCount}
            />
          </div>
        </div>

        <SpaGrid spas={filteredSpas} />

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
