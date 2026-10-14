# Beyonder Hub — Claude Code Instructions

## ⚠️ LOCKED SECTIONS — DO NOT MODIFY

The following elements are **permanently locked** and must **never** be changed
unless the user explicitly asks to edit a specific named element.

### Files
- `src/components/BirdCanvas.tsx` — **fully locked**
- `src/pages/Index.tsx` — the ecosystem intro (detailed below) is **locked**

---

### Homepage structure (changed with the hero redesign — reference: branch `snapshot/pre-hero-redesign`)

- **Mobile (< md):** `/` renders `<BeyonderApp />` (`src/components/beyonder-app/`) — a single-screen,
  no-scroll app (home → questions → consult / region map → results → enquiry → sent, plus profile).
  The site header, footer and bottom nav are hidden on `/` on mobile (see `Layout.tsx`); the app shows its
  own bottom bar only on the Consult, Find and Profile screens. The murmuration is `<BirdCanvas />`.
  Every other mobile page uses the same bottom bar (`AppNav`) and menu (`MenuSheet`) via `Layout.tsx`.
  Bottom bar has 4 tabs (Home · Consult · Find · Profile); Community is in the menu.
  "Starling tips" (`StarlingTip.tsx`): one-off explainer bubbles with a perched starling, shown once per
  device (localStorage `beyonder-tip-<id>`). Currently: map ("Choose your location") and provider results
  ("Tap a name to see their full profile"). Keep them few.
  Its behaviour must match the prototype the user supplied — do not change the functionality.
  Exception agreed with the user: the **Profile** tab links to the full child profile (signed-in parents get
  "Open <name>'s profile" / "Set up your child's profile"; visitors get "Create a free account").
- **Desktop (md+):** hero keeps `<BirdCanvas />`, the legibility overlay, section height and the 3-step strip.
  The old wordmark, tagline, search bar and hint chips were replaced by the headline, the
  "Live consultation" / "Find local support" buttons (→ `/start`) and the "How Beyonder works" sheet.
  All sections below the hero are unchanged.
- **`/start`:** the same app screens framed inside the normal page layout (desktop destination).

---

### Locked: Ecosystem intro (`src/pages/Index.tsx`, desktop)

The section immediately after the hero:

- **"The Beyonder Ecosystem"** eyebrow label
- **"Everything your family needs, together"** heading
- Supporting paragraph text
- **"Where would you like to start?"** category header row
- **Category grid** — all 5 category cards, icons, labels, subtitles, layout, spacing

---

---

## Mobile / Desktop scope

All new work applies to **both mobile and desktop** simultaneously unless the user
explicitly says otherwise. The previous "mobile only" / "desktop only" restrictions
are lifted. When adding or changing anything below the locked sections, always
implement for both breakpoints.

---

### Rule

When making any change to `src/pages/Index.tsx`, `src/components/BirdCanvas.tsx` or
`src/components/beyonder-app/`, only touch the specific element the user has asked about.
Do not adjust spacing, positioning, sizing, colours, or structure of any locked element
as a side-effect of another change.

---

## Pending work — do not forget

### Beyonder app (mobile homepage / `/start`) — follow-ups agreed but not built

- Specialists, time slots and booking are **sample data** (`beyonder-app/data.ts`); "Request booking" only
  shows the confirmation screen — nothing is saved yet.
- Find results and enquiries use the **real directory** (`providerStore` / `enquiryStore`) with the same
  region/category/search rules as `ProviderDirectory`; enquiries need a signed-in parent account.
- "Use my location" picks South East / Southampton (prototype behaviour) — no real geolocation yet.
- The map is England only (9 regions). `mockData.ts` `regions` has no "Yorkshire and the Humber" or
  "East of England" yet, so those regions only show online services and product sellers until providers exist.

These items were agreed but not yet built. Raise them with the user at the start of
the relevant phase so they aren't lost.

### 📌 For Yash — everything that must move to / be built on Supabase

**Standing rule:** whenever a feature stores data, needs login, files or emails, add it to this list so Yash
can integrate it. Keep this list up to date in every change.

- **Providers, claims, invite links** — `providerStore`, `founderStore`, `inviteTokenStore` currently save to the
  browser's localStorage via `src/data/persist.ts` (per browser only; invite links only work in the browser that
  made them). Replace with Supabase tables.
- **Enquiries and messages** — `enquiryStore` is in memory only (lost on refresh).
- **Login** — `AuthContext` is fake (any password works). Replace with Supabase Auth; plug in the email provider
  (Brevo or Resend) as custom SMTP for sign-up and password-reset emails.
- **Child's profile (Phase 1 built — test version)** — `src/data/childProfileStore.ts` saves to localStorage
  (`beyonder_children_v1`); pick lists are in `src/data/childProfileOptions.ts`. Routes `/dashboard/child/new`
  (setup) and `/dashboard/child/:id` (tile home). Contains a child's health/special category data. On Supabase:
  - Tables for children (first name, birth month/year, avatar look), answers (store the option **codes**, the
    parent's own words separately — codes are what anonymous research counts), per-provider sharing
    (`sharing: providerId → section ids`, nothing shared by default) and consent records (storage consent is
    required; research consent is separate/optional; keep version, exact wording and date/time of each).
  - UK/EU region, row-level security: only the parent can read/write; a provider can read **only** the sections
    the parent shared with them, read-only, and every view is written to an access log.
  - Research statistics only from children whose `researchConsent` is set, aggregated and anonymous — never
    names, free text or documents. Withdrawing consent removes the child from future statistics.
  - "Download my data" and "Delete this profile" must also cover server copies; deleting a parent account
    deletes their children.
  - Monthly research reminder: `researchReminder` (lastDismissedAt / neverAsk) — keep the same rules.
- **Child's documents (Phase 3, not built)** — diagnosis letters, reports, EHCPs: private storage bucket,
  short-lived signed links, virus scanning, PDF/JPG/PNG ≤ 10MB, per-document sharing (off by default), separate
  consent at first upload, two-step login before viewing or uploading.

## ⚠️ Before go-live — must be done

- **Real articles.** Every news item and guide in `src/data/articles.ts` is a placeholder (`placeholder: true`,
  the page says "The full article is being written…"). Write the real text into `body` and set `placeholder: false`.
  The homepage news cards link to the first three news articles.
- **Legal pages.** `/privacy`, `/terms` and `/cookies` (`src/data/legal.ts`) are drafts with a visible "draft" notice.
  Fill in every `[To be confirmed]` (company details, lawful basis for child/health data, processors, retention,
  payments, liability), get them reviewed, then set `draft: false` and the `lastUpdated` date.
- **Child profiles with real data.** Only after Supabase + the security above, a DPIA (Data Protection Impact
  Assessment), ICO registration, and the privacy policy covering child profiles and research. Then remove the
  "Test version: saved on this device only" note (`TestNote` in `src/pages/ChildSetupPage.tsx`).
- **Test logins.** The "Pilot test logins" buttons on `/login` are kept on purpose while testing — the user has asked
  for them to stay. Decide what to do with them before launch (anyone can use them to log in as admin).
