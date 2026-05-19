import { Link } from "react-router-dom";

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

          <h4 style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(232,244,255,0.80)", marginBottom: 8, fontFamily: "'Nunito Sans', sans-serif" }}>Explore</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
            <li><Link to="/explore" style={{ fontSize: "0.82rem", color: "rgba(232,244,255,0.50)", textDecoration: "none", fontFamily: "'Nunito Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D98A6A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,244,255,0.50)")}>
              Find Services
            </Link></li>
            <li><Link to="/providers" style={{ fontSize: "0.82rem", color: "rgba(232,244,255,0.50)", textDecoration: "none", fontFamily: "'Nunito Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D98A6A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,244,255,0.50)")}>
              Provider Directory
            </Link></li>
            <li><Link to="/community" style={{ fontSize: "0.82rem", color: "rgba(232,244,255,0.50)", textDecoration: "none", fontFamily: "'Nunito Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D98A6A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,244,255,0.50)")}>
              Community
            </Link></li>
          </ul>

          <h4 style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(232,244,255,0.80)", marginBottom: 8, fontFamily: "'Nunito Sans', sans-serif" }}>Learn</h4>
        </div>

        {/* Column 2 */}
        <div>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
            <li><Link to="/guides" style={{ fontSize: "0.82rem", color: "rgba(232,244,255,0.50)", textDecoration: "none", fontFamily: "'Nunito Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D98A6A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,244,255,0.50)")}>
              Guides & Understanding
            </Link></li>
            <li><Link to="/news" style={{ fontSize: "0.82rem", color: "rgba(232,244,255,0.50)", textDecoration: "none", fontFamily: "'Nunito Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D98A6A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,244,255,0.50)")}>
              News & Updates
            </Link></li>
            <li><Link to="/about" style={{ fontSize: "0.82rem", color: "rgba(232,244,255,0.50)", textDecoration: "none", fontFamily: "'Nunito Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D98A6A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,244,255,0.50)")}>
              About Us
            </Link></li>
          </ul>

          <h4 style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(232,244,255,0.80)", marginBottom: 8, fontFamily: "'Nunito Sans', sans-serif" }}>Support</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <li><Link to="/help" style={{ fontSize: "0.82rem", color: "rgba(232,244,255,0.50)", textDecoration: "none", fontFamily: "'Nunito Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D98A6A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,244,255,0.50)")}>
              Help Centre
            </Link></li>
            <li><Link to="/for-providers" style={{ fontSize: "0.82rem", color: "rgba(232,244,255,0.50)", textDecoration: "none", fontFamily: "'Nunito Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D98A6A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,244,255,0.50)")}>
              For Providers
            </Link></li>
          </ul>
        </div>
      </div>

      <div style={{
        marginTop: 32,
        borderTop: "1px solid rgba(232,244,255,0.08)",
        paddingTop: 20,
        textAlign: "center",
        fontSize: "0.72rem",
        color: "rgba(232,244,255,0.28)",
        fontFamily: "'Nunito Sans', sans-serif",
      }}>
        © {new Date().getFullYear()} Beyonder. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
