import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import Breadcrumbs from '@/components/Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders a Home link to /', () => {
    render(<Breadcrumbs location="Windermere" spaName="Test Spa" />);
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders the spa name as plain text (not a link)', () => {
    render(<Breadcrumbs location="Windermere" spaName="Lodore Falls Spa" />);
    expect(screen.getByText('Lodore Falls Spa')).toBeInTheDocument();
    // Spa name is a <span>, not a link
    const spaNameEl = screen.getByText('Lodore Falls Spa');
    expect(spaNameEl.tagName).toBe('SPAN');
  });

  it('renders the location as a link for a known location with a page', () => {
    // 'Windermere' is a known location with a page
    render(<Breadcrumbs location="Windermere" spaName="Test Spa" />);
    const locationLink = screen.getByRole('link', { name: 'Windermere' });
    expect(locationLink).toHaveAttribute('href', '/location/spas-in-windermere');
  });

  it('renders the location as plain text when no location page exists', () => {
    // 'Unknown Town' has no dedicated location page
    render(<Breadcrumbs location="Unknown Town" spaName="Test Spa" />);
    const locationText = screen.getByText('Unknown Town');
    expect(locationText.tagName).toBe('SPAN');
    expect(screen.queryByRole('link', { name: 'Unknown Town' })).not.toBeInTheDocument();
  });

  it('renders correct path for Borrowdale location', () => {
    render(<Breadcrumbs location="Borrowdale" spaName="Test Spa" />);
    expect(screen.getByRole('link', { name: 'Borrowdale' })).toHaveAttribute(
      'href',
      '/location/spas-in-borrowdale',
    );
  });

  it('renders three items in sequence: Home, location, spa name', () => {
    render(<Breadcrumbs location="Windermere" spaName="My Spa" />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Windermere' })).toBeInTheDocument();
    expect(screen.getByText('My Spa')).toBeInTheDocument();
  });
});
