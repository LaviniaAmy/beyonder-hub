
# Beyonder – SEND Community Hub MVP

## Overview
Beyonder is a two-sided marketplace connecting SEND families with service providers. This plan covers the full MVP frontend with mock data, placeholder branding, and a clean functional design ready for backend integration later.

---

## Phase 1: Foundation & Layout

### Global Navigation & Layout Shell
- Sticky header with nav links: Home, About Us, Connect, Providers
- Login / Join Now buttons (open auth modals with placeholder forms)
- Responsive mobile hamburger menu
- Consistent footer across all pages with links to Help Centre, About, etc.

### Homepage
- Hero section with search bar ("What are you looking for today?")
- Two primary CTAs: "Explore Services" and "Community Groups"
- Three feature cards: Find Local Support, Guides & Understanding, Work With Beyonder
- Category quick links: Therapists & Specialists, Inclusive Clubs & Activities, Latest SEND News
- Placeholder logo and simple teal/navy color palette

---

## Phase 2: Parent Browsing Experience

### Explore Services Page
- Heading: "How can Beyonder help today?"
- Five tappable service category cards (Therapists & Specialists, Inclusive Clubs & Activities, Products & Equipment, Education & Learning Support, Charities & Support Organisations)
- Each card routes to the Provider Directory with that category pre-filtered
- Optional collapsible refinement filters (age range, location, diagnosis)
- Reassurance footer text

### Provider Directory Page
- Category tabs across the top to switch between service types
- Filter controls: Location, Age Range, Delivery Type (in-person/online/hybrid)
- Active filter chips showing current selections
- Provider card list showing: name, type badge, short description, location, needs tags
- Product seller cards with a visually distinct style
- "Load More" button for pagination
- Empty state with helpful suggestions
- Save provider button (visual only for now)

### Individual Provider Page
- Modular layout with 6 sections:
  1. **Header/Hero**: Provider name, type badge, location, verified badge, primary CTA
  2. **Overview**: Description, needs supported (tags), age range, delivery format
  3. **Conditional Module**: Different content based on provider type (Therapist credentials, Activity timetable, Product grid, Education details)
  4. **Reviews & Trust**: Star ratings, testimonials, founding provider badge
  5. **Practical Info**: Coverage area, contact method
  6. **Sticky CTA**: "Send Enquiry" button always visible on scroll

---

## Phase 3: Enquiry & Messaging Flow

### Booking/Enquiry Request
- "Send Enquiry" button on Provider Pages
- Single-screen form: message field, child age, provider availability summary (read-only)
- Login gate: if not logged in, prompt to sign in first
- Confirmation message after submission
- No date/time selection — just a calm, open enquiry

### Payment Modals (UI only)
- When a free-tier parent tries to read a provider response, show an upgrade modal
- Two options displayed: £4.95 one-off (single provider) or £9.95/month subscription
- Stripe checkout placeholder (non-functional, styled mockup)
- Neutral, non-pressuring copy

---

## Phase 4: Dashboards

### Parent Dashboard
- Auto-redirect after login
- "Your Enquiries" list with read/unread status
- Subscription status panel (free tier vs. paid)
- Profile settings section
- Empty state with guidance linking back to Explore Services
- Upgrade gate modal when opening provider responses (for free-tier)

### Provider Dashboard
- "Your Enquiries" list (unread first)
- Profile & Availability management section (edit description, photos, credentials, service categories, availability windows)
- Plan/upgrade access panel
- Simple, task-focused layout

---

## Phase 5: Provider Onboarding & Authentication

### Auth Pages
- Login page (email/password form)
- Parent signup page
- Provider signup page with value proposition ("Why Join Beyonder?")
- All forms functional in UI but storing nothing (mock data)

### Provider Landing Page
- Value proposition for providers
- Benefits of listing on Beyonder
- Tier comparison (Free listing vs. Paid subscription features)
- CTA to sign up as a provider

---

## Phase 6: Admin Panel

### Admin Panel (separate route: /admin)
- Clean, utilitarian interface
- Provider moderation: list of providers with suspend/request changes actions
- Parent moderation: list of parents with suspend/remove access actions
- Reviews moderation: flagged reviews list with remove option
- Payment & access toggles: disable payments for selected parents, mark founding providers
- Content strings editor: editable text fields for CTAs, paywall copy, empty states, confirmation messages
- No analytics, no Stripe actions, no impersonation

---

## Phase 7: Supporting Pages

### Static/Content Pages
- About Us page
- Help Centre / FAQ page
- Guides & Understanding (placeholder content)
- News & Updates (placeholder articles)
- Community page (placeholder for forums/events)

---

## Data & Technical Approach
- All data is hardcoded mock data in JSON/TypeScript files (providers, categories, reviews, enquiries)
- React Router for all page navigation
- Responsive design across all pages (mobile-first)
- Clean, functional design with teal/navy accent colors from the brand palette
- Placeholder text logo and simple icons (Lucide icons)
- Structured so backend (Supabase or Arcadier) can be connected later by replacing mock data with API calls
