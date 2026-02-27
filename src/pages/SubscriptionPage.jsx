import { C } from '../tokens.js'
import TopNav from '../components/TopNav.jsx'
import { CheckItem } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import { img } from '../images.js'

// ─── Gedeelde plandata builder ─────────────────────────────────────────────────
export function buildPlans(t) {
  return [
    { id:"freemium", name:t("plan_freemium_name"), sub:t("plan_freemium_sub"), priceLabel:t("plan_freemium_price"), priceSuffix:"",                  cta:t("plan_freemium_cta"), ctaNote:t("plan_freemium_note"), features:t("plan_freemium_features")||[] },
    { id:"trial",    name:t("plan_trial_name"),    sub:t("plan_trial_sub"),   priceLabel:t("plan_trial_price"),    priceSuffix:t("plan_trial_suffix"), cta:t("plan_trial_cta"),   ctaNote:t("plan_trial_note"),   features:t("plan_trial_features")||[]   },
    { id:"pro",      name:t("plan_pro_name"),      sub:t("plan_pro_sub"),     priceLabel:t("plan_pro_price"),      priceSuffix:t("plan_pro_suffix"),   cta:t("plan_pro_cta"),     ctaNote:t("plan_pro_note"),     features:t("plan_pro_features")||[]     },
  ]
}

// ─── Gedeelde PlanCards component ─────────────────────────────────────────────
export function PlanCards({ onSelect }) {
  const { t } = useLang()
  const plans = buildPlans(t)
  return (
    <div className="sub-cards">
      {plans.map(p => (
        <div key={p.id} className="sub-card">
          <div className="sub-card-zone-name">
            <div className="sub-card-name">{p.name}</div>
            <div className="sub-card-sub">{p.sub}</div>
          </div>
          <div className="sub-card-zone-price">
            <span className="sub-card-price">{p.priceLabel}</span>
            {p.priceSuffix && <span className="sub-card-price-suffix"> {p.priceSuffix}</span>}
          </div>
          <div className="sub-card-zone-cta">
            <button className="btn-red" onClick={() => onSelect(p.id)}>{p.cta}</button>
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
  )
}

// ─── Volledige SubscriptionPage ────────────────────────────────────────────────
export default function SubscriptionPage({ onStartReg, onLogin }) {
  const { t } = useLang()
  return (
    <div className="sub-page">
      <TopNav onLogin={onLogin} onSubscribe={() => {}} loggedIn={false} />
      <div style={{ maxWidth:900, margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>
        <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
          <div style={{ display:"inline-block", background:C.gray100, borderRadius:99, padding:"0.3rem 1rem", fontFamily:"var(--font-sans)", fontSize:"0.8rem", fontWeight:600, color:C.gray500, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"1rem" }}>{t("sp_badge")}</div>
          <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,4vw,2.5rem)", fontWeight:700, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", color:C.navy, marginBottom:"1rem" }}>{t("sp_header")}</h1>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)" }}>{t("sp_header_sub")}</p>
        </div>
        <div className="sub-banner">
          <div style={{ flex:1 }}>
            <h3 style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1.0625rem", lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", color:C.navy, marginBottom:"0.5rem" }}>{t("sp_biz_title")}</h3>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray700, lineHeight:"var(--lh-body)", marginBottom:"1rem" }}>{t("sp_biz_body")}</p>
            <button className="btn-primary" style={{ padding:"0.625rem 1.5rem" }} onClick={() => onStartReg("business")}>{t("sp_biz_cta")}</button>
          </div>
          <div style={{ width:160, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {img("subscription_biz_visual") ? (
              <img src={img("subscription_biz_visual")} alt="" style={{ width:140, height:90, objectFit:"cover", borderRadius:8, boxShadow:"0 8px 24px rgba(12,24,46,0.2)" }} />
            ) : (
              <div style={{ width:140, height:90, background:`linear-gradient(135deg,${C.navy},${C.navyMid})`, borderRadius:8, position:"relative", boxShadow:"0 8px 24px rgba(12,24,46,0.2)" }}>
                <div style={{ position:"absolute", inset:8, border:"1px solid rgba(255,255,255,0.15)", borderRadius:4 }}/>
                <div style={{ position:"absolute", bottom:12, left:12, right:12 }}>
                  {[70,50,60].map((w,i) => <div key={i} style={{ height:3, width:`${w}%`, background:"rgba(255,255,255,0.3)", borderRadius:2, marginBottom:4 }}/>)}
                </div>
              </div>
            )}
          </div>
          <div className="sub-banner-badge">{t("sp_biz_badge")}</div>
        </div>
        <p style={{ textAlign:"center", fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray500, marginBottom:"2rem", lineHeight:"var(--lh-body)" }}>{t("sp_personal_intro")}</p>
        <PlanCards onSelect={id => onStartReg("personal_" + id)} />
      </div>
    </div>
  )
}
