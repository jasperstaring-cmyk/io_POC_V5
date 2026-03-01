import { useState, useRef, useEffect } from 'react'
import { C } from '../tokens.js'
import { useLang } from '../LanguageContext.jsx'

// ─── FAQ Knowledge Base (4 languages) ─────────────────────────────────────────
// Each entry has keywords (matched against user input) and answers per language.
// Multiple keyword arrays = OR logic. Best match by keyword count wins.

const FAQ_ENTRIES = [
  // ── Abonnementen overzicht ──
  {
    keywords: [
      ["abonnement", "abonnementen", "plans", "plannen", "aanbod", "opties"],
      ["subscription", "subscriptions", "plans", "options", "offer"],
      ["abonnement", "abonnements", "formules", "offre"],
      ["abo", "abonnement", "abonnements", "angebot", "optionen"],
    ],
    answers: {
      nl: "Investment Officer biedt drie persoonlijke abonnementen:\n\n• **Gratis** (€0) — toegang tot gratis content, nieuwsbrieven en de Morningstar research database.\n• **Premium proef** (€0, 10 dagen) — volledige toegang tot alle premium content. Stopt automatisch.\n• **Premium** (€54/maand, €648/jaar excl. BTW) — onbeperkt toegang tot alle premium artikelen.\n\nDaarnaast zijn er **Business-abonnementen** voor teams en organisaties, en **Enterprise** voor grote organisaties met SSO. Wil je meer weten over een specifiek abonnement?",
      en: "Investment Officer offers three personal subscriptions:\n\n• **Free** (€0) — access to free content, newsletters and the Morningstar research database.\n• **Premium trial** (€0, 10 days) — full access to all premium content. Stops automatically.\n• **Premium** (€54/month, €648/year excl. VAT) — unlimited access to all premium articles.\n\nThere are also **Business subscriptions** for teams and **Enterprise** for large organisations with SSO. Want to know more about a specific plan?",
      de: "Investment Officer bietet drei persönliche Abonnements:\n\n• **Gratis** (€0) — Zugang zu kostenlosen Inhalten, Newslettern und der Morningstar Research-Datenbank.\n• **Premium Probe** (€0, 10 Tage) — Vollzugang zu allen Premium-Inhalten. Endet automatisch.\n• **Premium** (€54/Monat, €648/Jahr exkl. MwSt.) — unbegrenzter Zugang zu allen Premium-Artikeln.\n\nDazu gibt es **Business-Abonnements** für Teams und **Enterprise** für große Organisationen mit SSO.",
      fr: "Investment Officer propose trois abonnements personnels :\n\n• **Gratuit** (€0) — accès au contenu gratuit, newsletters et la base de recherche Morningstar.\n• **Premium essai** (€0, 10 jours) — accès complet à tout le contenu premium. S'arrête automatiquement.\n• **Premium** (€54/mois, €648/an HT) — accès illimité à tous les articles premium.\n\nIl existe aussi des **abonnements Business** pour les équipes et **Enterprise** pour les grandes organisations avec SSO.",
    },
  },

  // ── Gratis / Free ──
  {
    keywords: [
      ["gratis", "free", "kost niks", "kosteloos", "geen kosten", "freemium"],
      ["free", "no cost", "gratis", "freemium"],
      ["gratuit", "sans frais", "coût"],
      ["gratis", "kostenlos", "kostenfrei"],
    ],
    answers: {
      nl: "Met een **Gratis** account krijg je:\n\n• Toegang tot gratis content en nieuwsbrieven\n• Morningstar research database\n• Papers van marktpartijen\n\nRegistreer je via een premium artikel? Dan krijg je **eenmalig 24 uur toegang** tot dat specifieke artikel. Daarna kun je upgraden naar Premium of een Business-abonnement.",
      en: "With a **Free** account you get:\n\n• Access to free content and newsletters\n• Morningstar research database\n• Papers from market parties\n\nRegistering via a premium article? You get **one-time 24-hour access** to that specific article. After that you can upgrade to Premium or a Business subscription.",
      de: "Mit einem **Gratis**-Konto erhalten Sie:\n\n• Zugang zu kostenlosen Inhalten und Newslettern\n• Morningstar Research-Datenbank\n• Papers von Marktparteien\n\nRegistrieren Sie sich über einen Premium-Artikel? Dann erhalten Sie **einmalig 24 Stunden Zugang** zu diesem Artikel.",
      fr: "Avec un compte **Gratuit** vous obtenez :\n\n• Accès au contenu gratuit et newsletters\n• Base de recherche Morningstar\n• Papers des parties de marché\n\nVous vous inscrivez via un article premium ? Vous obtenez un **accès unique de 24 heures** à cet article.",
    },
  },

  // ── Premium prijs ──
  {
    keywords: [
      ["premium", "prijs", "kost", "kosten", "tarief", "betalen", "betaald"],
      ["premium", "price", "cost", "pricing", "pay", "paid"],
      ["premium", "prix", "coût", "tarif", "payer"],
      ["premium", "preis", "kosten", "tarif", "bezahlen"],
    ],
    answers: {
      nl: "**Premium** kost **€54 per maand** (€648 per jaar excl. BTW). Dit is een jaarabonnement voor één editie (bijv. Nederland). Je krijgt onbeperkt toegang tot alle premium artikelen, columns, analyses en expertbijdragen.\n\n**Premium All Editions** (€774/jaar) geeft toegang tot alle edities — dit is beschikbaar als upgrade via je accountpagina.",
      en: "**Premium** costs **€54 per month** (€648 per year excl. VAT). This is an annual subscription for one edition. You get unlimited access to all premium articles, columns, analyses and expert contributions.\n\n**Premium All Editions** (€774/year) gives access to all editions — available as an upgrade in your account page.",
      de: "**Premium** kostet **€54 pro Monat** (€648 pro Jahr exkl. MwSt.). Dies ist ein Jahresabonnement für eine Ausgabe. Sie erhalten unbegrenzten Zugang zu allen Premium-Artikeln, Kolumnen und Analysen.\n\n**Premium Alle Ausgaben** (€774/Jahr) gibt Zugang zu allen Ausgaben — als Upgrade über Ihre Kontoseite verfügbar.",
      fr: "**Premium** coûte **€54 par mois** (€648 par an HT). C'est un abonnement annuel pour une édition. Vous obtenez un accès illimité à tous les articles premium, chroniques et analyses.\n\n**Premium Toutes Éditions** (€774/an) donne accès à toutes les éditions — disponible comme mise à niveau via votre page de compte.",
    },
  },

  // ── Premium proef / trial ──
  {
    keywords: [
      ["proef", "trial", "proberen", "uitproberen", "proefperiode", "10 dagen", "gratis proberen"],
      ["trial", "try", "free trial", "10 days", "test"],
      ["essai", "essayer", "10 jours", "période d'essai"],
      ["probe", "testen", "ausprobieren", "10 tage", "probezeit"],
    ],
    answers: {
      nl: "Met **Premium proef** krijg je **10 dagen gratis** volledige toegang tot alle premium content. Het stopt automatisch — je hoeft niets op te zeggen en er worden geen kosten in rekening gebracht.\n\nLet op: je kunt maar **één keer per 12 maanden** een proefperiode aanvragen.",
      en: "With **Premium trial** you get **10 days free** full access to all premium content. It stops automatically — no cancellation needed and no charges.\n\nNote: you can only request a trial **once every 12 months**.",
      de: "Mit **Premium Probe** erhalten Sie **10 Tage gratis** vollen Zugang zu allen Premium-Inhalten. Es endet automatisch — keine Kündigung nötig und keine Kosten.\n\nHinweis: Sie können nur **einmal pro 12 Monate** eine Probezeit anfordern.",
      fr: "Avec **Premium essai** vous obtenez **10 jours gratuits** d'accès complet à tout le contenu premium. Cela s'arrête automatiquement — pas besoin de résilier et aucun frais.\n\nNote : vous ne pouvez demander un essai qu'**une fois tous les 12 mois**.",
    },
  },

  // ── Registratie / aanmelden ──
  {
    keywords: [
      ["registreren", "aanmelden", "account aanmaken", "account maken", "inschrijven", "registratie"],
      ["register", "sign up", "create account", "registration"],
      ["inscrire", "inscription", "créer un compte", "s'inscrire"],
      ["registrieren", "anmelden", "konto erstellen", "registrierung"],
    ],
    answers: {
      nl: "Registreren gaat zo:\n\n1. Klik op **\"Toegang activeren\"** op de website\n2. Vul je **zakelijk e-mailadres** in\n3. Het systeem herkent automatisch of je in aanmerking komt voor een Business- of Personal-abonnement\n4. Vul je profiel in (naam, functie, wachtwoord)\n5. Kies je abonnement\n\nTip: gebruik je zakelijke e-mailadres — daarmee kun je mogelijk gratis toegang krijgen via je organisatie.",
      en: "Here's how to register:\n\n1. Click **\"Activate access\"** on the website\n2. Enter your **business email address**\n3. The system automatically detects if you qualify for a Business or Personal subscription\n4. Complete your profile (name, job role, password)\n5. Choose your subscription\n\nTip: use your business email — you may get free access through your organisation.",
      de: "So registrieren Sie sich:\n\n1. Klicken Sie auf **\"Zugang aktivieren\"** auf der Website\n2. Geben Sie Ihre **geschäftliche E-Mail-Adresse** ein\n3. Das System erkennt automatisch, ob Sie sich für ein Business- oder Personal-Abonnement qualifizieren\n4. Vervollständigen Sie Ihr Profil (Name, Funktion, Passwort)\n5. Wählen Sie Ihr Abonnement\n\nTipp: Verwenden Sie Ihre geschäftliche E-Mail — Sie könnten kostenlosen Zugang über Ihre Organisation erhalten.",
      fr: "Voici comment vous inscrire :\n\n1. Cliquez sur **\"Activer l'accès\"** sur le site\n2. Entrez votre **adresse e-mail professionnelle**\n3. Le système détecte automatiquement si vous êtes éligible à un abonnement Business ou Personnel\n4. Complétez votre profil (nom, fonction, mot de passe)\n5. Choisissez votre abonnement\n\nConseil : utilisez votre e-mail professionnelle — vous pourriez obtenir un accès gratuit via votre organisation.",
    },
  },

  // ── Zakelijk e-mail / waarom ──
  {
    keywords: [
      ["zakelijk e-mail", "zakelijke mail", "waarom zakelijk", "business email", "bedrijfsmail", "privé email", "gmail", "hotmail", "outlook"],
      ["business email", "why business", "personal email", "gmail", "private email"],
      ["e-mail professionnel", "pourquoi professionnel", "gmail"],
      ["geschäftliche email", "warum geschäftlich", "private email", "gmail"],
    ],
    answers: {
      nl: "Investment Officer is een **B2B-platform** voor beleggingsprofessionals. Met een zakelijk e-mailadres kan het systeem automatisch bepalen of je organisatie in aanmerking komt voor **gratis Business-toegang** (bijv. voor vermogensbeheerders).\n\nMet een privé-adres (gmail, hotmail etc.) kun je je wel registreren, maar alleen voor een **persoonlijk abonnement**. Adressen als info@, team@ of admin@ worden niet geaccepteerd — gebruik je persoonlijke zakelijke e-mailadres.",
      en: "Investment Officer is a **B2B platform** for investment professionals. With a business email, the system can automatically determine if your organisation qualifies for **free Business access** (e.g. for wealth managers).\n\nWith a private address (gmail, hotmail etc.) you can register, but only for a **personal subscription**. Generic addresses like info@, team@ or admin@ are not accepted — use your personal business email.",
      de: "Investment Officer ist eine **B2B-Plattform** für Investmentprofis. Mit einer geschäftlichen E-Mail kann das System automatisch feststellen, ob Ihre Organisation für **kostenlosen Business-Zugang** qualifiziert ist.\n\nMit einer privaten Adresse (gmail, hotmail etc.) können Sie sich registrieren, aber nur für ein **persönliches Abonnement**. Generische Adressen wie info@, team@ oder admin@ werden nicht akzeptiert.",
      fr: "Investment Officer est une **plateforme B2B** pour les professionnels de l'investissement. Avec un e-mail professionnel, le système peut déterminer automatiquement si votre organisation est éligible à un **accès Business gratuit**.\n\nAvec une adresse privée (gmail, hotmail etc.) vous pouvez vous inscrire, mais uniquement pour un **abonnement personnel**. Les adresses génériques comme info@, team@ ou admin@ ne sont pas acceptées.",
    },
  },

  // ── Business abonnement ──
  {
    keywords: [
      ["business", "bedrijf", "organisatie", "team", "zakelijk abonnement", "bedrijfsabonnement"],
      ["business", "company", "organisation", "organization", "team", "corporate"],
      ["business", "entreprise", "organisation", "équipe", "professionnel"],
      ["business", "unternehmen", "organisation", "team", "firmen"],
    ],
    answers: {
      nl: "**Business-abonnementen** zijn voor teams en organisaties. De eerste persoon die registreert wordt automatisch beheerder en kan collega's uitnodigen.\n\nWat je krijgt hangt af van je sector:\n• **Buy Side** (vermogensbeheer, institutioneel): **24 maanden gratis** (met KvK-verificatie)\n• **Sell Side** (asset management, dienstverleners): **6 maanden gratis** proefperiode\n\nNa de proefperiode zijn er betaalde pakketten vanaf **€79/maand** (tot 5 gebruikers) tot **€12,50/gebruiker/maand** (16+ gebruikers).",
      en: "**Business subscriptions** are for teams and organisations. The first person to register becomes admin and can invite colleagues.\n\nWhat you get depends on your sector:\n• **Buy Side** (wealth management, institutional): **24 months free** (with Chamber of Commerce verification)\n• **Sell Side** (asset management, service providers): **6-month free trial**\n\nAfter the trial, paid packages range from **€79/month** (up to 5 users) to **€12.50/user/month** (16+ users).",
      de: "**Business-Abonnements** sind für Teams und Organisationen. Die erste registrierte Person wird automatisch Admin und kann Kollegen einladen.\n\nWas Sie erhalten, hängt von Ihrer Branche ab:\n• **Buy Side** (Vermögensverwaltung, institutionell): **24 Monate gratis** (mit Handelsregister-Verifizierung)\n• **Sell Side** (Asset Management, Dienstleister): **6 Monate gratis** Probezeit\n\nNach der Probezeit beginnen die Pakete ab **€79/Monat** (bis 5 Nutzer).",
      fr: "Les **abonnements Business** sont pour les équipes et organisations. La première personne qui s'inscrit devient administrateur et peut inviter des collègues.\n\nCe que vous obtenez dépend de votre secteur :\n• **Buy Side** (gestion de patrimoine, institutionnel) : **24 mois gratuits** (avec vérification Chambre de Commerce)\n• **Sell Side** (asset management, prestataires) : **6 mois d'essai gratuit**\n\nAprès l'essai, les forfaits payants commencent à **€79/mois** (jusqu'à 5 utilisateurs).",
    },
  },

  // ── Collega's uitnodigen ──
  {
    keywords: [
      ["collega", "collega's", "uitnodigen", "uitnodiging", "invite", "toevoegen", "medewerker"],
      ["colleague", "colleagues", "invite", "invitation", "add user", "team member"],
      ["collègue", "collègues", "inviter", "invitation", "ajouter"],
      ["kollege", "kollegen", "einladen", "einladung", "hinzufügen", "mitarbeiter"],
    ],
    answers: {
      nl: "Als **Business-beheerder** kun je collega's uitnodigen via je accountpagina:\n\n1. Ga naar **Mijn account → Gebruikers uitnodigen**\n2. Voeg e-mailadressen toe van collega's\n3. Zij ontvangen een e-mail met een uitnodigingslink\n4. Ze maken een profiel aan en krijgen direct toegang via het abonnement van je organisatie\n\nHeb je een **persoonlijk abonnement**? Dan zie je op die pagina een optie om over te stappen naar een Business-abonnement.",
      en: "As a **Business admin** you can invite colleagues via your account page:\n\n1. Go to **My account → Invite users**\n2. Add email addresses of colleagues\n3. They receive an email with an invitation link\n4. They create a profile and get immediate access via your organisation's subscription\n\nHave a **personal subscription**? You'll see an option to switch to a Business subscription.",
      de: "Als **Business-Admin** können Sie Kollegen über Ihre Kontoseite einladen:\n\n1. Gehen Sie zu **Mein Konto → Nutzer einladen**\n2. Fügen Sie E-Mail-Adressen von Kollegen hinzu\n3. Sie erhalten eine E-Mail mit einem Einladungslink\n4. Sie erstellen ein Profil und erhalten sofort Zugang über das Abonnement Ihrer Organisation",
      fr: "En tant qu'**administrateur Business** vous pouvez inviter des collègues via votre page de compte :\n\n1. Allez dans **Mon compte → Inviter des utilisateurs**\n2. Ajoutez les adresses e-mail de vos collègues\n3. Ils reçoivent un e-mail avec un lien d'invitation\n4. Ils créent un profil et obtiennent un accès immédiat via l'abonnement de votre organisation",
    },
  },

  // ── Inloggen / login ──
  {
    keywords: [
      ["inloggen", "login", "aanmelden", "wachtwoord", "kan niet inloggen", "toegang"],
      ["login", "log in", "sign in", "password", "can't login", "access"],
      ["connexion", "connecter", "mot de passe", "accès"],
      ["einloggen", "anmelden", "passwort", "zugang", "login"],
    ],
    answers: {
      nl: "Je kunt inloggen via de **Inloggen**-knop rechtsboven op de website.\n\n• **Regulier:** e-mailadres + wachtwoord\n• **SSO (Enterprise):** via Google of Microsoft als je organisatie dit heeft ingesteld\n\nBen je je wachtwoord vergeten? Klik op \"Wachtwoord vergeten\" op het inlogscherm.\n\nKrijg je de melding \"Geen account gevonden\"? Dan moet je je eerst registreren via \"Toegang activeren\".",
      en: "You can log in via the **Log in** button in the top right of the website.\n\n• **Regular:** email address + password\n• **SSO (Enterprise):** via Google or Microsoft if your organisation has set this up\n\nForgot your password? Click \"Forgot password\" on the login screen.\n\nGetting \"No account found\"? You need to register first via \"Activate access\".",
      de: "Sie können sich über die **Einloggen**-Schaltfläche oben rechts auf der Website einloggen.\n\n• **Regulär:** E-Mail-Adresse + Passwort\n• **SSO (Enterprise):** über Google oder Microsoft, wenn Ihre Organisation dies eingerichtet hat\n\nPasswort vergessen? Klicken Sie auf \"Passwort vergessen\" auf der Login-Seite.",
      fr: "Vous pouvez vous connecter via le bouton **Se connecter** en haut à droite du site.\n\n• **Régulier :** adresse e-mail + mot de passe\n• **SSO (Enterprise) :** via Google ou Microsoft si votre organisation l'a configuré\n\nMot de passe oublié ? Cliquez sur \"Mot de passe oublié\" sur l'écran de connexion.",
    },
  },

  // ── Enterprise / SSO ──
  {
    keywords: [
      ["enterprise", "sso", "single sign", "google login", "microsoft login", "maatwerk"],
      ["enterprise", "sso", "single sign-on", "google", "microsoft", "custom"],
      ["enterprise", "sso", "google", "microsoft", "sur mesure"],
      ["enterprise", "sso", "google", "microsoft", "maßgeschneidert"],
    ],
    answers: {
      nl: "**Enterprise** is voor grote organisaties en biedt:\n\n• **SSO** (Single Sign-On) via Google of Microsoft\n• Onbeperkt aantal gebruikers\n• Dedicated accountmanager\n\nEnterprise kun je niet zelf online afsluiten — neem **contact met ons op** voor een offerte op maat. Er zijn twee varianten: Enterprise NL (één editie) en Enterprise All (alle edities).",
      en: "**Enterprise** is for large organisations and offers:\n\n• **SSO** (Single Sign-On) via Google or Microsoft\n• Unlimited users\n• Dedicated account manager\n\nEnterprise cannot be self-subscribed — **contact us** for a custom quote. Two variants: Enterprise NL (one edition) and Enterprise All (all editions).",
      de: "**Enterprise** ist für große Organisationen und bietet:\n\n• **SSO** (Single Sign-On) über Google oder Microsoft\n• Unbegrenzte Nutzer\n• Dedizierter Account-Manager\n\nEnterprise kann nicht selbst abgeschlossen werden — **kontaktieren Sie uns** für ein individuelles Angebot.",
      fr: "**Enterprise** est pour les grandes organisations et offre :\n\n• **SSO** (Single Sign-On) via Google ou Microsoft\n• Utilisateurs illimités\n• Gestionnaire de compte dédié\n\nEnterprise ne peut pas être souscrit en ligne — **contactez-nous** pour un devis sur mesure.",
    },
  },

  // ── Nieuwsbrieven ──
  {
    keywords: [
      ["nieuwsbrief", "newsletter", "mail", "e-mail", "nieuwsbrieven", "daily", "research bulletin"],
      ["newsletter", "newsletters", "email", "daily", "research bulletin", "mailing"],
      ["newsletter", "bulletins", "e-mail", "quotidien"],
      ["newsletter", "rundbrief", "e-mail", "täglich"],
    ],
    answers: {
      nl: "Bij registratie word je automatisch aangemeld voor onze nieuwsbrieven per editie:\n\n• **Daily** — dagelijkse update (werkdagen)\n• **Editor's Choice** — wekelijkse redactieselectie\n• **Research Bulletin** — dagelijks analyserapporten\n• **Partner Mailings** — af en toe, van partners\n\nJe kunt je voorkeuren beheren via **Mijn account → Nieuwsbrief**.",
      en: "At registration you're automatically subscribed to our newsletters per edition:\n\n• **Daily** — daily update (weekdays)\n• **Editor's Choice** — weekly editorial selection\n• **Research Bulletin** — daily analysis reports\n• **Partner Mailings** — occasional, from partners\n\nManage your preferences in **My account → Newsletter**.",
      de: "Bei der Registrierung werden Sie automatisch für unsere Newsletter pro Ausgabe angemeldet:\n\n• **Daily** — tägliches Update (Werktage)\n• **Editor's Choice** — wöchentliche Redaktionsauswahl\n• **Research Bulletin** — tägliche Analyseberichte\n• **Partner Mailings** — gelegentlich, von Partnern\n\nVerwalten Sie Ihre Einstellungen unter **Mein Konto → Newsletter**.",
      fr: "À l'inscription vous êtes automatiquement abonné à nos newsletters par édition :\n\n• **Daily** — mise à jour quotidienne (jours ouvrables)\n• **Editor's Choice** — sélection éditoriale hebdomadaire\n• **Research Bulletin** — rapports d'analyse quotidiens\n• **Partner Mailings** — occasionnel, de partenaires\n\nGérez vos préférences dans **Mon compte → Newsletter**.",
    },
  },

  // ── Account beheer ──
  {
    keywords: [
      ["account", "mijn account", "profiel", "gegevens wijzigen", "accountpagina", "beheer"],
      ["account", "my account", "profile", "settings", "manage", "account page"],
      ["compte", "mon compte", "profil", "paramètres", "gérer"],
      ["konto", "mein konto", "profil", "einstellungen", "verwalten"],
    ],
    answers: {
      nl: "Op je **accountpagina** (bereikbaar via je naam rechtsboven) vind je:\n\n1. **Mijn account** — naam, functie, taal, telefoon\n2. **Nieuwsbrief** — voorkeuren per editie\n3. **Mijn abonnementen** — actief plan + upgrade-opties\n4. **Gebruikers uitnodigen** — collega's toevoegen (Business) of upgraden naar Business (Personal)\n5. **Facturatie** — betalingsgegevens en facturen",
      en: "On your **account page** (accessible via your name in the top right) you'll find:\n\n1. **My account** — name, job role, language, phone\n2. **Newsletter** — preferences per edition\n3. **My subscriptions** — active plan + upgrade options\n4. **Invite users** — add colleagues (Business) or upgrade to Business (Personal)\n5. **Billing** — payment details and invoices",
      de: "Auf Ihrer **Kontoseite** (erreichbar über Ihren Namen oben rechts) finden Sie:\n\n1. **Mein Konto** — Name, Funktion, Sprache, Telefon\n2. **Newsletter** — Einstellungen pro Ausgabe\n3. **Meine Abonnements** — aktiver Plan + Upgrade-Optionen\n4. **Nutzer einladen** — Kollegen hinzufügen (Business)\n5. **Abrechnung** — Zahlungsdetails und Rechnungen",
      fr: "Sur votre **page de compte** (accessible via votre nom en haut à droite) vous trouverez :\n\n1. **Mon compte** — nom, fonction, langue, téléphone\n2. **Newsletter** — préférences par édition\n3. **Mes abonnements** — plan actif + options de mise à niveau\n4. **Inviter des utilisateurs** — ajouter des collègues (Business)\n5. **Facturation** — détails de paiement et factures",
    },
  },

  // ── Edities / landen ──
  {
    keywords: [
      ["editie", "edities", "land", "landen", "nederland", "belgie", "luxembourg", "duitsland", "frankrijk", "internationaal"],
      ["edition", "editions", "country", "countries", "netherlands", "belgium", "germany", "france", "international", "luxembourg"],
      ["édition", "éditions", "pays", "belgique", "allemagne", "luxembourg", "international"],
      ["ausgabe", "ausgaben", "land", "länder", "niederlande", "belgien", "luxemburg", "international"],
    ],
    answers: {
      nl: "Investment Officer heeft zes edities:\n\n• **.nl** — Nederland (Nederlands)\n• **.be** — België (Nederlands + Frans)\n• **.de** — Duitsland (Duits)\n• **.fr** — Frankrijk (Frans)\n• **.lu** — Luxemburg (Engels + Frans)\n• **.com** — Internationaal (Engels, bundelt alle edities)\n\nEen standaard abonnement geeft toegang tot één editie. Met **Premium All Editions** of **Business International** krijg je toegang tot alle edities.",
      en: "Investment Officer has six editions:\n\n• **.nl** — Netherlands (Dutch)\n• **.be** — Belgium (Dutch + French)\n• **.de** — Germany (German)\n• **.fr** — France (French)\n• **.lu** — Luxembourg (English + French)\n• **.com** — International (English, bundles all editions)\n\nA standard subscription gives access to one edition. With **Premium All Editions** or **Business International** you get access to all.",
      de: "Investment Officer hat sechs Ausgaben:\n\n• **.nl** — Niederlande (Niederländisch)\n• **.be** — Belgien (Niederländisch + Französisch)\n• **.de** — Deutschland (Deutsch)\n• **.fr** — Frankreich (Französisch)\n• **.lu** — Luxemburg (Englisch + Französisch)\n• **.com** — International (Englisch, bündelt alle Ausgaben)",
      fr: "Investment Officer a six éditions :\n\n• **.nl** — Pays-Bas (néerlandais)\n• **.be** — Belgique (néerlandais + français)\n• **.de** — Allemagne (allemand)\n• **.fr** — France (français)\n• **.lu** — Luxembourg (anglais + français)\n• **.com** — International (anglais, regroupe toutes les éditions)",
    },
  },

  // ── Facturatie / factuur ──
  {
    keywords: [
      ["factuur", "facturen", "facturatie", "betaling", "betalingsgegevens", "rekening"],
      ["invoice", "invoices", "billing", "payment", "payment details"],
      ["facture", "factures", "facturation", "paiement"],
      ["rechnung", "rechnungen", "abrechnung", "zahlung"],
    ],
    answers: {
      nl: "Je vindt je facturen en betalingsgegevens via **Mijn account → Facturatie**.\n\nDaar zie je twee tabbladen:\n• **Betalingsgegevens** — je huidige betaalmethode\n• **Facturen** — overzicht van alle facturen met status en bedrag\n\nBetalingen verlopen via **Stripe**. Heb je een specifieke vraag over een factuur? Neem dan contact met ons op.",
      en: "You can find your invoices and payment details via **My account → Billing**.\n\nThere you'll see two tabs:\n• **Payment details** — your current payment method\n• **Invoices** — overview of all invoices with status and amount\n\nPayments are processed via **Stripe**. Have a specific question about an invoice? Please contact us.",
      de: "Sie finden Ihre Rechnungen und Zahlungsdetails unter **Mein Konto → Abrechnung**.\n\nDort sehen Sie zwei Tabs:\n• **Zahlungsdetails** — Ihre aktuelle Zahlungsmethode\n• **Rechnungen** — Übersicht aller Rechnungen mit Status und Betrag\n\nZahlungen werden über **Stripe** abgewickelt.",
      fr: "Vous trouverez vos factures et détails de paiement dans **Mon compte → Facturation**.\n\nVous y verrez deux onglets :\n• **Détails de paiement** — votre méthode de paiement actuelle\n• **Factures** — aperçu de toutes les factures avec statut et montant\n\nLes paiements sont traités via **Stripe**.",
    },
  },

  // ── Upgraden ──
  {
    keywords: [
      ["upgrade", "upgraden", "overstappen", "wijzigen", "abonnement wijzigen", "hogere", "meer"],
      ["upgrade", "switch", "change plan", "change subscription"],
      ["mise à niveau", "changer", "modifier abonnement"],
      ["upgrade", "wechseln", "abonnement ändern"],
    ],
    answers: {
      nl: "Je kunt je abonnement upgraden via **Mijn account → Mijn abonnementen**.\n\nMogelijke upgrades:\n• **Gratis → Premium proef** (10 dagen gratis uitproberen)\n• **Gratis → Premium** (€54/maand)\n• **Personal → Business** (voor je team)\n• **Premium NL → Premium All Editions** (alle edities, €774/jaar)\n\nBij een Business-upgrade word je automatisch beheerder en kun je collega's uitnodigen.",
      en: "You can upgrade your subscription via **My account → My subscriptions**.\n\nPossible upgrades:\n• **Free → Premium trial** (10 days free)\n• **Free → Premium** (€54/month)\n• **Personal → Business** (for your team)\n• **Premium NL → Premium All Editions** (all editions, €774/year)\n\nWith a Business upgrade you automatically become admin and can invite colleagues.",
      de: "Sie können Ihr Abonnement über **Mein Konto → Meine Abonnements** upgraden.\n\nMögliche Upgrades:\n• **Gratis → Premium Probe** (10 Tage gratis)\n• **Gratis → Premium** (€54/Monat)\n• **Personal → Business** (für Ihr Team)\n• **Premium NL → Premium Alle Ausgaben** (€774/Jahr)",
      fr: "Vous pouvez mettre à niveau votre abonnement via **Mon compte → Mes abonnements**.\n\nMises à niveau possibles :\n• **Gratuit → Premium essai** (10 jours gratuits)\n• **Gratuit → Premium** (€54/mois)\n• **Personnel → Business** (pour votre équipe)\n• **Premium NL → Premium Toutes Éditions** (€774/an)",
    },
  },

  // ── Business International ──
  {
    keywords: [
      ["internationaal", "international", "alle edities", "meerdere landen", "global"],
      ["international", "all editions", "multiple countries", "global"],
      ["international", "toutes éditions", "plusieurs pays"],
      ["international", "alle ausgaben", "mehrere länder"],
    ],
    answers: {
      nl: "**Business International** geeft toegang tot alle edities. Altijd betaald:\n\n• S (2-5 gebruikers): €119/maand, €1.428/jaar\n• M (6-10 gebruikers): €219/maand, €2.628/jaar\n• L (11-15 gebruikers): €289/maand, €3.468/jaar\n• XL (16+): €18,50/gebruiker/maand\n\n**50% korting** voor organisaties in de segmenten Wealth Management en Institutional.\n\nDeze optie verschijnt alleen als je aangeeft dat je organisatie in meerdere landen actief is.",
      en: "**Business International** gives access to all editions. Always paid:\n\n• S (2-5 users): €119/month, €1,428/year\n• M (6-10 users): €219/month, €2,628/year\n• L (11-15 users): €289/month, €3,468/year\n• XL (16+): €18.50/user/month\n\n**50% discount** for Wealth Management and Institutional organisations.\n\nThis option only appears when you indicate your organisation operates in multiple countries.",
      de: "**Business International** gibt Zugang zu allen Ausgaben. Immer kostenpflichtig:\n\n• S (2-5 Nutzer): €119/Monat, €1.428/Jahr\n• M (6-10 Nutzer): €219/Monat, €2.628/Jahr\n• L (11-15 Nutzer): €289/Monat, €3.468/Jahr\n• XL (16+): €18,50/Nutzer/Monat\n\n**50% Rabatt** für Wealth Management und institutionelle Organisationen.",
      fr: "**Business International** donne accès à toutes les éditions. Toujours payant :\n\n• S (2-5 utilisateurs) : €119/mois, €1.428/an\n• M (6-10 utilisateurs) : €219/mois, €2.628/an\n• L (11-15 utilisateurs) : €289/mois, €3.468/an\n• XL (16+) : €18,50/utilisateur/mois\n\n**50% de réduction** pour les organisations Wealth Management et Institutional.",
    },
  },

  // ── Morningstar ──
  {
    keywords: [
      ["morningstar", "research", "database", "onderzoek"],
      ["morningstar", "research", "database"],
      ["morningstar", "recherche", "base de données"],
      ["morningstar", "research", "datenbank", "forschung"],
    ],
    answers: {
      nl: "De **Morningstar research database** is beschikbaar voor alle geregistreerde gebruikers, ook met een Gratis account. Dit omvat fondsanalyses, marktdata en onderzoeksrapporten.",
      en: "The **Morningstar research database** is available to all registered users, including Free accounts. This includes fund analyses, market data and research reports.",
      de: "Die **Morningstar Research-Datenbank** ist für alle registrierten Nutzer verfügbar, auch mit einem Gratis-Konto. Dies umfasst Fondsanalysen, Marktdaten und Forschungsberichte.",
      fr: "La **base de recherche Morningstar** est disponible pour tous les utilisateurs inscrits, y compris les comptes Gratuits. Cela comprend des analyses de fonds, des données de marché et des rapports de recherche.",
    },
  },

  // ── Opzeggen / annuleren ──
  {
    keywords: [
      ["opzeggen", "annuleren", "stoppen", "beëindigen", "cancel"],
      ["cancel", "cancellation", "stop", "terminate", "end subscription"],
      ["annuler", "résilier", "arrêter"],
      ["kündigen", "stornieren", "beenden"],
    ],
    answers: {
      nl: "Om je abonnement op te zeggen kun je terecht op **Mijn account → Mijn abonnementen**. Voor specifieke vragen over opzegging of terugbetaling kun je het beste contact met ons opnemen.\n\nDe **Premium proef** stopt automatisch na 10 dagen — daar hoef je niets voor te doen.",
      en: "To cancel your subscription, go to **My account → My subscriptions**. For specific questions about cancellation or refunds, please contact us.\n\nThe **Premium trial** stops automatically after 10 days — no action needed.",
      de: "Um Ihr Abonnement zu kündigen, gehen Sie zu **Mein Konto → Meine Abonnements**. Bei Fragen zur Kündigung oder Erstattung kontaktieren Sie uns bitte.\n\nDie **Premium Probe** endet automatisch nach 10 Tagen — kein Handlungsbedarf.",
      fr: "Pour résilier votre abonnement, allez dans **Mon compte → Mes abonnements**. Pour des questions spécifiques sur la résiliation ou le remboursement, veuillez nous contacter.\n\nL'**essai Premium** s'arrête automatiquement après 10 jours — aucune action requise.",
    },
  },

  // ── Wat is IO ──
  {
    keywords: [
      ["wat is", "investment officer", "io", "over ons", "wie zijn", "wat doen jullie", "platform"],
      ["what is", "investment officer", "about", "who are", "what do you do", "platform"],
      ["qu'est-ce que", "investment officer", "à propos", "qui êtes"],
      ["was ist", "investment officer", "über uns", "wer sind"],
    ],
    answers: {
      nl: "**Investment Officer** is een internationaal mediaplatform voor de professionele beleggingsindustrie. Onderdeel van **FD Mediagroep**.\n\nWe bieden vaknieuws, analyses, columns en research voor beleggingsprofessionals in Europa. Met edities in Nederland, België, Duitsland, Frankrijk, Luxemburg en een internationale editie.",
      en: "**Investment Officer** is an international media platform for the professional investment industry. Part of **FD Mediagroep**.\n\nWe offer industry news, analyses, columns and research for investment professionals across Europe. With editions in the Netherlands, Belgium, Germany, France, Luxembourg and an international edition.",
      de: "**Investment Officer** ist eine internationale Medienplattform für die professionelle Investmentbranche. Teil der **FD Mediagroep**.\n\nWir bieten Fachnachrichten, Analysen, Kolumnen und Research für Investmentprofis in Europa.",
      fr: "**Investment Officer** est une plateforme médiatique internationale pour l'industrie professionnelle de l'investissement. Fait partie de **FD Mediagroep**.\n\nNous offrons des actualités sectorielles, analyses, chroniques et recherches pour les professionnels de l'investissement en Europe.",
    },
  },
]

// ─── Matching engine ──────────────────────────────────────────────────────────
// Returns the best FAQ entry for a given query in a given language.
// Language index: nl=0, en=1, de=2, fr=3
const LANG_INDEX = { nl: 0, en: 1, de: 2, fr: 3 }

function findBestMatch(query, lang) {
  const idx = LANG_INDEX[lang] ?? 0
  const normalised = query.toLowerCase().replace(/[?!.,;:'"]/g, "")
  const words = normalised.split(/\s+/)

  let bestEntry = null
  let bestScore = 0

  for (const entry of FAQ_ENTRIES) {
    // Check keywords for current language first, then fall back to all languages
    const keywordSets = [entry.keywords[idx], ...entry.keywords].filter(Boolean)

    let maxMatchScore = 0
    for (const kwSet of keywordSets) {
      let matchCount = 0
      for (const kw of kwSet) {
        const kwLower = kw.toLowerCase()
        // Check if any word starts with the keyword, or the full query contains it
        if (words.some(w => w.startsWith(kwLower) || kwLower.startsWith(w)) || normalised.includes(kwLower)) {
          matchCount++
        }
      }
      if (matchCount > maxMatchScore) maxMatchScore = matchCount
    }

    if (maxMatchScore > bestScore) {
      bestScore = maxMatchScore
      bestEntry = entry
    }
  }

  return bestScore >= 1 ? bestEntry : null
}

// ─── Fallback answers ─────────────────────────────────────────────────────────
const FALLBACK = {
  nl: "Daar heb ik helaas geen specifiek antwoord op. Probeer een andere formulering, of neem contact met ons op — we helpen je graag persoonlijk verder.",
  en: "I don't have a specific answer for that. Try rephrasing your question, or contact us — we're happy to help you personally.",
  de: "Darauf habe ich leider keine spezifische Antwort. Versuchen Sie eine andere Formulierung oder kontaktieren Sie uns — wir helfen Ihnen gerne persönlich weiter.",
  fr: "Je n'ai malheureusement pas de réponse spécifique à cette question. Essayez de reformuler, ou contactez-nous — nous serons ravis de vous aider personnellement.",
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ThumbUp() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  )
}

function ThumbDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
    </svg>
  )
}

// ─── HelpBot i18n ─────────────────────────────────────────────────────────────
const botStrings = {
  nl: {
    title: "Hulp nodig?",
    subtitle: "Stel je vraag — we helpen je direct",
    placeholder: "Typ je vraag hier...",
    send: "Verstuur",
    welcome: "Hoi! Ik ben de IO Assistent. Ik kan je helpen met vragen over registratie, abonnementen, inloggen en meer. Waar kan ik je mee helpen?",
    helpful: "Was dit nuttig?",
    yes: "Ja",
    no: "Nee",
    thanks_pos: "Bedankt voor je feedback!",
    thanks_neg: "Dank je. We verbeteren continu.",
    suggestions: [
      "Welke abonnementen zijn er?",
      "Hoe registreer ik me?",
      "Wat kost Premium?",
      "Hoe nodig ik collega's uit?",
    ],
    powered: "Gebaseerd op IO kennisbank",
    open: "Stel een vraag",
    close: "Sluiten",
  },
  en: {
    title: "Need help?",
    subtitle: "Ask a question — we'll help right away",
    placeholder: "Type your question here...",
    send: "Send",
    welcome: "Hi! I'm the IO Assistant. I can help with questions about registration, subscriptions, login and more. How can I help?",
    helpful: "Was this helpful?",
    yes: "Yes",
    no: "No",
    thanks_pos: "Thanks for your feedback!",
    thanks_neg: "Thanks. We're always improving.",
    suggestions: [
      "What subscriptions are available?",
      "How do I register?",
      "What does Premium cost?",
      "How do I invite colleagues?",
    ],
    powered: "Based on IO knowledge base",
    open: "Ask a question",
    close: "Close",
  },
  de: {
    title: "Hilfe?",
    subtitle: "Stellen Sie Ihre Frage — wir helfen sofort",
    placeholder: "Geben Sie Ihre Frage ein...",
    send: "Senden",
    welcome: "Hallo! Ich bin der IO Assistent. Ich helfe bei Fragen zu Registrierung, Abonnements, Login und mehr. Wie kann ich helfen?",
    helpful: "War das hilfreich?",
    yes: "Ja",
    no: "Nein",
    thanks_pos: "Vielen Dank für Ihr Feedback!",
    thanks_neg: "Danke. Wir verbessern uns ständig.",
    suggestions: [
      "Welche Abonnements gibt es?",
      "Wie registriere ich mich?",
      "Was kostet Premium?",
      "Wie lade ich Kollegen ein?",
    ],
    powered: "Basiert auf IO Wissensdatenbank",
    open: "Frage stellen",
    close: "Schließen",
  },
  fr: {
    title: "Besoin d'aide ?",
    subtitle: "Posez votre question — on vous aide tout de suite",
    placeholder: "Tapez votre question ici...",
    send: "Envoyer",
    welcome: "Bonjour ! Je suis l'assistant IO. Je peux vous aider avec des questions sur l'inscription, les abonnements, la connexion et plus. Comment puis-je vous aider ?",
    helpful: "Utile ?",
    yes: "Oui",
    no: "Non",
    thanks_pos: "Merci pour votre retour !",
    thanks_neg: "Merci. Nous nous améliorons constamment.",
    suggestions: [
      "Quels abonnements existent ?",
      "Comment m'inscrire ?",
      "Combien coûte Premium ?",
      "Comment inviter des collègues ?",
    ],
    powered: "Basé sur la base de connaissances IO",
    open: "Poser une question",
    close: "Fermer",
  },
}

// ─── Markdown-light renderer ──────────────────────────────────────────────────
// Renders **bold** and • list items with minimal markup
function renderMessage(text) {
  return text.split("\n").map((line, i) => {
    // Bold
    const parts = line.split(/(\*\*.*?\*\*)/).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j}>{part.slice(2, -2)}</strong>
      }
      return part
    })
    return (
      <span key={i}>
        {i > 0 && <br />}
        {parts}
      </span>
    )
  })
}

// ─── HelpBot Component ────────────────────────────────────────────────────────
export default function HelpBot() {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [feedbackGiven, setFeedbackGiven] = useState({})
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const bt = botStrings[lang] || botStrings.nl

  // Reset on language change
  useEffect(() => {
    setMessages([{ role: "assistant", content: bt.welcome, id: "welcome", raw: true }])
    setFeedbackGiven({})
  }, [lang])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  function sendMessage(text) {
    if (!text.trim()) return
    const userMsg = { role: "user", content: text.trim(), id: Date.now().toString() }
    const match = findBestMatch(text, lang)
    const answer = match
      ? (match.answers[lang] || match.answers.nl)
      : (FALLBACK[lang] || FALLBACK.nl)

    const botMsg = { role: "assistant", content: answer, id: Date.now().toString() + "_a" }

    setMessages(prev => [...prev, userMsg, botMsg])
    setInput("")
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function handleFeedback(msgId, positive) {
    setFeedbackGiven(prev => ({ ...prev, [msgId]: positive ? "pos" : "neg" }))
  }

  const showSuggestions = messages.length === 1 && messages[0].id === "welcome"

  // ── Collapsed ──
  if (!open) {
    return (
      <div className="reg-sidebar-card" style={{ background: C.gray50, cursor: "pointer" }} onClick={() => setOpen(true)}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            background: C.navy, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke={C.white} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", fontWeight: 600, color: C.navy }}>{bt.title}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: C.gray500, marginTop: "0.125rem" }}>{bt.open}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke={C.gray500} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    )
  }

  // ── Expanded ──
  return (
    <div className="reg-sidebar-card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        background: C.navy, padding: "10px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke={C.white} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ color: C.white, fontSize: "0.8125rem", fontWeight: 700, fontFamily: "var(--font-sans)", lineHeight: 1.2 }}>{bt.title}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.6875rem", fontFamily: "var(--font-sans)" }}>{bt.subtitle}</div>
          </div>
        </div>
        <button onClick={() => setOpen(false)} style={{
          background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6,
          color: C.white, cursor: "pointer", padding: "4px 8px",
          fontFamily: "var(--font-sans)", fontSize: "0.6875rem", fontWeight: 600,
        }}>{bt.close}</button>
      </div>

      {/* Messages */}
      <div style={{
        height: 300, overflowY: "auto", padding: "10px",
        display: "flex", flexDirection: "column", gap: 8,
        background: C.gray50,
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: "flex", flexDirection: "column",
            alignItems: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "90%", padding: "8px 11px",
              borderRadius: msg.role === "user" ? "10px 10px 3px 10px" : "10px 10px 10px 3px",
              background: msg.role === "user" ? C.navy : C.white,
              color: msg.role === "user" ? C.white : C.navy,
              fontFamily: "var(--font-sans)", fontSize: "0.8125rem", lineHeight: 1.5,
              border: msg.role === "assistant" ? `1px solid ${C.gray200}` : "none",
              wordBreak: "break-word",
            }}>
              {msg.raw ? msg.content : renderMessage(msg.content)}
            </div>

            {/* Feedback */}
            {msg.role === "assistant" && msg.id !== "welcome" && (
              <div style={{ marginTop: 3 }}>
                {!feedbackGiven[msg.id] ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: C.gray500 }}>{bt.helpful}</span>
                    <button onClick={() => handleFeedback(msg.id, true)} style={{
                      background: "none", border: `1px solid ${C.gray200}`, borderRadius: 4,
                      padding: "2px 6px", cursor: "pointer", color: C.gray500,
                      display: "flex", alignItems: "center", gap: 2,
                      fontFamily: "var(--font-sans)", fontSize: "0.6875rem",
                    }}><ThumbUp /> {bt.yes}</button>
                    <button onClick={() => handleFeedback(msg.id, false)} style={{
                      background: "none", border: `1px solid ${C.gray200}`, borderRadius: 4,
                      padding: "2px 6px", cursor: "pointer", color: C.gray500,
                      display: "flex", alignItems: "center", gap: 2,
                      fontFamily: "var(--font-sans)", fontSize: "0.6875rem",
                    }}><ThumbDown /> {bt.no}</button>
                  </div>
                ) : (
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: feedbackGiven[msg.id] === "pos" ? C.green : C.gray500 }}>
                    {feedbackGiven[msg.id] === "pos" ? bt.thanks_pos : bt.thanks_neg}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Suggestions */}
        {showSuggestions && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 2 }}>
            {bt.suggestions.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)} style={{
                background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14,
                padding: "4px 10px", fontFamily: "var(--font-sans)", fontSize: "0.75rem",
                color: C.navy, cursor: "pointer", fontWeight: 500, lineHeight: 1.3,
              }}>{s}</button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Powered by */}
      <div style={{
        fontSize: "0.625rem", color: C.gray500, textAlign: "center",
        padding: "3px 10px", background: C.gray50,
        borderTop: `1px solid ${C.gray200}`, fontFamily: "var(--font-sans)",
      }}>{bt.powered}</div>

      {/* Input */}
      <div style={{
        padding: "8px 10px 10px", background: C.white,
        borderTop: `1px solid ${C.gray100}`,
        display: "flex", gap: 6, alignItems: "flex-end",
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
          placeholder={bt.placeholder}
          style={{
            flex: 1, padding: "8px 10px", borderRadius: 8,
            border: `1.5px solid ${C.gray200}`, fontFamily: "var(--font-sans)",
            fontSize: "0.8125rem", outline: "none", color: C.navy, background: C.gray50,
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: input.trim() ? C.red : C.gray200,
            border: "none", cursor: input.trim() ? "pointer" : "default",
            color: C.white, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        ><SendIcon /></button>
      </div>
    </div>
  )
}
