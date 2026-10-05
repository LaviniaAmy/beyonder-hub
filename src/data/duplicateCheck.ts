// ── Duplicate listing detection ─────────────────────────────
// Used by the admin CSV import to stop the same business being listed twice.
// Matches on contact details first (website, email, phone, social profile),
// then on business names that are the same once spelling noise is removed
// (capitals, spaces, punctuation, "Ltd", "The", "&" …) or only a few letters apart.

export type DupLevel = "definite" | "likely" | "possible";

export interface ListingLike {
  name: string;
  location?: string;
  region?: string | null;
  /** Any free text holding contact details: emails, phones, URLs. */
  contactText: string;
}

export interface DupResult {
  level: DupLevel;
  reasons: string[];
  /** 0–1, used to rank several matches of the same level. */
  score: number;
}

export interface DupMatch extends DupResult {
  targetId: string;
  targetName: string;
  /** "existing" = already on the site; "file" = an earlier row of the same spreadsheet. */
  source: "existing" | "file";
}

// ── Contact details ─────────────────────────────────────────

export interface Contacts {
  emails: string[];
  domains: string[];
  /** Social profile keys like "facebook.com/brightsteps". */
  socials: string[];
  phones: string[];
}

// Hosts shared by many businesses — a match on these alone means nothing.
const SHARED_HOSTS = new Set([
  "gmail.com", "googlemail.com", "hotmail.com", "hotmail.co.uk", "outlook.com", "live.com", "live.co.uk",
  "yahoo.com", "yahoo.co.uk", "icloud.com", "me.com", "aol.com", "btinternet.com", "sky.com", "msn.com",
  "google.com", "forms.gle", "docs.google.com", "linktr.ee", "eventbrite.co.uk", "eventbrite.com",
  "wixsite.com", "squarespace.com", "wordpress.com", "blogspot.com", "sites.google.com",
]);
// Social sites — the profile path identifies the business.
const SOCIAL_HOSTS = new Set([
  "facebook.com", "fb.com", "instagram.com", "twitter.com", "x.com", "linkedin.com", "tiktok.com", "youtube.com",
]);

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const URL_RE = /(?:https?:\/\/)?(?:www\.)?((?:[a-z0-9-]+\.)+[a-z]{2,})(\/[^\s,|;]*)?/gi;
const PHONE_RE = /\+?\d[\d\s().-]{8,}\d/g;

function normalisePhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0044")) d = "0" + d.slice(4);
  else if (d.startsWith("44") && d.length === 12) d = "0" + d.slice(2);
  return d.length >= 10 && d.length <= 13 ? d : null;
}

export function extractContacts(text: string): Contacts {
  const src = (text || "").toLowerCase();
  const emails = [...new Set(src.match(EMAIL_RE) ?? [])];
  const rest = src.replace(EMAIL_RE, " ");

  const domains = new Set<string>();
  const socials = new Set<string>();
  for (const m of rest.matchAll(URL_RE)) {
    const host = m[1].replace(/^www\./, "");
    if (SOCIAL_HOSTS.has(host)) {
      const handle = (m[2] ?? "").split(/[/?#]/).filter(Boolean)[0];
      if (handle) socials.add(`${host === "fb.com" ? "facebook.com" : host}/${handle}`);
    } else if (!SHARED_HOSTS.has(host) && ![...SHARED_HOSTS].some((h) => host.endsWith("." + h))) {
      domains.add(host);
    }
  }
  // An email on the business's own domain also tells us its website.
  for (const e of emails) {
    const host = e.split("@")[1];
    if (host && !SHARED_HOSTS.has(host)) domains.add(host);
  }

  const phones = new Set<string>();
  for (const m of rest.replace(URL_RE, " ").match(PHONE_RE) ?? []) {
    const p = normalisePhone(m);
    if (p) phones.add(p);
  }
  return { emails, domains: [...domains], socials: [...socials], phones: [...phones] };
}

// ── Names ───────────────────────────────────────────────────

const NAME_NOISE = new Set(["the", "and", "a", "of", "ltd", "limited", "cic", "cio", "llp", "plc", "inc", "co", "company", "uk"]);

export function nameTokens(name: string): string[] {
  return (name || "")
    .toLowerCase()
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[&+]/g, " and ")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((t) => t && !NAME_NOISE.has(t));
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

const ratio = (a: string, b: string) => (!a || !b ? 0 : 1 - levenshtein(a, b) / Math.max(a.length, b.length));

/** 0–1 similarity of two business names, ignoring spacing, punctuation, word order and filler words. */
export function nameSimilarity(a: string, b: string): number {
  const ta = nameTokens(a), tb = nameTokens(b);
  const ca = ta.join(""), cb = tb.join("");
  if (!ca || !cb) return 0;
  if (ca === cb) return 1;
  // Very short names must match exactly — "ABC" vs "ABD" is not a typo signal.
  if (Math.min(ca.length, cb.length) < 5) return 0;
  let best = Math.max(ratio(ca, cb), ratio([...ta].sort().join(""), [...tb].sort().join("")));
  // Every word of the shorter name appears in the longer one ("Splash Swimming" / "Splash Inclusive Swimming").
  const [short, long] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  if (short.length >= 2 && short.every((t) => long.includes(t))) best = Math.max(best, 0.85);
  return best;
}

// ── Areas ───────────────────────────────────────────────────

const town = (loc?: string) => nameTokens((loc ?? "").split(",")[0]).join("");
const regionKey = (r?: string | null) => nameTokens((r ?? "").replace(/\bengland\b/i, "")).join("");

// ── Comparison ──────────────────────────────────────────────

const RANK: Record<DupLevel, number> = { definite: 3, likely: 2, possible: 1 };

interface Prepared { item: ListingLike; contacts: Contacts; town: string; region: string }
const prepare = (item: ListingLike): Prepared => ({
  item, contacts: extractContacts(item.contactText), town: town(item.location), region: regionKey(item.region),
});

function comparePrepared(a: Prepared, b: Prepared): DupResult | null {
  const reasons: string[] = [];
  const shared = (x: string[], y: string[]) => x.find((v) => y.includes(v));

  const domain = shared(a.contacts.domains, b.contacts.domains);
  const email = shared(a.contacts.emails, b.contacts.emails);
  const phone = shared(a.contacts.phones, b.contacts.phones);
  const social = shared(a.contacts.socials, b.contacts.socials);
  if (domain) reasons.push(`Same website (${domain})`);
  if (email && !(domain && email.endsWith("@" + domain))) reasons.push(`Same email (${email})`);
  if (phone) reasons.push("Same phone number");
  if (social) reasons.push(`Same social profile (${social})`);
  const contactMatch = !!(domain || email || phone || social);

  const sim = nameSimilarity(a.item.name, b.item.name);
  const sameTown = !!a.town && a.town === b.town;
  const sameRegion = !!a.region && a.region === b.region;
  if (sim === 1) reasons.push("Same name");
  else if (sim >= 0.7) reasons.push(`Similar name (${Math.round(sim * 100)}% match)`);
  if (sim >= 0.7 && sameTown) reasons.push(`Same town (${a.item.location?.split(",")[0].trim()})`);
  else if (sim >= 0.7 && sameRegion) reasons.push("Same region");

  let level: DupLevel | null = null;
  if (contactMatch || (sim === 1 && sameTown)) level = "definite";
  else if (sim === 1 || (sim >= 0.85 && (sameTown || sameRegion))) level = "likely";
  else if (sim >= 0.8 || (sim >= 0.7 && sameTown)) level = "possible";
  if (!level) return null;

  return { level, reasons, score: (contactMatch ? 1 : 0) + sim };
}

export function compareListings(a: ListingLike, b: ListingLike): DupResult | null {
  return comparePrepared(prepare(a), prepare(b));
}

const better = (a: DupMatch | null, b: DupMatch) =>
  !a || RANK[b.level] > RANK[a.level] || (RANK[b.level] === RANK[a.level] && b.score > a.score) ? b : a;

/**
 * For each incoming row, the strongest match against listings already on the site
 * and against earlier rows of the same file (null when the row looks new).
 */
export function findDuplicates(
  rows: ListingLike[],
  existing: (ListingLike & { id: string })[],
): (DupMatch | null)[] {
  const prepExisting = existing.map((e) => ({ id: e.id, p: prepare(e) }));
  const prepRows = rows.map(prepare);

  return prepRows.map((row, i) => {
    let best: DupMatch | null = null;
    for (const e of prepExisting) {
      const r = comparePrepared(row, e.p);
      if (r) best = better(best, { ...r, targetId: e.id, targetName: e.p.item.name, source: "existing" });
    }
    for (let j = 0; j < i; j++) {
      const r = comparePrepared(row, prepRows[j]);
      if (r) best = better(best, { ...r, targetId: `row-${j}`, targetName: `${prepRows[j].item.name} (row ${j + 2} of this file)`, source: "file" });
    }
    return best;
  });
}
