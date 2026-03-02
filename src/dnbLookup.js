// ─── D&B Lookup Simulation ────────────────────────────────────────────────────
// Simulates Dun & Bradstreet Direct+ API for the POC.
// In production: Laravel backend calls D&B Connect API + Search API.
// Frontend never communicates with D&B directly.
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Simulated D&B entity database.
 * Each entry represents a unique legal entity with DUNS number.
 * Fields mirror D&B Direct+ response structure.
 */
export const DNB_ENTITIES = [

  // ── Wealth Management (Buy Side) ──────────────────────────────────────────
  { duns: "401234567", name: "ABN AMRO MeesPierson B.V.", country: "NL", registrationNumber: "34237437", vatNumber: "NL809870092B01", street: "Gustav Mahlerlaan", houseNumber: "10", zip: "1082 PP", city: "Amsterdam", sicCode: "6022", sicDescription: "State commercial banks" },
  { duns: "401234568", name: "Van Lanschot Kempen Wealth Management N.V.", country: "NL", registrationNumber: "16038212", vatNumber: "NL004770787B01", street: "Hooge Steenweg", houseNumber: "29", zip: "5211 JN", city: "'s-Hertogenbosch", sicCode: "6022", sicDescription: "State commercial banks" },
  { duns: "401234569", name: "InsingerGilissen Bankiers N.V.", country: "NL", registrationNumber: "33181863", vatNumber: "NL005831617B01", street: "Herengracht", houseNumber: "537", zip: "1017 BV", city: "Amsterdam", sicCode: "6022", sicDescription: "State commercial banks" },
  { duns: "401234570", name: "Rabobank Wealth Management", country: "NL", registrationNumber: "30046259", vatNumber: "NL002939553B01", street: "Croeselaan", houseNumber: "18", zip: "3521 CB", city: "Utrecht", sicCode: "6022", sicDescription: "State commercial banks" },
  { duns: "401234571", name: "ING Private Banking N.V.", country: "NL", registrationNumber: "33031431", vatNumber: "NL003543964B01", street: "Bijlmerdreef", houseNumber: "106", zip: "1102 CT", city: "Amsterdam", sicCode: "6022", sicDescription: "State commercial banks" },
  { duns: "401234590", name: "Mercier Vanderlinden Asset Management", country: "BE", registrationNumber: "0471234567", vatNumber: "BE0471234567", street: "Avenue Louise", houseNumber: "250", zip: "1050", city: "Brussel", sicCode: "6282", sicDescription: "Investment advice" },
  { duns: "401234591", name: "Degroof Petercam Wealth Management SA", country: "BE", registrationNumber: "0403212172", vatNumber: "BE0403212172", street: "Nijverheidsstraat", houseNumber: "44", zip: "1040", city: "Brussel", sicCode: "6022", sicDescription: "State commercial banks" },

  // ── UBS entities (demo: multiple entities, same parent) ───────────────────
  { duns: "481000001", name: "UBS Europe SE, Netherlands Branch", country: "NL", registrationNumber: "54730065", vatNumber: "NL851569160B01", street: "Museumplein", houseNumber: "7", zip: "1071 DJ", city: "Amsterdam", sicCode: "6022", sicDescription: "State commercial banks" },
  { duns: "481000002", name: "UBS Asset Management (Nederland) B.V.", country: "NL", registrationNumber: "54730073", vatNumber: "NL851784293B01", street: "Museumplein", houseNumber: "7", zip: "1071 DJ", city: "Amsterdam", sicCode: "6726", sicDescription: "Investment offices" },
  { duns: "481000003", name: "UBS AG, Zurich", country: "CH", registrationNumber: "CHE-101329561", vatNumber: "CHE-101329561MWST", street: "Bahnhofstrasse", houseNumber: "45", zip: "8001", city: "Zurich", sicCode: "6020", sicDescription: "Savings institutions" },

  // ── Institutional Investors (Buy Side) ────────────────────────────────────
  { duns: "402345678", name: "Stichting Pensioenfonds ABP", country: "NL", registrationNumber: "41079041", vatNumber: null, street: "Oude Lindestraat", houseNumber: "70", zip: "6411 EJ", city: "Heerlen", sicCode: "6371", sicDescription: "Pension, health, welfare funds" },
  { duns: "402345679", name: "Stichting Pensioenfonds Zorg en Welzijn", country: "NL", registrationNumber: "41079437", vatNumber: null, street: "Papendorpseweg", houseNumber: "75", zip: "3528 BJ", city: "Utrecht", sicCode: "6371", sicDescription: "Pension, health, welfare funds" },
  { duns: "402345680", name: "Stichting Pensioenfonds Metaal en Techniek", country: "NL", registrationNumber: "41150973", vatNumber: null, street: "Bezuidenhoutseweg", houseNumber: "30", zip: "2594 AV", city: "Den Haag", sicCode: "6371", sicDescription: "Pension, health, welfare funds" },
  { duns: "402345681", name: "Achmea Investment Management B.V.", country: "NL", registrationNumber: "27154399", vatNumber: "NL815683656B01", street: "Handelsweg", houseNumber: "2", zip: "3707 NH", city: "Zeist", sicCode: "6311", sicDescription: "Life insurance" },
  { duns: "402345682", name: "a.s.r. vermogensbeheer N.V.", country: "NL", registrationNumber: "30099493", vatNumber: "NL808697738B01", street: "Archimedeslaan", houseNumber: "10", zip: "3584 BA", city: "Utrecht", sicCode: "6311", sicDescription: "Life insurance" },

  // ── Asset Management (Sell Side) ──────────────────────────────────────────
  { duns: "403456789", name: "Robeco Institutional Asset Management B.V.", country: "NL", registrationNumber: "24123167", vatNumber: "NL008726413B01", street: "Weena", houseNumber: "850", zip: "3014 DA", city: "Rotterdam", sicCode: "6726", sicDescription: "Investment offices" },
  { duns: "403456790", name: "NN Investment Partners B.V.", country: "NL", registrationNumber: "24286", vatNumber: "NL818400082B01", street: "Schenkkade", houseNumber: "65", zip: "2595 AS", city: "Den Haag", sicCode: "6726", sicDescription: "Investment offices" },
  { duns: "403456791", name: "APG Asset Management N.V.", country: "NL", registrationNumber: "27180", vatNumber: "NL810075842B01", street: "Oude Lindestraat", houseNumber: "70", zip: "6411 EJ", city: "Heerlen", sicCode: "6726", sicDescription: "Investment offices" },
  { duns: "403456792", name: "PGGM Vermogensbeheer B.V.", country: "NL", registrationNumber: "30228490", vatNumber: "NL821074281B01", street: "Noordweg Noord", houseNumber: "150", zip: "3704 JG", city: "Zeist", sicCode: "6726", sicDescription: "Investment offices" },
  { duns: "403456793", name: "Kempen Capital Management N.V.", country: "NL", registrationNumber: "33181992", vatNumber: "NL004770787B02", street: "Beethovenstraat", houseNumber: "300", zip: "1077 WZ", city: "Amsterdam", sicCode: "6726", sicDescription: "Investment offices" },
  { duns: "403456794", name: "MN Services N.V.", country: "NL", registrationNumber: "37103452", vatNumber: "NL008085923B01", street: "Prinses Beatrixlaan", houseNumber: "15", zip: "2595 AK", city: "Den Haag", sicCode: "6726", sicDescription: "Investment offices" },
  { duns: "403456795", name: "BNP Paribas Asset Management Nederland N.V.", country: "NL", registrationNumber: "33181724", vatNumber: null, street: "Herengracht", houseNumber: "595", zip: "1017 CE", city: "Amsterdam", sicCode: "6726", sicDescription: "Investment offices" },
  { duns: "403456810", name: "Amundi Asset Management SA", country: "FR", registrationNumber: "437574452", vatNumber: "FR12437574452", street: "Boulevard Pasteur", houseNumber: "91-93", zip: "75015", city: "Paris", sicCode: "6726", sicDescription: "Investment offices" },
  { duns: "403456811", name: "DWS International GmbH", country: "DE", registrationNumber: "HRB 9135", vatNumber: "DE114104014", street: "Mainzer Landstrasse", houseNumber: "11-17", zip: "60329", city: "Frankfurt am Main", sicCode: "6726", sicDescription: "Investment offices" },

  // ── Asset Servicing (Sell Side) ───────────────────────────────────────────
  { duns: "404567890", name: "KAS BANK N.V.", country: "NL", registrationNumber: "33003587", vatNumber: "NL002476811B01", street: "De Entree", houseNumber: "500", zip: "1101 EE", city: "Amsterdam", sicCode: "6099", sicDescription: "Functions related to depository banking" },
  { duns: "404567891", name: "Ortec Finance B.V.", country: "NL", registrationNumber: "24291853", vatNumber: "NL007765924B01", street: "Boompjes", houseNumber: "40", zip: "3011 XB", city: "Rotterdam", sicCode: "7372", sicDescription: "Prepackaged software" },
  { duns: "404567892", name: "Cardano Risk Management B.V.", country: "NL", registrationNumber: "24390188", vatNumber: null, street: "Weena", houseNumber: "690", zip: "3012 CN", city: "Rotterdam", sicCode: "6282", sicDescription: "Investment advice" },
  { duns: "404567893", name: "Willis Towers Watson Netherlands B.V.", country: "NL", registrationNumber: "24367812", vatNumber: null, street: "Handelsweg", houseNumber: "6", zip: "1181 ZA", city: "Amstelveen", sicCode: "6411", sicDescription: "Insurance agents, brokers" },

  // ── Other Organisations ───────────────────────────────────────────────────
  { duns: "405678901", name: "Pensioenfederatie", country: "NL", registrationNumber: "40530085", vatNumber: null, street: "Bezuidenhoutseweg", houseNumber: "12", zip: "2594 AV", city: "Den Haag", sicCode: "8611", sicDescription: "Business associations" },
  { duns: "405678902", name: "Dutch Fund and Asset Management Association (DUFAS)", country: "NL", registrationNumber: "40530421", vatNumber: null, street: "Bordewijklaan", houseNumber: "8", zip: "2591 XR", city: "Den Haag", sicCode: "8611", sicDescription: "Business associations" },
]


// ─── Known Entities Table (Whitelisting) ──────────────────────────────────────
// Maps DUNS numbers to verified IO segment + type.
// In production: managed via CDP admin interface.
// Grows over time as IO team validates new registrations.
// ──────────────────────────────────────────────────────────────────────────────

export const KNOWN_ENTITIES = {
  // Wealth Management — verified Buy Side
  "401234567": { segment: "wealth",          orgType: "private_banking",      verified: true },
  "401234568": { segment: "wealth",          orgType: "private_banking",      verified: true },
  "401234569": { segment: "wealth",          orgType: "private_banking",      verified: true },
  "401234570": { segment: "wealth",          orgType: "private_banking",      verified: true },
  "401234571": { segment: "wealth",          orgType: "private_banking",      verified: true },
  "401234590": { segment: "wealth",          orgType: "independent_advisors", verified: true },
  "401234591": { segment: "wealth",          orgType: "private_banking",      verified: true },

  // Institutional — verified Buy Side
  "402345678": { segment: "institutional",   orgType: "pension_funds",        verified: true },
  "402345679": { segment: "institutional",   orgType: "pension_funds",        verified: true },
  "402345680": { segment: "institutional",   orgType: "pension_funds",        verified: true },
  "402345681": { segment: "institutional",   orgType: "insurance_companies",            verified: true },
  "402345682": { segment: "institutional",   orgType: "insurance_companies",            verified: true },

  // Asset Management — verified Sell Side
  "403456789": { segment: "asset_management",      orgType: "traditional",          verified: true },
  "403456792": { segment: "asset_management",      orgType: "fiduciary",            verified: true },
  "403456793": { segment: "asset_management",      orgType: "boutique",           verified: true },

  // UBS — different entities, different segments (key demo scenario)
  "481000001": { segment: "wealth",          orgType: "private_banking",      verified: true },
  "481000002": { segment: "asset_management",      orgType: "diversified",          verified: true },

  // Asset Servicing — verified Sell Side
  "404567890": { segment: "asset_servicing", orgType: "custody",              verified: true },
  "404567891": { segment: "asset_servicing", orgType: "tech_platforms",           verified: true },
}


// ─── Search functions ─────────────────────────────────────────────────────────

/**
 * Search D&B entities by name (typeahead).
 * Simulates D&B Search API: POST /v1/search/criteria
 * In production: Laravel backend proxies to D&B with debounce + caching.
 *
 * @param {string} query — partial company name (min 3 chars)
 * @param {string} countryCode — ISO Alpha-2 country code (e.g. "NL")
 * @returns {Array} matching entities, sorted alphabetically
 */
export function searchByName(query, countryCode) {
  if (!query || query.length < 3) return []
  const q = query.toLowerCase()
  return DNB_ENTITIES
    .filter(e => e.country === countryCode && e.name.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Match D&B entity by registration number (exact match).
 * Simulates D&B Connect API: Registration Number Match
 *
 * @param {string} regNumber — KvK, KBO, Handelsregister, SIREN etc.
 * @param {string} countryCode — ISO Alpha-2 country code
 * @returns {Object|null} matched entity or null
 */
export function matchByRegistration(regNumber, countryCode) {
  if (!regNumber || regNumber.length < 3) return null
  const q = regNumber.replace(/[\s\-.]/g, "").toLowerCase()
  return DNB_ENTITIES.find(e =>
    e.country === countryCode &&
    e.registrationNumber.replace(/[\s\-.]/g, "").toLowerCase() === q
  ) || null
}

/**
 * Check if a DUNS number is in the known entities table.
 * @param {string} duns
 * @returns {Object|null} { segment, orgType, verified } or null if unknown
 */
export function getKnownEntity(duns) {
  if (!duns) return null
  return KNOWN_ENTITIES[duns] || null
}

/**
 * Compare user's segment claim with known entity classification.
 * Used in Laag 2 (automatic pre-screening).
 *
 * @param {string} duns — DUNS number of selected entity
 * @param {string} claimedSegmentId — segment the user selected (e.g. "wealth")
 * @returns {{ match: boolean|null, knownSegment: string|null, knownOrgType: string|null }}
 *   match = true:  user claim matches known classification
 *   match = false: MISMATCH — user claims different segment than known
 *   match = null:  entity not in known table → needs manual validation (Laag 3)
 */
export function validateSegmentClaim(duns, claimedSegmentId) {
  const known = getKnownEntity(duns)
  if (!known) return { match: null, knownSegment: null, knownOrgType: null }
  return {
    match: known.segment === claimedSegmentId,
    knownSegment: known.segment,
    knownOrgType: known.orgType,
  }
}

/**
 * Get country-specific label for registration number field.
 * Used in both lookup toggle and manual fallback form.
 */
export function getRegNumberLabel(countryCode) {
  const labels = {
    NL: "KvK-nummer",
    BE: "KBO-nummer",
    DE: "Handelsregisternummer",
    FR: "Numéro SIREN",
    LU: "RCS-nummer",
    CH: "UID-Nummer",
  }
  return labels[countryCode] || "Registratienummer"
}

/**
 * Get country-specific placeholder for registration number field.
 */
export function getRegNumberPlaceholder(countryCode) {
  const placeholders = {
    NL: "12345678",
    BE: "0471.234.567",
    DE: "HRB 12345",
    FR: "123 456 789",
    LU: "B123456",
    CH: "CHE-123.456.789",
  }
  return placeholders[countryCode] || "123456789"
}
