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
      {/* Header — navy-900 foundation */}
      <header className="sticky top-0 z-50 bg-navy-900 text-accent-foreground shadow-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-teal-400">Beyonder</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 hover:bg-navy-700 ${
                  location.pathname === link.to ? "text-teal-400" : "text-accent-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="text-accent-foreground/80 hover:text-teal-400 hover:bg-navy-700" asChild>
                  <Link to={dashboardLink}>Dashboard</Link>
                </Button>
                <span className="text-sm text-accent-foreground/60">{user?.name}</span>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out" className="text-accent-foreground/60 hover:text-accent-foreground hover:bg-navy-700">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-accent-foreground/80 hover:text-teal-400 hover:bg-navy-700" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button className="bg-teal-500 text-primary-foreground hover:bg-teal-400" asChild>
                  <Link to="/signup">Join Now</Link>
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden text-accent-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-navy-700 bg-navy-800 p-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-navy-700 ${
                    location.pathname === link.to ? "text-teal-400" : "text-accent-foreground/80"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" className="text-accent-foreground/80 hover:bg-navy-700 justify-start" asChild>
                      <Link to={dashboardLink} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button variant="outline" className="border-navy-600 text-accent-foreground hover:bg-navy-700" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="text-accent-foreground/80 hover:bg-navy-700 justify-start" asChild>
                      <Link to="/login" onClick={() => setMobileOpen(false)}>Log In</Link>
                    </Button>
                    <Button className="bg-teal-500 hover:bg-teal-400" asChild>
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

      {/* Footer — navy-900 foundation */}
      <footer className="bg-navy-900 text-accent-foreground">
        <div className="container py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-teal-400">Beyonder</h3>
              <p className="text-sm text-accent-foreground/70">Connecting SEND families with trusted services and support.</p>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-accent-foreground/90">Explore</h4>
              <ul className="space-y-2 text-sm text-accent-foreground/60">
                <li><Link to="/explore" className="transition-colors hover:text-teal-400">Find Services</Link></li>
                <li><Link to="/providers" className="transition-colors hover:text-teal-400">Provider Directory</Link></li>
                <li><Link to="/community" className="transition-colors hover:text-teal-400">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-accent-foreground/90">Learn</h4>
              <ul className="space-y-2 text-sm text-accent-foreground/60">
                <li><Link to="/guides" className="transition-colors hover:text-teal-400">Guides & Understanding</Link></li>
                <li><Link to="/news" className="transition-colors hover:text-teal-400">News & Updates</Link></li>
                <li><Link to="/about" className="transition-colors hover:text-teal-400">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-accent-foreground/90">Support</h4>
              <ul className="space-y-2 text-sm text-accent-foreground/60">
                <li><Link to="/help" className="transition-colors hover:text-teal-400">Help Centre</Link></li>
                <li><Link to="/for-providers" className="transition-colors hover:text-teal-400">For Providers</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-navy-700 pt-6 text-center text-sm text-accent-foreground/40">
            © 2026 Beyonder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
