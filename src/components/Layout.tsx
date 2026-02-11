import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

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

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const dashboardLink = user?.role === "admin" ? "/admin" : user?.role === "provider" ? "/provider-dashboard" : "/dashboard";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Beyonder</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={dashboardLink}>Dashboard</Link>
                </Button>
                <span className="text-sm text-muted-foreground">{user?.name}</span>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Join Now</Link>
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t bg-background p-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                    location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to={dashboardLink} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to="/login" onClick={() => setMobileOpen(false)}>Log In</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/signup" onClick={() => setMobileOpen(false)}>Join Now</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-accent text-accent-foreground">
        <div className="container py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Beyonder</h3>
              <p className="text-sm opacity-80">Connecting SEND families with trusted services and support.</p>
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
