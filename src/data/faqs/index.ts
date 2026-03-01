import { FAQ } from '@/components/FAQs';
import { Spa } from '@/types/spa';
import { spaData } from '@/data/spas';
import { getSpa1FAQs } from './spa-1-faqs';
import { getSpa2FAQs } from './spa-2-faqs';
import { getSpa3FAQs } from './spa-3-faqs';
import { getSpa4FAQs } from './spa-4-faqs';
import { getSpa5FAQs } from './spa-5-faqs';
import { getSpa6FAQs } from './spa-6-faqs';
import { getSpa7FAQs } from './spa-7-faqs';
import { getSpa8FAQs } from './spa-8-faqs';
import { getSpa9FAQs } from './spa-9-faqs';
import { getSpa10FAQs } from './spa-10-faqs';
import { getSpa11FAQs } from './spa-11-faqs';
import { getSpa12FAQs } from './spa-12-faqs';
import { getSpa13FAQs } from './spa-13-faqs';
import { getSpa14FAQs } from './spa-14-faqs';
import { getSpa15FAQs } from './spa-15-faqs';
import { getSpa16FAQs } from './spa-16-faqs';
import { getSpa17FAQs } from './spa-17-faqs';
import { getSpa18FAQs } from './spa-18-faqs';
import { getSpa19FAQs } from './spa-19-faqs';

// Map of spa IDs to their FAQ generator functions
const faqGeneratorsBySpaId: Record<number, (spa: Spa) => FAQ[]> = {
  1: getSpa1FAQs,
  2: getSpa2FAQs,
  3: getSpa3FAQs,
  4: getSpa4FAQs,
  5: getSpa5FAQs,
  6: getSpa6FAQs, // Macdonald Old England Hotel & Spa
  7: getSpa7FAQs,
  8: getSpa8FAQs, // Ambleside Salutation Hotel & Spa
  9: getSpa9FAQs, // Lakeside Hotel & Spa
  10: getSpa10FAQs, // Beech Hill Hotel & Spa
  11: getSpa11FAQs, // Rothay Garden by Harbour Hotels
  12: getSpa12FAQs,
  13: getSpa13FAQs,
  14: getSpa14FAQs,
  15: getSpa15FAQs, // Appleby Manor Hotel & Garden Spa
  16: getSpa16FAQs, // Netherwood Hotel & Spa
  17: getSpa17FAQs, // Grange Hotel
  18: getSpa18FAQs, // Lakes Hotel & Spa
  19: getSpa19FAQs, // The Spa at Underscar
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

