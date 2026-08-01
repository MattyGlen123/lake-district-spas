#!/usr/bin/env node
// Playwright fallback fetch for /refresh-day-passes (PRD §2 blocked
// tier / bot-blocked or client-rendered pages). Uses the repo's
// existing @playwright/test install — run `npx playwright install`
// once if browsers are missing.
//
// Usage: node fetch-playwright.mjs <url> <artifact-path> <log-path>
//
// Saves the RENDERED page HTML (page.content()) as the fetch artifact —
// it is gated exactly like a curl artifact. Up to 2 attempts, 5s
// backoff, all appended to the JSON retry log at <log-path> (appends to
// an existing curl log so one file holds the full retry history).
//
// Exit codes: 0 fetched · 2 failed after retries (file the issue) ·
// 1 usage error.

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { chromium } from '@playwright/test';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const BACKOFF_MS = [0, 5000];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function attemptFetch(url, artifactPath) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ userAgent: UA, viewport: { width: 1280, height: 900 } });
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Let client-side rendering settle; don't fail the attempt if the
    // network never goes fully idle (analytics beacons etc.).
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    const status = response ? response.status() : null;
    const html = await page.content();
    return { status, html };
  } finally {
    await browser.close();
  }
}

async function main() {
  const [url, artifactPath, logPath] = process.argv.slice(2);
  if (!url || !artifactPath || !logPath) {
    console.error('usage: node fetch-playwright.mjs <url> <artifact-path> <log-path>');
    process.exit(1);
  }

  const prior = existsSync(logPath) ? JSON.parse(readFileSync(logPath, 'utf8')) : null;
  const attempts = prior?.attempts ?? [];
  const base = attempts.length;
  let ok = false;
  let lastError = null;

  for (let i = 0; i < BACKOFF_MS.length; i++) {
    await sleep(BACKOFF_MS[i]);
    const at = new Date().toISOString();
    try {
      const { status, html } = await attemptFetch(url, artifactPath);
      const good = status === 200 && html.length > 0;
      attempts.push({
        attempt: base + i + 1,
        at,
        method: 'playwright-chromium',
        httpCode: status === null ? null : String(status),
        curlError: null,
        bytes: html.length,
      });
      if (good) {
        writeFileSync(artifactPath, html);
        ok = true;
        break;
      }
      lastError = `HTTP ${status}`;
    } catch (e) {
      lastError = String(e?.message ?? e).split('\n')[0];
      attempts.push({
        attempt: base + i + 1,
        at,
        method: 'playwright-chromium',
        httpCode: null,
        curlError: lastError,
        bytes: 0,
      });
    }
  }

  const log = {
    url,
    artifact: artifactPath,
    ok,
    botBlocked: false,
    error: ok ? null : lastError,
    attempts,
  };
  writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n');
  console.log(JSON.stringify(log, null, 2));
  process.exit(ok ? 0 : 2);
}

main();
