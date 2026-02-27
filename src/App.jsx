import { useState, useEffect, useCallback } from 'react'
import './styles/global.css'

import ArticlePage        from './pages/ArticlePage.jsx'
import SubscriptionPage   from './pages/SubscriptionPage.jsx'
import PlanPickerPage         from './pages/PlanPickerPage.jsx'
import BusinessPlanPickerPage from './pages/BusinessPlanPickerPage.jsx'
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
      // Clear hash so the pill can be clicked again
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
    else if (domain === "aegon.com") setActivePlanType("business")
    else setActivePlanType("freemium")
  }

  function handleUpgrade() {
    // Build profileData from current logged-in user
    const pd = { firstName: userData.firstName, lastName: userData.lastName, jobRole: userData.jobRole || "portfolio_manager", password: "********", email: userEmail }
    setProfileData(pd)
    setGateEmail(userEmail)
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
    setView("onboarding")
  }

  const [loginEmail, setLoginEmail] = useState("")

  function handleGoLogin(email) { setModal(null); setLoginEmail(email || ""); setView("login") }

  function handleSkipToSite() {
    setLoggedIn(true)
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
          onLogin={() => setView("login")}
          onSubscribe={() => setView("emailgate")}
          onLogout={handleLogout}
          onAccount={() => setView("account")}
        />
      )}
      {view === "subscriptions" && (
        <SubscriptionPage onStartReg={() => setView("emailgate")} onLogin={() => setView("login")} />
      )}
      {view === "choice" && (
        <AccountTypeChoice onChoose={t => setView(t==="business"?"bizplans":"plans")} onBack={() => setView("article")} />
      )}
      {view === "emailgate" && (
        <EmailGate onRoute={handleEmailGateRoute} onBack={() => setView("article")} onGoLogin={handleGoLogin} />
      )}
      {view === "profileintent" && (
        <ProfileIntent email={gateEmail} isPrivate={isPrivateEmail} forceBusinessPaid={forceBusinessPaid} onComplete={handleProfileIntentComplete} onBack={() => setView("emailgate")} />
      )}
      {view === "plans" && (
        <PlanPickerPage onSelectPlan={handleSelectPlan} onSwitchToBusiness={() => setView("bizplans")} onBack={() => profileData ? setView("profileintent") : gateEmail ? setView("emailgate") : setView("choice")} />
      )}
      {view === "bizplans" && (
        <BusinessPlanPickerPage onSelectPlan={(id) => {
          setSelectedPlan(id)
          if (id === "enterprise") setView("enterprise")
          else if (id === "business_intl") setView("bizintl")
          else setView("business")
        }} onSwitchToPersonal={() => setView("plans")} onBack={() => businessContext ? setView("business") : profileData ? setView("profileintent") : gateEmail ? setView("emailgate") : setView("choice")} />
      )}
      {view === "personal" && (
        <PersonalFlow selectedPlan={selectedPlan} onComplete={handleRegComplete} onSkipToSite={handleSkipToSite} onBack={() => setView("plans")} onGoLogin={handleGoLogin} onGoWhitelist={handleGoWhitelist} gateEmail={gateEmail} profileData={profileData} />
      )}
      {view === "business" && (
        <BusinessFlow onComplete={() => handleRegComplete(true)} onSkipToSite={handleSkipToSite} onBack={() => profileData ? setView("profileintent") : gateEmail ? setView("emailgate") : setView("bizplans")} onGoLogin={handleGoLogin} onGoEnterprise={handleGoEnterprise} gateEmail={gateEmail} profileData={profileData} onGoIntl={(ctx) => { setBusinessContext(ctx); setView("bizplans") }} />
      )}
      {view === "bizintl" && (
        <BusinessInternationalFlow onComplete={() => handleRegComplete(true)} onSkipToSite={handleSkipToSite} onBack={() => profileData ? setView("business") : setView("bizplans")} onGoEnterprise={handleGoEnterprise} gateEmail={gateEmail} profileData={profileData} businessContext={businessContext} />
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
        <AccountPage user={userData} planType={activePlanType} onBack={() => setView("article")} onSimulateInvite={handleSimulateInvite} onUpgrade={handleUpgrade} />
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
