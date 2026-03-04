import { useState } from 'react'
import { C } from '../tokens.js'
import { JOB_ROLES, getActiveBanners } from '../data.js'
import IOLogo from '../components/IOLogo.jsx'
import { LangSwitcher } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import { img } from '../images.js'
import EnterpriseAccessPage from '../components/EnterpriseAccessPage.jsx'

function initials(first, last) {
  return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase()
}

// ─── Top Nav ──────────────────────────────────────────────────────────────────
function AccountTopNav({ firstName, lastName, onBack }) {
  return (
    <header style={{ position:"sticky", top:0, zIndex:50, background:C.white, borderBottom:`1px solid ${C.gray100}`, boxShadow:"0 1px 6px rgba(12,24,46,0.06)" }}>
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 1.5rem", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <IOLogo />
        <div style={{ display:"flex", alignItems:"center", gap:"1.25rem" }}>
          <LangSwitcher />
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", cursor:"pointer" }} onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={C.gray300} strokeWidth="1.5"/><path d="M12 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 10c-4 0-6 2-6 3h12c0-1-2-3-6-3z" fill={C.gray300}/></svg>
            <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", fontWeight:600, color:C.navy }}>{firstName} {lastName}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function NavIcon({ type, active, disabled }) {
  const color = disabled ? C.gray300 : active ? C.navy : C.gray500
  const icons = {
    person:  <path d="M12 12c2.7 0 4-1.8 4-4s-1.3-4-4-4-4 1.8-4 4 1.3 4 4 4zm0 2c-4 0-6 2-6 3.5h12c0-1.5-2-3.5-6-3.5z" fill={color}/>,
    bell:    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.6-4.5-6.3V4c0-.8-.7-1.5-1.5-1.5S10.5 3.2 10.5 4v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z" fill={color}/>,
    card:    <><rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" fill="none"/><path d="M2 10h20" stroke={color} strokeWidth="1.5"/></>,
    people:  <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5c0-2.3-4.7-3.5-7-3.5zm8 0c-.3 0-.6 0-1 .1 1.2.9 2 2.1 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z" fill={color}/>,
    billing: <><rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5" fill="none"/><path d="M7 8h10M7 12h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    shield:  <path d="M12 2L4 6v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6l-8-4zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 10c-2.3 0-4.3-1.2-5.5-3 1.2-1.8 3.2-3 5.5-3s4.3 1.2 5.5 3c-1.2 1.8-3.2 3-5.5 3z" fill={color}/>,
  }
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{icons[type]}</svg>
}

function Sidebar({ active, onNav }) {
  const { t } = useLang()
  const NAV_ITEMS = [
    { id:"account",      label: t("acc_my_account"),    icon:"person"  },
    { id:"nieuwsbrief",  label: t("acc_newsletter"),    icon:"bell"    },
    { id:"abonnementen", label: t("acc_subscriptions"), icon:"card"    },
    { id:"gebruikers",   label: t("acc_users"),         icon:"people"  },
    { id:"facturatie",   label: t("acc_billing"),       icon:"billing" },
    { id:"enterprise",    label: t("acc_enterprise_access"), icon:"shield",  enterprise: true },
  ]
  return (
    <div style={{ width:260, flexShrink:0 }}>
      <div style={{ background:C.white, borderRadius:10, padding:"1.5rem", boxShadow:"0 2px 16px rgba(12,24,46,0.06)" }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)}
            style={{ display:"flex", alignItems:"center", gap:"0.75rem", width:"100%", padding:"0.625rem 0.75rem", borderRadius:6, border:"none", background: active===item.id ? (item.enterprise ? "rgba(224,27,65,0.06)" : C.gray50) : "transparent", cursor:"pointer", marginBottom:"0.25rem", textAlign:"left" }}>
            <NavIcon type={item.icon} active={active===item.id} disabled={false} />
            <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", fontWeight: active===item.id ? 700 : 400, color: item.enterprise ? C.red : (active===item.id ? C.navy : C.gray700) }}>
              {item.label}
            </span>
          </button>
        ))}
        <div style={{ borderTop:`1px solid ${C.gray100}`, marginTop:"0.75rem", paddingTop:"0.75rem" }}>
          <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.red, marginBottom:"0.5rem" }}>{t("acc_help")}</div>
          <button style={{ display:"flex", alignItems:"center", gap:"0.625rem", background:"none", border:"none", cursor:"pointer", padding:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.7 0 4-1.8 4-4s-1.3-4-4-4-4 1.8-4 4 1.3 4 4 4zm0 2c-4 0-6 2-6 3.5h12c0-1.5-2-3.5-6-3.5z" fill={C.gray500}/></svg>
            <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray700 }}>{t("acc_contact")}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ReadField({ label, value }) {
  return (
    <div style={{ border:`1px solid ${C.gray200}`, borderRadius:6, padding:"0.75rem 1rem", marginBottom:"0.5rem" }}>
      <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.25rem" }}>{label}</div>
      <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.navy }}>{value || "—"}</div>
    </div>
  )
}

function SectionCard({ title, subtitle, onEdit, editing, children }) {
  const { t } = useLang()
  return (
    <div style={{ background:C.white, borderRadius:10, padding:"1.75rem", boxShadow:"0 2px 16px rgba(12,24,46,0.06)", marginBottom:"1.25rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.25rem" }}>
        <div>
          <h2 style={{ fontFamily:"var(--font-sans)", fontSize:"1.375rem", fontWeight:800, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"0.375rem" }}>{title}</h2>
          {subtitle && <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, lineHeight:"var(--lh-body)", maxWidth:600 }}>{subtitle}</p>}
        </div>
        {onEdit && !editing && (
          <button className="btn-secondary" style={{ padding:"0.4rem 1rem", fontSize:"0.875rem", flexShrink:0, marginLeft:"1rem" }} onClick={onEdit}>{t("acc_edit")}</button>
        )}
      </div>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <div onClick={onChange} style={{ width:48, height:26, borderRadius:13, background: checked ? C.green : C.gray300, cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left: checked ? 25 : 3, width:20, height:20, borderRadius:"50%", background:C.white, boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"left 0.2s" }}/>
    </div>
  )
}

// ─── Account sectie ───────────────────────────────────────────────────────────
function AccountSection({ user, onUpdate }) {
  const { t } = useLang()
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingContact, setEditingContact] = useState(false)
  const [profile, setProfile] = useState({ firstName: user.firstName, lastName: user.lastName, initials: user.initials || "", jobRole: user.jobRole || "", language: t("acc_lang_options")[0] })
  const [contact, setContact] = useState({ email: user.email, phone: "" })

  function saveProfile() { onUpdate({ ...user, ...profile }); setEditingProfile(false) }
  function saveContact() { setEditingContact(false) }

  return (
    <>
      <SectionCard title={t("acc_profile_title")} subtitle={t("acc_profile_sub")} onEdit={() => setEditingProfile(true)} editing={editingProfile}>
        {editingProfile ? (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
              <div className="input-group"><label className="input-label">{t("pf_firstname")}</label><input className="input-field" value={profile.firstName} onChange={e => setProfile(p => ({...p, firstName:e.target.value}))} /></div>
              <div className="input-group"><label className="input-label">{t("pf_lastname")}</label><input className="input-field" value={profile.lastName} onChange={e => setProfile(p => ({...p, lastName:e.target.value}))} /></div>
            </div>
            <div className="input-group"><label className="input-label">{t("acc_initials")}</label><input className="input-field" value={profile.initials} onChange={e => setProfile(p => ({...p, initials:e.target.value}))} /></div>
            <div className="input-group">
              <label className="input-label">{t("acc_jobrole")}</label>
              <select className="input-field" value={profile.jobRole} onChange={e => setProfile(p => ({...p, jobRole:e.target.value}))}>
                {JOB_ROLES.map(r => <option key={r.id} value={r.id}>{t(`jr_${r.id}_name`)}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">{t("acc_lang_pref")}</label>
              <select className="input-field" value={profile.language} onChange={e => setProfile(p => ({...p, language:e.target.value}))}>
                {(t("acc_lang_options") || []).map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem" }}>
              <button className="btn-navy" onClick={saveProfile}>{t("acc_save")}</button>
              <button className="btn-secondary" onClick={() => setEditingProfile(false)}>{t("acc_cancel")}</button>
            </div>
          </>
        ) : (
          <>
            <ReadField label={t("pf_firstname")} value={profile.firstName} />
            <ReadField label={t("pf_lastname")} value={profile.lastName} />
            <ReadField label={t("acc_initials")} value={profile.initials} />
            <ReadField label={t("acc_jobrole")} value={profile.jobRole ? t(`jr_${profile.jobRole}_name`) : ""} />
            <ReadField label={t("acc_lang_pref")} value={profile.language} />
          </>
        )}
      </SectionCard>

      <SectionCard title={t("acc_contact_title")} subtitle={t("acc_contact_sub")} onEdit={() => setEditingContact(true)} editing={editingContact}>
        {editingContact ? (
          <>
            <div className="input-group"><label className="input-label">{t("lm_email_label")}</label><input className="input-field" value={contact.email} onChange={e => setContact(c => ({...c, email:e.target.value}))} /></div>
            <div className="input-group"><label className="input-label">{t("acc_phone")}</label><input className="input-field" placeholder="+31 6 00000000" value={contact.phone} onChange={e => setContact(c => ({...c, phone:e.target.value}))} /></div>
            <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem" }}>
              <button className="btn-navy" onClick={saveContact}>{t("acc_save")}</button>
              <button className="btn-secondary" onClick={() => setEditingContact(false)}>{t("acc_cancel")}</button>
            </div>
          </>
        ) : (
          <>
            <ReadField label={t("lm_email_label")} value={contact.email} />
            <ReadField label={t("acc_phone")} value={contact.phone} />
            <ReadField label={t("acc_initials")} value={profile.initials} />
          </>
        )}
      </SectionCard>
    </>
  )
}

// ─── Nieuwsbrief sectie ───────────────────────────────────────────────────────
function NewsletterSection() {
  const { t } = useLang()
  const editions = t("acc_nl_editions") || ["Nederland","Luxemburg","België"]
  const newsletters = t("acc_newsletters") || []
  const [activeTab, setActiveTab] = useState(editions[0])
  const initSubs = {}
  editions.forEach(ed => {
    initSubs[ed] = {}
    newsletters.forEach(nl => { initSubs[ed][nl.id] = true })
  })
  initSubs[editions[1]] = { daily:false, editors:true, research:false, partner:false }
  initSubs[editions[2]] = { daily:true,  editors:false,research:true,  partner:false }
  const [subs, setSubs] = useState(initSubs)

  function toggle(id) {
    setSubs(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], [id]: !prev[activeTab][id] } }))
  }

  return (
    <div style={{ background:C.white, borderRadius:10, padding:"1.75rem", boxShadow:"0 2px 16px rgba(12,24,46,0.06)" }}>
      <h2 style={{ fontFamily:"var(--font-sans)", fontSize:"1.375rem", fontWeight:800, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"0.375rem" }}>{t("acc_nl_title")}</h2>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.5rem", maxWidth:700 }}>{t("acc_nl_sub")}</p>
      <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${C.gray200}`, marginBottom:"1.25rem" }}>
        {editions.map(ed => (
          <button key={ed} onClick={() => setActiveTab(ed)}
            style={{ background:"none", border:"none", borderBottom:`2px solid ${activeTab===ed ? C.navy : "transparent"}`, padding:"0.5rem 1.25rem", fontFamily:"var(--font-sans)", fontSize:"0.9rem", fontWeight: activeTab===ed ? 700 : 400, color: activeTab===ed ? C.navy : C.gray500, cursor:"pointer", marginBottom:"-1px", transition:"color 0.15s, border-color 0.15s" }}>
            {ed}
          </button>
        ))}
      </div>
      {newsletters.map(nl => (
        <div key={nl.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", border:`1px solid ${C.gray200}`, borderRadius:6, padding:"1rem 1.25rem", marginBottom:"0.625rem" }}>
          <div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", fontWeight:700, color:C.navy, marginBottom:"0.2rem" }}>{nl.name}</div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray500 }}>{nl.desc}</div>
          </div>
          <Toggle checked={subs[activeTab]?.[nl.id] ?? false} onChange={() => toggle(nl.id)} />
        </div>
      ))}
    </div>
  )
}

// ─── Banner Components ────────────────────────────────────────────────────────

// Status banner (trial countdown / free access) — matches wireframe exactly
function StatusBanner({ banner }) {
  const { t } = useLang()
  const c = banner.i18n || banner.content || {}
  const style_ = banner.style || {}
  const isGreen = style_.variant === "success_green" || (banner.content?.color === "green")
  const bgColor = isGreen ? "#EDFBF4" : "#EEF4FF"
  const borderColor = isGreen ? C.green : "#7B9FE0"
  const badgeBg = isGreen ? C.green : "#3B82F6"
  const badgeColor = isGreen ? C.navy : C.white
  const imgSrc = img(banner.image || c.imageKey)

  return (
    <div style={{
      background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 8,
      padding: "1.25rem 1.5rem", marginBottom: "1.5rem",
      display: "flex", alignItems: "center", gap: "1.25rem",
    }}>
      {/* Product visual */}
      <div style={{ width: 80, height: 56, flexShrink: 0, borderRadius: 6, overflow: "hidden" }}>
        {imgSrc ? (
          <img src={imgSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, borderRadius: 6 }} />
        )}
      </div>
      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "0.9375rem", color: C.navy, marginBottom: "0.25rem" }}>
          {t(c.titleKey || c.title)}
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: C.gray700, lineHeight: "var(--lh-body)" }}>
          {t(c.bodyKey || c.body)}
        </div>
      </div>
      {/* Badge */}
      <div style={{
        background: badgeBg, color: badgeColor, borderRadius: 99,
        padding: "0.3rem 0.875rem", fontFamily: "var(--font-sans)",
        fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap",
      }}>
        {t(c.badgeKey || c.badge)}
      </div>
    </div>
  )
}

// Upsell banner (upgrade to international, upgrade to business) — matches wireframe
function UpsellBanner({ banner, onAction }) {
  const { t } = useLang()
  const c = banner.i18n || banner.content || {}
  const imgSrc = img(banner.image || c.imageKey)

  // personal_to_business has a different layout (with badge circle)
  if (banner.id === "personal_to_business") {
    return (
      <div style={{
        background: "#EEF4FF", border: "1px solid #C3D4F5", borderRadius: 10,
        padding: "1.75rem 2rem", display: "flex", alignItems: "center",
        gap: "2rem", position: "relative", overflow: "hidden",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: "1.125rem", color: C.navy, marginBottom: "0.5rem" }}>
            {t(c.titleKey || c.title)}
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: C.gray700, lineHeight: "var(--lh-body)", marginBottom: "1.25rem" }}>
            {t(c.bodyKey || c.body)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button className="btn-primary" style={{ padding: "0.625rem 1.5rem" }} onClick={onAction}>
              {t(c.ctaKey || c.cta)}
            </button>
            {(c.fromKey || c.subtitle) && (
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: C.gray500 }}>{t(c.fromKey || c.subtitle)}</span>
            )}
          </div>
        </div>
        <div style={{ position: "relative", flexShrink: 0, width: 180, height: 100 }}>
          <div style={{ display: "flex" }}>
            {["#E8B4B8", "#B4C8E8", "#B4E8C8"].map((bg, i) => (
              <div key={i} style={{
                width: 44, height: 44, borderRadius: "50%", background: bg,
                border: `2px solid ${C.white}`, marginLeft: i > 0 ? -10 : 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "0.8rem", color: C.navy,
              }}>
                {["JV", "SB", "TS"][i]}
              </div>
            ))}
          </div>
          {(c.badgeKey || c.badge) && (
            <div style={{
              position: "absolute", top: -10, right: -10, width: 90, height: 90,
              borderRadius: "50%", background: C.red,
              display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
              fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700, color: C.white,
              lineHeight: 1.3, padding: "0.5rem",
            }}>
              {t(c.badgeKey || c.badge)}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default upsell: upgrade to international editions
  return (
    <div style={{
      border: `1px solid ${C.gray200}`, borderRadius: 8,
      padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "1.25rem",
    }}>
      <div style={{ width: 80, height: 56, flexShrink: 0, borderRadius: 6, overflow: "hidden" }}>
        {imgSrc ? (
          <img src={imgSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, position: "relative" }}>
            <div style={{ position: "absolute", inset: 5, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 3 }} />
          </div>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: "1rem", color: C.navy, marginBottom: "0.375rem", lineHeight: "var(--lh-heading)" }}>
          {t(c.titleKey || c.title)}
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: C.gray700, lineHeight: "var(--lh-body)", marginBottom: "1rem" }}>
          {t(c.bodyKey || c.body)}
        </div>
        <button className="btn-primary" style={{ padding: "0.625rem 1.5rem" }} onClick={onAction}>
          {t(c.ctaKey || c.cta)}
        </button>
      </div>
    </div>
  )
}

// Cross-sell hero banner (full-width, above page content) — for external products
function CrossSellBanner({ banner, onAction }) {
  const { t } = useLang()
  const c = banner.i18n || banner.content || {}
  const imgSrc = img(banner.image || c.imageKey)
  if (!imgSrc) return null

  return (
    <div style={{
      background: "#EEF4FF", borderRadius: 10,
      padding: "1.25rem 1.5rem", marginBottom: "1.5rem",
      display: "flex", alignItems: "center", gap: "1.5rem",
      overflow: "hidden",
    }}>
      <div style={{ width: 220, height: 140, flexShrink: 0, borderRadius: 8, overflow: "hidden" }}>
        <img src={imgSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ flex: 1 }}>
        {/* Cross-sell content comes from the image; CTA is dynamic */}
      </div>
      <button style={{
        background: C.red, color: C.white, border: "none", borderRadius: 6,
        padding: "0.75rem 1.5rem", fontFamily: "var(--font-sans)",
        fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer", whiteSpace: "nowrap",
      }} onClick={onAction}>
        {t(c.ctaKey || c.cta)}
      </button>
    </div>
  )
}

// Master renderer: picks the right component for each banner
function RenderBanner({ banner, onAction }) {
  switch (banner.type) {
    case "status":    return <StatusBanner key={banner.id} banner={banner} />
    case "upsell":    return <UpsellBanner key={banner.id} banner={banner} onAction={onAction} />
    case "crosssell": return <CrossSellBanner key={banner.id} banner={banner} onAction={onAction} />
    default:          return null
  }
}

// ─── Abonnementen sectie ──────────────────────────────────────────────────────
function AbonnementenSection({ planType, onUpgrade, bizVariant }) {
  const { t } = useLang()
  const isBusiness = planType === "business"
  const isPro      = planType === "pro"
  const isTrial    = planType === "trial"

  // Get banners for this section using the configuration engine
  const banners = getActiveBanners({
    planType,
    section: "abonnementen",
    variant: isBusiness ? (bizVariant || "trial") : null,
    scope: "local",
  })

  const statusBanners = banners.filter(b => b.type === "status")
  const upsellBanners = banners.filter(b => b.type === "upsell")
  const heroBanners   = banners.filter(b => b.type === "crosssell")

  return (
    <div>
      {/* ── Hero / cross-sell banners (above the card) ── */}
      {heroBanners.map(b => <RenderBanner key={b.id} banner={b} onAction={onUpgrade} />)}

      <div style={{ background: C.white, borderRadius: 10, padding: "1.75rem", boxShadow: "0 2px 16px rgba(12,24,46,0.06)" }}>
        {/* ── Status banners (trial / free) ── */}
        {statusBanners.map(b => <RenderBanner key={b.id} banner={b} />)}

        {/* ── Subscription info ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "1.375rem", fontWeight: 800, color: C.navy, lineHeight: "var(--lh-heading)", letterSpacing: "var(--tracking-heading)" }}>{t("acc_sub_title")}</h2>
          <button className="btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>+</span> {t("acc_sub_add")}
          </button>
        </div>

        <div style={{ border: `1px solid ${C.gray200}`, borderRadius: 8, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
          <div style={{ width: 28, height: 20, background: "linear-gradient(180deg,#AE1C28 33%,#fff 33% 66%,#21468B 66%)", borderRadius: 3, flexShrink: 0, border: `1px solid ${C.gray200}` }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "0.9375rem", color: C.navy }}>
              Investment Officer · Nederland · {isBusiness ? "Business" : "Personal"} {isPro ? "Pro" : isTrial ? "Trial" : "Free"}
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#4A4AB5", marginTop: "0.25rem" }}>
              CDP: {isBusiness ? "Business Sell Side — .NL" : isPro ? "Personal Pro — .NL" : isTrial ? "Personal Trial — .NL" : "Personal Free — .NL"}
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: C.gray500, marginTop: "0.2rem" }}>{t("acc_sub_started")} 12 jan 2025</div>
          </div>
          {(isPro || isBusiness) && (
            <span style={{ background: C.red, color: C.white, borderRadius: 99, padding: "0.25rem 0.75rem", fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap" }}>{t("acc_sub_auto")}</span>
          )}
          <button className="btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.875rem" }}>{t("acc_edit")}</button>
        </div>

        {/* ── Upsell banners (upgrade international, etc.) ── */}
        {upsellBanners.map(b => <RenderBanner key={b.id} banner={b} onAction={onUpgrade} />)}
      </div>
    </div>
  )
}

// ─── Facturatie sectie ────────────────────────────────────────────────────────
const MOCK_INVOICES = [
  { date:"Jan 22, 2025", status:"upcoming", amount:"€250,00" },
  { date:"Jan 22, 2025", status:"paid",     amount:"€250,00" },
  { date:"Dec 22, 2024", status:"paid",     amount:"€250,00" },
  { date:"Nov 22, 2024", status:"paid",     amount:"€250,00" },
  { date:"Okt 22, 2024", status:"paid",     amount:"€250,00" },
  { date:"Sep 22, 2024", status:"paid",     amount:"€250,00" },
]

function FacturatieSection() {
  const { t } = useLang()
  const countries = t("acc_billing_countries") || []
  const [tab, setTab] = useState("payment")
  const [billing, setBilling] = useState({ kvk:"", company:"", street:"", number:"12", addition:"Bis", zip:"", city:"", country: countries[0] || "", vat:"" })

  return (
    <div style={{ background:C.white, borderRadius:10, padding:"1.75rem", boxShadow:"0 2px 16px rgba(12,24,46,0.06)" }}>
      <h2 style={{ fontFamily:"var(--font-sans)", fontSize:"1.375rem", fontWeight:800, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"1.25rem" }}>{t("acc_billing_title")}</h2>
      <div style={{ display:"flex", borderBottom:`1px solid ${C.gray200}`, marginBottom:"1.5rem" }}>
        {[["payment", t("acc_billing_tab1")],["invoices", t("acc_billing_tab2")]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ background:"none", border:"none", borderBottom:`2px solid ${tab===id ? C.navy : "transparent"}`, padding:"0.5rem 1.25rem", fontFamily:"var(--font-sans)", fontSize:"0.9rem", fontWeight: tab===id ? 700 : 400, color: tab===id ? C.navy : C.gray500, cursor:"pointer", marginBottom:"-1px" }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "payment" && (
        <>
          <div className="input-group"><label className="input-label">{t("acc_billing_kvk")}</label><input className="input-field" placeholder={t("acc_billing_kvk")} value={billing.kvk} onChange={e => setBilling(b=>({...b,kvk:e.target.value}))} /></div>
          <div className="input-group"><label className="input-label">{t("acc_billing_company")}</label><input className="input-field" placeholder={t("acc_billing_company")} value={billing.company} onChange={e => setBilling(b=>({...b,company:e.target.value}))} /></div>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:"0 1rem" }}>
            <div className="input-group"><label className="input-label">{t("acc_billing_street")}</label><input className="input-field" value={billing.street} onChange={e => setBilling(b=>({...b,street:e.target.value}))} /></div>
            <div className="input-group"><label className="input-label">{t("acc_billing_number")}</label><input className="input-field" value={billing.number} onChange={e => setBilling(b=>({...b,number:e.target.value}))} /></div>
            <div className="input-group"><label className="input-label">{t("acc_billing_addition")}</label><input className="input-field" placeholder="Bis" value={billing.addition} onChange={e => setBilling(b=>({...b,addition:e.target.value}))} /></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"0 1rem" }}>
            <div className="input-group"><label className="input-label">{t("acc_billing_zip")}</label><input className="input-field" value={billing.zip} onChange={e => setBilling(b=>({...b,zip:e.target.value}))} /></div>
            <div className="input-group"><label className="input-label">{t("acc_billing_city")}</label><input className="input-field" value={billing.city} onChange={e => setBilling(b=>({...b,city:e.target.value}))} /></div>
          </div>
          <div className="input-group">
            <label className="input-label">{t("acc_billing_country")}</label>
            <select className="input-field" value={billing.country} onChange={e => setBilling(b=>({...b,country:e.target.value}))}>
              {countries.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="input-group"><label className="input-label">{t("acc_billing_vat")}</label><input className="input-field" placeholder={t("acc_billing_vat")} value={billing.vat} onChange={e => setBilling(b=>({...b,vat:e.target.value}))} /></div>
          <button className="btn-navy" style={{ padding:"0.75rem 2rem", marginTop:"0.5rem" }} onClick={() => alert("POC: saved")}>{t("acc_save")}</button>
        </>
      )}

      {tab === "invoices" && (
        <div>
          {MOCK_INVOICES.map((inv, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"1rem", border:`1px solid ${C.gray200}`, borderRadius:6, padding:"0.875rem 1.25rem", marginBottom:"0.5rem" }}>
              <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, width:90, flexShrink:0 }}>{inv.date}</div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v10m0 0l-3-3m3 3l3-3M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" stroke={C.gray500} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, flex:1 }}>{t("acc_invoice")}</div>
              <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color: inv.status==="upcoming" ? "#1A3A7A" : C.gray500, width:90 }}>
                {inv.status === "upcoming" ? t("acc_inv_upcoming") : t("acc_inv_paid")}
              </div>
              <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", fontWeight:600, color:C.navy, width:70, textAlign:"right" }}>{inv.amount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Gebruikers sectie ────────────────────────────────────────────────────────
const MOCK_USERS = [
  { email:"demo@aegon.com",           role:"admin",  pending:false },
  { email:"jan.de.vries@aegon.com",   role:"reader", pending:false },
  { email:"sophie.bakker@aegon.com",  role:"reader", pending:false },
  { email:"thomas.smit@aegon.com",    role:"reader", pending:false },
  { email:"anna.visser@aegon.com",    role:"reader", pending:false },
  { email:"dirkjan.brummelman@aegon.com", role:"reader", pending:true },
]
const MAX_SEATS = 16

function GebruikersSection({ planType, onSimulateInvite, onUpgrade }) {
  const { t } = useLang()
  const isBusiness = planType === "business"
  const [users, setUsers]         = useState(MOCK_USERS)
  const [showModal, setShowModal] = useState(false)
  const [inviteInput, setInviteInput] = useState("")
  const [inviteList, setInviteList]   = useState([])
  const [openMenu, setOpenMenu]   = useState(null)

  if (!isBusiness) {
    // Get upsell banners for this section
    const banners = getActiveBanners({ planType, section: "gebruikers", scope: "local" })
    return (
      <div style={{ background:C.white, borderRadius:10, padding:"1.75rem", boxShadow:"0 2px 16px rgba(12,24,46,0.06)" }}>
        <h2 style={{ fontFamily:"var(--font-sans)", fontSize:"1.375rem", fontWeight:800, color:C.navy, marginBottom:"1.5rem" }}>{t("acc_upsell_title")}</h2>
        {banners.map(b => <RenderBanner key={b.id} banner={b} onAction={onUpgrade} />)}
      </div>
    )
  }

  function addInviteEmail(e) {
    if (e.key === "Enter" && inviteInput.trim()) {
      const email = inviteInput.trim()
      if (email.includes("@") && !inviteList.includes(email)) setInviteList(prev => [...prev, email])
      setInviteInput("")
    }
  }
  function removeInviteEmail(email) { setInviteList(prev => prev.filter(e => e !== email)) }
  function sendInvites() {
    if (inviteList.length === 0) return
    setUsers(prev => [...prev, ...inviteList.map(email => ({ email, role:"reader", pending:true }))])
    setInviteList([]); setInviteInput(""); setShowModal(false)
  }
  function changeRole(email, newRole) { setUsers(prev => prev.map(u => u.email === email ? {...u, role:newRole} : u)) }
  function removeUser(email) { setUsers(prev => prev.filter(u => u.email !== email)); setOpenMenu(null) }

  return (
    <div style={{ background:C.white, borderRadius:10, padding:"1.75rem", boxShadow:"0 2px 16px rgba(12,24,46,0.06)" }}>
      <h2 style={{ fontFamily:"var(--font-sans)", fontSize:"1.375rem", fontWeight:800, color:C.navy, marginBottom:"0.375rem" }}>{t("acc_users_title")}</h2>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.5rem", maxWidth:680 }}>{t("acc_users_sub")}</p>

      <div style={{ border:`1px solid ${C.gray200}`, borderRadius:8 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1rem 1.25rem", borderBottom:`1px solid ${C.gray100}` }}>
          <span style={{ fontFamily:"var(--font-sans)", fontWeight:700, fontSize:"1rem", color:C.navy }}>{t("acc_users_header")}</span>
          <button onClick={() => setShowModal(true)}
            style={{ background:C.navy, color:C.white, border:"none", borderRadius:6, padding:"0.5rem 1.125rem", fontFamily:"var(--font-sans)", fontSize:"0.875rem", fontWeight:600, cursor:"pointer" }}>
            {t("acc_users_invite")}
          </button>
        </div>

        <div style={{ background:C.gray50, padding:"0.875rem 1.25rem", display:"flex", justifyContent:"space-between", alignItems:"flex-start", borderBottom:`1px solid ${C.gray100}` }}>
          <div>
            <div style={{ fontFamily:"var(--font-sans)", fontWeight:700, fontSize:"0.9rem", color:C.navy }}>{t("acc_users_header")}</div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, marginTop:"0.2rem" }}>{t("acc_users_seats")}</div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0, marginLeft:"1rem" }}>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.75rem", color:C.gray500 }}>{t("acc_users_header")}</div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"1.25rem", fontWeight:800, color:C.navy }}>{users.length}/{MAX_SEATS}</div>
          </div>
        </div>

        {users.map((u, i) => {
          const ini = u.email[0].toUpperCase()
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.875rem", padding:"0.875rem 1.25rem", borderBottom: i < users.length-1 ? `1px solid ${C.gray100}` : "none", position:"relative" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background: u.pending ? C.gray200 : C.red, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-sans)", fontWeight:700, fontSize:"0.875rem", color: u.pending ? C.gray500 : C.white, flexShrink:0 }}>
                {ini}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.email}</div>
                {u.pending && <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.75rem", color:C.gray500, marginTop:"0.15rem" }}>{t("acc_users_pending")}</div>}
              </div>
              <div style={{ position:"relative" }}>
                <select value={u.role} onChange={e => changeRole(u.email, e.target.value)}
                  disabled={u.role === "admin"}
                  style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy, border:`1px solid ${C.gray200}`, borderRadius:4, padding:"0.3rem 1.75rem 0.3rem 0.625rem", background:C.white, cursor: u.role==="admin" ? "default" : "pointer", appearance:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238A8A82' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat:"no-repeat", backgroundPosition:"right 0.5rem center" }}>
                  <option value="admin">{t("acc_role_admin")}</option>
                  <option value="reader">{t("acc_role_reader")}</option>
                </select>
              </div>
              <div style={{ position:"relative" }}>
                <button onClick={() => setOpenMenu(openMenu === i ? null : i)}
                  style={{ background:"none", border:"none", cursor:"pointer", color:C.gray500, fontSize:"1.25rem", lineHeight:1, padding:"0.25rem 0.5rem", borderRadius:4 }}>···</button>
                {openMenu === i && (
                  <div style={{ position:"absolute", right:0, top:"calc(100% + 4px)", background:C.white, border:`1px solid ${C.gray200}`, borderRadius:6, boxShadow:"0 4px 16px rgba(12,24,46,0.12)", zIndex:10, minWidth:140 }}>
                    <button onClick={() => removeUser(u.email)}
                      style={{ display:"block", width:"100%", textAlign:"left", padding:"0.625rem 1rem", fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.red, background:"none", border:"none", cursor:"pointer" }}>
                      {t("acc_users_remove")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth:560 }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{t("acc_invite_title")}</div>
                <div className="modal-subtitle">{t("acc_invite_sub")}</div>
              </div>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ border:`1.5px solid ${C.gray300}`, borderRadius:6, padding:"0.625rem 0.875rem", minHeight:80, cursor:"text" }}
                onClick={() => document.getElementById("invite-input").focus()}>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.75rem", color:C.gray500, marginBottom:"0.375rem" }}>{t("acc_invite_hint")}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"0.375rem", alignItems:"center" }}>
                  {inviteList.map(email => (
                    <span key={email} style={{ display:"inline-flex", alignItems:"center", gap:"0.375rem", background:C.gray100, border:`1px solid ${C.gray200}`, borderRadius:4, padding:"0.2rem 0.5rem", fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.navy }}>
                      {email}
                      <button onClick={() => removeInviteEmail(email)} style={{ background:"none", border:"none", cursor:"pointer", color:C.gray500, lineHeight:1, fontSize:"1rem", padding:0 }}>×</button>
                    </span>
                  ))}
                  <input id="invite-input" value={inviteInput} onChange={e => setInviteInput(e.target.value)} onKeyDown={addInviteEmail}
                    placeholder={inviteList.length === 0 ? t("lm_email_label") : ""}
                    style={{ border:"none", outline:"none", fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, minWidth:180, flex:1, background:"transparent" }} />
                </div>
              </div>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, marginTop:"0.5rem", marginBottom:"1.5rem" }}>{t("acc_invite_enter")}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
                <button className="btn-secondary" style={{ width:"100%" }} onClick={() => { setShowModal(false); setInviteList([]); setInviteInput("") }}>{t("acc_cancel")}</button>
                <button onClick={sendInvites} disabled={inviteList.length === 0}
                  style={{ background: inviteList.length > 0 ? C.navy : C.gray200, color: inviteList.length > 0 ? C.white : C.gray500, border:"none", borderRadius:4, padding:"0.75rem", fontFamily:"var(--font-sans)", fontWeight:700, fontSize:"0.9375rem", cursor: inviteList.length > 0 ? "pointer" : "not-allowed", transition:"background 0.2s" }}>
                  {t("acc_invite_send")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── POC: simulate invitation link ── */}
      {onSimulateInvite && (
        <div style={{ marginTop:"1.25rem", border:`2px dashed ${C.gray300}`, borderRadius:10, padding:"1.25rem 1.5rem", background:C.gray50 }}>
          <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.5rem" }}>
            POC — Simulate invitation
          </div>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray700, lineHeight:"var(--lh-body)", marginBottom:"1rem" }}>
            Test what an invited colleague sees when they click the invitation link in their e-mail.
          </p>
          <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap" }}>
            {users.filter(u => u.pending).map(u => (
              <button key={u.email} onClick={() => onSimulateInvite(u.email, "Aegon", planType)}
                style={{ background:C.navy, color:C.white, border:"none", borderRadius:6, padding:"0.5rem 1rem", fontFamily:"var(--font-sans)", fontSize:"0.8125rem", fontWeight:600, cursor:"pointer" }}>
                Open as {u.email.split("@")[0]}
              </button>
            ))}
            {users.filter(u => u.pending).length === 0 && (
              <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, fontStyle:"italic" }}>
                Invite a colleague first to simulate their experience.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main AccountPage ─────────────────────────────────────────────────────────
export default function AccountPage({ user, planType, onBack, onSimulateInvite, onUpgrade, bizVariant, initialSection }) {
  const { t } = useLang()
  const [section, setSection]     = useState(initialSection || "account")
  const [currentUser, setCurrentUser] = useState(user)
  const ini = initials(currentUser.firstName, currentUser.lastName)

  return (
    <div style={{ minHeight:"100vh", background:C.gray50 }}>
      <AccountTopNav firstName={currentUser.firstName} lastName={currentUser.lastName} onBack={onBack} />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 1.5rem 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"2rem" }}>
          <div style={{ width:48, height:48, borderRadius:"50%", background:C.red, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-sans)", fontWeight:700, fontSize:"1rem", color:C.white, flexShrink:0 }}>
            {ini}
          </div>
          <h1 style={{ fontFamily:"var(--font-sans)", fontSize:"1.75rem", fontWeight:800, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)" }}>
            {t("acc_welcome")} {currentUser.firstName}
          </h1>
        </div>

        {/* ── Static cross-sell banner (Impact Investor promo) ── */}
        <div style={{ marginBottom:"1.5rem", borderRadius:10, overflow:"hidden", cursor:"pointer" }}>
          <img
            src="/images/Banner_Impact_Investor_PROMO.png"
            alt="Krijg nu toegang tot een jaar Impact Investor"
            style={{ width:"100%", display:"block" }}
          />
        </div>

        <div style={{ display:"flex", gap:"1.5rem", alignItems:"flex-start", paddingBottom:"4rem" }}>
          <Sidebar active={section} onNav={setSection} />
          <div style={{ flex:1, minWidth:0 }}>
            {section === "account"      && <AccountSection user={currentUser} onUpdate={setCurrentUser} />}
            {section === "nieuwsbrief"  && <NewsletterSection />}
            {section === "abonnementen" && <AbonnementenSection planType={planType} onUpgrade={onUpgrade} bizVariant={bizVariant} />}
            {section === "gebruikers"   && <GebruikersSection planType={planType} onSimulateInvite={onSimulateInvite} onUpgrade={onUpgrade} />}
            {section === "facturatie"   && <FacturatieSection />}
            {section === "enterprise"   && <EnterpriseAccessPage />}
          </div>
        </div>
      </div>
    </div>
  )
}
