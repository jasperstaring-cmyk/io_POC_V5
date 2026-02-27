import { C } from '../tokens.js'
import { TopProgressBar, CheckItem, LangSwitcher } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import IOLogo from '../components/IOLogo.jsx'

function PlanTypeToggle({ active, onChange, t }) {
  const opts = [
    { id: "personal", label: t("toggle_personal") },
    { id: "business", label: t("toggle_business") },
  ]
  return (
    <div style={{ display:"inline-flex", background:C.gray100, borderRadius:99, padding:3, gap:2 }}>
      {opts.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)}
          style={{ padding:"0.5rem 1.5rem", borderRadius:99, border:"none", cursor:"pointer", fontFamily:"var(--font-sans)", fontSize:"0.875rem", fontWeight: active===o.id?700:500, color: active===o.id?C.white:C.gray700, background: active===o.id?C.green:"transparent", transition:"all 0.2s" }}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function getBizPlans(t) {
  return [
    {
      id: "business",
      name: t("bpp_business_name"),
      sub: t("bpp_business_sub"),
      priceLines: [
        { text: t("bpp_business_price"), style:"big" },
        { text: t("bpp_business_suffix"), style:"suffix" },
      ],
      priceNote: null,
      cta: t("bpp_business_cta"),
      ctaNote: t("bpp_business_note"),
      badge: t("bpp_business_badge"),
      features: t("bpp_business_features"),
    },
    {
      id: "business_intl",
      name: t("bpp_intl_name"),
      sub: t("bpp_intl_sub"),
      priceLines: [
        { text: t("bpp_intl_price"), style:"big" },
        { text: t("bpp_intl_suffix"), style:"suffix" },
      ],
      priceNote: t("bpp_intl_price_note"),
      cta: t("bpp_intl_cta"),
      ctaNote: t("bpp_intl_note"),
      badge: null,
      features: t("bpp_intl_features"),
    },
    {
      id: "enterprise",
      name: t("bpp_enterprise_name"),
      sub: t("bpp_enterprise_sub"),
      priceLines: [
        { text: t("bpp_enterprise_price"), style:"big" },
      ],
      priceNote: null,
      cta: t("bpp_enterprise_cta"),
      ctaNote: t("bpp_enterprise_note"),
      badge: null,
      features: t("bpp_enterprise_features"),
    },
  ]
}

export default function BusinessPlanPickerPage({ onSelectPlan, onSwitchToPersonal, onBack }) {
  const { t } = useLang()
  const plans = getBizPlans(t)

  function handleToggle(type) {
    if (type === "personal") onSwitchToPersonal()
  }

  return (
    <div style={{ minHeight:"100vh", background:C.white }}>
      <TopProgressBar total={6} current={1} />
      <header style={{ position:"sticky", top:4, zIndex:50, background:C.white, borderBottom:`1px solid ${C.gray100}`, boxShadow:"0 1px 6px rgba(12,24,46,0.06)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 1.5rem", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <IOLogo />
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            <LangSwitcher />
            <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, display:"flex", alignItems:"center", gap:"0.375rem" }}>← {t("pf_back")}</button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:"3rem 1.5rem 0" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ display:"inline-block", background:C.gray100, borderRadius:99, padding:"0.3rem 1rem", fontFamily:"var(--font-sans)", fontSize:"0.8rem", fontWeight:600, color:C.gray500, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"1rem" }}>
            {t("bpp_title")}
          </div>
          <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,4vw,2.5rem)", fontWeight:700, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", color:C.navy, marginBottom:"1rem" }}>
            {t("choice_business")}
          </h1>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", maxWidth:640, margin:"0 auto 1.5rem" }}>
            {t("bpp_sub")}
          </p>
          <PlanTypeToggle active="business" onChange={handleToggle} t={t} />
        </div>

        <div className="sub-cards" style={{ marginTop:"2rem" }}>
          {plans.map(p => (
            <div key={p.id} className="sub-card" style={{ position:"relative" }}>
              {p.badge && (
                <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:C.green, color:C.navy, fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.04em", padding:"0.3rem 0.875rem", borderRadius:99, whiteSpace:"nowrap" }}>
                  {p.badge}
                </div>
              )}
              <div className="sub-card-zone-name">
                <div className="sub-card-name">{p.name}</div>
                <div className="sub-card-sub">{p.sub}</div>
              </div>
              <div className="sub-card-zone-price">
                {p.priceLines.map((line, i) => (
                  line.style === "big"
                    ? <span key={i} className="sub-card-price">{line.text}</span>
                    : <span key={i} className="sub-card-price-suffix"> {line.text}</span>
                ))}
                {p.priceNote && (
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, marginTop:"0.375rem", lineHeight:"var(--lh-body)" }}>{p.priceNote}</div>
                )}
              </div>
              <div className="sub-card-zone-cta">
                <button className="btn-red" onClick={() => onSelectPlan(p.id)}>{p.cta}</button>
                <p className="sub-card-note">{p.ctaNote}</p>
              </div>
              <div className="sub-card-zone-features">
                <div className="sub-card-features-title">{t("sidebar_features_label")}</div>
                {(p.features || []).map((f, i) => <CheckItem key={i}>{f}</CheckItem>)}
              </div>
              <div className="sub-card-zone-bottom">
                <button className="btn-outline" onClick={() => alert(`POC: ${p.name}`)}>
                  {t("lang") === "en" ? "Show all features" : "Toon alle features"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:C.gray50, marginTop:"3rem", padding:"3rem 1.5rem" }}>
        <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.25rem,3vw,1.75rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", marginBottom:"1rem" }}>
            {t("bpp_trust_title")}
          </h2>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.5rem" }}>
            {t("bpp_trust_body")}
          </p>
          <button className="btn-outline" style={{ padding:"0.875rem 2rem" }} onClick={onSwitchToPersonal}>
            {t("bpp_trust_cta")}
          </button>
        </div>
      </div>
    </div>
  )
}
