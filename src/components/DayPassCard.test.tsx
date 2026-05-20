import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import DayPassCard from '@/components/DayPassCard';
import type { Spa, DayPassOption } from '@/types/spa';

const baseSpa: Spa = {
  id: 14,
  url: 'another-place-the-lake',
  name: 'Another Place, The Lake',
  location: 'Ullswater',
  websiteUrl: 'https://another.place/the-lake/swim-club/',
  accessLabels: ['day-passes-available'],
  images: [{ src: '/img/test.jpg', alt: 'Test' }],
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
};

const emailOnlyPass: DayPassOption = {
  id: 'email-pass',
  packageName: 'Day Membership with Treatment',
  priceGBP: 110,
  spaDuration: 14,
  treatmentsIncluded: true,
  refreshmentsIncluded: false,
  mealIncluded: false,
  included: ['Pool access'],
  description: 'Full day membership with treatment.',
  daysAvailable: 'Monday - Sunday',
  ageRestriction: '18+',
  bookingRequired: true,
  dayPassUrl: 'https://another.place/the-lake/swim-club/',
  bookingEmail: 'life@another.place',
  lastVerified: '2026-04-27',
};

describe('DayPassCard', () => {
  it('renders Email Us with normalized mailto href', () => {
    render(<DayPassCard dayPass={emailOnlyPass} spa={baseSpa} />);
    const emailLink = screen.getByRole('link', { name: /email us/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:life@another.place');
  });

  it('normalizes bookingEmail when data includes mailto: prefix', () => {
    render(
      <DayPassCard
        dayPass={{ ...emailOnlyPass, bookingEmail: 'mailto:life@another.place' }}
        spa={baseSpa}
      />
    );
    const emailLink = screen.getByRole('link', { name: /email us/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:life@another.place');
  });

  it('omits More info when dayPassUrl is absent', () => {
    render(
      <DayPassCard dayPass={{ ...emailOnlyPass, dayPassUrl: undefined }} spa={baseSpa} />
    );
    expect(screen.queryByRole('link', { name: /more info/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /email us/i })).toBeInTheDocument();
  });
});
