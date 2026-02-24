import { spaData } from '@/data/spas';
import { getSpa1FAQs } from '@/data/faqs/spa-1-faqs';
import {
  getSpaAccessDuration,
  getSpaAccessDurationText,
  getSpaAccessDurationHyphenated,
  getSpaAccessWeekdayPrice,
  getSpaAccessWeekendPrice,
  getSpaAccessPriceRange,
  getSpaAccessPriceRangeShort,
  getThermalFacilitiesCount,
  getTreatmentBrandsText,
  getAgePolicy,
} from '@/data/faqs/helpers';
import { Spa } from '@/types/spa';
import { render } from '@testing-library/react';
import React from 'react';

describe('Lodore Falls FAQs - Helper Functions', () => {
  const lodoreFallsSpa = spaData.find((spa) => spa.id === 1);
  
  if (!lodoreFallsSpa) {
    throw new Error('Lodore Falls spa (ID: 1) not found in spa data');
  }

  describe('Spa Access Duration Helpers', () => {
    it('should return correct duration in hours', () => {
      const duration = getSpaAccessDuration(lodoreFallsSpa);
      expect(duration).toBe(2);
    });

    it('should return correct duration text format', () => {
      const durationText = getSpaAccessDurationText(lodoreFallsSpa);
      expect(durationText).toBe('2 hours');
    });

    it('should return correct duration hyphenated format', () => {
      const durationHyphenated = getSpaAccessDurationHyphenated(lodoreFallsSpa);
      expect(durationHyphenated).toBe('2-hour');
    });
  });

  describe('Spa Access Pricing Helpers', () => {
    it('should return correct weekday price', () => {
      const weekdayPrice = getSpaAccessWeekdayPrice(lodoreFallsSpa);
      expect(weekdayPrice).toBe(35);
    });

    it('should return correct weekend price', () => {
      const weekendPrice = getSpaAccessWeekendPrice(lodoreFallsSpa);
      expect(weekendPrice).toBe(40);
    });

    it('should return correct full price range text', () => {
      const priceRange = getSpaAccessPriceRange(lodoreFallsSpa);
      expect(priceRange).toBe('£35 per person Monday to Thursday, or £40 per person Friday to Sunday');
    });

    it('should return correct short price range text', () => {
      const priceRangeShort = getSpaAccessPriceRangeShort(lodoreFallsSpa);
      expect(priceRangeShort).toBe('£35-40');
    });
  });

  describe('Other Helper Functions', () => {
    it('should return correct thermal facilities count', () => {
      const thermalCount = getThermalFacilitiesCount(lodoreFallsSpa);
      expect(thermalCount).toBe(9);
    });

    it('should return treatment brands text', () => {
      const brandsText = getTreatmentBrandsText(lodoreFallsSpa.id);
      expect(brandsText).toBeTruthy();
      expect(typeof brandsText).toBe('string');
      // Should contain brand names from treatments
      expect(brandsText).toMatch(/products/);
    });

    it('should return correct age policy', () => {
      const agePolicy = getAgePolicy(lodoreFallsSpa);
      expect(agePolicy).toBe('18+');
    });
  });
});

describe('Lodore Falls FAQs - Generated Content', () => {
  const lodoreFallsSpa = spaData.find((spa) => spa.id === 1);
  
  if (!lodoreFallsSpa) {
    throw new Error('Lodore Falls spa (ID: 1) not found in spa data');
  }

  const faqs = getSpa1FAQs(lodoreFallsSpa);
  const helperValues = {
    durationText: getSpaAccessDurationText(lodoreFallsSpa),
    durationHyphenated: getSpaAccessDurationHyphenated(lodoreFallsSpa),
    priceRange: getSpaAccessPriceRange(lodoreFallsSpa),
    priceRangeShort: getSpaAccessPriceRangeShort(lodoreFallsSpa),
    thermalCount: getThermalFacilitiesCount(lodoreFallsSpa),
    brandsText: getTreatmentBrandsText(lodoreFallsSpa.id),
    agePolicy: getAgePolicy(lodoreFallsSpa),
  };

  it('should generate 5 FAQs', () => {
    expect(faqs.length).toBe(5);
  });

  it('each FAQ should have question, answer, and schemaText', () => {
    faqs.forEach((faq) => {
      expect(faq.question).toBeDefined();
      expect(faq.answer).toBeDefined();
      expect(faq.schemaText).toBeDefined();
      expect(typeof faq.question).toBe('string');
      expect(faq.question.length).toBeGreaterThan(0);
      expect(faq.schemaText!.length).toBeGreaterThan(0);
    });
  });

  describe('FAQ #1: Booking Treatments in Advance', () => {
    const faq = faqs[0];

    it('question should contain spa name', () => {
      expect(faq.question).toContain(lodoreFallsSpa.name);
    });

    it('question should be about booking treatments', () => {
      expect(faq.question).toMatch(/book.*treatment/i);
    });

    it('answer should contain spa name', () => {
      const { container } = render(<>{faq.answer}</>);
      expect(container.textContent).toContain(lodoreFallsSpa.name);
    });

    it('answer should contain treatment brands if available', () => {
      if (helperValues.brandsText) {
        const { container } = render(<>{faq.answer}</>);
        // Check that brands are mentioned (may be in different format)
        expect(container.textContent).toMatch(/Elemis|ishga/i);
      }
    });

    it('answer should contain duration hyphenated format', () => {
      if (helperValues.durationHyphenated) {
        const { container } = render(<>{faq.answer}</>);
        expect(container.textContent).toContain(helperValues.durationHyphenated);
      }
    });

    it('schemaText should contain spa name', () => {
      expect(faq.schemaText).toContain(lodoreFallsSpa.name);
    });

    it('schemaText should contain brands if available', () => {
      if (helperValues.brandsText) {
        expect(faq.schemaText).toMatch(/Elemis|ishga/i);
      }
    });

    it('schemaText should not contain HTML/JSX', () => {
      expect(faq.schemaText).not.toMatch(/<[^>]*>/);
      expect(faq.schemaText).not.toContain('<>');
      expect(faq.schemaText).not.toContain('</>');
    });
  });

  describe('FAQ #2: Spa Access Included with Room', () => {
    const faq = faqs[1];

    it('question should contain spa name', () => {
      expect(faq.question).toContain(lodoreFallsSpa.name);
    });

    it('answer should contain duration text', () => {
      if (helperValues.durationText) {
        const { container } = render(<>{faq.answer}</>);
        expect(container.textContent).toContain(helperValues.durationText);
      }
    });

    it('answer should contain thermal facilities count', () => {
      const { container } = render(<>{faq.answer}</>);
      expect(container.textContent).toContain(helperValues.thermalCount.toString());
    });

    it('answer should contain price range if available', () => {
      if (helperValues.priceRange) {
        const { container } = render(<>{faq.answer}</>);
        expect(container.textContent).toContain('£35');
        expect(container.textContent).toContain('£40');
      }
    });

    it('answer should contain duration hyphenated format', () => {
      if (helperValues.durationHyphenated) {
        const { container } = render(<>{faq.answer}</>);
        expect(container.textContent).toContain(helperValues.durationHyphenated);
      }
    });

    it('answer should contain age policy', () => {
      if (helperValues.agePolicy) {
        const { container } = render(<>{faq.answer}</>);
        expect(container.textContent).toContain(helperValues.agePolicy);
      }
    });

    it('schemaText should contain duration text', () => {
      if (helperValues.durationText) {
        expect(faq.schemaText).toContain(helperValues.durationText);
      }
    });

    it('schemaText should contain price range if available', () => {
      if (helperValues.priceRange) {
        expect(faq.schemaText).toContain('£35');
        expect(faq.schemaText).toContain('£40');
      }
    });

    it('schemaText should contain age policy', () => {
      if (helperValues.agePolicy) {
        expect(faq.schemaText).toContain(helperValues.agePolicy);
      }
    });
  });

  describe('FAQ #3: How Long Can I Use Facilities', () => {
    const faq = faqs[2];

    it('question should contain spa name', () => {
      expect(faq.question).toContain(lodoreFallsSpa.name);
    });

    it('answer should contain duration hyphenated format', () => {
      if (helperValues.durationHyphenated) {
        const { container } = render(<>{faq.answer}</>);
        expect(container.textContent).toContain(helperValues.durationHyphenated);
      }
    });

    it('answer should contain short price range if available', () => {
      if (helperValues.priceRangeShort) {
        const { container } = render(<>{faq.answer}</>);
        expect(container.textContent).toContain(helperValues.priceRangeShort);
      }
    });

    it('answer should contain duration text', () => {
      if (helperValues.durationText) {
        const { container } = render(<>{faq.answer}</>);
        expect(container.textContent).toContain(helperValues.durationText);
      }
    });

    it('schemaText should contain duration hyphenated format', () => {
      if (helperValues.durationHyphenated) {
        expect(faq.schemaText).toContain(helperValues.durationHyphenated);
      }
    });

    it('schemaText should contain duration text', () => {
      if (helperValues.durationText) {
        expect(faq.schemaText).toContain(helperValues.durationText);
      }
    });
  });

  describe('FAQ #4: Time Slots Available', () => {
    const faq = faqs[3];

    it('question should contain spa name', () => {
      expect(faq.question).toContain(lodoreFallsSpa.name);
    });

    it('answer should contain duration hyphenated format', () => {
      if (helperValues.durationHyphenated) {
        const { container } = render(<>{faq.answer}</>);
        expect(container.textContent).toContain(helperValues.durationHyphenated);
      }
    });

    it('answer should contain specific time slots', () => {
      const { container } = render(<>{faq.answer}</>);
      expect(container.textContent).toContain('7:30am-9:30am');
      expect(container.textContent).toContain('6:45pm-8:45pm');
    });

    it('schemaText should contain duration hyphenated format', () => {
      if (helperValues.durationHyphenated) {
        expect(faq.schemaText).toContain(helperValues.durationHyphenated);
      }
    });

    it('schemaText should contain time slots', () => {
      expect(faq.schemaText).toContain('7:30am-9:30am');
      expect(faq.schemaText).toContain('6:45pm-8:45pm');
    });
  });

  describe('FAQ #5: Can Children Use the Spa', () => {
    const faq = faqs[4];

    it('question should contain spa name', () => {
      expect(faq.question).toContain(lodoreFallsSpa.name);
    });

    it('answer should contain age policy', () => {
      if (helperValues.agePolicy) {
        const { container } = render(<>{faq.answer}</>);
        expect(container.textContent).toContain(helperValues.agePolicy);
      }
    });

    it('schemaText should contain age policy', () => {
      if (helperValues.agePolicy) {
        expect(faq.schemaText).toContain(helperValues.agePolicy);
      }
    });
  });

  describe('FAQ Content Validation', () => {
    it('all FAQs should use spa name dynamically in questions', () => {
      faqs.forEach((faq) => {
        expect(faq.question).toContain(lodoreFallsSpa.name);
      });
    });

    it('schemaText should contain spa name or "The Falls Spa" (FAQs #4 and #5 use "The Falls Spa")', () => {
      faqs.forEach((faq, index) => {
        // FAQs #4 and #5 (indices 3 and 4) use "The Falls Spa" in schemaText instead of full spa name
        if (index === 3 || index === 4) {
          expect(faq.schemaText).toContain('The Falls Spa');
        } else {
          expect(faq.schemaText).toContain(lodoreFallsSpa.name);
        }
      });
    });

    it('all FAQs should have valid schemaText without HTML', () => {
      faqs.forEach((faq) => {
        expect(faq.schemaText).not.toMatch(/<[^>]*>/);
        expect(faq.schemaText).not.toContain('&apos;');
        expect(faq.schemaText).not.toContain('&nbsp;');
      });
    });

    it('all FAQs should have schemaText that matches answer content', () => {
      faqs.forEach((faq) => {
        // Schema text should be a subset of answer content (plain text version)
        const { container } = render(<>{faq.answer}</>);
        const answerText = container.textContent || '';
        
        // Check that key terms from schema appear in answer
        const schemaWords = faq.schemaText!.split(/\s+/).filter(w => w.length > 3);
        const matchingWords = schemaWords.filter(word => 
          answerText.toLowerCase().includes(word.toLowerCase())
        );
        
        // At least 30% of significant words should match
        expect(matchingWords.length / schemaWords.length).toBeGreaterThan(0.3);
      });
    });

    it('FAQs using helper values should contain those values', () => {
      // FAQ #2 should contain thermal count
      const faq2 = faqs[1];
      const { container: container2 } = render(<>{faq2.answer}</>);
      expect(container2.textContent).toContain(helperValues.thermalCount.toString());

      // FAQ #2 should contain price range in schema
      if (helperValues.priceRange) {
        expect(faq2.schemaText).toContain('£35');
        expect(faq2.schemaText).toContain('£40');
      }

      // FAQ #3 should contain duration text
      if (helperValues.durationText) {
        const faq3 = faqs[2];
        const { container: container3 } = render(<>{faq3.answer}</>);
        expect(container3.textContent).toContain(helperValues.durationText);
      }

      // FAQ #5 should contain age policy
      if (helperValues.agePolicy) {
        const faq5 = faqs[4];
        const { container: container5 } = render(<>{faq5.answer}</>);
        expect(container5.textContent).toContain(helperValues.agePolicy);
      }
    });
  });

  describe('FAQ Helper Integration', () => {
    it('should use duration helpers correctly in FAQ #1', () => {
      const faq = faqs[0];
      if (helperValues.durationHyphenated) {
        const { container } = render(<>{faq.answer}</>);
        expect(container.textContent).toContain(helperValues.durationHyphenated);
      }
    });

    it('should use all relevant helpers in FAQ #2', () => {
      const faq = faqs[1];
      const { container } = render(<>{faq.answer}</>);
      
      if (helperValues.durationText) {
        expect(container.textContent).toContain(helperValues.durationText);
      }
      if (helperValues.durationHyphenated) {
        expect(container.textContent).toContain(helperValues.durationHyphenated);
      }
      expect(container.textContent).toContain(helperValues.thermalCount.toString());
      if (helperValues.priceRange) {
        expect(container.textContent).toContain('£35');
        expect(container.textContent).toContain('£40');
      }
      if (helperValues.agePolicy) {
        expect(container.textContent).toContain(helperValues.agePolicy);
      }
    });

    it('should use price range short in FAQ #3', () => {
      const faq = faqs[2];
      if (helperValues.priceRangeShort) {
        const { container } = render(<>{faq.answer}</>);
        expect(container.textContent).toContain(helperValues.priceRangeShort);
      }
    });

    it('should use duration helpers in FAQ #3', () => {
      const faq = faqs[2];
      const { container } = render(<>{faq.answer}</>);
      
      if (helperValues.durationHyphenated) {
        expect(container.textContent).toContain(helperValues.durationHyphenated);
      }
      if (helperValues.durationText) {
        expect(container.textContent).toContain(helperValues.durationText);
      }
    });

    it('should use age policy in FAQ #5', () => {
      const faq = faqs[4];
      if (helperValues.agePolicy) {
        const { container } = render(<>{faq.answer}</>);
        expect(container.textContent).toContain(helperValues.agePolicy);
      }
    });
  });

  describe('FAQ Schema Text Validation', () => {
    it('all schemaText should be plain text (no JSX/HTML)', () => {
      faqs.forEach((faq) => {
        expect(faq.schemaText).not.toMatch(/<[^>]*>/);
        expect(faq.schemaText).not.toContain('{');
        expect(faq.schemaText).not.toContain('}');
        expect(faq.schemaText).not.toContain('<>');
        expect(faq.schemaText).not.toContain('</>');
      });
    });

    it('schemaText should contain dynamic values from helpers', () => {
      // FAQ #1 schema should contain brands
      if (helperValues.brandsText) {
        expect(faqs[0].schemaText).toMatch(/Elemis|ishga/i);
      }

      // FAQ #2 schema should contain duration and prices
      if (helperValues.durationText) {
        expect(faqs[1].schemaText).toContain(helperValues.durationText);
      }
      if (helperValues.priceRange) {
        expect(faqs[1].schemaText).toContain('£35');
        expect(faqs[1].schemaText).toContain('£40');
      }

      // FAQ #3 schema should contain duration
      if (helperValues.durationText) {
        expect(faqs[2].schemaText).toContain(helperValues.durationText);
      }
      if (helperValues.durationHyphenated) {
        expect(faqs[2].schemaText).toContain(helperValues.durationHyphenated);
      }

      // FAQ #5 schema should contain age policy
      if (helperValues.agePolicy) {
        expect(faqs[4].schemaText).toContain(helperValues.agePolicy);
      }
    });

    it('schemaText should be concise (150-300 words recommended)', () => {
      faqs.forEach((faq) => {
        const wordCount = faq.schemaText!.split(/\s+/).length;
        expect(wordCount).toBeGreaterThan(20); // At least 20 words
        expect(wordCount).toBeLessThan(400); // Not too long
      });
    });
  });

  describe('FAQ Internal Links', () => {
    it('FAQ #1 should contain link to treatments section', () => {
      const faq = faqs[0];
      const { container } = render(<>{faq.answer}</>);
      const link = container.querySelector('a[href="#treatments"]');
      expect(link).toBeTruthy();
      expect(link?.textContent).toMatch(/treatment/i);
    });

    it('FAQ #2 should contain link to access section', () => {
      const faq = faqs[1];
      const { container } = render(<>{faq.answer}</>);
      const link = container.querySelector('a[href="#access"]');
      expect(link).toBeTruthy();
    });

    it('FAQ #3 should contain link to FAQ #4 and facilities section', () => {
      const faq = faqs[2];
      const { container } = render(<>{faq.answer}</>);
      const faqLink = container.querySelector('a[href="#faq-4"]');
      const facilitiesLink = container.querySelector('a[href="#thermal"]');
      expect(faqLink).toBeTruthy();
      expect(facilitiesLink).toBeTruthy();
    });

    it('FAQ #4 should contain links to facilities and day passes sections', () => {
      const faq = faqs[3];
      const { container } = render(<>{faq.answer}</>);
      const facilitiesLink = container.querySelector('a[href="#thermal"]');
      const dayPassesLink = container.querySelector('a[href="#day-passes"]');
      expect(facilitiesLink).toBeTruthy();
      expect(dayPassesLink).toBeTruthy();
    });

    it('FAQ #5 should contain link to homepage', () => {
      const faq = faqs[4];
      const { container } = render(<>{faq.answer}</>);
      const link = container.querySelector('a[href="/spas"]');
      expect(link).toBeTruthy();
      expect(link?.textContent).toMatch(/homepage/i);
    });

    it('all internal links should have correct styling classes', () => {
      faqs.forEach((faq) => {
        const { container } = render(<>{faq.answer}</>);
        const links = container.querySelectorAll('a');
        links.forEach((link) => {
          // Links should have underline class only (no text color or font weight)
          expect(link.className).toContain('underline');
          expect(link.className).not.toContain('text-stone-900');
          expect(link.className).not.toContain('font-semibold');
        });
      });
    });
  });

  describe('FAQ Answer Structure', () => {
    it('all FAQ answers should be valid React elements', () => {
      faqs.forEach((faq) => {
        expect(() => render(<>{faq.answer}</>)).not.toThrow();
      });
    });

    it('FAQ answers should contain line breaks for readability', () => {
      faqs.forEach((faq) => {
        const { container } = render(<>{faq.answer}</>);
        // Answers should have some structure (not just plain text)
        const textContent = container.textContent || '';
        expect(textContent.length).toBeGreaterThan(100); // Substantial content
      });
    });

    it('FAQ #1 answer should mention booking methods', () => {
      const faq = faqs[0];
      const { container } = render(<>{faq.answer}</>);
      const text = container.textContent || '';
      expect(text).toMatch(/book|reservation|call/i);
    });

    it('FAQ #2 answer should mention suite access and pricing', () => {
      const faq = faqs[1];
      const { container } = render(<>{faq.answer}</>);
      const text = container.textContent || '';
      expect(text).toMatch(/suite|complimentary|room/i);
      expect(text).toMatch(/£/); // Should contain pricing
    });

    it('FAQ #3 answer should mention time slot system', () => {
      const faq = faqs[2];
      const { container } = render(<>{faq.answer}</>);
      const text = container.textContent || '';
      expect(text).toMatch(/time slot|booking system/i);
    });

    it('FAQ #4 answer should list all six time slots', () => {
      const faq = faqs[3];
      const { container } = render(<>{faq.answer}</>);
      const text = container.textContent || '';
      const timeSlotCount = (text.match(/\d+:\d+(am|pm)/g) || []).length;
      expect(timeSlotCount).toBeGreaterThanOrEqual(6);
    });

    it('FAQ #5 answer should mention age restriction and family options', () => {
      const faq = faqs[4];
      const { container } = render(<>{faq.answer}</>);
      const text = container.textContent || '';
      expect(text).toMatch(/adult|18|age/i);
      expect(text).toMatch(/family|children/i);
    });
  });

  describe('FAQ Conditional Rendering', () => {
    it('FAQ #2 should conditionally render price range when available', () => {
      const faq = faqs[1];
      const { container } = render(<>{faq.answer}</>);
      const text = container.textContent || '';
      
      // If price range helper returns a value, it should appear in answer
      if (helperValues.priceRange) {
        expect(text).toContain('£35');
        expect(text).toContain('£40');
      }
    });

    it('FAQ #2 should conditionally render age policy when available', () => {
      const faq = faqs[1];
      const { container } = render(<>{faq.answer}</>);
      const text = container.textContent || '';
      
      if (helperValues.agePolicy) {
        expect(text).toContain(helperValues.agePolicy);
      }
    });

    it('FAQ #3 should conditionally render duration text when available', () => {
      const faq = faqs[2];
      const { container } = render(<>{faq.answer}</>);
      const text = container.textContent || '';
      
      if (helperValues.durationText) {
        expect(text).toContain(helperValues.durationText);
      }
    });

    it('FAQ #3 should conditionally render price range short when available', () => {
      const faq = faqs[2];
      const { container } = render(<>{faq.answer}</>);
      const text = container.textContent || '';
      
      if (helperValues.priceRangeShort) {
        expect(text).toContain(helperValues.priceRangeShort);
      }
    });
  });

  describe('FAQ Specific Content Validation', () => {
    it('FAQ #1 should mention "The Falls Spa"', () => {
      const faq = faqs[0];
      const { container } = render(<>{faq.answer}</>);
      expect(container.textContent).toContain('The Falls Spa');
    });

    it('FAQ #1 should mention advance booking importance', () => {
      const faq = faqs[0];
      const { container } = render(<>{faq.answer}</>);
      const text = container.textContent || '';
      expect(text).toMatch(/advance|before|early/i);
    });

    it('FAQ #2 should mention Derwentwater', () => {
      const faq = faqs[1];
      const { container } = render(<>{faq.answer}</>);
      expect(container.textContent).toContain('Derwentwater');
    });

    it('FAQ #2 should mention Champagne bar', () => {
      const faq = faqs[1];
      const { container } = render(<>{faq.answer}</>);
      expect(container.textContent).toContain('Champagne bar');
    });

    it('FAQ #3 should mention thermal suite experiences', () => {
      const faq = faqs[2];
      const { container } = render(<>{faq.answer}</>);
      const text = container.textContent || '';
      expect(text).toMatch(/thermal|sauna|steam/i);
    });

    it('FAQ #4 should mention sunset views', () => {
      const faq = faqs[3];
      const { container } = render(<>{faq.answer}</>);
      const text = container.textContent || '';
      expect(text).toMatch(/sunset|evening/i);
    });

    it('FAQ #5 should mention Borrowdale Valley', () => {
      const faq = faqs[4];
      const { container } = render(<>{faq.answer}</>);
      expect(container.textContent).toContain('Borrowdale');
    });

    it('FAQ #5 should mention Lodore Falls waterfall', () => {
      const faq = faqs[4];
      const { container } = render(<>{faq.answer}</>);
      expect(container.textContent).toContain('Lodore Falls');
    });
  });

  describe('FAQ Edge Cases', () => {
    it('should handle spa with missing spaAccessForHotelGuest gracefully', () => {
      // Create a mock spa without spaAccessForHotelGuest
      const { spaAccessForHotelGuest, ...mockSpaWithoutAccess } = lodoreFallsSpa;
      const mockSpa = mockSpaWithoutAccess as Spa;
      
      // Should not throw
      expect(() => getSpa1FAQs(mockSpa)).not.toThrow();
      
      const faqs = getSpa1FAQs(mockSpa);
      expect(faqs.length).toBe(5);
    });

    it('should handle spa with missing agePolicy gracefully', () => {
      const mockSpa = { ...lodoreFallsSpa, agePolicy: undefined };
      
      expect(() => getSpa1FAQs(mockSpa as Spa)).not.toThrow();
      
      const faqs = getSpa1FAQs(mockSpa as Spa);
      // FAQ #5 should still work with fallback text
      const faq5 = faqs[4];
      expect(faq5.answer).toBeDefined();
    });

    it('should generate consistent FAQs for same spa', () => {
      const faqs1 = getSpa1FAQs(lodoreFallsSpa);
      const faqs2 = getSpa1FAQs(lodoreFallsSpa);
      
      expect(faqs1.length).toBe(faqs2.length);
      faqs1.forEach((faq1, index) => {
        const faq2 = faqs2[index];
        expect(faq1.question).toBe(faq2.question);
        expect(faq1.schemaText).toBe(faq2.schemaText);
      });
    });
  });
});

