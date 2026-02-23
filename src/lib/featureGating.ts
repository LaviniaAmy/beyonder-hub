// Feature gating system — data-driven, not hardcoded per category.
// Founder plan unlocks everything for pilot; later plans restrict features.

export type PlanType = "founder" | "free" | "professional" | "growth" | "featured";
export type PlanStatus = "active" | "trial" | "expired";
export type CategoryType = "therapist" | "club" | "education" | "charity" | "product";

export const FEATURE_KEYS = [
  "availability_toggle",
  "enquiry_form",
  "waitlist_toggle",
  "certification_upload",
  "timetable",
  "gallery",
  "testimonials",
  "priority_search_rank",
  "multi_category",
  "analytics_basic",
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

// Which features each plan grants. Founder = everything on.
const planFeatures: Record<PlanType, Set<FeatureKey>> = {
  founder: new Set(FEATURE_KEYS),
  free: new Set<FeatureKey>(["enquiry_form", "testimonials"]),
  professional: new Set<FeatureKey>([
    "enquiry_form",
    "testimonials",
    "availability_toggle",
    "waitlist_toggle",
    "certification_upload",
    "timetable",
    "gallery",
    "analytics_basic",
  ]),
  growth: new Set<FeatureKey>([
    "enquiry_form",
    "testimonials",
    "availability_toggle",
    "waitlist_toggle",
    "certification_upload",
    "timetable",
    "gallery",
    "analytics_basic",
    "priority_search_rank",
  ]),
  featured: new Set(FEATURE_KEYS),
};

/** Check whether a provider's plan grants a given feature. */
export function hasFeature(
  provider: { plan_type: PlanType; plan_status: PlanStatus },
  feature: FeatureKey,
): boolean {
  // Expired plans fall back to free-tier access
  const effectivePlan = provider.plan_status === "expired" ? "free" : provider.plan_type;
  return planFeatures[effectivePlan]?.has(feature) ?? false;
}

/** Which dashboard sections are relevant for each category. */
export const categorySections: Record<CategoryType, { key: string; label: string; featureKey?: FeatureKey }[]> = {
  therapist: [
    { key: "availability", label: "Availability & Waitlist", featureKey: "availability_toggle" },
    { key: "enquiries", label: "Enquiries", featureKey: "enquiry_form" },
    { key: "certifications", label: "Certifications", featureKey: "certification_upload" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
  ],
  club: [
    { key: "timetable", label: "Timetable", featureKey: "timetable" },
    { key: "gallery", label: "Gallery", featureKey: "gallery" },
    { key: "enquiries", label: "Enquiries", featureKey: "enquiry_form" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
  ],
  education: [
    { key: "case_studies", label: "Case Studies" },
    { key: "enquiries", label: "Enquiries", featureKey: "enquiry_form" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
  ],
  charity: [
    { key: "spotlight", label: "Spotlight Tools" },
    { key: "enquiries", label: "Enquiries", featureKey: "enquiry_form" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
  ],
  product: [
    { key: "store_link", label: "Store Link" },
    { key: "products", label: "Products" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
  ],
};
