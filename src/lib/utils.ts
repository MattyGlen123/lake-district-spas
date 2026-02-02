import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to map spa color to badge classes
export function getBadgeClasses(colorClass: string): string {
  const colorMap: Record<string, string> = {
    'bg-spa-green': 'bg-emerald-50 text-black',
    'bg-spa-purple': 'bg-purple-50 text-black',
    'bg-spa-yellow': 'bg-amber-50 text-black',
    'bg-spa-red': 'bg-red-50 text-black',
    'bg-spa-blue': 'bg-blue-50 text-black',
  };
  return colorMap[colorClass] || 'bg-stone-50 text-black';
}

/**
 * Maps data-click-intent values to utm_content values for analytics tracking
 */
function mapClickIntentToUtmContent(clickIntent: string): string {
  const intentMap: Record<string, string> = {
    'all-treatments': 'treatments-booking',
    'all-day-passes': 'day-passes-booking',
    'specific-product-click': 'product-booking',
  };
  return intentMap[clickIntent] || clickIntent;
}

/**
 * Appends UTM parameters to outbound spa links for analytics tracking
 * @param url - The external URL to append UTM parameters to
 * @param clickIntent - The data-click-intent value (e.g., 'all-treatments', 'specific-product-click')
 * @returns The URL with UTM parameters appended
 */
export function appendUtmParams(url: string, clickIntent: string): string {
  if (!url) return url;

  // Skip UTM parameters for mailto: and tel: links (protocol handlers, not web URLs)
  if (url.startsWith('mailto:') || url.startsWith('tel:')) {
    return url;
  }

  // Skip relative URLs (internal links)
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return url;
  }

  try {
    // Parse the URL to handle existing query parameters properly
    const urlObj = new URL(url);
    
    // Don't modify internal links (same domain)
    const hostname = urlObj.hostname;
    if (hostname === 'lakedistrictspas.co.uk' || hostname === 'www.lakedistrictspas.co.uk') {
      return url;
    }

    // Map click intent to utm_content
    const utmContent = mapClickIntentToUtmContent(clickIntent);

    // Append UTM parameters to existing search params
    urlObj.searchParams.set('utm_source', 'lakedistrictspas.co.uk');
    urlObj.searchParams.set('utm_medium', 'referral');
    urlObj.searchParams.set('utm_campaign', 'outbound_clicks');
    urlObj.searchParams.set('utm_content', utmContent);

    return urlObj.toString();
  } catch {
    // If URL parsing fails, return original URL
    return url;
  }
}
