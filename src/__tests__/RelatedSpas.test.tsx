import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import RelatedSpas from '@/components/RelatedSpas';
import { spaData } from '@/data/spas';
import type { Spa } from '@/types/spa';

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- mock for tests
    <img alt={alt} data-testid="spa-image-mock" />
  ),
}));

// Find a spa that has at least two related spas
const spaWithRelated = spaData.find((s) => s.relatedSpas.length >= 2);
const spaWithNoRelated: Spa = {
  ...spaData[0],
  relatedSpas: [],
};

describe('RelatedSpas', () => {
  it('returns null when spa has no relatedSpas', () => {
    const { container } = render(<RelatedSpas spa={spaWithNoRelated} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders "Similar Spas to Explore" heading when related spas exist', () => {
    if (!spaWithRelated) {
      console.log('No spa with ≥2 related spas found — skipping');
      return;
    }
    render(<RelatedSpas spa={spaWithRelated} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Similar Spas to Explore' })).toBeInTheDocument();
  });

  it('renders a SpaCard for each related spa', () => {
    if (!spaWithRelated) return;
    render(<RelatedSpas spa={spaWithRelated} />);
    // Each related spa renders its name as an h3
    spaWithRelated.relatedSpas.forEach((id) => {
      const relatedSpa = spaData.find((s) => s.id === id);
      if (relatedSpa) {
        expect(screen.getByRole('heading', { level: 3, name: relatedSpa.name })).toBeInTheDocument();
      }
    });
  });

  it('renders a "View All" link to /spas', () => {
    if (!spaWithRelated) return;
    render(<RelatedSpas spa={spaWithRelated} />);
    expect(screen.getByRole('link', { name: /view all/i })).toHaveAttribute('href', '/spas');
  });

  it('renders links to individual related spa pages', () => {
    if (!spaWithRelated) return;
    render(<RelatedSpas spa={spaWithRelated} />);
    spaWithRelated.relatedSpas.forEach((id) => {
      const relatedSpa = spaData.find((s) => s.id === id);
      if (relatedSpa) {
        // The SpaCard wraps the article in a link; find it by its href
        const link = document.querySelector(`a[href="/spa/${relatedSpa.url}"]`);
        expect(link).toBeInTheDocument();
      }
    });
  });
});
