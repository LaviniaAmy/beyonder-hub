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
  Its behaviour must match the prototype the user supplied — do not change the functionality.
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

- Specialists, time slots and booking are **sample data** (`beyonder-app/data.ts`); "Request booking" and
  "Send enquiry" only show the confirmation screen — nothing is saved or sent yet.
- Find results use the prototype's **sample providers**, not the real provider listings / enquiry store.
- "Use my location" picks South East / Southampton (prototype behaviour) — no real geolocation yet.
- The map has 12 regions (incl. Yorkshire and the Humber, East of England); `mockData.ts` `regions` has 10 +
  "Online Only". Reconcile when the app is wired to real providers.

These items were agreed but not yet built. Raise them with the user at the start of
the relevant phase so they aren't lost.

### Phase 1B — before starting the onboarding wizard

- **Outreach status tracker** (Admin → Import & Invites tab)
  A unified column/status for every provider showing one of:
  `Not contacted` · `Invite sent` (date) · `Claimed` (date)
  — regardless of whether they claimed via invite token or directly via the domain-match claim flow.
  Currently the two flows are tracked separately (inviteTokenStore vs founderStore/pendingClaims) and
  there is no single view. This needs to be reconciled so the admin can see at a glance who has been
  reached out to and who has claimed, without checking two tabs.

