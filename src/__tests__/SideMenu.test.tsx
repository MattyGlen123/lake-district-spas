import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SideMenu from '@/components/SideMenu';
import { spaData } from '@/data/spas';

const mockPathname = jest.fn(() => '/');
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

describe('SideMenu', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname.mockReturnValue('/');
  });

  describe('visibility', () => {
    it('renders when isOpen is true', () => {
      render(<SideMenu {...defaultProps} isOpen={true} />);
      expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument();
      expect(screen.getByText('Collection')).toBeInTheDocument();
    });

    it('renders drawer and backdrop when open (structure present in DOM)', () => {
      render(<SideMenu {...defaultProps} isOpen={true} />);
      expect(screen.getByText('Collection')).toBeInTheDocument();
      expect(screen.getByText('Pages')).toBeInTheDocument();
    });
  });

  describe('Collection section', () => {
    it('renders Collection section with all links by default', () => {
      render(<SideMenu {...defaultProps} />);
      expect(screen.getByRole('link', { name: 'Spas' })).toHaveAttribute(
        'href',
        '/spas'
      );
      expect(screen.getByRole('link', { name: 'Treatments' })).toHaveAttribute(
        'href',
        '/spa-treatments'
      );
      expect(screen.getByRole('link', { name: 'Day Passes' })).toHaveAttribute(
        'href',
        '/spa-days'
      );
      expect(screen.getByRole('link', { name: 'Locations' })).toHaveAttribute(
        'href',
        '/locations'
      );
    });

    it('collapses Collection section when header is clicked', () => {
      render(<SideMenu {...defaultProps} />);
      expect(screen.getByRole('link', { name: 'Spas' })).toBeInTheDocument();

      const collectionButton = screen.getByRole('button', {
        name: /collection/i,
      });
      fireEvent.click(collectionButton);

      expect(screen.queryByRole('link', { name: 'Spas' })).not.toBeInTheDocument();
    });

    it('re-expands Collection section when header is clicked again', () => {
      render(<SideMenu {...defaultProps} />);
      const collectionButton = screen.getByRole('button', {
        name: /collection/i,
      });

      fireEvent.click(collectionButton);
      expect(screen.queryByRole('link', { name: 'Spas' })).not.toBeInTheDocument();

      fireEvent.click(collectionButton);
      expect(screen.getByRole('link', { name: 'Spas' })).toBeInTheDocument();
    });
  });

  describe('Pages section', () => {
    it('renders Pages section with all links by default', () => {
      render(<SideMenu {...defaultProps} />);
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(
        screen.getByRole('link', { name: 'Couples Spa Guide' })
      ).toHaveAttribute('href', '/couples-spa-lake-district');
      expect(screen.getByRole('link', { name: 'About Us' })).toHaveAttribute(
        'href',
        '/about'
      );
      expect(screen.getByRole('link', { name: 'Partnership' })).toHaveAttribute(
        'href',
        '/partnership'
      );
      expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute(
        'href',
        '/blog'
      );
    });

    it('collapses Pages section when header is clicked', () => {
      render(<SideMenu {...defaultProps} />);
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();

      const pagesButton = screen.getByRole('button', { name: /^pages$/i });
      fireEvent.click(pagesButton);

      expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
    });
  });

  describe('Spa Index', () => {
    it('renders Spa Index header', () => {
      render(<SideMenu {...defaultProps} />);
      expect(screen.getByText('Spa Index')).toBeInTheDocument();
      expect(screen.getByText('Browse by Location')).toBeInTheDocument();
    });

    it('renders location groups with spa links', () => {
      render(<SideMenu {...defaultProps} />);
      const firstSpa = spaData[0];
      expect(firstSpa).toBeDefined();
      expect(
        screen.getByRole('link', { name: firstSpa.name })
      ).toHaveAttribute('href', `/spa/${firstSpa.url}`);
    });

    it('renders all spas from spaData', () => {
      render(<SideMenu {...defaultProps} />);
      spaData.forEach((spa) => {
        expect(screen.getByRole('link', { name: spa.name })).toBeInTheDocument();
      });
    });
  });

  describe('onClose callback', () => {
    it('calls onClose when close button is clicked', () => {
      const onClose = jest.fn();
      render(<SideMenu isOpen={true} onClose={onClose} />);

      const header = screen.getByText('Menu').parentElement;
      const closeButton = header?.querySelector('button');
      expect(closeButton).toBeInTheDocument();
      fireEvent.click(closeButton!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when a menu link is clicked', () => {
      const onClose = jest.fn();
      render(<SideMenu {...defaultProps} onClose={onClose} />);

      fireEvent.click(screen.getByRole('link', { name: 'Spas' }));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
      const onClose = jest.fn();
      const { container } = render(<SideMenu isOpen={true} onClose={onClose} />);

      const backdrop = container.querySelector('.backdrop-blur-sm');
      expect(backdrop).toBeInTheDocument();
      fireEvent.click(backdrop!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('active state styling', () => {
    it('applies active styling to Spas link when pathname is /spas', () => {
      mockPathname.mockReturnValue('/spas');
      render(<SideMenu {...defaultProps} />);

      const spasLink = screen.getByRole('link', { name: 'Spas' });
      expect(spasLink.querySelector('span')).toHaveClass('text-amber-700');
    });

    it('applies active styling to Blog link when pathname is /blog', () => {
      mockPathname.mockReturnValue('/blog');
      render(<SideMenu {...defaultProps} />);

      const blogLink = screen.getByRole('link', { name: 'Blog' });
      expect(blogLink.querySelector('span')).toHaveClass('text-amber-700');
    });

    it('applies active styling to Blog link when pathname is a blog post', () => {
      mockPathname.mockReturnValue('/blog/some-post-slug');
      render(<SideMenu {...defaultProps} />);

      const blogLink = screen.getByRole('link', { name: 'Blog' });
      expect(blogLink.querySelector('span')).toHaveClass('text-amber-700');
    });
  });

  describe('body scroll lock', () => {
    it('sets body overflow to hidden when menu opens', () => {
      expect(document.body.style.overflow).toBe('');

      const { rerender } = render(<SideMenu isOpen={false} onClose={jest.fn()} />);
      expect(document.body.style.overflow).toBe('');

      rerender(<SideMenu isOpen={true} onClose={jest.fn()} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body overflow when menu closes', () => {
      const { rerender } = render(<SideMenu isOpen={true} onClose={jest.fn()} />);
      expect(document.body.style.overflow).toBe('hidden');

      rerender(<SideMenu isOpen={false} onClose={jest.fn()} />);
      expect(document.body.style.overflow).toBe('');
    });
  });
});
