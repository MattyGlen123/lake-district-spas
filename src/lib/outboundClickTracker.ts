import { isSameHost } from './siteDomain';

/**
 * Spa outbound click tracker. Fires a GTM dataLayer event whenever a visitor
 * clicks a booking link (data-spa-id present) that is external (http/https,
 * different domain) or a protocol handler (mailto:/tel:). External links are
 * intercepted and re-navigated after a short delay so the analytics event has
 * time to send before the page unloads — see docs/adr/0004-same-tab-outbound-navigation.md.
 *
 * This module is imported directly by GoogleAnalytics.tsx (registered via
 * useEffect) AND by GoogleAnalytics.test.ts — there is exactly one
 * implementation, so tests exercise the code that ships.
 */

export interface SpaOutboundClickEvent {
  event: 'spa_outbound_click';
  spa_id: string;
  click_intent: string;
  product_name: string;
}

interface DataLayerWindow extends Window {
  dataLayer?: SpaOutboundClickEvent[];
}

const NAVIGATION_DELAY_MS = 200;

/** True for http/https URLs whose hostname differs from currentHostname (see isSameHost). */
export function isExternalUrl(url: string, currentHostname: string): boolean {
  if (!url) return false;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;

  try {
    const linkHost = new URL(url).hostname;
    return !isSameHost(linkHost, currentHostname);
  } catch {
    return false;
  }
}

/** True for mailto: and tel: links. */
export function isProtocolHandler(url: string): boolean {
  if (!url) return false;
  return url.startsWith('mailto:') || url.startsWith('tel:');
}

/** The document-level click listener. Exported so tests can dispatch events and assert directly. */
export function handleOutboundClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null;
  const link = target?.closest('a');
  if (!link || !link.href) return;

  // Use the resolved (absolute) href for the external check.
  const href = link.href;
  const external = isExternalUrl(href, window.location.hostname);
  const protocol = isProtocolHandler(href);

  if (!external && !protocol) return;

  const spaId = link.dataset.spaId || '';
  if (!spaId) return;

  const clickIntent = link.dataset.clickIntent || 'external-link';
  const productName = link.dataset.productName || 'none';

  const win = window as DataLayerWindow;
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({
    event: 'spa_outbound_click',
    spa_id: spaId,
    click_intent: clickIntent,
    product_name: productName,
  });

  if (external) {
    event.preventDefault();
    setTimeout(() => {
      window.location.href = href;
    }, NAVIGATION_DELAY_MS);
  }
}

/** Wires up the tracker and returns a cleanup function that removes the listener. */
export function initOutboundClickTracker(): () => void {
  const win = window as DataLayerWindow;
  win.dataLayer = win.dataLayer || [];

  document.addEventListener('click', handleOutboundClick);
  return () => document.removeEventListener('click', handleOutboundClick);
}
