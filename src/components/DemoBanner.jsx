import { useState } from 'react'
import { C } from '../tokens.js'

/* ════════════════════════════════════════════════════════════════════════
   POC Guide – overlay content
   ════════════════════════════════════════════════════════════════════════ */
function PocGuide({ onClose }) {
  const S = {
    overlay: {
      position:"fixed", inset:0, zIndex:99999,
      background:"rgba(10,20,40,0.7)", backdropFilter:"blur(4px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"2rem",
    },
    modal: {
      background:C.white, borderRadius:16, maxWidth:820, width:"100%",
      maxHeight:"88vh", overflowY:"auto", position:"relative",
      boxShadow:"0 24px 80px rgba(0,0,0,0.25)",
    },
    header: {
      position:"sticky", top:0, background:C.navy, color:C.white,
      padding:"1.75rem 2.25rem 1.5rem", borderRadius:"16px 16px 0 0",
      zIndex:1,
    },
    body: { padding:"2rem 2.25rem 2.5rem" },
    h1: {
      fontFamily:"var(--font-serif)", fontSize:"1.5rem", fontWeight:700,
      color:C.white, margin:0, lineHeight:1.3,
    },
    subtitle: {
      fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:"rgba(255,255,255,0.65)",
      marginTop:"0.5rem", lineHeight:1.6,
    },
    closeBtn: {
      position:"absolute", top:"1.25rem", right:"1.25rem",
      background:"rgba(255,255,255,0.1)", border:"none", borderRadius:8,
      width:36, height:36, cursor:"pointer", display:"flex",
      alignItems:"center", justifyContent:"center", color:C.white,
    },
    sectionTitle: {
      fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700,
      letterSpacing:"0.08em", textTransform:"uppercase", color:C.green,
      marginBottom:"0.625rem", marginTop:"1.75rem",
    },
    sectionTitleFirst: {
      fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700,
      letterSpacing:"0.08em", textTransform:"uppercase", color:C.green,
      marginBottom:"0.625rem", marginTop:0,
    },
    card: {
      background:C.gray50, borderRadius:10, padding:"1rem 1.25rem",
      marginBottom:"0.625rem", border:`1px solid ${C.gray200}`,
    },
    cardTitle: {
      fontFamily:"var(--font-sans)", fontSize:"0.875rem", fontWeight:700,
      color:C.navy, marginBottom:"0.25rem",
    },
    cardBody: {
      fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500,
      lineHeight:1.65,
    },
    email: {
      fontFamily:"monospace", fontSize:"0.75rem", background:"rgba(78,213,150,0.12)",
      padding:"0.1rem 0.4rem", borderRadius:3, color:C.navy, whiteSpace:"nowrap",
    },
    step: {
      display:"inline-block", fontFamily:"var(--font-sans)", fontSize:"0.7rem",
      background:C.navy, color:C.white, padding:"0.1rem 0.45rem",
      borderRadius:3, marginRight:"0.25rem", fontWeight:600,
    },
    divider: {
      border:"none", borderTop:`1px solid ${C.gray200}`,
      margin:"1.5rem 0",
    },
    note: {
      fontFamily:"var(--font-sans)", fontSize:"0.75rem", color:C.gray500,
      lineHeight:1.6, fontStyle:"italic",
    },
  }

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div style={S.header}>
          <h1 style={S.h1}>Investment Officer — POC Guide</h1>
          <p style={S.subtitle}>
            This prototype demonstrates the email-first, profile-first subscription and onboarding flows for Investment Officer.
            Below you'll find the flow architecture, all test scenarios, the complete product catalogue, and account management features.
          </p>
          <button style={S.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div style={S.body}>

          {/* ── 0. Flow architecture ── */}
          <div style={S.sectionTitleFirst}>0. Flow architecture — Email-first, Profile-first</div>
          <div style={S.card}>
            <div style={S.cardTitle}>Email as universal entry point</div>
            <div style={S.cardBody}>
              All registration flows start with a single email input screen (<strong>EmailGate</strong>). The email address is classified automatically and routes the user to the correct flow. There is no manual account type choice upfront.<br/><br/>
              <strong>Routing logic (order of checks):</strong><br/>
              • Generic prefix (info@, team@, admin@…) → Blocked<br/>
              • Private domain (@gmail.com, @hotmail.com…) → Warning → Profile → Personal only<br/>
              • Enterprise domain (e.g. @abnamro.com) → Enterprise profile creation<br/>
              • Whitelist domain (e.g. @wealthpro.com) → Enterprise fast-track<br/>
              • Existing account → "You already have an account" + login<br/>
              • Trial-blocked domain → Profile → Paid Business flow (skip intent)<br/>
              • New business email → <strong>Profile → Intent question</strong>
            </div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Profile-first principle</div>
            <div style={S.cardBody}>
              After EmailGate, the user always creates a profile <strong>before</strong> being asked any commercial questions (intent, plan choice, etc.). This ensures a complete profile record (name, job role, email) is captured even if the user drops off during later steps.<br/><br/>
              The <strong>ProfileIntent</strong> component handles this: Step 1 = profile form, Step 2 = intent question (business emails only). Private and trial-blocked emails skip the intent step automatically.
            </div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Intent question (key conversion moment)</div>
            <div style={S.cardBody}>
              For new business emails (after profile creation), users see an asymmetric choice:<br/>
              <strong>Option A (primary, recommended):</strong> "Activate a business plan" — with three value props: free for Wealth &amp; Institutional, 6 months free for others, shared user management.<br/>
              <strong>Option B (secondary):</strong> "Just for myself" — individual account.<br/>
              This is designed to maximise business registrations while keeping Personal accessible.
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 1. Account types ── */}
          <div style={S.sectionTitle}>1. Account types</div>
          <div style={S.card}>
            <div style={S.cardTitle}>Personal</div>
            <div style={S.cardBody}>Individual account. Three tiers: <strong>Free</strong> (limited access), <strong>Premium Trial</strong> (10-day free trial, full access), <strong>Premium</strong> (€648/yr, full access to one edition). Upgradable to Premium All Editions (€774/yr) from the Account page.</div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Business NL</div>
            <div style={S.cardBody}>Business account for one edition. Shared environment with user management. Free for Wealth/Institutional segment (24 months), 6-month free trial for other segments. After trial or when trial-blocked: paid packages S/M/L/XL available.</div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Business International</div>
            <div style={S.cardBody}>Business account with access to all editions (NL, BE, DE, FR, LU, COM). Package choice S/M/L/XL. 50% discount for Wealth/Institutional. Only shown when user indicates multi-country presence within Business flow (international question).</div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Enterprise</div>
            <div style={S.cardBody}>
              Free access at organisation level, managed by Investment Officer. Two variants: Enterprise NL (1 edition) and Enterprise All (all editions). No payment, no subscription choice.<br/><br/>
              <strong>Access methods:</strong><br/>
              • <strong>Domain whitelist</strong> — employees register with their work email; access granted automatically<br/>
              • <strong>SSO</strong> — Google Workspace or Microsoft Entra ID; optional password-login toggle<br/><br/>
              <strong>Registration flow:</strong> The enterprise customer submits a request via the Enterprise request form (accordion, single page). IO configures the backend. The customer then manages their setup in Account → Enterprise access.<br/><br/>
              <strong>Account management:</strong> Licence counter, SSO credentials (Client ID, Tenant ID, Secret with show/hide), domain list, secret expiry warnings at 30 and 7 days, and a requests panel (add domain, request more licences, other changes).
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 2. Use cases ── */}
          <div style={S.sectionTitle}>2. Use cases to test</div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟢 Enterprise — SSO existing user (ABN AMRO)</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>demo@abnamro.com</span><br/>
              <strong>Via Login:</strong> email → SSO screen → click Google/Microsoft → logged in directly<br/>
              <span style={S.step}>2 steps</span> email → SSO → done<br/>
              <em>Note: existing SSO user with a known IO profile. No profile creation needed.</em>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟢 Enterprise — SSO first-time user (ABN AMRO)</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>new@abnamro.com</span> (or any @abnamro.com except demo@)<br/>
              <strong>Via Login:</strong> email → SSO screen → click Google/Microsoft → "Welcome" screen with Enterprise access info + profile form (first name, last name, job role — no password) → account activated<br/>
              <span style={S.step}>3 steps</span> email → SSO → profile → done<br/>
              <em>Note: simulates a new employee whose organisation already has SSO. Backend detects no IO profile after OAuth and shows a short onboarding.</em>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟢 Enterprise — domain-based registration (ABN AMRO)</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>anything@abnamro.com</span><br/>
              <strong>Via EmailGate:</strong> email → enterprise detection → profile → done<br/>
              <span style={S.step}>2 steps</span> profile → done<br/>
              <em>Note: registration flow (not login). User creates a full profile with password.</em>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟢 Enterprise — whitelist NL (WealthPro)</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>new@wealthpro.com</span><br/>
              <strong>Via EmailGate:</strong> email → whitelist detection → profile → done<br/>
              <strong>Via Login:</strong> email → "Enterprise access available" + "Dutch edition" → create profile<br/>
              Sidebar shows "Enterprise — NL"<br/>
              <span style={S.step}>2 steps</span> profile → done
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟢 Enterprise — whitelist All (GlobalFund)</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>new@globalfund.com</span><br/>
              Same flow as WealthPro, but with access to all editions.<br/>
              Sidebar shows "Enterprise — All editions"
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟢 Enterprise — request form (new organisation)</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>new@robeco.com</span> or any new business email routed to Enterprise<br/>
              <strong>Via EmailGate:</strong> email → profile → intent → "Activate business plan" → Business flow → <em>Enterprise option selected</em> → Enterprise request form<br/>
              <strong>Or direct:</strong> deep link <code>#enterpriseReg</code><br/><br/>
              The form is a single-page accordion with 4 sections (conditionally 3 if segment already known):<br/>
              <span style={S.step}>1</span> Organisation (D&amp;B lookup — name search or registration number — or manual)<br/>
              <span style={S.step}>2</span> Segment + type (skipped if already known from upstream)<br/>
              <span style={S.step}>3</span> Edition (NL or International — direct select, no confirm button)<br/>
              <span style={S.step}>4</span> Access method — "Via work email address" (optional domain field), "SSO", or "Not sure yet"<br/><br/>
              Personal details (name, job role, email, optional phone) shown as non-editable card above accordion.<br/>
              Terms &amp; Conditions checkbox collapses section 4. Submit button appears below accordion.<br/>
              Each completed section shows a summary + Edit link (edit reopens only that section, others stay intact).<br/>
              <em>After submit: IO configures backend, customer receives email with link to Account → Enterprise access.</em>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟢 Enterprise — access management (Account page)</div>
            <div style={S.cardBody}>
              Accessible via Account → "Enterprise access" (shield icon, red label in sidebar).<br/>
              Use deep link: <code>#account-enterprise</code><br/><br/>
              <strong>SSO variant</strong> (default demo — Microsoft Entra ID):<br/>
              • Provider + credentials: Client ID, Tenant ID, Client Secret (show/hide toggle)<br/>
              • Redirect URI shown for IT department<br/>
              • Secret expiry warning: orange at 30 days, red at 7 days — inline "Renew secret" button opens modal<br/>
              • Toggle: allow/block password login alongside SSO<br/><br/>
              <strong>Domain variant</strong> (change <code>DEMO_CONFIG</code> in EnterpriseAccessPage.jsx to <code>DEMO_DOMAIN</code>):<br/>
              • Active domain list with status badges<br/>
              • Request new domain button → modal<br/><br/>
              <strong>Both variants:</strong><br/>
              • Licence bar: used / total with colour progression (green → amber → red)<br/>
              • Requests panel: add domain, more licences, other change — submitted requests show as "Pending"
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🔵 New business email → Business (recommended path)</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>new@aegon.com</span> or any new business email<br/>
              <strong>EmailGate → ProfileIntent:</strong> email → profile (name, job role, password) → intent question → choose "Activate business plan"<br/>
              <strong>Business flow:</strong> segment+type → international question → company details → overview → invite colleagues → done<br/>
              <span style={S.step}>8 steps</span> email → profile → intent → segment/type → intl question → company → overview → invite → done<br/>
              <span style={{ display:"inline-block", marginTop:"0.375rem", background:"#F0F0FF", border:"1px dashed #7B7BEE", borderRadius:4, padding:"0.15rem 0.5rem", fontSize:"0.75rem", color:"#4A4AB5" }}>CDP: Business Buy Side — .NL (Wealth/Institutional) or Business Sell Side — .NL (other)</span>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🔵 New business email → Personal</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>new@aegon.com</span> or any new business email<br/>
              <strong>EmailGate → ProfileIntent:</strong> email → profile → intent question → choose "Just for myself"<br/>
              <strong>Personal flow:</strong> plan choice (Free / Premium Trial / Premium) → done (Premium adds payment step)<br/>
              <span style={S.step}>5 steps</span> email → profile → intent → plan → done<br/>
              <span style={{ display:"inline-block", marginTop:"0.375rem", background:"#F0F0FF", border:"1px dashed #7B7BEE", borderRadius:4, padding:"0.15rem 0.5rem", fontSize:"0.75rem", color:"#4A4AB5" }}>CDP: Personal Free / Trial / Premium — .NL</span>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🔵 Business International</div>
            <div style={S.cardBody}>
              Triggered when a Business user answers "Yes" to the international question within the Business flow. User is routed to the ProductPicker for a side-by-side comparison of Business NL vs International, then continues in the International flow.<br/>
              <strong>Full path:</strong> email → profile → intent → segment/type → intl question "Yes" → ProductPicker → package (S/M/L/XL) → company → overview → payment → invite → done<br/>
              <span style={S.step}>9 steps</span> (from International flow entry, profile + segment/type are carried over)<br/>
              <span style={{ display:"inline-block", marginTop:"0.375rem", background:"#F0F0FF", border:"1px dashed #7B7BEE", borderRadius:4, padding:"0.15rem 0.5rem", fontSize:"0.75rem", color:"#4A4AB5" }}>CDP: Business International S/M/L/XL — All editions</span>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟡 Private email</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>new@gmail.com</span><br/>
              <strong>Via EmailGate:</strong> Warning "this is a private email address" with option to use a different address or continue.<br/>
              <strong>If continue:</strong> profile creation → Personal flow directly (intent question is skipped, no Business option).<br/>
              <span style={S.step}>4 steps</span> email → warning → profile → plan → done
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟡 Generic address</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>info@company.com</span><br/>
              Blocked: "Please use a personal email address." Dead end — user must go back.
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟡 Existing account</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>demo@aegon.com</span><br/>
              <strong>Via EmailGate:</strong> email → "You already have an account" → log in or use different email<br/>
              <strong>Via Login:</strong> email → password → logged in as Business admin<br/>
              <strong>After login:</strong> Go to Account to manage users, company details, subscriptions, newsletters and billing/invoices.
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟡 Trial block (Business)</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>trial@company.com</span><br/>
              <strong>EmailGate:</strong> email → 24-month trial block notification<br/>
              <strong>If continue:</strong> profile creation (intent question is skipped) → paid Business flow starting at size picker (S/M/L/XL) → segment/type → company → overview → payment → invite → done<br/>
              <span style={S.step}>10 steps</span> (paid flow)<br/>
              <span style={{ display:"inline-block", marginTop:"0.375rem", background:"#F0F0FF", border:"1px dashed #7B7BEE", borderRadius:4, padding:"0.15rem 0.5rem", fontSize:"0.75rem", color:"#4A4AB5" }}>CDP: Business Sell Side Paid S/M/L/XL — .NL</span>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟡 Existing account + trial block (upgrade path)</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>demo@trial.com</span><br/>
              Login → Account → upgrade → trial block detected → paid Business flow (size picker → payment).<br/>
              Tests the upgrade-from-account path with trial restriction.
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟣 Invited user</div>
            <div style={S.cardBody}>
              <strong>Option A:</strong> Deep link <span style={S.email}>#invited</span> (simulates colleague@aegon.com)<br/>
              <strong>Option B:</strong> Go to Account → Users → invite someone → click "Open as…"<br/>
              Flow: create profile (email pre-filled, "invited by [Company]" banner) → done<br/>
              <span style={S.step}>2 steps</span> profile → done<br/>
              <em>Note: invited users bypass EmailGate and intent entirely.</em>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟠 Single-article unlock (Personal Free)</div>
            <div style={S.cardBody}>
              Entry: non-logged-in visitor on a premium article → clicks "Register for free" in paywall<br/>
              Flow: EmailGate → profile → plan choice (selects Free) → redirected back to article with 24-hour access<br/>
              Article shows yellow timer banner (24h countdown) + upsell banner with two upgrade options.<br/>
              <em>Note: skips onboarding. Only for Personal Free registrations from a premium article.</em>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟠 Freemium paywall (logged-in Free user)</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>demo@freemium.com</span> (login)<br/>
              <strong>Scenario:</strong> User is already logged in with a Free account but visits a premium article they don't have access to.<br/>
              <strong>Paywall:</strong> Contextual paywall that acknowledges the user is logged in ("Logged in as [email]") and shows that their free account doesn't include access. Two upgrade buttons: "Start 10-day free Premium" and "Access for my organisation".<br/>
              <em>Note: this replaces the generic paywall for logged-in freemium users. No "Log in" button is shown since the user is already authenticated.</em>
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 3. Pricing rules ── */}
          <div style={S.sectionTitle}>3. Pricing logic</div>
          <div style={S.card}>
            <div style={S.cardBody}>
              <strong>Personal Free:</strong> Free, limited access.<br/>
              <strong>Personal Premium Trial:</strong> 10 days free, full access to one edition. Cooldown: 12 months.<br/>
              <strong>Personal Premium:</strong> €648/yr (€54/mo), full access to one edition.<br/>
              <strong>Personal Premium All Editions:</strong> €774/yr (upgrade only, from Account page).<br/><br/>
              <strong>Business Buy Side:</strong> Wealth/Institutional segment → free 24-month access.<br/>
              <strong>Business Sell Side:</strong> Other segments → 6-month free trial. Cooldown: 24 months.<br/>
              <strong>Business Sell Side Paid:</strong> After trial or trial block → packages S (€79/mo) / M (€149/mo) / L (€199/mo) / XL (€12.50/user/mo).<br/><br/>
              <strong>Business International:</strong> Always paid. Wealth/Institutional → 50% discount. Standard: S (€119/mo) / M (€219/mo) / L (€289/mo) / XL (€18.50/user/mo).<br/><br/>
              <strong>Enterprise:</strong> Always free. Edition(s) determined by back-end configuration (domain/whitelist).
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 4. Navigation tips ── */}
          <div style={S.sectionTitle}>4. Navigation</div>
          <div style={S.card}>
            <div style={S.cardBody}>
              The primary registration entry is <strong>#emailgate</strong> — this is where "Activate access" and all registration CTAs lead.<br/>
              Use the <strong>deep links</strong> in the test panel to jump to specific screens directly.<br/>
              Switch language via the language button in the top right (NL / EN / DE / FR).<br/>
              After registration you can choose <strong>"Start introduction"</strong> (onboarding) or <strong>"Go directly to the website"</strong> (skip).<br/><br/>
              <em>Deep link <strong>#choice</strong> still works for the original account type choice screen (deprecated, kept as reference only).</em>
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 5. Onboarding ── */}
          <div style={S.sectionTitle}>5. Onboarding flow</div>
          <div style={S.card}>
            <div style={S.cardBody}>
              After completing registration, you see a confirmation page with two options: <strong>"Start introduction →"</strong> takes you through a 4-step onboarding, <strong>"Go directly to the website"</strong> skips it entirely.<br/><br/>
              The onboarding consists of 4 steps in a split-screen layout with navigation (back, next, skip to site):<br/>
              <span style={S.step}>1</span> Download the app — real QR code + App Store / Google Play badges<br/>
              <span style={S.step}>2</span> Newsletters — toggle subscriptions on/off<br/>
              <span style={S.step}>3</span> Follow on LinkedIn — simulated follow button<br/>
              <span style={S.step}>4</span> All set — feature overview + "Go to Investment Officer" button<br/><br/>
              <em>Note: single-article unlock registrations skip onboarding and return directly to the article.</em>
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 6. Job role selection ── */}
          <div style={S.sectionTitle}>6. Job role selection</div>
          <div style={S.card}>
            <div style={S.cardBody}>
              Job roles are organised in <strong>6 clusters</strong> using an accordion interface:<br/>
              <span style={S.step}>1</span> Senior Leadership (5 roles)<br/>
              <span style={S.step}>2</span> Investment Professionals (9 roles)<br/>
              <span style={S.step}>3</span> Client &amp; Commercial Roles (10 roles)<br/>
              <span style={S.step}>4</span> Risk, Legal &amp; Finance (7 roles)<br/>
              <span style={S.step}>5</span> Operations &amp; Technology (7 roles)<br/>
              <span style={S.step}>6</span> Consulting &amp; Other (4 roles)<br/><br/>
              Click a cluster to expand, select a role, and see a confirmation with a "Change" option. Single-select only. 42 roles total across all clusters. Available in NL / EN / DE / FR.
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 7. Segment + type selection ── */}
          <div style={S.sectionTitle}>7. Segment &amp; organisation type</div>
          <div style={S.card}>
            <div style={S.cardBody}>
              Business flows include a combined segment + organisation type selection step using the same accordion pattern as job roles. Segments and types are displayed in a two-level accordion:<br/><br/>
              <strong>Segments:</strong> Wealth Management, Institutional, Asset Management, Asset Servicing, Other Organisations<br/>
              Each segment contains its own list of organisation types.<br/><br/>
              The selected segment determines pricing: Wealth/Institutional = Buy Side (free or 50% discount). All others = Sell Side (trial or standard rate).<br/>
              <em>Note: Institutional is functionally identical to Wealth (same Buy Side mapping) but kept as a separate segment for CDP categorisation.</em>
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 8. CDP Product matrix ── */}
          <div style={S.sectionTitle}>8. CDP Product matrix (58 products)</div>
          <div style={S.card}>
            <div style={S.cardBody}>
              Each registration results in a specific CDP product. The edition is determined by the website domain (.nl, .be, .lu, .de, .fr, .com). Below is the complete product catalogue.<br/><br/>
              <em>Note: "Personal Premium All Editions" (€774/yr) is an Account-page upgrade product, not offered during registration. Enterprise products are managed by IO and do not appear as self-service CDP products.</em>
            </div>
          </div>

          {/* Personal products */}
          <div style={{ ...S.cardTitle, marginTop:"0.75rem", marginBottom:"0.375rem", fontSize:"0.8rem", letterSpacing:"0.06em", textTransform:"uppercase", color:C.gray500 }}>Personal — 18 products (3 × 6 editions)</div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"var(--font-sans)", fontSize:"0.8rem", marginBottom:"1rem" }}>
              <thead>
                <tr style={{ background:C.gray50 }}>
                  <th style={{ textAlign:"left", padding:"0.5rem 0.625rem", borderBottom:`1px solid ${C.gray200}`, fontWeight:700, color:C.navy }}>Product</th>
                  <th style={{ textAlign:"left", padding:"0.5rem 0.625rem", borderBottom:`1px solid ${C.gray200}`, fontWeight:700, color:C.navy }}>Pricing</th>
                  <th style={{ textAlign:"left", padding:"0.5rem 0.625rem", borderBottom:`1px solid ${C.gray200}`, fontWeight:700, color:C.navy }}>Editions</th>
                  <th style={{ textAlign:"left", padding:"0.5rem 0.625rem", borderBottom:`1px solid ${C.gray200}`, fontWeight:700, color:C.navy }}>Users</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Personal Free", "Free", "NL, BE, LU, DE, FR, COM", "1"],
                  ["Personal Trial", "10 days free", "NL, BE, LU, DE, FR, COM", "1"],
                  ["Personal Premium", "€648/yr (€54/mo)", "NL, BE, LU, DE, FR, COM", "1"],
                ].map(([name, price, eds, users], i) => (
                  <tr key={i} style={{ borderBottom:`1px solid ${C.gray100}` }}>
                    <td style={{ padding:"0.4rem 0.625rem", fontWeight:600, color:C.navy }}>{name}</td>
                    <td style={{ padding:"0.4rem 0.625rem", color:C.gray700 }}>{price}</td>
                    <td style={{ padding:"0.4rem 0.625rem", color:C.gray500, fontSize:"0.75rem" }}>{eds}</td>
                    <td style={{ padding:"0.4rem 0.625rem", color:C.gray500 }}>{users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Business NL products */}
          <div style={{ ...S.cardTitle, marginTop:"0.5rem", marginBottom:"0.375rem", fontSize:"0.8rem", letterSpacing:"0.06em", textTransform:"uppercase", color:C.gray500 }}>Business NL — 36 products (6 × 6 editions)</div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"var(--font-sans)", fontSize:"0.8rem", marginBottom:"1rem" }}>
              <thead>
                <tr style={{ background:C.gray50 }}>
                  <th style={{ textAlign:"left", padding:"0.5rem 0.625rem", borderBottom:`1px solid ${C.gray200}`, fontWeight:700, color:C.navy }}>Product</th>
                  <th style={{ textAlign:"left", padding:"0.5rem 0.625rem", borderBottom:`1px solid ${C.gray200}`, fontWeight:700, color:C.navy }}>Segment</th>
                  <th style={{ textAlign:"left", padding:"0.5rem 0.625rem", borderBottom:`1px solid ${C.gray200}`, fontWeight:700, color:C.navy }}>Pricing</th>
                  <th style={{ textAlign:"left", padding:"0.5rem 0.625rem", borderBottom:`1px solid ${C.gray200}`, fontWeight:700, color:C.navy }}>Editions</th>
                  <th style={{ textAlign:"left", padding:"0.5rem 0.625rem", borderBottom:`1px solid ${C.gray200}`, fontWeight:700, color:C.navy }}>Users</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Business Buy Side", "Wealth / Institutional", "Free 24 months", "× 6 editions", "Unlimited"],
                  ["Business Sell Side", "Other segments", "Free 6 months trial", "× 6 editions", "Unlimited"],
                  ["Business Sell Side Paid S", "After trial block", "€79/mo (€948/yr)", "× 6 editions", "2–5"],
                  ["Business Sell Side Paid M", "After trial block", "€149/mo (€1,788/yr)", "× 6 editions", "6–10"],
                  ["Business Sell Side Paid L", "After trial block", "€199/mo (€2,388/yr)", "× 6 editions", "11–15"],
                  ["Business Sell Side Paid XL", "After trial block", "From €12.50/mo per user", "× 6 editions", "16+"],
                ].map(([name, seg, price, eds, users], i) => (
                  <tr key={i} style={{ borderBottom:`1px solid ${C.gray100}` }}>
                    <td style={{ padding:"0.4rem 0.625rem", fontWeight:600, color:C.navy }}>{name}</td>
                    <td style={{ padding:"0.4rem 0.625rem", color:C.gray700, fontSize:"0.75rem" }}>{seg}</td>
                    <td style={{ padding:"0.4rem 0.625rem", color:C.gray700 }}>{price}</td>
                    <td style={{ padding:"0.4rem 0.625rem", color:C.gray500, fontSize:"0.75rem" }}>{eds}</td>
                    <td style={{ padding:"0.4rem 0.625rem", color:C.gray500 }}>{users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Business International products */}
          <div style={{ ...S.cardTitle, marginTop:"0.5rem", marginBottom:"0.375rem", fontSize:"0.8rem", letterSpacing:"0.06em", textTransform:"uppercase", color:C.gray500 }}>Business International — 4 products (all editions included)</div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"var(--font-sans)", fontSize:"0.8rem", marginBottom:"1rem" }}>
              <thead>
                <tr style={{ background:C.gray50 }}>
                  <th style={{ textAlign:"left", padding:"0.5rem 0.625rem", borderBottom:`1px solid ${C.gray200}`, fontWeight:700, color:C.navy }}>Product</th>
                  <th style={{ textAlign:"left", padding:"0.5rem 0.625rem", borderBottom:`1px solid ${C.gray200}`, fontWeight:700, color:C.navy }}>Pricing</th>
                  <th style={{ textAlign:"left", padding:"0.5rem 0.625rem", borderBottom:`1px solid ${C.gray200}`, fontWeight:700, color:C.navy }}>Editions</th>
                  <th style={{ textAlign:"left", padding:"0.5rem 0.625rem", borderBottom:`1px solid ${C.gray200}`, fontWeight:700, color:C.navy }}>Users</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Business International S", "€119/mo (€1,428/yr)", "All (NL,BE,LU,DE,FR,COM)", "2–5"],
                  ["Business International M", "€219/mo (€2,628/yr)", "All", "6–10"],
                  ["Business International L", "€289/mo (€3,468/yr)", "All", "11–15"],
                  ["Business International XL", "From €18.50/mo per user", "All", "16+"],
                ].map(([name, price, eds, users], i) => (
                  <tr key={i} style={{ borderBottom:`1px solid ${C.gray100}` }}>
                    <td style={{ padding:"0.4rem 0.625rem", fontWeight:600, color:C.navy }}>{name}</td>
                    <td style={{ padding:"0.4rem 0.625rem", color:C.gray700 }}>{price}</td>
                    <td style={{ padding:"0.4rem 0.625rem", color:C.gray500, fontSize:"0.75rem" }}>{eds}</td>
                    <td style={{ padding:"0.4rem 0.625rem", color:C.gray500 }}>{users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={S.card}>
            <div style={S.cardBody}>
              <strong>Note:</strong> Enterprise products are not self-service and are managed by Investment Officer via whitelist/domain configuration. They do not appear as CDP products.<br/><br/>
              <strong>Total: 58 products</strong> = 18 Personal (3×6) + 36 Business NL (6×6) + 4 Business International<br/>
              <em>+ 1 upgrade-only product: Personal Premium All Editions (not in registration flow)</em>
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 9. Account management ── */}
          <div style={S.sectionTitle}>9. Account management</div>
          <div style={S.card}>
            <div style={S.cardBody}>
              After login or registration, click the avatar (top right) → "My account" to access:<br/>
              <strong>My account</strong> — edit profile details (name, initials, job role, language, phone)<br/>
              <strong>Newsletters</strong> — manage per edition (NL, BE, LU tabs)<br/>
              <strong>Subscriptions</strong> — view plan details and upgrade options<br/>
              <strong>Users</strong> (Business/Enterprise) — invite colleagues, change roles, remove users. Personal shows upsell to Business.<br/>
              <strong>Billing</strong> (Business paid) — payment method (Stripe) + downloadable invoices<br/><br/>
              The Account page displays context-sensitive <strong>upsell banners</strong> based on plan type. Test the five banner scenarios via the deep links in the test panel (Biz Trial, Biz Free, Personal Trial, Personal Free, Personal Premium).<br/><br/>
              A static <strong>cross-sell banner</strong> (Impact Investor) appears at the top of the Account page.<br/><br/>
              Test with <span style={S.email}>demo@aegon.com</span> (login) to see the full Business admin view.
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 10. Article access levels ── */}
          <div style={S.sectionTitle}>10. Article access levels</div>
          <div style={S.card}>
            <div style={S.cardBody}>
              The article page (entry screen) has four access levels:<br/><br/>
              <strong>1. Full access</strong> — logged in with a paid/active plan → full article + green status bar<br/>
              <strong>2. Single-article access</strong> — Personal Free registered from this article → full article + yellow 24h timer banner + upsell banner (two upgrade buttons)<br/>
              <strong>3. Freemium paywall</strong> — logged in as Free user without article access → 2 paragraphs + fade overlay + contextual paywall ("You are logged in, your free account does not include access" + two upgrade buttons: Premium trial &amp; Business)<br/>
              <strong>4. Paywall</strong> — not logged in → 2 paragraphs + fade overlay + paywall card with "Log in" and "Activate access" buttons<br/><br/>
              Test with <span style={S.email}>demo@freemium.com</span> (login) to see the freemium paywall (level 3).
            </div>
          </div>

          <hr style={S.divider} />
          <p style={S.note}>
            This is a clickable prototype. Stripe payment screens are simulations. Passwords are not validated. All data is fictional.
          </p>
        </div>
      </div>
    </div>
  )
}


/* ════════════════════════════════════════════════════════════════════════
   DemoBanner — top bar with test panel + POC Guide button
   ════════════════════════════════════════════════════════════════════════ */
export default function DemoBanner() {
  const [open, setOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)

  /* ── Deep-link pills ── */
  const deepLinks = [
    { label: "Article",           hash: "#article" },
    { label: "Login",             hash: "#login" },
    { label: "Email gate",        hash: "#emailgate" },
    { label: "Profile+Intent",    hash: "#profileintent" },
    { label: "Personal plans",    hash: "#plans" },
    { label: "Business plans",    hash: "#bizplans" },
    { label: "Personal reg.",     hash: "#personal" },
    { label: "Business reg.",     hash: "#business" },
    { label: "Business Intl.",    hash: "#bizintl" },
    { label: "Enterprise",        hash: "#enterprise" },
    { label: "Whitelist reg.",    hash: "#whitelistReg" },
    { label: "Enterprise reg.",   hash: "#enterpriseReg" },
    { label: "Subscriptions",     hash: "#subscriptions" },
    { label: "Onboarding",        hash: "#onboarding" },
    { label: "Account",           hash: "#account" },
    { label: "Enterprise access", hash: "#account-enterprise" },
    { label: "Invited user",      hash: "#invited" },
    { label: "Choice (old)",      hash: "#choice" },
  ]

  /* ── Banner scenario links (Account page variants) ── */
  const bannerScenarios = [
    { label: "Biz Trial",        hash: "#account-biz-trial",   desc: "Business + 180d trial" },
    { label: "Biz Free",         hash: "#account-biz-free",    desc: "Business free (Wealth)" },
    { label: "Personal Trial",   hash: "#account-trial",       desc: "Personal 10d trial" },
    { label: "Personal Free",    hash: "#account-freemium",    desc: "Personal Free" },
    { label: "Personal Premium", hash: "#account-pro",         desc: "Personal Premium (paid)" },
    { label: "Enterprise SSO",   hash: "#account-enterprise",  desc: "Enterprise access management (SSO + domain)" },
  ]

  /* ── Test accounts ── */
  const accounts = [
    { email: "demo@aegon.com",      scenarios: "Login → password → Business admin (Account: users, billing, invoices)" },
    { email: "demo@freemium.com",   scenarios: "Login → password → Freemium user (Article: contextual paywall with upgrade options)" },
    { email: "new@aegon.com",       scenarios: "Register → profile → intent → Business or Personal" },
    { email: "demo@abnamro.com",    scenarios: "Login → SSO → direct login (existing user with IO profile)" },
    { email: "new@abnamro.com",     scenarios: "Login → SSO → first-time onboarding (name + job role, no password) → activated" },
    { email: "Any @abnamro.com",    scenarios: "Register → Enterprise domain → profile only" },
    { email: "new@wealthpro.com",   scenarios: "Login / Register → Enterprise NL (1 edition, free)" },
    { email: "new@globalfund.com",  scenarios: "Login / Register → Enterprise All (all editions, free)" },
    { email: "new@gmail.com",       scenarios: "Login → private warning · Register → warning → profile → Personal only (no intent)" },
    { email: "info@company.com",    scenarios: "Login / Register → generic address blocked" },
    { email: "user@unknown.com",    scenarios: "Login → no account found · Register → profile → intent → Business or Personal" },
    { email: "trial@company.com",   scenarios: "Register → 24-month block → profile → paid Business (S/M/L/XL)" },
    { email: "demo@trial.com",      scenarios: "Login → Account → upgrade → trial block → paid Business" },
    { email: "colleague@aegon.com", scenarios: "Invited user → profile only (use #invited or invite from Account)" },
  ]

  /* ── Business rules ── */
  const rules = [
    { rule: "Wealth / Institutional segment", effect: "Business NL → free 24 months · Business Intl. → 50% discount" },
    { rule: "Other segments",                 effect: "Business NL → 6 months free trial · Business Intl. → standard rate" },
    { rule: "After trial block",              effect: "Paid packages S/M/L/XL (see POC Guide for prices)" },
    { rule: "Trial cooldown",                 effect: "Personal: 12 months · Business: 24 months" },
  ]

  const pillStyle = {
    display:"inline-block", padding:"0.2rem 0.5rem", borderRadius:4,
    background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.85)",
    fontSize:"0.65rem", cursor:"pointer", textDecoration:"none",
    border:"1px solid rgba(255,255,255,0.12)", transition:"all 0.15s",
    whiteSpace:"nowrap",
  }

  const guideBtnStyle = {
    ...pillStyle,
    background:"rgba(78,213,150,0.15)", border:`1px solid ${C.green}`,
    color:C.green, fontWeight:700, fontSize:"0.65rem",
    padding:"0.25rem 0.75rem", cursor:"pointer",
  }

  return (
    <>
      <div style={{
        position:"relative", top:0, left:0, right:0, zIndex:9999,
        background:C.navy, color:"rgba(255,255,255,0.9)",
        fontFamily:"var(--font-sans)", fontSize:"0.75rem",
      }}>
        {/* Toggle bar */}
        <div style={{
          width:"100%", display:"flex", alignItems:"center", justifyContent:"center",
          gap:"0.5rem", padding:"0.4rem 1rem",
        }}>
          <button onClick={() => setOpen(o => !o)} style={{
            display:"flex", alignItems:"center", gap:"0.5rem",
            background:"none", border:"none",
            color:"rgba(255,255,255,0.7)", cursor:"pointer", fontFamily:"var(--font-sans)",
            fontSize:"0.7rem", letterSpacing:"0.06em", textTransform:"uppercase",
          }}>
            <span style={{ background:"rgba(255,255,255,0.15)", padding:"0.15rem 0.5rem", borderRadius:4, fontWeight:700, color:C.green }}>
              POC
            </span>
            {open ? "Hide test panel" : "Show test panel"}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition:"transform 0.2s" }}>
              <path d="M3 5l3 3 3-3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button style={guideBtnStyle} onClick={() => setGuideOpen(true)}
            onMouseEnter={e => { e.target.style.background="rgba(78,213,150,0.25)" }}
            onMouseLeave={e => { e.target.style.background="rgba(78,213,150,0.15)" }}>
            📖 POC Guide
          </button>
        </div>

        {/* Collapsible content */}
        {open && (
          <div style={{
            maxHeight:"70vh", overflowY:"auto",
            padding:"0.5rem 2rem 1.25rem",
            borderTop:"1px solid rgba(255,255,255,0.1)",
          }}>

            {/* ── Deep-link pills ── */}
            <div style={{ marginBottom:"1rem" }}>
              <div style={{ fontWeight:700, fontSize:"0.65rem", letterSpacing:"0.06em", textTransform:"uppercase", color:C.green, marginBottom:"0.4rem" }}>
                Jump to screen
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem" }}>
                {deepLinks.map((dl) => {
                  const isDeprecated = dl.hash === "#choice"
                  const isEnterprise = dl.hash === "#whitelistReg" || dl.hash === "#enterpriseReg"
                  const style = isDeprecated
                    ? { ...pillStyle, opacity:0.45, textDecoration:"line-through" }
                    : isEnterprise
                    ? { ...pillStyle, border:"1px solid rgba(78,213,150,0.3)", background:"rgba(78,213,150,0.1)" }
                    : pillStyle
                  const hoverBg = isEnterprise ? "rgba(78,213,150,0.2)" : "rgba(255,255,255,0.2)"
                  const leaveBg = isEnterprise ? "rgba(78,213,150,0.1)" : "rgba(255,255,255,0.1)"
                  return (
                    <a key={dl.hash} href={dl.hash} style={style}
                       onMouseEnter={e => { if (!isDeprecated) e.target.style.background=hoverBg }}
                       onMouseLeave={e => { if (!isDeprecated) e.target.style.background=leaveBg }}>
                      {dl.label}
                    </a>
                  )
                })}
              </div>
            </div>

            {/* ── Banner scenario pills ── */}
            <div style={{ marginBottom:"1rem" }}>
              <div style={{ fontWeight:700, fontSize:"0.65rem", letterSpacing:"0.06em", textTransform:"uppercase", color:"#F59E0B", marginBottom:"0.4rem" }}>
                🎯 Upsell banner scenarios (Account page)
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem" }}>
                {bannerScenarios.map((bs) => (
                  <a key={bs.hash} href={bs.hash} style={{...pillStyle, border:"1px solid rgba(245,158,11,0.3)", background:"rgba(245,158,11,0.1)"}}
                     onMouseEnter={e => { e.target.style.background="rgba(245,158,11,0.2)" }}
                     onMouseLeave={e => { e.target.style.background="rgba(245,158,11,0.1)" }}
                     title={bs.desc}>
                    {bs.label}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Two-column: accounts + rules ── */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem 2rem" }}>

              {/* Test accounts */}
              <div>
                <div style={{ fontWeight:700, fontSize:"0.65rem", letterSpacing:"0.06em", textTransform:"uppercase", color:C.green, marginBottom:"0.4rem" }}>
                  Test e-mail accounts
                </div>
                {accounts.map((a, i) => (
                  <div key={i} style={{ marginBottom:"0.35rem", lineHeight:1.5 }}>
                    <code style={{ background:"rgba(255,255,255,0.1)", padding:"0.1rem 0.375rem", borderRadius:3, fontSize:"0.7rem", whiteSpace:"nowrap" }}>
                      {a.email}
                    </code>
                    <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.65rem", marginLeft:"0.4rem" }}>
                      {a.scenarios}
                    </span>
                  </div>
                ))}
              </div>

              {/* Business rules + language */}
              <div>
                <div style={{ fontWeight:700, fontSize:"0.65rem", letterSpacing:"0.06em", textTransform:"uppercase", color:C.green, marginBottom:"0.4rem" }}>
                  Segment pricing rules
                </div>
                {rules.map((r, i) => (
                  <div key={i} style={{ marginBottom:"0.35rem", lineHeight:1.5 }}>
                    <code style={{ background:"rgba(255,255,255,0.1)", padding:"0.1rem 0.375rem", borderRadius:3, fontSize:"0.7rem", whiteSpace:"nowrap" }}>
                      {r.rule}
                    </code>
                    <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.65rem", marginLeft:"0.4rem" }}>
                      {r.effect}
                    </span>
                  </div>
                ))}

                <div style={{ marginTop:"0.75rem", fontWeight:700, fontSize:"0.65rem", letterSpacing:"0.06em", textTransform:"uppercase", color:C.green, marginBottom:"0.4rem" }}>
                  Language
                </div>
                <div style={{ display:"flex", gap:"0.3rem" }}>
                  {["en","nl","de","fr"].map(code => (
                    <a key={code} href={`#lang=${code}`} style={pillStyle}
                       onMouseEnter={e => { e.target.style.background="rgba(255,255,255,0.2)" }}
                       onMouseLeave={e => { e.target.style.background="rgba(255,255,255,0.1)" }}>
                      {code.toUpperCase()}
                    </a>
                  ))}
                </div>
              </div>

            </div>

            <div style={{ marginTop:"0.75rem", paddingTop:"0.625rem", borderTop:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)", fontSize:"0.65rem" }}>
              Stripe payment screens are simulations. Passwords are not validated. All data is fictional. KvK numbers starting with "99" trigger data degradation. Enterprise access page: switch between SSO and domain variant via DEMO_CONFIG in EnterpriseAccessPage.jsx.
            </div>
          </div>
        )}
      </div>

      {/* ── POC Guide overlay ── */}
      {guideOpen && <PocGuide onClose={() => setGuideOpen(false)} />}
    </>
  )
}
