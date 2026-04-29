import { useEffect, useRef } from "react";

const CFG = {
  fireflyCount: 35,
  starCount: 80,
  minDrift: 0.08,
  maxDrift: 0.25,
  minPulse: 0.003,
  maxPulse: 0.008,
};

interface Firefly {
  x: number;
  y: number;
  size: number;
  driftX: number;
  driftY: number;
  phase: number;
  pulseSpeed: number;
  baseAlpha: number;
  r: number;
  g: number;
  b: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  warm: boolean;
}

const FIREFLY_COLORS = [
  { r: 255, g: 210, b: 100, weight: 5 },
  { r: 255, g: 195, b: 80, weight: 4 },
  { r: 255, g: 225, b: 140, weight: 3 },
  { r: 245, g: 200, b: 130, weight: 3 },
  { r: 255, g: 240, b: 180, weight: 2 },
];

function pickColor() {
  const total = FIREFLY_COLORS.reduce((s, c) => s + c.weight, 0);
  let r = Math.random() * total;
  for (const c of FIREFLY_COLORS) {
    r -= c.weight;
    if (r <= 0) return c;
  }
  return FIREFLY_COLORS[0];
}

function initFireflies(count: number): Firefly[] {
  return Array.from({ length: count }, () => {
    const color = pickColor();
    return {
      x: Math.random(),
      y: Math.random(),
      size: 1.5 + Math.random() * 3,
      driftX: (Math.random() - 0.5) * CFG.maxDrift,
      driftY: (Math.random() - 0.5) * CFG.maxDrift,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: CFG.minPulse + Math.random() * (CFG.maxPulse - CFG.minPulse),
      baseAlpha: 0.15 + Math.random() * 0.45,
      ...color,
    };
  });
}

function initStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: 0.3 + Math.random() * 0.8,
    alpha: 0.15 + Math.random() * 0.4,
    warm: Math.random() < 0.7,
  }));
}

function paintBackground(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const grad = ctx.createLinearGradient(0, 0, W * 0.3, H);
  grad.addColorStop(0, "rgb(22, 14, 42)");
  grad.addColorStop(0.3, "rgb(28, 16, 52)");
  grad.addColorStop(0.6, "rgb(24, 18, 48)");
  grad.addColorStop(1, "rgb(18, 20, 40)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const warmGlow1 = ctx.createRadialGradient(W * 0.15, H * 0.75, 0, W * 0.15, H * 0.75, W * 0.55);
  warmGlow1.addColorStop(0, "rgba(140, 60, 30, 0.35)");
  warmGlow1.addColorStop(0.4, "rgba(100, 40, 20, 0.18)");
  warmGlow1.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = warmGlow1;
  ctx.fillRect(0, 0, W, H);

  const warmGlow2 = ctx.createRadialGradient(W * 0.85, H * 0.85, 0, W * 0.85, H * 0.85, W * 0.5);
  warmGlow2.addColorStop(0, "rgba(150, 70, 20, 0.3)");
  warmGlow2.addColorStop(0.4, "rgba(80, 35, 12, 0.14)");
  warmGlow2.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = warmGlow2;
  ctx.fillRect(0, 0, W, H);

  const plumGlow = ctx.createRadialGradient(W * 0.5, H * 0.25, 0, W * 0.5, H * 0.25, W * 0.65);
  plumGlow.addColorStop(0, "rgba(75, 30, 90, 0.35)");
  plumGlow.addColorStop(0.4, "rgba(55, 20, 70, 0.18)");
  plumGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = plumGlow;
  ctx.fillRect(0, 0, W, H);

  const tealGlow = ctx.createRadialGradient(W * 0.65, H * 0.5, 0, W * 0.65, H * 0.5, W * 0.4);
  tealGlow.addColorStop(0, "rgba(42, 122, 106, 0.12)");
  tealGlow.addColorStop(0.5, "rgba(42, 122, 106, 0.05)");
  tealGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = tealGlow;
  ctx.fillRect(0, 0, W, H);
}

const StarCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firefliesRef = useRef(initFireflies(CFG.fireflyCount));
  const starsRef = useRef(initStars(CFG.starCount));
  const animRef = useRef<number | null>(null);
  const bgRef = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;

    paintBackground(ctx, W, H);

    starsRef.current.forEach((s) => {
      const px = s.x * W;
      const py = s.y * H;
      ctx.fillStyle = s.warm
        ? `rgba(255, 235, 180, ${s.alpha})`
        : `rgba(220, 230, 255, ${s.alpha * 0.6})`;
      ctx.beginPath();
      ctx.arc(px, py, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    bgRef.current = ctx.getImageData(0, 0, W, H);

    const draw = () => {
      ctx.putImageData(bgRef.current!, 0, 0);

      firefliesRef.current.forEach((f) => {
        f.phase += f.pulseSpeed;
        f.x += f.driftX / W;
        f.y += f.driftY / H;

        if (f.x < -0.05) f.x = 1.05;
        if (f.x > 1.05) f.x = -0.05;
        if (f.y < -0.05) f.y = 1.05;
        if (f.y > 1.05) f.y = -0.05;

        const pulse = 0.3 + 0.7 * ((Math.sin(f.phase) + 1) / 2);
        const alpha = f.baseAlpha * pulse;
        const px = f.x * W;
        const py = f.y * H;

        const glow = ctx.createRadialGradient(px, py, 0, px, py, f.size * 8);
        glow.addColorStop(0, `rgba(${f.r}, ${f.g}, ${f.b}, ${alpha * 0.35})`);
        glow.addColorStop(0.4, `rgba(${f.r}, ${f.g}, ${f.b}, ${alpha * 0.12})`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, f.size * 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${f.r}, ${f.g}, ${f.b}, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(px, py, f.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={800}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
};

export default StarCanvas;
