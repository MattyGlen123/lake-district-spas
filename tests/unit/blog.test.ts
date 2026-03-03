import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import { getAllBlogPosts, getBlogPostBySlug, getRelatedPosts } from '@/lib/blog';

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}));

const TODAY = '2026-03-02';
/** readdirSync has multiple overloads; mock infers Dirent[] but we return string[] (no withFileTypes) */
const asReadDirResult = (arr: string[]) => arr as unknown as ReturnType<typeof fs.readdirSync>;
const PAST = '2020-06-15';
const FUTURE = '2099-12-31';

/** Build a minimal MDX file string with YAML frontmatter */
const makeMdx = (
  slug: string,
  overrides: Record<string, unknown> = {},
  body = 'Hello world content here.',
) => {
  const meta = {
    title: `Post: ${slug}`,
    excerpt: 'A test post.',
    publishedAt: PAST,
    category: 'guides',
    tags: [],
    featuredImage: '/images/blog/test.jpg',
    featuredImageAlt: 'Test image',
    ...overrides,
  };
  const frontmatter = Object.entries(meta)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n');
  return `---\n${frontmatter}\n---\n${body}`;
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(TODAY));
  vi.mocked(fs.existsSync).mockReturnValue(true);
  vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult([]));
  vi.mocked(fs.readFileSync).mockReturnValue('');
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
});

// ─── getAllBlogPosts ─────────────────────────────────────────────────────────

describe('getAllBlogPosts()', () => {
  it('returns only posts with publishedAt on or before today', () => {
    vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult(['published.mdx', 'future.mdx']));
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      if (String(filePath).includes('future')) return makeMdx('future', { publishedAt: FUTURE });
      return makeMdx('published', { publishedAt: PAST });
    });

    const posts = getAllBlogPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe('published');
  });

  it('includes a post published exactly today', () => {
    vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult(['today.mdx']));
    vi.mocked(fs.readFileSync).mockReturnValue(makeMdx('today', { publishedAt: TODAY }));

    const posts = getAllBlogPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe('today');
  });

  it('excludes a post published one day in the future', () => {
    vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult(['tomorrow.mdx']));
    vi.mocked(fs.readFileSync).mockReturnValue(makeMdx('tomorrow', { publishedAt: '2026-03-03' }));

    const posts = getAllBlogPosts();
    expect(posts).toHaveLength(0);
  });

  it('returns posts sorted newest first', () => {
    vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult(['old.mdx', 'new.mdx']));
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      if (String(filePath).includes('old')) return makeMdx('old', { publishedAt: '2021-01-01' });
      return makeMdx('new', { publishedAt: '2025-06-01' });
    });

    const posts = getAllBlogPosts();
    expect(posts[0].slug).toBe('new');
    expect(posts[1].slug).toBe('old');
  });

  it('returns empty array when blog directory does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getAllBlogPosts()).toEqual([]);
  });

  it('ignores non-.mdx files', () => {
    vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult(['post.mdx', 'image.png', '.DS_Store']));
    vi.mocked(fs.readFileSync).mockReturnValue(makeMdx('post'));

    const posts = getAllBlogPosts();
    expect(posts).toHaveLength(1);
  });

  it('attaches a readingTime string to each post', () => {
    vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult(['post.mdx']));
    vi.mocked(fs.readFileSync).mockReturnValue(makeMdx('post', {}, 'A '.repeat(200)));

    const posts = getAllBlogPosts();
    expect(posts).toHaveLength(1);
    const post = posts[0]!;
    expect(typeof post.readingTime).toBe('string');
    expect((post.readingTime ?? '').length).toBeGreaterThan(0);
  });

  it('strips .mdx extension to produce the slug', () => {
    vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult(['my-great-post.mdx']));
    vi.mocked(fs.readFileSync).mockReturnValue(makeMdx('my-great-post'));

    const posts = getAllBlogPosts();
    expect(posts[0].slug).toBe('my-great-post');
  });
});

// ─── getBlogPostBySlug ───────────────────────────────────────────────────────

describe('getBlogPostBySlug()', () => {
  it('returns null for a slug with no matching file', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getBlogPostBySlug('nonexistent-slug')).toBeNull();
  });

  it('returns the post with correct slug and content for a valid file', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(makeMdx('test-post', {}, 'Body content here.'));

    const post = getBlogPostBySlug('test-post');
    expect(post).not.toBeNull();
    expect(post!.slug).toBe('test-post');
    expect(post!.content).toContain('Body content here.');
  });

  it('returns correct metadata from frontmatter', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(
      makeMdx('meta-test', {
        title: 'My Test Post',
        category: 'locations',
        tags: ['spa', 'thermal'],
      }),
    );

    const post = getBlogPostBySlug('meta-test');
    expect(post!.title).toBe('My Test Post');
    expect(post!.category).toBe('locations');
    expect(post!.tags).toEqual(['spa', 'thermal']);
  });
});

// ─── getRelatedPosts ─────────────────────────────────────────────────────────

describe('getRelatedPosts()', () => {
  it('excludes the current post from results', () => {
    vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult(['current.mdx', 'other.mdx']));
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      if (String(filePath).includes('current')) return makeMdx('current', { category: 'guides', tags: [] });
      return makeMdx('other', { category: 'guides', tags: [] });
    });

    const related = getRelatedPosts('current');
    expect(related.every((p) => p.slug !== 'current')).toBe(true);
  });

  it('ranks same-category posts above unrelated posts (+2 score for category)', () => {
    vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult(['current.mdx', 'same-cat.mdx', 'diff-cat.mdx']));
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      const p = String(filePath);
      if (p.includes('current')) return makeMdx('current', { category: 'guides', tags: ['sauna'] });
      if (p.includes('same-cat')) return makeMdx('same-cat', { category: 'guides', tags: [] });
      return makeMdx('diff-cat', { category: 'locations', tags: [] });
    });

    const related = getRelatedPosts('current');
    expect(related[0].slug).toBe('same-cat');
  });

  it('ranks posts with more shared tags higher (+1 per shared tag)', () => {
    vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult(['current.mdx', 'two-tags.mdx', 'one-tag.mdx']));
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      const p = String(filePath);
      if (p.includes('current')) return makeMdx('current', { category: 'guides', tags: ['spa', 'thermal', 'sauna'] });
      if (p.includes('two-tags')) return makeMdx('two-tags', { category: 'locations', tags: ['spa', 'thermal'] });
      return makeMdx('one-tag', { category: 'locations', tags: ['sauna'] });
    });

    const related = getRelatedPosts('current');
    expect(related[0].slug).toBe('two-tags');
  });

  it('respects the limit parameter', () => {
    const slugs = ['a.mdx', 'b.mdx', 'c.mdx', 'd.mdx', 'current.mdx'];
    vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult(slugs));
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      const name = String(filePath).split('/').pop()!.replace('.mdx', '');
      return makeMdx(name, { category: 'guides', tags: [] });
    });

    expect(getRelatedPosts('current', 2)).toHaveLength(2);
  });

  it('defaults to a limit of 3', () => {
    const slugs = ['a.mdx', 'b.mdx', 'c.mdx', 'd.mdx', 'e.mdx', 'current.mdx'];
    vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult(slugs));
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      const name = String(filePath).split('/').pop()!.replace('.mdx', '');
      return makeMdx(name, { category: 'guides', tags: [] });
    });

    expect(getRelatedPosts('current')).toHaveLength(3);
  });

  it('returns empty array when the current slug does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getRelatedPosts('ghost-slug')).toEqual([]);
  });

  it('only returns posts that were published (not future-dated)', () => {
    vi.mocked(fs.readdirSync).mockReturnValue(asReadDirResult(['current.mdx', 'future.mdx']));
    vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown) => {
      if (String(filePath).includes('future')) return makeMdx('future', { publishedAt: FUTURE });
      return makeMdx('current', { category: 'guides', tags: [] });
    });

    // getRelatedPosts calls getAllBlogPosts() which filters by date
    const related = getRelatedPosts('current');
    expect(related.every((p) => p.slug !== 'future')).toBe(true);
  });
});
