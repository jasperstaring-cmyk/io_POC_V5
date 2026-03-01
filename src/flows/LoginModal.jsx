import { useState } from 'react'
import { C } from '../tokens.js'
import { classifyEmailForLogin, getCompanyNameFromEmail, getWhitelistInfo, isNewSsoUser } from '../utils.js'
import { JOB_ROLE_CLUSTERS } from '../data.js'
import IOLogo from '../components/IOLogo.jsx'
import { EmailChip, LangSwitcher, JobRoleSelector } from '../components/shared.jsx'
import { GoogleIcon, MicrosoftIcon } from '../components/SsoIcons.jsx'
import { useLang } from '../LanguageContext.jsx'

/* ─── Password icon ────────────────────────────────────────────────────── */
function PasswordIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gray500} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

/* ─── SelectionButton (row with icon + chevron) ──────────────────────── */
function SelectionButton({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display:"flex", alignItems:"center", width:"100%", padding:"1.125rem 1.25rem",
      border:`1px solid ${C.gray200}`, borderRadius:10, background:C.white,
      cursor:"pointer", fontFamily:"var(--font-sans)", fontSize:"0.9375rem",
      color:C.navy, fontWeight:500, gap:"0.875rem", marginBottom:"0.75rem",
      transition:"border-color 0.15s, box-shadow 0.15s",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor=C.gray400; e.currentTarget.style.boxShadow="0 2px 8px rgba(12,24,46,0.06)" }}
    onMouseLeave={e => { e.currentTarget.style.borderColor=C.gray200; e.currentTarget.style.boxShadow="none" }}>
      {icon}
      <span style={{ flex:1, textAlign:"left" }}>{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke={C.gray400} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  )
}

/* ═══ Main LoginPage component ═════════════════════════════════════════ */
export default function LoginModal({ onClose, onGoRegister, onLoginSuccess, onGoWhitelist, initialEmail }) {
  const { t } = useLang()
  const hasInitialEmail = !!(initialEmail)
  // When initialEmail is provided, classify it to determine the correct step
  const initialStep = (() => {
    if (!hasInitialEmail) return "email"
    const type = classifyEmailForLogin(initialEmail)
    if (type === "sso") return "sso"
    if (type === "whitelist") return "whitelist"
    if (type === "private") return "private_warning"
    if (type === "unknown") return "unknown"
    return "password"
  })()
  const [step, setStep]         = useState(initialStep)
  const [email, setEmail]       = useState(initialEmail || "")
  const [password, setPassword] = useState("")
  const [ssoProvider, setSsoProvider] = useState("")  // "Google" or "Microsoft"
  const [ssoFirstName, setSsoFirstName] = useState("")
  const [ssoLastName, setSsoLastName]   = useState("")
  const [ssoJobRole, setSsoJobRole]     = useState("")

  const companyName = getCompanyNameFromEmail(email)
  const whitelistInfo = getWhitelistInfo(email)

  function handleEmailSubmit(e) {
    e.preventDefault()
    const type = classifyEmailForLogin(email)
    if (type === "private")    { setStep("private_warning"); return }
    if (type === "sso")        { setStep("sso"); return }
    if (type === "whitelist")  { setStep("whitelist"); return }
    if (type === "unknown")    { setStep("unknown"); return }
    setStep("password")
  }

  function handleLogin(e) {
    if (e) e.preventDefault()
    onLoginSuccess(email)
    onClose()
  }

  function resetToEmail() { setStep("email"); setEmail("") }

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"100vh" }}>

      {/* ── LEFT COLUMN ── */}
      <div style={{ padding:"3rem 4rem", display:"flex", flexDirection:"column", justifyContent:"flex-start", background:C.white, position:"relative", overflowY:"auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"3.5rem" }}>
          <IOLogo size={28} />
          <LangSwitcher />
        </div>
        <div style={{ maxWidth:480 }}>

          {/* ── STAP 1: E-mail ── */}
          {step === "email" && (
            <>
              <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,3.5vw,2.5rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"0.75rem" }}>
                {t("lm_title")}
              </h1>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"2rem" }}>
                {t("lm_intro")}
              </p>
              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={handleEmailSubmit}>
                <div className="input-group">
                  <label className="input-label">{t("lm_email_label")}</label>
                  <input className="input-field" type="text" inputMode="email" placeholder={t("lm_email_ph")} value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
                </div>
                <button className="btn-red btn-full" type="submit" style={{ marginTop:"0.5rem" }}>{t("lm_next")}</button>
              </form>
              <p style={{ textAlign:"center", marginTop:"2rem", fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray500 }}>
                {t("lm_no_account")}{" "}
                <button className="link-btn" onClick={() => { onClose(); onGoRegister() }}>{t("lm_register")}</button>
              </p>
            </>
          )}

          {/* ── Privé waarschuwing ── */}
          {step === "private_warning" && (
            <>
              <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,3.5vw,2.25rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", marginBottom:"1rem" }}>
                {t("lm_private_title")}
              </h1>
              <EmailChip email={email} onEdit={resetToEmail} />
              <div className="alert alert-warning" style={{ marginBottom:"1.25rem" }}>
                <strong>{t("pf_private_alert")}</strong><br/>{t("lm_private_body")}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-red btn-full" onClick={() => setStep("password")}>{t("pf_private_continue")}</button>
                <button className="btn-secondary btn-full" onClick={resetToEmail}>{t("lm_private_other")}</button>
              </div>
            </>
          )}

          {/* ── Geen account ── */}
          {step === "unknown" && (
            <>
              <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,3.5vw,2.25rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", marginBottom:"1rem" }}>
                {t("lm_unknown_title")}
              </h1>
              <EmailChip email={email} onEdit={resetToEmail} />
              <div className="alert alert-error" style={{ marginBottom:"1.25rem" }}>{t("lm_unknown_body")}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-red btn-full" onClick={() => { onClose(); onGoRegister() }}>{t("lm_unknown_register")}</button>
                <button className="btn-secondary btn-full" onClick={resetToEmail}>{t("lm_unknown_other")}</button>
              </div>
            </>
          )}

          {/* ── Whitelist: organisation pre-approved for Enterprise ── */}
          {step === "whitelist" && whitelistInfo && (
            <>
              <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,3.5vw,2.25rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", marginBottom:"1rem" }}>
                {t("lm_wl_title")}
              </h1>
              <EmailChip email={email} onEdit={resetToEmail} />
              <div className="alert alert-success" style={{ marginBottom:"1.25rem" }}>
                <strong>{whitelistInfo.company}</strong> {t("lm_wl_body")}{" "}
                {whitelistInfo.edition === "all" ? t("lm_wl_edition_all") : t("lm_wl_edition_nl")}.
                <br/><br/>
                {t("lm_wl_admin")}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-green btn-full" onClick={() => {
                  onClose()
                  if (onGoWhitelist) onGoWhitelist(email, whitelistInfo)
                }}>
                  {t("lm_wl_cta")}
                </button>
                <button className="btn-secondary btn-full" onClick={resetToEmail}>{t("lm_wl_other")}</button>
              </div>
            </>
          )}

          {/* ── SSO: Enterprise — direct Google/Microsoft + wachtwoord ── */}
          {step === "sso" && (
            <>
              <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,3.5vw,2.5rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"0.75rem" }}>
                {t("lm_sso_title")} {companyName || "uw organisatie"}
              </h1>
              <EmailChip email={email} onEdit={resetToEmail} />
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.25rem" }}>
                {t("lm_sso_body")}
              </p>

              {/* Enterprise access info — shown on SSO screen so user knows what they get before clicking */}
              {isNewSsoUser(email) && (
                <div style={{ background:"rgba(12,24,46,0.03)", border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1rem 1.125rem", marginBottom:"1.5rem" }}>
                  <div style={{ fontFamily:"var(--font-sans)", fontWeight:700, fontSize:"0.9rem", color:C.navy, marginBottom:"0.5rem" }}>
                    {t("lm_sso_ft_access_title").replace("{company}", companyName || t("lm_sso_ft_your_org"))}
                  </div>
                  {(t("lm_sso_ft_usps") || []).map((usp, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.375rem" }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray700 }}>{usp}</span>
                    </div>
                  ))}
                </div>
              )}

              <SelectionButton
                icon={<GoogleIcon />}
                label={t("lm_google")}
                onClick={() => {
                  if (isNewSsoUser(email)) { setSsoProvider("Google"); setStep("sso_firsttime") }
                  else handleLogin()
                }}
              />
              <SelectionButton
                icon={<MicrosoftIcon />}
                label={t("lm_microsoft")}
                onClick={() => {
                  if (isNewSsoUser(email)) { setSsoProvider("Microsoft"); setStep("sso_firsttime") }
                  else handleLogin()
                }}
              />
              <SelectionButton
                icon={<PasswordIcon />}
                label={t("lm_login_password")}
                onClick={() => setStep("password")}
              />

              <p style={{ textAlign:"center", marginTop:"1.5rem" }}>
                <button className="link-btn" onClick={resetToEmail} style={{ fontSize:"0.875rem" }}>
                  ← {t("lm_sso_other")}
                </button>
              </p>
            </>
          )}

          {/* ── SSO first-time: profile completion ── */}
          {step === "sso_firsttime" && (
            <>
              <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,3.5vw,2.25rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", marginBottom:"0.75rem" }}>
                {t("lm_sso_ft_title")}
              </h1>
              {/* SSO success banner */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", background:"rgba(78,213,150,0.08)", border:"1px solid rgba(78,213,150,0.25)", borderRadius:8, padding:"0.75rem 1rem", marginBottom:"1.5rem" }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" stroke={C.green} strokeWidth="1.5"/>
                  <path d="M5.5 9l2 2L12.5 7" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.navy }}>
                  {t("lm_sso_ft_verified").replace("{provider}", ssoProvider).replace("{email}", email)}
                </span>
              </div>
              {/* Profile fields */}
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray500, marginBottom:"1.25rem" }}>
                {t("lm_sso_ft_sub")}
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                <div className="input-group">
                  <label className="input-label">{t("pf_firstname")}</label>
                  <input className="input-field" type="text" value={ssoFirstName} onChange={e => setSsoFirstName(e.target.value)} autoFocus />
                </div>
                <div className="input-group">
                  <label className="input-label">{t("pf_lastname")}</label>
                  <input className="input-field" type="text" value={ssoLastName} onChange={e => setSsoLastName(e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">{t("pf_jobrole")}</label>
              </div>
              <JobRoleSelector
                clusters={JOB_ROLE_CLUSTERS}
                selectedId={ssoJobRole}
                onSelect={setSsoJobRole}
                t={t}
              />
              <button
                className="btn-red btn-full"
                style={{ marginTop:"1.25rem" }}
                disabled={!ssoFirstName.trim() || !ssoLastName.trim() || !ssoJobRole}
                onClick={() => {
                  onLoginSuccess(email, { firstName: ssoFirstName.trim(), lastName: ssoLastName.trim(), jobRole: ssoJobRole })
                  onClose()
                }}
              >
                {t("lm_sso_ft_cta")}
              </button>
            </>
          )}

          {/* ── Wachtwoord ── */}
          {step === "password" && (
            <>
              <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,3.5vw,2.25rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", marginBottom:"1rem" }}>
                {companyName ? `${t("lm_sso_title")} ${companyName}` : t("lm_sub")}
              </h1>
              <EmailChip email={email} onEdit={resetToEmail} />
              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={handleLogin}>
                <div className="input-group">
                  <label className="input-label">{t("lm_password_label")}</label>
                  <input className="input-field" type="text" style={{ WebkitTextSecurity:"disc" }} autoComplete="off" data-1p-ignore data-lpignore="true" placeholder={t("lm_password_ph")} value={password} onChange={e => setPassword(e.target.value)} autoFocus required />
                </div>
                <div style={{ textAlign:"right", marginBottom:"1.125rem" }}>
                  <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button" onClick={() => setStep("forgot")}>{t("lm_forgot")}</button>
                </div>
                <button className="btn-red btn-full" type="submit">{t("lm_login")}</button>
              </form>
            </>
          )}

          {/* ── Wachtwoord vergeten ── */}
          {step === "forgot" && (
            <>
              <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,3.5vw,2.25rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", marginBottom:"1rem" }}>
                {t("lm_forgot")}
              </h1>
              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={e => { e.preventDefault(); setStep("forgot_sent") }}>
                <div className="input-group">
                  <label className="input-label">{t("lm_email_label")}</label>
                  <input className="input-field" type="text" inputMode="email" defaultValue={email} autoFocus required />
                </div>
                <button className="btn-red btn-full" type="submit">{t("lm_next")}</button>
              </form>
              <button className="link-btn" style={{ marginTop:"1.25rem", display:"block", textAlign:"center", width:"100%" }} onClick={() => setStep("password")}>
                ← {t("lm_back")}
              </button>
            </>
          )}

          {/* ── Herstelmail verstuurd ── */}
          {step === "forgot_sent" && (
            <>
              <div style={{ marginTop:"1rem", marginBottom:"1.5rem" }}>
                <div style={{ width:48, height:48, background:C.green, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.25rem" }}>
                  <svg width="22" height="18" viewBox="0 0 24 20" fill="none"><path d="M2 9L9 16L22 2" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"1.5rem", fontWeight:700, color:C.navy, marginBottom:"0.75rem" }}>
                  {t("pf_done_confirm")}
                </h1>
              </div>
              <div className="alert alert-success">{t("pf_done_confirm")} <strong>{email}</strong>.</div>
              <button className="btn-secondary btn-full" style={{ marginTop:"1.25rem" }} onClick={onClose}>{t("lm_back")}</button>
            </>
          )}

        </div>
      </div>

      {/* ── RIGHT COLUMN: Full-bleed photo ── */}
      <div style={{ position:"relative", overflow:"hidden" }}>
        <img src="/images/beeld_onboarding_welcome.png" alt=""
          style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }}
          onError={e => { e.target.parentElement.style.background = `linear-gradient(135deg,${C.navy},#1B3A5C)` ; e.target.style.display="none" }} />
      </div>

    </div>
  )
}
