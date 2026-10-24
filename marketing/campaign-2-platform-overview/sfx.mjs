// Synthesises the video's sound effects and mixes them on the cue list from animation.html (window.SFX).
// No samples or downloads: every sound is generated here, so there are no licensing questions.
// Usage: node sfx.mjs cues.json out.wav seconds
import { readFileSync, writeFileSync } from 'node:fs';

const [cuesPath, outPath, secs] = process.argv.slice(2);
const RATE = 44100;
let seed = 1; const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const buf = (s) => new Float32Array(Math.round(s * RATE));
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) * d));
function lowpass(x, cut) { const a = Math.exp(-2 * Math.PI * cut / RATE); let y = 0; return x.map((v) => (y = (1 - a) * v + a * y)); }
function highpass(x, cut) { const lp = lowpass(x, cut); return x.map((v, i) => v - lp[i]); }
function tone(len, f0, f1, att, dec, amp, kind = 'sin') {
  const b = buf(len); let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / RATE, f = f1 ? f0 * Math.pow(f1 / f0, t / len) : f0; ph += 2 * Math.PI * f / RATE;
    b[i] = amp * env(t, att, dec) * (kind === 'tri' ? (2 / Math.PI) * Math.asin(Math.sin(ph)) : Math.sin(ph));
  }
  return b;
}
const mixInto = (a, b, off = 0) => { for (let i = 0; i < b.length && i + off < a.length; i++) a[i + off] += b[i]; return a; };

const SOUNDS = {
  // soft UI tap: tiny filtered click with a short high tone
  tap: () => { const n = highpass(buf(.04).map(noise), 2500).map((v, i) => v * env(i / RATE, .001, 160) * .35); return mixInto(n, tone(.04, 2200, 1800, .001, 90, .12)); },
  // light swish for swipes and slides: noise swept through a resonant band
  swish: () => { const len = .32, b = buf(len); let lp = 0, bp = 0;
    for (let i = 0; i < b.length; i++) { const t = i / RATE, f = 900 + 3200 * t / len, c = 2 * Math.sin(Math.PI * f / RATE); lp += c * bp; bp += c * (noise() - lp - .6 * bp); b[i] = bp * .09 * Math.pow(Math.sin(Math.PI * t / len), 2); } return b; },
  // bigger whoosh for scene changes
  whoosh: () => { const len = .8, b = buf(len); let lp = 0, bp = 0;
    for (let i = 0; i < b.length; i++) { const t = i / RATE, f = 300 + 1500 * Math.sin(Math.PI * t / len), c = 2 * Math.sin(Math.PI * f / RATE); lp += c * bp; bp += c * (noise() - lp - .5 * bp); b[i] = bp * .11 * Math.pow(Math.sin(Math.PI * t / len), 1.5); } return b; },
  // bubbly pop for cards appearing
  pop: () => tone(.14, 820, 380, .004, 28, .32),
  // message ping
  ping: () => mixInto(tone(.6, 1568, 0, .003, 7, .14), tone(.6, 2093, 0, .003, 9, .09)),
  // notification ding
  ding: () => mixInto(tone(1.0, 1318.5, 0, .002, 4.5, .16), tone(1.0, 1975.5, 0, .002, 6, .1)),
  // warm three-note chime
  chime: () => { const b = buf(2.0); [[1046.5, 0], [1318.5, .07], [1568, .14]].forEach(([f, d]) => mixInto(b, tone(1.8, f, 0, .004, 2.4, .1, 'tri'), Math.round(d * RATE))); return b; },
  // counting tick
  tick: () => tone(.02, 3000, 0, .0005, 260, .07),
  // number landing
  thud: () => mixInto(tone(.4, 110, 55, .003, 10, .45), highpass(buf(.03).map(noise), 1500).map((v, i) => v * env(i / RATE, .0005, 200) * .12)),
  // verified tick: two rising notes
  check: () => mixInto(tone(.12, 880, 0, .002, 30, .16), tone(.2, 1318.5, 0, .002, 18, .16), Math.round(.06 * RATE)),
  // wing flutter: a quick run of soft feathery pulses
  flutter: () => { const len = .7, b = buf(len), n = lowpass(buf(len).map(noise), 2200);
    for (let i = 0; i < b.length; i++) { const t = i / RATE, pulse = Math.pow(Math.max(0, Math.sin(2 * Math.PI * 19 * t)), 6); b[i] = n[i] * pulse * .5 * Math.sin(Math.PI * t / len); } return b; },
  // keyboard tap
  type: () => highpass(buf(.03).map(noise), 3000).map((v, i) => v * env(i / RATE, .0005, 220) * .14),
};
const cache = {};
const cues = JSON.parse(readFileSync(cuesPath, 'utf8'));
const out = buf(+secs);
for (const [t, name, vol] of cues) {
  const s = cache[name] || (cache[name] = SOUNDS[name]());
  const off = Math.round(t * RATE);
  for (let i = 0; i < s.length && off + i < out.length; i++) out[off + i] += s[i] * vol;
}
// gentle limiter, then 16-bit mono WAV
let peak = 0; for (const v of out) peak = Math.max(peak, Math.abs(v));
const g = peak > 0 ? .7 / peak : 1;   // normalise: loudest effect at about -3 dB (the music and voice mix sits these lower later)
const data = Buffer.alloc(out.length * 2);
out.forEach((v, i) => data.writeInt16LE(Math.round(Math.tanh(v * g) * 32767), i * 2));
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
h.writeUInt32LE(RATE, 24); h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
writeFileSync(outPath, Buffer.concat([h, data]));
console.log(`${cues.length} cues, peak ${peak.toFixed(2)} → ${outPath}`);
