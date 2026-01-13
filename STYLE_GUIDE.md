# Lake District Spas - Style Guide

A comprehensive guide to the luxury and relaxing design system for Lake District Spas.

---

## Design Philosophy

Lake District Spas embodies a **luxury editorial aesthetic** that reflects the serene, natural beauty of the Lake District. The design prioritizes:

- **Elegance over flashiness** - Subtle, refined visual elements
- **Clarity and readability** - Generous spacing and thoughtful typography
- **Natural warmth** - Stone and earth tones that evoke the landscape
- **Editorial sophistication** - Magazine-inspired layouts and typography
- **Peaceful tranquility** - No distracting hover effects or animations

---

## Typography

### Font Families

#### Serif (Headings)

- **Font**: Playfair Display
- **Usage**: All headings (H1, H2, H3, H4)
- **Tailwind Class**: `font-serif`
- **Characteristics**: Elegant, editorial, sophisticated

**Example Sizes:**

- Hero H1: `text-5xl md:text-7xl lg:text-8xl`
- Section H2: `text-4xl md:text-5xl` or `text-4xl md:text-6xl`
- Card H3: `text-2xl` or `text-3xl`
- Small Headings: `text-xl`

#### Sans-Serif (Body)

- **Font**: Inter
- **Usage**: Body text, labels, descriptions
- **Tailwind Class**: `font-sans` (default)
- **Characteristics**: Clean, readable, modern

**Example Sizes:**

- Body Text: `text-lg` or `text-base`
- Small Text: `text-sm`
- Labels: `text-xs` or `text-[10px]`

### Typography Scale

```css
/* Headings */
.text-8xl    /* 96px - Hero headlines */
/* 96px - Hero headlines */
/* 96px - Hero headlines */
/* 96px - Hero headlines */
.text-7xl    /* 72px - Large hero */
.text-6xl    /* 60px - Major sections */
.text-5xl    /* 48px - Section headings */
.text-4xl    /* 36px - Subsection headings */
.text-3xl    /* 30px - Card titles */
.text-2xl    /* 24px - Card subtitles */
.text-xl     /* 20px - Small headings */

/* Body */
.text-lg     /* 18px - Large body text */
.text-base   /* 16px - Standard body */
.text-sm     /* 14px - Small text */
.text-xs     /* 12px - Labels */
.text-[10px]; /* 10px - Ultra-small labels */
```

### Typography Styles

#### Decorative Labels

- **Size**: `text-xs` or `text-[10px]`
- **Weight**: `font-bold` or `font-black`
- **Transform**: `uppercase`
- **Tracking**: `tracking-[0.4em]` or `tracking-widest`
- **Color**: `text-amber-700` or `text-amber-500`

#### Drop Caps

- **Size**: `first-letter:text-7xl md:first-letter:text-8xl`
- **Font**: `first-letter:font-serif`
- **Weight**: `first-letter:font-bold`
- **Color**: `first-letter:text-emerald-950`
- **Layout**: `first-letter:float-left first-letter:mr-6 first-letter:mt-4`

---

## Color Palette

### Primary Colors

#### Emerald (Primary)

- **Emerald 950**: `#064e3b` - Primary actions, dark backgrounds
- **Emerald 900**: `#064e3b` - Section headers, decorative elements
- **Emerald 50**: `#ecfdf5` - Light badge backgrounds
- **Usage**: Primary brand color, represents nature and tranquility

**Tailwind Classes:**

- `bg-emerald-950` - Dark backgrounds, buttons
- `text-emerald-900` - Headings, decorative text
- `bg-emerald-50` - Light badge backgrounds
- `border-emerald-200` - Badge borders

#### Amber (Accent)

- **Amber 700**: `#b45309` - Decorative lines, labels
- **Amber 600**: `#d97706` - Buttons, badges, highlights
- **Amber 500**: `#f59e0b` - Dots, subtle accents
- **Amber 200**: `#fde68a` - Light decorative elements
- **Usage**: Warm accents, highlights, call-to-action elements

**Tailwind Classes:**

- `text-amber-700` - Labels, decorative text
- `bg-amber-600` - Buttons, badges
- `text-amber-600` - Icons, accents
- `bg-amber-500` - Dots, small accents
- `bg-amber-200` - Light decorative backgrounds

### Neutral Colors (Stone Palette)

The stone palette provides warmth and sophistication, replacing cold greys.

#### Stone Scale

- **Stone 900**: `#0c0a09` - Primary text, dark elements
- **Stone 800**: `#292524` - Secondary text
- **Stone 700**: `#44403c` - Tertiary text
- **Stone 600**: `#57534e` - Body text
- **Stone 500**: `#78716c` - Muted text
- **Stone 400**: `#a8a29e` - Labels, subtle text
- **Stone 300**: `#d6d3d1` - Borders, dividers
- **Stone 200**: `#e7e5e4` - Light borders, dividers
- **Stone 100**: `#f5f5f4` - Subtle backgrounds
- **Stone 50**: `#fafaf9` - Card backgrounds

**Usage:**

- Text: `text-stone-900` (headings), `text-stone-600` (body), `text-stone-500` (muted)
- Borders: `border-stone-200`, `border-stone-100`
- Backgrounds: `bg-stone-50`, `bg-stone-100`

### Background Colors

#### Soft Cream

- **Hex**: `#FAF9F6`
- **Tailwind**: `bg-[#FAF9F6]`
- **Usage**: Section backgrounds, page backgrounds

#### Mineral Sage

- **Hex**: `#F6F7F6`
- **Tailwind**: `bg-[#F6F7F6]`
- **Usage**: Section backgrounds, menu backgrounds

#### Warm Stone

- **Hex**: `#F2F0ED`
- **Tailwind**: `bg-[#F2F0ED]`
- **Usage**: Section backgrounds

---

## Spacing

### Vertical Spacing

#### Section Padding

- **Large Sections**: `py-32` (128px)
- **Medium Sections**: `py-24` (96px)
- **Small Sections**: `py-12` (48px)

#### Content Spacing

- **Between Paragraphs**: `space-y-12` (48px)
- **Between Cards**: `gap-16` (64px) or `gap-8` (32px)
- **Between Items**: `space-y-6` (24px) or `space-y-4` (16px)

#### Component Padding

- **Cards**: `p-6` (24px) or `p-8` (32px) or `p-10` (40px)
- **Buttons**: `px-10 py-5` (40px × 20px)
- **Modal Content**: `px-8 py-10` (32px × 40px)

### Horizontal Spacing

#### Container Padding

- **Mobile**: `px-4` (16px)
- **Desktop**: `px-8` (32px) or `px-6` (24px)

#### Grid Gaps

- **Vertical**: `gap-y-16` (64px)
- **Horizontal**: `gap-x-8` (32px)

---

## Borders & Dividers

### Border Radius

- **Cards**: `rounded-2xl` (16px) or `rounded-3xl` (24px)
- **Buttons**: `rounded-full` (9999px)
- **Badges**: `rounded-full` (9999px)
- **Images**: `rounded-[2rem]` (32px)
- **Modals**: `rounded-[2.5rem]` (40px) on desktop

### Border Styles

- **Card Borders**: `border border-stone-200` or `border-stone-100`
- **Section Borders**: `border-y border-stone-200/50`
- **Dividers**: `border-t border-stone-100` or `border-stone-200`

### Decorative Lines

**Horizontal Lines:**

- **Thin**: `h-px w-8 bg-amber-700 opacity-30`
- **Medium**: `h-px w-12 bg-amber-700 opacity-30`
- **Wide**: `h-px w-24 bg-amber-700` or `bg-amber-200`

**Usage**: Above section headings, between content sections

---

## Shadows

### Shadow Scale

- **Subtle**: `shadow-sm` - Cards, images
- **Medium**: `shadow-xl` - Buttons, modals
- **Large**: `shadow-2xl` - Hero images, major elements

**Colored Shadows:**

- `shadow-emerald-950/20` - Emerald buttons

---

## Components

### Cards

#### Standard Card

```css
bg-white
p-6 md:p-8
rounded-2xl md:rounded-3xl
border border-stone-200/60
shadow-sm
```

#### Feature Card

```css
bg-white
p-10
rounded-3xl
border border-stone-100
shadow-sm
```

### Badges

#### Access Badge

```css
px-3 py-1.5
rounded-full
text-xs font-semibold
bg-[color]-50
text-black
border border-[color]-200
```

**Color Variants:**

- Emerald: `bg-emerald-50 text-black border-emerald-200`
- Amber: `bg-amber-50 text-black border-amber-200`
- Purple: `bg-purple-50 text-black border-purple-200`
- Red: `bg-red-50 text-black border-red-200`
- Blue: `bg-blue-50 text-black border-blue-200`

### Buttons

#### Primary Button

```css
px-10 py-5
bg-emerald-950
text-white
rounded-full
font-bold
text-xs
uppercase
tracking-widest
shadow-xl
```

#### Accent Button

```css
px-10 py-5
bg-amber-600
text-stone-50
rounded-full
font-bold
text-xs
uppercase
tracking-widest
shadow-xl
```

**Note**: No hover effects - buttons remain static

### Section Headers

#### Standard Section Header

```html
<div className="flex items-center space-x-4 mb-6">
  <div className="h-px w-12 bg-amber-700 opacity-30" />
  <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
    Section Label
  </span>
</div>
<h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
  Section Title
</h2>
```

### Decorative Elements

#### Icon Badges

```css
h-16 w-16
rounded-full
bg-white
flex items-center justify-center
text-amber-700
shadow-sm
border border-stone-100
```

#### Amber Dots (Bullet Points)

```css
h-1 w-1
rounded-full
bg-amber-500/60
```

---

## Layout Patterns

### Full-Width Sections

Sections that break out of container:

```css
-mx-4 md:-mx-8
px-4 md:px-8
w-screen
relative
left-1/2
-translate-x-1/2
```

### Container Width

Standard content container:

```css
container
mx-auto
px-4 md:px-8
```

### Grid Layouts

#### Two-Column Grid

```css
grid grid-cols-1 md:grid-cols-2
gap-8
```

#### Three-Column Grid

```css
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
gap-y-16 gap-x-8
```

---

## Interactive Elements

### No Hover Effects

**Design Principle**: All interactive elements remain static. No color changes, transforms, or animations on hover.

**Exceptions**:

- Modal open/close transitions (backdrop, drawer slide)
- Expandable content (treatments, accordions)

### Links

- **Text Links**: `text-stone-900 font-semibold`
- **No Underlines**: Links use color and weight for distinction
- **Icon Links**: Include chevron or arrow icons

### Modals

#### Backdrop

```css
fixed inset-0 z-[100]
bg-stone-900/40
backdrop-blur-md
```

#### Modal Container

```css
w-full h-full md:h-auto
md:max-w-2xl
bg-white
md:rounded-[2.5rem]
shadow-2xl
overflow-hidden
flex flex-col
md:max-h-[90vh]
```

---

## Image Styling

### Aspect Ratios

- **Hero Images**: `aspect-[389/350] md:aspect-[389/250] lg:h-[500px]`
- **Spa Cards**: `aspect-[7/6]`
- **Related Spas**: `aspect-[7/6]`
- **About Page**: `aspect-[4/5]`

### Image Effects

- **Gradient Overlay**: `bg-gradient-to-t from-stone-900/50 via-transparent to-transparent opacity-60`
- **Rounded Corners**: `rounded-[2rem]` or `rounded-3xl`
- **Borders**: `border border-stone-100`
- **Shadows**: `shadow-sm`

---

## Accessibility

### Color Contrast

- **Text on White**: `text-stone-900` (WCAG AAA)
- **Text on Dark**: `text-stone-50` or `text-white` (WCAG AAA)
- **Labels**: `text-stone-400` or `text-amber-700` (WCAG AA)

### Focus States

- Maintain visible focus indicators for keyboard navigation
- Use browser default focus styles or custom amber focus rings

### Typography

- **Minimum Body Size**: `text-base` (16px)
- **Line Height**: `leading-relaxed` for body text
- **Letter Spacing**: Generous tracking for uppercase labels

---

## Design Tokens Summary

### Typography

- **Heading Font**: Playfair Display (`font-serif`)
- **Body Font**: Inter (`font-sans`)
- **Label Style**: Uppercase, wide tracking, small size

### Colors

- **Primary**: Emerald 950/900
- **Accent**: Amber 600/700
- **Neutrals**: Stone palette (50-900)
- **Backgrounds**: Soft Cream, Mineral Sage, Warm Stone

### Spacing

- **Sections**: `py-32`
- **Cards**: `p-6` to `p-10`
- **Gaps**: `gap-8` to `gap-16`

### Borders

- **Radius**: `rounded-2xl` to `rounded-3xl`
- **Style**: `border-stone-200` or `border-stone-100`
- **Decorative Lines**: Amber with opacity

### Effects

- **Shadows**: `shadow-sm` to `shadow-2xl`
- **No Hover Effects**: Static states only
- **Backdrop Blur**: For modals

---

## Usage Examples

### Hero Section

```tsx
<section className="relative">
  <div className="relative aspect-[389/350] md:aspect-[389/250] lg:h-[500px] rounded-t-2xl overflow-hidden shadow-2xl">
    <Image
      src={spa.images[0].src}
      alt={spa.images[0].alt}
      fill
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent" />
  </div>
  <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-stone-50">
    Spa Name
  </h1>
</section>
```

### Section with Decorative Header

```tsx
<section className="bg-[#FAF9F6] py-32">
  <div className="container mx-auto px-4 md:px-8">
    <div className="flex items-center space-x-4 mb-6">
      <div className="h-px w-12 bg-amber-700 opacity-30" />
      <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
        Section Label
      </span>
    </div>
    <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
      Section Title
    </h2>
  </div>
</section>
```

### Card Component

```tsx
<div className="bg-white p-8 rounded-3xl border border-stone-200/60 shadow-sm">
  <div className="mb-6 p-4 bg-stone-50 rounded-2xl w-fit text-amber-700">
    <Icon className="h-6 w-6" />
  </div>
  <h3 className="font-serif text-2xl text-stone-900 mb-4">Card Title</h3>
  <p className="text-stone-500 text-base font-light leading-relaxed">
    Card description
  </p>
</div>
```

---

## Brand Guidelines

### Do's ✅

- Use serif font for all headings
- Apply generous spacing (py-32 for sections)
- Use stone palette for text and backgrounds
- Include decorative amber lines above section headers
- Maintain static states (no hover effects)
- Use rounded corners (rounded-2xl to rounded-3xl)
- Apply subtle shadows (shadow-sm to shadow-xl)

### Don'ts ❌

- Don't use hover color changes or transforms
- Don't use cold greys (use stone palette instead)
- Don't use sans-serif for headings
- Don't use tight spacing
- Don't use sharp corners (avoid rounded-none)
- Don't use bright, saturated colors
- Don't add animations or transitions (except modals)

---

## Implementation Notes

### Tailwind Configuration

Ensure these fonts are configured in `tailwind.config.js`:

```js
fontFamily: {
  serif: ['Playfair Display', 'serif'],
  sans: ['Inter', 'sans-serif'],
}
```

### Custom Colors

Custom background colors are defined inline:

- `bg-[#FAF9F6]` - Soft Cream
- `bg-[#F6F7F6]` - Mineral Sage
- `bg-[#F2F0ED]` - Warm Stone

### Responsive Breakpoints

- **Mobile**: Default (< 640px)
- **Tablet**: `md:` (≥ 768px)
- **Desktop**: `lg:` (≥ 1024px)

---

_Last Updated: 2024_
_Version: 1.0_
