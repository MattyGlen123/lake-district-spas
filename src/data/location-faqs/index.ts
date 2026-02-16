import { FAQ } from '@/components/FAQs';
import { Spa } from '@/types/spa';
import { spaData } from '@/data/spas';
import { getAmblesideFAQs } from './ambleside-faqs';
import { getApplebyInWestmorlandFAQs } from './appleby-in-westmorland-faqs';
import { getBackbarrowFAQs } from './backbarrow-faqs';
import { getBassenthwaiteFAQs } from './bassenthwaite-faqs';
import { getBorrowdaleFAQs } from './borrowdale-faqs';
import { getBownessOnWindermereFAQs } from './bowness-on-windermere-faqs';
import { getGrangeOverSandsFAQs } from './grange-over-sands-faqs';
import { getWindermereFAQs } from './windermere-faqs';

// Map of location names to their FAQ generator functions
// Add new locations here as FAQ files are created
const faqGeneratorsByLocation: Record<string, (spas: Spa[]) => FAQ[]> = {
  Ambleside: getAmblesideFAQs,
  'Appleby-in-Westmorland': getApplebyInWestmorlandFAQs,
  Backbarrow: getBackbarrowFAQs,
  Bassenthwaite: getBassenthwaiteFAQs,
  Borrowdale: getBorrowdaleFAQs,
  'Bowness-on-Windermere': getBownessOnWindermereFAQs,
  'Grange-over-Sands': getGrangeOverSandsFAQs,
  Windermere: getWindermereFAQs,
};

// Cache for generated FAQs
const locationFaqsCache: Record<string, FAQ[]> = {};

/**
 * Get FAQs for a specific location
 * @param location - The location name (key from locationPageSlugs)
 * @returns Array of FAQs for the location, or empty array if none exist
 */
export function getLocationFAQs(location: string): FAQ[] {
  // Return cached FAQs if available
  if (locationFaqsCache[location]) {
    return locationFaqsCache[location];
  }

  const generator = faqGeneratorsByLocation[location];
  if (!generator) {
    return [];
  }

  const spas = spaData.filter((s) => s.location === location);
  if (spas.length === 0) {
    return [];
  }

  const faqs = generator(spas);
  locationFaqsCache[location] = faqs;
  return faqs;
}

/**
 * Get all location FAQs across all locations
 * @returns Array of all location FAQs
 */
export function getAllLocationFAQs(): FAQ[] {
  const allFAQs: FAQ[] = [];

  for (const location of Object.keys(faqGeneratorsByLocation)) {
    const faqs = getLocationFAQs(location);
    allFAQs.push(...faqs);
  }

  return allFAQs;
}
