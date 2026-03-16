import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  describe('brand section', () => {
    it('renders the site name', () => {
      render(<Footer />)
      expect(screen.getByRole('heading', { name: 'Lake District Spas' })).toBeDefined()
    })
  })

  describe('quick links', () => {
    it('renders the About Us link', () => {
      render(<Footer />)
      const link = screen.getByRole('link', { name: 'About Us' })
      expect(link.getAttribute('href')).toBe('/about')
    })

    it('renders the Partnership link', () => {
      render(<Footer />)
      const link = screen.getByRole('link', { name: 'Partnership' })
      expect(link.getAttribute('href')).toBe('/partnership')
    })

    it('renders the Blog link', () => {
      render(<Footer />)
      const link = screen.getByRole('link', { name: 'Blog' })
      expect(link.getAttribute('href')).toBe('/blog')
    })

    it('renders the Couples Spa Guide link', () => {
      render(<Footer />)
      const link = screen.getByRole('link', { name: 'Couples Spa Guide' })
      expect(link.getAttribute('href')).toBe('/couples-spa-lake-district')
    })

    it('renders the Day Passes link', () => {
      render(<Footer />)
      const link = screen.getByRole('link', { name: 'Day Passes' })
      expect(link.getAttribute('href')).toBe('/spa-days')
    })

    it('renders the All Locations link', () => {
      render(<Footer />)
      const link = screen.getByRole('link', { name: 'All Locations' })
      expect(link.getAttribute('href')).toBe('/locations')
    })
  })

  describe('contact section', () => {
    it('renders the contact email link with the display address', () => {
      render(<Footer />)
      // The contact section link (mailto href differs from display text — known state)
      const contactLink = screen.getByRole('link', { name: 'contact@lakedistrictspas.co.uk' })
      expect(contactLink.getAttribute('href')).toBe('mailto:hello@lakedistrictspas.com')
    })
  })

  describe('image notice', () => {
    it('renders the image notice email link', () => {
      render(<Footer />)
      const imageNoticeLink = screen.getByRole('link', {
        name: 'Email contact@lakedistrictspas.co.uk',
      })
      expect(imageNoticeLink.getAttribute('href')).toBe('mailto:contact@lakedistrictspas.co.uk')
    })
  })

  describe('copyright', () => {
    it('shows the current year in the copyright line', () => {
      render(<Footer />)
      const year = new Date().getFullYear()
      expect(screen.getByText(new RegExp(`© ${year} Lake District Spas`))).toBeDefined()
    })
  })
})
