export type AccessLabel =
  | 'free-for-all-guests'
  | 'free-for-some-rooms'
  | 'paid-for-guests'
  | 'day-passes-available'
  | 'no-day-passes-available';

export interface ThermalFacility {
  name: string;
  details: string;
}

export interface PoolFeature {
  name: string;
  details: string;
}

export interface AccessPolicy {
  name: string;
  details: string;
  accessType?:
    | 'hotel'
    | 'general'
    | 'day-pass'
    | 'age-restriction'
    | 'spa-hours';
}

export interface SpaAccessForHotelGuest {
  /** Duration of spa access in hours (e.g., 2, 3, 4) */
  durationHours?: number;
  /** Price per person for weekday access (Monday-Thursday) */
  weekdayPriceGBP?: number;
  /** Price per person for weekend access (Friday-Sunday) */
  weekendPriceGBP?: number;
}

export type TreatmentCategory =
  | 'Massage Therapies'
  | 'Facial Treatments'
  | 'Body Treatments'
  | 'Hands & Feet Treatments';

export interface Treatment {
  spaId: number;
  name: string;
  description: string;
  shortDescription: string;
  duration: string;
  brand?: string;
  category: TreatmentCategory;
  price?: string;
  bookingUrl?: string;
}

export interface SpaAddress {
  street: string;
  locality: string;
  region: string;
  postcode: string;
  country: string;
}

export interface SpaImage {
  src: string;
  alt: string;
}

export interface Spa {
  id: number;
  url: string;
  name: string;
  location: string;
  address?: SpaAddress;
  metaDescription?: string;
  intro?: string;
  websiteUrl: string;
  accessLabels: AccessLabel[];
  images: SpaImage[];
  keyFeatures: string[];
  thermalFacilities: ThermalFacility[];
  poolFeatures: PoolFeature[];
  accessPolicy: AccessPolicy[];
  facilities: {
    sauna: boolean;
    steamRoom: boolean;
    iceRoom: boolean;
    hotTub: boolean;
    indoorPool: boolean;
    outdoorPool: boolean;
    coldPlunge: boolean;
    thermalSuite: boolean;
    infraredSauna: boolean;
  };
  agePolicy?: string;
  relatedSpas: number[];
  treatmentBookingUrl?: string;
  treatmentBookingPhone?: string;
  spaAccessForHotelGuest?: SpaAccessForHotelGuest;
}

/**
 * Day Pass Option - Available spa day experiences for non-residents
 */
export interface DayPassOption {
  /** Unique identifier for this day pass option */
  id: string;

  /** Package name as shown on spa website */
  packageName: string;

  /** Total price in GBP (for packages booked as a group, this is the total; for individual bookings, this is per person) */
  priceGBP: number;

  /** Price per person in GBP (optional - only used when priceGBP is a group total) */
  pricePerPerson?: number;

  /** Duration of spa facility access in hours (e.g., 2, 3, 4) */
  spaDuration: number;

  /** Optional text indicating group size requirements (e.g., "Requires 2 People", "Group of 2–4 Guests") */
  requiredNumbers?: string;

  /** Whether treatments are included in the package */
  treatmentsIncluded: boolean;

  /** Whether refreshments (food/drinks) are included in the package */
  refreshmentsIncluded: boolean;

  /** Whether a meal (lunch, afternoon tea, etc.) is included in the package */
  mealIncluded: boolean;

  /** Array of what's included in the package */
  included: string[];

  /** Single sentence description that sells the experience */
  description: string;

  /** Days this package is available (e.g., "Monday - Sunday", "Weekdays only") */
  daysAvailable: string;

  /** Age restriction (e.g., "18+", "16+ only") */
  ageRestriction: string;

  /** Whether advance booking is required */
  bookingRequired: boolean;

  /** Phone number for bookings */
  phoneBooking?: string;

  /** URL to the day pass information page */
  dayPassUrl: string;

  /** URL to the booking/purchase page */
  bookingUrl?: string;

  /** Email address for bookings */
  bookingEmail ?: string;

  /** Optional URL to purchase gift vouchers for this package */
  voucherUrl?: string;

  /** Date this information was last verified (ISO format YYYY-MM-DD) */
  lastVerified: string;
}

/**
 * Day Passes by Spa - Collection of all day pass options for a specific spa
 */
export interface SpaDayPasses {
  /** Reference to the spa ID from spas.ts */
  spaId: number;

  /** Array of available day pass options */
  options: DayPassOption[];
}

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
    shortLabel: 'Free for hotel guests',
    color: 'bg-spa-green',
    dot: '🟢',
    badgeText: 'SPA INCLUDED WITH ALL ROOM BOOKINGS',
    category: 'hotel',
  },
  'free-for-some-rooms': {
    label: 'Free for some room types',
    shortLabel: 'Free for some room types',
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
  'no-day-passes-available': {
    label: 'No day passes available',
    shortLabel: 'No day passes',
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
