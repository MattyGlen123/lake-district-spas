export type BusinessModel =
  | 'free-with-booking'
  | 'paid-extra'
  | 'day-passes'
  | 'guests-only'
  | 'hybrid';

export type AccessLabel =
  | 'free-for-all-guests'
  | 'free-for-some-rooms'
  | 'paid-for-guests'
  | 'day-passes-available'
  | 'guests-only-no-passes';

export interface ThermalFacility {
  name: string;
  details: string;
}

export interface PoolFeature {
  name: string;
  details: string;
}

export interface Spa {
  id: string;
  name: string;
  location: string;
  websiteUrl: string;
  businessModel: BusinessModel; // Kept for backward compatibility
  businessModelText: string;
  accessLabels: AccessLabel[]; // New: Multiple labels per spa
  imageSrc: string;
  imageAlt: string;
  keyFeatures: string[];
  thermalFacilities: ThermalFacility[];
  poolFeatures: PoolFeature[];
  accessPolicy: string[];
  facilities: {
    sauna: boolean;
    steamRoom: boolean;
    iceRoom: boolean;
    hotTub: boolean;
    poolOver15m: boolean;
    thermalSuite: boolean;
  };
}

export const businessModelConfig: Record<
  BusinessModel,
  {
    label: string;
    color: string;
    dot: string;
    badgeText: string;
  }
> = {
  'free-with-booking': {
    label: 'Free with booking',
    color: 'bg-spa-green',
    dot: '🟢',
    badgeText: 'SPA INCLUDED WITH ALL ROOM BOOKINGS',
  },
  'paid-extra': {
    label: 'Paid extra for guests',
    color: 'bg-spa-yellow',
    dot: '🟡',
    badgeText: 'SPA COSTS EXTRA FOR HOTEL GUESTS',
  },
  'day-passes': {
    label: 'Public day passes',
    color: 'bg-spa-blue',
    dot: '🔵',
    badgeText: 'DAY PASSES AVAILABLE TO PUBLIC',
  },
  'guests-only': {
    label: 'Hotel guests only',
    color: 'bg-spa-red',
    dot: '🔴',
    badgeText: 'EXCLUSIVE TO HOTEL GUESTS',
  },
  hybrid: {
    label: 'Hybrid model',
    color: 'bg-spa-purple',
    dot: '🟣',
    badgeText: 'HYBRID ACCESS MODEL',
  },
};

export const accessLabelConfig: Record<
  AccessLabel,
  {
    label: string;
    shortLabel: string;
    color: string;
    dot: string;
    badgeText: string;
    category: 'hotel' | 'public'; // For ordering: hotel badges first, then public
  }
> = {
  'free-for-all-guests': {
    label: 'Free for all hotel guests',
    shortLabel: 'Free for guests',
    color: 'bg-spa-green',
    dot: '🟢',
    badgeText: 'SPA INCLUDED WITH ALL ROOM BOOKINGS',
    category: 'hotel',
  },
  'free-for-some-rooms': {
    label: 'Free for some room types',
    shortLabel: 'Free for some rooms',
    color: 'bg-spa-purple',
    dot: '🟣',
    badgeText: 'SPA INCLUDED WITH SELECT ROOM TYPES',
    category: 'hotel',
  },
  'paid-for-guests': {
    label: 'Paid access for hotel guests',
    shortLabel: 'Paid for guests',
    color: 'bg-spa-yellow',
    dot: '🟡',
    badgeText: 'SPA COSTS EXTRA FOR HOTEL GUESTS',
    category: 'hotel',
  },
  'guests-only-no-passes': {
    label: 'Hotel guests only',
    shortLabel: 'Guests only',
    color: 'bg-spa-red',
    dot: '🔴',
    badgeText: 'EXCLUSIVE TO HOTEL GUESTS',
    category: 'hotel',
  },
  'day-passes-available': {
    label: 'Day passes available',
    shortLabel: 'Day passes',
    color: 'bg-spa-blue',
    dot: '🔵',
    badgeText: 'DAY PASSES AVAILABLE TO PUBLIC',
    category: 'public',
  },
};
