import React from "react";

interface PageBannerProps {
  title: string;
  subtitle?: string;
}

const PageBanner = ({ title, subtitle }: PageBannerProps) => (
  <div
    style={{
      background: "linear-gradient(to bottom, #162038 0%, #1c2c50 50%, #223662 75%, #2b4472 100%)",
      padding: "clamp(22px, 4vw, 38px) clamp(20px, 5vw, 60px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      minHeight: "clamp(90px, 13vw, 118px)",
      position: "relative",
    }}
  >
    {/* Subtle bottom fade */}
    <div
      style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 28,
        background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.16))",
        pointerEvents: "none",
      }}
    />

    {/* Dot + title inline */}
    <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
      <div
        style={{
          width: 8, height: 8,
          borderRadius: "50%",
          background: "#D98A6A",
          flexShrink: 0,
        }}
      />
      <h1
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontSize: "clamp(1.3rem, 3.5vw, 2rem)",
          fontWeight: 300,
          color: "#ffffff",
          letterSpacing: "clamp(1px, 0.2vw, 2px)",
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>
    </div>

    {subtitle && (
      <p
        style={{
          fontSize: "clamp(0.70rem, 1.4vw, 0.85rem)",
          color: "rgba(232,244,255,0.50)",
          fontFamily: "'Nunito Sans', sans-serif",
          marginTop: 8,
          fontWeight: 300,
          position: "relative",
          zIndex: 1,
          maxWidth: 480,
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export default PageBanner;
