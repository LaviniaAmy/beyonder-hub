# Beyonder Hub — Build Plan & Progress Tracker

Use this document to track progress across sessions.
At the start of a new session, share this file so the assistant knows exactly where we are.

---

## Key Decisions (locked in)

- **Data persistence strategy**: Build all features using the existing in-memory + localStorage pattern first. Migrate to Supabase in Phase 5 once all features are stable and data shapes are proven.
- **Provider population strategy**: Beyonder team imports providers from spreadsheet (CSV) via admin panel. Providers are then invited to claim their profile via a unique invite token link. Organic claiming (via the existing domain-matching flow) is kept alongside the invite path — both coexist on every provider profile page.
- **Outreach CRM**: Managed externally in Airtable (not on-site). The site tracks claim status only (invite sent / claimed / expired). Airtable tracks full outreach history (contacts, follow-ups, notes, responses).
- **Two claiming paths**:
  - **Invite token** (admin-generated link) → auto-approved, no domain check, for providers Beyonder has contacted directly
  - **Organic claim button** (provider finds profile themselves) → domain match = auto-approved, domain mismatch = pending admin review (existing flow, unchanged)

---

## Phase 1A — Directory Population
*Goal: Get providers into the directory. Unblocks everything else.*

### CSV Import Tool (Admin Panel)
- [ ] New "Import Providers" tab or section in admin panel
- [ ] CSV upload input with field mapping preview
- [ ] Validation step — shows errors before confirming import
- [ ] Bulk create provider profiles from CSV rows
- [ ] Imported providers default to `draft` status (not visible in directory until reviewed)
- [ ] localStorage persistence for imported provider data (survives page refresh)
- [ ] Admin can review and publish individual imported providers

### Invite Token System
- [ ] `inviteTokenStore.ts` — data store for tokens (token, providerId, email, status, createdAt, expiresAt, claimedAt)
- [ ] "Generate Invite Link" button on each provider row in admin panel
- [ ] Invite link format: `/claim?token=abc123xyz`
- [ ] Token is single-use and expires after 30 days
- [ ] `/claim` route — validates token, pre-fills provider context, routes to signup
- [ ] Claiming via valid token bypasses domain matching (auto-approved regardless)
- [ ] Token marked as used on successful claim
- [ ] Expired/invalid token shows clear error with fallback to organic claim button

### Admin Outreach Status Column
- [ ] Providers tab in admin panel shows claim status per provider: `No invite sent` / `Invite sent (date)` / `Claimed (date)` / `Expired`
- [ ] Copy-to-clipboard for invite link
- [ ] Visual status badges (grey / amber / green / red)
- [ ] Filter providers by claim status

### Airtable Setup (non-dev, team task)
- [ ] Create Airtable base with fields: Provider Name, Category, Region, Website, Email, Contact Name, Status, Date First Contacted, Date Follow-up, Invite Sent (checkbox), Invite Sent Date, Notes, Claimed Profile (checkbox), Profile ID
- [ ] Status options: Not contacted / Emailed / Followed up / Responded / Claimed / Declined
- [ ] Import provider spreadsheet into Airtable base
- [ ] Share base with relevant team members

---

## Phase 1B — Provider Onboarding
*Goal: Smooth self-service onboarding for providers who find Beyonder organically.*

### Multi-step Onboarding Wizard (replaces current basic signup)
- [ ] Step 1 — Provider type picker (visual card: Therapist / Club / Product / Education / Charity)
- [ ] Step 2 — Basics (business name, location, region, short description)
- [ ] Step 3 — What you offer (needs supported, age range, delivery format, category-specific fields)
- [ ] Step 4 — Contact & profile details (email, phone, website, social links)
- [ ] Step 5 — Preview listing (see exactly how profile will look to families)
- [ ] Progress bar across all steps
- [ ] "Save and continue later" at every step
- [ ] Form state persists in localStorage if user closes and returns

### Profile Completeness System
- [ ] Completeness score (percentage) shown in provider dashboard
- [ ] Checklist of required fields to reach 100% (description, location, at least one need, contact method, etc.)
- [ ] Visual checklist with ticked/unticked items
- [ ] Go Live button only activates when checklist is 100% complete

### Go Live Flow
- [ ] Provider profiles start in `draft` state after signup (invisible in directory)
- [ ] "Go Live" button in dashboard (active when checklist complete)
- [ ] On Go Live: profile moves to `pending_review` state, admin is notified
- [ ] Admin approves → profile becomes live in directory
- [ ] Provider receives confirmation (on-screen notification at minimum)
- [ ] "Request Verification" button in dashboard (separate from Go Live — requests the Verified badge)

---

## Phase 2 — News & Articles
*Goal: Content hub to drive SEO, return visits, and trust for SEND families.*

### Article Data Structure
- [ ] `articleStore.ts` — store for articles (id, title, subtitle, body, template, category, author, tags, featuredImage, publishDate, status, isFeatured)
- [ ] Categories: `research` / `legislation` / `interest`
- [ ] Status: `draft` / `published`
- [ ] Template types: `research` / `legislation` / `interest` / `announcement`

### Admin Article Creation
- [ ] "Articles" tab in admin panel
- [ ] Template picker (visual selection of 4 templates)
- [ ] Template-specific form fields appear based on selection:
  - **Research** — title, subtitle, abstract box, body sections, citation block
  - **Legislation/Legal** — title, "What this means for families" summary, body, key dates
  - **Interest/Human Story** — title, pull quote, body, share CTA
  - **Announcement** — title, key points (bullet list), body, action CTA
- [ ] Featured image upload
- [ ] Category selection (Research / Legislation & Legal / Interest Pieces)
- [ ] Tags input (e.g. EHCP, Autism, ADHD, OT, Sensory)
- [ ] Publish date picker (schedule ahead)
- [ ] Save as Draft / Publish Now buttons
- [ ] Edit and delete published articles
- [ ] Toggle `isFeatured` flag (controls homepage placement)

### News Page Redesign
- [ ] Top: Large featured article hero (most recently featured article)
- [ ] Below hero: Three columns, one per category, each showing latest article in that category
- [ ] Clicking a category column header routes to that category page
- [ ] Category pages: articles listed newest-first
- [ ] Pagination or load-more on category pages

### Article Detail Page (`/news/[id]`)
- [ ] Full article rendered in the selected template layout
- [ ] Reading time estimate shown at top
- [ ] Share buttons: WhatsApp, Facebook, X/Twitter, copy link
- [ ] "Was this helpful?" thumbs up / thumbs down
- [ ] Related articles section (same category or matching tags)
- [ ] Comment section (visible to all, login required to post)
- [ ] "SEND Professional" badge on comments from verified providers

### Homepage Auto-Featuring
- [ ] When an article is published and marked `isFeatured`, it auto-populates the homepage News section
- [ ] No manual homepage editing needed — homepage always reflects latest featured article

---

## Phase 3 — Forums
*Goal: Community space where SEND families support each other. Parent-led, admin-moderated.*

### Forum Data Structure
- [ ] `forumStore.ts` — threads, posts, replies, flags, feature slots
- [ ] Thread fields: id, title, body, authorId, authorName, tags, createdAt, replyCount, flagCount, status (active/removed/locked), featuredSlot (1/2/3/null), isAnonymous, isPinned
- [ ] Reply fields: id, threadId, body, authorId, authorName, createdAt, helpfulCount, isMarkedHelpful, flagCount, status
- [ ] Flag fields: id, targetType (thread/reply), targetId, reporterId, reason, createdAt, status (pending/dismissed/actioned)

### Topic Tags (pre-set)
EHCP Journey / School & Education / Therapists & Waiting Lists / Sensory Processing / Diagnosis Stories / Equipment & Products / Mental Health & Wellbeing / Benefits & Funding / Siblings & Family / Ask a Professional

### Forums Page (`/community`)
- [ ] Redesign community page to host forums
- [ ] Top: Three featured threads (admin-chosen, displayed in slots 1/2/3)
- [ ] Thread list below with sort options: Latest / Most Active / Unanswered
- [ ] Search bar for forums
- [ ] Tag filter pills
- [ ] Pinned threads shown above sort list
- [ ] Thread cards show: title, author, tags, reply count, date, helpful count

### Thread & Reply System
- [ ] Thread creation: logged-in parents and admins only (providers can reply but not create threads)
- [ ] Thread form: title, body, tag selection (up to 3), anonymous option (on sensitive tags)
- [ ] Reply form: body, basic formatting (bold, italic, bullet list)
- [ ] "Helpful" upvote on replies (not a like — more respectful tone)
- [ ] Thread creator can mark one reply as "This helped me" (highlighted in teal)
- [ ] User post count and "New Member" badge (<10 posts) shown on every post

### Flag & Moderation System
- [ ] Flag button on every thread and reply
- [ ] Flag modal: reason picker (Offensive / Misinformation / Off-topic / Spam)
- [ ] "Flags" tab in admin panel showing all flagged content
- [ ] Each flag shows: post content, author, reporter, reason, date
- [ ] Admin actions: Dismiss flag / Remove post / Ban user
- [ ] Banned users see a "your account has been suspended" message on login
- [ ] Admin can lock a thread (no new replies, thread stays readable)
- [ ] Admin can pin a thread to top of list

### Claude Moderation API Integration
- [ ] On post/reply submit: content sent to Claude moderation API before publishing
- [ ] Posts above confidence threshold held in "Pending Review" queue (not auto-deleted)
- [ ] Posts below threshold publish instantly
- [ ] "Pending Review" count badge in admin panel
- [ ] Admin can approve or remove pending posts
- [ ] Confidence threshold is configurable by admin (default: conservative)

### Admin Featured Posts System
- [ ] When logged in as admin, each thread card shows: "Feature as 1" / "Feature as 2" / "Feature as 3" buttons (invisible to non-admins)
- [ ] Clicking a slot assigns that thread to the homepage community section and forums page top
- [ ] Assigning a slot removes whatever was previously in it
- [ ] Featured slots visible in admin Flags/Forums tab for easy management

---

## Phase 4 — Events
*Goal: Local events discovery for SEND families. Designed to be disableable until there's enough content.*

### Event Data Structure
- [ ] `eventStore.ts` — events with: id, title, description, date, time, endTime, location, region, type, organiser (admin or provider), cost, bookingLink, status, isFeatured, isOnline

### Event Types
Workshop / Support Group / Social / Online / Fundraiser / Training

### Events on Community Page
- [ ] Featured events section (admin-chosen) shown on community page alongside forums
- [ ] "Browse events near you" button → region picker → routes to `/events/[region]`
- [ ] Regional events page: upcoming events in date order (soonest first)
- [ ] Past events automatically moved to "Past Events" section below
- [ ] Event cards: title, date, type badge, location, organiser, cost (free/paid)

### Event Detail Page (`/events/[region]/[id]`)
- [ ] Full event info
- [ ] "Add to Google Calendar" link
- [ ] "I'm going" button (logged-in parents only)
- [ ] Provider credit if submitted by a provider

### Event Creation & Management
- [ ] Admin can create, edit, feature, and delete events
- [ ] Providers on paid plans can submit events (admin approves before publishing)
- [ ] Events submission form in provider dashboard (paid plans)

### Admin Disable Toggle
- [ ] "Events feature" on/off switch in admin panel settings
- [ ] When disabled: events section removed from homepage, community page, and nav
- [ ] Layout fills the space cleanly when events section is absent (forum posts expand, or CTA takes the space)
- [ ] `/events` routes show "coming soon" page when disabled
- [ ] No broken links or empty sections when toggled off

---

## Phase 5 — Supabase Migration
*Goal: Replace in-memory/localStorage with real persistent database and auth.*

### Database
- [ ] Set up Supabase project
- [ ] `providers` table (migrated from providerStore + localStorage)
- [ ] `users` / `profiles` table (migrated from auth localStorage)
- [ ] `enquiries` + `enquiry_messages` tables
- [ ] `provider_claims` + `pending_claims` tables
- [ ] `invite_tokens` table
- [ ] `articles` table
- [ ] `forum_threads` + `forum_replies` + `forum_flags` tables
- [ ] `events` table
- [ ] Row-level security policies

### Auth
- [ ] Replace localStorage auth with Supabase Auth
- [ ] Email verification on signup
- [ ] Password reset flow
- [ ] Session persistence (JWT)

### File Storage
- [ ] Supabase Storage for provider gallery images
- [ ] Storage for article featured images
- [ ] Storage for product images

### Real-time
- [ ] Forum reply notifications (Supabase real-time subscriptions)
- [ ] Enquiry reply notifications

---

## Notes for New Sessions

- Working branch: `claude/dazzling-newton-8QGJv`
- All changes committed and pushed to this branch before session ends
- Current data lives in: `src/data/mockData.ts`, `src/data/providerStore.ts`, `src/data/enquiryStore.ts`, `src/data/founderStore.ts`
- Auth context: `src/context/AuthContext.tsx`
- Feature gating: `src/lib/featureGating.ts`
- Locked files (do not modify without explicit instruction): `src/components/BirdCanvas.tsx` and the hero/ecosystem sections of `src/pages/Index.tsx`
