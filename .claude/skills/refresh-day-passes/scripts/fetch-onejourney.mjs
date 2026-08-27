#!/usr/bin/env node
// onejourney JSON-API fetch for /refresh-day-passes (PRD §2,
// portal-onejourney-api tier). See issue 03c.
//
// Usage: node fetch-onejourney.mjs <url> <artifact-path> <log-path>
//          [--no-availability] [--availability-days=N]
//
// The onejourney storefront is a client-rendered Next.js SPA. Some
// tenants server-render their React-Query payload (Appleby) and some do
// not (Lakeside) — but EVERY tenant's data comes from the same public
// JSON API underneath, so this tier works for both and does not care
// whether the shell is populated:
//
//   catalogue: https://api.onejourney.travel/<propertyId>/spa-packages/<lang>
//   one item:  https://api.onejourney.travel/<propertyId>/spa-packages/<itemId>/<lang>
//
// The route was recovered from `_next/static/chunks/pages/_app-<hash>.js`
// (`"".concat(e,"/spa-packages/").concat(t,"/").concat(n)`, query key
// `["spaPackage", propertyId, itemId, lang, …]`). `<propertyId>` is in the
// storefront page's own payload as `"property":{"id":N,…}`. Note there is
// NO `/store` prefix on this route family — that belongs to the
// site-level routes (`/store/pages/site/<tenant>/…`) only.
//
// Why a dedicated script rather than fetch.mjs (which would also get a
// 200 here):
//
//  1. It PARSES AND VALIDATES the response before writing anything. The
//     whole hazard of issue 03c is that a Lakeside booking page returns
//     HTTP 200 and a shell stuffed with Elemis retail-shop `"price":
//     {"amount":N}` fragments and no day-pass data at all — a quote taken
//     from it would ground a real-looking figure to entirely the wrong
//     product. An HTML shell is not JSON, so it cannot reach the artifact
//     here: the fetch fails loudly instead (`notJson`), and a JSON body
//     that isn't a spa-package payload fails too (`unexpectedShape`).
//     The hazard is closed structurally, not by remembering a rule.
//  2. It pins the vendored Accept header. Today this route family accepts
//     anything; the site-level routes already require
//     `application/vnd.onejourney.*+json`, so send what the app sends.
//  3. It pretty-prints the artifact. The API emits one long minified
//     line; re-serialising at 2-space indent makes quotes short, stable
//     and readable, exactly as `pdftotext` reshapes the pdf tier's
//     artifact. The file the model reads is still the file the gate
//     greps.
//
// Prices arrive as `"amount": <pence>` — use `arithmetic: "pence"`,
// identical to the SSR onejourney tier. No gate change is needed.
//
// AVAILABILITY PROBE (on by default; `--no-availability` disables)
//
// Being listed in the catalogue does NOT mean a pass is bookable. Lakeside
// listed "Fizz and Float" at £39 with a working booking page and zero
// released timeslots on every date — a price we would otherwise have kept
// verifying and publishing forever, and which only a human clicking
// through would ever have caught.
//
// So after fetching the catalogue this script probes each package's real
// timeslot endpoint across the next N days (default 14):
//
//   <base>/<propertyId>/spa-packages/<itemId>/<YYYY-MM-DD>/timeslots?quantity=1
//
// and records the counts into an `availabilityProbe` block appended to the
// saved artifact. Gate 6 (`bookability`) then demotes any pass whose
// `daysWithSlots` is 0. The gate never deletes anything — a dead pass
// becomes a ⚠️ flag for a human, exactly like every other demotion.
//
// The block is fetched data, not an assertion: it names the endpoint, the
// window and the probe time, and every number in it came from a real
// response. It is aggregated into the artifact for the same reason
// trim-artifact.mjs bundles several pages into one — so the gate has a
// single file to grep.
//
// If EVERY probe for an item fails (network, not a real "no slots"), the
// item is omitted from the block rather than reported as zero, and the log
// sets `availabilityProbeFailed: true`. A blip must not mass-flag a spa,
// and a missing block makes gate 6 a no-op.
//
// Exit codes: 0 fetched · 2 failed (route to the failure lane) ·
// 1 usage error. A failed availability probe never fails the fetch.

import { spawnSync } from 'node:child_process';
import { writeFileSync, existsSync, unlinkSync } from 'node:fs';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
// What the storefront's own axios instance sends (`_app` chunk:
// `createAxiosInstance(BACKEND_URL, "application/vnd.onejourney.v2.1+json")`).
export const ACCEPT = 'application/vnd.onejourney.v2.1+json';
// Same 3 attempts / 2s / 8s shape as fetch.mjs. `OJ_BACKOFF_MS` (a
// comma-separated ms list) exists so the unit suite can exercise the
// retry COUNT without paying 10s of real sleeping per failure case; the
// refresh procedure never sets it.
const BACKOFF_MS = process.env.OJ_BACKOFF_MS
  ? process.env.OJ_BACKOFF_MS.split(',').map(Number)
  : [0, 2000, 8000];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Validate one spa-package entry. The three fields below are the ones the
 * refresh actually grounds against — an object missing any of them is not
 * something we can quote, whatever else it is.
 */
function isPackage(p) {
  return (
    p !== null &&
    typeof p === 'object' &&
    typeof p.id === 'number' &&
    typeof p.name === 'string' &&
    p.price !== null &&
    typeof p.price === 'object' &&
    Number.isInteger(p.price.amount)
  );
}

/**
 * Parse an API response body into a normalised catalogue.
 *
 * Accepts both shapes the route family returns: the list endpoint's
 * `{ total, page, perPage, data: [...] }` and the single-item endpoint's
 * bare package object.
 *
 * Returns `{ ok: true, packages }` or `{ ok: false, reason }` where
 * reason is 'not-json' | 'unexpected-shape'. Never throws.
 */
export function parseCatalogue(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'not-json' };
  }
  if (parsed === null || typeof parsed !== 'object') return { ok: false, reason: 'unexpected-shape' };

  const packages = Array.isArray(parsed.data) ? parsed.data : [parsed];
  if (packages.length === 0 || !packages.every(isPackage)) {
    return { ok: false, reason: 'unexpected-shape' };
  }
  return { ok: true, packages, body: parsed };
}

export const DEFAULT_AVAILABILITY_DAYS = 14;

/**
 * Turn a catalogue or single-item URL into the timeslots URL for one item
 * on one date. Both source shapes share the `<base>/spa-packages/` prefix:
 *
 *   .../340/spa-packages/en            -> .../340/spa-packages/18904/2026-08-27/timeslots
 *   .../340/spa-packages/18904/en      -> (same)
 *
 * Returns null if the URL is not a spa-packages route.
 */
export function timeslotsUrl(catalogueUrl, itemId, date) {
  const marker = '/spa-packages/';
  const at = catalogueUrl.indexOf(marker);
  if (at === -1) return null;
  const base = catalogueUrl.slice(0, at + marker.length);
  return `${base}${itemId}/${date}/timeslots?quantity=1`;
}

/** N consecutive YYYY-MM-DD dates starting at `from` (a Date, UTC). */
export function probeDates(from, days) {
  const out = [];
  for (let i = 0; i < days; i++) {
    out.push(new Date(from.getTime() + i * 86400000).toISOString().slice(0, 10));
  }
  return out;
}

/**
 * Count timeslots in a timeslots response body.
 *
 * The endpoint answers with a bare array to curl and `{"data":[...]}` to
 * some other clients, so accept both. Returns null when the body cannot be
 * read as either — a failed probe, not an empty one. That distinction is
 * the whole point: "we could not check" must never be recorded as "there
 * is no availability".
 */
export function countSlots(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  if (Array.isArray(parsed)) return parsed.length;
  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) return parsed.data.length;
  return null;
}

function probeOneDay(url) {
  const res = spawnSync(
    'curl',
    ['-sSL', '--max-time', '30', '-A', UA, '-H', `Accept: ${ACCEPT}`, '-w', '\n%{http_code}', url],
    { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 },
  );
  if (res.status !== 0) return null;
  const raw = res.stdout;
  const cut = raw.lastIndexOf('\n');
  if (cut === -1) return null;
  if (raw.slice(cut + 1).trim() !== '200') return null;
  return countSlots(raw.slice(0, cut));
}

/**
 * Probe every package's timeslots across `days` days from today.
 * Returns the `availabilityProbe` block, or null if nothing could be
 * probed at all.
 */
export function probeAvailability(catalogueUrl, packages, days, now = new Date()) {
  const dates = probeDates(now, days);
  const items = [];
  let anyProbeFailed = false;

  for (const p of packages) {
    const datesWithSlots = [];
    let probed = 0;
    for (const date of dates) {
      const url = timeslotsUrl(catalogueUrl, p.id, date);
      if (!url) continue;
      const n = probeOneDay(url);
      if (n === null) {
        anyProbeFailed = true;
        continue; // could not check this day — do not count it either way
      }
      probed++;
      if (n > 0) datesWithSlots.push(date);
    }
    // An item we could not probe at all is omitted, never reported as zero.
    if (probed === 0) continue;
    items.push({
      itemId: p.id,
      name: p.name,
      daysProbed: probed,
      daysWithSlots: datesWithSlots.length,
      datesWithSlots,
    });
  }

  if (items.length === 0) return null;
  return {
    probedAt: new Date().toISOString(),
    windowDays: days,
    startDate: dates[0],
    endDate: dates[dates.length - 1],
    endpoint: timeslotsUrl(catalogueUrl, '<itemId>', '<date>'),
    note: 'daysWithSlots 0 means the pass is listed and priced but has no bookable date in the window.',
    anyProbeFailed,
    items,
  };
}

async function main() {
  const argv = process.argv.slice(2);
  const flags = argv.filter((a) => a.startsWith('--'));
  const [url, artifactPath, logPath] = argv.filter((a) => !a.startsWith('--'));
  if (!url || !artifactPath || !logPath) {
    console.error(
      'usage: node fetch-onejourney.mjs <url> <artifact-path> <log-path> [--no-availability] [--availability-days=N]',
    );
    process.exit(1);
  }
  const probeEnabled = !flags.includes('--no-availability');
  const daysFlag = flags.find((f) => f.startsWith('--availability-days='));
  const availabilityDays = daysFlag
    ? Math.max(1, Number(daysFlag.split('=')[1]) || DEFAULT_AVAILABILITY_DAYS)
    : DEFAULT_AVAILABILITY_DAYS;

  const attempts = [];
  let ok = false;
  let packages = [];
  let shapeError = null;
  let probe = null;

  for (let i = 0; i < BACKOFF_MS.length; i++) {
    await sleep(BACKOFF_MS[i]);
    const at = new Date().toISOString();
    const res = spawnSync(
      'curl',
      ['-sSL', '--max-time', '30', '-A', UA, '-H', `Accept: ${ACCEPT}`, '-w', '\n%{http_code}', url],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
    );

    const raw = res.status === 0 ? res.stdout : '';
    const cut = raw.lastIndexOf('\n');
    const httpCode = res.status === 0 && cut !== -1 ? raw.slice(cut + 1).trim() : null;
    const body = cut !== -1 ? raw.slice(0, cut) : '';

    const attempt = {
      attempt: i + 1,
      at,
      method: 'curl-json',
      httpCode,
      curlError: res.status === 0 ? null : (res.stderr || `curl exit ${res.status}`).trim(),
      bytes: Buffer.byteLength(body),
    };

    if (httpCode === '200' && body.length > 0) {
      const parsed = parseCatalogue(body);
      if (parsed.ok) {
        packages = parsed.packages;
        const out = { ...parsed.body };
        if (probeEnabled) {
          // Supplementary, and never allowed to fail the fetch: a listed
          // price we cannot probe is still a listed price.
          try {
            probe = probeAvailability(url, packages, availabilityDays);
          } catch {
            probe = null;
          }
          if (probe) out.availabilityProbe = probe;
        }
        // Pretty-print: this re-serialised form IS the artifact, and is
        // what every quote must be copied from.
        writeFileSync(artifactPath, JSON.stringify(out, null, 2) + '\n');
        attempt.packageCount = packages.length;
        attempts.push(attempt);
        ok = true;
        break;
      }
      // A 200 that isn't a spa-package payload is a FAILURE, not an
      // artifact — this is the Lakeside-shell hazard, refused at source.
      shapeError = parsed.reason;
      attempt.shapeError = parsed.reason;
    }
    attempts.push(attempt);
  }

  const last = attempts[attempts.length - 1];
  const log = {
    url,
    artifact: artifactPath,
    ok,
    botBlocked: !ok && last.httpCode === '403',
    notJson: !ok && shapeError === 'not-json',
    unexpectedShape: !ok && shapeError === 'unexpected-shape',
    error: ok
      ? null
      : shapeError === 'not-json'
        ? 'HTTP 200 but the body is not JSON — not a spa-package payload, refusing to save it as an artifact'
        : shapeError === 'unexpected-shape'
          ? 'HTTP 200 but the JSON is not a spa-package payload (no id/name/price.amount) — refusing to save it as an artifact'
          : last.curlError || `HTTP ${last.httpCode}`,
    packageCount: ok ? packages.length : 0,
    packageIds: packages.map((p) => p.id),
    availabilityProbed: Boolean(probe),
    // True when the probe could not run at all, or some day could not be
    // checked. A pass with no `availabilityProbe` entry is NOT evidence of
    // no availability — gate 6 stays a no-op for it.
    availabilityProbeFailed: ok && probeEnabled && (!probe || probe.anyProbeFailed),
    // Listed, priced, and bookable on no date in the window.
    unbookableItemIds: probe ? probe.items.filter((i) => i.daysWithSlots === 0).map((i) => i.itemId) : [],
    attempts,
  };
  writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n');
  if (!ok && existsSync(artifactPath)) unlinkSync(artifactPath); // never gate against an error page
  console.log(JSON.stringify(log, null, 2));
  process.exit(ok ? 0 : 2);
}

// Only run when invoked as a script, so the exports above stay importable.
if (process.argv[1] && process.argv[1].endsWith('fetch-onejourney.mjs')) main();
