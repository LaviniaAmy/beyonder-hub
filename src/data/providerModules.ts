// Category-specific module tables (1:1 keyed by provider_id).
// These keep the core Provider type lean.

export interface TherapistProfile {
  provider_id: string;
  accepting_new_clients: boolean;
  waitlist_enabled: boolean;
  enquiry_form_enabled: boolean;
  certifications: string[]; // file refs or labels
  specialisms: string[];
}

export interface ClubProfile {
  provider_id: string;
  timetable_json: { day: string; time: string; activity: string }[];
  trial_available: boolean;
  age_ranges: string[];
  gallery_enabled: boolean;
}

export interface EducationProfile {
  provider_id: string;
  services_offered: string[];
  case_studies: string[]; // text/json blobs
}

export interface CharityProfile {
  provider_id: string;
  support_types: string[];
  donation_link: string | null;
}

export interface ProductProfile {
  provider_id: string;
  store_link: string | null;
  featured_products: { name: string; price: string; image: string }[] | null;
}

// Shared tables

export interface ProviderFile {
  id: string;
  provider_id: string;
  file_type: "certification" | "photo" | "document";
  url: string;
  label: string;
  created_at: string;
}

export interface ProviderTestimonial {
  id: string;
  provider_id: string;
  parent_name: string | null;
  rating: number | null;
  text: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

// ---- Mock data for modules ----

export const therapistProfiles: TherapistProfile[] = [
  { provider_id: "1", accepting_new_clients: true, waitlist_enabled: false, enquiry_form_enabled: true, certifications: ["HCPC Registered", "RCSLT Member", "DBS Enhanced"], specialisms: ["Speech Delay", "Autism", "ADHD"] },
  { provider_id: "6", accepting_new_clients: true, waitlist_enabled: false, enquiry_form_enabled: true, certifications: ["HCPC Registered", "RCOT Member", "Sensory Integration Certified"], specialisms: ["Dyspraxia", "Sensory Processing", "ADHD"] },
  { provider_id: "7", accepting_new_clients: true, waitlist_enabled: false, enquiry_form_enabled: true, certifications: ["HCPC Registered", "BAMT Member"], specialisms: ["Emotional Regulation", "Communication", "Social Interaction"] },
  { provider_id: "8", accepting_new_clients: true, waitlist_enabled: false, enquiry_form_enabled: true, certifications: ["BACP Registered"], specialisms: ["Anxiety", "Depression", "SEND Counselling"] },
];

export const clubProfiles: ClubProfile[] = [
  { provider_id: "2", timetable_json: [{ day: "Monday", time: "16:00-17:00", activity: "Beginners (ages 4-8)" }, { day: "Wednesday", time: "16:00-17:00", activity: "Intermediate (ages 8-14)" }, { day: "Saturday", time: "10:00-11:00", activity: "All abilities (ages 4-18)" }], trial_available: true, age_ranges: ["4-8", "8-14", "4-18"], gallery_enabled: true },
  { provider_id: "9", timetable_json: [{ day: "Tuesday", time: "15:30-17:30", activity: "After-school club (ages 4-8)" }, { day: "Thursday", time: "15:30-17:30", activity: "After-school club (ages 8-14)" }, { day: "Saturday", time: "10:00-12:00", activity: "Weekend club (all ages)" }], trial_available: false, age_ranges: ["4-8", "8-14"], gallery_enabled: true },
];

export const educationProfiles: EducationProfile[] = [
  { provider_id: "4", services_offered: ["1:1 Tutoring", "Small Group Sessions", "Dyslexia Support", "Dyscalculia Support"], case_studies: ["Student A improved reading age by 2 years in 6 months."] },
];

export const charityProfiles: CharityProfile[] = [
  { provider_id: "5", support_types: ["Emotional Support", "Advice", "Community Events", "Parent Groups"], donation_link: null },
];

export const productProfiles: ProductProfile[] = [
  { provider_id: "3", store_link: null, featured_products: [{ name: "Weighted Lap Pad", price: "£24.99", image: "/placeholder.svg" }, { name: "Chewable Necklace Set", price: "£12.99", image: "/placeholder.svg" }, { name: "Sensory Fidget Kit", price: "£18.99", image: "/placeholder.svg" }] },
];

export const providerFiles: ProviderFile[] = [];
export const providerTestimonials: ProviderTestimonial[] = [
  { id: "t1", provider_id: "1", parent_name: "Sarah M.", rating: 5, text: "Absolutely fantastic. My son has made incredible progress.", status: "approved", created_at: "2025-11-15" },
  { id: "t2", provider_id: "2", parent_name: "Emma L.", rating: 4, text: "My daughter loves the Saturday sessions.", status: "approved", created_at: "2025-12-01" },
];

/** Get the correct module profile for a provider by category. */
export function getModuleProfile(providerId: string, categoryType: string) {
  switch (categoryType) {
    case "therapist": return therapistProfiles.find(p => p.provider_id === providerId) ?? null;
    case "club": return clubProfiles.find(p => p.provider_id === providerId) ?? null;
    case "education": return educationProfiles.find(p => p.provider_id === providerId) ?? null;
    case "charity": return charityProfiles.find(p => p.provider_id === providerId) ?? null;
    case "product": return productProfiles.find(p => p.provider_id === providerId) ?? null;
    default: return null;
  }
}
