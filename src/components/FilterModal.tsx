'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { BusinessModel, businessModelConfig } from '@/types/spa';
import { locations, facilityOptions } from '@/data/spas';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  selectedBusinessModels: BusinessModel[];
  onBusinessModelChange: (model: BusinessModel) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  selectedFacilities: string[];
  onFacilityChange: (facility: string) => void;
  onClearFilters: () => void;
  filteredCount: number;
}

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  selectedBusinessModels,
  onBusinessModelChange,
  selectedLocation,
  onLocationChange,
  selectedFacilities,
  onFacilityChange,
  onClearFilters,
  filteredCount,
}: FilterModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full md:h-auto md:max-w-[550px] md:max-h-[90vh] p-0 flex flex-col bg-background text-foreground rounded-none md:rounded-xl">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="text-xl">Filters</DialogTitle>
        </DialogHeader>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Section 1: Spa Access */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">
              Spa Access
            </h3>
            <div className="space-y-0">
              {(
                [
                  'free-with-booking',
                  'paid-extra',
                  'day-passes',
                  'guests-only',
                  'hybrid',
                ] as BusinessModel[]
              ).map((model) => {
                const config = businessModelConfig[model];
                const isSelected = selectedBusinessModels.includes(model);
                return (
                  <label
                    key={model}
                    className="flex items-center justify-between py-3 cursor-pointer"
                  >
                    <span className="text-sm text-foreground flex items-center gap-2 flex-1">
                      <span>{config.dot}</span>
                      <span className="text-foreground">{config.label}</span>
                    </span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onBusinessModelChange(model)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 2: Location */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">
              Location
            </h3>
            <div className="space-y-0">
              {locations.map((location) => {
                const isSelected = selectedLocation === location;
                return (
                  <label
                    key={location}
                    className="flex items-center justify-between py-3 cursor-pointer"
                  >
                    <span className="text-sm text-foreground flex-1">
                      {location}
                    </span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => {
                        // Single-select behavior: when selecting a location, uncheck all others
                        onLocationChange(location);
                      }}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 3: Facilities */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">
              Must Have
            </h3>
            <div className="space-y-0">
              {facilityOptions.map((facility) => {
                const isSelected = selectedFacilities.includes(facility.key);
                return (
                  <label
                    key={facility.key}
                    className="flex items-center justify-between py-3 cursor-pointer"
                  >
                    <span className="text-sm text-foreground flex-1">
                      {facility.label}
                    </span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onFacilityChange(facility.key)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-border flex-row justify-between gap-4">
          {/* Button 1: Clear all */}
          <button
            onClick={onClearFilters}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>

          {/* Button 2: Show X results */}
          <button
            onClick={onApply}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {filteredCount === 0
              ? 'No results available'
              : `Show ${filteredCount} results`}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
