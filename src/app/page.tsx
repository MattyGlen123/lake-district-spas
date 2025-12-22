'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FilterButton from '@/components/FilterButton';
import FilterModal from '@/components/FilterModal';
import SpaGrid from '@/components/SpaGrid';
import Footer from '@/components/Footer';
import { spaData } from '@/data/spas';
import { BusinessModel, Spa } from '@/types/spa';

export default function Home() {
  const [selectedBusinessModels, setSelectedBusinessModels] = useState<
    BusinessModel[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    businessModels: [] as BusinessModel[],
    location: 'All Locations',
    facilities: [] as string[],
  });

  const handleBusinessModelChange = (model: BusinessModel) => {
    setSelectedBusinessModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
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
    setSelectedBusinessModels([]);
    setSelectedLocation('All Locations');
    setSelectedFacilities([]);
  };

  // Modal handlers
  const handleOpenModal = () => {
    // Copy current filters to temp state when opening
    setTempFilters({
      businessModels: selectedBusinessModels,
      location: selectedLocation,
      facilities: selectedFacilities,
    });
    setIsFilterModalOpen(true);
  };

  const handleCloseModal = () => {
    // Discard temp filters (reset to main filters)
    setTempFilters({
      businessModels: selectedBusinessModels,
      location: selectedLocation,
      facilities: selectedFacilities,
    });
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = () => {
    // Apply temp filters to main filters
    setSelectedBusinessModels(tempFilters.businessModels);
    setSelectedLocation(tempFilters.location);
    setSelectedFacilities(tempFilters.facilities);
    setIsFilterModalOpen(false);
  };

  // Temp filter handlers (for modal)
  const handleTempBusinessModelChange = (model: BusinessModel) => {
    setTempFilters((prev) => ({
      ...prev,
      businessModels: prev.businessModels.includes(model)
        ? prev.businessModels.filter((m) => m !== model)
        : [...prev.businessModels, model],
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
      businessModels: [],
      location: 'All Locations',
      facilities: [],
    });
  };

  const filteredSpas = useMemo(() => {
    return spaData.filter((spa: Spa) => {
      if (
        selectedBusinessModels.length > 0 &&
        !selectedBusinessModels.includes(spa.businessModel)
      ) {
        return false;
      }

      if (
        selectedLocation !== 'All Locations' &&
        spa.location !== selectedLocation
      ) {
        return false;
      }

      if (selectedFacilities.length > 0) {
        const hasFacilities = selectedFacilities.every((facility) => {
          const facilityKey = facility as keyof typeof spa.facilities;
          return spa.facilities[facilityKey];
        });
        if (!hasFacilities) {
          return false;
        }
      }

      return true;
    });
  }, [selectedBusinessModels, selectedLocation, selectedFacilities]);

  // Calculate filtered count based on temp filters (for modal display)
  const tempFilteredCount = useMemo(() => {
    return spaData.filter((spa: Spa) => {
      if (
        tempFilters.businessModels.length > 0 &&
        !tempFilters.businessModels.includes(spa.businessModel)
      ) {
        return false;
      }

      if (
        tempFilters.location !== 'All Locations' &&
        spa.location !== tempFilters.location
      ) {
        return false;
      }

      if (tempFilters.facilities.length > 0) {
        const hasFacilities = tempFilters.facilities.every((facility) => {
          const facilityKey = facility as keyof typeof spa.facilities;
          return spa.facilities[facilityKey];
        });
        if (!hasFacilities) {
          return false;
        }
      }

      return true;
    }).length;
  }, [tempFilters]);

  // Calculate active filter count
  const activeFilterCount =
    selectedBusinessModels.length +
    (selectedLocation !== 'All Locations' ? 1 : 0) +
    selectedFacilities.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Hero />

        <div className="container mx-auto px-4 py-6">
          <FilterButton
            onClick={handleOpenModal}
            activeFilterCount={activeFilterCount}
          />
        </div>

        <SpaGrid spas={filteredSpas} />

        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={handleCloseModal}
          onApply={handleApplyFilters}
          selectedBusinessModels={tempFilters.businessModels}
          onBusinessModelChange={handleTempBusinessModelChange}
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
