// ─── Email classification ─────────────────────────────────────────────────────
const PRIVATE_DOMAINS    = ["gmail.com","hotmail.com","yahoo.com","outlook.com","icloud.com","live.com","me.com","hotmail.nl","ziggo.nl","kpnmail.nl"]
const GENERIC_PREFIXES   = ["info","team","admin","service","subscriptions","contact","support","sales","hello","noreply","no-reply","office","mail","post","help","reception","secretariat","redactie","bestuur","algemeen"]
const ENTERPRISE_DOMAINS = ["abnamro.com"]
const EXISTING_ACCOUNTS  = ["demo@aegon.com"]

// Domain → company name for SSO display
const COMPANY_NAMES = { "abnamro.com":"ABN AMRO" }

const PRIVATE_DOMAINS_LOGIN = ["gmail.com","hotmail.com","yahoo.com","outlook.com","icloud.com","live.com","me.com"]
const SSO_DOMAINS           = ["abnamro.com"]
const KNOWN_ACCOUNTS_LOGIN  = ["demo@aegon.com"]

// SSO domain → company name
const SSO_COMPANY_NAMES = { "abnamro.com":"ABN AMRO" }

/**
 * Whitelist domains — pre-approved organisations for Enterprise access.
 * Each entry defines the company name, segment, org type, and which edition(s).
 * edition: "nl" = 1 edition (Enterprise NL), "all" = all editions (Enterprise All)
 * In production this would come from a back-end API.
 */
export const WHITELIST_MAP = {
  "wealthpro.com": {
    company: "WealthPro",
    segment: "wealth",
    orgType: "private_banking",
    edition: "nl",              // Enterprise — Dutch edition only
  },
  "globalfund.com": {
    company: "GlobalFund Capital",
    segment: "wealth",
    orgType: "private_banking",
    edition: "all",             // Enterprise — all editions
  },
}

const WHITELIST_DOMAINS = Object.keys(WHITELIST_MAP)

export function getCompanyNameFromEmail(email) {
  if (!email || !email.includes("@")) return null
  const domain = email.toLowerCase().split("@")[1]
  // Also check whitelist domains for company name
  if (WHITELIST_MAP[domain]) return WHITELIST_MAP[domain].company
  return SSO_COMPANY_NAMES[domain] || null
}

/**
 * Returns whitelist info for an email domain, or null if not whitelisted.
 */
export function getWhitelistInfo(email) {
  if (!email || !email.includes("@")) return null
  const domain = email.toLowerCase().split("@")[1]
  return WHITELIST_MAP[domain] || null
}

/**
 * Classifies an email for the registration flow.
 * Returns: "generic" | "private" | "existing" | "enterprise" | "whitelist" | "new" | "invalid"
 */
export function classifyEmailForReg(email) {
  if (!email || !email.includes("@")) return "invalid"
  const [prefix, domain] = email.toLowerCase().split("@")
  if (!domain) return "invalid"
  if (GENERIC_PREFIXES.some(p => prefix === p || prefix.startsWith(p + ".") || prefix.startsWith(p + "_"))) return "generic"
  if (PRIVATE_DOMAINS.includes(domain)) return "private"
  // Domain-level checks first (enterprise/whitelist take priority over individual account checks)
  if (ENTERPRISE_DOMAINS.includes(domain)) return "enterprise"
  if (WHITELIST_DOMAINS.includes(domain)) return "whitelist"
  if (EXISTING_ACCOUNTS.includes(email.toLowerCase())) return "existing"
  return "new"
}

/**
 * Classifies an email for the login modal.
 * Returns: "private" | "sso" | "whitelist" | "known" | "unknown" | "invalid"
 */
export function classifyEmailForLogin(email) {
  if (!email || !email.includes("@")) return "invalid"
  const parts  = email.toLowerCase().split("@")
  const domain = parts[1]
  if (!domain) return "invalid"
  if (PRIVATE_DOMAINS_LOGIN.includes(domain)) return "private"
  if (SSO_DOMAINS.includes(domain)) return "sso"
  if (WHITELIST_DOMAINS.includes(domain)) return "whitelist"
  if (KNOWN_ACCOUNTS_LOGIN.includes(email.toLowerCase())) return "known"
  return "unknown"
}
