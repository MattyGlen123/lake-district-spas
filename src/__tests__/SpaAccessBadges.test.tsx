import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import SpaAccessBadges from '@/components/SpaAccessBadges';
import type { AccessLabel } from '@/types/spa';

describe('SpaAccessBadges', () => {
  it('renders no badges when accessLabels is empty', () => {
    const { container } = render(<SpaAccessBadges accessLabels={[]} />);
    // The outer div is rendered but has no badge children
    expect(container.querySelectorAll('.rounded-full')).toHaveLength(0);
  });

  it('renders shortLabel for day-passes-available', () => {
    render(<SpaAccessBadges accessLabels={['day-passes-available']} />);
    expect(screen.getByText('Day passes')).toBeInTheDocument();
  });

  it('renders shortLabel for free-for-all-guests', () => {
    render(<SpaAccessBadges accessLabels={['free-for-all-guests']} />);
    expect(screen.getByText('Free for hotel guests')).toBeInTheDocument();
  });

  it('renders shortLabel for paid-for-guests', () => {
    render(<SpaAccessBadges accessLabels={['paid-for-guests']} />);
    expect(screen.getByText('Paid for guests')).toBeInTheDocument();
  });

  it('renders shortLabel for no-day-passes-available', () => {
    render(<SpaAccessBadges accessLabels={['no-day-passes-available']} />);
    expect(screen.getByText('No day passes')).toBeInTheDocument();
  });

  it('renders multiple badges for multiple labels', () => {
    const labels: AccessLabel[] = ['free-for-all-guests', 'day-passes-available'];
    render(<SpaAccessBadges accessLabels={labels} />);
    expect(screen.getByText('Free for hotel guests')).toBeInTheDocument();
    expect(screen.getByText('Day passes')).toBeInTheDocument();
  });

  it('renders hotel badges before public badges (sorted order)', () => {
    const labels: AccessLabel[] = ['day-passes-available', 'free-for-all-guests'];
    render(<SpaAccessBadges accessLabels={labels} />);
    const badges = screen.getAllByText(/free for hotel guests|day passes/i);
    // Hotel badge ('Free for hotel guests') should come before public ('Day passes')
    expect(badges[0]).toHaveTextContent('Free for hotel guests');
    expect(badges[1]).toHaveTextContent('Day passes');
  });
});
