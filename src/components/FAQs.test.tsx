import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import FAQs from '@/components/FAQs';
import type { FAQ } from '@/components/FAQs';

const singleFaq: FAQ[] = [
  { question: 'What are the opening hours?', answer: 'Daily 9am to 9pm.' },
];

const multipleFaqs: FAQ[] = [
  { question: 'Q1?', answer: 'A1.' },
  { question: 'Q2?', answer: 'A2.' },
  { question: 'Q3?', answer: 'A3.' },
];

describe('FAQs', () => {
  it('renders the title in an h2', () => {
    render(<FAQs title="Frequently Asked Questions" faqs={singleFaq} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Frequently Asked Questions' })).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<FAQs title="FAQs" subtitle="Your questions answered." faqs={singleFaq} />);
    expect(screen.getByText('Your questions answered.')).toBeInTheDocument();
  });

  it('omits subtitle when not provided', () => {
    render(<FAQs title="FAQs" faqs={singleFaq} />);
    // The only paragraph-like text is the answer; no subtitle
    expect(screen.queryByText(/your questions/i)).not.toBeInTheDocument();
  });

  it('renders each question as an h3', () => {
    render(<FAQs title="FAQs" faqs={multipleFaqs} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Q1?' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Q2?' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Q3?' })).toBeInTheDocument();
  });

  it('renders a string answer wrapped in a paragraph', () => {
    render(<FAQs title="FAQs" faqs={singleFaq} />);
    expect(screen.getByText('Daily 9am to 9pm.')).toBeInTheDocument();
  });

  it('renders a ReactNode answer directly', () => {
    const faqs: FAQ[] = [
      {
        question: 'Complex?',
        answer: <span data-testid="react-answer">React content here</span>,
      },
    ];
    render(<FAQs title="FAQs" faqs={faqs} />);
    expect(screen.getByTestId('react-answer')).toBeInTheDocument();
    expect(screen.getByText('React content here')).toBeInTheDocument();
  });

  it('sets the id attribute on the section when provided', () => {
    const { container } = render(<FAQs title="FAQs" faqs={singleFaq} id="faq-section" />);
    const section = container.querySelector('#faq-section');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });

  it('renders no FAQ items when given an empty array', () => {
    render(<FAQs title="FAQs" faqs={[]} />);
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });

  it('renders all FAQs and preserves order', () => {
    render(<FAQs title="FAQs" faqs={multipleFaqs} />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings[0]).toHaveTextContent('Q1?');
    expect(headings[1]).toHaveTextContent('Q2?');
    expect(headings[2]).toHaveTextContent('Q3?');
  });
});
