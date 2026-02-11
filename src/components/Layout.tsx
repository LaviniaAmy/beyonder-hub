import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Explore Services", to: "/explore" },
  { label: "Providers", to: "/providers" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Beyonder</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Join Now</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="border-t bg-background p-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                    location.pathname === link.to
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Log In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup" onClick={() => setMobileOpen(false)}>Join Now</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-accent text-accent-foreground">
        <div className="container py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Beyonder</h3>
              <p className="text-sm opacity-80">
                Connecting SEND families with trusted services and support.
              </p>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Explore</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/explore" className="hover:opacity-100">Find Services</Link></li>
                <li><Link to="/providers" className="hover:opacity-100">Provider Directory</Link></li>
                <li><Link to="/community" className="hover:opacity-100">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Learn</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/guides" className="hover:opacity-100">Guides & Understanding</Link></li>
                <li><Link to="/news" className="hover:opacity-100">News & Updates</Link></li>
                <li><Link to="/about" className="hover:opacity-100">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Support</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/help" className="hover:opacity-100">Help Centre</Link></li>
                <li><Link to="/for-providers" className="hover:opacity-100">For Providers</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border/20 pt-6 text-center text-sm opacity-60">
            © 2026 Beyonder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
