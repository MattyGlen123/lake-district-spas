/**
 * Single source of truth for "is this hostname us?" — shared by appendUtmParams
 * (src/lib/utils.ts, decides whether to skip UTM params on internal links) and
 * the outbound click tracker (src/lib/outboundClickTracker.ts, decides whether
 * a clicked link is external). Both used to hand-roll this comparison
 * separately and had drifted apart on www-prefix handling.
 */
export const SITE_HOSTNAME = 'lakedistrictspas.co.uk';

/** Two hostnames count as the "same site" if equal, or one is the www.-prefixed form of the other. */
export function isSameHost(a: string, b: string): boolean {
  return a === b || a === `www.${b}` || `www.${a}` === b;
}
