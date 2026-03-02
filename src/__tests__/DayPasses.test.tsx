import React from 'react';
import { vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import DayPasses from '@/components/DayPasses';
import type { Spa, DayPassOption } from '@/types/spa';

vi.mock('@/data/day-passes', () => ({
  getDayPassOptionsBySpaId: vi.fn(),
}));

import { getDayPassOptionsBySpaId } from '@/data/day-passes';
const mockGetOptions = vi.mocked(getDayPassOptionsBySpaId);

const baseSpa: Spa = {
  id: 5,
  url: 'test-day-spa',
  name: 'Test Day Spa',
  location: 'Windermere',
  websiteUrl: 'https://test.com',
  accessLabels: ['day-passes-available'],
  images: [{ src: '/img/test.jpg', alt: 'Test' }],
  keyFeatures: [],
  thermalFacilities: [],
  poolFeatures: [],
  accessPolicy: [],
  facilities: {
    sauna: false, steamRoom: false, iceRoom: false, hotTub: false,
    indoorPool: false, outdoorPool: false, coldPlunge: false,
    thermalSuite: false, infraredSauna: false,
  },
  relatedSpas: [],
};

const sampleOption: DayPassOption = {
  id: 'standard-pass',
  packageName: 'Standard Day Pass',
  priceGBP: 75,
  spaDuration: 3,
  treatmentsIncluded: false,
  refreshmentsIncluded: true,
  mealIncluded: false,
  included: ['Pool access', 'Sauna', 'Steam room'],
  description: 'A relaxing day in our facilities.',
  daysAvailable: 'Monday - Sunday',
  ageRestriction: '18+',
  bookingRequired: true,
  dayPassUrl: 'https://test.com/day-pass',
  bookingUrl: 'https://test.com/book',
  lastVerified: '2025-01-01',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('DayPasses', () => {
  it('returns null when no day pass options exist', () => {
    mockGetOptions.mockReturnValue([]);
    const { container } = render(<DayPasses spa={baseSpa} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the section with id="day-passes" when options exist', () => {
    mockGetOptions.mockReturnValue([sampleOption]);
    const { container } = render(<DayPasses spa={baseSpa} />);
    expect(container.querySelector('#day-passes')).toBeInTheDocument();
  });

  it('renders the package name', () => {
    mockGetOptions.mockReturnValue([sampleOption]);
    render(<DayPasses spa={baseSpa} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Standard Day Pass' })).toBeInTheDocument();
  });

  it('renders the price', () => {
    mockGetOptions.mockReturnValue([sampleOption]);
    render(<DayPasses spa={baseSpa} />);
    expect(screen.getByText(/75/)).toBeInTheDocument();
  });

  it('renders all included items with check icons', () => {
    mockGetOptions.mockReturnValue([sampleOption]);
    render(<DayPasses spa={baseSpa} />);
    expect(screen.getByText('Pool access')).toBeInTheDocument();
    expect(screen.getByText('Sauna')).toBeInTheDocument();
    expect(screen.getByText('Steam room')).toBeInTheDocument();
  });

  it('renders "Book Pass" link when bookingUrl is provided', () => {
    mockGetOptions.mockReturnValue([sampleOption]);
    render(<DayPasses spa={baseSpa} />);
    const bookLink = screen.getByRole('link', { name: /book pass/i });
    expect(bookLink).toBeInTheDocument();
    expect(bookLink).toHaveAttribute('data-click-intent', 'specific-product-click');
    expect(bookLink).toHaveAttribute('data-product-name', 'Standard Day Pass');
  });

  it('renders "Email Us" link when bookingEmail is present and no bookingUrl', () => {
    const emailOption: DayPassOption = {
      ...sampleOption,
      id: 'email-pass',
      bookingUrl: undefined,
      bookingEmail: 'spa@test.com',
    };
    mockGetOptions.mockReturnValue([emailOption]);
    render(<DayPasses spa={baseSpa} />);
    expect(screen.getByRole('link', { name: /email us/i })).toBeInTheDocument();
  });

  it('renders "Book Day Pass" CTA button when spa.dayPassBookingUrl is set', () => {
    mockGetOptions.mockReturnValue([sampleOption]);
    const spa = { ...baseSpa, dayPassBookingUrl: 'https://test.com/book-day' };
    render(<DayPasses spa={spa} />);
    const ctaLink = screen.getByRole('link', { name: /book day pass/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('data-click-intent', 'all-day-passes');
  });

  it('omits "Book Day Pass" CTA when spa.dayPassBookingUrl is absent', () => {
    mockGetOptions.mockReturnValue([sampleOption]);
    render(<DayPasses spa={baseSpa} />);
    expect(screen.queryByRole('link', { name: /book day pass/i })).not.toBeInTheDocument();
  });

  it('renders multiple day pass packages', () => {
    const secondOption: DayPassOption = {
      ...sampleOption,
      id: 'premium-pass',
      packageName: 'Premium Day Pass',
      priceGBP: 120,
    };
    mockGetOptions.mockReturnValue([sampleOption, secondOption]);
    render(<DayPasses spa={baseSpa} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Standard Day Pass' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Premium Day Pass' })).toBeInTheDocument();
  });
});
