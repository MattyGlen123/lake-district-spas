// Rename engine for /refresh-day-passes (PRD §4, issue 05).
// Direct import — the module is pure functions, no filesystem/process work
// except the CLI's main() (guarded, not invoked by import).
import {
  slugify,
  deriveSpaPrefix,
  reslug,
  checkSlugCollision,
  planRename,
  rewriteMechanicalRefs,
  findProseMentions,
  applyRenameToFiles,
} from '../../.claude/skills/refresh-day-passes/scripts/rename.mjs';

describe('slugify', () => {
  it('matches the existing id convention', () => {
    expect(slugify('Spring Awakening')).toBe('spring-awakening');
    expect(slugify('Pure Pampering!')).toBe('pure-pampering');
    expect(slugify('  Twilight   Spa ')).toBe('twilight-spa');
  });
});

describe('deriveSpaPrefix', () => {
  it('strips the old name slug off the end of the old id', () => {
    expect(deriveSpaPrefix('swan-winter-glow', 'Winter Glow')).toBe('swan');
    expect(deriveSpaPrefix('whitewater-pure-pampering', 'Pure Pampering')).toBe('whitewater');
    expect(deriveSpaPrefix('lodore-falls-twilight-spa', 'Twilight Spa')).toBe('lodore-falls');
  });

  it('falls back to the common dash-token prefix of siblings when the id has drifted', () => {
    const siblings = ['swan-winter-glow-2025', 'swan-champagne-truffle-spa-day', 'swan-twilight-sessions-weekday'];
    expect(deriveSpaPrefix('swan-winter-glow-2025', 'Winter Glow', siblings)).toBe('swan');
  });

  it('returns null when neither the name-suffix nor sibling fallback can derive a prefix', () => {
    expect(deriveSpaPrefix('mystery-id', 'Totally Unrelated Name', [])).toBeNull();
  });
});

describe('reslug / checkSlugCollision / planRename', () => {
  it('re-slugs to <spa-prefix>-<slug-of-new-name>', () => {
    const r = reslug('swan-winter-glow', 'Winter Glow', 'Spring Awakening');
    expect(r).toEqual({ ok: true, newId: 'swan-spring-awakening', prefix: 'swan' });
  });

  it('flags a slug collision instead of inventing a disambiguated id', () => {
    const siblings = ['swan-winter-glow', 'swan-spring-awakening'];
    const collision = checkSlugCollision('swan-spring-awakening', siblings, 'swan-winter-glow');
    expect(collision).toBe(true);

    const plan = planRename('swan-winter-glow', 'Winter Glow', 'Spring Awakening', siblings);
    expect(plan).toEqual({ applied: false, reason: 'slug-collision', newId: 'swan-spring-awakening' });
  });

  it('applies a clean rename when there is no collision', () => {
    const siblings = ['swan-winter-glow', 'swan-champagne-truffle-spa-day'];
    const plan = planRename('swan-winter-glow', 'Winter Glow', 'Spring Awakening', siblings);
    expect(plan).toEqual({ applied: true, newId: 'swan-spring-awakening' });
  });

  it('does not treat a no-op re-slug (same resulting id) as an applied rename', () => {
    const plan = planRename('swan-winter-glow', 'Winter Glow', 'winter   glow!!', ['swan-winter-glow']);
    expect(plan.applied).toBe(false);
    expect(plan.reason).toBe('no-change');
  });

  it('flags when the spa-prefix cannot be derived, rather than guessing', () => {
    const plan = planRename('mystery-id', 'Totally Unrelated Name', 'New Name', []);
    expect(plan).toEqual({ applied: false, reason: 'cannot-derive-prefix' });
  });
});

describe('rewriteMechanicalRefs', () => {
  it('rewrites a dayPassId prop', () => {
    const { content, count } = rewriteMechanicalRefs(
      '<DayPassPrice spaSlug="swan-hotel-spa" dayPassId="swan-winter-glow" />',
      'swan-winter-glow',
      'swan-spring-awakening',
    );
    expect(content).toBe('<DayPassPrice spaSlug="swan-hotel-spa" dayPassId="swan-spring-awakening" />');
    expect(count).toBe(1);
  });

  it('rewrites a quoted id argument in a plain function call (FAQ generators)', () => {
    const { content, count } = rewriteMechanicalRefs(
      "const price = getDayPassPrice(spa.id, 'swan-winter-glow');",
      'swan-winter-glow',
      'swan-spring-awakening',
    );
    expect(content).toBe("const price = getDayPassPrice(spa.id, 'swan-spring-awakening');");
    expect(count).toBe(1);
  });

  it('rewrites a markdown anchor fragment', () => {
    const { content, count } = rewriteMechanicalRefs(
      '[Winter Glow](/spa/swan-hotel-spa#swan-winter-glow)',
      'swan-winter-glow',
      'swan-spring-awakening',
    );
    expect(content).toBe('[Winter Glow](/spa/swan-hotel-spa#swan-spring-awakening)');
    expect(count).toBe(1);
  });

  it('rewrites every occurrence and does not touch unrelated ids', () => {
    const src = [
      '<DayPassLink spaSlug="swan-hotel-spa" dayPassId="swan-winter-glow">Winter Glow</DayPassLink>',
      '<DayPassPrice spaSlug="swan-hotel-spa" dayPassId="swan-winter-glow" />',
      '<DayPassPrice spaSlug="swan-hotel-spa" dayPassId="swan-champagne-truffle-spa-day" />',
    ].join('\n');
    const { content, count } = rewriteMechanicalRefs(src, 'swan-winter-glow', 'swan-spring-awakening');
    expect(count).toBe(2);
    expect(content).toContain('dayPassId="swan-spring-awakening"');
    expect(content).toContain('dayPassId="swan-champagne-truffle-spa-day"'); // untouched
    expect(content).not.toContain('swan-winter-glow');
  });

  it('does not rewrite prose text (only quoted id literals and anchors)', () => {
    const { content, count } = rewriteMechanicalRefs(
      'The Winter Glow package is very popular with guests.',
      'swan-winter-glow',
      'swan-spring-awakening',
    );
    expect(content).toBe('The Winter Glow package is very popular with guests.');
    expect(count).toBe(0);
  });
});

describe('findProseMentions', () => {
  it('finds case-insensitive prose hits with file:line + context, but never rewrites', () => {
    const content = [
      'Some intro text.',
      'The <DayPassLink dayPassId="swan-winter-glow">Winter Glow</DayPassLink> package is a favourite.',
      'Guests often ask about winter glow availability in December.',
    ].join('\n');
    const hits = findProseMentions(content, 'Winter Glow', 'content/blog/example.mdx');
    expect(hits).toEqual([
      {
        file: 'content/blog/example.mdx',
        line: 2,
        context: 'The <DayPassLink dayPassId="swan-winter-glow">Winter Glow</DayPassLink> package is a favourite.',
      },
      {
        file: 'content/blog/example.mdx',
        line: 3,
        context: 'Guests often ask about winter glow availability in December.',
      },
    ]);
  });

  it('returns no hits when the name never appears', () => {
    expect(findProseMentions('Nothing to see here.', 'Winter Glow', 'x.mdx')).toEqual([]);
  });
});

describe('applyRenameToFiles (tier-1 rename, end-to-end over fixture files)', () => {
  const oldId = 'swan-winter-glow';
  const newId = 'swan-spring-awakening';
  const oldName = 'Winter Glow';
  const newName = 'Spring Awakening';

  const dataFile = {
    path: 'src/data/day-passes/spa-5-day-passes.ts',
    isDataFile: true,
    content: [
      "import { SpaDayPasses } from '@/types/spa';",
      '',
      'export const spa5DayPasses: SpaDayPasses = {',
      '  spaId: 5,',
      '  options: [',
      '    {',
      "      id: 'swan-winter-glow',",
      "      packageName: 'Winter Glow',",
      '      priceGBP: 80,',
      "      lastVerified: '2026-01-01',",
      '    },',
      '  ],',
      '};',
    ].join('\n'),
  };

  const faqFile = {
    path: 'src/data/faqs/spa-5-faqs.tsx',
    content: [
      "import { getDayPassPrice } from '@/data/priced-content';",
      '',
      'export function generateFAQs(spa) {',
      "  const winterGlowPrice = getDayPassPrice(spa.id, 'swan-winter-glow');",
      '  return [',
      '    {',
      "      question: 'How much is the Winter Glow package?',",
      "      answer: `The Winter Glow package costs ${winterGlowPrice}.`,",
      '    },',
      '  ];',
      '}',
    ].join('\n'),
  };

  const blogFile = {
    path: 'content/blog/spa-resort-couples-getaway.mdx',
    content:
      'Day pass pricing starts at <DayPassLink spaSlug="swan-hotel-spa" dayPassId="swan-winter-glow">Winter Glow</DayPassLink> ' +
      '(<DayPassPrice spaSlug="swan-hotel-spa" dayPassId="swan-winter-glow" />) for a weekday slot. ' +
      'See [Winter Glow details](/spa/swan-hotel-spa#swan-winter-glow) for more.',
  };

  it('re-slugs the data file id + packageName, rewrites mechanical refs, and flags prose only in non-data files', () => {
    const { updatedFiles, proseFlags } = applyRenameToFiles([dataFile, faqFile, blogFile], {
      oldId,
      newId,
      oldName,
      newName,
    });

    const updatedData = updatedFiles.find((f) => f.path === dataFile.path)!;
    expect(updatedData.content).toContain("id: 'swan-spring-awakening'");
    expect(updatedData.content).toContain("packageName: 'Spring Awakening'");
    expect(updatedData.content).not.toContain('winter-glow');
    expect(updatedData.content).not.toContain('Winter Glow');

    const updatedFaq = updatedFiles.find((f) => f.path === faqFile.path)!;
    expect(updatedFaq.content).toContain("getDayPassPrice(spa.id, 'swan-spring-awakening')");
    // Mechanical rewrite only touches the id literal, not the prose question/answer text.
    expect(updatedFaq.content).toContain('How much is the Winter Glow package?');

    const updatedBlog = updatedFiles.find((f) => f.path === blogFile.path)!;
    expect(updatedBlog.content).toContain('dayPassId="swan-spring-awakening"');
    expect(updatedBlog.content).toContain('#swan-spring-awakening');
    // Link text / prose still says the old name — flagged, not rewritten.
    expect(updatedBlog.content).toContain('>Winter Glow<');
    expect(updatedBlog.content).toContain('[Winter Glow details]');

    // Prose flags cover every remaining "Winter Glow" mention in non-data files.
    expect(proseFlags.some((h) => h.file === faqFile.path && h.context.includes('Winter Glow'))).toBe(
      true,
    );
    expect(
      proseFlags.filter((h) => h.file === blogFile.path && h.context.toLowerCase().includes('winter glow'))
        .length,
    ).toBeGreaterThanOrEqual(2);
    // The data file itself is never scanned for prose flags — its rename is a direct edit.
    expect(proseFlags.some((h) => h.file === dataFile.path)).toBe(false);
  });

  // Regression: Appleby (spa 15) stores weekday/weekend variants of the same
  // package under one packageName. A global packageName replace renamed BOTH
  // entries on the first rename, leaving the twin's rename with nothing to
  // match and two entries sharing a name that only one of them now has.
  it('renames only the target entry when a sibling pass shares its packageName', () => {
    const sharedNameDataFile = {
      path: 'src/data/day-passes/spa-15-day-passes.ts',
      isDataFile: true,
      content: [
        'export const spa15DayPasses: SpaDayPasses = {',
        '  spaId: 15,',
        '  options: [',
        '    {',
        "      id: 'appleby-indulgence-weekend',",
        "      packageName: 'Indulgence',",
        '      priceGBP: 125,',
        '    },',
        '    {',
        "      id: 'appleby-indulgence-weekday',",
        "      packageName: 'Indulgence',",
        '      priceGBP: 115,',
        '    },',
        '  ],',
        '};',
      ].join('\n'),
    };

    const first = applyRenameToFiles([sharedNameDataFile], {
      oldId: 'appleby-indulgence-weekend',
      newId: 'appleby-indulgence-friday-sunday',
      oldName: 'Indulgence',
      newName: 'Indulgence | Friday - Sunday',
    });
    const afterFirst = first.updatedFiles.find((f) => f.path === sharedNameDataFile.path)!.content;

    // The weekday twin keeps its original name and id.
    expect(afterFirst).toContain("packageName: 'Indulgence | Friday - Sunday'");
    expect(afterFirst).toContain("id: 'appleby-indulgence-weekday'");
    expect(afterFirst.match(/packageName: 'Indulgence'/g)).toHaveLength(1);

    // The twin's own rename then still finds its packageName to rewrite.
    const second = applyRenameToFiles(
      [{ ...sharedNameDataFile, content: afterFirst }],
      {
        oldId: 'appleby-indulgence-weekday',
        newId: 'appleby-indulgence-monday-thursday',
        oldName: 'Indulgence',
        newName: 'Indulgence | Monday - Thursday',
      },
    );
    const afterSecond = second.updatedFiles.find((f) => f.path === sharedNameDataFile.path)!.content;

    expect(afterSecond).toContain("packageName: 'Indulgence | Friday - Sunday'");
    expect(afterSecond).toContain("packageName: 'Indulgence | Monday - Thursday'");
    expect(afterSecond).not.toMatch(/packageName: 'Indulgence'/);
  });
});
