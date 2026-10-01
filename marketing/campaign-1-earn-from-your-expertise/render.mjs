// Renders animation.html to frames, then (via ffmpeg) to email GIF + MP4.
// Usage: node render.mjs   (or NODE_PATH=<global node_modules> node render.mjs)
//   (needs Playwright, ffmpeg and gifsicle; Chromium is found via PLAYWRIGHT_BROWSERS_PATH)
import { execSync, spawn } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

// require() honours NODE_PATH, so a globally installed Playwright works too.
const { chromium } = createRequire(import.meta.url)('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const LOOP = 30, FPS = 30, SCALE = 2;
const tmp = process.env.FRAMES_DIR || path.join(here, '.render');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
const sh = (c) => execSync(c, { stdio: 'inherit' });
const mp4 = path.join(here, 'earn-from-your-expertise.mp4');
const gif = path.join(here, 'earn-from-your-expertise.gif');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 600, height: 760 }, deviceScaleFactor: SCALE });
await page.goto(pathToFileURL(path.join(here, 'animation.html')).href + '?render');
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => typeof window.renderAt === 'function');
const stage = await page.$('#stage');

// Frames are piped straight into ffmpeg so a long render never fills the disk.
// MP4 (1200 x 1520) for web, social and "watch the walkthrough" links.
const enc = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-movflags', '+faststart', mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((res, rej) => enc.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exited ' + c)))));
const STILL = Math.round(4.3 * FPS);
const total = LOOP * FPS;
for (let i = 0; i < total; i++) {
  await page.evaluate((ms) => window.renderAt(ms), (i * 1000) / FPS);
  const png = await stage.screenshot();
  if (i === STILL) writeFileSync(path.join(tmp, 'still.png'), png);
  if (!enc.stdin.write(png)) await new Promise((r) => enc.stdin.once('drain', r));
}
enc.stdin.end();
await done;
await browser.close();

// GIF (600 x 760, 12fps) for email, made from the MP4, then squeezed with gifsicle to keep it under ~4MB.
const vf = 'fps=12,scale=600:-1:flags=lanczos';
sh(`ffmpeg -y -loglevel error -i ${mp4} -vf "${vf},palettegen=max_colors=96:stats_mode=diff" ${tmp}/palette.png`);
sh(`ffmpeg -y -loglevel error -i ${mp4} -i ${tmp}/palette.png -lavfi "${vf} [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" -loop 0 ${tmp}/raw.gif`);
sh(`gifsicle -O3 --lossy=40 ${tmp}/raw.gif -o ${gif}`);
// Still of the finished opening shot (4.3s): the Outlook fallback image (see email-snippet.html).
sh(`ffmpeg -y -loglevel error -i ${tmp}/still.png -vf scale=600:-1:flags=lanczos ${path.join(here, 'earn-from-your-expertise-still.png')}`);
rmSync(tmp, { recursive: true, force: true });

// Check both files run the full loop — a truncated GIF otherwise slips through unnoticed.
for (const f of [mp4, gif]) {
  const d = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${f}`).toString());
  if (Math.abs(d - LOOP) > 0.5) throw new Error(`${path.basename(f)} is ${d}s, expected ${LOOP}s`);
  console.log(`${path.basename(f)}: ${d.toFixed(1)}s`);
}
console.log('done');
