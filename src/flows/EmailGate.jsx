import { useState } from 'react'
import { C } from '../tokens.js'
import { classifyEmailForReg, getWhitelistInfo } from '../utils.js'
import { TopProgressBar, RegSidebar, EmailChip, AuthNav } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'

export default function EmailGate({ onRoute, onBack, onGoLogin }) {
  const { t } = useLang()
  const [email, setEmail]             = useState("")
  const [step, setStep]               = useState("email")
  const [privateOverride, setPrivateOverride] = useState(false)

  function handleEmailSubmit(e) {
    e.preventDefault()
    const type = classifyEmailForReg(email)

    if (type === "generic")                    { setStep("generic_block"); return }
    if (type === "private" && !privateOverride) { setStep("private_warning"); return }
    if (type === "existing")                   { setStep("existing"); return }
    if (type === "enterprise")                 { onRoute("enterprise", email); return }
    if (type === "whitelist") {
      const wlInfo = getWhitelistInfo(email)
      onRoute("whitelist", email, wlInfo)
      return
    }
    if (type === "trial_blocked")              { setStep("trial_blocked"); return }
    // type === "new" → go to profile (intent comes after profile)
    onRoute("profile", email)
  }

  function handlePrivateContinue() {
    setPrivateOverride(true)
    // Private emails go directly to personal profile+plan (no intent question)
    onRoute("personal_direct", email)
  }

  return (
    <div className="reg-layout">
      <TopProgressBar total={4} current={0.5} />
      <AuthNav onBack={step === "email" ? onBack : () => setStep("email")} />
      <div className="reg-container">
        <div className="reg-main">

          {/* ── Email input ── */}
          {step === "email" && (
            <>
              <h2 className="reg-step-title">{t("eg_title")}</h2>
              <p className="reg-step-sub">{t("eg_sub")}</p>
              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={handleEmailSubmit}>
                <div className="input-group">
                  <label className="input-label">{t("eg_email_label")}</label>
                  <input className="input-field" type="text" inputMode="email" placeholder={t("eg_email_placeholder")} value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
                </div>
                <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.25rem" }}>
                  {t("eg_terms")}{" "}
                  <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_terms_link")}</button>{" "}
                  {t("pf_privacy_and")}{" "}
                  <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_privacy_link")}.</button>
                </p>
                <button className="btn-green btn-full" type="submit">{t("eg_cta")}</button>
              </form>
            </>
          )}

          {/* ── Private email warning ── */}
          {step === "private_warning" && (
            <>
              <h2 className="reg-step-title">{t("pf_private_title")}</h2>
              <EmailChip email={email} onEdit={() => { setStep("email"); setPrivateOverride(false) }} />
              <div className="alert alert-warn">
                <strong>{t("pf_private_alert")}</strong><br/>{t("pf_private_body1")}
              </div>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.25rem" }}>{t("pf_private_body2")}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-primary btn-full" onClick={() => setStep("email")}>{t("pf_private_other")}</button>
                <button className="btn-secondary btn-full" onClick={handlePrivateContinue}>{t("pf_private_continue")}</button>
              </div>
            </>
          )}

          {/* ── Generic address blocked ── */}
          {step === "generic_block" && (
            <>
              <h2 className="reg-step-title">{t("pf_generic_title")}</h2>
              <EmailChip email={email} onEdit={() => setStep("email")} />
              <div className="alert alert-error">
                <strong>{t("pf_generic_alert")}</strong><br/>{t("pf_generic_body")}
              </div>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray700, marginBottom:"1.5rem", lineHeight:"var(--lh-body)" }}>{t("pf_generic_sub")}</p>
              <button className="btn-primary btn-full" onClick={() => setStep("email")}>{t("pf_generic_other")}</button>
            </>
          )}

          {/* ── Existing account ── */}
          {step === "existing" && (
            <>
              <h2 className="reg-step-title">{t("pf_existing_title")}</h2>
              <EmailChip email={email} onEdit={() => setStep("email")} />
              <div className="alert alert-warn">
                {t("pf_existing_body")}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem", marginTop:"1.25rem" }}>
                <button className="btn-primary btn-full" onClick={onGoLogin}>{t("pf_existing_login")}</button>
                <button className="btn-secondary btn-full" onClick={() => setStep("email")}>{t("pf_existing_other")}</button>
              </div>
            </>
          )}

          {/* ── Trial blocked ── */}
          {step === "trial_blocked" && (
            <>
              <h2 className="reg-step-title">{t("bf_trial_blocked_title")}</h2>
              <EmailChip email={email} onEdit={() => setStep("email")} />
              <div className="alert alert-warn" style={{ marginBottom:"1.25rem" }}>
                <strong>{t("bf_trial_blocked_alert")}</strong><br/>{t("bf_trial_blocked_body")}
              </div>
              <div style={{ background:"rgba(78,213,150,0.08)", border:`1.5px solid rgba(78,213,150,0.4)`, borderRadius:10, padding:"1.25rem 1.5rem", marginBottom:"1.5rem" }}>
                <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1.05rem", color:C.navy, marginBottom:"0.5rem" }}>
                  {t("bf_trial_blocked_avail_title")}
                </div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, lineHeight:"var(--lh-body)" }}>
                  {t("bf_trial_blocked_avail_body")}
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-green btn-full" onClick={() => onRoute("business_paid", email)}>{t("bf_trial_blocked_cta")}</button>
                <button className="btn-secondary btn-full" onClick={() => setStep("email")}>{t("bf_trial_blocked_other")}</button>
              </div>
            </>
          )}

        </div>
        <div className="reg-sidebar">
          <RegSidebar />
        </div>
      </div>
    </div>
  )
}
