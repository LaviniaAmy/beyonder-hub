import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import LogoPrimary from "@/assets/Logo-Primary.svg";
import TealDark from "@/assets/Teal_Layer_dark.png";
import TealLight from "@/assets/Teal_Layer_light.png";
import SearchIcon from "@/assets/icons/Search_Icon.svg";
import LocalIcon from "@/assets/icons/Local_Icon.svg";
import GuidesIcon from "@/assets/icons/Guides_Icon.svg";
import WorkIcon from "@/assets/icons/Work_Icon.svg";
import TherapistsIcon from "@/assets/icons/Therapists_Icon.svg";
import ClubsIcon from "@/assets/icons/Clubs_Icon.svg";
import NewsIcon from "@/assets/icons/News_Icon.svg";

const sideIcons = [
  { icon: LocalIcon, label: "Local Support", to: "/providers?view=local" },
  { icon: GuidesIcon, label: "Guides & Info", to: "/guides" },
  { icon: WorkIcon, label: "Work with us", to: "/for-providers" },
];

const categoryCards = [
  {
    icon: TherapistsIcon,
    title: "Therapists & Specialists",
    to: "/providers?category=therapists",
  },
  {
    icon: ClubsIcon,
    title: "Inclusive clubs & Activities",
    to: "/providers?category=activities",
  },
  {
    icon: NewsIcon,
    title: "News & updates",
    to: "/news",
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/providers?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-beige-gradient">
      {/* ============ HERO SECTION ============ */}
      <section className="relative w-full overflow-hidden" style={{ height: "540px" }}>
        {/* Teal Arc Layers — behind video */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Light teal layer — furthest back */}
          <img
            src={TealLight}
            alt=""
            className="absolute select-none hero-bg"
            style={{
              top: "-8%",
              right: "-4%",
              height: "120%",
              width: "auto",
              maxWidth: "none",
              objectFit: "contain",
              zIndex: 1,
            }}
          />
          {/* Dark teal layer — in front of light */}
          <img
            src={TealDark}
            alt=""
            className="absolute select-none hero-bg"
            style={{
              top: "-5%",
              right: "-1%",
              height: "116%",
              width: "auto",
              maxWidth: "none",
              objectFit: "contain",
              zIndex: 2,
            }}
          />
        </div>

        {/* Video — masked with curved left edge */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: 0,
            right: 0,
            width: "55%",
            height: "100%",
            clipPath: "ellipse(80% 110% at 72% 50%)",
            zIndex: 3,
          }}
          aria-hidden="true"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/video/star-fallback.png"
          >
            <source src="/video/star-movie.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Left Vertical Icon Column */}
        <div
          className="absolute flex flex-col items-center gap-6"
          style={{
            left: "32px",
            top: "70px",
            zIndex: 20,
          }}
        >
          {sideIcons.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group flex flex-col items-center gap-1 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center transition-shadow duration-200 group-hover:shadow-md">
                <img src={item.icon} alt="" className="w-full h-full object-cover" />
              </div>
              <span
                className="text-[11px] font-medium text-center leading-tight max-w-[72px]"
                style={{ color: "hsl(207, 56%, 19%)" }}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Hero Content — centered over video */}
        <div
          className="relative flex flex-col items-center"
          style={{
            zIndex: 10,
            paddingTop: "60px",
            marginLeft: "auto",
            marginRight: "auto",
            width: "fit-content",
            paddingRight: "4%",
            paddingLeft: "16%",
          }}
        >
          {/* Logo */}
          <div className="hero-load-1 mb-2 flex justify-center">
            <img
              src={LogoPrimary}
              alt="Beyonder"
              className="w-auto"
              style={{ height: "100px" }}
            />
          </div>

          {/* Subtitle */}
          <p
            className="hero-load-2 text-sm font-light tracking-[0.25em] mb-6 text-center"
            style={{ color: "hsl(0, 0%, 100%)" }}
          >
            SEND Community Hub
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hero-load-3 w-full max-w-[380px] mb-8">
            <div className="relative group">
              <input
                type="text"
                placeholder="How can we help you today?"
                className="w-full h-10 rounded-full bg-white/95 pl-5 pr-12 text-[13px] shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-[hsl(176,100%,37%)]/30
                  transition-all duration-200
                  group-hover:shadow-md group-hover:-translate-y-0.5
                  hero-search-bar"
                style={{ color: "hsl(207, 56%, 19%)" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <div className="w-px h-4" style={{ backgroundColor: "hsl(176, 80%, 55%)" }} />
                <button
                  type="submit"
                  className="flex items-center justify-center transition-opacity duration-150 hover:opacity-70"
                  aria-label="Search"
                >
                  <img src={SearchIcon} alt="" className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>

          {/* CTA Buttons — stacked, overlapping into teal zone */}
          <div className="hero-load-4 flex flex-col gap-2.5 w-full max-w-[300px]">
            <Button
              size="default"
              className="rounded-full h-10 px-6 text-sm font-medium shadow-sm w-full
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] active:duration-100"
              style={{
                backgroundColor: "hsl(207, 56%, 19%)",
                color: "#FFFFFF",
              }}
              asChild
            >
              <Link to="/explore">Explore Services</Link>
            </Button>
            <Button
              size="default"
              className="rounded-full h-10 px-6 text-sm font-medium shadow-sm w-full
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] active:duration-100"
              style={{
                backgroundColor: "hsl(207, 56%, 19%)",
                color: "#FFFFFF",
              }}
              asChild
            >
              <Link to="/community">Community groups</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============ CATEGORY SECTION on faint navy gradient ============ */}
      <section
        className="relative py-14"
        style={{
          zIndex: 10,
          background: "linear-gradient(180deg, hsl(40, 30%, 96%) 0%, hsl(210, 20%, 92%) 60%, hsl(207, 30%, 85%) 100%)",
        }}
      >
        <div className="mx-auto max-w-[960px] px-6">
          {/* Teal divider line */}
          <div className="flex justify-center mb-3">
            <div
              className="h-[2px] rounded-full"
              style={{
                width: "180px",
                backgroundColor: "hsl(176, 100%, 37%)",
              }}
            />
          </div>

          {/* Section title */}
          <h2
            className="text-center text-2xl lg:text-3xl font-light mb-10"
            style={{ color: "hsl(176, 100%, 37%)" }}
          >
            Choose by Category
          </h2>

          {/* Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {categoryCards.map((card) => (
              <Link key={card.title} to={card.to}>
                <div
                  className="rounded-xl px-5 py-4 flex items-center justify-between gap-3
                    transition-all duration-200 hover:-translate-y-1 hover:shadow-md
                    active:scale-[0.98] active:duration-100"
                  style={{
                    backgroundColor: "hsl(37, 60%, 93%)",
                    border: "1px solid hsl(42, 93%, 73%)",
                  }}
                >
                  <h3
                    className="text-sm font-semibold leading-snug"
                    style={{ color: "hsl(207, 56%, 19%)" }}
                  >
                    {card.title}
                  </h3>
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                    <img src={card.icon} alt="" className="w-10 h-10" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
