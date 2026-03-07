import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Bookmark,
  Heart,
  Users,
  Layers,
  X as XIcon,
  ShoppingBag,
  ShoppingCart,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, regions } from "@/data/mockData";
import { getActiveProviders } from "@/data/providerStore";

// ── Product catalogue filters ─────────────────────────────────
const PRODUCT_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "sensory", label: "Sensory & Regulation" },
  { value: "mobility", label: "Mobility & Accessibility" },
  { value: "communication", label: "Communication & Learning" },
  { value: "emotional", label: "Emotional Support" },
  { value: "motor", label: "Fine Motor Skills" },
  { value: "daily", label: "Daily Living Aids" },
];

const PRICE_RANGES = [
  { value: "all", label: "All Prices" },
  { value: "under10", label: "Under £10" },
  { value: "10to25", label: "£10 – £25" },
  { value: "25to50", label: "£25 – £50" },
  { value: "over50", label: "£50+" },
];

const NEED_FILTERS = [
  { value: "all", label: "All Needs" },
  { value: "Autism", label: "Autism" },
  { value: "ADHD", label: "ADHD" },
  { value: "Sensory Processing", label: "Sensory Processing" },
  { value: "Physical Disability", label: "Physical Disability" },
  { value: "Speech & Language", label: "Speech & Language" },
  { value: "Anxiety", label: "Anxiety" },
  { value: "Learning Disability", label: "Learning Disability" },
];

function parsePriceValue(price: string): number {
  const match = price.replace(/[£,]/g, "").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function priceInRange(value: number, range: string): boolean {
  if (range === "all") return true;
  if (range === "under10") return value < 10;
  if (range === "10to25") return value >= 10 && value <= 25;
  if (range === "25to50") return value > 25 && value <= 50;
  if (range === "over50") return value > 50;
  return true;
}

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

const supportSlugMap: Record<string, string> = {
  "speech-language": "speech",
  "speech-language-therapy": "speech",
  "occupational-therapy": "occupational",
  ehcp: "ehcp",
  speech: "speech",
};

const ProviderDirectory = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  const regionParam = searchParams.get("region") || "all";
  const supportParam = searchParams.get("support") || "";
  const needsParam = searchParams.get("needs") || "";
  const isLocalView = searchParams.get("view") === "local";

  const [delivery, setDelivery] = useState("all");
  const [ehcpOnly, setEhcpOnly] = useState(false); // 1.3 EHCP filter
  const [visibleCount, setVisibleCount] = useState(6);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const [productCategory, setProductCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [needFilter, setNeedFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  const isProductView = activeCategory === "products";

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

  const handleAddToCart = (key: string) => {
    setAddedToCart((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setAddedToCart((prev) => ({ ...prev, [key]: false })), 2000);
  };

  const filteredProviders = useMemo(() => {
    let result = getActiveProviders();
    if (delivery !== "all") {
      result = result.filter((p) => p.deliveryFormat === delivery);
    }
    const effectiveRegion = regionParam !== "all" ? regionParam : "";
    if (effectiveRegion) {
      result = result.filter((p) => {
        if (p.category_type === "product") return true;
        if (p.deliveryFormat === "online") return true;
        if (p.deliveryFormat === "hybrid") return p.region?.toLowerCase().includes(effectiveRegion.toLowerCase());
        return p.region?.toLowerCase().includes(effectiveRegion.toLowerCase());
      });
    }
    if (activeCategory !== "all") {
      const cat = categories.find((c) => c.id === activeCategory);
      if (cat) result = result.filter((p) => p.type === cat.providerType);
    }
    if (supportParam) {
      const term = supportSlugMap[supportParam] || supportParam.replace(/-/g, " ");
      const q = term.toLowerCase();
      result = result.filter((p) => {
        const searchable = [
          p.businessName,
          p.description,
          p.shortDescription,
          p.typeBadge,
          ...p.needsSupported,
          ...p.searchTags,
        ].map((s) => s.toLowerCase());
        return searchable.some((s) => s.includes(q));
      });
    }
    if (needsParam) {
      const q = needsParam.toLowerCase();
      result = result.filter((p) => {
        const searchable = [...p.needsSupported, ...p.searchTags, p.description, p.shortDescription].map((s) =>
          s.toLowerCase(),
        );
        return searchable.some((s) => s.includes(q));
      });
    }
    const effectiveSearch = searchQuery || localSearch;
    if (effectiveSearch) {
      const q = effectiveSearch.toLowerCase();
      result = result.filter((p) => {
        const catName = categories.find((c) => c.providerType === p.type)?.name?.toLowerCase() || "";
        const searchable = [
          p.businessName,
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
    // 1.3 — EHCP filter
    if (ehcpOnly) {
      result = result.filter((p) => p.ehcpSupport === true);
    }
    return result;
  }, [activeCategory, delivery, searchQuery, regionParam, supportParam, needsParam, localSearch, ehcpOnly]);

  const allLiveProducts = useMemo(() => {
    const providers = getActiveProviders().filter((p) => p.type === "product");
    return providers.flatMap((provider) =>
      (provider.products ?? []).map((prod, i) => ({
        key: `${provider.id}-${i}`,
        providerId: provider.id,
        providerName: provider.businessName,
        name: prod.name,
        price: prod.price,
        priceValue: parsePriceValue(prod.price),
        image: prod.image || "/placeholder.svg",
        shortDescription: prod.shortDescription || "",
        needTypes: provider.needsSupported,
      })),
    );
  }, []);

  const filteredProducts = useMemo(() => {
    let result = allLiveProducts;
    if (priceRange !== "all") result = result.filter((p) => priceInRange(p.priceValue, priceRange));
    if (needFilter !== "all") result = result.filter((p) => p.needTypes.includes(needFilter));
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.providerName.toLowerCase().includes(q) ||
          p.needTypes.some((n) => n.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [allLiveProducts, priceRange, needFilter, productSearch]);

  const visible = filteredProviders.slice(0, visibleCount);
  const hasActiveFilters =
    activeCategory !== "all" ||
    delivery !== "all" ||
    searchQuery ||
    regionParam !== "all" ||
    supportParam ||
    needsParam ||
    ehcpOnly;
  const hasProductFilters = priceRange !== "all" || needFilter !== "all" || productSearch;

  return (
    <div className="bg-navy-gradient min-h-screen py-10">
      <div className="container">
        <h1 className="mb-8 text-3xl font-bold text-accent-foreground animate-fade-in">
          {isLocalView ? "Find Local Support" : "Provider Directory"}
        </h1>

        {/* Main filters */}
        {!isProductView && (
          <div className="mb-8 rounded-xl bg-card p-6 shadow-card space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Select value={regionParam} onValueChange={(v) => updateParams({ region: v === "all" ? null : v })}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select your region" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={delivery} onValueChange={setDelivery}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  {deliveryOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 1.3 — EHCP filter toggle */}
              <button
                type="button"
                onClick={() => setEhcpOnly((v) => !v)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  ehcpOnly
                    ? "border-orange-500/60 bg-orange-500/10 text-orange-400"
                    : "border-border/60 text-muted-foreground hover:border-border"
                }`}
              >
                <Heart className="h-4 w-4" />
                EHCP Supported
              </button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSearchParams({});
                    setDelivery("all");
                    setLocalSearch("");
                    setEhcpOnly(false);
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
            <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg">
              <Input
                placeholder="Search providers..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
              <Button type="submit" className="bg-teal-500 hover:bg-teal-400">
                Search
              </Button>
            </form>
          </div>
        )}

        {/* Local View Category Cards */}
        {isLocalView && (
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {localCategoryCards.map((card) => (
              <button
                key={card.category}
                onClick={() => updateParams({ category: card.category === "all" ? null : card.category, view: null })}
                className={`flex items-center gap-3 rounded-xl bg-card p-4 text-left transition-all duration-150 shadow-card card-hover-lift ${activeCategory === card.category ? "ring-2 ring-teal-500" : ""}`}
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
              className={
                activeCategory === "all"
                  ? "bg-teal-500 hover:bg-teal-400"
                  : "border-navy-600 text-accent-foreground/80 hover:bg-navy-700"
              }
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => updateParams({ category: cat.id })}
                className={
                  activeCategory === cat.id
                    ? "bg-teal-500 hover:bg-teal-400"
                    : "border-navy-600 text-accent-foreground/80 hover:bg-navy-700"
                }
              >
                {cat.name}
              </Button>
            ))}
          </div>
        )}

        {/* Active filter pills */}
        {!isProductView && hasActiveFilters && (
          <div className="mb-6 flex flex-wrap gap-2">
            {regionParam !== "all" && (
              <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                {regionParam}
                <button onClick={() => updateParams({ region: null })} className="ml-1 hover:text-accent-foreground">
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {activeCategory !== "all" && (
              <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                {categories.find((c) => c.id === activeCategory)?.name}
                <button onClick={() => updateParams({ category: null })} className="ml-1 hover:text-accent-foreground">
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {supportParam && (
              <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                {supportParam.replace(/-/g, " ")}
                <button onClick={() => updateParams({ support: null })} className="ml-1 hover:text-accent-foreground">
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {needsParam && (
              <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                {needsParam}
                <button onClick={() => updateParams({ needs: null })} className="ml-1 hover:text-accent-foreground">
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                "{searchQuery}"
                <button
                  onClick={() => {
                    setLocalSearch("");
                    updateParams({ search: null });
                  }}
                  className="ml-1 hover:text-accent-foreground"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {delivery !== "all" && (
              <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                {delivery}
                <button onClick={() => setDelivery("all")} className="ml-1 hover:text-accent-foreground">
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {ehcpOnly && (
              <Badge className="gap-1 bg-orange-500/15 text-orange-400 border-0 px-3 py-1">
                EHCP Supported
                <button onClick={() => setEhcpOnly(false)} className="ml-1 hover:text-accent-foreground">
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* PRODUCT VIEW */}
        {isProductView ? (
          <div>
            <div className="mb-8 rounded-xl bg-card p-6 shadow-card space-y-4">
              <div className="flex flex-wrap gap-3">
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    {PRICE_RANGES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={needFilter} onValueChange={setNeedFilter}>
                  <SelectTrigger className="w-52">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    {NEED_FILTERS.map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        {n.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasProductFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setPriceRange("all");
                      setNeedFilter("all");
                      setProductSearch("");
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
              <div className="flex gap-2 max-w-lg">
                <Input
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
              {hasProductFilters && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {priceRange !== "all" && (
                    <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                      {PRICE_RANGES.find((r) => r.value === priceRange)?.label}
                      <button onClick={() => setPriceRange("all")} className="ml-1 hover:text-accent-foreground">
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {needFilter !== "all" && (
                    <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                      {needFilter}
                      <button onClick={() => setNeedFilter("all")} className="ml-1 hover:text-accent-foreground">
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {productSearch && (
                    <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                      "{productSearch}"
                      <button onClick={() => setProductSearch("")} className="ml-1 hover:text-accent-foreground">
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
            </p>

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-xl bg-card shadow-card">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-lg text-foreground mb-2">No products found.</p>
                <p className="text-muted-foreground mb-6">
                  {allLiveProducts.length === 0
                    ? "No products have been added yet."
                    : "Try adjusting your search or filters."}
                </p>
                {hasProductFilters && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPriceRange("all");
                      setNeedFilter("all");
                      setProductSearch("");
                    }}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => {
                  const isAdded = addedToCart[product.key];
                  const hasImage = product.image && product.image !== "/placeholder.svg";
                  return (
                    <Card key={product.key} className="border-0 shadow-card card-hover-lift flex flex-col">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="rounded-t-xl overflow-hidden bg-muted" style={{ aspectRatio: "4/3" }}>
                          {hasImage ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 p-4 gap-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm leading-snug">{product.name}</h3>
                            <span className="text-teal-400 font-bold text-sm shrink-0">{product.price}</span>
                          </div>
                          {product.shortDescription && (
                            <p className="text-xs text-muted-foreground leading-relaxed">{product.shortDescription}</p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {product.needTypes.slice(0, 3).map((n) => (
                              <Badge key={n} variant="outline" className="text-xs border-border/60 px-2 py-0">
                                {n}
                              </Badge>
                            ))}
                          </div>
                          <div className="border-t border-border/30 pt-2">
                            <Link
                              to={`/provider/${product.providerId}`}
                              className="text-xs text-teal-400 hover:text-teal-300 hover:underline transition-colors"
                            >
                              by {product.providerName} →
                            </Link>
                          </div>
                          <Button
                            size="sm"
                            className={`w-full mt-auto transition-all ${isAdded ? "bg-emerald-500 hover:bg-emerald-500 text-white" : "bg-teal-500 hover:bg-teal-400 text-white"}`}
                            onClick={() => handleAddToCart(product.key)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {isAdded ? "Added ✓" : "Add to Cart"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* STANDARD PROVIDER GRID */
          <>
            {visible.length === 0 ? (
              <div className="py-20 text-center rounded-xl bg-card shadow-card">
                <p className="text-lg text-foreground mb-2">We couldn't find results for this combination yet.</p>
                <p className="text-muted-foreground mb-6">You're not alone — try adjusting your filters.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchParams({});
                    setDelivery("all");
                    setLocalSearch("");
                    setEhcpOnly(false);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((provider) => (
                  <Link key={provider.id} to={`/provider/${provider.id}`}>
                    <Card className="h-full border-0 shadow-card card-hover-lift">
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {provider.typeBadge}
                              </Badge>
                              {/* 1.1 — Verified badge */}
                              {provider.isVerified && (
                                <Badge className="bg-teal-500/20 text-teal-400 border-0 text-xs gap-1">
                                  <ShieldCheck className="h-3 w-3" /> Verified
                                </Badge>
                              )}
                              {/* 1.3 — EHCP badge */}
                              {provider.ehcpSupport && (
                                <Badge className="bg-orange-500/15 text-orange-400 border-0 text-xs gap-1">
                                  <Heart className="h-3 w-3" /> EHCP
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold">{provider.businessName}</h3>
                          </div>
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="text-muted-foreground hover:text-teal-500 transition-colors duration-150 ml-2"
                          >
                            <Bookmark className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
                          {provider.shortDescription}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {provider.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                            {provider.rating}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {provider.needsSupported.slice(0, 3).map((need) => (
                            <Badge key={need} variant="outline" className="text-xs border-border/60">
                              {need}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
            {visibleCount < filteredProviders.length && (
              <div className="mt-10 text-center">
                <Button
                  variant="outline"
                  className="border-navy-600 text-accent-foreground/80 hover:bg-navy-700"
                  onClick={() => setVisibleCount((c) => c + 6)}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderDirectory;
