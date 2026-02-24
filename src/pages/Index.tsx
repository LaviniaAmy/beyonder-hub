import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, BookOpen, Briefcase, Heart, Star, Bell, Stethoscope, Users, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroBackground from "@/components/HeroBackground";

const featureCallouts = [
  {
    icon: MapPin,
    title: "Find Local Support",
    subtitle: "Services, professionals, and organisations near you",
    link: "/providers?view=local",
  },
  {
    icon: BookOpen,
    title: "Guides & Understanding",
    subtitle: "Clear explanations, tools, and lived experience",
    link: "/guides",
  },
  {
    icon: Briefcase,
    title: "Work With Beyonder",
    subtitle: "For professionals, organisations & service providers",
    link: "/for-providers",
  },
];

const categoryCards = [
  {
    icon: Heart,
    title: "Therapists & specialists",
    to: "/providers?category=therapists",
    color: "from-[hsl(220,50%,22%)] to-[hsl(220,45%,28%)]",
  },
  {
    icon: Star,
    title: "Inclusive clubs & activities",
    to: "/providers?category=activities",
    color: "from-[hsl(174,45%,35%)] to-[hsl(174,40%,42%)]",
  },
  {
    icon: Bell,
    title: "SEND news & updates",
    to: "/news",
    color: "from-[hsl(170,30%,30%)] to-[hsl(174,35%,38%)]",
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
    <div>
      {/* Hero Section — Full viewport scenic illustration */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">
        <HeroBackground />

        {/* Hero content — staggered fade-in */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-3xl mx-auto">
          {/* Logo / Brand */}
          <h1
            className="hero-load-1 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-2"
            style={{ color: "hsl(40, 30%, 98%)" }}
          >
            Bey
            <span className="text-primary">●</span>
            nder
          </h1>
          <p
            className="hero-load-2 text-lg sm:text-xl font-light tracking-wide mb-12"
            style={{ color: "hsl(40, 30%, 92%)" }}
          >
            SEND community Hub
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hero-load-3 w-full max-w-xl mb-8"
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="What are you looking for today?"
                className="w-full h-14 rounded-full bg-white/95 backdrop-blur-sm pl-6 pr-16 text-foreground text-base shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                  transition-all duration-200
                  group-hover:shadow-xl group-hover:-translate-y-0.5
                  hero-search-bar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary flex items-center justify-center
                  hover:bg-primary/90 transition-colors duration-150"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-primary-foreground" />
              </button>
            </div>
          </form>

          {/* Pill Buttons */}
          <div className="hero-load-4 flex flex-wrap justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="rounded-full h-13 px-8 text-base font-medium bg-primary hover:bg-primary/90 shadow-lg
                transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] active:duration-100"
              asChild
            >
              <Link to="/explore">Explore Services &gt;</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-13 px-8 text-base font-medium
                border-white/30 text-white bg-white/10 backdrop-blur-sm
                hover:bg-white/20 hover:border-white/40 shadow-lg
                transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] active:duration-100"
              asChild
            >
              <Link to="/community">Community Groups &gt;</Link>
            </Button>
          </div>

          {/* Feature Callouts */}
          <div className="hero-load-5 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-3xl">
            {featureCallouts.map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className="group flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="mb-3 rounded-2xl bg-white/10 backdrop-blur-sm p-4 transition-all duration-200 group-hover:bg-white/15 group-hover:shadow-lg">
                  <item.icon className="h-8 w-8" style={{ color: "hsl(28, 85%, 65%)" }} />
                </div>
                <h3 className="text-base font-semibold mb-1" style={{ color: "hsl(40, 30%, 98%)" }}>
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: "hsl(40, 30%, 85%)" }}>
                  {item.subtitle}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Cards Section — slightly overlapping hero bottom */}
      <section className="relative z-10 -mt-8 pb-20">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categoryCards.map((card) => (
              <Link key={card.title} to={card.to}>
                <Card
                  className={`bg-gradient-to-br ${card.color} border-0 shadow-lg
                    transition-all duration-200 hover:-translate-y-2 hover:shadow-2xl
                    active:scale-[0.98] active:duration-100 overflow-hidden`}
                >
                  <CardContent className="flex items-center gap-5 p-6">
                    <div className="rounded-xl bg-white/10 p-3 flex-shrink-0">
                      <card.icon className="h-8 w-8" style={{ color: "hsl(28, 85%, 65%)" }} />
                    </div>
                    <h3 className="text-lg font-bold leading-tight" style={{ color: "hsl(40, 30%, 98%)" }}>
                      {card.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
