import React, { useEffect, useMemo, useState } from "react";
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

const HERO_OFFSET = 160; // when header becomes "glass" on homepage
const HIDE_DELTA = 8; // scroll delta required to hide on downward scroll
const TOP_REVEAL = 12; // near top: always show

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ desktop scroll states (homepage only)
  const [isPastHero, setIsPastHero] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isHomepage = location.pathname === "/";

  const dashboardLink =
    user?.role === "admin" ? "/admin" : user?.role === "provider" ? "/provider-dashboard" : "/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  // ✅ Detect desktop (we only hide/reveal header on desktop)
  const isDesktop = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 768px)").matches;
  }, []);

  useEffect(() => {
    // Only apply scroll header behaviour on homepage
    if (!isHomepage) {
      setIsPastHero(false);
      setIsHidden(false);
      return;
    }

    // Only apply hide/reveal on desktop
    const mq = window.matchMedia("(min-width: 768px)");
    const onMQChange = () => {
      if (!mq.matches) setIsHidden(false);
    };
    mq.addEventListener?.("change", onMQChange);

    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const atTop = y <= TOP_REVEAL;
          const pastHero = y >= HERO_OFFSET;

          setIsPastHero(pastHero);

          // mobile/tablet: never hide header
          if (!mq.matches) {
            setIsHidden(false);
          } else {
            const goingDown = y > lastY;
            const delta = Math.abs(y - lastY);

            // Always visible near top; hide on down; show on up
            if (atTop) {
              setIsHidden(false);
            } else {
              if (goingDown && delta >= HIDE_DELTA) setIsHidden(true);
              if (!goingDown) setIsHidden(false);
            }
          }

          lastY = y;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener?.("change", onMQChange);
    };
  }, [isHomepage]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header — locked behaviour */}
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 w-full",
          "transition-[transform,box-shadow,background-color] duration-300 ease-out will-change-transform",
          isHomepage
            ? "bg-gradient-to-b from-white to-[#f8f4ea] shadow-sm border-b border-black/5"
            : "bg-navy-800 shadow-md text-white",
        ].join(" ")}
      >
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span
              className="text-xl font-bold"
              style={{
                color: isHomepage ? "hsl(207, 56%, 19%)" : "hsl(176, 100%, 37%)",
              }}
            >
              Beyonder
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={[
                  "rounded-md px-3 py-2 text-sm font-medium",
                  "transition-colors duration-150",
                  // hover states
                  isHomepage ? "hover:bg-black/5" : "hover:bg-white/10",
                  // active + default text
                  location.pathname === link.to
                    ? "text-[hsl(176,100%,37%)]"
                    : isHomepage
                      ? "text-[hsl(207,56%,19%)]"
                      : "text-white/80",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    isHomepage ? "text-[hsl(207,56%,19%)] hover:bg-black/5" : "text-white/80 hover:bg-white/10"
                  }
                  asChild
                >
                  <Link to={dashboardLink}>Dashboard</Link>
                </Button>

                <span className={`text-sm ${isHomepage ? "text-[hsl(207,56%,19%)]/60" : "text-white/60"}`}>
                  {user?.name}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  aria-label="Log out"
                  className={
                    isHomepage ? "text-[hsl(207,56%,19%)]/60 hover:bg-black/5" : "text-white/60 hover:bg-white/10"
                  }
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className={
                    isHomepage ? "text-[hsl(207,56%,19%)] hover:bg-black/5" : "text-white/80 hover:bg-white/10"
                  }
                  asChild
                >
                  <Link to="/login">Log In</Link>
                </Button>

                <Button
                  className={[
                    "rounded-full btn-join-now font-semibold px-6",
                    "transition-all duration-200 ease-out",
                    "shadow-sm hover:shadow-md",
                    "hover:-translate-y-[1px] active:translate-y-0",
                  ].join(" ")}
                  asChild
                >
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
                      <Link to={dashboardLink} onClick={() => setMobileOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="border-[hsl(207,56%,19%)]/20 text-[hsl(207,56%,19%)]"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="text-[hsl(207,56%,19%)] hover:bg-black/5 justify-start" asChild>
                      <Link to="/login" onClick={() => setMobileOpen(false)}>
                        Log In
                      </Link>
                    </Button>

                    <Button className="rounded-full btn-join-now font-semibold" asChild>
                      <Link to="/signup" onClick={() => setMobileOpen(false)}>
                        Join Now
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ✅ Prevent fixed header covering content */}
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
