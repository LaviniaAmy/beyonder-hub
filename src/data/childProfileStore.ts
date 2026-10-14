// ── Child profiles ──────────────────────────────────────────
// TEST VERSION: saved in this browser only (see persist.ts). Real children's data must not be stored
// until this moves to Supabase — see CLAUDE.md "For Yash" for the security requirements.
import { loadSaved, save } from "@/data/persist";
import { SECTIONS, type SectionId, type DiagnosisStatus } from "@/data/childProfileOptions";
import { AGES, HELP } from "@/components/beyonder-app/data";

export type Pose = "perched" | "flying" | "waving" | "snuggled";
export type HeadExtra = "none" | "hat" | "bow";
export type EarExtra = "none" | "ear_defenders" | "headphones" | "hearing_aids";

export interface AvatarLook {
  colour: string;
  pose: Pose;
  head: HeadExtra;
  ears: EarExtra;
  glasses: boolean;
  necklace: boolean;
  toy: boolean;
}

export interface ChildAnswers {
  multi: Record<string, string[]>;
  /** The parent's own words, added under a list. */
  own: Record<string, string[]>;
  single: Record<string, string>;
  text: Record<string, string>;
  diagnoses: Record<string, DiagnosisStatus>;
}

export interface ConsentRecord {
  version: string;
  text: string;
  at: string;
}

export interface ChildProfile {
  id: string;
  parentId: string;
  firstName: string;
  birthMonth: number | null;
  birthYear: number | null;
  avatar: AvatarLook;
  answers: ChildAnswers;
  /** Required before anything is saved. */
  storageConsent: ConsentRecord;
  /** Separate, optional and unticked by default. null = not opted in. */
  researchConsent: ConsentRecord | null;
  researchReminder: { neverAsk: boolean; lastDismissedAt: string | null };
  /** providerId → sections that provider may see. Nothing is shared by default. */
  sharing: Record<string, SectionId[]>;
  createdAt: string;
  updatedAt: string;
}

// ── Consent wording (versioned — the exact text is stored with each record) ──
export const CONSENT_VERSION = "2026-10-v1";
export const STORAGE_CONSENT_TEXT =
  "I'm this child's parent or have parental responsibility, and I agree to Beyonder storing the information I add so I can use it and choose who to share it with.";
export const researchConsentText = (name: string) =>
  `Yes, include ${name || "my child"}'s answers in Beyonder's anonymous research statistics.`;

export const RESEARCH_REMINDER_DAYS = 30;

export const DEFAULT_AVATAR: AvatarLook = {
  colour: "blue-deep", pose: "perched", head: "none", ears: "none", glasses: false, necklace: false, toy: false,
};

const emptyAnswers = (): ChildAnswers => ({ multi: {}, own: {}, single: {}, text: {}, diagnoses: {} });

// ── Store ──
const STORAGE_KEY = "beyonder_children_v1";
const children: ChildProfile[] = loadSaved<ChildProfile[]>(STORAGE_KEY) ?? [];
const persist = () => save(STORAGE_KEY, children);
const now = () => new Date().toISOString();

export function getChildren(parentId: string): ChildProfile[] {
  return children.filter((c) => c.parentId === parentId);
}

export function getChild(parentId: string, id: string): ChildProfile | undefined {
  return children.find((c) => c.id === id && c.parentId === parentId);
}

export function createChild(data: {
  parentId: string;
  firstName: string;
  birthMonth: number | null;
  birthYear: number | null;
  avatar: AvatarLook;
  answers?: ChildAnswers;
  storageConsentGiven: boolean;
  /** The exact wording the parent agreed to, when it wasn't the setup page's (e.g. the app's "save" box). */
  consentText?: string;
}): ChildProfile {
  if (!data.storageConsentGiven) throw new Error("A child profile can't be saved without the parent's consent.");
  const at = now();
  const child: ChildProfile = {
    id: `child-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    parentId: data.parentId,
    firstName: data.firstName.trim(),
    birthMonth: data.birthMonth,
    birthYear: data.birthYear,
    avatar: data.avatar,
    answers: data.answers ?? emptyAnswers(),
    storageConsent: { version: CONSENT_VERSION, text: data.consentText ?? STORAGE_CONSENT_TEXT, at },
    researchConsent: null,
    researchReminder: { neverAsk: false, lastDismissedAt: null },
    sharing: {},
    createdAt: at,
    updatedAt: at,
  };
  children.push(child);
  persist();
  return child;
}

export function updateChild(parentId: string, id: string, updates: Partial<Omit<ChildProfile, "id" | "parentId" | "storageConsent">>) {
  const i = children.findIndex((c) => c.id === id && c.parentId === parentId);
  if (i === -1) return undefined;
  children[i] = { ...children[i], ...updates, updatedAt: now() };
  persist();
  return children[i];
}

export function deleteChild(parentId: string, id: string) {
  const i = children.findIndex((c) => c.id === id && c.parentId === parentId);
  if (i !== -1) { children.splice(i, 1); persist(); }
}

export function setResearchConsent(parentId: string, id: string, optIn: boolean) {
  const c = getChild(parentId, id);
  if (!c) return;
  updateChild(parentId, id, {
    researchConsent: optIn ? { version: CONSENT_VERSION, text: researchConsentText(c.firstName), at: now() } : null,
  });
}

export function dismissResearchReminder(parentId: string, id: string, neverAsk = false) {
  const c = getChild(parentId, id);
  if (!c) return;
  updateChild(parentId, id, { researchReminder: { neverAsk: c.researchReminder.neverAsk || neverAsk, lastDismissedAt: now() } });
}

/** The gentle monthly line: only when not opted in, not "don't ask again", and 30+ days since setup or the last dismissal. */
export function shouldShowResearchReminder(c: ChildProfile, at: Date = new Date()): boolean {
  if (c.researchConsent || c.researchReminder.neverAsk) return false;
  const since = new Date(c.researchReminder.lastDismissedAt ?? c.createdAt).getTime();
  return at.getTime() - since >= RESEARCH_REMINDER_DAYS * 24 * 60 * 60 * 1000;
}

// ── Helpers ──
export function ageText(c: Pick<ChildProfile, "birthMonth" | "birthYear">, at: Date = new Date()): string {
  if (!c.birthYear) return "";
  let years = at.getFullYear() - c.birthYear;
  if (c.birthMonth && at.getMonth() + 1 < c.birthMonth) years -= 1;
  if (years < 1) return "under 1";
  return String(years);
}

export function sectionFilled(a: ChildAnswers, id: SectionId): boolean {
  const s = SECTIONS.find((x) => x.id === id)!;
  return s.groups.some((g) =>
    g.kind === "multi" ? (a.multi[g.id]?.length ?? 0) > 0 || (a.own[g.id]?.length ?? 0) > 0
      : g.kind === "single" ? !!a.single[g.id]
        : g.kind === "text" ? !!a.text[g.id]?.trim()
          : Object.keys(a.diagnoses).length > 0 || (a.own[g.id]?.length ?? 0) > 0,
  );
}

export const completeness = (a: ChildAnswers) =>
  Math.round((SECTIONS.filter((s) => sectionFilled(a, s.id)).length / SECTIONS.length) * 100);

/** Short peek for a tile, e.g. "Dinosaurs, Trains +2". */
export function sectionPeek(a: ChildAnswers, id: SectionId): string {
  const s = SECTIONS.find((x) => x.id === id)!;
  const labels: string[] = [];
  for (const g of s.groups) {
    const opt = (code: string) => g.options?.find((x) => x.code === code)?.label ?? code;
    if (g.kind === "multi") labels.push(...(a.multi[g.id] ?? []).map(opt), ...(a.own[g.id] ?? []));
    else if (g.kind === "single" && a.single[g.id]) labels.push(opt(a.single[g.id]));
    else if (g.kind === "diagnosis") labels.push(...Object.keys(a.diagnoses).map(opt), ...(a.own[g.id] ?? []));
    else if (g.kind === "text" && a.text[g.id]?.trim()) labels.push(a.text[g.id].trim());
  }
  if (!labels.length) return "";
  const shown = labels.slice(0, 2).join(", ");
  return labels.length > 2 ? `${shown} +${labels.length - 2}` : shown;
}

// ── Carry over the homepage questions (kept in this browser tab by the app) ──
const APP_STATE_KEY = "beyonder-app-state";
// App "what are they finding hard" keys → "What I find hard" codes.
const NEED_TO_STRUGGLE: Record<string, string> = {
  speech: "speech", sensory: "sensory_overload", behaviour: "big_feelings", learning: "learning",
  social: "friendships", movement: "coordination", school: "school",
};
// App age bands → a likely birth year (the parent confirms or changes it).
const AGE_TO_YEARS: Record<string, number> = { u5: 3, a5: 8, a12: 14, a16: 18 };

export interface AppPrefill { answers: ChildAnswers; birthYear: number | null; ageLabel: string | null; childName: string; found: boolean }

export function readAppPrefill(at: Date = new Date()): AppPrefill {
  const answers = emptyAnswers();
  let state: { age?: string | null; needs?: string[]; help?: string | null; child?: string } = {};
  try { state = JSON.parse(sessionStorage.getItem(APP_STATE_KEY) ?? "{}"); } catch { /* unavailable */ }
  const struggles = (state.needs ?? []).map((n) => NEED_TO_STRUGGLE[n]).filter(Boolean);
  if (struggles.length) answers.multi.struggles = struggles;
  if (state.help && HELP[state.help]) answers.text.hopes = HELP[state.help];
  const years = state.age ? AGE_TO_YEARS[state.age] : undefined;
  return {
    answers,
    birthYear: years ? at.getFullYear() - years : null,
    ageLabel: state.age ? AGES[state.age] ?? null : null,
    childName: (state.child ?? "").trim(),
    found: struggles.length > 0 || !!state.help || !!state.age,
  };
}

/** Everything held about one child, for the parent's "Download my data". */
export function exportChild(c: ChildProfile): string {
  return JSON.stringify(c, null, 2);
}
