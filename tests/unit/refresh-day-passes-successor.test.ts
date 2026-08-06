// Successor suggestions + `--accept-successor` for /refresh-day-passes (PRD §4, issue 06).
// Direct import — the module is pure functions, no filesystem/process work
// except the CLI's main() (guarded, not invoked by import).
import { matchPasses } from '../../.claude/skills/refresh-day-passes/scripts/matching.mjs';
import {
  buildSuccessorEvidence,
  classifySuccessors,
  applySuccessor,
} from '../../.claude/skills/refresh-day-passes/scripts/successor.mjs';

interface ExistingPass {
  id: string;
  packageName: string;
  priceGBP: number;
  spaDuration?: number;
  included?: string[];
  daysAvailable?: string;
  bookingUrl?: string;
}

interface FetchedPass {
  name: string;
  priceGBP: number;
  spaDuration?: number;
  included?: string[];
  daysAvailable?: string;
  bookingUrl?: string;
}

describe('buildSuccessorEvidence', () => {
  it('reports price/duration/shape/availability/positional evidence', () => {
    const existing = {
      priceGBP: 80,
      spaDuration: 2,
      included: ['Thermal access', 'Glass of prosecco'],
      daysAvailable: 'Monday - Friday',
    };
    const fetched = {
      priceGBP: 82,
      spaDuration: 2,
      included: ['Thermal access', 'Glass of prosecco'],
      daysAvailable: 'Monday - Friday',
    };
    const evidence = buildSuccessorEvidence(existing, fetched, 0.87, 0, 0);
    expect(evidence).toEqual([
      'price: £80 -> £82',
      'duration: 2h (unchanged)',
      'shape: 2/2 inclusions shared (thermal access, glass of prosecco)',
      'availability: Monday - Friday (unchanged)',
      'positional: both occupy list position 1',
      'structural score: 0.87 (threshold 0.6)',
    ]);
  });

  it('omits fields absent from either side and skips positional when indices differ', () => {
    const existing = { priceGBP: 80 };
    const fetched = { priceGBP: 80 };
    const evidence = buildSuccessorEvidence(existing, fetched, 0.6, 0, 2);
    expect(evidence).toEqual(['price: £80 (unchanged)', 'structural score: 0.6 (threshold 0.6)']);
  });
});

describe('classifySuccessors', () => {
  it('strict 1:1 with a structural match renders a successor suggestion with evidence', () => {
    const existing: ExistingPass[] = [
      {
        id: 'swan-winter-glow',
        packageName: 'Winter Glow',
        priceGBP: 80,
        spaDuration: 2,
        included: ['Thermal access', 'Glass of prosecco'],
      },
    ];
    const fetched: FetchedPass[] = [
      {
        name: 'Spring Awakening',
        priceGBP: 82,
        spaDuration: 2,
        included: ['Thermal access', 'Glass of prosecco'],
      },
    ];
    const matchResult = matchPasses(existing, fetched);
    const result = classifySuccessors(existing, fetched, matchResult);

    expect(result.missingFlags).toEqual([]);
    expect(result.unmatchedFetched).toEqual([]);
    expect(result.successors).toHaveLength(1);
    expect(result.successors[0]).toMatchObject({
      existingId: 'swan-winter-glow',
      existingName: 'Winter Glow',
      fetchedName: 'Spring Awakening',
    });
    expect(result.successors[0].evidence.length).toBeGreaterThan(0);
    expect(result.successors[0].evidence.some((line: string) => line.startsWith('price:'))).toBe(true);
  });

  it('a strict 1:1 pair that never clears the similarity bar stays a plain flag + note', () => {
    const existing: ExistingPass[] = [
      { id: 'daffodil-discontinued-pass', packageName: 'Discontinued Pass', priceGBP: 60, spaDuration: 2 },
    ];
    const fetched: FetchedPass[] = [
      { name: 'Totally Different Package', priceGBP: 400, spaDuration: 8, included: ['Helicopter transfer'] },
    ];
    const matchResult = matchPasses(existing, fetched);
    const result = classifySuccessors(existing, fetched, matchResult);

    expect(result.successors).toEqual([]);
    expect(result.missingFlags).toEqual(['daffodil-discontinued-pass']);
    expect(result.unmatchedFetched).toEqual(['Totally Different Package']);
  });

  it('two vanished passes matching one candidate is multi-candidate ambiguity: plain flags, no successor', () => {
    // Both existing passes are structurally close to the single fetched
    // pass; matchPasses's greedy tier-3 loop will still pick a "winner" for
    // one of them, but the spa-wide pool is 2 vanished : 1 unmatched, so the
    // strict 1:1 rule must demote that winner back to a plain flag too.
    const existing: ExistingPass[] = [
      { id: 'spa-a', packageName: 'Relax Package A', priceGBP: 100, spaDuration: 4, included: ['Sauna', 'Pool'] },
      { id: 'spa-b', packageName: 'Relax Package B', priceGBP: 102, spaDuration: 4, included: ['Sauna', 'Pool'] },
    ];
    const fetched: FetchedPass[] = [
      { name: 'Relax Package Deluxe', priceGBP: 101, spaDuration: 4, included: ['Sauna', 'Pool'] },
    ];
    const matchResult = matchPasses(existing, fetched);
    // Sanity check on the fixture: matching.mjs did find a tier-3 winner.
    expect(matchResult.tier3Suggestions.length).toBe(1);

    const result = classifySuccessors(existing, fetched, matchResult);
    expect(result.successors).toEqual([]);
    expect(result.missingFlags.sort()).toEqual(['spa-a', 'spa-b'].sort());
    expect(result.unmatchedFetched).toEqual(['Relax Package Deluxe']);
  });

  it('one vanished pass matching two candidates is multi-candidate ambiguity: plain flags, no successor', () => {
    const existing: ExistingPass[] = [
      { id: 'spa-old', packageName: 'Old Favourite', priceGBP: 90, spaDuration: 3, included: ['Robe', 'Slippers'] },
    ];
    const fetched: FetchedPass[] = [
      { name: 'New Favourite A', priceGBP: 90, spaDuration: 3, included: ['Robe', 'Slippers'] },
      { name: 'New Favourite B', priceGBP: 91, spaDuration: 3, included: ['Robe', 'Slippers'] },
    ];
    const matchResult = matchPasses(existing, fetched);
    const result = classifySuccessors(existing, fetched, matchResult);

    expect(result.successors).toEqual([]);
    // The one existing pass (whether it landed in tier3Suggestions or
    // missingFlags) is demoted to a plain flag; the leftover fetched
    // candidate(s) become plain notes.
    expect(result.missingFlags).toEqual(['spa-old']);
    expect(result.unmatchedFetched).toContain('New Favourite B');
  });

  it('a no-predecessor addition (nothing vanished) is left as a plain info note', () => {
    const existing: ExistingPass[] = [
      { id: 'grange-classic-day-spa', packageName: 'Classic Day Spa', priceGBP: 70, spaDuration: 3 },
    ];
    const fetched: FetchedPass[] = [
      { name: 'Classic Day Spa', priceGBP: 70, spaDuration: 3 },
      { name: 'Brand New Autumn Package', priceGBP: 120, spaDuration: 5 },
    ];
    const matchResult = matchPasses(existing, fetched);
    const result = classifySuccessors(existing, fetched, matchResult);

    expect(result.successors).toEqual([]);
    expect(result.missingFlags).toEqual([]);
    expect(result.unmatchedFetched).toEqual(['Brand New Autumn Package']);
  });

  it('an apparent merge (two vanished collapsing toward one fetched item) stays plain flags', () => {
    const existing: ExistingPass[] = [
      { id: 'spa-merge-a', packageName: 'Morning Pass', priceGBP: 60, spaDuration: 2, included: ['Pool'] },
      { id: 'spa-merge-b', packageName: 'Afternoon Pass', priceGBP: 65, spaDuration: 2, included: ['Pool'] },
    ];
    const fetched: FetchedPass[] = [
      { name: 'All-Day Combined Pass', priceGBP: 62, spaDuration: 2, included: ['Pool'] },
    ];
    const matchResult = matchPasses(existing, fetched);
    const result = classifySuccessors(existing, fetched, matchResult);

    expect(result.successors).toEqual([]);
    expect(result.missingFlags.sort()).toEqual(['spa-merge-a', 'spa-merge-b'].sort());
  });
});

describe('applySuccessor', () => {
  const successor = {
    existingId: 'swan-winter-glow',
    existingName: 'Winter Glow',
    fetchedName: 'Spring Awakening',
    score: 0.87,
  };

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

  const blogFile = {
    path: 'content/blog/spa-resort-couples-getaway.mdx',
    content:
      'Day pass pricing starts at <DayPassLink spaSlug="swan-hotel-spa" dayPassId="swan-winter-glow">Winter Glow</DayPassLink>.',
  };

  it('applies the rename through the same engine as a tier-1 auto-rename', () => {
    const { plan, updatedFiles, proseFlags } = applySuccessor(
      successor,
      ['swan-winter-glow'],
      [dataFile, blogFile],
    );

    expect(plan).toEqual({ applied: true, newId: 'swan-spring-awakening' });

    const updatedData = updatedFiles.find((f: { path: string }) => f.path === dataFile.path)!;
    expect(updatedData.content).toContain("id: 'swan-spring-awakening'");
    expect(updatedData.content).toContain("packageName: 'Spring Awakening'");

    const updatedBlog = updatedFiles.find((f: { path: string }) => f.path === blogFile.path)!;
    expect(updatedBlog.content).toContain('dayPassId="swan-spring-awakening"');
    expect(updatedBlog.content).toContain('>Winter Glow<'); // link text flagged, not rewritten

    expect(proseFlags.some((h: { file: string }) => h.file === blogFile.path)).toBe(true);
  });

  it('never renames on a slug collision — flags instead, files untouched', () => {
    const siblingIds = ['swan-winter-glow', 'swan-spring-awakening'];
    const { plan, updatedFiles, proseFlags } = applySuccessor(successor, siblingIds, [dataFile, blogFile]);

    expect(plan).toEqual({ applied: false, reason: 'slug-collision', newId: 'swan-spring-awakening' });
    expect(updatedFiles).toEqual([]);
    expect(proseFlags).toEqual([]);
  });
});
