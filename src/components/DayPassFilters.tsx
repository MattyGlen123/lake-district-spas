'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { facilityOptions } from '@/data/spas';
import { DayPassWithSpa } from '@/data/day-passes';

interface DayPassFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClearFilters: () => void;
  filteredCount: number;
  // Price filter
  maxPrice: number;
  selectedMaxPrice: number;
  onMaxPriceChange: (price: number) => void;
  // Duration filter
  availableDurations: number[];
  selectedDurations: number[];
  onDurationChange: (duration: number) => void;
  // Inclusions filter
  selectedTreatmentsIncluded: boolean | null;
  onTreatmentsIncludedChange: (value: boolean | null) => void;
  selectedRefreshmentsIncluded: boolean | null;
  onRefreshmentsIncludedChange: (value: boolean | null) => void;
  selectedMealIncluded: boolean | null;
  onMealIncludedChange: (value: boolean | null) => void;
  // Party type filter
  selectedPartyTypes: string[];
  onPartyTypeChange: (type: string) => void;
  // Facilities filter
  selectedFacilities: string[];
  onFacilityChange: (facility: string) => void;
  // Spas filter
  availableSpas: { id: number; name: string }[];
  selectedSpas: number[];
  onSpaChange: (spaId: number) => void;
  onSelectAllSpas: () => void;
  onDeselectAllSpas: () => void;
}

const DayPassFilters = ({
  isOpen,
  onClose,
  onApply,
  onClearFilters,
  filteredCount,
  maxPrice,
  selectedMaxPrice,
  onMaxPriceChange,
  availableDurations,
  selectedDurations,
  onDurationChange,
  selectedTreatmentsIncluded,
  onTreatmentsIncludedChange,
  selectedRefreshmentsIncluded,
  onRefreshmentsIncludedChange,
  selectedMealIncluded,
  onMealIncludedChange,
  selectedPartyTypes,
  onPartyTypeChange,
  selectedFacilities,
  onFacilityChange,
  availableSpas,
  selectedSpas,
  onSpaChange,
  onSelectAllSpas,
  onDeselectAllSpas,
}: DayPassFiltersProps) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allSpasSelected = availableSpas.length > 0 && selectedSpas.length === availableSpas.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full h-full md:h-auto md:max-w-2xl bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:max-h-[90vh]">
        {/* Modal Header */}
        <div className="pl-8 pr-4 py-6 border-b border-stone-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="font-serif text-3xl text-stone-900">
              Refine Search
            </h2>
          </div>
          <button onClick={onClose} className="p-3 rounded-full text-stone-400">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-grow overflow-y-auto px-8 py-10 space-y-12">
          {/* Section 1: Price */}
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-900 mb-6 flex items-center">
              <span className="h-px w-6 bg-emerald-900/20 mr-3" />
              Price
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-stone-700 mb-2 block">
                  Up to £{selectedMaxPrice}
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="50"
                  value={selectedMaxPrice}
                  onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-950"
                />
                <div className="flex justify-between text-xs text-stone-500 mt-1">
                  <span>£0</span>
                  <span>£{maxPrice}+</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Duration */}
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-900 mb-6 flex items-center">
              <span className="h-px w-6 bg-emerald-900/20 mr-3" />
              Duration
            </h3>
            <div className="space-y-0">
              {availableDurations.map((duration) => {
                const isSelected = selectedDurations.includes(duration);
                return (
                  <label
                    key={duration}
                    className="flex items-center justify-between py-3 cursor-pointer"
                  >
                    <span className="text-sm text-stone-700">
                      {duration} {duration === 1 ? 'hour' : 'hours'}
                    </span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onDurationChange(duration)}
                    />
                  </label>
                );
              })}
            </div>
          </section>

          {/* Section 3: Inclusions */}
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-900 mb-6 flex items-center">
              <span className="h-px w-6 bg-emerald-900/20 mr-3" />
              Inclusions
            </h3>
            <div className="space-y-0">
              <label className="flex items-center justify-between py-3 cursor-pointer">
                <span className="text-sm text-stone-700">Treatments Included</span>
                <Checkbox
                  checked={selectedTreatmentsIncluded === true}
                  onCheckedChange={(checked) =>
                    onTreatmentsIncludedChange(checked ? true : null)
                  }
                />
              </label>
              <label className="flex items-center justify-between py-3 cursor-pointer">
                <span className="text-sm text-stone-700">Refreshments Included</span>
                <Checkbox
                  checked={selectedRefreshmentsIncluded === true}
                  onCheckedChange={(checked) =>
                    onRefreshmentsIncludedChange(checked ? true : null)
                  }
                />
              </label>
              <label className="flex items-center justify-between py-3 cursor-pointer">
                <span className="text-sm text-stone-700">Meal Included</span>
                <Checkbox
                  checked={selectedMealIncluded === true}
                  onCheckedChange={(checked) =>
                    onMealIncludedChange(checked ? true : null)
                  }
                />
              </label>
            </div>
          </section>

          {/* Section 4: Party Type */}
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-900 mb-6 flex items-center">
              <span className="h-px w-6 bg-emerald-900/20 mr-3" />
              Party Type
            </h3>
            <div className="space-y-0">
              {['Single', 'Couples', 'Groups'].map((type) => {
                const isSelected = selectedPartyTypes.includes(type);
                return (
                  <label
                    key={type}
                    className="flex items-center justify-between py-3 cursor-pointer"
                  >
                    <span className="text-sm text-stone-700">{type}</span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onPartyTypeChange(type)}
                    />
                  </label>
                );
              })}
            </div>
          </section>

          {/* Section 5: Spa Facilities */}
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-900 mb-6 flex items-center">
              <span className="h-px w-6 bg-emerald-900/20 mr-3" />
              Spa Facilities
            </h3>
            <div className="space-y-0">
              {facilityOptions.map((facility) => {
                const isSelected = selectedFacilities.includes(facility.key);
                return (
                  <label
                    key={facility.key}
                    className="flex items-center justify-between py-3 cursor-pointer"
                  >
                    <span className="text-sm text-stone-700">
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
          </section>

          {/* Section 6: Spas */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-900 flex items-center">
                <span className="h-px w-6 bg-emerald-900/20 mr-3" />
                Spas
              </h3>
              <button
                onClick={allSpasSelected ? onDeselectAllSpas : onSelectAllSpas}
                className="text-[10px] font-black uppercase tracking-widest text-emerald-900 hover:text-emerald-700"
              >
                {allSpasSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="space-y-0">
              {availableSpas.map((spa) => {
                const isSelected = selectedSpas.includes(spa.id);
                return (
                  <label
                    key={spa.id}
                    className="flex items-center justify-between py-3 cursor-pointer"
                  >
                    <span className="text-sm text-stone-700">{spa.name}</span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSpaChange(spa.id)}
                    />
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-8 border-t border-stone-100 flex items-center justify-between bg-stone-50/50 mt-auto">
          <button
            onClick={onClearFilters}
            className="text-[10px] font-black uppercase tracking-widest text-stone-400"
          >
            Clear Filters
          </button>
          <button
            onClick={onApply}
            className="px-10 py-4 bg-emerald-950 text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-950/20"
          >
            Show {filteredCount} {filteredCount === 1 ? 'result' : 'results'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayPassFilters;

