/* Render a premium CV PDF from the built web app.
   Usage: npm run build && node scripts/print.mjs [founder|academic]
   - serves `vite preview` on :4173
   - fonts come from the Fontsource npm packages imported in src/main.jsx
     ("Inter Variable", "Space Grotesk Variable", "Fraunces Variable");
     the render waits for the real faces and hard-fails if any is missing
     — a fallback-font PDF must never ship silently (see BUILD-LOG
     iteration 2)
   - the QR image is NOT part of this repo: if ../dist/qr_linkedin.png
     exists (RenderCV build output) and web/dist/ lacks it, it is staged
     into web/dist/ first, locally and in CI alike
   - checks each sheet for overflow and reports content fill per sheet
   - writes ../../premium/Shabbir_Ahmed_<Variant>_CV_premium.pdf, or to
     $CV_PREMIUM_DIR when set (CI stages premium PDFs there for assembly)
*/
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PREMIUM = process.env.CV_PREMIUM_DIR
  ? path.resolve(process.env.CV_PREMIUM_DIR)
  : path.resolve(WEB_DIR, '..', 'premium');

const VARIANTS = {
  founder: {
    url: 'http://localhost:4173/?print=1',
    out: path.join(PREMIUM, 'Shabbir_Ahmed_Founder_CV_premium.pdf'),
    fonts: [
      '700 40pt "Space Grotesk Variable"',
      '600 12pt "Space Grotesk Variable"',
      '400 10.5pt "Inter Variable"',
      '500 10.5pt "Inter Variable"',
      '600 10.5pt "Inter Variable"',
    ],
  },
  academic: {
    url: 'http://localhost:4173/?print=academic',
    out: path.join(PREMIUM, 'Shabbir_Ahmed_Academic_CV_premium.pdf'),
    fonts: [
      '600 32pt "Fraunces Variable"',
      '600 13pt "Fraunces Variable"',
      '400 10.5pt "Inter Variable"',
      '500 10.5pt "Inter Variable"',
      '600 10.5pt "Inter Variable"',
      'italic 400 10.5pt "Inter Variable"',
    ],
  },
};

const variant = process.argv[2] || 'founder';
const cfg = VARIANTS[variant];
if (!cfg) {
  console.error(`unknown variant "${variant}" (expected founder|academic)`);
  process.exit(1);
}

async function waitForServer(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('preview server did not come up');
}

fs.mkdirSync(PREMIUM, { recursive: true });

// Stage the LinkedIn QR from the RenderCV build output (../dist) into the
// built web app, so the print render and the published site both resolve
// ./qr_linkedin.png without any binary living in this repo.
const qrSrc = path.resolve(WEB_DIR, '..', 'dist', 'qr_linkedin.png');
const qrDst = path.join(WEB_DIR, 'dist', 'qr_linkedin.png');
if (!fs.existsSync(qrDst) && fs.existsSync(qrSrc)) {
  fs.copyFileSync(qrSrc, qrDst);
  console.log('staged qr_linkedin.png from RenderCV dist into web/dist');
}

const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
  cwd: WEB_DIR,
  stdio: 'ignore',
});

let browser;
try {
  await waitForServer('http://localhost:4173/');
  browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(cfg.url, { waitUntil: 'networkidle' });

  // Wait until the real fonts are loaded and usable — and FAIL LOUDLY if not.
  const fontStatus = await page.evaluate(async (specs) => {
    await document.fonts.ready;
    const loaded = await Promise.all(specs.map((s) => document.fonts.load(s)));
    return specs.map((s, i) => ({ spec: s, faces: loaded[i].length, check: document.fonts.check(s) }));
  }, cfg.fonts);
  console.log('font check:', JSON.stringify(fontStatus));
  const missing = fontStatus.filter((f) => f.faces === 0 || !f.check);
  if (missing.length) {
    throw new Error('Required fonts did not load: ' + JSON.stringify(missing));
  }
  await page.waitForTimeout(250);

  const report = await page.evaluate(() => {
    const sheets = [...document.querySelectorAll('.sheet')].map((s, i) => {
      const sRect = s.getBoundingClientRect();
      let contentBottom = 0;
      s.querySelectorAll('*').forEach((el) => {
        if (el.classList.contains('p-footer') || el.closest('.p-footer')) return;
        const r = el.getBoundingClientRect();
        if (r.height > 0) contentBottom = Math.max(contentBottom, r.bottom - sRect.top);
      });
      return {
        sheet: i + 1,
        scrollHeight: s.scrollHeight,
        clientHeight: s.clientHeight,
        overflow: s.scrollHeight > s.clientHeight + 1,
        contentBottomPx: Math.round(contentBottom),
        fillPct: Math.round((contentBottom / s.clientHeight) * 100),
      };
    });
    const nameEl = document.querySelector('.p-name, .a-name');
    return { sheets, nameFont: nameEl ? getComputedStyle(nameEl).fontFamily : null };
  });
  console.log('sheet check:', JSON.stringify(report));
  const overflowing = report.sheets.filter((s) => s.overflow);
  if (overflowing.length) {
    throw new Error('Sheet overflow detected: ' + JSON.stringify(overflowing));
  }

  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: cfg.out,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  console.log('wrote', cfg.out);
} finally {
  if (browser) await browser.close();
  server.kill();
}
