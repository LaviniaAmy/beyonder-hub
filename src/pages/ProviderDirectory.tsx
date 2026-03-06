import { useState, useMemo, useRef } from "react";
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
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, regions } from "@/data/mockData";
import { getActiveProviders } from "@/data/providerStore";

const MAX_PRODUCT_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB limit for mass providers

// ── Extended mock product catalogue ──────────────────────────
// In production these would come from providerStore products arrays.
// For pilot we define them inline so filters have enough data to demo.
interface CatalogueProduct {
  id: string;
  providerId: string;
  providerName: string;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  shortDescription: string;
  productCategory: string;
  needTypes: string[];
}

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

const mockCatalogueProducts: CatalogueProduct[] = [
  {
    id: "p1",
    providerId: "3",
    providerName: "SensoryPlay Shop",
    name: "Weighted Lap Pad",
    price: "£24.99",
    priceValue: 24.99,
    image: "/placeholder.svg",
    shortDescription: "Provides calming deep pressure for children who struggle to sit and focus.",
    productCategory: "sensory",
    needTypes: ["Sensory Processing", "Autism", "ADHD"],
  },
  {
    id: "p2",
    providerId: "3",
    providerName: "SensoryPlay Shop",
    name: "Chewable Necklace Set",
    price: "£12.99",
    priceValue: 12.99,
    image: "/placeholder.svg",
    shortDescription: "Safe, durable chew necklaces for children who seek oral sensory input.",
    productCategory: "sensory",
    needTypes: ["Sensory Processing", "Autism"],
  },
  {
    id: "p3",
    providerId: "3",
    providerName: "SensoryPlay Shop",
    name: "Sensory Fidget Kit",
    price: "£18.99",
    priceValue: 18.99,
    image: "/placeholder.svg",
    shortDescription: "A curated set of fidget tools to support focus and self-regulation.",
    productCategory: "sensory",
    needTypes: ["ADHD", "Autism", "Anxiety"],
  },
  {
    id: "p4",
    providerId: "3",
    providerName: "SensoryPlay Shop",
    name: "Weighted Blanket (3kg)",
    price: "£44.99",
    priceValue: 44.99,
    image: "/placeholder.svg",
    shortDescription: "Calming weighted blanket designed to ease anxiety and improve sleep.",
    productCategory: "sensory",
    needTypes: ["Anxiety", "Autism", "Sensory Processing"],
  },
  {
    id: "p5",
    providerId: "3",
    providerName: "SensoryPlay Shop",
    name: "Visual Schedule Board",
    price: "£19.99",
    priceValue: 19.99,
    image: "/placeholder.svg",
    shortDescription: "Magnetic daily routine board to support predictability and transitions.",
    productCategory: "communication",
    needTypes: ["Autism", "ADHD", "Learning Disability"],
  },
  {
    id: "p6",
    providerId: "3",
    providerName: "SensoryPlay Shop",
    name: "Communication Cards Set",
    price: "£9.99",
    priceValue: 9.99,
    image: "/placeholder.svg",
    shortDescription: "Picture communication cards to support non-verbal and early verbal children.",
    productCategory: "communication",
    needTypes: ["Speech & Language", "Autism"],
  },
  {
    id: "p7",
    providerId: "3",
    providerName: "SensoryPlay Shop",
    name: "Adaptive Pencil Grips (Pack of 6)",
    price: "£7.99",
    priceValue: 7.99,
    image: "/placeholder.svg",
    shortDescription: "Ergonomic pencil grips to support children with fine motor difficulties.",
    productCategory: "motor",
    needTypes: ["Physical Disability", "Sensory Processing"],
  },
  {
    id: "p8",
    providerId: "3",
    providerName: "SensoryPlay Shop",
    name: "Wobble Cushion",
    price: "£14.99",
    priceValue: 14.99,
    image: "/placeholder.svg",
    shortDescription: "Inflatable seat cushion that provides sensory feedback and helps with focus.",
    productCategory: "sensory",
    needTypes: ["ADHD", "Sensory Processing", "Autism"],
  },
  {
    id: "p9",
    providerId: "3",
    providerName: "SensoryPlay Shop",
    name: "Emotions Flashcard Set",
    price: "£8.99",
    priceValue: 8.99,
    image: "/placeholder.svg",
    shortDescription: "Illustrated cards to help children identify and talk about their feelings.",
    productCategory: "emotional",
    needTypes: ["Autism", "Anxiety", "ADHD"],
  },
  {
    id: "p10",
    providerId: "3",
    providerName: "SensoryPlay Shop",
    name: "Adaptive Wheelchair Tray",
    price: "£64.99",
    priceValue: 64.99,
    image: "/placeholder.svg",
    shortDescription: "Adjustable activity tray designed to attach to most standard wheelchairs.",
    productCategory: "mobility",
    needTypes: ["Physical Disability"],
  },
  {
    id: "p11",
    providerId: "3",
    providerName: "SensoryPlay Shop",
    name: "Non-Slip Bath Mat Set",
    price: "£11.99",
    priceValue: 11.99,
    image: "/placeholder.svg",
    shortDescription: "Sensory-safe non-slip bath mats to support daily living routines.",
    productCategory: "daily",
    needTypes: ["Physical Disability", "Sensory Processing"],
  },
  {
    id: "p12",
    providerId: "3",
    providerName: "SensoryPlay Shop",
    name: "Compression Vest",
    price: "£34.99",
    priceValue: 34.99,
    image: "/placeholder.svg",
    shortDescription: "Provides proprioceptive input to support sensory regulation throughout the day.",
    productCategory: "sensory",
    needTypes: ["Sensory Processing", "Autism", "ADHD"],
  },
];

// ── Helpers ───────────────────────────────────────────────────
function priceInRange(value: number, range: string): boolean {
  if (range === "all") return true;
  if (range === "under10") return value < 10;
  if (range === "10to25") return value >= 10 && value <= 25;
  if (range === "25to50") return value > 25 && value <= 50;
  if (range === "over50") return value > 50;
  return true;
}

// ── Delivery / category options ───────────────────────────────
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

// ── Component ─────────────────────────────────────────────────
const ProviderDirectory = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  const regionParam = searchParams.get("region") || "all";
  const supportParam = searchParams.get("support") || "";
  const needsParam = searchParams.get("needs") || "";
  const isLocalView = searchParams.get("view") === "local";

  const [delivery, setDelivery] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Product catalogue filters
  const [productCategory, setProductCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [needFilter, setNeedFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");

  // Per-product image state (keyed by product id)
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [productDescriptions, setProductDescriptions] = useState<Record<string, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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

  // ── Provider filtering (unchanged logic) ─────────────────────
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
    return result;
  }, [activeCategory, delivery, searchQuery, regionParam, supportParam, needsParam, localSearch]);

  // ── Product catalogue filtering ───────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = mockCatalogueProducts;
    if (productCategory !== "all") {
      result = result.filter((p) => p.productCategory === productCategory);
    }
    if (priceRange !== "all") {
      result = result.filter((p) => priceInRange(p.priceValue, priceRange));
    }
    if (needFilter !== "all") {
      result = result.filter((p) => p.needTypes.includes(needFilter));
    }
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
  }, [productCategory, priceRange, needFilter, productSearch]);

  const handleProductImageUpload = (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setImageErrors((prev) => ({ ...prev, [productId]: "" }));
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setImageErrors((prev) => ({ ...prev, [productId]: "PNG or JPEG only." }));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
      setImageErrors((prev) => ({ ...prev, [productId]: "Max file size is 1MB." }));
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProductImages((prev) => ({ ...prev, [productId]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const visible = filteredProviders.slice(0, visibleCount);
  const hasActiveFilters =
    activeCategory !== "all" ||
    delivery !== "all" ||
    searchQuery ||
    regionParam !== "all" ||
    supportParam ||
    needsParam;
  const hasProductFilters = productCategory !== "all" || priceRange !== "all" || needFilter !== "all" || productSearch;

  return (
    <div className="bg-navy-gradient min-h-screen py-10">
      <div className="container">
        <h1 className="mb-8 text-3xl font-bold text-accent-foreground animate-fade-in">
          {isLocalView ? "Find Local Support" : "Provider Directory"}
        </h1>

        {/* ── Main filters (always shown) ── */}
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
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSearchParams({});
                    setDelivery("all");
                    setLocalSearch("");
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

        {/* ── Local View Category Cards ── */}
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

        {/* ── Category Tabs ── */}
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

        {/* ── Active filter pills (provider view) ── */}
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
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            PRODUCT CATALOGUE VIEW
        ════════════════════════════════════════════════════════ */}
        {isProductView ? (
          <div>
            {/* Product filter panel */}
            <div className="mb-8 rounded-xl bg-card p-6 shadow-card space-y-4">
              <div className="flex flex-wrap gap-3">
                <Select value={productCategory} onValueChange={setProductCategory}>
                  <SelectTrigger className="w-52">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    {PRODUCT_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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
                      setProductCategory("all");
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

              {/* Active product filter pills */}
              {hasProductFilters && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {productCategory !== "all" && (
                    <Badge className="gap-1 bg-teal-500/15 text-teal-400 border-0 px-3 py-1">
                      {PRODUCT_CATEGORIES.find((c) => c.value === productCategory)?.label}
                      <button onClick={() => setProductCategory("all")} className="ml-1 hover:text-accent-foreground">
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
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

            {/* Results count */}
            <p className="mb-4 text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
            </p>

            {/* Product grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-xl bg-card shadow-card">
                <p className="text-lg text-foreground mb-2">No products match your filters.</p>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setProductCategory("all");
                    setPriceRange("all");
                    setNeedFilter("all");
                    setProductSearch("");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => {
                  const displayImage = productImages[product.id] || product.image;
                  const displayDescription = productDescriptions[product.id] || product.shortDescription;
                  const isPlaceholder = displayImage === "/placeholder.svg";

                  return (
                    <Card key={product.id} className="border-0 shadow-card card-hover-lift flex flex-col">
                      <CardContent className="p-0 flex flex-col h-full">
                        {/* Product image */}
                        <div className="relative rounded-t-xl overflow-hidden bg-muted" style={{ aspectRatio: "4/3" }}>
                          {isPlaceholder ? (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                              <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                              <span className="text-xs text-muted-foreground/50">No image yet</span>
                            </div>
                          ) : (
                            <img src={displayImage} alt={product.name} className="w-full h-full object-cover" />
                          )}

                          {/* Upload overlay button */}
                          <label
                            htmlFor={`img-${product.id}`}
                            className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs text-white cursor-pointer hover:bg-black/80 transition-colors"
                            title="Upload image"
                          >
                            <Upload className="h-3 w-3" />
                            {isPlaceholder ? "Add image" : "Change"}
                          </label>
                          <input
                            id={`img-${product.id}`}
                            type="file"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            ref={(el) => {
                              fileInputRefs.current[product.id] = el;
                            }}
                            onChange={(e) => handleProductImageUpload(product.id, e)}
                          />
                        </div>

                        {/* Image error */}
                        {imageErrors[product.id] && (
                          <p className="px-4 pt-1 text-xs text-red-400">{imageErrors[product.id]}</p>
                        )}

                        <div className="flex flex-col flex-1 p-4 gap-3">
                          {/* Product name & price */}
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-sm leading-snug">{product.name}</h3>
                              <span className="text-teal-400 font-bold text-sm shrink-0">{product.price}</span>
                            </div>

                            {/* Short description — editable */}
                            <textarea
                              value={displayDescription}
                              onChange={(e) => {
                                if (e.target.value.length <= 120) {
                                  setProductDescriptions((prev) => ({ ...prev, [product.id]: e.target.value }));
                                }
                              }}
                              rows={2}
                              maxLength={120}
                              placeholder="Short description..."
                              className="mt-2 w-full resize-none rounded-lg border border-border/40 bg-muted/30 px-3 py-2 text-xs text-muted-foreground focus:outline-none focus:border-teal-500/50 transition-colors"
                            />
                            <p className="text-right text-xs text-muted-foreground/50 mt-0.5">
                              {(productDescriptions[product.id] ?? product.shortDescription).length}/120
                            </p>
                          </div>

                          {/* Need tags */}
                          <div className="flex flex-wrap gap-1">
                            {product.needTypes.slice(0, 3).map((n) => (
                              <Badge key={n} variant="outline" className="text-xs border-border/60 px-2 py-0">
                                {n}
                              </Badge>
                            ))}
                          </div>

                          {/* Provider link */}
                          <div className="mt-auto pt-2 border-t border-border/30">
                            <Link
                              to={`/provider/${product.providerId}`}
                              className="text-xs text-teal-400 hover:text-teal-300 hover:underline transition-colors"
                            >
                              by {product.providerName} →
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ════════════════════════════════════════════════════
             STANDARD PROVIDER GRID VIEW
          ════════════════════════════════════════════════════ */
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
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((provider) => (
                  <Link key={provider.id} to={`/provider/${provider.id}`}>
                    <Card
                      className={`h-full border-0 shadow-card card-hover-lift ${provider.type === "product" ? "ring-1 ring-teal-500/20" : ""}`}
                    >
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <Badge variant="secondary" className="mb-2 text-xs">
                              {provider.typeBadge}
                            </Badge>
                            <h3 className="font-semibold">{provider.businessName}</h3>
                          </div>
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="text-muted-foreground hover:text-teal-500 transition-colors duration-150"
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
