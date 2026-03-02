import { useState, useEffect, useRef } from 'react'
import { C } from '../tokens.js'
import { BackButton } from '../components/shared.jsx'
import { searchByName, matchByRegistration, getKnownEntity, getRegNumberLabel, getRegNumberPlaceholder } from '../dnbLookup.js'
import { SEGMENTS } from '../data.js'

/**
 * CompanyLookupStep — D&B lookup-first company details step.
 *
 * Three phases:
 *   1. Lookup: typeahead on name or search by registration number
 *   2. Confirm: read-only fields from D&B, user confirms
 *   3. Manual fallback: traditional form (if entity not found or "Dit klopt niet")
 *
 * Props:
 *   company          — company state object
 *   onChange          — function(field, value) to update company state
 *   isBuySide        — boolean, true for wealth/institutional segments
 *   segment          — selected segment object { id, ... }
 *   onNext           — function() called when step is complete
 *   onBack           — function() called for back navigation
 *   onSegmentCorrect — function(segmentObj, orgTypeObj) called when user accepts segment correction
 *   t                — i18n translate function
 *   tSeg             — segment translate function
 */
export default function CompanyLookupStep({ company, onChange, isBuySide, segment, onNext, onBack, onSegmentCorrect, t, tSeg }) {

  // ── Phase state ───────────────────────────────────────────────────────────
  const [phase, setPhase]               = useState("lookup")    // "lookup" | "confirm" | "manual"
  const [searchMode, setSearchMode]     = useState("name")      // "name" | "registration"
  const [searchQuery, setSearchQuery]   = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [isSearching, setIsSearching]   = useState(false)
  const [noResults, setNoResults]       = useState(false)
  const [knownEntityInfo, setKnownEntityInfo] = useState(null)
  const [mismatchOverride, setMismatchOverride] = useState(false) // user chose "Nee, mijn keuze klopt"
  const dropdownRef = useRef(null)
  const searchTimeout = useRef(null)

  // ── Close dropdown on outside click ───────────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ── Typeahead debounce ────────────────────────────────────────────────────
  useEffect(() => {
    if (searchMode !== "name" || searchQuery.length < 3) {
      setSearchResults([])
      setShowDropdown(false)
      setNoResults(false)
      return
    }
    setIsSearching(true)
    setNoResults(false)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      const results = searchByName(searchQuery, company.country)
      setSearchResults(results)
      setShowDropdown(true)
      setIsSearching(false)
      setNoResults(results.length === 0)
    }, 300)
    return () => clearTimeout(searchTimeout.current)
  }, [searchQuery, company.country, searchMode])

  // ── Select entity from dropdown ───────────────────────────────────────────
  function handleSelectEntity(entity) {
    setSelectedEntity(entity)
    setShowDropdown(false)
    setSearchQuery("")
    setMismatchOverride(false)

    onChange("name", entity.name)
    onChange("street", entity.street)
    onChange("number", entity.houseNumber)
    onChange("addition", "")
    onChange("zip", entity.zip)
    onChange("city", entity.city)
    onChange("kvk", entity.registrationNumber)
    onChange("vat", entity.vatNumber || "")
    onChange("duns", entity.duns)
    onChange("lookupMethod", "dnb_name_search")

    const known = getKnownEntity(entity.duns)
    setKnownEntityInfo(known)
    setPhase("confirm")
  }

  // ── Search by registration number ─────────────────────────────────────────
  function handleRegSearch(e) {
    e.preventDefault()
    if (!searchQuery || searchQuery.length < 3) return
    setIsSearching(true)
    setNoResults(false)
    setTimeout(() => {
      const result = matchByRegistration(searchQuery, company.country)
      setIsSearching(false)
      if (result) {
        setSelectedEntity(result)
        setMismatchOverride(false)
        onChange("name", result.name)
        onChange("street", result.street)
        onChange("number", result.houseNumber)
        onChange("addition", "")
        onChange("zip", result.zip)
        onChange("city", result.city)
        onChange("kvk", result.registrationNumber)
        onChange("vat", result.vatNumber || "")
        onChange("duns", result.duns)
        onChange("lookupMethod", "dnb_registration_match")
        const known = getKnownEntity(result.duns)
        setKnownEntityInfo(known)
        setPhase("confirm")
      } else {
        setNoResults(true)
      }
    }, 400)
  }

  // ── Switch to manual fallback ─────────────────────────────────────────────
  function goManual() {
    setSelectedEntity(null)
    setKnownEntityInfo(null)
    setMismatchOverride(false)
    onChange("duns", "")
    onChange("lookupMethod", "manual")
    setSearchQuery("")
    setSearchResults([])
    setNoResults(false)
    setPhase("manual")
  }

  // ── Handle segment correction (Option C) ──────────────────────────────────
  function handleAcceptCorrection() {
    if (!knownEntityInfo || !onSegmentCorrect) return
    const correctSegment = SEGMENTS.find(s => s.id === knownEntityInfo.segment)
    const correctType = correctSegment?.types?.find(tp => tp.id === knownEntityInfo.orgType) || null
    if (correctSegment) {
      onSegmentCorrect(correctSegment, correctType)
    }
  }

  // ── Mismatch state helpers ────────────────────────────────────────────────
  const isMismatch = knownEntityInfo && segment && knownEntityInfo.segment !== segment.id
  const isMatch = knownEntityInfo && segment && knownEntityInfo.segment === segment.id
  const canProceed = !isMismatch || mismatchOverride

  // ── Country / reg helpers ─────────────────────────────────────────────────
  const countryLabels = { NL: t("bf_country_nl"), BE: t("bf_country_be"), DE: t("bf_country_de"), FR: t("bf_country_fr"), LU: t("bf_country_lu") }
  const regLabel = getRegNumberLabel(company.country)
  const regPlaceholder = getRegNumberPlaceholder(company.country)

  // ═════════════════════════════════════════════════════════════════════════════
  // PHASE 1: LOOKUP
  // ═════════════════════════════════════════════════════════════════════════════
  if (phase === "lookup") {
    return (
      <>
        <h2 className="reg-step-title">{t("bf_company_title")}</h2>
        <p className="reg-step-sub">{t("bf_lookup_sub")}</p>

        {isBuySide && (
          <div style={{
            display:"flex", alignItems:"flex-start", gap:"0.5rem",
            background:"rgba(240,200,120,0.1)", border:"1px solid rgba(240,200,120,0.4)",
            borderRadius:8, padding:"0.625rem 0.875rem", marginBottom:"1.25rem",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop:"0.1rem", flexShrink:0 }}>
              <circle cx="8" cy="8" r="7" stroke="#B8860B" strokeWidth="1.25"/>
              <path d="M8 5v3.5M8 10.5v.5" stroke="#B8860B" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:"#6B4F00", lineHeight:"1.4" }}>
              {t("bf_verification_notice")}
            </span>
          </div>
        )}

        <div className="input-group">
          <label className="input-label">{t("bf_country_label")}</label>
          <select className="input-field" value={company.country} onChange={e => {
            onChange("country", e.target.value)
            setSearchQuery(""); setSearchResults([]); setNoResults(false)
          }}>
            <option value="NL">{t("bf_country_nl")}</option>
            <option value="BE">{t("bf_country_be")}</option>
            <option value="DE">{t("bf_country_de")}</option>
            <option value="FR">{t("bf_country_fr")}</option>
            <option value="LU">{t("bf_country_lu")}</option>
          </select>
        </div>

        <div style={{ display:"flex", gap:"1rem", marginBottom:"1rem" }}>
          <button type="button" style={{
            background:"none", border:"none", padding:"0.25rem 0", cursor:"pointer",
            fontFamily:"var(--font-sans)", fontSize:"0.8125rem", fontWeight: searchMode === "name" ? 700 : 400,
            color: searchMode === "name" ? C.navy : C.gray500,
            borderBottom: searchMode === "name" ? `2px solid ${C.red}` : "2px solid transparent",
          }} onClick={() => { setSearchMode("name"); setSearchQuery(""); setNoResults(false) }}>
            {t("bf_lookup_by_name")}
          </button>
          <button type="button" style={{
            background:"none", border:"none", padding:"0.25rem 0", cursor:"pointer",
            fontFamily:"var(--font-sans)", fontSize:"0.8125rem", fontWeight: searchMode === "registration" ? 700 : 400,
            color: searchMode === "registration" ? C.navy : C.gray500,
            borderBottom: searchMode === "registration" ? `2px solid ${C.red}` : "2px solid transparent",
          }} onClick={() => { setSearchMode("registration"); setSearchQuery(""); setNoResults(false) }}>
            {t("bf_lookup_by_reg")}
          </button>
        </div>

        {searchMode === "name" && (
          <div className="input-group" style={{ position:"relative" }} ref={dropdownRef}>
            <label className="input-label">{t("bf_lookup_name_label")}</label>
            <div style={{ position:"relative" }}>
              <input className="input-field" type="text" placeholder={t("bf_lookup_name_placeholder")} value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} autoFocus autoComplete="off" style={{ paddingRight:"2.5rem" }} />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ position:"absolute", right:"0.75rem", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                <circle cx="11" cy="11" r="7" stroke={C.gray500} strokeWidth="1.75"/>
                <path d="M16 16l4.5 4.5" stroke={C.gray500} strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
            </div>

            {isSearching && <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, padding:"0.5rem 0" }}>{t("bf_lookup_searching")}</div>}

            {showDropdown && searchResults.length > 0 && (
              <div style={{
                position:"absolute", top:"100%", left:0, right:0, zIndex:50,
                background:C.white, border:`1.5px solid ${C.gray200}`, borderRadius:6,
                boxShadow:"0 8px 24px rgba(12,24,46,0.12)", maxHeight:"280px", overflowY:"auto", marginTop:"0.25rem",
              }}>
                {searchResults.map((entity, i) => (
                  <button key={entity.duns} type="button" onClick={() => handleSelectEntity(entity)} style={{
                    display:"block", width:"100%", textAlign:"left", background:"none", border:"none",
                    padding:"0.75rem 1rem", cursor:"pointer",
                    borderBottom: i < searchResults.length - 1 ? `1px solid ${C.gray100}` : "none",
                    fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy, transition:"background 0.15s",
                  }} onMouseEnter={e => e.currentTarget.style.background = C.gray50}
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
                onChange={e => { setSearchQuery(e.target.value); setNoResults(false) }} autoFocus autoComplete="off" />
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

        {!noResults && (
          <div style={{ marginTop:"1.25rem", textAlign:"center" }}>
            <button className="link-btn" style={{ fontSize:"0.8125rem" }} type="button" onClick={goManual}>{t("bf_lookup_manual_fallback")}</button>
          </div>
        )}

        <div className="reg-nav-bar" style={{ marginTop:"1.25rem" }}>
          <BackButton onClick={onBack} />
        </div>
      </>
    )
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // PHASE 2: CONFIRM (read-only D&B data)
  // ═════════════════════════════════════════════════════════════════════════════
  if (phase === "confirm") {
    return (
      <>
        <h2 className="reg-step-title">{t("bf_company_title")}</h2>
        <p className="reg-step-sub">{t("bf_confirm_sub")}</p>

        {/* Buy Side verification notice */}
        {isBuySide && (
          <div style={{
            display:"flex", alignItems:"flex-start", gap:"0.5rem",
            background:"rgba(240,200,120,0.1)", border:"1px solid rgba(240,200,120,0.4)",
            borderRadius:8, padding:"0.625rem 0.875rem", marginBottom:"1.25rem",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop:"0.1rem", flexShrink:0 }}>
              <circle cx="8" cy="8" r="7" stroke="#B8860B" strokeWidth="1.25"/>
              <path d="M8 5v3.5M8 10.5v.5" stroke="#B8860B" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:"#6B4F00", lineHeight:"1.4" }}>
              {t("bf_verification_entity_notice").replace("{company}", company.name)}
            </span>
          </div>
        )}

        {/* ── MATCH: known entity, segment correct ── */}
        {isMatch && (
          <div style={{
            display:"flex", alignItems:"flex-start", gap:"0.5rem",
            background:"rgba(78,213,150,0.08)", border:"1px solid rgba(78,213,150,0.3)",
            borderRadius:8, padding:"0.625rem 0.875rem", marginBottom:"1.25rem",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop:"0.1rem", flexShrink:0 }}>
              <circle cx="8" cy="8" r="7" stroke={C.green} strokeWidth="1.25"/>
              <path d="M5 8l2 2 4-4" stroke={C.green} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:"#1B5E20", lineHeight:"1.4" }}>
              {t("bf_known_entity_match").replace("{company}", company.name)}
            </span>
          </div>
        )}

        {/* ── MISMATCH: Option C — suggest correction ── */}
        {isMismatch && !mismatchOverride && (
          <div style={{
            background:"rgba(224,27,65,0.04)", border:`1.5px solid rgba(224,27,65,0.2)`,
            borderRadius:8, padding:"1rem 1.125rem", marginBottom:"1.25rem",
          }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:"0.5rem", marginBottom:"0.75rem" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop:"0.1rem", flexShrink:0 }}>
                <circle cx="8" cy="8" r="7" stroke={C.red} strokeWidth="1.25"/>
                <path d="M8 5v3.5M8 10.5v.5" stroke={C.red} strokeWidth="1.25" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:"#8B1A1A", lineHeight:"1.4" }}>
                {t("bf_known_entity_mismatch")
                  .replace("{company}", company.name)
                  .replace("{segment}", tSeg ? tSeg(knownEntityInfo.segment, "name") : knownEntityInfo.segment)
                }
              </span>
            </div>

            {/* Action: accept correction */}
            <button className="btn-green btn-full" type="button" style={{ marginBottom:"0.5rem" }} onClick={handleAcceptCorrection}>
              {t("bf_mismatch_accept").replace("{segment}", tSeg ? tSeg(knownEntityInfo.segment, "name") : knownEntityInfo.segment)}
            </button>

            {/* Action: override — keep current segment */}
            <button className="link-btn" type="button" style={{ fontSize:"0.8rem", display:"block", width:"100%", textAlign:"center" }}
              onClick={() => setMismatchOverride(true)}>
              {t("bf_mismatch_override")}
            </button>
          </div>
        )}

        {/* ── MISMATCH overridden: user insists on their choice ── */}
        {isMismatch && mismatchOverride && (
          <div style={{
            display:"flex", alignItems:"flex-start", gap:"0.5rem",
            background:"rgba(240,200,120,0.1)", border:"1px solid rgba(240,200,120,0.4)",
            borderRadius:8, padding:"0.625rem 0.875rem", marginBottom:"1.25rem",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop:"0.1rem", flexShrink:0 }}>
              <circle cx="8" cy="8" r="7" stroke="#B8860B" strokeWidth="1.25"/>
              <path d="M8 5v3.5M8 10.5v.5" stroke="#B8860B" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:"#6B4F00", lineHeight:"1.4" }}>
              {t("bf_mismatch_override_notice")}
            </span>
          </div>
        )}

        {/* D&B verified badge */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:"0.375rem",
          background:C.gray50, borderRadius:99, padding:"0.2rem 0.75rem",
          fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:600,
          color:C.gray500, letterSpacing:"0.04em", marginBottom:"1.25rem",
        }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke={C.green} strokeWidth="1.5"/>
            <path d="M5 8l2 2 4-4" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t("bf_confirm_dnb_verified")}
        </div>

        {/* Read-only company data card */}
        <div style={{ background:C.gray50, borderRadius:8, padding:"1rem 1.25rem", marginBottom:"1rem" }}>
          <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.625rem" }}>
            {t("bf_confirm_entity_label")}
          </div>
          <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", fontWeight:700, color:C.navy, marginBottom:"0.5rem" }}>
            {company.name}
          </div>
          <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray700, lineHeight:1.7 }}>
            {company.street} {company.number}<br/>
            {company.zip} {company.city}<br/>
            {countryLabels[company.country] || company.country}
          </div>
          <div style={{ marginTop:"0.75rem", paddingTop:"0.75rem", borderTop:`1px solid ${C.gray200}`, fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray700 }}>
            <span style={{ fontWeight:600 }}>{regLabel}:</span> {company.kvk}
            {company.vat && (<><br/><span style={{ fontWeight:600 }}>{t("bf_vat_label")}:</span> {company.vat}</>)}
          </div>
        </div>

        {/* VAT field — editable only if D&B did not provide it */}
        {!selectedEntity?.vatNumber && (
          <div className="input-group">
            <label className="input-label">{t("bf_vat_label")} <span style={{ color:C.gray500, fontSize:"0.7rem", fontWeight:400, textTransform:"none", letterSpacing:0 }}>({t("bf_optional")})</span></label>
            <input className="input-field" type="text" placeholder="NL123456789B01" value={company.vat} onChange={e => onChange("vat", e.target.value)} />
          </div>
        )}

        {/* "Dit klopt niet" link */}
        <div style={{ textAlign:"center", marginBottom:"1rem" }}>
          <button className="link-btn" style={{ fontSize:"0.8125rem" }} type="button" onClick={goManual}>
            {t("bf_confirm_wrong_link")}
          </button>
        </div>

        <div className="reg-nav-bar">
          <BackButton onClick={() => { setPhase("lookup"); setSelectedEntity(null); setKnownEntityInfo(null); setMismatchOverride(false) }} />
          {canProceed && (
            <button className="btn-green btn-full" onClick={() => onNext()}>
              {t("bf_further")}
            </button>
          )}
        </div>
      </>
    )
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // PHASE 3: MANUAL FALLBACK
  // ═════════════════════════════════════════════════════════════════════════════
  return (
    <>
      <h2 className="reg-step-title">{t("bf_company_title")}</h2>
      <p className="reg-step-sub">{t("bf_company_sub_new")}</p>

      {isBuySide && (
        <div style={{
          display:"flex", alignItems:"flex-start", gap:"0.5rem",
          background:"rgba(240,200,120,0.1)", border:"1px solid rgba(240,200,120,0.4)",
          borderRadius:8, padding:"0.625rem 0.875rem", marginBottom:"1.25rem",
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop:"0.1rem", flexShrink:0 }}>
            <circle cx="8" cy="8" r="7" stroke="#B8860B" strokeWidth="1.25"/>
            <path d="M8 5v3.5M8 10.5v.5" stroke="#B8860B" strokeWidth="1.25" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:"#6B4F00", lineHeight:"1.4" }}>
            {t("bf_verification_notice")}
          </span>
        </div>
      )}

      <div style={{ marginBottom:"1.25rem" }}>
        <button className="link-btn" style={{ fontSize:"0.8125rem" }} type="button" onClick={() => setPhase("lookup")}>
          {t("bf_manual_back_to_lookup")}
        </button>
      </div>

      <form autoComplete="off" data-1p-ignore="true" data-lpignore="true" onSubmit={e => { e.preventDefault(); onChange("lookupMethod", "manual"); onNext() }}>
        <div className="input-group">
          <label className="input-label">{t("bf_company_name_label")}</label>
          <input className="input-field" type="text" placeholder={t("bf_company_name_label")} value={company.name} onChange={e => onChange("name", e.target.value)} autoFocus required />
        </div>

        <div className="input-group">
          <label className="input-label">{t("bf_country_label")}</label>
          <select className="input-field" value={company.country} onChange={e => onChange("country", e.target.value)}>
            <option value="NL">{t("bf_country_nl")}</option>
            <option value="BE">{t("bf_country_be")}</option>
            <option value="DE">{t("bf_country_de")}</option>
            <option value="FR">{t("bf_country_fr")}</option>
            <option value="LU">{t("bf_country_lu")}</option>
          </select>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:"0 1rem" }}>
          <div className="input-group">
            <label className="input-label">{t("bf_street_label")}{!isBuySide && <span style={{ color:C.gray500, fontSize:"0.75rem" }}> ({t("bf_optional")})</span>}</label>
            <input className="input-field" type="text" placeholder={t("bf_street_label")} value={company.street} onChange={e => onChange("street", e.target.value)} required={isBuySide} />
          </div>
          <div className="input-group">
            <label className="input-label">{t("bf_housenr_label")}</label>
            <input className="input-field" type="text" placeholder="12" value={company.number} onChange={e => onChange("number", e.target.value)} required={isBuySide} />
          </div>
          <div className="input-group">
            <label className="input-label">{t("bf_addition_label")}</label>
            <input className="input-field" type="text" placeholder="A" value={company.addition} onChange={e => onChange("addition", e.target.value)} />
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"0 1rem" }}>
          <div className="input-group">
            <label className="input-label">{t("bf_zip_label")}{!isBuySide && <span style={{ color:C.gray500, fontSize:"0.75rem" }}> ({t("bf_optional")})</span>}</label>
            <input className="input-field" type="text" placeholder="0000 AA" value={company.zip} onChange={e => onChange("zip", e.target.value)} required={isBuySide} />
          </div>
          <div className="input-group">
            <label className="input-label">{t("bf_city_label")}{!isBuySide && <span style={{ color:C.gray500, fontSize:"0.75rem" }}> ({t("bf_optional")})</span>}</label>
            <input className="input-field" type="text" placeholder={t("bf_city_label")} value={company.city} onChange={e => onChange("city", e.target.value)} required={isBuySide} />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">{regLabel}{!isBuySide && <span style={{ color:C.gray500, fontSize:"0.75rem" }}> ({t("bf_optional")})</span>}</label>
          <input className="input-field" type="text" placeholder={regPlaceholder} value={company.kvk} onChange={e => onChange("kvk", e.target.value)} required={isBuySide} />
        </div>

        <div className="input-group">
          <label className="input-label">{t("bf_vat_label")} <span style={{ color:C.gray500, fontSize:"0.75rem" }}>({t("bf_optional")})</span></label>
          <input className="input-field" type="text" placeholder="NL123456789B01" value={company.vat} onChange={e => onChange("vat", e.target.value)} />
        </div>

        <div className="reg-nav-bar">
          <BackButton onClick={onBack} />
          <button className="btn-green btn-full" type="submit">{t("bf_further")}</button>
        </div>
      </form>
    </>
  )
}
