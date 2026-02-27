import { useState } from 'react'
import { C } from '../tokens.js'
import { classifyEmailForLogin, getCompanyNameFromEmail, getWhitelistInfo } from '../utils.js'
import IOLogo from '../components/IOLogo.jsx'
import { EmailChip, LangSwitcher } from '../components/shared.jsx'
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
export default function LoginModal({ onClose, onGoRegister, onLoginSuccess, onGoWhitelist }) {
  const { t } = useLang()
  const [step, setStep]         = useState("email")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")

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
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"2rem" }}>
                {t("lm_sso_intro")}
              </p>

              <SelectionButton
                icon={<GoogleIcon />}
                label={t("lm_google")}
                onClick={handleLogin}
              />
              <SelectionButton
                icon={<MicrosoftIcon />}
                label={t("lm_microsoft")}
                onClick={handleLogin}
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
