import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Spa } from '@/types/spa';
import { spaData } from '@/data/spas';

interface SpaNavigationProps {
  currentSpa: Spa;
}

export default function SpaNavigation({ currentSpa }: SpaNavigationProps) {
  const currentIndex = spaData.findIndex((s) => s.id === currentSpa.id);
  const prevSpa = currentIndex > 0 ? spaData[currentIndex - 1] : undefined;
  const nextSpa =
    currentIndex < spaData.length - 1 ? spaData[currentIndex + 1] : undefined;

  return (
    <section className="bg-slate-50 border-y border-slate-200 py-8 sm:py-16 mb-20">
      <div className="max-w-4xl mx-auto px-4 flex flex-row items-stretch justify-between gap-2 sm:gap-6">
        {prevSpa ? (
          <Link
            href={`/spa/${prevSpa.id}`}
            className="flex-1 flex items-center text-left min-w-0 group py-1"
          >
            <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-600 group-hover:text-blue-600 transition-all mr-2 sm:mr-4 flex-shrink-0">
              <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                <span className="hidden sm:inline">Previous Spa</span>
                <span className="sm:hidden">Prev</span>
              </p>
              <p className="text-xs sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                {prevSpa.name}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        <div className="w-[1px] bg-slate-100 self-stretch my-2" />

        {nextSpa ? (
          <Link
            href={`/spa/${nextSpa.id}`}
            className="flex-1 flex items-center text-right justify-end min-w-0 group py-1"
          >
            <div className="flex-1 min-w-0 text-right">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                <span className="hidden sm:inline">Next Spa</span>
                <span className="sm:hidden">Next</span>
              </p>
              <p className="text-xs sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                {nextSpa.name}
              </p>
            </div>
            <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-600 group-hover:text-blue-600 transition-all ml-2 sm:ml-4 flex-shrink-0">
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </section>
  );
}
