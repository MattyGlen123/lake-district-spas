#!/usr/bin/env node
// onejourney JSON-API fetch for /refresh-day-passes (PRD §2,
// portal-onejourney-api tier). See issue 03c.
//
// Usage: node fetch-onejourney.mjs <url> <artifact-path> <log-path>
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
// Exit codes: 0 fetched · 2 failed (route to the failure lane) ·
// 1 usage error.

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

async function main() {
  const [url, artifactPath, logPath] = process.argv.slice(2);
  if (!url || !artifactPath || !logPath) {
    console.error('usage: node fetch-onejourney.mjs <url> <artifact-path> <log-path>');
    process.exit(1);
  }

  const attempts = [];
  let ok = false;
  let packages = [];
  let shapeError = null;

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
        // Pretty-print: this re-serialised form IS the artifact, and is
        // what every quote must be copied from.
        writeFileSync(artifactPath, JSON.stringify(parsed.body, null, 2) + '\n');
        packages = parsed.packages;
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
    attempts,
  };
  writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n');
  if (!ok && existsSync(artifactPath)) unlinkSync(artifactPath); // never gate against an error page
  console.log(JSON.stringify(log, null, 2));
  process.exit(ok ? 0 : 2);
}

// Only run when invoked as a script, so the exports above stay importable.
if (process.argv[1] && process.argv[1].endsWith('fetch-onejourney.mjs')) main();
