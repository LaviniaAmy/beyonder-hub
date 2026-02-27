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
import StarMovie from "@/../public/video/star-movie.mp4";

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
    <div className="w-full bg-beige-gradient">
      {/* ============ HERO SECTION ============ */}
      <section className="relative w-full bg-[#F8F7F3] overflow-visible">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 relative">
          {/* LEFT COLUMN */}
          <div className="flex flex-col justify-center gap-10 py-20 pl-10 z-20">
            {/* Icon Column – vertical, text underneath */}
            <div className="flex flex-row gap-10">
              <div className="flex flex-col items-center gap-3">
                <img src={LocalIcon} className="w-16 h-16" />
                <span className="text-sm font-medium text-[#0A1A2F]">Local Support</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img src={GuidesIcon} className="w-16 h-16" />
                <span className="text-sm font-medium text-[#0A1A2F]">Guides & Info</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img src={WorkIcon} className="w-16 h-16" />
                <span className="text-sm font-medium text-[#0A1A2F]">Work with us</span>
              </div>
            </div>

            {/* Search Bar – slightly lower */}
            <div className="w-full max-w-md bg-white rounded-full shadow-md flex items-center px-6 py-3 gap-4 mt-4">
              <Search className="w-5 h-5 text-[#0A1A2F]/70" />
              <div className="w-px h-6 bg-[#0A1A2F]/40"></div>
              <input
                type="text"
                placeholder="How can we help you today?"
                className="flex-1 text-sm text-[#0A1A2F] placeholder-[#0A1A2F]/60 focus:outline-none"
              />
            </div>

            {/* CTA Buttons – pill, smaller, no outline on second */}
            <div className="flex flex-col gap-3 relative left-3 mt-2 w-1/2">
              <button className="bg-[#0A1A2F] text-white px-7 py-3 rounded-full text-sm font-medium shadow-md hover:bg-[#0C223D] transition">
                Explore Services
              </button>
              <button className="bg-white text-[#0A1A2F] px-7 py-3 rounded-full text-sm font-medium shadow-md hover:bg-[#F5F5F5] transition">
                Community groups
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="relative h-[540px] flex items-center justify-center">
            {/* Teal Layer Light */}
            <img src={TealLight} className="absolute inset-0 w-full h-full object-cover z-0" />

            {/* Teal Layer Dark */}
            <img src={TealDark} className="absolute inset-0 w-full h-full object-cover z-10" />

            {/* Curved Video Mask — LEFT SIDE CURVE */}
            <div className="absolute inset-0 z-20 overflow-hidden rounded-[200px_0_0_200px]">
              <video src={StarMovie} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            </div>

            {/* Logo – larger, same position */}
            <img src={LogoPrimary} className="absolute top-16 w-80 z-30" />
          </div>
        </div>
      </section>

      {/* ============ CATEGORY SECTION ============ */}
      {/* ============ CATEGORY SECTION ============ */}
      <section
        className="relative py-16 lg:py-20"
        style={{ zIndex: 10, background: "linear-gradient(to top, hsl(207,56%,19%) 0%, hsl(207,56%,19%,0.02) 100%)" }}
      >
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
          <h2 className="text-center text-3xl lg:text-4xl font-light mb-12" style={{ color: "hsl(176, 100%, 37%)" }}>
            Choose by Category
          </h2>

          {/* Category Cards */}
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
                  <h3 className="text-base font-semibold leading-snug" style={{ color: "hsl(207, 56%, 19%)" }}>
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
