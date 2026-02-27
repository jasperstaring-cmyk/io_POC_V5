import { useState } from 'react'
import { C } from '../tokens.js'
import { JOB_ROLE_CLUSTERS } from '../data.js'
import { classifyEmailForReg, getWhitelistInfo } from '../utils.js'
import { TopProgressBar, RegSidebar, SelectionRow, JobRoleSelector, EmailChip, AuthNav, CheckItem, CdpProductLabel } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import IOLogo from '../components/IOLogo.jsx'

// ─── Plan metadata (voor sidebar) ───────────────────────────────────────────
function planMeta(planId, t) {
  if (!planId) return {}
  const map = {
    freemium: { name: t("plan_freemium_name"),  price: null,                          cta: null,                                                        features: t("plan_freemium_features") || [] },
    trial:    { name: t("plan_trial_name"),     price: t("plan_trial_price") + " " + (t("plan_trial_suffix") || ""), cta: t("sidebar_trial_cta"), features: t("plan_trial_features") || [] },
    pro:      { name: t("plan_pro_name"),       price: t("plan_pro_price") + " " + (t("plan_pro_suffix") || ""),     cta: null,                                                        features: t("plan_pro_features") || [] },
  }
  return map[planId] || {}
}

export default function PersonalFlow({ selectedPlan, onComplete, onSkipToSite, onBack, onGoLogin, onGoWhitelist, invitedEmail, invitedCompany, invitedPlanType, whitelistEmail, whitelistInfo, enterpriseEmail, gateEmail, profileData }) {
  const { t } = useLang()
  const isWhitelistEnterprise = !!(whitelistEmail && whitelistInfo)
  const isEnterpriseRedirect = !!(enterpriseEmail)
  const hasPrefilledEmail = !!(invitedEmail || whitelistEmail || enterpriseEmail || gateEmail || profileData)
  const hasPrefilledProfile = !!(profileData)
  // If profileData is provided, skip both email and profile steps → start at plan choice (confirm)
  const initialStep = hasPrefilledProfile ? (selectedPlan === "pro" ? "payment" : "confirm")
                    : hasPrefilledEmail ? "profile"
                    : "email"
  const [step, setStep]             = useState(initialStep)
  const [email, setEmail]           = useState(profileData?.email || invitedEmail || whitelistEmail || enterpriseEmail || gateEmail || "")
  const [firstName, setFirstName]   = useState(profileData?.firstName || "")
  const [lastName, setLastName]     = useState(profileData?.lastName || "")
  const [jobRole, setJobRole]       = useState(profileData?.jobRole || "")
  const [password, setPassword]     = useState(profileData?.password || "")
  const [chosenPlan, setChosenPlan] = useState(selectedPlan || "freemium")
  const [privateOverride, setPrivateOverride] = useState(false)
  const [isEnterprise, setIsEnterprise]   = useState(isWhitelistEnterprise || isEnterpriseRedirect)
  const [isInvited, setIsInvited]         = useState(!!(invitedEmail && invitedCompany))

  const totalSteps  = isEnterprise || isInvited ? 2 : chosenPlan === "pro" ? 4 : 3
  const STEP_NUM    = { email:1, private_warning:1, generic_block:1, existing:1, enterprise:1, whitelist:1, profile:2, payment:3, confirm:3, done:4 }
  const currentStep = STEP_NUM[step] || 1

  // Sidebar plan info
  const regularMeta = planMeta(chosenPlan, t)
  const enterpriseName = isWhitelistEnterprise
    ? (whitelistInfo.edition === "all" ? "Enterprise — All editions" : "Enterprise — NL")
    : "Enterprise"
  const meta = isEnterprise
    ? { name: enterpriseName, price: null, cta: isWhitelistEnterprise ? (t("wl_sidebar_cta_enterprise")) : t("pf_enterprise_profile_banner"), features: t("plan_pro_features") || [] }
    : isInvited
    ? { name: invitedPlanType === "bizintl" ? "Business International" : "Business", price: null, cta: t("inv_banner_post"), features: t("plan_pro_features") || [] }
    : regularMeta

  function handleEmailSubmit(e) {
    e.preventDefault()
    const type = classifyEmailForReg(email)
    if (type === "generic")                     { setStep("generic_block"); return }
    if (type === "private" && !privateOverride)  { setStep("private_warning"); return }
    if (type === "existing")                    { setStep("existing"); return }
    if (type === "enterprise")                  { setStep("enterprise"); return }
    if (type === "whitelist")                   { setStep("whitelist"); return }
    setStep("profile")
  }

  function handleProfileSubmit(e) {
    e.preventDefault()
    if (!jobRole) return               // job role selection required
    if (isEnterprise || isInvited) { setStep("done"); return }
    setStep(chosenPlan === "pro" ? "payment" : "confirm")
  }

  // Plan is al gekozen op de PlanPickerPage

  // ── Done: designer bevestigingspagina ────────────────────────────────────────
  if (step === "done") {
    const items = chosenPlan === "pro" ? t("ob_confirm_items_pro")
                : chosenPlan === "trial" ? t("ob_confirm_items_trial")
                : t("ob_confirm_items")
    const doneTitle = isEnterprise ? t("pf_done_enterprise")
                    : isInvited   ? t("pf_done_invited")
                    : chosenPlan === "pro" ? t("pf_done_pro") : chosenPlan === "trial" ? t("pf_done_trial") : t("pf_done_free")
    const doneBody  = isWhitelistEnterprise
                    ? t("pf_done_body_wl_enterprise").replace("{company}", whitelistInfo?.company || "").replace("{edition}", whitelistInfo?.edition === "all" ? t("lm_wl_edition_all") : t("lm_wl_edition_nl"))
                    : isEnterprise ? t("pf_done_body_enterprise")
                    : isInvited   ? t("pf_done_body_invited").replace("{company}", invitedCompany || "")
                    : chosenPlan === "pro" ? t("pf_done_body_pro") : chosenPlan === "trial" ? t("pf_done_body_trial") : t("pf_done_body_free")
    return (
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"100vh" }}>
        {/* Links */}
        <div style={{ padding:"3rem 4rem", display:"flex", flexDirection:"column", justifyContent:"center", background:C.white, position:"relative" }}>
          <div style={{ position:"absolute", top:"2.5rem", left:"3rem" }}>
            <IOLogo size={28} />
          </div>
          <div style={{ marginTop:"2rem" }}>
            <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"0.75rem" }}>
              {doneTitle}
            </h1>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, marginBottom:"2rem", lineHeight:"var(--lh-body)" }}>
              {doneBody}
            </p>
            <div style={{ marginBottom:"2rem" }}>
              <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.875rem" }}>{t("ob_what_now")}</div>
              {(Array.isArray(items) ? items : []).map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"0.625rem" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray500, marginBottom:"2rem", fontStyle:"italic" }}>
              {t("pf_done_confirm")} <strong>{email}</strong>.
            </p>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn-navy" style={{ padding:"0.875rem 2rem", fontSize:"1rem" }} onClick={() => onComplete(isEnterprise ? "enterprise" : undefined)}>{t("ob_start_intro")} →</button>
              <button className="btn-secondary" style={{ padding:"0.875rem 2rem", fontSize:"1rem" }} onClick={() => (onSkipToSite || onComplete)(isEnterprise ? "enterprise" : undefined)}>{t("ob_go_to_site")}</button>
            </div>
            <CdpProductLabel
              productName={
                isEnterprise
                  ? (isWhitelistEnterprise
                      ? (whitelistInfo?.edition === "all" ? "Enterprise All" : "Enterprise NL")
                      : "Enterprise NL")
                  : isInvited
                    ? (invitedPlanType === "bizintl" ? "Business International" : "Business Sell Side")
                    : chosenPlan === "pro" ? "Personal Pro"
                    : chosenPlan === "trial" ? "Personal Trial"
                    : "Personal Free"
              }
              edition="NL"
            />
          </div>
        </div>
        {/* Rechts — grote foto */}
        <div style={{ position:"relative", overflow:"hidden", background:`linear-gradient(135deg,${C.navy},#1B3A5C)` }}>
          <img src="/images/beeld_onboarding_welcome.png" alt="" style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }} />
        </div>
      </div>
    )
  }

  return (
    <div className="reg-layout">
      <TopProgressBar total={totalSteps} current={currentStep} />
      <AuthNav onBack={onBack} />
      <div className="reg-container">
        <div className="reg-main">

          {/* ── E-mail ── */}
          {step === "email" && (
            <>
              <h2 className="reg-step-title">{t("pf_email_title")}</h2>
              <p className="reg-step-sub">{t("pf_email_sub")}</p>
              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={handleEmailSubmit}>
                <div className="input-group">
                  <label className="input-label">{t("pf_email_label")}</label>
                  <input className="input-field" type="text" inputMode="email" placeholder={t("pf_email_placeholder")} value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
                </div>
                <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.25rem" }}>
                  {t("pf_email_terms")}{" "}
                  <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_terms_link")}</button>{" "}
                  {t("pf_privacy_and")}{" "}
                  <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_privacy_link")}.</button>
                </p>
                <button className="btn-green btn-full" type="submit">{t("pf_check_email")}</button>
              </form>
            </>
          )}

          {/* ── Generiek geblokkeerd ── */}
          {step === "generic_block" && (
            <>
              <h2 className="reg-step-title">{t("pf_generic_title")}</h2>
              <EmailChip email={email} onEdit={() => { setStep("email"); setPrivateOverride(false) }} />
              <div className="alert alert-error">
                <strong>{t("pf_generic_alert")}</strong><br/>{t("pf_generic_body")}
              </div>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray700, marginBottom:"1.5rem", lineHeight:"var(--lh-body)" }}>{t("pf_generic_sub")}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-primary btn-full" onClick={() => setStep("email")}>{t("pf_generic_other")}</button>
                <button className="btn-secondary btn-full" onClick={onBack}>{t("pf_generic_biz")}</button>
              </div>
            </>
          )}

          {/* ── Privé waarschuwing ── */}
          {step === "private_warning" && (
            <>
              <h2 className="reg-step-title">{t("pf_private_title")}</h2>
              <EmailChip email={email} onEdit={() => { setStep("email"); setPrivateOverride(false) }} />
              <div className="alert alert-warning">
                <strong>{t("pf_private_alert")}</strong><br/>{t("pf_private_body1")}
              </div>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray700, marginBottom:"1.25rem", lineHeight:"var(--lh-body)" }}>{t("pf_private_body2")}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-primary btn-full" onClick={() => { setPrivateOverride(true); setStep("profile") }}>{t("pf_private_continue")}</button>
                <button className="btn-secondary btn-full" onClick={() => setStep("email")}>{t("pf_private_other")}</button>
              </div>
            </>
          )}

          {/* ── Bestaand account ── */}
          {step === "existing" && (
            <>
              <h2 className="reg-step-title">{t("pf_existing_title")}</h2>
              <EmailChip email={email} onEdit={() => setStep("email")} />
              <div className="alert alert-warning">{t("pf_existing_body")}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem", marginTop:"1rem" }}>
                <button className="btn-primary btn-full" onClick={onGoLogin}>{t("pf_existing_login")}</button>
                <button className="btn-secondary btn-full" onClick={() => setStep("email")}>{t("pf_existing_other")}</button>
              </div>
            </>
          )}

          {/* ── Enterprise ── */}
          {step === "enterprise" && (
            <>
              <h2 className="reg-step-title">{t("pf_enterprise_title")}</h2>
              <EmailChip email={email} onEdit={() => setStep("email")} />
              <div className="alert alert-success" style={{ marginBottom:"1.25rem" }}>
                {t("pf_enterprise_body")}
              </div>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.25rem" }}>
                {t("pf_enterprise_profile_note")}
              </p>
              <button className="btn-green btn-full" onClick={() => { setIsEnterprise(true); setStep("profile") }}>{t("pf_enterprise_profile_cta")}</button>
            </>
          )}

          {/* ── Whitelist → Enterprise profile ── */}
          {step === "whitelist" && (() => {
            const wlInfo = getWhitelistInfo(email)
            return (
            <>
              <h2 className="reg-step-title">{t("pf_wl_redirect_title")}</h2>
              <EmailChip email={email} onEdit={() => setStep("email")} />
              <div className="alert alert-success" style={{ marginBottom:"1.25rem" }}>
                <strong>{wlInfo?.company || t("inline_your_org")}</strong> {t("pf_wl_redirect_body")}{" "}
                {wlInfo?.edition === "all" ? t("lm_wl_edition_all") : t("lm_wl_edition_nl")}.
                <br/><br/>
                {t("pf_wl_redirect_admin")}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-green btn-full" onClick={() => {
                  if (onGoWhitelist) onGoWhitelist(email, wlInfo)
                }}>
                  {t("pf_enterprise_profile_cta")}
                </button>
                <button className="btn-secondary btn-full" onClick={() => setStep("email")}>{t("pf_private_other")}</button>
              </div>
            </>
            )
          })()}

          {/* ── Profiel ── */}
          {step === "profile" && (
            <>
              <h2 className="reg-step-title">{isInvited ? t("inv_profile_title") : t("pf_profile_title")}</h2>
              <p className="reg-step-sub">{isInvited ? t("inv_profile_sub") : t("pf_profile_sub")}</p>

              {isEnterprise && (
                <div className="alert alert-success" style={{ marginBottom:"1rem" }}>
                  {isWhitelistEnterprise
                    ? <><strong>{whitelistInfo.company}</strong> {t("wl_enterprise_profile_banner")} {whitelistInfo.edition === "all" ? t("lm_wl_edition_all") : t("lm_wl_edition_nl")}. {t("lm_wl_admin")}</>
                    : t("pf_enterprise_profile_banner")
                  }
                </div>
              )}

              {isInvited && (
                <div className="alert alert-success" style={{ marginBottom:"1rem" }}>
                  {t("inv_banner_pre")} <strong>{invitedCompany}</strong>. {t("inv_banner_post")}
                </div>
              )}

              <EmailChip email={email} onEdit={isInvited ? undefined : () => setStep("email")} />
              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={handleProfileSubmit}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("pf_firstname")}</label><input className="input-field" type="text" placeholder={t("pf_firstname")} value={firstName} onChange={e => setFirstName(e.target.value)} required /></div>
                  <div className="input-group"><label className="input-label">{t("pf_lastname")}</label><input className="input-field" type="text" placeholder={t("pf_lastname")} value={lastName} onChange={e => setLastName(e.target.value)} required /></div>
                </div>
                <div className="input-group">
                  <label className="input-label">{t("pf_jobrole")}</label>
                  <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray500, margin:"0 0 0.75rem" }}>{t("pf_jobrole_sub")}</p>
                  <JobRoleSelector clusters={JOB_ROLE_CLUSTERS} selectedId={jobRole} onSelect={setJobRole} t={t} />
                </div>
                <div className="input-group"><label className="input-label">{t("pf_password")}</label><input className="input-field" type="text" style={{ WebkitTextSecurity:"disc" }} autoComplete="off" data-1p-ignore data-lpignore="true" placeholder={t("pf_password_hint")} value={password} onChange={e => setPassword(e.target.value)} minLength={8} required /></div>
                <button className="btn-green btn-full" type="submit">{isEnterprise ? t("pf_enterprise_create") : isInvited ? t("inv_create_profile") : chosenPlan ? t("pf_profile_next") : t("pf_profile_create")}</button>
              </form>
            </>
          )}

          {/* ── Betaling ── */}
          {step === "payment" && (
            <>
              <h2 className="reg-step-title">{t("pf_payment_title")}</h2>
              <p className="reg-step-sub">{t("pf_payment_sub")}</p>
              <div className="alert alert-info" style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                <span style={{ fontSize:"1.25rem" }}>🔒</span>
                <span>{t("pf_payment_secure")} <strong>Stripe</strong>.</span>
              </div>
              <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={e => { e.preventDefault(); setStep("confirm") }}>
                <div className="input-group"><label className="input-label">{t("pf_card_number")}</label><input className="input-field" type="text" defaultValue="4242 4242 4242 4242" required /></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("pf_card_expiry")}</label><input className="input-field" type="text" defaultValue="12/28" required /></div>
                  <div className="input-group"><label className="input-label">{t("pf_card_cvv")}</label><input className="input-field" type="text" defaultValue="123" required /></div>
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem" }}>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"1rem", fontWeight:700, color:C.navy }}>{t("pf_payment_total")}</span>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"1.25rem", fontWeight:700, color:C.navy }}>€ 648,–</span>
                </div>
                <button className="btn-red btn-full" type="submit">{t("pf_payment_cta")}</button>
              </form>
              <button className="btn-secondary btn-full" style={{ marginTop:"0.75rem" }} onClick={() => setStep("confirm")}>{t("pf_payment_back")}</button>
            </>
          )}

          {/* ── Bevestiging ── */}
          {step === "confirm" && (
            <>
              <h2 className="reg-step-title">{t("pf_confirm_title")}</h2>
              <p className="reg-step-sub">{t("pf_confirm_sub")}</p>
              {[
                { label: t("pf_confirm_data"), items:[email, `${firstName} ${lastName}`, jobRole ? t(`jr_${jobRole}_name`) : ""], back:"profile" },
                { label: t("pf_confirm_plan"), items:[chosenPlan === "freemium" ? t("pf_plan_freemium") : chosenPlan === "trial" ? t("pf_plan_trial") : t("pf_plan_pro")], back:"_planpicker" },
                ...(chosenPlan === "pro" ? [{ label: t("pf_confirm_pay"), items:[t("pf_confirm_stripe")], back:"payment" }] : []),
              ].map((section, i) => (
                <div key={i} style={{ border:`1px solid ${C.gray200}`, borderRadius:6, padding:"1rem 1.25rem", marginBottom:"0.75rem" }}>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.5rem", display:"flex", justifyContent:"space-between" }}>
                    {section.label}
                    <button className="link-btn" style={{ fontSize:"0.8rem", textTransform:"none", letterSpacing:0 }} onClick={() => section.back === "_planpicker" ? onBack() : setStep(section.back)}>{t("pf_confirm_edit")}</button>
                  </div>
                  {section.items.map((item,j) => <div key={j} style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy }}>{item}</div>)}
                </div>
              ))}
              {chosenPlan === "trial" && <div className="alert alert-warning" style={{ marginTop:"1rem" }}>{t("pf_confirm_trial_warn")}</div>}
              <button className="btn-red btn-full" style={{ marginTop:"1rem" }} onClick={() => setStep("done")}>
                {chosenPlan === "pro" ? t("pf_confirm_pro") : t("pf_confirm_free")}
              </button>
            </>
          )}

        </div>
        <div className="reg-sidebar">
          <RegSidebar
            planName={meta.name}
            planPrice={meta.price}
            planFeatures={meta.features}
            planCta={meta.cta}
          />
        </div>
      </div>
    </div>
  )
}
