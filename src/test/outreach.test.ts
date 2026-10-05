import { describe, it, expect, beforeEach, vi } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

async function fresh() {
  vi.resetModules();
  return {
    ...(await import("@/data/outreach")),
    ...(await import("@/data/founderStore")),
    ...(await import("@/data/inviteTokenStore")),
  };
}

beforeEach(() => localStorage.clear());

describe("outreach status", () => {
  it("starts as not contacted", async () => {
    const s = await fresh();
    expect(s.getOutreachStatus("p1").state).toBe("not_contacted");
  });

  it("shows an invite as sent, then claimed via invite", async () => {
    const s = await fresh();
    const t = s.createInviteToken("p1", "Club", "owner@club.org");
    expect(s.getOutreachStatus("p1")).toMatchObject({ state: "invite_sent", detail: "owner@club.org" });
    s.attemptClaim("u1", "owner@club.org", "p1", "Club", "club.org");
    s.redeemToken(t.token, "owner@club.org");
    expect(s.getOutreachStatus("p1")).toMatchObject({ state: "claimed", detail: "via invite · owner@club.org" });
  });

  it("counts a direct domain-match claim as claimed, even without an invite", async () => {
    const s = await fresh();
    s.attemptClaim("u2", "me@direct.org", "p2", "Direct", "direct.org");
    expect(s.getOutreachStatus("p2")).toMatchObject({ state: "claimed", detail: "directly · me@direct.org" });
  });

  it("shows a claim waiting for review", async () => {
    const s = await fresh();
    s.attemptClaim("u3", "me@gmail.com", "p3", "Other", "other.org");
    expect(s.getOutreachStatus("p3").state).toBe("claim_pending");
  });
});

describe("articles", () => {
  it("every homepage news card links to a real article", async () => {
    const { getArticle } = await import("@/data/articles");
    const index = readFileSync(resolve(__dirname, "../pages/Index.tsx"), "utf8");
    const slugs = [...index.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
    expect(slugs.length).toBe(3);
    slugs.forEach((slug) => expect(getArticle("news", slug)).toBeDefined());
  });

  it("article slugs are unique", async () => {
    const { articles } = await import("@/data/articles");
    expect(new Set(articles.map((a) => a.kind + a.slug)).size).toBe(articles.length);
  });
});
