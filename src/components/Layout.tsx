import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";

// ── Reusable inline hover helpers ─────────────────────────
// Orange button — lift + glow
const orangeBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 22px",
  background: "linear-gradient(135deg, #f07840, #e8622a)",
  borderRadius: 20,
  color: "#ffffff",
  fontSize: "0.85rem",
  fontWeight: 600,
  fontFamily: "'Outfit', sans-serif",
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 3px 12px rgba(232,98,42,0.28)",
  transition: "none",
};
const orangeBtnHoverIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
  e.currentTarget.style.boxShadow = "0 8px 26px rgba(232,98,42,0.52), 0 0 0 4px rgba(232,98,42,0.10)";
};
const orangeBtnHoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = "0 3px 12px rgba(232,98,42,0.28)";
};

// Ghost nav button
const ghostBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "7px 18px",
  border: "1px solid rgba(255,255,255,0.22)",
  borderRadius: 20,
  color: "rgba(255,255,255,0.70)",
  fontSize: "0.82rem",
  fontFamily: "'Outfit', sans-serif",
  textDecoration: "none",
  background: "transparent",
  transition: "none",
};
const ghostBtnHoverIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.borderColor = "rgba(58,154,136,0.60)";
  e.currentTarget.style.color = "rgba(255,255,255,0.95)";
  e.currentTarget.style.background = "rgba(42,122,106,0.10)";
};
const ghostBtnHoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
  e.currentTarget.style.color = "rgba(255,255,255,0.70)";
  e.currentTarget.style.background = "transparent";
};

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Get Connected", to: "/community" },
  { label: "For Providers", to: "/for-providers" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const dashboardLink =
    user?.role === "admin" ? "/admin" : user?.role === "provider" ? "/provider-dashboard" : "/dashboard";

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
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 58,
          background: "rgba(6,24,40,0.96)",
          borderBottom: "1px solid rgba(42,122,106,0.18)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                flexShrink: 0,
                background: "linear-gradient(135deg, #3a9a88, #061828)",
                border: "1.5px solid rgba(42,122,106,0.60)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 5,
                  height: 5,
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: "50%",
                }}
              />
            </div>
            <span style={{ fontSize: "1.15rem", fontWeight: 600, color: "#6abec4", letterSpacing: "-0.5px" }}>
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
                      ? "rgba(58,154,136,0.85)"
                      : location.pathname === link.to
                        ? "#3a9a88"
                        : "rgba(255,255,255,0.60)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  borderLeft: link.label === "For Providers" ? "1px solid rgba(255,255,255,0.10)" : "none",
                  paddingLeft: link.label === "For Providers" ? 30 : 0,
                  transition: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3a9a88")}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    link.label === "For Providers"
                      ? "rgba(58,154,136,0.85)"
                      : location.pathname === link.to
                        ? "#3a9a88"
                        : "rgba(255,255,255,0.60)";
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
                <Link
                  to={dashboardLink}
                  style={ghostBtn}
                  onMouseEnter={ghostBtnHoverIn}
                  onMouseLeave={ghostBtnHoverOut}
                >
                  Dashboard
                </Link>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)" }}>{user?.name}</span>
                <button
                  onClick={handleLogout}
                  aria-label="Log out"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.40)",
                    display: "flex",
                    alignItems: "center",
                    padding: 4,
                  }}
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={ghostBtn} onMouseEnter={ghostBtnHoverIn} onMouseLeave={ghostBtnHoverOut}>
                  Log in
                </Link>
                <Link to="/signup" style={orangeBtn} onMouseEnter={orangeBtnHoverIn} onMouseLeave={orangeBtnHoverOut}>
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
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.70)",
              padding: 4,
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden"
            style={{
              position: "absolute",
              top: 58,
              left: 0,
              right: 0,
              background: "rgba(6,24,40,0.98)",
              borderTop: "1px solid rgba(42,122,106,0.15)",
              padding: 16,
              zIndex: 200,
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    fontSize: "0.88rem",
                    color: location.pathname === link.to ? "#3a9a88" : "rgba(255,255,255,0.65)",
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
                        padding: "10px 12px",
                        borderRadius: 8,
                        fontSize: "0.88rem",
                        color: "rgba(255,255,255,0.65)",
                        textDecoration: "none",
                        border: "1px solid rgba(255,255,255,0.15)",
                        textAlign: "center",
                      }}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        fontSize: "0.88rem",
                        color: "rgba(255,255,255,0.65)",
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.15)",
                        cursor: "pointer",
                        fontFamily: "'Outfit', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
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
                        padding: "10px 12px",
                        borderRadius: 8,
                        fontSize: "0.88rem",
                        color: "rgba(255,255,255,0.65)",
                        textDecoration: "none",
                        border: "1px solid rgba(255,255,255,0.15)",
                        textAlign: "center",
                      }}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        color: "#fff",
                        textDecoration: "none",
                        background: "linear-gradient(135deg, #f07840, #e8622a)",
                        textAlign: "center",
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

      <main className="flex-1" style={{ paddingTop: 58 }}>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
