import { useState } from 'react'
import { C } from '../tokens.js'
import { useLang } from '../LanguageContext.jsx'

/* ─── Stripe Logo (PNG met tekst-fallback) ────────────────────────────────── */
export function StripeLogo({ height = 24 }) {
  const [imgFailed, setImgFailed] = useState(false)
  if (imgFailed) {
    return (
      <span style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: `${height * 0.85}px`,
        fontWeight: 700,
        color: "#0a2540",
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}>
        stripe
      </span>
    )
  }
  return (
    <img
      src="/images/Stripe_LOGO.png"
      alt="Stripe"
      style={{ height, objectFit: "contain", display: "block" }}
      onError={() => setImgFailed(true)}
    />
  )
}

/* ─── Stripe Checkout Simulatie ───────────────────────────────────────────────
 * Visuele nabootsing van de Stripe hosted checkout (gebaseerd op Frame_326).
 * Wordt gebruikt in zowel PersonalFlow als BusinessFlow.
 *
 * Props:
 *   amount      — string, bijv. "€ 648,–"
 *   description — string, bijv. "Premium — 1 jaar"
 *   onPay       — callback wanneer gebruiker op "Pay" klikt
 *   onBack      — callback voor terug-knop (optioneel)
 * ───────────────────────────────────────────────────────────────────────────── */

/* Card brand icons as inline SVGs */
function CardIcons() {
  return (
    <div style={{ display:"flex", gap:"4px", alignItems:"center" }}>
      {/* Visa */}
      <div style={{ width:32, height:20, borderRadius:3, background:"#1A1F71", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ color:"#fff", fontSize:"9px", fontWeight:800, fontFamily:"sans-serif", letterSpacing:"0.5px" }}>VISA</span>
      </div>
      {/* Mastercard */}
      <div style={{ width:32, height:20, borderRadius:3, background:"#f5f5f5", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
        <div style={{ width:11, height:11, borderRadius:"50%", background:"#EB001B", position:"absolute", left:6 }} />
        <div style={{ width:11, height:11, borderRadius:"50%", background:"#F79E1B", position:"absolute", right:6, opacity:0.85 }} />
      </div>
      {/* Amex */}
      <div style={{ width:32, height:20, borderRadius:3, background:"#006FCF", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ color:"#fff", fontSize:"6.5px", fontWeight:800, fontFamily:"sans-serif", letterSpacing:"0.3px" }}>AMEX</span>
      </div>
      {/* Discover / iDEAL hint */}
      <div style={{ width:32, height:20, borderRadius:3, background:"#FF6600", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ color:"#fff", fontSize:"5.5px", fontWeight:700, fontFamily:"sans-serif" }}>DISC</span>
      </div>
    </div>
  )
}

export default function StripeCheckoutSim({ amount, description, onPay, onBack }) {
  const { t } = useLang()

  const S = {
    /* Stripe achtergrond: lichtgrijs, volledige breedte */
    wrapper: {
      background: "#f6f9fc",
      borderRadius: 12,
      padding: "2rem 0",
      marginBottom: "1.5rem",
    },
    /* Witte kaart centraal */
    card: {
      background: "#ffffff",
      borderRadius: 12,
      padding: "2rem 1.75rem",
      maxWidth: 420,
      margin: "0 auto",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
    },
    label: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#30313d",
      marginBottom: "6px",
      display: "block",
    },
    /* Stripe-stijl input velden */
    input: {
      width: "100%",
      boxSizing: "border-box",
      border: "1px solid #e0e0e0",
      borderRadius: 6,
      padding: "10px 12px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: "0.9375rem",
      color: "#30313d",
      background: "#fff",
      outline: "none",
    },
    /* Gecombineerde card-info box (Stripe-stijl) */
    cardInfoBox: {
      border: "1px solid #e0e0e0",
      borderRadius: 6,
      overflow: "hidden",
    },
    cardInfoTop: {
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid #e0e0e0",
      padding: "10px 12px",
    },
    cardInfoBottom: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    },
    cardInfoCell: {
      padding: "10px 12px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: "0.9375rem",
      color: "#6d6e78",
      background: "#fff",
    },
    /* Donkerblauwe Stripe "Pay" knop */
    payBtn: {
      width: "100%",
      padding: "12px",
      border: "none",
      borderRadius: 6,
      background: "#0a2540",
      color: "#ffffff",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      marginTop: "1.5rem",
      transition: "background 0.15s",
    },
    terms: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: "0.75rem",
      color: "#6d6e78",
      textAlign: "center",
      marginTop: "10px",
      lineHeight: 1.4,
    },
    demoNotice: {
      fontFamily: "var(--font-sans)",
      fontSize: "0.8rem",
      color: C.gray500,
      textAlign: "center",
      marginTop: "1rem",
      fontStyle: "italic",
      lineHeight: 1.5,
    },
  }

  return (
    <div>
      {/* Beschrijving boven het Stripe blok */}
      {description && (
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: "1rem", padding: "0.75rem 1rem",
          background: C.gray50, borderRadius: 8, border: `1px solid ${C.gray200}`,
        }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: C.navy, fontWeight: 600 }}>{description}</span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "1.125rem", color: C.navy, fontWeight: 800 }}>{amount}</span>
        </div>
      )}

      {/* Stripe checkout simulatie */}
      <div style={S.wrapper}>
        <div style={S.card}>
          {/* Stripe logo bovenaan */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <StripeLogo height={28} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={S.label}>Email</label>
            <input style={S.input} type="text" value="vincent@defigners.nl" disabled />
          </div>

          {/* Card information — gecombineerd veld zoals Stripe */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={S.label}>Card information</label>
            <div style={S.cardInfoBox}>
              <div style={S.cardInfoTop}>
                <span style={{
                  flex: 1,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  fontSize: "0.9375rem",
                  color: "#6d6e78",
                }}>
                  4242 4242 4242 4242
                </span>
                <CardIcons />
              </div>
              <div style={S.cardInfoBottom}>
                <div style={{ ...S.cardInfoCell, borderRight: "1px solid #e0e0e0" }}>
                  12 / 28
                </div>
                <div style={{ ...S.cardInfoCell, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>123</span>
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                    <rect x="0.5" y="0.5" width="17" height="13" rx="2" stroke="#6d6e78" strokeWidth="1"/>
                    <rect x="0" y="3" width="18" height="3" fill="#6d6e78"/>
                    <rect x="3" y="8" width="5" height="2" rx="0.5" fill="#6d6e78"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Cardholder name */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={S.label}>Cardholder name</label>
            <input style={S.input} type="text" value="V. Wielders" disabled />
          </div>

          {/* Country or region */}
          <div style={{ marginBottom: "0" }}>
            <label style={S.label}>Country or region</label>
            <div style={{ border: "1px solid #e0e0e0", borderRadius: 6, overflow: "hidden" }}>
              <div style={{
                ...S.cardInfoCell,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                borderBottom: "1px solid #e0e0e0",
                color: "#30313d",
              }}>
                <span>Netherlands</span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="#6d6e78" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <div style={S.cardInfoCell}>
                <span style={{ color: "#6d6e78" }}>3526 KS</span>
              </div>
            </div>
          </div>

          {/* Pay button */}
          <button
            style={S.payBtn}
            onClick={onPay}
            onMouseEnter={e => e.target.style.background = "#0d3050"}
            onMouseLeave={e => e.target.style.background = "#0a2540"}
          >
            Pay {amount}
          </button>

          {/* Terms */}
          <div style={S.terms}>
            By clicking Pay, you agree to the <span style={{ textDecoration: "underline", cursor: "pointer" }}>Link Terms</span> and <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>.
          </div>
        </div>
      </div>

      {/* Demo disclaimer */}
      <div style={S.demoNotice}>
        {t("bf_payment_demo")}
      </div>

      {/* Terug knop */}
      {onBack && (
        <div style={{ marginTop: "1rem" }}>
          <button
            className="btn-secondary btn-full"
            onClick={onBack}
          >
            {t("pf_payment_back")}
          </button>
        </div>
      )}
    </div>
  )
}
