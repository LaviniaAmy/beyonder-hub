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
  // Feature flags (1.1, 1.2, 1.3)
  isVerified: boolean;
  isFeatured: boolean;
  ehcpSupport: boolean;
  // 3.1 Session types (therapist)
  sessionTypes: { name: string; duration: string; price: string }[];
  // 3.2 Availability dates (therapist)
  availabilityDates: string[];
  // 4.1 Session capacity (club)
  sessionCapacity: { session: string; capacity: string; spotsLeft: string }[];
  // 4.2 Term programme (club + education)
  termProgramme: { term: string; details: string }[];
  // 5.1 Open days (education)
  openDays: { title: string; date: string; description: string; rsvpLink: string }[];
  // 5.2 EHCP & admissions info (education)
  ehcpAdmissionsInfo: string;
  // 5.3 Staff profiles (education)
  staffProfiles: { name: string; role: string; bio: string }[];
  // 6.1 Events (charity)
  events: { title: string; date: string; type: "online" | "in-person"; description: string }[];
  // 6.2 Volunteer info (charity)
  volunteerInfo: string;
  // Import/onboarding status
  draftStatus?: "draft" | "pending_review" | "live";
  // Contact person (public display)
  contactName?: string;
  // Admin-only outreach contact details
  contactMethodType?: "email" | "phone" | "online_form" | "social_only" | "unknown";
  contactFormUrl?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialOther?: string;
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
  isVerified: false,
  isFeatured: false,
  ehcpSupport: false,
  sessionTypes: [],
  availabilityDates: [],
  sessionCapacity: [],
  termProgramme: [],
  openDays: [],
  ehcpAdmissionsInfo: "",
  staffProfiles: [],
  events: [],
  volunteerInfo: "",
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

export type ProviderDraftStatus = "draft" | "pending_review" | "live";

export function importProvider(data: {
  businessName: string;
  category_type: string;
  region: string | null;
  location: string;
  coverageArea: string;
  shortDescription: string;
  description: string;
  needsSupported: string[];
  ageRange: string;
  deliveryFormat: "in-person" | "online" | "hybrid";
  email: string;
  phone: string;
  website: string;
  contactName?: string;
  contactMethodType?: "email" | "phone" | "online_form" | "social_only" | "unknown";
  contactFormUrl?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialOther?: string;
}): EditableProvider {
  const id = `imported-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const categoryTypeMap: Record<string, string> = {
    therapist: "Therapist & Specialist",
    club: "Inclusive Club & Activity",
    education: "Education & Learning",
    charity: "Charity & Organisation",
    product: "Product & Equipment",
  };

  const record: EditableProvider = {
    id,
    businessName: data.businessName,
    description: data.description,
    shortDescription: data.shortDescription,
    location: data.location,
    region: data.region,
    coverageArea: data.coverageArea,
    email: data.email,
    phone: data.phone,
    website: data.website,
    websiteDomain: data.website.replace(/^https?:\/\//, "").split("/")[0],
    ageRange: data.ageRange,
    deliveryFormat: data.deliveryFormat,
    needsSupported: data.needsSupported,
    searchTags: data.needsSupported,
    credentials: [],
    timetable: [],
    gallery: [],
    caseStudies: [],
    spotlightMessage: "",
    storeUrl: "",
    products: [],
    availabilityStatus: "accepting",
    moderationStatus: "active",
    suspendedMessage: "",
    changeRequest: null,
    isVerified: false,
    isFeatured: false,
    ehcpSupport: false,
    sessionTypes: [],
    availabilityDates: [],
    sessionCapacity: [],
    termProgramme: [],
    openDays: [],
    ehcpAdmissionsInfo: "",
    staffProfiles: [],
    events: [],
    volunteerInfo: "",
    contactName: data.contactName ?? "",
    contactMethodType: data.contactMethodType ?? "unknown",
    contactFormUrl: data.contactFormUrl ?? "",
    socialFacebook: data.socialFacebook ?? "",
    socialInstagram: data.socialInstagram ?? "",
    socialOther: data.socialOther ?? "",
    type: data.category_type,
    category_type: data.category_type,
    typeBadge: categoryTypeMap[data.category_type] ?? data.category_type,
    verified: false,
    foundingProvider: false,
    rating: 0,
    reviewCount: 0,
    plan_type: "free",
    plan_status: "active",
    plan_expires_at: null,
    search_boost: 0,
    contactMethod: data.email,
    draftStatus: "draft" as ProviderDraftStatus,
  } as EditableProvider & { draftStatus: ProviderDraftStatus };

  providerStore.push(record);
  return record;
}

export function getActiveProviders(): EditableProvider[] {
  const active = providerStore.filter((p) => p.moderationStatus !== "suspended");
  // 1.2 — Featured providers sorted to top
  return [...active].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });
}
