const EXCLUDED_PATHS = ["/dashboard", "/provider-dashboard", "/admin"];

interface PageBackgroundProps {
  pathname: string;
  intensity?: number; // 0–1, default 0.5. Raise to make arcs more visible.
}

const PageBackground = ({ pathname, intensity = 0.5 }: PageBackgroundProps) => {
  const isExcluded = pathname === "/" || EXCLUDED_PATHS.some((p) => pathname.startsWith(p));

  if (isExcluded) return null;

  const i = intensity;

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
      {/* Top-right cluster */}
      <div
        style={{
          position: "absolute",
          top: -320,
          right: -320,
          width: 900,
          height: 900,
          borderRadius: "50%",
          border: `1px solid rgba(42,122,106,${0.11 * i})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -220,
          right: -220,
          width: 660,
          height: 660,
          borderRadius: "50%",
          border: `1px solid rgba(42,122,106,${0.14 * i})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -130,
          right: -130,
          width: 440,
          height: 440,
          borderRadius: "50%",
          border: `1px solid rgba(42,122,106,${0.18 * i})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 240,
          height: 240,
          borderRadius: "50%",
          border: `1px solid rgba(58,154,136,${0.24 * i})`,
          background: `radial-gradient(circle, rgba(42,122,106,${0.12 * i}) 0%, transparent 70%)`,
        }}
      />

      {/* Bottom-left echo */}
      <div
        style={{
          position: "absolute",
          bottom: -280,
          left: -280,
          width: 720,
          height: 720,
          borderRadius: "50%",
          border: `1px solid rgba(42,122,106,${0.08 * i})`,
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
          border: `1px solid rgba(42,122,106,${0.11 * i})`,
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
          border: `1px solid rgba(42,122,106,${0.14 * i})`,
          background: `radial-gradient(circle, rgba(42,80,150,${0.08 * i}) 0%, transparent 70%)`,
        }}
      />

      {/* Centre atmosphere */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(42,122,106,${0.06 * i}) 0%, transparent 65%)`,
        }}
      />

      {/* Star dots */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: [
            `radial-gradient(1px 1px at  8% 15%, rgba(255,255,255,${0.5 * i}) 0%, transparent 100%)`,
            `radial-gradient(1px 1px at 18% 62%, rgba(255,255,255,${0.36 * i}) 0%, transparent 100%)`,
            `radial-gradient(1.5px 1.5px at 29% 38%, rgba(255,255,255,${0.4 * i}) 0%, transparent 100%)`,
            `radial-gradient(1px 1px at 42% 81%, rgba(255,255,255,${0.3 * i}) 0%, transparent 100%)`,
            `radial-gradient(1px 1px at 55% 22%, rgba(255,255,255,${0.36 * i}) 0%, transparent 100%)`,
            `radial-gradient(1.5px 1.5px at 67% 55%, rgba(255,255,255,${0.44 * i}) 0%, transparent 100%)`,
            `radial-gradient(1px 1px at 76% 12%, rgba(255,255,255,${0.32 * i}) 0%, transparent 100%)`,
            `radial-gradient(1px 1px at 84% 70%, rgba(255,255,255,${0.36 * i}) 0%, transparent 100%)`,
            `radial-gradient(1.5px 1.5px at 91% 44%, rgba(255,255,255,${0.4 * i}) 0%, transparent 100%)`,
            `radial-gradient(1px 1px at 35% 91%, rgba(255,255,255,${0.28 * i}) 0%, transparent 100%)`,
            `radial-gradient(1px 1px at 62% 88%, rgba(255,255,255,${0.32 * i}) 0%, transparent 100%)`,
            `radial-gradient(1px 1px at 14% 88%, rgba(255,255,255,${0.26 * i}) 0%, transparent 100%)`,
          ].join(","),
        }}
      />
    </div>
  );
};

export default PageBackground;
