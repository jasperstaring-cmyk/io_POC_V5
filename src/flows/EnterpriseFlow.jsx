import { useState } from 'react'
import { C } from '../tokens.js'
import { TopProgressBar, RegSidebar, BackButton, AuthNav, LangSwitcher } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import IOLogo from '../components/IOLogo.jsx'

export default function EnterpriseFlow({ onComplete, onBack }) {
  const { t } = useLang()
  const ENTERPRISE_FEATURES = t("ef_sidebar_features")
  const [step, setStep] = useState("form")
  const [company, setCompany] = useState({
    kvk:"", name:"", street:"", number:"", addition:"", zip:"", city:"", country:"NL", vat:"",
  })
  const [agreed, setAgreed] = useState(false)

  function handleChange(field, val) {
    setCompany(prev => ({ ...prev, [field]: val }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setStep("done")
  }

  // ── Bevestigingspagina ────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div style={{ minHeight:"100vh", background:C.gray50 }}>
        <header style={{ position:"sticky", top:0, zIndex:50, background:C.white, borderBottom:`1px solid ${C.gray100}`, height:56, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 2rem" }}>
          <IOLogo />
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            <LangSwitcher />
            <button style={{ background:"none", border:"none", fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, cursor:"pointer" }}>{t("nav_help")}</button>
          </div>
        </header>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 56px)", padding:"2rem" }}>
          <div style={{ background:C.white, borderRadius:12, padding:"2.5rem 3rem", maxWidth:560, width:"100%", boxShadow:"0 4px 24px rgba(12,24,46,0.08)", textAlign:"left" }}>
            {/* Green check */}
            <div style={{ width:32, height:32, borderRadius:"50%", background:C.green, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.25rem" }}>
              <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
                <path d="M1 6.5L5.5 11L15 1.5" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"1.75rem", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", marginBottom:"0.625rem" }}>
              {t("ef_confirm_title")}
            </h1>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"2rem" }}>
              {t("ef_confirm_body")}
            </p>

            <button className="btn-red btn-full" onClick={onComplete}>
              {t("ef_confirm_cta")}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Formulier ─────────────────────────────────────────────────────────────
  return (
    <div className="reg-layout">
      <TopProgressBar total={2} current={1} />
      <AuthNav onBack={onBack} />
      <div className="reg-container">
        <div className="reg-main">

          {/* Badge */}
          <div style={{ display:"inline-block", background:"rgba(224,27,65,0.08)", borderRadius:99, padding:"0.25rem 0.875rem", fontFamily:"var(--font-sans)", fontSize:"0.75rem", fontWeight:700, color:C.red, letterSpacing:"0.06em", marginBottom:"1rem" }}>
            Jouw abonnement
          </div>

          <h2 className="reg-step-title">Enterprise: Een abonnement op maat</h2>
          <p className="reg-step-sub">Vul hieronder de resterende gegevens in. Wij nemen zo spoedig mogelijk contact met u op.</p>

          <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">KvK nummer</label>
              <input className="input-field" type="text" placeholder="KvK nummer" value={company.kvk} onChange={e => handleChange("kvk", e.target.value)} required />
            </div>

            <div className="input-group">
              <label className="input-label">Bedrijfsnaam</label>
              <input className="input-field" type="text" placeholder="Bedrijfsnaam" value={company.name} onChange={e => handleChange("name", e.target.value)} required />
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:"0 1rem" }}>
              <div className="input-group">
                <label className="input-label">Straatnaam / mailbox</label>
                <input className="input-field" type="text" placeholder="Straatnaam" value={company.street} onChange={e => handleChange("street", e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Huisnr</label>
                <input className="input-field" type="text" placeholder="12" value={company.number} onChange={e => handleChange("number", e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Toevoeging</label>
                <input className="input-field" type="text" placeholder="Bis" value={company.addition} onChange={e => handleChange("addition", e.target.value)} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Postcode</label>
              <input className="input-field" type="text" placeholder="0000 AA" value={company.zip} onChange={e => handleChange("zip", e.target.value)} required />
            </div>

            <div className="input-group">
              <label className="input-label">Stad</label>
              <input className="input-field" type="text" placeholder="Kies een stad" value={company.city} onChange={e => handleChange("city", e.target.value)} required />
            </div>

            <div className="input-group">
              <label className="input-label">Land</label>
              <select className="input-field" value={company.country} onChange={e => handleChange("country", e.target.value)}>
                <option value="NL">Nederland</option>
                <option value="BE">België</option>
                <option value="DE">Duitsland</option>
                <option value="FR">Frankrijk</option>
                <option value="LU">Luxemburg</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">BTW nummer</label>
              <input className="input-field" type="text" placeholder="NL123456789B01" value={company.vat} onChange={e => handleChange("vat", e.target.value)} />
            </div>

            {/* Akkoord checkbox */}
            <label style={{ display:"flex", alignItems:"flex-start", gap:"0.625rem", marginBottom:"1.5rem", cursor:"pointer" }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop:3, accentColor:C.red }}
                required
              />
              <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray700, lineHeight:"var(--lh-body)" }}>
                Ik ga akkoord met de <button type="button" className="link-btn" style={{ fontSize:"0.85rem" }}>{t("pf_terms_link")}</button> {t("bf_agree_and")} <button type="button" className="link-btn" style={{ fontSize:"0.85rem" }}>{t("pf_privacy_link")}</button>
              </span>
            </label>

            <div className="reg-nav-bar">
              <BackButton onClick={onBack} />
              <button className="btn-red btn-full" type="submit">{t("ef_submit")}</button>
            </div>
          </form>

        </div>
        <div className="reg-sidebar">
          <RegSidebar
            planName="Enterprise"
            planPrice={t("ef_sidebar_price")}
            planPriceSuffix={t("ef_sidebar_suffix")}
            planFeatures={ENTERPRISE_FEATURES}
            planCta={t("ef_sidebar_cta")}
          />
        </div>
      </div>
    </div>
  )
}
