// ── News & guides ───────────────────────────────────────────
// Every article here is a PLACEHOLDER until the real content is written (see CLAUDE.md "Before go-live").
// To publish a real article: replace `body` with the full text (one string per paragraph,
// "## " at the start of a string makes it a subheading) and set `placeholder: false`.

export type ArticleKind = "news" | "guide";

export interface Article {
  slug: string;
  kind: ArticleKind;
  title: string;
  summary: string;
  /** Shown on cards and the article page, e.g. "Research", "Legislation". */
  tag?: string;
  /** ISO date, e.g. "2026-06-02". News only. */
  date?: string;
  body: string[];
  placeholder: boolean;
}

export const articles: Article[] = [
  // ── News ──
  {
    slug: "early-salt-intervention-study",
    kind: "news",
    tag: "Research",
    date: "2026-06-02",
    title: "Early SaLT intervention reduces communication difficulties by up to 60% at age 7",
    summary: "A landmark study tracking 1,800 children over five years confirms what many SEND parents have long argued for.",
    body: [],
    placeholder: true,
  },
  {
    slug: "send-code-of-practice-2026",
    kind: "news",
    tag: "Legislation",
    date: "2026-03-24",
    title: "SEND Code of Practice 2026: what changes for families",
    summary: "New statutory duties for local authorities around EHCP timelines.",
    body: [],
    placeholder: true,
  },
  {
    slug: "sensory-integration-therapy-evidence",
    kind: "news",
    tag: "Therapy",
    date: "2026-03-12",
    title: "Sensory integration therapy: the evidence and what parents should know",
    summary: "A balanced look at research on sensory integration approaches for autism.",
    body: [],
    placeholder: true,
  },
  {
    slug: "send-reforms-2026",
    kind: "news",
    tag: "Legislation",
    date: "2026-02-01",
    title: "New SEND Reforms Announced for 2026",
    summary: "The government has outlined new proposals for improving SEND provision across England and Wales.",
    body: [],
    placeholder: true,
  },
  {
    slug: "beyonder-launches-in-bristol",
    kind: "news",
    tag: "Beyonder",
    date: "2026-01-15",
    title: "Beyonder Launches in Bristol",
    summary: "Our platform is now live with providers across Bristol and the South West.",
    body: [],
    placeholder: true,
  },
  {
    slug: "smooth-school-transition",
    kind: "news",
    tag: "Interest",
    date: "2026-01-05",
    title: "Tips for a Smooth School Transition",
    summary: "Practical advice for parents preparing their SEND child for a new school year.",
    body: [],
    placeholder: true,
  },

  // ── Guides ──
  {
    slug: "understanding-ehcps",
    kind: "guide",
    title: "Understanding EHCPs",
    summary: "A plain-English guide to Education, Health and Care Plans — what they are, how to apply, and what to expect.",
    body: [],
    placeholder: true,
  },
  {
    slug: "navigating-the-assessment-process",
    kind: "guide",
    title: "Navigating the Assessment Process",
    summary: "Step-by-step guidance on getting your child assessed for additional needs.",
    body: [],
    placeholder: true,
  },
  {
    slug: "choosing-the-right-therapist",
    kind: "guide",
    title: "Choosing the Right Therapist",
    summary: "What to look for, what questions to ask, and how to know when you've found the right fit.",
    body: [],
    placeholder: true,
  },
  {
    slug: "sensory-processing-parents-guide",
    kind: "guide",
    title: "Sensory Processing: A Parent's Guide",
    summary: "Understanding sensory needs and practical strategies you can use at home and school.",
    body: [],
    placeholder: true,
  },
];

export const getArticles = (kind: ArticleKind) =>
  articles.filter((a) => a.kind === kind).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

export const getArticle = (kind: ArticleKind, slug: string) => articles.find((a) => a.kind === kind && a.slug === slug);

export const articlePath = (a: Pick<Article, "kind" | "slug">) => `/${a.kind === "news" ? "news" : "guides"}/${a.slug}`;

export const formatArticleDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
