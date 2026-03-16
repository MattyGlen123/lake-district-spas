import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import BookVisitCTA from '@/components/BookVisitCTA';
import type { Spa } from '@/types/spa';

const baseSpa: Spa = {
  id: 1,
  url: 'test-spa',
  name: 'Test Spa',
  location: 'Windermere',
  websiteUrl: 'https://test-spa.com',
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

describe('BookVisitCTA', () => {
  it('renders the spa name in the heading', () => {
    render(<BookVisitCTA spa={baseSpa} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Spa');
  });

  it('renders the section with id="book"', () => {
    const { container } = render(<BookVisitCTA spa={baseSpa} />);
    expect(container.querySelector('#book')).toBeInTheDocument();
  });

  it('shows "Book Stay" link when hotelBookingUrl is provided', () => {
    const spa = { ...baseSpa, hotelBookingUrl: 'https://hotel.com/book' };
    render(<BookVisitCTA spa={spa} />);
    const link = screen.getByRole('link', { name: /book stay/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('data-click-intent', 'book-stay');
    expect(link).toHaveAttribute('data-spa-id', 'test-spa');
  });

  it('shows "Book Spa Day" link when dayPassBookingUrl is provided', () => {
    const spa = { ...baseSpa, dayPassBookingUrl: 'https://spa.com/day-pass' };
    render(<BookVisitCTA spa={spa} />);
    const link = screen.getByRole('link', { name: /book spa day/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('data-click-intent', 'book-day-pass');
  });

  it('shows "Book Treatment" link when treatmentBookingUrl is provided', () => {
    const spa = { ...baseSpa, treatmentBookingUrl: 'https://spa.com/treatment' };
    render(<BookVisitCTA spa={spa} />);
    const link = screen.getByRole('link', { name: /book treatment/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('data-click-intent', 'book-treatment');
  });

  it('shows all three booking buttons when all URLs are provided', () => {
    const spa = {
      ...baseSpa,
      hotelBookingUrl: 'https://hotel.com/book',
      dayPassBookingUrl: 'https://spa.com/day-pass',
      treatmentBookingUrl: 'https://spa.com/treatment',
    };
    render(<BookVisitCTA spa={spa} />);
    expect(screen.getByRole('link', { name: /book stay/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /book spa day/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /book treatment/i })).toBeInTheDocument();
  });

  it('shows fallback "Visit the Official Website" link when no booking URLs but websiteUrl is set', () => {
    render(<BookVisitCTA spa={baseSpa} />);
    const link = screen.getByRole('link', { name: /visit the official website/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('data-click-intent', 'book-stay');
  });

  it('renders no links when no booking URLs and no websiteUrl', () => {
    const spa = { ...baseSpa, websiteUrl: '' };
    render(<BookVisitCTA spa={spa} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('booking links have target="_blank" and rel="noopener noreferrer"', () => {
    const spa = { ...baseSpa, hotelBookingUrl: 'https://hotel.com/book' };
    render(<BookVisitCTA spa={spa} />);
    const link = screen.getByRole('link', { name: /book stay/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
