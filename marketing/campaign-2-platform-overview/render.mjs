// Renders animation.html to a vertical MP4 (1080 x 1920, 30fps, no audio yet).
// Usage: NODE_PATH=<global node_modules> node render.mjs [from-seconds] [to-seconds]
// Needs Playwright (Chromium) and ffmpeg. Serves this folder over http so the page can load its screenshots.
import { spawn, execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch { ({ chromium } = require('playwright')); }

const here = path.dirname(fileURLToPath(import.meta.url));
const VERSION = 'v1';
const OUT = path.join(here, `beyonder-overview-${VERSION}.mp4`);
const FPS = 30, LOOP = 205;
const from = +(process.argv[2] || 0), to = +(process.argv[3] || LOOP);

const TYPES = { '.html': 'text/html', '.json': 'application/json', '.jpg': 'image/jpeg', '.css': 'text/css', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    const p = path.join(here, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(here)) throw new Error('outside');
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
    res.end(await readFile(p));
  } catch { res.writeHead(404); res.end(); }
}).listen(0, '127.0.0.1');
await new Promise((r) => server.once('listening', r));
const url = `http://127.0.0.1:${server.address().port}/animation.html?render`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
await page.goto(url);
await page.evaluate(() => window.ready);
const stage = await page.$('#stage');

const enc = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((res, rej) => enc.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exited ' + c)))));

const first = Math.round(from * FPS), last = Math.round(to * FPS);
const t0 = Date.now();
for (let i = first; i < last; i++) {
  await page.evaluate((ms) => window.renderAt(ms), (i * 1000) / FPS);
  const buf = await stage.screenshot({ type: 'jpeg', quality: 95 });
  if (!enc.stdin.write(buf)) await new Promise((r) => enc.stdin.once('drain', r));
  if ((i - first) % 300 === 0) console.log(`frame ${i - first}/${last - first} · ${Math.round((Date.now() - t0) / 1000)}s`);
}
enc.stdin.end();
await done;
await browser.close();
server.close();
const d = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${OUT}"`).toString());
console.log(`${path.basename(OUT)}: ${d.toFixed(1)}s`);
