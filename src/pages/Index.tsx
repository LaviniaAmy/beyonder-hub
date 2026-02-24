import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, BookOpen, Briefcase, Stethoscope, Users, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const featureCards = [
  { icon: Heart, title: "Find Local Support", description: "Discover trusted therapists, activities, and services near you — all vetted by the SEND community.", link: "/providers?view=local" },
  { icon: BookOpen, title: "Guides & Understanding", description: "Clear, jargon-free guides to help you navigate assessments, EHCPs, and everyday challenges.", link: "/guides" },
  { icon: Briefcase, title: "Work With Beyonder", description: "Are you a provider? Join our growing community and connect with families who need your services.", link: "/for-providers" },
];

const categoryLinks = [
  { icon: Stethoscope, label: "Therapists & Specialists", to: "/providers?category=therapists" },
  { icon: Users, label: "Inclusive Clubs & Activities", to: "/providers?category=activities" },
  { icon: Newspaper, label: "Latest SEND News", to: "/news" },
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
      {/* Hero — navy gradient */}
      <section className="bg-navy-gradient py-24 text-accent-foreground">
        <div className="container text-center animate-fade-in">
          <h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Supporting SEND families,{" "}
            <span className="text-teal-400">together</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-accent-foreground/75 leading-relaxed">
            Find trusted services, connect with your community, and access the
            support your family deserves.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mx-auto flex max-w-lg gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="What are you looking for today?"
                className="bg-background pl-10 text-foreground border-0 shadow-card h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-teal-500 hover:bg-teal-400 h-12 px-6">Search</Button>
          </form>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-400 shadow-lg" asChild>
              <Link to="/explore">Explore Services</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-accent-foreground/20 text-accent-foreground hover:bg-navy-700" asChild>
              <Link to="/community">Community Groups</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Cards — elevated on warm-white */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((card) => (
              <Link key={card.title} to={card.link}>
                <Card className="h-full shadow-card card-hover-lift border-0">
                  <CardContent className="flex flex-col items-start gap-4 p-8">
                    <div className="rounded-xl bg-teal-500/10 p-3">
                      <card.icon className="h-6 w-6 text-teal-500" />
                    </div>
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Quick Links — navy section */}
      <section className="bg-navy-gradient py-16">
        <div className="container">
          <h2 className="mb-8 text-center text-2xl font-semibold text-accent-foreground">Quick Links</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categoryLinks.map((cat) => (
              <Link key={cat.label} to={cat.to}>
                <Button variant="outline" className="gap-2 border-navy-600 text-accent-foreground/80 hover:bg-navy-700 hover:text-teal-400 transition-colors duration-150">
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
