import React from "react";

interface PageBannerProps {
  title: string;
  subtitle?: string;
}

/**
 * Short page-header banner using the homepage hero colour palette.
 * Appears on every page except the homepage (which uses BirdCanvas).
 */
const PageBanner = ({ title, subtitle }: PageBannerProps) => (
  <div
    style={{
      background: "linear-gradient(160deg, #06091a 0%, #0e1530 35%, #171445 65%, #221f50 100%)",
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
    {/* Subtle bottom fade into page content */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 28,
        background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.16))",
        pointerEvents: "none",
      }}
    />

    {/* Decorative dot — matches homepage logo dot */}
    <div
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#D98A6A",
        marginBottom: 10,
        position: "relative",
        zIndex: 1,
      }}
    />

    <h1
      style={{
        fontFamily: "'Josefin Sans', sans-serif",
        fontSize: "clamp(1.3rem, 3.5vw, 2rem)",
        fontWeight: 300,
        color: "#ffffff",
        letterSpacing: "clamp(2px, 0.5vw, 5px)",
        textTransform: "uppercase",
        margin: 0,
        position: "relative",
        zIndex: 1,
        lineHeight: 1.2,
      }}
    >
      {title}
    </h1>

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
