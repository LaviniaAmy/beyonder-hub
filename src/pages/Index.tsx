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
    title: "Inclusive Clubs & Activities",
    to: "/providers?category=activities",
  },
  {
    icon: NewsIcon,
    title: "News & Updates",
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
      <section className="relative min-h-[85vh] overflow-hidden">
        {/* Teal Arc Layers — positioned top-right */}
        <div className="hero-bg absolute inset-0 pointer-events-none" aria-hidden="true">
          <img
            src={TealDark}
            alt=""
            className="absolute top-0 right-0 h-full w-auto max-w-[70%] object-contain object-right-top select-none"
          />
          <img
            src={TealLight}
            alt=""
            className="absolute top-0 right-0 h-[95%] w-auto max-w-[65%] object-contain object-right-top select-none"
            style={{ transform: "translateX(2%) translateY(2%)" }}
          />
        </div>

        {/* Video — masked with curved edge, positioned right */}
        <div
          className="absolute top-0 right-0 h-full w-[55%] overflow-hidden"
          style={{
            clipPath: "ellipse(85% 100% at 75% 50%)",
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
          {/* Dark overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </div>

        {/* Left Vertical Icon Column */}
        <div className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-10">
          {sideIcons.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group flex flex-col items-center gap-2 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-full bg-white/90 shadow-md flex items-center justify-center transition-shadow duration-200 group-hover:shadow-lg">
                <img src={item.icon} alt="" className="w-9 h-9" />
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

        {/* Hero Content — center/left aligned */}
        <div className="relative z-10 flex flex-col justify-center min-h-[85vh] px-8 lg:px-20 max-w-[600px]">
          {/* Logo */}
          <div className="hero-load-1 mb-6">
            <img
              src={LogoPrimary}
              alt="Beyonder"
              className="h-16 lg:h-20 w-auto"
            />
          </div>

          {/* Title */}
          <h1
            className="hero-load-2 text-4xl lg:text-5xl font-bold mb-2"
            style={{ color: "hsl(207, 56%, 19%)" }}
          >
            Beyonder
          </h1>

          {/* Subtitle */}
          <p
            className="hero-load-2 text-lg lg:text-xl font-light tracking-wide mb-10"
            style={{ color: "hsl(207, 56%, 19%)" }}
          >
            SEND Community Hub
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hero-load-3 w-full max-w-md mb-8">
            <div className="relative group">
              <input
                type="text"
                placeholder="What are you looking for today?"
                className="w-full h-14 rounded-full bg-white pl-6 pr-16 text-base shadow-md
                  focus:outline-none focus:ring-2 focus:ring-[hsl(176,100%,37%)]/50
                  transition-all duration-200
                  group-hover:shadow-lg group-hover:-translate-y-0.5
                  hero-search-bar"
                style={{ color: "hsl(207, 56%, 19%)" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full flex items-center justify-center
                  transition-colors duration-150"
                style={{ backgroundColor: "hsl(207, 56%, 19%)" }}
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-white" />
              </button>
            </div>
          </form>

          {/* CTA Buttons — stacked */}
          <div className="hero-load-4 flex flex-col sm:flex-row gap-3 mb-6">
            <Button
              size="lg"
              className="rounded-full h-13 px-8 text-base font-medium shadow-md
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
              className="rounded-full h-13 px-8 text-base font-medium shadow-md
                transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] active:duration-100"
              style={{
                backgroundColor: "hsl(207, 56%, 19%)",
                color: "#FFFFFF",
              }}
              asChild
            >
              <Link to="/community">Community Groups</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============ CATEGORY SECTION ============ */}
      <section className="relative z-10 py-16 lg:py-20">
        <div className="container max-w-5xl px-6">
          {/* Section divider + title */}
          <div className="mb-10 text-center">
            <div
              className="w-16 h-0.5 mx-auto mb-4"
              style={{ backgroundColor: "hsl(176, 100%, 37%)" }}
            />
            <h2
              className="text-2xl lg:text-3xl font-light"
              style={{ color: "hsl(176, 100%, 37%)" }}
            >
              Choose by Category
            </h2>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categoryCards.map((card) => (
              <Link key={card.title} to={card.to}>
                <div
                  className="rounded-2xl p-6 flex flex-col items-center text-center gap-4
                    transition-all duration-200 hover:-translate-y-2 hover:shadow-lg
                    active:scale-[0.98] active:duration-100"
                  style={{
                    backgroundColor: "hsl(37, 60%, 93%)",
                    border: "1px solid hsl(42, 93%, 70%)",
                  }}
                >
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img src={card.icon} alt="" className="w-14 h-14" />
                  </div>
                  <h3
                    className="text-base lg:text-lg font-medium"
                    style={{ color: "hsl(207, 56%, 19%)" }}
                  >
                    {card.title}
                  </h3>
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
