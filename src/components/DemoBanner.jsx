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
            This prototype demonstrates the new subscription and onboarding flows for Investment Officer.
            Below you'll find all scenarios you can walk through.
          </p>
          <button style={S.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div style={S.body}>

          {/* ── 1. Account types ── */}
          <div style={S.sectionTitleFirst}>1. Account types</div>
          <div style={S.card}>
            <div style={S.cardTitle}>Personal (gratis)</div>
            <div style={S.cardBody}>Individual account with access to a selection of articles, newsletters and profile management. Optionally upgradable to Pro.</div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Business NL</div>
            <div style={S.cardBody}>Business account for the Dutch edition. Shared environment with user management. Free for Wealth/Institutional segment, otherwise 6-month free trial.</div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Business International</div>
            <div style={S.cardBody}>Business account with access to all editions (NL, BE, DE, FR, LU, COM). Package choice S/M/L/XL. 50% discount for Wealth/Institutional segment.</div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Enterprise</div>
            <div style={S.cardBody}>Free access at organisation level, managed by Investment Officer. Two variants: Enterprise NL (1 edition) and Enterprise All (all editions). No payment, no subscription choice.</div>
          </div>

          <hr style={S.divider} />

          {/* ── 2. Use cases ── */}
          <div style={S.sectionTitle}>2. Use cases to test</div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟢 Enterprise — domain-based (ABN AMRO)</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>anything@abnamro.com</span><br/>
              <strong>Via Login:</strong> email → SSO screen (Google / Microsoft / password) → logged in<br/>
              <strong>Via Registration (Personal):</strong> email → enterprise detection → create profile → done<br/>
              <strong>Via Registration (Business):</strong> email → "Continue as Enterprise" → profile → done<br/>
              <span style={S.step}>2 steps</span> profile → done
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟢 Enterprise — whitelist NL (WealthPro)</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>new@wealthpro.com</span><br/>
              <strong>Via Login:</strong> email → "Enterprise access available" + "Dutch edition" → create profile<br/>
              <strong>Via Registration:</strong> email → whitelist detection → profile → done<br/>
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
            <div style={S.cardTitle}>🔵 Personal — standard</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>new@aegon.com</span> or any new business email address<br/>
              <strong>Registration:</strong> email → profile → plan choice (Free / Pro / Trial) → done<br/>
              <span style={S.step}>4 steps</span> email → profile → plan → done<br/>
              <span style={{ display:"inline-block", marginTop:"0.375rem", background:"#F0F0FF", border:"1px dashed #7B7BEE", borderRadius:4, padding:"0.15rem 0.5rem", fontSize:"0.75rem", color:"#4A4AB5" }}>CDP: Personal Free / Trial / Pro — .NL</span>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🔵 Business NL — standard</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>new@aegon.com</span> via "Team / Organisation" → Business NL<br/>
              <strong>Registration:</strong> email → profile → segment → type → company details → overview → invite colleagues → done<br/>
              <span style={S.step}>8 steps</span><br/>
              <span style={{ display:"inline-block", marginTop:"0.375rem", background:"#F0F0FF", border:"1px dashed #7B7BEE", borderRadius:4, padding:"0.15rem 0.5rem", fontSize:"0.75rem", color:"#4A4AB5" }}>CDP: Business Buy Side — .NL (Wealth/Institutional) or Business Sell Side — .NL (other)</span>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🔵 Business International — standard</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>new@aegon.com</span> via "Team / Organisation" → Business International<br/>
              <strong>Registration:</strong> email → profile → segment → type → package choice → company → overview → payment → invite → done<br/>
              <span style={S.step}>10 steps</span><br/>
              <span style={{ display:"inline-block", marginTop:"0.375rem", background:"#F0F0FF", border:"1px dashed #7B7BEE", borderRadius:4, padding:"0.15rem 0.5rem", fontSize:"0.75rem", color:"#4A4AB5" }}>CDP: Business International S/M/L/XL — All editions</span>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟡 Existing account — Business admin</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>demo@aegon.com</span><br/>
              <strong>Via Login:</strong> email → password → logged in as Business admin<br/>
              <strong>Via Registration:</strong> email → "You already have an account" warning<br/>
              <strong>After login:</strong> Go to Account to manage users, company details, subscriptions, newsletters and billing/invoices.
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟡 Private email</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>new@gmail.com</span><br/>
              Warning "this is a private email address" with option to continue anyway.
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟡 Generic address</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>info@company.com</span><br/>
              Blocked: "Please use a personal email address."
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟡 Trial block (Business)</div>
            <div style={S.cardBody}>
              Use: <span style={S.email}>trial@company.com</span> in Business NL flow<br/>
              Email → 2-year block notification → choice of paid packages S/M/L/XL.<br/>
              <span style={{ display:"inline-block", marginTop:"0.375rem", background:"#F0F0FF", border:"1px dashed #7B7BEE", borderRadius:4, padding:"0.15rem 0.5rem", fontSize:"0.75rem", color:"#4A4AB5" }}>CDP: Business Sell Side Paid S/M/L/XL — .NL</span>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>🟣 Invited user</div>
            <div style={S.cardBody}>
              <strong>Option A:</strong> Deep link <span style={S.email}>#invited</span> (simulates colleague@aegon.com)<br/>
              <strong>Option B:</strong> Go to Account → Users → invite someone → click "Open as…"<br/>
              Flow: create profile (email pre-filled, "invited" banner) → done<br/>
              <span style={S.step}>2 steps</span> profile → done
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 3. Pricing rules ── */}
          <div style={S.sectionTitle}>3. Pricing logic</div>
          <div style={S.card}>
            <div style={S.cardBody}>
              <strong>Business Buy Side:</strong> Wealth/Institutional segment → free 24-month access.<br/>
              <strong>Business Sell Side:</strong> Other segments → 6-month free trial.<br/>
              <strong>Business Sell Side Paid:</strong> After trial block → paid packages S/M/L/XL.<br/>
              <strong>Business International:</strong> Wealth/Institutional → 50% discount on all packages. Other segments → standard rate.<br/>
              <strong>Enterprise:</strong> Always free. Edition(s) determined by back-end configuration.
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 4. Navigation tips ── */}
          <div style={S.sectionTitle}>4. Navigation</div>
          <div style={S.card}>
            <div style={S.cardBody}>
              Use the <strong>deep links</strong> in the test panel to jump to specific screens.
              Switch language via the language button in the top right (NL / EN / DE / FR).
              After registration you can choose <strong>"Start introduction"</strong> (onboarding) or <strong>"Go directly to the website"</strong> (skip).
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
              <span style={S.step}>4</span> All set — feature overview + "Go to Investment Officer" button
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 6. CDP Product matrix ── */}
          <div style={S.sectionTitle}>6. CDP Product matrix (58 products)</div>
          <div style={S.card}>
            <div style={S.cardBody}>
              Each registration results in a specific CDP product. The edition is determined by the website domain (.nl, .be, .lu, .de, .fr, .com). Below is the complete product catalogue.
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
                  ["Personal Pro", "€648/yr (€54/mo)", "NL, BE, LU, DE, FR, COM", "1"],
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
              <strong>Total: 58 products</strong> = 18 Personal (3×6) + 36 Business NL (6×6) + 4 Business International
            </div>
          </div>

          <hr style={S.divider} />

          {/* ── 7. Account management ── */}
          <div style={S.sectionTitle}>7. Account management</div>
          <div style={S.card}>
            <div style={S.cardBody}>
              After login or registration, click the avatar (top right) → "My account" to access:<br/>
              <strong>My account</strong> — edit profile details<br/>
              <strong>Newsletters</strong> — manage per edition (NL, BE, LU tabs)<br/>
              <strong>Subscriptions</strong> — view plan details and upgrade options<br/>
              <strong>Users</strong> (Business/Enterprise) — invite colleagues, change roles, remove users<br/>
              <strong>Billing</strong> (Business) — payment method (Stripe) + downloadable invoices<br/><br/>
              Test with <span style={S.email}>demo@aegon.com</span> (login) to see the full Business admin view.
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
    { label: "Personal plans",    hash: "#plans" },
    { label: "Business plans",    hash: "#bizplans" },
    { label: "Personal reg.",     hash: "#personal" },
    { label: "Business reg.",     hash: "#business" },
    { label: "Business Intl.",    hash: "#bizintl" },
    { label: "Enterprise",        hash: "#enterprise" },
    { label: "Subscriptions",     hash: "#subscriptions" },
    { label: "Onboarding",        hash: "#onboarding" },
    { label: "Account",           hash: "#account" },
    { label: "Invited user",      hash: "#invited" },
  ]

  /* ── Test accounts ── */
  const accounts = [
    { email: "demo@aegon.com",      scenarios: "Login → password → logged in as Business admin (Account = user mgmt, billing, invoices)" },
    { email: "new@aegon.com",       scenarios: "Register → normal flow (known domain, no special treatment)" },
    { email: "Any @abnamro.com",    scenarios: "Login → SSO/Enterprise · Register → Enterprise detected → profile only" },
    { email: "new@wealthpro.com",   scenarios: "Login / Register → Enterprise NL (1 editie, gratis)" },
    { email: "new@globalfund.com",  scenarios: "Login / Register → Enterprise All (alle edities, gratis)" },
    { email: "new@gmail.com",       scenarios: "Login → private email warning · Register → private email warning" },
    { email: "info@company.com",    scenarios: "Register → generic address rejected" },
    { email: "user@unknown.com",    scenarios: "Login → no account found" },
    { email: "trial@company.com",   scenarios: "Business reg. → 2-year block → paid plans" },
    { email: "colleague@aegon.com", scenarios: "Invited user → profile-only registration (use deep link or invite from Account)" },
  ]

  /* ── Business rules ── */
  const rules = [
    { rule: "Wealth / Institutional segment", effect: "Business NL → free ongoing access · Business Intl. → 50% discount" },
    { rule: "Other segments",                 effect: "Business NL → 6 months free · Business Intl. → standard rate" },
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
                {deepLinks.map((dl) => (
                  <a key={dl.hash} href={dl.hash} style={pillStyle}
                     onMouseEnter={e => { e.target.style.background="rgba(255,255,255,0.2)" }}
                     onMouseLeave={e => { e.target.style.background="rgba(255,255,255,0.1)" }}>
                    {dl.label}
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
              Stripe payment screens are simulations. Passwords are not validated. All data is fictional.
            </div>
          </div>
        )}
      </div>

      {/* ── POC Guide overlay ── */}
      {guideOpen && <PocGuide onClose={() => setGuideOpen(false)} />}
    </>
  )
}
