'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export type PriceBracket = 'under-75' | '75-100' | '100-150' | '150-plus';

export const PRICE_BRACKETS: { value: PriceBracket; label: string }[] = [
  { value: 'under-75', label: 'Under £75' },
  { value: '75-100', label: '£75 – £100' },
  { value: '100-150', label: '£100 – £150' },
  { value: '150-plus', label: '£150+' },
];

export const CATEGORY_GROUPS: { label: string; categories: string[] }[] = [
  { label: 'Body & Massage', categories: ['Massage Therapies', 'Body Treatments'] },
  { label: 'Facial Treatments', categories: ['Facial Treatments'] },
  { label: 'Hands & Feet', categories: ['Hands & Feet Treatments'] },
];

export const ALL_CATEGORY_GROUP_LABELS = CATEGORY_GROUPS.map((g) => g.label);

interface TreatmentFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClearFilters: () => void;
  filteredCount: number;
  // Price brackets
  selectedPriceBrackets: PriceBracket[];
  onPriceBracketChange: (bracket: PriceBracket) => void;
  // Treatment categories
  selectedCategories: string[];
  onCategoryChange: (categoryGroupLabel: string) => void;
  // Spas
  availableSpas: { id: number; name: string }[];
  selectedSpas: number[];
  onSpaChange: (spaId: number) => void;
  onSelectAllSpas: () => void;
  onDeselectAllSpas: () => void;
}

const TreatmentFilters = ({
  isOpen,
  onClose,
  onApply,
  onClearFilters,
  filteredCount,
  selectedPriceBrackets,
  onPriceBracketChange,
  selectedCategories,
  onCategoryChange,
  availableSpas,
  selectedSpas,
  onSpaChange,
  onSelectAllSpas,
  onDeselectAllSpas,
}: TreatmentFiltersProps) => {
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

  const allSpasSelected =
    availableSpas.length > 0 && selectedSpas.length === availableSpas.length;

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
          <h2 className="font-serif text-3xl text-stone-900">Refine Search</h2>
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
            <div className="space-y-0">
              {PRICE_BRACKETS.map((bracket) => {
                const isSelected = selectedPriceBrackets.includes(bracket.value);
                return (
                  <label
                    key={bracket.value}
                    className="flex items-center justify-between py-3 cursor-pointer"
                  >
                    <span className="text-sm text-stone-700">{bracket.label}</span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onPriceBracketChange(bracket.value)}
                    />
                  </label>
                );
              })}
            </div>
          </section>

          {/* Section 2: Treatment Type */}
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-900 mb-6 flex items-center">
              <span className="h-px w-6 bg-emerald-900/20 mr-3" />
              Treatment Type
            </h3>
            <div className="space-y-0">
              {CATEGORY_GROUPS.map((group) => {
                const isSelected = selectedCategories.includes(group.label);
                return (
                  <label
                    key={group.label}
                    className="flex items-center justify-between py-3 cursor-pointer"
                  >
                    <span className="text-sm text-stone-700">{group.label}</span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onCategoryChange(group.label)}
                    />
                  </label>
                );
              })}
            </div>
          </section>

          {/* Section 3: Spas */}
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

export default TreatmentFilters;
