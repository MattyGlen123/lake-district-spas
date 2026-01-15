# Blog Documentation

Complete guide to creating and managing blog posts for Lake District Spas.

---

## Overview

The blog system uses MDX files stored in `content/blog/` with frontmatter metadata. Images are stored in `public/images/blog/` with alt text managed in `public/images/blog/images.json`.

---

## Creating a New Blog Post

### 1. Create MDX File

Create a new `.mdx` file in `content/blog/` with the following naming convention:

- Use kebab-case: `my-blog-post-title.mdx`
- The filename becomes the URL slug automatically

### 2. Frontmatter Template

```yaml
---
title: 'Your Blog Post Title'
slug: your-blog-post-slug
excerpt: 'A compelling 1-2 sentence summary that appears in listings and meta descriptions.'
publishedAt: '2025-01-20' # YYYY-MM-DD format
author: 'Lake District Spas'
category: guides # One of: guides, comparisons, seasonal, facilities, locations
tags:
  - tag-1
  - tag-2
  - tag-3
featuredImage: /images/blog/lake-district-spas_blog-image-name.jpg
featuredImageAlt: 'Descriptive alt text for the featured image'
seoTitle: 'Optional SEO-optimized title (defaults to title if not provided)'
seoDescription: 'Optional SEO meta description (defaults to excerpt if not provided)'
relatedSpas:
  - spa-slug-1
  - spa-slug-2
---
```

### 3. Required Fields

- `title`: Post title
- `slug`: URL slug (usually matches filename)
- `excerpt`: Short summary (used in listings and meta descriptions)
- `publishedAt`: Publication date (YYYY-MM-DD)
- `author`: Author name
- `category`: One of the five categories
- `tags`: Array of relevant tags

### 4. Optional Fields

- `updatedAt`: Last update date (YYYY-MM-DD)
- `featuredImage`: Path to hero image
- `featuredImageAlt`: Alt text for featured image
- `seoTitle`: Custom SEO title
- `seoDescription`: Custom SEO description
- `relatedSpas`: Array of spa slugs mentioned in the article (used for RelatedSpas section)

---

## Using Blog Images

### Image Location

All blog images are stored in `public/images/blog/` directory.

### Image Naming Convention

Follow this naming pattern:

```
lake-district-spas_blog-[descriptive-name].jpg
```

Examples:

- `lake-district-spas_blog-outdoor-hot-tub-lakeside-morning.jpg`
- `lake-district-spas_blog-infinity-pool-lake-view.jpg`
- `lake-district-spas_blog-steam-room-luxury.jpg`

### Alt Text Management

**All alt text for blog images is stored in `public/images/blog/images.json`.**

This JSON file contains an array of objects with:

- `name`: The image filename
- `alt`: The descriptive alt text

Example:

```json
[
  {
    "name": "lake-district-spas_blog-outdoor-hot-tub-lakeside-morning.jpg",
    "alt": "Tranquil morning scene of outdoor hot tub on natural stone terrace overlooking misty Lake District lake, mature oak trees framing view of wooded hillside, serene spa setting capturing romantic atmosphere of Lake District outdoor thermal experiences"
  }
]
```

### Adding a New Image

1. **Add the image file** to `public/images/blog/`
2. **Add entry to `images.json`**:
   ```json
   {
     "name": "lake-district-spas_blog-your-image-name.jpg",
     "alt": "Detailed descriptive alt text following the established style - include location context, visual elements, and Lake District references"
   }
   ```
3. **Reference in MDX**:
   - For featured image: Use in frontmatter `featuredImage` field
   - For inline images: Use standard Markdown image syntax

### Using Images in MDX

#### Featured Image (Hero)

Set in frontmatter:

```yaml
featuredImage: /images/blog/lake-district-spas_blog-image-name.jpg
featuredImageAlt: 'Alt text for featured image'
```

#### Inline Images

Use standard Markdown image syntax:

```markdown
![Image description](/images/blog/lake-district-spas_blog-image-name.jpg 'Alt text in quotes')
```

**Note**: When using inline images, you can reference the alt text from `images.json` or provide your own. The MDX component will handle the image rendering automatically.

### Image Best Practices

1. **Alt Text Style**:

   - Be descriptive and specific
   - Include location context (Lake District)
   - Mention key visual elements
   - Follow the established style in `images.json`

2. **Image Selection**:

   - Use one image as the hero (featuredImage)
   - Add 1-2 images throughout the article to break up content
   - Choose images that enhance the article's message

3. **Image Placement**:
   - Hero image appears at the top of the post
   - Inline images work best after major sections
   - Avoid placing images too close together

---

## Writing Content

### MDX Support

The blog supports standard Markdown plus MDX features:

- **Headings**: `## H2`, `### H3` (automatically get anchor links)
- **Links**: Internal spa links use `/spa/spa-slug` format
- **Images**: Standard Markdown image syntax
- **Lists**: Bulleted and numbered lists
- **Blockquotes**: Styled automatically
- **Tables**: Supported for comparison content

### Custom Components

The MDX renderer includes custom components:

- **Headings**: Auto-generate anchor links
- **Links**: Automatically converts `/spa/...` links to Next.js Link components
- **Images**: Uses Next.js Image component with optimization
- **SpaCard**: Can embed spa cards using `<SpaCard spaSlug="spa-slug" />`

### Internal Linking

Link to spas using:

```markdown
[Armathwaite Hall](/spa/armathwaite-hall-hotel-spa)
```

The MDX renderer automatically converts these to proper Next.js links.

---

## Categories

Choose one of these categories:

- **guides**: How-to articles, tips, advice
- **comparisons**: Comparing spas, facilities, or features
- **seasonal**: Time-sensitive content (Mother's Day, anniversaries, etc.)
- **facilities**: Educational content about spa facilities
- **locations**: Location-specific guides (Windermere, Keswick, etc.)

---

## Related Spas

The `relatedSpas` field in frontmatter should include spa slugs (URLs) for spas mentioned in the article. The blog post page will automatically display a "Spas Mentioned in This Article" section with the first 2 spas.

Example:

```yaml
relatedSpas:
  - lodore-falls-spa
  - low-wood-bay-spa
  - armathwaite-hotel-spa
```

Only the first 2 will be displayed in the RelatedSpas section.

---

## Publishing Workflow

### 1. Draft Your Post

Create the MDX file with a future `publishedAt` date to keep it hidden until ready.

### 2. Add Images

- Add image files to `public/images/blog/`
- Add entries to `images.json` with alt text
- Reference images in your MDX

### 3. Review

- Check all links work
- Verify spa slugs are correct
- Ensure images display properly
- Review alt text for accuracy

### 4. Publish

Update `publishedAt` to today's date (or past date) to make it visible. Posts are automatically sorted by date (newest first).

---

## Content Calendar

Track planned posts in `data/blog-topics.json`. This file includes:

- Topic ideas
- Target keywords
- Priority levels
- Status tracking
- Related spas
- Publishing schedule

---

## SEO Best Practices

1. **Title**: Include target keyword naturally
2. **Excerpt**: Compelling summary with keyword
3. **Meta Description**: Use `seoDescription` if different from excerpt
4. **Headings**: Use H2/H3 with keywords where appropriate
5. **Internal Links**: Link to relevant spas and other blog posts
6. **Alt Text**: Descriptive alt text for all images
7. **Related Spas**: Include relevant spa slugs for internal linking

---

## Examples

### Example Frontmatter

```yaml
---
title: 'Spa Access Included vs Extra Charge: Your Lake District Guide'
slug: spa-access-included-vs-extra-charge
excerpt: "The most confusing part of booking a Lake District spa break is figuring out if you'll pay extra to use the spa. Here's what you need to know before you book."
publishedAt: '2025-01-20'
author: 'Lake District Spas'
category: guides
tags:
  - spa access
  - pricing
  - booking tips
  - first timers
featuredImage: /images/blog/article-2/lake-district-spas_blog-outdoor-hot-tub-lakeside-morning.jpg
featuredImageAlt: 'Tranquil morning scene of outdoor hot tub on natural stone terrace overlooking misty Lake District lake, mature oak trees framing view of wooded hillside, serene spa setting capturing romantic atmosphere of Lake District outdoor thermal experiences'
seoTitle: 'Spa Access Included or Extra? Lake District Spa Pricing Guide'
seoDescription: 'Find out which Lake District spas include spa access with your room and which charge extra. Avoid surprise costs on your spa break.'
relatedSpas:
  - lodore-falls-spa
  - low-wood-bay-spa
  - armathwaite-hall-hotel-spa
---
```

### Example Inline Image

```markdown
![Infinity pool with lake view](/images/blog/article-1/lake-district-spas_blog-infinity-pool-lake-view.jpg 'Luxurious infinity pool edge merging with Lake District lake view, wooden loungers positioned on deck, mature trees framing panoramic vista of wooded fells, capturing aspirational outdoor spa luxury in the Lake District')
```

---

## Troubleshooting

### Image Not Displaying

1. Check the path is correct (starts with `/images/blog/`)
2. Verify the image file exists in `public/images/blog/`
3. Check the filename matches exactly (case-sensitive)

### Alt Text Not Found

1. Verify the image entry exists in `images.json`
2. Check the filename matches exactly (including extension)
3. For featured images, use `featuredImageAlt` in frontmatter

### Post Not Appearing

1. Check `publishedAt` date is in the past
2. Verify the file is in `content/blog/` directory
3. Ensure the file has `.mdx` extension
4. Check frontmatter is valid YAML

---

## File Structure

```
content/
└── blog/
    └── your-post-slug.mdx

public/
└── images/
    └── blog/
        ├── images.json (alt text for all images)
        └── lake-district-spas_blog-*.jpg (image files)

data/
└── blog-topics.json (content calendar)

blog.md (this file - root directory)
```

---

_Last Updated: 2025-01-20_
