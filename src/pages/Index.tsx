import StarCanvas from "@/components/StarCanvas";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import LogoPrimary from "@/assets/Logo-Primary.svg";
import LocalIcon from "@/assets/icons/Local_Icon.svg";
import GuidesIcon from "@/assets/icons/Guides_Icon.svg";
import WorkIcon from "@/assets/icons/Work_Icon.svg";
import TherapistsIcon from "@/assets/icons/Therapists_Icon.svg";
import ClubsIcon from "@/assets/icons/Clubs_Icon.svg";
import NewsIcon from "@/assets/icons/News_Icon.svg";

const C = {
  navy: "#061828",
  navyMid: "#0d2035",
  teal: "#2a7a6a",
  tealLight: "#3a9a88",
  cream: "#f5f0e8",
  creamDark: "#ede6d8",
  sage: "#eaf4f0",
  orange: "#e8622a",
  orangeLight: "#f07840",
  white: "#ffffff",
  textDark: "#1a2a3a",
  textMid: "#556677",
  textLight: "#8899aa",
} as const;

// ── Inline hover handlers — bypass shadcn entirely ────────

const tealIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-2px)";
  e.currentTarget.style.boxShadow = "0 8px 28px rgba(42,122,106,0.52), 0 0 0 4px rgba(42,122,106,0.10)";
};
const tealOut = (e: React.MouseEvent<HTMLAnchorElement>, shadow = "0 4px 16px rgba(42,122,106,0.28)") => {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = shadow;
};

const ghostIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background = "rgba(42,122,106,0.10)";
  e.currentTarget.style.borderColor = "rgba(58,154,136,0.60)";
  e.currentTarget.style.color = "#3a9a88";
};
const ghostOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background = "transparent";
  e.currentTarget.style.borderColor = "rgba(42,122,106,0.30)";
  e.currentTarget.style.color = C.teal;
};

const cardIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-3px)";
  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.09)";
  e.currentTarget.style.borderColor = "rgba(42,122,106,0.28)";
};
const cardOut = (e: React.MouseEvent<HTMLAnchorElement>, borderColor = "#ede6d8") => {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = "none";
  e.currentTarget.style.borderColor = borderColor;
};

const pillarIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background = "rgba(42,122,106,0.10)";
};
const pillarOut = (e: React.MouseEvent<HTMLAnchorElement>, hi: boolean) => {
  e.currentTarget.style.background = hi ? "rgba(42,122,106,0.06)" : "transparent";
};

const newsIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-2px)";
  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
};
const newsOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = "none";
};

const commIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-2px)";
  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)";
};
const commOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = "none";
};

const chipIn = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.borderColor = "rgba(58,154,136,0.80)";
  e.currentTarget.style.background = "rgba(42,122,106,0.16)";
  e.currentTarget.style.color = "rgba(255,255,255,0.90)";
  e.currentTarget.style.transform = "scale(1.04)";
};
const chipOut = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.borderColor = "rgba(42,122,106,0.32)";
  e.currentTarget.style.background = "rgba(42,122,106,0.06)";
  e.currentTarget.style.color = "rgba(255,255,255,0.45)";
  e.currentTarget.style.transform = "none";
};

const REGIONS = [
  "South East England",
  "South West England",
  "North East England",
  "North West England",
  "East Midlands",
  "West Midlands",
  "London",
  "Wales",
  "Scotland",
  "Northern Ireland",
  "Online Only",
];

const Index = () => {
  const [region, setRegion] = useState("");
  const [support, setSupport] = useState("");
  const [regionOpen, setRegionOpen] = useState(false);
  const navigate = useNavigate();

  const regionRef = useRef<HTMLDivElement>(null);

  // Mobile region dropdown ref
  const mobileRegionRef = useRef<HTMLDivElement>(null);
  const [mobileRegionOpen, setMobileRegionOpen] = useState(false);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false);
      }
      if (mobileRegionRef.current && !mobileRegionRef.current.contains(e.target as Node)) {
        setMobileRegionOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredRegions = REGIONS.filter((r) => r.toLowerCase().includes(region.toLowerCase()));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (region.trim()) params.set("region", region.trim());
    if (support.trim()) params.set("support", support.trim());
    navigate(params.toString() ? `/providers?${params.toString()}` : "/providers");
  };

  const handleMobileSearch = () => {
    const params = new URLSearchParams();
    if (region.trim()) params.set("region", region.trim());
    if (support.trim()) params.set("support", support.trim());
    navigate(params.toString() ? `/providers?${params.toString()}` : "/providers");
  };

  const hints = [
    { label: "Speech & Language", to: "/providers?category=therapists&support=speech-language-therapy" },
    { label: "Occupational Therapy", to: "/providers?support=occupational-therapy" },
    { label: "Autism-friendly clubs", to: "/providers?category=activities&needs=autism" },
    { label: "EHCP support", to: "/providers?category=education&support=ehcp" },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* ══════════════════════════════════════════
          MOBILE LAYOUT — hidden on md and above
      ══════════════════════════════════════════ */}
      <div className="md:hidden" style={{ background: C.cream, minHeight: "100vh", paddingBottom: 72 }}>
        {/* ── Mobile Hero ── */}
        <div style={{ background: C.navy, padding: "14px 20px 0", position: "relative", overflow: "hidden" }}>
          {/* Glows */}
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(232,98,42,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: -40,
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(42,122,106,0.14) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          {/* Stars */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage: `
              radial-gradient(1px 1px at 18% 25%, rgba(255,255,255,0.45) 0%, transparent 100%),
              radial-gradient(1px 1px at 78% 12%, rgba(255,255,255,0.30) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 52% 55%, rgba(255,255,255,0.35) 0%, transparent 100%),
              radial-gradient(1px 1px at 33% 78%, rgba(255,255,255,0.20) 0%, transparent 100%),
              radial-gradient(1px 1px at 88% 68%, rgba(255,255,255,0.18) 0%, transparent 100%),
              radial-gradient(1px 1px at 8% 60%, rgba(255,255,255,0.22) 0%, transparent 100%),
              radial-gradient(1px 1px at 65% 30%, rgba(255,255,255,0.25) 0%, transparent 100%)
            `,
            }}
          />

          {/* Nav bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              position: "relative",
              zIndex: 2,
            }}
          >
            <img src={LogoPrimary} alt="Beyonder" style={{ height: 28, width: "auto" }} />
            <Link
              to="/login"
              style={{
                fontSize: "0.70rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.55)",
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </div>

          {/* Headline */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                fontSize: "0.54rem",
                color: C.orange,
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              SEND Support Platform
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.14,
                letterSpacing: "-0.7px",
                marginBottom: 18,
                margin: "0 0 18px",
              }}
            >
              Find the right
              <br />
              support for <span style={{ color: C.tealLight }}>your</span>
              <br />
              child.
            </h1>
          </div>

          {/* Search bar */}
          <div style={{ position: "relative", zIndex: 2, marginBottom: 20 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.11)",
                borderRadius: 11,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              <span style={{ fontSize: 13, opacity: 0.28 }}>🔍</span>
              <input
                type="text"
                value={support}
                onChange={(e) => setSupport(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMobileSearch()}
                placeholder="OT, Speech therapy, Clubs..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "0.73rem",
                  color: "white",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 300,
                }}
              />
              {/* Region pill / dropdown trigger */}
              <div ref={mobileRegionRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setMobileRegionOpen((o) => !o)}
                  style={{
                    fontSize: "0.6rem",
                    color: C.tealLight,
                    background: mobileRegionOpen ? C.navy : "rgba(42,122,106,0.16)",
                    border: `1px solid ${mobileRegionOpen ? C.tealLight : "rgba(42,122,106,0.25)"}`,
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    whiteSpace: "nowrap",
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                >
                  {region || "📍 Region"}
                </button>

                {/* Navy dropdown */}
                {mobileRegionOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: 220,
                      background: C.navy,
                      border: `1px solid ${C.teal}`,
                      borderRadius: 10,
                      boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
                      zIndex: 9999,
                      overflow: "hidden",
                    }}
                  >
                    {/* Clear option */}
                    <div
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setRegion("");
                        setMobileRegionOpen(false);
                      }}
                      style={{
                        padding: "10px 16px",
                        fontSize: "0.72rem",
                        color: "rgba(58,154,136,0.45)",
                        fontWeight: 400,
                        fontFamily: "'Outfit', sans-serif",
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(42,122,106,0.15)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(42,122,106,0.10)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      All regions
                    </div>
                    {REGIONS.map((r, i) => (
                      <div
                        key={r}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setRegion(r);
                          setMobileRegionOpen(false);
                        }}
                        style={{
                          padding: "10px 16px",
                          fontSize: "0.75rem",
                          color: r === region ? C.tealLight : C.tealLight,
                          fontWeight: r === region ? 700 : 400,
                          fontFamily: "'Outfit', sans-serif",
                          cursor: "pointer",
                          borderTop: i > 0 ? "1px solid rgba(42,122,106,0.10)" : "none",
                          background: r === region ? "rgba(42,122,106,0.15)" : "transparent",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(42,122,106,0.12)")}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = r === region ? "rgba(42,122,106,0.15)" : "transparent")
                        }
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search go button */}
              <button
                onClick={handleMobileSearch}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${C.orangeLight}, ${C.orange})`,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                →
              </button>
            </div>
          </div>

          {/* Browse by category shortcuts */}
          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, position: "relative", zIndex: 2 }}
          >
            <div
              style={{
                fontSize: "0.5rem",
                color: "rgba(255,255,255,0.22)",
                fontWeight: 600,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Browse by category
              <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)", display: "block" }} />
            </div>
            <div style={{ display: "flex" }}>
              {[
                { label: "Therapists", to: "/providers?category=therapists" },
                { label: "Clubs", to: "/providers?category=activities" },
                { label: "Education", to: "/providers?category=education" },
                { label: "Products", to: "/providers?category=products" },
                { label: "Charities", to: "/providers?category=charities" },
              ].map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.to}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "11px 4px",
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.38)",
                    textDecoration: "none",
                  }}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile Body ── */}
        <div style={{ padding: "22px 18px 16px" }}>
          {/* Intro */}
          <p
            style={{
              fontSize: "0.73rem",
              color: C.textMid,
              fontWeight: 300,
              lineHeight: 1.7,
              marginBottom: 22,
              paddingBottom: 18,
              borderBottom: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            Beyonder is <strong style={{ color: C.textDark, fontWeight: 600 }}>free for every family</strong> — a single
            place to find support, connect with others who understand, and stay informed about everything SEND.
          </p>

          {/* Pillar Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 22 }}>
            {/* All Support */}
            <Link to="/providers" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "white",
                  borderRadius: 18,
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid rgba(42,122,106,0.12)",
                  boxShadow: "0 2px 12px rgba(42,122,106,0.08), 0 1px 3px rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "stretch",
                  minHeight: 88,
                }}
              >
                <div
                  style={{ width: 5, flexShrink: 0, background: `linear-gradient(180deg, ${C.tealLight}, ${C.teal})` }}
                />
                <div
                  style={{
                    flex: 1,
                    padding: "16px 16px 16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      letterSpacing: "1.8px",
                      textTransform: "uppercase",
                      color: C.teal,
                    }}
                  >
                    Directory
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.textDark, letterSpacing: "-0.2px" }}>
                    All Support
                  </div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 300, color: C.textMid, lineHeight: 1.55 }}>
                    Therapists, clubs, education, products and charities — found in seconds, not months.
                  </div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: C.teal, marginTop: 6 }}>
                    Browse providers →
                  </div>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    flexShrink: 0,
                    margin: "16px 16px 16px 0",
                    alignSelf: "center",
                    background: "linear-gradient(135deg, rgba(42,122,106,0.12), rgba(42,122,106,0.06))",
                    border: "1px solid rgba(42,122,106,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  🔍
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 70,
                    background: "rgba(42,122,106,0.08)",
                    border: "1px solid rgba(42,122,106,0.15)",
                    borderRadius: 20,
                    padding: "3px 9px",
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    color: C.teal,
                  }}
                >
                  New providers listed weekly
                </div>
              </div>
            </Link>

            {/* Parent Hub */}
            <Link to="/community" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "#fdfcff",
                  borderRadius: 18,
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid rgba(120,100,200,0.12)",
                  boxShadow: "0 2px 12px rgba(100,80,180,0.08), 0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "stretch",
                  minHeight: 88,
                }}
              >
                <div style={{ width: 5, flexShrink: 0, background: "linear-gradient(180deg, #9b8de8, #7060c0)" }} />
                <div
                  style={{
                    flex: 1,
                    padding: "16px 16px 16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      letterSpacing: "1.8px",
                      textTransform: "uppercase",
                      color: "#7060c0",
                    }}
                  >
                    Community
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.textDark, letterSpacing: "-0.2px" }}>
                    Parent Hub
                  </div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 300, color: C.textMid, lineHeight: 1.55 }}>
                    Forums, meetups and real conversations with parents who truly get it.
                  </div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#7060c0", marginTop: 6 }}>
                    Join the community →
                  </div>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    flexShrink: 0,
                    margin: "16px 16px 16px 0",
                    alignSelf: "center",
                    background: "linear-gradient(135deg, rgba(120,100,200,0.10), rgba(120,100,200,0.04))",
                    border: "1px solid rgba(120,100,200,0.14)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  💬
                </div>
                {/* Live indicator */}
                <div
                  style={{ position: "absolute", top: 14, right: 70, display: "flex", alignItems: "center", gap: 5 }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#4ade80",
                      animation: "livepulse 2s infinite",
                    }}
                  />
                  <span style={{ fontSize: "0.52rem", fontWeight: 700, color: "#4ade80" }}>Live</span>
                </div>
              </div>
            </Link>

            {/* SEND News */}
            <Link to="/news" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "#fffcfa",
                  borderRadius: 18,
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid rgba(232,98,42,0.12)",
                  boxShadow: "0 2px 12px rgba(232,98,42,0.08), 0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "stretch",
                  minHeight: 88,
                }}
              >
                <div
                  style={{
                    width: 5,
                    flexShrink: 0,
                    background: `linear-gradient(180deg, ${C.orangeLight}, ${C.orange})`,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    padding: "16px 16px 16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      letterSpacing: "1.8px",
                      textTransform: "uppercase",
                      color: C.orange,
                    }}
                  >
                    Knowledge
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.textDark, letterSpacing: "-0.2px" }}>
                    SEND News
                  </div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 300, color: C.textMid, lineHeight: 1.55 }}>
                    Policy changes, the latest research, and stories that remind you you're not alone.
                  </div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: C.orange, marginTop: 6 }}>
                    Read latest →
                  </div>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    flexShrink: 0,
                    margin: "16px 16px 16px 0",
                    alignSelf: "center",
                    background: "linear-gradient(135deg, rgba(232,98,42,0.10), rgba(232,98,42,0.04))",
                    border: "1px solid rgba(232,98,42,0.14)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  📰
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 70,
                    background: "rgba(232,98,42,0.08)",
                    border: "1px solid rgba(232,98,42,0.16)",
                    borderRadius: 4,
                    padding: "2px 7px",
                    fontSize: "0.5rem",
                    fontWeight: 700,
                    color: C.orange,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Updated daily
                </div>
              </div>
            </Link>

            {/* Join Beyonder */}
            <Link to="/for-providers" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: C.navy,
                  borderRadius: 18,
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 4px 20px rgba(6,24,40,0.25), 0 1px 3px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "stretch",
                  minHeight: 88,
                }}
              >
                {/* Decorative circles */}
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    border: "30px solid rgba(42,122,106,0.10)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -20,
                    left: -20,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    border: "20px solid rgba(42,122,106,0.06)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    width: 5,
                    flexShrink: 0,
                    background: `linear-gradient(180deg, ${C.tealLight}, ${C.teal})`,
                    position: "relative",
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    padding: "16px 16px 16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 4,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      letterSpacing: "1.8px",
                      textTransform: "uppercase",
                      color: C.tealLight,
                    }}
                  >
                    For Providers
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "white", letterSpacing: "-0.2px" }}>
                    Join Beyonder
                  </div>
                  <div
                    style={{ fontSize: "0.65rem", fontWeight: 300, color: "rgba(255,255,255,0.40)", lineHeight: 1.55 }}
                  >
                    Thousands of families are searching right now. Your profile goes live the moment you create it.
                  </div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: C.tealLight, marginTop: 6 }}>
                    Create your free profile →
                  </div>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    flexShrink: 0,
                    margin: "16px 16px 16px 0",
                    alignSelf: "center",
                    background: "rgba(42,122,106,0.15)",
                    border: "1px solid rgba(42,122,106,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  🏢
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 70,
                    background: "linear-gradient(135deg, rgba(232,98,42,0.20), rgba(232,98,42,0.10))",
                    border: "1px solid rgba(232,98,42,0.25)",
                    borderRadius: 20,
                    padding: "3px 9px",
                    fontSize: "0.52rem",
                    fontWeight: 700,
                    color: C.orangeLight,
                    zIndex: 1,
                    letterSpacing: "0.5px",
                  }}
                >
                  Free to list
                </div>
              </div>
            </Link>
          </div>

          {/* Quote */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "18px 18px 16px",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              marginBottom: 16,
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                lineHeight: 1,
                color: C.teal,
                opacity: 0.12,
                position: "absolute",
                top: 8,
                left: 14,
                fontFamily: "Georgia, serif",
                pointerEvents: "none",
              }}
            >
              "
            </div>
            <p
              style={{
                fontSize: "0.78rem",
                color: C.textDark,
                fontStyle: "italic",
                fontWeight: 300,
                lineHeight: 1.7,
                marginBottom: 12,
                paddingLeft: 6,
              }}
            >
              I spent nearly a year searching for the right OT for my son. Information was scattered across Facebook
              groups and outdated PDFs. I kept thinking — there has to be a better way.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div
                style={{
                  width: 3,
                  height: 28,
                  background: `linear-gradient(180deg, ${C.tealLight}, ${C.teal})`,
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.tealLight}, ${C.teal})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                CF
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 600, color: C.textDark }}>Co-founder, Beyonder</div>
                <div style={{ fontSize: "0.58rem", color: C.textLight }}>Parent of an 8-year-old with SEND</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              background: "white",
              borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}
          >
            {[
              { num: "85%", label: "say a platform like this is vital" },
              { num: "Free", label: "for all families, always" },
              { num: "1 in 5", label: "UK children have SEND" },
            ].map((s, i) => (
              <div
                key={s.num}
                style={{
                  padding: "14px 10px",
                  textAlign: "center",
                  borderRight: i < 2 ? "1px solid rgba(0,0,0,0.06)" : "none",
                }}
              >
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 4 }}>
                  {s.num}
                </div>
                <div style={{ fontSize: "0.52rem", color: C.textLight, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Mobile Bottom Nav ── */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(0,0,0,0.07)",
            display: "flex",
            padding: "8px 0 10px",
            zIndex: 100,
          }}
        >
          {[
            { icon: "🏠", label: "Home", to: "/", active: true },
            { icon: "🔍", label: "Support", to: "/providers", active: false },
            { icon: "💬", label: "Community", to: "/community", active: false },
            { icon: "🏢", label: "Providers", to: "/for-providers", active: false },
            { icon: "👤", label: "Account", to: "/login", active: false },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "2px 0",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: 18, opacity: item.active ? 1 : 0.22, lineHeight: 1 }}>{item.icon}</span>
              <span
                style={{
                  fontSize: "0.5rem",
                  color: item.active ? C.teal : C.textLight,
                  fontWeight: item.active ? 700 : 500,
                }}
              >
                {item.label}
              </span>
              {item.active && <div style={{ width: 3, height: 3, borderRadius: "50%", background: C.teal }} />}
            </Link>
          ))}
        </div>

        {/* Keyframe for live pulse — injected inline */}
        <style>{`
          @keyframes livepulse {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
            50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(74,222,128,0); }
          }
        `}</style>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP LAYOUT — hidden below md
      ══════════════════════════════════════════ */}
      <div className="hidden md:block" style={{ background: C.cream }}>
        {/* ── 1. HERO ── */}
        <section
          style={{
            position: "relative",
            overflow: "visible",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 380,
            maxHeight: 480,
            height: "calc(100vh - 160px)",
            padding: "0 40px 40px",
          }}
        >
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <StarCanvas />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              background:
                "linear-gradient(158deg, rgba(6,24,40,0.55) 0%, rgba(10,32,56,0.45) 42%, rgba(6,20,32,0.60) 72%, rgba(3,12,20,0.70) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -100,
              top: -100,
              width: 480,
              height: 480,
              borderRadius: "50%",
              border: "50px solid rgba(42,122,106,0.08)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -55,
              top: -55,
              width: 300,
              height: 300,
              borderRadius: "50%",
              border: "20px solid rgba(42,122,106,0.055)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ marginBottom: 14 }}>
              <img src={LogoPrimary} alt="Beyonder" style={{ height: "clamp(44px, 8vw, 72px)", width: "auto" }} />
            </div>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(255,255,255,0.50)",
                fontWeight: 300,
                margin: 0,
                textAlign: "center",
              }}
            >
              One place for everything SEND
            </p>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              marginTop: 26,
            }}
          >
            <form
              onSubmit={handleSearch}
              style={{
                display: "flex",
                width: "min(580px, 92vw)",
                height: 52,
                background: "rgba(255,255,255,0.97)",
                borderRadius: 12,
                overflow: "visible",
                boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
                marginBottom: 10,
                position: "relative",
                zIndex: 999,
              }}
            >
              <div
                ref={regionRef}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "7px 16px",
                  borderRight: "1px solid #e8e8e8",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => setRegionOpen((o) => !o)}
              >
                <span
                  style={{
                    fontSize: "0.56rem",
                    fontWeight: 600,
                    color: C.teal,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    marginBottom: 1,
                  }}
                >
                  Region
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setRegionOpen(true);
                    }}
                    placeholder="Select a region"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRegionOpen(true);
                    }}
                    style={{
                      fontSize: "0.8rem",
                      color: C.textDark,
                      fontWeight: 300,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontFamily: "'Outfit', sans-serif",
                      flex: 1,
                      minWidth: 0,
                      cursor: "pointer",
                    }}
                  />
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    style={{ flexShrink: 0, opacity: 0.25, marginRight: 2 }}
                  >
                    <path
                      d="M2 3.5 L5 6.5 L8 3.5"
                      stroke="#1a2a3a"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {regionOpen && filteredRegions.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      left: 0,
                      width: "100%",
                      background: "rgba(255,255,255,0.99)",
                      borderRadius: 10,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                      zIndex: 9999,
                      overflowY: "auto",
                      overflowX: "hidden",
                      maxHeight: "234px",
                      border: "1px solid #e8e8e8",
                    }}
                  >
                    {filteredRegions.map((r, i) => (
                      <div
                        key={r}
                        style={{
                          padding: "9px 16px",
                          fontSize: "0.80rem",
                          color: r === region ? C.teal : C.textDark,
                          fontWeight: r === region ? 600 : 300,
                          fontFamily: "'Outfit', sans-serif",
                          cursor: "pointer",
                          borderTop: i > 0 ? "1px solid #f0ece4" : "none",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(42,122,106,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setRegion(r);
                          setRegionOpen(false);
                        }}
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "7px 16px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.56rem",
                    fontWeight: 600,
                    color: C.teal,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    marginBottom: 1,
                  }}
                >
                  Type of support
                </span>
                <input
                  type="text"
                  value={support}
                  onChange={(e) => setSupport(e.target.value)}
                  placeholder="e.g. OT, Speech therapy, Clubs"
                  style={{
                    fontSize: "0.8rem",
                    color: C.textDark,
                    fontWeight: 300,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  width: 110,
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${C.orangeLight}, ${C.orange})`,
                  border: "none",
                  color: C.white,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  fontFamily: "'Outfit', sans-serif",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Find Support
              </button>
            </form>
            <div style={{ display: "flex", gap: 7, justifyContent: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", alignSelf: "center" }}>Try:</span>
              {hints.map((h) => (
                <button
                  key={h.label}
                  style={{
                    padding: "4px 11px",
                    borderRadius: 14,
                    border: "1px solid rgba(42,122,106,0.32)",
                    fontSize: "0.68rem",
                    color: "rgba(255,255,255,0.45)",
                    background: "rgba(42,122,106,0.06)",
                    cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                  onMouseEnter={chipIn}
                  onMouseLeave={chipOut}
                  onClick={() => navigate(h.to)}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              marginTop: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                width: "min(580px, 92vw)",
                background: "rgba(42,122,106,0.12)",
                border: "1px solid rgba(42,122,106,0.22)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {[
                { n: "1", t: "Enter your postcode", s: "See what's near you" },
                { n: "2", t: "Choose your support", s: "Browse by type" },
                { n: "3", t: "Connect directly", s: "Enquire through Beyonder" },
              ].map((step, i) => (
                <div
                  key={step.n}
                  style={{
                    flex: 1,
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    padding: "11px 16px",
                    borderRight: i < 2 ? "1px solid rgba(42,122,106,0.18)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: C.teal,
                      color: C.white,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {step.n}
                  </div>
                  <div>
                    <div
                      style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", lineHeight: 1.2 }}
                    >
                      {step.t}
                    </div>
                    <div
                      style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.3 }}
                    >
                      {step.s}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 55,
              zIndex: 3,
              background: "linear-gradient(to bottom, transparent, rgba(6,24,40,0.15))",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: 10,
            }}
          >
            <div
              style={{
                width: 1,
                height: 20,
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.20))",
                marginBottom: 5,
              }}
            />
            <span
              style={{
                fontSize: "0.55rem",
                color: "rgba(255,255,255,0.20)",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
              }}
            >
              Explore
            </span>
          </div>
        </section>

        {/* ── 2. PILLARS ── */}
        <section style={{ background: C.navyMid, borderBottom: "1px solid rgba(42,122,106,0.14)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", maxWidth: 1280, margin: "0 auto" }}>
            {(
              [
                { label: "Find Local Support", sub: "Therapists, clubs & specialists", to: "/explore", hi: false },
                { label: "Community", sub: "Forums, meetups & peer support", to: "/community", hi: false },
                { label: "News & Research", sub: "Legislation, guides & updates", to: "/news", hi: false },
                { label: "For Providers", sub: "Create your free profile today", to: "/for-providers", hi: true },
              ] as const
            ).map((p) => (
              <Link
                key={p.label}
                to={p.to}
                style={{
                  padding: "20px 28px",
                  borderRight: "1px solid rgba(42,122,106,0.10)",
                  background: p.hi ? "rgba(42,122,106,0.06)" : "transparent",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
                onMouseEnter={(e) => pillarIn(e)}
                onMouseLeave={(e) => pillarOut(e, p.hi)}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: p.hi ? "rgba(42,122,106,0.18)" : "rgba(42,122,106,0.10)",
                    border: `1px solid ${p.hi ? "rgba(58,154,136,0.40)" : "rgba(42,122,106,0.20)"}`,
                  }}
                >
                  <span style={{ color: C.tealLight, fontSize: 14, fontWeight: 600 }}>→</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: p.hi ? C.tealLight : C.white, lineHeight: 1.3 }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.30)", fontWeight: 300, marginTop: 2 }}>
                    {p.sub}
                  </div>
                </div>
                <span style={{ color: "rgba(42,122,106,0.45)", fontSize: 14 }}>→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 3. CATEGORIES ── */}
        <section style={{ background: C.cream, padding: "52px 60px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2
                style={{ fontSize: "1.55rem", fontWeight: 700, color: C.textDark, letterSpacing: "-0.3px", margin: 0 }}
              >
                Where would you like to start?
              </h2>
              <Link
                to="/providers"
                style={{
                  fontSize: "0.78rem",
                  color: C.teal,
                  fontWeight: 500,
                  borderBottom: "1px solid rgba(42,122,106,0.30)",
                  textDecoration: "none",
                }}
              >
                View all providers →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
              {[
                {
                  label: "Therapists & Specialists",
                  sub: "OTs, SaLTs, psychologists",
                  to: "/providers?category=therapists",
                  icon: TherapistsIcon,
                },
                {
                  label: "Inclusive Clubs & Activities",
                  sub: "Sport, arts, sensory play",
                  to: "/providers?category=activities",
                  icon: ClubsIcon,
                },
                {
                  label: "Products & Equipment",
                  sub: "Sensory, adaptive, learning",
                  to: "/providers?category=products",
                  icon: NewsIcon,
                },
                {
                  label: "Education & Learning Support",
                  sub: "Tutors, EHCP, SEN specialists",
                  to: "/providers?category=education",
                  icon: GuidesIcon,
                },
                {
                  label: "Charities & Organisations",
                  sub: "Support groups, advocacy",
                  to: "/providers?category=charities",
                  icon: LocalIcon,
                },
              ].map((c) => (
                <Link
                  key={c.label}
                  to={c.to}
                  style={{
                    background: C.white,
                    borderRadius: 14,
                    padding: "24px 16px 20px",
                    border: `1.5px solid ${C.creamDark}`,
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    textAlign: "center",
                  }}
                  onMouseEnter={cardIn}
                  onMouseLeave={(e) => cardOut(e, C.creamDark)}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 13,
                      background: "rgba(42,122,106,0.10)",
                      border: "1px solid rgba(42,122,106,0.20)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img src={c.icon} alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
                  </div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: C.textDark, lineHeight: 1.3 }}>
                    {c.label}
                  </span>
                  <span style={{ fontSize: "0.70rem", color: C.textLight, fontWeight: 300 }}>{c.sub}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. PARENT VOICE ── */}
        <section style={{ background: C.sage, padding: "52px 60px", borderTop: "1px solid rgba(42,122,106,0.10)" }}>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3.5rem",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <span
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: C.teal,
                }}
              >
                Why Beyonder exists
              </span>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: C.textDark,
                  lineHeight: 1.25,
                  letterSpacing: "-0.3px",
                  margin: 0,
                }}
              >
                Built because we couldn't find what we needed either.
              </h2>
              <blockquote
                style={{
                  background: C.white,
                  borderLeft: `3px solid ${C.teal}`,
                  padding: "18px 20px",
                  borderRadius: "0 10px 10px 0",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  margin: 0,
                }}
              >
                <p
                  style={{
                    fontSize: "0.92rem",
                    fontStyle: "italic",
                    color: C.textDark,
                    lineHeight: 1.7,
                    fontWeight: 300,
                    margin: 0,
                  }}
                >
                  "I spent nearly a year searching for the right OT for my son. Information was scattered across
                  Facebook groups, outdated PDFs and word of mouth. I kept thinking — there has to be a better way."
                </p>
                <cite
                  style={{
                    display: "block",
                    marginTop: 10,
                    fontSize: "0.70rem",
                    color: C.textLight,
                    fontStyle: "normal",
                    fontWeight: 500,
                  }}
                >
                  — Co-founder, parent of an 8-year-old with SEND
                </cite>
              </blockquote>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
              {[
                {
                  num: "85%",
                  label: "of SEND parents say a platform like this is vital",
                  src: "Beyonder survey · 50 parents",
                },
                {
                  num: "80%",
                  label: "rely on word of mouth to find SEND services",
                  src: "Beyonder survey · 50 parents",
                },
                {
                  num: "1 in 5",
                  label: "children in the UK have special educational needs",
                  src: "Dept for Education · 2023",
                },
                { num: "Free", label: "to join for all families. Discovery should never cost.", src: "Always" },
              ].map((s) => (
                <div
                  key={s.num}
                  style={{
                    background: C.white,
                    borderRadius: 12,
                    padding: "18px 16px",
                    border: `1px solid ${C.creamDark}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: "1.9rem", fontWeight: 700, color: C.teal, lineHeight: 1 }}>{s.num}</span>
                  <span style={{ fontSize: "0.73rem", color: C.textMid, lineHeight: 1.5 }}>{s.label}</span>
                  <span style={{ fontSize: "0.60rem", color: C.textLight, marginTop: 2 }}>{s.src}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. PROVIDER BAND ── */}
        <section
          style={{
            background: C.navy,
            padding: "36px 60px",
            borderTop: "1px solid rgba(42,122,106,0.15)",
            borderBottom: "1px solid rgba(42,122,106,0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: "radial-gradient(ellipse 60% 100% at 100% 50%, rgba(42,122,106,0.07) 0%, transparent 65%)",
            }}
          />
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3.5rem",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: C.tealLight }}>For Providers</span>
                <div style={{ width: 32, height: 1.5, background: "rgba(58,154,136,0.40)" }} />
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.30)", fontWeight: 300 }}>
                  Therapists, clubs, specialists &amp; organisations
                </span>
              </div>
              <h2
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: C.white,
                  lineHeight: 1.25,
                  letterSpacing: "-0.3px",
                  margin: 0,
                }}
              >
                Reach the families already searching for you.
              </h2>
              <p
                style={{
                  fontSize: "0.80rem",
                  color: "rgba(255,255,255,0.40)",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  maxWidth: 380,
                  margin: 0,
                }}
              >
                Beyonder connects SEND families with local support at the moment they need it most. Your profile goes
                live immediately — no approval wait, no upfront cost.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  "Free to list — live the moment you create it",
                  "Enquiries come through Beyonder — no cold calls",
                  "Full control of your profile and availability",
                ].map((pt) => (
                  <div
                    key={pt}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      fontSize: "0.76rem",
                      color: "rgba(255,255,255,0.50)",
                      fontWeight: 300,
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: "rgba(42,122,106,0.20)",
                        border: "1px solid rgba(42,122,106,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ color: C.tealLight, fontSize: 9, fontWeight: 700 }}>✓</span>
                    </div>
                    {pt}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 4 }}>
                <Link
                  to="/for-providers"
                  style={{
                    display: "inline-block",
                    padding: "11px 24px",
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3a9a88, #2a7a6a)",
                    boxShadow: "0 4px 16px rgba(42,122,106,0.28)",
                    color: C.white,
                    fontSize: "0.84rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                  onMouseEnter={tealIn}
                  onMouseLeave={(e) => tealOut(e)}
                >
                  Create your free profile
                </Link>
                <Link
                  to="/for-providers"
                  style={{
                    fontSize: "0.76rem",
                    padding: "10px 16px",
                    borderRadius: 8,
                    textDecoration: "none",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.50)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(42,122,106,0.12)";
                    e.currentTarget.style.borderColor = "rgba(58,154,136,0.55)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.90)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.50)";
                  }}
                >
                  See how it works →
                </Link>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { num: "2,400+", label: "Families actively searching" },
                  { num: "38", label: "Counties with active searches" },
                  { num: "Free", label: "To list. Upgrade only if you want more." },
                  { num: "Live", label: "Profile goes live instantly on sign-up" },
                ].map((s) => (
                  <div
                    key={s.num}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(42,122,106,0.10)",
                      borderRadius: 10,
                      padding: "12px 14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <span style={{ fontSize: "1.4rem", fontWeight: 700, color: C.tealLight, lineHeight: 1 }}>
                      {s.num}
                    </span>
                    <span
                      style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.28)", fontWeight: 300, lineHeight: 1.4 }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <blockquote
                style={{
                  background: "rgba(42,122,106,0.07)",
                  border: "1px solid rgba(42,122,106,0.14)",
                  borderRadius: 8,
                  padding: "12px 14px",
                  margin: 0,
                }}
              >
                <p
                  style={{
                    fontSize: "0.74rem",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.38)",
                    lineHeight: 1.6,
                    fontWeight: 300,
                    margin: 0,
                  }}
                >
                  "Within two weeks I had three enquiries from families I'd never have reached otherwise."
                </p>
                <cite
                  style={{
                    display: "block",
                    marginTop: 5,
                    fontSize: "0.62rem",
                    color: "rgba(255,255,255,0.20)",
                    fontStyle: "normal",
                  }}
                >
                  — Paediatric OT, Hampshire · Founding Provider
                </cite>
              </blockquote>
            </div>
          </div>
        </section>

        {/* ── 6. COMMUNITY ── */}
        <section style={{ background: C.sage, padding: "52px 60px", borderTop: "1px solid rgba(42,122,106,0.12)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: C.teal,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Community
              </span>
              <h2
                style={{
                  fontSize: "1.55rem",
                  fontWeight: 700,
                  color: C.textDark,
                  letterSpacing: "-0.3px",
                  margin: "0 0 6px",
                }}
              >
                A place where people really get it.
              </h2>
              <p style={{ fontSize: "0.85rem", color: C.textMid, fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                Real conversations, local meetups and shared experiences — all in one place, just for SEND families.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
              <div>
                <span
                  style={{
                    fontSize: "0.58rem",
                    fontWeight: 600,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: C.teal,
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  Upcoming near you
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    {
                      day: "14",
                      mon: "Apr",
                      title: "SEND Parents Coffee Morning — Southampton",
                      meta: "St James Community Centre · 10am · Free to attend",
                      chip: "Meetup",
                    },
                    {
                      day: "21",
                      mon: "Apr",
                      title: "Understanding Your Child's EHCP — Online Session",
                      meta: "Via Zoom · 7pm · Free for members",
                      chip: "Workshop",
                    },
                  ].map((m) => (
                    <Link
                      key={m.day}
                      to="/community"
                      style={{
                        background: C.white,
                        borderRadius: 14,
                        padding: "16px 18px",
                        border: `1.5px solid ${C.creamDark}`,
                        textDecoration: "none",
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-start",
                      }}
                      onMouseEnter={commIn}
                      onMouseLeave={commOut}
                    >
                      <div
                        style={{
                          width: 46,
                          height: 50,
                          flexShrink: 0,
                          borderRadius: 10,
                          background: C.teal,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 3px 10px rgba(42,122,106,0.20)",
                        }}
                      >
                        <span style={{ fontSize: "1.25rem", fontWeight: 700, color: C.white, lineHeight: 1 }}>
                          {m.day}
                        </span>
                        <span
                          style={{
                            fontSize: "0.52rem",
                            color: "rgba(255,255,255,0.75)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            marginTop: 1,
                          }}
                        >
                          {m.mon}
                        </span>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.86rem",
                            fontWeight: 600,
                            color: C.textDark,
                            lineHeight: 1.3,
                            marginBottom: 3,
                          }}
                        >
                          {m.title}
                        </div>
                        <div style={{ fontSize: "0.70rem", color: C.textMid, fontWeight: 300, lineHeight: 1.5 }}>
                          {m.meta}
                        </div>
                        <span
                          style={{
                            display: "inline-block",
                            marginTop: 5,
                            padding: "2px 9px",
                            borderRadius: 20,
                            background: "rgba(42,122,106,0.08)",
                            border: "1px solid rgba(42,122,106,0.18)",
                            fontSize: "0.60rem",
                            color: C.teal,
                            fontWeight: 500,
                          }}
                        >
                          {m.chip}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "0.58rem",
                    fontWeight: 600,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: C.teal,
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  People are talking
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    {
                      initials: "SL",
                      name: "Sarah L",
                      topic: "General Support · 2hrs ago",
                      replies: 12,
                      avatarBg: `linear-gradient(135deg,${C.tealLight},${C.teal})`,
                      text: '"Does anyone know of sensory-friendly swimming lessons near Southampton? My son loves water but busy pools are really overwhelming for him."',
                    },
                    {
                      initials: "MK",
                      name: "Mark K",
                      topic: "Education · Yesterday",
                      replies: 28,
                      avatarBg: "linear-gradient(135deg,#7a6aaa,#5a4a8a)",
                      text: "\"We have our EHCP annual review next month and I want to make sure I'm asking for the right things. Any advice from parents who've been through it?\"",
                    },
                  ].map((t) => (
                    <Link
                      key={t.initials}
                      to="/community"
                      style={{
                        background: C.white,
                        borderRadius: 14,
                        padding: "16px 18px",
                        border: `1.5px solid ${C.creamDark}`,
                        textDecoration: "none",
                        display: "block",
                      }}
                      onMouseEnter={commIn}
                      onMouseLeave={commOut}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: t.avatarBg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.66rem",
                            fontWeight: 700,
                            color: C.white,
                          }}
                        >
                          {t.initials}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.74rem", fontWeight: 600, color: C.textDark, lineHeight: 1.2 }}>
                            {t.name}
                          </div>
                          <div style={{ fontSize: "0.63rem", color: C.tealLight }}>{t.topic}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.83rem", color: C.textDark, lineHeight: 1.55, margin: 0 }}>{t.text}</p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 9,
                          paddingTop: 9,
                          borderTop: `1px solid ${C.creamDark}`,
                        }}
                      >
                        <span style={{ fontSize: "0.62rem", color: C.textLight }}>{t.replies} replies</span>
                        <span style={{ fontSize: "0.65rem", color: C.teal, fontWeight: 500 }}>
                          Join the conversation →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
              <Link
                to="/community"
                style={{
                  padding: "11px 28px",
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #3a9a88, #2a7a6a)",
                  color: C.white,
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(42,122,106,0.28)",
                }}
                onMouseEnter={tealIn}
                onMouseLeave={(e) => tealOut(e)}
              >
                Join the Community
              </Link>
              <Link
                to="/community"
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  background: "transparent",
                  border: "1.5px solid rgba(42,122,106,0.30)",
                  color: C.teal,
                  fontSize: "0.82rem",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => ghostIn(e)}
                onMouseLeave={(e) => ghostOut(e)}
              >
                Browse all forums
              </Link>
              <span style={{ fontSize: "0.74rem", color: C.textMid, fontStyle: "italic", fontWeight: 300 }}>
                Free to join · Moderated · Safe space
              </span>
            </div>
          </div>
        </section>

        {/* ── 7. NEWS ── */}
        <section style={{ background: C.cream, padding: "40px 60px", borderTop: `1px solid ${C.creamDark}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h2
                style={{ fontSize: "1.55rem", fontWeight: 700, color: C.textDark, letterSpacing: "-0.3px", margin: 0 }}
              >
                Stay ahead of what matters.
              </h2>
              <Link
                to="/news"
                style={{
                  fontSize: "0.78rem",
                  color: C.teal,
                  fontWeight: 500,
                  borderBottom: "1px solid rgba(42,122,106,0.30)",
                  textDecoration: "none",
                }}
              >
                All news →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 14 }}>
              {[
                {
                  featured: true,
                  chip: "Research",
                  bg: "linear-gradient(135deg,#0a1e30,#1a4a3a)",
                  title: "Early SaLT intervention reduces communication difficulties by up to 60% at age 7",
                  excerpt:
                    "A landmark UK study tracking 2,400 children over five years confirms what many SEND parents have long argued for.",
                  date: "3 April 2026 · Research",
                },
                {
                  featured: false,
                  chip: "Legislation",
                  bg: "linear-gradient(135deg,#141a28,#1a2a50)",
                  title: "SEND Code of Practice 2026: what changes for families",
                  excerpt: "Key updates to EHCP timelines and local authority obligations.",
                  date: "28 March 2026 · Legislation",
                },
                {
                  featured: false,
                  chip: "Therapy",
                  bg: "linear-gradient(135deg,#0e1e14,#1a3a28)",
                  title: "Sensory integration therapy: the evidence and what parents should know",
                  excerpt: "A balanced look at research on sensory approaches for autism.",
                  date: "22 March 2026 · Therapy",
                },
              ].map((n) => (
                <Link
                  key={n.title}
                  to="/news"
                  style={{
                    background: C.white,
                    borderRadius: 11,
                    overflow: "hidden",
                    border: `1.5px solid ${C.creamDark}`,
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={newsIn}
                  onMouseLeave={newsOut}
                >
                  <div
                    style={{
                      height: n.featured ? 120 : 90,
                      background: n.bg,
                      display: "flex",
                      alignItems: "flex-end",
                      padding: 10,
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(42,122,106,0.80)",
                        color: C.white,
                        fontSize: "0.56rem",
                        fontWeight: 600,
                        padding: "2px 7px",
                        borderRadius: 3,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {n.chip}
                    </span>
                  </div>
                  <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                    <h3
                      style={{
                        fontSize: n.featured ? "0.98rem" : "0.85rem",
                        fontWeight: 600,
                        color: C.textDark,
                        lineHeight: 1.4,
                        margin: 0,
                      }}
                    >
                      {n.title}
                    </h3>
                    <p style={{ fontSize: "0.72rem", color: C.textMid, lineHeight: 1.55, fontWeight: 300, margin: 0 }}>
                      {n.excerpt}
                    </p>
                    <span style={{ fontSize: "0.62rem", color: C.textLight, marginTop: "auto", paddingTop: 4 }}>
                      {n.date}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* END DESKTOP */}
    </div>
  );
};

export default Index;
