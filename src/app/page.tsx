'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FilterSection from '@/components/FilterSection';
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Hero />

        <FilterSection
          selectedBusinessModels={selectedBusinessModels}
          onBusinessModelChange={handleBusinessModelChange}
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          selectedFacilities={selectedFacilities}
          onFacilityChange={handleFacilityChange}
          onClearFilters={handleClearFilters}
          totalCount={spaData.length}
          filteredCount={filteredSpas.length}
        />

        <SpaGrid spas={filteredSpas} />
      </main>

      <Footer />
    </div>
  );
}
