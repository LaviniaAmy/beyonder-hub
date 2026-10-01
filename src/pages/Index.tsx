import BirdCanvas from "@/components/BirdCanvas";
import BeyonderApp from "@/components/beyonder-app/BeyonderApp";
import AboutSheet from "@/components/beyonder-app/AboutSheet";
import { useIsMobileLayout } from "@/hooks/useIsMobileLayout";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FamilyPortrait from "@/assets/family-portrait.svg";

import TherapistsIcon from "@/assets/icons/Therapists_Icon.svg";
import ClubsIcon from "@/assets/icons/Clubs_Icon.svg";
import ShoppingIcon from "@/assets/icons/Shopping_Icon.svg";
import EducationIcon from "@/assets/icons/Education_Icon.svg";
import CharitiesIcon from "@/assets/icons/Charities_Icon.svg";
import CommunityIcon from "@/assets/icons/Community_Icon.svg";
import NewsSLTPhoto from "@/assets/news/news-slt-intervention.png";
import NewsSENDPhoto from "@/assets/news/news-send-code-practice.png";
import NewsSensoryPhoto from "@/assets/news/news-sensory-integration.png";

import ProviderFreeToListIcon from "@/assets/icons/Provider_FreeToList_Icon.svg";
import ProviderEnquiriesIcon from "@/assets/icons/Provider_Enquiries_Icon.svg";
import ProviderFullControlIcon from "@/assets/icons/Provider_FullControl_Icon.svg";

import StepLocationIcon from "@/assets/icons/Step_Location.svg";
import StepSupportIcon from "@/assets/icons/Step_Support.svg";
import StepMessagingIcon from "@/assets/icons/Step_Messaging.svg";

// ── Colour palette ────────────────────────────────────────────────────────────
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

// ── Hover helpers ─────────────────────────────────────────────────────────────
const terraIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-2px)";
  e.currentTarget.style.boxShadow = "0 8px 28px rgba(217,138,106,0.52), 0 0 0 4px rgba(217,138,106,0.10)";
};
const terraOut = (e: React.MouseEvent<HTMLAnchorElement>, shadow = "0 4px 16px rgba(217,138,106,0.28)") => {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = shadow;
};

const cardIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-3px)";
  e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,26,53,0.10)";
  e.currentTarget.style.borderColor = "rgba(217,138,106,0.28)";
};
const cardOut = (e: React.MouseEvent<HTMLAnchorElement>, borderColor = C.creamDark) => {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = "0 2px 8px rgba(27,26,53,0.07), 0 1px 3px rgba(27,26,53,0.04)";
  e.currentTarget.style.borderColor = borderColor;
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


// ═════════════════════════════════════════════════════════════════════════════
// CONTENT DATA — defined once, shared by mobile and desktop layouts
// To update content (news articles, categories, events, etc.) edit here only.
// ═════════════════════════════════════════════════════════════════════════════

const STEPS = [
  { icon: StepLocationIcon, t: "Find local support",    s: "Tell us your area — see what's nearby" },
  { icon: StepSupportIcon,  t: "Choose your support",   s: "Browse by type, from therapy to clubs" },
  { icon: StepMessagingIcon,t: "Reach out directly",    s: "Enquire safely through Beyonder" },
];

const CATEGORIES = [
  { label: "Therapists & Specialists",        sub: "OTs, SaLTs, psychologists",        to: "/providers?category=therapists", icon: TherapistsIcon },
  { label: "Inclusive Clubs & Activities",    sub: "Sport, arts, sensory play",         to: "/providers?category=activities", icon: ClubsIcon },
  { label: "Products & Equipment",            sub: "Sensory, adaptive, learning",       to: "/providers?category=products",   icon: ShoppingIcon },
  { label: "Education & Learning Support",    sub: "Tutors, EHCP, SEN specialists",     to: "/providers?category=education",  icon: EducationIcon },
  { label: "Charities & Organisations",       sub: "Support groups, advocacy",          to: "/providers?category=charities",  icon: CharitiesIcon },
];

const PILLARS = [
  { label: "Find Local Support", sub: "Therapists, clubs & specialists",  to: "/explore",       hi: false },
  { label: "Community",          sub: "Forums, meetups & peer support",   to: "/community",     hi: false },
  { label: "News & Research",    sub: "Legislation, guides & updates",    to: "/news",          hi: false },
  { label: "For Providers",      sub: "Create your free profile today",   to: "/for-providers", hi: true  },
] as const;

const STATS = [
  { num: "85%",    label: "of SEND parents say a platform like this is vital", src: "Beyonder survey · 50 parents"    },
  { num: "80%",    label: "rely on word of mouth to find SEND services",        src: "Beyonder survey · 50 parents"    },
  { num: "1 in 5", label: "children in the UK have special educational needs",  src: "Dept for Education · 2023"       },
  { num: "Free",   label: "to join for all families. Discovery should never cost.", src: "Always"                      },
];

const PROVIDER_PERKS = [
  { text: "Free to list — live the moment you create it",          icon: ProviderFreeToListIcon  },
  { text: "Enquiries direct through Beyonder, no referral fees",   icon: ProviderEnquiriesIcon   },
  { text: "Full control of your profile and availability",         icon: ProviderFullControlIcon  },
];

const EVENTS = [
  { day: "14", mon: "Jun", title: "SEND Parents Coffee Morning — Southampton", sub: "Sea Saints Community Coffee · Free"  },
  { day: "23", mon: "Jun", title: "Understanding Your Child's EHCP — Online",  sub: "Free · Hosted by SEN Advisor"         },
];

const THREADS = [
  { quote: '"Does anyone know of sensory-friendly swimming lessons near Southampton? Busy pools are really overwhelming for her."', meta: "Sarah L.",  replies: "12 replies", time: "1 hr ago",  tag: "Therapy"    },
  { quote: '"EHCP annual review next month — any advice from parents who\'ve been through it on what to ask for?"',                 meta: "Mark H.",   replies: "8 replies",  time: "2 hrs ago", tag: "EHCP"       },
  { quote: '"Has anyone found a good swimming club for a child with hypermobility in the Winchester area?"',                        meta: "Priya M.",  replies: "5 replies",  time: "4 hrs ago", tag: "Activities"  },
];

const NEWS = [
  {
    tag: "Research",      featured: true,
    bg: "linear-gradient(160deg, #233a52 0%, #1a3050 55%, #2a4560 100%)",
    title: "Early SaLT intervention reduces communication difficulties by up to 60% at age 7",
    excerpt: "A landmark study tracking 1,800 children over five years confirms what many SEND parents have long argued for.",
    date: "2 June 2026",   img: NewsSLTPhoto,
  },
  {
    tag: "Legislation",   featured: false,
    bg: "linear-gradient(160deg, #3a2a22 0%, #52362a 60%, #3d2618 100%)",
    title: "SEND Code of Practice 2026: what changes for families",
    excerpt: "New statutory duties for local authorities around EHCP timelines.",
    date: "24 March 2026", img: NewsSENDPhoto,
  },
  {
    tag: "Therapy",       featured: false,
    bg: "linear-gradient(160deg, #1e301e 0%, #2a4430 60%, #1c2e1c 100%)",
    title: "Sensory integration therapy: the evidence and what parents should know",
    excerpt: "A balanced look at research on sensory integration approaches for autism.",
    date: "12 March 2026", img: NewsSensoryPhoto,
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// Component
// ═════════════════════════════════════════════════════════════════════════════
const Index = () => {
  const isMobile = useIsMobileLayout();
  const [aboutOpen, setAboutOpen] = useState(false);
  const navigate = useNavigate();
  const closeAbout = useCallback(() => setAboutOpen(false), []);

  // Mobile: the homepage is the single-screen app (no page scroll).
  if (isMobile) {
    return (
      <div style={{ background: "#080C18", minHeight: "100dvh" }}>
        <BeyonderApp />
      </div>
    );
  }

  // ── Shared style tokens ──────────────────────────────────────────────────
  const sectionPad  = "clamp(36px, 5vw, 56px) clamp(20px, 5vw, 60px)";
  const eyebrowStyle: React.CSSProperties = {
    fontSize: "0.62rem", fontWeight: 600, letterSpacing: "3px",
    textTransform: "uppercase", color: C.terra,
  };

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif", background: C.cream }}>

      {/* ══════════════════════════════════════════════════════════════════
          HERO — desktop only. Mobile renders <BeyonderApp /> instead (see above).
      ══════════════════════════════════════════════════════════════════ */}
      <section
        className="min-h-[345px] md:h-[500px]"
        style={{
          position: "relative", overflow: "hidden",
          display: "flex", flexDirection: "column",
          background: "#0e152a",
        }}
      >
        {/* BirdCanvas sky — two canvases: back (zIndex 0) + front (zIndex 4) */}
        <BirdCanvas />

        {/* Legibility overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          opacity: 0.75,
          background: "linear-gradient(180deg, rgba(8,12,24,0.18) 0%, rgba(8,12,24,0.12) 35%, rgba(8,12,24,0.32) 75%, rgba(8,12,24,0.52) 100%)",
        }} />

        {/* ── DESKTOP: headline + the two starting points (logo lives in the site header) ── */}
        <div className="ba-root ba-desk-hero">
          <div className="ba-desk-hero-inner">
            <h1>Talk to someone who understands.</h1>
            <p>SEND specialists by video, phone or chat, and trusted support close to home.</p>
            <div className="ba-choices">
              <button className="ba-choice ba-choice-main" onClick={() => navigate("/start?start=consult")}>
                <span><strong>Live consultation</strong><small>Speak to a specialist at a time that suits you</small></span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
              </button>
              <button className="ba-choice ba-choice-alt" onClick={() => navigate("/start?start=find")}>
                <span><strong>Find local support</strong><small>Therapists, clubs and services near you</small></span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            </div>
            <button className="ba-howlink" onClick={() => setAboutOpen(true)}>Built by SEND parents. See how Beyonder works</button>
          </div>
        </div>

        {/* ── Desktop steps strip — absolute at bottom of hero ── */}
        <div
          className="hidden md:grid"
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 6,
            gridTemplateColumns: "repeat(3, 1fr)",
            background: "#F6F3EE",
            borderTop: "1px solid rgba(27,26,53,0.08)",
          }}
        >
          {STEPS.map((step, i) => (
            <div key={step.t}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
                padding: "14px 20px 16px", textAlign: "center",
                borderRight: i < 2 ? "1px solid rgba(27,26,53,0.07)" : "none",
              }}
            >
              <div style={{ width: 64, height: 64, flexShrink: 0 }}>
                <img src={step.icon} alt={step.t} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: C.textDark, marginBottom: 2 }}>{step.t}</div>
                <div style={{ fontSize: "0.63rem", color: C.textLight, fontWeight: 300, lineHeight: 1.5 }}>{step.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. ECOSYSTEM INTRO + CATEGORIES
          — Edit CATEGORIES array above to add/remove/change category cards.
            Changes appear on both mobile and desktop automatically.
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.cream, padding: "clamp(12px, 1.5vw, 16px) clamp(20px, 5vw, 60px) clamp(20px, 3vw, 36px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Intro text */}
          <div style={{ textAlign: "center", marginBottom: "clamp(24px, 4vw, 40px)" }}>
            <p style={{ ...eyebrowStyle, marginBottom: 10 }}>The Beyonder Ecosystem</p>
            <h2 style={{
              fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 400, color: C.textDark,
              letterSpacing: "-0.4px", margin: "0 0 14px", fontFamily: "'Josefin Sans', sans-serif",
              lineHeight: 1.4, paddingBottom: "0.35em", overflow: "visible",
            }}>
              Everything your family needs, together
            </h2>
            <p style={{
              fontSize: "clamp(0.82rem, 1.5vw, 0.92rem)", color: C.textMid,
              maxWidth: 480, margin: "0 auto", lineHeight: 1.7, fontWeight: 300,
            }}>
              SEND isn't a single problem to solve. It's a whole life to navigate. Beyonder brings every
              piece into one trusted home — built by parents who've lived it.
            </p>
          </div>

          {/* Category header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)", fontWeight: 600, color: C.textDark, letterSpacing: "-0.2px", margin: 0 }}>
              Where would you like to start?
            </h3>
            <Link to="/providers" style={{ fontSize: "0.78rem", color: C.terra, fontWeight: 500, borderBottom: `1px solid rgba(217,138,106,0.30)`, textDecoration: "none" }}>
              View all providers →
            </Link>
          </div>

          {/* Category grid — 2 cols on mobile, 5 cols on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.label}
                to={c.to}
                className={i === 4 ? "col-span-2 md:col-span-1" : ""}
                style={{
                  background: C.white, borderRadius: 14,
                  padding: "clamp(10px, 2vw, 12px) clamp(12px, 2vw, 16px)",
                  border: `1.5px solid ${C.creamDark}`,
                  boxShadow: "0 2px 8px rgba(27,26,53,0.07), 0 1px 3px rgba(27,26,53,0.04)",
                  textDecoration: "none", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 6, textAlign: "center",
                }}
                onMouseEnter={cardIn}
                onMouseLeave={(e) => cardOut(e, C.creamDark)}
              >
                <div style={{ width: "100%", height: "clamp(72px, 10vw, 130px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <object data={c.icon} type="image/svg+xml" style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none" }} />
                </div>
                <span style={{ fontSize: "clamp(0.72rem, 1.4vw, 0.82rem)", fontWeight: 600, color: C.textDark, lineHeight: 1.3 }}>{c.label}</span>
                <span style={{ fontSize: "clamp(0.62rem, 1vw, 0.70rem)", color: C.textLight, fontWeight: 300 }}>{c.sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. PILLARS STRIP
          — Edit PILLARS array above to change navigation shortcut links.
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "0 clamp(16px, 4vw, 60px) clamp(20px, 3vw, 36px)" }}>
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{
            maxWidth: 1280, margin: "0 auto",
            background: "rgba(250, 244, 235, 0.68)", borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.55)",
            boxShadow: "0 4px 24px rgba(217,138,106,0.10), 0 1px 4px rgba(0,0,0,0.03)",
            backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            overflow: "hidden",
          }}
        >
          {PILLARS.map((p) => (
            <Link
              key={p.label}
              to={p.to}
              style={{
                padding: "clamp(14px, 2vw, 22px) clamp(14px, 2vw, 28px)",
                borderRight: "1px solid rgba(217,138,106,0.15)",
                background: p.hi ? "rgba(217,138,106,0.08)" : "transparent",
                textDecoration: "none", display: "flex", alignItems: "center",
                gap: "clamp(8px, 1.5vw, 14px)", transition: "background 0.18s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(217,138,106,0.14)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = p.hi ? "rgba(217,138,106,0.08)" : "transparent"; }}
            >
              <div style={{ width: 10, height: 10, flexShrink: 0, borderRadius: "50%", background: C.terra, boxShadow: "0 2px 6px rgba(217,138,106,0.50)" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "clamp(12px, 1.4vw, 14px)", fontWeight: 600, color: C.textDark, lineHeight: 1.3 }}>{p.label}</div>
                <div style={{ fontSize: "clamp(10px, 1.1vw, 12px)", color: C.textMid, fontWeight: 300, marginTop: 2 }}>{p.sub}</div>
              </div>
              <span style={{ color: C.terra, fontSize: 14, flexShrink: 0 }}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. WHY BEYONDER — stats + founder quote
          — Edit STATS array above to update statistics.
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.cream, padding: sectionPad, borderTop: `1px solid rgba(27,26,53,0.08)` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="md:grid md:grid-cols-2 md:gap-14 md:items-center">

            {/* Left: heading + quote (portrait inside quote) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="mb-7 md:mb-0">
              <span style={eyebrowStyle}>Why Beyonder exists</span>
              <h2 style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: "clamp(1.25rem, 3vw, 1.5rem)", fontWeight: 400,
                color: C.textDark, lineHeight: 1.25, letterSpacing: "-0.3px", margin: 0,
              }}>
                Built because we couldn't find what we needed either.
              </h2>
              <blockquote style={{
                background: C.white, borderLeft: `3px solid ${C.terra}`,
                padding: "18px 20px", borderRadius: "0 10px 10px 0",
                boxShadow: "0 2px 10px rgba(27,26,53,0.04)", margin: 0,
                display: "flex", alignItems: "center", gap: 16,
              }}>
                {/* Portrait inside the quote card */}
                <img
                  src={FamilyPortrait}
                  alt="Co-founder family"
                  style={{ width: "38%", flexShrink: 0, display: "block", borderRadius: 8 }}
                />
                <div>
                  <p style={{ fontSize: "clamp(0.82rem, 1.5vw, 0.92rem)", fontStyle: "italic", color: C.textDark, lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                    "I spent nearly a year searching for the right OT for my son. Information was scattered across
                    Facebook groups, outdated PDFs and word of mouth. I kept thinking — there has to be a better way."
                  </p>
                  <cite style={{ display: "block", marginTop: 10, fontSize: "0.70rem", color: C.textLight, fontStyle: "normal", fontWeight: 500 }}>
                    — Co-founder, parent of an 8-year-old with SEND
                  </cite>
                </div>
              </blockquote>
            </div>

            {/* Right: stats grid — 2 cols on all screen sizes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
              {STATS.map((s) => (
                <div key={s.num} style={{
                  background: C.white, borderRadius: 12,
                  padding: "clamp(14px, 2vw, 18px) clamp(12px, 1.5vw, 16px)",
                  border: "1.5px solid rgba(47,108,162,0.35)",
                  display: "flex", flexDirection: "column", gap: 4,
                }}>
                  <span style={{ fontSize: "clamp(1.5rem, 3vw, 1.9rem)", fontWeight: 700, color: "#2f6ca2", lineHeight: 1 }}>{s.num}</span>
                  <span style={{ fontSize: "clamp(0.65rem, 1.2vw, 0.73rem)", color: C.textMid, lineHeight: 1.5 }}>{s.label}</span>
                  <span style={{ fontSize: "0.60rem", color: C.textLight, marginTop: 2 }}>{s.src}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. FOR PROVIDERS
          — Edit PROVIDER_PERKS array above to update the benefits list.
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.cream, padding: `clamp(20px, 3vw, 24px) clamp(20px, 5vw, 60px) clamp(36px, 5vw, 52px)` }}>
        <div style={{
          maxWidth: 960, margin: "0 auto",
          background: C.white, borderRadius: 24,
          boxShadow: "0 4px 32px rgba(26,34,54,0.08), 0 1px 4px rgba(26,34,54,0.04)",
          padding: "clamp(24px, 4vw, 44px) clamp(20px, 4vw, 52px)",
        }}>
          <div className="md:grid md:grid-cols-2 md:gap-14 md:items-start">

            {/* Left: text + perks + CTA */}
            <div className="mb-8 md:mb-0">
              <div style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.terra, display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: "1.1rem", lineHeight: 0 }}>·</span>
                For Providers
              </div>
              <h2 style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 1.9rem)", fontWeight: 300,
                lineHeight: 1.2, color: C.textDark, letterSpacing: "-0.01em", margin: "0 0 14px",
              }}>
                The families you can help are{" "}
                <em style={{ fontStyle: "italic", color: C.terra }}>already here</em>.
              </h2>
              <p style={{ fontSize: "clamp(0.80rem, 1.5vw, 0.83rem)", lineHeight: 1.8, color: C.textMid, margin: "0 0 24px", maxWidth: 340 }}>
                Beyonder connects SEND families with local support at the moment they need it most.
                Your profile goes live immediately — no approval wait, no upfront cost.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px", display: "flex", flexDirection: "column", gap: 4 }}>
                {PROVIDER_PERKS.map((b) => (
                  <li key={b.text} style={{ fontSize: "clamp(0.78rem, 1.4vw, 0.82rem)", color: C.textMid, lineHeight: 1.6, display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={b.icon} alt="" style={{ width: "clamp(40px, 5vw, 55px)", height: "clamp(40px, 5vw, 55px)", flexShrink: 0 }} />
                    {b.text}
                  </li>
                ))}
              </ul>
              <Link
                to="/for-providers"
                style={{
                  display: "inline-block", background: C.terra, color: C.white,
                  fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.82rem",
                  letterSpacing: "0.04em", padding: "11px 28px", borderRadius: 100, textDecoration: "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}
              >
                Create your free profile
              </Link>
            </div>

            {/* Right: stats + provider quote */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { num: "2,400", plus: true,  lbl: "families searching\non Beyonder" },
                  { num: "38",    plus: false, lbl: "providers live\nthis month"      },
                ].map((s) => (
                  <div key={s.num} style={{ background: C.cream, borderRadius: 14, padding: "clamp(14px, 2vw, 20px) clamp(14px, 2vw, 18px)" }}>
                    <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 300, color: C.textDark, lineHeight: 1, marginBottom: 4 }}>
                      {s.num}{s.plus && <span style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.3rem)" }}>+</span>}
                    </div>
                    <div style={{ fontSize: "clamp(0.65rem, 1.2vw, 0.73rem)", color: C.textLight, lineHeight: 1.5, whiteSpace: "pre-line" }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: C.cream, borderRadius: 14, padding: "clamp(16px, 2vw, 22px) clamp(16px, 2vw, 26px)", position: "relative", overflow: "hidden" }}>
                <svg style={{ position: "absolute", top: 14, right: 18, opacity: 0.1, width: 72, height: 72 }} viewBox="0 0 80 80" fill="none">
                  <circle cx="28" cy="22" r="8" stroke={C.textDark} strokeWidth="1.8"/>
                  <path d="M14 48c0-9 7-14 14-14s14 5 14 14" stroke={C.textDark} strokeWidth="1.8" strokeLinecap="round"/>
                  <circle cx="54" cy="26" r="6" stroke={C.textDark} strokeWidth="1.6"/>
                  <path d="M44 48c0-7 4-11 10-11s10 4 10 11" stroke={C.textDark} strokeWidth="1.6" strokeLinecap="round"/>
                  <path d="M36 38c2-3 8-4 12-2" stroke={C.textDark} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 2"/>
                </svg>
                <blockquote style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "clamp(0.82rem, 1.4vw, 0.95rem)", fontStyle: "italic", fontWeight: 300, color: C.textDark, lineHeight: 1.65, margin: "0 0 10px", position: "relative", zIndex: 1 }}>
                  "Within two weeks I had enquiries from families I'd never have reached otherwise."
                </blockquote>
                <cite style={{ fontSize: "0.68rem", color: C.textLight, fontStyle: "normal", letterSpacing: "0.04em" }}>
                  Speech &amp; Language Therapist, Hampshire
                </cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          6. COMMUNITY — events + forum threads
          — Edit EVENTS and THREADS arrays above to update community content.
            Changes appear on both mobile and desktop automatically.
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.white, padding: sectionPad, borderTop: `1px solid ${C.creamDark}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Intro header */}
          <div className="md:grid md:grid-cols-2 md:gap-20 md:items-end" style={{ marginBottom: "clamp(24px, 4vw, 40px)" }}>
            <div>
              <div style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.terra, display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: "1.1rem", lineHeight: 0 }}>·</span>
                Community
              </div>
              <h2 style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 300, lineHeight: 1.2, color: C.textDark, letterSpacing: "-0.01em", margin: 0 }}>
                A place where people<br />
                <em style={{ fontStyle: "italic", color: C.terra }}>really</em> get it.
              </h2>
            </div>
            <p style={{ fontSize: "clamp(0.82rem, 1.5vw, 0.87rem)", lineHeight: 1.8, color: C.textMid, margin: 0 }}
               className="mt-4 md:mt-0">
              Real conversations, local meetups and shared experiences — all in one place, just for SEND families.
            </p>
          </div>

          {/* Events + Threads — stack on mobile, 2-col on desktop */}
          <div className="md:grid md:gap-6 md:items-start"
               style={{ gridTemplateColumns: "1.1fr 1.9fr", marginBottom: "clamp(24px, 4vw, 36px)" }}>

            {/* Events column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }} className="mb-6 md:mb-0">
              <span style={{ fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textLight, marginBottom: 2 }}>
                Near you
              </span>
              {EVENTS.map((ev) => (
                <Link
                  key={ev.day + ev.mon}
                  to="/community"
                  style={{ background: C.cream, borderRadius: 14, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start", textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ width: 40, minWidth: 40, height: 40, borderRadius: 10, background: "rgba(212,133,106,0.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "1.1rem", color: C.terra, lineHeight: 1 }}>{ev.day}</span>
                    <span style={{ fontSize: "0.50rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.terra, opacity: 0.8 }}>{ev.mon}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 500, color: C.textDark, lineHeight: 1.4, marginBottom: 3 }}>{ev.title}</div>
                    <span style={{ fontSize: "0.68rem", color: C.textLight }}>{ev.sub}</span>
                  </div>
                </Link>
              ))}
              {/* Community illustration — desktop only */}
              <div className="hidden md:flex justify-center mt-1" style={{ opacity: 0.72 }}>
                <object data={CommunityIcon} type="image/svg+xml" style={{ display: "block", width: "100%", maxWidth: 320, height: 208, pointerEvents: "none" }} />
              </div>
            </div>

            {/* Threads column */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textLight, marginBottom: 12 }}>
                People are talking
              </span>
              {THREADS.map((t, i) => (
                <Link
                  key={i}
                  to="/community"
                  style={{
                    paddingTop: i === 0 ? 0 : 16, paddingBottom: 16,
                    borderBottom: i < THREADS.length - 1 ? `1px solid ${C.creamDark}` : "none",
                    display: "grid", gridTemplateColumns: "1fr auto", gap: 16,
                    alignItems: "start", textDecoration: "none",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  <div>
                    <blockquote style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "clamp(0.82rem, 1.4vw, 0.95rem)", fontStyle: "italic", fontWeight: 300, color: C.textDark, lineHeight: 1.5, margin: "0 0 7px" }}>
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
                  <span style={{ fontSize: "0.60rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", background: C.cream, color: C.terra, padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap", alignSelf: "start", marginTop: 2 }}>
                    {t.tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: "clamp(0.82rem, 1.5vw, 0.87rem)", color: C.textMid, margin: 0 }}>
              Join 2,400+ SEND families already sharing, supporting and connecting.
            </p>
            <Link
              to="/community"
              style={{ display: "inline-block", background: C.terra, color: C.white, fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.82rem", letterSpacing: "0.04em", padding: "11px 28px", borderRadius: 100, textDecoration: "none" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}
            >
              Join the community
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          7. NEWS & RESEARCH
          — Edit NEWS array above to add/change articles.
            Changes appear on both mobile (stacked) and desktop (3-col grid).
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.cream, padding: sectionPad, borderTop: `1px solid ${C.creamDark}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.terra, display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: "1.1rem", lineHeight: 0 }}>·</span>
                News &amp; Research
              </div>
              <h2 style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 300, color: C.textDark, lineHeight: 1.2, letterSpacing: "-0.01em", margin: 0 }}>
                Stay ahead of<br />what matters.
              </h2>
            </div>
            <div style={{ textAlign: "right", paddingBottom: 4 }}>
              <p style={{ fontSize: "clamp(0.78rem, 1.4vw, 0.82rem)", color: C.textMid, lineHeight: 1.7, maxWidth: 240, margin: "0 0 8px" }}>
                Legislation, research and stories that matter — curated for SEND families.
              </p>
              <Link to="/news"
                style={{ fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: C.terra, textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                View all articles →
              </Link>
            </div>
          </div>

          {/* News grid — stacked (1 col) on mobile, 3-col on desktop */}
          <div className="grid grid-cols-1 md:[grid-template-columns:1.55fr_1fr_1fr] gap-4">
            {NEWS.map((n) => (
              <Link
                key={n.title}
                to="/news"
                className="news-card"
                style={{
                  background: C.white, borderRadius: 18, overflow: "hidden",
                  display: "flex", flexDirection: "column", textDecoration: "none",
                  border: `1.5px solid ${C.creamDark}`,
                  boxShadow: "0 2px 8px rgba(27,26,53,0.07), 0 1px 3px rgba(27,26,53,0.04)",
                }}
                onMouseEnter={newsIn}
                onMouseLeave={newsOut}
              >
                <div style={{ width: "100%", aspectRatio: n.featured ? "3/2" : "16/9", background: n.bg, position: "relative", overflow: "hidden", flexShrink: 0 }}>
                  {n.img && (
                    <img src={n.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                  )}
                  <div className="news-overlay" />
                </div>
                <div style={{ padding: "18px 20px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.60rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: C.terra, marginBottom: 8, display: "block" }}>
                    {n.tag}
                  </span>
                  <h3 style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 400, color: C.textDark, lineHeight: 1.4, flex: 1, fontSize: n.featured ? "clamp(0.92rem, 1.8vw, 1.1rem)" : "0.92rem", margin: "0 0 10px" }}>
                    {n.title}
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: C.textMid, lineHeight: 1.7, margin: "0 0 14px" }}>
                    {n.excerpt}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${C.creamDark}` }}>
                    <span style={{ fontSize: "0.68rem", color: C.textLight }}>{n.date}</span>
                    <span style={{ fontSize: "1rem", color: C.terra, opacity: 0.6 }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AboutSheet open={aboutOpen} onClose={closeAbout} fixed />
    </div>
  );
};

export default Index;
