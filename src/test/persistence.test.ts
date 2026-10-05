import { describe, it, expect, beforeEach, vi } from "vitest";

// Each test re-imports the stores fresh, as a page refresh would.
async function freshStores() {
  vi.resetModules();
  const providerStore = await import("@/data/providerStore");
  const founderStore = await import("@/data/founderStore");
  const inviteStore = await import("@/data/inviteTokenStore");
  const auth = await import("@/context/AuthContext");
  return { ...providerStore, ...founderStore, ...inviteStore, ...auth };
}

const row = {
  businessName: "Persisted Test Club",
  category_type: "club",
  region: null,
  location: "Bristol",
  coverageArea: "",
  shortDescription: "Short",
  description: "Long",
  needsSupported: ["Autism"],
  ageRange: "5-11",
  deliveryFormat: "in-person" as const,
  contactName: "Sam",
  contactMethodType: "email" as const,
  contactLinks: "hello@persisted.org | 07700 900123 | https://persisted.org",
};

beforeEach(() => localStorage.clear());

describe("imported listings", () => {
  it("survive a refresh, start as hidden drafts and appear once published", async () => {
    let s = await freshStores();
    const rec = s.importProvider(row);
    expect(rec.email).toBe("hello@persisted.org");
    expect(rec.websiteDomain).toBe("persisted.org");
    expect(s.getActiveProviders().some((p) => p.id === rec.id)).toBe(false);

    s = await freshStores();
    expect(s.getProvider(rec.id)?.draftStatus).toBe("draft");
    s.publishProvider(rec.id);

    s = await freshStores();
    expect(s.getActiveProviders().some((p) => p.id === rec.id)).toBe(true);
  });

  it("keeps admin edits to existing listings after a refresh", async () => {
    let s = await freshStores();
    const id = s.getAllProviders()[0].id;
    s.updateProvider(id, { isVerified: true, isFeatured: true });
    s = await freshStores();
    expect(s.getProvider(id)).toMatchObject({ isVerified: true, isFeatured: true });
  });

  it("merge only fills empty fields", async () => {
    const s = await freshStores();
    const p = s.getAllProviders()[0];
    s.mergeIntoProvider(p.id, { ...row, description: "Should not replace" });
    const merged = s.getProvider(p.id)!;
    expect(merged.description).toBe(p.description);
    expect(merged.email).toBe("hello@persisted.org");
  });
});

describe("provider dashboard access", () => {
  it("gives no listing to a provider account without a claim", async () => {
    const s = await freshStores();
    expect(s.getProviderAccess("newprovider@example.com")).toEqual({ status: "none" });
  });

  it("links an approved claim to its listing, and remembers it after a refresh", async () => {
    let s = await freshStores();
    const p = s.getAllProviders()[1];
    s.attemptClaim("u1", "owner@example.com", p.id, p.businessName, "example.com");
    s = await freshStores();
    expect(s.getProviderAccess("Owner@example.com")).toEqual({ status: "owner", providerId: p.id });
  });

  it("keeps a pending claim pending — no editing access", async () => {
    const s = await freshStores();
    const p = s.getAllProviders()[2];
    s.attemptClaim("u2", "someone@other.com", p.id, p.businessName, "not-matching.com");
    expect(s.getProviderAccess("someone@other.com")).toEqual({ status: "pending", providerId: p.id });
  });
});

describe("invite links", () => {
  it("still validate after a refresh in the same browser", async () => {
    let s = await freshStores();
    const t = s.createInviteToken("p1", "Test", "a@b.com");
    s = await freshStores();
    expect(s.validateToken(t.token).valid).toBe(true);
  });
});
