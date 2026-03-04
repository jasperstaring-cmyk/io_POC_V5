import { useState } from 'react'
import { C } from '../tokens.js'
import { useLang } from '../LanguageContext.jsx'

// ─── EnterpriseAccessPage ─────────────────────────────────────────────────────
// Klant-beheerpagina voor enterprise toegangsconfiguratie.
// Toont twee varianten afhankelijk van configuratietype:
//   - "domain"  : e-maildomein whitelist
//   - "sso"     : SSO via Google of Microsoft
//
// Props:
//   config — object met enterprise-configuratie (zie DEMO_CONFIG hieronder)
//   onBack — navigatie terug (alleen in POC)
//
// In productie komt config uit de Laravel API. In de POC gebruiken we DEMO_CONFIG.

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO_SSO = {
  type: "sso",
  provider: "microsoft",           // "google" | "microsoft"
  orgName: "Robeco Institutional Asset Management B.V.",
  edition: "international",
  clientId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  tenantId: "9f8e7d6c-b5a4-3210-fedc-ba9876543210",
  clientSecret: "••••••••••••••••••••••••",
  secretExpiresAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 dagen
  allowPasswordLogin: true,
  licenseUsed: 38,
  licenseTotal: 50,
  pendingRequests: [],
}

const DEMO_DOMAIN = {
  type: "domain",
  orgName: "ABN AMRO Bank N.V.",
  edition: "nl",
  domains: ["nl.abnamro.com", "abnamro.nl", "privatebanking.abnamro.nl"],
  licenseUsed: 12,
  licenseTotal: 25,
  pendingRequests: [],
}

// Wissel hier tussen "sso" en "domain" om beide varianten te testen
const DEMO_CONFIG = DEMO_SSO

// ─── Helpers ──────────────────────────────────────────────────────────────────
function daysUntil(date) {
  return Math.ceil((new Date(date) - Date.now()) / (1000 * 60 * 60 * 24))
}

function SecretMask({ value }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
      <span style={{ fontFamily:"var(--font-mono, monospace)", fontSize:"0.875rem", color:C.navy, letterSpacing:"0.04em" }}>
        {revealed ? value : "••••••••••••••••••••••••"}
      </span>
      <button type="button" onClick={() => setRevealed(r => !r)}
        style={{ background:"none", border:"none", cursor:"pointer", color:C.gray500, padding:"0.125rem", display:"flex", alignItems:"center" }}>
        {revealed
          ? <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          : <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>
        }
      </button>
    </div>
  )
}

function ConfigRow({ label, children, mono }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"180px 1fr", gap:"0.5rem 1rem", alignItems:"start", paddingBottom:"0.75rem", marginBottom:"0.75rem", borderBottom:`1px solid ${C.gray100}` }}>
      <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", fontWeight:600, color:C.gray500, paddingTop:"0.1rem" }}>{label}</div>
      <div style={{ fontFamily: mono ? "var(--font-mono, monospace)" : "var(--font-sans)", fontSize:"0.875rem", color:C.navy, wordBreak:"break-all" }}>{children}</div>
    </div>
  )
}

function Card({ children, style }) {
  return (
    <div style={{ background:C.white, borderRadius:10, padding:"1.5rem 1.75rem", boxShadow:"0 2px 16px rgba(12,24,46,0.06)", marginBottom:"1.25rem", ...style }}>
      {children}
    </div>
  )
}

function CardTitle({ children, sub }) {
  return (
    <div style={{ marginBottom:"1.25rem" }}>
      <h2 style={{ fontFamily:"var(--font-sans)", fontSize:"1.125rem", fontWeight:800, color:C.navy, letterSpacing:"-0.01em", marginBottom: sub ? "0.3rem" : 0 }}>{children}</h2>
      {sub && <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, lineHeight:"1.5" }}>{sub}</p>}
    </div>
  )
}

function StatusBadge({ ok, label }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", background: ok ? "rgba(78,213,150,0.12)" : "rgba(224,27,65,0.08)", borderRadius:99, padding:"0.2rem 0.625rem", fontFamily:"var(--font-sans)", fontSize:"0.75rem", fontWeight:700, color: ok ? "#1B5E20" : C.red }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background: ok ? C.green : C.red, display:"inline-block" }}/>
      {label}
    </span>
  )
}

function Toggle({ checked, onChange, label, sub }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"1rem" }}>
      <div>
        <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", fontWeight:600, color:C.navy, marginBottom: sub ? "0.2rem" : 0 }}>{label}</div>
        {sub && <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, lineHeight:"1.5" }}>{sub}</div>}
      </div>
      <div onClick={onChange} style={{ width:44, height:24, borderRadius:12, background: checked ? C.green : C.gray300, cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0, marginTop:"0.125rem" }}>
        <div style={{ position:"absolute", top:2, left: checked ? 22 : 2, width:20, height:20, borderRadius:"50%", background:C.white, boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"left 0.2s" }}/>
      </div>
    </div>
  )
}

function LicenseBar({ used, total }) {
  const pct = Math.min(100, Math.round((used / total) * 100))
  const warn = pct >= 90
  const color = warn ? C.red : pct >= 70 ? "#F59E0B" : C.green
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"0.5rem" }}>
        <span style={{ fontFamily:"var(--font-sans)", fontSize:"1.5rem", fontWeight:800, color:C.navy }}>{used} <span style={{ fontSize:"0.875rem", fontWeight:400, color:C.gray500 }}>/ {total}</span></span>
        <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", fontWeight:600, color }}>{pct}%</span>
      </div>
      <div style={{ height:6, borderRadius:3, background:C.gray100, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:color, transition:"width 0.4s" }}/>
      </div>
    </div>
  )
}

// ─── Request modal ────────────────────────────────────────────────────────────
function RequestModal({ type, onClose, onSubmit }) {
  const { t } = useLang()
  const [value, setValue] = useState("")
  const [note, setNote] = useState("")
  const [sent, setSent] = useState(false)

  const cfg = {
    domain:  { title: t("ea_req_domain_title"),  placeholder: t("ea_req_domain_ph"),  label: t("ea_req_domain_label") },
    license: { title: t("ea_req_license_title"), placeholder: "50",                   label: t("ea_req_license_label") },
    other:   { title: t("ea_req_other_title"),   placeholder: "",                     label: t("ea_req_other_label") },
  }[type]

  function handleSend() {
    setSent(true)
    setTimeout(() => { onSubmit({ type, value, note }); onClose() }, 1200)
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(12,24,46,0.4)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <div style={{ background:C.white, borderRadius:12, padding:"2rem", maxWidth:480, width:"100%", boxShadow:"0 8px 40px rgba(12,24,46,0.18)" }}>
        {sent ? (
          <div style={{ textAlign:"center", padding:"1rem 0" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:C.green, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem" }}>
              <svg width="20" height="16" viewBox="0 0 16 13" fill="none"><path d="M1 6.5L5.5 11L15 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"1rem", fontWeight:700, color:C.navy }}>{t("ea_req_sent")}</div>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily:"var(--font-sans)", fontSize:"1.125rem", fontWeight:800, color:C.navy, marginBottom:"1.25rem" }}>{cfg.title}</h3>
            {type !== "other" && (
              <div className="input-group">
                <label className="input-label">{cfg.label}</label>
                <input className="input-field" type={type === "license" ? "number" : "text"} placeholder={cfg.placeholder} value={value} onChange={e => setValue(e.target.value)} autoFocus />
              </div>
            )}
            <div className="input-group">
              <label className="input-label">{t("ea_req_note_label")} {type !== "other" && <span style={{ color:C.gray500, fontSize:"0.7rem" }}>({t("bf_optional")})</span>}</label>
              <textarea className="input-field" rows={3} placeholder={t("ea_req_note_ph")} value={note} onChange={e => setNote(e.target.value)} style={{ resize:"vertical", minHeight:72 }} />
            </div>
            <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem" }}>
              <button className="btn-navy" style={{ flex:1 }} disabled={type !== "other" && !value} onClick={handleSend}>{t("ea_req_send")}</button>
              <button className="btn-secondary" onClick={onClose}>{t("acc_cancel")}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── SSO Secret update modal ──────────────────────────────────────────────────
function SecretUpdateModal({ onClose, onSave }) {
  const { t } = useLang()
  const [val, setVal] = useState("")
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (!val) return
    setSaved(true)
    setTimeout(() => { onSave(val); onClose() }, 1000)
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(12,24,46,0.4)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <div style={{ background:C.white, borderRadius:12, padding:"2rem", maxWidth:480, width:"100%", boxShadow:"0 8px 40px rgba(12,24,46,0.18)" }}>
        {saved ? (
          <div style={{ textAlign:"center", padding:"1rem 0" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:C.green, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem" }}>
              <svg width="20" height="16" viewBox="0 0 16 13" fill="none"><path d="M1 6.5L5.5 11L15 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"1rem", fontWeight:700, color:C.navy }}>{t("ea_secret_saved")}</div>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily:"var(--font-sans)", fontSize:"1.125rem", fontWeight:800, color:C.navy, marginBottom:"0.5rem" }}>{t("ea_secret_update_title")}</h3>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, lineHeight:"1.5", marginBottom:"1.25rem" }}>{t("ea_secret_update_sub")}</p>
            <div className="input-group">
              <label className="input-label">{t("ea_secret_new_label")}</label>
              <input className="input-field" type="password" placeholder={t("ea_secret_new_ph")} value={val} onChange={e => setVal(e.target.value)} autoFocus />
            </div>
            <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem" }}>
              <button className="btn-navy" style={{ flex:1 }} disabled={!val} onClick={handleSave}>{t("ea_secret_save_btn")}</button>
              <button className="btn-secondary" onClick={onClose}>{t("acc_cancel")}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Hoofdpagina
// ═════════════════════════════════════════════════════════════════════════════
export default function EnterpriseAccessPage({ config = DEMO_CONFIG }) {
  const { t } = useLang()

  const [ssoConfig, setSsoConfig]         = useState(config)
  const [modal, setModal]                 = useState(null)   // null | "domain" | "license" | "other" | "secret"
  const [requests, setRequests]           = useState([])
  const [allowPassword, setAllowPassword] = useState(config.allowPasswordLogin ?? true)
  const [secretUpdated, setSecretUpdated] = useState(false)

  const isSso    = ssoConfig.type === "sso"
  const isDomain = ssoConfig.type === "domain"

  const daysLeft   = isSso ? daysUntil(ssoConfig.secretExpiresAt) : null
  const secretWarn = daysLeft !== null && daysLeft <= 30
  const secretCrit = daysLeft !== null && daysLeft <= 7

  const editionLabel = ssoConfig.edition === "nl" ? t("ef_edition_nl_title") : t("ef_edition_intl_title")

  const providerLabel = ssoConfig.provider === "google" ? "Google Workspace" : "Microsoft Entra ID (Azure AD)"
  const ProviderIcon  = ssoConfig.provider === "google" ? GoogleIcon : MicrosoftIcon

  function handleRequest(req) {
    setRequests(prev => [...prev, { ...req, id: Date.now(), submittedAt: new Date() }])
  }

  function handleSecretSave(newSecret) {
    setSsoConfig(c => ({ ...c, clientSecret: newSecret, secretExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }))
    setSecretUpdated(true)
  }

  return (
    <div>
      {/* ── Paginaheader ── */}
      <div style={{ marginBottom:"1.5rem" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"rgba(224,27,65,0.08)", borderRadius:99, padding:"0.25rem 0.875rem", fontFamily:"var(--font-sans)", fontSize:"0.75rem", fontWeight:700, color:C.red, letterSpacing:"0.06em", marginBottom:"0.75rem" }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M5 4V3a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Enterprise
        </div>
        <h1 style={{ fontFamily:"var(--font-sans)", fontSize:"1.5rem", fontWeight:800, color:C.navy, letterSpacing:"-0.01em", marginBottom:"0.375rem" }}>{t("ea_page_title")}</h1>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray500, lineHeight:"1.5" }}>{ssoConfig.orgName}</p>
      </div>

      {/* ── Kritieke secret-waarschuwing ── */}
      {isSso && secretCrit && !secretUpdated && (
        <div style={{ display:"flex", alignItems:"flex-start", gap:"0.875rem", background:"rgba(224,27,65,0.06)", border:`1.5px solid rgba(224,27,65,0.3)`, borderRadius:10, padding:"1rem 1.25rem", marginBottom:"1.25rem" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink:0, marginTop:"0.1rem" }}>
            <circle cx="10" cy="10" r="9" stroke={C.red} strokeWidth="1.5"/>
            <path d="M10 6v5M10 13v.5" stroke={C.red} strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", fontWeight:700, color:C.red, marginBottom:"0.25rem" }}>{t("ea_secret_crit_title").replace("{days}", daysLeft)}</div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray700, lineHeight:"1.5", marginBottom:"0.75rem" }}>{t("ea_secret_crit_body")}</div>
            <button className="btn-red" style={{ fontSize:"0.875rem", padding:"0.4rem 1rem" }} onClick={() => setModal("secret")}>{t("ea_secret_update_btn")}</button>
          </div>
        </div>
      )}

      {/* ── Waarschuwing (30 dagen) ── */}
      {isSso && secretWarn && !secretCrit && !secretUpdated && (
        <div style={{ display:"flex", alignItems:"flex-start", gap:"0.875rem", background:"rgba(245,158,11,0.06)", border:`1.5px solid rgba(245,158,11,0.3)`, borderRadius:10, padding:"1rem 1.25rem", marginBottom:"1.25rem" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink:0, marginTop:"0.1rem" }}>
            <circle cx="10" cy="10" r="9" stroke="#D97706" strokeWidth="1.5"/>
            <path d="M10 6v5M10 13v.5" stroke="#D97706" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", fontWeight:700, color:"#92400E", marginBottom:"0.25rem" }}>{t("ea_secret_warn_title").replace("{days}", daysLeft)}</div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray700, lineHeight:"1.5", marginBottom:"0.75rem" }}>{t("ea_secret_warn_body")}</div>
            <button className="btn-secondary" style={{ fontSize:"0.875rem", padding:"0.4rem 1rem" }} onClick={() => setModal("secret")}>{t("ea_secret_update_btn")}</button>
          </div>
        </div>
      )}

      {/* ── Licentiegebruik ── */}
      <Card>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem", alignItems:"start" }}>
          <div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.75rem" }}>{t("ea_license_title")}</div>
            <LicenseBar used={ssoConfig.licenseUsed} total={ssoConfig.licenseTotal} />
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, marginTop:"0.625rem", lineHeight:"1.5" }}>{t("ea_license_sub")}</div>
            <button className="link-btn" style={{ fontSize:"0.8125rem", marginTop:"0.625rem" }} onClick={() => setModal("license")}>{t("ea_license_request_more")}</button>
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.75rem" }}>{t("ea_subscription_label")}</div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", fontWeight:700, color:C.navy, marginBottom:"0.375rem" }}>Enterprise — {editionLabel}</div>
            <StatusBadge ok label={t("ea_status_active")} />
          </div>
        </div>
      </Card>

      {/* ══ SSO VARIANT ══════════════════════════════════════════════════════ */}
      {isSso && (<>
        {/* Provider + credentials */}
        <Card>
          <CardTitle sub={t("ea_sso_config_sub")}>{t("ea_sso_config_title")}</CardTitle>

          <ConfigRow label={t("ea_sso_provider_label")}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <ProviderIcon />
              <span>{providerLabel}</span>
            </div>
          </ConfigRow>
          <ConfigRow label="Client ID" mono>{ssoConfig.clientId}</ConfigRow>
          {ssoConfig.provider === "microsoft" && (
            <ConfigRow label="Tenant ID" mono>{ssoConfig.tenantId}</ConfigRow>
          )}
          <ConfigRow label={t("ea_sso_secret_label")}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem" }}>
              <SecretMask value={ssoConfig.clientSecret} />
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", flexShrink:0 }}>
                {!secretUpdated && (
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.78rem", color: secretCrit ? C.red : secretWarn ? "#D97706" : C.gray500 }}>
                    {secretCrit || secretWarn
                      ? t("ea_secret_expires_in").replace("{days}", daysLeft)
                      : t("ea_secret_valid")
                    }
                  </span>
                )}
                {secretUpdated && <StatusBadge ok label={t("ea_secret_renewed")} />}
                <button className="btn-secondary" style={{ fontSize:"0.8rem", padding:"0.3rem 0.75rem" }} onClick={() => setModal("secret")}>{t("ea_secret_update_btn")}</button>
              </div>
            </div>
          </ConfigRow>

          <div style={{ background:C.gray50, borderRadius:8, padding:"0.875rem 1rem", marginTop:"0.5rem" }}>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.75rem", color:C.gray500, lineHeight:"1.6" }}>
              <strong style={{ color:C.navy }}>{t("ea_sso_redirect_label")}</strong><br/>
              <span style={{ fontFamily:"var(--font-mono, monospace)", fontSize:"0.8rem" }}>https://investmentofficer.nl/auth/sso/callback</span>
            </div>
          </div>
        </Card>

        {/* SSO instellingen */}
        <Card>
          <CardTitle sub={t("ea_sso_settings_sub")}>{t("ea_sso_settings_title")}</CardTitle>
          <Toggle
            checked={allowPassword}
            onChange={() => setAllowPassword(p => !p)}
            label={t("ea_sso_password_toggle_label")}
            sub={t("ea_sso_password_toggle_sub")}
          />
        </Card>
      </>)}

      {/* ══ DOMEIN VARIANT ═══════════════════════════════════════════════════ */}
      {isDomain && (
        <Card>
          <CardTitle sub={t("ea_domain_config_sub")}>{t("ea_domain_config_title")}</CardTitle>

          <div style={{ marginBottom:"1rem" }}>
            {ssoConfig.domains.map((d, i) => (
              <div key={d} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.625rem 0.875rem", background: i % 2 === 0 ? C.gray50 : C.white, borderRadius:6, marginBottom:"0.375rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke={C.green} strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontFamily:"var(--font-mono, monospace)", fontSize:"0.875rem", color:C.navy }}>@{d}</span>
                </div>
                <StatusBadge ok label={t("ea_status_active")} />
              </div>
            ))}
          </div>

          <div style={{ background:C.gray50, borderRadius:8, padding:"0.875rem 1rem", marginBottom:"1rem" }}>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, lineHeight:"1.5" }}>
              {t("ea_domain_how_it_works")}
            </div>
          </div>

          <button className="btn-secondary" style={{ fontSize:"0.875rem" }} onClick={() => setModal("domain")}>
            + {t("ea_domain_add_btn")}
          </button>
        </Card>
      )}

      {/* ── Wijzigingen aanvragen ── */}
      <Card>
        <CardTitle sub={t("ea_requests_sub")}>{t("ea_requests_title")}</CardTitle>

        <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", marginBottom: requests.length > 0 ? "1.25rem" : 0 }}>
          {isDomain && (
            <button className="btn-secondary" style={{ fontSize:"0.875rem" }} onClick={() => setModal("domain")}>
              {t("ea_req_domain_cta")}
            </button>
          )}
          <button className="btn-secondary" style={{ fontSize:"0.875rem" }} onClick={() => setModal("license")}>
            {t("ea_req_license_cta")}
          </button>
          <button className="btn-secondary" style={{ fontSize:"0.875rem" }} onClick={() => setModal("other")}>
            {t("ea_req_other_cta")}
          </button>
        </div>

        {requests.length > 0 && (
          <div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.625rem" }}>{t("ea_requests_history")}</div>
            {requests.map(r => (
              <div key={r.id} style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"1rem", padding:"0.625rem 0", borderBottom:`1px solid ${C.gray100}` }}>
                <div>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", fontWeight:600, color:C.navy, marginBottom:"0.1rem" }}>
                    {r.type === "domain" ? t("ea_req_domain_title") : r.type === "license" ? t("ea_req_license_title") : t("ea_req_other_title")}
                    {r.value && <span style={{ fontWeight:400, color:C.gray500 }}> — {r.value}</span>}
                  </div>
                  {r.note && <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500 }}>{r.note}</div>}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", flexShrink:0 }}>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.75rem", color:C.gray500 }}>
                    {r.submittedAt.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
                  </span>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", background:"rgba(245,158,11,0.1)", borderRadius:99, padding:"0.2rem 0.625rem", fontFamily:"var(--font-sans)", fontSize:"0.75rem", fontWeight:700, color:"#92400E" }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:"#F59E0B", display:"inline-block" }}/>
                    {t("ea_req_status_pending")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Modals ── */}
      {modal === "secret" && (
        <SecretUpdateModal onClose={() => setModal(null)} onSave={handleSecretSave} />
      )}
      {(modal === "domain" || modal === "license" || modal === "other") && (
        <RequestModal type={modal} onClose={() => setModal(null)} onSubmit={handleRequest} />
      )}
    </div>
  )
}

// ── Provider icons ────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="7.5" height="7.5" fill="#F25022"/>
      <rect x="9.5" y="1" width="7.5" height="7.5" fill="#7FBA00"/>
      <rect x="1" y="9.5" width="7.5" height="7.5" fill="#00A4EF"/>
      <rect x="9.5" y="9.5" width="7.5" height="7.5" fill="#FFB900"/>
    </svg>
  )
}
