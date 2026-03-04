/**
 * PageBackground
 *
 * Renders a fixed, full-screen decorative background on content pages.
 * Excluded from dashboards and admin — those stay clean.
 *
 * The design: very faint concentric arcs/circles referencing the Beyonder
 * logo orb. Positioned top-right (primary) and bottom-left (echo).
 * Opacity is deliberately low — content always reads clearly on top.
 */

const EXCLUDED_PATHS = ["/dashboard", "/provider-dashboard", "/admin"];

interface PageBackgroundProps {
  pathname: string;
}

const PageBackground = ({ pathname }: PageBackgroundProps) => {
  // Don't render on homepage (has its own hero) or excluded pages
  const isExcluded = pathname === "/" || EXCLUDED_PATHS.some((p) => pathname.startsWith(p));

  if (isExcluded) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: "#061828",
      }}
    >
      {/* ── Primary orb cluster — top right ─────────────────── */}
      {/* Outermost arc */}
      <div
        style={{
          position: "absolute",
          top: -320,
          right: -320,
          width: 900,
          height: 900,
          borderRadius: "50%",
          border: "1px solid rgba(42,122,106,0.055)",
        }}
      />
      {/* Mid arc */}
      <div
        style={{
          position: "absolute",
          top: -220,
          right: -220,
          width: 660,
          height: 660,
          borderRadius: "50%",
          border: "1px solid rgba(42,122,106,0.07)",
        }}
      />
      {/* Inner arc */}
      <div
        style={{
          position: "absolute",
          top: -130,
          right: -130,
          width: 440,
          height: 440,
          borderRadius: "50%",
          border: "1px solid rgba(42,122,106,0.09)",
        }}
      />
      {/* Core glow */}
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 240,
          height: 240,
          borderRadius: "50%",
          border: "1px solid rgba(58,154,136,0.12)",
          background: "radial-gradient(circle, rgba(42,122,106,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Echo cluster — bottom left ───────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: -280,
          left: -280,
          width: 720,
          height: 720,
          borderRadius: "50%",
          border: "1px solid rgba(42,122,106,0.04)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -180,
          left: -180,
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: "1px solid rgba(42,122,106,0.055)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -90,
          left: -90,
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: "1px solid rgba(42,122,106,0.07)",
          background: "radial-gradient(circle, rgba(42,80,150,0.04) 0%, transparent 70%)",
        }}
      />

      {/* ── Subtle centre-page atmosphere ────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(42,122,106,0.03) 0%, transparent 65%)",
        }}
      />

      {/* ── Very faint star dots ──────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: [
            "radial-gradient(1px 1px at 8% 15%, rgba(255,255,255,0.25) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 18% 62%, rgba(255,255,255,0.18) 0%, transparent 100%)",
            "radial-gradient(1.5px 1.5px at 29% 38%, rgba(255,255,255,0.20) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 42% 81%, rgba(255,255,255,0.15) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 55% 22%, rgba(255,255,255,0.18) 0%, transparent 100%)",
            "radial-gradient(1.5px 1.5px at 67% 55%, rgba(255,255,255,0.22) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 76% 12%, rgba(255,255,255,0.16) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 84% 70%, rgba(255,255,255,0.18) 0%, transparent 100%)",
            "radial-gradient(1.5px 1.5px at 91% 44%, rgba(255,255,255,0.20) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 35% 91%, rgba(255,255,255,0.14) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 62% 88%, rgba(255,255,255,0.16) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 14% 88%, rgba(255,255,255,0.13) 0%, transparent 100%)",
          ].join(","),
        }}
      />
    </div>
  );
};

export default PageBackground;
