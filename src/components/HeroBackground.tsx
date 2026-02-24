import { useEffect, useRef } from "react";

/**
 * HeroBackground — SVG-based scenic illustration matching the Beyonder homepage design.
 * Teal-to-navy sky gradient, twinkling stars, layered rolling hills,
 * city lights on the right, and parent+child silhouette on the lower right.
 * 
 * All animations respect prefers-reduced-motion.
 */

const STARS = Array.from({ length: 45 }, (_, i) => ({
  cx: Math.random() * 100,
  cy: Math.random() * 50,
  r: Math.random() * 1.2 + 0.4,
  delay: Math.random() * 10,
  duration: 6 + Math.random() * 8,
}));

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  cx: 55 + Math.random() * 35,
  cy: 65 + Math.random() * 25,
  r: Math.random() * 2 + 1,
  delay: Math.random() * 12,
  duration: 14 + Math.random() * 12,
  opacity: 0.15 + Math.random() * 0.15,
}));

const HeroBackground = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return;
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) return;
      const scrollY = window.scrollY;
      const layers = bgRef.current.querySelectorAll<SVGGElement>("[data-parallax]");
      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.parallax || "0");
        layer.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={bgRef} className="hero-bg absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1440 810"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky gradient — teal top to deep navy bottom */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(195, 45%, 25%)" />
            <stop offset="30%" stopColor="hsl(185, 40%, 35%)" />
            <stop offset="60%" stopColor="hsl(175, 45%, 42%)" />
            <stop offset="100%" stopColor="hsl(180, 35%, 50%)" />
          </linearGradient>

          {/* Moon glow */}
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(40, 60%, 90%)" stopOpacity="0.6" />
            <stop offset="60%" stopColor="hsl(40, 60%, 90%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(40, 60%, 90%)" stopOpacity="0" />
          </radialGradient>

          {/* Hill gradients */}
          <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(180, 30%, 35%)" />
            <stop offset="100%" stopColor="hsl(185, 25%, 28%)" />
          </linearGradient>
          <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(175, 28%, 30%)" />
            <stop offset="100%" stopColor="hsl(180, 22%, 24%)" />
          </linearGradient>
          <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(170, 25%, 25%)" />
            <stop offset="100%" stopColor="hsl(175, 20%, 20%)" />
          </linearGradient>
          <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(165, 22%, 22%)" />
            <stop offset="100%" stopColor="hsl(170, 18%, 16%)" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="1440" height="810" fill="url(#skyGrad)" />

        {/* Moon glow pulse */}
        <circle cx="720" cy="140" r="80" fill="url(#moonGlow)" className="hero-moon-glow" />

        {/* Stars */}
        <g className="hero-stars">
          {STARS.map((star, i) => (
            <circle
              key={i}
              cx={(star.cx / 100) * 1440}
              cy={(star.cy / 100) * 810}
              r={star.r}
              fill="hsl(40, 50%, 92%)"
              className="hero-star"
              style={{
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </g>

        {/* Far hills — slowest parallax */}
        <g data-parallax="-0.03">
          <path
            d="M0 520 Q200 440 400 480 Q600 430 800 470 Q1000 420 1200 460 Q1350 440 1440 470 L1440 810 L0 810Z"
            fill="url(#hillFar)"
            opacity="0.7"
          />
        </g>

        {/* Mid hills */}
        <g data-parallax="-0.015">
          <path
            d="M0 560 Q150 510 350 540 Q550 490 720 530 Q900 500 1100 520 Q1300 500 1440 530 L1440 810 L0 810Z"
            fill="url(#hillMid)"
            opacity="0.8"
          />
        </g>

        {/* City lights on right side */}
        <g data-parallax="-0.01" opacity="0.9">
          {/* Buildings cluster - right side */}
          <rect x="1100" y="490" width="16" height="50" rx="2" fill="hsl(175, 20%, 28%)" />
          <rect x="1103" y="495" width="4" height="5" rx="0.5" fill="hsl(40, 80%, 70%)" opacity="0.7" />
          <rect x="1109" y="500" width="4" height="5" rx="0.5" fill="hsl(40, 80%, 70%)" opacity="0.5" />
          
          <rect x="1120" y="480" width="20" height="60" rx="2" fill="hsl(175, 18%, 26%)" />
          <rect x="1124" y="486" width="4" height="5" rx="0.5" fill="hsl(40, 80%, 70%)" opacity="0.8" />
          <rect x="1132" y="492" width="4" height="5" rx="0.5" fill="hsl(40, 80%, 70%)" opacity="0.6" />
          <rect x="1124" y="502" width="4" height="5" rx="0.5" fill="hsl(40, 80%, 70%)" opacity="0.4" />

          <rect x="1145" y="495" width="14" height="45" rx="2" fill="hsl(175, 20%, 30%)" />
          <rect x="1148" y="500" width="3" height="4" rx="0.5" fill="hsl(40, 80%, 70%)" opacity="0.7" />

          <rect x="1165" y="485" width="18" height="55" rx="2" fill="hsl(175, 18%, 25%)" />
          <rect x="1169" y="490" width="4" height="5" rx="0.5" fill="hsl(40, 80%, 70%)" opacity="0.6" />
          <rect x="1175" y="498" width="4" height="5" rx="0.5" fill="hsl(40, 80%, 70%)" opacity="0.8" />
          <rect x="1169" y="508" width="4" height="5" rx="0.5" fill="hsl(40, 80%, 70%)" opacity="0.5" />
        </g>

        {/* Trees on left */}
        <g data-parallax="-0.01" opacity="0.8">
          {/* Stylised trees — left side */}
          <circle cx="100" cy="530" r="18" fill="hsl(170, 22%, 24%)" />
          <rect x="97" y="540" width="6" height="15" fill="hsl(170, 18%, 20%)" />
          <circle cx="140" cy="525" r="15" fill="hsl(170, 22%, 26%)" />
          <rect x="137" y="533" width="6" height="12" fill="hsl(170, 18%, 20%)" />
          <circle cx="170" cy="535" r="20" fill="hsl(170, 20%, 22%)" />
          <rect x="167" y="548" width="6" height="16" fill="hsl(170, 18%, 18%)" />
          
          {/* Houses — left */}
          <rect x="200" y="530" width="22" height="18" rx="1" fill="hsl(175, 18%, 26%)" />
          <polygon points="200,530 211,518 222,530" fill="hsl(175, 15%, 23%)" />
          <rect x="206" y="536" width="5" height="5" rx="0.5" fill="hsl(40, 80%, 70%)" opacity="0.6" />
          
          <rect x="230" y="535" width="18" height="15" rx="1" fill="hsl(175, 18%, 28%)" />
          <polygon points="230,535 239,525 248,535" fill="hsl(175, 15%, 25%)" />
          <rect x="235" y="539" width="4" height="4" rx="0.5" fill="hsl(40, 80%, 70%)" opacity="0.5" />
        </g>

        {/* Near hills */}
        <g data-parallax="0">
          <path
            d="M0 600 Q180 560 400 580 Q600 550 800 575 Q950 560 1100 570 Q1300 555 1440 580 L1440 810 L0 810Z"
            fill="url(#hillNear)"
            opacity="0.9"
          />
        </g>

        {/* Front hill */}
        <g>
          <path
            d="M0 660 Q300 620 600 640 Q900 610 1200 630 Q1350 625 1440 640 L1440 810 L0 810Z"
            fill="url(#hillFront)"
          />
        </g>

        {/* Parent + Child silhouette — lower right */}
        <g data-parallax="-0.005" className="hero-silhouette" opacity="0.85">
          {/* Adult figure */}
          <circle cx="1260" cy="580" r="10" fill="hsl(175, 15%, 18%)" />
          <path d="M1260 590 L1260 630 M1245 610 L1275 610 M1260 630 L1248 660 M1260 630 L1272 660" 
                stroke="hsl(175, 15%, 18%)" strokeWidth="5" strokeLinecap="round" />
          {/* Child figure */}
          <circle cx="1285" cy="600" r="7" fill="hsl(175, 15%, 18%)" />
          <path d="M1285 607 L1285 635 M1275 620 L1295 620 M1285 635 L1278 655 M1285 635 L1292 655" 
                stroke="hsl(175, 15%, 18%)" strokeWidth="4" strokeLinecap="round" />
          {/* Holding hands connection */}
          <line x1="1275" y1="610" x2="1275" y2="620" stroke="hsl(175, 15%, 18%)" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Floating particles — faint glow near bottom */}
        <g className="hero-particles">
          {PARTICLES.map((p, i) => (
            <circle
              key={i}
              cx={(p.cx / 100) * 1440}
              cy={(p.cy / 100) * 810}
              r={p.r}
              fill="hsl(40, 60%, 85%)"
              opacity={p.opacity}
              className="hero-particle"
              style={{
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default HeroBackground;
