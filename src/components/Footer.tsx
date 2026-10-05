import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";

const linkStyle: CSSProperties = {
  fontSize: "0.82rem", color: "rgba(232,244,255,0.50)", textDecoration: "none", fontFamily: "'Nunito Sans', sans-serif",
};
const headingStyle: CSSProperties = {
  fontSize: "0.78rem", fontWeight: 600, color: "rgba(232,244,255,0.80)", marginBottom: 8, fontFamily: "'Nunito Sans', sans-serif",
};
const listStyle: CSSProperties = {
  listStyle: "none", padding: 0, margin: "0 0 18px", display: "flex", flexDirection: "column", gap: 6,
};

const FooterLink = ({ to, children, style }: { to: string; children: ReactNode; style?: CSSProperties }) => {
  const base = { ...linkStyle, ...style };
  return (
    <Link
      to={to}
      style={base}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#D98A6A")}
      onMouseLeave={(e) => (e.currentTarget.style.color = String(base.color))}
    >
      {children}
    </Link>
  );
};

const Footer = () => (
  <footer style={{ background: "linear-gradient(180deg, #1E1B3A 0%, #111827 100%)" }}>
    <div className="mx-auto max-w-[1100px] py-10 px-8">
      <div className="grid gap-8 sm:grid-cols-2">
        {/* Column 1 */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#D98A6A", flexShrink: 0 }} />
            <h3 style={{ fontSize: "1rem", fontWeight: 400, color: "#E8F4FF", fontFamily: "'Josefin Sans', sans-serif", margin: 0 }}>
              Beyonder
            </h3>
          </div>
          <p style={{ fontSize: "0.85rem", color: "rgba(232,244,255,0.55)", lineHeight: 1.7, marginBottom: 20, fontWeight: 300, fontFamily: "'Nunito Sans', sans-serif" }}>
            Connecting SEND families with trusted services and support.
          </p>

          <h4 style={headingStyle}>Explore</h4>
          <ul style={listStyle}>
            <li><FooterLink to="/explore">Find Services</FooterLink></li>
            <li><FooterLink to="/providers">Provider Directory</FooterLink></li>
            <li><FooterLink to="/community">Community</FooterLink></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h4 style={headingStyle}>Learn</h4>
          <ul style={listStyle}>
            <li><FooterLink to="/guides">Guides & Understanding</FooterLink></li>
            <li><FooterLink to="/news">News & Updates</FooterLink></li>
            <li><FooterLink to="/about">About Us</FooterLink></li>
          </ul>

          <h4 style={headingStyle}>Support</h4>
          <ul style={{ ...listStyle, margin: 0 }}>
            <li><FooterLink to="/help">Help Centre</FooterLink></li>
            <li><FooterLink to="/for-providers">For Providers</FooterLink></li>
          </ul>
        </div>
      </div>

      <div style={{
        marginTop: 32,
        borderTop: "1px solid rgba(232,244,255,0.08)",
        paddingTop: 20,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px 18px",
        fontSize: "0.72rem",
        color: "rgba(232,244,255,0.28)",
        fontFamily: "'Nunito Sans', sans-serif",
      }}>
        <span>© {new Date().getFullYear()} Beyonder. All rights reserved.</span>
        {[["/privacy", "Privacy"], ["/terms", "Terms"], ["/cookies", "Cookies"]].map(([to, label]) => (
          <FooterLink key={to} to={to} style={{ fontSize: "0.72rem", color: "rgba(232,244,255,0.40)" }}>{label}</FooterLink>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
