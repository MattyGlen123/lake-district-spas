import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { getLocationPagePath } from '@/lib/locationPages';

interface LocationHeaderProps {
  location: string;
  pathname: string;
  onClose: () => void;
}

export function LocationHeader({
  location,
  pathname,
  onClose,
}: LocationHeaderProps) {
  const locationPath = getLocationPagePath(location);
  const isActive = locationPath ? pathname === locationPath : false;

  return (
    <>
      <MapPin className="h-4 w-4 text-amber-600 opacity-60" />
      {locationPath ? (
        <Link
          href={locationPath}
          onClick={onClose}
          className={`text-[11px] font-black uppercase tracking-[0.3em] ${
            isActive ? 'text-amber-700' : 'text-stone-400'
          }`}
        >
          {location}
        </Link>
      ) : (
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-400">
          {location}
        </h3>
      )}
    </>
  );
}
