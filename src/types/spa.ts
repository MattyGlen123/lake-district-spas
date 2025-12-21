export type BusinessModel =
  | 'free-with-booking'
  | 'paid-extra'
  | 'day-passes'
  | 'guests-only'
  | 'hybrid';

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
  businessModel: BusinessModel;
  businessModelText: string;
  imageSrc: string;
  imageAlt: string;
  keyFeatures: string[];
  thermalFacilities: ThermalFacility[];
  poolFeatures: PoolFeature[];
  accessPolicy: string[];
  goodToKnow: string[];
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
