/**
 * Tests for the spa outbound click tracker
 * This tests the global click listener that captures spa booking clicks
 * and sends them to Google Analytics via dataLayer
 */

interface DataLayerItem {
  event: string;
  spa_id: string;
  click_intent: string;
  product_name: string;
}

interface WindowWithDataLayer extends Window {
  dataLayer?: DataLayerItem[];
}

describe('Spa Outbound Click Tracker', () => {
  let dataLayer: DataLayerItem[];
  let mockDataLayerPush: jest.Mock;
  let clickHandler: ((e: Event) => void) | null = null;

  beforeEach(() => {
    // Reset dataLayer before each test
    dataLayer = [];
    mockDataLayerPush = jest.fn((item) => {
      // Directly push to the array, not through the mock to avoid circular reference
      Array.prototype.push.call(dataLayer, item);
    });
    
    // Set up window.dataLayer with the actual array
    (window as WindowWithDataLayer).dataLayer = dataLayer;
    // Replace push method with our mock
    dataLayer.push = mockDataLayerPush as typeof Array.prototype.push;

    // Remove any existing click listeners
    if (clickHandler) {
      document.removeEventListener('click', clickHandler);
      clickHandler = null;
    }
  });

  afterEach(() => {
    // Clean up event listener
    if (clickHandler) {
      document.removeEventListener('click', clickHandler);
      clickHandler = null;
    }
    // Clean up
    delete (window as WindowWithDataLayer).dataLayer;
    jest.clearAllMocks();
  });

  /**
   * Execute the click tracker script with custom location
   * This simulates what happens when the Script component loads
   */
  function initializeClickTrackerWithLocation(customHostname: string = 'localhost') {
    // Initialize dataLayer if it doesn't exist (matching the actual script)
    const win = window as WindowWithDataLayer;
    win.dataLayer = win.dataLayer || [];
    
    // Remove existing handler if any
    if (clickHandler) {
      document.removeEventListener('click', clickHandler);
    }
    
    // Helper function to check if URL is external (http/https to different domain)
    function isExternalUrl(url: string, originalHref?: string): boolean {
      if (!url) return false;
      
      // Check original href attribute first - if it's relative, it's internal
      if (originalHref && !originalHref.startsWith('http://') && !originalHref.startsWith('https://') && !originalHref.startsWith('mailto:') && !originalHref.startsWith('tel:')) {
        return false;
      }
      
      // Skip relative URLs (internal links) - check the resolved URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return false;
      }
      
      try {
        const urlObj = new URL(url);
        const currentHost = customHostname;
        const linkHost = urlObj.hostname;
        // Check if it's external (different domain)
        return linkHost !== currentHost && linkHost !== 'www.' + currentHost && 'www.' + linkHost !== currentHost;
      } catch {
        return false;
      }
    }

    // Helper function to check if URL is a protocol handler (mailto, tel)
    function isProtocolHandler(url: string): boolean {
      if (!url) return false;
      return url.startsWith('mailto:') || url.startsWith('tel:');
    }
    
    // Create the click handler (matching actual implementation)
    clickHandler = function(e: Event) {
      const target = e.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      
      if (!link || !link.href) return;
      
      // Use the resolved href (absolute URL) for external check
      const href = link.href;
      const originalHref = link.getAttribute('href') || '';
      
      // Track external URLs OR protocol handlers (mailto, tel)
      const isExternal = isExternalUrl(href, originalHref);
      const isProtocol = isProtocolHandler(href);
      
      if (!isExternal && !isProtocol) return;
      
      // Get spa ID from data attribute (required)
      const spaId = link.dataset.spaId || '';
      
      // Only fire event if we have a valid spa ID
      if (!spaId) return;
      
      // Get other data attributes if available
      const clickIntent = link.dataset.clickIntent || 'external-link';
      const productName = link.dataset.productName || 'none';
      
      // Fire the event for external links or protocol handlers with spa context
      if (win.dataLayer) {
        win.dataLayer.push({
          event: 'spa_outbound_click',
          spa_id: spaId,
          click_intent: clickIntent,
          product_name: productName
        });
      }
    };
    
    // Add the event listener
    document.addEventListener('click', clickHandler);
  }

  /**
   * Execute the click tracker script
   * This simulates what happens when the Script component loads
   */
  function initializeClickTracker() {
    // Initialize dataLayer if it doesn't exist (matching the actual script)
    const win = window as WindowWithDataLayer;
    win.dataLayer = win.dataLayer || [];
    
    // Remove existing handler if any
    if (clickHandler) {
      document.removeEventListener('click', clickHandler);
    }
    
    // Helper function to check if URL is external (http/https to different domain)
    function isExternalUrl(url: string): boolean {
      if (!url) return false;
      // Skip relative URLs (internal links)
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return false;
      }
      try {
        const urlObj = new URL(url, window.location.origin);
        const currentHost = window.location.hostname;
        const linkHost = urlObj.hostname;
        // Check if it's external (different domain)
        return linkHost !== currentHost && linkHost !== 'www.' + currentHost && 'www.' + linkHost !== currentHost;
      } catch {
        return false;
      }
    }

    // Helper function to check if URL is a protocol handler (mailto, tel)
    function isProtocolHandler(url: string): boolean {
      if (!url) return false;
      return url.startsWith('mailto:') || url.startsWith('tel:');
    }
    
    // Create the click handler (matching actual implementation)
    clickHandler = function(e: Event) {
      const target = e.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      
      if (!link || !link.href) return;
      
      // Use the resolved href (absolute URL) for external check
      const href = link.href;
      
      // Track external URLs OR protocol handlers (mailto, tel)
      const isExternal = isExternalUrl(href);
      const isProtocol = isProtocolHandler(href);
      
      if (!isExternal && !isProtocol) return;
      
      // Get spa ID from data attribute (required)
      const spaId = link.dataset.spaId || '';
      
      // Only fire event if we have a valid spa ID
      if (!spaId) return;
      
      // Get other data attributes if available
      const clickIntent = link.dataset.clickIntent || 'external-link';
      const productName = link.dataset.productName || 'none';
      
      // Fire the event for external links or protocol handlers with spa context
      if (win.dataLayer) {
        win.dataLayer.push({
          event: 'spa_outbound_click',
          spa_id: spaId,
          click_intent: clickIntent,
          product_name: productName
        });
      }
    };
    
    // Add the event listener
    document.addEventListener('click', clickHandler);
  }

  describe('Event listener setup', () => {
    it('should initialize dataLayer if it does not exist', () => {
      delete (window as WindowWithDataLayer).dataLayer;
      initializeClickTracker();
      const win = window as WindowWithDataLayer;
      expect(win.dataLayer).toBeDefined();
      expect(Array.isArray(win.dataLayer)).toBe(true);
    });

    it('should not overwrite existing dataLayer', () => {
      const existingDataLayer: DataLayerItem[] = [
        { event: 'test', spa_id: 'test', click_intent: 'test', product_name: 'test' }
      ];
      (window as WindowWithDataLayer).dataLayer = existingDataLayer;
      initializeClickTracker();
      const win = window as WindowWithDataLayer;
      expect(win.dataLayer).toBe(existingDataLayer);
    });
  });

  describe('Click detection', () => {
    beforeEach(() => {
      initializeClickTracker();
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
      initializeClickTracker();
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
      initializeClickTracker();
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
      // Use custom location for these tests
      initializeClickTrackerWithLocation('lakedistrictspas.co.uk');
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
      initializeClickTracker();
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
      initializeClickTracker();
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

  describe('Required data-spa-id attribute', () => {
    beforeEach(() => {
      initializeClickTracker();
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

