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
      {/* ============ HERO SECTION ============ */}
      <section className="relative w-full h-[650px] overflow-hidden flex items-center">
        {/* BACKGROUND GRADIENT (Cream) */}
        <div className="absolute inset-0 bg-beige-gradient z-0" />

        {/* RIGHT SIDE: Background Layers & Video */}
        <div className="absolute top-0 right-0 h-full pointer-events-none z-10 w-[55%] min-w-[712px] lg:w-[48%]">
          {/* Teal Layers - behind video mask */}
          <img
            src={TealLight}
            className="absolute top-0 right-0 h-full w-[155%] lg:w-[130%] object-contain z-10 scale-[1.35] -translate-x-[28%] lg:scale-[1.5] lg:-translate-x-[38%] translate-y-[6%]"
            alt=""
          />

          <img
            src={TealDark}
            className="absolute top-0 right-0 h-full w-[155%] lg:w-[130%] object-contain z-20 scale-[1.35] -translate-x-[28%] lg:scale-[1.5] lg:-translate-x-[38%] translate-y-[6%]"
            alt=""
          />

          {/* Curved Video Mask (responsive clip-path) */}
          <div
            className="absolute inset-0 z-30 overflow-hidden lg:[clip-path:ellipse(78%_92%_at_93%_56%)]"
            style={{ clipPath: "ellipse(82% 92% at 95% 56%)" }}
          >
            <video src={StarMovie} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          </div>

          {/* Logo & Text - Highest Z-index in the right column */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-40 -translate-y-[35px]">
            <img src={LogoPrimary} className="w-[480px] mb-3" alt="Beyonder" />
            <p className="text-white text-xl font-light tracking-widest">SEND Community Hub</p>
          </div>
        </div>

        {/* LEFT SIDE CONTENT - High Z-index to stay above background */}
        <div className="container mx-auto px-10 relative z-20 flex flex-col gap-10 py-20">
          {/* Vertical Icon Stack */}
          <div className="flex flex-col gap-6 ml-6">
            {sideIcons.map((item) => (
              <Link key={item.label} to={item.to} className="flex items-center gap-5 group">
                <div className="w-14 h-14 rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                  <img src={item.icon} className="w-full h-full object-cover" alt={item.label} />
                </div>
                <span className="text-lg font-medium text-[#0A1A2F] group-hover:text-[#1DB8AB]">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Search Bar & CTAs */}
          <div className="flex flex-col gap-6 mt-2 lg:absolute lg:left-[420px] lg:top-[330px]">
            <form
              onSubmit={handleSearch}
              className="relative w-full bg-white rounded-full shadow-lg flex items-center px-6 py-3.5 border border-black/5"
            >
              <Search className="w-5 h-5 text-[#0A1A2F]/60 mr-3" />
              <div className="w-px h-6 bg-black/10 mx-2"></div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="How can we help you today?"
                className="flex-1 text-[#0A1A2F] placeholder-[#0A1A2F]/50 focus:outline-none text-lg"
              />
            </form>

            <div className="flex flex-col gap-6 mt-2 lg:ml-[250px] lg:-mt-[60px]">
              <Button
                className="bg-[#0A1A2F] text-white px-10 py-2 rounded-full text-lg font-semibold shadow-lg hover:bg-[#0C223D] w-[260px] h-auto border border-[#1DB8AB]"
                onClick={() => navigate("/explore")}
              >
                Explore Services
              </Button>

              <Button
                className="bg-white text-[#0A1A2F] px-10 py-2 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-50 w-[260px] h-auto border border-transparent"
                onClick={() => navigate("/community")}
              >
                Community groups
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORY SECTION ============ */}
      <section
        className="relative py-24"
        style={{
          background: "linear-gradient(to top, #123447 0%, #F8F7F3 70%)",
        }}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex justify-center mb-6">
            <div className="h-[2px] w-40 bg-[#1DB8AB] rounded-full" />
          </div>

          <h2 className="text-center text-4xl font-light mb-12 text-[#1DB8AB]">Choose by Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoryCards.map((card) => (
              <Link key={card.title} to={card.to} className="group">
                <div
                  className="rounded-3xl px-7 py-5 flex items-center justify-between gap-4 transition-all duration-300 shadow-sm group-hover:-translate-y-1 group-hover:shadow-lg"
                  style={{
                    backgroundColor: "hsl(37, 60%, 93%)",
                    border: "1.5px solid hsl(42, 93%, 73%)",
                  }}
                >
                  <h3 className="text-lg font-bold leading-tight max-w-[140px] text-[#0A1A2F]">{card.title}</h3>
                  <div className="w-14 h-14 flex-shrink-0">
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
