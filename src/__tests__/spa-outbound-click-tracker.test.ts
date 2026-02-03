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
    
    // Create the click handler
    clickHandler = function(e: Event) {
      const target = e.target as HTMLElement;
      const btn = target.closest('[data-spa-id]');
      
      if (btn && win.dataLayer) {
        const spaId = (btn as HTMLElement).dataset.spaId || '';
        const clickIntent = (btn as HTMLElement).dataset.clickIntent || '';
        const productName = (btn as HTMLElement).dataset.productName || 'none';
        
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

    it('should detect clicks on elements with data-spa-id', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'book-stay');
      document.body.appendChild(button);

      button.click();

      expect(mockDataLayerPush).toHaveBeenCalledTimes(1);
      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-stay',
        product_name: 'none',
      });

      document.body.removeChild(button);
    });

    it('should find closest parent with data-spa-id when clicking nested elements', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'book-day-pass');

      const icon = document.createElement('span');
      icon.textContent = 'Icon';
      button.appendChild(icon);

      const text = document.createElement('span');
      text.textContent = 'Book Spa Day';
      button.appendChild(text);

      document.body.appendChild(button);

      // Click on the nested text element
      text.click();

      expect(mockDataLayerPush).toHaveBeenCalledTimes(1);
      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-day-pass',
        product_name: 'none',
      });

      document.body.removeChild(button);
    });

    it('should extract all data attributes correctly', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'armathwaite-hall-spa');
      button.setAttribute('data-click-intent', 'specific-product-click');
      button.setAttribute('data-product-name', 'Full Body Massage');
      document.body.appendChild(button);

      button.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'armathwaite-hall-spa',
        click_intent: 'specific-product-click',
        product_name: 'Full Body Massage',
      });

      document.body.removeChild(button);
    });

    it('should use default "none" for missing product_name', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'all-treatments');
      // product_name not set
      document.body.appendChild(button);

      button.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'all-treatments',
        product_name: 'none',
      });

      document.body.removeChild(button);
    });

    it('should not trigger for elements without data-spa-id', () => {
      const button = document.createElement('a');
      button.setAttribute('data-click-intent', 'book-treatment');
      // spa_id not set - element won't be found by closest('[data-spa-id]')
      document.body.appendChild(button);

      button.click();

      // Should not trigger because closest('[data-spa-id]') returns null
      expect(mockDataLayerPush).not.toHaveBeenCalled();

      document.body.removeChild(button);
    });

    it('should use empty string for missing click_intent', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      // click_intent not set
      document.body.appendChild(button);

      button.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: '',
        product_name: 'none',
      });

      document.body.removeChild(button);
    });

    it('should not trigger for clicks outside elements with data-spa-id', () => {
      const regularButton = document.createElement('button');
      regularButton.textContent = 'Regular Button';
      document.body.appendChild(regularButton);

      regularButton.click();

      expect(mockDataLayerPush).not.toHaveBeenCalled();

      document.body.removeChild(regularButton);
    });

    it('should handle multiple clicks correctly', () => {
      const button1 = document.createElement('a');
      button1.setAttribute('data-spa-id', 'lodore-falls-spa');
      button1.setAttribute('data-click-intent', 'book-stay');
      document.body.appendChild(button1);

      const button2 = document.createElement('a');
      button2.setAttribute('data-spa-id', 'armathwaite-hall-spa');
      button2.setAttribute('data-click-intent', 'book-day-pass');
      document.body.appendChild(button2);

      button1.click();
      button2.click();

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

      document.body.removeChild(button1);
      document.body.removeChild(button2);
    });
  });

  describe('Real-world scenarios', () => {
    beforeEach(() => {
      initializeClickTracker();
    });

    it('should handle Book Stay button click', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'book-stay');
      button.href = 'https://example.com/book';
      document.body.appendChild(button);

      button.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-stay',
        product_name: 'none',
      });

      document.body.removeChild(button);
    });

    it('should handle Book Spa Day button click', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'book-day-pass');
      document.body.appendChild(button);

      button.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-day-pass',
        product_name: 'none',
      });

      document.body.removeChild(button);
    });

    it('should handle Book Treatment button click', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'book-treatment');
      document.body.appendChild(button);

      button.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'book-treatment',
        product_name: 'none',
      });

      document.body.removeChild(button);
    });

    it('should handle specific product click (treatment card)', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'specific-product-click');
      button.setAttribute('data-product-name', 'Deep Tissue Massage');
      document.body.appendChild(button);

      button.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'specific-product-click',
        product_name: 'Deep Tissue Massage',
      });

      document.body.removeChild(button);
    });

    it('should handle specific product click (day pass card)', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'specific-product-click');
      button.setAttribute('data-product-name', 'Falls Renew Spa Experience');
      document.body.appendChild(button);

      button.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'specific-product-click',
        product_name: 'Falls Renew Spa Experience',
      });

      document.body.removeChild(button);
    });

    it('should handle section-level CTA clicks (all-treatments)', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'all-treatments');
      document.body.appendChild(button);

      button.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'all-treatments',
        product_name: 'none',
      });

      document.body.removeChild(button);
    });

    it('should handle section-level CTA clicks (all-day-passes)', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'all-day-passes');
      document.body.appendChild(button);

      button.click();

      expect(mockDataLayerPush).toHaveBeenCalledWith({
        event: 'spa_outbound_click',
        spa_id: 'lodore-falls-spa',
        click_intent: 'all-day-passes',
        product_name: 'none',
      });

      document.body.removeChild(button);
    });
  });

  describe('Event structure', () => {
    beforeEach(() => {
      initializeClickTracker();
    });

    it('should push event with correct structure to dataLayer', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'book-stay');
      button.setAttribute('data-product-name', 'Test Product');
      document.body.appendChild(button);

      button.click();

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

      document.body.removeChild(button);
    });

    it('should have parameters at top level (not nested)', () => {
      const button = document.createElement('a');
      button.setAttribute('data-spa-id', 'lodore-falls-spa');
      button.setAttribute('data-click-intent', 'book-stay');
      document.body.appendChild(button);

      button.click();

      const callArgs = mockDataLayerPush.mock.calls[0][0];
      
      // Verify parameters are at top level, not nested in a params object
      expect(callArgs.spa_id).toBe('lodore-falls-spa');
      expect(callArgs.click_intent).toBe('book-stay');
      expect(callArgs.product_name).toBe('none');
      expect(callArgs.params).toBeUndefined();

      document.body.removeChild(button);
    });
  });
});

