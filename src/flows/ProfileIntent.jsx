import { useState } from 'react'
import { C } from '../tokens.js'
import { JOB_ROLE_CLUSTERS } from '../data.js'
import { TopProgressBar, RegSidebar, EmailChip, AuthNav, JobRoleSelector } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'

/*
 * ProfileIntent: unified profile + intent screen.
 * Step 1: Profile (name, job role, password) — always first.
 * Step 2: Intent question (Business recommended / Personal secondary) — only for new business emails.
 *
 * For private emails (personal_direct), this component skips intent and goes straight to onComplete("personal").
 */
export default function ProfileIntent({ email, isPrivate, forceBusinessPaid, onComplete, onBack }) {
  const { t } = useLang()
  const [step, setStep]         = useState("profile")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName]   = useState("")
  const [jobRole, setJobRole]     = useState("")
  const [password, setPassword]   = useState("")

  function handleProfileSubmit(e) {
    e.preventDefault()
    if (!jobRole) return
    const profileData = { firstName, lastName, jobRole, password, email }
    if (isPrivate) {
      // Private emails skip intent, go straight to personal
      onComplete("personal", profileData)
    } else if (forceBusinessPaid) {
      // Trial-blocked emails skip intent, go straight to business (paid)
      onComplete("business", profileData)
    } else {
      setStep("intent")
    }
  }

  const profileData = { firstName, lastName, jobRole, password, email }

  return (
    <div className="reg-layout">
      <TopProgressBar total={4} current={step === "profile" ? 1 : 1.5} />
      <AuthNav onBack={step === "intent" ? () => setStep("profile") : onBack} />
      <div className="reg-container">
        <div className="reg-main">

          {/* ── Profile ── */}
          {step === "profile" && (
            <>
              <h2 className="reg-step-title">{t("pf_profile_title")}</h2>
              <p className="reg-step-sub">{t("pf_profile_sub")}</p>

              {/* Inline email confirmation */}
              <div style={{
                display:"flex", alignItems:"center", gap:"0.5rem",
                background:"rgba(78,213,150,0.08)", border:"1px solid rgba(78,213,150,0.25)",
                borderRadius:8, padding:"0.625rem 0.875rem", marginBottom:"1.25rem",
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" stroke={C.green} strokeWidth="1.5"/>
                  <path d="M5.5 9l2 2L12.5 7" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", fontWeight:700, color:C.navy }}>
                    {isPrivate ? t("pf_private_confirmed") : t("eg_detected")}
                  </div>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.75rem", color:C.gray500 }}>{email}</div>
                </div>
              </div>

              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={handleProfileSubmit}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("pf_firstname")}</label><input className="input-field" type="text" placeholder={t("pf_firstname")} value={firstName} onChange={e => setFirstName(e.target.value)} autoFocus required /></div>
                  <div className="input-group"><label className="input-label">{t("pf_lastname")}</label><input className="input-field" type="text" placeholder={t("pf_lastname")} value={lastName} onChange={e => setLastName(e.target.value)} required /></div>
                </div>
                <div className="input-group">
                  <label className="input-label">{t("pf_jobrole")}</label>
                  <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray500, margin:"0 0 0.75rem" }}>{t("pf_jobrole_sub")}</p>
                  <JobRoleSelector clusters={JOB_ROLE_CLUSTERS} selectedId={jobRole} onSelect={setJobRole} t={t} />
                </div>
                <div className="input-group"><label className="input-label">{t("pf_password")}</label><input className="input-field" type="text" style={{ WebkitTextSecurity:"disc" }} autoComplete="off" data-1p-ignore data-lpignore="true" placeholder={t("pf_password_hint")} value={password} onChange={e => setPassword(e.target.value)} minLength={8} required /></div>
                <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.25rem" }}>
                  {t("eg_terms")}{" "}
                  <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_terms_link")}</button>{" "}
                  {t("pf_privacy_and")}{" "}
                  <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_privacy_link")}.</button>
                </p>
                <button className="btn-green btn-full" type="submit">{t("pf_profile_next")}</button>
              </form>
            </>
          )}

          {/* ── Intent question (after profile, new business emails only) ── */}
          {step === "intent" && (
            <>
              <h2 className="reg-step-title">{t("eg_intent_title")}</h2>
              <p className="reg-step-sub" style={{ marginBottom:"0.5rem" }}>
                {firstName}, {t("eg_intent_sub")}
              </p>

              <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", marginTop:"1.25rem" }}>

                {/* Option A: Business — PRIMARY */}
                <button
                  className="eg-intent-card eg-intent-primary"
                  onClick={() => onComplete("business", profileData)}
                >
                  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.5rem" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="9" cy="8" r="3.5" stroke={C.red} strokeWidth="1.75"/>
                      <circle cx="17" cy="9" r="2.5" stroke={C.red} strokeWidth="1.5"/>
                      <path d="M2 19c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke={C.red} strokeWidth="1.75" strokeLinecap="round"/>
                      <path d="M17 14c2 0 4 1.3 4 3.5" stroke={C.red} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", fontWeight:700, color:C.navy }}>{t("eg_biz_label")}</span>
                    <span style={{
                      fontFamily:"var(--font-sans)", fontSize:"0.625rem", fontWeight:700,
                      background:C.red, color:C.white, padding:"0.15rem 0.5rem",
                      borderRadius:99, letterSpacing:"0.04em", textTransform:"uppercase",
                    }}>{t("eg_biz_rec")}</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.3rem", paddingLeft:"0.125rem" }}>
                    {["eg_biz_feat1","eg_biz_feat2","eg_biz_feat3"].map(k => (
                      <div key={k} style={{ display:"flex", alignItems:"flex-start", gap:"0.4rem" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop:"0.1rem", flexShrink:0 }}>
                          <path d="M3 7l2.5 2.5L11 4.5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray700, lineHeight:"1.4" }}>{t(k)}</span>
                      </div>
                    ))}
                  </div>
                </button>

                {/* Option B: Personal — SECONDARY */}
                <button
                  className="eg-intent-card eg-intent-secondary"
                  onClick={() => onComplete("personal", profileData)}
                >
                  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke={C.gray500} strokeWidth="1.75"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={C.gray500} strokeWidth="1.75" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", fontWeight:600, color:C.gray700 }}>{t("eg_personal_label")}</span>
                  </div>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.75rem", color:C.gray500, marginTop:"0.25rem", paddingLeft:"0.125rem" }}>{t("eg_personal_sub")}</div>
                </button>
              </div>
            </>
          )}

        </div>
        <div className="reg-sidebar">
          <RegSidebar sidebarContext="default" />
        </div>
      </div>
    </div>
  )
}
