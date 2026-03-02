import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import SpaCard from '@/components/SpaCard';
import type { Spa } from '@/types/spa';

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- mock for tests
    <img src={src} alt={alt} data-testid="spa-card-image" />
  ),
}));

const baseSpa: Spa = {
  id: 1,
  url: 'lodore-falls-spa',
  name: 'Lodore Falls Hotel & Spa',
  location: 'Borrowdale',
  websiteUrl: 'https://lodore.com',
  accessLabels: ['free-for-all-guests'],
  images: [{ src: '/images/lodore.jpg', alt: 'Lodore Falls' }],
  keyFeatures: ['Indoor pool', 'Thermal suite', 'Restaurant'],
  thermalFacilities: [],
  poolFeatures: [],
  accessPolicy: [],
  facilities: {
    sauna: true, steamRoom: true, iceRoom: false, hotTub: true,
    indoorPool: true, outdoorPool: false, coldPlunge: false,
    thermalSuite: true, infraredSauna: false,
  },
  relatedSpas: [],
};

describe('SpaCard', () => {
  it('renders a link to /spa/${spa.url}', () => {
    render(<SpaCard spa={baseSpa} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/spa/lodore-falls-spa');
  });

  it('renders the spa name in an h3', () => {
    render(<SpaCard spa={baseSpa} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Lodore Falls Hotel & Spa' })).toBeInTheDocument();
  });

  it('renders the spa location', () => {
    render(<SpaCard spa={baseSpa} />);
    expect(screen.getByText('Borrowdale')).toBeInTheDocument();
  });

  it('renders the spa image', () => {
    render(<SpaCard spa={baseSpa} />);
    expect(screen.getByTestId('spa-card-image')).toHaveAttribute('alt', 'Lodore Falls');
  });

  it('renders day pass price when lowestDayPassPrice is provided', () => {
    render(<SpaCard spa={baseSpa} lowestDayPassPrice={85} />);
    expect(screen.getByText(/£85/)).toBeInTheDocument();
  });

  it('omits day pass price when lowestDayPassPrice is null', () => {
    render(<SpaCard spa={baseSpa} lowestDayPassPrice={null} />);
    expect(screen.queryByText(/Day Passes From/i)).not.toBeInTheDocument();
  });

  it('omits day pass price when lowestDayPassPrice is undefined', () => {
    render(<SpaCard spa={baseSpa} />);
    expect(screen.queryByText(/Day Passes From/i)).not.toBeInTheDocument();
  });

  it('renders treatment price when lowestTreatmentPrice is provided', () => {
    render(<SpaCard spa={baseSpa} lowestTreatmentPrice={55} />);
    expect(screen.getByText(/£55/)).toBeInTheDocument();
  });

  it('omits treatment price when lowestTreatmentPrice is null', () => {
    render(<SpaCard spa={baseSpa} lowestTreatmentPrice={null} />);
    expect(screen.queryByText(/Treatments From/i)).not.toBeInTheDocument();
  });

  it('renders up to 3 key features', () => {
    const spa = { ...baseSpa, keyFeatures: ['Feature A', 'Feature B', 'Feature C', 'Feature D'] };
    render(<SpaCard spa={spa} />);
    expect(screen.getByText('Feature A')).toBeInTheDocument();
    expect(screen.getByText('Feature B')).toBeInTheDocument();
    expect(screen.getByText('Feature C')).toBeInTheDocument();
    expect(screen.queryByText('Feature D')).not.toBeInTheDocument();
  });

  it('renders "Image not available" fallback when images array is empty', () => {
    const spa = { ...baseSpa, images: [] };
    render(<SpaCard spa={spa} />);
    expect(screen.getByText('Image not available')).toBeInTheDocument();
  });

  it('renders access badges from accessLabels', () => {
    render(<SpaCard spa={baseSpa} />);
    // SpaAccessBadges renders shortLabel for free-for-all-guests
    expect(screen.getByText('Free for hotel guests')).toBeInTheDocument();
  });
});
