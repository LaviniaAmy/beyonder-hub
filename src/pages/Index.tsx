import BirdCanvas from "@/components/BirdCanvas";
import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import LocalIcon from "@/assets/icons/Local_Icon.svg";
import GuidesIcon from "@/assets/icons/Guides_Icon.svg";
import EducationIcon from "@/assets/icons/Education_Icon.svg";
import WorkIcon from "@/assets/icons/Work_Icon.svg";
import TherapistsIcon from "@/assets/icons/Therapists_Icon.svg";
import ClubsIcon from "@/assets/icons/Clubs_Icon.svg";
import ShoppingIcon from "@/assets/icons/Shopping_Icon.svg";
import CharitiesIcon from "@/assets/icons/Charities_Icon.svg";
import NewsIcon from "@/assets/icons/News_Icon.svg";
import CommunityIcon from "@/assets/icons/Community_Icon.svg";

import ProviderFreeToListIcon from "@/assets/icons/Provider_FreeToList_Icon.svg";
import ProviderEnquiriesIcon from "@/assets/icons/Provider_Enquiries_Icon.svg";
import ProviderFullControlIcon from "@/assets/icons/Provider_FullControl_Icon.svg";

import StepLocationIcon from "@/assets/icons/Step_Location.svg";
import StepSupportIcon from "@/assets/icons/Step_Support.svg";
import StepMessagingIcon from "@/assets/icons/Step_Messaging.svg";

const C = {
  deep: "#111827",
  purple: "#1E1B3A",
  purpleMid: "#2B4C7E",
  rose: "#4E6E8E",
  terra: "#D98A6A",
  sienna: "#E8A080",
  amber: "#E8F4FF",
  cream: "#F6F3EE",
  creamDark: "#EAE6DF",
  warmWhite: "#F0F4FF",
  textDark: "#1B1A35",
  textMid: "#4B5563",
  textLight: "#7C7C8A",
  white: "#FFFFFF",
} as const;

// ── Hover helpers ────────────────────────────────────────────

const terraIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-2px)";
  e.currentTarget.style.boxShadow = "0 8px 28px rgba(217,138,106,0.52), 0 0 0 4px rgba(217,138,106,0.10)";
};
const terraOut = (e: React.MouseEvent<HTMLAnchorElement>, shadow = "0 4px 16px rgba(217,138,106,0.28)") => {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = shadow;
};

const ghostIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background = "rgba(217,138,106,0.10)";
  e.currentTarget.style.borderColor = "rgba(232,160,128,0.60)";
  e.currentTarget.style.color = C.sienna;
};
const ghostOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background = "transparent";
  e.currentTarget.style.borderColor = "rgba(217,138,106,0.30)";
  e.currentTarget.style.color = C.terra;
};

const cardIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-3px)";
  e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,26,53,0.10)";
  e.currentTarget.style.borderColor = "rgba(217,138,106,0.28)";
  const obj = e.currentTarget.querySelector("object") as HTMLObjectElement | null;
  obj?.contentDocument?.documentElement?.classList.add("hovered");
};
const cardOut = (e: React.MouseEvent<HTMLAnchorElement>, borderColor = C.creamDark) => {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = "0 2px 8px rgba(27,26,53,0.07), 0 1px 3px rgba(27,26,53,0.04)";
  e.currentTarget.style.borderColor = borderColor;
  const obj = e.currentTarget.querySelector("object") as HTMLObjectElement | null;
  obj?.contentDocument?.documentElement?.classList.remove("hovered");
};

const pillarIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background = "rgba(217,138,106,0.18)";
};
const pillarOut = (e: React.MouseEvent<HTMLAnchorElement>, hi: boolean) => {
  e.currentTarget.style.background = hi ? "rgba(217,138,106,0.14)" : "transparent";
};

const newsIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-3px)";
  e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,26,53,0.10)";
  e.currentTarget.style.borderColor = "rgba(217,138,106,0.28)";
};
const newsOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = "0 2px 8px rgba(27,26,53,0.07), 0 1px 3px rgba(27,26,53,0.04)";
  e.currentTarget.style.borderColor = C.creamDark;
};

const commIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-3px)";
  e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,26,53,0.10)";
  e.currentTarget.style.borderColor = "rgba(217,138,106,0.28)";
};
const commOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = "0 2px 8px rgba(27,26,53,0.07), 0 1px 3px rgba(27,26,53,0.04)";
  e.currentTarget.style.borderColor = C.creamDark;
};

const chipIn = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.borderColor = "rgba(217,138,106,0.80)";
  e.currentTarget.style.background = "rgba(217,138,106,0.16)";
  e.currentTarget.style.color = C.warmWhite;
  e.currentTarget.style.transform = "scale(1.04)";
};
const chipOut = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.borderColor = "rgba(217,138,106,0.32)";
  e.currentTarget.style.background = "rgba(217,138,106,0.06)";
  e.currentTarget.style.color = "rgba(232,244,255,0.45)";
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
  const [mobileRegionOpen, setMobileRegionOpen] = useState(false);
  const navigate = useNavigate();

  const regionRef = useRef<HTMLDivElement>(null);
  const mobileRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setRegionOpen(false);
      if (mobileRegionRef.current && !mobileRegionRef.current.contains(e.target as Node)) setMobileRegionOpen(false);
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
    <div style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      {/* ══════════════════════════════════════════
          MOBILE LAYOUT
      ══════════════════════════════════════════ */}
      <div className="md:hidden" style={{ background: C.cream, minHeight: "100vh", paddingBottom: 72 }}>
        {/* ── Mobile Hero ── */}
        <div
          style={{
            padding: "14px 20px 0",
            position: "relative",
            overflow: "hidden",
            minHeight: 480,
          }}
        >
          {/* Bird canvas sky background */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <BirdCanvas />
          </div>
          {/* Legibility overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              background:
                "linear-gradient(180deg, rgba(8,12,24,0.10) 0%, rgba(8,12,24,0.04) 50%, rgba(8,12,24,0.20) 100%)",
            }}
          />

          {/* Nav bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 56,
              position: "relative",
              zIndex: 3,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.terra }} />
              <span style={{ fontSize: "1rem", fontWeight: 700, color: C.amber, letterSpacing: "-0.3px" }}>
                Beyonder
              </span>
            </div>
            <Link
              to="/login"
              style={{
                fontSize: "0.70rem",
                fontWeight: 600,
                color: "rgba(232,244,255,0.55)",
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid rgba(232,244,255,0.12)",
                background: "rgba(232,244,255,0.05)",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </div>

          {/* Centered Beyonder logo */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: C.terra }} />
              <span
                style={{
                  fontSize: "2.6rem",
                  fontWeight: 300,
                  color: "#ffffff",
                  letterSpacing: "1.5px",
                  fontFamily: "'Josefin Sans', sans-serif",
                  lineHeight: 1,
                }}
              >
                Beyonder
              </span>
            </div>
            <div
              style={{
                marginTop: 10,
                width: "70%",
                height: 1,
                background: "linear-gradient(to right, transparent, rgba(120,200,255,0.22), transparent)",
              }}
            />
          </div>

          {/* Tagline */}
          <p
            style={{
              position: "relative",
              zIndex: 3,
              fontSize: "0.78rem",
              color: "rgba(232,244,255,0.55)",
              fontWeight: 300,
              margin: "0 0 14px",
              textAlign: "center",
            }}
          >
            One place for everything SEND
          </p>


          {/* Search bar */}
          <div style={{ position: "relative", zIndex: 2, marginBottom: 20 }}>
            <div
              style={{
                background: "rgba(232,244,255,0.07)",
                border: "1px solid rgba(232,244,255,0.11)",
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
                  color: C.warmWhite,
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontWeight: 300,
                }}
              />
              {/* Region pill */}
              <div ref={mobileRegionRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setMobileRegionOpen((o) => !o)}
                  style={{
                    fontSize: "0.6rem",
                    color: C.amber,
                    background: mobileRegionOpen ? C.deep : "rgba(217,138,106,0.16)",
                    border: `1px solid ${mobileRegionOpen ? C.amber : "rgba(217,138,106,0.25)"}`,
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Nunito Sans', sans-serif",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {region ? (
                    region
                  ) : (
                    <>
                      <MapPin size={11} color={C.terra} strokeWidth={2.5} /> Region
                    </>
                  )}
                </button>
                {mobileRegionOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: 220,
                      background: C.purple,
                      border: `1px solid ${C.rose}`,
                      borderRadius: 10,
                      boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
                      zIndex: 9999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setRegion("");
                        setMobileRegionOpen(false);
                      }}
                      style={{
                        padding: "10px 16px",
                        fontSize: "0.72rem",
                        color: "rgba(232,244,255,0.45)",
                        fontWeight: 400,
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(217,138,106,0.15)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(217,138,106,0.10)")}
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
                          color: C.amber,
                          fontWeight: r === region ? 700 : 400,
                          cursor: "pointer",
                          borderTop: i > 0 ? "1px solid rgba(217,138,106,0.10)" : "none",
                          background: r === region ? "rgba(217,138,106,0.15)" : "transparent",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(217,138,106,0.12)")}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = r === region ? "rgba(217,138,106,0.15)" : "transparent")
                        }
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Search go */}
              <button
                onClick={handleMobileSearch}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${C.sienna}, ${C.terra})`,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.warmWhite,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                →
              </button>
            </div>
          </div>

          {/* Category shortcuts */}
          <div
            style={{ borderTop: "1px solid rgba(232,244,255,0.06)", paddingTop: 10, position: "relative", zIndex: 2 }}
          >
            <div
              style={{
                fontSize: "0.5rem",
                color: "rgba(232,244,255,0.22)",
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
              <span style={{ flex: 1, height: 1, background: "rgba(232,244,255,0.07)", display: "block" }} />
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
                    color: "rgba(232,244,255,0.38)",
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
              borderBottom: "1px solid rgba(27,26,53,0.07)",
            }}
          >
            Beyonder is <strong style={{ color: C.textDark, fontWeight: 600 }}>free for every family</strong> — a single
            place to find support, connect with others who understand, and stay informed about everything SEND.
          </p>

          {/* Category Cards — 2 per row */}
          <div style={{ marginBottom: 26 }}>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: C.terra,
                  marginBottom: 6,
                }}
              >
                The Beyonder Ecosystem
              </div>
              <h2
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 400,
                  color: C.textDark,
                  letterSpacing: "-0.3px",
                  margin: "0 0 8px",
                  fontFamily: "'Josefin Sans', sans-serif",
                }}
              >
                Where would you like to start?
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Therapists & Specialists", sub: "OTs, SaLTs, psychologists", to: "/providers?category=therapists", icon: TherapistsIcon },
                { label: "Inclusive Clubs", sub: "Sport, arts, sensory play", to: "/providers?category=activities", icon: ClubsIcon },
                { label: "Products & Equipment", sub: "Sensory, adaptive, learning", to: "/providers?category=products", icon: ShoppingIcon },
                { label: "Education Support", sub: "Tutors, EHCP, SEN", to: "/providers?category=education", icon: EducationIcon },
                { label: "Charities", sub: "Support groups, advocacy", to: "/providers?category=charities", icon: CharitiesIcon },
              ].map((c) => (
                <Link
                  key={c.label}
                  to={c.to}
                  style={{
                    background: C.white,
                    borderRadius: 14,
                    padding: "12px 10px 14px",
                    border: `1.5px solid ${C.creamDark}`,
                    boxShadow: "0 2px 8px rgba(27,26,53,0.07), 0 1px 3px rgba(27,26,53,0.04)",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    textAlign: "center",
                  }}
                >
                  <div style={{ width: "100%", height: 84, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <object data={c.icon} type="image/svg+xml" style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none" }} />
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, color: C.textDark, lineHeight: 1.25 }}>
                    {c.label}
                  </span>
                  <span style={{ fontSize: "0.58rem", color: C.textLight, fontWeight: 300, lineHeight: 1.3 }}>
                    {c.sub}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Pillar Cards */}

          <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 22 }}>
            {/* All Support */}
            <Link to="/providers" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: C.white,
                  borderRadius: 18,
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid rgba(217,138,106,0.12)",
                  boxShadow: "0 2px 12px rgba(217,138,106,0.08), 0 1px 3px rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "stretch",
                  minHeight: 88,
                }}
              >
                <div
                  style={{ width: 5, flexShrink: 0, background: `linear-gradient(180deg, ${C.sienna}, ${C.terra})` }}
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
                      color: C.terra,
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
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: C.terra, marginTop: 6 }}>
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
                    background: "linear-gradient(135deg, rgba(217,138,106,0.12), rgba(217,138,106,0.06))",
                    border: "1px solid rgba(217,138,106,0.15)",
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
                    background: "rgba(217,138,106,0.08)",
                    border: "1px solid rgba(217,138,106,0.15)",
                    borderRadius: 20,
                    padding: "3px 9px",
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    color: C.terra,
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
                  border: "1px solid rgba(43,76,126,0.12)",
                  boxShadow: "0 2px 12px rgba(43,76,126,0.08), 0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "stretch",
                  minHeight: 88,
                }}
              >
                <div
                  style={{ width: 5, flexShrink: 0, background: `linear-gradient(180deg, ${C.rose}, ${C.purple})` }}
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
                      color: C.rose,
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
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: C.rose, marginTop: 6 }}>
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
                    background: "linear-gradient(135deg, rgba(43,76,126,0.10), rgba(43,76,126,0.04))",
                    border: "1px solid rgba(43,76,126,0.14)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  💬
                </div>
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
                  border: "1px solid rgba(217,138,106,0.12)",
                  boxShadow: "0 2px 12px rgba(217,138,106,0.08), 0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "stretch",
                  minHeight: 88,
                }}
              >
                <div
                  style={{ width: 5, flexShrink: 0, background: `linear-gradient(180deg, ${C.amber}, ${C.sienna})` }}
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
                      color: C.sienna,
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
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: C.sienna, marginTop: 6 }}>
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
                    background: "linear-gradient(135deg, rgba(232,244,255,0.10), rgba(212,128,90,0.04))",
                    border: "1px solid rgba(212,128,90,0.14)",
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
                    background: "rgba(212,128,90,0.08)",
                    border: "1px solid rgba(212,128,90,0.16)",
                    borderRadius: 4,
                    padding: "2px 7px",
                    fontSize: "0.5rem",
                    fontWeight: 700,
                    color: C.sienna,
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
                  background: "#13244e",
                  borderRadius: 18,
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid rgba(232,244,255,0.05)",
                  boxShadow: "0 4px 20px rgba(28,20,40,0.25), 0 1px 3px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "stretch",
                  minHeight: 88,
                }}
              >
                <div
                  style={{
                    width: 5,
                    flexShrink: 0,
                    background: `linear-gradient(180deg, ${C.amber}, ${C.terra})`,
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
                      color: C.amber,
                    }}
                  >
                    For Providers
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.warmWhite, letterSpacing: "-0.2px" }}>
                    Join Beyonder
                  </div>
                  <div
                    style={{ fontSize: "0.65rem", fontWeight: 300, color: "rgba(232,244,255,0.40)", lineHeight: 1.55 }}
                  >
                    Thousands of families are searching right now. Your profile goes live the moment you create it.
                  </div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, color: C.amber, marginTop: 6 }}>
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
                    background: "rgba(217,138,106,0.15)",
                    border: "1px solid rgba(217,138,106,0.25)",
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
                    background: "linear-gradient(135deg, rgba(217,138,106,0.20), rgba(217,138,106,0.10))",
                    border: "1px solid rgba(217,138,106,0.25)",
                    borderRadius: 20,
                    padding: "3px 9px",
                    fontSize: "0.52rem",
                    fontWeight: 700,
                    color: C.amber,
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
              background: C.white,
              borderRadius: 16,
              padding: "18px 18px 16px",
              border: "1px solid rgba(27,26,53,0.06)",
              boxShadow: "0 2px 10px rgba(27,26,53,0.04)",
              marginBottom: 16,
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                lineHeight: 1,
                color: C.terra,
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
                  background: `linear-gradient(180deg, ${C.amber}, ${C.terra})`,
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.sienna}, ${C.terra})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  color: C.warmWhite,
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
              background: C.white,
              borderRadius: 16,
              border: "1px solid rgba(27,26,53,0.06)",
              boxShadow: "0 2px 10px rgba(27,26,53,0.04)",
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
                  borderRight: i < 2 ? "1px solid rgba(27,26,53,0.06)" : "none",
                }}
              >
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: C.terra, lineHeight: 1, marginBottom: 4 }}>
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
            background: "rgba(246,243,238,0.97)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(27,26,53,0.07)",
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
                  color: item.active ? C.terra : C.textLight,
                  fontWeight: item.active ? 700 : 500,
                }}
              >
                {item.label}
              </span>
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
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: 420,
            maxHeight: 500,
            height: "calc(100vh - 140px)",
          }}
        >
          {/* Bird canvas background */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <BirdCanvas />
          </div>

          {/* Subtle overlay for text legibility */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              background:
                "linear-gradient(180deg, rgba(8,12,24,0.10) 0%, rgba(8,12,24,0.04) 50%, rgba(8,12,24,0.18) 100%)",
            }}
          />

          {/* Logo — pinned independently from top */}
          <div
            style={{
              position: "absolute",
              top: "clamp(48px, 9vh, 80px)",
              left: 0,
              right: 0,
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.terra }} />
              <span
                style={{
                  fontSize: "clamp(3.6rem, 9vw, 5.8rem)",
                  fontWeight: 300,
                  color: "#ffffff",
                  letterSpacing: "2px",
                  fontFamily: "'Josefin Sans', sans-serif",
                  lineHeight: 1,
                }}
              >
                Beyonder
              </span>
            </div>
            <div
              style={{
                marginTop: 10,
                width: "min(480px, 80vw)",
                height: 1,
                background: "linear-gradient(to right, transparent, rgba(120,200,255,0.22), transparent)",
              }}
            />
          </div>

          {/* Tagline — pinned independently */}
          <p
            style={{
              position: "absolute",
              top: "clamp(185px, 32vh, 248px)",
              left: 0,
              right: 0,
              zIndex: 3,
              fontSize: "1rem",
              color: "rgba(232,244,255,0.50)",
              fontWeight: 300,
              margin: 0,
              textAlign: "center",
            }}
          >
            One place for everything SEND
          </p>

          {/* Search bar + chips — pinned independently */}
          <div
            style={{
              position: "absolute",
              top: "clamp(222px, 39vh, 292px)",
              left: 0,
              right: 0,
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <form
              onSubmit={handleSearch}
              style={{
                display: "flex",
                width: "min(580px, 92vw)",
                height: 52,
                background: "rgba(232,244,255,0.97)",
                borderRadius: 12,
                overflow: "visible",
                boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
                marginBottom: 10,
                position: "relative",
                zIndex: 3,
              }}
            >
              {/* Region field */}
              <div
                ref={regionRef}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "7px 16px",
                  borderRight: "1px solid #DDD8D0",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => setRegionOpen((o) => !o)}
              >
                <span
                  style={{
                    fontSize: "0.56rem",
                    fontWeight: 600,
                    color: C.terra,
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
                      fontFamily: "'Nunito Sans', sans-serif",
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
                      stroke="#1B1A35"
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
                      background: "rgba(232,244,255,0.99)",
                      borderRadius: 10,
                      boxShadow: "0 8px 24px rgba(27,26,53,0.18)",
                      zIndex: 9999,
                      overflowY: "auto",
                      overflowX: "hidden",
                      maxHeight: "234px",
                      border: "1px solid #DDD8D0",
                    }}
                  >
                    {filteredRegions.map((r, i) => (
                      <div
                        key={r}
                        style={{
                          padding: "9px 16px",
                          fontSize: "0.80rem",
                          color: r === region ? C.terra : C.textDark,
                          fontWeight: r === region ? 600 : 300,
                          fontFamily: "'Nunito Sans', sans-serif",
                          cursor: "pointer",
                          borderTop: i > 0 ? "1px solid #E8E3DC" : "none",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(217,138,106,0.06)")}
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

              {/* Type of support field */}
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
                    color: C.terra,
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
                    fontFamily: "'Nunito Sans', sans-serif",
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  width: 110,
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${C.sienna}, ${C.terra})`,
                  border: "none",
                  color: C.warmWhite,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  fontFamily: "'Nunito Sans', sans-serif",
                  cursor: "pointer",
                  borderRadius: "0 12px 12px 0",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Find Support
              </button>
            </form>

            {/* Hint chips */}
            <div style={{ display: "flex", gap: 7, justifyContent: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.65rem", color: "rgba(232,244,255,0.25)", alignSelf: "center" }}>Try:</span>
              {hints.map((h) => (
                <button
                  key={h.label}
                  style={{
                    padding: "4px 11px",
                    borderRadius: 14,
                    border: "1px solid rgba(217,138,106,0.32)",
                    fontSize: "0.68rem",
                    color: "rgba(232,244,255,0.45)",
                    background: "rgba(217,138,106,0.06)",
                    cursor: "pointer",
                    fontFamily: "'Nunito Sans', sans-serif",
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

          {/* ── Cream 3-step strip at hero base ── */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 6,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              background: "#F6F3EE",
              borderTop: "1px solid rgba(27,26,53,0.08)",
            }}
          >
            {(
              [
                {
                  icon: (
                    <img
                      src={StepLocationIcon}
                      alt="Find local support"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ),
                  t: "Find local support",
                  s: "Tell us your area — see what's nearby",
                },
                {
                  icon: (
                    <img
                      src={StepSupportIcon}
                      alt="Choose your support"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ),
                  t: "Choose your support",
                  s: "Browse by type, from therapy to clubs",
                },
                {
                  icon: (
                    <img
                      src={StepMessagingIcon}
                      alt="Reach out directly"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ),
                  t: "Reach out directly",
                  s: "Enquire safely through Beyonder",
                },
              ] as { icon: React.ReactNode; t: string; s: string }[]
            ).map((step, i) => (
              <div
                key={step.t}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 7,
                  padding: "14px 20px 16px",
                  textAlign: "center",
                  borderRight: i < 2 ? "1px solid rgba(27,26,53,0.07)" : "none",
                }}
              >
                <div style={{ width: 64, height: 64, flexShrink: 0 }}>{step.icon}</div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: C.textDark, marginBottom: 2 }}>
                    {step.t}
                  </div>
                  <div style={{ fontSize: "0.63rem", color: C.textLight, fontWeight: 300, lineHeight: 1.5 }}>
                    {step.s}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. INTRO + CATEGORIES ── */}
        <section style={{ background: C.cream, padding: "20px 60px 36px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            {/* "Everything your family needs, together" intro */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <p
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: C.terra,
                  marginBottom: 10,
                }}
              >
                The Beyonder Ecosystem
              </p>
              <h2
                style={{
                  fontSize: "1.9rem",
                  fontWeight: 400,
                  color: C.textDark,
                  letterSpacing: "-0.4px",
                  margin: "0 0 14px",
                  fontFamily: "'Josefin Sans', sans-serif",
                }}
              >
                Everything your family needs, together
              </h2>
              <p
                style={{
                  fontSize: "0.92rem",
                  color: C.textMid,
                  maxWidth: 480,
                  margin: "0 auto",
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                SEND isn't a single problem to solve. It's a whole life to navigate. Beyonder brings every piece into
                one trusted home — built by parents who've lived it.
              </p>
            </div>

            {/* Category cards */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h3
                style={{ fontSize: "1.15rem", fontWeight: 600, color: C.textDark, letterSpacing: "-0.2px", margin: 0 }}
              >
                Where would you like to start?
              </h3>
              <Link
                to="/providers"
                style={{
                  fontSize: "0.78rem",
                  color: C.terra,
                  fontWeight: 500,
                  borderBottom: `1px solid rgba(217,138,106,0.30)`,
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
                  icon: ShoppingIcon,
                },
                {
                  label: "Education & Learning Support",
                  sub: "Tutors, EHCP, SEN specialists",
                  to: "/providers?category=education",
                  icon: EducationIcon,
                },
                {
                  label: "Charities & Organisations",
                  sub: "Support groups, advocacy",
                  to: "/providers?category=charities",
                  icon: CharitiesIcon,
                },
              ].map((c) => (
                <Link
                  key={c.label}
                  to={c.to}
                  style={{
                    background: C.white,
                    borderRadius: 14,
                    padding: "12px 16px 12px",
                    border: `1.5px solid ${C.creamDark}`,
                    boxShadow: "0 2px 8px rgba(27,26,53,0.07), 0 1px 3px rgba(27,26,53,0.04)",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    textAlign: "center",
                  }}
                  onMouseEnter={cardIn}
                  onMouseLeave={(e) => cardOut(e, C.creamDark)}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 130,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <object data={c.icon} type="image/svg+xml" style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none" }} />
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

        {/* ── 3. PILLARS STRIP ── */}
        <section style={{ padding: "0 60px 36px" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            maxWidth: 1280, margin: "0 auto",
            background: "rgba(250, 244, 235, 0.68)", borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.55)",
            boxShadow: "0 4px 24px rgba(217,138,106,0.10), 0 1px 4px rgba(0,0,0,0.03)",
            backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            overflow: "hidden",
          }}>
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
                  padding: "22px 28px",
                  borderRight: "1px solid rgba(217,138,106,0.15)",
                  background: p.hi ? "rgba(217,138,106,0.08)" : "transparent",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  transition: "background 0.18s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(217,138,106,0.14)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = p.hi ? "rgba(217,138,106,0.08)" : "transparent"; }}
              >
                <div style={{ width: 12, height: 12, flexShrink: 0, borderRadius: "50%", background: C.terra,
                  boxShadow: "0 2px 6px rgba(217,138,106,0.50)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.textDark, lineHeight: 1.3 }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: C.textMid, fontWeight: 300, marginTop: 2 }}>{p.sub}</div>
                </div>
                <span style={{ color: C.terra, fontSize: 14 }}>→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 4. PARENT VOICE ── */}
        <section style={{ background: C.cream, padding: "52px 60px", borderTop: `1px solid rgba(27,26,53,0.08)` }}>
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
                  color: C.terra,
                }}
              >
                Why Beyonder exists
              </span>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: C.textDark,
                  lineHeight: 1.25,
                  letterSpacing: "-0.3px",
                  margin: 0,
                  fontFamily: "'Josefin Sans', sans-serif",
                }}
              >
                Built because we couldn't find what we needed either.
              </h2>
              <blockquote
                style={{
                  background: C.white,
                  borderLeft: `3px solid ${C.terra}`,
                  padding: "18px 20px",
                  borderRadius: "0 10px 10px 0",
                  boxShadow: "0 2px 10px rgba(27,26,53,0.04)",
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
                    border: "1.5px solid rgba(47,108,162,0.35)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: "1.9rem", fontWeight: 700, color: "#2f6ca2", lineHeight: 1 }}>{s.num}</span>
                  <span style={{ fontSize: "0.73rem", color: C.textMid, lineHeight: 1.5 }}>{s.label}</span>
                  <span style={{ fontSize: "0.60rem", color: C.textLight, marginTop: 2 }}>{s.src}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. PROVIDER ── */}
        <section style={{ background: C.cream, padding: "24px 60px 52px" }}>
          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              background: C.white,
              borderRadius: 24,
              boxShadow: "0 4px 32px rgba(26,34,54,0.08), 0 1px 4px rgba(26,34,54,0.04)",
              padding: "44px 52px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              alignItems: "start",
            }}
          >
            {/* LEFT: text + benefits + CTA */}
            <div>
              <div
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: C.terra,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <span style={{ fontSize: "1.1rem", lineHeight: 0 }}>·</span>
                For Providers
              </div>
              <h2
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: "1.9rem",
                  fontWeight: 300,
                  lineHeight: 1.2,
                  color: C.textDark,
                  letterSpacing: "-0.01em",
                  margin: "0 0 14px",
                }}
              >
                The families you can help<br />are{" "}
                <em style={{ fontStyle: "italic", color: C.terra }}>already here</em>.
              </h2>
              <p
                style={{
                  fontSize: "0.83rem",
                  lineHeight: 1.8,
                  color: C.textMid,
                  margin: "0 0 24px",
                  maxWidth: 340,
                }}
              >
                Beyonder connects SEND families with local support at the moment they need it most. Your profile goes live immediately — no approval wait, no upfront cost.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px", display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  {
                    text: "Free to list — live the moment you create it",
                    icon: ProviderFreeToListIcon,
                  },
                  {
                    text: "Enquiries direct through Beyonder, no referral fees",
                    icon: ProviderEnquiriesIcon,
                  },
                  {
                    text: "Full control of your profile and availability",
                    icon: ProviderFullControlIcon,
                  },
                ].map((b) => (
                  <li key={b.text} style={{ fontSize: "0.82rem", color: C.textMid, lineHeight: 1.6, display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={b.icon} alt="" style={{ width: 55, height: 55, flexShrink: 0 }} />
                    {b.text}
                  </li>
                ))}
              </ul>
              <Link
                to="/for-providers"
                style={{
                  display: "inline-block",
                  background: C.terra,
                  color: C.white,
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "0.82rem",
                  letterSpacing: "0.04em",
                  padding: "11px 28px",
                  borderRadius: 100,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.88";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "none";
                }}
              >
                Create your free profile
              </Link>
            </div>
            {/* RIGHT: stats + quote */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { num: "2,400", plus: true, lbl: "families searching\non Beyonder" },
                  { num: "38", plus: false, lbl: "providers live\nthis month" },
                ].map((s) => (
                  <div key={s.num} style={{ background: C.cream, borderRadius: 14, padding: "20px 18px" }}>
                    <div
                      style={{
                        fontFamily: "'Josefin Sans', sans-serif",
                        fontSize: "2.4rem",
                        fontWeight: 300,
                        color: C.textDark,
                        lineHeight: 1,
                        marginBottom: 4,
                      }}
                    >
                      {s.num}
                      {s.plus && <span style={{ fontSize: "1.3rem" }}>+</span>}
                    </div>
                    <div style={{ fontSize: "0.73rem", color: C.textLight, lineHeight: 1.5, whiteSpace: "pre-line" }}>
                      {s.lbl}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: C.cream,
                  borderRadius: 14,
                  padding: "22px 26px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <svg
                  style={{ position: "absolute", top: 14, right: 18, opacity: 0.1, width: 72, height: 72 }}
                  viewBox="0 0 80 80"
                  fill="none"
                >
                  <circle cx="28" cy="22" r="8" stroke={C.textDark} strokeWidth="1.8"/>
                  <path d="M14 48c0-9 7-14 14-14s14 5 14 14" stroke={C.textDark} strokeWidth="1.8" strokeLinecap="round"/>
                  <circle cx="54" cy="26" r="6" stroke={C.textDark} strokeWidth="1.6"/>
                  <path d="M44 48c0-7 4-11 10-11s10 4 10 11" stroke={C.textDark} strokeWidth="1.6" strokeLinecap="round"/>
                  <path d="M36 38c2-3 8-4 12-2" stroke={C.textDark} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 2"/>
                </svg>
                <blockquote
                  style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: "0.95rem",
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: C.textDark,
                    lineHeight: 1.65,
                    margin: "0 0 10px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  "Within two weeks I had enquiries from families I'd never have reached otherwise."
                </blockquote>
                <cite style={{ fontSize: "0.68rem", color: C.textLight, fontStyle: "normal", letterSpacing: "0.04em" }}>
                  Speech &amp; Language Therapist, Hampshire
                </cite>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. COMMUNITY ── */}
        <section style={{ background: C.white, padding: "56px 60px 64px", borderTop: `1px solid ${C.creamDark}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* intro */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 80,
                alignItems: "end",
                marginBottom: 40,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: C.terra,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <span style={{ fontSize: "1.1rem", lineHeight: 0 }}>·</span>
                  Community
                </div>
                <h2
                  style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: "2rem",
                    fontWeight: 300,
                    lineHeight: 1.2,
                    color: C.textDark,
                    letterSpacing: "-0.01em",
                    margin: 0,
                  }}
                >
                  A place where people<br />
                  <em style={{ fontStyle: "italic", color: C.terra }}>really</em> get it.
                </h2>
              </div>
              <p style={{ fontSize: "0.87rem", lineHeight: 1.8, color: C.textMid, margin: 0 }}>
                Real conversations, local meetups and shared experiences — all in one place, just for SEND families.
              </p>
            </div>
            {/* body: events col + threads col */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1.9fr",
                gap: 24,
                alignItems: "start",
                marginBottom: 36,
              }}
            >
              {/* events col */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span
                  style={{
                    fontSize: "0.58rem",
                    fontWeight: 500,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: C.textLight,
                    marginBottom: 2,
                  }}
                >
                  Near you
                </span>
                {[
                  { day: "14", mon: "Jun", title: "SEND Parents Coffee Morning — Southampton", sub: "Sea Saints Community Coffee · Free" },
                  { day: "23", mon: "Jun", title: "Understanding Your Child's EHCP — Online", sub: "Free · Hosted by SEN Advisor" },
                ].map((ev) => (
                  <Link
                    key={ev.day + ev.mon}
                    to="/community"
                    style={{
                      background: C.cream,
                      borderRadius: 14,
                      padding: "16px 18px",
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
                  >
                    <div
                      style={{
                        width: 40,
                        minWidth: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "rgba(212,133,106,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "1.1rem", color: C.terra, lineHeight: 1 }}>
                        {ev.day}
                      </span>
                      <span style={{ fontSize: "0.50rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.terra, opacity: 0.8 }}>
                        {ev.mon}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 500, color: C.textDark, lineHeight: 1.4, marginBottom: 3 }}>
                        {ev.title}
                      </div>
                      <span style={{ fontSize: "0.68rem", color: C.textLight }}>{ev.sub}</span>
                    </div>
                  </Link>
                ))}
                {/* community scene illustration */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: 6, opacity: 0.72 }}>
                  <img src={CommunityIcon} alt="" style={{ display: "block", width: "100%", maxWidth: 280, height: "auto" }} />
                </div>
              </div>
              {/* threads col */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "0.58rem",
                    fontWeight: 500,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: C.textLight,
                    marginBottom: 12,
                  }}
                >
                  People are talking
                </span>
                {[
                  { quote: '"Does anyone know of sensory-friendly swimming lessons near Southampton? Busy pools are really overwhelming for her."', meta: "Sarah L.", replies: "12 replies", time: "1 hr ago", tag: "Therapy" },
                  { quote: '"EHCP annual review next month — any advice from parents who\'ve been through it on what to ask for?"', meta: "Mark H.", replies: "8 replies", time: "2 hrs ago", tag: "EHCP" },
                  { quote: '"Has anyone found a good swimming club for a child with hypermobility in the Winchester area?"', meta: "Priya M.", replies: "5 replies", time: "4 hrs ago", tag: "Activities" },
                ].map((t, i) => (
                  <Link
                    key={i}
                    to="/community"
                    style={{
                      paddingTop: i === 0 ? 0 : 16,
                      paddingBottom: 16,
                      borderBottom: i < 2 ? `1px solid ${C.creamDark}` : "none",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 16,
                      alignItems: "start",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  >
                    <div>
                      <blockquote
                        style={{
                          fontFamily: "'Josefin Sans', sans-serif",
                          fontSize: "0.95rem",
                          fontStyle: "italic",
                          fontWeight: 300,
                          color: C.textDark,
                          lineHeight: 1.5,
                          margin: "0 0 7px",
                        }}
                      >
                        {t.quote}
                      </blockquote>
                      <div style={{ fontSize: "0.68rem", color: C.textLight, display: "flex", alignItems: "center", gap: 7 }}>
                        {t.meta}
                        <span style={{ width: 3, height: 3, borderRadius: "50%", background: C.textLight, display: "inline-block" }} />
                        {t.replies}
                        <span style={{ width: 3, height: 3, borderRadius: "50%", background: C.textLight, display: "inline-block" }} />
                        {t.time}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "0.60rem",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        background: C.cream,
                        color: C.terra,
                        padding: "3px 9px",
                        borderRadius: 100,
                        whiteSpace: "nowrap",
                        alignSelf: "start",
                        marginTop: 2,
                      }}
                    >
                      {t.tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            {/* footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: "0.87rem", color: C.textMid, margin: 0 }}>
                Join 2,400+ SEND families already sharing, supporting and connecting.
              </p>
              <Link
                to="/community"
                style={{
                  display: "inline-block",
                  background: C.terra,
                  color: C.white,
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "0.82rem",
                  letterSpacing: "0.04em",
                  padding: "11px 28px",
                  borderRadius: 100,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.88";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "none";
                }}
              >
                Join the community
              </Link>
            </div>
          </div>
        </section>

        {/* ── 8. NEWS ── */}
        <section style={{ background: C.cream, padding: "56px 60px 64px", borderTop: `1px solid ${C.creamDark}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 32,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: C.terra,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <span style={{ fontSize: "1.1rem", lineHeight: 0 }}>·</span>
                  News &amp; Research
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
                  <h2
                    style={{
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: "2rem",
                      fontWeight: 300,
                      color: C.textDark,
                      lineHeight: 1.2,
                      letterSpacing: "-0.01em",
                      margin: 0,
                    }}
                  >
                    Stay ahead of<br />what matters.
                  </h2>
                  <svg
                    style={{ marginBottom: 4, flexShrink: 0, opacity: 0.78 }}
                    width="56"
                    height="50"
                    viewBox="0 0 72 64"
                    fill="none"
                  >
                    <circle cx="36" cy="12" r="7" stroke={C.textDark} strokeWidth="1.4"/>
                    <path d="M36 19L36 36" stroke={C.textDark} strokeWidth="1.4" strokeLinecap="round"/>
                    <path d="M36 36Q30 40 26 48" stroke={C.textDark} strokeWidth="1.3" strokeLinecap="round"/>
                    <path d="M36 36Q42 40 46 48" stroke={C.textDark} strokeWidth="1.3" strokeLinecap="round"/>
                    <path d="M24 48Q36 44 48 48" stroke={C.textDark} strokeWidth="1.2" strokeLinecap="round"/>
                    <path d="M36 25Q28 27 24 32" stroke={C.textDark} strokeWidth="1.3" strokeLinecap="round"/>
                    <path d="M36 25Q44 27 48 32" stroke={C.textDark} strokeWidth="1.3" strokeLinecap="round"/>
                    <path d="M24 32Q36 29 48 32L48 42Q36 39 24 42Z" stroke={C.textDark} strokeWidth="1.2" strokeLinejoin="round"/>
                    <path d="M36 30L36 42" stroke={C.textDark} strokeWidth="1" strokeLinecap="round"/>
                    <path d="M28 34L34 33M28 37L34 36" stroke={C.textDark} strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
                    <path d="M38 33L44 34M38 36L44 37" stroke={C.textDark} strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
                    <path d="M16 54Q36 51 56 54" stroke={C.textDark} strokeWidth="1.1" strokeLinecap="round" opacity="0.4"/>
                  </svg>
                </div>
              </div>
              <div style={{ textAlign: "right", paddingBottom: 4 }}>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: C.textMid,
                    lineHeight: 1.7,
                    maxWidth: 240,
                    margin: "0 0 8px",
                  }}
                >
                  Legislation, research and stories that matter — curated for SEND families.
                </p>
                <Link
                  to="/news"
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: C.terra,
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  View all articles →
                </Link>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr 1fr", gap: 14 }}>
              {[
                {
                  tag: "Research",
                  bg: "linear-gradient(160deg, #233a52 0%, #1a3050 55%, #2a4560 100%)",
                  aspectRatio: "3/2",
                  title: "Early SaLT intervention reduces communication difficulties by up to 60% at age 7",
                  excerpt: "A landmark study tracking 1,800 children over five years confirms what many SEND parents have long argued for.",
                  date: "2 June 2026",
                  featured: true,
                },
                {
                  tag: "Legislation",
                  bg: "linear-gradient(160deg, #3a2a22 0%, #52362a 60%, #3d2618 100%)",
                  aspectRatio: "16/9",
                  title: "SEND Code of Practice 2026: what changes for families",
                  excerpt: "New statutory duties for local authorities around EHCP timelines.",
                  date: "24 March 2026",
                  featured: false,
                },
                {
                  tag: "Therapy",
                  bg: "linear-gradient(160deg, #1e301e 0%, #2a4430 60%, #1c2e1c 100%)",
                  aspectRatio: "16/9",
                  title: "Sensory integration therapy: the evidence and what parents should know",
                  excerpt: "A balanced look at research on sensory integration approaches for autism.",
                  date: "12 March 2026",
                  featured: false,
                },
              ].map((n) => (
                <Link
                  key={n.title}
                  to="/news"
                  style={{
                    background: C.white,
                    borderRadius: 18,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    textDecoration: "none",
                    border: `1.5px solid ${C.creamDark}`,
                    boxShadow: "0 2px 8px rgba(27,26,53,0.07), 0 1px 3px rgba(27,26,53,0.04)",
                  }}
                  onMouseEnter={newsIn}
                  onMouseLeave={newsOut}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: n.aspectRatio,
                      background: n.bg,
                      position: "relative",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        bottom: 12,
                        left: 14,
                        fontSize: "0.55rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      Photography
                    </span>
                  </div>
                  <div style={{ padding: "18px 20px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        fontSize: "0.60rem",
                        fontWeight: 500,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: C.terra,
                        marginBottom: 8,
                        display: "block",
                      }}
                    >
                      {n.tag}
                    </span>
                    <h3
                      style={{
                        fontFamily: "'Josefin Sans', sans-serif",
                        fontWeight: 400,
                        color: C.textDark,
                        lineHeight: 1.4,
                        flex: 1,
                        fontSize: n.featured ? "1.1rem" : "0.92rem",
                        margin: "0 0 10px",
                      }}
                    >
                      {n.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: C.textMid,
                        lineHeight: 1.7,
                        margin: "0 0 14px",
                      }}
                    >
                      {n.excerpt}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "auto",
                        paddingTop: 12,
                        borderTop: `1px solid ${C.creamDark}`,
                      }}
                    >
                      <span style={{ fontSize: "0.68rem", color: C.textLight }}>{n.date}</span>
                      <span style={{ fontSize: "1rem", color: C.terra, opacity: 0.6 }}>→</span>
                    </div>
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
