export type PathMatch = string | ((pathname: string) => boolean);

export const COLLECTION_LINKS: {
  href: string;
  label: string;
  match: PathMatch;
}[] = [
  { href: '/spas', label: 'Spas', match: '/spas' },
  {
    href: '/spa-treatments',
    label: 'Treatments',
    match: '/spa-treatments',
  },
  { href: '/spa-days', label: 'Day Passes', match: '/spa-days' },
];

export const PAGES_LINKS: {
  href: string;
  label: string;
  match: PathMatch;
}[] = [
  { href: '/', label: 'Home', match: '/' },
  {
    href: '/couples-spa-lake-district',
    label: 'Couples Spa Guide',
    match: '/couples-spa-lake-district',
  },
  { href: '/locations', label: 'All Locations', match: '/locations' },
  { href: '/about', label: 'About Us', match: '/about' },
  { href: '/partnership', label: 'Partnership', match: '/partnership' },
  {
    href: '/blog',
    label: 'Blog',
    match: (p) => p === '/blog' || p.startsWith('/blog/'),
  },
];

export function isPathActive(match: PathMatch, pathname: string): boolean {
  return typeof match === 'string' ? pathname === match : match(pathname);
}
