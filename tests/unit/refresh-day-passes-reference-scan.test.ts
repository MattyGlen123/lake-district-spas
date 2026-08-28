// Shared reference scanner for /refresh-day-passes (issue 14).
//
// The bug this module fixes is invisible at runtime: `getDayPassPrice` returns
// null for an unknown id and every call site falls back to a hardcoded literal,
// so a reference the scanner misses produces NO build error and NO test failure
// — it silently freezes a dead price into a live page. These tests are the only
// thing standing between a narrowed scan and that silent failure.
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  REFERENCE_TREES,
  walkTree,
  collectReferenceFiles,
  escapeRe,
  idReferencePattern,
  findIdReferences,
} from '../../.claude/skills/refresh-day-passes/scripts/reference-scan.mjs';

let repo: string;

/** Write a file, creating parent dirs. */
function put(rel: string, content: string) {
  const abs = join(repo, rel);
  mkdirSync(join(abs, '..'), { recursive: true });
  writeFileSync(abs, content);
  return abs;
}

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), 'refscan-'));
});

afterEach(() => {
  rmSync(repo, { recursive: true, force: true });
});

describe('REFERENCE_TREES', () => {
  it('covers every tree that can cite a day-pass id', () => {
    const dirs = REFERENCE_TREES.map((t) => t.dir);
    expect(dirs).toContain('content/blog');
    expect(dirs).toContain('src/data/faqs');
    expect(dirs).toContain('src/data/location-faqs');
    expect(dirs).toContain('src/app');
    expect(dirs).toContain('src/components');
  });

  // The regression that motivated the module: rename.mjs scanned two trees,
  // withdraw.mjs three, and the two lists drifted apart unnoticed.
  it('is a single source of truth, so rename and withdraw cannot drift apart', () => {
    expect(REFERENCE_TREES.length).toBeGreaterThanOrEqual(5);
    const dirs = REFERENCE_TREES.map((t) => t.dir);
    expect(new Set(dirs).size).toBe(dirs.length);
  });

  it('reads .ts as well as .tsx under the src trees', () => {
    for (const dir of ['src/data/faqs', 'src/data/location-faqs', 'src/app', 'src/components']) {
      const tree = REFERENCE_TREES.find((t) => t.dir === dir)!;
      expect(tree.exts).toContain('.tsx');
      expect(tree.exts).toContain('.ts');
    }
  });
});

describe('walkTree', () => {
  it('returns [] for a directory that does not exist rather than throwing', () => {
    expect(walkTree(join(repo, 'nope/not/here'), ['.tsx'])).toEqual([]);
  });

  it('recurses into subdirectories', () => {
    put('src/app/page.tsx', 'x');
    put('src/app/deep/nested/thing.tsx', 'x');
    const found = walkTree(join(repo, 'src/app'), ['.tsx']);
    expect(found).toHaveLength(2);
  });

  it('filters by extension', () => {
    put('src/app/page.tsx', 'x');
    put('src/app/styles.css', 'x');
    put('src/app/notes.md', 'x');
    expect(walkTree(join(repo, 'src/app'), ['.tsx'])).toHaveLength(1);
  });

  it('skips node_modules and dotfiles', () => {
    put('src/app/page.tsx', 'x');
    put('src/app/node_modules/dep/index.tsx', 'x');
    put('src/app/.hidden/secret.tsx', 'x');
    expect(walkTree(join(repo, 'src/app'), ['.tsx'])).toHaveLength(1);
  });
});

describe('collectReferenceFiles', () => {
  it('reads files from every configured tree', () => {
    put('content/blog/post.mdx', 'blog');
    put('src/data/faqs/spa-5-faqs.tsx', 'faq');
    put('src/data/location-faqs/newby-bridge-faqs.tsx', 'locfaq');
    put('src/app/page.tsx', 'app');
    put('src/components/Thing.tsx', 'component');

    const files = collectReferenceFiles(repo);
    const paths = files.map((f) => f.path).sort();

    expect(paths).toEqual([
      'content/blog/post.mdx',
      'src/app/page.tsx',
      'src/components/Thing.tsx',
      'src/data/faqs/spa-5-faqs.tsx',
      'src/data/location-faqs/newby-bridge-faqs.tsx',
    ]);
  });

  it('returns repo-relative path, absolute path and content', () => {
    put('src/app/page.tsx', 'hello');
    const [file] = collectReferenceFiles(repo);
    expect(file.path).toBe('src/app/page.tsx');
    expect(file.absPath).toBe(join(repo, 'src/app/page.tsx'));
    expect(file.content).toBe('hello');
  });

  it('does not fall over when optional trees are absent', () => {
    put('src/app/page.tsx', 'app');
    expect(() => collectReferenceFiles(repo)).not.toThrow();
    expect(collectReferenceFiles(repo)).toHaveLength(1);
  });

  it('never returns the same file twice', () => {
    put('src/app/page.tsx', 'app');
    const files = collectReferenceFiles(repo, {
      trees: [
        { dir: 'src/app', exts: ['.tsx'] },
        { dir: 'src/app', exts: ['.tsx'] },
      ],
    });
    expect(files).toHaveLength(1);
  });
});

describe('escapeRe', () => {
  it('escapes regex metacharacters so ids are matched literally', () => {
    expect(escapeRe('a.b*c')).toBe('a\\.b\\*c');
  });
});

describe('idReferencePattern / findIdReferences', () => {
  const ID = 'swan-twilight-sessions-weekday';

  it('matches a single-quoted id literal', () => {
    const hits = findIdReferences(`getDayPassPrice(swan.id, '${ID}')`, ID, 'f.tsx');
    expect(hits).toHaveLength(1);
  });

  it('matches a double-quoted id literal', () => {
    const hits = findIdReferences(`<DayPassLink dayPassId="${ID}">`, ID, 'f.mdx');
    expect(hits).toHaveLength(1);
  });

  it('matches an anchor fragment', () => {
    const hits = findIdReferences(`href={\`/spa/x#${ID}\`}`, ID, 'f.tsx');
    expect(hits).toHaveLength(1);
  });

  it('matches a bare array element, as found in src/app', () => {
    // src/app/page.tsx cites ids as plain array members, not as call args —
    // the quoted-literal rule covers this without a special case.
    const hits = findIdReferences(`  '${ID}',`, ID, 'src/app/page.tsx');
    expect(hits).toHaveLength(1);
  });

  it('reports file, 1-indexed line and trimmed context', () => {
    const content = ['line one', 'line two', `   const p = '${ID}';   `].join('\n');
    const hits = findIdReferences(content, ID, 'src/app/page.tsx');
    expect(hits).toEqual([
      { file: 'src/app/page.tsx', line: 3, context: `const p = '${ID}';` },
    ]);
  });

  it('finds every occurrence across multiple lines', () => {
    const content = [`'${ID}'`, 'nothing', `#${ID}`].join('\n');
    expect(findIdReferences(content, ID, 'f.tsx')).toHaveLength(2);
  });

  it('does not match an unquoted substring of a longer id', () => {
    // `…-weekday` must not match inside `…-weekday-extra`.
    const hits = findIdReferences(`'${ID}-extra'`, ID, 'f.tsx');
    expect(hits).toHaveLength(0);
  });

  it('does not match the id as bare prose', () => {
    const hits = findIdReferences(`the ${ID} pass is nice`, ID, 'f.tsx');
    expect(hits).toHaveLength(0);
  });

  it('returns a fresh, non-sticky pattern each call', () => {
    const a = idReferencePattern(ID);
    const b = idReferencePattern(ID);
    expect(a).not.toBe(b);
    expect(a.lastIndex).toBe(0);
  });
});

// The exact shape that broke on the Swan run (2026-08-28). Renaming
// `swan-twilight-sessions-weekday` left two live references in
// src/data/location-faqs/ — a tree rename.mjs did not scan — and two more in
// src/app/ that survived only because a different pass was not renamed.
describe('regression: the Swan 2026-08-28 blind spot', () => {
  const RENAMED = 'swan-twilight-sessions-weekday';
  const UNRENAMED = 'swan-champagne-truffle-spa-day';

  beforeEach(() => {
    put(
      'src/data/location-faqs/newby-bridge-faqs.tsx',
      [
        `    ? getDayPassPrice(swan.id, '${RENAMED}')`,
        `            href={\`/spa/\${swan?.url}#${RENAMED}\`}`,
      ].join('\n'),
    );
    put('src/app/page.tsx', `            '${UNRENAMED}',`);
    put('src/app/couples-spa-lake-district/page.tsx', `            '${UNRENAMED}',`);
    put('src/data/faqs/spa-5-faqs.tsx', `  const p = getDayPassPrice(spa.id, '${RENAMED}');`);
  });

  it('finds the location-faqs references the old rename scan missed', () => {
    const files = collectReferenceFiles(repo);
    const hits = files.flatMap((f) => findIdReferences(f.content, RENAMED, f.path));
    const locHits = hits.filter((h) => h.file.includes('location-faqs'));
    expect(locHits).toHaveLength(2);
  });

  it('finds the src/app references neither scan looked at', () => {
    const files = collectReferenceFiles(repo);
    const hits = files.flatMap((f) => findIdReferences(f.content, UNRENAMED, f.path));
    expect(hits.map((h) => h.file).sort()).toEqual([
      'src/app/couples-spa-lake-district/page.tsx',
      'src/app/page.tsx',
    ]);
  });

  it('finds every reference to the renamed id across all trees at once', () => {
    const files = collectReferenceFiles(repo);
    const hits = files.flatMap((f) => findIdReferences(f.content, RENAMED, f.path));
    expect(hits).toHaveLength(3); // 2 in location-faqs + 1 in faqs
  });
});
