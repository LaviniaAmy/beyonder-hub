export const regions = [
  "South East England",
  "South West England",
  "North East England",
  "North West England",
  "East Midlands",
  "West Midlands",
  "London",
  "Wales",
  "Scotland",
  "Northern Ireland",
  "Online Only",
] as const;

export type Region = (typeof regions)[number];

import type { CategoryType, PlanType, PlanStatus } from "@/lib/featureGating";

export interface Provider {
  id: string;
  name: string;
  type: "therapist" | "activity" | "product" | "education" | "charity";
  category_type: CategoryType;
  typeBadge: string;
  description: string;
  shortDescription: string;
  location: string;
  region: Region | null;
  coverageArea: string;
  needsSupported: string[];
  ageRange: string;
  deliveryFormat: "in-person" | "online" | "hybrid";
  verified: boolean;
  foundingProvider: boolean;
  rating: number;
  reviewCount: number;
  contactMethod: string;
  searchTags: string[];
  // Plan fields
  plan_type: PlanType;
  plan_status: PlanStatus;
  plan_expires_at: string | null;
  search_boost: number;
  // Legacy optional fields (now in module tables but kept for compat)
  credentials?: string[];
  timetable?: { day: string; time: string; activity: string }[];
  products?: { name: string; price: string; image: string }[];
  educationDetails?: string;
}

export interface Review {
  id: string;
  providerId: string;
  authorName: string;
  rating: number;
  text: string;
  date: string;
}

export interface Enquiry {
  id: string;
  providerId: string;
  providerName: string;
  parentName: string;
  message: string;
  childAge: string;
  status: "sent" | "replied" | "read";
  date: string;
  reply?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  providerType: Provider["type"];
}

export const categories: Category[] = [
  { id: "therapists", name: "Therapists & Specialists", description: "Speech therapists, OTs, psychologists and more", icon: "Heart", providerType: "therapist" },
  { id: "activities", name: "Inclusive Clubs & Activities", description: "Sports, arts, social groups designed for SEND children", icon: "Users", providerType: "activity" },
  { id: "products", name: "Products & Equipment", description: "Sensory tools, adaptive equipment, specialist resources", icon: "ShoppingBag", providerType: "product" },
  { id: "education", name: "Education & Learning Support", description: "Tutors, SEN schools, home education resources", icon: "GraduationCap", providerType: "education" },
  { id: "charities", name: "Charities & Support Organisations", description: "Local and national charities offering guidance and support", icon: "HandHeart", providerType: "charity" },
];


const founderPlanDefaults = {
  plan_type: "founder" as const,
  plan_status: "active" as const,
  plan_expires_at: null,
  search_boost: 0,
};

export const providers: Provider[] = [
  {
    id: "1",
    name: "Bright Minds Speech Therapy",
    type: "therapist",
    category_type: "therapist",
    typeBadge: "Speech & Language Therapist",
    description: "We provide specialist speech and language therapy for children with a range of communication needs. Our team of experienced therapists work with families to develop individualised programmes that support children's development in a warm, welcoming environment.",
    shortDescription: "Specialist speech therapy for children with communication needs",
    location: "Bristol, BS1",
    region: "South West England",
    coverageArea: "Bristol & South Gloucestershire",
    needsSupported: ["Autism", "Speech Delay", "ADHD", "Down Syndrome"],
    ageRange: "2-16 years",
    deliveryFormat: "hybrid",
    verified: true,
    foundingProvider: true,
    rating: 4.8,
    reviewCount: 24,
    contactMethod: "Email or phone",
    searchTags: ["therapist", "therapy", "speech", "language", "communication", "salt", "hybrid", "bristol"],
    credentials: ["HCPC Registered", "RCSLT Member", "DBS Enhanced"],
    ...founderPlanDefaults,
  },
  {
    id: "2",
    name: "Splash Inclusive Swimming",
    type: "activity",
    category_type: "club",
    typeBadge: "Inclusive Activity",
    description: "Splash offers fully inclusive swimming sessions for children and young people with additional needs. Our instructors are trained in SEND awareness and adapt sessions to suit each individual.",
    shortDescription: "Inclusive swimming sessions adapted for SEND children",
    location: "Bath, BA1",
    region: "South West England",
    coverageArea: "Bath & North East Somerset",
    needsSupported: ["Autism", "Physical Disability", "Sensory Processing", "Learning Disability"],
    ageRange: "4-18 years",
    deliveryFormat: "in-person",
    verified: true,
    foundingProvider: false,
    rating: 4.6,
    reviewCount: 18,
    contactMethod: "Online booking",
    searchTags: ["swimming", "swim", "club", "clubs", "activity", "activities", "sessions", "inclusive", "sport", "water"],
    timetable: [
      { day: "Monday", time: "16:00-17:00", activity: "Beginners (ages 4-8)" },
      { day: "Wednesday", time: "16:00-17:00", activity: "Intermediate (ages 8-14)" },
      { day: "Saturday", time: "10:00-11:00", activity: "All abilities (ages 4-18)" },
    ],
    ...founderPlanDefaults,
  },
  {
    id: "3",
    name: "SensoryPlay Shop",
    type: "product",
    category_type: "product",
    typeBadge: "Product Seller",
    description: "We curate and sell specialist sensory products, fidget tools, and adaptive equipment for children with sensory processing needs, autism, and ADHD.",
    shortDescription: "Specialist sensory products and adaptive equipment",
    location: "Online",
    region: null,
    coverageArea: "UK-wide delivery",
    needsSupported: ["Sensory Processing", "Autism", "ADHD"],
    ageRange: "All ages",
    deliveryFormat: "online",
    verified: true,
    foundingProvider: false,
    rating: 4.4,
    reviewCount: 32,
    contactMethod: "Website contact form",
    searchTags: ["products", "equipment", "sensory", "fidget", "aids", "resources", "shop", "adaptive", "tools"],
    products: [
      { name: "Weighted Lap Pad", price: "£24.99", image: "/placeholder.svg" },
      { name: "Chewable Necklace Set", price: "£12.99", image: "/placeholder.svg" },
      { name: "Sensory Fidget Kit", price: "£18.99", image: "/placeholder.svg" },
    ],
    ...founderPlanDefaults,
  },
  {
    id: "4",
    name: "Learning Tree Tutoring",
    type: "education",
    category_type: "education",
    typeBadge: "Education Support",
    description: "Specialist tutoring for children with dyslexia, dyscalculia, and other specific learning differences. We use evidence-based approaches tailored to each child's unique learning style.",
    shortDescription: "Specialist tutoring for children with learning differences",
    location: "Cardiff, CF10",
    region: "Wales",
    coverageArea: "Cardiff & Vale of Glamorgan",
    needsSupported: ["Dyslexia", "Dyscalculia", "ADHD", "Autism"],
    ageRange: "5-16 years",
    deliveryFormat: "hybrid",
    verified: true,
    foundingProvider: true,
    rating: 4.9,
    reviewCount: 15,
    contactMethod: "Email",
    searchTags: ["tutor", "tutoring", "education", "learning", "dyslexia", "dyscalculia", "school", "homework", "reading"],
    educationDetails: "All tutors hold QTS or equivalent and have specialist SEND training. We offer 1:1 and small group sessions.",
    ...founderPlanDefaults,
  },
  {
    id: "5",
    name: "SEND Families United",
    type: "charity",
    category_type: "charity",
    typeBadge: "Charity",
    description: "A local charity providing emotional support, advice, and community events for families of children with special educational needs and disabilities.",
    shortDescription: "Community support and advice for SEND families",
    location: "Manchester, M1",
    region: "North West England",
    coverageArea: "Greater Manchester",
    needsSupported: ["All SEND needs"],
    ageRange: "0-25 years",
    deliveryFormat: "hybrid",
    verified: true,
    foundingProvider: false,
    rating: 4.7,
    reviewCount: 41,
    contactMethod: "Phone helpline",
    searchTags: ["charity", "support", "community", "advice", "families", "events", "helpline", "send"],
    ...founderPlanDefaults,
  },
  {
    id: "6",
    name: "Focus OT Services",
    type: "therapist",
    category_type: "therapist",
    typeBadge: "Occupational Therapist",
    description: "Expert occupational therapy helping children develop fine motor skills, sensory regulation, and daily living skills. We work closely with schools and families.",
    shortDescription: "Expert OT for motor skills and sensory regulation",
    location: "London, SE1",
    region: "London",
    coverageArea: "South East London",
    needsSupported: ["Autism", "Dyspraxia", "Sensory Processing", "ADHD"],
    ageRange: "3-18 years",
    deliveryFormat: "in-person",
    verified: true,
    foundingProvider: false,
    rating: 4.5,
    reviewCount: 12,
    contactMethod: "Email or phone",
    searchTags: ["therapist", "therapy", "ot", "occupational", "motor", "sensory", "regulation", "dyspraxia"],
    credentials: ["HCPC Registered", "RCOT Member", "Sensory Integration Certified"],
    ...founderPlanDefaults,
  },
  {
    id: "7",
    name: "Northern Stars Music Therapy",
    type: "therapist",
    category_type: "therapist",
    typeBadge: "Music Therapist",
    description: "Music therapy sessions designed to support emotional regulation, communication, and social interaction for children and young people with SEND.",
    shortDescription: "Music therapy for emotional and social development",
    location: "Newcastle, NE1",
    region: "North East England",
    coverageArea: "Tyne & Wear",
    needsSupported: ["Autism", "Anxiety", "ADHD", "Learning Disability"],
    ageRange: "3-18 years",
    deliveryFormat: "in-person",
    verified: true,
    foundingProvider: false,
    rating: 4.7,
    reviewCount: 9,
    contactMethod: "Email",
    searchTags: ["therapist", "therapy", "music", "emotional", "regulation", "social", "creative"],
    credentials: ["HCPC Registered", "BAMT Member"],
    ...founderPlanDefaults,
  },
  {
    id: "8",
    name: "Online SEND Counselling",
    type: "therapist",
    category_type: "therapist",
    typeBadge: "Counsellor",
    description: "Accessible online counselling for parents and young people navigating SEND challenges. Available UK-wide via video call.",
    shortDescription: "UK-wide online counselling for SEND families",
    location: "Online",
    region: "Online Only",
    coverageArea: "UK-wide",
    needsSupported: ["Anxiety", "Depression", "Autism", "ADHD"],
    ageRange: "10+ years",
    deliveryFormat: "online",
    verified: true,
    foundingProvider: false,
    rating: 4.6,
    reviewCount: 22,
    contactMethod: "Online booking",
    searchTags: ["counsellor", "counselling", "therapy", "therapist", "online", "mental health", "anxiety", "depression"],
    credentials: ["BACP Registered"],
    ...founderPlanDefaults,
  },
  {
    id: "9",
    name: "Sunshine SEND Club",
    type: "activity",
    category_type: "club",
    typeBadge: "Inclusive Activity",
    description: "Sunshine SEND Club runs weekly after-school and weekend clubs for children with additional needs. Activities include arts & crafts, drama, cooking, and outdoor play in a safe, inclusive environment.",
    shortDescription: "Weekly inclusive clubs with arts, drama, cooking & outdoor play",
    location: "London, E3",
    region: "London",
    coverageArea: "East London",
    needsSupported: ["Autism", "ADHD", "Learning Disability", "Down Syndrome", "Sensory Processing"],
    ageRange: "4-14 years",
    deliveryFormat: "in-person",
    verified: true,
    foundingProvider: false,
    rating: 4.8,
    reviewCount: 27,
    contactMethod: "Email or phone",
    searchTags: ["club", "clubs", "activity", "activities", "sessions", "classes", "after school", "inclusive", "kids", "arts", "crafts", "drama", "cooking", "outdoor", "play", "weekend"],
    timetable: [
      { day: "Tuesday", time: "15:30-17:30", activity: "After-school club (ages 4-8)" },
      { day: "Thursday", time: "15:30-17:30", activity: "After-school club (ages 8-14)" },
      { day: "Saturday", time: "10:00-12:00", activity: "Weekend club (all ages)" },
    ],
    ...founderPlanDefaults,
  },
];

export const reviews: Review[] = [
  { id: "r1", providerId: "1", authorName: "Sarah M.", rating: 5, text: "Absolutely fantastic. My son has made incredible progress with his speech since starting here.", date: "2025-11-15" },
  { id: "r2", providerId: "1", authorName: "James T.", rating: 5, text: "Professional, warm, and truly understanding of our daughter's needs.", date: "2025-10-22" },
  { id: "r3", providerId: "2", authorName: "Emma L.", rating: 4, text: "My daughter loves the Saturday sessions. The instructors are so patient.", date: "2025-12-01" },
  { id: "r4", providerId: "3", authorName: "Rachel K.", rating: 5, text: "Great quality sensory products. Fast delivery and well-packaged.", date: "2025-11-28" },
  { id: "r5", providerId: "4", authorName: "David P.", rating: 5, text: "The tutoring has transformed our son's confidence with reading.", date: "2025-12-10" },
  { id: "r6", providerId: "5", authorName: "Lisa H.", rating: 5, text: "This charity has been a lifeline for our family. Cannot recommend enough.", date: "2025-09-15" },
];

export const enquiries: Enquiry[] = [
  { id: "e1", providerId: "1", providerName: "Bright Minds Speech Therapy", parentName: "Jane Smith", message: "Hi, I'm looking for speech therapy for my 5-year-old son who has a speech delay. Could you tell me about your availability and approach?", childAge: "5", status: "replied", date: "2026-01-15", reply: "Hi Jane, thank you for reaching out. We'd be happy to discuss how we can help your son. We currently have availability on Tuesday and Thursday afternoons. Would you like to book an initial assessment?" },
  { id: "e2", providerId: "2", providerName: "Splash Inclusive Swimming", parentName: "Jane Smith", message: "Are there spaces in the Saturday all-abilities session for my 7-year-old daughter?", childAge: "7", status: "sent", date: "2026-01-20" },
  { id: "e3", providerId: "4", providerName: "Learning Tree Tutoring", parentName: "Mark Johnson", message: "My 10-year-old has been diagnosed with dyslexia. Do you offer online sessions?", childAge: "10", status: "replied", date: "2026-01-10", reply: "Hi Mark, yes we do offer online sessions for dyslexia support. We'd recommend starting with an assessment to understand your child's specific needs." },
];

export const mockParent = {
  name: "Jane Smith",
  email: "jane@example.com",
  subscriptionTier: "free" as const,
};

export const mockProvider = {
  id: "1",
  name: "Bright Minds Speech Therapy",
  email: "info@brightminds.co.uk",
};
