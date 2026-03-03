import React from 'react';
import { vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import Treatments from '@/components/Treatments';
import type { Spa, Treatment } from '@/types/spa';

vi.mock('@/data/treatments/index', () => ({
  getTreatmentsBySpaId: vi.fn(),
}));

vi.mock('@/data/faqs', () => ({
  getFAQsBySpaId: vi.fn(),
}));

import { getTreatmentsBySpaId } from '@/data/treatments/index';
import { getFAQsBySpaId } from '@/data/faqs';
const mockGetTreatments = vi.mocked(getTreatmentsBySpaId);
const mockGetFAQs = vi.mocked(getFAQsBySpaId);

const baseSpa: Spa = {
  id: 3,
  url: 'test-treatment-spa',
  name: 'Treatment Spa',
  location: 'Grasmere',
  websiteUrl: 'https://treatment-spa.com',
  accessLabels: [],
  images: [{ src: '/img/spa.jpg', alt: 'Spa' }],
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

const massageTreatment: Treatment = {
  spaId: 3,
  name: 'Swedish Massage',
  description: 'A classic full-body massage.',
  shortDescription: 'Relaxing full-body massage using long strokes.',
  duration: '60 minutes',
  category: 'Massage Therapies',
  price: '£85',
};

const facialTreatment: Treatment = {
  spaId: 3,
  name: 'Hydrating Facial',
  description: 'Deep hydrating facial.',
  shortDescription: 'Restores moisture and radiance.',
  duration: '45 minutes',
  category: 'Facial Treatments',
  price: '£70',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockGetFAQs.mockReturnValue([]);
});

describe('Treatments', () => {
  it('returns null when spa has no treatments', () => {
    mockGetTreatments.mockReturnValue([]);
    const { container } = render(<Treatments spa={baseSpa} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the "Treatments" heading when treatments exist', () => {
    mockGetTreatments.mockReturnValue([massageTreatment]);
    render(<Treatments spa={baseSpa} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Treatments' })).toBeInTheDocument();
  });

  it('renders the section with id="treatments"', () => {
    mockGetTreatments.mockReturnValue([massageTreatment]);
    const { container } = render(<Treatments spa={baseSpa} />);
    expect(container.querySelector('#treatments')).toBeInTheDocument();
  });

  it('renders the category header as an h3', () => {
    mockGetTreatments.mockReturnValue([massageTreatment]);
    render(<Treatments spa={baseSpa} />);
    expect(screen.getByText('Massage Therapies')).toBeInTheDocument();
  });

  it('renders the treatment name as an h4', () => {
    mockGetTreatments.mockReturnValue([massageTreatment]);
    render(<Treatments spa={baseSpa} />);
    expect(screen.getByRole('heading', { level: 4, name: 'Swedish Massage' })).toBeInTheDocument();
  });

  it('renders the treatment duration', () => {
    mockGetTreatments.mockReturnValue([massageTreatment]);
    render(<Treatments spa={baseSpa} />);
    expect(screen.getByText('60 minutes')).toBeInTheDocument();
  });

  it('renders the treatment price', () => {
    mockGetTreatments.mockReturnValue([massageTreatment]);
    render(<Treatments spa={baseSpa} />);
    expect(screen.getByText('£85')).toBeInTheDocument();
  });

  it('renders treatments across multiple categories', () => {
    mockGetTreatments.mockReturnValue([massageTreatment, facialTreatment]);
    render(<Treatments spa={baseSpa} />);
    expect(screen.getByText('Massage Therapies')).toBeInTheDocument();
    expect(screen.getByText('Facial Treatments')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Swedish Massage' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Hydrating Facial' })).toBeInTheDocument();
  });

  it('expands a treatment card to show its description when clicked', () => {
    mockGetTreatments.mockReturnValue([massageTreatment]);
    render(<Treatments spa={baseSpa} />);

    // Short description is hidden initially (CSS grid-rows-[0fr])
    // The clickable card is the div with aria-expanded
    const card = screen.getByRole('heading', { level: 4, name: 'Swedish Massage' })
      .closest('[aria-expanded]')!;
    expect(card).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(card);
    expect(card).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows "Book Treatment" CTA when spa.treatmentBookingUrl is set', () => {
    mockGetTreatments.mockReturnValue([massageTreatment]);
    const spa = { ...baseSpa, treatmentBookingUrl: 'https://treatment-spa.com/book' };
    render(<Treatments spa={spa} />);
    expect(screen.getByRole('link', { name: /book treatment/i })).toBeInTheDocument();
  });

  it('includes total treatment count in intro text', () => {
    mockGetTreatments.mockReturnValue([massageTreatment, facialTreatment]);
    render(<Treatments spa={baseSpa} />);
    expect(screen.getByText(/2 luxury therapies/)).toBeInTheDocument();
  });
});
