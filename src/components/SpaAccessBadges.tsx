import { AccessLabel, accessLabelConfig } from '@/types/spa';

interface SpaAccessBadgesProps {
  accessLabels: AccessLabel[];
}

export default function SpaAccessBadges({
  accessLabels,
}: SpaAccessBadgesProps) {
  // Sort access labels: hotel badges first, then public (day passes)
  const sortedAccessLabels = [...accessLabels].sort((a, b) => {
    const aCategory = accessLabelConfig[a].category;
    const bCategory = accessLabelConfig[b].category;
    if (aCategory === 'hotel' && bCategory === 'public') return -1;
    if (aCategory === 'public' && bCategory === 'hotel') return 1;
    return 0;
  });

  const badgeColorMap: Record<string, string> = {
    'bg-spa-green': 'bg-emerald-50 text-black border border-emerald-200',
    'bg-spa-purple': 'bg-purple-50 text-black border border-purple-200',
    'bg-spa-yellow': 'bg-amber-50 text-black border border-amber-200',
    'bg-spa-red': 'bg-red-50 text-black border border-red-200',
    'bg-spa-blue': 'bg-blue-50 text-black border border-blue-200',
  };

  return (
    <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
      {sortedAccessLabels.map((label) => {
        const config = accessLabelConfig[label];
        const badgeClasses =
          badgeColorMap[config.color] ||
          'bg-white text-black border border-stone-200';

        return (
          <div
            key={label}
            className={`${badgeClasses} px-3 py-1.5 rounded-full text-xs font-semibold`}
          >
            <span>{config.shortLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

