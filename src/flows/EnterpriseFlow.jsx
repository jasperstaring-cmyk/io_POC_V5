import { useState, useEffect, useRef } from 'react'
import { C } from '../tokens.js'
import { SEGMENTS } from '../data.js'
import { RegSidebar, SegmentTypeSelector, AuthNav, LangSwitcher } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import { searchByName, matchByRegistration, getRegNumberLabel, getRegNumberPlaceholder } from '../dnbLookup.js'
import IOLogo from '../components/IOLogo.jsx'

// ─── EnterpriseFlow v4 ────────────────────────────────────────────────────────
// Wijzigingen t.o.v. v3:
//   A. Sectie 4 ("Toegang") klapt ook in na submit — markDone("access") + openSection(null)
//   B. Persoonsgegevens als niet-bewerkbare sectie boven de accordeon, met telefoonveld erin
//      Telefoonnummer verplaatst van sectie 4 naar persoonsgegevens-sectie
//   C. Bij keuze "domain": optioneel veld voor e-maildomein(en) verschijnt inline

export default function EnterpriseFlow({ onComplete, onBack, profileData, segmentData }) {
  const { t, tSeg, tType } = useLang()

  const hasSegmentData = !!(segmentData?.segment && segmentData?.orgType)

  const SECTIONS = hasSegmentData
    ? ["company", "edition", "access"]
    : ["company", "segment_type", "edition", "access"]

  const [openSection, setOpenSection] = useState("company")
  const [doneSection, setDoneSection] = useState([])
  const [submitted,   setSubmitted]   = useState(false)

  // Refs voor scroll
  const sectionRefs = useRef({})
  function registerRef(id, el) { if (el) sectionRefs.current[id] = el }
  function scrollToSection(id) {
    setTimeout(() => sectionRefs.current[id]?.scrollIntoView({ behavior:"smooth", block:"start" }), 50)
  }

  // ── Persoonsgegevens (B) ──────────────────────────────────────────────────
  const [phone, setPhone] = useState("")

  // ── Company / D&B ─────────────────────────────────────────────────────────
  const [company, setCompany]     = useState({ kvk:"", name:"", street:"", number:"", addition:"", zip:"", city:"", country:"NL", vat:"", duns:"", lookupMethod:"" })
  const [dnbPhase, setDnbPhase]   = useState("lookup")
  const [searchMode, setSearchMode] = useState("name")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown]   = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [noResults, setNoResults]     = useState(false)
  const dropdownRef   = useRef(null)
  const searchTimeout = useRef(null)

  // ── Segment / type ────────────────────────────────────────────────────────
  const [segment, setSegment] = useState(segmentData?.segment || null)
  const [orgType, setOrgType] = useState(segmentData?.orgType || null)

  // ── Editie ────────────────────────────────────────────────────────────────
  const [edition, setEdition]             = useState(null)
  const [pendingEdition, setPendingEdition] = useState(null)

  // ── Toegangsmethode + domein (C) ──────────────────────────────────────────
  const [accessMethod, setAccessMethod] = useState(null)
  const [emailDomain, setEmailDomain]   = useState("")   // alleen bij "domain"
  const [agreed, setAgreed]             = useState(false)
  const [showAgreeHint, setShowAgreeHint] = useState(false)

  // ── Helpers ───────────────────────────────────────────────────────────────
  function co(f, v) { setCompany(prev => ({ ...prev, [f]: v })) }
  function isDone(id)   { return doneSection.includes(id) }
  function markDone(id) { setDoneSection(prev => prev.includes(id) ? prev : [...prev, id]) }

  function openNext(currentId) {
    const idx = SECTIONS.indexOf(currentId)
    if (idx < SECTIONS.length - 1) {
      const nextId = SECTIONS[idx + 1]
      setOpenSection(nextId)
      scrollToSection(nextId)
    }
  }
  function isUnlocked(id) {
    const idx = SECTIONS.indexOf(id)
    if (idx === 0) return true
    return isDone(SECTIONS[idx - 1])
  }
  function editSection(id) {
    // Alleen deze sectie uit done halen en heropenen — andere keuzes blijven staan
    setDoneSection(prev => prev.filter(s => s !== id))
    setOpenSection(id)
    scrollToSection(id)
  }
  function openAndScroll(id) { setOpenSection(id); scrollToSection(id) }

  // ── Outside click dropdown ────────────────────────────────────────────────
  useEffect(() => {
    const h = e => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  // ── D&B typeahead ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (searchMode !== "name" || searchQuery.length < 3) {
      setSearchResults([]); setShowDropdown(false); setNoResults(false); return
    }
    setIsSearching(true); setNoResults(false)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      const results = searchByName(searchQuery, company.country)
      setSearchResults(results); setShowDropdown(true)
      setIsSearching(false); setNoResults(results.length === 0)
    }, 300)
    return () => clearTimeout(searchTimeout.current)
  }, [searchQuery, company.country, searchMode])

  function handleSelectEntity(entity) {
    setSelectedEntity(entity); setShowDropdown(false); setSearchQuery("")
    co("name", entity.name); co("street", entity.street); co("number", entity.houseNumber)
    co("addition", ""); co("zip", entity.zip); co("city", entity.city)
    co("kvk", entity.registrationNumber); co("vat", entity.vatNumber || "")
    co("duns", entity.duns); co("lookupMethod", "dnb_name_search")
    setDnbPhase("confirm")
  }

  function handleRegSearch(e) {
    e.preventDefault()
    if (!searchQuery || searchQuery.length < 3) return
    setIsSearching(true); setNoResults(false)
    setTimeout(() => {
      const result = matchByRegistration(searchQuery, company.country)
      setIsSearching(false)
      if (result) {
        setSelectedEntity(result)
        co("name", result.name); co("street", result.street); co("number", result.houseNumber)
        co("addition", ""); co("zip", result.zip); co("city", result.city)
        co("kvk", result.registrationNumber); co("vat", result.vatNumber || "")
        co("duns", result.duns); co("lookupMethod", "dnb_registration_match")
        setDnbPhase("confirm")
      } else { setNoResults(true) }
    }, 400)
  }

  function goManual() {
    setSelectedEntity(null); co("duns", ""); co("lookupMethod", "manual")
    setSearchQuery(""); setSearchResults([]); setNoResults(false); setDnbPhase("manual")
  }

  function backToLookup() {
    setDnbPhase("lookup"); setSelectedEntity(null); setSearchQuery(""); setSearchResults([])
  }

  // ── Section completions ───────────────────────────────────────────────────
  function confirmCompany()        { markDone("company");       openNext("company") }
  function confirmManualCompany(e) { e.preventDefault(); co("lookupMethod", "manual"); markDone("company"); openNext("company") }

  function handleEditionSelect(val) {
    setPendingEdition(val)
    setTimeout(() => {
      setEdition(val); setPendingEdition(null)
      markDone("edition"); openNext("edition")
    }, 250)
  }

  function handleSubmitClick() {
    if (!accessMethod) return
    if (!agreed) { setShowAgreeHint(true); return }
    // Sectie is al ingeklapt bij het aanvinken van akkoord — direct door
    setSubmitted(true)
  }

  const regLabel       = getRegNumberLabel(company.country)
  const regPlaceholder = getRegNumberPlaceholder(company.country)
  const countryLabels  = { NL: t("bf_country_nl"), BE: t("bf_country_be"), DE: t("bf_country_de"), FR: t("bf_country_fr"), LU: t("bf_country_lu") }

  // ══════════════════════════════════════════════════════════════════════════
  // BEVESTIGINGSPAGINA
  // ══════════════════════════════════════════════════════════════════════════
  if (submitted) {
    const orgName  = company.name || t("inline_your_org")
    const segName  = segment ? tSeg(segment.id, "name") : "—"
    const typeName = orgType  ? tType(orgType.id, "name") : "—"
    const edLabel  = edition === "nl" ? t("ef_edition_nl_title") : t("ef_edition_intl_title")
    const conf = ({
      domain:  { title: t("ef_confirm_domain_title"),  body: t("ef_confirm_domain_body"),  next: t("ef_confirm_domain_next")  },
      sso:     { title: t("ef_confirm_sso_title"),     body: t("ef_confirm_sso_body"),     next: t("ef_confirm_sso_next")     },
      unknown: { title: t("ef_confirm_unknown_title"), body: t("ef_confirm_unknown_body"), next: t("ef_confirm_unknown_next") },
    })[accessMethod] || {}

    return (
      <div style={{ minHeight:"100vh", background:C.gray50 }}>
        <header style={{ position:"sticky", top:0, zIndex:50, background:C.white, borderBottom:`1px solid ${C.gray100}`, height:56, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 2rem" }}>
          <IOLogo />
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            <LangSwitcher />
            <button style={{ background:"none", border:"none", fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, cursor:"pointer" }}>{t("nav_help")}</button>
          </div>
        </header>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 56px)", padding:"2rem" }}>
          <div style={{ background:C.white, borderRadius:12, padding:"2.5rem 3rem", maxWidth:580, width:"100%", boxShadow:"0 4px 24px rgba(12,24,46,0.08)" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:C.green, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.25rem" }}>
              <svg width="18" height="14" viewBox="0 0 16 13" fill="none"><path d="M1 6.5L5.5 11L15 1.5" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"1.75rem", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", marginBottom:"0.5rem" }}>{conf.title}</h1>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.75rem" }}>{conf.body}</p>

            <div style={{ background:C.gray50, border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1rem 1.25rem", marginBottom:"1.75rem" }}>
              <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.75rem" }}>{t("ef_confirm_summary_label")}</div>
              <SummaryRow label={t("ef_confirm_org_label")}     value={orgName} />
              <SummaryRow label={t("ef_confirm_segment_label")} value={`${segName} — ${typeName}`} />
              <SummaryRow label={t("ef_confirm_edition_label")} value={edLabel} />
              <SummaryRow label={t("ef_confirm_access_label")}  value={t(`ef_access_${accessMethod}_title`)} last />
            </div>

            <div style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem", background:"rgba(12,24,46,0.03)", border:`1px solid ${C.gray200}`, borderRadius:8, padding:"0.875rem 1rem", marginBottom:"1.75rem" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink:0, marginTop:"0.1rem" }}>
                <circle cx="9" cy="9" r="8" stroke={C.navy} strokeWidth="1.25"/>
                <path d="M9 8v4M9 6v.5" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy, lineHeight:"1.5" }}>{conf.next}</span>
            </div>

            <button className="btn-red btn-full" style={{ marginBottom:"1.25rem" }} onClick={onComplete}>{t("ef_confirm_cta")}</button>

            <div style={{ textAlign:"center", fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray500 }}>
              {t("ef_confirm_contact_prefix")}{" "}
              <a href="mailto:enterprise@investmentofficer.nl" style={{ color:C.navy, fontWeight:600, textDecoration:"none" }}>
                enterprise@investmentofficer.nl
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ACCORDEON FORMULIER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="reg-layout">
      <AuthNav onBack={onBack} />
      <div className="reg-container">
        <div className="reg-main">

          {/* Paginaheader */}
          <div style={{ display:"inline-block", background:"rgba(224,27,65,0.08)", borderRadius:99, padding:"0.25rem 0.875rem", fontFamily:"var(--font-sans)", fontSize:"0.75rem", fontWeight:700, color:C.red, letterSpacing:"0.06em", marginBottom:"1rem" }}>
            Enterprise
          </div>
          <h2 className="reg-step-title" style={{ marginBottom:"0.375rem" }}>{t("ef_form_title")}</h2>
          <p className="reg-step-sub" style={{ marginBottom:"1.5rem" }}>{t("ef_form_sub")}</p>

          {/* ── B: Persoonsgegevens — niet-bewerkbaar, altijd zichtbaar ── */}
          <div style={{ background:C.gray50, border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1rem 1.25rem", marginBottom:"1.75rem" }}>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.875rem" }}>
              {t("ef_profile_section_label")}
            </div>

            {/* Naam + avatar rij */}
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.875rem" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:C.navy, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", fontWeight:700, color:C.white }}>
                  {(profileData?.firstName?.[0] || "?").toUpperCase()}{(profileData?.lastName?.[0] || "").toUpperCase()}
                </span>
              </div>
              <div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", fontWeight:700, color:C.navy }}>
                  {profileData?.firstName || "—"} {profileData?.lastName || ""}
                </div>
                {profileData?.jobRole && (
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500 }}>{profileData.jobRole}</div>
                )}
              </div>
            </div>

            {/* E-mail */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem 1rem", marginBottom:"0.875rem" }}>
              <div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:600, color:C.gray500, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"0.2rem" }}>{t("ef_profile_email_label")}</div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy }}>{profileData?.email || "—"}</div>
              </div>
            </div>

            {/* Scheidingslijn */}
            <div style={{ borderTop:`1px solid ${C.gray200}`, marginBottom:"0.875rem" }} />

            {/* Telefoonnummer optioneel (B: verplaatst vanuit sectie 4) */}
            <div>
              <label style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:C.gray500, display:"block", marginBottom:"0.375rem" }}>
                {t("ef_phone_label")} <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>({t("bf_optional")})</span>
              </label>
              <input
                className="input-field"
                type="tel"
                placeholder="+31 6 12 34 56 78"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ marginBottom:0 }}
              />
            </div>
          </div>

          {/* ── SECTIE 1: Organisatie (D&B) ── */}
          <div ref={el => registerRef("company", el)}>
            <Accordion
              open={openSection === "company"}
              done={isDone("company")}
              unlocked={isUnlocked("company")}
              title={t("ef_section_company_title")}
              editLabel={t("ef_edit_label")}
              summary={isDone("company") ? company.name : null}
              onOpen={() => openAndScroll("company")}
              onEdit={() => editSection("company")}
            >
              {/* Lookup fase */}
              {dnbPhase === "lookup" && <>
                <div className="input-group">
                  <label className="input-label">{t("bf_country_label")}</label>
                  <select className="input-field" value={company.country} onChange={e => { co("country", e.target.value); setSearchQuery(""); setSearchResults([]); setNoResults(false) }}>
                    <option value="NL">{t("bf_country_nl")}</option>
                    <option value="BE">{t("bf_country_be")}</option>
                    <option value="DE">{t("bf_country_de")}</option>
                    <option value="FR">{t("bf_country_fr")}</option>
                    <option value="LU">{t("bf_country_lu")}</option>
                  </select>
                </div>
                <div style={{ display:"flex", gap:"1rem", marginBottom:"1rem" }}>
                  <TabBtn active={searchMode === "name"} onClick={() => { setSearchMode("name"); setSearchQuery(""); setNoResults(false) }}>{t("bf_lookup_by_name")}</TabBtn>
                  <TabBtn active={searchMode === "registration"} onClick={() => { setSearchMode("registration"); setSearchQuery(""); setNoResults(false) }}>{t("bf_lookup_by_reg")}</TabBtn>
                </div>

                {searchMode === "name" && (
                  <div className="input-group" style={{ position:"relative" }} ref={dropdownRef}>
                    <label className="input-label">{t("bf_lookup_name_label")}</label>
                    <div style={{ position:"relative" }}>
                      <input className="input-field" type="text" placeholder={t("bf_lookup_name_placeholder")} value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)} autoComplete="off" style={{ paddingRight:"2.5rem" }} />
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ position:"absolute", right:"0.75rem", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                        <circle cx="11" cy="11" r="7" stroke={C.gray500} strokeWidth="1.75"/>
                        <path d="M16 16l4.5 4.5" stroke={C.gray500} strokeWidth="1.75" strokeLinecap="round"/>
                      </svg>
                    </div>
                    {isSearching && <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, padding:"0.5rem 0" }}>{t("bf_lookup_searching")}</div>}
                    {showDropdown && searchResults.length > 0 && (
                      <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:50, background:C.white, border:`1.5px solid ${C.gray200}`, borderRadius:6, boxShadow:"0 8px 24px rgba(12,24,46,0.12)", maxHeight:"240px", overflowY:"auto", marginTop:"0.25rem" }}>
                        {searchResults.map((entity, i) => (
                          <button key={entity.duns} type="button" onClick={() => handleSelectEntity(entity)}
                            style={{ display:"block", width:"100%", textAlign:"left", background:"none", border:"none", padding:"0.75rem 1rem", cursor:"pointer", borderBottom: i < searchResults.length - 1 ? `1px solid ${C.gray100}` : "none", fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy }}
                            onMouseEnter={e => e.currentTarget.style.background = C.gray50}
                            onMouseLeave={e => e.currentTarget.style.background = "none"}>
                            {entity.name}
                          </button>
                        ))}
                      </div>
                    )}
                    {noResults && !isSearching && (
                      <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, padding:"0.5rem 0" }}>
                        {t("bf_lookup_no_results")}{" "}
                        <button className="link-btn" style={{ fontSize:"0.8rem" }} type="button" onClick={goManual}>{t("bf_lookup_manual_link")}</button>
                      </div>
                    )}
                  </div>
                )}

                {searchMode === "registration" && (
                  <form onSubmit={handleRegSearch}>
                    <div className="input-group">
                      <label className="input-label">{regLabel}</label>
                      <input className="input-field" type="text" placeholder={regPlaceholder} value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setNoResults(false) }} autoComplete="off" />
                    </div>
                    {isSearching && <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, padding:"0.5rem 0" }}>{t("bf_lookup_searching")}</div>}
                    {noResults && !isSearching && (
                      <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, padding:"0.5rem 0", marginBottom:"0.75rem" }}>
                        {t("bf_lookup_no_results_reg")}{" "}
                        <button className="link-btn" style={{ fontSize:"0.8rem" }} type="button" onClick={goManual}>{t("bf_lookup_manual_link")}</button>
                      </div>
                    )}
                    <button className="btn-green btn-full" type="submit" disabled={searchQuery.length < 3 || isSearching}>{t("bf_lookup_search_btn")}</button>
                  </form>
                )}
                <div style={{ marginTop:"0.75rem", textAlign:"center" }}>
                  <button className="link-btn" style={{ fontSize:"0.8125rem" }} type="button" onClick={goManual}>{t("bf_lookup_manual_link")}</button>
                </div>
              </>}

              {/* Confirm fase */}
              {dnbPhase === "confirm" && <>
                <div style={{ display:"inline-flex", alignItems:"center", gap:"0.375rem", background:C.gray50, borderRadius:99, padding:"0.2rem 0.75rem", fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:600, color:C.gray500, letterSpacing:"0.04em", marginBottom:"1rem" }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke={C.green} strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {t("bf_confirm_dnb_verified")}
                </div>
                <div style={{ background:C.gray50, borderRadius:8, padding:"1rem 1.25rem", marginBottom:"1rem" }}>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.625rem" }}>{t("bf_confirm_entity_label")}</div>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", fontWeight:700, color:C.navy, marginBottom:"0.5rem" }}>{company.name}</div>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray700, lineHeight:1.7 }}>
                    {company.street} {company.number}<br/>{company.zip} {company.city}<br/>{countryLabels[company.country] || company.country}
                  </div>
                  <div style={{ marginTop:"0.75rem", paddingTop:"0.75rem", borderTop:`1px solid ${C.gray200}`, fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray700 }}>
                    <span style={{ fontWeight:600 }}>{regLabel}:</span> {company.kvk}
                    {company.vat && (<><br/><span style={{ fontWeight:600 }}>{t("bf_vat_label")}:</span> {company.vat}</>)}
                  </div>
                </div>
                {!selectedEntity?.vatNumber && (
                  <div className="input-group">
                    <label className="input-label">{t("bf_vat_label")} <span style={{ color:C.gray500, fontSize:"0.7rem", fontWeight:400 }}>({t("bf_optional")})</span></label>
                    <input className="input-field" type="text" placeholder="NL123456789B01" value={company.vat} onChange={e => co("vat", e.target.value)} />
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"1rem" }}>
                  <button className="link-btn" style={{ fontSize:"0.8125rem" }} type="button" onClick={backToLookup}>{t("ef_back_to_search")}</button>
                  <button className="link-btn" style={{ fontSize:"0.8125rem" }} type="button" onClick={goManual}>{t("bf_confirm_wrong_link")}</button>
                </div>
                <button className="btn-green btn-full" type="button" onClick={confirmCompany}>{t("bf_further")}</button>
              </>}

              {/* Manual fase */}
              {dnbPhase === "manual" && (
                <form autoComplete="off" onSubmit={confirmManualCompany}>
                  <div style={{ marginBottom:"1rem" }}>
                    <button className="link-btn" style={{ fontSize:"0.8125rem" }} type="button" onClick={() => setDnbPhase("lookup")}>{t("bf_manual_back_to_lookup")}</button>
                  </div>
                  <div className="input-group">
                    <label className="input-label">{t("bf_company_name_label")}</label>
                    <input className="input-field" type="text" value={company.name} onChange={e => co("name", e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">{t("bf_country_label")}</label>
                    <select className="input-field" value={company.country} onChange={e => co("country", e.target.value)}>
                      <option value="NL">{t("bf_country_nl")}</option><option value="BE">{t("bf_country_be")}</option>
                      <option value="DE">{t("bf_country_de")}</option><option value="FR">{t("bf_country_fr")}</option>
                      <option value="LU">{t("bf_country_lu")}</option>
                    </select>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:"0 1rem" }}>
                    <div className="input-group"><label className="input-label">{t("bf_street_label")} <Opt t={t}/></label><input className="input-field" type="text" value={company.street} onChange={e => co("street", e.target.value)} /></div>
                    <div className="input-group"><label className="input-label">{t("bf_housenr_label")}</label><input className="input-field" type="text" placeholder="12" value={company.number} onChange={e => co("number", e.target.value)} /></div>
                    <div className="input-group"><label className="input-label">{t("bf_addition_label")}</label><input className="input-field" type="text" value={company.addition} onChange={e => co("addition", e.target.value)} /></div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"0 1rem" }}>
                    <div className="input-group"><label className="input-label">{t("bf_zip_label")} <Opt t={t}/></label><input className="input-field" type="text" placeholder="0000 AA" value={company.zip} onChange={e => co("zip", e.target.value)} /></div>
                    <div className="input-group"><label className="input-label">{t("bf_city_label")} <Opt t={t}/></label><input className="input-field" type="text" value={company.city} onChange={e => co("city", e.target.value)} /></div>
                  </div>
                  <div className="input-group"><label className="input-label">{regLabel} <Opt t={t}/></label><input className="input-field" type="text" placeholder={regPlaceholder} value={company.kvk} onChange={e => co("kvk", e.target.value)} /></div>
                  <div className="input-group"><label className="input-label">{t("bf_vat_label")} <Opt t={t}/></label><input className="input-field" type="text" placeholder="NL123456789B01" value={company.vat} onChange={e => co("vat", e.target.value)} /></div>
                  <button className="btn-green btn-full" type="submit">{t("bf_further")}</button>
                </form>
              )}
            </Accordion>
          </div>

          {/* ── SECTIE 2: Segment + type ── */}
          {!hasSegmentData && (
            <div ref={el => registerRef("segment_type", el)}>
              <Accordion
                open={openSection === "segment_type"}
                done={isDone("segment_type")}
                unlocked={isUnlocked("segment_type")}
                title={t("ef_section_segment_title")}
                editLabel={t("ef_edit_label")}
                summary={isDone("segment_type") && segment && orgType ? `${tSeg(segment.id, "name")} — ${tType(orgType.id, "name")}` : null}
                onOpen={() => isUnlocked("segment_type") && openAndScroll("segment_type")}
                onEdit={() => editSection("segment_type")}
              >
                <p className="reg-step-sub" style={{ marginBottom:"1.25rem" }}>{t("ef_segment_sub")}</p>
                <SegmentTypeSelector segments={SEGMENTS} selectedSegment={segment} selectedType={orgType}
                  onSelect={(seg, tp) => {
                    setSegment(seg); setOrgType(tp)
                    // Direct doorgaan zodra beide gekozen — zelfde patroon als editiekeuze
                    if (seg && tp) {
                      setTimeout(() => {
                        markDone("segment_type"); openNext("segment_type")
                      }, 250)
                    }
                  }} t={t} tSeg={tSeg} tType={tType} />
              </Accordion>
            </div>
          )}

          {/* ── SECTIE 3: Editie ── */}
          <div ref={el => registerRef("edition", el)}>
            <Accordion
              open={openSection === "edition"}
              done={isDone("edition")}
              unlocked={isUnlocked("edition")}
              title={t("ef_section_edition_title")}
              editLabel={t("ef_edit_label")}
              summary={isDone("edition") && edition ? (edition === "nl" ? t("ef_edition_nl_title") : t("ef_edition_intl_title")) : null}
              onOpen={() => isUnlocked("edition") && openAndScroll("edition")}
              onEdit={() => editSection("edition")}
            >
              <p className="reg-step-sub" style={{ marginBottom:"1.25rem" }}>{t("ef_edition_sub")}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                <SelCard selected={edition === "nl" || pendingEdition === "nl"} onSelect={() => handleEditionSelect("nl")} title={t("ef_edition_nl_title")} desc={t("ef_edition_nl_desc")} />
                <SelCard selected={edition === "international" || pendingEdition === "international"} onSelect={() => handleEditionSelect("international")} title={t("ef_edition_intl_title")} desc={t("ef_edition_intl_desc")} />
              </div>
            </Accordion>
          </div>

          {/* ── SECTIE 4: Toegangsmethode + submit ── */}
          <div ref={el => registerRef("access", el)}>
            <Accordion
              open={openSection === "access"}
              done={isDone("access")}
              unlocked={isUnlocked("access")}
              title={t("ef_section_access_title")}
              editLabel={t("ef_edit_label")}
              summary={isDone("access") ? t(`ef_access_${accessMethod}_title`) : null}
              onOpen={() => isUnlocked("access") && openAndScroll("access")}
              onEdit={() => { editSection("access"); setAgreed(false); setShowAgreeHint(false) }}
            >
              <p className="reg-step-sub" style={{ marginBottom:"1.25rem" }}>{t("ef_access_sub")}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", marginBottom:"1.25rem" }}>
                <AccCard selected={accessMethod === "domain"}  onSelect={() => { setAccessMethod("domain");  setEmailDomain("") }} icon={<DomainIcon />} title={t("ef_access_domain_title")}  desc={t("ef_access_domain_desc")} />
                <AccCard selected={accessMethod === "sso"}     onSelect={() => { setAccessMethod("sso");     setEmailDomain("") }} icon={<SsoIcon />}    title={t("ef_access_sso_title")}    desc={t("ef_access_sso_desc")} />
                <AccCard selected={accessMethod === "unknown"} onSelect={() => { setAccessMethod("unknown"); setEmailDomain("") }} icon={<UnknownIcon />} title={t("ef_access_unknown_title")} desc={t("ef_access_unknown_desc")} />
              </div>

              {/* C: domeinveld — alleen zichtbaar bij keuze "domain" */}
              {accessMethod === "domain" && (
                <div style={{ background:"rgba(12,24,46,0.03)", border:`1px solid ${C.gray200}`, borderRadius:8, padding:"0.875rem 1rem", marginBottom:"1.25rem" }}>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", fontWeight:600, color:C.navy, marginBottom:"0.25rem" }}>
                    {t("ef_domain_field_label")} <span style={{ fontWeight:400, color:C.gray500 }}>({t("bf_optional")})</span>
                  </div>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, marginBottom:"0.75rem", lineHeight:"1.5" }}>
                    {t("ef_domain_field_hint")}
                  </div>
                  <input
                    className="input-field"
                    type="text"
                    placeholder={t("ef_domain_field_placeholder")}
                    value={emailDomain}
                    onChange={e => setEmailDomain(e.target.value)}
                    style={{ marginBottom:0 }}
                  />
                </div>
              )}

            </Accordion>
          </div>

          {/* ── Akkoord + submit — buiten accordion, altijd zichtbaar zodra access gekozen ── */}
          {accessMethod && (
            <div style={{ marginTop:"0.5rem" }}>
              <label style={{
                display:"flex", alignItems:"flex-start", gap:"0.625rem",
                marginBottom: showAgreeHint && !agreed ? "0.5rem" : "1.5rem",
                cursor:"pointer",
                background: showAgreeHint && !agreed ? "rgba(224,27,65,0.04)" : "transparent",
                border: showAgreeHint && !agreed ? `1.5px solid rgba(224,27,65,0.25)` : "1.5px solid transparent",
                borderRadius:6, padding: showAgreeHint && !agreed ? "0.625rem 0.75rem" : "0",
                transition:"all 0.2s",
              }}>
                <input type="checkbox" checked={agreed} onChange={e => {
                    const checked = e.target.checked
                    setAgreed(checked)
                    if (checked) {
                      setShowAgreeHint(false)
                      // Sectie inklapt op moment van akkoord — submit blijft zichtbaar eronder
                      setTimeout(() => { markDone("access"); setOpenSection(null) }, 250)
                    } else {
                      // Uitvinken: sectie heropenen
                      setDoneSection(prev => prev.filter(s => s !== "access"))
                      setOpenSection("access")
                    }
                  }} style={{ marginTop:3, accentColor:C.red }} />
                <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color: showAgreeHint && !agreed ? C.red : C.gray700, lineHeight:"var(--lh-body)" }}>
                  {t("ef_agree_prefix")} <button type="button" className="link-btn" style={{ fontSize:"0.85rem" }}>{t("pf_terms_link")}</button> {t("bf_agree_and")} <button type="button" className="link-btn" style={{ fontSize:"0.85rem" }}>{t("pf_privacy_link")}</button>
                </span>
              </label>

              {showAgreeHint && !agreed && (
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.red, marginBottom:"1rem" }}>
                  {t("ef_agree_hint")}
                </div>
              )}

              <button className="btn-red btn-full" onClick={handleSubmitClick}>
                {t("ef_submit")}
              </button>
            </div>
          )}

        </div>

        <div className="reg-sidebar">
          <RegSidebar planName="Enterprise" planPrice={t("ef_sidebar_price")} planPriceSuffix={t("ef_sidebar_suffix")} planFeatures={t("ef_sidebar_features")} planCta={t("ef_sidebar_cta")} />
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// Accordion
// ══════════════════════════════════════════════════════════════════════════════
function Accordion({ open, done, unlocked, title, editLabel, summary, onOpen, onEdit, children }) {
  const locked = !unlocked && !done
  return (
    <div style={{ border:`1.5px solid ${open ? C.navy : done ? C.gray200 : C.gray200}`, borderRadius:8, marginBottom:"0.75rem", overflow:"hidden", opacity: locked ? 0.4 : 1, transition:"opacity 0.2s, border-color 0.2s" }}>
      <div onClick={!locked && !open && !done ? onOpen : undefined}
        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.875rem 1.125rem", background: open ? C.white : done ? C.gray50 : C.white, cursor: !locked && !open && !done ? "pointer" : "default" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
          <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0, background: done ? C.green : open ? C.navy : C.gray200, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {done
              ? <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <div style={{ width:6, height:6, borderRadius:"50%", background: open ? "white" : C.gray300 }} />
            }
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", fontWeight:700, color: locked ? C.gray500 : C.navy }}>{title}</div>
            {done && summary && !open && <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, marginTop:"0.1rem" }}>{summary}</div>}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          {done && !open && onEdit && (
            <button className="link-btn" style={{ fontSize:"0.8rem" }} onClick={e => { e.stopPropagation(); onEdit() }}>{editLabel}</button>
          )}
          {!done && !open && !locked && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 5.25L7 8.75L10.5 5.25" stroke={C.gray500} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </div>
      </div>
      {open && <div style={{ padding:"0 1.125rem 1.25rem", borderTop:`1px solid ${C.gray100}` }}><div style={{ height:"1rem" }}/>{children}</div>}
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Opt({ t }) { return <span style={{ color:C.gray500, fontSize:"0.7rem", fontWeight:400 }}> ({t("bf_optional")})</span> }

function TabBtn({ active, onClick, children }) {
  return <button type="button" style={{ background:"none", border:"none", padding:"0.25rem 0", cursor:"pointer", fontFamily:"var(--font-sans)", fontSize:"0.8125rem", fontWeight: active ? 700 : 400, color: active ? C.navy : C.gray500, borderBottom: active ? `2px solid ${C.red}` : "2px solid transparent" }} onClick={onClick}>{children}</button>
}

function SelCard({ selected, onSelect, title, desc }) {
  return (
    <button className={`sel-row${selected ? " selected" : ""}`} onClick={onSelect} type="button">
      <div className={`sel-dot${selected ? " checked" : ""}`}>{selected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
      <div className="sel-row-body" style={{ flex:1 }}><div className="sel-row-name">{title}</div>{desc && <div className="sel-row-desc">{desc}</div>}</div>
    </button>
  )
}

function AccCard({ selected, onSelect, icon, title, desc }) {
  return (
    <button className={`sel-row${selected ? " selected" : ""}`} onClick={onSelect} type="button" style={{ alignItems:"flex-start" }}>
      <div className={`sel-dot${selected ? " checked" : ""}`} style={{ marginTop:"0.25rem" }}>{selected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
      <div style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem", flex:1 }}>
        <div style={{ flexShrink:0, marginTop:"0.1rem", color: selected ? C.navy : C.gray500 }}>{icon}</div>
        <div className="sel-row-body" style={{ flex:1 }}><div className="sel-row-name">{title}</div>{desc && <div className="sel-row-desc">{desc}</div>}</div>
      </div>
    </button>
  )
}

function SummaryRow({ label, value, last }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:"1rem", paddingBottom: last ? 0 : "0.5rem", marginBottom: last ? 0 : "0.5rem", borderBottom: last ? "none" : `1px solid ${C.gray200}` }}>
      <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray500, flexShrink:0 }}>{label}</span>
      <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", fontWeight:600, color:C.navy, textAlign:"right" }}>{value}</span>
    </div>
  )
}

function DomainIcon() { return <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8h16" stroke="currentColor" strokeWidth="1.5"/><path d="M6 12h3M6 14.5h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg> }
function SsoIcon()    { return <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function UnknownIcon(){ return <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M10 13v.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/><path d="M8 7.5C8 6.7 8.9 6 10 6s2 .7 2 1.5c0 1-1 1.5-2 2V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
