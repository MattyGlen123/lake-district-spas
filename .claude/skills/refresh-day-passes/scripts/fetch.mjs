#!/usr/bin/env node
// Curl fetch with retry + backoff for /refresh-day-passes (PRD §2).
//
// Usage: node fetch.mjs <url> <artifact-path> <log-path>
//
// Fetches with plain curl + browser UA (never WebFetch — PRD §8).
// Up to 3 attempts, backoff 2s then 8s. Every attempt is appended to
// the JSON retry log at <log-path> — the log is the evidence block for
// a filed fetch-failure issue.
//
// Exit codes: 0 fetched (HTTP 200, non-empty artifact) · 2 fetch
// failed after retries (route to the failure lane) · 1 usage error.
// A 403 failure sets "botBlocked": true in the log — the caller should
// try the Playwright fallback (fetch-playwright.mjs) before filing.

import { spawnSync } from 'node:child_process';
import { writeFileSync, statSync, unlinkSync, existsSync } from 'node:fs';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const BACKOFF_MS = [0, 2000, 8000];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const [url, artifactPath, logPath] = process.argv.slice(2);
  if (!url || !artifactPath || !logPath) {
    console.error('usage: node fetch.mjs <url> <artifact-path> <log-path>');
    process.exit(1);
  }

  const attempts = [];
  let ok = false;

  for (let i = 0; i < BACKOFF_MS.length; i++) {
    await sleep(BACKOFF_MS[i]);
    const at = new Date().toISOString();
    const res = spawnSync(
      'curl',
      ['-sSL', '--max-time', '30', '-A', UA, '-o', artifactPath, '-w', '%{http_code}', url],
      { encoding: 'utf8' },
    );
    const httpCode = res.status === 0 ? res.stdout.trim() : null;
    const bytes = existsSync(artifactPath) ? statSync(artifactPath).size : 0;
    const attempt = {
      attempt: i + 1,
      at,
      method: 'curl',
      httpCode,
      curlError: res.status === 0 ? null : (res.stderr || `curl exit ${res.status}`).trim(),
      bytes,
    };
    attempts.push(attempt);
    if (httpCode === '200' && bytes > 0) {
      ok = true;
      break;
    }
  }

  const last = attempts[attempts.length - 1];
  const log = {
    url,
    artifact: artifactPath,
    ok,
    botBlocked: !ok && last.httpCode === '403',
    error: ok ? null : last.curlError || `HTTP ${last.httpCode}`,
    attempts,
  };
  writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n');
  if (!ok && existsSync(artifactPath)) unlinkSync(artifactPath); // never gate against an error page
  console.log(JSON.stringify(log, null, 2));
  process.exit(ok ? 0 : 2);
}

main();
