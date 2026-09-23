/**
 * Screenshots the site in both themes at phone and desktop width.
 *
 * A redesign is the one kind of change that cannot be verified by a passing
 * build: everything can compile and typecheck while the page is unreadable.
 * This drives a real browser over the built output and saves a picture of
 * each page in each theme, and reports the two failures that are invisible in
 * source — content wider than the viewport, and text that has ended up the
 * same colour as what it sits on.
 *
 *   node scripts/visual-check.mjs            # against the local build in out/
 *   node scripts/visual-check.mjs https://tokoacademy.org
 */
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
].find((p) => p && existsSync(p));

if (!CHROME) {
  console.error('No Chrome found.');
  process.exit(1);
}

const PAGES = ['/', '/courses/', '/about/', '/impact/', '/contact/', '/news/', '/thematic-areas/'];
const VIEWPORTS = [
  { name: 'phone', width: 390, height: 844, isMobile: true },
  { name: 'desktop', width: 1440, height: 900, isMobile: false },
];

const base = process.argv[2];
let server;
let origin = base;

if (!base) {
  // Serve the static export so we are checking what actually ships.
  server = spawn('npx', ['--yes', 'serve@14', 'out', '-l', '4399'], { shell: true, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 9000));
  origin = 'http://localhost:4399';
}

mkdirSync('.visual', { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
});

const problems = [];

try {
  for (const viewport of VIEWPORTS) {
    for (const theme of ['light', 'dark']) {
      const page = await browser.newPage();
      await page.setViewport(viewport);

      // Set the theme the same way a visitor would: the stored preference the
      // inline script reads before first paint.
      await page.evaluateOnNewDocument((t) => {
        try {
          localStorage.setItem('toko-theme', t);
        } catch {}
      }, theme);

      for (const path of PAGES) {
        const url = origin.replace(/\/$/, '') + path;
        try {
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
        } catch {
          problems.push(`${path} [${viewport.name}/${theme}] did not load`);
          continue;
        }
        await new Promise((r) => setTimeout(r, 1200));
        // Let anything that reveals on scroll settle before the picture.
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await new Promise((r) => setTimeout(r, 700));
        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise((r) => setTimeout(r, 400));

        const found = await page.evaluate(() => {
          const out = { overflow: null, invisibleText: [] };

          if (document.documentElement.scrollWidth > window.innerWidth + 1) {
            // Name the widest offender rather than just reporting the symptom.
            let worst = null;
            document.querySelectorAll('body *').forEach((el) => {
              const r = el.getBoundingClientRect();
              if (r.right > window.innerWidth + 1 && r.width > 0) {
                if (!worst || r.right > worst.right) {
                  worst = { right: Math.round(r.right), tag: el.tagName, cls: String(el.className).slice(0, 60) };
                }
              }
            });
            out.overflow = { scrollWidth: document.documentElement.scrollWidth, viewport: window.innerWidth, worst };
          }

          // Text the same colour as its background is the classic dark-mode
          // failure: it compiles, it renders, and it cannot be read.
          const parse = (c) => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
          const lum = ([r, g, b]) =>
            0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
          const backdrop = (el) => {
            let node = el;
            while (node && node !== document.documentElement) {
              const bg = getComputedStyle(node).backgroundColor;
              const a = (bg.match(/[\d.]+/g) || [])[3];
              if (bg && bg !== 'rgba(0, 0, 0, 0)' && a !== '0') return parse(bg);
              node = node.parentElement;
            }
            return [255, 255, 255];
          };
          [...document.querySelectorAll('h1,h2,h3,h4,p,a,span,li')]
            .filter((el) => el.textContent.trim().length > 12)
            .slice(0, 420)
            .forEach((el) => {
              const r = el.getBoundingClientRect();
              if (r.width < 4 || r.height < 4) return;
              const cs = getComputedStyle(el);
              if (cs.visibility === 'hidden' || cs.opacity === '0') return;
              const diff = Math.abs(lum(parse(cs.color)) - lum(backdrop(el)));
              if (diff < 0.06) {
                out.invisibleText.push({
                  t: el.textContent.trim().slice(0, 40),
                  colour: cs.color,
                  tag: el.tagName,
                });
              }
            });
          out.invisibleText = out.invisibleText.slice(0, 5);
          return out;
        });

        if (found.overflow) {
          problems.push(
            `${path} [${viewport.name}/${theme}] overflows: ${found.overflow.scrollWidth}px in ${found.overflow.viewport}px` +
              (found.overflow.worst ? ` — ${found.overflow.worst.tag}.${found.overflow.worst.cls}` : ''),
          );
        }
        for (const t of found.invisibleText) {
          problems.push(`${path} [${viewport.name}/${theme}] unreadable ${t.tag}: "${t.t}" (${t.colour})`);
        }

        const name = (path === '/' ? 'home' : path.replace(/\//g, '-').replace(/^-|-$/g, '')) +
          `--${viewport.name}-${theme}.png`;
        await page.screenshot({ path: `.visual/${name}`, fullPage: false });
      }
      await page.close();
    }
  }
} finally {
  await browser.close();
  if (server) server.kill();
}

console.log('');
if (problems.length === 0) {
  console.log('No overflow and no unreadable text found in either theme.');
} else {
  console.log(`${problems.length} problem(s):`);
  problems.forEach((p) => console.log('  -', p));
}
console.log('');
console.log('Screenshots in .visual/');
