/**
 * Tests for the spa outbound click tracker.
 * Imports the real implementation from @/lib/outboundClickTracker — the exact
 * module GoogleAnalytics.tsx wires up via useEffect. No hand-copied logic
 * here: deleting the real tracker breaks these tests.
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  handleOutboundClick,
  initOutboundClickTracker,
  isExternalUrl,
  isProtocolHandler,
} from '@/lib/outboundClickTracker';

interface DataLayerItem {
  event: string;
  spa_id: string;
  click_intent: string;
  product_name: string;
}

interface WindowWithDataLayer extends Window {
  dataLayer?: DataLayerItem[];
}

/** Mocks window.location for tests that need a specific hostname (and, optionally, to observe href assignment). */
function mockLocation(hostname: string, hrefSetter?: (v: string) => void) {
  Object.defineProperty(window, 'location', {
    value: {
      hostname,
      origin: `https://${hostname}`,
      set href(v: string) {
        hrefSetter?.(v);
      },
    },
    writable: true,
    configurable: true,
  });

  // jsdom resolves relative <a href> against the document's <base>/URL, not
  // our mocked window.location — point <base> at the same origin so relative
  // links resolve the way they would in a real browser on this domain.
  document.querySelectorAll('base').forEach((el) => el.remove());
  const base = document.createElement('base');
  base.href = `https://${hostname}/`;
  document.head.appendChild(base);
}

describe('Spa Outbound Click Tracker', () => {
  let dataLayer: DataLayerItem[];
  let mockDataLayerPush: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();

    // Reset dataLayer before each test
    dataLayer = [];
    mockDataLayerPush = vi.fn((item: DataLayerItem) => {
      // Directly push to the array, not through the mock to avoid circular reference
      Array.prototype.push.call(dataLayer, item);
    });

    (window as WindowWithDataLayer).dataLayer = dataLayer;
    dataLayer.push = mockDataLayerPush as typeof Array.prototype.push;

    // Real handleOutboundClick is a stable function reference, so cleanup
    // doesn't need to track per-test closures like the old hand-copy did.
    document.removeEventListener('click', handleOutboundClick);
  });

  afterEach(() => {
    document.removeEventListener('click', handleOutboundClick);
    delete (window as WindowWithDataLayer).dataLayer;
    document.querySelectorAll('base').forEach((el) => el.remove());
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('Event listener setup', () => {
    it('should initialize dataLayer if it does not exist', () => {
      delete (window as WindowWithDataLayer).dataLayer;
      initOutboundClickTracker();
      const win = window as WindowWithDataLayer;
      expect(win.dataLayer).toBeDefined();
      expect(Array.isArray(win.dataLayer)).toBe(true);
    });

    it('should not overwrite existing dataLayer', () => {
      const existingDataLayer: DataLayerItem[] = [
        { event: 'test', spa_id: 'test', click_intent: 'test', product_name: 'test' },
      ];
      (window as WindowWithDataLayer).dataLayer = existingDataLayer;
      initOutboundClickTracker();
      const win = window as WindowWithDataLayer;
      expect(win.dataLayer).toBe(existingDataLayer);
    });
  });

  describe('isExternalUrl', () => {
    it('treats a different domain as external', () => {
      expect(isExternalUrl('https://example.com/book', 'lakedistrictspas.co.uk')).toBe(true);
    });

    it('treats the same domain as internal', () => {
      expect(isExternalUrl('https://lakedistrictspas.co.uk/spa/x', 'lakedistrictspas.co.uk')).toBe(false);
    });

    it('treats relative URLs as internal', () => {
      expect(isExternalUrl('/spa/x', 'lakedistrictspas.co.uk')).toBe(false);
    });

    it('treats a www-prefixed link host as the same domain', () => {
      expect(isExternalUrl('https://www.lakedistrictspas.co.uk/spa/x', 'lakedistrictspas.co.uk')).toBe(false);
    });

    it('treats a www-prefixed current host with a non-www link as the same domain', () => {
      expect(isExternalUrl('https://lakedistrictspas.co.uk/spa/x', 'www.lakedistrictspas.co.uk')).toBe(false);
    });

    it('treats a www-prefixed external domain as external', () => {
      expect(isExternalUrl('https://www.example.com/book', 'lakedistrictspas.co.uk')).toBe(true);
    });

    it('returns false for an empty URL', () => {
      expect(isExternalUrl('', 'lakedistrictspas.co.uk')).toBe(false);
    });
  });

  describe('isProtocolHandler', () => {
    it('detects mailto: links', () => {
      expect(isProtocolHandler('mailto:info@example.com')).toBe(true);
    });

    it('detects tel: links', () => {
      expect(isProtocolHandler('tel:+441234567890')).toBe(true);
    });

    it('rejects http(s) links', () => {
      expect(isProtocolHandler('https://example.com')).toBe(false);
    });
  });

  describe('Click detection', () => {
    beforeEach(() => {
      initOutboundClickTracker();
    });

    it('should detect clicks on external links with data-spa-id', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'https://example.com/book';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledTimes(1);
      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-stay',
        product_name: 'none',
      });

      document.body.removeChild(link);
    });

    it('should find closest parent anchor with data-spa-id when clicking nested elements', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-day-pass');
      link.href = 'https://example.com/book-day-pass';

      const icon = document.createElement('span');
      icon.textContent = 'Icon';
      link.appendChild(icon);

      const text = document.createElement('span');
      text.textContent = 'Book Spa Day';
      link.appendChild(text);

      document.body.appendChild(link);

      // Click on the nested text element
      text.click();

      expect(mockDataLayerPush).toHaveBeenCalledTimes(1);
      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-day-pass',
        product_name: 'none',
      });

      document.body.removeChild(link);
    });

    it('should extract all data attributes correctly', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'armathwaite-hall-spa');
      link.setAttribute('data-click-intent', 'specific-product-click');
      link.setAttribute('data-product-name', 'Full Body Massage');
      link.href = 'https://example.com/book-treatment';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'armathwaite-hall-spa',
        click_intent: 'specific-product-click',
        product_name: 'Full Body Massage',
      });

      document.body.removeChild(link);
    });

    it('should use default "none" for missing product_name', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'all-treatments');
      link.href = 'https://example.com/treatments';
      // product_name not set
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'all-treatments',
        product_name: 'none',
      });

      document.body.removeChild(link);
    });

    it('should not trigger for elements without data-spa-id', () => {
      const link = document.createElement('a');
      link.setAttribute('data-click-intent', 'book-treatment');
      link.href = 'https://example.com/book';
      // spa_id not set
      document.body.appendChild(link);

      link.click();

      // Should not trigger because data-spa-id is required
      expect(mockDataLayerPush).not.toHaveBeenCalled();

      document.body.removeChild(link);
    });

    it('should use default "external-link" for missing click_intent', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.href = 'https://example.com/book';
      // click_intent not set
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'external-link',
        product_name: 'none',
      });

      document.body.removeChild(link);
    });

    it('should not trigger for clicks on non-anchor elements (buttons, divs, etc.)', () => {
      const button = document.createElement('button');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'book-stay');
      button.textContent = 'Regular Button';
      document.body.appendChild(button);

      button.click();

      // Should not trigger because we only track <a> tags
      expect(mockDataLayerPush).not.toHaveBeenCalled();

      document.body.removeChild(button);
    });

    it('should handle multiple clicks correctly', () => {
      const link1 = document.createElement('a');
      link1.setAttribute('data-spa-id', 'lodore-falls-spa');
      link1.setAttribute('data-click-intent', 'book-stay');
      link1.href = 'https://example.com/book-stay';
      document.body.appendChild(link1);

      const link2 = document.createElement('a');
      link2.setAttribute('data-spa-id', 'armathwaite-hall-spa');
      link2.setAttribute('data-click-intent', 'book-day-pass');
      link2.href = 'https://example.com/book-day-pass';
      document.body.appendChild(link2);

      link1.click();
      link2.click();

      expect(mockDataLayerPush).toHaveBeenCalledTimes(2);
      expect(mockDataLayerPush).toHaveBeenNthCalledWith(1, {
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-stay',
        product_name: 'none',
      });
      expect(mockDataLayerPush).toHaveBeenNthCalledWith(2, {
        event: 'spa_outbound_click',
        spa_id: 'armathwaite-hall-spa',
        click_intent: 'book-day-pass',
        product_name: 'none',
      });

      document.body.removeChild(link1);
      document.body.removeChild(link2);
    });
  });

  describe('Real-world scenarios', () => {
    beforeEach(() => {
      initOutboundClickTracker();
    });

    it('should handle Book Stay button click', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'https://example.com/book';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-stay',
        product_name: 'none',
      });

      document.body.removeChild(link);
    });

    it('should handle Book Spa Day button click', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-day-pass');
      link.href = 'https://example.com/book-day-pass';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-day-pass',
        product_name: 'none',
      });

      document.body.removeChild(link);
    });

    it('should handle Book Treatment button click', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-treatment');
      link.href = 'https://example.com/book-treatment';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-treatment',
        product_name: 'none',
      });

      document.body.removeChild(link);
    });

    it('should handle specific product click (treatment card)', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'specific-product-click');
      link.setAttribute('data-product-name', 'Deep Tissue Massage');
      link.href = 'https://example.com/book-treatment';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'specific-product-click',
        product_name: 'Deep Tissue Massage',
      });

      document.body.removeChild(link);
    });

    it('should handle specific product click (day pass card)', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'specific-product-click');
      link.setAttribute('data-product-name', 'Falls Renew Spa Experience');
      link.href = 'https://example.com/book-day-pass';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'specific-product-click',
        product_name: 'Falls Renew Spa Experience',
      });

      document.body.removeChild(link);
    });

    it('should handle section-level CTA clicks (all-treatments)', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'all-treatments');
      link.href = 'https://example.com/treatments';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'all-treatments',
        product_name: 'none',
      });

      document.body.removeChild(link);
    });

    it('should handle section-level CTA clicks (all-day-passes)', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'all-day-passes');
      link.href = 'https://example.com/day-passes';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'all-day-passes',
        product_name: 'none',
      });

      document.body.removeChild(link);
    });
  });

  describe('Event structure', () => {
    beforeEach(() => {
      initOutboundClickTracker();
    });

    it('should push event with correct structure to dataLayer', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.setAttribute('data-product-name', 'Test Product');
      link.href = 'https://example.com/book';
      document.body.appendChild(link);

      link.click();

      const callArgs = mockDataLayerPush.mock.calls[0][0];

      expect(callArgs).toHaveProperty('event', 'spa_outbound_click');
      expect(callArgs).toHaveProperty('spa_id');
      expect(callArgs).toHaveProperty('click_intent');
      expect(callArgs).toHaveProperty('product_name');
      expect(Object.keys(callArgs)).toEqual([
        'event',
        'spa_id',
        'click_intent',
        'product_name',
      ]);

      document.body.removeChild(link);
    });

    it('should have parameters at top level (not nested)', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'https://example.com/book';
      document.body.appendChild(link);

      link.click();

      const callArgs = mockDataLayerPush.mock.calls[0][0];

      // Verify parameters are at top level, not nested in a params object
      expect(callArgs.spa_id).toBe('lodore-falls-spa');
      expect(callArgs.click_intent).toBe('book-stay');
      expect(callArgs.product_name).toBe('none');
      expect(callArgs.params).toBeUndefined();

      document.body.removeChild(link);
    });
  });

  describe('External URL validation', () => {
    beforeEach(() => {
      mockLocation('lakedistrictspas.co.uk');
      initOutboundClickTracker();
    });

    it('should track external links (different domain)', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'https://example.com/book';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledTimes(1);
      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-stay',
        product_name: 'none',
      });

      document.body.removeChild(link);
    });

    it('should not track internal links (same domain)', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'https://lakedistrictspas.co.uk/spa/lodore-falls-spa';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).not.toHaveBeenCalled();

      document.body.removeChild(link);
    });

    it('should not track relative internal links', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = '/spa/lodore-falls-spa';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).not.toHaveBeenCalled();

      document.body.removeChild(link);
    });

    it('should handle www subdomain correctly (same domain)', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'https://www.lakedistrictspas.co.uk/spa/lodore-falls-spa';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).not.toHaveBeenCalled();

      document.body.removeChild(link);
    });

    it('should handle www subdomain correctly (external domain)', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'https://www.example.com/book';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledTimes(1);

      document.body.removeChild(link);
    });
  });

  describe('Protocol handler links (mailto, tel)', () => {
    beforeEach(() => {
      initOutboundClickTracker();
    });

    it('should track mailto links with data-spa-id', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'mailto:info@example.com';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledTimes(1);
      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-stay',
        product_name: 'none',
      });

      document.body.removeChild(link);
    });

    it('should track tel links with data-spa-id', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'tel:+441234567890';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledTimes(1);
      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-stay',
        product_name: 'none',
      });

      document.body.removeChild(link);
    });

    it('should not track mailto links without data-spa-id', () => {
      const link = document.createElement('a');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'mailto:info@example.com';
      // data-spa-id not set
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).not.toHaveBeenCalled();

      document.body.removeChild(link);
    });

    it('should not track tel links without data-spa-id', () => {
      const link = document.createElement('a');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'tel:+441234567890';
      // data-spa-id not set
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).not.toHaveBeenCalled();

      document.body.removeChild(link);
    });
  });

  describe('Anchor tag requirement', () => {
    beforeEach(() => {
      initOutboundClickTracker();
    });

    it('should only track anchor tags, not buttons', () => {
      const button = document.createElement('button');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'book-stay');
      document.body.appendChild(button);

      button.click();

      expect(mockDataLayerPush).not.toHaveBeenCalled();

      document.body.removeChild(button);
    });

    it('should only track anchor tags, not divs', () => {
      const div = document.createElement('div');
      div.setAttribute('data-spa-id', 'lodore-falls-spa');
      div.setAttribute('data-click-intent', 'book-stay');
      div.setAttribute('role', 'button');
      div.style.cursor = 'pointer';
      document.body.appendChild(div);

      div.click();

      expect(mockDataLayerPush).not.toHaveBeenCalled();

      document.body.removeChild(div);
    });

    it('should track anchor tags with external links', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'https://example.com/book';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledTimes(1);

      document.body.removeChild(link);
    });
  });

  describe('Delayed same-tab navigation', () => {
    let mockHrefSetter: (v: string) => void;

    beforeEach(() => {
      mockHrefSetter = vi.fn();
      mockLocation('localhost', mockHrefSetter);
      initOutboundClickTracker();
    });

    it('calls preventDefault on HTTP/HTTPS external link with data-spa-id', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.setAttribute('href', 'https://example.com/book');
      document.body.appendChild(link);

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const spy = vi.spyOn(clickEvent, 'preventDefault');
      link.dispatchEvent(clickEvent);

      expect(spy).toHaveBeenCalled();
      document.body.removeChild(link);
    });

    it('navigates to href after 200ms', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.setAttribute('href', 'https://example.com/book');
      document.body.appendChild(link);

      link.click();
      vi.advanceTimersByTime(200);

      expect(mockHrefSetter).toHaveBeenCalledWith('https://example.com/book');
      document.body.removeChild(link);
    });

    it('does not navigate before 200ms', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.setAttribute('href', 'https://example.com/book');
      document.body.appendChild(link);

      link.click();
      vi.advanceTimersByTime(199);

      expect(mockHrefSetter).not.toHaveBeenCalled();
      document.body.removeChild(link);
    });

    it('does not call preventDefault or redirect for mailto links', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.setAttribute('href', 'mailto:info@example.com');
      document.body.appendChild(link);

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const spy = vi.spyOn(clickEvent, 'preventDefault');
      link.dispatchEvent(clickEvent);

      expect(spy).not.toHaveBeenCalled();
      vi.advanceTimersByTime(200);
      expect(mockHrefSetter).not.toHaveBeenCalled();
      expect(mockDataLayerPush).toHaveBeenCalledTimes(1);
      document.body.removeChild(link);
    });

    it('does not call preventDefault or redirect for tel links', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.setAttribute('href', 'tel:+441234567890');
      document.body.appendChild(link);

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const spy = vi.spyOn(clickEvent, 'preventDefault');
      link.dispatchEvent(clickEvent);

      expect(spy).not.toHaveBeenCalled();
      vi.advanceTimersByTime(200);
      expect(mockHrefSetter).not.toHaveBeenCalled();
      expect(mockDataLayerPush).toHaveBeenCalledTimes(1);
      document.body.removeChild(link);
    });
  });

  describe('Required data-spa-id attribute', () => {
    beforeEach(() => {
      initOutboundClickTracker();
    });

    it('should not track external links without data-spa-id', () => {
      const link = document.createElement('a');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'https://example.com/book';
      // data-spa-id not set
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).not.toHaveBeenCalled();

      document.body.removeChild(link);
    });

    it('should not track external links with empty data-spa-id', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', '');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'https://example.com/book';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).not.toHaveBeenCalled();

      document.body.removeChild(link);
    });

    it('should track external links with valid data-spa-id', () => {
      const link = document.createElement('a');
      link.setAttribute('data-spa-id', 'lodore-falls-spa');
      link.setAttribute('data-click-intent', 'book-stay');
      link.href = 'https://example.com/book';
      document.body.appendChild(link);

      link.click();

      expect(mockDataLayerPush).toHaveBeenCalledTimes(1);
      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-stay',
        product_name: 'none',
      });

      document.body.removeChild(link);
    });
  });
});
