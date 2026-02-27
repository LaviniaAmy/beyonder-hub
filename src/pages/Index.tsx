import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import LogoPrimary from "@/assets/Logo-Primary.svg";
import TealDark from "@/assets/Teal_Layer_dark.png";
import TealLight from "@/assets/Teal_Layer_light.png";
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
      <section className="relative w-full" style={{ minHeight: "620px" }}>
        {/* Teal Arc Layers — behind video */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Light teal layer — furthest back, wider spread */}
          <img
            src={TealLight}
            alt=""
            className="absolute select-none hero-bg"
            style={{
              top: "-5%",
              right: "-2%",
              height: "115%",
              width: "auto",
              maxWidth: "none",
              objectFit: "contain",
              zIndex: 1,
            }}
          />
          {/* Dark teal layer — in front of light, tighter */}
          <img
            src={TealDark}
            alt=""
            className="absolute select-none hero-bg"
            style={{
              top: "-3%",
              right: "0%",
              height: "112%",
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
            width: "58%",
            height: "100%",
            clipPath: "ellipse(75% 100% at 70% 50%)",
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
          className="absolute flex flex-col items-center gap-8"
          style={{
            left: "40px",
            top: "90px",
            zIndex: 20,
          }}
        >
          {sideIcons.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group flex flex-col items-center gap-1.5 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden flex items-center justify-center transition-shadow duration-200 group-hover:shadow-lg">
                <img src={item.icon} alt="" className="w-full h-full object-cover" />
              </div>
              <span
                className="text-xs font-medium text-center leading-tight max-w-[80px]"
                style={{ color: "hsl(207, 56%, 19%)" }}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Hero Content — positioned over the video area (right-center) */}
        <div
          className="relative flex flex-col items-center"
          style={{
            zIndex: 10,
            paddingTop: "100px",
            marginLeft: "auto",
            marginRight: "auto",
            width: "fit-content",
            paddingRight: "6%",
            paddingLeft: "20%",
          }}
        >
          {/* Logo */}
          <div className="hero-load-1 mb-3 flex justify-center">
            <img
              src={LogoPrimary}
              alt="Beyonder"
              className="w-auto"
              style={{ height: "120px" }}
            />
          </div>

          {/* Subtitle */}
          <p
            className="hero-load-2 text-lg font-light tracking-widest mb-8 text-center"
            style={{ color: "hsl(0, 0%, 100%)" }}
          >
            SEND Community Hub
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hero-load-3 w-full max-w-[420px] mb-10">
            <div className="relative group">
              <input
                type="text"
                placeholder="How can we help you today?"
                className="w-full h-12 rounded-full bg-white/95 pl-6 pr-14 text-sm shadow-md
                  focus:outline-none focus:ring-2 focus:ring-[hsl(176,100%,37%)]/40
                  transition-all duration-200
                  group-hover:shadow-lg group-hover:-translate-y-0.5
                  hero-search-bar"
                style={{ color: "hsl(207, 56%, 19%)" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* Divider + Search icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-px h-5 bg-gray-300" />
                <button
                  type="submit"
                  className="flex items-center justify-center transition-colors duration-150"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" style={{ color: "hsl(207, 56%, 19%)" }} />
                </button>
              </div>
            </div>
          </form>

          {/* CTA Buttons — stacked vertically */}
          <div className="hero-load-4 flex flex-col gap-3 w-full max-w-[340px]">
            <Button
              size="lg"
              className="rounded-full h-12 px-8 text-base font-medium shadow-md w-full
                transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] active:duration-100"
              style={{
                backgroundColor: "hsl(207, 56%, 19%)",
                color: "#FFFFFF",
              }}
              asChild
            >
              <Link to="/explore">Explore Services</Link>
            </Button>
            <Button
              size="lg"
              className="rounded-full h-12 px-8 text-base font-medium shadow-md w-full
                transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] active:duration-100"
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

      {/* ============ CATEGORY SECTION ============ */}
      <section className="relative py-16 lg:py-20" style={{ zIndex: 10 }}>
        <div className="mx-auto max-w-[1100px] px-6">
          {/* Teal divider line */}
          <div className="flex justify-center mb-4">
            <div
              className="h-[2px] rounded-full"
              style={{
                width: "200px",
                backgroundColor: "hsl(176, 100%, 37%)",
              }}
            />
          </div>

          {/* Section title */}
          <h2
            className="text-center text-3xl lg:text-4xl font-light mb-12"
            style={{ color: "hsl(176, 100%, 37%)" }}
          >
            Choose by Category
          </h2>

          {/* Category Cards — horizontal row, text left + icon right */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categoryCards.map((card) => (
              <Link key={card.title} to={card.to}>
                <div
                  className="rounded-2xl px-6 py-5 flex items-center justify-between gap-4
                    transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
                    active:scale-[0.98] active:duration-100"
                  style={{
                    backgroundColor: "hsl(37, 60%, 93%)",
                    border: "1px solid hsl(42, 93%, 73%)",
                  }}
                >
                  <h3
                    className="text-base font-semibold leading-snug"
                    style={{ color: "hsl(207, 56%, 19%)" }}
                  >
                    {card.title}
                  </h3>
                  <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
                    <img src={card.icon} alt="" className="w-12 h-12" />
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
