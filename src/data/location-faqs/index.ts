import { FAQ } from '@/components/FAQs';
import { Spa } from '@/types/spa';
import { spaData } from '@/data/spas';

// Map of location names to their FAQ generator functions
// Add new locations here as FAQ files are created
const faqGeneratorsByLocation: Record<string, (spas: Spa[]) => FAQ[]> = {
  // 'Windermere': getWindermereFAQs,
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
