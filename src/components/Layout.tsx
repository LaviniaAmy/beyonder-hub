import React, { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import FooterImage from "@/assets/footer/footer-image.svg";
import { useIsMobileLayout } from "@/hooks/useIsMobileLayout";
import AppNav, { type Tab } from "@/components/beyonder-app/AppNav";
import MenuSheet from "@/components/beyonder-app/MenuSheet";
import AboutSheet from "@/components/beyonder-app/AboutSheet";

// ── Mobile bottom bar (same as the homepage app) ──────────────────────────────
const TAB_ROUTES: Record<Tab, string> = {
  home: "/", consult: "/?tab=consult", find: "/?tab=find", community: "/community", profile: "/?tab=profile",
};

const C = {
  navy:       "#111827",
  indigo:     "#1E1B3A",
  peach:      "#D98A6A",
  peachLight: "#E8A080",
  ice:        "#E8F4FF",
  warmWhite:  "#F0F4FF",
} as const;

const ghostBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "7px 18px",
  border: "1px solid rgba(232,244,255,0.22)",
  borderRadius: 20,
  color: "rgba(232,244,255,0.70)",
  fontSize: "0.82rem",
  fontFamily: "'Nunito Sans', sans-serif",
  textDecoration: "none",
  background: "transparent",
  transition: "none",
};
const ghostBtnHoverIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.borderColor = "rgba(217,138,106,0.60)";
  e.currentTarget.style.color       = C.warmWhite;
  e.currentTarget.style.background  = "rgba(217,138,106,0.10)";
};
const ghostBtnHoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.borderColor = "rgba(232,244,255,0.22)";
  e.currentTarget.style.color       = "rgba(232,244,255,0.70)";
  e.currentTarget.style.background  = "transparent";
};

const terraBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 22px",
  background: `linear-gradient(135deg, ${C.peachLight}, ${C.peach})`,
  borderRadius: 20,
  color: "#ffffff",
  fontSize: "0.85rem",
  fontWeight: 600,
  fontFamily: "'Nunito Sans', sans-serif",
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 3px 12px rgba(217,138,106,0.28)",
  transition: "none",
};
const terraBtnIn  = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform  = "translateY(-2px) scale(1.02)";
  e.currentTarget.style.boxShadow  = "0 8px 26px rgba(217,138,106,0.52)";
};
const terraBtnOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform  = "none";
  e.currentTarget.style.boxShadow  = "0 3px 12px rgba(217,138,106,0.28)";
};

const navLinks = [
  { label: "Home",          to: "/" },
  { label: "About Us",      to: "/about" },
  { label: "Get Connected", to: "/community" },
  { label: "For Providers", to: "/for-providers" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const closeMenu  = useCallback(() => setMenuOpen(false), []);
  const closeAbout = useCallback(() => setAboutOpen(false), []);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const isMobile  = useIsMobileLayout();
  // On phones the homepage is a full-screen app with its own header and bottom bar.
  const appHome   = isMobile && location.pathname === "/";

  const dashboardLink =
    user?.role === "admin"    ? "/admin" :
    user?.role === "provider" ? "/provider-dashboard" :
    "/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const activeTab: Tab | null =
    location.pathname.startsWith("/community") ? "community" :
    location.pathname === "/explore" || location.pathname.startsWith("/providers") || location.pathname.startsWith("/provider/") ? "find" :
    null;

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── NAV ── */}
      {!appHome && <header
        style={{
          position:          "fixed",
          top:               0,
          left:              0,
          right:             0,
          zIndex:            100,
          height:            58,
          background:        "rgba(8,12,24,0.97)",
          borderBottom:      "1px solid rgba(43,76,126,0.30)",
          display:           "flex",
          alignItems:        "center",
          fontFamily:        "'Nunito Sans', sans-serif",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}
        >
          {/* Logo — text only, no SVG */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width:        8,
                height:       8,
                borderRadius: "50%",
                background:   C.peach,
                flexShrink:   0,
              }}
            />
            <span
              style={{
                fontSize:      "1.15rem",
                fontWeight:    400,
                color:         C.ice,
                letterSpacing: "0px",
                fontFamily:    "'Josefin Sans', sans-serif",
              }}
            >
              Beyonder
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex" style={{ gap: 30, alignItems: "center" }}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color:
                    link.label === "For Providers"
                      ? "rgba(217,138,106,0.90)"
                      : location.pathname === link.to
                        ? C.ice
                        : "rgba(232,244,255,0.60)",
                  textDecoration: "none",
                  fontSize:       "0.85rem",
                  fontWeight:     400,
                  borderLeft:     link.label === "For Providers" ? "1px solid rgba(255,245,238,0.10)" : "none",
                  paddingLeft:    link.label === "For Providers" ? 30 : 0,
                  transition:     "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.ice)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    link.label === "For Providers"
                      ? "rgba(217,138,106,0.90)"
                      : location.pathname === link.to
                        ? C.ice
                        : "rgba(232,244,255,0.60)";
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex" style={{ gap: 10, alignItems: "center" }}>
            {isAuthenticated ? (
              <>
                <Link to={dashboardLink} style={ghostBtn} onMouseEnter={ghostBtnHoverIn} onMouseLeave={ghostBtnHoverOut}>
                  Dashboard
                </Link>
                <span style={{ fontSize: "0.82rem", color: "rgba(232,244,255,0.40)" }}>{user?.name}</span>
                <button
                  onClick={handleLogout}
                  aria-label="Log out"
                  style={{
                    background:    "transparent",
                    border:        "none",
                    cursor:        "pointer",
                    color:         "rgba(232,244,255,0.40)",
                    display:       "flex",
                    alignItems:    "center",
                    padding:       4,
                  }}
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login"  style={ghostBtn}   onMouseEnter={ghostBtnHoverIn}  onMouseLeave={ghostBtnHoverOut}>
                  Log in
                </Link>
                <Link to="/signup" style={terraBtn}   onMouseEnter={terraBtnIn}       onMouseLeave={terraBtnOut}>
                  Join now
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(232,244,255,0.70)", padding: 4 }}
          >
            <Menu size={24} />
          </button>
        </div>

      </header>}

      <main
        className={appHome ? "flex-1" : "flex-1 bg-background pb-[96px] md:pb-0"}
        style={{ paddingTop: appHome ? 0 : 58, background: appHome ? "#080C18" : "#F6F3EE" }}
      >
        {children}
      </main>

      {!appHome && <>
      {/* Footer image — sits above footer on every page */}
      <div style={{ background: "#F6F3EE", display: "flex", justifyContent: "center", padding: "0 20px" }}>
        <img src={FooterImage} alt="" aria-hidden="true" style={{ width: "84%", maxWidth: 924, display: "block", pointerEvents: "none" }} />
      </div>

      <Footer />

      {/* ── Mobile bottom bar + menu — same components as the homepage app ── */}
      {isMobile && (
        <>
          <AppNav fixed active={activeTab} onTab={(t) => navigate(TAB_ROUTES[t])} />
          <MenuSheet fixed open={menuOpen} onClose={closeMenu}
            onProfile={() => navigate(TAB_ROUTES.profile)} onAbout={() => setAboutOpen(true)} />
          <AboutSheet fixed open={aboutOpen} onClose={closeAbout} />
        </>
      )}
      </>}
    </div>
  );
};

export default Layout;
