import { useEffect, useRef } from "react";

const SKY_COLORS = ["#141f3d", "#192d62", "#254f93", "#357ab6", "#85bdd5"];
const SKY_STOPS  = [0, 0.10, 0.28, 0.50, 0.70];

const BIRD_PATH_D =
  "M26.28,117.8c25.58,8.49,56.17,16.47,91.11,21.44,58.55,8.33,109.28,5.37,147.38,0-2.98-15.96-.87-27.27,1.79-34.84,2.13-6.06,5.07-11,4.91-18.76-.17-8.16-3.67-14.79-6.7-19.2,6.4,4.61,12.8,9.23,19.2,13.84,3.87-.3,10.52-.23,17.42,3.13,8.96,4.37,13.42,11.9,16.08,16.52,6.7,11.67,4.46,18.31,12.95,31.71,1.73,2.73,3.35,4.86,4.47,6.25,33.62.14,77.36-2.93,126.84-15.18,59.24-14.68,105.75-37.33,138-56.27-.13,13.98-2.12,35.95-12.95,59.4-15.34,33.2-40.66,50.28-90.66,83.07-65.12,42.71-92.35,42.87-102.27,42.43-17.73-.79-31.99-5.81-41.09-9.83-.3,6.7-.6,13.4-.89,20.1,16.52,12.8,33.05,25.61,49.57,38.41.03,5.69-.7,13.78-4.47,22.33-14.88,33.78-61.55,39.07-68.78,39.75-53.26,5.03-91.07-38.82-95.57-44.21,14.59-15.48,29.18-30.97,43.77-46.45-1.34-8.19-2.68-16.38-4.02-24.56-2.74,3.55-7.48,8.69-14.74,12.06-14.99,6.96-30.8,1.75-39.75-1.34-52.74-18.2-79.12-27.3-97.36-39.3-49.38-32.49-78.61-73.76-94.23-100.49Z";

const SVG_W = 609.94, SVG_H = 394.73, BCX = 300, BCY = 180;
const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;
const NUM_BIRDS = IS_MOBILE ? Math.round(220 * 0.8) : 220, NUM_GROUPS = 5;

const TAU = Math.PI * 2;

interface Group {
  bx: number; by: number;
  wx1: number; wx2: number; wy1: number; wy2: number;
  px1: number; px2: number; py1: number; py2: number;
  ax1: number; ax2: number; ay1: number; ay2: number;
}

interface Bird {
  gi: number; oa: number; or: number;
  sx: number; sy: number;
  df: number; da: number; dph: number;
  df2: number; da2: number; dp2: number;
  of_: number; oph: number;
  bs: number; ds: number; dop: number;
  ff: number; fp: number; fa: number;
}

function initGroups(): Group[] {
  return [
    { bx: 0.28, by: 0.22 },
    { bx: 0.72, by: 0.18 },
    { bx: 0.50, by: 0.14 },
    { bx: 0.50, by: 0.26 },
    { bx: 0.50, by: 0.20 },
  ].map(({ bx, by }) => ({
    bx, by,
    wx1: 4e-5 + Math.random() * 3e-5,
    wx2: 2.5e-5 + Math.random() * 2e-5,
    wy1: 3.5e-5 + Math.random() * 3e-5,
    wy2: 2e-5 + Math.random() * 1.5e-5,
    px1: Math.random() * TAU, px2: Math.random() * TAU,
    py1: Math.random() * TAU, py2: Math.random() * TAU,
    ax1: 0.10 + Math.random() * 0.06, ax2: 0.05 + Math.random() * 0.04,
    ay1: 0.06 + Math.random() * 0.04, ay2: 0.03 + Math.random() * 0.03,
  }));
}

function initBirds(dpr: number): Bird[] {
  return Array.from({ length: NUM_BIRDS }, () => {
    const gi = Math.floor(Math.random() * NUM_GROUPS);
    return {
      gi,
      oa:  Math.random() * TAU,
      or:  Math.pow(Math.random(), 0.4),
      sx:  0.12 + Math.random() * 0.08,
      sy:  0.07 + Math.random() * 0.05,
      df:  6e-5 + Math.random() * 8e-5,
      da:  0.015 + Math.random() * 0.018,
      dph: Math.random() * TAU,
      df2: 9e-5 + Math.random() * 7e-5,
      da2: 0.010 + Math.random() * 0.012,
      dp2: Math.random() * TAU,
      of_: 3e-5 + Math.random() * 4e-5,
      oph: Math.random() * TAU,
      bs:  (5 + Math.random() * 6) * dpr,
      ds:  0.65 + Math.random() * 0.4,
      dop: 0.35 + Math.random() * 0.5,
      ff:  0.006 + Math.random() * 0.005,
      fp:  Math.random() * TAU,
      fa:  0.25 + Math.random() * 0.35,
    };
  });
}

function groupPos(g: Group, t: number, W: number, H: number) {
  return {
    x: (g.bx + g.ax1 * Math.sin(t * g.wx1 * TAU + g.px1) + g.ax2 * Math.sin(t * g.wx2 * TAU + g.px2)) * W,
    y: (g.by + g.ay1 * Math.sin(t * g.wy1 * TAU + g.py1) + g.ay2 * Math.sin(t * g.wy2 * TAU + g.py2)) * H,
  };
}

function birdPos(b: Bird, groups: Group[], t: number, W: number, H: number) {
  const gp = groupPos(groups[b.gi], t, W, H);
  const a   = b.oa + t * b.of_ * TAU + b.oph;
  let x = gp.x + Math.cos(a) * b.sx * W * b.or;
  let y = gp.y + Math.sin(a) * b.sy * H * b.or;
  x += b.da  * W * Math.sin(t * b.df  * TAU + b.dph);
  y += b.da2 * H * Math.sin(t * b.df2 * TAU + b.dp2);
  return { x, y };
}

const BirdCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const DPR = window.devicePixelRatio || 1;

    const birdPath = new Path2D(BIRD_PATH_D);

    function resize() {
      const parent = canvas!.parentElement!;
      const pw = parent.offsetWidth;
      const ph = parent.offsetHeight;
      canvas!.width  = pw * DPR;
      canvas!.height = ph * DPR;
      canvas!.style.width  = pw + "px";
      canvas!.style.height = ph + "px";
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const groups = initGroups();
    const birds  = initBirds(DPR);
    let time = 0;
    let lastPos: Array<{ x: number; y: number }> | null = null;

    function drawSky() {
      const W = canvas!.width, H = canvas!.height;
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      SKY_COLORS.forEach((col, i) => grad.addColorStop(SKY_STOPS[i], col));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      const hy = H * 0.38;
      const sg = ctx.createRadialGradient(W * 0.5, hy, 0, W * 0.5, hy, W * 0.55);
      sg.addColorStop(0,    "rgba(80,160,220,0.18)");
      sg.addColorStop(0.3,  "rgba(40,100,160,0.08)");
      sg.addColorStop(1,    "rgba(20,60,120,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, W, H);
    }

    function drawBird(
      x: number, y: number, heading: number,
      dw: number, dh: number, flapScale: number, opacity: number,
    ) {
      const sx = (dw / SVG_W) * flapScale;
      const sy =  dh / SVG_H;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(heading + Math.PI / 2);
      ctx.globalAlpha   = opacity;
      ctx.fillStyle     = "#04080e";
      ctx.translate(-BCX * sx, -BCY * sy);
      ctx.scale(sx, sy);
      ctx.fill(birdPath);
      ctx.restore();
    }

    function draw() {
      const W = canvas!.width, H = canvas!.height;
      ctx.clearRect(0, 0, W, H);
      drawSky();

      const cp = birds.map((b) => birdPos(b, groups, time, W, H));

      birds.forEach((b, i) => {
        const { x, y } = cp[i];
        if (x < -60 || x > W + 60 || y < -60 || y > H + 60) return;

        let heading = 0;
        if (lastPos) {
          const dx = x - lastPos[i].x;
          const dy = y - lastPos[i].y;
          if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) heading = Math.atan2(dy, dx);
        }

        const ex   = Math.min(x / (W * 0.08), (W - x) / (W * 0.08), 1);
        const ey   = Math.min(y / (H * 0.08), (H - y) / (H * 0.08), 1);
        const edge = Math.max(0, Math.min(1, ex, ey));
        const s    = b.bs * b.ds;
        const flap = 1 - b.fa * Math.abs(Math.sin(time * b.ff * TAU + b.fp));

        drawBird(x, y, heading, s, s * (SVG_H / SVG_W), flap, b.dop * edge);
      });

      lastPos = cp;
      time += 4.0;
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
};

export default BirdCanvas;
