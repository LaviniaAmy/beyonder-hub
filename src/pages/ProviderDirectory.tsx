import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MapPin, Star, Bookmark, Heart, Users, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, providers, regions } from "@/data/mockData";

const deliveryOptions = [
  { value: "all", label: "All Delivery Types" },
  { value: "in-person", label: "In-Person" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
];

const localCategoryCards = [
  { icon: Heart, label: "Therapists & Specialists", category: "therapists" },
  { icon: Users, label: "Activities & Clubs", category: "activities" },
  { icon: Layers, label: "All Services In Your Area", category: "all" },
];

const ProviderDirectory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  const regionParam = searchParams.get("region") || "all";
  const isLocalView = searchParams.get("view") === "local";

  const [delivery, setDelivery] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "all" || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
    setVisibleCount(6);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: localSearch || null });
  };

  const filtered = useMemo(() => {
    let result = providers;

    // 1) Region filtering
    if (regionParam !== "all") {
      result = result.filter((p) => {
        // Product sellers are not region-restricted
        if (p.type === "product") return true;
        // Online-only providers show nationally
        if (p.region === "Online Only" || p.deliveryFormat === "online") return true;
        // Hybrid providers show in their region
        if (p.deliveryFormat === "hybrid") {
          return p.region === regionParam;
        }
        // In-person providers only in their region
        return p.region === regionParam;
      });
    }

    // 2) Delivery type filtering
    if (delivery !== "all") {
      result = result.filter((p) => {
        if (delivery === "online") return p.deliveryFormat === "online" || p.deliveryFormat === "hybrid";
        if (delivery === "in-person") return p.deliveryFormat === "in-person" || p.deliveryFormat === "hybrid";
        if (delivery === "hybrid") return p.deliveryFormat === "hybrid";
        return true;
      });
    }

    // 3) Category filtering
    if (activeCategory !== "all") {
      const cat = categories.find((c) => c.id === activeCategory);
      if (cat) result = result.filter((p) => p.type === cat.providerType);
    }

    // 4) Search filtering — partial, case-insensitive, across multiple fields + tags
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const categoryLabel = categories.find((c) => c.id === activeCategory)?.name?.toLowerCase() || "";
      result = result.filter((p) => {
        const catName = categories.find((c) => c.providerType === p.type)?.name?.toLowerCase() || "";
        const searchable = [
          p.name,
          p.description,
          p.shortDescription,
          p.typeBadge,
          catName,
          ...p.needsSupported,
          ...p.searchTags,
        ].map((s) => s.toLowerCase());
        return searchable.some((s) => s.includes(q));
      });
    }

    return result;
  }, [activeCategory, delivery, searchQuery, regionParam]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="py-8">
      <div className="container">
        <h1 className="mb-6 text-3xl font-bold">
          {isLocalView ? "Find Local Support" : "Provider Directory"}
        </h1>

        {/* Region Dropdown */}
        <div className="mb-6">
          <Select value={regionParam} onValueChange={(v) => updateParams({ region: v === "all" ? null : v })}>
            <SelectTrigger className="w-full max-w-xs text-base">
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

        {/* Local View Category Cards */}
        {isLocalView && (
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {localCategoryCards.map((card) => (
              <button
                key={card.category}
                onClick={() => updateParams({ category: card.category === "all" ? null : card.category, view: null })}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all hover:shadow-md hover:border-primary/30 ${
                  activeCategory === card.category ? "border-primary bg-primary/5" : ""
                }`}
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{card.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2 max-w-lg">
          <Input
            placeholder="Search providers..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </form>

        {/* Category Tabs */}
        {!isLocalView && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => updateParams({ category: null })}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => updateParams({ category: cat.id })}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Select value={delivery} onValueChange={setDelivery}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              {deliveryOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active filters */}
        {(activeCategory !== "all" || delivery !== "all" || searchQuery || regionParam !== "all") && (
          <div className="mb-4 flex flex-wrap gap-2">
            {regionParam !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {regionParam}
                <button onClick={() => updateParams({ region: null })} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {activeCategory !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {categories.find((c) => c.id === activeCategory)?.name}
                <button onClick={() => updateParams({ category: null })} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                "{searchQuery}"
                <button onClick={() => { setLocalSearch(""); updateParams({ search: null }); }} className="ml-1 hover:text-destructive">×</button>
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
            <Button variant="link" onClick={() => { setSearchParams({}); setDelivery("all"); setLocalSearch(""); }}>
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
