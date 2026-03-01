import { C } from '../tokens.js'
import TopNav from '../components/TopNav.jsx'
import { useLang } from '../LanguageContext.jsx'
import { img } from '../images.js'

const ARTICLE = {
  nl: {
    category: "Beleggen",
    title: "Trump zet met renteplafond op creditcards bankaandelen onder druk",
    p1: "De oproep van president Donald Trump om de rente op Amerikaanse creditcards te maximeren op 10 procent zet bankaandelen onder druk.",
    p2: "Analisten van grote Europese vermogensbeheerders reageren verdeeld. Enerzijds zien zij risico's voor de winstmarges; anderzijds wijzen zij erop dat een dergelijk plafond politiek bijzonder moeilijk door te voeren valt.",
    p3: "Goldman Sachs-analisten schatten dat een effectief renteplafond de netto rentemarge van grote Amerikaanse retailbanken met 80 tot 120 basispunten zou kunnen drukken.",
    p4: "Tegelijkertijd benadrukken Europese beheerders dat het voorstel eerder als politiek signaal moet worden gelezen dan als concrete beleidsmaatregel.",
    p5: "Voor portefeuillebeheerders die overwogen zijn in Amerikaanse financials blijft het sentiment nerveus. De onzekerheid over de regelgevende koers weegt zwaarder dan de directe impact van dit voorstel.",
    paywall_title: "Lees verder met Investment Officer",
    paywall_sub: "Dit artikel is onderdeel van onze premium content.\nAfhankelijk van je sector en organisatie heb je mogelijk gratis toegang.",
    paywall_badge_title: "Werkzaam bij een wealth manager of institutionele belegger?",
    paywall_badge_sub: "Wij bieden gratis bedrijfsregelingen voor organisaties in wealth management. Andere organisaties krijgen 6 maanden gratis.",
    paywall_login: "Inloggen",
    paywall_subscribe: "Toegang activeren",
    paywall_items: [
      "Onbeperkt online toegang tot alle premium artikelen",
      "Toegang tot research databases en marktrapporten",
      "Toegang tot alle artikelen van onze experts",
      "Dagelijkse nieuwsbrief en Research Bulletin",
    ],
    logged_as: "Ingelogd als",
    org_access: "U heeft toegang via uw organisatieabonnement.",
    demo_login: "Inloggen",
    demo_register: "Registreren / Abonneren",
    demo_reset: "↩ Reset",
    single_article_notice: "U heeft eenmalig gratis toegang tot dit artikel. Nog geldig voor:",
    upsell_header: "Meer lezen? Upgrade uw account",
    upsell_body: "U heeft dit artikel gratis gelezen met uw gratis account. Wilt u onbeperkt toegang? Start een gratis proefperiode of kies een abonnement. Of regel toegang voor uw hele team.",
    upsell_cta_trial: "Start 10 dagen gratis Premium",
    upsell_cta_business: "Toegang voor mijn organisatie",
    freemium_logged_as: "Ingelogd als",
    freemium_no_access: "Uw gratis account geeft geen toegang tot dit artikel. Upgrade naar Premium of regel toegang voor uw organisatie.",
  },
  en: {
    category: "Investing",
    title: "Trump's credit card interest rate cap puts bank shares under pressure",
    p1: "President Donald Trump's call to cap interest rates on American credit cards at 10 percent is putting bank shares under pressure.",
    p2: "Analysts at major European asset managers are divided. On the one hand they see risks for profit margins; on the other they point out that such a cap would be politically very difficult to implement.",
    p3: "Goldman Sachs analysts estimate that an effective interest rate cap could compress the net interest margin of major American retail banks by 80 to 120 basis points.",
    p4: "At the same time, European managers emphasise that the proposal should be read more as a political signal than as a concrete policy measure.",
    p5: "For portfolio managers who are overweight in American financials, sentiment remains nervous. Uncertainty about the regulatory direction weighs more heavily than the direct impact of this proposal.",
    paywall_title: "Continue reading with Investment Officer",
    paywall_sub: "This article is part of our premium content.\nDepending on your sector and organisation you may have free access.",
    paywall_badge_title: "Working at a wealth manager or institutional investor?",
    paywall_badge_sub: "We offer free corporate plans for organisations in wealth management. Other organisations get 6 months free.",
    paywall_login: "Log in",
    paywall_subscribe: "Activate access",
    paywall_items: [
      "Unlimited online access to all premium articles",
      "Access to research databases and market reports",
      "Access to all articles from our experts",
      "Daily newsletter and Research Bulletin",
    ],
    logged_as: "Logged in as",
    org_access: "You have access through your organisation subscription.",
    demo_login: "Log in",
    demo_register: "Register / Subscribe",
    demo_reset: "↩ Reset",
    single_article_notice: "You have one-time free access to this article. Valid for:",
    upsell_header: "Want to read more? Upgrade your account",
    upsell_body: "You read this article for free with your free account. Want unlimited access? Start a free trial or choose a subscription. Or get access for your entire team.",
    upsell_cta_trial: "Start 10-day free Premium",
    upsell_cta_business: "Access for my organisation",
    freemium_logged_as: "Logged in as",
    freemium_no_access: "Your free account does not include access to this article. Upgrade to Premium or get access for your organisation.",
  },
  de: {
    category: "Geldanlage",
    title: "Trump setzt mit Zinsobergrenze für Kreditkarten Bankaktien unter Druck",
    p1: "Die Forderung von Präsident Donald Trump, die Zinsen auf amerikanische Kreditkarten auf 10 Prozent zu begrenzen, setzt Bankaktien unter Druck.",
    p2: "Analysten großer europäischer Vermögensverwalter reagieren gespalten. Einerseits sehen sie Risiken für die Gewinnmargen, andererseits weisen sie darauf hin, dass eine solche Obergrenze politisch äußerst schwer durchzusetzen wäre.",
    p3: "Analysten von Goldman Sachs schätzen, dass eine wirksame Zinsobergrenze die Nettozinsmarge großer amerikanischer Retailbanken um 80 bis 120 Basispunkte drücken könnte.",
    p4: "Gleichzeitig betonen europäische Vermögensverwalter, dass der Vorschlag eher als politisches Signal denn als konkrete politische Maßnahme zu lesen sei.",
    p5: "Für Portfoliomanager, die in amerikanischen Finanzwerten übergewichtet sind, bleibt die Stimmung nervös. Die Unsicherheit über den regulatorischen Kurs wiegt schwerer als die direkten Auswirkungen dieses Vorschlags.",
    paywall_title: "Weiterlesen mit Investment Officer",
    paywall_sub: "Dieser Artikel ist Teil unserer Premium-Inhalte.\nJe nach Branche und Organisation haben Sie möglicherweise kostenlosen Zugang.",
    paywall_badge_title: "Tätig bei einem Wealth Manager oder institutionellen Anleger?",
    paywall_badge_sub: "Wir bieten kostenlose Firmenregelungen für Organisationen im Wealth Management. Andere Organisationen erhalten 6 Monate gratis.",
    paywall_login: "Anmelden",
    paywall_subscribe: "Zugang aktivieren",
    paywall_items: [
      "Unbegrenzter Online-Zugang zu allen Premium-Artikeln",
      "Zugang zu Research-Datenbanken und Marktberichten",
      "Zugang zu allen Artikeln unserer Experten",
      "Täglicher Newsletter und Research Bulletin",
    ],
    logged_as: "Angemeldet als",
    org_access: "Sie haben Zugang über das Abonnement Ihrer Organisation.",
    demo_login: "Anmelden",
    demo_register: "Registrieren / Abonnieren",
    demo_reset: "↩ Zurücksetzen",
    single_article_notice: "Sie haben einmalig kostenlosen Zugang zu diesem Artikel. Noch gültig für:",
    upsell_header: "Mehr lesen? Upgraden Sie Ihr Konto",
    upsell_body: "Sie haben diesen Artikel kostenlos mit Ihrem kostenlosen Konto gelesen. Möchten Sie unbegrenzten Zugang? Starten Sie eine kostenlose Testphase oder wählen Sie ein Abonnement. Oder erhalten Sie Zugang für Ihr gesamtes Team.",
    upsell_cta_trial: "10 Tage kostenlos Premium starten",
    upsell_cta_business: "Zugang für meine Organisation",
    freemium_logged_as: "Angemeldet als",
    freemium_no_access: "Ihr kostenloses Konto enthält keinen Zugang zu diesem Artikel. Upgraden Sie auf Premium oder erhalten Sie Zugang für Ihre Organisation.",
  },
  fr: {
    category: "Investissement",
    title: "Trump met les actions bancaires sous pression avec un plafond sur les taux des cartes de crédit",
    p1: "L'appel du président Donald Trump à plafonner les taux d'intérêt sur les cartes de crédit américaines à 10 pour cent met les actions bancaires sous pression.",
    p2: "Les analystes des grands gestionnaires d'actifs européens sont divisés. D'un côté, ils voient des risques pour les marges bénéficiaires ; de l'autre, ils soulignent qu'un tel plafond serait politiquement très difficile à mettre en œuvre.",
    p3: "Les analystes de Goldman Sachs estiment qu'un plafonnement effectif des taux d'intérêt pourrait comprimer la marge nette d'intérêt des grandes banques de détail américaines de 80 à 120 points de base.",
    p4: "Dans le même temps, les gestionnaires européens soulignent que la proposition doit être lue davantage comme un signal politique que comme une mesure concrète.",
    p5: "Pour les gestionnaires de portefeuille surpondérés en valeurs financières américaines, le sentiment reste nerveux. L'incertitude quant à la direction réglementaire pèse plus lourd que l'impact direct de cette proposition.",
    paywall_title: "Continuez à lire avec Investment Officer",
    paywall_sub: "Cet article fait partie de notre contenu premium.\nSelon votre secteur et votre organisation, vous pouvez bénéficier d'un accès gratuit.",
    paywall_badge_title: "Vous travaillez chez un wealth manager ou investisseur institutionnel ?",
    paywall_badge_sub: "Nous proposons des accès gratuits aux organisations en wealth management. Les autres organisations bénéficient de 6 mois gratuits.",
    paywall_login: "Se connecter",
    paywall_subscribe: "Activer l'accès",
    paywall_items: [
      "Accès en ligne illimité à tous les articles premium",
      "Accès aux bases de données de recherche et aux rapports de marché",
      "Accès à tous les articles de nos experts",
      "Newsletter quotidienne et Research Bulletin",
    ],
    logged_as: "Connecté en tant que",
    org_access: "Vous avez accès via l'abonnement de votre organisation.",
    demo_login: "Se connecter",
    demo_register: "S'inscrire / S'abonner",
    demo_reset: "↩ Réinitialiser",
    single_article_notice: "Vous avez un accès gratuit unique à cet article. Encore valable pour :",
    upsell_header: "Envie de lire plus ? Améliorez votre compte",
    upsell_body: "Vous avez lu cet article gratuitement avec votre compte gratuit. Vous souhaitez un accès illimité ? Commencez un essai gratuit ou choisissez un abonnement. Ou obtenez un accès pour toute votre équipe.",
    upsell_cta_trial: "Démarrer 10 jours Premium gratuits",
    upsell_cta_business: "Accès pour mon organisation",
    freemium_logged_as: "Connecté en tant que",
    freemium_no_access: "Votre compte gratuit ne donne pas accès à cet article. Passez à Premium ou obtenez un accès pour votre organisation.",
  },
}

function ArticleImage() {
  const src = img("article_hero")
  return (
    <div style={{ width:"100%", height:320, borderRadius:4, position:"relative", overflow:"hidden", marginBottom:"1.25rem", background:"linear-gradient(135deg, #1a1a2e 0%, #2d3561 40%, #c84b31 100%)" }}>
      {src ? (
        <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
      ) : (
        [{left:"12%",top:"18%",rot:-12,bg:"#1434CB"},{left:"28%",top:"28%",rot:5,bg:"#FFB800"},{left:"48%",top:"12%",rot:-6,bg:"#EB001B"},{left:"60%",top:"34%",rot:15,bg:"#0066B2"},{left:"72%",top:"20%",rot:-3,bg:"#252525"}].map((c,i) => (
          <div key={i} style={{ position:"absolute", left:c.left, top:c.top, width:130, height:82, background:c.bg, borderRadius:8, transform:`rotate(${c.rot}deg)`, opacity:0.85, boxShadow:"0 4px 16px rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ position:"absolute", bottom:10, left:12, width:"60%", height:6, background:"rgba(255,255,255,0.3)", borderRadius:3 }}/>
            <div style={{ position:"absolute", top:10, right:12, width:28, height:18, background:"rgba(255,255,255,0.25)", borderRadius:3 }}/>
          </div>
        ))
      )}
      <span className="premium-badge">Premium</span>
    </div>
  )
}

function PaywallBlock({ onLogin, onSubscribe, txt }) {
  return (
    <div className="paywall-card" style={{ marginTop:"2rem", border:`1px solid ${C.gray100}`, borderRadius:8, padding:"2rem", background:C.white, boxShadow:"0 2px 16px rgba(12,24,46,0.07)", position:"relative" }}>
      <div style={{ display:"flex", gap:"1.25rem", alignItems:"flex-start", marginBottom:"1.5rem" }}>
        <div style={{ width:64, height:48, flexShrink:0, borderRadius:4, overflow:"hidden" }}>
          <img src="/images/beeld_laptop_en_smartphone.png" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <div>
          <h3 style={{ fontFamily:"var(--font-sans)", fontSize:"1.1875rem", fontWeight:800, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", color:C.navy, marginBottom:"0.375rem" }}>{txt.paywall_title}</h3>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray500, lineHeight:"var(--lh-body)", whiteSpace:"pre-line" }}>{txt.paywall_sub}</p>
        </div>
      </div>
      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.75rem", flexWrap:"wrap" }}>
        <button className="btn-primary" onClick={onLogin}>{txt.paywall_login}</button>
        <button className="btn-secondary" onClick={onSubscribe}>{txt.paywall_subscribe}</button>
      </div>
      {txt.paywall_items.map((b,i) => (
        <div key={i} className="checkmark-item">
          <div className="checkmark-icon">
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7.5L10 1" stroke={C.navy} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span>{b}</span>
        </div>
      ))}
      {/* Hint banner — vervangt de rode bol */}
      <div className="paywall-hint-banner">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink:0, marginTop:1 }}>
          <circle cx="9" cy="9" r="8" stroke={C.red} strokeWidth="1.5"/>
          <path d="M9 8v4" stroke={C.red} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="9" cy="5.5" r="0.75" fill={C.red}/>
        </svg>
        <div>
          <strong style={{ color:C.red }}>{txt.paywall_badge_title}</strong>
          <div style={{ color:C.red, opacity:0.8, fontSize:"0.8125rem", marginTop:2 }}>{txt.paywall_badge_sub}</div>
        </div>
      </div>
    </div>
  )
}

function FreemiumPaywallBlock({ userEmail, onUpgradeTrial, onUpgradeBusiness, txt }) {
  return (
    <div className="paywall-card" style={{ marginTop:"2rem", border:`1px solid ${C.gray100}`, borderRadius:8, padding:"2rem", background:C.white, boxShadow:"0 2px 16px rgba(12,24,46,0.07)", position:"relative" }}>
      {/* Logged-in acknowledgement */}
      <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", background:"rgba(78,213,150,0.08)", border:"1px solid rgba(78,213,150,0.25)", borderRadius:8, padding:"0.75rem 1rem", marginBottom:"1.25rem" }}>
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8" stroke={C.green} strokeWidth="1.5"/>
          <path d="M5.5 9l2 2L12.5 7" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.navy }}>
          {txt.freemium_logged_as} <strong>{userEmail}</strong>
        </span>
      </div>
      <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray700, lineHeight:"var(--lh-body)", marginBottom:"1.25rem" }}>
        {txt.freemium_no_access}
      </div>
      <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", marginBottom:"1.25rem" }}>
        <button className="btn-primary" onClick={onUpgradeTrial} style={{ flex:1, minWidth:200 }}>
          {txt.upsell_cta_trial}
        </button>
        <button className="btn-secondary" onClick={onUpgradeBusiness} style={{ flex:1, minWidth:200 }}>
          {txt.upsell_cta_business}
        </button>
      </div>
      {/* Hint banner — vervangt de rode bol */}
      <div className="paywall-hint-banner">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink:0, marginTop:1 }}>
          <circle cx="9" cy="9" r="8" stroke={C.red} strokeWidth="1.5"/>
          <path d="M9 8v4" stroke={C.red} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="9" cy="5.5" r="0.75" fill={C.red}/>
        </svg>
        <div>
          <strong style={{ color:C.red }}>{txt.paywall_badge_title}</strong>
          <div style={{ color:C.red, opacity:0.8, fontSize:"0.8125rem", marginTop:2 }}>{txt.paywall_badge_sub}</div>
        </div>
      </div>
    </div>
  )
}

function ArticleUpsellBanner({ onUpgradeTrial, onUpgradeBusiness, txt }) {
  return (
    <div style={{ marginTop:"2.5rem", border:`1px solid ${C.gray200}`, borderRadius:10, overflow:"hidden", background:C.white, boxShadow:"0 2px 16px rgba(12,24,46,0.07)" }}>
      {/* Header bar */}
      <div style={{ background:C.navy, padding:"1rem 1.5rem", display:"flex", alignItems:"center", gap:"0.75rem" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1l2.5 5.5L18 7.5l-4 4 1 5.5L10 14.5 5 17l1-5.5-4-4 5.5-1L10 1z" fill="#4ED596" stroke="#4ED596" strokeWidth="1"/></svg>
        <span style={{ fontFamily:"var(--font-sans)", fontWeight:700, fontSize:"0.95rem", color:C.white }}>{txt.upsell_header}</span>
      </div>
      {/* Body */}
      <div style={{ padding:"1.5rem" }}>
        <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray700, lineHeight:"var(--lh-body)", marginBottom:"1.25rem" }}>
          {txt.upsell_body}
        </div>
        <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap" }}>
          <button className="btn-primary" onClick={onUpgradeTrial} style={{ flex:1, minWidth:200 }}>
            {txt.upsell_cta_trial}
          </button>
          <button className="btn-secondary" onClick={onUpgradeBusiness} style={{ flex:1, minWidth:200 }}>
            {txt.upsell_cta_business}
          </button>
        </div>
      </div>
    </div>
  )
}

function SingleArticleBanner({ expiresLabel, txt }) {
  return (
    <div style={{ marginTop:"1.5rem", marginBottom:"1rem", padding:"0.875rem 1.25rem", background:"#FFF8E1", borderRadius:8, border:"1px solid #FFE082", display:"flex", alignItems:"center", gap:"0.75rem" }}>
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#F9A825" strokeWidth="1.5"/><path d="M10 5v5l3.5 2" stroke="#F9A825" strokeWidth="1.5" strokeLinecap="round"/></svg>
      <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:"#5D4037" }}>
        {txt.single_article_notice} {expiresLabel}
      </span>
    </div>
  )
}

export default function ArticlePage({ loggedIn, userEmail, activePlanType, articleAccess, onLogin, onSubscribe, onLogout, onAccount, onUpgradeTrial, onUpgradeBusiness }) {
  const { lang } = useLang()
  const txt = ARTICLE[lang] || ARTICLE.nl

  // Determine access level
  const hasSubscription = loggedIn && activePlanType && activePlanType !== "freemium"
  const hasSingleArticleAccess = loggedIn && activePlanType === "freemium" && articleAccess
    && (Date.now() - articleAccess.grantedAt) < 24 * 60 * 60 * 1000
  const showFullArticle = hasSubscription || hasSingleArticleAccess

  // Calculate time remaining for single article access
  let expiresLabel = ""
  if (hasSingleArticleAccess) {
    const remaining = Math.max(0, 24 * 60 * 60 * 1000 - (Date.now() - articleAccess.grantedAt))
    const hours = Math.floor(remaining / (60 * 60 * 1000))
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
    expiresLabel = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  return (
    <div style={{ minHeight:"100vh", background:C.white }}>
      <TopNav onLogin={onLogin} onSubscribe={onSubscribe} loggedIn={loggedIn} userEmail={userEmail} onLogout={onLogout} onAccount={onAccount} />
      <main style={{ maxWidth:720, margin:"0 auto", padding:"2.5rem 1.5rem 4rem" }}>
        <span className="category-label">{txt.category}</span>
        <h1 className="article-title">{txt.title}</h1>
        <ArticleImage />
        {showFullArticle ? (
          <>
            {hasSingleArticleAccess && (
              <SingleArticleBanner expiresLabel={expiresLabel} txt={txt} />
            )}
            <div className="article-body">
              <p>{txt.p1}</p>
              <p>{txt.p2}</p>
              <p>{txt.p3}</p>
              <p>{txt.p4}</p>
              <p>{txt.p5}</p>
            </div>
            {hasSubscription && (
              <div style={{ marginTop:"2rem", padding:"1.25rem 1.5rem", background:"#EDFBF4", borderRadius:8, borderLeft:`4px solid ${C.green}`, display:"flex", alignItems:"center", gap:"0.875rem" }}>
                <div style={{ width:20, height:20, background:C.green, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7.5L10 1" stroke={C.navy} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily:"var(--font-sans)", fontWeight:700, fontSize:"0.9rem", color:C.navy }}>{txt.logged_as} {userEmail}</div>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500 }}>{txt.org_access}</div>
                </div>
              </div>
            )}
            {hasSingleArticleAccess && (
              <ArticleUpsellBanner onUpgradeTrial={onUpgradeTrial} onUpgradeBusiness={onUpgradeBusiness} txt={txt} />
            )}
          </>
        ) : loggedIn ? (
          <>
            {/* Logged in but no access (freemium without article unlock) */}
            <div style={{ position:"relative" }}>
              <div className="article-body">
                <p>{txt.p1}</p>
                <p>{txt.p2}</p>
              </div>
              <div className="fade-overlay" />
            </div>
            <FreemiumPaywallBlock userEmail={userEmail} onUpgradeTrial={onUpgradeTrial} onUpgradeBusiness={onUpgradeBusiness} txt={txt} />
          </>
        ) : (
          <>
            <div style={{ position:"relative" }}>
              <div className="article-body">
                <p>{txt.p1}</p>
                <p>{txt.p2}</p>
              </div>
              <div className="fade-overlay" />
            </div>
            <PaywallBlock onLogin={onLogin} onSubscribe={onSubscribe} txt={txt} />
          </>
        )}
      </main>
    </div>
  )
}
