import { useState } from 'react'
import { C } from '../tokens.js'
import IOLogo from './IOLogo.jsx'
import { useLang } from '../LanguageContext.jsx'
import { img } from '../images.js'

// ─── TopProgressBar (rode balk bovenaan, full-width, fixed) ─────────────────
export function TopProgressBar({ total, current }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="top-progress-bar">
      <div className="top-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

// ─── EmailChip ────────────────────────────────────────────────────────────────
export function EmailChip({ email, onEdit }) {
  const { t } = useLang()
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:C.gray100, borderRadius:99, padding:"0.2rem 0.75rem", fontSize:"0.85rem", color:C.navy, fontWeight:500, marginBottom:"1.25rem" }}>
      {email}
      {onEdit && <button className="link-btn" style={{ fontSize:"0.75rem" }} onClick={onEdit}>{t("acc_edit")}</button>}
    </span>
  )
}

// ─── ProgressBar (inline, inside form — behouden als fallback) ───────────────
export function ProgressBar({ total, current }) {
  return (
    <div className="progress-bar">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`progress-seg${i < current ? " done" : ""}`} />
      ))}
    </div>
  )
}

// ─── SelectionRow ─────────────────────────────────────────────────────────────
export function SelectionRow({ selected, onSelect, name, desc, right, badge }) {
  return (
    <button className={`sel-row${selected ? " selected" : ""}`} onClick={onSelect}>
      <div className={`sel-dot${selected ? " checked" : ""}`}>
        {selected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <div className="sel-row-body" style={{ flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
          <div className="sel-row-name">{name}</div>
          <div style={{ display:"flex", alignItems:"baseline", gap:"0.625rem", marginLeft:"1rem" }}>
            {badge && <span style={{ fontFamily:"var(--font-sans)", fontWeight:700, fontSize:"0.75rem", color:C.green, background:"rgba(78,213,150,0.12)", border:`1px solid ${C.green}`, borderRadius:4, padding:"0.15rem 0.5rem", whiteSpace:"nowrap" }}>{badge}</span>}
            {right && <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1rem", color:C.navy, whiteSpace:"nowrap" }}>{right}</div>}
          </div>
        </div>
        {desc && <div className="sel-row-desc">{desc}</div>}
      </div>
    </button>
  )
}

// ─── JobRoleSelector (2-column card grid) ───────────────────────────────────
export function JobRoleSelector({ roles, selectedId, onSelect, t }) {
  return (
    <div className="jr-grid">
      {roles.map(r => {
        const isSelected = selectedId === r.id
        return (
          <button
            key={r.id}
            className={`jr-card${isSelected ? " selected" : ""}`}
            onClick={() => onSelect(r.id)}
          >
            <div className={`sel-dot${isSelected ? " checked" : ""}`}>
              {isSelected && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="jr-card-name">{t(`jr_${r.id}_name`)}</div>
              <div className="jr-card-desc">{t(`jr_${r.id}_desc`)}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ─── CheckItem ────────────────────────────────────────────────────────────────
export function CheckItem({ children }) {
  return (
    <div className="sub-check">
      <span className="sub-check-icon">✓</span>
      <span>{children}</span>
    </div>
  )
}

// ─── BackButton ───────────────────────────────────────────────────────────────
export function BackButton({ onClick }) {
  return (
    <button className="btn-back" onClick={onClick}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 4L6 8L10 12" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </button>
  )
}

// ─── LangSwitcher ─────────────────────────────────────────────────────────────
const LANG_LABELS = { nl: "Nederlands", en: "English", de: "Deutsch", fr: "Français" }

export function LangSwitcher() {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const LANGS = ["nl", "en", "de", "fr"]

  return (
    <div style={{ position:"relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display:"flex", alignItems:"center", gap:"0.5rem", background: open ? C.gray100 : C.gray50, border:`1px solid ${C.gray200}`, borderRadius:99, padding:"0.375rem 0.875rem", fontFamily:"var(--font-sans)", fontSize:"0.875rem", fontWeight:500, color:C.navy, cursor:"pointer", transition:"background 0.15s", whiteSpace:"nowrap" }}>
        {LANG_LABELS[lang]}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition:"transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <path d="M2 4l4 4 4-4" stroke={C.gray500} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <>
          <div style={{ position:"fixed", inset:0, zIndex:98 }} onClick={() => setOpen(false)} />
          <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, background:C.white, border:`1px solid ${C.gray200}`, borderRadius:8, boxShadow:"0 4px 20px rgba(12,24,46,0.12)", zIndex:99, minWidth:140, overflow:"hidden" }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => { setLang(l); setOpen(false) }}
                style={{ display:"block", width:"100%", textAlign:"left", padding:"0.625rem 1rem", fontFamily:"var(--font-sans)", fontSize:"0.875rem", fontWeight: lang === l ? 700 : 400, color: lang === l ? C.navy : C.gray700, background: lang === l ? C.gray50 : "transparent", border:"none", cursor:"pointer" }}>
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── AuthNav (met top:4px voor ruimte boven de rode progress bar) ────────────
export function AuthNav({ onBack }) {
  const { t } = useLang()
  return (
    <header style={{ position:"sticky", top:4, zIndex:50, background:"#fff", borderBottom:`1px solid ${C.gray100}`, height:56, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 2rem" }}>
      <div style={{ cursor: onBack ? "pointer" : "default" }} onClick={() => onBack && onBack()}>
        <IOLogo />
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
        <LangSwitcher />
        <button style={{ background:"none", border:"none", fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, cursor:"pointer" }}>{t("nav_help")}</button>
      </div>
    </header>
  )
}

// ─── RegSidebar ───────────────────────────────────────────────────────────────
export function RegSidebar({ planName, planPrice, planPriceSuffix, planFeatures, planCta, savingsPerYear }) {
  const { t } = useLang()
  const usps = t("sidebar_usps")
  const showPlan = planName && planName.length > 0
  const features = planFeatures || (Array.isArray(usps) ? usps : [])

  return (
    <>
      {/* Visual */}
      <div style={{ borderRadius:10, marginBottom:"1rem", overflow:"hidden", minHeight:120, position:"relative" }}>
        {img("reg_sidebar") ? (
          <img src={img("reg_sidebar")} alt="" style={{ width:"100%", height:180, objectFit:"cover", display:"block", borderRadius:10 }} />
        ) : (
          <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,#1B3A5C 100%)`, borderRadius:10, padding:"1.5rem", display:"flex", alignItems:"center", justifyContent:"center", minHeight:120, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.04)", top:-60, right:-60 }}/>
            <div style={{ width:160, height:100, background:"rgba(255,255,255,0.08)", borderRadius:6, padding:8, border:"1px solid rgba(255,255,255,0.12)", position:"relative", zIndex:1 }}>
              <div style={{ background:"rgba(255,255,255,0.15)", height:14, borderRadius:3, marginBottom:6 }}/>
              <div style={{ background:"rgba(255,255,255,0.08)", height:3, borderRadius:2, marginBottom:4, width:"80%" }}/>
              <div style={{ background:"rgba(255,255,255,0.08)", height:3, borderRadius:2, marginBottom:4, width:"65%" }}/>
              <div style={{ background:"rgba(255,255,255,0.08)", height:3, borderRadius:2, width:"75%" }}/>
              <div style={{ position:"absolute", bottom:-10, right:-10, width:44, height:72, background:"rgba(255,255,255,0.1)", borderRadius:6, border:"1px solid rgba(255,255,255,0.15)", padding:4 }}>
                <div style={{ background:"rgba(255,255,255,0.15)", height:8, borderRadius:2, marginBottom:3 }}/>
                <div style={{ background:"rgba(255,255,255,0.08)", height:2, borderRadius:1, marginBottom:2 }}/>
                <div style={{ background:"rgba(255,255,255,0.08)", height:2, borderRadius:1, width:"70%" }}/>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Plan info / USPs */}
      <div className="reg-sidebar-card">
        {showPlan ? (
          <>
            {/* Gekozen plan dropdown-stijl */}
            <div style={{ border:`1.5px solid ${C.gray200}`, borderRadius:6, padding:"0.75rem 1rem", marginBottom:"1rem" }}>
              <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.25rem" }}>
                {t("sidebar_plan_label")}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1.125rem", color:C.navy }}>{planName}</div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke={C.gray500} strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
            </div>

            {/* Prijs */}
            {planPrice && (
              <div style={{ marginBottom:"1rem" }}>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.25rem" }}>
                  {t("sidebar_price_label")}
                </div>
                <div style={{ display:"flex", alignItems:"baseline", gap:"0.5rem" }}>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"1.75rem", fontWeight:700, color:C.navy, lineHeight:1 }}>
                    {planPrice}
                  </span>
                  {planPriceSuffix && (
                    <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500 }}>
                      {planPriceSuffix}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Groene CTA banner */}
            {planCta && (
              <div style={{ background:C.green, borderRadius:8, padding:"0.875rem 1rem", marginBottom:"1.25rem", fontFamily:"var(--font-sans)", fontSize:"0.875rem", fontWeight:700, color:C.navy, textAlign:"center" }}>
                {planCta}
              </div>
            )}

            {/* Features */}
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.75rem" }}>
              {t("sidebar_features_label")}
            </div>
          </>
        ) : (
          <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.75rem" }}>
            {t("sidebar_usp_title")}
          </div>
        )}
        {features.map((b, i) => (
          <div key={i} style={{ display:"flex", gap:"0.5rem", alignItems:"flex-start", marginBottom:"0.5rem" }}>
            <span style={{ color:C.red, fontSize:"0.875rem", marginTop:2, flexShrink:0 }}>✓</span>
            <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy }}>{b}</span>
          </div>
        ))}
      </div>

      {/* Savings block */}
      {savingsPerYear > 0 && (
        <div className="reg-sidebar-card" style={{ background:"rgba(78,213,150,0.08)", border:`1.5px solid ${C.green}` }}>
          <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.green, marginBottom:"0.5rem" }}>
            {t("sidebar_savings_label")}
          </div>
          <div style={{ display:"flex", alignItems:"baseline", gap:"0.375rem" }}>
            <span style={{ fontFamily:"var(--font-sans)", fontSize:"1.5rem", fontWeight:800, color:C.green, lineHeight:1 }}>
              € {savingsPerYear.toLocaleString("nl-NL")},–
            </span>
            <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray700 }}>
              {t("sidebar_savings_suffix")}
            </span>
          </div>
        </div>
      )}

      {/* Kom je er niet uit */}
      <div className="reg-sidebar-card" style={{ background:C.gray50 }}>
        <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", fontWeight:600, color:C.navy, marginBottom:"0.75rem" }}>{t("sidebar_help_title")}</div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <div style={{ width:40, height:40, borderRadius:"50%", flexShrink:0, background:C.gray200, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.7 0 4-1.8 4-4s-1.3-4-4-4-4 1.8-4 4 1.3 4 4 4zm0 2c-4 0-6 2-6 3.5h12c0-1.5-2-3.5-6-3.5z" fill="#8A8A82"/></svg>
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray700 }}>{t("sidebar_help_cta")}</div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── CDP Product Label ────────────────────────────────────────────────────────
export function CdpProductLabel({ productName, edition }) {
  const { t } = useLang()
  if (!productName) return null
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", gap:"0.625rem", flexWrap:"wrap",
      background:"#F0F0FF", border:"1.5px dashed #7B7BEE", borderRadius:8,
      padding:"0.625rem 1rem", marginTop:"1.25rem",
      fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:"#4A4AB5",
    }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="3" stroke="#7B7BEE" strokeWidth="1.5"/><path d="M5 8h6M8 5v6" stroke="#7B7BEE" strokeWidth="1.5" strokeLinecap="round"/></svg>
      <span><strong>{t("cdp_product_label")}:</strong> {productName}</span>
      {edition && <span style={{ borderLeft:"1px solid #B3B3EE", paddingLeft:"0.5rem" }}>{t("cdp_edition_label")}: <strong>{edition}</strong></span>}
    </div>
  )
}
