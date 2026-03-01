import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";

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

  const isHomepage = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header — transparent on homepage, solid navy elsewhere */}
      <header
        className={`top-0 z-50 w-full transition-colors duration-200 ${
          isHomepage
            ? "bg-beige-gradient shadow-sm absolute"
            : "bg-navy-800 shadow-md text-white sticky"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span
              className="text-xl font-bold"
              style={{ color: isHomepage ? "hsl(207, 56%, 19%)" : "hsl(176, 100%, 37%)" }}
            >
              Beyonder
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                  isHomepage ? "hover:bg-black/5" : "hover:bg-white/10"
                } ${
                  location.pathname === link.to
                    ? isHomepage ? "text-[hsl(176,100%,37%)]" : "text-[hsl(176,100%,37%)]"
                    : isHomepage ? "text-[hsl(207,56%,19%)]" : "text-white/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className={isHomepage ? "text-[hsl(207,56%,19%)] hover:bg-black/5" : "text-white/80 hover:bg-white/10"} asChild>
                  <Link to={dashboardLink}>Dashboard</Link>
                </Button>
                <span className={`text-sm ${isHomepage ? "text-[hsl(207,56%,19%)]/60" : "text-white/60"}`}>{user?.name}</span>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out" className={isHomepage ? "text-[hsl(207,56%,19%)]/60 hover:bg-black/5" : "text-white/60 hover:bg-white/10"}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className={isHomepage ? "text-[hsl(207,56%,19%)] hover:bg-black/5" : "text-white/80 hover:bg-white/10"}
                  asChild
                >
                  <Link to="/login">Log In</Link>
                </Button>
                <Button className="rounded-full btn-join-now font-semibold shadow-md px-6" asChild>
                  <Link to="/signup">Join Now</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className={`md:hidden ${isHomepage ? "text-[hsl(207,56%,19%)]" : "text-white"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-black/10 bg-white/95 backdrop-blur-sm p-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5 ${
                    location.pathname === link.to ? "text-[hsl(176,100%,37%)]" : "text-[hsl(207,56%,19%)]"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" className="text-[hsl(207,56%,19%)] hover:bg-black/5 justify-start" asChild>
                      <Link to={dashboardLink} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button variant="outline" className="border-[hsl(207,56%,19%)]/20 text-[hsl(207,56%,19%)]" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="text-[hsl(207,56%,19%)] hover:bg-black/5 justify-start" asChild>
                      <Link to="/login" onClick={() => setMobileOpen(false)}>Log In</Link>
                    </Button>
                    <Button className="rounded-full btn-join-now font-semibold" asChild>
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

      <Footer />
    </div>
  );
};

export default Layout;
