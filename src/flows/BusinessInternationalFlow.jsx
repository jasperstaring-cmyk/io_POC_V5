import { useState } from 'react'
import { C } from '../tokens.js'
import { SEGMENTS, JOB_ROLES, BUSINESS_INTL_SIZES } from '../data.js'
import { TopProgressBar, RegSidebar, SelectionRow, JobRoleSelector, EmailChip, BackButton, AuthNav, CdpProductLabel } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import { classifyEmailForReg, getWhitelistInfo, getCompanyNameFromEmail } from '../utils.js'
import IOLogo from '../components/IOLogo.jsx'

/* ─── 50% discount for Wealth & Institutional ─────────────────────────── */
const DISCOUNT_SEGMENTS = ["wealth", "institutional"]
const DISCOUNT_PCT = 0.50
function hasDiscount(segId) { return DISCOUNT_SEGMENTS.includes(segId) }
function yearlyPrice(size, segId, xlCount) {
  const base = size.id === "XL" ? (xlCount || 16) * size.perUser * 12 : size.yearlyPrice
  return hasDiscount(segId) ? Math.round(base * (1 - DISCOUNT_PCT)) : base
}
function monthlyPrice(size, segId, xlCount) { return Math.round(yearlyPrice(size, segId, xlCount) / 12 * 100) / 100 }
function formatPrice(n) { return n.toLocaleString("nl-NL", { minimumFractionDigits:0, maximumFractionDigits:2 }) }

function getSidebarMeta(size, segId, xlCount, t, tBizIntl) {
  const features = t("bi_sidebar_features")
  const PERSONAL_INTL_YEARLY = 948
  if (!size) return { name:"Business International", price:null, priceSuffix: t("bi_sidebar_select"), cta:null, features, savings:0 }
  const mo = monthlyPrice(size, segId, xlCount)
  const maxU = size.id === "S" ? 5 : size.id === "M" ? 10 : size.id === "L" ? 15 : (xlCount || 16)
  const yearlyTeam = maxU * PERSONAL_INTL_YEARLY
  const yearlyPlan = mo * 12
  const savings = Math.round(yearlyTeam - yearlyPlan)
  return {
    name: `Business International ${size.label}`,
    price: `€ ${formatPrice(mo)},–`,
    priceSuffix: t("bf_size_per_month") + ", " + t("inline_billed_annually"),
    cta: hasDiscount(segId) ? t("bi_sidebar_discount_cta") : null,
    features: [...features, `${tBizIntl(size.id, "users")}`],
    savings,
  }
}

/* ─── Component ────────────────────────────────────────────────────────── */
export default function BusinessInternationalFlow({ onComplete, onSkipToSite, onBack, onGoEnterprise }) {
  const { t, tSeg, tType, tBizIntl } = useLang()
  const [step, setStep]             = useState("email")
  const [email, setEmail]           = useState("")
  const [firstName, setFirstName]   = useState("")
  const [lastName, setLastName]     = useState("")
  const [jobRole, setJobRole]       = useState("")
  const [password, setPassword]     = useState("")
  const [segment, setSegment]       = useState(null)
  const [orgType, setOrgType]       = useState(null)
  const [chosenSize, setChosenSize] = useState(null)
  const [xlUserCount, setXlUserCount] = useState("")
  const [company, setCompany]       = useState({ kvk:"", name:"", street:"", number:"", addition:"", zip:"", city:"", country:"NL", vat:"" })
  const [inviteEmails, setInviteEmails] = useState(["",""])
  const [agreed, setAgreed]         = useState(false)
  const [emailClass, setEmailClass] = useState(null)

  const STEP_NUM    = { email:1, profile:2, segment:3, type:4, size_picker:5, company:6, overview:7, payment:8, invite:9, done:10 }
  const TOTAL = 10
  const curr  = STEP_NUM[step] || 1
  const selectedSegment = SEGMENTS.find(s => s.id === segment?.id)
  const xlCount = parseInt(xlUserCount) || 16
  const sidebar = getSidebarMeta(chosenSize, segment?.id, xlCount, t, tBizIntl)

  function handleCompanyChange(f, v) { setCompany(prev => ({ ...prev, [f]: v })) }
  function handleSegmentNext() {
    if (!segment) return
    if (selectedSegment?.types?.length > 0) { setOrgType(null); setStep("type") } else setStep("size_picker")
  }
  function handleTypeNext() { if (!orgType) return; setStep("size_picker") }

  const yr = chosenSize ? yearlyPrice(chosenSize, segment?.id, xlCount) : 0
  const baseYr = chosenSize ? (chosenSize.id === "XL" ? xlCount * chosenSize.perUser * 12 : chosenSize.yearlyPrice) : 0
  const showDiscount = hasDiscount(segment?.id)

  /* ── Done ── */
  if (step === "done") {
    return (
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"100vh" }}>
        <div style={{ padding:"3rem 4rem", display:"flex", flexDirection:"column", justifyContent:"center", background:C.white, position:"relative" }}>
          <div style={{ position:"absolute", top:"2.5rem", left:"3rem" }}><IOLogo size={28} /></div>
          <div style={{ marginTop:"2rem" }}>
            <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"0.75rem" }}>{t("bf_done_welcome")}</h1>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, marginBottom:"1rem", lineHeight:"var(--lh-body)" }}>
              {t("bi_done_body_pre")} <strong>{company.name || t("inline_your_org")}</strong> {t("bi_done_body_post")} {chosenSize ? tBizIntl(chosenSize.id, "users") : t("inline_your_team")}.
            </p>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray500, marginBottom:"2rem", fontStyle:"italic" }}>
              {t("inline_confirm_email_at")} <strong>{email}</strong>.
            </p>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn-navy" style={{ padding:"0.875rem 2rem", fontSize:"1rem" }} onClick={onComplete}>{t("ob_start_intro")} →</button>
              <button className="btn-secondary" style={{ padding:"0.875rem 2rem", fontSize:"1rem" }} onClick={onSkipToSite || onComplete}>{t("ob_go_to_site")}</button>
            </div>
            <CdpProductLabel
              productName={`Business International ${chosenSize?.label || ""}`}
              edition="All"
            />
          </div>
        </div>
        <div style={{ position:"relative", overflow:"hidden", background:`linear-gradient(135deg,${C.navy},#1B3A5C)` }}>
          <img src="/images/beeld_onboarding_welcome.png" alt="" style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }} onError={e => { e.target.style.display="none" }} />
        </div>
      </div>
    )
  }

  return (
    <div className="reg-layout">
      <TopProgressBar total={TOTAL} current={curr} />
      <AuthNav onBack={onBack} />
      <div className="reg-container">
        <div className="reg-main">

          {/* ── Email + Profile ── */}
          {step === "email" && (
            <>
              <h2 className="reg-step-title">{t("bi_title")}</h2>
              <p className="reg-step-sub">{t("bi_sub")}</p>
              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={e => {
                e.preventDefault()
                const cls = classifyEmailForReg(email)
                setEmailClass(cls)
                if (cls === "generic" || cls === "private" || cls === "enterprise" || cls === "whitelist" || cls === "existing") return
                setStep("profile")
              }}>
                <div className="input-group"><label className="input-label">{t("bf_email_label")}</label><input className="input-field" type="text" inputMode="email" placeholder={t("bf_email_placeholder")} value={email} onChange={e => { setEmail(e.target.value); setEmailClass(null) }} autoFocus required /></div>

                {emailClass === "generic" && (
                  <div className="alert alert-warning" style={{ marginBottom:"1.25rem" }}>{t("pf_generic_warn")}</div>
                )}
                {emailClass === "private" && (
                  <div className="alert alert-warning" style={{ marginBottom:"1.25rem" }}>
                    {t("pf_private_warn")}
                    <div style={{ marginTop:"0.75rem" }}><button className="btn-green btn-full" type="button" onClick={() => { setEmailClass(null); setStep("profile") }}>{t("pf_private_continue")}</button></div>
                  </div>
                )}
                {emailClass === "existing" && (
                  <div className="alert alert-warning" style={{ marginBottom:"1.25rem" }}>
                    {t("pf_existing_warn")}
                  </div>
                )}
                {emailClass === "enterprise" && (
                  <div className="alert alert-success" style={{ marginBottom:"1.25rem" }}>
                    {t("pf_enterprise_profile_note")} <strong>{getCompanyNameFromEmail(email) || t("inline_your_org")}</strong>.
                    {" "}{t("bf_enterprise_redirect_short")}
                    <div style={{ marginTop:"0.75rem" }}>
                      <button className="btn-green btn-full" type="button" onClick={() => { if (onGoEnterprise) onGoEnterprise(email) }}>{t("bf_go_enterprise")}</button>
                    </div>
                  </div>
                )}
                {emailClass === "whitelist" && (() => {
                  const wlInfo = getWhitelistInfo(email)
                  return (
                    <div className="alert alert-success" style={{ marginBottom:"1.25rem" }}>
                      <strong>{wlInfo?.company || t("inline_your_org")}</strong> {t("wl_enterprise_profile_banner")}{" "}
                      {wlInfo?.edition === "all" ? t("lm_wl_edition_all") : t("lm_wl_edition_nl")}.
                      <div style={{ marginTop:"0.75rem" }}>
                        <button className="btn-green btn-full" type="button" onClick={() => { if (onGoEnterprise) onGoEnterprise(email, wlInfo) }}>{t("bf_go_enterprise")}</button>
                      </div>
                    </div>
                  )
                })()}

                {(!emailClass || emailClass === "generic") && (
                  <button className="btn-green btn-full" type="submit">{t("bf_next")}</button>
                )}
              </form>
            </>
          )}

          {/* ── Profile ── */}
          {step === "profile" && (
            <>
              <h2 className="reg-step-title">{t("bf_profile_title")}</h2>
              <EmailChip email={email} onEdit={() => { setEmailClass(null); setStep("email") }} />
              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={e => { e.preventDefault(); if (!jobRole) return; setStep("segment") }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("pf_firstname")}</label><input className="input-field" type="text" placeholder={t("pf_firstname")} value={firstName} onChange={e => setFirstName(e.target.value)} autoFocus required /></div>
                  <div className="input-group"><label className="input-label">{t("pf_lastname")}</label><input className="input-field" type="text" placeholder={t("pf_lastname")} value={lastName} onChange={e => setLastName(e.target.value)} required /></div>
                </div>
                <div className="input-group">
                  <label className="input-label">{t("pf_jobrole")}</label>
                  <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray500, margin:"0 0 0.75rem" }}>{t("pf_jobrole_sub")}</p>
                  <JobRoleSelector roles={JOB_ROLES} selectedId={jobRole} onSelect={setJobRole} t={t} />
                </div>
                <div className="input-group"><label className="input-label">{t("pf_password")}</label><input className="input-field" type="text" style={{ WebkitTextSecurity:"disc" }} autoComplete="off" data-1p-ignore data-lpignore="true" placeholder={t("pf_password_hint")} value={password} onChange={e => setPassword(e.target.value)} minLength={8} required /></div>
                <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.25rem" }}>
                  {t("bf_terms_intro")} <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_terms_link")}</button> {t("pf_privacy_and")} <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_privacy_link")}.</button>
                </p>
                <button className="btn-green btn-full" type="submit">{t("bf_next")}</button>
              </form>
            </>
          )}

          {/* ── Segment ── */}
          {step === "segment" && (
            <>
              <h2 className="reg-step-title">{t("bf_segment_title")}</h2>
              <p className="reg-step-sub">{t("bf_segment_sub")}</p>
              {SEGMENTS.map(s => (<SelectionRow key={s.id} selected={segment?.id === s.id} onSelect={() => setSegment(s)} name={tSeg(s.id, "name")} desc={tSeg(s.id, "desc")} />))}
              {segment && hasDiscount(segment.id) && (
                <div className="alert alert-success" style={{ marginTop:"1rem", fontSize:"0.85rem" }}>
                  <strong>{t("bi_discount_badge")}!</strong> {t("bf_segment_orgs_in")} {tSeg(segment.id, "name")} {t("bi_discount_body")}
                </div>
              )}
              {segment && !hasDiscount(segment.id) && (
                <div className="alert alert-info" style={{ marginTop:"1rem", fontSize:"0.85rem" }}>{t("bi_no_discount_info")}</div>
              )}
              <div className="reg-nav-bar"><BackButton onClick={() => setStep("profile")} /><button className="btn-green btn-full" onClick={handleSegmentNext} disabled={!segment}>{t("bf_next")}</button></div>
            </>
          )}

          {/* ── Type ── */}
          {step === "type" && selectedSegment && (
            <>
              <h2 className="reg-step-title">{t("bf_type_title")}</h2>
              <p className="reg-step-sub">{t("bf_type_sub")}</p>
              {selectedSegment.types.map(tp => (<SelectionRow key={tp.id} selected={orgType?.id === tp.id} onSelect={() => setOrgType(tp)} name={tType(tp.id, "name")} desc={tType(tp.id, "desc")} />))}
              <div className="reg-nav-bar"><BackButton onClick={() => setStep("segment")} /><button className="btn-green btn-full" onClick={handleTypeNext} disabled={!orgType}>{t("bf_next")}</button></div>
            </>
          )}

          {/* ── Size picker ── */}
          {step === "size_picker" && (
            <>
              <h2 className="reg-step-title">{t("bi_size_title")}</h2>
              <p className="reg-step-sub">{t("bi_size_sub")}</p>

              {/* Pricing anchor */}
              <div style={{
                display:"flex", alignItems:"center", gap:"0.875rem",
                background:"linear-gradient(135deg, #FFF8F0 0%, #FFF2E6 100%)",
                border:`1.5px solid #F0C878`, borderRadius:10,
                padding:"1rem 1.25rem", marginBottom:"1.25rem",
              }}>
                <div style={{
                  width:44, height:44, borderRadius:"50%", flexShrink:0,
                  background:"#F0C878", display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#8B6914"/></svg>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", fontWeight:700, color:C.navy, marginBottom:"0.2rem" }}>
                    Personal International: <span style={{ color:"#8B6914" }}>{t("bi_size_anchor_price")}</span>
                  </div>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray700, lineHeight:"var(--lh-body)" }}>
                    {t("bi_size_anchor")}
                  </div>
                </div>
              </div>

              {showDiscount && (
                <div style={{ background:"rgba(78,213,150,0.1)", border:`1.5px solid ${C.green}`, borderRadius:8, padding:"0.875rem 1.25rem", marginBottom:"1.25rem", display:"flex", alignItems:"center", gap:"0.75rem" }}>
                  <span style={{ background:C.green, color:C.navy, fontWeight:800, fontSize:"0.8rem", padding:"0.25rem 0.625rem", borderRadius:4, whiteSpace:"nowrap" }}>{t("bi_discount_badge")}</span>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy }}>
                    {t("bi_discount_as")} {segment ? tSeg(segment.id, "name") : ""} {t("bi_discount_org")} {t("bi_discount_body")}
                  </span>
                </div>
              )}
              {BUSINESS_INTL_SIZES.map(sz => {
                const PERSONAL_INTL_MONTHLY = 79
                const szYr = yearlyPrice(sz, segment?.id, xlCount)
                const szBaseYr = sz.id === "XL" ? xlCount * sz.perUser * 12 : sz.yearlyPrice
                const maxU = sz.id === "S" ? 5 : sz.id === "M" ? 10 : sz.id === "L" ? 15 : (parseInt(xlUserCount) || 16)
                const teamCost = maxU * PERSONAL_INTL_MONTHLY
                const planMonthly = monthlyPrice(sz, segment?.id, xlCount)
                const savePct = planMonthly > 0 ? Math.round((1 - planMonthly / teamCost) * 100) : 0
                const saveBadge = savePct > 0 ? `${t("inline_save")} ${savePct}%` : null
                const ppMonthly = planMonthly / maxU
                const ppLabel = `€ ${formatPrice(ppMonthly)},– ${t("inline_per_person")}`
                return (
                  <div key={sz.id}>
                    <SelectionRow selected={chosenSize?.id === sz.id} onSelect={() => setChosenSize(sz)}
                      name={`${sz.label} — ${tBizIntl(sz.id, "users")}`}
                      desc={<><span>{sz.id === "XL" ? t("bi_per_user") : `€ ${formatPrice(szYr)},– ${t("bi_yearly_excl")}`}</span><br/><span style={{ color:C.gray500, fontSize:"0.8rem" }}>{ppLabel}</span></>}
                      badge={saveBadge}
                      right={<span style={{ textAlign:"right" }}>
                        {showDiscount && <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.75rem", color:C.gray500, textDecoration:"line-through", display:"block" }}>€ {formatPrice(szBaseYr)},–</span>}
                        <span style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1rem", color:C.navy }}>
                          {sz.id === "XL" ? `€ ${formatPrice(sz.perUser * (showDiscount ? 0.5 : 1))},– p.g.` : `€ ${formatPrice(monthlyPrice(sz, segment?.id, xlCount))},– /${t("inline_mo")}`}
                        </span>
                      </span>} />
                    {sz.id === "XL" && chosenSize?.id === "XL" && (
                      <div style={{ margin:"-0.25rem 0 0.75rem 2.75rem", padding:"1rem", background:C.gray50, borderRadius:6, border:`1px solid ${C.gray200}` }}>
                        <label className="input-label">{t("bf_size_users_label")}</label>
                        <input className="input-field" type="number" min="16" placeholder="16+" value={xlUserCount} onChange={e => setXlUserCount(e.target.value)} style={{ maxWidth:180, marginTop:"0.25rem" }} />
                        {xlUserCount && parseInt(xlUserCount) >= 16 && (
                          <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy, marginTop:"0.5rem" }}>
                            {showDiscount && <span style={{ textDecoration:"line-through", color:C.gray500, marginRight:"0.5rem" }}>€ {formatPrice(xlCount * sz.perUser * 12)},–</span>}
                            {t("bf_size_total")}: <strong>€ {formatPrice(yearlyPrice(sz, segment?.id, xlCount))},–</strong> {t("bf_size_per_year")}
                            {showDiscount && <span style={{ background:C.green, color:C.navy, fontWeight:700, fontSize:"0.75rem", padding:"0.125rem 0.5rem", borderRadius:4, marginLeft:"0.5rem" }}>−50%</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="reg-nav-bar" style={{ marginTop:"1rem" }}>
                <BackButton onClick={() => setStep(selectedSegment?.types?.length > 0 ? "type" : "segment")} />
                <button className="btn-green btn-full" onClick={() => setStep("company")} disabled={!chosenSize || (chosenSize.id === "XL" && (!xlUserCount || parseInt(xlUserCount) < 16))}>{t("bf_further")}</button>
              </div>
            </>
          )}

          {/* ── Company details ── */}
          {step === "company" && (
            <>
              <h2 className="reg-step-title">{t("bf_company_title")}</h2>
              <p className="reg-step-sub">{t("bf_company_sub_new")}</p>
              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={e => { e.preventDefault(); setStep("overview") }}>
                <div className="input-group"><label className="input-label">{t("bf_kvk_label")}</label><input className="input-field" type="text" placeholder="12345678" value={company.kvk} onChange={e => handleCompanyChange("kvk", e.target.value)} required /></div>
                <div className="input-group"><label className="input-label">{t("bf_company_name_label")}</label><input className="input-field" type="text" placeholder={t("bf_company_name_label")} value={company.name} onChange={e => handleCompanyChange("name", e.target.value)} required /></div>
                <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("bf_street_label")}</label><input className="input-field" type="text" placeholder={t("bf_street_label")} value={company.street} onChange={e => handleCompanyChange("street", e.target.value)} required /></div>
                  <div className="input-group"><label className="input-label">{t("bf_housenr_label")}</label><input className="input-field" type="text" placeholder="12" value={company.number} onChange={e => handleCompanyChange("number", e.target.value)} required /></div>
                  <div className="input-group"><label className="input-label">{t("bf_addition_label")}</label><input className="input-field" type="text" placeholder="A" value={company.addition} onChange={e => handleCompanyChange("addition", e.target.value)} /></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("bf_zip_label")}</label><input className="input-field" type="text" placeholder="0000 AA" value={company.zip} onChange={e => handleCompanyChange("zip", e.target.value)} required /></div>
                  <div className="input-group"><label className="input-label">{t("bf_city_label")}</label><input className="input-field" type="text" placeholder={t("bf_city_label")} value={company.city} onChange={e => handleCompanyChange("city", e.target.value)} required /></div>
                </div>
                <div className="input-group"><label className="input-label">{t("bf_country_label")}</label>
                  <select className="input-field" value={company.country} onChange={e => handleCompanyChange("country", e.target.value)}>
                    <option value="NL">{t("bf_country_nl")}</option><option value="BE">{t("bf_country_be")}</option><option value="DE">{t("bf_country_de")}</option><option value="FR">{t("bf_country_fr")}</option><option value="LU">{t("bf_country_lu")}</option>
                  </select>
                </div>
                <div className="input-group"><label className="input-label">{t("bf_vat_label")}</label><input className="input-field" type="text" placeholder="NL123456789B01" value={company.vat} onChange={e => handleCompanyChange("vat", e.target.value)} /></div>
                <div className="reg-nav-bar"><BackButton onClick={() => setStep("size_picker")} /><button className="btn-green btn-full" type="submit">{t("bf_further")}</button></div>
              </form>
            </>
          )}

          {/* ── Overview ── */}
          {step === "overview" && (
            <>
              <h2 className="reg-step-title">{t("bf_overview_title")}</h2>
              <p className="reg-step-sub">{t("bf_overview_sub")}</p>
              <div style={{ border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1.125rem 1.25rem", marginBottom:"0.75rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500 }}>1. {t("bf_overview_personal")}</span>
                  <button className="link-btn" style={{ fontSize:"0.8rem" }} onClick={() => setStep("profile")}>{t("bf_overview_edit")}</button>
                </div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, lineHeight:1.6 }}>{firstName} {lastName}<br/>{email}<br/>{jobRole ? t(`jr_${jobRole}_name`) : ""}</div>
              </div>
              <div style={{ border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1.125rem 1.25rem", marginBottom:"0.75rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500 }}>2. {t("bf_overview_org")}</span>
                  <button className="link-btn" style={{ fontSize:"0.8rem" }} onClick={() => setStep("company")}>{t("bf_overview_edit")}</button>
                </div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, lineHeight:1.6 }}>
                  {company.name}<br/>{company.street} {company.number}{company.addition ? ` ${company.addition}` : ""}, {company.zip} {company.city}<br/>
                  KvK: {company.kvk}{company.vat ? ` · BTW: ${company.vat}` : ""}<br/>{segment ? tSeg(segment.id, "name") : "–"}{orgType ? ` — ${tType(orgType.id, "name")}` : ""}
                </div>
              </div>
              <div style={{ background:"rgba(78,213,150,0.08)", border:`1.5px solid ${C.green}`, borderRadius:8, padding:"1.125rem 1.25rem", marginBottom:"1.5rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.green }}>3. {t("bi_overview_package")}</span>
                  <button className="link-btn" style={{ fontSize:"0.8rem" }} onClick={() => setStep("size_picker")}>{t("bf_overview_edit")}</button>
                </div>
                <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1.125rem", color:C.navy, marginBottom:"0.25rem" }}>Business International {chosenSize?.label}</div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, marginBottom:"0.25rem" }}>{chosenSize ? tBizIntl(chosenSize.id, "users") : ""} · {t("bi_all_editions")}</div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"1rem", fontWeight:700, color:C.navy, display:"flex", alignItems:"center", gap:"0.5rem", flexWrap:"wrap" }}>
                  {showDiscount && <span style={{ textDecoration:"line-through", color:C.gray500, fontWeight:400 }}>€ {formatPrice(baseYr)},–</span>}
                  <span>€ {formatPrice(yr)},– {t("bf_size_per_year")}</span>
                  {showDiscount && <span style={{ background:C.green, color:C.navy, fontWeight:800, fontSize:"0.75rem", padding:"0.15rem 0.5rem", borderRadius:4 }}>−50%</span>}
                </div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, marginTop:"0.25rem" }}>{t("bf_payment_stripe")}</div>
              </div>
              <label style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start", marginBottom:"1.5rem", cursor:"pointer" }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop:3, accentColor:C.green }} />
                <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray700, lineHeight:"var(--lh-body)" }}>
                  {t("bf_agree_label")} <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_terms_link")}</button> {t("bf_agree_and")} <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_privacy_link")}</button>.
                </span>
              </label>
              <div className="reg-nav-bar"><BackButton onClick={() => setStep("company")} /><button className="btn-red btn-full" onClick={() => setStep("payment")} disabled={!agreed}>{t("bf_go_payment")}</button></div>
            </>
          )}

          {/* ── Payment ── */}
          {step === "payment" && (
            <>
              <h2 className="reg-step-title">{t("bf_payment_title")}</h2>
              <p className="reg-step-sub">{t("bi_payment_sub")}</p>
              <div style={{ border:`2px solid ${C.gray200}`, borderRadius:10, padding:"2rem", marginBottom:"1.5rem", background:C.white }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem", paddingBottom:"1rem", borderBottom:`1px solid ${C.gray200}` }}>
                  <div>
                    <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1rem", color:C.navy }}>Business International {chosenSize?.label}</div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500 }}>{chosenSize ? tBizIntl(chosenSize.id, "users") : ""} · {t("bi_payment_all_ed")} · {company.name}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    {showDiscount && <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, textDecoration:"line-through" }}>€ {formatPrice(baseYr)},–</div>}
                    <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1.25rem", color:C.navy, display:"flex", alignItems:"center", gap:"0.5rem", justifyContent:"flex-end" }}>
                      € {formatPrice(yr)},–
                      {showDiscount && <span style={{ background:C.green, color:C.navy, fontWeight:800, fontSize:"0.7rem", padding:"0.125rem 0.4rem", borderRadius:4 }}>−50%</span>}
                    </div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500 }}>{t("bf_payment_yearly")}</div>
                  </div>
                </div>
                <div className="input-group"><label className="input-label">{t("bf_payment_card")}</label><input className="input-field" type="text" placeholder="4242 4242 4242 4242" disabled style={{ background:C.gray50 }} /></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("bf_payment_expiry")}</label><input className="input-field" type="text" placeholder="12 / 28" disabled style={{ background:C.gray50 }} /></div>
                  <div className="input-group"><label className="input-label">{t("bf_payment_cvc")}</label><input className="input-field" type="text" placeholder="123" disabled style={{ background:C.gray50 }} /></div>
                </div>
              </div>
              <div className="reg-nav-bar"><BackButton onClick={() => setStep("overview")} /><button className="btn-red btn-full" onClick={() => setStep("invite")}>{t("bf_payment_cta")} € {formatPrice(yr)},– {t("bf_payment_activate")}</button></div>
            </>
          )}

          {/* ── Invite ── */}
          {step === "invite" && (
            <>
              <h2 className="reg-step-title">{t("bi_invite_title")}</h2>
              <p className="reg-step-sub">{t("bi_invite_sub")}</p>
              <div className="alert alert-success">
                <strong>{t("bi_invite_activated")}</strong> {t("bf_invite_for")} {company.name || t("inline_your_org")}.
                {" "}{t("bi_invite_package")} {chosenSize?.label} {t("bi_invite_with_all")}
              </div>
              {inviteEmails.map((em,i) => (
                <div key={i} className="input-group">
                  <label className="input-label">{t("bf_invite_colleague_label")} {i+1}</label>
                  <input className="input-field" type="text" inputMode="email" placeholder="naam@bedrijf.nl" value={em}
                    onChange={e => { const arr = [...inviteEmails]; arr[i] = e.target.value; setInviteEmails(arr) }} />
                </div>
              ))}
              <button className="link-btn" style={{ marginBottom:"1.5rem", display:"block" }} onClick={() => setInviteEmails(prev => [...prev, ""])}>{t("bf_invite_add_new")}</button>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-green btn-full" onClick={() => setStep("done")}>{t("bf_invite_send_new")}</button>
                <button className="btn-secondary btn-full" onClick={() => setStep("done")}>{t("bf_invite_skip_new")}</button>
              </div>
            </>
          )}

        </div>
        <div className="reg-sidebar">
          <RegSidebar planName={sidebar.name} planPrice={sidebar.price} planPriceSuffix={sidebar.priceSuffix} planFeatures={sidebar.features} planCta={sidebar.cta} savingsPerYear={sidebar.savings || 0} />
        </div>
      </div>
    </div>
  )
}
