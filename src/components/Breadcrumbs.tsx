import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getLocationPagePath } from '@/lib/locationPages';

interface BreadcrumbsProps {
  location: string;
  spaName: string;
}

export default function Breadcrumbs({ location, spaName }: BreadcrumbsProps) {
  const locationPath = getLocationPagePath(location);

  return (
    <nav className="container mx-auto px-4 lg:px-8 py-4 md:py-6 text-sm flex items-center text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <Link href="/">
        Home
      </Link>
      <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
      {locationPath ? (
        <Link href={locationPath}>
          {location}
        </Link>
      ) : (
        <span>{location}</span>
      )}
      <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
      <span className="text-slate-900 font-medium truncate">{spaName}</span>
    </nav>
  );
}
