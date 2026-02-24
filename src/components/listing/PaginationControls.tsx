import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageToken } from '@/lib/listing/pageTokens';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageTokens: PageToken[];
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  previousNextClassName?: string;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  pageTokens,
  onPageChange,
  onPreviousPage,
  onNextPage,
  previousNextClassName,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const navButtonClassName =
    previousNextClassName ??
    'px-4 py-2 rounded-full bg-emerald-950 text-white font-bold text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={navButtonClassName}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pageTokens.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-stone-400">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-colors ${
              currentPage === page
                ? 'bg-emerald-950 text-white underline'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={navButtonClassName}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
