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
    <div className="w-full bg-[#F8F7F3]">
      {/* ============ REFINED HERO SECTION ============ */}
      <section className="relative w-full min-h-[600px] overflow-hidden flex items-center">
        {/* RIGHT SIDE: Background Layers & Video */}
        <div className="absolute top-0 right-0 w-[60%] h-full pointer-events-none">
          {/* Teal Layers */}
          <img src={TealLight} className="absolute inset-0 w-full h-full object-contain z-0" alt="" />
          <img src={TealDark} className="absolute inset-0 w-full h-full object-contain z-10" alt="" />

          {/* Curved Video Mask */}
          <div className="absolute inset-0 z-20 overflow-hidden" style={{ clipPath: "ellipse(90% 100% at 100% 50%)" }}>
            <video src={StarMovie} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          </div>

          {/* Logo Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pt-10">
            <img src={LogoPrimary} className="w-[380px] mb-2" alt="Beyonder" />
            <p className="text-white text-2xl font-light tracking-widest opacity-90">SEND Community Hub</p>
          </div>
        </div>

        {/* LEFT SIDE: Icons, Search, and Buttons */}
        <div className="container mx-auto px-10 relative z-40 flex flex-col gap-12 py-20">
          {/* Side Icons */}
          <div className="flex flex-col gap-8 ml-4">
            {sideIcons.map((item) => (
              <Link key={item.label} to={item.to} className="flex items-center gap-5 group">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                  <img src={item.icon} className="w-full h-full object-cover" alt={item.label} />
                </div>
                <span className="text-xl font-medium text-[#0A1A2F] group-hover:text-[#1DB8AB] transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Search & CTAs */}
          <div className="flex flex-col gap-6 max-w-xl">
            <form
              onSubmit={handleSearch}
              className="relative w-full bg-white rounded-full shadow-lg flex items-center px-6 py-4 border border-black/5"
            >
              <Search className="w-6 h-6 text-[#0A1A2F]/60 mr-3" />
              <div className="w-px h-6 bg-black/10 mx-2"></div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="How can we help you today?"
                className="flex-1 text-[#0A1A2F] placeholder-[#0A1A2F]/50 focus:outline-none text-lg"
              />
            </form>

            <div className="flex flex-col gap-4 pl-12">
              <Button
                className="bg-[#0A1A2F] text-white px-12 py-7 rounded-full text-xl font-semibold shadow-lg hover:bg-[#0C223D] transition-all w-fit"
                onClick={() => navigate("/explore")}
              >
                Explore Services
              </Button>
              <Button
                className="bg-white text-[#0A1A2F] border-2 border-[#0A1A2F] px-12 py-7 rounded-full text-xl font-semibold shadow-lg hover:bg-gray-50 transition-all w-fit"
                onClick={() => navigate("/community")}
              >
                Community groups
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORY SECTION ============ */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex justify-center mb-6">
            <div className="h-[3px] w-48 bg-[#1DB8AB] rounded-full" />
          </div>

          <h2 className="text-center text-5xl font-light mb-16 text-[#1DB8AB]">Choose by Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoryCards.map((card) => (
              <Link key={card.title} to={card.to} className="group">
                <div
                  className="rounded-[32px] px-8 py-7 flex items-center justify-between gap-4 transition-all duration-300 shadow-md group-hover:-translate-y-2 group-hover:shadow-xl"
                  style={{
                    backgroundColor: "#FAF3E0",
                    border: "2px solid #F3D18C",
                  }}
                >
                  <h3 className="text-xl font-bold leading-tight max-w-[150px] text-[#0A1A2F]">{card.title}</h3>
                  <div className="w-16 h-16 flex-shrink-0">
                    <img src={card.icon} alt="" className="w-full h-full object-contain" />
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
