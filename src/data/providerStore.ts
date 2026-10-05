// ── Provider profile store ──────────────────────────────────
// Editable provider records. Seeded from mockData, plus imported listings.
// ProviderPage, ProviderDirectory, and ProviderDashboard all
// read from here so edits appear immediately everywhere.
// Edits and imports are saved in this browser (see persist.ts) until Supabase.
import { providers as mockProviders } from "@/data/mockData";
import { loadSaved, save } from "@/data/persist";
import { extractContacts } from "@/data/duplicateCheck";

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
  contactLinks?: string;
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

// ── Persistence: edits to seeded listings + whole imported listings ──
const STORAGE_KEY = "beyonder_providers_v1";
interface SavedProviders { edits: Record<string, Partial<EditableProvider>>; imported: EditableProvider[] }
const seedIds = new Set(providerStore.map((p) => p.id));
const saved = loadSaved<SavedProviders>(STORAGE_KEY) ?? { edits: {}, imported: [] };
const edits: Record<string, Partial<EditableProvider>> = saved.edits ?? {};
providerStore.forEach((p, i) => { if (edits[p.id]) providerStore[i] = { ...p, ...edits[p.id] }; });
(saved.imported ?? []).forEach((p) => { if (!seedIds.has(p.id)) providerStore.push(p); });

function persist() {
  save(STORAGE_KEY, { edits, imported: providerStore.filter((p) => !seedIds.has(p.id)) });
}

/** Listings families can see. Imported listings stay hidden until an admin publishes them. */
export function isPublished(p: EditableProvider): boolean {
  return (p.draftStatus ?? "live") === "live";
}

export function getProvider(id: string): EditableProvider | undefined {
  return providerStore.find((p) => p.id === id);
}

export function updateProvider(id: string, updates: Partial<EditableProvider>): boolean {
  const idx = providerStore.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  providerStore[idx] = { ...providerStore[idx], ...updates };
  if (seedIds.has(id)) edits[id] = { ...edits[id], ...updates };
  persist();
  return true;
}

export function publishProvider(id: string): boolean {
  return updateProvider(id, { draftStatus: "live" });
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
  contactName?: string;
  contactMethodType?: "email" | "phone" | "online_form" | "social_only" | "unknown";
  contactLinks?: string;
}): EditableProvider {
  const id = `imported-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const categoryTypeMap: Record<string, string> = {
    therapist: "Therapist & Specialist",
    club: "Inclusive Club & Activity",
    education: "Education & Learning",
    charity: "Charity & Organisation",
    product: "Product & Equipment",
  };

  // Spreadsheets hold all contact details in one cell — pick out the first of each kind.
  const found = extractContacts(data.contactLinks ?? "");
  const website = found.domains[0] ? `https://${found.domains[0]}` : "";

  const record: EditableProvider = {
    id,
    businessName: data.businessName,
    description: data.description,
    shortDescription: data.shortDescription,
    location: data.location,
    region: data.region,
    coverageArea: data.coverageArea,
    email: found.emails[0] ?? "",
    phone: found.phones[0] ?? "",
    website,
    websiteDomain: found.domains[0] ?? "",
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
    contactLinks: data.contactLinks ?? "",
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
    contactMethod: found.emails[0] ?? "",
    draftStatus: "draft",
  };

  providerStore.push(record);
  persist();
  return record;
}

/**
 * Merge an imported row into an existing listing: only fills fields that are empty,
 * and adds any new contact details. Never overwrites what is already there.
 */
export function mergeIntoProvider(id: string, data: Parameters<typeof importProvider>[0]): boolean {
  const p = getProvider(id);
  if (!p) return false;
  const found = extractContacts(data.contactLinks ?? "");
  const updates: Partial<EditableProvider> = {};
  const fill = <K extends keyof EditableProvider>(key: K, value: EditableProvider[K] | undefined) => {
    const cur = p[key];
    const empty = cur == null || cur === "" || (Array.isArray(cur) && cur.length === 0);
    const has = value != null && value !== "" && !(Array.isArray(value) && value.length === 0);
    if (empty && has) updates[key] = value;
  };
  fill("description", data.description);
  fill("shortDescription", data.shortDescription);
  fill("location", data.location);
  fill("region", data.region);
  fill("coverageArea", data.coverageArea);
  fill("ageRange", data.ageRange);
  fill("needsSupported", data.needsSupported);
  fill("contactName", data.contactName);
  fill("email", found.emails[0]);
  fill("phone", found.phones[0]);
  if (!p.website && found.domains[0]) {
    updates.website = `https://${found.domains[0]}`;
    updates.websiteDomain = found.domains[0];
  }
  const links = data.contactLinks?.trim();
  if (links && !(p.contactLinks ?? "").includes(links)) {
    updates.contactLinks = p.contactLinks ? `${p.contactLinks} | ${links}` : links;
  }
  if (p.contactMethodType === "unknown" || !p.contactMethodType) fill("contactMethodType", data.contactMethodType);
  return Object.keys(updates).length ? updateProvider(id, updates) : true;
}

export function getActiveProviders(): EditableProvider[] {
  const active = providerStore.filter((p) => p.moderationStatus !== "suspended" && isPublished(p));
  // 1.2 — Featured providers sorted to top
  return [...active].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });
}
