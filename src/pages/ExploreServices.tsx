import { Link } from "react-router-dom";
import { Heart, Users, ShoppingBag, GraduationCap, HandHeart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, regions } from "@/data/mockData";
import { useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  Heart, Users, ShoppingBag, GraduationCap, HandHeart,
};

const ExploreServices = () => {
  const [region, setRegion] = useState("all");

  return (
    <div className="py-12">
      <div className="container">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold">How can Beyonder help today?</h1>
          <p className="text-muted-foreground">Choose a category to find the right support for your family.</p>
        </div>

        {/* Region Dropdown */}
        <div className="mx-auto mb-8 max-w-xs">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-full text-base">
              <SelectValue placeholder="Select your region" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Heart;
            const regionParam = region !== "all" ? `&region=${encodeURIComponent(region)}` : "";
            return (
              <Link key={cat.id} to={`/providers?category=${cat.id}${regionParam}`}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{cat.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          All providers on Beyonder are reviewed by our team. Your family's wellbeing is our priority.
        </p>
      </div>
    </div>
  );
};

export default ExploreServices;
