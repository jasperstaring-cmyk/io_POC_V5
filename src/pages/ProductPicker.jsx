import { C } from '../tokens.js'
import { TopProgressBar, CheckItem, LangSwitcher } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import IOLogo from '../components/IOLogo.jsx'
import { img } from '../images.js'

/* ═══════════════════════════════════════════════════════════════════════════════
   ProductPicker — universele picker-component, mode-gestuurd
   
   Modes:
     personal          → Gratis account, 10-daagse Premium, Premium abonnement
     business_default  → Business (lokaal) + Enterprise hint
     business_intl     → Business (lokaal) + Business International + Enterprise
     business_paid     → Betaalde Business S/M/L/XL + Enterprise hint
   
   Elke mode wordt opgebouwd door getPlansForMode() die een array van
   kaart-configuraties retourneert. De component zelf is een "domme" renderer.
   
   Toekomstig: voeg modes toe voor campagnes, A/B tests, upgrades, etc.
   zonder het component aan te raken.
   ═══════════════════════════════════════════════════════════════════════════════ */

// ─── Toggle component (Personal / Business) ──────────────────────────────────
function PlanTypeToggle({ active, onChange, t }) {
  const opts = [
    { id: "personal", label: t("toggle_personal") },
    { id: "business", label: t("toggle_business") },
  ]
  return (
    <div style={{ display:"inline-flex", background:C.gray100, borderRadius:99, padding:3, gap:2 }}>
      {opts.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)}
          style={{
            padding:"0.5rem 1.5rem", borderRadius:99, border:"none", cursor:"pointer",
            fontFamily:"var(--font-sans)", fontSize:"0.875rem",
            fontWeight: active===o.id ? 700 : 500,
            color: active===o.id ? C.white : C.gray700,
            background: active===o.id ? C.green : "transparent",
            transition:"all 0.2s",
          }}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ─── Plan configuration per mode ─────────────────────────────────────────────
export function getPlansForMode(mode, context, t) {
  const { segment } = context || {}
  const isWealth = segment === "wealth" || segment === "institutional"

  switch (mode) {
    // ── Personal: Gratis account, 10-daagse Premium, Premium abonnement ──
    case "personal":
      return [
        {
          id: "freemium",
          name: t("plan_freemium_name"),
          sub: t("plan_freemium_sub"),
          priceLines: [{ text: t("plan_freemium_price"), style:"big" }],
          priceNote: null,
          cta: t("plan_freemium_cta"),
          ctaNote: t("plan_freemium_note"),
          badge: null,
          features: t("plan_freemium_features") || [],
          highlight: false,
        },
        {
          id: "trial",
          name: t("plan_trial_name"),
          sub: t("plan_trial_sub"),
          priceLines: [
            { text: t("plan_trial_price"), style:"big" },
            { text: t("plan_trial_suffix"), style:"suffix" },
          ],
          priceNote: null,
          cta: t("plan_trial_cta"),
          ctaNote: t("plan_trial_note"),
          badge: null,
          features: t("plan_trial_features") || [],
          highlight: false,
        },
        {
          id: "pro",
          name: t("plan_pro_name"),
          sub: t("plan_pro_sub"),
          priceLines: [
            { text: t("plan_pro_price"), style:"big" },
            { text: t("plan_pro_suffix"), style:"suffix" },
          ],
          priceNote: t("plan_pro_price_note"),
          cta: t("plan_pro_cta"),
          ctaNote: t("plan_pro_note"),
          badge: null,
          features: t("plan_pro_features") || [],
          highlight: false,
        },
      ]

    // ── Business default: Business (lokaal) + Enterprise ──
    case "business_default":
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
          highlight: true,
        },
        {
          id: "enterprise",
          name: t("bpp_enterprise_name"),
          sub: t("bpp_enterprise_sub"),
          priceLines: [{ text: t("bpp_enterprise_price"), style:"big" }],
          priceNote: null,
          cta: t("bpp_enterprise_cta"),
          ctaNote: t("bpp_enterprise_note"),
          badge: null,
          features: t("bpp_enterprise_features"),
          highlight: false,
        },
      ]

    // ── Business international: Business (lokaal) + International + Enterprise ──
    case "business_intl":
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
          badge: null,
          features: t("bpp_business_features"),
          highlight: false,
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
          badge: isWealth ? t("bpp_business_badge") : t("pp_recommended"),
          features: t("bpp_intl_features"),
          highlight: true,
        },
        {
          id: "enterprise",
          name: t("bpp_enterprise_name"),
          sub: t("bpp_enterprise_sub"),
          priceLines: [{ text: t("bpp_enterprise_price"), style:"big" }],
          priceNote: null,
          cta: t("bpp_enterprise_cta"),
          ctaNote: t("bpp_enterprise_note"),
          badge: null,
          features: t("bpp_enterprise_features"),
          highlight: false,
        },
      ]

    // ── Business paid (trial-blokkade): betaalde pakketten + Enterprise ──
    case "business_paid":
      return [
        {
          id: "business",
          name: t("bpp_business_name"),
          sub: t("bpp_business_sub"),
          priceLines: [
            { text: t("bpp_business_price_paid") || t("bpp_intl_price"), style:"big" },
            { text: t("bpp_intl_suffix"), style:"suffix" },
          ],
          priceNote: t("bpp_intl_price_note"),
          cta: t("bpp_business_cta"),
          ctaNote: t("bf_trial_blocked_avail_body"),
          badge: t("pp_recommended"),
          features: t("bpp_business_features"),
          highlight: true,
        },
        {
          id: "enterprise",
          name: t("bpp_enterprise_name"),
          sub: t("bpp_enterprise_sub"),
          priceLines: [{ text: t("bpp_enterprise_price"), style:"big" }],
          priceNote: null,
          cta: t("bpp_enterprise_cta"),
          ctaNote: t("bpp_enterprise_note"),
          badge: null,
          features: t("bpp_enterprise_features"),
          highlight: false,
        },
      ]

    default:
      return []
  }
}

// ─── Helpers for mode metadata ───────────────────────────────────────────────
function getModeConfig(mode, t) {
  const isBusinessMode = mode !== "personal"
  return {
    toggleActive: isBusinessMode ? "business" : "personal",
    badge: isBusinessMode ? t("bpp_title") : t("sp_badge"),
    title: isBusinessMode ? t("choice_business") : t("sp_header"),
    subtitle: isBusinessMode ? t("bpp_sub") : t("sp_header_sub"),
    trustTitle: isBusinessMode ? t("bpp_trust_title") : t("sp_trust_title"),
    trustBody: isBusinessMode ? t("bpp_trust_body") : t("sp_trust_body"),
    trustCta: isBusinessMode ? t("bpp_trust_cta") : t("sp_trust_cta"),
    showBusinessBanner: mode === "personal",
  }
}

// ─── Business banner (op personal picker) ────────────────────────────────────
function BusinessBanner({ onSwitchToBusiness, t }) {
  return (
    <div className="sub-banner" style={{ maxWidth:900, margin:"0 auto 2rem" }}>
      <div style={{ flex:1 }}>
        <h3 style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1.0625rem", lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", color:C.navy, marginBottom:"0.5rem" }}>
          {t("sp_biz_title")}
        </h3>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray700, lineHeight:"var(--lh-body)", marginBottom:"1rem" }}>
          {t("sp_biz_body")}
        </p>
        <button className="btn-primary" style={{ padding:"0.625rem 1.5rem" }} onClick={onSwitchToBusiness}>
          {t("sp_biz_cta")}
        </button>
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
  )
}

// ─── Plan card ───────────────────────────────────────────────────────────────
function PlanCard({ plan, onSelect, t }) {
  return (
    <div className="sub-card" style={{ position:"relative" }}>
      {plan.badge && (
        <div style={{
          position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)",
          background: plan.highlight ? C.green : C.gray200,
          color: plan.highlight ? C.navy : C.gray700,
          fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.04em",
          padding:"0.3rem 0.875rem", borderRadius:99, whiteSpace:"nowrap",
        }}>
          {plan.badge}
        </div>
      )}
      <div className="sub-card-zone-name">
        <div className="sub-card-name">{plan.name}</div>
        <div className="sub-card-sub">{plan.sub}</div>
      </div>
      <div className="sub-card-zone-price">
        {plan.priceLines.map((line, i) => (
          line.style === "big"
            ? <span key={i} className="sub-card-price">{line.text}</span>
            : <span key={i} className="sub-card-price-suffix"> {line.text}</span>
        ))}
        {plan.priceNote && (
          <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, marginTop:"0.375rem", lineHeight:"var(--lh-body)" }}>
            {plan.priceNote}
          </div>
        )}
      </div>
      <div className="sub-card-zone-cta">
        <button className="btn-red" onClick={() => onSelect(plan.id)}>{plan.cta}</button>
        <p className="sub-card-note">{plan.ctaNote}</p>
      </div>
      <div className="sub-card-zone-features">
        <div className="sub-card-features-title">{t("sidebar_features_label") || t("sp_features_title")}</div>
        {(plan.features || []).map((f, i) => <CheckItem key={i}>{f}</CheckItem>)}
      </div>
      <div className="sub-card-zone-bottom">
        <button className="btn-outline" onClick={() => alert(`POC: ${plan.name}`)}>
          {t("sp_all_features")}
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main ProductPicker component
// ═══════════════════════════════════════════════════════════════════════════════
export default function ProductPicker({
  mode = "personal",
  context = {},
  onSelectPlan,
  onSwitchToPersonal,
  onSwitchToBusiness,
  onBack,
  progressTotal,
  progressCurrent,
}) {
  const { t } = useLang()
  const plans = getPlansForMode(mode, context, t)
  const config = getModeConfig(mode, t)

  function handleToggle(type) {
    if (type === "personal" && onSwitchToPersonal) onSwitchToPersonal()
    if (type === "business" && onSwitchToBusiness) onSwitchToBusiness()
  }

  return (
    <div style={{ minHeight:"100vh", background:C.white }}>
      {/* Progress bar */}
      {progressTotal && <TopProgressBar total={progressTotal} current={progressCurrent || 1} />}

      {/* Header nav */}
      <header style={{ position:"sticky", top: progressTotal ? 4 : 0, zIndex:50, background:C.white, borderBottom:`1px solid ${C.gray100}`, boxShadow:"0 1px 6px rgba(12,24,46,0.06)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 1.5rem", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <IOLogo />
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            <LangSwitcher />
            {onBack && (
              <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, display:"flex", alignItems:"center", gap:"0.375rem" }}>
                ← {t("pf_back")}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth:1060, margin:"0 auto", padding:"3rem 1.5rem 0" }}>
        {/* Title block */}
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ display:"inline-block", background:C.gray100, borderRadius:99, padding:"0.3rem 1rem", fontFamily:"var(--font-sans)", fontSize:"0.8rem", fontWeight:600, color:C.gray500, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"1rem" }}>
            {config.badge}
          </div>
          <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,4vw,2.5rem)", fontWeight:700, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", color:C.navy, marginBottom:"1rem" }}>
            {config.title}
          </h1>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", maxWidth:640, margin:"0 auto 1.5rem" }}>
            {config.subtitle}
          </p>

          {/* Toggle */}
          <PlanTypeToggle active={config.toggleActive} onChange={handleToggle} t={t} />
        </div>

        {/* Business banner (only on personal mode) */}
        {config.showBusinessBanner && onSwitchToBusiness && (
          <BusinessBanner onSwitchToBusiness={onSwitchToBusiness} t={t} />
        )}

        {/* Plan cards */}
        <div className={plans.length <= 2 ? "sub-cards-2" : "sub-cards"} style={{ marginTop:"2rem" }}>
          {plans.map(p => (
            <PlanCard key={p.id} plan={p} onSelect={onSelectPlan} t={t} />
          ))}
        </div>
      </div>

      {/* Trust footer */}
      <div style={{ background:C.gray50, marginTop:"3rem", padding:"3rem 1.5rem" }}>
        <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.25rem,3vw,1.75rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", marginBottom:"1rem" }}>
            {config.trustTitle}
          </h2>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.5rem" }}>
            {config.trustBody}
          </p>
          <button className="btn-outline" style={{ padding:"0.875rem 2rem" }} onClick={() => {
            if (mode === "personal" && onSwitchToBusiness) onSwitchToBusiness()
            else if (onSwitchToPersonal) onSwitchToPersonal()
          }}>
            {config.trustCta}
          </button>
        </div>
      </div>
    </div>
  )
}
