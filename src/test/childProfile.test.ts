import { describe, it, expect, beforeEach, vi } from "vitest";

async function fresh() {
  vi.resetModules();
  return import("@/data/childProfileStore");
}

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });

const base = (s: Awaited<ReturnType<typeof fresh>>) => ({
  parentId: "parent-a", firstName: " Ava ", birthMonth: 3, birthYear: 2018, avatar: s.DEFAULT_AVATAR, storageConsentGiven: true,
});

describe("child profile store", () => {
  it("refuses to save without the parent's consent", async () => {
    const s = await fresh();
    expect(() => s.createChild({ ...base(s), storageConsentGiven: false })).toThrow();
    expect(s.getChildren("parent-a")).toHaveLength(0);
  });

  it("records the consent wording and keeps research off by default", async () => {
    const s = await fresh();
    const c = s.createChild(base(s));
    expect(c.firstName).toBe("Ava");
    expect(c.storageConsent).toMatchObject({ version: s.CONSENT_VERSION, text: s.STORAGE_CONSENT_TEXT });
    expect(c.researchConsent).toBeNull();
    expect(c.sharing).toEqual({});
  });

  it("survives a refresh, and only the owning parent can see it", async () => {
    let s = await fresh();
    const c = s.createChild(base(s));
    s = await fresh();
    expect(s.getChild("parent-a", c.id)?.firstName).toBe("Ava");
    expect(s.getChild("parent-b", c.id)).toBeUndefined();
    expect(s.getChildren("parent-b")).toHaveLength(0);
  });

  it("research opt-in is recorded with its wording and can be withdrawn", async () => {
    const s = await fresh();
    const c = s.createChild(base(s));
    s.setResearchConsent("parent-a", c.id, true);
    expect(s.getChild("parent-a", c.id)?.researchConsent?.text).toContain("Ava");
    s.setResearchConsent("parent-a", c.id, false);
    expect(s.getChild("parent-a", c.id)?.researchConsent).toBeNull();
  });

  it("deletes a child completely", async () => {
    let s = await fresh();
    const c = s.createChild(base(s));
    s.deleteChild("parent-a", c.id);
    s = await fresh();
    expect(s.getChildren("parent-a")).toHaveLength(0);
  });
});

describe("monthly research reminder", () => {
  it("waits 30 days, comes back 30 days after each dismissal, and stops for good", async () => {
    const s = await fresh();
    const c = s.createChild(base(s));
    const day = 24 * 60 * 60 * 1000;
    const created = new Date(c.createdAt).getTime();
    expect(s.shouldShowResearchReminder(c, new Date(created + 29 * day))).toBe(false);
    expect(s.shouldShowResearchReminder(c, new Date(created + 30 * day))).toBe(true);

    s.dismissResearchReminder("parent-a", c.id);
    const dismissed = s.getChild("parent-a", c.id)!;
    const at = new Date(dismissed.researchReminder.lastDismissedAt!).getTime();
    expect(s.shouldShowResearchReminder(dismissed, new Date(at + 10 * day))).toBe(false);
    expect(s.shouldShowResearchReminder(dismissed, new Date(at + 31 * day))).toBe(true);

    s.dismissResearchReminder("parent-a", c.id, true);
    expect(s.shouldShowResearchReminder(s.getChild("parent-a", c.id)!, new Date(at + 400 * day))).toBe(false);

    s.setResearchConsent("parent-a", c.id, true);
    const opted = { ...s.getChild("parent-a", c.id)!, researchReminder: { neverAsk: false, lastDismissedAt: null } };
    expect(s.shouldShowResearchReminder(opted, new Date(created + 400 * day))).toBe(false);
  });
});

describe("carrying over the homepage questions", () => {
  it("ticks matching struggles, keeps the hope and suggests a birth year", async () => {
    sessionStorage.setItem("beyonder-app-state", JSON.stringify({ age: "a5", needs: ["speech", "sensory", "unsure"], help: "next", child: "Ava" }));
    const s = await fresh();
    const p = s.readAppPrefill(new Date("2026-10-13"));
    expect(p.found).toBe(true);
    expect(p.answers.multi.struggles).toEqual(["speech", "sensory_overload"]);
    expect(p.answers.text.hopes).toBe("Advice on next steps");
    expect(p.birthYear).toBe(2018);
    expect(p.childName).toBe("Ava");
  });

  it("finds nothing when the questions weren't answered", async () => {
    const s = await fresh();
    expect(s.readAppPrefill().found).toBe(false);
  });
});

describe("tiles", () => {
  it("shows a short peek, marks filled tiles and counts completeness", async () => {
    const s = await fresh();
    const a = { multi: { likes: ["dinosaurs", "trains", "space"] }, own: { likes: ["Pokémon"] }, single: {}, text: {}, diagnoses: { autism: "awaiting" as const } };
    expect(s.sectionPeek(a, "love")).toBe("Dinosaurs, Trains +2");
    expect(s.sectionPeek(a, "diagnosis")).toBe("Autism");
    expect(s.sectionFilled(a, "senses")).toBe(false);
    expect(s.completeness(a)).toBe(22); // 2 of 9 tiles
  });

  it("works out age from month and year", async () => {
    const s = await fresh();
    expect(s.ageText({ birthMonth: 11, birthYear: 2018 }, new Date("2026-10-13"))).toBe("7");
    expect(s.ageText({ birthMonth: 3, birthYear: 2018 }, new Date("2026-10-13"))).toBe("8");
    expect(s.ageText({ birthMonth: null, birthYear: null })).toBe("");
  });
});
