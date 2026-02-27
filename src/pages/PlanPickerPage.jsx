import { C } from '../tokens.js'
import { TopProgressBar, CheckItem, LangSwitcher } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import IOLogo from '../components/IOLogo.jsx'

// ─── Toggle component ───────────────────────────────────────────────────────
function PlanTypeToggle({ active, onChange, t }) {
  const opts = [
    { id: "personal", label: t("toggle_personal") },
    { id: "business", label: t("toggle_business") },
  ]
  return (
    <div style={{ display:"inline-flex", background:C.gray100, borderRadius:99, padding:3, gap:2 }}>
      {opts.map(o => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            padding:"0.5rem 1.5rem",
            borderRadius:99,
            border:"none",
            cursor:"pointer",
            fontFamily:"var(--font-sans)",
            fontSize:"0.875rem",
            fontWeight: active === o.id ? 700 : 500,
            color: active === o.id ? C.white : C.gray700,
            background: active === o.id ? C.green : "transparent",
            transition:"all 0.2s",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ─── PlanPickerPage ─────────────────────────────────────────────────────────
export default function PlanPickerPage({ onSelectPlan, onSwitchToBusiness, onBack }) {
  const { t } = useLang()

  const PLANS = [
    { id:"freemium", name:t("plan_freemium_name"), sub:t("plan_freemium_sub"), priceLabel:t("plan_freemium_price"), priceSuffix:"",                  priceNote:null,                   cta:t("plan_freemium_cta"), ctaNote:t("plan_freemium_note"), features:t("plan_freemium_features")||[] },
    { id:"trial",    name:t("plan_trial_name"),    sub:t("plan_trial_sub"),   priceLabel:t("plan_trial_price"),    priceSuffix:t("plan_trial_suffix"), priceNote:null,                   cta:t("plan_trial_cta"),   ctaNote:t("plan_trial_note"),   features:t("plan_trial_features")||[]   },
    { id:"pro",      name:t("plan_pro_name"),      sub:t("plan_pro_sub"),     priceLabel:t("plan_pro_price"),      priceSuffix:t("plan_pro_suffix"),   priceNote:t("plan_pro_price_note"), cta:t("plan_pro_cta"),     ctaNote:t("plan_pro_note"),     features:t("plan_pro_features")||[]     },
  ]

  function handleToggle(type) {
    if (type === "business") {
      onSwitchToBusiness()
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:C.white }}>
      <TopProgressBar total={4} current={1} />
      {/* Nav */}
      <header style={{ position:"sticky", top:4, zIndex:50, background:C.white, borderBottom:`1px solid ${C.gray100}`, boxShadow:"0 1px 6px rgba(12,24,46,0.06)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 1.5rem", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <IOLogo />
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            <LangSwitcher />
            <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, display:"flex", alignItems:"center", gap:"0.375rem" }}>
              ← {t("pf_back")}
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:"3rem 1.5rem 0" }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ display:"inline-block", background:C.gray100, borderRadius:99, padding:"0.3rem 1rem", fontFamily:"var(--font-sans)", fontSize:"0.8rem", fontWeight:600, color:C.gray500, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"1rem" }}>{t("sp_badge")}</div>
          <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,4vw,2.5rem)", fontWeight:700, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", color:C.navy, marginBottom:"1rem" }}>{t("sp_header")}</h1>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.5rem" }}>{t("sp_header_sub")}</p>

          {/* Toggle */}
          <PlanTypeToggle active="personal" onChange={handleToggle} t={t} />
        </div>

        {/* Plan kaarten */}
        <div className="sub-cards" style={{ marginTop:"2rem" }}>
          {PLANS.map(p => (
            <div key={p.id} className="sub-card">
              <div className="sub-card-zone-name">
                <div className="sub-card-name">{p.name}</div>
                <div className="sub-card-sub">{p.sub}</div>
              </div>
              <div className="sub-card-zone-price">
                <span className="sub-card-price">{p.priceLabel}</span>
                {p.priceSuffix && <span className="sub-card-price-suffix"> {p.priceSuffix}</span>}
                {p.priceNote && (
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, marginTop:"0.375rem", lineHeight:"var(--lh-body)" }}>
                    {p.priceNote}
                  </div>
                )}
              </div>
              <div className="sub-card-zone-cta">
                <button className="btn-red" onClick={() => onSelectPlan(p.id)}>{p.cta}</button>
                <p className="sub-card-note">{p.ctaNote}</p>
              </div>
              <div className="sub-card-zone-features">
                <div className="sub-card-features-title">{t("sp_features_title")}</div>
                {p.features.map((f,i) => <CheckItem key={i}>{f}</CheckItem>)}
              </div>
              <div className="sub-card-zone-bottom">
                <button className="btn-outline" onClick={() => alert(`POC: ${p.name}`)}>{t("sp_all_features")}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust footer */}
      <div style={{ background:C.gray50, marginTop:"3rem", padding:"3rem 1.5rem" }}>
        <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.25rem,3vw,1.75rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", marginBottom:"1rem" }}>
            {t("sp_trust_title")}
          </h2>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.5rem" }}>
            {t("sp_trust_body")}
          </p>
          <button className="btn-outline" style={{ padding:"0.875rem 2rem" }} onClick={onSwitchToBusiness}>
            {t("sp_trust_cta")}
          </button>
        </div>
      </div>
    </div>
  )
}
