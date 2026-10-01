// Renders animation.html to frames, then (via ffmpeg) to email GIF + MP4.
// Usage: node render.mjs   (or NODE_PATH=<global node_modules> node render.mjs)
//   (needs Playwright + ffmpeg; Chromium is found via PLAYWRIGHT_BROWSERS_PATH)
import { execSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

// require() honours NODE_PATH, so a globally installed Playwright works too.
const { chromium } = createRequire(import.meta.url)('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const LOOP = 30, FPS = 30, SCALE = 2;
const frames = path.join(process.env.FRAMES_DIR || path.join(here, '.frames'));
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 600, height: 760 }, deviceScaleFactor: SCALE });
await page.goto(pathToFileURL(path.join(here, 'animation.html')).href + '?render');
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => typeof window.renderAt === 'function');
const stage = await page.$('#stage');
const total = LOOP * FPS;
for (let i = 0; i < total; i++) {
  await page.evaluate((ms) => window.renderAt(ms), (i * 1000) / FPS);
  await stage.screenshot({ path: path.join(frames, `f${String(i).padStart(4, '0')}.png`) });
}
await browser.close();

const sh = (c) => execSync(c, { stdio: 'inherit' });
const inp = `-framerate ${FPS} -i ${frames}/f%04d.png`;
// MP4 (1200 x 1520) for web, social and "watch the walkthrough" links.
sh(`ffmpeg -y -loglevel error ${inp} -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart ${here}/earn-from-your-expertise.mp4`);
// GIF (600 x 760, 15fps) for email.
const vf = `fps=15,scale=600:-1:flags=lanczos`;
sh(`ffmpeg -y -loglevel error ${inp} -vf "${vf},palettegen=max_colors=128:stats_mode=full" ${frames}/palette.png`);
sh(`ffmpeg -y -loglevel error ${inp} -i ${frames}/palette.png -lavfi "${vf} [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" -loop 0 ${here}/earn-from-your-expertise.gif`);
// Still of the finished opening shot (4.3s) — the Outlook fallback image (see email-snippet.html).
sh(`ffmpeg -y -loglevel error -i ${frames}/f${String(Math.round(4.3 * FPS)).padStart(4, '0')}.png -vf scale=600:-1:flags=lanczos ${here}/earn-from-your-expertise-still.png`);
rmSync(frames, { recursive: true, force: true });
console.log('done');
