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
        /*
         * A long settle, deliberately. 400ms caught the hero mid-cross-fade
         * and produced a screenshot of two slides overlaid at half opacity
         * plus a page of half-finished reveals — a picture of a broken site
         * that was not broken. A screenshot tool that lies is worse than none.
         */
        await new Promise((r) => setTimeout(r, 2200));

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

          /*
           * Text the same colour as its background is the classic dark-mode
           * failure: it compiles, it renders, and it cannot be read.
           *
           * Two things this has to get right or it cries wolf.
           *
           * It only measures an element that holds text ITSELF. A <li> whose
           * words all live in a styled <h3> and <p> inherits its own colour
           * from the body while its children override — comparing the
           * container's colour against text it does not actually draw reports
           * a failure that is not there.
           *
           * And it composites alpha. A label on `bg-brand/10` computes to
           * `rgba(74,124,42,0.1)`; reading that as solid green makes green
           * text on a pale green tint look like green on green, which is the
           * opposite of the truth.
           */
          const parse = (c) => {
            const n = (c.match(/[\d.]+/g) || []).map(Number);
            return { rgb: n.slice(0, 3), a: n.length > 3 ? n[3] : 1 };
          };
          const over = (top, bottom) =>
            top.rgb.map((c, i) => c * top.a + bottom[i] * (1 - top.a));
          /*
           * Relative luminance, gamma-corrected — the WCAG definition.
           *
           * The naive version, `0.2126 * r/255 + …`, skips the sRGB transfer
           * curve and is badly wrong in the mid-tones: it scored #7A828A on
           * white at 1.89:1 when the true figure is 3.9:1, and reported a
           * dozen perfectly legible captions as invisible. A checker that
           * cries wolf is worse than no checker, because it trains you to
           * skim its output.
           */
          const channel = (v) => {
            const c = v / 255;
            return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
          };
          const lum = ([r, g, b]) =>
            0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

          /*
           * Walk outward compositing every translucent layer onto what is
           * behind it, so the number is the colour an eye actually receives.
           *
           * Returns null when an ancestor paints a gradient or a photograph.
           * `backgroundColor` is transparent on those, so a naive walk sails
           * past a green-to-blue band and reports the body's white — which
           * made white type on a saturated CTA look like white on white, at a
           * perfect 1.00:1. There is no honest single colour for a gradient,
           * so the right answer is to decline rather than to guess.
           */
          const backdrop = (el) => {
            const layers = [];
            let node = el;
            while (node && node !== document.documentElement) {
              const cs = getComputedStyle(node);
              if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
              const c = parse(cs.backgroundColor);
              if (c.a > 0) layers.push(c);
              node = node.parentElement;
            }
            let result = [255, 255, 255];
            const rootBg = parse(getComputedStyle(document.documentElement).backgroundColor);
            if (rootBg.a > 0) result = rootBg.rgb;
            for (let i = layers.length - 1; i >= 0; i -= 1) result = over(layers[i], result);
            return result;
          };

          // Does this element draw text of its own, rather than only wrapping
          // children that do?
          const ownText = (el) =>
            [...el.childNodes]
              .filter((n) => n.nodeType === 3)
              .map((n) => n.textContent.trim())
              .join(' ')
              .trim();

          [...document.querySelectorAll('h1,h2,h3,h4,h5,p,a,span,li,td,th,button')]
            .slice(0, 600)
            .forEach((el) => {
              const text = ownText(el);
              if (text.length < 10) return;
              const r = el.getBoundingClientRect();
              if (r.width < 4 || r.height < 4) return;
              const cs = getComputedStyle(el);
              if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.15) return;

              const fg = parse(cs.color);
              const bg = backdrop(el);
              // A gradient or photograph behind it: no single backdrop colour
              // to measure against, so this one is not ours to judge.
              if (!bg) return;
              const effective = over(fg, bg);
              const ratio = (() => {
                const a = lum(effective) + 0.05;
                const b = lum(bg) + 0.05;
                return a > b ? a / b : b / a;
              })();

              // 2.2:1 is well below the 4.5:1 standard — this is looking for
              // text that cannot be seen at all, not for every contrast nit.
              if (ratio < 2.2) {
                out.invisibleText.push({
                  t: text.slice(0, 40),
                  colour: cs.color,
                  ratio: ratio.toFixed(2),
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
          problems.push(`${path} [${viewport.name}/${theme}] unreadable ${t.tag} (${t.ratio}:1): "${t.t}" ${t.colour}`);
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
