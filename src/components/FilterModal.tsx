'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { AccessLabel, accessLabelConfig } from '@/types/spa';
import { locations, facilityOptions } from '@/data/spas';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  selectedAccessLabels: AccessLabel[];
  onAccessLabelChange: (label: AccessLabel) => void;
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
  selectedAccessLabels,
  onAccessLabelChange,
  selectedLocation,
  onLocationChange,
  selectedFacilities,
  onFacilityChange,
  onClearFilters,
  filteredCount,
}: FilterModalProps) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Apply styles to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scroll position when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
          {/* Section 1: Spa Access */}
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-900 mb-6 flex items-center">
              <span className="h-px w-6 bg-emerald-900/20 mr-3" />
              Spa Access
            </h3>
            <div className="space-y-0">
              {(
                [
                  'free-for-all-guests',
                  'free-for-some-rooms',
                  'paid-for-guests',
                  'partial-for-guests',
                  'no-day-passes-available',
                  'day-passes-available',
                ] as AccessLabel[]
              )
                .sort((a, b) => {
                  const aCategory = accessLabelConfig[a].category;
                  const bCategory = accessLabelConfig[b].category;
                  if (aCategory === 'hotel' && bCategory === 'public')
                    return -1;
                  if (aCategory === 'public' && bCategory === 'hotel') return 1;
                  return 0;
                })
                .map((label) => {
                  const config = accessLabelConfig[label];
                  const isSelected = selectedAccessLabels.includes(label);
                  return (
                    <label
                      key={label}
                      className="flex items-center justify-between py-3 cursor-pointer"
                    >
                      <span className="text-sm text-stone-700">
                        {config.label}
                      </span>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onAccessLabelChange(label)}
                      />
                    </label>
                  );
                })}
            </div>
          </section>

          {/* Section 3: Essential Facilities */}
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-900 mb-6 flex items-center">
              <span className="h-px w-6 bg-emerald-900/20 mr-3" />
              Essential Facilities
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

          {/* Section 2: Locations */}
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-900 mb-6 flex items-center">
              <span className="h-px w-6 bg-emerald-900/20 mr-3" />
              Locations
            </h3>
            <div className="space-y-0">
              {locations.map((location) => {
                const isSelected = selectedLocation === location;
                return (
                  <label
                    key={location}
                    className="flex items-center justify-between py-3 cursor-pointer"
                  >
                    <span className="text-sm text-stone-700">{location}</span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onLocationChange(location)}
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
            Reset All
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

export default FilterModal;
