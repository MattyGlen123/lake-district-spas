// Deterministic gate suite for /refresh-day-passes (PRD §5):
// gate 1 grounding + arithmetic, gate 2 contiguity, gate 3 poison words,
// gate 5 plausibility. Spawns the real script — same interface the skill
// uses at run time.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const GATE = join(process.cwd(), '.claude/skills/refresh-day-passes/scripts/gate.mjs');

interface GateResult {
  passId: string;
  grounded: boolean;
  reason: string;
  gate: number | null;
  quote: string;
  figureGBP: number;
  movePct?: number;
  poisonWords?: string[];
  documentYear?: number;
}

let dir: string;

function runGate(artifactHtml: string, checks: object[]): GateResult[] {
  const artifact = join(dir, 'artifact.html');
  const checksPath = join(dir, 'checks.json');
  writeFileSync(artifact, artifactHtml);
  writeFileSync(checksPath, JSON.stringify(checks));
  const out = execFileSync('node', [GATE, artifact, checksPath], { encoding: 'utf8' });
  return JSON.parse(out).results;
}

function one(artifactHtml: string, check: object): GateResult {
  return runGate(artifactHtml, [check])[0];
}

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), 'gate-test-'));
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
});

const artifact = `<html><body>
    <h3>Rejuvenate   Spa Day</h3>
    <p>All day access &mdash; &pound;140.00 per person</p>
    <h3>Relax Spa Day</h3>
    <p>&#163;115 per person</p>
    <p>Spa Access &ndash; 3 hours for &pound;45</p>
    <p>Treatment room 140 upstairs</p>
  </body></html>`;

describe('gate 1 — exact-quote grounding', () => {
  it('grounds a quote that matches modulo whitespace/entity normalization', () => {
    const r = one(artifact, {
      passId: 'rejuvenate',
      passName: 'Rejuvenate Spa Day',
      quote: 'Rejuvenate Spa Day</h3> <p>All day access — £140.00 per person',
      figureGBP: 140,
      storedGBP: 140,
    });
    expect(r.grounded).toBe(true);
    expect(r.reason).toBe('grounded');
    expect(r.gate).toBeNull();
  });

  it('decodes numeric entities (&#163; -> £)', () => {
    const r = one(artifact, {
      passId: 'relax',
      passName: 'Relax Spa Day',
      quote: 'Relax Spa Day</h3> <p>£115 per person',
      figureGBP: 115,
    });
    expect(r.grounded).toBe(true);
  });

  it('demotes a quote that does not appear in the artifact', () => {
    const r = one(artifact, {
      passId: 'rejuvenate',
      passName: 'Rejuvenate Spa Day',
      quote: 'Rejuvenate Spa Day now £140',
      figureGBP: 140,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('quote-not-found-in-artifact');
    expect(r.gate).toBe(1);
  });

  it('demotes when the figure is not inside the quote', () => {
    const r = one(artifact, {
      passId: 'rejuvenate',
      passName: 'Rejuvenate Spa Day',
      quote: 'Rejuvenate Spa Day',
      figureGBP: 140,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('figure-not-in-quote');
  });

  it('rejects a bare number without a £ sign (no false grounding on "room 140")', () => {
    const r = one(artifact, {
      passId: 'rejuvenate',
      passName: 'Rejuvenate Spa Day',
      quote: 'Treatment room 140 upstairs',
      figureGBP: 140,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('figure-not-in-quote');
  });

  it('does not match a figure that is a prefix of a larger price (£45 vs £450)', () => {
    const r = one('<p>Deluxe package &pound;450</p>', {
      passId: 'spa-access',
      passName: 'Deluxe package',
      quote: 'Deluxe package £450',
      figureGBP: 45,
    });
    expect(r.grounded).toBe(false);
  });

  it('demotes an empty quote', () => {
    const r = one(artifact, { passId: 'x', passName: 'Spa Access', quote: '', figureGBP: 45 });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('empty-quote');
  });

  it('renders the quote on every result so flags can show it', () => {
    const r = one(artifact, {
      passId: 'rejuvenate',
      passName: 'Rejuvenate Spa Day',
      quote: 'Rejuvenate Spa Day',
      figureGBP: 140,
    });
    expect(r.quote).toBe('Rejuvenate Spa Day');
  });
});

describe('gate 1 — arithmetic cases', () => {
  const portal = '<script>{"itemTitle":"Spa Day Pass","priceInPence":14000,"qty":1}</script>';
  const couple = '<p>Couples Escape &pound;95 per person (2 guests)</p>';

  it('grounds a portal price quoted in pence (14000 -> £140)', () => {
    const r = one(portal, {
      passId: 'portal-day',
      passName: 'Spa Day Pass',
      quote: '{"itemTitle":"Spa Day Pass","priceInPence":14000,"qty":1}',
      figureGBP: 140,
      arithmetic: 'pence',
      quotedFigure: 14000,
    });
    expect(r.grounded).toBe(true);
  });

  it('demotes a pence quote whose integer does not equal figureGBP × 100', () => {
    const r = one(portal, {
      passId: 'portal-day',
      passName: 'Spa Day Pass',
      quote: '{"itemTitle":"Spa Day Pass","priceInPence":14000,"qty":1}',
      figureGBP: 150,
      arithmetic: 'pence',
      quotedFigure: 14000,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('arithmetic-mismatch');
  });

  it('demotes a pence quote when the pence integer is absent from the span', () => {
    const r = one('<script>{"itemTitle":"Spa Day Pass","priceInPence":14000}</script>', {
      passId: 'portal-day',
      passName: 'Spa Day Pass',
      quote: '{"itemTitle":"Spa Day Pass"',
      figureGBP: 140,
      arithmetic: 'pence',
      quotedFigure: 14000,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('figure-not-in-quote');
  });

  // try.be JSON-LD quotes whole pounds as a bare integer, no currency symbol.
  const jsonLd =
    '<script type="application/ld+json">{"@type":"Product","name":"Simple Ritual",' +
    '"offers":{"@type":"AggregateOffer","lowPrice":68,"highPrice":78,"priceCurrency":"gbp"}}</script>';

  it('grounds a whole-pound JSON-LD price (lowPrice 68 -> £68)', () => {
    const r = one(jsonLd, {
      passId: 'simple-ritual-weekday',
      passName: 'Simple Ritual',
      quote: '{"@type":"Product","name":"Simple Ritual","offers":{"@type":"AggregateOffer","lowPrice":68',
      figureGBP: 68,
      storedGBP: 63,
      arithmetic: 'gbp-integer',
      quotedFigure: 68,
    });
    expect(r.grounded).toBe(true);
  });

  it('grounds the highPrice variant of the same item', () => {
    const r = one(jsonLd, {
      passId: 'simple-ritual-weekend',
      passName: 'Simple Ritual',
      quote:
        '{"@type":"Product","name":"Simple Ritual","offers":{"@type":"AggregateOffer","lowPrice":68,"highPrice":78',
      figureGBP: 78,
      storedGBP: 73,
      arithmetic: 'gbp-integer',
      quotedFigure: 78,
    });
    expect(r.grounded).toBe(true);
  });

  it('demotes a gbp-integer quote whose integer is not the figure (pence read as pounds)', () => {
    const r = one(jsonLd, {
      passId: 'simple-ritual-weekday',
      passName: 'Simple Ritual',
      quote: '{"@type":"Product","name":"Simple Ritual","offers":{"@type":"AggregateOffer","lowPrice":68',
      figureGBP: 6800,
      arithmetic: 'gbp-integer',
      quotedFigure: 68,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('arithmetic-mismatch');
  });

  it('demotes a non-integer gbp-integer figure (shape cannot produce one)', () => {
    const r = one(jsonLd, {
      passId: 'simple-ritual-weekday',
      passName: 'Simple Ritual',
      quote: '{"@type":"Product","name":"Simple Ritual","offers":{"@type":"AggregateOffer","lowPrice":68',
      figureGBP: 68.5,
      arithmetic: 'gbp-integer',
      quotedFigure: 68.5,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('arithmetic-mismatch');
  });

  it('demotes a gbp-integer quote when the integer is absent from the span', () => {
    const r = one(jsonLd, {
      passId: 'simple-ritual-weekday',
      passName: 'Simple Ritual',
      quote: '{"@type":"Product","name":"Simple Ritual"',
      figureGBP: 68,
      arithmetic: 'gbp-integer',
      quotedFigure: 68,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('figure-not-in-quote');
  });

  it('does not match a gbp-integer figure embedded in a longer number', () => {
    const r = one('<script>{"name":"Ritual","lowPrice":6800}</script>', {
      passId: 'simple-ritual-weekday',
      passName: 'Ritual',
      quote: '{"name":"Ritual","lowPrice":6800}',
      figureGBP: 68,
      arithmetic: 'gbp-integer',
      quotedFigure: 68,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('figure-not-in-quote');
  });

  it('grounds a per-couple price (quoted £95 per person -> stored £190 group total)', () => {
    const r = one(couple, {
      passId: 'couples-escape',
      passName: 'Couples Escape',
      quote: 'Couples Escape £95 per person (2 guests)',
      figureGBP: 190,
      arithmetic: 'per-couple',
      quotedFigure: 95,
    });
    expect(r.grounded).toBe(true);
  });

  it('demotes a per-couple price whose ×2 arithmetic does not hold', () => {
    const r = one(couple, {
      passId: 'couples-escape',
      passName: 'Couples Escape',
      quote: 'Couples Escape £95 per person (2 guests)',
      figureGBP: 95,
      arithmetic: 'per-couple',
      quotedFigure: 95,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('arithmetic-mismatch');
  });

  it('demotes a per-couple check with no per-person figure supplied', () => {
    const r = one(couple, {
      passId: 'couples-escape',
      passName: 'Couples Escape',
      quote: 'Couples Escape £95 per person (2 guests)',
      figureGBP: 190,
      arithmetic: 'per-couple',
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('arithmetic-missing-per-person');
  });
});

describe('gate 2 — contiguity', () => {
  const page = `<html><body>
    <div class="card"><h2>Relax Spa Day</h2><span>&pound;115</span></div>
    <div class="addon"><h2>Massage add-on</h2><span>&pound;30</span></div>
  </body></html>`;

  it('grounds a span holding both the pass name and the price', () => {
    const r = one(page, {
      passId: 'relax',
      passName: 'Relax Spa Day',
      quote: '<h2>Relax Spa Day</h2><span>£115</span>',
      figureGBP: 115,
    });
    expect(r.grounded).toBe(true);
  });

  it('demotes a wrong-price-nearby span that omits the pass name', () => {
    const r = one(page, {
      passId: 'relax',
      passName: 'Relax Spa Day',
      quote: '<h2>Massage add-on</h2><span>£30</span>',
      figureGBP: 30,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('pass-name-not-in-quote');
    expect(r.gate).toBe(2);
  });

  it('matches a name split across tags (tag-stripped comparison)', () => {
    const split = '<h2 class="title"> My <em>Morning</em> Retreat </h2><p>from &pound;109</p>';
    const r = one(split, {
      passId: 'morning',
      passName: 'My Morning Retreat',
      quote: '<h2 class="title"> My <em>Morning</em> Retreat </h2><p>from £109</p>',
      figureGBP: 109,
    });
    expect(r.grounded).toBe(true);
  });

  it('demotes a check with no pass name at all', () => {
    const r = one(page, {
      passId: 'relax',
      passName: '',
      quote: '<h2>Relax Spa Day</h2><span>£115</span>',
      figureGBP: 115,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('missing-pass-name');
  });
});

describe('gate 3 — poison words', () => {
  const filler = 'x'.repeat(400);

  it('demotes a member price inside the span', () => {
    const html = `<p>Twilight Spa &pound;60 member price</p>`;
    const r = one(html, {
      passId: 'twilight',
      passName: 'Twilight Spa',
      quote: 'Twilight Spa £60 member price',
      figureGBP: 60,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('poison-word:member');
    expect(r.gate).toBe(3);
    expect(r.poisonWords).toContain('member');
  });

  it('demotes on poison context within ±200 chars of the span', () => {
    const html = `<p>Membership rates apply.</p><p>Twilight Spa &pound;60</p>`;
    const r = one(html, {
      passId: 'twilight',
      passName: 'Twilight Spa',
      quote: 'Twilight Spa £60',
      figureGBP: 60,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('poison-word:member');
  });

  it('grounds when the poison word sits further than 200 chars away', () => {
    const html = `<p>Membership rates apply.</p><p>${filler}</p><p>Twilight Spa &pound;60</p><p>${filler}</p>`;
    const r = one(html, {
      passId: 'twilight',
      passName: 'Twilight Spa',
      quote: 'Twilight Spa £60',
      figureGBP: 60,
    });
    expect(r.grounded).toBe(true);
  });

  it('demotes deposit, voucher, resident and per month wording', () => {
    for (const [word, text] of [
      ['deposit', 'Twilight Spa £60 deposit'],
      ['voucher', 'Twilight Spa £60 voucher'],
      ['resident', 'Twilight Spa £60 resident rate'],
      ['per month', 'Twilight Spa £60 per month'],
    ] as const) {
      const html = `<p>${text}</p><p>${filler}</p>`;
      const r = one(html, {
        passId: 'twilight',
        passName: 'Twilight Spa',
        quote: text,
        figureGBP: 60,
      });
      expect(r.grounded).toBe(false);
      expect(r.reason).toBe(`poison-word:${word}`);
    }
  });

  it('does not trip on "remember" (word-boundary anchored)', () => {
    const html = `<p>Remember to book. Twilight Spa &pound;60</p><p>${filler}</p>`;
    const r = one(html, {
      passId: 'twilight',
      passName: 'Twilight Spa',
      quote: 'Twilight Spa £60',
      figureGBP: 60,
    });
    expect(r.grounded).toBe(true);
  });

  it('poisons a repeated span when any one occurrence has poison nearby', () => {
    const html = `<p>Spa Access &pound;45</p><p>${filler}</p><p>Members only: </p><p>Spa Access &pound;45</p>`;
    const r = one(html, {
      passId: 'spa-access',
      passName: 'Spa Access',
      quote: 'Spa Access £45',
      figureGBP: 45,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('poison-word:member');
  });
});

describe('gate 4 — PDF vintage (pdf tier only)', () => {
  const brochure = `<html><body>
    <h3>Escape Half Day</h3><p>Mon-Fri &pound;150</p>
    <p>Prices valid until December 2026 season.</p>
  </body></html>`;

  it('is a no-op when pdfVintage is absent (other tiers unaffected)', () => {
    const r = one(brochure, {
      passId: 'escape',
      passName: 'Escape Half Day',
      quote: 'Escape Half Day</h3><p>Mon-Fri £150',
      figureGBP: 150,
    });
    expect(r.grounded).toBe(true);
  });

  it('grounds filename-year evidence matching the run year', () => {
    const r = one(brochure, {
      passId: 'escape',
      passName: 'Escape Half Day',
      quote: 'Escape Half Day</h3><p>Mon-Fri £150',
      figureGBP: 150,
      pdfVintage: {
        documentYear: 2026,
        evidenceType: 'filename',
        evidence: 'https://example.com/wp-content/uploads/2026/02/spa-brochure.pdf',
        runYear: 2026,
      },
    });
    expect(r.grounded).toBe(true);
    expect(r.documentYear).toBe(2026);
  });

  it('demotes a prior-year filename brochure — whole-source vintage failure', () => {
    const r = one(brochure, {
      passId: 'escape',
      passName: 'Escape Half Day',
      quote: 'Escape Half Day</h3><p>Mon-Fri £150',
      figureGBP: 150,
      pdfVintage: {
        documentYear: 2025,
        evidenceType: 'filename',
        evidence: 'https://example.com/wp-content/uploads/2025/02/spa-brochure.pdf',
        runYear: 2026,
      },
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('pdf-vintage-stale');
    expect(r.gate).toBe(4);
  });

  it('grounds a cover-date/valid-until quote that greps in the artifact and states the year', () => {
    const r = one(brochure, {
      passId: 'escape',
      passName: 'Escape Half Day',
      quote: 'Escape Half Day</h3><p>Mon-Fri £150',
      figureGBP: 150,
      pdfVintage: {
        documentYear: 2026,
        evidenceType: 'valid-until',
        evidence: 'Prices valid until December 2026 season.',
        runYear: 2026,
      },
    });
    expect(r.grounded).toBe(true);
  });

  it('demotes a cover-date/valid-until quote absent from the artifact (no self-reported evidence)', () => {
    const r = one(brochure, {
      passId: 'escape',
      passName: 'Escape Half Day',
      quote: 'Escape Half Day</h3><p>Mon-Fri £150',
      figureGBP: 150,
      pdfVintage: {
        documentYear: 2026,
        evidenceType: 'valid-until',
        evidence: 'Prices valid until December 2026 — not actually printed anywhere',
        runYear: 2026,
      },
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('pdf-vintage-evidence-not-found-in-artifact');
    expect(r.gate).toBe(4);
  });

  it('demotes when documentYear is missing or not a number', () => {
    const r = one(brochure, {
      passId: 'escape',
      passName: 'Escape Half Day',
      quote: 'Escape Half Day</h3><p>Mon-Fri £150',
      figureGBP: 150,
      pdfVintage: { evidenceType: 'filename', evidence: 'https://example.com/2026/brochure.pdf' },
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('pdf-vintage-year-missing');
    expect(r.gate).toBe(4);
  });

  it('demotes an unrecognised evidenceType', () => {
    const r = one(brochure, {
      passId: 'escape',
      passName: 'Escape Half Day',
      quote: 'Escape Half Day</h3><p>Mon-Fri £150',
      figureGBP: 150,
      pdfVintage: { documentYear: 2026, evidenceType: 'guess', evidence: 'trust me, 2026' },
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('pdf-vintage-evidence-type-invalid');
  });

  it('demotes filename evidence that does not literally contain documentYear', () => {
    const r = one(brochure, {
      passId: 'escape',
      passName: 'Escape Half Day',
      quote: 'Escape Half Day</h3><p>Mon-Fri £150',
      figureGBP: 150,
      pdfVintage: {
        documentYear: 2026,
        evidenceType: 'filename',
        evidence: 'https://example.com/wp-content/uploads/spa-brochure.pdf',
        runYear: 2026,
      },
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('pdf-vintage-year-not-in-evidence');
  });

  it('demotes empty evidence', () => {
    const r = one(brochure, {
      passId: 'escape',
      passName: 'Escape Half Day',
      quote: 'Escape Half Day</h3><p>Mon-Fri £150',
      figureGBP: 150,
      pdfVintage: { documentYear: 2026, evidenceType: 'filename', evidence: '' },
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('pdf-vintage-evidence-missing');
  });

  it('defaults runYear to the current calendar year when omitted', () => {
    const nextYear = new Date().getFullYear() + 1;
    const r = one(brochure, {
      passId: 'escape',
      passName: 'Escape Half Day',
      quote: 'Escape Half Day</h3><p>Mon-Fri £150',
      figureGBP: 150,
      pdfVintage: {
        documentYear: nextYear,
        evidenceType: 'filename',
        evidence: `https://example.com/uploads/${nextYear}/brochure.pdf`,
      },
    });
    expect(r.grounded).toBe(true);
  });

  it('runs gate 4 before gate 5, so a stale vintage wins over a plausibility flag', () => {
    const r = one('<p>Escape Half Day &pound;9999</p>', {
      passId: 'escape',
      passName: 'Escape Half Day',
      quote: 'Escape Half Day £9999',
      figureGBP: 9999,
      storedGBP: 150,
      pdfVintage: {
        documentYear: 2025,
        evidenceType: 'filename',
        evidence: 'https://example.com/uploads/2025/brochure.pdf',
        runYear: 2026,
      },
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('pdf-vintage-stale');
    expect(r.gate).toBe(4);
  });
});

describe('gate 5 — plausibility bounds', () => {
  const html = (price: string) => `<p>Twilight Spa &pound;${price}</p>${'x'.repeat(400)}`;

  it('reports the computed % move on grounded results', () => {
    const r = one(html('120'), {
      passId: 'twilight',
      passName: 'Twilight Spa',
      quote: 'Twilight Spa £120',
      figureGBP: 120,
      storedGBP: 100,
    });
    expect(r.grounded).toBe(true);
    expect(r.movePct).toBe(20);
  });

  it('demotes a move greater than +40%', () => {
    const r = one(html('150'), {
      passId: 'twilight',
      passName: 'Twilight Spa',
      quote: 'Twilight Spa £150',
      figureGBP: 150,
      storedGBP: 100,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('move-exceeds-40pct');
    expect(r.gate).toBe(5);
    expect(r.movePct).toBe(50);
  });

  it('demotes a move steeper than -40%', () => {
    const r = one(html('50'), {
      passId: 'twilight',
      passName: 'Twilight Spa',
      quote: 'Twilight Spa £50',
      figureGBP: 50,
      storedGBP: 100,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('move-exceeds-40pct');
    expect(r.movePct).toBe(-50);
  });

  it('allows a move of exactly 40%', () => {
    const r = one(html('140'), {
      passId: 'twilight',
      passName: 'Twilight Spa',
      quote: 'Twilight Spa £140',
      figureGBP: 140,
      storedGBP: 100,
    });
    expect(r.grounded).toBe(true);
    expect(r.movePct).toBe(40);
  });

  it('demotes a price below the £20 floor even when unchanged', () => {
    const r = one(html('15'), {
      passId: 'twilight',
      passName: 'Twilight Spa',
      quote: 'Twilight Spa £15',
      figureGBP: 15,
      storedGBP: 15,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('price-out-of-bounds');
    expect(r.movePct).toBe(0);
  });

  it('demotes a price above the £400 ceiling even when unchanged', () => {
    const r = one(html('450'), {
      passId: 'twilight',
      passName: 'Twilight Spa',
      quote: 'Twilight Spa £450',
      figureGBP: 450,
      storedGBP: 450,
    });
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('price-out-of-bounds');
  });

  it('allows the bounds themselves (£20 and £400)', () => {
    const low = one(html('20'), {
      passId: 'twilight',
      passName: 'Twilight Spa',
      quote: 'Twilight Spa £20',
      figureGBP: 20,
    });
    const high = one(html('400'), {
      passId: 'twilight',
      passName: 'Twilight Spa',
      quote: 'Twilight Spa £400',
      figureGBP: 400,
    });
    expect(low.grounded).toBe(true);
    expect(high.grounded).toBe(true);
  });
});

describe('gate output shape', () => {
  it('summarises grounded vs flagged and never exits non-zero on failures', () => {
    const artifactPath = join(dir, 'artifact.html');
    const checksPath = join(dir, 'checks.json');
    writeFileSync(artifactPath, '<p>Twilight Spa &pound;60</p>');
    writeFileSync(
      checksPath,
      JSON.stringify([
        { passId: 'a', passName: 'Twilight Spa', quote: 'Twilight Spa £60', figureGBP: 60 },
        { passId: 'b', passName: 'Twilight Spa', quote: 'nope', figureGBP: 60 },
      ]),
    );
    const out = JSON.parse(execFileSync('node', [GATE, artifactPath, checksPath], { encoding: 'utf8' }));
    expect(out.summary).toEqual({ checked: 2, grounded: 1, flagged: 1 });
    expect(out.constants).toEqual({
      PRICE_MIN_GBP: 20,
      PRICE_MAX_GBP: 400,
      MAX_MOVE_PCT: 40,
      POISON_CONTEXT_CHARS: 200,
    });
  });
});
