'use client';

import { Filter } from 'lucide-react';

interface FilterButtonProps {
  onClick: () => void;
  activeFilterCount: number;
}

const FilterButton = ({ onClick, activeFilterCount }: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-stone-400 cursor-pointer relative"
    >
      <Filter className="h-4 w-4 mr-2" />
      <span className="text-[13px] font-black uppercase tracking-widest">
        Filters
      </span>
      {activeFilterCount > 0 && (
        <span className="ml-2 px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded-full">
          {activeFilterCount}
        </span>
      )}
    </button>
  );
};

export default FilterButton;
