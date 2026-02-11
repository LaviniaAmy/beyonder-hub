import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MapPin, Star, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, providers } from "@/data/mockData";

const deliveryOptions = [
  { value: "all", label: "All Delivery Types" },
  { value: "in-person", label: "In-Person" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
];

const ProviderDirectory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [delivery, setDelivery] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = useMemo(() => {
    let result = providers;
    if (activeCategory !== "all") {
      const cat = categories.find((c) => c.id === activeCategory);
      if (cat) result = result.filter((p) => p.type === cat.providerType);
    }
    if (delivery !== "all") result = result.filter((p) => p.deliveryFormat === delivery);
    return result;
  }, [activeCategory, delivery]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="py-8">
      <div className="container">
        <h1 className="mb-6 text-3xl font-bold">Provider Directory</h1>

        {/* Category Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchParams({})}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSearchParams({ category: cat.id })}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Select value={delivery} onValueChange={setDelivery}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {deliveryOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active filters */}
        {(activeCategory !== "all" || delivery !== "all") && (
          <div className="mb-4 flex flex-wrap gap-2">
            {activeCategory !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {categories.find((c) => c.id === activeCategory)?.name}
                <button onClick={() => setSearchParams({})} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {delivery !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {delivery}
                <button onClick={() => setDelivery("all")} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
          </div>
        )}

        {/* Provider Cards */}
        {visible.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No providers found matching your filters.</p>
            <Button variant="link" onClick={() => { setSearchParams({}); setDelivery("all"); }}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((provider) => (
              <Link key={provider.id} to={`/provider/${provider.id}`}>
                <Card className={`h-full transition-shadow hover:shadow-md ${provider.type === "product" ? "border-primary/20 bg-primary/5" : ""}`}>
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-2 text-xs">{provider.typeBadge}</Badge>
                        <h3 className="font-semibold">{provider.name}</h3>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); }} className="text-muted-foreground hover:text-primary">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">{provider.shortDescription}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{provider.location}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" />{provider.rating}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {provider.needsSupported.slice(0, 3).map((need) => (
                        <Badge key={need} variant="outline" className="text-xs">{need}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {visibleCount < filtered.length && (
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => setVisibleCount((c) => c + 6)}>Load More</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDirectory;
