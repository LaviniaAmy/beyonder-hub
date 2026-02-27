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
      <section className="relative w-full bg-[#F8F7F3] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 relative">
          {/* LEFT COLUMN */}
          <div className="flex flex-col justify-center gap-10 py-20 pl-10 z-20">
            {/* Icon Column */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <img src="/Local Icon" className="w-14 h-14" />
                <span className="text-lg font-medium text-[#0A1A2F]">Local Support</span>
              </div>

              <div className="flex items-center gap-4">
                <img src="/Guides Icon" className="w-14 h-14" />
                <span className="text-lg font-medium text-[#0A1A2F]">Guides & Info</span>
              </div>

              <div className="flex items-center gap-4">
                <img src="/Work with Icon" className="w-14 h-14" />
                <span className="text-lg font-medium text-[#0A1A2F]">Work with us</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-md bg-white rounded-full shadow-md flex items-center px-6 py-4 gap-4">
              <img src="/Search Icon" className="w-6 h-6 opacity-70" />
              <div className="w-px h-6 bg-[#0A1A2F]/40"></div>
              <input
                type="text"
                placeholder="How can we help you today?"
                className="flex-1 text-[#0A1A2F] placeholder-[#0A1A2F]/60 focus:outline-none"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 relative left-10">
              <button className="bg-[#0A1A2F] text-white px-8 py-4 rounded-xl text-lg shadow-md hover:bg-[#0C223D] transition">
                Explore Services
              </button>
              <button className="bg-white text-[#0A1A2F] border border-[#0A1A2F] px-8 py-4 rounded-xl text-lg shadow-md hover:bg-[#F0F0F0] transition">
                Community groups
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="relative h-[700px] flex items-center justify-center">
            {/* Teal Layer Light */}
            <img src="/Teal Layer light" className="absolute inset-0 w-full h-full object-cover z-0" />

            {/* Teal Layer Dark */}
            <img src="/Teal Layer dark" className="absolute inset-0 w-full h-full object-cover z-10" />

            {/* Curved Video Mask */}
            <div className="absolute inset-0 z-20 overflow-hidden rounded-[0_0_200px_200px]">
              <video src="/Star Movie mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
            </div>

            {/* Logo */}
            <img src="/Logo- Primary" className="absolute top-20 w-64 z-30" />
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
          <h2 className="text-center text-3xl lg:text-4xl font-light mb-12" style={{ color: "hsl(176, 100%, 37%)" }}>
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
