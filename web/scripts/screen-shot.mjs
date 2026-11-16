/* Screenshot the screen (hero) render for a visual sanity check.
   Usage: npm run build && node scripts/screen-shot.mjs
*/
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(WEB_DIR, '..', 'premium', 'screen.png');

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

const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
  cwd: WEB_DIR,
  stdio: 'ignore',
});
let browser;
try {
  await waitForServer('http://localhost:4173/');
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.screenshot({ path: OUT, fullPage: true });
  console.log('wrote', OUT);
} finally {
  if (browser) await browser.close();
  server.kill();
}
