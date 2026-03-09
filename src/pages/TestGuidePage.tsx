const TestGuidePage = () => (
  <div
    style={{
      fontFamily: "'Outfit', 'Segoe UI', sans-serif",
      maxWidth: 900,
      margin: "0 auto",
      padding: "40px 32px 80px",
      color: "#1a2a3a",
      lineHeight: 1.7,
      fontSize: "0.92rem",
    }}
  >
    <style>{`
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .page-break { page-break-before: always; }
      }
      h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; color: #061828; }
      h2 { font-size: 1.35rem; font-weight: 700; color: #2a7a6a; margin: 36px 0 10px; border-bottom: 2px solid #2a7a6a; padding-bottom: 6px; }
      h3 { font-size: 1.05rem; font-weight: 600; color: #061828; margin: 22px 0 6px; }
      h4 { font-size: 0.92rem; font-weight: 600; color: #556677; margin: 14px 0 4px; }
      table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; font-size: 0.85rem; }
      th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
      th { background: #f0f4f3; font-weight: 600; }
      code { background: #f0f0e8; padding: 2px 6px; border-radius: 4px; font-size: 0.82rem; font-family: monospace; }
      ul { margin: 6px 0 14px 18px; }
      li { margin-bottom: 4px; }
      .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
      .badge-teal { background: #e0f5f0; color: #2a7a6a; }
      .badge-orange { background: #fde8dd; color: #e8622a; }
      .badge-navy { background: #e0e8f0; color: #061828; }
      .badge-free { background: #f0f0e8; color: #888; }
      .badge-paid { background: #e0f5f0; color: #2a7a6a; }
      .note { background: #f0f4f3; border-left: 3px solid #2a7a6a; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 12px 0; font-size: 0.85rem; }
    `}</style>

    <h1>Beyonder — Tester's Guide</h1>
    <p style={{ color: "#556677", marginBottom: 24 }}>
      A complete summary of every page, feature, and testing flow. Use <strong>Ctrl+P / Cmd+P</strong> to save as PDF.
    </p>

    {/* ════════════════════════════════════════════════════════ */}
    <h2>1. Test Login Credentials</h2>
    <p>All logins accept <strong>any password</strong>. Quick-login chips are on the login page.</p>
    <table>
      <thead>
        <tr><th>Role</th><th>Email</th><th>Dashboard</th></tr>
      </thead>
      <tbody>
        <tr><td>Parent</td><td><code>test@parent.com</code></td><td>/dashboard</td></tr>
        <tr><td>Admin</td><td><code>admin@beyonder.com</code></td><td>/admin</td></tr>
        <tr><td>Therapist Provider</td><td><code>therapist@beyonder.test</code></td><td>/provider-dashboard</td></tr>
        <tr><td>Club Provider</td><td><code>club@beyonder.test</code></td><td>/provider-dashboard</td></tr>
        <tr><td>Education Provider</td><td><code>education@beyonder.test</code></td><td>/provider-dashboard</td></tr>
        <tr><td>Charity Provider</td><td><code>charity@beyonder.test</code></td><td>/provider-dashboard</td></tr>
        <tr><td>Product Provider</td><td><code>product@beyonder.test</code></td><td>/provider-dashboard</td></tr>
      </tbody>
    </table>

    {/* ════════════════════════════════════════════════════════ */}
    <h2>2. Site-Wide Navigation</h2>
    <p>Fixed navy header with the Beyonder logo. Links:</p>
    <ul>
      <li><strong>Home</strong> → <code>/</code></li>
      <li><strong>About Us</strong> → <code>/about</code></li>
      <li><strong>Get Connected</strong> → <code>/community</code></li>
      <li><strong>For Providers</strong> → <code>/for-providers</code> (separated by a vertical divider)</li>
    </ul>
    <h4>Auth-dependent actions (top right)</h4>
    <ul>
      <li><strong>Logged out:</strong> "Log in" (ghost button) + "Join now" (orange button)</li>
      <li><strong>Logged in:</strong> "Dashboard" link (routes to role-specific dashboard) + user name + logout icon</li>
    </ul>
    <h4>Footer</h4>
    <p>Two-column layout: Explore links (Find Services, Provider Directory, Community), Learn links (Guides, News, About), Support links (Help Centre, For Providers).</p>

    {/* ════════════════════════════════════════════════════════ */}
    <div className="page-break" />
    <h2>3. Homepage <code>/</code></h2>
    <p>The homepage has 7 distinct sections stacked vertically:</p>

    <h3>3.1 Hero Section (dark navy with stars)</h3>
    <ul>
      <li>Animated star canvas background with a dark gradient overlay</li>
      <li>Beyonder logo (SVG) centred with tagline "One place for everything SEND"</li>
      <li>Multi-speed parallax: logo, search, and "How it works" move at different scroll speeds</li>
      <li><strong>Search bar:</strong> Two fields — "Region" (autocomplete dropdown with 11 regions) + "Type of support" (free text). Orange "Find Support" button navigates to <code>/providers</code> with query params</li>
      <li><strong>Hint chips:</strong> "Speech &amp; Language", "Occupational Therapy", "Autism-friendly clubs", "EHCP support" — each links directly to filtered provider directory</li>
      <li><strong>"How it works" strip:</strong> 3-step teal bar — ① Enter your postcode → ② Choose your support → ③ Connect directly</li>
      <li>Scroll cue arrow at the bottom</li>
    </ul>

    <h3>3.2 Pillars Bar (dark navy strip)</h3>
    <p>4-column grid linking to key sections:</p>
    <ul>
      <li>Find Local Support → <code>/explore</code></li>
      <li>Community → <code>/community</code></li>
      <li>News &amp; Research → <code>/news</code></li>
      <li>For Providers (highlighted) → <code>/for-providers</code></li>
    </ul>

    <h3>3.3 Categories Section (cream background)</h3>
    <p>Heading: "Where would you like to start?" with "View all providers →" link. 5 category cards in a grid:</p>
    <ul>
      <li>Therapists &amp; Specialists → <code>/providers?category=therapists</code></li>
      <li>Inclusive Clubs &amp; Activities → <code>/providers?category=activities</code></li>
      <li>Products &amp; Equipment → <code>/providers?category=products</code></li>
      <li>Education &amp; Learning Support → <code>/providers?category=education</code></li>
      <li>Charities &amp; Organisations → <code>/providers?category=charities</code></li>
    </ul>

    <h3>3.4 Parent Voice / "Why Beyonder Exists" (sage background)</h3>
    <ul>
      <li>Co-founder quote about searching for an OT</li>
      <li>4 stat cards: 85% say platform is vital, 80% rely on word of mouth, 1 in 5 children have SEN, Free for families</li>
    </ul>

    <h3>3.5 Provider Band (dark navy)</h3>
    <ul>
      <li>Headline: "Reach the families already searching for you"</li>
      <li>3 bullet points about free listing, enquiry flow, and profile control</li>
      <li>Teal CTA: "Create your free profile" → <code>/for-providers</code></li>
      <li>Ghost CTA: "Learn more" → <code>/for-providers</code></li>
    </ul>

    <h3>3.6 News &amp; Community Section (cream)</h3>
    <ul>
      <li><strong>News cards</strong> (3 articles) linking to <code>/news</code></li>
      <li><strong>Community cards</strong> (2 cards: Parent Forums + Local Events) linking to <code>/community</code></li>
    </ul>

    <h3>3.7 Guides Section (cream)</h3>
    <ul>
      <li>4 guide cards (EHCP, Assessment, Choosing Therapist, Sensory Processing) → <code>/guides</code></li>
    </ul>

    {/* ════════════════════════════════════════════════════════ */}
    <div className="page-break" />
    <h2>4. Explore Services <code>/explore</code></h2>
    <ul>
      <li>Region dropdown selector (11 UK regions + "All Regions")</li>
      <li>5 category cards — each links to filtered <code>/providers</code> page with the selected region as a URL param</li>
      <li>Categories: Therapists, Clubs, Products, Education, Charities</li>
    </ul>

    {/* ════════════════════════════════════════════════════════ */}
    <h2>5. Provider Directory <code>/providers</code></h2>
    <h3>5.1 Standard Provider View</h3>
    <ul>
      <li><strong>Filter bar:</strong> Region dropdown, Delivery Type (In-Person/Online/Hybrid), EHCP Supported toggle, search input</li>
      <li><strong>Category tabs:</strong> All, Therapists, Clubs, Products, Education, Charities</li>
      <li><strong>Active filter pills:</strong> show removable chips for all active filters</li>
      <li><strong>Provider cards:</strong> Show business name, type badge, Verified badge (if verified), EHCP badge (if enabled), short description, location, rating, needs supported</li>
      <li>Bookmark icon on each card</li>
      <li>"Load More" button at bottom (loads 6 at a time)</li>
      <li>Featured providers sort to the top (set in admin panel)</li>
    </ul>

    <h3>5.2 Product View <code>/providers?category=products</code></h3>
    <ul>
      <li>Switches to a product catalogue layout</li>
      <li><strong>Filters:</strong> Price Range (Under £10, £10–25, £25–50, £50+), Needs filter, product search</li>
      <li>Product cards show image, name, price, short description, needs tags, "by Provider →" link, "Add to Cart" button</li>
    </ul>

    <h3>5.3 Local View <code>/providers?view=local</code></h3>
    <ul>
      <li>3 quick-access cards: "Therapists &amp; Specialists", "Activities &amp; Clubs", "All Services In Your Area"</li>
    </ul>

    {/* ════════════════════════════════════════════════════════ */}
    <div className="page-break" />
    <h2>6. Provider Profile Page <code>/provider/:id</code></h2>
    <p>The content varies by provider type (Therapist/Club/Education/Charity/Product) and plan (Free vs Paid).</p>

    <h3>6.1 Always Visible (all providers)</h3>
    <ul>
      <li><strong>Hero:</strong> Type badge, plan badge, Verified badge, EHCP badge (therapists), founding provider tag</li>
      <li><strong>Availability banner</strong> (therapists only): Accepting / Waitlist / Closed — colour-coded</li>
      <li>"Own this profile?" → Claim button</li>
      <li>"Send Enquiry" button (top right + sticky footer bar)</li>
      <li><strong>Overview card:</strong> Full description, needs supported tags, age range, delivery format</li>
      <li><strong>Reviews:</strong> Star ratings, author name, text</li>
      <li><strong>Sidebar:</strong> Coverage area, email, phone, website</li>
    </ul>

    <h3>6.2 Paid Plan Features (Founder/Professional only)</h3>
    <table>
      <thead><tr><th>Section</th><th>Provider Types</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td>Spotlight Message</td><td>All</td><td>"From the team" message with teal left border</td></tr>
        <tr><td>Credentials</td><td>All</td><td>List of qualifications (HCPC, DBS etc.)</td></tr>
        <tr><td>Session Types</td><td>Therapist</td><td>Name, duration, price per session</td></tr>
        <tr><td>Available Dates</td><td>Therapist</td><td>Calendar date badges</td></tr>
        <tr><td>Timetable</td><td>Club, Education</td><td>Day/time/activity rows</td></tr>
        <tr><td>Session Capacity</td><td>Club</td><td>Session name, total capacity, spots left</td></tr>
        <tr><td>Term Programme</td><td>Club, Education</td><td>Term name + details, teal left border</td></tr>
        <tr><td>Open Days</td><td>Education</td><td>Event title, date, description, RSVP link</td></tr>
        <tr><td>EHCP &amp; Admissions</td><td>Education</td><td>Free-text admissions info</td></tr>
        <tr><td>Staff Profiles</td><td>Education</td><td>Name, role, bio with avatar initial</td></tr>
        <tr><td>Events</td><td>Charity</td><td>Collapsible event list (title, date, type, description)</td></tr>
        <tr><td>Volunteer Info</td><td>Charity</td><td>Free-text volunteering information</td></tr>
        <tr><td>Products</td><td>Product</td><td>Product grid with image, name, price, description</td></tr>
        <tr><td>Case Studies</td><td>Education</td><td>Title + description blocks</td></tr>
        <tr><td>Gallery</td><td>All</td><td>3-column image grid</td></tr>
        <tr><td>Store Link</td><td>Product</td><td>"Visit Store" link in sidebar</td></tr>
      </tbody>
    </table>

    <h3>6.3 Sidebar Widgets (paid, type-specific)</h3>
    <ul>
      <li><strong>Education:</strong> "Next Open Day" card, staff member count</li>
      <li><strong>Charity:</strong> Upcoming event count</li>
    </ul>

    {/* ════════════════════════════════════════════════════════ */}
    <div className="page-break" />
    <h2>7. Enquiry Page <code>/enquiry/:id</code></h2>
    <ul>
      <li><strong>Auth required:</strong> Redirects to <code>/login?redirect=…</code> if not logged in</li>
      <li><strong>Parent only:</strong> Provider/Admin accounts see a "this is for families" block</li>
      <li><strong>Form fields:</strong> Child's Age (required), Child's Name (optional), Needs/Diagnosis (optional), Message (20–800 chars)</li>
      <li><strong>Message guidance:</strong> On focus, shows a teal info box explaining enquiry etiquette and message limits</li>
      <li><strong>On submit:</strong> Shows confirmation with ✓ icon and "Go to Dashboard" button</li>
      <li>Enquiry is added to the in-memory store and appears in both parent and provider dashboards</li>
    </ul>

    {/* ════════════════════════════════════════════════════════ */}
    <h2>8. Parent Dashboard <code>/dashboard</code></h2>
    <p><span className="badge badge-navy">Role: Parent</span> Protected route — parent role only.</p>
    <ul>
      <li><strong>Enquiry list:</strong> Shows all sent enquiries with provider name, date, status ("Sent" or "Reply Received")</li>
      <li><strong>Unlock flow:</strong> When a provider replies, parent must "Unlock Reply" — triggers paywall modal</li>
      <li><strong>Paywall modal:</strong> Two options — £4.95 one-off unlock or £9.95/month unlimited. "Continue to Checkout" unlocks the reply (simulated)</li>
      <li><strong>Thread view:</strong> After unlocking, shows full message thread. Parent can send follow-up messages (4-message limit per thread, 500 chars per message). Shows remaining message count</li>
      <li><strong>Profile settings:</strong> Displays name and email</li>
    </ul>

    {/* ════════════════════════════════════════════════════════ */}
    <div className="page-break" />
    <h2>9. Provider Dashboard <code>/provider-dashboard</code></h2>
    <p><span className="badge badge-navy">Role: Provider</span> Protected route. Content varies by provider category type.</p>

    <h3>9.1 Common Features (all provider types)</h3>
    <ul>
      <li><strong>Header badges:</strong> Category type, plan type, plan status, suspended status</li>
      <li><strong>Suspension banner:</strong> Red alert if admin has suspended the account</li>
      <li><strong>Change request banner:</strong> Orange alert when admin has requested profile changes. "Changes Made" button to acknowledge</li>
      <li><strong>Profile card:</strong> Displays name, type, location, coverage, age range, delivery, email, phone, website. "Edit Profile" button opens edit modal</li>
      <li><strong>Edit Profile modal:</strong> Business name, description, location, email, phone, website, coverage area, age range, delivery format dropdown, needs supported (toggle chips for 11 need types)</li>
      <li><strong>Enquiries section:</strong> List of received enquiries with parent name, child name/needs preview, status (New/Replied). Click to open thread</li>
      <li><strong>Thread view:</strong> Full message history. Reply textarea (800 chars). 4-message cap per thread</li>
      <li><strong>Plan card:</strong> Shows current plan type and status</li>
    </ul>

    <h3>9.2 Paid-Plan Only Sections <span className="badge badge-paid">Founder / Professional</span></h3>
    <p>Free-plan providers see these sections locked with "Upgrade to unlock" badge.</p>

    <h4>All Provider Types</h4>
    <ul>
      <li><strong>Gallery:</strong> Upload images (PNG/JPEG, max 2MB). Displays uploaded images in a grid. Delete individual images</li>
      <li><strong>Testimonials:</strong> Displays approved testimonials from the module data</li>
      <li><strong>Spotlight Message:</strong> Textarea to set a "From the team" message shown on the public profile</li>
      <li><strong>Referral Notes:</strong> Card explaining that private notes are available within enquiry threads (auto-saves on blur, 500 char limit). Never visible to families</li>
    </ul>

    <h4>Therapist-Specific Sections</h4>
    <ul>
      <li><strong>Availability Status:</strong> Dropdown — Accepting Clients / Waitlist Only / Closed. Changes the coloured banner on the public profile</li>
      <li><strong>Session Types:</strong> Add/remove sessions with name, duration, price</li>
      <li><strong>Availability Calendar:</strong> Add/remove individual dates. Shown as date badges on public profile</li>
      <li><strong>Certifications:</strong> Add/remove credential entries</li>
      <li><strong>EHCP Support:</strong> Toggle switch to enable/disable the orange "EHCP Supported" badge. Visible in directory and provider page</li>
    </ul>

    <h4>Club-Specific Sections</h4>
    <ul>
      <li><strong>Timetable:</strong> Add/remove day/time/activity entries</li>
      <li><strong>Session Capacity:</strong> Add sessions with name, total capacity, spots remaining</li>
      <li><strong>Term Programme:</strong> Add term entries with name and details</li>
    </ul>

    <h4>Education-Specific Sections</h4>
    <ul>
      <li><strong>Open Days:</strong> Add events with title, date, description, RSVP link</li>
      <li><strong>EHCP &amp; Admissions:</strong> Free-text textarea for admissions policy</li>
      <li><strong>Staff Profiles:</strong> Add staff with name, role, bio</li>
      <li><strong>Term Programme:</strong> Same as clubs</li>
      <li><strong>Case Studies:</strong> Add title + description entries</li>
    </ul>

    <h4>Charity-Specific Sections</h4>
    <ul>
      <li><strong>Events:</strong> Add events with title, date, type (online/in-person), description</li>
      <li><strong>Volunteer Info:</strong> Free-text textarea</li>
    </ul>

    <h4>Product-Specific Sections</h4>
    <ul>
      <li><strong>Products:</strong> Manage product catalogue — add new products (name, price, image upload max 1MB, short description max 120 chars). Edit existing product descriptions and images</li>
      <li><strong>Store Link:</strong> Set an external store URL shown on the public profile</li>
    </ul>

    {/* ════════════════════════════════════════════════════════ */}
    <div className="page-break" />
    <h2>10. Admin Panel <code>/admin</code></h2>
    <p><span className="badge badge-orange">Role: Admin</span> Protected route. 7 tabs:</p>

    <h3>10.1 Providers Tab</h3>
    <ul>
      <li>Lists all providers with name, type badge, location, category type, plan type, status</li>
      <li><strong>Verify toggle:</strong> Adds/removes the "Verified" badge (teal shield icon) on directory and profile</li>
      <li><strong>Feature toggle:</strong> Adds/removes "Featured" badge. Featured providers sort to top of directory</li>
      <li><strong>EHCP toggle</strong> (therapists only): Adds/removes orange "EHCP Supported" badge</li>
      <li><strong>Request Changes:</strong> Opens a textarea to send a change request to the provider. Shows as orange banner on their dashboard. Provider acknowledges with "Changes Made" button. Admin can then "Mark Reviewed"</li>
      <li><strong>Suspend / Reinstate:</strong> Toggles provider suspension. Suspended providers are hidden from directory and show a red banner on their profile and dashboard</li>
    </ul>

    <h3>10.2 Parents Tab</h3>
    <ul>
      <li>Lists parent users (mock data) with name, email, status</li>
      <li>Suspend button (UI only in current build)</li>
    </ul>

    <h3>10.3 Reviews Tab</h3>
    <ul>
      <li>Lists all reviews with author, rating, text preview</li>
      <li>"Remove" button per review (UI only in current build)</li>
    </ul>

    <h3>10.4 Plans &amp; Categories Tab</h3>
    <ul>
      <li>Per-provider dropdowns to change: Category Type (therapist/club/education/charity/product), Plan Type (free/founder/professional), Plan Status (active/trial/expired)</li>
      <li>"Save Changes" button applies immediately. Changes affect which dashboard sections and public profile features are visible</li>
      <li>Changing a provider from "free" to "founder" or "professional" unlocks all paid features for that provider</li>
    </ul>

    <h3>10.5 Founder Settings Tab</h3>
    <ul>
      <li><strong>Founder Limit:</strong> Editable number (default 200). Controls how many providers can auto-receive the Founder plan when claiming</li>
      <li>Shows current founder count and remaining slots</li>
      <li>Explanation of how the auto-assignment logic works</li>
    </ul>

    <h3>10.6 Claim Requests Tab</h3>
    <ul>
      <li>Lists all provider claim requests with: provider name, claimant email, listing domain, email domain, submitted date, status</li>
      <li><strong>Auto-approved claims</strong> don't appear here (domain matched)</li>
      <li><strong>Pending claims</strong> (domain mismatch) show Approve / Reject buttons</li>
      <li>Shows a count badge on the tab for pending claims</li>
    </ul>

    <h3>10.7 Content Strings Tab</h3>
    <ul>
      <li>Editable text fields for: Hero CTA, Paywall Title, Paywall Body, Empty Enquiries, Confirmation Message</li>
      <li>"Save Changes" button (UI placeholder — values are session-only)</li>
    </ul>

    {/* ════════════════════════════════════════════════════════ */}
    <div className="page-break" />
    <h2>11. Other Pages</h2>

    <h3>Login <code>/login</code></h3>
    <ul>
      <li>Email + password form. Accepts any password</li>
      <li>Pilot test login chips at the bottom (7 test accounts)</li>
      <li>If redirected from an enquiry page, shows a contextual prompt: "Log in or sign up to send your enquiry"</li>
      <li>Routes: admin → /admin, provider → /provider-dashboard, parent → /dashboard, pending claim → /provider-dashboard?claimStatus=pending_review</li>
    </ul>

    <h3>Sign Up <code>/signup</code></h3>
    <ul>
      <li>Two tabs: "I'm a Parent" / "I'm a Provider"</li>
      <li>Parent signup: Name, email, password → /dashboard</li>
      <li>Provider signup: Organisation name, email, password → /provider-dashboard</li>
      <li>If accessed with <code>?claimProviderId=X&amp;role=provider</code>, shows a claim-specific flow with a teal info box. On submit, attempts to claim the listing automatically</li>
    </ul>

    <h3>For Providers <code>/for-providers</code></h3>
    <ul>
      <li>Landing page with headline "Grow Your Reach with Beyonder"</li>
      <li>Founding Provider slots counter (shows remaining slots from admin setting)</li>
      <li>"Sign Up as a Provider" CTA → /signup?role=provider</li>
      <li>If accessed with <code>?claimProviderId=X</code>, shows a claim intent banner with the provider name</li>
      <li>Benefits list: reach families, build trust, manage enquiries, increase visibility, join community</li>
    </ul>

    <h3>About <code>/about</code></h3>
    <ul><li>Static page describing Beyonder's mission and team background</li></ul>

    <h3>Community <code>/community</code></h3>
    <ul><li>Two cards: Parent Forums (coming soon) and Local Events (coming soon)</li></ul>

    <h3>Guides <code>/guides</code></h3>
    <ul><li>4 guide cards: Understanding EHCPs, Navigating Assessment, Choosing a Therapist, Sensory Processing</li></ul>

    <h3>News <code>/news</code></h3>
    <ul><li>3 article cards with date, title, and summary</li></ul>

    <h3>Help Centre <code>/help</code></h3>
    <ul><li>FAQ accordion: finding services, pricing, vetting, saving providers, getting listed</li></ul>

    {/* ════════════════════════════════════════════════════════ */}
    <div className="page-break" />
    <h2>12. Feature Gating System</h2>
    <p>Providers have a <strong>plan_type</strong> (free / founder / professional) and <strong>plan_status</strong> (active / trial / expired).</p>
    <table>
      <thead><tr><th>Plan</th><th>Features Included</th></tr></thead>
      <tbody>
        <tr><td><span className="badge badge-free">Free</span></td><td>Enquiries, Availability Status</td></tr>
        <tr><td><span className="badge badge-paid">Founder / Professional</span></td><td>Everything: Enquiries, Availability, Certifications, Testimonials, Timetable, Gallery, Case Studies, Spotlight, Store Link, Products, Referral Notes, EHCP Support, Session Types, Availability Dates, Session Capacity, Term Programme, Open Days, EHCP &amp; Admissions, Staff Profiles, Events, Volunteer Info</td></tr>
      </tbody>
    </table>
    <p>If <code>plan_status = expired</code>, provider reverts to free-tier features only.</p>

    {/* ════════════════════════════════════════════════════════ */}
    <h2>13. Profile Claiming Flow</h2>
    <p>All providers on Beyonder are pre-listed. A real provider can "claim" their listing to manage it.</p>
    <ol>
      <li>Visit a provider page → click "Claim this profile"</li>
      <li>If not logged in, redirected to For Providers page → Sign Up as Provider</li>
      <li><strong>Domain match</strong> (email domain = listing's websiteDomain): auto-approved, assigned Founder plan (if slots available) or Free plan</li>
      <li><strong>Domain mismatch</strong>: queued as "pending_review". Provider sees "Your claim is being reviewed" screen. Appears in Admin → Claim Requests tab</li>
      <li>Admin approves → provider gets full dashboard access. Admin rejects → claim removed</li>
    </ol>

    {/* ════════════════════════════════════════════════════════ */}
    <h2>14. Testing Flows</h2>

    <h3>Flow A: Parent Journey</h3>
    <ol>
      <li>Visit homepage → use search bar or category cards</li>
      <li>Browse provider directory → apply filters (region, category, EHCP, delivery type)</li>
      <li>Click a provider → review their profile</li>
      <li>Click "Send Enquiry" → redirected to login if not authenticated</li>
      <li>Log in as <code>test@parent.com</code></li>
      <li>Fill and submit enquiry form</li>
      <li>Go to Dashboard → see your enquiry listed as "Sent"</li>
      <li>Log out, log in as the provider → reply to the enquiry</li>
      <li>Log out, log back in as parent → see "Reply Received" → click "Unlock Reply" → go through paywall → view thread</li>
      <li>Send a follow-up message (observe the 4-message limit)</li>
    </ol>

    <h3>Flow B: Provider Journey</h3>
    <ol>
      <li>Log in as any provider (e.g. <code>therapist@beyonder.test</code>)</li>
      <li>View your Provider Dashboard — check profile card, plan badge, category badge</li>
      <li>Click "Edit Profile" → update details → Save</li>
      <li>Test category-specific sections (e.g. add a session type for therapist, add a timetable entry for club)</li>
      <li>Open an enquiry → reply to it → check referral notes (paid plans only)</li>
      <li>Upload a gallery image</li>
      <li>Set a spotlight message</li>
      <li>Visit your own public provider page to see changes reflected</li>
    </ol>

    <h3>Flow C: Admin Journey</h3>
    <ol>
      <li>Log in as <code>admin@beyonder.com</code></li>
      <li>Providers tab: Verify a provider → check directory for the badge. Feature a provider → check they sort to top. Send a change request → log in as that provider to see the banner</li>
      <li>Plans &amp; Categories tab: Change a provider from "free" to "founder" → log in as that provider to see paid sections unlocked</li>
      <li>Suspend a provider → check they disappear from directory and see the red banner on their profile</li>
      <li>Founder Settings: Change the limit → note the remaining slots counter</li>
    </ol>

    <h3>Flow D: Profile Claiming</h3>
    <ol>
      <li>Log out. Visit any provider page → click "Claim this profile"</li>
      <li>You'll be taken to For Providers → Sign Up</li>
      <li>Enter an email with a <strong>matching domain</strong> (e.g. <code>me@brightminds.co.uk</code> for provider #1) → auto-approved, lands on dashboard</li>
      <li>Or enter a <strong>non-matching domain</strong> → shows "Your claim is being reviewed"</li>
      <li>Log in as admin → Claim Requests tab → Approve or Reject the pending claim</li>
    </ol>

    {/* ════════════════════════════════════════════════════════ */}
    <h2>15. Mock Data Summary</h2>
    <table>
      <thead><tr><th>#</th><th>Provider</th><th>Type</th><th>Category</th><th>Location</th><th>Plan</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>Bright Minds Speech Therapy</td><td>Therapist</td><td>therapist</td><td>Bristol</td><td>Founder</td></tr>
        <tr><td>2</td><td>Splash Inclusive Swimming</td><td>Activity</td><td>club</td><td>Bath</td><td>Founder</td></tr>
        <tr><td>3</td><td>SensoryPlay Shop</td><td>Product</td><td>product</td><td>Online</td><td>Founder</td></tr>
        <tr><td>4</td><td>Learning Tree Tutoring</td><td>Education</td><td>education</td><td>Cardiff</td><td>Founder</td></tr>
        <tr><td>5</td><td>SEND Families United</td><td>Charity</td><td>charity</td><td>Manchester</td><td>Founder</td></tr>
        <tr><td>6</td><td>Focus OT Services</td><td>Therapist</td><td>therapist</td><td>London</td><td>Founder</td></tr>
        <tr><td>7</td><td>Northern Stars Music Therapy</td><td>Therapist</td><td>therapist</td><td>Newcastle</td><td>Founder</td></tr>
        <tr><td>8</td><td>Online SEND Counselling</td><td>Therapist</td><td>therapist</td><td>Online</td><td>Founder</td></tr>
        <tr><td>9</td><td>Sunshine SEND Club</td><td>Activity</td><td>club</td><td>London</td><td>Founder</td></tr>
      </tbody>
    </table>

    <div className="note">
      <strong>Remember:</strong> All data is in-memory only. Refreshing the page resets all changes (enquiries, profile edits, plan changes, claims). This is expected behaviour for the prototype.
    </div>
  </div>
);

export default TestGuidePage;
