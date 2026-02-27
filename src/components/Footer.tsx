import { Link } from "react-router-dom";

const Footer = () => (
  <footer
    className="text-white"
    style={{
      background: "linear-gradient(180deg, hsl(207, 30%, 35%) 0%, hsl(207, 72%, 15%) 30%, hsl(207, 72%, 15%) 100%)",
    }}
  >
    <div className="mx-auto max-w-[1100px] py-10 px-8">
      <div className="grid gap-8 sm:grid-cols-2">
        {/* Column 1 */}
        <div>
          <h3 className="mb-1.5 text-base font-semibold" style={{ color: "hsl(176, 100%, 37%)" }}>
            Beyonder
          </h3>
          <p className="text-sm text-white/70 leading-relaxed mb-5">
            Connecting SEND families with trusted services and support.
          </p>

          <h4 className="mb-1.5 font-semibold text-white/90 text-sm">Explore</h4>
          <ul className="space-y-0.5 text-sm text-white/60 mb-4">
            <li><Link to="/explore" className="transition-colors hover:text-white">Find Services</Link></li>
            <li><Link to="/providers" className="transition-colors hover:text-white">Provider Directory</Link></li>
            <li><Link to="/community" className="transition-colors hover:text-white">Community</Link></li>
          </ul>

          <h4 className="mb-1.5 font-semibold text-white/90 text-sm">Learn</h4>
        </div>

        {/* Column 2 */}
        <div>
          <ul className="space-y-0.5 text-sm text-white/60 mb-4">
            <li><Link to="/guides" className="transition-colors hover:text-white">Guides & Understanding</Link></li>
            <li><Link to="/news" className="transition-colors hover:text-white">News & Updates</Link></li>
            <li><Link to="/about" className="transition-colors hover:text-white">About Us</Link></li>
          </ul>

          <h4 className="mb-1.5 font-semibold text-white/90 text-sm">Support</h4>
          <ul className="space-y-0.5 text-sm text-white/60">
            <li><Link to="/help" className="transition-colors hover:text-white">Help Centre</Link></li>
            <li><Link to="/for-providers" className="transition-colors hover:text-white">For Providers</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Beyonder. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
