import { useState } from 'react'
import { C } from '../tokens.js'
import IOLogo from '../components/IOLogo.jsx'
import { LangSwitcher } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import { img } from '../images.js'

const TOTAL_STEPS = 4

/* ═══════════════════════════════════════════════════════════════════════
   Shared — progress dots, nav bar, split-layout shell
   ═══════════════════════════════════════════════════════════════════════ */
function ProgressDots({ total, current, onGoTo }) {
  return (
    <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:"2rem" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} onClick={() => onGoTo && onGoTo(i)}
          style={{
            width: i === current ? 24 : 8, height:8, borderRadius:4,
            background: i === current ? C.navy : i < current ? C.green : C.gray200,
            transition:"all 0.3s", cursor: onGoTo ? "pointer" : "default",
          }} />
      ))}
    </div>
  )
}

function StepNav({ step, totalSteps, onPrev, onNext, onSkip, nextLabel, nextDisabled }) {
  const { t } = useLang()
  const isLast = step === totalSteps - 1
  return (
    <div style={{ marginTop:"2rem" }}>
      {/* Primary action */}
      {isLast ? (
        <button className="btn-primary btn-full" style={{ fontSize:"1rem", padding:"0.9375rem" }} onClick={onNext}>
          {nextLabel || t("ob_done_cta")} →
        </button>
      ) : (
        <button className="btn-primary btn-full" style={{ fontSize:"1rem", padding:"0.9375rem" }} onClick={onNext} disabled={nextDisabled}>
          {nextLabel || t("ob_next")} →
        </button>
      )}

      {/* Secondary row: back + skip */}
      <div style={{ display:"flex", justifyContent: step > 0 ? "space-between" : "flex-end", alignItems:"center", marginTop:"1rem" }}>
        {step > 0 && (
          <button onClick={onPrev} style={{
            background:"none", border:"none", fontFamily:"var(--font-sans)",
            fontSize:"0.875rem", color:C.gray500, cursor:"pointer",
            display:"flex", alignItems:"center", gap:"0.375rem",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke={C.gray500} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {t("ob_prev")}
          </button>
        )}
        {!isLast && (
          <button onClick={onSkip} style={{
            background:"none", border:"none", fontFamily:"var(--font-sans)",
            fontSize:"0.8125rem", color:C.gray500, cursor:"pointer",
            textDecoration:"underline", textDecorationColor:C.gray300,
            textUnderlineOffset:3,
          }}>
            {t("ob_skip_to_site")} →
          </button>
        )}
      </div>
    </div>
  )
}

function OnboardingShell({ step, totalSteps, onPrev, onNext, onSkip, nextLabel, nextDisabled, children }) {
  const visualSrc = img("onboarding_app")
  return (
    <div style={{ minHeight:"100vh", background:C.white, display:"flex", flexDirection:"column" }}>
      {/* Split content */}
      <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:0 }}>
        {/* Left — content */}
        <div style={{ display:"flex", flexDirection:"column", overflowY:"auto" }}>
          {/* IO Logo + lang switcher inside left panel */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.5rem 3.5rem 0", flexShrink:0 }}>
            <IOLogo />
            <LangSwitcher />
          </div>
          {/* Content — vertically + horizontally centered, minHeight prevents jumping */}
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem 3.5rem 2rem" }}>
            <div style={{ maxWidth:480, width:"100%", minHeight:620 }}>
            <ProgressDots total={totalSteps} current={step} />
            {children}
            <StepNav step={step} totalSteps={totalSteps} onPrev={onPrev} onNext={onNext} onSkip={onSkip} nextLabel={nextLabel} nextDisabled={nextDisabled} />
          </div>
          </div>
        </div>

        {/* Right — visual */}
        <div style={{ position:"relative", overflow:"hidden", background:C.gray100 }}>
          {visualSrc ? (
            <img src={visualSrc} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top" }} />
          ) : (
            <div style={{ width:"100%", height:"100%", background:`linear-gradient(135deg,${C.navy},#1B3A5C)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ opacity:0.06 }}>
                <svg width="200" height="200" viewBox="0 0 200 200"><text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-serif)" fontSize="120" fontWeight="700" fill="white">io</text></svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════════════
   Step 1 — Download the app
   ═══════════════════════════════════════════════════════════════════════ */
function ContentApp() {
  const { t } = useLang()
  return (
    <>
      <div style={{ width:80, height:80, borderRadius:20, overflow:"hidden", marginBottom:"1.5rem", boxShadow:"0 8px 24px rgba(12,24,46,0.2)" }}>
        {img("app_icon")
          ? <img src={img("app_icon")} alt="IO" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          : <div style={{ width:"100%", height:"100%", background:C.navy, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontFamily:"var(--font-serif)", fontSize:"2rem", fontWeight:700, color:C.white }}>io</span></div>
        }
      </div>
      <h2 style={{ fontFamily:"var(--font-sans)", fontSize:"1.875rem", fontWeight:800, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"0.75rem" }}>{t("ob_app_title")}</h2>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"2rem" }}>{t("ob_app_sub")}</p>

      {/* QR Code */}
      <div style={{ display:"inline-block", background:C.white, border:`1px solid ${C.gray200}`, borderRadius:12, padding:"1.25rem", marginBottom:"1.5rem", boxShadow:"0 4px 16px rgba(12,24,46,0.08)" }}>
        {img("qr_code")
          ? <img src={img("qr_code")} alt="QR Code" style={{ width:160, height:160, borderRadius:6, display:"block" }} />
          : <div style={{ width:160, height:160, background:C.gray50, borderRadius:6 }} />
        }
        <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.75rem", color:C.gray500, marginTop:"0.75rem", marginBottom:0 }}>{t("ob_app_scan")}</p>
      </div>

      {/* Store badges */}
      <div style={{ display:"flex", gap:"0.875rem", marginBottom:0 }}>
        <a href="https://apps.apple.com/nl/app/investment-officer/id6449033846" target="_blank" rel="noopener noreferrer">
          {img("badge_appstore")
            ? <img src={img("badge_appstore")} alt="Download on the App Store" style={{ height:42 }} />
            : <div style={{ background:C.navy, borderRadius:8, padding:"0.5rem 1rem", color:C.white, fontFamily:"var(--font-sans)", fontSize:"0.75rem", fontWeight:700 }}>App Store</div>
          }
        </a>
        <a href="https://play.google.com/store/apps/details?id=df.io.app" target="_blank" rel="noopener noreferrer">
          {img("badge_playstore")
            ? <img src={img("badge_playstore")} alt="Get it on Google Play" style={{ height:42 }} />
            : <div style={{ background:C.navy, borderRadius:8, padding:"0.5rem 1rem", color:C.white, fontFamily:"var(--font-sans)", fontSize:"0.75rem", fontWeight:700 }}>Google Play</div>
          }
        </a>
      </div>
    </>
  )
}


/* ═══════════════════════════════════════════════════════════════════════
   Step 2 — Newsletters
   ═══════════════════════════════════════════════════════════════════════ */
function ContentNewsletters() {
  const { t } = useLang()
  const newsletters = t("ob_newsletters")
  const list = Array.isArray(newsletters) ? newsletters : []
  const [active, setActive] = useState(list.map(() => true))

  return (
    <>
      <div style={{ width:56, height:56, background:C.gray50, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.25rem" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.6-4.5-6.3V4c0-.8-.7-1.5-1.5-1.5S10.5 3.2 10.5 4v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z" fill={C.navy}/></svg>
      </div>
      <h2 style={{ fontFamily:"var(--font-sans)", fontSize:"1.875rem", fontWeight:800, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"0.75rem" }}>{t("ob_nl_title")}</h2>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.75rem" }}>{t("ob_nl_sub")}</p>

      {list.map((nl, i) => (
        <div key={nl.name} style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          border:`1px solid ${C.gray200}`, borderRadius:8, padding:"0.875rem 1.125rem",
          marginBottom:"0.5rem", background: active[i] ? "#FAFFFE" : C.white,
        }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:"var(--font-sans)", fontWeight:700, fontSize:"0.9rem", color:C.navy }}>{nl.name}</div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, marginTop:"0.15rem" }}>{nl.desc}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", flexShrink:0, marginLeft:"1rem" }}>
            <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", color:C.gray500 }}>{nl.freq}</span>
            <div onClick={() => setActive(prev => prev.map((v, j) => j === i ? !v : v))}
              style={{ width:44, height:24, borderRadius:12, background: active[i] ? C.green : C.gray300, cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
              <div style={{ position:"absolute", top:3, left: active[i] ? 22 : 3, width:18, height:18, borderRadius:"50%", background:C.white, boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"left 0.2s" }}/>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}


/* ═══════════════════════════════════════════════════════════════════════
   Step 3 — LinkedIn
   ═══════════════════════════════════════════════════════════════════════ */
function ContentLinkedIn() {
  const { t } = useLang()
  const [followed, setFollowed] = useState(false)

  return (
    <>
      <div style={{ width:72, height:72, background:"#0A66C2", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.5rem", boxShadow:"0 8px 24px rgba(10,102,194,0.25)" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </div>
      <h2 style={{ fontFamily:"var(--font-sans)", fontSize:"1.875rem", fontWeight:800, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"0.75rem" }}>{t("ob_li_title")}</h2>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.75rem" }}>{t("ob_li_sub")}</p>

      {/* LinkedIn card */}
      <div style={{ border:`1px solid ${C.gray200}`, borderRadius:12, padding:"1.25rem", marginBottom:"1.5rem", background:C.gray50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.875rem", marginBottom:"0.875rem" }}>
          <div style={{ width:48, height:48, background:C.navy, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontFamily:"var(--font-serif)", fontSize:"1.1rem", fontWeight:700, color:C.white }}>io</span>
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-sans)", fontWeight:700, fontSize:"0.9375rem", color:C.navy }}>Investment Officer</div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500 }}>Financial Services · 12.400 {t("ob_li_followers")}</div>
          </div>
        </div>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray700, lineHeight:"var(--lh-body)", margin:0 }}>{t("ob_li_desc")}</p>
      </div>

      {followed ? (
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontFamily:"var(--font-sans)", fontWeight:700, color:C.green }}>{t("ob_li_followed")}</span>
        </div>
      ) : (
        <button onClick={() => setFollowed(true)}
          style={{ display:"flex", alignItems:"center", gap:"0.625rem", background:"#0A66C2", color:C.white, border:"none", borderRadius:6, padding:"0.75rem 2rem", fontFamily:"var(--font-sans)", fontWeight:700, fontSize:"0.9375rem", cursor:"pointer" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          {t("ob_li_follow")}
        </button>
      )}
    </>
  )
}


/* ═══════════════════════════════════════════════════════════════════════
   Step 4 — All set
   ═══════════════════════════════════════════════════════════════════════ */
function ContentDone() {
  const { t } = useLang()
  const features = t("ob_done_features")
  const list = Array.isArray(features) ? features : []

  return (
    <>
      <div style={{ width:80, height:80, borderRadius:"50%", background:"#EDFBF4", border:`2px solid ${C.green}`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.5rem" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h2 style={{ fontFamily:"var(--font-sans)", fontSize:"1.875rem", fontWeight:800, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"0.75rem" }}>{t("ob_done_title")}</h2>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"2rem" }}>{t("ob_done_sub")}</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
        {list.map((f, i) => {
          const imgKeys = ["onboarding_done_articles","onboarding_done_morningstar","onboarding_done_newsletters","onboarding_done_app"]
          const src = img(imgKeys[i])
          return (
            <div key={f.title} style={{ border:`1px solid ${C.gray100}`, borderRadius:8, overflow:"hidden", background:C.gray50 }}>
              {src ? (
                <img src={src} alt={f.title} style={{ width:"100%", height:80, objectFit:"cover", display:"block" }} />
              ) : (
                <div style={{ height:56, background:`linear-gradient(135deg,${C.navy},#1B3A5C)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:"1.5rem" }}>{f.icon}</span>
                </div>
              )}
              <div style={{ padding:"0.625rem 0.75rem" }}>
                <div style={{ fontFamily:"var(--font-sans)", fontWeight:700, fontSize:"0.8125rem", color:C.navy, marginBottom:"0.15rem" }}>{f.title}</div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.75rem", color:C.gray500 }}>{f.desc}</div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}


/* ═══════════════════════════════════════════════════════════════════════
   Main — OnboardingPage
   ═══════════════════════════════════════════════════════════════════════ */
export default function OnboardingPage({ onFinish, onDashboard }) {
  const { t } = useLang()
  const [step, setStep] = useState(0)
  const prev = () => setStep(s => Math.max(0, s - 1))
  const next = () => step < TOTAL_STEPS - 1 ? setStep(s => s + 1) : onFinish()

  const content = [
    <ContentApp key="app" />,
    <ContentNewsletters key="nl" />,
    <ContentLinkedIn key="li" />,
    <ContentDone key="done" />,
  ]

  const nextLabels = [
    t("ob_next"),
    t("ob_next"),
    t("ob_next"),
    t("ob_done_cta"),
  ]

  return (
    <OnboardingShell
      step={step}
      totalSteps={TOTAL_STEPS}
      onPrev={prev}
      onNext={next}
      onSkip={onFinish}
      nextLabel={nextLabels[step]}
    >
      {content[step]}
    </OnboardingShell>
  )
}
