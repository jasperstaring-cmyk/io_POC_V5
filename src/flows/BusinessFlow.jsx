import { useState } from 'react'
import { C } from '../tokens.js'
import { SEGMENTS, JOB_ROLE_CLUSTERS, BUSINESS_SIZES } from '../data.js'
import { TopProgressBar, RegSidebar, SelectionRow, JobRoleSelector, SegmentTypeSelector, EmailChip, BackButton, AuthNav, CdpProductLabel } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import { classifyEmailForReg, getWhitelistInfo, getCompanyNameFromEmail, hadRecentTrial } from '../utils.js'
import IOLogo from '../components/IOLogo.jsx'
import StripeCheckoutSim, { StripeLogo } from '../components/StripeCheckoutSim.jsx'

/* ─── Segment → pricing logic ──────────────────────────────────────────── */
const FREE_SEGMENTS = ["wealth", "institutional"]
function isFreePermanent(segId) { return FREE_SEGMENTS.includes(segId) }

function getSidebarMeta(segId, isPaid, chosenSize, xlCount, t, tBiz) {
  const features = t("bf_sidebar_features")
  const PERSONAL_PRO_YEARLY = 648
  if (isPaid && chosenSize) {
    const monthlyTotal = chosenSize.id === "XL"
      ? (xlCount || 16) * (chosenSize.perUser || 12.50)
      : chosenSize.monthlyPrice
    const maxU = chosenSize.id === "S" ? 5 : chosenSize.id === "M" ? 10 : chosenSize.id === "L" ? 15 : (xlCount || 16)
    const yearlyTeam = maxU * PERSONAL_PRO_YEARLY
    const yearlyPlan = monthlyTotal * 12
    const savings = Math.round(yearlyTeam - yearlyPlan)
    const price = chosenSize.id === "XL"
      ? `€ ${((xlCount || 16) * (chosenSize.perUser || 12.50)).toLocaleString("nl-NL")},–`
      : chosenSize.priceLabel
    return {
      name: `Business ${chosenSize.label}`,
      price,
      priceSuffix: t("bf_size_per_month") + ", " + t("inline_billed_annually"),
      cta: null,
      features: [...features, `${tBiz(chosenSize.id, "users")}`],
      savings,
    }
  }
  if (isPaid) {
    return { name:"Business", price: null, priceSuffix: t("bi_sidebar_select"), cta:null, features, savings:0 }
  }
  if (isFreePermanent(segId)) {
    return { name:"Business", price: t("inline_free"), priceSuffix: t("bf_sidebar_free_perm_suffix"), cta: t("bf_sidebar_free_permanent"), features, savings:0 }
  }
  return { name:"Business", price: t("inline_free"), priceSuffix: t("bf_sidebar_free_trial_suffix"), cta: t("bf_sidebar_free_trial"), features, savings:0 }
}

/* ─── Component ────────────────────────────────────────────────────────── */
export default function BusinessFlow({ onComplete, onStartOnboarding, onSkipToSite, onBack, onGoLogin, onGoEnterprise, gateEmail, profileData, onGoIntl, cameFromArticle }) {
  const { t, tSeg, tType, tBiz } = useLang()
  const hasProfile = !!(profileData)
  const initialTrialBlocked = hasProfile && hadRecentTrial(profileData.email)
  const [step, setStep]             = useState(initialTrialBlocked ? "size_picker" : hasProfile ? "segment_type" : gateEmail ? "profile" : "email")
  const [email, setEmail]           = useState(profileData?.email || gateEmail || "")
  const [firstName, setFirstName]   = useState(profileData?.firstName || "")
  const [lastName, setLastName]     = useState(profileData?.lastName || "")
  const [jobRole, setJobRole]       = useState(profileData?.jobRole || "")
  const [password, setPassword]     = useState(profileData?.password || "")
  const [segment, setSegment]       = useState(null)
  const [orgType, setOrgType]       = useState(null)
  const [company, setCompany]       = useState({ kvk:"", name:"", street:"", number:"", addition:"", zip:"", city:"", country:"NL", vat:"" })
  const [inviteEmails, setInviteEmails] = useState(["",""])
  const [agreed, setAgreed]         = useState(false)
  const [isPaidFlow, setIsPaidFlow] = useState(initialTrialBlocked)
  const [chosenSize, setChosenSize] = useState(null)
  const [xlUserCount, setXlUserCount] = useState("")
  const [returnToOverview, setReturnToOverview] = useState(false)

  const STEP_NUM_FREE = { email:1, profile:2, segment_type:3, intl_question:4, company:5, overview:6, invite:7, done:8 }
  const STEP_NUM_PAID = { email:1, trial_blocked:1, profile:2, size_picker:3, segment_type:4, intl_question:5, company:6, overview:7, payment:8, invite:9, done:10 }
  const stepMap = isPaidFlow ? STEP_NUM_PAID : STEP_NUM_FREE
  const TOTAL   = isPaidFlow ? 10 : 8
  const curr    = stepMap[step] || 1

  const selectedSegment = SEGMENTS.find(s => s.id === segment?.id)
  const sidebar = getSidebarMeta(segment?.id, isPaidFlow, chosenSize, parseInt(xlUserCount) || 16, t, tBiz)

  const [emailClass, setEmailClass] = useState(null)

  function handleCompanyChange(f, v) { setCompany(prev => ({ ...prev, [f]: v })) }

  function handleEmailSubmit(e) {
    e.preventDefault()
    const cls = classifyEmailForReg(email)
    setEmailClass(cls)
    if (cls === "generic" || cls === "private" || cls === "enterprise" || cls === "whitelist" || cls === "existing") {
      // Stay on email step — show the appropriate message
      return
    }
    if (hadRecentTrial(email)) { setIsPaidFlow(true); setStep("trial_blocked"); return }
    setStep("profile")
  }

  function handleSegmentTypeNext() {
    if (!segment || !orgType) return
    if (returnToOverview) { setReturnToOverview(false); setStep("overview"); return }
    setStep("intl_question")
  }

  function handleSizeNext() {
    if (!chosenSize) return
    setStep("segment_type")
  }

  const xlCount = parseInt(xlUserCount) || 16
  const xlPrice = xlCount * (BUSINESS_SIZES.find(s => s.id === "XL")?.perUser || 9)

  /* ── Done page ─────────────────────────────────────────────────────── */
  if (step === "done") {
    return (
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"100vh" }}>
        <div style={{ padding:"3rem 4rem", display:"flex", flexDirection:"column", justifyContent:"center", background:C.white, position:"relative" }}>
          <div style={{ position:"absolute", top:"2.5rem", left:"3rem" }}><IOLogo size={28} /></div>
          <div style={{ marginTop:"2rem" }}>
            <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"0.75rem" }}>
              {t("bf_done_welcome")}
            </h1>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, marginBottom:"1rem", lineHeight:"var(--lh-body)" }}>
              {isPaidFlow
                ? <>{t("inline_your")} Business {chosenSize?.label || ""} {t("inline_plan_for")} <strong>{company.name || t("inline_your_org")}</strong> {t("inline_activated")}</>
                : isFreePermanent(segment?.id)
                  ? <>{t("bf_done_buyside_verification")} <strong>{company.name || t("inline_your_org")}</strong>.</>
                  : <>{t("bf_done_sellside_trial")} <strong>{company.name || t("inline_your_org")}</strong>.</>
              }
            </p>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray500, marginBottom:"2rem", fontStyle:"italic" }}>
              {t("inline_confirm_email_at")} <strong>{email}</strong>.
            </p>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn-navy" style={{ padding:"0.875rem 2rem", fontSize:"1rem" }} onClick={() => (onStartOnboarding || onComplete)(true)}>{t("ob_start_intro")} →</button>
              <button className="btn-secondary" style={{ padding:"0.875rem 2rem", fontSize:"1rem" }} onClick={() => (onSkipToSite || onComplete)(true)}>{cameFromArticle ? t("ob_back_to_article") : t("ob_go_to_site")}</button>
            </div>
            <CdpProductLabel
              productName={
                isPaidFlow
                  ? `Business Sell Side Paid ${chosenSize?.label || ""}`
                  : isFreePermanent(segment?.id)
                    ? "Business Buy Side"
                    : "Business Sell Side"
              }
              edition="NL"
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

          {/* ── STAP 1: E-mail ── */}
          {step === "email" && (
            <>
              <h2 className="reg-step-title">{t("bf_email_title")}</h2>
              <p className="reg-step-sub">{t("bf_email_sub")}</p>
              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={handleEmailSubmit}>
                <div className="input-group">
                  <label className="input-label">{t("bf_email_label")}</label>
                  <input className="input-field" type="text" inputMode="email" placeholder={t("bf_email_placeholder")} value={email} onChange={e => { setEmail(e.target.value); setEmailClass(null) }} autoFocus required />
                </div>

                {/* Classification feedback */}
                {emailClass === "generic" && (
                  <div className="alert alert-warning" style={{ marginBottom:"1.25rem" }}>
                    {t("pf_generic_warn")}
                  </div>
                )}
                {emailClass === "private" && (
                  <div className="alert alert-warning" style={{ marginBottom:"1.25rem" }}>
                    {t("pf_private_warn")}
                    <div style={{ marginTop:"0.75rem" }}>
                      <button className="btn-green btn-full" type="button" onClick={() => { setEmailClass(null); setStep("profile") }}>{t("pf_private_continue")}</button>
                    </div>
                  </div>
                )}
                {emailClass === "existing" && (
                  <div className="alert alert-warning" style={{ marginBottom:"1.25rem" }}>
                    {t("pf_existing_warn")}
                    <div style={{ marginTop:"0.75rem" }}>
                      <button className="btn-green btn-full" type="button" onClick={() => { if (onGoLogin) onGoLogin() }}>{t("pf_existing_login")}</button>
                    </div>
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

                {!emailClass && (
                  <button className="btn-green btn-full" type="submit">{t("bf_next")}</button>
                )}
                {(emailClass === "generic") && (
                  <button className="btn-green btn-full" type="submit">{t("bf_next")}</button>
                )}
              </form>
            </>
          )}

          {/* ── STAP 2: Profiel ── */}
          {step === "profile" && (
            <>
              <h2 className="reg-step-title">{t("bf_profile_title")}</h2>
              <EmailChip email={email} onEdit={() => { setEmailClass(null); setStep("email") }} />
              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={e => { e.preventDefault(); if (!jobRole) return; if (returnToOverview) { setReturnToOverview(false); setStep("overview") } else { setStep(isPaidFlow ? "size_picker" : "segment_type") } }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("pf_firstname")}</label><input className="input-field" type="text" placeholder={t("pf_firstname")} value={firstName} onChange={e => setFirstName(e.target.value)} autoFocus required /></div>
                  <div className="input-group"><label className="input-label">{t("pf_lastname")}</label><input className="input-field" type="text" placeholder={t("pf_lastname")} value={lastName} onChange={e => setLastName(e.target.value)} required /></div>
                </div>
                <div className="input-group">
                  <label className="input-label">{t("pf_jobrole")}</label>
                  <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray500, margin:"0 0 0.75rem" }}>{t("pf_jobrole_sub")}</p>
                  <JobRoleSelector clusters={JOB_ROLE_CLUSTERS} selectedId={jobRole} onSelect={setJobRole} t={t} />
                </div>
                <div className="input-group">
                  <label className="input-label">{t("pf_password")}</label>
                  <input className="input-field" type="text" style={{ WebkitTextSecurity:"disc" }} autoComplete="off" data-1p-ignore data-lpignore="true" placeholder={t("pf_password_hint")} value={password} onChange={e => setPassword(e.target.value)} minLength={8} required />
                </div>
                <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.25rem" }}>
                  {t("bf_terms_intro")} <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_terms_link")}</button> {t("pf_privacy_and")} <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_privacy_link")}.</button>
                </p>
                <button className="btn-green btn-full" type="submit">{t("bf_next")}</button>
              </form>
            </>
          )}

          {/* ── TRIAL BLOKKADE ── */}
          {step === "trial_blocked" && (
            <>
              <h2 className="reg-step-title">{t("bf_trial_blocked_title")}</h2>
              <EmailChip email={email} onEdit={() => { setIsPaidFlow(false); setStep("email") }} />
              <div className="alert alert-warning" style={{ marginBottom:"1.25rem" }}>
                <strong>{t("bf_trial_blocked_alert")}</strong><br/>{t("bf_trial_blocked_body")}
              </div>
              <div style={{ background:"rgba(78,213,150,0.08)", border:`1.5px solid ${C.green}`, borderRadius:10, padding:"1.25rem 1.5rem", marginBottom:"1.5rem" }}>
                <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1.05rem", color:C.navy, marginBottom:"0.5rem" }}>
                  {t("bf_trial_blocked_avail_title")}
                </div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, lineHeight:"var(--lh-body)" }}>
                  {t("bf_trial_blocked_avail_body")}
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-green btn-full" onClick={() => setStep(hasProfile ? "size_picker" : "profile")}>{t("bf_trial_blocked_cta")}</button>
                <button className="btn-secondary btn-full" onClick={() => { setIsPaidFlow(false); setStep("email") }}>{t("bf_trial_blocked_other")}</button>
              </div>
            </>
          )}

          {/* ── STAP (paid): Pakketkeuze S/M/L/XL ── */}
          {step === "size_picker" && (
            <>
              <h2 className="reg-step-title">{t("bf_size_title")}</h2>
              <p className="reg-step-sub">{t("bf_size_sub")}</p>

              {/* Pricing anchor */}
              <div style={{
                display:"flex", alignItems:"center", gap:"0.875rem",
                background:"linear-gradient(135deg, #FFF8F0 0%, #FFF2E6 100%)",
                border:`1.5px solid #F0C878`, borderRadius:10,
                padding:"1rem 1.25rem", marginBottom:"1.5rem",
              }}>
                <div style={{
                  width:44, height:44, borderRadius:"50%", flexShrink:0,
                  background:"#F0C878", display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#8B6914"/></svg>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", fontWeight:700, color:C.navy, marginBottom:"0.2rem" }}>
                    Personal Pro: <span style={{ color:"#8B6914" }}>{t("bf_size_anchor_price")}</span>
                  </div>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray700, lineHeight:"var(--lh-body)" }}>
                    {t("bf_size_anchor")}
                  </div>
                </div>
              </div>

              {BUSINESS_SIZES.map(sz => {
                const PERSONAL_PRO_MONTHLY = 54
                const maxU = sz.id === "S" ? 5 : sz.id === "M" ? 10 : sz.id === "L" ? 15 : (parseInt(xlUserCount) || 16)
                const teamCost = maxU * PERSONAL_PRO_MONTHLY
                const planCost = sz.id === "XL" ? maxU * (sz.perUser || 12.50) : sz.monthlyPrice
                const savePct = Math.round((1 - planCost / teamCost) * 100)
                const saveBadge = savePct > 0 ? `${t("inline_save")} ${savePct}%` : null
                const ppPrice = sz.id === "XL"
                  ? (sz.perUser || 12.50)
                  : Math.round((sz.monthlyPrice / maxU) * 100) / 100
                const ppLabel = `€ ${ppPrice.toLocaleString("nl-NL", {minimumFractionDigits: ppPrice % 1 ? 2 : 0})},– ${t("inline_per_person")}`
                return (
                <div key={sz.id}>
                  <SelectionRow selected={chosenSize?.id === sz.id} onSelect={() => setChosenSize(sz)}
                    name={`${sz.label} — ${tBiz(sz.id, "users")}`}
                    desc={<><span>{`€ ${(sz.monthlyPrice ? sz.monthlyPrice * 12 : (maxU * (sz.perUser || 12.50) * 12)).toLocaleString("nl-NL")},– ${t("bf_size_per_year")} (${t("inline_excl_vat")})`}</span><br/><span style={{ color:C.gray500, fontSize:"0.8rem" }}>{ppLabel}</span></>}
                    badge={saveBadge}
                    right={sz.id === "XL" ? (xlUserCount ? `€ ${(xlPrice).toLocaleString("nl-NL")},– /${t("inline_mo")}` : (t("biz_XL_price_label"))) : `${sz.priceLabel} /${t("inline_mo")}`} />
                  {sz.id === "XL" && chosenSize?.id === "XL" && (
                    <div style={{ margin:"-0.25rem 0 0.75rem 2.75rem", padding:"1rem", background:C.gray50, borderRadius:6, border:`1px solid ${C.gray200}` }}>
                      <label className="input-label">{t("bf_size_users_label")}</label>
                      <input className="input-field" type="number" min="16" placeholder="16+" value={xlUserCount}
                        onChange={e => setXlUserCount(e.target.value)} style={{ maxWidth:180, marginTop:"0.25rem" }} />
                      {xlUserCount && parseInt(xlUserCount) >= 16 && (
                        <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy, marginTop:"0.5rem" }}>
                          {t("bf_size_total")}: <strong>€ {xlPrice.toLocaleString("nl-NL")},–</strong> {t("bf_size_per_month")} · <strong>€ {(xlPrice * 12).toLocaleString("nl-NL")},–</strong> {t("bf_size_per_year")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )})}
              {chosenSize && chosenSize.id !== "XL" && (
                <div style={{ background:C.gray50, borderRadius:6, border:`1px solid ${C.gray200}`, padding:"1rem 1.25rem", marginTop:"0.5rem", marginBottom:"0.5rem" }}>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy }}>
                    <strong>{chosenSize.label}</strong> · {tBiz(chosenSize.id, "users")}<br/>
                    {chosenSize.priceLabel} {t("bf_size_per_month")} · <strong>€ {(chosenSize.monthlyPrice * 12).toLocaleString("nl-NL")},–</strong> {t("bf_size_per_year")} ({t("inline_excl_vat")})
                  </div>
                </div>
              )}
              <div className="reg-nav-bar" style={{ marginTop:"1rem" }}>
                <BackButton onClick={() => setStep("profile")} />
                <button className="btn-green btn-full" onClick={handleSizeNext} disabled={!chosenSize || (chosenSize.id === "XL" && (!xlUserCount || parseInt(xlUserCount) < 16))}>{t("bf_further")}</button>
              </div>
            </>
          )}

          {/* ── Segment & Type (gecombineerd via accordion) ── */}
          {step === "segment_type" && (
            <>
              <h2 className="reg-step-title">{t("bf_segment_title")}</h2>
              <p className="reg-step-sub">{t("bf_segment_sub")}</p>
              <SegmentTypeSelector
                segments={SEGMENTS}
                selectedSegment={segment}
                selectedType={orgType}
                onSelect={(seg, tp) => { setSegment(seg); setOrgType(tp) }}
                tSeg={tSeg}
                tType={tType}
                t={t}
              />
              {segment && !isPaidFlow && isFreePermanent(segment.id) && (
                <div style={{
                  marginTop:"1rem", borderRadius:10, overflow:"hidden",
                  border:`1.5px solid ${C.green}`, background:"rgba(78,213,150,0.06)",
                }}>
                  <div style={{ padding:"1rem 1.25rem" }}>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.green, marginBottom:"0.75rem" }}>
                      {t("bf_segment_value_label")}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"1.25rem", marginBottom:"0.75rem" }}>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", color:C.gray500, marginBottom:"0.2rem" }}>{t("bf_segment_value_normal")}</div>
                        <div style={{ fontFamily:"var(--font-sans)", fontSize:"1.25rem", fontWeight:800, color:C.gray500, textDecoration:"line-through" }}>€ 54,–</div>
                        <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", color:C.gray500 }}>{t("bf_segment_value_pp")}</div>
                      </div>
                      <div style={{ fontSize:"1.5rem", color:C.green }}>→</div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", color:C.green, fontWeight:700, marginBottom:"0.2rem" }}>{t("bf_segment_value_your")}</div>
                        <div style={{ fontFamily:"var(--font-sans)", fontSize:"1.5rem", fontWeight:800, color:C.green }}>{t("bf_segment_value_free")}</div>
                        <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", color:C.green, fontWeight:600 }}>{t("bf_segment_value_pp")}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray700, lineHeight:"var(--lh-body)" }}>
                      {t("bf_segment_value_body")}
                    </div>
                  </div>
                </div>
              )}
              {segment && !isPaidFlow && !isFreePermanent(segment.id) && (
                <div className="alert alert-info" style={{ marginTop:"1rem", fontSize:"0.85rem" }}>
                  {t("bf_segment_orgs_in")} {tSeg(segment.id, "name")} {t("bf_segment_free_trial")}
                </div>
              )}
              <div className="reg-nav-bar">
                <BackButton onClick={() => isPaidFlow ? setStep("size_picker") : hasProfile ? onBack() : setStep("profile")} />
                <button className="btn-green btn-full" onClick={handleSegmentTypeNext} disabled={!segment || !orgType}>{t("bf_next")}</button>
              </div>
            </>
          )}

          {/* ── International question ── */}
          {step === "intl_question" && (
            <>
              <h2 className="reg-step-title">{t("bf_intl_q_title")}</h2>
              <p className="reg-step-sub">{t("bf_intl_q_sub")}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", marginTop:"1.25rem" }}>
                <button className="eg-intent-card eg-intent-secondary" style={{ border:`1.5px solid ${C.gray200}` }}
                  onClick={() => setStep("company")}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16" stroke={C.navy} strokeWidth="1.75" strokeLinecap="round"/><path d="M9 21V13h6v8" stroke={C.navy} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", fontWeight:700, color:C.navy }}>{t("bf_intl_q_no")}</span>
                  </div>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.75rem", color:C.gray500, marginTop:"0.25rem", paddingLeft:"0.125rem" }}>{t("bf_intl_q_no_sub")}</div>
                </button>
                <button className="eg-intent-card eg-intent-secondary" style={{ border:`1.5px solid ${C.gray200}` }}
                  onClick={() => { if (onGoIntl) onGoIntl({ segment, orgType }) }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.navy} strokeWidth="1.75"/><path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z" stroke={C.navy} strokeWidth="1.5"/></svg>
                    <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", fontWeight:700, color:C.navy }}>{t("bf_intl_q_yes")}</span>
                  </div>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.75rem", color:C.gray500, marginTop:"0.25rem", paddingLeft:"0.125rem" }}>{t("bf_intl_q_yes_sub")}</div>
                </button>
              </div>
              <div className="reg-nav-bar" style={{ marginTop:"1.25rem" }}>
                <BackButton onClick={() => setStep("segment_type")} />
              </div>
            </>
          )}

          {/* ── Bedrijfsgegevens (restructured: conditional fields) ── */}
          {step === "company" && (() => {
            const isBuySide = isFreePermanent(segment?.id)
            const needsKvkVat = isBuySide || isPaidFlow  // Buy Side NL or Paid → KvK+VAT required
            const needsAddress = isPaidFlow               // Only paid needs full address
            return (
            <>
              <h2 className="reg-step-title">{t("bf_company_title")}</h2>
              <p className="reg-step-sub">{t("bf_company_sub_new")}</p>

              {/* Segment verification warning for Buy Side */}
              {isBuySide && (
                <div style={{
                  display:"flex", alignItems:"flex-start", gap:"0.5rem",
                  background:"rgba(240,200,120,0.1)", border:"1px solid rgba(240,200,120,0.4)",
                  borderRadius:8, padding:"0.625rem 0.875rem", marginBottom:"1.25rem",
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop:"0.1rem", flexShrink:0 }}>
                    <circle cx="8" cy="8" r="7" stroke="#B8860B" strokeWidth="1.25"/>
                    <path d="M8 5v3.5M8 10.5v.5" stroke="#B8860B" strokeWidth="1.25" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:"#6B4F00", lineHeight:"1.4" }}>
                    {t("bf_verification_notice")}
                  </span>
                </div>
              )}

              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={e => { e.preventDefault(); setStep("overview") }}>
                {/* 1. Company name (always required) */}
                <div className="input-group"><label className="input-label">{t("bf_company_name_label")}</label><input className="input-field" type="text" placeholder={t("bf_company_name_label")} value={company.name} onChange={e => handleCompanyChange("name", e.target.value)} autoFocus required /></div>

                {/* 2. Country (always required) */}
                <div className="input-group"><label className="input-label">{t("bf_country_label")}</label>
                  <select className="input-field" value={company.country} onChange={e => handleCompanyChange("country", e.target.value)}>
                    <option value="NL">{t("bf_country_nl")}</option><option value="BE">{t("bf_country_be")}</option><option value="DE">{t("bf_country_de")}</option><option value="FR">{t("bf_country_fr")}</option><option value="LU">{t("bf_country_lu")}</option>
                  </select>
                </div>

                {/* 3. Address (required for paid, optional for trial) */}
                <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("bf_street_label")}{!needsAddress && <span style={{ color:C.gray400, fontSize:"0.75rem" }}> ({t("bf_optional")})</span>}</label><input className="input-field" type="text" placeholder={t("bf_street_label")} value={company.street} onChange={e => handleCompanyChange("street", e.target.value)} required={needsAddress || isBuySide} /></div>
                  <div className="input-group"><label className="input-label">{t("bf_housenr_label")}</label><input className="input-field" type="text" placeholder="12" value={company.number} onChange={e => handleCompanyChange("number", e.target.value)} required={needsAddress || isBuySide} /></div>
                  <div className="input-group"><label className="input-label">{t("bf_addition_label")}</label><input className="input-field" type="text" placeholder="A" value={company.addition} onChange={e => handleCompanyChange("addition", e.target.value)} /></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("bf_zip_label")}{!needsAddress && <span style={{ color:C.gray400, fontSize:"0.75rem" }}> ({t("bf_optional")})</span>}</label><input className="input-field" type="text" placeholder="0000 AA" value={company.zip} onChange={e => handleCompanyChange("zip", e.target.value)} required={needsAddress || isBuySide} /></div>
                  <div className="input-group"><label className="input-label">{t("bf_city_label")}{!needsAddress && <span style={{ color:C.gray400, fontSize:"0.75rem" }}> ({t("bf_optional")})</span>}</label><input className="input-field" type="text" placeholder={t("bf_city_label")} value={company.city} onChange={e => handleCompanyChange("city", e.target.value)} required={needsAddress || isBuySide} /></div>
                </div>

                {/* 4. KvK (conditional: required for Buy Side NL + Paid, optional for trial) */}
                <div className="input-group">
                  <label className="input-label">{t("bf_kvk_label")}{!needsKvkVat && <span style={{ color:C.gray400, fontSize:"0.75rem" }}> ({t("bf_optional")})</span>}</label>
                  <input className="input-field" type="text" placeholder="12345678" value={company.kvk} onChange={e => handleCompanyChange("kvk", e.target.value)} required={needsKvkVat} />
                </div>

                {/* 5. VAT (conditional: required for Buy Side NL + Paid, optional for trial) */}
                <div className="input-group">
                  <label className="input-label">{t("bf_vat_label")}{!needsKvkVat && <span style={{ color:C.gray400, fontSize:"0.75rem" }}> ({t("bf_optional")})</span>}</label>
                  <input className="input-field" type="text" placeholder="NL123456789B01" value={company.vat} onChange={e => handleCompanyChange("vat", e.target.value)} required={needsKvkVat} />
                </div>

                <div className="reg-nav-bar">
                  <BackButton onClick={() => setStep("intl_question")} />
                  <button className="btn-green btn-full" type="submit">{t("bf_further")}</button>
                </div>
              </form>
            </>
            )
          })()}

          {/* ── Overzicht ── */}
          {step === "overview" && (
            <>
              <h2 className="reg-step-title">{t("bf_overview_title")}</h2>
              <p className="reg-step-sub">{t("bf_overview_sub")}</p>

              <div style={{ border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1.125rem 1.25rem", marginBottom:"0.75rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500 }}>1. {t("bf_overview_personal")}</span>
                  <button className="link-btn" style={{ fontSize:"0.8rem" }} onClick={() => { setReturnToOverview(true); setStep("profile") }}>{t("bf_overview_edit")}</button>
                </div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, lineHeight:1.6 }}>{firstName} {lastName}<br/>{email}<br/>{jobRole ? t(`jr_${jobRole}_name`) : ""}</div>
              </div>

              <div style={{ border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1.125rem 1.25rem", marginBottom:"0.75rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500 }}>2. {t("bf_overview_org")}</span>
                  <button className="link-btn" style={{ fontSize:"0.8rem" }} onClick={() => { setReturnToOverview(true); setStep("company") }}>{t("bf_overview_edit")}</button>
                </div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, lineHeight:1.6 }}>
                  {company.name}<br/>{company.street} {company.number}{company.addition ? ` ${company.addition}` : ""}, {company.zip} {company.city}<br/>
                  KvK: {company.kvk}{company.vat ? ` · BTW: ${company.vat}` : ""}
                </div>
              </div>

              <div style={{ border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1.125rem 1.25rem", marginBottom:"0.75rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500 }}>3. {t("bf_overview_segment")}</span>
                  <button className="link-btn" style={{ fontSize:"0.8rem" }} onClick={() => setStep("segment_type")}>{t("bf_overview_edit")}</button>
                </div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, lineHeight:1.6 }}>{segment ? tSeg(segment.id, "name") : "–"}{orgType ? ` — ${tType(orgType.id, "name")}` : ""}</div>
              </div>

              <div style={{ background:"rgba(78,213,150,0.08)", border:`1.5px solid ${C.green}`, borderRadius:8, padding:"1.125rem 1.25rem", marginBottom:"1.5rem" }}>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.green, marginBottom:"0.5rem" }}>
                  {isPaidFlow ? `4. ${t("bf_overview_plan")}` : t("bf_overview_plan_free")}
                </div>
                {isPaidFlow ? (
                  <>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.25rem" }}>
                      <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1.125rem", color:C.navy }}>Business {chosenSize?.label}</div>
                      <button className="link-btn" style={{ fontSize:"0.8rem" }} onClick={() => setStep("size_picker")}>{t("bf_overview_edit")}</button>
                    </div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, marginBottom:"0.25rem" }}>{chosenSize ? tBiz(chosenSize.id, "users") : ""}</div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"1rem", fontWeight:700, color:C.navy }}>
                      {chosenSize?.id === "XL"
                        ? `€ ${xlPrice.toLocaleString("nl-NL")},– ${t("bf_size_per_month")} · € ${(xlPrice * 12).toLocaleString("nl-NL")},– ${t("bf_size_per_year")}`
                        : `${chosenSize?.priceLabel} ${t("bf_size_per_month")} · € ${((chosenSize?.monthlyPrice || 0) * 12).toLocaleString("nl-NL")},– ${t("bf_size_per_year")}`
                      }
                    </div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, marginTop:"0.25rem" }}>{t("bf_payment_stripe")}</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1.125rem", color:C.navy, marginBottom:"0.25rem" }}>
                      {isFreePermanent(segment?.id) ? t("bf_free_permanent") : t("bf_free_trial")}
                    </div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, lineHeight:"var(--lh-body)" }}>
                      {isFreePermanent(segment?.id)
                        ? t("inline_as_org_in") + " " + (segment ? tSeg(segment.id, "name") : "") + " " + t("bf_free_perm_body")
                        : t("bf_free_trial_body")
                      }
                    </div>
                  </>
                )}
              </div>

              {/* Stripe betaalblokje — alleen bij betaalde flow */}
              {isPaidFlow && (
                <div style={{ border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1.125rem 1.25rem", marginBottom:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.375rem" }}>
                      5. {t("pf_confirm_pay")}
                    </div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy }}>{t("pf_confirm_stripe")}</div>
                  </div>
                  <StripeLogo height={24} />
                </div>
              )}

              <label style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start", marginBottom:"1.5rem", cursor:"pointer" }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop:3, accentColor:C.green }} />
                <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray700, lineHeight:"var(--lh-body)" }}>
                  {t("bf_agree_label")} <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_terms_link")}</button> {t("bf_agree_and")} <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_privacy_link")}</button>.
                </span>
              </label>

              <div className="reg-nav-bar">
                <BackButton onClick={() => setStep("company")} />
                <button className="btn-red btn-full" onClick={() => setStep(isPaidFlow ? "payment" : "invite")} disabled={!agreed}>
                  {isPaidFlow ? t("bf_go_payment") : t("bf_create_account")}
                </button>
              </div>
            </>
          )}

          {/* ── Betaling (Stripe simulatie) ── */}
          {step === "payment" && (
            <>
              <h2 className="reg-step-title">{t("bf_payment_title")}</h2>
              <p className="reg-step-sub">{t("bf_payment_sub")} Business {chosenSize?.label}.</p>

              <StripeCheckoutSim
                amount={`€ ${(chosenSize?.id === "XL" ? xlPrice * 12 : (chosenSize?.monthlyPrice || 0) * 12).toLocaleString("nl-NL")},–`}
                description={`Business ${chosenSize?.label} — ${chosenSize ? tBiz(chosenSize.id, "users") : ""} · ${company.name}`}
                onPay={() => setStep("invite")}
                onBack={() => setStep("overview")}
              />
            </>
          )}

          {/* ── Collega's uitnodigen ── */}
          {step === "invite" && (
            <>
              <h2 className="reg-step-title">{t("bf_invite_title_new")}</h2>
              <p className="reg-step-sub">{t("bf_invite_sub_new")}</p>
              <div className="alert alert-success">
                <strong>{t("bf_invite_activated")}</strong> {t("bf_invite_for")} {company.name || t("inline_your_org")}.
                {isPaidFlow && chosenSize && (<> {t("inline_you_have_the")} {chosenSize.label} {t("inline_plan")} ({tBiz(chosenSize.id, "users")}).</>)}
              </div>
              {inviteEmails.map((em,i) => (
                <div key={i} className="input-group">
                  <label className="input-label">{t("bf_invite_colleague_label")} {i+1}</label>
                  <input className="input-field" type="text" inputMode="email" placeholder="naam@bedrijf.nl" value={em}
                    onChange={e => { const arr = [...inviteEmails]; arr[i] = e.target.value; setInviteEmails(arr) }} />
                </div>
              ))}
              <button className="link-btn" style={{ marginBottom:"1.5rem", display:"block" }}
                onClick={() => setInviteEmails(prev => [...prev, ""])}>{t("bf_invite_add_new")}</button>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-green btn-full" onClick={() => setStep("done")}>{t("bf_invite_send_new")}</button>
                <button className="btn-secondary btn-full" onClick={() => setStep("done")}>{t("bf_invite_skip_new")}</button>
              </div>
            </>
          )}

        </div>
        <div className="reg-sidebar">
          <RegSidebar planName={sidebar.name} planPrice={sidebar.price} planPriceSuffix={sidebar.priceSuffix} planFeatures={sidebar.features} planCta={sidebar.cta} savingsPerYear={sidebar.savings || 0} sidebarContext={isPaidFlow ? "business_paid" : isFreePermanent(segment?.id) ? "business_buyside" : "business_trial"} />
        </div>
      </div>
    </div>
  )
}
