// Withdrawal (auto-delete) engine for /refresh-day-passes (PRD §4a, issue 14).
// Direct import — the module is pure functions, no filesystem/process work
// except the CLI's main() (guarded, not invoked by import).
import {
  BLOCK_REASONS,
  classifyWithdrawal,
  findIdReferences,
  findEnclosingObject,
  removeEntryFromDataFile,
  applyWithdrawalToFiles,
} from '../../.claude/skills/refresh-day-passes/scripts/withdraw.mjs';

const ALL_CLEAR = {
  pageGone: true,
  absentFromIndex: true,
  noSuccessor: true,
  priorSighting: true,
  noReferences: true,
};

describe('classifyWithdrawal', () => {
  it('deletes only when all five conditions hold', () => {
    expect(classifyWithdrawal(ALL_CLEAR)).toEqual({
      withdraw: true,
      reason: 'withdrawn',
      failed: [],
    });
  });

  it.each([
    ['pageGone', 'page-not-gone'],
    ['absentFromIndex', 'still-listed-by-spa'],
    ['noSuccessor', 'successor-suggested'],
    ['priorSighting', 'first-sighting'],
    ['noReferences', 'has-references'],
  ])('blocks when %s is false', (key, reason) => {
    const result = classifyWithdrawal({ ...ALL_CLEAR, [key]: false });
    expect(result.withdraw).toBe(false);
    expect(result.reason).toBe(reason);
    expect(result.failed).toContain(key);
  });

  it('reports the first failing condition but lists them all', () => {
    const result = classifyWithdrawal({
      ...ALL_CLEAR,
      absentFromIndex: false,
      priorSighting: false,
    });
    expect(result.reason).toBe(BLOCK_REASONS.absentFromIndex);
    expect(result.failed).toEqual(['absentFromIndex', 'priorSighting']);
  });

  it('treats a missing signal as unproven, never as true', () => {
    const { pageGone, ...withoutPageGone } = ALL_CLEAR;
    expect(classifyWithdrawal(withoutPageGone).withdraw).toBe(false);
    expect(classifyWithdrawal({}).withdraw).toBe(false);
  });

  it('does not accept truthy non-true values', () => {
    expect(classifyWithdrawal({ ...ALL_CLEAR, priorSighting: 'yes' as never }).withdraw).toBe(false);
    expect(classifyWithdrawal({ ...ALL_CLEAR, priorSighting: 1 as never }).withdraw).toBe(false);
  });

  it('a first sighting alone never deletes, however dead the page looks', () => {
    // The Daffodil 2026-08-27 case: page 404s, gone from the index, no
    // successor — and still not deletable, because it is the first run
    // that has seen it missing.
    const result = classifyWithdrawal({ ...ALL_CLEAR, priorSighting: false });
    expect(result.withdraw).toBe(false);
    expect(result.reason).toBe('first-sighting');
  });
});

describe('findIdReferences', () => {
  const id = 'daffodil-its-all-good-weekday';

  it('finds quoted id literals in helper calls and props', () => {
    const content = [
      `const p = getDayPassPrice(spa.id, '${id}');`,
      `<DayPassPrice dayPassId="${id}" />`,
    ].join('\n');
    const hits = findIdReferences(content, id, 'src/data/faqs/spa-4-faqs.tsx');
    expect(hits).toHaveLength(2);
    expect(hits[0]).toMatchObject({ file: 'src/data/faqs/spa-4-faqs.tsx', line: 1 });
    expect(hits[1].line).toBe(2);
  });

  it('finds anchor fragments', () => {
    const hits = findIdReferences(`See [the pass](/spa/x#${id}).`, id, 'content/blog/a.mdx');
    expect(hits).toHaveLength(1);
  });

  it('does not match a different id that merely shares a prefix', () => {
    const content = `getDayPassPrice(4, 'daffodil-its-all-good-weekend')`;
    expect(findIdReferences(content, id, 'f.tsx')).toEqual([]);
  });

  it('returns nothing for an unreferenced id', () => {
    expect(findIdReferences('nothing to see here', id, 'f.tsx')).toEqual([]);
  });
});

describe('findEnclosingObject', () => {
  it('is not fooled by braces inside string literals', () => {
    const src = `[\n  { id: 'a', description: 'uses { and } inside' },\n  { id: 'b' },\n]`;
    const span = findEnclosingObject(src, src.indexOf("id: 'a'"))!;
    expect(src.slice(span.start, span.end)).toBe(
      `{ id: 'a', description: 'uses { and } inside' }`,
    );
  });

  it('is not fooled by an apostrophe inside a double-quoted string', () => {
    const src = `[\n  { id: 'a', description: "It's All Good }" },\n  { id: 'b' },\n]`;
    const span = findEnclosingObject(src, src.indexOf("id: 'a'"))!;
    expect(src.slice(span.start, span.end)).toBe(`{ id: 'a', description: "It's All Good }" }`);
  });
});

describe('removeEntryFromDataFile', () => {
  const file = [
    'export const spa4DayPasses: SpaDayPasses = {',
    '  spaId: 4,',
    '  options: [',
    '    {',
    "      id: 'keep-me',",
    "      packageName: 'Keep Me',",
    '      priceGBP: 35,',
    '    },',
    '    {',
    "      id: 'drop-me',",
    "      packageName: 'Drop Me',",
    '      priceGBP: 170,',
    "      description: 'Escape with a facial. (Monday - Thursday)',",
    '    },',
    '    {',
    "      id: 'keep-me-too',",
    "      packageName: 'Keep Me Too',",
    '      priceGBP: 195,',
    '    }',
    '  ],',
    '};',
    '',
  ].join('\n');

  it('removes the target entry and leaves the others intact', () => {
    const { content, removed } = removeEntryFromDataFile(file, 'drop-me');
    expect(removed).toBe(true);
    expect(content).not.toContain('drop-me');
    expect(content).toContain("id: 'keep-me'");
    expect(content).toContain("id: 'keep-me-too'");
  });

  it('leaves the array syntactically valid — no doubled or dangling commas', () => {
    const { content } = removeEntryFromDataFile(file, 'drop-me');
    expect(content).not.toMatch(/,\s*,/);
    expect(content).not.toMatch(/\{\s*\}/);
    expect(content).toMatch(/\},\n\s*\{/); // the two survivors still separated by `},{`
    // Entry count drops by exactly one.
    expect([...content.matchAll(/^\s*id: '/gm)]).toHaveLength(2);
  });

  it('removes the LAST entry without leaving a trailing comma', () => {
    const { content, removed } = removeEntryFromDataFile(file, 'keep-me-too');
    expect(removed).toBe(true);
    expect(content).not.toContain('keep-me-too');
    expect(content).not.toMatch(/,\s*\]/);
  });

  it('removes the FIRST entry cleanly', () => {
    const { content, removed } = removeEntryFromDataFile(file, 'keep-me');
    expect(removed).toBe(true);
    expect(content).not.toContain("id: 'keep-me'");
    expect(content).toMatch(/options: \[\n\s*\{/);
  });

  it('is a no-op for an id that is not present', () => {
    const { content, removed } = removeEntryFromDataFile(file, 'never-existed');
    expect(removed).toBe(false);
    expect(content).toBe(file);
  });
});

describe('applyWithdrawalToFiles', () => {
  const dataFile = {
    path: 'src/data/day-passes/spa-4-day-passes.ts',
    content: `options: [\n    {\n      id: 'gone-pass',\n      packageName: 'Gone',\n    },\n    {\n      id: 'stays',\n    }\n  ],`,
    isDataFile: true,
  };

  it('drops the entry from the data file only', () => {
    const { updatedFiles, references } = applyWithdrawalToFiles(
      [dataFile, { path: 'content/blog/x.mdx', content: 'unrelated prose' }],
      { passId: 'gone-pass', passName: 'Gone' },
    );
    expect(updatedFiles).toHaveLength(1);
    expect(updatedFiles[0].path).toBe('src/data/day-passes/spa-4-day-passes.ts');
    expect(updatedFiles[0].content).not.toContain('gone-pass');
    expect(references).toEqual([]);
  });

  it('reports references instead of rewriting them', () => {
    const referencing = {
      path: 'src/data/faqs/spa-4-faqs.tsx',
      content: `const p = getDayPassPrice(spa.id, 'gone-pass');`,
    };
    const { updatedFiles, references } = applyWithdrawalToFiles([dataFile, referencing], {
      passId: 'gone-pass',
      passName: 'Gone',
    });
    expect(references).toHaveLength(1);
    expect(references[0].file).toBe('src/data/faqs/spa-4-faqs.tsx');
    // The referencing file is never edited — deletion has no id to point at.
    expect(updatedFiles.map((f) => f.path)).not.toContain('src/data/faqs/spa-4-faqs.tsx');
  });
});
