# Lake District Spas - Technical Documentation

Comprehensive technical documentation for AI review and development reference.

---

## Project Overview

**Lake District Spas** is a Next.js-based directory website that helps users find and compare spa facilities across the Lake District. The site provides detailed information about spa access policies, facilities, treatments, and amenities for 17+ hotel spas.

**Purpose**: A luxury editorial-style directory that solves the problem of finding accurate, detailed spa information before booking.

---

## Tech Stack

### Core Framework
- **Next.js**: `^14.2.35` (App Router)
- **React**: `^18.3.1`
- **TypeScript**: `^5`
- **Node.js**: Compatible with Node 20+

### Styling
- **Tailwind CSS**: `^4` (v4 with PostCSS)
- **tw-animate-css**: `^1.4.0` (Animation utilities)
- **Custom Design System**: Luxury editorial theme (see `STYLE_GUIDE.md`)

### UI Components
- **Radix UI**: 
  - `@radix-ui/react-checkbox`: `^1.3.3`
  - `@radix-ui/react-dialog`: `^1.1.15`
  - `@radix-ui/react-dropdown-menu`: `^2.1.16`
  - `@radix-ui/react-select`: `^2.2.6`
  - `@radix-ui/react-accordion`: `^1.2.12`
- **Lucide React**: `^0.562.0` (Icons)
- **class-variance-authority**: `^0.7.1` (Component variants)
- **clsx**: `^2.1.1` (Conditional classes)
- **tailwind-merge**: `^3.4.0` (Tailwind class merging)

### Testing
- **Jest**: `^30.2.0`
- **React Testing Library**: `^16.3.1`
- **@testing-library/jest-dom**: `^6.9.1`
- **ts-jest**: `^29.4.6`
- **jest-environment-jsdom**: `^30.2.0`

### Development Tools
- **ESLint**: `^8` (with `eslint-config-next`)
- **Husky**: `^9.1.7` (Git hooks)
- **TypeScript**: Strict mode enabled

---

## Project Structure

```
lake-district-spas/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with fonts & analytics
│   │   ├── page.tsx            # Homepage with filtering
│   │   ├── about/
│   │   │   └── page.tsx        # About page
│   │   ├── spa/
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Dynamic spa detail pages
│   │   ├── globals.css         # Global styles & Tailwind config
│   │   └── sitemap.ts         # Dynamic sitemap generation
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components (shadcn)
│   │   ├── Header.tsx          # Site header with side menu
│   │   ├── Footer.tsx          # Site footer
│   │   ├── Hero.tsx            # Homepage hero section
│   │   ├── FilterButton.tsx    # Filter trigger button
│   │   ├── FilterModal.tsx     # Filter modal with options
│   │   ├── SpaGrid.tsx         # Grid of spa cards
│   │   ├── SpaCard.tsx         # Individual spa card component
│   │   ├── SideMenu.tsx        # Side drawer navigation menu
│   │   ├── SpaHero.tsx         # Spa detail page hero
│   │   ├── QuickFactsBar.tsx   # Overlapping facts bar
│   │   ├── SpaIntroduction.tsx # Intro text with drop cap
│   │   ├── ThermalFacilities.tsx # Thermal suite section
│   │   ├── PoolFeatures.tsx   # Pool features section
│   │   ├── Treatments.tsx     # Treatments section
│   │   ├── AccessPolicy.tsx   # Access policy section
│   │   ├── BookVisitCTA.tsx    # CTA section
│   │   ├── SpaNavigation.tsx   # Prev/Next spa navigation
│   │   ├── RelatedSpas.tsx      # Related spas section
│   │   ├── BackButton.tsx      # Back navigation button
│   │   ├── Breadcrumbs.tsx     # Breadcrumb navigation
│   │   └── GoogleAnalytics.tsx # GA integration
│   ├── data/                   # Static data
│   │   ├── spas.ts             # Main spa data array (17+ spas)
│   │   └── treatments/         # Treatment data per spa
│   │       ├── index.ts        # Treatment data aggregator
│   │       └── spa-*-treatments.ts # Individual spa treatments
│   ├── types/                  # TypeScript type definitions
│   │   └── spa.ts              # Core Spa interface & types
│   ├── lib/                    # Utility functions
│   │   └── utils.ts            # Helper functions (getBadgeClasses, etc.)
│   ├── utils/                  # Additional utilities
│   │   └── generateSpaSchema.ts # Schema generation
│   └── __tests__/              # Test files
│       ├── spa-data.test.ts    # Data validation tests
│       ├── filtering.test.ts   # Filter logic tests
│       ├── spa-intro-validation.test.ts # Intro text validation
│       └── utils.test.ts       # Utility function tests
├── public/                     # Static assets
│   ├── images/                 # Image assets
│   │   ├── spas/               # Spa-specific images
│   │   └── *.jpg               # General images
│   ├── logo.svg                # Site logo
│   ├── favicon.*               # Favicon files
│   └── site.webmanifest        # PWA manifest
├── scripts/                    # Build/utility scripts
│   ├── convert-csv-to-ts.js    # CSV to TS converter
│   └── *.ts                    # Conversion output files
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
├── jest.config.js              # Jest configuration
├── jest.setup.js               # Jest setup file
├── postcss.config.mjs          # PostCSS configuration
├── components.json             # shadcn/ui configuration
└── package.json                # Dependencies & scripts
```

---

## Configuration Files

### TypeScript (`tsconfig.json`)
- **Target**: ES2017
- **Module**: ESNext
- **JSX**: Preserve (Next.js handles compilation)
- **Strict Mode**: Enabled
- **Path Aliases**: `@/*` → `./src/*`
- **Excludes**: `node_modules`, `scripts`

### Tailwind CSS (`tailwind.config.ts`)
- **Version**: v4 (with PostCSS)
- **Custom Colors**:
  - `soft-cream`: `#FAF9F6`
  - `mineral-sage`: `#F6F7F6`
  - `warm-stone`: `#F2F0ED`
  - `spa-green`, `spa-yellow`, `spa-blue`, `spa-red`, `spa-purple` (legacy)
- **Font Families**:
  - `serif`: Playfair Display
  - `sans`: Inter
- **Primary Color**: Emerald 950 (`#064e3b`)
- **Content Paths**: `./src/**/*.{js,ts,jsx,tsx,mdx}`

### Next.js (`next.config.js`)
- **Minimal Config**: Default configuration (no custom settings)
- **App Router**: Enabled (default in Next.js 14)

### Jest (`jest.config.js`)
- **Environment**: jsdom
- **Setup File**: `jest.setup.js`
- **Module Mapper**: `@/(.*)` → `src/$1`
- **Test Match**: `**/__tests__/**/*.[jt]s?(x)`, `**/?(*.)+(spec|test).[jt]s?(x)`
- **Max Workers**: 1 (configured in package.json scripts)

---

## Data Structure

### Core Types (`src/types/spa.ts`)

#### `Spa` Interface
```typescript
interface Spa {
  id: number;                    // Unique identifier
  url: string;                   // URL slug (kebab-case)
  name: string;                  // Full spa name
  location: string;               // Location (e.g., "Windermere")
  address?: SpaAddress;          // Full address object
  metaDescription?: string;      // SEO meta description
  intro?: string;                // Multi-paragraph intro text
  websiteUrl: string;           // External website URL
  accessLabels: AccessLabel[];   // Array of access types
  imageSrc: string;             // Image path (from /public)
  imageAlt: string;             // Image alt text
  keyFeatures: string[];         // Array of key features (3 shown)
  thermalFacilities: ThermalFacility[]; // Thermal suite facilities
  poolFeatures: PoolFeature[];   // Pool & water features
  accessPolicy: AccessPolicy[];  // Detailed access policies
  facilities: {                  // Boolean facility flags
    sauna: boolean;
    steamRoom: boolean;
    iceRoom: boolean;
    hotTub: boolean;
    indoorPool: boolean;
    outdoorPool: boolean;
    coldPlunge: boolean;
    thermalSuite: boolean;
    infraredSauna: boolean;
  };
  agePolicy?: string;            // Age restriction policy
  relatedSpas: number[];         // Array of related spa IDs
  treatmentBookingUrl?: string; // Optional booking URL
}
```

#### `AccessLabel` Type
```typescript
type AccessLabel =
  | 'free-for-all-guests'
  | 'free-for-some-rooms'
  | 'paid-for-guests'
  | 'day-passes-available'
  | 'no-day-passes-available';
```

#### `Treatment` Interface
```typescript
interface Treatment {
  spaId: number;
  name: string;
  description: string;
  shortDescription: string;
  duration: string;
  brand?: string;
  category: TreatmentCategory; // 'Massage Therapies' | 'Facial Treatments' | etc.
}
```

### Data Files

#### `src/data/spas.ts`
- **Type**: Array of `Spa` objects
- **Count**: 17+ spa entries
- **Structure**: Static TypeScript array export
- **Usage**: Imported as `spaData` throughout the app

#### `src/data/treatments/`
- **Structure**: Individual files per spa (`spa-1-treatments.ts`, etc.)
- **Aggregator**: `index.ts` exports all treatments
- **Format**: Array of `Treatment` objects grouped by spa ID

---

## Component Architecture

### Page Components

#### Homepage (`src/app/page.tsx`)
- **Features**:
  - Filtering by access labels, location, facilities
  - Filter modal with backdrop blur
  - Sticky filter bar with count
  - Dynamic spa grid
- **State Management**: Client component with `useState` for filters
- **Data**: Filters `spaData` based on selected criteria

#### Spa Detail Page (`src/app/spa/[slug]/page.tsx`)
- **Route**: `/spa/[slug]`
- **Features**:
  - Dynamic metadata generation
  - Full spa information display
  - Related spas section
  - Navigation between spas
- **Components Used**: All spa detail components

#### About Page (`src/app/about/page.tsx`)
- **Route**: `/about`
- **Features**: Mission, problem/solution, target audience, creator story
- **Design**: Luxury editorial layout

### Reusable Components

#### Layout Components
- **`Header.tsx`**: Site header with logo, title, side menu button
- **`Footer.tsx`**: Site footer
- **`SideMenu.tsx`**: Right-side drawer menu with spa index

#### Filtering Components
- **`FilterButton.tsx`**: Minimal editorial filter trigger
- **`FilterModal.tsx`**: Custom modal with backdrop blur, filter options

#### Display Components
- **`SpaCard.tsx`**: Unified card component (used in grid & related)
- **`SpaGrid.tsx`**: Responsive grid of spa cards
- **`RelatedSpas.tsx`**: Related spas section

#### Spa Detail Components
- **`SpaHero.tsx`**: Hero image with gradient overlay
- **`QuickFactsBar.tsx`**: Overlapping facts bar (guest access, day passes, age policy)
- **`SpaIntroduction.tsx`**: Intro text with drop cap
- **`ThermalFacilities.tsx`**: Thermal suite facilities grid
- **`PoolFeatures.tsx`**: Pool features with horizontal cards
- **`Treatments.tsx`**: Expandable treatment cards by category
- **`AccessPolicy.tsx`**: Two-column policy layout
- **`BookVisitCTA.tsx`**: CTA section with emerald background
- **`SpaNavigation.tsx`**: Previous/Next spa navigation

---

## Styling System

### Design System
See `STYLE_GUIDE.md` for complete design system documentation.

**Key Points**:
- **Typography**: Playfair Display (serif) for headings, Inter (sans) for body
- **Colors**: Emerald 950 (primary), Amber 600/700 (accent), Stone palette (neutrals)
- **Backgrounds**: Soft Cream, Mineral Sage, Warm Stone
- **No Hover Effects**: Static states only (except modals/accordions)
- **Spacing**: Generous padding (`py-32` for sections)
- **Borders**: Rounded corners (`rounded-2xl` to `rounded-3xl`)

### Font Configuration
- **Playfair Display**: Loaded via `next/font/google` in `layout.tsx`
- **Inter**: Loaded via `next/font/google` in `layout.tsx`
- **CSS Variables**: `--font-playfair`, `--font-inter`
- **Tailwind Classes**: `font-serif`, `font-sans`

### Custom Colors
Defined in `tailwind.config.ts`:
- `soft-cream`: `#FAF9F6`
- `mineral-sage`: `#F6F7F6`
- `warm-stone`: `#F2F0ED`

---

## Routing & Navigation

### Routes
- `/` - Homepage with filtering
- `/about` - About page
- `/spa/[slug]` - Dynamic spa detail pages

### Dynamic Routes
- **Pattern**: `/spa/[slug]`
- **Slug Format**: Kebab-case (e.g., `lodore-falls-hotel-spa`)
- **Metadata**: Generated dynamically per spa
- **404 Handling**: Next.js default (spa not found)

### Navigation
- **Header**: Logo + title (links to home), menu button
- **Side Menu**: Full spa index grouped by location
- **Breadcrumbs**: On spa detail pages
- **Spa Navigation**: Previous/Next buttons on detail pages

---

## State Management

### Client-Side State
- **Homepage Filters**: `useState` for selected filters
- **Filter Modal**: `useState` for open/closed state
- **Side Menu**: `useState` for open/closed state
- **Treatment Cards**: `useState` for expanded/collapsed state
- **Image Errors**: `useState` for error handling

### No Global State
- No Redux, Zustand, or Context API
- Component-level state only
- URL-based routing for navigation

---

## Data Flow

### Homepage
1. `spaData` imported from `src/data/spas.ts`
2. Filters applied via `useMemo` (access labels, location, facilities)
3. Filtered results passed to `SpaGrid`
4. `SpaGrid` maps over spas and renders `SpaCard` components

### Spa Detail Page
1. Slug extracted from URL params
2. Spa found in `spaData` by matching `url` field
3. Treatments loaded from `treatments/index.ts` filtered by `spaId`
4. Related spas found by matching IDs in `relatedSpas` array
5. All data passed to detail components

### Filtering Logic
- **Access Labels**: Multiple selection (checkbox)
- **Location**: Single selection (radio/checkbox)
- **Facilities**: Multiple selection (checkbox)
- **Combination**: AND logic (all selected filters must match)

---

## Image Handling

### Image Optimization
- **Component**: `next/image`
- **Paths**: Relative to `/public` directory
- **Spa Images**: `/images/spas/lake-district-spas_*.jpg`
- **General Images**: `/images/*.jpg`
- **Aspect Ratios**: 
  - Hero: `aspect-[389/350]` (mobile), `aspect-[389/250]` (desktop)
  - Cards: `aspect-[7/6]`
  - About: `aspect-[4/5]`

### Image Error Handling
- Components use `useState` to track image errors
- Fallback to placeholder div with text
- Error state prevents infinite retry loops

---

## Testing

### Test Files
- **`spa-data.test.ts`**: Validates spa data structure and required fields
- **`filtering.test.ts`**: Tests filter logic and combinations
- **`spa-intro-validation.test.ts`**: Validates intro text matches data (facilities, policies, etc.)
- **`utils.test.ts`**: Tests utility functions

### Test Configuration
- **Framework**: Jest with React Testing Library
- **Environment**: jsdom
- **Setup**: `jest.setup.js` with `@testing-library/jest-dom`
- **Max Workers**: 1 (configured in scripts)

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

---

## Build & Deployment

### Build Scripts
```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint check
npm run typecheck # TypeScript type checking
```

### Build Output
- **Output Directory**: `.next/` (Next.js default)
- **Static Assets**: Optimized and served from `/public`
- **Image Optimization**: Automatic via Next.js Image component

### Environment Variables
- **`NEXT_PUBLIC_GA_MEASUREMENT_ID`**: Google Analytics ID (optional)
- **Location**: `.env.local` (not committed)

---

## SEO & Metadata

### Metadata Generation
- **Homepage**: Static metadata in `layout.tsx`
- **Spa Pages**: Dynamic metadata via `generateMetadata` function
- **About Page**: Static metadata in `page.tsx`

### Sitemap
- **File**: `src/app/sitemap.ts`
- **Routes**: Homepage, About page, all spa detail pages
- **Format**: XML sitemap
- **Update Frequency**: Monthly
- **Priority**: Homepage (1.0), About (0.8), Spas (0.9)

### Open Graph & Twitter Cards
- Configured in metadata objects
- Uses spa images and descriptions

---

## Performance Considerations

### Code Splitting
- Automatic via Next.js App Router
- Dynamic imports for heavy components (if needed)

### Image Optimization
- Next.js Image component with automatic optimization
- Lazy loading for below-fold images
- Responsive images with `sizes` prop

### Font Loading
- Google Fonts via `next/font` (optimized)
- `display: swap` for better performance
- CSS variables for font families

### State Management
- `useMemo` for expensive computations (filtering, grouping)
- Minimal re-renders with proper React patterns

---

## Accessibility

### Semantic HTML
- Proper heading hierarchy (h1, h2, h3)
- Semantic elements (`<article>`, `<section>`, `<nav>`)
- ARIA labels where needed

### Keyboard Navigation
- All interactive elements keyboard accessible
- Focus states maintained (browser default or custom)

### Color Contrast
- WCAG AA/AAA compliant
- Stone palette for text ensures readability
- Amber accents meet contrast requirements

### Screen Readers
- Alt text for all images
- Descriptive link text
- ARIA attributes where necessary

---

## Browser Support

### Modern Browsers
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Features Used
- CSS Grid & Flexbox
- CSS Custom Properties
- ES6+ JavaScript
- Next.js App Router (requires modern browser)

---

## Dependencies Overview

### Production Dependencies
- **Next.js**: Framework
- **React**: UI library
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Tailwind utilities**: Styling helpers

### Development Dependencies
- **TypeScript**: Type checking
- **Jest & Testing Library**: Testing
- **ESLint**: Code linting
- **Tailwind CSS**: Styling framework
- **Husky**: Git hooks

---

## Key Utilities

### `src/lib/utils.ts`
- **`getBadgeClasses()`**: Returns Tailwind classes for access label badges
- **`cn()`**: Class name utility (likely from shadcn/ui)

### Component Utilities
- **Icon Mapping**: `getPolicyIcon()` in `AccessPolicy.tsx`
- **Treatment Grouping**: Logic in `Treatments.tsx`
- **Spa Grouping**: `useMemo` in `SideMenu.tsx` for location grouping

---

## Data Validation

### Test Coverage
- **Data Structure**: All spas have required fields
- **Intro Text**: Validates mentions match actual data
- **Filtering**: Ensures filter logic works correctly
- **Relationships**: Related spas exist and are valid

### Validation Rules
- Intro text must match facility counts
- Age policy mentions must match `agePolicy` field
- Access label mentions must match `accessLabels` array
- Treatment counts must match data

---

## Known Issues & Limitations

### Current Limitations
- **Static Data**: All data is static (no CMS or API)
- **No Search**: Filtering only, no text search
- **No User Accounts**: No saved favorites or preferences
- **No Booking**: Links to external websites only

### Technical Notes
- **Jest Warning**: Lockfile patching warning (non-critical)
- **Image Paths**: Some images may need path corrections
- **Font Loading**: Playfair Display and Inter loaded via Next.js fonts

---

## Development Workflow

### Getting Started
```bash
npm install
npm run dev
```

### Making Changes
1. Edit component files in `src/components/`
2. Update data in `src/data/spas.ts` or treatment files
3. Run tests: `npm test`
4. Check types: `npm run typecheck`
5. Lint: `npm run lint`

### Adding a New Spa
1. Add entry to `src/data/spas.ts`
2. Create treatment file in `src/data/treatments/` (if needed)
3. Add image to `public/images/spas/`
4. Update `sitemap.ts` (automatic if using dynamic generation)
5. Run tests to validate data

### Component Development
- Follow design system in `STYLE_GUIDE.md`
- Use Tailwind utility classes
- No hover effects (static states)
- Use serif font for headings (`font-serif`)
- Use stone palette for colors

---

## File Naming Conventions

### Components
- **PascalCase**: `SpaCard.tsx`, `FilterModal.tsx`
- **Location**: `src/components/`

### Pages
- **lowercase**: `page.tsx`
- **Location**: `src/app/[route]/page.tsx`

### Types
- **PascalCase**: `Spa`, `Treatment`, `AccessLabel`
- **Location**: `src/types/`

### Data
- **camelCase**: `spas.ts`, `spa-1-treatments.ts`
- **Location**: `src/data/`

### Tests
- **kebab-case**: `spa-data.test.ts`
- **Location**: `src/__tests__/`

---

## Git Hooks

### Husky
- **Setup**: `npm run prepare` (runs on install)
- **Purpose**: Pre-commit hooks for code quality
- **Configuration**: `.husky/` directory

---

## Environment Setup

### Required
- Node.js 20+
- npm (or yarn/pnpm)
- Git

### Optional
- VS Code (recommended)
- ESLint extension
- Prettier (if configured)

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga-id
```

---

## Deployment

### Recommended Platform
- **Vercel**: Optimized for Next.js
- **Netlify**: Alternative option
- **Self-hosted**: Node.js server required

### Build Process
1. `npm run build` - Creates optimized production build
2. `.next/` directory contains build output
3. Static assets served from `/public`

### Environment Variables
- Set in deployment platform
- `NEXT_PUBLIC_*` variables exposed to client
- Other variables server-only

---

## Performance Metrics

### Lighthouse Targets
- **Performance**: 90+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Optimization Strategies
- Image optimization via Next.js Image
- Font optimization via `next/font`
- Code splitting via App Router
- Static generation where possible

---

## Security Considerations

### Client-Side
- No sensitive data exposed
- External links use `rel="noopener noreferrer"`
- No user input (static site)

### Dependencies
- Regular updates via `npm audit`
- No known vulnerabilities (as of last check)

---

## Future Enhancements (Potential)

### Features
- Text search functionality
- User favorites/bookmarks
- Comparison tool
- Map view
- Reviews/ratings
- Booking integration

### Technical
- CMS integration
- API endpoints
- Database migration
- Analytics dashboard
- A/B testing

---

## Contact & Support

### Project Structure
- **Main Data**: `src/data/spas.ts`
- **Components**: `src/components/`
- **Types**: `src/types/spa.ts`
- **Styles**: `tailwind.config.ts`, `src/app/globals.css`

### Documentation
- **Style Guide**: `STYLE_GUIDE.md`
- **Technical Docs**: This file
- **README**: `README.md` (basic Next.js info)

---

## Quick Reference

### Import Paths
```typescript
import { Spa } from '@/types/spa';
import { spaData } from '@/data/spas';
import SpaCard from '@/components/SpaCard';
```

### Common Patterns
```typescript
// Filter spas
const filtered = spaData.filter(spa => 
  selectedAccessLabels.every(label => 
    spa.accessLabels.includes(label)
  )
);

// Find spa by slug
const spa = spaData.find(s => s.url === slug);

// Get treatments for spa
const treatments = allTreatments.filter(t => t.spaId === spa.id);
```

### Tailwind Classes
```typescript
// Serif heading
className="font-serif text-4xl text-stone-900"

// Background colors
className="bg-soft-cream" // #FAF9F6
className="bg-mineral-sage" // #F6F7F6
className="bg-warm-stone" // #F2F0ED

// Primary color
className="bg-emerald-950" // #064e3b
className="text-amber-600" // Accent
```

---

*Last Updated: 2024*
*Version: 1.0*
*For AI Review & Development Reference*

