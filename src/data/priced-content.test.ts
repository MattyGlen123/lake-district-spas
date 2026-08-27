import fs from 'fs';
import path from 'path';
import { spaData } from '@/data/spas';
import {
  getSpaAccessDuration,
  getSpaAccessDurationText,
  getSpaAccessDurationHyphenated,
  getSpaAccessWeekdayPrice,
  getSpaAccessWeekendPrice,
  getSpaAccessPriceRange,
  getSpaAccessPriceRangeShort,
  getDayPassById,
  getDayPassPrice,
  getDayPassDuration,
  getDayPassBookingUrl,
  getDayPassPackageName,
  getDayPassPricePerPerson,
  getTreatmentId,
  getTreatmentIdByName,
  getTreatmentDuration,
  getTreatmentPrice,
  getTreatmentBookingUrl,
  getTreatmentName,
  getTreatmentCouplesPrice,
  getTreatmentIndividualPrice,
} from './priced-content';

// Lodore Falls Hotel Spa (id 1) — used throughout as a spa with known treatment
// and day pass data (see src/data/treatments/spa-1-treatments.ts and
// src/data/day-passes/spa-1-day-passes.ts).
const lodoreFalls = spaData.find((s) => s.id === 1)!;

describe('priced-content: pure helper functions', () => {
  describe('Spa Access helpers', () => {
    it('returns duration, weekday/weekend prices and formatted ranges', () => {
      expect(getSpaAccessDuration(lodoreFalls)).toBe(2);
      expect(getSpaAccessDurationText(lodoreFalls)).toBe('2 hours');
      expect(getSpaAccessDurationHyphenated(lodoreFalls)).toBe('2-hour');
      expect(getSpaAccessWeekdayPrice(lodoreFalls)).toBe(35);
      expect(getSpaAccessWeekendPrice(lodoreFalls)).toBe(40);
      expect(getSpaAccessPriceRange(lodoreFalls)).toBe(
        '£35 per person Monday to Thursday, or £40 per person Friday to Sunday'
      );
      expect(getSpaAccessPriceRangeShort(lodoreFalls)).toBe('£35-40');
    });
  });

  describe('Treatment helpers (fuzzy substring match on name)', () => {
    const treatmentName = 'ishga mini facial and full body salt oil scrub';

    it('getTreatmentPrice resolves a known treatment', () => {
      expect(getTreatmentPrice(1, treatmentName)).toBe('£100');
    });

    it('getTreatmentDuration resolves a known treatment', () => {
      expect(getTreatmentDuration(1, treatmentName)).toBe('50 minutes');
    });

    it('getTreatmentIdByName slugifies the matched treatment name', () => {
      expect(getTreatmentIdByName(1, treatmentName)).toBe(
        getTreatmentId(treatmentName)
      );
    });

    it('getTreatmentId slugifies arbitrary strings', () => {
      expect(getTreatmentId('Fell Walkers Massage')).toBe('fell-walkers-massage');
    });

    it('getTreatmentBookingUrl prefers the treatment-specific booking URL', () => {
      const url = getTreatmentBookingUrl(1, treatmentName, lodoreFalls);
      expect(url).toMatch(/^https:\/\//);
    });

    it('getTreatmentBookingUrl falls back to the spa treatment booking URL when the treatment has none', () => {
      const fakeSpa = { ...lodoreFalls, treatmentBookingUrl: 'https://example.com/book' };
      const url = getTreatmentBookingUrl(1, 'this-treatment-does-not-exist', fakeSpa);
      expect(url).toBe('https://example.com/book');
    });

    it('getTreatmentName matches on partial (substring) name', () => {
      expect(getTreatmentName(1, 'mini facial and full body')).toBe(treatmentName);
    });

    it('resolution functions return null for an unmatched treatment name', () => {
      const missing = 'a treatment name that will never exist in the data';
      expect(getTreatmentPrice(1, missing)).toBeNull();
      expect(getTreatmentDuration(1, missing)).toBeNull();
      expect(getTreatmentIdByName(1, missing)).toBeNull();
      expect(getTreatmentBookingUrl(1, missing)).toBeNull();
      expect(getTreatmentName(1, missing)).toBeNull();
    });

    it('getTreatmentCouplesPrice / getTreatmentIndividualPrice parse combined price strings', () => {
      expect(getTreatmentCouplesPrice('£300 (£595 couples)')).toBe('£595');
      expect(getTreatmentIndividualPrice('£300 (£595 couples)')).toBe('£300');
      expect(getTreatmentCouplesPrice('£125')).toBeNull();
      expect(getTreatmentIndividualPrice('£125')).toBe('£125');
    });
  });

  describe('Day Pass helpers (id-based lookup)', () => {
    const dayPassId = 'lodore-falls-renew-spa';

    it('getDayPassById returns the matching option', () => {
      const dayPass = getDayPassById(1, dayPassId);
      expect(dayPass?.packageName).toBe('Falls Renew Spa Experience');
    });

    it('getDayPassPrice / getDayPassDuration / getDayPassBookingUrl / getDayPassPackageName resolve', () => {
      // Assert the FORMATTING against the stored option, not a frozen
      // literal: these figures are refreshed from the spa's live site by
      // /refresh-day-passes, so a hardcoded price turns every legitimate
      // price change into a failing test. What matters here is that the
      // helper finds the option and renders it as "£<priceGBP>".
      const stored = getDayPassById(1, dayPassId);
      expect(stored).not.toBeNull();
      expect(getDayPassPrice(1, dayPassId)).toBe(`£${stored!.priceGBP}`);
      expect(getDayPassDuration(1, dayPassId)).toBe(`${stored!.spaDuration} hours`);
      expect(getDayPassBookingUrl(1, dayPassId)).toMatch(/^https:\/\//);
      expect(getDayPassPackageName(1, dayPassId)).toBe(stored!.packageName);
    });

    it('getDayPassPricePerPerson uses pricePerPerson when present', () => {
      expect(getDayPassPricePerPerson(1, 'lodore-falls-derwent-delight')).toBe('£225');
    });

    it('all Day Pass lookups return null for an unknown id', () => {
      expect(getDayPassById(1, 'not-a-real-day-pass-id')).toBeNull();
      expect(getDayPassPrice(1, 'not-a-real-day-pass-id')).toBeNull();
      expect(getDayPassDuration(1, 'not-a-real-day-pass-id')).toBeNull();
      expect(getDayPassBookingUrl(1, 'not-a-real-day-pass-id')).toBeNull();
      expect(getDayPassPackageName(1, 'not-a-real-day-pass-id')).toBeNull();
      expect(getDayPassPricePerPerson(1, 'not-a-real-day-pass-id')).toBeNull();
    });
  });
});

/**
 * Build-time safety net for the "no silent resolution failures" concern (see module docs
 * in priced-content.ts and docs/adr/0003-dynamic-pricing-in-blog.md).
 *
 * Treatment is free-text (`name: string`, no stable id) — see src/types/spa.ts — so
 * getTreatmentPrice/getTreatmentDuration/getTreatmentIdByName/getTreatmentBookingUrl/
 * getTreatmentName all resolve via case-insensitive substring match against whatever a
 * human typed into an FAQ or blog MDX file. If a Treatment is renamed in
 * src/data/treatments/spa-*.ts, that match silently returns null at build time and every
 * caller swallows it (`if (!x) return null` / falls back to a hardcoded price).
 *
 * Rather than migrate ~19 FAQ files and 12 MDX posts to an id-based scheme (Treatment has
 * no id field to migrate to, and treatment data files are out of scope for this change),
 * this suite parses every FAQ/MDX reference to a treatment or day pass, replays it through
 * the real production lookup functions against live spa data, and fails loudly if anything
 * no longer resolves. A drifted name now breaks `npm test` instead of silently rendering a
 * stale fallback price.
 */
describe('priced-content: content references resolve against live spa data', () => {
  const FAQS_DIR = path.join(process.cwd(), 'src/data/faqs');
  const BLOG_DIR = path.join(process.cwd(), 'content/blog');

  const TREATMENT_LOOKUPS: Record<string, (spaId: number, name: string) => unknown> = {
    getTreatmentPrice,
    getTreatmentDuration,
    getTreatmentIdByName,
    getTreatmentBookingUrl,
    getTreatmentName,
  };

  const DAY_PASS_LOOKUPS: Record<string, (spaId: number, id: string) => unknown> = {
    getDayPassPrice,
    getDayPassDuration,
    getDayPassBookingUrl,
    getDayPassPackageName,
    getDayPassPricePerPerson,
    getDayPassById,
  };

  describe('FAQ generators (src/data/faqs/spa-*-faqs.tsx)', () => {
    const faqFiles = fs
      .readdirSync(FAQS_DIR)
      .filter((f) => /^spa-\d+-faqs\.tsx$/.test(f));

    // Sanity check the scan itself isn't silently matching nothing.
    it('found FAQ files to validate', () => {
      expect(faqFiles.length).toBeGreaterThan(0);
    });

    faqFiles.forEach((file) => {
      const spaId = Number(file.match(/^spa-(\d+)-faqs\.tsx$/)![1]);

      it(`${file}: every treatment/day-pass reference resolves for spa ${spaId}`, () => {
        const source = fs.readFileSync(path.join(FAQS_DIR, file), 'utf-8');
        const errors: string[] = [];

        for (const fn of Object.keys(TREATMENT_LOOKUPS)) {
          const re = new RegExp(`${fn}\\(\\s*spa\\.id\\s*,\\s*['"]([^'"]+)['"]`, 'g');
          let match: RegExpExecArray | null;
          while ((match = re.exec(source))) {
            const treatmentName = match[1];
            const result = TREATMENT_LOOKUPS[fn](spaId, treatmentName);
            if (result === null || result === undefined) {
              errors.push(
                `${fn}(spa.id, '${treatmentName}') resolved to null — no treatment in ` +
                  `src/data/treatments/spa-${spaId}-treatments.ts matches this name (fuzzy substring match)`
              );
            }
          }
        }

        for (const fn of Object.keys(DAY_PASS_LOOKUPS)) {
          const re = new RegExp(`${fn}\\(\\s*spa\\.id\\s*,\\s*['"]([^'"]+)['"]`, 'g');
          let match: RegExpExecArray | null;
          while ((match = re.exec(source))) {
            const dayPassId = match[1];
            const result = DAY_PASS_LOOKUPS[fn](spaId, dayPassId);
            if (result === null || result === undefined) {
              errors.push(
                `${fn}(spa.id, '${dayPassId}') resolved to null — no day pass in ` +
                  `src/data/day-passes/spa-${spaId}-day-passes.ts has this id`
              );
            }
          }
        }

        expect(errors).toEqual([]);
      });
    });
  });

  describe('Blog posts (content/blog/*.mdx)', () => {
    const blogDirExists = fs.existsSync(BLOG_DIR);
    const mdxFiles = blogDirExists
      ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))
      : [];

    const TREATMENT_COMPONENTS = ['TreatmentPrice', 'TreatmentDuration', 'TreatmentLink'];
    const DAY_PASS_COMPONENTS = [
      'DayPassPrice',
      'DayPassPricePerPerson',
      'DayPassDuration',
      'DayPassLink',
    ];
    const SPA_ACCESS_COMPONENTS = [
      'SpaAccessPrice',
      'SpaAccessDuration',
      'SpaAccessDurationHyphenated',
    ];
    const ALL_COMPONENTS = [
      ...TREATMENT_COMPONENTS,
      ...DAY_PASS_COMPONENTS,
      ...SPA_ACCESS_COMPONENTS,
      'SpaCard',
    ];

    it('found blog posts to validate', () => {
      expect(mdxFiles.length).toBeGreaterThan(0);
    });

    mdxFiles.forEach((file) => {
      it(`${file}: every treatment/day-pass/spa-access reference resolves`, () => {
        const source = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
        const errors: string[] = [];

        for (const component of ALL_COMPONENTS) {
          const tagRe = new RegExp(`<${component}\\s+([^>]*?)/?>`, 'g');
          let match: RegExpExecArray | null;
          while ((match = tagRe.exec(source))) {
            const attrs = match[1];
            const spaSlug = attrs.match(/spaSlug=["']([^"']+)["']/)?.[1];
            if (!spaSlug) {
              errors.push(`<${component}> usage missing a spaSlug attribute`);
              continue;
            }
            const spa = spaData.find((s) => s.url === spaSlug);
            if (!spa) {
              errors.push(
                `<${component} spaSlug="${spaSlug}"> — no spa in spaData has this url`
              );
              continue;
            }

            if (TREATMENT_COMPONENTS.includes(component)) {
              const treatmentName = attrs.match(/treatmentName=["']([^"']+)["']/)?.[1];
              if (!treatmentName) {
                errors.push(`<${component} spaSlug="${spaSlug}"> missing treatmentName attribute`);
                continue;
              }
              if (getTreatmentPrice(spa.id, treatmentName) === null) {
                errors.push(
                  `<${component} spaSlug="${spaSlug}" treatmentName="${treatmentName}"> — no ` +
                    `treatment in src/data/treatments/spa-${spa.id}-treatments.ts matches this name`
                );
              }
            }

            if (DAY_PASS_COMPONENTS.includes(component)) {
              const dayPassId = attrs.match(/dayPassId=["']([^"']+)["']/)?.[1];
              if (!dayPassId) {
                errors.push(`<${component} spaSlug="${spaSlug}"> missing dayPassId attribute`);
                continue;
              }
              if (getDayPassById(spa.id, dayPassId) === null) {
                errors.push(
                  `<${component} spaSlug="${spaSlug}" dayPassId="${dayPassId}"> — no day pass ` +
                    `in src/data/day-passes/spa-${spa.id}-day-passes.ts has this id`
                );
              }
            }

            if (SPA_ACCESS_COMPONENTS.includes(component) && !spa.spaAccessForHotelGuest) {
              errors.push(
                `<${component} spaSlug="${spaSlug}"> — spa has no spaAccessForHotelGuest data`
              );
            }
          }
        }

        expect(errors).toEqual([]);
      });
    });
  });
});
