import { describe, it, expect } from 'vitest';
import React from 'react';
import { generateFAQSchema } from '@/components/FAQs';

describe('generateFAQSchema()', () => {
  it('produces a valid Schema.org FAQPage structure', () => {
    const faqs = [
      { question: 'What are the opening hours?', answer: 'Daily 9am to 9pm.' },
    ];
    const schema = generateFAQSchema(faqs);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(Array.isArray(schema.mainEntity)).toBe(true);
    expect(schema.mainEntity).toHaveLength(1);
  });

  it('maps each FAQ to a Question entity with acceptedAnswer', () => {
    const faqs = [
      { question: 'Is there parking?', answer: 'Yes, free parking.' },
    ];
    const schema = generateFAQSchema(faqs);
    const entity = schema.mainEntity[0];

    expect(entity['@type']).toBe('Question');
    expect(entity.name).toBe('Is there parking?');
    expect(entity.acceptedAnswer['@type']).toBe('Answer');
    expect(entity.acceptedAnswer.text).toBe('Yes, free parking.');
  });

  it('uses string answer text directly', () => {
    const faqs = [{ question: 'Q?', answer: 'Plain string answer.' }];
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Plain string answer.');
  });

  it('uses schemaText override when provided, ignoring the answer field', () => {
    const faqs = [
      {
        question: 'What is the age policy?',
        answer: React.createElement('p', null, 'Adults only'),
        schemaText: 'Adults only. Minimum age 18.',
      },
    ];
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Adults only. Minimum age 18.');
  });

  it('returns empty string text for a ReactNode answer without schemaText', () => {
    const faqs = [
      {
        question: 'Complex?',
        answer: React.createElement('div', null, React.createElement('p', null, 'content')),
      },
    ];
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('');
  });

  it('handles multiple FAQs and preserves order', () => {
    const faqs = Array.from({ length: 5 }, (_, i) => ({
      question: `Question ${i + 1}`,
      answer: `Answer ${i + 1}`,
    }));
    const schema = generateFAQSchema(faqs);

    expect(schema.mainEntity).toHaveLength(5);
    expect(schema.mainEntity[0].name).toBe('Question 1');
    expect(schema.mainEntity[4].name).toBe('Question 5');
  });

  it('returns empty mainEntity array for empty faq input', () => {
    const schema = generateFAQSchema([]);
    expect(schema.mainEntity).toHaveLength(0);
  });

  it('is serialisable to JSON without throwing', () => {
    const faqs = [
      { question: 'Safe?', answer: 'Yes.' },
      {
        question: 'ReactNode?',
        answer: React.createElement('span', null, 'ok'),
        schemaText: 'ok',
      },
    ];
    expect(() => JSON.stringify(generateFAQSchema(faqs))).not.toThrow();
  });
});
