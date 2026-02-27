// ─────────────────────────────────────────────────────────────────────────────
// images.js  —  Centraal beeldregister voor de IO POC
//
// HOE WERKT DIT?
//   1. Voeg je afbeelding toe aan de /public/images/ map in StackBlitz
//   2. Verander het pad hieronder van null naar "/images/jouw-bestand.jpg"
//   3. Klaar — de component gebruikt hem automatisch
//
// Zolang een waarde null is, toont de component een placeholder.
// ─────────────────────────────────────────────────────────────────────────────

export const IMAGES = {

  // ── Logo ─────────────────────────────────────────────────────────────────────
  // Officieel IO logo — verschijnt overal waar nu de SVG-versie staat
  // Aanbevolen formaat: SVG of PNG met transparante achtergrond, min. 300px breed
  logo: "/images/io-logo.png",


  // ── Artikelpagina ────────────────────────────────────────────────────────────
  // Redactionele foto bij het artikel over Trump / creditcards / bankaandelen
  // Aanbevolen formaat: 1440×640px, liggend, nieuwsfoto-stijl
  article_hero: "/images/beeld_artikel_TRUMP_credit_cards.png",


  // ── Registratie sidebar ──────────────────────────────────────────────────────
  // Schermafbeelding of mockup van de IO website, getoond rechts tijdens registratie
  // Aanbevolen formaat: 800×600px
  reg_sidebar: "/images/beeld_laptop_en_smartphone.png",


  // ── Onboarding stap 1: Bevestiging ──────────────────────────────────────────
  // Sfeervolle afbeelding rechts op het welkomstscherm na registratie
  // Aanbevolen formaat: 800×900px, portret of vierkant
  onboarding_welcome: "/images/beeld_onboarding_welcome.png",


  // ── Onboarding stap 2: App download ─────────────────────────────────────────
  // Telefoon mockup of lifestyle foto met de IO app
  // Aanbevolen formaat: 400×600px
  onboarding_app: "/images/beeld_onboarding_app.png",

  // App Store badge (Apple)
  // Download via: https://developer.apple.com/app-store/marketing/guidelines/
  badge_appstore: "/images/app_store_badge.png",
  // "/images/badge-app-store.svg"

  // Google Play badge
  // Download via: https://play.google.com/intl/en_us/badges/
  badge_playstore: "/images/google_play_badge.png",

  // QR code linking to the IO app in the App Store
  qr_code: "/images/qr_io_app.png",

  // IO app icon (rounded square, red with white "io")
  app_icon: "/images/io_app_icon.png",
  // "/images/badge-google-play.png"


  // ── Onboarding stap 5: Klaar / Done ─────────────────────────────────────────
  // Vier feature-afbeeldingen in het 2×2 grid op het afrondingsscherm
  // Aanbevolen formaat: 400×300px per stuk
  onboarding_done_articles:     null,   // Screenshot premiumartikel
  onboarding_done_morningstar:  null,   // Screenshot Morningstar fondsendata
  onboarding_done_newsletters:  null,   // Screenshot nieuwsbrief
  onboarding_done_app:          null,   // Screenshot mobiele app


  // ── Abonnementenpagina ───────────────────────────────────────────────────────
  // Afbeelding in de zakelijke banner ("Gratis toegang voor je team")
  // Aanbevolen formaat: 300×200px
  subscription_biz_visual: "/images/beeld_laptop_en_smartphone.png",


  // ── Account pagina ───────────────────────────────────────────────────────────
  // Kleine illustratie bij de upgrade-banner ("Wereldwijde editie")
  // Aanbevolen formaat: 200×140px
  account_upgrade_visual: null,
  // "/images/account-upgrade.jpg"

}

// ─────────────────────────────────────────────────────────────────────────────
// Hulpfunctie: geeft het pad terug als het beschikbaar is, anders null
// Gebruik: const src = img("article_hero")
// ─────────────────────────────────────────────────────────────────────────────
export function img(key) {
  return IMAGES[key] || null
}
