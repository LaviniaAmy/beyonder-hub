import type { CategoryType } from "@/lib/featureGating";
import type { Region } from "@/data/mockData";

// The canonical column headers for the Beyonder provider import template
export const CSV_TEMPLATE_HEADERS = [
  "business_name",
  "category_type",        // therapist | club | education | charity | product
  "region",               // UK region or "Online Only"
  "location",             // e.g. "Bristol, South West"
  "coverage_area",        // e.g. "Within 10 miles of Bristol"
  "short_description",    // 1–2 sentences shown on cards (max 160 chars)
  "full_description",     // Full profile description (max 800 chars)
  "needs_supported",      // Comma-separated: "Autism, ADHD, Sensory Processing"
  "age_range",            // e.g. "0–18" or "5–16"
  "delivery_format",      // in-person | online | hybrid
  // ── Admin-only contact fields ─────────────────────────────
  "contact_name",
  "email",
  "phone",
  "website",
  "contact_method",       // email | phone | online_form | social_only | unknown
  "contact_form_url",     // URL to provider's own contact/enquiry form
  "social_facebook",      // Facebook page URL
  "social_instagram",     // Instagram profile URL
  "social_other",         // LinkedIn, X, Linktree, or any other link
];

export const CSV_TEMPLATE_EXAMPLE_ROW = [
  "Bright Steps Therapy",
  "therapist",
  "South West",
  "Bristol, South West",
  "Within 15 miles of Bristol city centre",
  "Specialist speech and language therapy for children with autism and communication needs.",
  "Bright Steps Therapy provides evidence-based speech and language therapy for children aged 2–18. Our team of qualified SaLTs works with families across Bristol to support communication, social skills, and school readiness.",
  "Autism, Speech & Language, Social Communication",
  "2–18",
  "in-person",
  "Sarah Mitchell",
  "hello@brightsteps.co.uk",
  "07700 900000",
  "https://brightsteps.co.uk",
  "email",
  "",
  "https://facebook.com/brightstepstherapy",
  "https://instagram.com/brightstepstherapy",
  "",
];

export type ContactMethod = "email" | "phone" | "online_form" | "social_only" | "unknown";

export interface ParsedProviderRow {
  businessName: string;
  category_type: CategoryType;
  region: Region | null;
  location: string;
  coverageArea: string;
  shortDescription: string;
  description: string;
  needsSupported: string[];
  ageRange: string;
  deliveryFormat: "in-person" | "online" | "hybrid";
  // Admin-only contact fields
  contactName: string;
  email: string;
  phone: string;
  website: string;
  contactMethodType: ContactMethod;
  contactFormUrl: string;
  socialFacebook: string;
  socialInstagram: string;
  socialOther: string;
  // errors found during validation
  errors: string[];
}

const VALID_CATEGORIES: CategoryType[] = ["therapist", "club", "education", "charity", "product"];
const VALID_FORMATS = ["in-person", "online", "hybrid"];
const VALID_CONTACT_METHODS: ContactMethod[] = ["email", "phone", "online_form", "social_only", "unknown"];

export function generateCSVTemplate(): string {
  const rows = [CSV_TEMPLATE_HEADERS.join(","), CSV_TEMPLATE_EXAMPLE_ROW.map(quoteCell).join(",")];
  return rows.join("\n");
}

function quoteCell(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function parseCSV(raw: string): ParsedProviderRow[] {
  const lines = raw.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const cells = parseCSVLine(line);
    const get = (col: string) => cells[headers.indexOf(col)]?.trim() ?? "";

    const errors: string[] = [];

    const businessName = get("business_name");
    if (!businessName) errors.push("business_name is required");

    const rawCategory = get("category_type").toLowerCase();
    const categoryValid = VALID_CATEGORIES.includes(rawCategory as CategoryType);
    if (rawCategory && !categoryValid) {
      errors.push(`category_type "${rawCategory}" not recognised — must be one of: ${VALID_CATEGORIES.join(", ")}`);
    }

    const rawFormat = get("delivery_format").toLowerCase();
    const formatValid = VALID_FORMATS.includes(rawFormat);
    // Non-blocking: default to "in-person" if blank or unrecognised
    const deliveryFormat = formatValid ? rawFormat : "in-person";

    return {
      businessName,
      category_type: (categoryValid ? rawCategory : "") as CategoryType,
      region: (get("region") as Region) || null,
      location: get("location"),
      coverageArea: get("coverage_area"),
      shortDescription: get("short_description"),
      description: get("full_description"),
      needsSupported: get("needs_supported")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      ageRange: get("age_range"),
      deliveryFormat: deliveryFormat as "in-person" | "online" | "hybrid",
      contactName: get("contact_name"),
      email: get("email"),
      phone: get("phone"),
      website: get("website"),
      contactMethodType: (VALID_CONTACT_METHODS.includes(get("contact_method") as ContactMethod)
        ? get("contact_method")
        : "unknown") as ContactMethod,
      contactFormUrl: get("contact_form_url"),
      socialFacebook: get("social_facebook"),
      socialInstagram: get("social_instagram"),
      socialOther: get("social_other"),
      errors,
    };
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
