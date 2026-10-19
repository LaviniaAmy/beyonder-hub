// ── Child profile → enquiries and bookings ──────────────────
// Fills in the enquiry forms (provider page and homepage app) from a child's profile, and records what the
// parent chose to share. Nothing is shared unless the parent leaves it ticked; Diagnosis and Safety start unticked.
import { SECTIONS, DIAGNOSIS_STATUS, type SectionId } from "@/data/childProfileOptions";
import { ageText, createChild, getChild, readAppPrefill, sectionFilled, updateChild, DEFAULT_AVATAR, type ChildProfile } from "@/data/childProfileStore";
import type { SharedProfile } from "@/data/enquiryStore";

/** The most sensitive sections — offered, but never ticked for the parent. */
export const UNTICKED_BY_DEFAULT: SectionId[] = ["diagnosis", "safety"];

export const filledSections = (c: ChildProfile): SectionId[] =>
  SECTIONS.filter((s) => sectionFilled(c.answers, s.id)).map((s) => s.id);

export const defaultShare = (c: ChildProfile): SectionId[] =>
  filledSections(c).filter((id) => !UNTICKED_BY_DEFAULT.includes(id));

/** Everything in one section as readable lines, e.g. "Autism (Diagnosed)" or "Setting: Mainstream school". */
export function sectionItems(c: ChildProfile, id: SectionId): string[] {
  const a = c.answers;
  const s = SECTIONS.find((x) => x.id === id)!;
  const items: string[] = [];
  for (const g of s.groups) {
    const label = (code: string) => g.options?.find((o) => o.code === code)?.label ?? code;
    const many = s.groups.length > 1;
    if (g.kind === "multi") {
      const vals = [...(a.multi[g.id] ?? []).map(label), ...(a.own[g.id] ?? [])];
      if (vals.length) items.push(many ? `${g.label}: ${vals.join(", ")}` : vals.join(", "));
    } else if (g.kind === "single" && a.single[g.id]) {
      items.push(`${g.label}: ${label(a.single[g.id])}`);
    } else if (g.kind === "text" && a.text[g.id]?.trim()) {
      items.push(`${g.label.replace(/…$/, "")}: ${a.text[g.id].trim()}`);
    } else if (g.kind === "diagnosis") {
      const vals = [
        ...Object.entries(a.diagnoses).map(([code, st]) => `${label(code)} (${DIAGNOSIS_STATUS[st].toLowerCase()})`),
        ...(a.own[g.id] ?? []),
      ];
      if (vals.length) items.push(vals.join(", "));
    }
  }
  return items;
}

export function buildSharedProfile(c: ChildProfile, ids: SectionId[]): SharedProfile {
  return {
    childId: c.id,
    sections: SECTIONS.filter((s) => ids.includes(s.id))
      .map((s) => ({ id: s.id, title: s.title, items: sectionItems(c, s.id) }))
      .filter((s) => s.items.length > 0),
  };
}

/** "7 years", "under 1" or "" when no birth year was given. */
export function childAgeLabel(c: ChildProfile, at: Date = new Date()): string {
  const t = ageText(c, at);
  if (!t) return "";
  return t === "under 1" ? "Under 1" : `${t} ${t === "1" ? "year" : "years"}`;
}

/** The "Needs" line on an enquiry: what they find hard, plus diagnoses only if Diagnosis is shared. */
export function childNeeds(c: ChildProfile, ids: SectionId[]): string {
  const hard = SECTIONS.find((s) => s.id === "hard")!.groups[0];
  const dx = SECTIONS.find((s) => s.id === "diagnosis")!.groups[1];
  const out: string[] = [];
  if (ids.includes("hard")) {
    out.push(...(c.answers.multi.struggles ?? []).map((code) => hard.options?.find((o) => o.code === code)?.label ?? code),
      ...(c.answers.own.struggles ?? []));
  }
  if (ids.includes("diagnosis")) {
    out.push(...Object.keys(c.answers.diagnoses).map((code) => dx.options?.find((o) => o.code === code)?.label ?? code),
      ...(c.answers.own.diagnoses ?? []));
  }
  return out.join(", ");
}

/** A short, friendly first message. The shared profile goes with it separately, so this stays short. */
export function draftFromProfile(to: string, c: ChildProfile, ids: SectionId[]): string {
  const name = c.firstName || "my child";
  const age = ageText(c);
  const hard = ids.includes("hard") ? childNeeds(c, ["hard"]).split(", ").filter(Boolean).slice(0, 4) : [];
  let m = `Hi ${to},\n\nI'm looking for support for ${name}${age ? `, who is ${age}` : ""}.`;
  if (hard.length) m += ` At the moment ${name} finds ${listText(hard.map((h) => h.toLowerCase()))} hard.`;
  m += " Could you tell me more about what you offer and whether you have space?";
  if (ids.length) m += `\n\nI've shared some of ${name}'s profile with you too.`;
  return m + "\n\nThank you.";
}

const listText = (a: string[]) => (a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]);

/** Remember on the child's profile which sections went to which provider (shown under "Who can see what"). */
export function recordSharing(parentId: string, childId: string, providerId: string, ids: SectionId[]) {
  const c = getChild(parentId, childId);
  if (!c || !ids.length) return;
  const cur = c.sharing[providerId] ?? [];
  updateChild(parentId, childId, { sharing: { ...c.sharing, [providerId]: [...new Set([...cur, ...ids])] } });
}

/** Wording of the homepage app's "save to my profile" box — stored as the consent record when it creates a profile. */
export const APP_SAVE_CONSENT_TEXT =
  "Save my child's details to a Beyonder profile so I don't have to type them again. I'm their parent or have parental responsibility. I can delete them at any time.";

/** Create a child profile from the homepage app's answers (the "save my child's details" box). */
export function createChildFromApp(parentId: string, childName: string): ChildProfile {
  const prefill = readAppPrefill();
  return createChild({
    parentId,
    firstName: childName.trim() || prefill.childName || "My child",
    birthMonth: null,
    birthYear: prefill.birthYear,
    avatar: DEFAULT_AVATAR,
    answers: prefill.answers,
    storageConsentGiven: true,
    consentText: APP_SAVE_CONSENT_TEXT,
  });
}
