// Feature gating system — data-driven, not hardcoded per category.
// free = basics only. founder + professional = full access (identical).

export type PlanType = "founder" | "free" | "professional";
export type PlanStatus = "active" | "trial" | "expired";
export type CategoryType = "therapist" | "club" | "education" | "charity" | "product";

export const FEATURE_KEYS = [
  // ── Original features ──
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
  // ── New features (Groups 1–6) ──
  "verified_badge",
  "featured_placement",
  "ehcp_support_flag",
  "custom_enquiry_questions",
  "referral_notes",
  "session_types",
  "availability_calendar",
  "session_capacity",
  "term_programme",
  "open_days",
  "admissions_info",
  "staff_profiles",
  "events_listings",
  "volunteer_section",
  "case_studies",
  "spotlight",
  "store_link",
  "products",
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

// Founder and professional are identical — full access.
const PAID_FEATURES = new Set(FEATURE_KEYS);

const planFeatures: Record<PlanType, Set<FeatureKey>> = {
  founder: PAID_FEATURES,
  professional: PAID_FEATURES,
  free: new Set<FeatureKey>(["enquiry_form", "testimonials", "certification_upload"]),
};

/** Check whether a provider's plan grants a given feature. */
export function hasFeature(provider: { plan_type: PlanType; plan_status: PlanStatus }, feature: FeatureKey): boolean {
  const effectivePlan: PlanType =
    provider.plan_status === "expired"
      ? "free"
      : (provider.plan_type as PlanType) in planFeatures
        ? (provider.plan_type as PlanType)
        : "free";
  return planFeatures[effectivePlan]?.has(feature) ?? false;
}

/** Which dashboard sections are relevant for each category, in display order.
 *  Sections without a featureKey are always visible.
 *  Sections with a featureKey are locked for free plan providers.
 */
export const categorySections: Record<CategoryType, { key: string; label: string; featureKey?: FeatureKey }[]> = {
  therapist: [
    { key: "enquiries", label: "Enquiries", featureKey: "enquiry_form" },
    { key: "availability", label: "Availability & Waitlist", featureKey: "availability_toggle" },
    { key: "certifications", label: "Certifications", featureKey: "certification_upload" },
    { key: "session_types", label: "Session Types", featureKey: "session_types" },
    { key: "availability_calendar", label: "Availability Calendar", featureKey: "availability_calendar" },
    { key: "gallery", label: "Gallery", featureKey: "gallery" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
    { key: "referral_notes", label: "Referral Notes", featureKey: "referral_notes" },
    { key: "custom_enquiry_questions", label: "Custom Enquiry Questions", featureKey: "custom_enquiry_questions" },
  ],
  club: [
    { key: "enquiries", label: "Enquiries", featureKey: "enquiry_form" },
    { key: "timetable", label: "Timetable", featureKey: "timetable" },
    { key: "gallery", label: "Gallery", featureKey: "gallery" },
    { key: "session_capacity", label: "Session Capacity", featureKey: "session_capacity" },
    { key: "term_programme", label: "Term Programme", featureKey: "term_programme" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
    { key: "referral_notes", label: "Referral Notes", featureKey: "referral_notes" },
    { key: "custom_enquiry_questions", label: "Custom Enquiry Questions", featureKey: "custom_enquiry_questions" },
  ],
  education: [
    { key: "enquiries", label: "Enquiries", featureKey: "enquiry_form" },
    { key: "case_studies", label: "Education Details", featureKey: "case_studies" },
    { key: "open_days", label: "Open Days", featureKey: "open_days" },
    { key: "admissions_info", label: "Admissions & EHCP", featureKey: "admissions_info" },
    { key: "staff_profiles", label: "Staff Profiles", featureKey: "staff_profiles" },
    { key: "term_programme", label: "Term Programme", featureKey: "term_programme" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
    { key: "referral_notes", label: "Referral Notes", featureKey: "referral_notes" },
    { key: "custom_enquiry_questions", label: "Custom Enquiry Questions", featureKey: "custom_enquiry_questions" },
  ],
  charity: [
    { key: "enquiries", label: "Enquiries", featureKey: "enquiry_form" },
    { key: "spotlight", label: "Spotlight Message", featureKey: "spotlight" },
    { key: "gallery", label: "Gallery", featureKey: "gallery" },
    { key: "events_listings", label: "Events", featureKey: "events_listings" },
    { key: "volunteer_section", label: "Volunteer / Help Needed", featureKey: "volunteer_section" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
    { key: "referral_notes", label: "Referral Notes", featureKey: "referral_notes" },
    { key: "custom_enquiry_questions", label: "Custom Enquiry Questions", featureKey: "custom_enquiry_questions" },
  ],
  product: [
    { key: "enquiries", label: "Enquiries", featureKey: "enquiry_form" },
    { key: "products", label: "Products", featureKey: "products" },
    { key: "store_link", label: "Store Link", featureKey: "store_link" },
    { key: "testimonials", label: "Testimonials", featureKey: "testimonials" },
    { key: "referral_notes", label: "Referral Notes", featureKey: "referral_notes" },
    { key: "custom_enquiry_questions", label: "Custom Enquiry Questions", featureKey: "custom_enquiry_questions" },
  ],
};
