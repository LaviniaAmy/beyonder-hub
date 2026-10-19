import { describe, it, expect, beforeEach, vi } from "vitest";

async function fresh() {
  vi.resetModules();
  const store = await import("@/data/childProfileStore");
  const link = await import("@/data/enquiryProfile");
  return { store, link };
}

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });

async function withChild() {
  const m = await fresh();
  const c = m.store.createChild({
    parentId: "p1", firstName: "Ava", birthMonth: 1, birthYear: new Date().getFullYear() - 7,
    avatar: m.store.DEFAULT_AVATAR, storageConsentGiven: true,
    answers: {
      multi: { likes: ["dinosaurs"], struggles: ["speech", "sleep"], allergies: ["nuts"] },
      own: {}, single: {}, text: {}, diagnoses: { autism: "awaiting" },
    },
  });
  return { ...m, c };
}

describe("child profile → enquiry", () => {
  it("offers only filled sections, with Diagnosis and Safety unticked", async () => {
    const { link, c } = await withChild();
    expect(link.filledSections(c)).toEqual(["love", "diagnosis", "hard", "safety"]);
    expect(link.defaultShare(c)).toEqual(["love", "hard"]);
  });

  it("only puts the diagnosis in the needs line when Diagnosis is shared", async () => {
    const { link, c } = await withChild();
    expect(link.childNeeds(c, ["hard"])).toBe("Speech and communication, Sleep");
    expect(link.childNeeds(c, ["hard", "diagnosis"])).toBe("Speech and communication, Sleep, Autism");
    expect(link.childNeeds(c, [])).toBe("");
  });

  it("sends a snapshot of the ticked sections only", async () => {
    const { link, c } = await withChild();
    const shared = link.buildSharedProfile(c, ["love", "diagnosis"]);
    expect(shared.childId).toBe(c.id);
    expect(shared.sections).toEqual([
      { id: "love", title: "Things I love", items: ["Dinosaurs"] },
      { id: "diagnosis", title: "Diagnosis", items: ["Autism (awaiting assessment)"] },
    ]);
  });

  it("fills in age and drafts a short message", async () => {
    const { link, c } = await withChild();
    expect(link.childAgeLabel(c)).toBe("7 years");
    const m = link.draftFromProfile("Splash", c, ["hard"]);
    expect(m).toContain("Hi Splash");
    expect(m).toContain("support for Ava, who is 7");
    expect(m).toContain("speech and communication and sleep");
    expect(m).toContain("shared some of Ava's profile");
    expect(m.length).toBeLessThan(800);
  });

  it("records what was shared with which provider on the child's profile", async () => {
    const { store, link, c } = await withChild();
    link.recordSharing("p1", c.id, "prov-1", ["love"]);
    link.recordSharing("p1", c.id, "prov-1", ["hard", "love"]);
    link.recordSharing("someone-else", c.id, "prov-2", ["love"]);
    const after = store.getChild("p1", c.id)!;
    expect(after.sharing).toEqual({ "prov-1": ["love", "hard"] });
  });

  it("the app's save box creates a real profile from the homepage answers, with its own consent wording", async () => {
    sessionStorage.setItem("beyonder-app-state", JSON.stringify({ age: "a5", needs: ["speech"], help: null, child: "Leo" }));
    const { store, link } = await fresh();
    const c = link.createChildFromApp("p2", "");
    expect(c.firstName).toBe("Leo");
    expect(c.answers.multi.struggles).toEqual(["speech"]);
    expect(c.storageConsent.text).toBe(link.APP_SAVE_CONSENT_TEXT);
    expect(store.getChildren("p2")).toHaveLength(1);
  });
});

describe("enquiries and bookings are kept after a refresh", () => {
  it("keeps a new enquiry", async () => {
    vi.resetModules();
    let e = await import("@/data/enquiryStore");
    const before = e.enquiryStore.length;
    e.addEnquiry({
      enquiryId: "x1", providerId: "p", providerName: "P", parentId: "par", parentName: "Sam", childAge: "7 years",
      childName: "Ava", needs: "", message: "Hello there, a test message.", reply: null,
      messages: [{ messageId: "m", senderId: "parent", senderName: "Sam", text: "Hello", sentAt: "2026-10-14" }],
      statusForParent: "sent", statusForProvider: "new", createdAt: "2026-10-14", isUnlocked: false, messageCount: 1,
      providerNotes: "", customAnswers: [],
    });
    vi.resetModules();
    e = await import("@/data/enquiryStore");
    expect(e.enquiryStore).toHaveLength(before + 1);
    expect(e.getEnquiriesForParent("par")[0].childName).toBe("Ava");
  });

  it("keeps a booking request for the parent's dashboard", async () => {
    vi.resetModules();
    let b = await import("@/data/bookingStore");
    b.addBooking({
      bookingId: "b1", parentId: "par", parentName: "Sam", specialistId: "rl", specialistName: "Ruth Levene",
      specialistRole: "OT", slot: "Today, 7:30pm", price: "£45", format: "Video", childName: "", childAge: "",
      needs: "", message: "", status: "requested", createdAt: new Date().toISOString(),
    });
    vi.resetModules();
    b = await import("@/data/bookingStore");
    expect(b.getBookingsForParent("par")).toHaveLength(1);
    expect(b.getBookingsForParent("other")).toHaveLength(0);
  });
});
