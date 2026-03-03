import { useEffect, useRef, useState } from "react";

// ── CONFIG ──────────────────────────────────────────────
const CFG = {
  numStars: 320,
  zoomSpeed: 0.0003,
  rotationSpeed: 0.00012,
  bgRotationSpeed: 0.00032,
  minSize: 0.2,
  maxSize: 0.9,
};

const STAR_COLORS = [
  { r: 210, g: 228, b: 255, weight: 6 },
  { r: 255, g: 255, b: 255, weight: 4 },
  { r: 255, g: 240, b: 180, weight: 3 },
  { r: 255, g: 248, b: 210, weight: 2 },
  { r: 180, g: 210, b: 255, weight: 2 },
];

function pickStarColor() {
  const total = STAR_COLORS.reduce((s, c) => s + c.weight, 0);
  let r = Math.random() * total;
  for (const c of STAR_COLORS) {
    r -= c.weight;
    if (r <= 0) return c;
  }
  return STAR_COLORS[0];
}

function initStars(count: number) {
  return Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
    z: Math.random(),
    size: CFG.minSize + Math.random() * (CFG.maxSize - CFG.minSize),
    brightness: 0.45 + Math.random() * 0.55,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.004 + Math.random() * 0.012,
    color: pickStarColor(),
  }));
}

function initBgTwinklers(count: number) {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() < 0.3 ? (Math.random() * 0.6 + 0.2) * 3.0 : Math.random() * 0.6 + 0.2,
    phase: Math.random() * Math.PI * 2,
    speed: 0.008 + Math.random() * 0.018,
    baseAlpha: 0.15 + Math.random() * 0.35,
  }));
}

function paintNightSky(off: HTMLCanvasElement) {
  const W = off.width;
  const H = off.height;
  const ctx = off.getContext("2d")!;

  const baseGrad = ctx.createLinearGradient(0, 0, W * 0.3, H);
  baseGrad.addColorStop(0, "rgb(2, 5, 18)");
  baseGrad.addColorStop(0.25, "rgb(3, 8, 28)");
  baseGrad.addColorStop(0.5, "rgb(4, 10, 35)");
  baseGrad.addColorStop(0.75, "rgb(5, 14, 42)");
  baseGrad.addColorStop(1, "rgb(6, 16, 48)");
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, W, H);

  // Dark organic cloud masses
  const darkClouds: [number, number, number, number, number][] = [
    [W * 0.2, H * 0.35, W * 0.28, H * 0.22, 0.55],
    [W * 0.65, H * 0.2, W * 0.22, H * 0.3, 0.5],
    [W * 0.45, H * 0.6, W * 0.35, H * 0.2, 0.48],
    [W * 0.8, H * 0.7, W * 0.25, H * 0.28, 0.52],
    [W * 0.1, H * 0.75, W * 0.2, H * 0.18, 0.45],
    [W * 0.55, H * 0.85, W * 0.3, H * 0.16, 0.5],
    [W * 0.3, H * 0.12, W * 0.24, H * 0.2, 0.46],
  ];
  darkClouds.forEach(([x, y, rw, rh, alpha], i) => {
    const rng = (s: number) => {
      const v = Math.sin(s) * 43758.5453;
      return v - Math.floor(v);
    };
    const maxR = Math.max(rw, rh);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR);
    grad.addColorStop(0, `rgba(0,0,0,${alpha})`);
    grad.addColorStop(0.5, `rgba(0,0,0,${alpha * 0.5})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rng(i * 5.3) * Math.PI);
    ctx.scale(rw / maxR, rh / maxR);
    ctx.filter = "blur(40px)";
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, maxR, 0, Math.PI * 2);
    ctx.fill();
    ctx.filter = "none";
    ctx.restore();
  });

  // Depth blobs
  const depthBlobs: [number, number, number, number, number, number, number, number][] = [
    [W * 0.1, H * 0.2, W * 0.4, H * 0.35, 3, 9, 32, 0.45],
    [W * 0.5, H * 0.1, W * 0.5, H * 0.3, 2, 7, 25, 0.4],
    [W * 0.85, H * 0.35, W * 0.35, H * 0.4, 4, 12, 40, 0.35],
    [W * 0.3, H * 0.7, W * 0.45, H * 0.35, 5, 14, 45, 0.3],
    [W * 0.7, H * 0.75, W * 0.4, H * 0.3, 3, 10, 35, 0.35],
    [W * 0.15, H * 0.8, W * 0.3, H * 0.25, 2, 8, 28, 0.28],
    [W * 0.6, H * 0.25, W * 0.25, H * 0.2, 5, 28, 55, 0.12],
    [W * 0.2, H * 0.55, W * 0.22, H * 0.18, 4, 24, 50, 0.1],
    [W * 0.75, H * 0.6, W * 0.2, H * 0.16, 6, 30, 58, 0.09],
    [W * 0.45, H * 0.85, W * 0.28, H * 0.18, 5, 26, 52, 0.11],
  ];
  depthBlobs.forEach(([x, y, rw, rh, r, g, b, a]) => {
    const maxR = Math.max(rw, rh);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR);
    grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},${a * 0.5})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(rw / maxR, rh / maxR);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, maxR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Teal accent clouds
  const tealClouds: [number, number, number, number, number, number, number, number][] = [
    [W * 0.55, H * 0.3, W * 0.18, H * 0.14, 0, 45, 65, 0.28],
    [W * 0.22, H * 0.45, W * 0.32, H * 0.07, 0, 90, 60, 0.42],
    [W * 0.78, H * 0.55, W * 0.16, H * 0.13, 5, 60, 80, 0.26],
    [W * 0.4, H * 0.65, W * 0.12, H * 0.1, 0, 38, 58, 0.2],
    [W * 0.88, H * 0.2, W * 0.1, H * 0.08, 8, 95, 55, 0.42],
    [W * 0.1, H * 0.7, W * 0.13, H * 0.1, 2, 50, 70, 0.24],
  ];

  // Purple-teal blend
  const purpleTealGrad = ctx.createRadialGradient(W * 0.88, H * 0.2, 0, W * 0.88, H * 0.2, W * 0.13);
  purpleTealGrad.addColorStop(0, "rgba(80, 0, 120, 0.38)");
  purpleTealGrad.addColorStop(0.4, "rgba(8, 95, 55, 0.35)");
  purpleTealGrad.addColorStop(0.7, "rgba(40, 50, 90, 0.18)");
  purpleTealGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save();
  ctx.translate(W * 0.88, H * 0.2);
  ctx.rotate(-0.2);
  ctx.scale(1, 0.55);
  ctx.fillStyle = purpleTealGrad;
  ctx.beginPath();
  ctx.arc(0, 0, W * 0.13, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const tealRotations = [0, -0.45, 0.3, 0.8, -0.2, 0.5];
  tealClouds.forEach(([x, y, rw, rh, r, g, b, a], idx) => {
    const maxR = Math.max(rw, rh);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR);
    grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
    grad.addColorStop(0.6, `rgba(${r},${g},${b},${a * 0.3})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tealRotations[idx] || 0);
    ctx.scale(rw / maxR, rh / maxR);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, maxR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Patchy Milky Way
  const rng = (seed: number) => {
    const x = Math.sin(seed) * 43758.5453;
    return x - Math.floor(x);
  };
  for (let i = 0; i < 210; i++) {
    const t = i / 140;
    const bandX = t * W + (rng(i * 7.3) - 0.5) * W * 0.35;
    const bandY = t * H * 0.65 + H * 0.05 + (rng(i * 3.7) - 0.5) * H * 0.3;
    const patchW = W * (0.04 + rng(i * 11.1) * 0.12);
    const patchH = H * (0.03 + rng(i * 5.9) * 0.1);
    const alpha = 0.06 + rng(i * 9.1) * 0.22;
    const isTeal = rng(i * 13.7) < 0.15;
    const r = isTeal ? 5 : 15;
    const g = isTeal ? 35 : 30;
    const b = isTeal ? 60 : 72;
    const maxR = Math.max(patchW, patchH);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR);
    grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
    grad.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.55})`);
    grad.addColorStop(0.7, `rgba(${r},${g},${b},${alpha * 0.2})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.translate(bandX, bandY);
    ctx.rotate(rng(i * 17.3) * Math.PI);
    ctx.scale(patchW / maxR, patchH / maxR);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, maxR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  for (let i = 0; i < 120; i++) {
    const t = i / 80;
    const bandX = t * W * 0.8 + W * 0.15 + (rng(i * 6.1 + 100) - 0.5) * W * 0.25;
    const bandY = H * 0.3 + t * H * 0.4 + (rng(i * 4.2 + 50) - 0.5) * H * 0.22;
    const patchW = W * (0.03 + rng(i * 8.8 + 200) * 0.08);
    const patchH = H * (0.025 + rng(i * 6.6 + 150) * 0.07);
    const alpha = 0.04 + rng(i * 7.7 + 80) * 0.12;
    const maxR = Math.max(patchW, patchH);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR);
    grad.addColorStop(0, `rgba(12,28,68,${alpha})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.translate(bandX, bandY);
    ctx.scale(patchW / maxR, patchH / maxR);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, maxR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Atmospheric haze
  const atmo = ctx.createLinearGradient(0, H * 0.55, 0, H);
  atmo.addColorStop(0, "rgba(8, 22, 55, 0)");
  atmo.addColorStop(1, "rgba(12, 30, 70, 0.40)");
  ctx.fillStyle = atmo;
  ctx.fillRect(0, 0, W, H);

  // Background stars
  for (let i = 0; i < 6500; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const sz = Math.random() * 0.7 + 0.1;
    const bandT = x / W;
    const bandCY = bandT * H * 0.65 + H * 0.05;
    const distFromBand = Math.abs(y - bandCY) / H;
    const inBand = distFromBand < 0.18;
    const a = inBand
      ? Math.random() * 0.7 + 0.15
      : Math.random() < 0.3
        ? (Math.random() * 0.55 + 0.2) * 4.0
        : Math.random() < 0.5
          ? Math.random() * 0.55 + 0.2
          : Math.random() * 0.22 + 0.02;
    const warm = Math.random() < 0.12;
    ctx.fillStyle = warm ? `rgba(255,242,190,${a})` : `rgba(200,220,255,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, sz, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bright accent stars
  for (let i = 0; i < 18; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const size = 1.0 + Math.random() * 1.5;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 5);
    glow.addColorStop(0, "rgba(255,255,255,0.95)");
    glow.addColorStop(0.3, "rgba(200,225,255,0.25)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, size * 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.98)";
    ctx.beginPath();
    ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── COMPONENT ───────────────────────────────────────────
const StarCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef(initStars(CFG.numStars));
  const twinklersRef = useRef(initBgTwinklers(420));
  const frameRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const [bgReady, setBgReady] = useState(false);

  useEffect(() => {
    const off = document.createElement("canvas");
    off.width = 2400;
    off.height = 2400;
    paintNightSky(off);
    offRef.current = off;
    setBgReady(true);
  }, []);

  useEffect(() => {
    if (!bgReady || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    const draw = () => {
      const t = frameRef.current;

      // 1. Rotating night sky
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * CFG.bgRotationSpeed);
      const size = Math.max(W, H) * 1.55;
      ctx.drawImage(offRef.current!, -size / 2, -size / 2, size, size);
      ctx.restore();

      // 2. Twinkling bg stars
      twinklersRef.current.forEach((s) => {
        s.phase += s.speed;
        const alpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(s.phase));
        const px = s.x * W;
        const py = s.y * H;
        const warm = s.size < 0.35;
        ctx.fillStyle = warm ? `rgba(255,242,190,${alpha})` : `rgba(200,220,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Foreground zooming stars
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * CFG.rotationSpeed);

      starsRef.current.forEach((star) => {
        star.z -= CFG.zoomSpeed;
        if (star.z <= 0.01) {
          let nx: number, ny: number;
          do {
            nx = (Math.random() - 0.5) * 2;
            ny = (Math.random() - 0.5) * 2;
          } while (Math.abs(nx) < 0.15 && Math.abs(ny) < 0.15);
          star.x = nx;
          star.y = ny;
          star.z = 1;
          star.color = pickStarColor();
        }

        const scale = 1 / star.z;
        const px = star.x * scale * (W * 0.5);
        const py = star.y * scale * (H * 0.5);
        if (Math.abs(px) > W * 0.8 || Math.abs(py) > H * 0.8) return;

        star.twinkle += star.twinkleSpeed;
        const twinkle = 0.78 + 0.22 * Math.sin(star.twinkle);
        const alpha = star.brightness * twinkle;
        const radius = star.size * scale * 0.5;
        const { r, g, b } = star.color;

        const glow = ctx.createRadialGradient(px, py, 0, px, py, radius * 4);
        glow.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.6})`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, radius * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.2, radius), 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
      frameRef.current++;
    };

    const loop = () => {
      draw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [bgReady]);

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={800}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
};

export default StarCanvas;
