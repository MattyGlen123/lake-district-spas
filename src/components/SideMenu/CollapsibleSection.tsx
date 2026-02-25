import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onToggle}
        className="py-2 flex items-center justify-between w-full"
      >
        <div className="flex items-center space-x-4">
          <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-stone-400">
            {title}
          </h3>
          <div className="h-px flex-grow bg-stone-100" />
        </div>
        <span
          className={`ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-0' : '-rotate-90'
          }`}
        >
          <ChevronDown className="h-4 w-4 text-stone-400" />
        </span>
      </button>
      {isOpen && <div className="space-y-3">{children}</div>}
    </div>
  );
}
