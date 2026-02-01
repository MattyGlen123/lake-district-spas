import { FAQ } from '@/components/FAQs';
import { Spa } from '@/types/spa';
import { spaData } from '@/data/spas';
import { getSpa1FAQs } from './spa-1-faqs';
import { getSpa2FAQs } from './spa-2-faqs';
import { getSpa3FAQs } from './spa-3-faqs';
import { getSpa7FAQs } from './spa-7-faqs';
import { getSpa14FAQs } from './spa-14-faqs';

// Map of spa IDs to their FAQ generator functions
const faqGeneratorsBySpaId: Record<number, (spa: Spa) => FAQ[]> = {
  1: getSpa1FAQs,
  2: getSpa2FAQs,
  3: getSpa3FAQs,
  7: getSpa7FAQs,
  14: getSpa14FAQs,
};

// Cache for generated FAQs
const faqsCache: Record<number, FAQ[]> = {};

/**
 * Get FAQs for a specific spa
 * @param spaId - The ID of the spa
 * @returns Array of FAQs for the spa, or empty array if none exist
 */
export function getFAQsBySpaId(spaId: number): FAQ[] {
  // Return cached FAQs if available
  if (faqsCache[spaId]) {
    return faqsCache[spaId];
  }

  // Get the FAQ generator function
  const generator = faqGeneratorsBySpaId[spaId];
  if (!generator) {
    return [];
  }

  // Get the spa data
  const spa = spaData.find((s) => s.id === spaId);
  if (!spa) {
    return [];
  }

  // Generate FAQs and cache them
  const faqs = generator(spa);
  faqsCache[spaId] = faqs;
  return faqs;
}

/**
 * Get all FAQs across all spas
 * @returns Array of all FAQs
 */
export function getAllFAQs(): FAQ[] {
  const allFAQs: FAQ[] = [];
  
  for (const spaId of Object.keys(faqGeneratorsBySpaId).map(Number)) {
    const faqs = getFAQsBySpaId(spaId);
    allFAQs.push(...faqs);
  }
  
  return allFAQs;
}

