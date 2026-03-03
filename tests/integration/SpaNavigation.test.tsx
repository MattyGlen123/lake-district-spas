import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import SpaNavigation from '@/components/SpaNavigation';
import { spaData } from '@/data/spas';

// SpaNavigation uses spaData.findIndex(s => s.id === currentSpa.id) to determine
// prev/next. Using real spaData entries ensures the index lookups work correctly.

describe('SpaNavigation', () => {
  const firstSpa = spaData[0];
  const secondSpa = spaData[1];
  const lastSpa = spaData[spaData.length - 1];
  const penultimateSpa = spaData[spaData.length - 2];

  it('shows no "Previous Spa" link for the first spa', () => {
    render(<SpaNavigation currentSpa={firstSpa} />);
    expect(screen.queryByText(/previous spa/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^prev$/i)).not.toBeInTheDocument();
  });

  it('shows a "Next Spa" link for the first spa', () => {
    render(<SpaNavigation currentSpa={firstSpa} />);
    // Next text exists (hidden on mobile, shown on desktop via CSS)
    expect(screen.getByText('Next Spa')).toBeInTheDocument();
  });

  it('next link for the first spa points to the second spa', () => {
    render(<SpaNavigation currentSpa={firstSpa} />);
    const nextLink = screen.getByRole('link');
    expect(nextLink).toHaveAttribute('href', `/spa/${secondSpa.url}`);
  });

  it('shows a "Previous Spa" link for the last spa', () => {
    render(<SpaNavigation currentSpa={lastSpa} />);
    expect(screen.getByText('Previous Spa')).toBeInTheDocument();
  });

  it('shows no "Next Spa" link for the last spa', () => {
    render(<SpaNavigation currentSpa={lastSpa} />);
    expect(screen.queryByText('Next Spa')).not.toBeInTheDocument();
  });

  it('prev link for the last spa points to the penultimate spa', () => {
    render(<SpaNavigation currentSpa={lastSpa} />);
    const prevLink = screen.getByRole('link');
    expect(prevLink).toHaveAttribute('href', `/spa/${penultimateSpa.url}`);
  });

  it('shows both prev and next links for a middle spa', () => {
    render(<SpaNavigation currentSpa={secondSpa} />);
    expect(screen.getByText('Previous Spa')).toBeInTheDocument();
    expect(screen.getByText('Next Spa')).toBeInTheDocument();
  });

  it('prev link for a middle spa shows the correct spa name', () => {
    render(<SpaNavigation currentSpa={secondSpa} />);
    // The name of the first spa appears as the prev spa name
    expect(screen.getByText(firstSpa.name)).toBeInTheDocument();
  });

  it('next link for a middle spa shows the correct spa name', () => {
    render(<SpaNavigation currentSpa={secondSpa} />);
    const thirdSpa = spaData[2];
    expect(screen.getByText(thirdSpa.name)).toBeInTheDocument();
  });
});
