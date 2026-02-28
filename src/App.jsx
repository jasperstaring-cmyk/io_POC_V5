import { useState, useEffect, useCallback } from 'react'
import './styles/global.css'

import ArticlePage        from './pages/ArticlePage.jsx'
import SubscriptionPage   from './pages/SubscriptionPage.jsx'
import ProductPicker      from './pages/ProductPicker.jsx'
import AccountPage        from './pages/AccountPage.jsx'
import OnboardingPage     from './pages/OnboardingPage.jsx'
import AccountTypeChoice  from './flows/AccountTypeChoice.jsx'
import EmailGate          from './flows/EmailGate.jsx'
import ProfileIntent      from './flows/ProfileIntent.jsx'
import PersonalFlow       from './flows/PersonalFlow.jsx'
import BusinessFlow       from './flows/BusinessFlow.jsx'
import BusinessInternationalFlow from './flows/BusinessInternationalFlow.jsx'
import EnterpriseFlow     from './flows/EnterpriseFlow.jsx'
import LoginModal         from './flows/LoginModal.jsx'
import { useLang }        from './LanguageContext.jsx'

/* Valid view names that can be targeted via hash */
const VALID_VIEWS = new Set([
  "article","login","choice","emailgate","profileintent","plans","bizplans","subscriptions",
  "personal","business","bizintl","enterprise","onboarding","account","invited","whitelistReg","enterpriseReg",
])

export default function App() {
  const [view, setView]           = useState("article")
  const [modal, setModal]         = useState(null)
  const [loggedIn, setLoggedIn]   = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [activePlanType, setActivePlanType] = useState("freemium")
  const [bizVariant, setBizVariant] = useState("trial") // "trial" | "free" — for business status banner
  const [userData, setUserData]   = useState({ firstName:"Jasper", lastName:"", email:"", jobRole:"Portfolio Manager", initials:"J" })
  const [whitelistEmail, setWhitelistEmail] = useState(null)
  const [whitelistInfo, setWhitelistInfo]   = useState(null)
  const [invitedEmail, setInvitedEmail]     = useState(null)
  const [invitedCompany, setInvitedCompany] = useState(null)
  const [invitedPlanType, setInvitedPlanType] = useState(null)
  const [gateEmail, setGateEmail]             = useState(null)
  const [profileData, setProfileData]         = useState(null)   // { firstName, lastName, jobRole, password, email }
  const [isPrivateEmail, setIsPrivateEmail]   = useState(false)
  const [forceBusinessPaid, setForceBusinessPaid] = useState(false)
  const [businessContext, setBusinessContext]  = useState(null)   // { segment, orgType } — passed from BusinessFlow to Intl
  const [pickerMode, setPickerMode]            = useState("personal")  // ProductPicker mode
  const [cameFromPicker, setCameFromPicker]    = useState(false)       // Track if user entered BusinessFlow via picker
  const [cameFromAccount, setCameFromAccount]  = useState(false)       // Track if user entered BusinessFlow via account upgrade
  const [cameFromArticle, setCameFromArticle]  = useState(false)       // Track if user entered reg from a premium article
  const [articleAccess, setArticleAccess]      = useState(null)        // { articleId, grantedAt } — single-article unlock for Personal Free

  const { setLang } = useLang()

  /* ── EmailGate routing ── */
  function handleEmailGateRoute(destination, email, wlInfo) {
    setGateEmail(email)
    if (destination === "enterprise") {
      handleGoEnterprise(email, null)
    } else if (destination === "whitelist") {
      handleGoWhitelist(email, wlInfo)
    } else if (destination === "profile") {
      // New business email → profile first, then intent
      setIsPrivateEmail(false)
      setForceBusinessPaid(false)
      setView("profileintent")
    } else if (destination === "business_paid") {
      // Trial-blocked email → profile first, then straight to business (paid, no intent)
      setIsPrivateEmail(false)
      setForceBusinessPaid(true)
      setView("profileintent")
    } else if (destination === "personal_direct") {
      // Private email → profile first, then straight to personal (no intent)
      setIsPrivateEmail(true)
      setView("profileintent")
    }
  }

  /* ── ProfileIntent routing ── */
  function handleProfileIntentComplete(intent, profData) {
    setProfileData(profData)
    setGateEmail(profData.email)
    if (intent === "business") {
      setView("business")
    } else {
      // personal → plan picker, then personal flow
      setSelectedPlan(null)
      setView("plans")
    }
  }

  /* ── Hash routing ── */
  const handleHash = useCallback(() => {
    const hash = window.location.hash.replace("#", "")
    if (!hash) return

    // Language switch: #lang=de
    if (hash.startsWith("lang=")) {
      const code = hash.split("=")[1]
      if (["en","nl","de","fr"].includes(code)) {
        setLang(code)
      }
      history.replaceState(null, "", window.location.pathname)
      return
    }

    // Banner scenario deep links: #account-biz-trial, #account-biz-free, etc.
    if (hash.startsWith("account-")) {
      const scenario = hash.replace("account-", "")
      setLoggedIn(true)
      setUserData({ firstName:"Jasper", lastName:"Smits", email:"demo@aegon.com", jobRole:"Portfolio Manager", initials:"J" })
      if (scenario === "biz-trial")  { setActivePlanType("business"); setBizVariant("trial") }
      else if (scenario === "biz-free") { setActivePlanType("business"); setBizVariant("free") }
      else if (scenario === "trial")    { setActivePlanType("trial") }
      else if (scenario === "freemium") { setActivePlanType("freemium") }
      else if (scenario === "pro")      { setActivePlanType("pro") }
      setView("account")
      history.replaceState(null, "", window.location.pathname)
      return
    }

    // View navigation: #login, #business, etc.
    if (VALID_VIEWS.has(hash)) {
      // For #invited, set mock invite data
      if (hash === "invited") {
        setInvitedEmail("colleague@aegon.com")
        setInvitedCompany("Aegon")
        setInvitedPlanType("business")
      }
      // Ensure pickerMode is correct for deep links
      if (hash === "bizplans") setPickerMode("business_default")
      setView(hash)
      // Clear hash after navigating
      history.replaceState(null, "", window.location.pathname)
    }
  }, [setLang])

  useEffect(() => {
    // Handle initial hash on load
    handleHash()
    // Listen for hash changes (deep-link pills)
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [handleHash])


  /* ── Handlers ── */
  function handleLoginSuccess(email) {
    setLoggedIn(true)
    setUserEmail(email)
    const name = email.split("@")[0]
    const cap  = name.charAt(0).toUpperCase() + name.slice(1)
    setUserData({ firstName:cap, lastName:"", email, jobRole:"Portfolio Manager", initials:cap[0] })
    // Set plan type based on email domain for demo purposes
    const domain = email.toLowerCase().split("@")[1]
    if (domain === "abnamro.com") setActivePlanType("enterprise")
    else if (domain === "aegon.com") { setActivePlanType("business"); setBizVariant("trial") }
    else setActivePlanType("freemium")
  }

  function handleUpgrade() {
    // Build profileData from current logged-in user
    const pd = { firstName: userData.firstName, lastName: userData.lastName, jobRole: userData.jobRole || "portfolio_manager", password: "********", email: userEmail }
    setProfileData(pd)
    setGateEmail(userEmail)
    setCameFromAccount(true)
    setView("business")
  }

  function handleLogout() {
    setLoggedIn(false)
    setUserEmail("")
    setView("article")
  }

  function handleSelectPlan(planId) {
    setSelectedPlan(planId)
    setView("personal")
  }

  function handleRegComplete(planTypeOverride) {
    setLoggedIn(true)
    setUserEmail("new@example.com")
    const pType = planTypeOverride === true ? "business"
                : typeof planTypeOverride === "string" ? planTypeOverride
                : selectedPlan || "freemium"
    setActivePlanType(pType)
    setUserData({ firstName:"New", lastName:"User", email:"new@example.com", jobRole:"Portfolio Manager", initials:"N" })

    // Single-article unlock: Personal Free account created from a premium article
    if (cameFromArticle && pType === "freemium") {
      setArticleAccess({ articleId: "article_trump_creditcards", grantedAt: Date.now() })
      setCameFromArticle(false)
      setView("article")
      return
    }
    setCameFromArticle(false)
    setView("onboarding")
  }

  const [loginEmail, setLoginEmail] = useState("")

  function handleGoLogin(email) { setModal(null); setLoginEmail(email || ""); setView("login") }

  function handleSkipToSite() {
    setLoggedIn(true)
    // Single-article unlock: if user came from article and chose Personal Free
    // At this point activePlanType may not be set yet, so also check selectedPlan
    const effectivePlan = selectedPlan || activePlanType || "freemium"
    if (cameFromArticle && (effectivePlan === "freemium" || effectivePlan === null)) {
      setActivePlanType("freemium")
      setArticleAccess({ articleId: "article_trump_creditcards", grantedAt: Date.now() })
      setCameFromArticle(false)
    }
    setView("article")
  }

  function handleGoWhitelist(email, wlInfo) {
    setWhitelistEmail(email)
    setWhitelistInfo(wlInfo)
    setView("whitelistReg")
  }

  function handleGoEnterprise(email, wlInfo) {
    if (wlInfo) {
      // Whitelist enterprise
      setWhitelistEmail(email)
      setWhitelistInfo(wlInfo)
      setView("whitelistReg")
    } else {
      // Domain-based enterprise (e.g. @abnamro.com) — go to personal flow with email pre-filled
      setWhitelistEmail(email)
      setWhitelistInfo(null)
      setSelectedPlan(null)
      setView("enterpriseReg")
    }
  }

  function handleSimulateInvite(email, company, planType) {
    setInvitedEmail(email)
    setInvitedCompany(company)
    setInvitedPlanType(planType || "business")
    setView("invited")
  }

  return (
    <>
      {view === "article" && (
        <ArticlePage
          loggedIn={loggedIn} userEmail={userEmail}
          activePlanType={activePlanType}
          articleAccess={articleAccess}
          onLogin={() => setView("login")}
          onSubscribe={() => { setCameFromArticle(true); setView("emailgate") }}
          onLogout={handleLogout}
          onAccount={() => setView("account")}
          onUpgradeTrial={() => {
            // Logged-in freemium user → go directly to plan picker (skip emailgate/profile)
            const pd = { firstName: userData.firstName, lastName: userData.lastName, jobRole: userData.jobRole || "portfolio_manager", password: "********", email: userEmail }
            setProfileData(pd)
            setGateEmail(userEmail)
            setSelectedPlan(null)
            setView("plans")
          }}
          onUpgradeBusiness={() => {
            // Logged-in freemium user → go directly to business flow
            const pd = { firstName: userData.firstName, lastName: userData.lastName, jobRole: userData.jobRole || "portfolio_manager", password: "********", email: userEmail }
            setProfileData(pd)
            setGateEmail(userEmail)
            setCameFromAccount(true)
            setView("business")
          }}
        />
      )}
      {view === "subscriptions" && (
        <SubscriptionPage onStartReg={() => setView("emailgate")} onLogin={() => setView("login")} />
      )}
      {view === "choice" && (
        <AccountTypeChoice onChoose={t => { if (t==="business") { setPickerMode("business_default"); setView("bizplans") } else { setView("plans") } }} onBack={() => setView("article")} />
      )}
      {view === "emailgate" && (
        <EmailGate onRoute={handleEmailGateRoute} onBack={() => setView("article")} onGoLogin={handleGoLogin} />
      )}
      {view === "profileintent" && (
        <ProfileIntent email={gateEmail} isPrivate={isPrivateEmail} forceBusinessPaid={forceBusinessPaid} onComplete={handleProfileIntentComplete} onBack={() => setView("emailgate")} />
      )}
      {view === "plans" && (
        <ProductPicker
          mode="personal"
          onSelectPlan={handleSelectPlan}
          onSwitchToBusiness={() => { setPickerMode("business_default"); setView("bizplans") }}
          onBack={() => profileData ? setView("profileintent") : gateEmail ? setView("emailgate") : setView("choice")}
          progressTotal={4}
          progressCurrent={1}
        />
      )}
      {view === "bizplans" && (
        <ProductPicker
          mode={pickerMode}
          context={{ segment: businessContext?.segment?.id }}
          onSelectPlan={(id) => {
            setSelectedPlan(id)
            if (id === "enterprise") setView("enterprise")
            else if (id === "business_intl") { setCameFromPicker(true); setView("bizintl") }
            else { setCameFromPicker(true); setView("business") }
          }}
          onSwitchToPersonal={() => { setPickerMode("personal"); setView("plans") }}
          onBack={() => businessContext ? setView("business") : profileData ? setView("profileintent") : gateEmail ? setView("emailgate") : setView("choice")}
          progressTotal={6}
          progressCurrent={1}
        />
      )}
      {view === "personal" && (
        <PersonalFlow selectedPlan={selectedPlan} onComplete={handleRegComplete} onSkipToSite={handleSkipToSite} onBack={() => setView("plans")} onGoLogin={handleGoLogin} onGoWhitelist={handleGoWhitelist} gateEmail={gateEmail} profileData={profileData} />
      )}
      {view === "business" && (
        <BusinessFlow onComplete={() => handleRegComplete(true)} onSkipToSite={handleSkipToSite} onBack={() => { if (cameFromAccount) { setCameFromAccount(false); setView("account") } else if (cameFromPicker) { setCameFromPicker(false); setView("bizplans") } else if (profileData) { setView("profileintent") } else if (gateEmail) { setView("emailgate") } else { setView("bizplans") } }} onGoLogin={handleGoLogin} onGoEnterprise={handleGoEnterprise} gateEmail={gateEmail} profileData={profileData} onGoIntl={(ctx) => { setBusinessContext(ctx); setPickerMode("business_intl"); setView("bizplans") }} />
      )}
      {view === "bizintl" && (
        <BusinessInternationalFlow onComplete={() => handleRegComplete(true)} onSkipToSite={handleSkipToSite} onBack={() => { if (cameFromPicker) { setCameFromPicker(false); setView("bizplans") } else if (profileData) { setView("business") } else { setView("bizplans") } }} onGoEnterprise={handleGoEnterprise} gateEmail={gateEmail} profileData={profileData} businessContext={businessContext} />
      )}
      {view === "enterprise" && (
        <EnterpriseFlow onComplete={() => setView("article")} onBack={() => setView("bizplans")} />
      )}
      {view === "whitelistReg" && (
        <PersonalFlow
          selectedPlan={null}
          onComplete={handleRegComplete}
          onSkipToSite={handleSkipToSite}
          onBack={() => { setWhitelistEmail(null); setWhitelistInfo(null); setView("article") }}
          onGoLogin={handleGoLogin}
          onGoWhitelist={handleGoWhitelist}
          whitelistEmail={whitelistEmail}
          whitelistInfo={whitelistInfo}
        />
      )}
      {view === "enterpriseReg" && (
        <PersonalFlow
          selectedPlan={null}
          onComplete={handleRegComplete}
          onSkipToSite={handleSkipToSite}
          onBack={() => { setWhitelistEmail(null); setView("article") }}
          onGoLogin={handleGoLogin}
          onGoWhitelist={handleGoWhitelist}
          enterpriseEmail={whitelistEmail}
        />
      )}
      {view === "onboarding" && (
        <OnboardingPage
          onFinish={() => setView("article")}
          onDashboard={() => setView("account")}
        />
      )}
      {view === "account" && (
        <AccountPage user={userData} planType={activePlanType} bizVariant={bizVariant} onBack={() => setView("article")} onSimulateInvite={handleSimulateInvite} onUpgrade={handleUpgrade} />
      )}
      {view === "invited" && (
        <PersonalFlow
          selectedPlan={null}
          onComplete={() => handleRegComplete(true)}
          onBack={() => { setInvitedEmail(null); setInvitedCompany(null); setView("article") }}
          onGoLogin={handleGoLogin}
          onGoWhitelist={handleGoWhitelist}
          invitedEmail={invitedEmail}
          invitedCompany={invitedCompany}
          invitedPlanType={invitedPlanType}
        />
      )}
      {view === "login" && (
        <LoginModal onClose={() => setView("article")} onGoRegister={() => setView("emailgate")} onLoginSuccess={handleLoginSuccess} onGoWhitelist={handleGoWhitelist} initialEmail={loginEmail} />
      )}
    </>
  )
}
