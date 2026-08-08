// PDF-tier fetch script for /refresh-day-passes (PRD §2 pdf tier):
// missing poppler must be reported with the install hint, never a
// crash. Network/pdftotext-success paths are covered by the real demo
// run, not unit tests (no PDF fixture worth committing here).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { havePdftotext, POPPLER_INSTALL_HINT } from '../../.claude/skills/refresh-day-passes/scripts/fetch-pdf.mjs';

// A PATH with node's own directory (so `node` itself is still spawnable)
// plus only the base OS dirs — deliberately excludes /opt/homebrew/bin and
// any other package-manager bin dir, so pdftotext is genuinely absent
// regardless of what's installed on the host running this suite.
const PATH_WITHOUT_POPPLER = [dirname(process.execPath), '/usr/bin', '/bin', '/usr/sbin', '/sbin'].join(':');

const FETCH_PDF = join(process.cwd(), '.claude/skills/refresh-day-passes/scripts/fetch-pdf.mjs');

describe('havePdftotext', () => {
  it('reports missing when the spawn call errors with ENOENT', () => {
    const fakeSpawn = () => ({ error: { code: 'ENOENT' } });
    expect(havePdftotext(fakeSpawn as never)).toBe(false);
  });

  it('reports present for any non-ENOENT result (present binaries can exit non-zero on -v)', () => {
    const fakeSpawn = () => ({ status: 99, error: undefined });
    expect(havePdftotext(fakeSpawn as never)).toBe(true);
  });
});

describe('fetch-pdf.mjs — missing poppler', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'fetch-pdf-test-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('exits 2 with the brew install hint, never crashes, when pdftotext is not on PATH', () => {
    const artifact = join(dir, 'spa-2.txt');
    const log = join(dir, 'spa-2-fetch-log.json');
    // Strip PATH down to nothing so pdftotext (and curl) cannot be found —
    // proves the dependency check runs before any network call.
    let stdout = '';
    let status = 0;
    try {
      stdout = execFileSync('node', [FETCH_PDF, 'https://example.com/brochure.pdf', artifact, log], {
        encoding: 'utf8',
        env: { ...process.env, PATH: PATH_WITHOUT_POPPLER },
      });
    } catch (e) {
      const err = e as { status: number; stdout: string };
      status = err.status;
      stdout = err.stdout;
    }
    expect(status).toBe(2);
    const parsed = JSON.parse(stdout);
    expect(parsed.ok).toBe(false);
    expect(parsed.missingDependency).toBe(true);
    expect(parsed.error).toBe(POPPLER_INSTALL_HINT);
    expect(POPPLER_INSTALL_HINT).toMatch(/brew install poppler/);
  });

  it('prints usage and exits 1 when arguments are missing', () => {
    let status = 0;
    try {
      execFileSync('node', [FETCH_PDF], { encoding: 'utf8' });
    } catch (e) {
      status = (e as { status: number }).status;
    }
    expect(status).toBe(1);
  });
});
