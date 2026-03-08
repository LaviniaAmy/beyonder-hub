// ── Feature gating ────────────────────────────────────────────
// Single source of truth for plan-based feature access and
// per-category dashboard section definitions.

export type PlanType = "free" | "founder" | "professional";
export type PlanStatus = "active" | "trial" | "expired";
export type CategoryType = "therapist" | "club" | "education" | "charity" | "product";

export type FeatureKey =
  | "enquiries"
  | "certifications"
  | "testimonials"
  | "timetable"
  | "gallery"
  | "case_studies"
  | "spotlight"
  | "store_link"
  | "products"
  | "availability"
  | "referral_notes"
  | "ehcp_support"
  // 3.x Therapist
  | "session_types"
  | "availability_dates"
  // 4.x Club
  | "session_capacity"
  | "term_programme"
  // 5.x Education
  | "open_days"
  | "ehcp_admissions"
  | "staff_profiles"
  // 6.x Charity
  | "events"
  | "volunteer_info";

// Features available on each plan (cumulative)
const FREE_FEATURES: FeatureKey[] = ["enquiries", "availability"];

const PAID_FEATURES: FeatureKey[] = [
  ...FREE_FEATURES,
  "certifications",
  "testimonials",
  "timetable",
  "gallery",
  "case_studies",
  "spotlight",
  "store_link",
  "products",
  "referral_notes",
  "ehcp_support",
  "session_types",
  "availability_dates",
  "session_capacity",
  "term_programme",
  "open_days",
  "ehcp_admissions",
  "staff_profiles",
  "events",
  "volunteer_info",
];

const PLAN_FEATURES: Record<PlanType, FeatureKey[]> = {
  free: FREE_FEATURES,
  founder: PAID_FEATURES,
  professional: PAID_FEATURES,
};

export function hasFeature(profile: { plan_type: PlanType; plan_status: PlanStatus }, feature: FeatureKey): boolean {
  if (profile.plan_status === "expired") {
    return FREE_FEATURES.includes(feature);
  }
  return PLAN_FEATURES[profile.plan_type]?.includes(feature) ?? false;
}

// ── Per-category dashboard sections ──────────────────────────
export interface SectionDef {
  key: string;
  label: string;
  featureKey?: FeatureKey;
}

export const categorySections: Record<CategoryType, SectionDef[]> = {
  therapist: [
    { key: "enquiries", label: "Enquiries", featureKey: "enquiries" },
    { key: "availability", label: "Availability Status", featureKey: "availability" },
    { key: "session_types", label: "Session Types", featureKey: "session_types" },
    { key: "availability_dates", label: "Availability Calendar", featureKey: "availability_dates" },
    { key: "certifications", label: "Certifications", featureKey: "certifications" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
    { key: "gallery", label: "Gallery", featureKey: "gallery" },
    { key: "spotlight", label: "Spotlight Message", featureKey: "spotlight" },
    { key: "referral_notes", label: "Referral Notes", featureKey: "referral_notes" },
  ],
  club: [
    { key: "enquiries", label: "Enquiries", featureKey: "enquiries" },
    { key: "timetable", label: "Timetable", featureKey: "timetable" },
    { key: "session_capacity", label: "Session Capacity", featureKey: "session_capacity" },
    { key: "term_programme", label: "Term Programme", featureKey: "term_programme" },
    { key: "gallery", label: "Gallery", featureKey: "gallery" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
    { key: "spotlight", label: "Spotlight Message", featureKey: "spotlight" },
    { key: "referral_notes", label: "Referral Notes", featureKey: "referral_notes" },
  ],
  education: [
    { key: "enquiries", label: "Enquiries", featureKey: "enquiries" },
    { key: "open_days", label: "Open Days", featureKey: "open_days" },
    { key: "ehcp_admissions", label: "EHCP & Admissions", featureKey: "ehcp_admissions" },
    { key: "staff_profiles", label: "Staff Profiles", featureKey: "staff_profiles" },
    { key: "term_programme", label: "Term Programme", featureKey: "term_programme" },
    { key: "case_studies", label: "Case Studies", featureKey: "case_studies" },
    { key: "gallery", label: "Gallery", featureKey: "gallery" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
    { key: "spotlight", label: "Spotlight Message", featureKey: "spotlight" },
    { key: "referral_notes", label: "Referral Notes", featureKey: "referral_notes" },
  ],
  charity: [
    { key: "enquiries", label: "Enquiries", featureKey: "enquiries" },
    { key: "events", label: "Events", featureKey: "events" },
    { key: "volunteer_info", label: "Volunteer Info", featureKey: "volunteer_info" },
    { key: "gallery", label: "Gallery", featureKey: "gallery" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
    { key: "spotlight", label: "Spotlight Message", featureKey: "spotlight" },
    { key: "referral_notes", label: "Referral Notes", featureKey: "referral_notes" },
  ],
  product: [
    { key: "enquiries", label: "Enquiries", featureKey: "enquiries" },
    { key: "products", label: "Products", featureKey: "products" },
    { key: "store_link", label: "Store Link", featureKey: "store_link" },
    { key: "gallery", label: "Gallery", featureKey: "gallery" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
    { key: "spotlight", label: "Spotlight Message", featureKey: "spotlight" },
    { key: "referral_notes", label: "Referral Notes", featureKey: "referral_notes" },
  ],
};
