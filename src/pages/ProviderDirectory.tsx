import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MapPin, Star, Bookmark, Heart, Users, Layers, X as XIcon } from "lucide-react";
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

    // 1) Delivery type filtering — strict match, no cross-inclusion
    if (delivery !== "all") {
      result = result.filter((p) => {
        // "Online" shows ONLY online providers (not hybrid)
        if (delivery === "online") return p.deliveryFormat === "online";
        // "In-person" shows ONLY in-person providers (not hybrid)
        if (delivery === "in-person") return p.deliveryFormat === "in-person";
        // "Hybrid" shows ONLY hybrid providers
        if (delivery === "hybrid") return p.deliveryFormat === "hybrid";
        return true;
      });
    }

    // 2) Region filtering
    if (regionParam !== "all") {
      result = result.filter((p) => {
        // Product sellers are purchased nationally — always shown regardless of region
        if (p.category_type === "product") return true;
        // Online-only providers are region-independent — Online delivery ignores region intentionally
        if (p.deliveryFormat === "online") return true;
        // Hybrid providers are region-scoped (separate from online) — only shown in their region
        if (p.deliveryFormat === "hybrid") return p.region === regionParam;
        // In-person providers are strictly region-bound
        return p.region === regionParam;
      });
    }
    // When Delivery = "Online", region filter is effectively ignored because
    // all online providers pass through regardless of region selection above.

    // 3) Category filtering
    if (activeCategory !== "all") {
      const cat = categories.find((c) => c.id === activeCategory);
      if (cat) result = result.filter((p) => p.type === cat.providerType);
    }

    // 4) Search filtering — partial, case-insensitive, across multiple fields + tags
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
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
  const hasActiveFilters = activeCategory !== "all" || delivery !== "all" || searchQuery || regionParam !== "all";

  return (
    <div className="bg-navy-gradient min-h-screen py-10">
      <div className="container">
        <h1 className="mb-8 text-3xl font-bold text-accent-foreground animate-fade-in">
          {isLocalView ? "Find Local Support" : "Provider Directory"}
        </h1>

        {/* Filters — elevated card */}
        <div className="mb-8 rounded-xl bg-card p-6 shadow-card space-y-4">
          {/* Region Dropdown */}
          <div className="flex flex-wrap items-center gap-4">
            <Select value={regionParam} onValueChange={(v) => updateParams({ region: v === "all" ? null : v })}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Select your region" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={delivery} onValueChange={setDelivery}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                {deliveryOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => { setSearchParams({}); setDelivery("all"); setLocalSearch(""); }}
              >
                Clear all filters
              </Button>
            )}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg">
            <Input
              placeholder="Search providers..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <Button type="submit" className="bg-teal-500 hover:bg-teal-400">Search</Button>
          </form>
        </div>

        {/* Local View Category Cards */}
        {isLocalView && (
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {localCategoryCards.map((card) => (
              <button
                key={card.category}
                onClick={() => updateParams({ category: card.category === "all" ? null : card.category, view: null })}
                className={`flex items-center gap-3 rounded-xl bg-card p-4 text-left transition-all duration-150 shadow-card card-hover-lift ${
                  activeCategory === card.category ? "ring-2 ring-teal-500" : ""
                }`}
              >
                <div className="rounded-xl bg-teal-500/10 p-2">
                  <card.icon className="h-5 w-5 text-teal-500" />
                </div>
                <span className="font-medium">{card.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Category Tabs */}
        {!isLocalView && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => updateParams({ category: null })}
              className={activeCategory === "all" ? "bg-teal-500 hover:bg-teal-400" : "border-navy-600 text-accent-foreground/80 hover:bg-navy-700"}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => updateParams({ category: cat.id })}
                className={activeCategory === cat.id ? "bg-teal-500 hover:bg-teal-400" : "border-navy-600 text-accent-foreground/80 hover:bg-navy-700"}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        )}

        {/* Active filters — soft pill badges with teal indicator */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap gap-2">
            {regionParam !== "all" && (
              <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                {regionParam}
                <button onClick={() => updateParams({ region: null })} className="ml-1 hover:text-accent-foreground"><XIcon className="h-3 w-3" /></button>
              </Badge>
            )}
            {activeCategory !== "all" && (
              <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                {categories.find((c) => c.id === activeCategory)?.name}
                <button onClick={() => updateParams({ category: null })} className="ml-1 hover:text-accent-foreground"><XIcon className="h-3 w-3" /></button>
              </Badge>
            )}
            {searchQuery && (
              <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                "{searchQuery}"
                <button onClick={() => { setLocalSearch(""); updateParams({ search: null }); }} className="ml-1 hover:text-accent-foreground"><XIcon className="h-3 w-3" /></button>
              </Badge>
            )}
            {delivery !== "all" && (
              <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                {delivery}
                <button onClick={() => setDelivery("all")} className="ml-1 hover:text-accent-foreground"><XIcon className="h-3 w-3" /></button>
              </Badge>
            )}
          </div>
        )}

        {/* Provider Cards */}
        {visible.length === 0 ? (
          <div className="py-20 text-center rounded-xl bg-card shadow-card">
            <p className="text-lg text-foreground mb-2">We couldn't find results for this combination yet.</p>
            <p className="text-muted-foreground mb-6">You're not alone — try adjusting your filters.</p>
            <Button variant="outline" onClick={() => { setSearchParams({}); setDelivery("all"); setLocalSearch(""); }}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((provider) => (
              <Link key={provider.id} to={`/provider/${provider.id}`}>
                <Card className={`h-full border-0 shadow-card card-hover-lift ${provider.type === "product" ? "ring-1 ring-teal-500/20" : ""}`}>
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-2 text-xs">{provider.typeBadge}</Badge>
                        <h3 className="font-semibold">{provider.name}</h3>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); }} className="text-muted-foreground hover:text-teal-500 transition-colors duration-150">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground leading-relaxed">{provider.shortDescription}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{provider.location}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-orange-400 text-orange-400" />{provider.rating}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {provider.needsSupported.slice(0, 3).map((need) => (
                        <Badge key={need} variant="outline" className="text-xs border-border/60">{need}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {visibleCount < filtered.length && (
          <div className="mt-10 text-center">
            <Button variant="outline" className="border-navy-600 text-accent-foreground/80 hover:bg-navy-700" onClick={() => setVisibleCount((c) => c + 6)}>Load More</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDirectory;
