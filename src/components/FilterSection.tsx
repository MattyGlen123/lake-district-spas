'use client';

import { Check, ChevronDown } from 'lucide-react';
import { BusinessModel, businessModelConfig } from '@/types/spa';
import { locations, facilityOptions } from '@/data/spas';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FilterSectionProps {
  selectedBusinessModels: BusinessModel[];
  onBusinessModelChange: (model: BusinessModel) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  selectedFacilities: string[];
  onFacilityChange: (facility: string) => void;
  onClearFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

const FilterSection = ({
  selectedBusinessModels,
  onBusinessModelChange,
  selectedLocation,
  onLocationChange,
  selectedFacilities,
  onFacilityChange,
  onClearFilters,
  totalCount,
  filteredCount,
}: FilterSectionProps) => {
  const businessModels: BusinessModel[] = [
    'free-with-booking',
    'paid-extra',
    'day-passes',
    'guests-only',
    'hybrid',
  ];

  const getBusinessModelLabel = () => {
    if (selectedBusinessModels.length === 0) return 'All Access Types';
    if (selectedBusinessModels.length === 1) {
      return businessModelConfig[selectedBusinessModels[0]].label;
    }
    return `${selectedBusinessModels.length} selected`;
  };

  const getFacilitiesLabel = () => {
    if (selectedFacilities.length === 0) return 'Any Facilities';
    if (selectedFacilities.length === 1) {
      const facility = facilityOptions.find(
        (f) => f.key === selectedFacilities[0]
      );
      return facility?.label || 'Any Facilities';
    }
    return `${selectedFacilities.length} selected`;
  };

  return (
    <section className="bg-filter-bg py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6">
          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Spa Access Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Spa Access:
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium hover:border-primary/50 transition-colors">
                  <span className="truncate">{getBusinessModelLabel()}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-background border border-border">
                  {businessModels.map((model) => {
                    const config = businessModelConfig[model];
                    const isSelected = selectedBusinessModels.includes(model);
                    return (
                      <DropdownMenuItem
                        key={model}
                        onClick={() => onBusinessModelChange(model)}
                        className="cursor-pointer flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <span>{config.dot}</span>
                          <span>{config.label}</span>
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Location Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Location:
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium hover:border-primary/50 transition-colors">
                  <span className="truncate">{selectedLocation}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background border border-border">
                  {locations.map((location) => (
                    <DropdownMenuItem
                      key={location}
                      onClick={() => onLocationChange(location)}
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <span>{location}</span>
                      {selectedLocation === location && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Facilities Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Must have:
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium hover:border-primary/50 transition-colors">
                  <span className="truncate">{getFacilitiesLabel()}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background border border-border">
                  {facilityOptions.map((facility) => {
                    const isSelected = selectedFacilities.includes(
                      facility.key
                    );
                    return (
                      <DropdownMenuItem
                        key={facility.key}
                        onClick={() => onFacilityChange(facility.key)}
                        className="cursor-pointer flex items-center justify-between"
                      >
                        <span>{facility.label}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results Count and Clear */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-semibold text-foreground">
                {filteredCount}
              </span>{' '}
              of {totalCount} spas
            </p>
            <button
              onClick={onClearFilters}
              className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
