// Content and data for the Beyonder app flow (mobile home + /start).
// Specialists are samples, as in the prototype. Local support uses the real directory (providerStore).
import TherapistsIcon from "@/assets/icons/Therapists_Icon.svg";
import ClubsIcon from "@/assets/icons/Clubs_Icon.svg";
import ShoppingIcon from "@/assets/icons/Shopping_Icon.svg";
import EducationIcon from "@/assets/icons/Education_Icon.svg";
import CharitiesIcon from "@/assets/icons/Charities_Icon.svg";

export const AGES: Record<string, string> = { u5: "Under 5", a5: "5 to 11", a12: "12 to 16", a16: "16 to 25" };
export const NEEDS: Record<string, string> = {
  speech: "Speech and communication", sensory: "Sensory", behaviour: "Behaviour and emotions", learning: "Learning",
  social: "Friendships and social", movement: "Movement and coordination", school: "School or EHCP", unsure: "Not sure yet",
};
export const HELP: Record<string, string> = {
  talk: "Talk it through with a specialist", next: "Advice on next steps", second: "A second opinion",
  meeting: "Help preparing for a school or EHCP meeting",
};

export type QKey = "age" | "needs" | "help" | "area";
export interface Question { title: string; hint: string; type: "single" | "multi" | "area"; opts?: Record<string, string>; grid?: boolean }
export const Q: Record<QKey, Question> = {
  age:   { title: "How old is your child?", hint: "More than one child? Start with one. You can add others to your profile later.", type: "single", opts: AGES, grid: true },
  needs: { title: "What are they finding hard at the moment?", hint: "Choose as many as you like. You don’t need a diagnosis.", type: "multi", opts: NEEDS },
  help:  { title: "What would help most right now?", hint: "This helps us suggest the right kind of specialist.", type: "single", opts: HELP },
  area:  { title: "Where are you looking?", hint: "A town or postcode. We’ll show support closest to you first.", type: "area" },
};

export type Path = "consult" | "find";
export const FLOW: Record<Path, QKey[]> = { consult: ["age", "needs", "help"], find: ["age", "needs"] };

// England regions on the map: [full name, short map label]
export const REGIONS: Record<string, [string, string]> = {
  nw: ["North West", "North West"], ne: ["North East", "North East"], yh: ["Yorkshire and the Humber", "Yorkshire"],
  wm: ["West Midlands", "W. Midlands"], em: ["East Midlands", "E. Midlands"], ee: ["East of England", "East"],
  sw: ["South West", "South West"], lo: ["London", "London"], se: ["South East", "South East"],
};

export interface CatCard { k: string; t: string; d: string; icon: string; wide?: boolean }
export const CATCARDS: CatCard[] = [
  { k: "therapy",   t: "Therapists and specialists",  d: "OTs, speech therapists, psychologists", icon: TherapistsIcon },
  { k: "clubs",     t: "Clubs and activities",        d: "Sport, arts, sensory play",             icon: ClubsIcon },
  { k: "products",  t: "Products and equipment",      d: "Sensory, adaptive, learning",           icon: ShoppingIcon },
  { k: "education", t: "Education and learning",      d: "Tutors, SENCo help, EHCP support",      icon: EducationIcon },
  { k: "charities", t: "Charities and organisations", d: "Support groups, advocacy, free advice", icon: CharitiesIcon, wide: true },
];

export type Fmt = "video" | "phone" | "chat";
export interface Specialist {
  id: string; first: string; name: string; ini: string; role: string; focus: string;
  tags: string[]; slot: string; price: string; fmt: Fmt[];
}
export const SPECS: Specialist[] = [
  { id: "rl", first: "Ruth", name: "Ruth Levene", ini: "RL", role: "Occupational therapist, HCPC registered", focus: "Sensory processing, daily routines, handwriting and fine motor skills.", tags: ["sensory", "movement", "learning"], slot: "Today, 7:30pm", price: "£45 for 30 minutes", fmt: ["video", "phone", "chat"] },
  { id: "pn", first: "Priya", name: "Priya Nandakumar", ini: "PN", role: "SEND education advisor, former SENCo", focus: "EHCP applications, annual reviews and getting ready for school meetings.", tags: ["school", "learning", "unsure"], slot: "Today, 8:15pm", price: "£35 for 30 minutes", fmt: ["video", "phone", "chat"] },
  { id: "jw", first: "James", name: "James Whitfield", ini: "JW", role: "Speech and language therapist, HCPC registered", focus: "Late talkers, AAC and social communication.", tags: ["speech", "social"], slot: "Tomorrow, 9:00am", price: "£45 for 30 minutes", fmt: ["video", "phone"] },
  { id: "ao", first: "Amara", name: "Dr Amara Okafor", ini: "AO", role: "Clinical psychologist, HCPC registered", focus: "Anxiety, meltdowns and emotional regulation at home and school.", tags: ["behaviour", "social", "unsure"], slot: "Thursday, 8:00pm", price: "£60 for 30 minutes", fmt: ["video"] },
];

export const CATS: Record<string, string> = {
  all: "All", therapy: "Therapy", clubs: "Clubs and activities", education: "Education", products: "Products", charities: "Charities",
};

// App category keys → directory provider types (see mockData categories).
export const CAT_TYPE: Record<string, string> = {
  therapy: "therapist", clubs: "activity", products: "product", education: "education", charities: "charity",
};

// Map region keys → directory region names (mockData `regions`).
export const REGION_DIRECTORY_NAME: Record<string, string> = {
  ne: "North East England", nw: "North West England", yh: "Yorkshire and the Humber", em: "East Midlands",
  wm: "West Midlands", ee: "East of England", lo: "London", se: "South East England", sw: "South West England",
};

// Words in a provider's needs, tags and descriptions that match each answer — used to put best matches first.
export const NEED_KEYWORDS: Record<string, string[]> = {
  speech: ["speech", "language", "communication"],
  sensory: ["sensory"],
  behaviour: ["behaviour", "emotion", "anxiety", "adhd"],
  learning: ["learning", "dyslexia", "dyscalculia"],
  social: ["social", "autism", "friend"],
  movement: ["movement", "dyspraxia", "physical", "motor", "coordination"],
  school: ["ehcp", "school", "education"],
};
