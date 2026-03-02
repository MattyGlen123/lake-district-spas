import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import BlogCard from '@/components/BlogCard';
import type { BlogPostMeta } from '@/types/blog';

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- mock for tests
    <img src={src} alt={alt} data-testid="blog-card-image" />
  ),
}));

const basePost: BlogPostMeta = {
  slug: 'best-spas-windermere',
  title: 'Best Spas in Windermere',
  excerpt: 'Discover the finest spa experiences in Windermere.',
  publishedAt: '2025-01-15',
  author: 'Test Author',
  category: 'guides',
  tags: ['windermere', 'spa'],
  featuredImage: '/images/blog/windermere.jpg',
  featuredImageAlt: 'Windermere spa',
  readingTime: '4 min read',
};

describe('BlogCard', () => {
  it('renders a link to /blog/${slug}', () => {
    render(<BlogCard post={basePost} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/best-spas-windermere');
  });

  it('renders the post title', () => {
    render(<BlogCard post={basePost} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Best Spas in Windermere' })).toBeInTheDocument();
  });

  it('renders the post excerpt', () => {
    render(<BlogCard post={basePost} />);
    expect(screen.getByText('Discover the finest spa experiences in Windermere.')).toBeInTheDocument();
  });

  it('renders the category label for "guides"', () => {
    render(<BlogCard post={basePost} />);
    expect(screen.getByText('Guides')).toBeInTheDocument();
  });

  it('renders category labels for all category types', () => {
    const categories: BlogPostMeta['category'][] = [
      'guides', 'comparisons', 'seasonal', 'facilities', 'locations',
    ];
    const expectedLabels = ['Guides', 'Comparisons', 'Seasonal', 'Facilities', 'Locations'];
    categories.forEach((category, i) => {
      const { unmount } = render(<BlogCard post={{ ...basePost, category }} />);
      expect(screen.getByText(expectedLabels[i])).toBeInTheDocument();
      unmount();
    });
  });

  it('renders the readingTime when provided', () => {
    render(<BlogCard post={basePost} />);
    expect(screen.getByText('4 min read')).toBeInTheDocument();
  });

  it('falls back to "5 min read" when readingTime is absent', () => {
    const post = { ...basePost, readingTime: undefined };
    render(<BlogCard post={post} />);
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('renders the featured image when featuredImage is provided', () => {
    render(<BlogCard post={basePost} />);
    expect(screen.getByTestId('blog-card-image')).toBeInTheDocument();
    expect(screen.getByTestId('blog-card-image')).toHaveAttribute('alt', 'Windermere spa');
  });

  it('omits the image when featuredImage is absent', () => {
    const post = { ...basePost, featuredImage: undefined };
    render(<BlogCard post={post} />);
    expect(screen.queryByTestId('blog-card-image')).not.toBeInTheDocument();
  });

  it('renders a formatted date string', () => {
    render(<BlogCard post={basePost} />);
    // toLocaleDateString('en-GB') for 2025-01-15 → "15 January 2025"
    expect(screen.getByText('15 January 2025')).toBeInTheDocument();
  });
});
