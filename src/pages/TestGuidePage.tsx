const TestGuidePage = () => (
  <div
    style={{
      fontFamily: "'Outfit', 'Segoe UI', sans-serif",
      maxWidth: 800,
      margin: "0 auto",
      padding: "40px 24px",
      color: "#1a2a3a",
      background: "#fff",
      lineHeight: 1.7,
    }}
  >
    <style>{`
      @media print {
        body { background: #fff !important; }
        .no-print { display: none !important; }
        h2 { page-break-before: auto; }
        .page-section { page-break-inside: avoid; }
      }
      h1 { font-size: 28px; color: #061828; margin-bottom: 4px; }
      h2 { font-size: 20px; color: #2a7a6a; margin-top: 36px; margin-bottom: 12px; border-bottom: 2px solid #eaf4f0; padding-bottom: 6px; }
      h3 { font-size: 15px; color: #061828; margin-top: 20px; margin-bottom: 6px; }
      ul { padding-left: 20px; margin: 6px 0; }
      li { margin-bottom: 4px; font-size: 14px; }
      .badge { display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 12px; font-weight: 600; margin-right: 6px; }
      .teal { background: #eaf4f0; color: #2a7a6a; }
      .orange { background: #fef3ee; color: #e8622a; }
      .navy { background: #f0f2f5; color: #061828; }
      .login-box { background: #f8f6f2; border: 1px solid #ede6d8; border-radius: 10px; padding: 14px 18px; margin: 10px 0; font-size: 13px; }
      .login-box code { background: #e8e4dc; padding: 1px 6px; border-radius: 4px; font-size: 12px; }
      .note { background: #eaf4f0; border-left: 3px solid #2a7a6a; padding: 10px 14px; border-radius: 0 8px 8px 0; font-size: 13px; margin: 10px 0; }
    `}</style>

    <div className="no-print" style={{ marginBottom: 20, padding: "12px 16px", background: "#eaf4f0", borderRadius: 10, fontSize: 14 }}>
      <strong>💡 To save as PDF:</strong> Press <code>Ctrl+P</code> (or <code>Cmd+P</code> on Mac) → select "Save as PDF" → click Save.
    </div>

    <h1>Beyonder — Tester's Guide</h1>
    <p style={{ fontSize: 14, color: "#556677", marginTop: 0 }}>
      A complete summary of every page, feature, and function. Use this to test the MVP.
    </p>

    <div className="note">
      <strong>⚠️ Important:</strong> This is a front-end prototype. All data is mock/demo data stored in memory. Refreshing the page resets any changes you made. No real payments, emails, or accounts are created.
    </div>

    {/* ─── TEST LOGINS ─── */}
    <h2>🔑 Test Login Accounts</h2>
    <p style={{ fontSize: 14 }}>Go to <strong>/login</strong>. Use any password. Quick-fill buttons are provided.</p>
    <div className="login-box">
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead><tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
          <th style={{ padding: "4px 8px" }}>Role</th>
          <th style={{ padding: "4px 8px" }}>Email</th>
          <th style={{ padding: "4px 8px" }}>Goes to</th>
        </tr></thead>
        <tbody>
          <tr><td style={{ padding: "4px 8px" }}>Parent</td><td><code>test@parent.com</code></td><td>Parent Dashboard</td></tr>
          <tr><td style={{ padding: "4px 8px" }}>Therapist Provider</td><td><code>therapist@beyonder.test</code></td><td>Provider Dashboard (Therapist)</td></tr>
          <tr><td style={{ padding: "4px 8px" }}>Club Provider</td><td><code>club@beyonder.test</code></td><td>Provider Dashboard (Club)</td></tr>
          <tr><td style={{ padding: "4px 8px" }}>Education Provider</td><td><code>education@beyonder.test</code></td><td>Provider Dashboard (Education)</td></tr>
          <tr><td style={{ padding: "4px 8px" }}>Charity Provider</td><td><code>charity@beyonder.test</code></td><td>Provider Dashboard (Charity)</td></tr>
          <tr><td style={{ padding: "4px 8px" }}>Product Provider</td><td><code>product@beyonder.test</code></td><td>Provider Dashboard (Product)</td></tr>
          <tr><td style={{ padding: "4px 8px" }}>Admin</td><td><code>admin@beyonder.com</code></td><td>Admin Panel</td></tr>
        </tbody>
      </table>
    </div>

    {/* ─── HOMEPAGE ─── */}
    <h2>1. Homepage <span className="badge navy">/</span></h2>
    <div className="page-section">
      <ul>
        <li><strong>Hero section</strong> — animated star background with Beyonder logo and tagline</li>
        <li><strong>Search bar</strong> — two fields: <em>Region</em> (dropdown with UK regions + "Online Only") and <em>Type of support</em> (free text). Submits to Provider Directory with filters applied</li>
        <li><strong>Quick search chips</strong> — "Speech & Language", "Occupational Therapy", "Autism-friendly clubs", "EHCP support" — each links to pre-filtered directory</li>
        <li><strong>"How Beyonder Works"</strong> — 3-step visual guide (Search → Connect → Support)</li>
        <li><strong>Feature cards</strong> — "Find Local Support", "Guides & Understanding", "Work With Beyonder" — each links to relevant page</li>
        <li><strong>Category quick-links</strong> — Therapists, Clubs, News — each links to filtered directory or content page</li>
        <li><strong>Community preview</strong> — cards for Parent Forums and Local Events (coming soon)</li>
        <li><strong>Latest News</strong> — preview of recent news articles</li>
        <li><strong>Parallax scrolling</strong> — multi-speed parallax on hero elements</li>
      </ul>
    </div>

    {/* ─── NAVIGATION ─── */}
    <h2>2. Navigation & Layout <span className="badge navy">All pages</span></h2>
    <div className="page-section">
      <ul>
        <li><strong>Sticky header</strong> — fixed at top with: Home, About Us, Get Connected, For Providers</li>
        <li><strong>Auth buttons</strong> — "Log in" and "Join now" when logged out; "Dashboard" + user name + logout icon when logged in</li>
        <li><strong>Mobile menu</strong> — hamburger icon on small screens, full-screen overlay menu</li>
        <li><strong>Footer</strong> — links to About, Help Centre, Guides, News, Community, For Providers</li>
        <li><strong>Role-based dashboard link</strong> — Parent → /dashboard, Provider → /provider-dashboard, Admin → /admin</li>
      </ul>
    </div>

    {/* ─── EXPLORE ─── */}
    <h2>3. Explore Services <span className="badge navy">/explore</span></h2>
    <div className="page-section">
      <ul>
        <li><strong>Region dropdown</strong> — filter services by UK region before browsing</li>
        <li><strong>5 category cards</strong> — Therapists & Specialists, Inclusive Clubs & Activities, Products & Equipment, Education & Learning Support, Charities & Support Organisations</li>
        <li>Each card links to the <strong>Provider Directory</strong> with that category pre-selected</li>
        <li>Reassurance text at bottom: "All providers on Beyonder are reviewed by our team"</li>
      </ul>
    </div>

    {/* ─── PROVIDER DIRECTORY ─── */}
    <h2>4. Provider Directory <span className="badge navy">/providers</span></h2>
    <div className="page-section">
      <h3>Filters & Search</h3>
      <ul>
        <li><strong>Region filter</strong> — dropdown of UK regions</li>
        <li><strong>Delivery type</strong> — In-Person, Online, Hybrid, All</li>
        <li><strong>EHCP Supported toggle</strong> — filters to only EHCP-supporting providers</li>
        <li><strong>Search box</strong> — free-text search across provider names, descriptions, needs, tags</li>
        <li><strong>Category tabs</strong> — All, Therapists, Activities, Products, Education, Charities</li>
        <li><strong>Active filter chips</strong> — removable pills showing current filters</li>
        <li><strong>Clear all filters</strong> button</li>
      </ul>
      <h3>Provider Cards</h3>
      <ul>
        <li>Shows: name, type badge, plan badge, verified badge, EHCP badge, featured badge, location, rating, review count, short description, needs tags</li>
        <li><strong>Bookmark button</strong> — visual toggle (not persisted)</li>
        <li><strong>"View Profile"</strong> button → goes to individual provider page</li>
        <li><strong>"Load More"</strong> button for pagination</li>
        <li>Empty state with suggestion to adjust filters</li>
      </ul>
      <h3>Product Catalogue View</h3>
      <ul>
        <li>When "Products" category is selected, shows a <strong>product grid</strong> instead of provider cards</li>
        <li>Filters: Price Range, Needs, free-text product search</li>
        <li>Product cards: image, name, provider name, price, short description, needs tags</li>
        <li><strong>"Add to Cart"</strong> button (visual only, 2-second confirmation)</li>
      </ul>
    </div>

    {/* ─── PROVIDER PAGE ─── */}
    <h2>5. Individual Provider Page <span className="badge navy">/provider/:id</span></h2>
    <div className="page-section">
      <h3>Always Visible</h3>
      <ul>
        <li><strong>Hero</strong> — provider name, type badge, plan badge, verified badge, EHCP badge, location, rating, founding provider badge</li>
        <li><strong>Availability banner</strong> (therapists) — "Accepting New Clients" / "Waitlist Only" / "Not Accepting Clients"</li>
        <li><strong>"Send Enquiry"</strong> CTA button</li>
        <li><strong>"Claim this profile"</strong> — for unclaimed providers, redirects to signup flow</li>
        <li><strong>Overview card</strong> — description, needs supported tags, age range, delivery format</li>
        <li><strong>Reviews & ratings</strong> — star ratings, testimonials from parents</li>
        <li><strong>Practical info sidebar</strong> — coverage area, email, phone, website link</li>
        <li><strong>Sticky CTA</strong> — "Send Enquiry" button fixed at bottom of screen</li>
      </ul>
      <h3>Paid Plan Features (visible when provider is on Founder/Professional plan)</h3>
      <ul>
        <li><strong>Spotlight message</strong> — highlighted message from the provider</li>
        <li><strong>Credentials & Qualifications</strong> — list of certifications</li>
        <li><strong>Timetable</strong> — day/time/activity schedule</li>
        <li><strong>Gallery</strong> — uploaded images</li>
        <li><strong>Case Studies</strong> — success stories</li>
      </ul>
      <h3>Category-Specific Sections (Paid)</h3>
      <ul>
        <li><strong>Therapist:</strong> Session Types (name, duration, price), Available Dates calendar</li>
        <li><strong>Club:</strong> Session Availability (capacity, spots left), Term Programme</li>
        <li><strong>Education:</strong> Open Days (date, description, RSVP link), EHCP & Admissions info, Staff Profiles, Term Programme</li>
        <li><strong>Charity:</strong> Events (date, type, description, expandable details), Volunteer Info</li>
        <li><strong>Product:</strong> Product grid (image, name, price), Store link</li>
      </ul>
      <h3>Suspended Providers</h3>
      <ul>
        <li>Shows "This listing is currently unavailable" banner</li>
        <li>Send Enquiry button is hidden</li>
      </ul>
    </div>

    {/* ─── ENQUIRY ─── */}
    <h2>6. Send Enquiry <span className="badge navy">/enquiry/:id</span></h2>
    <div className="page-section">
      <ul>
        <li><strong>Login gate</strong> — if not logged in, redirects to login with return URL</li>
        <li><strong>Role gate</strong> — provider/admin accounts see "Enquiries are for families" message</li>
        <li><strong>Form fields:</strong> Child's Age (required), Child's Name (optional), Needs/Diagnosis (optional), Message (20–800 chars)</li>
        <li><strong>Guidance note</strong> — appears when message field is focused, explaining enquiry etiquette</li>
        <li><strong>Character counter</strong> — shows remaining characters, turns orange when low</li>
        <li><strong>Confirmation screen</strong> — "Enquiry Sent!" with link to Parent Dashboard</li>
      </ul>
    </div>

    {/* ─── PARENT DASHBOARD ─── */}
    <h2>7. Parent Dashboard <span className="badge teal">/dashboard</span></h2>
    <p style={{ fontSize: 13, color: "#556677" }}>Login: <code>test@parent.com</code></p>
    <div className="page-section">
      <ul>
        <li><strong>Subscription badge</strong> — "Free Tier" or "Subscribed"</li>
        <li><strong>Enquiries list</strong> — shows all sent enquiries with provider name, date, status ("Sent" / "Reply Received")</li>
        <li><strong>Unlock Reply</strong> — if provider has replied but enquiry is locked, clicking shows the <strong>Upgrade Modal</strong></li>
        <li><strong>Upgrade Modal:</strong> Two options — £4.95 one-off unlock or £9.95/month subscription. "Continue to Checkout" unlocks the reply (mock checkout)</li>
        <li><strong>View Thread</strong> — after unlocking, shows full message thread (parent messages left, provider messages right)</li>
        <li><strong>Reply to provider</strong> — textarea with 500-char limit, shows remaining message count (4 messages max per thread)</li>
        <li><strong>Message cap</strong> — when 4 messages reached, shows "conversation has reached its limit" notice</li>
        <li><strong>Profile Settings</strong> — displays name and email</li>
        <li><strong>Empty state</strong> — "You haven't sent any enquiries yet" with link to Explore Services</li>
      </ul>
    </div>

    {/* ─── ALL PROVIDER DASHBOARDS ─── */}
    <h2>8. Provider Dashboard — Common Features <span className="badge teal">/provider-dashboard</span></h2>
    <p style={{ fontSize: 13, color: "#556677" }}>All provider types share these core features. Category-specific features follow below.</p>
    <div className="page-section">
      <h3>Enquiries Section</h3>
      <ul>
        <li><strong>Enquiry list</strong> — shows all received enquiries with parent name, child age, child name, needs, date, status badges</li>
        <li><strong>Status badges:</strong> "New" (orange), "Replied" (teal), "Conversation" (when multi-message)</li>
        <li><strong>View enquiry thread</strong> — click to open full message thread</li>
        <li><strong>Reply to parent</strong> — textarea (800-char limit), sends reply</li>
        <li><strong>Message cap</strong> — 4 messages per thread, then shows limit notice</li>
        <li><strong>Provider Notes</strong> (paid plan) — private notes field per enquiry, not visible to parents</li>
      </ul>
      <h3>Profile Editing</h3>
      <ul>
        <li><strong>Edit Profile button</strong> → opens modal with: Business Name, Description, Location, Email, Phone, Website, Coverage Area, Age Range, Delivery Format (dropdown), Needs Supported (multi-select toggles)</li>
        <li>All changes save to in-memory store</li>
      </ul>
      <h3>Availability Status</h3>
      <ul>
        <li><strong>Dropdown selector:</strong> "Accepting Clients", "Waitlist Only", "Closed"</li>
        <li>Change is reflected immediately on the public provider page</li>
      </ul>
      <h3>Feature-Gated Sections (Paid Plans Only)</h3>
      <ul>
        <li>Sections locked behind plan show a <strong>lock icon + "Upgrade to unlock"</strong> message</li>
        <li><strong>Plan badge</strong> shown at top: Free / Founder / Professional</li>
      </ul>
      <h3>Admin Notifications</h3>
      <ul>
        <li><strong>Suspended banner</strong> — if admin suspends you, shows red warning with message</li>
        <li><strong>Change Request banner</strong> — if admin requests changes, shows orange notice with the message and "I've Made the Changes" button</li>
      </ul>
    </div>

    {/* ─── THERAPIST DASHBOARD ─── */}
    <h2>9. Therapist Provider Dashboard <span className="badge orange">therapist@beyonder.test</span></h2>
    <div className="page-section">
      <p style={{ fontSize: 14 }}>Includes all common features above, plus:</p>
      <ul>
        <li><strong>Session Types</strong> (paid) — add/remove session types with name, duration, price</li>
        <li><strong>Availability Calendar</strong> (paid) — add available dates via date picker</li>
        <li><strong>Certifications</strong> (paid) — add/remove qualifications and credentials</li>
        <li><strong>Testimonials</strong> (paid) — view submitted testimonials from parents</li>
        <li><strong>Gallery</strong> (paid) — upload images (PNG/JPEG, max 2MB each), delete images</li>
        <li><strong>Spotlight Message</strong> (paid) — write a highlighted message shown on your public profile</li>
        <li><strong>Referral Notes</strong> (paid) — private notes per enquiry visible only to you</li>
        <li><strong>EHCP Support toggle</strong> (paid) — mark yourself as EHCP-supporting (shows badge on public profile)</li>
      </ul>
    </div>

    {/* ─── CLUB DASHBOARD ─── */}
    <h2>10. Club Provider Dashboard <span className="badge orange">club@beyonder.test</span></h2>
    <div className="page-section">
      <p style={{ fontSize: 14 }}>Includes all common features, plus:</p>
      <ul>
        <li><strong>Timetable</strong> (paid) — add/remove sessions with day, time, activity</li>
        <li><strong>Session Capacity</strong> (paid) — add sessions with total capacity and spots remaining</li>
        <li><strong>Term Programme</strong> (paid) — add term details (term name + description)</li>
        <li><strong>Gallery</strong> (paid) — upload/manage images</li>
        <li><strong>Testimonials</strong> (paid) — view parent testimonials</li>
        <li><strong>Spotlight Message</strong> (paid) — write a highlighted message</li>
        <li><strong>Referral Notes</strong> (paid) — private notes per enquiry</li>
      </ul>
    </div>

    {/* ─── EDUCATION DASHBOARD ─── */}
    <h2>11. Education Provider Dashboard <span className="badge orange">education@beyonder.test</span></h2>
    <div className="page-section">
      <p style={{ fontSize: 14 }}>Includes all common features, plus:</p>
      <ul>
        <li><strong>Open Days</strong> (paid) — add open day events with title, date, description, RSVP link</li>
        <li><strong>EHCP & Admissions</strong> (paid) — free-text field for admissions info</li>
        <li><strong>Staff Profiles</strong> (paid) — add staff with name, role, and bio</li>
        <li><strong>Term Programme</strong> (paid) — add term details</li>
        <li><strong>Case Studies</strong> (paid) — add success stories with title and description</li>
        <li><strong>Gallery</strong> (paid) — upload/manage images</li>
        <li><strong>Testimonials</strong> (paid) — view parent testimonials</li>
        <li><strong>Spotlight Message</strong> (paid) — write a highlighted message</li>
        <li><strong>Referral Notes</strong> (paid) — private notes per enquiry</li>
      </ul>
    </div>

    {/* ─── CHARITY DASHBOARD ─── */}
    <h2>12. Charity Provider Dashboard <span className="badge orange">charity@beyonder.test</span></h2>
    <div className="page-section">
      <p style={{ fontSize: 14 }}>Includes all common features, plus:</p>
      <ul>
        <li><strong>Events</strong> (paid) — add events with title, date, type (online/in-person), description</li>
        <li><strong>Volunteer Info</strong> (paid) — free-text field for volunteering information</li>
        <li><strong>Gallery</strong> (paid) — upload/manage images</li>
        <li><strong>Testimonials</strong> (paid) — view parent testimonials</li>
        <li><strong>Spotlight Message</strong> (paid) — write a highlighted message</li>
        <li><strong>Referral Notes</strong> (paid) — private notes per enquiry</li>
      </ul>
    </div>

    {/* ─── PRODUCT DASHBOARD ─── */}
    <h2>13. Product Provider Dashboard <span className="badge orange">product@beyonder.test</span></h2>
    <div className="page-section">
      <p style={{ fontSize: 14 }}>Includes all common features, plus:</p>
      <ul>
        <li><strong>Products</strong> (paid) — manage product catalogue: add/edit products with name, price, image (PNG/JPEG, max 1MB), short description (120 chars)</li>
        <li><strong>Existing product editing</strong> — change image and description of existing products inline</li>
        <li><strong>Store Link</strong> (paid) — set an external store URL shown on public profile</li>
        <li><strong>Gallery</strong> (paid) — upload/manage images</li>
        <li><strong>Testimonials</strong> (paid) — view parent testimonials</li>
        <li><strong>Spotlight Message</strong> (paid) — write a highlighted message</li>
        <li><strong>Referral Notes</strong> (paid) — private notes per enquiry</li>
      </ul>
    </div>

    {/* ─── ADMIN PANEL ─── */}
    <h2>14. Admin Panel <span className="badge teal">/admin</span></h2>
    <p style={{ fontSize: 13, color: "#556677" }}>Login: <code>admin@beyonder.com</code></p>
    <div className="page-section">
      <h3>Tab: Providers</h3>
      <ul>
        <li><strong>Provider list</strong> — all providers with name, type, location, category, plan type, status badges</li>
        <li><strong>Suspend / Reinstate</strong> — toggle a provider's active status. Suspended providers show a warning on their public page and can't receive enquiries</li>
        <li><strong>Verify / Unverify</strong> — toggle verified badge (shows ✓ on public profile)</li>
        <li><strong>Feature / Unfeature</strong> — toggle featured badge (shows ★ on public profile)</li>
        <li><strong>EHCP toggle</strong> (therapists only) — mark provider as EHCP-supporting</li>
        <li><strong>Request Changes</strong> — send a text message to the provider. Shows as orange "Awaiting Changes" badge. Provider sees it on their dashboard and can acknowledge</li>
        <li><strong>Mark Reviewed</strong> — after provider acknowledges changes, admin can clear the request</li>
        <li>Providers with active change requests are <strong>sorted to the top</strong></li>
      </ul>
      <h3>Tab: Parents</h3>
      <ul>
        <li><strong>Parent list</strong> — mock parents with name, email, status</li>
        <li><strong>Suspend / Activate</strong> — toggle parent status (visual only in MVP)</li>
      </ul>
      <h3>Tab: Reviews</h3>
      <ul>
        <li><strong>Review list</strong> — all reviews with parent name, provider, rating, text</li>
        <li><strong>Remove</strong> — delete a review (visual only)</li>
      </ul>
      <h3>Tab: Plans & Categories</h3>
      <ul>
        <li><strong>Per-provider controls:</strong> change Plan Type (Free / Founder / Professional), Plan Status (Active / Trial / Expired), Category Type (Therapist / Club / Education / Charity / Product)</li>
        <li><strong>Save</strong> — applies changes immediately. Provider's dashboard sections and public profile update based on new plan</li>
        <li>This is how you can <strong>test feature gating</strong> — change a provider from Free to Founder and see paid features unlock on their dashboard</li>
      </ul>
      <h3>Tab: Founder Settings</h3>
      <ul>
        <li><strong>Founder slot limit</strong> — set how many founding provider places are available</li>
        <li><strong>Current count</strong> — shows how many have been claimed vs. remaining</li>
        <li>Displayed on the "For Providers" page as "X Founding Provider places remaining"</li>
      </ul>
      <h3>Tab: Claim Requests</h3>
      <ul>
        <li><strong>Pending claims list</strong> — providers who signed up and claimed an existing listing</li>
        <li><strong>Approve / Reject</strong> — approve grants full dashboard access; reject removes the claim</li>
        <li>Badge count shows number of pending claims</li>
      </ul>
      <h3>Tab: Content Strings</h3>
      <ul>
        <li><strong>Editable text fields</strong> for: Hero CTA, Paywall Title, Paywall Body, Empty Enquiries message, Confirmation message</li>
        <li>Changes are visual only (not connected to other pages in MVP)</li>
      </ul>
    </div>

    {/* ─── AUTH ─── */}
    <h2>15. Login & Signup <span className="badge navy">/login /signup</span></h2>
    <div className="page-section">
      <h3>Login Page</h3>
      <ul>
        <li>Email + password form</li>
        <li><strong>Quick-fill buttons</strong> — Parent, Therapist, Club, Education, Charity, Product, Admin</li>
        <li><strong>Enquiry redirect</strong> — if redirected from an enquiry page, shows "Log in to send your enquiry" banner</li>
        <li>Routes to correct dashboard based on role</li>
      </ul>
      <h3>Signup Page</h3>
      <ul>
        <li><strong>Tab selector</strong> — "I'm a Parent" / "I'm a Provider"</li>
        <li>Parent signup: Name, Email, Password</li>
        <li>Provider signup: Organisation Name, Email, Password + "Why Join Beyonder?" benefits</li>
        <li><strong>Claim flow</strong> — if arriving from "Claim this profile", pre-selects provider tab and links signup to that provider</li>
      </ul>
    </div>

    {/* ─── FOR PROVIDERS ─── */}
    <h2>16. For Providers <span className="badge navy">/for-providers</span></h2>
    <div className="page-section">
      <ul>
        <li><strong>Value proposition</strong> — "Grow Your Reach with Beyonder"</li>
        <li><strong>Founding Provider counter</strong> — shows remaining founding provider slots</li>
        <li><strong>Benefits list</strong> — 5 reasons to join</li>
        <li><strong>CTA</strong> — "Sign Up as a Provider" or "Create Account & Claim Profile" if coming from a claim</li>
        <li><strong>Claim banner</strong> — if redirected from a provider page claim, shows which listing they're claiming</li>
      </ul>
    </div>

    {/* ─── STATIC PAGES ─── */}
    <h2>17. Supporting Pages</h2>
    <div className="page-section">
      <h3>About Us <span className="badge navy">/about</span></h3>
      <ul><li>Company description and mission statement</li></ul>

      <h3>Help Centre <span className="badge navy">/help</span></h3>
      <ul>
        <li>FAQ accordion with 5 common questions</li>
        <li>Topics: finding services, pricing, provider vetting, bookmarking, getting listed</li>
      </ul>

      <h3>Guides & Understanding <span className="badge navy">/guides</span></h3>
      <ul><li>4 guide cards: EHCPs, Assessment Process, Choosing a Therapist, Sensory Processing</li></ul>

      <h3>News & Updates <span className="badge navy">/news</span></h3>
      <ul><li>3 news articles with dates and summaries</li></ul>

      <h3>Community <span className="badge navy">/community</span></h3>
      <ul><li>2 cards: Parent Forums (coming soon) and Local Events (coming soon)</li></ul>
    </div>

    {/* ─── TESTING TIPS ─── */}
    <h2>18. Testing Tips & Suggested Flows</h2>
    <div className="page-section">
      <h3>Flow 1: Parent Journey</h3>
      <ol style={{ fontSize: 14 }}>
        <li>Visit homepage → use search or click a category</li>
        <li>Browse the Provider Directory → apply filters → click a provider</li>
        <li>On the Provider Page → click "Send Enquiry"</li>
        <li>You'll be prompted to log in → use <code>test@parent.com</code></li>
        <li>Fill in the enquiry form → submit</li>
        <li>Go to Parent Dashboard → see your enquiry listed</li>
        <li>If a provider has replied → try "Unlock Reply" → go through the mock checkout</li>
        <li>Read the reply → send a follow-up message</li>
      </ol>

      <h3>Flow 2: Provider Journey</h3>
      <ol style={{ fontSize: 14 }}>
        <li>Log in as any provider (e.g. <code>therapist@beyonder.test</code>)</li>
        <li>View your dashboard → check enquiries, try replying</li>
        <li>Edit your profile → change description, needs, delivery format</li>
        <li>Change your availability status</li>
        <li>Try paid features (if on Founder plan): add certifications, upload gallery images, write spotlight message</li>
        <li>Log out → view your public profile to see changes reflected</li>
      </ol>

      <h3>Flow 3: Admin Journey</h3>
      <ol style={{ fontSize: 14 }}>
        <li>Log in as <code>admin@beyonder.com</code></li>
        <li>Go to Admin Panel → Providers tab → try suspending a provider</li>
        <li>Visit that provider's page to confirm it shows as unavailable</li>
        <li>Plans tab → change a provider from "free" to "founder" → save</li>
        <li>Log in as that provider → confirm paid features are now unlocked</li>
        <li>Try sending a change request to a provider</li>
        <li>Log in as that provider → see the change request banner → acknowledge it</li>
        <li>Back in admin → see "Changes Confirmed" badge → mark reviewed</li>
      </ol>

      <h3>Flow 4: Claim a Profile</h3>
      <ol style={{ fontSize: 14 }}>
        <li>Visit any provider page (not logged in)</li>
        <li>Click "Claim this profile"</li>
        <li>You'll be taken to the For Providers page → click "Create Account & Claim Profile"</li>
        <li>Sign up → you'll be redirected to the provider dashboard (pending review or approved)</li>
        <li>In admin → check Claim Requests tab → approve or reject</li>
      </ol>
    </div>

    <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid #ede6d8", fontSize: 12, color: "#8899aa", textAlign: "center" }}>
      Beyonder MVP — Tester's Guide — Generated {new Date().toLocaleDateString("en-GB")}
    </div>
  </div>
);

export default TestGuidePage;
