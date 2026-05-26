import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";

// ── Mobile bottom-nav config ──────────────────────────────────────────────────
const BOTTOM_NAV = [
  { icon: "🏠", label: "Home",      to: "/"          },
  { icon: "🔍", label: "Find",      to: "/explore"   },
  { icon: "💬", label: "Community", to: "/community" },
  { icon: "📰", label: "News",      to: "/news"      },
  { icon: "👤", label: "Profile",   to: "__profile"  }, // resolved at render
] as const;

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const dashboardLink =
    user?.role === "admin"    ? "/admin" :
    user?.role === "provider" ? "/provider-dashboard" :
    "/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── NAV ── */}
      <header
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
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(232,244,255,0.70)", padding: 4 }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden"
            style={{
              position:    "absolute",
              top:         58,
              left:        0,
              right:       0,
              background:  "rgba(8,12,24,0.98)",
              borderTop:   "1px solid rgba(43,76,126,0.25)",
              padding:     16,
              zIndex:      200,
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding:        "10px 12px",
                    borderRadius:   8,
                    fontSize:       "0.88rem",
                    color:          location.pathname === link.to ? C.ice : "rgba(232,244,255,0.65)",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                {isAuthenticated ? (
                  <>
                    <Link
                      to={dashboardLink}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        padding:        "10px 12px",
                        borderRadius:   8,
                        fontSize:       "0.88rem",
                        color:          "rgba(232,244,255,0.65)",
                        textDecoration: "none",
                        border:         "1px solid rgba(232,244,255,0.15)",
                        textAlign:      "center",
                      }}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        padding:     "10px 12px",
                        borderRadius: 8,
                        fontSize:    "0.88rem",
                        color:       "rgba(255,245,238,0.65)",
                        background:  "transparent",
                        border:      "1px solid rgba(255,245,238,0.15)",
                        cursor:      "pointer",
                        fontFamily:  "'Nunito Sans', sans-serif",
                        display:     "flex",
                        alignItems:  "center",
                        justifyContent: "center",
                        gap:         8,
                      }}
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      style={{
                        padding:        "10px 12px",
                        borderRadius:   8,
                        fontSize:       "0.88rem",
                        color:          "rgba(232,244,255,0.65)",
                        textDecoration: "none",
                        border:         "1px solid rgba(232,244,255,0.15)",
                        textAlign:      "center",
                      }}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      style={{
                        padding:        "10px 12px",
                        borderRadius:   8,
                        fontSize:       "0.88rem",
                        fontWeight:     600,
                        color:          C.warmWhite,
                        textDecoration: "none",
                        background:     `linear-gradient(135deg, ${C.peachLight}, ${C.peach})`,
                        textAlign:      "center",
                      }}
                    >
                      Join now
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 pb-[72px] md:pb-0" style={{ paddingTop: 58 }}>
        {children}
      </main>

      <Footer />

      {/* ── Mobile bottom navigation (md and above: hidden) ── */}
      <nav
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          zIndex: 200,
          background: "#ffffff",
          borderTop: "1px solid #EAE6DF",
          display: "flex",
          padding: "10px 0 16px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {BOTTOM_NAV.map((item) => {
          const href = item.to === "__profile"
            ? (isAuthenticated ? dashboardLink : "/login")
            : item.to;

          const active =
            href === "/"
              ? location.pathname === "/"
              : href === "/explore"
                ? location.pathname === "/explore" || location.pathname.startsWith("/providers")
                : location.pathname.startsWith(href);

          return (
            <Link
              key={item.label}
              to={href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span
                style={{
                  fontSize: "0.57rem",
                  color: active ? "#D98A6A" : "#7C7C8A",
                  letterSpacing: "0.04em",
                  fontWeight: active ? 600 : 400,
                  fontFamily: "'Nunito Sans', sans-serif",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
