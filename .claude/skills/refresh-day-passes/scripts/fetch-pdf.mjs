#!/usr/bin/env node
// PDF-brochure fetch + poppler text-layer extraction for /refresh-day-passes
// (PRD §2 pdf tier — Armathwaite 2, sole pdf-tier spa).
//
// Usage: node fetch-pdf.mjs <pdf-url> <artifact-path> <log-path>
//
// Downloads the brochure PDF (curl + browser UA, retry+backoff like
// fetch.mjs) then runs poppler's `pdftotext -layout` on it, saving the
// TEXT LAYER (not the PDF) as the fetch artifact — the artifact the
// model reads is the artifact the gate greps (PRD §2). The raw PDF is
// kept alongside the artifact (same path, .pdf extension) so a thin/
// scanned text layer can still be read directly (Claude document-block
// fallback, see SKILL.md).
//
// Missing poppler is reported with the install hint, never a crash —
// checked up front, before any network call.
//
// Exit codes: 0 fetched + extracted (see `textLayerUsable` in the log —
// false means fall back to reading the PDF directly) · 2 fetch failed
// after retries, or poppler missing · 1 usage error.

import { spawnSync } from 'node:child_process';
import { writeFileSync, statSync, existsSync, readFileSync } from 'node:fs';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const BACKOFF_MS = [0, 2000, 8000];
export const MIN_USABLE_TEXT_CHARS = 200;
export const POPPLER_INSTALL_HINT = 'poppler not installed — run: brew install poppler (provides pdftotext)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Only ENOENT (binary not found) counts as "missing" — pdftotext -v
// exits non-zero on some poppler builds even when it's installed.
export function havePdftotext(spawn = spawnSync) {
  const res = spawn('pdftotext', ['-v']);
  return res.error?.code !== 'ENOENT';
}

function pdfPathFor(artifactPath) {
  return artifactPath.replace(/(\.[^./\\]+)?$/, '.pdf');
}

async function main() {
  const [pdfUrl, artifactPath, logPath] = process.argv.slice(2);
  if (!pdfUrl || !artifactPath || !logPath) {
    console.error('usage: node fetch-pdf.mjs <pdf-url> <artifact-path> <log-path>');
    process.exit(1);
  }

  if (!havePdftotext()) {
    const log = {
      url: pdfUrl,
      artifact: artifactPath,
      ok: false,
      missingDependency: true,
      error: POPPLER_INSTALL_HINT,
      attempts: [],
    };
    writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n');
    console.log(JSON.stringify(log, null, 2));
    process.exit(2);
    return;
  }

  const pdfPath = pdfPathFor(artifactPath);
  const attempts = [];
  let ok = false;

  for (let i = 0; i < BACKOFF_MS.length; i++) {
    await sleep(BACKOFF_MS[i]);
    const at = new Date().toISOString();
    const res = spawnSync(
      'curl',
      ['-sSL', '--max-time', '30', '-A', UA, '-o', pdfPath, '-w', '%{http_code}', pdfUrl],
      { encoding: 'utf8' },
    );
    const httpCode = res.status === 0 ? res.stdout.trim() : null;
    const bytes = existsSync(pdfPath) ? statSync(pdfPath).size : 0;
    attempts.push({
      attempt: i + 1,
      at,
      method: 'curl',
      httpCode,
      curlError: res.status === 0 ? null : (res.stderr || `curl exit ${res.status}`).trim(),
      bytes,
    });
    if (httpCode === '200' && bytes > 0) {
      ok = true;
      break;
    }
  }

  if (!ok) {
    const last = attempts[attempts.length - 1];
    const log = {
      url: pdfUrl,
      artifact: artifactPath,
      ok: false,
      botBlocked: last.httpCode === '403',
      error: last.curlError || `HTTP ${last.httpCode}`,
      attempts,
    };
    writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n');
    console.log(JSON.stringify(log, null, 2));
    process.exit(2);
    return;
  }

  const extract = spawnSync('pdftotext', ['-layout', pdfPath, artifactPath], { encoding: 'utf8' });
  if (extract.status !== 0) {
    const log = {
      url: pdfUrl,
      artifact: artifactPath,
      pdf: pdfPath,
      ok: false,
      error: `pdftotext exit ${extract.status}: ${(extract.stderr || '').trim()}`,
      attempts,
    };
    writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n');
    console.log(JSON.stringify(log, null, 2));
    process.exit(2);
    return;
  }

  const text = existsSync(artifactPath) ? readFileSync(artifactPath, 'utf8') : '';
  const textLayerUsable = text.trim().length >= MIN_USABLE_TEXT_CHARS;

  const log = {
    url: pdfUrl,
    artifact: artifactPath,
    pdf: pdfPath,
    ok: true,
    textLayerUsable,
    textChars: text.trim().length,
    error: null,
    attempts,
  };
  writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n');
  console.log(JSON.stringify(log, null, 2));
  process.exit(0);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main();
}
