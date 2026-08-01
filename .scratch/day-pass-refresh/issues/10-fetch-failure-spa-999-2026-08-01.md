# Fetch failure: Test Fixture Spa (999) — day-pass refresh 2026-08-01

Status: needs-triage
Type: fetch-failure
Filed-by: /refresh-day-passes run 2026-08-01

> Fixture failure — spa 999 is the test fixture (`.claude/skills/refresh-day-passes/fixtures/spa-999-day-passes.ts`, bogus URL) used to prove the filed-issue lane for [07 failure UX](07-failure-ux.md). Close after reviewing the lane; no fix needed.

## What happened

curl could not resolve the host — DNS failure on every attempt (3 attempts, 2s/8s backoff). Not a bot block (`botBlocked: false`), so the Playwright fallback was not tried. Spa excluded from the run: 1 entry untouched, `lastVerified` stays 2026-01-22.

## Source URL

https://spa-999-does-not-exist.invalid/day-passes

## Retry log

From `.claude/content-out/refresh-runs/2026-08-01/spa-999-fetch-log.json`:

```json
{
  "url": "https://spa-999-does-not-exist.invalid/day-passes",
  "artifact": ".claude/content-out/refresh-runs/2026-08-01/spa-999.html",
  "ok": false,
  "botBlocked": false,
  "error": "curl: (6) Could not resolve host: spa-999-does-not-exist.invalid",
  "attempts": [
    {
      "attempt": 1,
      "at": "2026-08-01T20:23:36.095Z",
      "method": "curl",
      "httpCode": null,
      "curlError": "curl: (6) Could not resolve host: spa-999-does-not-exist.invalid",
      "bytes": 0
    },
    {
      "attempt": 2,
      "at": "2026-08-01T20:23:38.113Z",
      "method": "curl",
      "httpCode": null,
      "curlError": "curl: (6) Could not resolve host: spa-999-does-not-exist.invalid",
      "bytes": 0
    },
    {
      "attempt": 3,
      "at": "2026-08-01T20:23:46.137Z",
      "method": "curl",
      "httpCode": null,
      "curlError": "curl: (6) Could not resolve host: spa-999-does-not-exist.invalid",
      "bytes": 0
    }
  ]
}
```

## Re-run

After the fix, re-run `/refresh-day-passes --spa 999`.
