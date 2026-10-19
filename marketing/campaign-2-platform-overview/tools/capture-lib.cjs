// Shared helpers for capturing real Beyonder screens (mobile, 390 x 844 @3x) for the overview video.
// Sample names are swapped for invented ones as the page renders (the site's code is not changed).
const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');
// Prefer the Playwright that ships with this machine's pre-installed browsers; fall back to the project's.
let chromium;
try { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); } catch { ({ chromium } = createRequire(__filename)('playwright')); }

const NAMES = [
  ['Dr Amara Okafor', 'Dr Maya Bennett'], ['Amara', 'Maya'], ['AO', 'MB'],
  ['James Whitfield', 'Tom Ellis'], ['James', 'Tom'], ['JW', 'TE'],
  ['Priya Nandakumar', 'Hannah Clarke'], ['PN', 'HC'],
  ['Ruth Levene', 'Priya Shah'], ['Ruth', 'Priya'], ['RL', 'PS'],
  ['Harbour Play OT', 'Brightsteps OT'], ['Tidewell Sensory Swim', 'Willow Sensory Swim'],
  ['Little Voices Speech Clinic', 'Little Oak Speech Clinic'], ['Little Voices', 'Little Oak'],
  ['Forest Steps', 'Meadow Steps'], ['Meridian Tutoring', 'Northstar Tutoring'],
  ['Compass Family Advice', 'Kindred Family Advice'], ['Softkit Sensory', 'Calmkit Sensory'],
  ['Bright Minds Speech Therapy', 'Clearwater Speech Therapy'], ['Bright Minds Spe', 'Clearwater Spe'], ['Bright Minds', 'Clearwater'],
  ['Splash Inclusive Swimming', 'Ripple Inclusive Swimming'], ['Splash Inclusive S', 'Ripple Inclusive S'], ['Splash', 'Ripple'],
  ['SensoryPlay Shop', 'Calmkit Sensory'], ['Learning Tree Tutoring', 'Little Oak Tutoring'], ['Learning Tree Tut', 'Little Oak Tut'], ['Learning Tree', 'Little Oak'],
  ['SEND Families United', 'Kindred SEND Families'], ['SEND Families Un', 'Kindred SEND Fam'],
  ['Focus OT Services', 'Brightsteps OT'], ['Jane Smith', 'Sarah Collins'], ['Sarah M.', 'Emma R.'],
  // The video shows the platform as live, so drop "coming soon" notes.
  [' Coming soon.', ''], [' (coming soon)', ''], ['Coming soon', ''],
];

function initScript(names) {
  const swap = (s) => { for (const [a, b] of names) if (s.includes(a)) s = s.split(a).join(b); return s; };
  const walk = (root) => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) { const v = swap(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
    if (root.querySelectorAll) root.querySelectorAll('input,textarea').forEach((el) => { const v = swap(el.value || ''); if (v !== el.value) el.value = v; });
  };
  new MutationObserver((ms) => ms.forEach((m) => { m.addedNodes.forEach((x) => walk(x.nodeType === 3 ? x.parentNode || document.body : x)); if (m.type === 'characterData') walk(m.target.parentNode || document.body); }))
    .observe(document, { childList: true, subtree: true, characterData: true });
  document.addEventListener('DOMContentLoaded', () => walk(document.body));
}

async function open(outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ctx.addInitScript(initScript, NAMES);
  // The capture browser can't reach Google Fonts, so serve the brand fonts from Campaign 1's copies.
  const FONTS = path.join(__dirname, '..', '..', 'campaign-1-earn-from-your-expertise', 'fonts');
  const fontCss = fs.readFileSync(path.join(FONTS, 'fonts.css'), 'utf8').replace(/url\(([^)]+)\)/g, 'url(https://fonts.gstatic.com/local/$1)');
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ contentType: 'text/css', body: fontCss }));
  await ctx.route('https://fonts.gstatic.com/local/**', (r) => r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(path.join(FONTS, path.basename(new URL(r.request().url()).pathname))) }));
  const page = await ctx.newPage();
  const meta = fs.existsSync(path.join(outDir, 'meta.json')) ? JSON.parse(fs.readFileSync(path.join(outDir, 'meta.json'))) : {};
  const save = () => fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2));
  const settle = (ms = 700) => page.waitForTimeout(ms);

  // Where key buttons are (centre x, y in CSS px, measured in the captured image's coordinates).
  async function measure(boxes, scrollEl) {
    if (!boxes) return {};
    return page.evaluate(([boxes, scrollEl]) => {
      const out = {};
      const scr = document.querySelector('.ba-screen.ba-on') || document;
      for (const [k, [sel, text]] of Object.entries(boxes)) {
        const els = [...(sel.startsWith('!') ? document.querySelectorAll(sel.slice(1)) : scr.querySelectorAll(sel))];
        const el = els.find((e) => !text || e.textContent.includes(text));
        if (!el) { out[k] = null; continue; }
        const r = el.getBoundingClientRect();
        out[k] = [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2 + (scrollEl === 'window' ? scrollY : 0))];
      }
      return out;
    }, [boxes, scrollEl]);
  }
  // A single screen as seen on the phone.
  async function view(name, wait = 700, boxes) {
    await settle(wait);
    await page.screenshot({ path: path.join(outDir, `${name}.png`) });
    meta[name] = { kind: 'view', boxes: await measure(boxes) }; save(); console.log('view', name, JSON.stringify(meta[name].boxes));
  }
  // A scrolling screen: the whole content as one tall image, plus how tall the fixed header and bottom bar are.
  async function long(name, mode /* 'app' | 'site' */, boxes) {
    await settle();
    await page.screenshot({ path: path.join(outDir, `${name}.view.png`) });
    let m;
    if (mode === 'app') {
      m = await page.evaluate(() => {
        const scr = document.querySelector('.ba-screen.ba-on') || document;
        const sc = scr.querySelector('.ba-scroll, .ba-qbody');
        const bar = scr.querySelector('.ba-bar, .ba-qtop, .ba-searchhead');
        const nav = document.querySelector('.ba-nav:not(.ba-hide)');
        return { extra: sc ? sc.scrollHeight - sc.clientHeight : 0, header: bar ? bar.getBoundingClientRect().bottom : 0, nav: nav ? innerHeight - nav.getBoundingClientRect().top : 0 };
      });
      await page.setViewportSize({ width: 390, height: 844 + m.extra });
      const css = await page.addStyleTag({ content: '.ba-nav{display:none!important}' });
      await settle(500);
      await page.screenshot({ path: path.join(outDir, `${name}.png`) });
      m.boxes = await measure(boxes);
      await css.evaluate((e) => e.remove());
      await page.setViewportSize({ width: 390, height: 844 });
      m.height = 844 + m.extra;
    } else {
      m = await page.evaluate(() => {
        const nav = [...document.querySelectorAll('nav')].find((n) => getComputedStyle(n).position === 'fixed' && getComputedStyle(n).display !== 'none');
        return { header: 58, nav: nav ? innerHeight - nav.getBoundingClientRect().top : 0, height: document.documentElement.scrollHeight };
      });
      const css = await page.addStyleTag({ content: 'header{visibility:hidden!important} nav[class*="md:hidden"]{display:none!important}' });
      await settle(300);
      await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
      await css.evaluate((e) => e.remove());
      m.boxes = await measure(boxes, 'window');
    }
    meta[name] = { kind: 'long', ...m }; save(); console.log('long', name, JSON.stringify(m));
  }
  async function login(label) {
    await page.goto('http://127.0.0.1:5173/login'); await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.goto('http://127.0.0.1:5173/login'); await settle();
    await page.getByRole('button', { name: label, exact: true }).click();
    await page.fill('input[type=password]', 'demo');
    await page.locator('form button[type=submit]').first().click(); await settle(1500);
  }
  return { browser, page, view, long, login, settle, meta };
}
module.exports = { open, NAMES };
