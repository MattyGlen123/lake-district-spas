import { ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface SortOption<T extends string> {
  value: T;
  label: string;
}

interface SortMenuProps<T extends string> {
  value: T;
  options: SortOption<T>[];
  onChange: (value: T) => void;
}

export default function SortMenu<T extends string>({
  value,
  options,
  onChange,
}: SortMenuProps<T>) {
  const currentSortLabel = options.find((option) => option.value === value)?.label ?? 'Sort';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 text-stone-700 text-sm font-medium hover:text-stone-900">
        <span>{currentSortLabel}</span>
        <ChevronRight className="h-4 w-4 rotate-90" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={value === option.value ? 'bg-stone-100' : ''}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
