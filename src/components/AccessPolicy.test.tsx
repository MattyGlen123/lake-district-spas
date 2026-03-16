import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AccessPolicy from './AccessPolicy';
import type { Spa } from '@/types/spa';

vi.mock('@/data/faqs', () => ({
  getFAQsBySpaId: vi.fn(),
}));

import { getFAQsBySpaId } from '@/data/faqs';
const mockGetFAQsBySpaId = vi.mocked(getFAQsBySpaId);

function makeSpa(overrides: Partial<Spa> = {}): Spa {
  return {
    id: 1,
    url: 'test-spa',
    name: 'Test Spa',
    location: 'Windermere',
    websiteUrl: 'https://example.com',
    accessLabels: [],
    images: [],
    keyFeatures: [],
    thermalFacilities: [],
    poolFeatures: [],
    accessPolicy: [],
    facilities: {
      sauna: false,
      steamRoom: false,
      iceRoom: false,
      hotTub: false,
      indoorPool: false,
      outdoorPool: false,
      coldPlunge: false,
      thermalSuite: false,
      infraredSauna: false,
    },
    relatedSpas: [],
    ...overrides,
  };
}

describe('AccessPolicy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetFAQsBySpaId.mockReturnValue([]);
  });

  it('returns null when accessPolicy is empty', () => {
    const spa = makeSpa({ accessPolicy: [] });
    const { container } = render(<AccessPolicy spa={spa} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the section with id="access" when policies exist', () => {
    const spa = makeSpa({
      accessPolicy: [{ name: 'Hotel Guests', details: 'Free for residents.' }],
    });
    render(<AccessPolicy spa={spa} />);
    expect(document.getElementById('access')).not.toBeNull();
  });

  it('renders the policy name for each access policy', () => {
    const spa = makeSpa({
      accessPolicy: [
        { name: 'Hotel Guests', details: 'Free for residents.' },
        { name: 'Day Pass', details: 'Purchase at reception.' },
      ],
    });
    render(<AccessPolicy spa={spa} />);
    expect(screen.getByText('Hotel Guests')).toBeDefined();
    expect(screen.getByText('Day Pass')).toBeDefined();
  });

  it('renders the policy details for each access policy', () => {
    const spa = makeSpa({
      accessPolicy: [
        { name: 'Hotel Guests', details: 'Free for residents.' },
        { name: 'Day Pass', details: 'Purchase at reception.' },
      ],
    });
    render(<AccessPolicy spa={spa} />);
    expect(screen.getByText('Free for residents.')).toBeDefined();
    expect(screen.getByText('Purchase at reception.')).toBeDefined();
  });

  it('shows the FAQ link when the spa has FAQs', () => {
    mockGetFAQsBySpaId.mockReturnValue([
      { question: 'Q?', answer: 'A.' },
    ] as ReturnType<typeof getFAQsBySpaId>);
    const spa = makeSpa({
      accessPolicy: [{ name: 'Hotel Guests', details: 'Free for residents.' }],
    });
    render(<AccessPolicy spa={spa} />);
    const faqLink = screen.getByRole('link', { name: /faqs/i });
    expect(faqLink).toBeDefined();
  });

  it('links to #faq when showing the FAQ link', () => {
    mockGetFAQsBySpaId.mockReturnValue([
      { question: 'Q?', answer: 'A.' },
    ] as ReturnType<typeof getFAQsBySpaId>);
    const spa = makeSpa({
      accessPolicy: [{ name: 'Hotel Guests', details: 'Free for residents.' }],
    });
    render(<AccessPolicy spa={spa} />);
    const faqLink = screen.getByRole('link', { name: /faqs/i });
    expect(faqLink.getAttribute('href')).toBe('#faq');
  });

  it('does not show the FAQ link when the spa has no FAQs', () => {
    mockGetFAQsBySpaId.mockReturnValue([]);
    const spa = makeSpa({
      accessPolicy: [{ name: 'Hotel Guests', details: 'Free for residents.' }],
    });
    render(<AccessPolicy spa={spa} />);
    expect(screen.queryByRole('link', { name: /faqs/i })).toBeNull();
  });

  it('passes the spa id to getFAQsBySpaId', () => {
    const spa = makeSpa({
      id: 42,
      accessPolicy: [{ name: 'Hotel Guests', details: 'Free for residents.' }],
    });
    render(<AccessPolicy spa={spa} />);
    expect(mockGetFAQsBySpaId).toHaveBeenCalledWith(42);
  });
});
