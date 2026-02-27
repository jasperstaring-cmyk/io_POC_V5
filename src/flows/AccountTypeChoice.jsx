import { C } from '../tokens.js'
import { TopProgressBar, RegSidebar, AuthNav } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'

export default function AccountTypeChoice({ onChoose, onBack }) {
  const { t } = useLang()
  return (
    <div className="reg-layout">
      <TopProgressBar total={4} current={0.5} />
      <AuthNav onBack={onBack} />
      <div className="reg-container">
        <div className="reg-main">

          <div style={{ display:"inline-block", background:"rgba(224,27,65,0.08)", borderRadius:99, padding:"0.25rem 0.875rem", fontFamily:"var(--font-sans)", fontSize:"0.75rem", fontWeight:700, color:C.red, letterSpacing:"0.06em", marginBottom:"1rem" }}>
            {t("choice_badge")}
          </div>

          <h2 className="reg-step-title">{t("choice_title")}</h2>
          <p className="reg-step-sub"> </p>

          <div className="choice-cards">
            <button className="choice-card" onClick={() => onChoose("personal")}>
              <div className="choice-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke={C.red} strokeWidth="1.75"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={C.red} strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="choice-label">{t("choice_personal")}</div>
            </button>

            <button className="choice-card" onClick={() => onChoose("business")}>
              <div className="choice-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="8" r="3.5" stroke={C.red} strokeWidth="1.75"/>
                  <circle cx="17" cy="9" r="2.5" stroke={C.red} strokeWidth="1.5"/>
                  <path d="M2 19c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke={C.red} strokeWidth="1.75" strokeLinecap="round"/>
                  <path d="M17 14c2 0 4 1.3 4 3.5" stroke={C.red} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="choice-label">{t("choice_business")}</div>
            </button>
          </div>
        </div>

        <div className="reg-sidebar">
          <RegSidebar />
        </div>
      </div>
    </div>
  )
}
