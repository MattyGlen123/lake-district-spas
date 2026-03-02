import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import QuickFactsBar from '@/components/QuickFactsBar';
import type { Spa } from '@/types/spa';

const baseSpa: Spa = {
  id: 1,
  url: 'test-spa',
  name: 'Test Spa',
  location: 'Windermere',
  websiteUrl: 'https://test.com',
  accessLabels: [],
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

describe('QuickFactsBar', () => {
  describe('Guest Access card', () => {
    it('shows "Free for all hotel guests" when spa has free-for-all-guests label', () => {
      const spa = { ...baseSpa, accessLabels: ['free-for-all-guests'] as Spa['accessLabels'] };
      render(<QuickFactsBar spa={spa} />);
      expect(screen.getByText('Free for all hotel guests')).toBeInTheDocument();
    });

    it('shows "Paid access for hotel guests" for paid-for-guests label', () => {
      const spa = { ...baseSpa, accessLabels: ['paid-for-guests'] as Spa['accessLabels'] };
      render(<QuickFactsBar spa={spa} />);
      expect(screen.getByText('Paid access for hotel guests')).toBeInTheDocument();
    });

    it('shows "Contact spa for details" when no hotel-category label is present', () => {
      const spa = { ...baseSpa, accessLabels: ['day-passes-available'] as Spa['accessLabels'] };
      render(<QuickFactsBar spa={spa} />);
      expect(screen.getByText('Contact spa for details')).toBeInTheDocument();
    });

    it('shows "Contact spa for details" when accessLabels is empty', () => {
      render(<QuickFactsBar spa={baseSpa} />);
      expect(screen.getByText('Contact spa for details')).toBeInTheDocument();
    });
  });

  describe('Day Passes card', () => {
    it('shows "Available to book" when day-passes-available is in accessLabels', () => {
      const spa = { ...baseSpa, accessLabels: ['day-passes-available'] as Spa['accessLabels'] };
      render(<QuickFactsBar spa={spa} />);
      expect(screen.getByText('Available to book')).toBeInTheDocument();
    });

    it('shows "Not Available" when day-passes-available is absent', () => {
      render(<QuickFactsBar spa={baseSpa} />);
      expect(screen.getByText('Not Available')).toBeInTheDocument();
    });
  });

  describe('Age Policy card', () => {
    it('renders the Age Policy card when spa.agePolicy is set', () => {
      const spa = { ...baseSpa, agePolicy: 'Adults 18+ only' };
      render(<QuickFactsBar spa={spa} />);
      expect(screen.getByText(/Age Policy/i)).toBeInTheDocument();
      expect(screen.getByText('Adults 18+ only')).toBeInTheDocument();
    });

    it('omits the Age Policy card when spa.agePolicy is absent', () => {
      render(<QuickFactsBar spa={baseSpa} />);
      expect(screen.queryByText(/Age Policy/i)).not.toBeInTheDocument();
    });

    it('splits agePolicy text on <br> tags', () => {
      const spa = { ...baseSpa, agePolicy: 'Adults 18+<br/>Children 5–15 with adult' };
      render(<QuickFactsBar spa={spa} />);
      expect(screen.getByText('Adults 18+')).toBeInTheDocument();
      expect(screen.getByText('Children 5–15 with adult')).toBeInTheDocument();
    });
  });
});
