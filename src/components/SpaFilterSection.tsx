'use client';

import { useState, useMemo } from 'react';
import FilterButton from '@/components/FilterButton';
import FilterModal from '@/components/FilterModal';
import SpaGrid from '@/components/SpaGrid';
import { spaData } from '@/data/spas';
import { AccessLabel, Spa } from '@/types/spa';

export default function SpaFilterSection() {
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

  // Modal handlers
  const handleOpenModal = () => {
    setTempFilters({
      accessLabels: selectedAccessLabels,
      location: selectedLocation,
      facilities: selectedFacilities,
    });
    setIsFilterModalOpen(true);
  };

  const handleCloseModal = () => {
    setTempFilters({
      accessLabels: selectedAccessLabels,
      location: selectedLocation,
      facilities: selectedFacilities,
    });
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = () => {
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
      facilities: [] as string[],
    });
  };

  const filteredSpas = useMemo(() => {
    return spaData.filter((spa: Spa) => {
      if (selectedAccessLabels.length > 0) {
        const hasAnyLabel = spa.accessLabels.some((label) =>
          selectedAccessLabels.includes(label)
        );
        if (!hasAnyLabel) return false;
      }

      if (
        selectedLocation !== 'All Locations' &&
        spa.location !== selectedLocation
      ) {
        return false;
      }

      if (selectedFacilities.length > 0) {
        const poolFilters = ['indoorPool', 'outdoorPool'];
        const selectedPools = selectedFacilities.filter((f) =>
          poolFilters.includes(f)
        );
        const hasIceRoomFilter = selectedFacilities.includes('iceRoom');
        const otherFacilities = selectedFacilities.filter(
          (f) => !poolFilters.includes(f) && f !== 'iceRoom'
        );

        if (selectedPools.length > 0) {
          const hasAnyPool = selectedPools.some((pool) => {
            const poolKey = pool as keyof typeof spa.facilities;
            return spa.facilities[poolKey];
          });
          if (!hasAnyPool) return false;
        }

        if (hasIceRoomFilter) {
          if (!spa.facilities.iceRoom && !spa.facilities.coldPlunge) return false;
        }

        if (otherFacilities.length > 0) {
          const hasAllOtherFacilities = otherFacilities.every((facility) => {
            const facilityKey = facility as keyof typeof spa.facilities;
            return spa.facilities[facilityKey];
          });
          if (!hasAllOtherFacilities) return false;
        }
      }

      return true;
    });
  }, [selectedAccessLabels, selectedLocation, selectedFacilities]);

  const tempFilteredCount = useMemo(() => {
    return spaData.filter((spa: Spa) => {
      if (tempFilters.accessLabels.length > 0) {
        const hasAnyLabel = spa.accessLabels.some((label) =>
          tempFilters.accessLabels.includes(label)
        );
        if (!hasAnyLabel) return false;
      }

      if (
        tempFilters.location !== 'All Locations' &&
        spa.location !== tempFilters.location
      ) {
        return false;
      }

      if (tempFilters.facilities.length > 0) {
        const poolFilters = ['indoorPool', 'outdoorPool'];
        const selectedPools = tempFilters.facilities.filter((f) =>
          poolFilters.includes(f)
        );
        const hasIceRoomFilter = tempFilters.facilities.includes('iceRoom');
        const otherFacilities = tempFilters.facilities.filter(
          (f) => !poolFilters.includes(f) && f !== 'iceRoom'
        );

        if (selectedPools.length > 0) {
          const hasAnyPool = selectedPools.some((pool) => {
            const poolKey = pool as keyof typeof spa.facilities;
            return spa.facilities[poolKey];
          });
          if (!hasAnyPool) return false;
        }

        if (hasIceRoomFilter) {
          if (!spa.facilities.iceRoom && !spa.facilities.coldPlunge) return false;
        }

        if (otherFacilities.length > 0) {
          const hasAllOtherFacilities = otherFacilities.every((facility) => {
            const facilityKey = facility as keyof typeof spa.facilities;
            return spa.facilities[facilityKey];
          });
          if (!hasAllOtherFacilities) return false;
        }
      }

      return true;
    }).length;
  }, [tempFilters]);

  const activeFilterCount =
    selectedAccessLabels.length +
    (selectedLocation !== 'All Locations' ? 1 : 0) +
    selectedFacilities.length;

  return (
    <>
      <div className="sticky top-0 z-20 bg-soft-cream border-y border-stone-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-row items-center justify-between gap-6">
            <FilterButton
              onClick={handleOpenModal}
              activeFilterCount={activeFilterCount}
            />
            <div className="text-stone-500 text-[12px] font-bold uppercase tracking-widest whitespace-nowrap">
              Showing{' '}
              <span className="text-stone-900">{filteredSpas.length}</span>{' '}
              {filteredSpas.length === 1 ? 'spa' : 'spas'}
            </div>
          </div>
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
    </>
  );
}
