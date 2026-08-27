// onejourney JSON-API fetch tier for /refresh-day-passes (issue 03c).
//
// The point of this tier is that a non-payload response can never BECOME
// an artifact. Issue 03c's hazard is concrete: a Lakeside booking page
// returns HTTP 200 and an HTML shell carrying Elemis retail-shop
// `"price":{"amount":N}` fragments and no day-pass data — quoting one
// would ground a real figure to the wrong product. So the tests below
// lean on the refusal paths, served over a real loopback HTTP server so
// the script's curl call is exercised end to end without network access.
import { execFile, execFileSync } from 'node:child_process';
import { createServer, type Server } from 'node:http';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import {
  parseCatalogue,
  ACCEPT,
  timeslotsUrl,
  probeDates,
  countSlots,
} from '../../.claude/skills/refresh-day-passes/scripts/fetch-onejourney.mjs';

// The stub server below runs in THIS process, so the script must be
// spawned asynchronously — execFileSync would block the event loop and
// the server could never answer the curl call it is waiting on.
const execFileAsync = promisify(execFile);

const SCRIPT = join(process.cwd(), '.claude/skills/refresh-day-passes/scripts/fetch-onejourney.mjs');

const LIST_BODY = JSON.stringify({
  total: 2,
  page: 1,
  perPage: 20,
  data: [
    { id: 18902, name: 'Fizz and Float ', price: { amount: 3900, currencyCode: 'gbp' } },
    { id: 18912, name: 'Signature Sanctuary Spa Day', price: { amount: 9500, currencyCode: 'gbp' } },
  ],
});

const ITEM_BODY = JSON.stringify({
  id: 6712,
  name: 'Aqua Thermal Journey',
  description: 'A thermal journey.',
  price: { amount: 14000, currencyCode: 'gbp' },
});

// The shape that makes this tier necessary: HTTP 200, plausible prices,
// no day-pass data. Trimmed from the real Lakeside shell.
const ELEMIS_SHELL = `<!DOCTYPE html><html><head><title>Lakeside</title></head><body>
<script id="__NEXT_DATA__" type="application/json">
{"props":{"pageProps":{"dehydratedState":{"mutations":[],"queries":[]}}},
"shop":[{"name":"Elemis Pro-Collagen Marine Cream","price":{"amount":11000,"currencyCode":"gbp"}}]}
</script></body></html>`;

describe('parseCatalogue', () => {
  it('accepts the list endpoint shape and returns its packages', () => {
    const r = parseCatalogue(LIST_BODY);
    expect(r.ok).toBe(true);
    expect(r.packages.map((p: { id: number }) => p.id)).toEqual([18902, 18912]);
  });

  it('accepts the single-item endpoint shape as a one-package catalogue', () => {
    const r = parseCatalogue(ITEM_BODY);
    expect(r.ok).toBe(true);
    expect(r.packages).toHaveLength(1);
    expect(r.packages[0].price.amount).toBe(14000);
  });

  it('rejects the Elemis-laden HTML shell as not-json', () => {
    expect(parseCatalogue(ELEMIS_SHELL)).toEqual({ ok: false, reason: 'not-json' });
  });

  it('rejects JSON that carries prices but is not a spa-package payload', () => {
    // Exactly the danger: real `price.amount` values, wrong product.
    const body = JSON.stringify({
      data: [{ sku: 'ELE-1', title: 'Pro-Collagen Marine Cream', price: { amount: 11000 } }],
    });
    expect(parseCatalogue(body)).toEqual({ ok: false, reason: 'unexpected-shape' });
  });

  it('rejects an empty catalogue rather than saving a contentless artifact', () => {
    expect(parseCatalogue(JSON.stringify({ total: 0, data: [] }))).toEqual({
      ok: false,
      reason: 'unexpected-shape',
    });
  });

  it('rejects a package missing price.amount', () => {
    const body = JSON.stringify({ data: [{ id: 1, name: 'No price', price: {} }] });
    expect(parseCatalogue(body)).toEqual({ ok: false, reason: 'unexpected-shape' });
  });

  it('rejects a non-integer price.amount (pence must be an integer)', () => {
    const body = JSON.stringify({ data: [{ id: 1, name: 'Odd', price: { amount: 39.5 } }] });
    expect(parseCatalogue(body)).toEqual({ ok: false, reason: 'unexpected-shape' });
  });

  it('never throws on arbitrary input', () => {
    for (const bad of ['', 'null', '[]', '"a string"', '{', '42']) {
      expect(() => parseCatalogue(bad)).not.toThrow();
      expect(parseCatalogue(bad).ok).toBe(false);
    }
  });
});

describe('fetch-onejourney.mjs', () => {
  let dir: string;
  let server: Server;
  let base: string;
  let route: (path: string) => { status: number; body: string; type?: string };
  let lastAcceptHeader: string | undefined;

  beforeAll(async () => {
    server = createServer((req, res) => {
      lastAcceptHeader = req.headers.accept;
      const { status, body, type } = route(req.url ?? '/');
      res.writeHead(status, { 'Content-Type': type ?? 'application/json' });
      res.end(body);
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const addr = server.address() as { port: number };
    base = `http://127.0.0.1:${addr.port}`;
  });

  afterAll(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'fetch-oj-test-'));
    route = () => ({ status: 200, body: LIST_BODY });
    lastAcceptHeader = undefined;
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  // Availability probing is off unless a test asks for it: it fires one
  // request per package per day, which would otherwise slow every case
  // here and pollute the artifact these assertions read.
  async function run(path = '/340/spa-packages/en', flags: string[] = ['--no-availability']) {
    const artifact = join(dir, 'spa-9.json');
    const log = join(dir, 'spa-9-fetch-log.json');
    let stdout = '';
    let status = 0;
    try {
      ({ stdout } = await execFileAsync('node', [SCRIPT, `${base}${path}`, artifact, log, ...flags], {
        encoding: 'utf8',
        // Exercise the retry count without three real backoff sleeps.
        env: { ...process.env, OJ_BACKOFF_MS: '0,0,0' },
      }));
    } catch (e) {
      const err = e as { code: number; stdout: string };
      status = err.code;
      stdout = err.stdout;
    }
    return { status, log: JSON.parse(stdout), artifact };
  }

  it('prints usage and exits 1 when arguments are missing', () => {
    let status = 0;
    try {
      execFileSync('node', [SCRIPT], { encoding: 'utf8' });
    } catch (e) {
      status = (e as { status: number }).status;
    }
    expect(status).toBe(1);
  });

  it('saves a pretty-printed artifact and records the package ids on success', async () => {
    const { status, log, artifact } = await run();
    expect(status).toBe(0);
    expect(log.ok).toBe(true);
    expect(log.packageCount).toBe(2);
    expect(log.packageIds).toEqual([18902, 18912]);

    const saved = readFileSync(artifact, 'utf8');
    expect(saved).toContain('\n  "data": [');
    expect(JSON.parse(saved)).toEqual(JSON.parse(LIST_BODY));
  });

  it('writes an artifact a name→price quote can be taken from contiguously (gate 2)', async () => {
    const { artifact } = await run();
    const saved = readFileSync(artifact, 'utf8');
    const start = saved.indexOf('"name": "Signature Sanctuary Spa Day"');
    const end = saved.indexOf('"amount": 9500');
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    // The span holding both is short enough to read — no bridging needed.
    expect(end - start).toBeLessThan(400);
  });

  it('sends the vendored Accept header the storefront uses', async () => {
    await run();
    expect(lastAcceptHeader).toBe(ACCEPT);
    expect(ACCEPT).toMatch(/vnd\.onejourney/);
  });

  it('refuses an HTTP 200 HTML shell — never lets Elemis prices become the artifact', async () => {
    route = () => ({ status: 200, body: ELEMIS_SHELL, type: 'text/html' });
    const { status, log, artifact } = await run('/spa/days/7198');
    expect(status).toBe(2);
    expect(log.ok).toBe(false);
    expect(log.notJson).toBe(true);
    expect(log.error).toMatch(/not JSON/);
    expect(existsSync(artifact)).toBe(false);
  });

  it('refuses an HTTP 200 JSON body that is not a spa-package payload', async () => {
    route = () => ({ status: 200, body: JSON.stringify({ data: [{ sku: 'x', price: { amount: 11000 } }] }) });
    const { status, log, artifact } = await run();
    expect(status).toBe(2);
    expect(log.unexpectedShape).toBe(true);
    expect(existsSync(artifact)).toBe(false);
  });

  it('routes a 404 (a withdrawn booking item) to the failure lane, no artifact', async () => {
    route = () => ({ status: 404, body: '{"message":"Not Found"}' });
    const { status, log, artifact } = await run('/340/spa-packages/7198/en');
    expect(status).toBe(2);
    expect(log.ok).toBe(false);
    expect(log.error).toBe('HTTP 404');
    expect(log.attempts).toHaveLength(3); // retried with backoff before giving up
    expect(existsSync(artifact)).toBe(false);
  });

  it('flags a 403 as botBlocked so the caller can fall back', async () => {
    route = () => ({ status: 403, body: 'denied' });
    const { log } = await run();
    expect(log.botBlocked).toBe(true);
  });

  describe('availability probe', () => {
    // Catalogue on the catalogue path; timeslots on the timeslots path.
    // 18912 has slots every day, 18902 has none — the Lakeside shape.
    function catalogueAndSlots(path: string) {
      if (path.includes('/timeslots')) {
        const hasSlots = path.includes('/18912/');
        return {
          status: 200,
          body: hasSlots ? '[{"startTime":"10:00:00","endTime":"17:30:00"}]' : '[]',
        };
      }
      return { status: 200, body: LIST_BODY };
    }

    it('records per-item counts in the artifact and names the dead item in the log', async () => {
      route = catalogueAndSlots;
      const { status, log, artifact } = await run('/340/spa-packages/en', [
        '--availability-days=3',
      ]);
      expect(status).toBe(0);
      expect(log.availabilityProbed).toBe(true);
      expect(log.unbookableItemIds).toEqual([18902]);

      const probe = JSON.parse(readFileSync(artifact, 'utf8')).availabilityProbe;
      expect(probe.windowDays).toBe(3);
      const byId = Object.fromEntries(
        probe.items.map((i: { itemId: number }) => [i.itemId, i]),
      );
      expect(byId[18912]).toMatchObject({ daysProbed: 3, daysWithSlots: 3 });
      expect(byId[18902]).toMatchObject({ daysProbed: 3, daysWithSlots: 0 });
    });

    it('writes evidence gate 6 can grep, carrying the itemId and both counts', async () => {
      route = catalogueAndSlots;
      const { artifact } = await run('/340/spa-packages/en', ['--availability-days=2']);
      const saved = readFileSync(artifact, 'utf8');
      const start = saved.indexOf('"itemId": 18902');
      const end = saved.indexOf('"daysWithSlots": 0');
      expect(start).toBeGreaterThan(-1);
      expect(end).toBeGreaterThan(start);
      expect(end - start).toBeLessThan(300);
    });

    it('omits an item it could not probe rather than calling it unbookable', async () => {
      // Catalogue fine, every timeslots call errors: "could not check"
      // must not be recorded as "no availability", or a blip would flag
      // the whole spa.
      route = (path) =>
        path.includes('/timeslots')
          ? { status: 500, body: 'upstream error' }
          : { status: 200, body: LIST_BODY };
      const { status, log, artifact } = await run('/340/spa-packages/en', [
        '--availability-days=2',
      ]);
      expect(status).toBe(0); // a failed probe never fails the fetch
      expect(log.ok).toBe(true);
      expect(log.availabilityProbed).toBe(false);
      expect(log.availabilityProbeFailed).toBe(true);
      expect(log.unbookableItemIds).toEqual([]);
      // No block at all -> gate 6 is a no-op, rather than a false demotion.
      expect(JSON.parse(readFileSync(artifact, 'utf8')).availabilityProbe).toBeUndefined();
    });

    it('skips probing entirely with --no-availability', async () => {
      route = catalogueAndSlots;
      const { log, artifact } = await run();
      expect(log.availabilityProbed).toBe(false);
      expect(log.availabilityProbeFailed).toBe(false);
      expect(JSON.parse(readFileSync(artifact, 'utf8')).availabilityProbe).toBeUndefined();
    });
  });

}, 40000);

describe('availability probe helpers', () => {
  it('builds the timeslots URL from a catalogue URL', () => {
    expect(timeslotsUrl('https://api.onejourney.travel/340/spa-packages/en', 18904, '2026-08-27')).toBe(
      'https://api.onejourney.travel/340/spa-packages/18904/2026-08-27/timeslots?quantity=1',
    );
  });

  it('builds the same URL from a single-item URL', () => {
    expect(
      timeslotsUrl('https://api.onejourney.travel/340/spa-packages/18904/en', 18904, '2026-08-27'),
    ).toBe('https://api.onejourney.travel/340/spa-packages/18904/2026-08-27/timeslots?quantity=1');
  });

  it('returns null for a URL that is not a spa-packages route', () => {
    expect(timeslotsUrl('https://example.com/nope', 1, '2026-08-27')).toBeNull();
  });

  it('walks consecutive days from the start date', () => {
    expect(probeDates(new Date('2026-08-30T00:00:00Z'), 3)).toEqual([
      '2026-08-30',
      '2026-08-31',
      '2026-09-01',
    ]);
  });

  it('counts slots in both response shapes the endpoint returns', () => {
    // curl gets a bare array; some clients get {"data":[...]}.
    expect(countSlots('[{"startTime":"10:00:00"},{"startTime":"14:00:00"}]')).toBe(2);
    expect(countSlots('{"data":[{"startTime":"10:00:00"}]}')).toBe(1);
    expect(countSlots('[]')).toBe(0);
    expect(countSlots('{"data":[]}')).toBe(0);
  });

  it('returns null — not zero — for a body it cannot read', () => {
    // The distinction the whole gate rests on: "could not check" must
    // never become "there is no availability".
    for (const bad of ['', '<html>error</html>', '{', 'null', '{"message":"Not Found"}']) {
      expect(countSlots(bad)).toBeNull();
    }
  });
});
