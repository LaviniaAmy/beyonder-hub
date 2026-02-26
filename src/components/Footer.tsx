import { Link } from "react-router-dom";

const Footer = () => (
  <footer style={{ backgroundColor: "#082B43" }} className="text-white">
    <div className="container py-16 px-6">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <h3 className="mb-3 text-lg font-semibold" style={{ color: "hsl(176, 100%, 37%)" }}>
            Beyonder
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            Connecting SEND families with trusted services and support.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="mb-3 font-semibold text-white/90">Explore</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/explore" className="transition-colors hover:text-white">Find Services</Link></li>
            <li><Link to="/providers" className="transition-colors hover:text-white">Provider Directory</Link></li>
            <li><Link to="/community" className="transition-colors hover:text-white">Community</Link></li>
          </ul>
        </div>

        {/* Learn */}
        <div>
          <h4 className="mb-3 font-semibold text-white/90">Learn</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/guides" className="transition-colors hover:text-white">Guides & Understanding</Link></li>
            <li><Link to="/news" className="transition-colors hover:text-white">News & Updates</Link></li>
            <li><Link to="/about" className="transition-colors hover:text-white">About Us</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-3 font-semibold text-white/90">Support</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/help" className="transition-colors hover:text-white">Help Centre</Link></li>
            <li><Link to="/for-providers" className="transition-colors hover:text-white">For Providers</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/40">
        © {new Date().getFullYear()} Beyonder. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
