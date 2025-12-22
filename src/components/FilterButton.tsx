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
      className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:border-primary/50 transition-colors"
    >
      <Filter className="w-4 h-4" />
      <span>Filters</span>
      {activeFilterCount > 0 && (
        <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
          {activeFilterCount}
        </span>
      )}
    </button>
  );
};

export default FilterButton;
