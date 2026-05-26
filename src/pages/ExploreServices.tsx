import { Link } from "react-router-dom";
import { Heart, Users, ShoppingBag, GraduationCap, HandHeart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, regions } from "@/data/mockData";
import { useState } from "react";
import PageBanner from "@/components/PageBanner";

const iconMap: Record<string, React.ElementType> = {
  Heart, Users, ShoppingBag, GraduationCap, HandHeart,
};

const ExploreServices = () => {
  const [region, setRegion] = useState("all");

  return (
    <div className="bg-background min-h-screen">
      <PageBanner title="Explore Services" subtitle="Choose a category to find the right support for your family." />
      <div className="container animate-fade-in py-12">

        {/* Region Dropdown */}
        <div className="mx-auto mb-10 max-w-xs">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-full bg-card border-0 shadow-card">
              <SelectValue placeholder="Select your region" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Heart;
            const regionParam = region !== "all" ? `&region=${encodeURIComponent(region)}` : "";
            return (
              <Link key={cat.id} to={`/providers?category=${cat.id}${regionParam}`}>
                <Card className="h-full border-0 shadow-card card-hover-lift">
                  <CardContent className="flex items-start gap-4 p-7">
                    <div className="rounded-xl bg-teal-500/10 p-3">
                      <Icon className="h-6 w-6 text-teal-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{cat.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <p className="mt-14 text-center text-sm text-accent-foreground/50">
          All providers on Beyonder are reviewed by our team. Your family's wellbeing is our priority.
        </p>
      </div>
    </div>
  );
};

export default ExploreServices;
