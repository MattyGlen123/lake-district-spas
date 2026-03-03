import { cn, appendUtmParams } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn (class name utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
      expect(cn('foo', true && 'bar', 'baz')).toBe('foo bar baz');
    });

    it('should handle undefined and null', () => {
      expect(cn('foo', undefined, 'bar', null, 'baz')).toBe('foo bar baz');
    });

    it('should merge Tailwind classes correctly', () => {
      const result1 = cn('px-2 py-1', 'px-4');
      expect(result1).toContain('px-4');
      expect(result1).toContain('py-1');
      expect(result1).not.toContain('px-2');

      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('should handle empty strings', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar');
    });

    it('should handle arrays', () => {
      expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
    });

    it('should handle objects', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    });
  });

  describe('appendUtmParams', () => {
    describe('basic UTM parameter appending', () => {
      it('should append UTM parameters to external HTTPS URL', () => {
        const url = 'https://example.com/spa';
        const result = appendUtmParams(url, 'all-treatments');
        
        expect(result).toContain('utm_source=lakedistrictspas.co.uk');
        expect(result).toContain('utm_medium=referral');
        expect(result).toContain('utm_campaign=outbound_clicks');
        expect(result).toContain('utm_content=treatments-booking');
        expect(result).toContain('https://example.com/spa?');
      });

      it('should append UTM parameters to external HTTP URL', () => {
        const url = 'http://example.com/spa';
        const result = appendUtmParams(url, 'all-day-passes');
        
        expect(result).toContain('utm_source=lakedistrictspas.co.uk');
        expect(result).toContain('utm_content=day-passes-booking');
      });

      it('should map click intent to correct utm_content', () => {
        const url = 'https://example.com/spa';
        
        expect(appendUtmParams(url, 'all-treatments')).toContain('utm_content=treatments-booking');
        expect(appendUtmParams(url, 'all-day-passes')).toContain('utm_content=day-passes-booking');
        expect(appendUtmParams(url, 'specific-product-click')).toContain('utm_content=product-booking');
      });

      it('should use click intent as utm_content if not mapped', () => {
        const url = 'https://example.com/spa';
        const result = appendUtmParams(url, 'unknown-intent');
        
        expect(result).toContain('utm_content=unknown-intent');
      });
    });

    describe('URLs with existing query parameters', () => {
      it('should append UTM parameters to URL with existing query string', () => {
        const url = 'https://example.com/spa?existing=param';
        const result = appendUtmParams(url, 'specific-product-click');
        
        expect(result).toContain('existing=param');
        expect(result).toContain('utm_source=lakedistrictspas.co.uk');
        expect(result).toContain('&'); // Should use & separator
        expect(result).not.toContain('??'); // Should not double the ?
      });

      it('should handle real-world booking URLs with existing query parameters', () => {
        // Real example from spa-6-day-passes.ts
        const url = 'https://www.macdonaldhotels.co.uk/old-england/book/spa/day/my-morning-retreat-spa-day?package=12724';
        const result = appendUtmParams(url, 'specific-product-click');
        
        // Should preserve existing query parameter
        expect(result).toContain('package=12724');
        // Should add UTM parameters
        expect(result).toContain('utm_source=lakedistrictspas.co.uk');
        expect(result).toContain('utm_medium=referral');
        expect(result).toContain('utm_campaign=outbound_clicks');
        expect(result).toContain('utm_content=product-booking');
        // Should use & to append (not another ?)
        expect(result).toContain('&utm_source');
        expect(result).not.toContain('??');
        // Should maintain the base URL structure
        expect(result).toContain('my-morning-retreat-spa-day');
      });

      it('should handle multiple existing query parameters', () => {
        const url = 'https://example.com/spa?param1=value1&param2=value2';
        const result = appendUtmParams(url, 'all-treatments');
        
        expect(result).toContain('param1=value1');
        expect(result).toContain('param2=value2');
        expect(result).toContain('utm_source=lakedistrictspas.co.uk');
      });

      it('should preserve existing UTM parameters and add new ones', () => {
        const url = 'https://example.com/spa?utm_source=existing';
        const result = appendUtmParams(url, 'all-day-passes');
        
        // Should overwrite existing utm_source
        expect(result).toContain('utm_source=lakedistrictspas.co.uk');
        expect(result).toContain('utm_medium=referral');
      });
    });

    describe('internal links (same domain)', () => {
      it('should skip UTM parameters for lakedistrictspas.co.uk', () => {
        const url = 'https://lakedistrictspas.co.uk/spa/example';
        const result = appendUtmParams(url, 'all-treatments');
        
        expect(result).toBe(url);
        expect(result).not.toContain('utm_source');
      });

      it('should skip UTM parameters for www.lakedistrictspas.co.uk', () => {
        const url = 'https://www.lakedistrictspas.co.uk/spa/example';
        const result = appendUtmParams(url, 'all-treatments');
        
        expect(result).toBe(url);
        expect(result).not.toContain('utm_source');
      });

      it('should skip UTM parameters for internal links with query params', () => {
        const url = 'https://lakedistrictspas.co.uk/spa/example?param=value';
        const result = appendUtmParams(url, 'all-treatments');
        
        expect(result).toBe(url);
      });
    });

    describe('protocol handlers (mailto: and tel:)', () => {
      it('should skip UTM parameters for mailto: links', () => {
        const url = 'mailto:reservations@example.com';
        const result = appendUtmParams(url, 'specific-product-click');
        
        expect(result).toBe(url);
        expect(result).not.toContain('utm_source');
      });

      it('should skip UTM parameters for tel: links', () => {
        const url = 'tel:+441234567890';
        const result = appendUtmParams(url, 'specific-product-click');
        
        expect(result).toBe(url);
        expect(result).not.toContain('utm_source');
      });

      it('should skip UTM parameters for mailto: with subject', () => {
        const url = 'mailto:reservations@example.com?subject=Booking';
        const result = appendUtmParams(url, 'specific-product-click');
        
        expect(result).toBe(url);
      });
    });

    describe('relative URLs', () => {
      it('should skip UTM parameters for relative URLs', () => {
        const url = '/spa/example';
        const result = appendUtmParams(url, 'all-treatments');
        
        expect(result).toBe(url);
        expect(result).not.toContain('utm_source');
      });

      it('should skip UTM parameters for hash links', () => {
        const url = '#treatments';
        const result = appendUtmParams(url, 'all-treatments');
        
        expect(result).toBe(url);
      });

      it('should skip UTM parameters for relative paths with query', () => {
        const url = '/spa/example?param=value';
        const result = appendUtmParams(url, 'all-treatments');
        
        expect(result).toBe(url);
      });
    });

    describe('edge cases', () => {
      it('should return empty string if URL is empty', () => {
        const result = appendUtmParams('', 'all-treatments');
        expect(result).toBe('');
      });

      it('should handle invalid URLs gracefully', () => {
        const url = 'not-a-valid-url';
        const result = appendUtmParams(url, 'all-treatments');
        
        // Should return original URL for invalid URLs
        expect(result).toBe(url);
      });

      it('should handle URLs with special characters', () => {
        const url = 'https://example.com/spa?name=John%20Doe&email=test@example.com';
        const result = appendUtmParams(url, 'specific-product-click');
        
        expect(result).toContain('utm_source=lakedistrictspas.co.uk');
        // URLSearchParams may encode spaces as + or %20, both are valid
        expect(result).toMatch(/name=John(\+|%20)Doe/);
        expect(result).toContain('email=test%40example.com');
      });

      it('should handle URLs with ports', () => {
        const url = 'https://example.com:8080/spa';
        const result = appendUtmParams(url, 'all-treatments');
        
        expect(result).toContain('example.com:8080');
        expect(result).toContain('utm_source=lakedistrictspas.co.uk');
      });

      it('should handle URLs with paths and fragments', () => {
        const url = 'https://example.com/spa/treatments#section';
        const result = appendUtmParams(url, 'all-treatments');
        
        expect(result).toContain('/spa/treatments');
        expect(result).toContain('utm_source=lakedistrictspas.co.uk');
        // Fragment should be preserved
        expect(result).toContain('#section');
      });
    });

    describe('UTM parameter values', () => {
      it('should set correct utm_source', () => {
        const url = 'https://example.com/spa';
        const result = appendUtmParams(url, 'all-treatments');
        
        expect(result).toContain('utm_source=lakedistrictspas.co.uk');
      });

      it('should set correct utm_medium', () => {
        const url = 'https://example.com/spa';
        const result = appendUtmParams(url, 'all-treatments');
        
        expect(result).toContain('utm_medium=referral');
      });

      it('should set correct utm_campaign', () => {
        const url = 'https://example.com/spa';
        const result = appendUtmParams(url, 'all-treatments');
        
        expect(result).toContain('utm_campaign=outbound_clicks');
      });

      it('should URL encode UTM parameters correctly', () => {
        const url = 'https://example.com/spa';
        const result = appendUtmParams(url, 'all-treatments');
        
        // All parameters should be properly encoded
        expect(result).toContain('utm_source=lakedistrictspas.co.uk');
        expect(result).toContain('utm_medium=referral');
        expect(result).toContain('utm_campaign=outbound_clicks');
        expect(result).toContain('utm_content=treatments-booking');
      });
    });
  });
});
