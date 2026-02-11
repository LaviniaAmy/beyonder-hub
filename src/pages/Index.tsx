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
      {/* Hero */}
      <section className="bg-accent py-20 text-accent-foreground">
        <div className="container text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Supporting SEND families,{" "}
            <span className="text-primary">together</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-80">
            Find trusted services, connect with your community, and access the
            support your family deserves.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mx-auto flex max-w-lg gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="What are you looking for today?"
                className="bg-background pl-10 text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/explore">Explore Services</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/community">Community Groups</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((card) => (
              <Link key={card.title} to={card.link}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col items-start gap-3 p-6">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <card.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="border-t bg-muted py-12">
        <div className="container">
          <h2 className="mb-6 text-center text-2xl font-semibold">Quick Links</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categoryLinks.map((cat) => (
              <Link key={cat.label} to={cat.to}>
                <Button variant="outline" className="gap-2">
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
