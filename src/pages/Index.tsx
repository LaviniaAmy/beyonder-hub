import BirdCanvas from "@/components/BirdCanvas";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import LocalIcon      from "@/assets/icons/Local_Icon.svg";
import GuidesIcon     from "@/assets/icons/Guides_Icon.svg";
import WorkIcon       from "@/assets/icons/Work_Icon.svg";
import TherapistsIcon from "@/assets/icons/Therapists_Icon.svg";
import ClubsIcon      from "@/assets/icons/Clubs_Icon.svg";
import NewsIcon       from "@/assets/icons/News_Icon.svg";

import StepLocationIcon  from "@/assets/icons/Step_Location.svg";
import StepSupportIcon   from "@/assets/icons/Step_Support.svg";
import StepMessagingIcon from "@/assets/icons/Step_Messaging.svg";

const C = {
  deep:        "#111827",
  purple:      "#1E1B3A",
  purpleMid:   "#2B4C7E",
  rose:        "#4E6E8E",
  terra:       "#D98A6A",
  sienna:      "#E8A080",
  amber:       "#E8F4FF",
  cream:       "#F6F3EE",
  creamDark:   "#EAE6DF",
  warmWhite:   "#F0F4FF",
  textDark:    "#1B1A35",
  textMid:     "#4B5563",
  textLight:   "#7C7C8A",
  white:       "#FFFFFF",
} as const;

// ── Hover helpers ────────────────────────────────────────────

const terraIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform  = "translateY(-2px)";
  e.currentTarget.style.boxShadow  = "0 8px 28px rgba(217,138,106,0.52), 0 0 0 4px rgba(217,138,106,0.10)";
};
const terraOut = (e: React.MouseEvent<HTMLAnchorElement>, shadow = "0 4px 16px rgba(217,138,106,0.28)") => {
  e.currentTarget.style.transform  = "none";
  e.currentTarget.style.boxShadow  = shadow;
};

const ghostIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background   = "rgba(217,138,106,0.10)";
  e.currentTarget.style.borderColor  = "rgba(232,160,128,0.60)";
  e.currentTarget.style.color        = C.sienna;
};
const ghostOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background   = "transparent";
  e.currentTarget.style.borderColor  = "rgba(217,138,106,0.30)";
  e.currentTarget.style.color        = C.terra;
};

const cardIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform    = "translateY(-3px)";
  e.currentTarget.style.boxShadow    = "0 8px 24px rgba(27,26,53,0.10)";
  e.currentTarget.style.borderColor  = "rgba(217,138,106,0.28)";
};
const cardOut = (e: React.MouseEvent<HTMLAnchorElement>, borderColor = C.creamDark) => {
  e.currentTarget.style.transform    = "none";
  e.currentTarget.style.boxShadow    = "none";
  e.currentTarget.style.borderColor  = borderColor;
};

const pillarIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background = "rgba(217,138,106,0.10)";
};
const pillarOut = (e: React.MouseEvent<HTMLAnchorElement>, hi: boolean) => {
  e.currentTarget.style.background = hi ? "rgba(217,138,106,0.06)" : "transparent";
};

const newsIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform    = "translateY(-2px)";
  e.currentTarget.style.boxShadow    = "0 6px 20px rgba(27,26,53,0.08)";
};
const newsOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform    = "none";
  e.currentTarget.style.boxShadow    = "none";
};

const commIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform    = "translateY(-2px)";
  e.currentTarget.style.boxShadow    = "0 6px 20px rgba(27,26,53,0.08)";
};
const commOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform    = "none";
  e.currentTarget.style.boxShadow    = "none";
};

const chipIn = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.borderColor  = "rgba(217,138,106,0.80)";
  e.currentTarget.style.background   = "rgba(217,138,106,0.16)";
  e.currentTarget.style.color        = C.warmWhite;
  e.currentTarget.style.transform    = "scale(1.04)";
};
const chipOut = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.borderColor  = "rgba(217,138,106,0.32)";
  e.currentTarget.style.background   = "rgba(217,138,106,0.06)";
  e.currentTarget.style.color        = "rgba(232,244,255,0.45)";
  e.currentTarget.style.transform    = "none";
};

const REGIONS = [
  "South East England", "South West England", "North East England",
  "North West England", "East Midlands", "West Midlands",
  "London", "Wales", "Scotland", "Northern Ireland", "Online Only",
];

const Index = () => {
  const [region,         setRegion]         = useState("");
  const [support,        setSupport]        = useState("");
  const [regionOpen,     setRegionOpen]     = useState(false);
  const [mobileRegionOpen, setMobileRegionOpen] = useState(false);
  const navigate = useNavigate();

  const regionRef       = useRef<HTMLDivElement>(null);
  const mobileRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node))       setRegionOpen(false);
      if (mobileRegionRef.current && !mobileRegionRef.current.contains(e.target as Node)) setMobileRegionOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredRegions = REGIONS.filter((r) => r.toLowerCase().includes(region.toLowerCase()));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (region.trim())  params.set("region", region.trim());
    if (support.trim()) params.set("support", support.trim());
    navigate(params.toString() ? `/providers?${params.toString()}` : "/providers");
  };

  const handleMobileSearch = () => {
    const params = new URLSearchParams();
    if (region.trim())  params.set("region", region.trim());
    if (support.trim()) params.set("support", support.trim());
    navigate(params.toString() ? `/providers?${params.toString()}` : "/providers");
  };

  const hints = [
    { label: "Speech & Language",    to: "/providers?category=therapists&support=speech-language-therapy" },
    { label: "Occupational Therapy", to: "/providers?support=occupational-therapy" },
    { label: "Autism-friendly clubs", to: "/providers?category=activities&needs=autism" },
    { label: "EHCP support",         to: "/providers?category=education&support=ehcp" },
  ];

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif" }}>

      {/* ══════════════════════════════════════════
          MOBILE LAYOUT
      ══════════════════════════════════════════ */}
      <div className="md:hidden" style={{ background: C.cream, minHeight: "100vh", paddingBottom: 72 }}>

        {/* ── Mobile Hero ── */}
        <div style={{ background: "linear-gradient(180deg, #080c18 0%, #0e1a38 28%, #1a3868 55%, #2a6090 75%, #60a8c8 100%)", padding: "14px 20px 0", position: "relative", overflow: "hidden" }}>
          {/* Gradient glows */}
          <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(43,76,126,0.35) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: -40, width: 140, height: 140, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(43,76,126,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
          {/* Stars */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `
            radial-gradient(1px 1px at 18% 25%, rgba(232,244,255,0.45) 0%, transparent 100%),
            radial-gradient(1px 1px at 78% 12%, rgba(232,244,255,0.30) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 52% 55%, rgba(232,244,255,0.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 33% 78%, rgba(232,244,255,0.20) 0%, transparent 100%),
            radial-gradient(1px 1px at 88% 68%, rgba(232,244,255,0.18) 0%, transparent 100%)
          ` }} />

          {/* Nav bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 20, position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.terra }} />
              <span style={{ fontSize: "1rem", fontWeight: 700, color: C.amber, letterSpacing: "-0.3px" }}>Beyonder</span>
            </div>
            <Link to="/login" style={{ fontSize: "0.70rem", fontWeight: 600, color: "rgba(232,244,255,0.55)",
              padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(232,244,255,0.12)",
              background: "rgba(232,244,255,0.05)", textDecoration: "none" }}>
              Sign in
            </Link>
          </div>

          {/* Headline */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: "0.54rem", color: C.terra, fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", marginBottom: 8 }}>
              SEND Support Platform
            </div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 400, color: C.warmWhite, lineHeight: 1.14,
              letterSpacing: "-0.5px", margin: "0 0 18px", fontFamily: "'Josefin Sans', sans-serif" }}>
              Find the right<br />support for <span style={{ color: C.amber }}>your</span><br />child.
            </h1>
          </div>

          {/* Search bar */}
          <div style={{ position: "relative", zIndex: 2, marginBottom: 20 }}>
            <div style={{ background: "rgba(232,244,255,0.07)", border: "1px solid rgba(232,244,255,0.11)",
              borderRadius: 11, padding: "10px 14px", display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ fontSize: 13, opacity: 0.28 }}>🔍</span>
              <input
                type="text"
                value={support}
                onChange={(e) => setSupport(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMobileSearch()}
                placeholder="OT, Speech therapy, Clubs..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none",
                  fontSize: "0.73rem", color: C.warmWhite, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 300 }}
              />
              {/* Region pill */}
              <div ref={mobileRegionRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setMobileRegionOpen((o) => !o)}
                  style={{ fontSize: "0.6rem", color: C.amber,
                    background: mobileRegionOpen ? C.deep : "rgba(217,138,106,0.16)",
                    border: `1px solid ${mobileRegionOpen ? C.amber : "rgba(217,138,106,0.25)"}`,
                    borderRadius: 6, padding: "4px 10px", fontWeight: 600, cursor: "pointer",
                    fontFamily: "'Nunito Sans', sans-serif", whiteSpace: "nowrap" }}>
                  {region || "📍 Region"}
                </button>
                {mobileRegionOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 220,
                    background: C.purple, border: `1px solid ${C.rose}`, borderRadius: 10,
                    boxShadow: "0 12px 32px rgba(0,0,0,0.45)", zIndex: 9999, overflow: "hidden" }}>
                    <div onMouseDown={(e) => { e.preventDefault(); setRegion(""); setMobileRegionOpen(false); }}
                      style={{ padding: "10px 16px", fontSize: "0.72rem", color: "rgba(232,244,255,0.45)",
                        fontWeight: 400, cursor: "pointer", borderBottom: "1px solid rgba(217,138,106,0.15)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(217,138,106,0.10)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      All regions
                    </div>
                    {REGIONS.map((r, i) => (
                      <div key={r}
                        onMouseDown={(e) => { e.preventDefault(); setRegion(r); setMobileRegionOpen(false); }}
                        style={{ padding: "10px 16px", fontSize: "0.75rem", color: C.amber,
                          fontWeight: r === region ? 700 : 400, cursor: "pointer",
                          borderTop: i > 0 ? "1px solid rgba(217,138,106,0.10)" : "none",
                          background: r === region ? "rgba(217,138,106,0.15)" : "transparent" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(217,138,106,0.12)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = r === region ? "rgba(217,138,106,0.15)" : "transparent")}>
                        {r}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Search go */}
              <button onClick={handleMobileSearch} style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: `linear-gradient(135deg, ${C.sienna}, ${C.terra})`, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.warmWhite, fontSize: "0.85rem", fontWeight: 700 }}>
                →
              </button>
            </div>
          </div>

          {/* Category shortcuts */}
          <div style={{ borderTop: "1px solid rgba(232,244,255,0.06)", paddingTop: 10, position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: "0.5rem", color: "rgba(232,244,255,0.22)", fontWeight: 600,
              letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 0,
              display: "flex", alignItems: "center", gap: 6 }}>
              Browse by category
              <span style={{ flex: 1, height: 1, background: "rgba(232,244,255,0.07)", display: "block" }} />
            </div>
            <div style={{ display: "flex" }}>
              {[
                { label: "Therapists", to: "/providers?category=therapists" },
                { label: "Clubs",      to: "/providers?category=activities" },
                { label: "Education",  to: "/providers?category=education" },
                { label: "Products",   to: "/providers?category=products" },
                { label: "Charities",  to: "/providers?category=charities" },
              ].map((cat) => (
                <Link key={cat.label} to={cat.to} style={{ flex: 1, textAlign: "center", padding: "11px 4px",
                  fontSize: "0.62rem", fontWeight: 600, color: "rgba(232,244,255,0.38)", textDecoration: "none" }}>
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile Body ── */}
        <div style={{ padding: "22px 18px 16px" }}>
          {/* Intro */}
          <p style={{ fontSize: "0.73rem", color: C.textMid, fontWeight: 300, lineHeight: 1.7,
            marginBottom: 22, paddingBottom: 18, borderBottom: "1px solid rgba(27,26,53,0.07)" }}>
            Beyonder is <strong style={{ color: C.textDark, fontWeight: 600 }}>free for every family</strong> — a single
            place to find support, connect with others who understand, and stay informed about everything SEND.
          </p>

          {/* Pillar Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 22 }}>
            {/* All Support */}
            <Link to="/providers" style={{ textDecoration: "none" }}>
              <div style={{ background: C.white, borderRadius: 18, overflow: "hidden", position: "relative",
                border: "1px solid rgba(217,138,106,0.12)",
                boxShadow: "0 2px 12px rgba(217,138,106,0.08), 0 1px 3px rgba(0,0,0,0.05)",
                display: "flex", alignItems: "stretch", minHeight: 88 }}>
                <div style={{ width: 5, flexShrink: 0, background: `linear-gradient(180deg, ${C.sienna}, ${C.terra})` }} />
                <div style={{ flex: 1, padding: "16px 16px 16px 18px", display: "flex", flexDirection: "column",
                  justifyContent: "center", gap: 4 }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "1.8px",
                    textTransform: "uppercase", color: C.terra }}>Directory</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.textDark, letterSpacing: "-0.2px" }}>All Support</div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 300, color: C.textMid, lineHeight: 1.55 }}>
                    Therapists, clubs, education, products and charities — found in seconds, not months.
                  </div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: C.terra, marginTop: 6 }}>Browse providers →</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, margin: "16px 16px 16px 0",
                  alignSelf: "center", background: "linear-gradient(135deg, rgba(217,138,106,0.12), rgba(217,138,106,0.06))",
                  border: "1px solid rgba(217,138,106,0.15)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 20 }}>🔍</div>
                <div style={{ position: "absolute", top: 14, right: 70, background: "rgba(217,138,106,0.08)",
                  border: "1px solid rgba(217,138,106,0.15)", borderRadius: 20, padding: "3px 9px",
                  fontSize: "0.55rem", fontWeight: 700, color: C.terra }}>
                  New providers listed weekly
                </div>
              </div>
            </Link>

            {/* Parent Hub */}
            <Link to="/community" style={{ textDecoration: "none" }}>
              <div style={{ background: "#fdfcff", borderRadius: 18, overflow: "hidden", position: "relative",
                border: "1px solid rgba(43,76,126,0.12)",
                boxShadow: "0 2px 12px rgba(43,76,126,0.08), 0 1px 3px rgba(0,0,0,0.04)",
                display: "flex", alignItems: "stretch", minHeight: 88 }}>
                <div style={{ width: 5, flexShrink: 0, background: `linear-gradient(180deg, ${C.rose}, ${C.purple})` }} />
                <div style={{ flex: 1, padding: "16px 16px 16px 18px", display: "flex", flexDirection: "column",
                  justifyContent: "center", gap: 4 }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "1.8px",
                    textTransform: "uppercase", color: C.rose }}>Community</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.textDark, letterSpacing: "-0.2px" }}>Parent Hub</div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 300, color: C.textMid, lineHeight: 1.55 }}>
                    Forums, meetups and real conversations with parents who truly get it.
                  </div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: C.rose, marginTop: 6 }}>Join the community →</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, margin: "16px 16px 16px 0",
                  alignSelf: "center", background: "linear-gradient(135deg, rgba(43,76,126,0.10), rgba(43,76,126,0.04))",
                  border: "1px solid rgba(43,76,126,0.14)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 20 }}>💬</div>
                <div style={{ position: "absolute", top: 14, right: 70, display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80",
                    animation: "livepulse 2s infinite" }} />
                  <span style={{ fontSize: "0.52rem", fontWeight: 700, color: "#4ade80" }}>Live</span>
                </div>
              </div>
            </Link>

            {/* SEND News */}
            <Link to="/news" style={{ textDecoration: "none" }}>
              <div style={{ background: "#fffcfa", borderRadius: 18, overflow: "hidden", position: "relative",
                border: "1px solid rgba(217,138,106,0.12)",
                boxShadow: "0 2px 12px rgba(217,138,106,0.08), 0 1px 3px rgba(0,0,0,0.04)",
                display: "flex", alignItems: "stretch", minHeight: 88 }}>
                <div style={{ width: 5, flexShrink: 0, background: `linear-gradient(180deg, ${C.amber}, ${C.sienna})` }} />
                <div style={{ flex: 1, padding: "16px 16px 16px 18px", display: "flex", flexDirection: "column",
                  justifyContent: "center", gap: 4 }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "1.8px",
                    textTransform: "uppercase", color: C.sienna }}>Knowledge</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.textDark, letterSpacing: "-0.2px" }}>SEND News</div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 300, color: C.textMid, lineHeight: 1.55 }}>
                    Policy changes, the latest research, and stories that remind you you're not alone.
                  </div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: C.sienna, marginTop: 6 }}>Read latest →</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, margin: "16px 16px 16px 0",
                  alignSelf: "center", background: "linear-gradient(135deg, rgba(232,244,255,0.10), rgba(212,128,90,0.04))",
                  border: "1px solid rgba(212,128,90,0.14)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 20 }}>📰</div>
                <div style={{ position: "absolute", top: 14, right: 70, background: "rgba(212,128,90,0.08)",
                  border: "1px solid rgba(212,128,90,0.16)", borderRadius: 4, padding: "2px 7px",
                  fontSize: "0.5rem", fontWeight: 700, color: C.sienna, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  Updated daily
                </div>
              </div>
            </Link>

            {/* Join Beyonder */}
            <Link to="/for-providers" style={{ textDecoration: "none" }}>
              <div style={{ background: C.deep, borderRadius: 18, overflow: "hidden", position: "relative",
                border: "1px solid rgba(232,244,255,0.05)",
                boxShadow: "0 4px 20px rgba(28,20,40,0.25), 0 1px 3px rgba(0,0,0,0.15)",
                display: "flex", alignItems: "stretch", minHeight: 88 }}>
                <div style={{ width: 5, flexShrink: 0, background: `linear-gradient(180deg, ${C.amber}, ${C.terra})`,
                  position: "relative", zIndex: 1 }} />
                <div style={{ flex: 1, padding: "16px 16px 16px 18px", display: "flex", flexDirection: "column",
                  justifyContent: "center", gap: 4, position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "1.8px",
                    textTransform: "uppercase", color: C.amber }}>For Providers</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.warmWhite, letterSpacing: "-0.2px" }}>Join Beyonder</div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 300, color: "rgba(232,244,255,0.40)", lineHeight: 1.55 }}>
                    Thousands of families are searching right now. Your profile goes live the moment you create it.
                  </div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: C.amber, marginTop: 6 }}>
                    Create your free profile →
                  </div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, margin: "16px 16px 16px 0",
                  alignSelf: "center", background: "rgba(217,138,106,0.15)",
                  border: "1px solid rgba(217,138,106,0.25)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 20, position: "relative", zIndex: 1 }}>🏢</div>
                <div style={{ position: "absolute", top: 14, right: 70,
                  background: "linear-gradient(135deg, rgba(217,138,106,0.20), rgba(217,138,106,0.10))",
                  border: "1px solid rgba(217,138,106,0.25)", borderRadius: 20, padding: "3px 9px",
                  fontSize: "0.52rem", fontWeight: 700, color: C.amber, zIndex: 1, letterSpacing: "0.5px" }}>
                  Free to list
                </div>
              </div>
            </Link>
          </div>

          {/* Quote */}
          <div style={{ background: C.white, borderRadius: 16, padding: "18px 18px 16px",
            border: "1px solid rgba(27,26,53,0.06)", boxShadow: "0 2px 10px rgba(27,26,53,0.04)",
            marginBottom: 16, position: "relative" }}>
            <div style={{ fontSize: "3rem", lineHeight: 1, color: C.terra, opacity: 0.12,
              position: "absolute", top: 8, left: 14, fontFamily: "Georgia, serif", pointerEvents: "none" }}>"</div>
            <p style={{ fontSize: "0.78rem", color: C.textDark, fontStyle: "italic", fontWeight: 300,
              lineHeight: 1.7, marginBottom: 12, paddingLeft: 6 }}>
              I spent nearly a year searching for the right OT for my son. Information was scattered across Facebook
              groups and outdated PDFs. I kept thinking — there has to be a better way.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 3, height: 28, background: `linear-gradient(180deg, ${C.amber}, ${C.terra})`,
                borderRadius: 2, flexShrink: 0 }} />
              <div style={{ width: 28, height: 28, borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.sienna}, ${C.terra})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.58rem", fontWeight: 700, color: C.warmWhite, flexShrink: 0 }}>CF</div>
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 600, color: C.textDark }}>Co-founder, Beyonder</div>
                <div style={{ fontSize: "0.58rem", color: C.textLight }}>Parent of an 8-year-old with SEND</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: C.white,
            borderRadius: 16, border: "1px solid rgba(27,26,53,0.06)",
            boxShadow: "0 2px 10px rgba(27,26,53,0.04)", overflow: "hidden" }}>
            {[
              { num: "85%",   label: "say a platform like this is vital" },
              { num: "Free",  label: "for all families, always" },
              { num: "1 in 5", label: "UK children have SEND" },
            ].map((s, i) => (
              <div key={s.num} style={{ padding: "14px 10px", textAlign: "center",
                borderRight: i < 2 ? "1px solid rgba(27,26,53,0.06)" : "none" }}>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: C.terra, lineHeight: 1, marginBottom: 4 }}>
                  {s.num}
                </div>
                <div style={{ fontSize: "0.52rem", color: C.textLight, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Mobile Bottom Nav ── */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0,
          background: "rgba(246,243,238,0.97)", backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(27,26,53,0.07)", display: "flex",
          padding: "8px 0 10px", zIndex: 100 }}>
          {[
            { icon: "🏠", label: "Home",      to: "/",             active: true },
            { icon: "🔍", label: "Support",   to: "/providers",    active: false },
            { icon: "💬", label: "Community", to: "/community",    active: false },
            { icon: "🏢", label: "Providers", to: "/for-providers",active: false },
            { icon: "👤", label: "Account",   to: "/login",        active: false },
          ].map((item) => (
            <Link key={item.label} to={item.to} style={{ flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3, padding: "2px 0", textDecoration: "none" }}>
              <span style={{ fontSize: 18, opacity: item.active ? 1 : 0.22, lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: "0.5rem", color: item.active ? C.terra : C.textLight,
                fontWeight: item.active ? 700 : 500 }}>{item.label}</span>
              {item.active && <div style={{ width: 3, height: 3, borderRadius: "50%", background: C.terra }} />}
            </Link>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP LAYOUT
      ══════════════════════════════════════════ */}
      <div className="hidden md:block" style={{ background: C.cream }}>

        {/* ── 1. HERO ── */}
        <section style={{ position: "relative", overflow: "hidden", display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
          minHeight: 360, maxHeight: 440, height: "calc(100vh - 200px)",
          padding: "clamp(32px, 5.5vh, 52px) 40px 0" }}>

          {/* Bird canvas background */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <BirdCanvas />
          </div>

          {/* Subtle overlay for text legibility */}
          <div style={{ position: "absolute", inset: 0, zIndex: 1,
            background: "linear-gradient(180deg, rgba(8,12,24,0.10) 0%, rgba(8,12,24,0.04) 50%, rgba(8,12,24,0.18) 100%)" }} />

          {/* Logo + tagline */}
          <div style={{ position: "relative", zIndex: 3, display: "flex", flexDirection: "column",
            alignItems: "center", width: "100%", marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 3 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.terra }} />
              <span style={{ fontSize: "clamp(3.6rem, 9vw, 5.8rem)", fontWeight: 300, color: "#ffffff",
                letterSpacing: "2px", fontFamily: "'Josefin Sans', sans-serif" }}>Beyonder</span>
            </div>
            <p style={{ fontSize: "1rem", color: "rgba(232,244,255,0.50)", fontWeight: 300, margin: 0, textAlign: "center" }}>
              One place for everything SEND
            </p>
          </div>

          {/* Search bar — Region + Type of support (functionally identical) */}
          <div style={{ position: "relative", zIndex: 3, display: "flex", flexDirection: "column",
            alignItems: "center", width: "100%" }}>
            <form onSubmit={handleSearch} style={{ display: "flex", width: "min(580px, 92vw)", height: 52,
              background: "rgba(232,244,255,0.97)", borderRadius: 12, overflow: "visible",
              boxShadow: "0 8px 32px rgba(0,0,0,0.45)", marginBottom: 10, position: "relative", zIndex: 3 }}>

              {/* Region field */}
              <div ref={regionRef} style={{ flex: 1, display: "flex", flexDirection: "column",
                justifyContent: "center", padding: "7px 16px", borderRight: "1px solid #DDD8D0",
                position: "relative", cursor: "pointer" }}
                onClick={() => setRegionOpen((o) => !o)}>
                <span style={{ fontSize: "0.56rem", fontWeight: 600, color: C.terra,
                  textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 1 }}>Region</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input type="text" value={region}
                    onChange={(e) => { setRegion(e.target.value); setRegionOpen(true); }}
                    placeholder="Select a region"
                    onClick={(e) => { e.stopPropagation(); setRegionOpen(true); }}
                    style={{ fontSize: "0.8rem", color: C.textDark, fontWeight: 300, background: "transparent",
                      border: "none", outline: "none", fontFamily: "'Nunito Sans', sans-serif", flex: 1, minWidth: 0, cursor: "pointer" }} />
                  <svg width="10" height="10" viewBox="0 0 10 10" style={{ flexShrink: 0, opacity: 0.25, marginRight: 2 }}>
                    <path d="M2 3.5 L5 6.5 L8 3.5" stroke="#1B1A35" strokeWidth="1.5" fill="none"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {regionOpen && filteredRegions.length > 0 && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, width: "100%",
                    background: "rgba(232,244,255,0.99)", borderRadius: 10, boxShadow: "0 8px 24px rgba(27,26,53,0.18)",
                    zIndex: 9999, overflowY: "auto", overflowX: "hidden", maxHeight: "234px",
                    border: "1px solid #DDD8D0" }}>
                    {filteredRegions.map((r, i) => (
                      <div key={r} style={{ padding: "9px 16px", fontSize: "0.80rem",
                        color: r === region ? C.terra : C.textDark,
                        fontWeight: r === region ? 600 : 300, fontFamily: "'Nunito Sans', sans-serif",
                        cursor: "pointer", borderTop: i > 0 ? "1px solid #E8E3DC" : "none", background: "transparent" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(217,138,106,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        onMouseDown={(e) => { e.preventDefault(); setRegion(r); setRegionOpen(false); }}>
                        {r}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Type of support field */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column",
                justifyContent: "center", padding: "7px 16px" }}>
                <span style={{ fontSize: "0.56rem", fontWeight: 600, color: C.terra,
                  textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 1 }}>Type of support</span>
                <input type="text" value={support} onChange={(e) => setSupport(e.target.value)}
                  placeholder="e.g. OT, Speech therapy, Clubs"
                  style={{ fontSize: "0.8rem", color: C.textDark, fontWeight: 300, background: "transparent",
                    border: "none", outline: "none", fontFamily: "'Nunito Sans', sans-serif" }} />
              </div>

              {/* Submit */}
              <button type="submit" style={{ width: 110, flexShrink: 0,
                background: `linear-gradient(135deg, ${C.sienna}, ${C.terra})`,
                border: "none", color: C.warmWhite, fontSize: "0.85rem", fontWeight: 600,
                fontFamily: "'Nunito Sans', sans-serif", cursor: "pointer", borderRadius: "0 12px 12px 0" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                Find Support
              </button>
            </form>

            {/* Hint chips */}
            <div style={{ display: "flex", gap: 7, justifyContent: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.65rem", color: "rgba(232,244,255,0.25)", alignSelf: "center" }}>Try:</span>
              {hints.map((h) => (
                <button key={h.label} style={{ padding: "4px 11px", borderRadius: 14,
                  border: "1px solid rgba(217,138,106,0.32)", fontSize: "0.68rem",
                  color: "rgba(232,244,255,0.45)", background: "rgba(217,138,106,0.06)", cursor: "pointer",
                  fontFamily: "'Nunito Sans', sans-serif" }}
                  onMouseEnter={chipIn} onMouseLeave={chipOut}
                  onClick={() => navigate(h.to)}>
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Cream 3-step strip at hero base ── */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 6,
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            background: "#F6F3EE", borderTop: "1px solid rgba(27,26,53,0.08)" }}>
            {([
              {
                icon: <img src={StepLocationIcon} alt="Find local support" style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
                t: "Find local support",
                s: "Tell us your area — see what's nearby",
              },
              {
                icon: <img src={StepSupportIcon} alt="Choose your support" style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
                t: "Choose your support",
                s: "Browse by type, from therapy to clubs",
              },
              {
                icon: <img src={StepMessagingIcon} alt="Reach out directly" style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
                t: "Reach out directly",
                s: "Enquire safely through Beyonder",
              },
            ] as { icon: React.ReactNode; t: string; s: string }[]).map((step, i) => (
              <div key={step.t} style={{ display: "flex", flexDirection: "column", alignItems: "center",
                gap: 7, padding: "14px 20px 16px", textAlign: "center",
                borderRight: i < 2 ? "1px solid rgba(27,26,53,0.07)" : "none" }}>
                <div style={{ width: 64, height: 64, flexShrink: 0 }}>{step.icon}</div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: C.textDark, marginBottom: 2 }}>{step.t}</div>
                  <div style={{ fontSize: "0.63rem", color: C.textLight, fontWeight: 300, lineHeight: 1.5 }}>{step.s}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. INTRO + CATEGORIES ── */}
        <section style={{ background: C.cream, padding: "52px 60px 36px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            {/* "Everything your family needs, together" intro */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <p style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "3px",
                textTransform: "uppercase", color: C.terra, marginBottom: 10 }}>
                The Beyonder Ecosystem
              </p>
              <h2 style={{ fontSize: "1.9rem", fontWeight: 400, color: C.textDark, letterSpacing: "-0.4px",
                margin: "0 0 14px", fontFamily: "'Josefin Sans', sans-serif" }}>
                Everything your family needs, together
              </h2>
              <p style={{ fontSize: "0.92rem", color: C.textMid, maxWidth: 480, margin: "0 auto",
                lineHeight: 1.7, fontWeight: 300 }}>
                SEND isn't a single problem to solve. It's a whole life to navigate. Beyonder brings every piece
                into one trusted home — built by parents who've lived it.
              </p>
            </div>

            {/* Category cards */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: C.textDark, letterSpacing: "-0.2px", margin: 0 }}>
                Where would you like to start?
              </h3>
              <Link to="/providers" style={{ fontSize: "0.78rem", color: C.terra, fontWeight: 500,
                borderBottom: `1px solid rgba(217,138,106,0.30)`, textDecoration: "none" }}>
                View all providers →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
              {[
                { label: "Therapists & Specialists",    sub: "OTs, SaLTs, psychologists",      to: "/providers?category=therapists", icon: TherapistsIcon },
                { label: "Inclusive Clubs & Activities", sub: "Sport, arts, sensory play",      to: "/providers?category=activities", icon: ClubsIcon },
                { label: "Products & Equipment",        sub: "Sensory, adaptive, learning",    to: "/providers?category=products",   icon: NewsIcon },
                { label: "Education & Learning Support", sub: "Tutors, EHCP, SEN specialists", to: "/providers?category=education",  icon: GuidesIcon },
                { label: "Charities & Organisations",   sub: "Support groups, advocacy",       to: "/providers?category=charities",  icon: LocalIcon },
              ].map((c) => (
                <Link key={c.label} to={c.to} style={{ background: C.white, borderRadius: 14,
                  padding: "24px 16px 20px", border: `1.5px solid ${C.creamDark}`,
                  textDecoration: "none", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 10, textAlign: "center" }}
                  onMouseEnter={cardIn} onMouseLeave={(e) => cardOut(e, C.creamDark)}>
                  <div style={{ width: 50, height: 50, borderRadius: 13,
                    background: "rgba(217,138,106,0.10)", border: "1px solid rgba(217,138,106,0.20)",
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={c.icon} alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
                  </div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: C.textDark, lineHeight: 1.3 }}>{c.label}</span>
                  <span style={{ fontSize: "0.70rem", color: C.textLight, fontWeight: 300 }}>{c.sub}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. PILLARS STRIP (moved below categories) ── */}
        <section style={{ background: C.purple, borderTop: "1px solid rgba(217,138,106,0.12)",
          borderBottom: "1px solid rgba(217,138,106,0.12)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", maxWidth: 1280, margin: "0 auto" }}>
            {([
              { label: "Find Local Support",   sub: "Therapists, clubs & specialists", to: "/explore",       hi: false },
              { label: "Community",            sub: "Forums, meetups & peer support",  to: "/community",     hi: false },
              { label: "News & Research",      sub: "Legislation, guides & updates",   to: "/news",          hi: false },
              { label: "For Providers",        sub: "Create your free profile today",  to: "/for-providers", hi: true  },
            ] as const).map((p) => (
              <Link key={p.label} to={p.to} style={{ padding: "20px 28px",
                borderRight: "1px solid rgba(217,138,106,0.10)",
                background: p.hi ? "rgba(217,138,106,0.06)" : "transparent",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}
                onMouseEnter={(e) => pillarIn(e)}
                onMouseLeave={(e) => pillarOut(e, p.hi)}>
                <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: p.hi ? "rgba(217,138,106,0.18)" : "rgba(217,138,106,0.10)",
                  border: `1px solid ${p.hi ? "rgba(232,244,255,0.40)" : "rgba(217,138,106,0.20)"}` }}>
                  <span style={{ color: C.amber, fontSize: 14, fontWeight: 600 }}>→</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: p.hi ? C.amber : C.warmWhite, lineHeight: 1.3 }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(232,244,255,0.30)", fontWeight: 300, marginTop: 2 }}>
                    {p.sub}
                  </div>
                </div>
                <span style={{ color: "rgba(217,138,106,0.45)", fontSize: 14 }}>→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 4. HOW IT WORKS (full expanded version) ── */}
        <section style={{ background: C.white, padding: "72px 60px", textAlign: "center",
          borderBottom: `1px solid ${C.creamDark}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "3px",
              textTransform: "uppercase", color: C.terra, marginBottom: 10 }}>
              How it works
            </p>
            <h2 style={{ fontSize: "1.7rem", fontWeight: 400, color: C.textDark, letterSpacing: "-0.3px",
              margin: "0 0 48px", fontFamily: "'Josefin Sans', sans-serif" }}>
              Three steps to finding your support
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0,
              maxWidth: 860, margin: "0 auto", position: "relative" }}>
              {/* Connector line */}
              <div style={{ position: "absolute", top: 33, left: "18%", right: "18%",
                height: 1, background: "rgba(27,26,53,0.10)", zIndex: 0 }} />

              {[
                {
                  n: "1",
                  title: "Tell us where you are",
                  body: "Enter your postcode or town. We'll show you what's available in your area — therapists, clubs, charities and educational providers within reach.",
                },
                {
                  n: "2",
                  title: "Choose your support",
                  body: "Browse by need type, age, specialism or condition. Every listing is real and built to give you the detail you actually need to make a decision.",
                },
                {
                  n: "3",
                  title: "Connect directly",
                  body: "Enquire through Beyonder and speak directly to providers — no referral maze, no waiting list guesswork. Just a clear path to the people who can help.",
                },
              ].map((step) => (
                <div key={step.n} style={{ display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "0 32px", position: "relative", zIndex: 1 }}>
                  <div style={{ width: 66, height: 66, borderRadius: "50%",
                    border: `1px solid rgba(27,26,53,0.15)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 24, background: C.cream, flexShrink: 0 }}>
                    <span style={{ fontSize: "1.4rem", fontWeight: 700, color: C.textDark }}>{step.n}</span>
                  </div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 600, color: C.textDark, marginBottom: 10 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 300, color: C.textMid, lineHeight: 1.7, textAlign: "center" }}>
                    {step.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. PARENT VOICE ── */}
        <section style={{ background: C.cream, padding: "52px 60px", borderTop: `1px solid rgba(27,26,53,0.08)` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid",
            gridTemplateColumns: "1fr 1fr", gap: "3.5rem", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <span style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: 2,
                textTransform: "uppercase", color: C.terra }}>Why Beyonder exists</span>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 400, color: C.textDark,
                lineHeight: 1.25, letterSpacing: "-0.3px", margin: 0,
                fontFamily: "'Josefin Sans', sans-serif" }}>
                Built because we couldn't find what we needed either.
              </h2>
              <blockquote style={{ background: C.white, borderLeft: `3px solid ${C.terra}`,
                padding: "18px 20px", borderRadius: "0 10px 10px 0",
                boxShadow: "0 2px 10px rgba(27,26,53,0.04)", margin: 0 }}>
                <p style={{ fontSize: "0.92rem", fontStyle: "italic", color: C.textDark,
                  lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                  "I spent nearly a year searching for the right OT for my son. Information was scattered across
                  Facebook groups, outdated PDFs and word of mouth. I kept thinking — there has to be a better way."
                </p>
                <cite style={{ display: "block", marginTop: 10, fontSize: "0.70rem",
                  color: C.textLight, fontStyle: "normal", fontWeight: 500 }}>
                  — Co-founder, parent of an 8-year-old with SEND
                </cite>
              </blockquote>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
              {[
                { num: "85%",   label: "of SEND parents say a platform like this is vital", src: "Beyonder survey · 50 parents" },
                { num: "80%",   label: "rely on word of mouth to find SEND services",        src: "Beyonder survey · 50 parents" },
                { num: "1 in 5", label: "children in the UK have special educational needs", src: "Dept for Education · 2023" },
                { num: "Free",  label: "to join for all families. Discovery should never cost.", src: "Always" },
              ].map((s) => (
                <div key={s.num} style={{ background: C.white, borderRadius: 12, padding: "18px 16px",
                  border: `1px solid ${C.creamDark}`, display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: "1.9rem", fontWeight: 700, color: C.terra, lineHeight: 1 }}>{s.num}</span>
                  <span style={{ fontSize: "0.73rem", color: C.textMid, lineHeight: 1.5 }}>{s.label}</span>
                  <span style={{ fontSize: "0.60rem", color: C.textLight, marginTop: 2 }}>{s.src}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. PROVIDER BAND ── */}
        <section style={{ background: C.deep, padding: "36px 60px",
          borderTop: "1px solid rgba(43,76,126,0.30)", borderBottom: "1px solid rgba(43,76,126,0.30)",
          position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 60% 100% at 100% 50%, rgba(217,138,106,0.07) 0%, transparent 65%)" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid",
            gridTemplateColumns: "1fr 1fr", gap: "3.5rem", alignItems: "center", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: C.amber }}>For Providers</span>
                <div style={{ width: 32, height: 1.5, background: "rgba(232,244,255,0.25)" }} />
                <span style={{ fontSize: "0.75rem", color: "rgba(232,244,255,0.30)", fontWeight: 300 }}>
                  Therapists, clubs, specialists &amp; organisations
                </span>
              </div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 400, color: C.warmWhite,
                lineHeight: 1.25, letterSpacing: "-0.3px", margin: 0,
                fontFamily: "'Josefin Sans', sans-serif" }}>
                Reach the families already searching for you.
              </h2>
              <p style={{ fontSize: "0.80rem", color: "rgba(232,244,255,0.40)", fontWeight: 300,
                lineHeight: 1.7, maxWidth: 380, margin: 0 }}>
                Beyonder connects SEND families with local support at the moment they need it most. Your profile goes
                live immediately — no approval wait, no upfront cost.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  "Free to list — live the moment you create it",
                  "Enquiries come through Beyonder — no cold calls",
                  "Full control of your profile and availability",
                ].map((pt) => (
                  <div key={pt} style={{ display: "flex", alignItems: "center", gap: 9,
                    fontSize: "0.76rem", color: "rgba(232,244,255,0.50)", fontWeight: 300 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                      background: "rgba(217,138,106,0.20)", border: "1px solid rgba(217,138,106,0.35)",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: C.amber, fontSize: 9, fontWeight: 700 }}>✓</span>
                    </div>
                    {pt}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 4 }}>
                <Link to="/for-providers" style={{ display: "inline-block", padding: "11px 24px", borderRadius: 8,
                  background: `linear-gradient(135deg, ${C.sienna}, ${C.terra})`,
                  boxShadow: "0 4px 16px rgba(217,138,106,0.28)", color: C.warmWhite,
                  fontSize: "0.84rem", fontWeight: 600, textDecoration: "none" }}
                  onMouseEnter={terraIn} onMouseLeave={(e) => terraOut(e)}>
                  Create your free profile
                </Link>
                <Link to="/for-providers" style={{ fontSize: "0.76rem", padding: "10px 16px", borderRadius: 8,
                  textDecoration: "none", background: "transparent",
                  border: "1px solid rgba(232,244,255,0.18)", color: "rgba(232,244,255,0.50)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background   = "rgba(217,138,106,0.12)";
                    e.currentTarget.style.borderColor  = "rgba(232,244,255,0.55)";
                    e.currentTarget.style.color        = C.warmWhite;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background   = "transparent";
                    e.currentTarget.style.borderColor  = "rgba(232,244,255,0.18)";
                    e.currentTarget.style.color        = "rgba(232,244,255,0.50)";
                  }}>
                  See how it works →
                </Link>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { num: "2,400+", label: "Families actively searching" },
                  { num: "38",     label: "Counties with active searches" },
                  { num: "Free",   label: "To list. Upgrade only if you want more." },
                  { num: "Live",   label: "Profile goes live instantly on sign-up" },
                ].map((s) => (
                  <div key={s.num} style={{ background: "rgba(232,244,255,0.03)",
                    border: "1px solid rgba(217,138,106,0.10)", borderRadius: 10,
                    padding: "12px 14px", display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: "1.4rem", fontWeight: 700, color: C.amber, lineHeight: 1 }}>{s.num}</span>
                    <span style={{ fontSize: "0.66rem", color: "rgba(232,244,255,0.28)", fontWeight: 300, lineHeight: 1.4 }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <blockquote style={{ background: "rgba(217,138,106,0.07)", border: "1px solid rgba(217,138,106,0.14)",
                borderRadius: 8, padding: "12px 14px", margin: 0 }}>
                <p style={{ fontSize: "0.74rem", fontStyle: "italic", color: "rgba(232,244,255,0.38)",
                  lineHeight: 1.6, fontWeight: 300, margin: 0 }}>
                  "Within two weeks I had three enquiries from families I'd never have reached otherwise."
                </p>
                <cite style={{ display: "block", marginTop: 5, fontSize: "0.62rem",
                  color: "rgba(232,244,255,0.20)", fontStyle: "normal" }}>
                  — Paediatric OT, Hampshire · Founding Provider
                </cite>
              </blockquote>
            </div>
          </div>
        </section>

        {/* ── 7. COMMUNITY ── */}
        <section style={{ background: C.cream, padding: "52px 60px", borderTop: `1px solid rgba(27,26,53,0.08)` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: 2,
                textTransform: "uppercase", color: C.terra, display: "block", marginBottom: 8 }}>
                Community
              </span>
              <h2 style={{ fontSize: "1.55rem", fontWeight: 400, color: C.textDark,
                letterSpacing: "-0.3px", margin: "0 0 6px",
                fontFamily: "'Josefin Sans', sans-serif" }}>
                A place where people really get it.
              </h2>
              <p style={{ fontSize: "0.85rem", color: C.textMid, fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                Real conversations, local meetups and shared experiences — all in one place, just for SEND families.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
              {/* Upcoming */}
              <div>
                <span style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: 2,
                  textTransform: "uppercase", color: C.terra, display: "block", marginBottom: 10 }}>
                  Upcoming near you
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { day: "14", mon: "Apr", title: "SEND Parents Coffee Morning — Southampton",
                      meta: "St James Community Centre · 10am · Free to attend", chip: "Meetup" },
                    { day: "21", mon: "Apr", title: "Understanding Your Child's EHCP — Online Session",
                      meta: "Via Zoom · 7pm · Free for members", chip: "Workshop" },
                  ].map((m) => (
                    <Link key={m.day} to="/community" style={{ background: C.white, borderRadius: 14,
                      padding: "16px 18px", border: `1.5px solid ${C.creamDark}`, textDecoration: "none",
                      display: "flex", gap: 14, alignItems: "flex-start" }}
                      onMouseEnter={commIn} onMouseLeave={commOut}>
                      <div style={{ width: 46, height: 50, flexShrink: 0, borderRadius: 10,
                        background: C.terra, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        boxShadow: "0 3px 10px rgba(217,138,106,0.20)" }}>
                        <span style={{ fontSize: "1.25rem", fontWeight: 700, color: C.warmWhite, lineHeight: 1 }}>{m.day}</span>
                        <span style={{ fontSize: "0.52rem", color: "rgba(232,244,255,0.75)",
                          textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 1 }}>{m.mon}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.86rem", fontWeight: 600, color: C.textDark,
                          lineHeight: 1.3, marginBottom: 3 }}>{m.title}</div>
                        <div style={{ fontSize: "0.70rem", color: C.textMid, fontWeight: 300, lineHeight: 1.5 }}>{m.meta}</div>
                        <span style={{ display: "inline-block", marginTop: 5, padding: "2px 9px", borderRadius: 20,
                          background: "rgba(217,138,106,0.08)", border: "1px solid rgba(217,138,106,0.18)",
                          fontSize: "0.60rem", color: C.terra, fontWeight: 500 }}>{m.chip}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Forum threads */}
              <div>
                <span style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: 2,
                  textTransform: "uppercase", color: C.terra, display: "block", marginBottom: 10 }}>
                  People are talking
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { initials: "SL", name: "Sarah L", topic: "General Support · 2hrs ago", replies: 12,
                      avatarBg: `linear-gradient(135deg,${C.sienna},${C.terra})`,
                      text: '"Does anyone know of sensory-friendly swimming lessons near Southampton? My son loves water but busy pools are really overwhelming for him."' },
                    { initials: "MK", name: "Mark K", topic: "Education · Yesterday", replies: 28,
                      avatarBg: `linear-gradient(135deg,${C.rose},${C.purple})`,
                      text: "\"We have our EHCP annual review next month and I want to make sure I'm asking for the right things. Any advice from parents who've been through it?\"" },
                  ].map((t) => (
                    <Link key={t.initials} to="/community" style={{ background: C.white, borderRadius: 14,
                      padding: "16px 18px", border: `1.5px solid ${C.creamDark}`, textDecoration: "none", display: "block" }}
                      onMouseEnter={commIn} onMouseLeave={commOut}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                          background: t.avatarBg, display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.66rem", fontWeight: 700, color: C.warmWhite }}>{t.initials}</div>
                        <div>
                          <div style={{ fontSize: "0.74rem", fontWeight: 600, color: C.textDark, lineHeight: 1.2 }}>{t.name}</div>
                          <div style={{ fontSize: "0.63rem", color: C.sienna }}>{t.topic}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.83rem", color: C.textDark, lineHeight: 1.55, margin: 0 }}>{t.text}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                        marginTop: 9, paddingTop: 9, borderTop: `1px solid ${C.creamDark}` }}>
                        <span style={{ fontSize: "0.62rem", color: C.textLight }}>{t.replies} replies</span>
                        <span style={{ fontSize: "0.65rem", color: C.terra, fontWeight: 500 }}>Join the conversation →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
              <Link to="/community" style={{ padding: "11px 28px", borderRadius: 8,
                background: `linear-gradient(135deg, ${C.sienna}, ${C.terra})`,
                color: C.warmWhite, fontSize: "0.84rem", fontWeight: 600, textDecoration: "none",
                boxShadow: "0 4px 16px rgba(217,138,106,0.28)" }}
                onMouseEnter={terraIn} onMouseLeave={(e) => terraOut(e)}>
                Join the Community
              </Link>
              <Link to="/community" style={{ padding: "10px 20px", borderRadius: 8, background: "transparent",
                border: `1.5px solid rgba(217,138,106,0.30)`, color: C.terra, fontSize: "0.82rem", textDecoration: "none" }}
                onMouseEnter={(e) => ghostIn(e)} onMouseLeave={(e) => ghostOut(e)}>
                Browse all forums
              </Link>
              <span style={{ fontSize: "0.74rem", color: C.textMid, fontStyle: "italic", fontWeight: 300 }}>
                Free to join · Moderated · Safe space
              </span>
            </div>
          </div>
        </section>

        {/* ── 8. NEWS ── */}
        <section style={{ background: C.white, padding: "40px 60px", borderTop: `1px solid ${C.creamDark}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: 400, color: C.textDark, letterSpacing: "-0.3px", margin: 0,
                fontFamily: "'Josefin Sans', sans-serif" }}>
                Stay ahead of what matters.
              </h2>
              <Link to="/news" style={{ fontSize: "0.78rem", color: C.terra, fontWeight: 500,
                borderBottom: `1px solid rgba(217,138,106,0.30)`, textDecoration: "none" }}>
                All news →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 14 }}>
              {[
                { featured: true,  chip: "Research",
                  bg: "linear-gradient(135deg,#111827,#1A2848)",
                  title: "Early SaLT intervention reduces communication difficulties by up to 60% at age 7",
                  excerpt: "A landmark UK study tracking 2,400 children over five years confirms what many SEND parents have long argued for.",
                  date: "3 April 2026 · Research" },
                { featured: false, chip: "Legislation",
                  bg: "linear-gradient(135deg,#1E1B3A,#162040)",
                  title: "SEND Code of Practice 2026: what changes for families",
                  excerpt: "Key updates to EHCP timelines and local authority obligations.",
                  date: "28 March 2026 · Legislation" },
                { featured: false, chip: "Therapy",
                  bg: "linear-gradient(135deg,#1A2848,#2B3A5A)",
                  title: "Sensory integration therapy: the evidence and what parents should know",
                  excerpt: "A balanced look at research on sensory approaches for autism.",
                  date: "22 March 2026 · Therapy" },
              ].map((n) => (
                <Link key={n.title} to="/news" style={{ background: C.white, borderRadius: 11, overflow: "hidden",
                  border: `1.5px solid ${C.creamDark}`, textDecoration: "none",
                  display: "flex", flexDirection: "column" }}
                  onMouseEnter={newsIn} onMouseLeave={newsOut}>
                  <div style={{ height: n.featured ? 120 : 90, background: n.bg,
                    display: "flex", alignItems: "flex-end", padding: 10 }}>
                    <span style={{ background: "rgba(217,138,106,0.80)", color: C.warmWhite,
                      fontSize: "0.56rem", fontWeight: 600, padding: "2px 7px", borderRadius: 3,
                      letterSpacing: "0.5px", textTransform: "uppercase" }}>{n.chip}</span>
                  </div>
                  <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                    <h3 style={{ fontSize: n.featured ? "0.98rem" : "0.85rem", fontWeight: 600,
                      color: C.textDark, lineHeight: 1.4, margin: 0 }}>{n.title}</h3>
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
