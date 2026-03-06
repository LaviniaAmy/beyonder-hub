// ── Provider profile store ──────────────────────────────────
// In-memory editable provider records. Seeded from mockData.
// ProviderPage, ProviderDirectory, and ProviderDashboard all
// read from here so edits appear immediately everywhere.
import { providers as mockProviders } from "@/data/mockData";

export interface ChangeRequest {
  message: string;
  status: "pending" | "acknowledged";
}

export type AvailabilityStatus = "accepting" | "waitlist" | "closed";

export interface EditableProvider {
  id: string;
  businessName: string;
  description: string;
  shortDescription: string;
  location: string;
  region: string | null;
  coverageArea: string;
  email: string;
  phone: string;
  website: string;
  websiteDomain: string;
  ageRange: string;
  deliveryFormat: "in-person" | "online" | "hybrid";
  needsSupported: string[];
  searchTags: string[];
  // Category modules
  credentials: string[];
  timetable: { day: string; time: string; activity: string }[];
  gallery: string[];
  caseStudies: { title: string; description: string }[];
  spotlightMessage: string;
  storeUrl: string;
  products: { name: string; price: string; image: string; shortDescription: string }[];
  // Availability (therapists)
  availabilityStatus: AvailabilityStatus;
  // Moderation
  moderationStatus: "active" | "suspended";
  suspendedMessage: string;
  changeRequest: ChangeRequest | null;
  // Pass-through (unchanged)
  type: string;
  category_type: string;
  typeBadge: string;
  verified: boolean;
  foundingProvider: boolean;
  rating: number;
  reviewCount: number;
  plan_type: string;
  plan_status: string;
  plan_expires_at: string | null;
  search_boost: number;
  contactMethod: string;
}

export const providerStore: EditableProvider[] = mockProviders.map((p) => ({
  id: p.id,
  businessName: p.name,
  description: p.description,
  shortDescription: p.shortDescription,
  location: p.location,
  region: p.region ?? null,
  coverageArea: p.coverageArea,
  email: "",
  phone: "",
  website: p.websiteDomain ? `https://${p.websiteDomain}` : "",
  websiteDomain: p.websiteDomain ?? "",
  ageRange: p.ageRange,
  deliveryFormat: p.deliveryFormat,
  needsSupported: [...p.needsSupported],
  searchTags: [...p.searchTags],
  credentials: p.credentials ? [...p.credentials] : [],
  timetable: p.timetable ? [...p.timetable] : [],
  gallery: [],
  caseStudies: p.educationDetails ? [{ title: "Overview", description: p.educationDetails }] : [],
  spotlightMessage: "",
  storeUrl: "",
  products: p.products
    ? p.products.map((prod) => ({
        name: prod.name,
        price: prod.price,
        image: prod.image ?? "/placeholder.svg",
        shortDescription: "",
      }))
    : [],
  availabilityStatus: "accepting",
  moderationStatus: "active",
  suspendedMessage: "",
  changeRequest: null,
  type: p.type,
  category_type: p.category_type,
  typeBadge: p.typeBadge,
  verified: p.verified,
  foundingProvider: p.foundingProvider,
  rating: p.rating,
  reviewCount: p.reviewCount,
  plan_type: p.plan_type,
  plan_status: p.plan_status,
  plan_expires_at: p.plan_expires_at,
  search_boost: p.search_boost,
  contactMethod: p.contactMethod,
}));

export function getProvider(id: string): EditableProvider | undefined {
  return providerStore.find((p) => p.id === id);
}

export function updateProvider(id: string, updates: Partial<EditableProvider>): boolean {
  const idx = providerStore.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  providerStore[idx] = { ...providerStore[idx], ...updates };
  return true;
}

export function getAllProviders(): EditableProvider[] {
  return providerStore;
}

export function getActiveProviders(): EditableProvider[] {
  return providerStore.filter((p) => p.moderationStatus !== "suspended");
}
