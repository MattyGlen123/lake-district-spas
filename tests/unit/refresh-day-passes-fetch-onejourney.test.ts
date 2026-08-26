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
import { parseCatalogue, ACCEPT } from '../../.claude/skills/refresh-day-passes/scripts/fetch-onejourney.mjs';

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

  async function run(path = '/340/spa-packages/en') {
    const artifact = join(dir, 'spa-9.json');
    const log = join(dir, 'spa-9-fetch-log.json');
    let stdout = '';
    let status = 0;
    try {
      ({ stdout } = await execFileAsync('node', [SCRIPT, `${base}${path}`, artifact, log], {
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
}, 40000);
