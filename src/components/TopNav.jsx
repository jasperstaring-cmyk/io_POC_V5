import { C } from '../tokens.js'
import IOLogo from './IOLogo.jsx'
import { LangSwitcher } from './shared.jsx'
import { useLang } from '../LanguageContext.jsx'

const NAV_LINKS = ["Beleggen","Opinie","Sector","Research","Podcasts","Partners","Events"]

export default function TopNav({ onLogin, onSubscribe, loggedIn, userEmail, onLogout, onAccount }) {
  const { t } = useLang()
  return (
    <header style={{ position:"sticky", top:0, zIndex:50, background:C.white, borderBottom:`1px solid ${C.gray100}`, boxShadow:"0 1px 6px rgba(12,24,46,0.06)" }}>
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 1.5rem", height:56, display:"flex", alignItems:"center", gap:"2rem" }}>
        <IOLogo />
        <nav style={{ display:"flex", gap:"1.5rem", flex:1 }}>
          {NAV_LINKS.map(l => <a key={l} className="nav-link" href="#">{l}</a>)}
        </nav>
        <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
          <LangSwitcher />
          {loggedIn ? (
            <>
              <button onClick={onAccount} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, textDecoration:"underline", textDecorationColor:"transparent", transition:"text-decoration-color 0.2s" }}
                onMouseEnter={e => e.target.style.textDecorationColor=C.gray300}
                onMouseLeave={e => e.target.style.textDecorationColor="transparent"}>
                {userEmail}
              </button>
              <button className="btn-secondary" style={{ padding:"0.4rem 1rem", fontSize:"0.875rem" }} onClick={onLogout}>{t("nav_logout")}</button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                style={{ background:"none", border:`1.5px solid ${C.gray300}`, borderRadius:4, cursor:"pointer", fontFamily:"var(--font-sans)", fontSize:"0.875rem", fontWeight:600, color:C.navy, padding:"0.4rem 1.125rem", transition:"border-color 0.2s", whiteSpace:"nowrap" }}
                onMouseEnter={e => e.currentTarget.style.borderColor=C.navy}
                onMouseLeave={e => e.currentTarget.style.borderColor=C.gray300}>
                {t("nav_login")}
              </button>
              <button
                onClick={onSubscribe}
                style={{ background:C.navy, border:`1.5px solid ${C.navy}`, borderRadius:4, cursor:"pointer", fontFamily:"var(--font-sans)", fontSize:"0.875rem", fontWeight:600, color:C.white, padding:"0.4rem 1.125rem", transition:"background 0.2s", whiteSpace:"nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.background=C.navyMid; e.currentTarget.style.borderColor=C.navyMid }}
                onMouseLeave={e => { e.currentTarget.style.background=C.navy; e.currentTarget.style.borderColor=C.navy }}>
                {t("nav_subscribe")}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
