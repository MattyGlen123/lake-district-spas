import type { FAQ } from '@/components/FAQs';

/**
 * Generates FAQPage Schema.org JSON-LD markup for SEO
 */
export function generateFAQSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.schemaText || (typeof faq.answer === 'string' ? faq.answer : ''),
      },
    })),
  };
}
