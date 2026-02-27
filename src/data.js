// ─── Job role clusters ────────────────────────────────────────────────────────
// Cluster names/descriptions are in i18n.js under jrc_<id>_name / jrc_<id>_desc
// Role names/descriptions are in i18n.js under jr_<id>_name / jr_<id>_desc
export const JOB_ROLE_CLUSTERS = [
  { id: "leadership",    roles: ["cio", "ceo", "coo", "board_member", "managing_director"] },
  { id: "investment",    roles: ["portfolio_manager", "fund_manager", "investment_strategist", "fund_selector", "fiduciary_manager", "investment_analyst", "research_economist", "esg_analyst", "quant_analyst"] },
  { id: "commercial",    roles: ["wealth_manager", "private_banker", "financial_planner", "relationship_manager", "sales_distribution", "business_development", "product_specialist", "marketing_manager", "communications_pr", "content_specialist"] },
  { id: "risk_finance",  roles: ["compliance_officer", "risk_manager", "legal_counsel", "regulatory_specialist", "finance_controller", "accountant", "reporting_analyst"] },
  { id: "ops_tech",      roles: ["operations_middle_office", "client_servicing", "project_manager", "it_manager", "data_analyst", "software_engineer", "innovation_lead"] },
  { id: "consulting",    roles: ["management_consultant", "investment_consultant", "strategy_advisor", "other"] },
]

// Flat list for backward compatibility (AccountPage, etc.)
export const JOB_ROLES = JOB_ROLE_CLUSTERS.flatMap(c => c.roles.map(id => ({ id })))

// ─── Organisation segments & types ───────────────────────────────────────────
export const SEGMENTS = [
  {
    id: "wealth",
    name: "Wealth Management",
    desc: "Organisations that help individuals and families manage their wealth, including private banks, independent advisors, and family offices.",
    product: "A",
    types: [
      { id:"private_banking", name:"Private Banking",                      desc:"Banks offering wealth and investment services to individuals and families." },
      { id:"large_banks",     name:"Large Banks (Wholesale & Retail)",      desc:"Large banks providing investment services to individual and corporate clients." },
      { id:"family_offices",  name:"Family Offices",                        desc:"Organisations managing the wealth of one or more families." },
      { id:"independent",     name:"Independent Advisors & Intermediaries", desc:"Independent wealth advisors, brokers and tied agents." },
      { id:"brokerage",       name:"Brokerage & Trading",                   desc:"Firms providing brokerage and trading services." },
      { id:"corporate_ib",    name:"Corporate & Investment Banking",        desc:"Banks offering corporate finance and capital markets services." },
      { id:"estate",          name:"Estate Planning & Foundations",         desc:"Entities focused on inheritance, estate structures and philanthropy." },
      { id:"sovereign",       name:"Sovereign Wealth Funds",                desc:"State-owned investment funds." },
      { id:"other_wealth",    name:"Other",                                  desc:"Any other wealth management organisation." },
    ],
  },
  {
    id: "asset_management",
    name: "Asset Management",
    desc: "Firms that design and manage investment strategies through investment funds and institutional mandates.",
    product: "B",
    types: [
      { id:"diversified",     name:"Diversified Asset Manager",      desc:"Firms with multiple product lines and no clear dominant focus." },
      { id:"traditional",     name:"Traditional Asset Manager",      desc:"Fund houses focused on mutual funds, UCITS or AIFs." },
      { id:"etf_issuer",      name:"ETF Issuer",                     desc:"Specialists issuing and managing ETFs." },
      { id:"real_estate",     name:"Real Estate Investment Manager",  desc:"Organisations providing real estate investment vehicles." },
      { id:"private_markets", name:"Private Markets Manager",        desc:"Firms focused on private equity, private credit, infrastructure, venture capital and broader real assets." },
      { id:"structured",      name:"Structured Products Provider",   desc:"Issuers of certificates, notes, and derivative-based investment products." },
      { id:"fiduciary",       name:"Fiduciary / OCIO Provider",      desc:"Providers of LDI mandates, fiduciary services or outsourced CIO solutions." },
      { id:"boutique",        name:"Specialist / Boutique Manager",  desc:"Niche or thematic investment providers (e.g., ESG, quant, single strategy)." },
      { id:"other_am",        name:"Other",                          desc:"Organisations not fitting the above categories." },
    ],
  },
  {
    id: "institutional",
    name: "Institutional Investor",
    desc: "Large organisations that invest significant assets, such as pension funds and insurance companies.",
    product: "A",
    types: [
      { id:"pension_funds",       name:"Pension Funds",        desc:"Organisations managing retirement assets." },
      { id:"insurance_companies", name:"Insurance Companies",  desc:"Insurers investing premiums on behalf of their clients." },
      { id:"other_institutional", name:"Other",                desc:"Any other institutional investor." },
    ],
  },
  {
    id: "asset_servicing",
    name: "Asset Servicing",
    desc: "Firms providing supporting services such as custody, administration, consulting, technology, data, legal services or compliance.",
    product: "B",
    types: [
      { id:"custody",          name:"Custody, Administration & Accounting", desc:"Providers of custody, fund administration and accounting services." },
      { id:"consulting",       name:"Consulting",                           desc:"Consulting firms advising on business, benefits or investment strategy." },
      { id:"legal_compliance", name:"Legal, Tax & Compliance",              desc:"Specialists in legal services, regulation and compliance." },
      { id:"tech_platforms",   name:"Technology & Platforms",               desc:"FinTech providers, trading platforms, data platforms and IT infrastructure companies." },
      { id:"education",        name:"Education & Research",                 desc:"Training providers, academic institutions, research firms and data vendors." },
      { id:"media_marketing",  name:"Media, Marketing & Recruitment",      desc:"Media companies, communications agencies and recruitment firms." },
      { id:"risk_actuarial",   name:"Risk & Actuarial",                     desc:"Providers of risk advisory and actuarial services." },
      { id:"other_servicing",  name:"Other",                                desc:"Any other servicing organisation." },
    ],
  },
  {
    id: "other",
    name: "Other Organisation",
    desc: "Regulators, governments, associations, universities and other entities connected to the investment industry.",
    product: "B",
    types: [
      { id:"industry_networks", name:"Industry & Networks",    desc:"Sector associations, professional networks and representative bodies." },
      { id:"government",        name:"Government & Regulators", desc:"Ministries, supervisors and regulatory agencies." },
      { id:"academia",          name:"Academia & Science",      desc:"Universities, academic departments and research institutes." },
      { id:"other_other",       name:"Other",                   desc:"Any other related organisation." },
    ],
  },
]

// ─── Business plan sizes (Sell Side Paid – 1 editie) ───────────────────────
export const BUSINESS_SIZES = [
  { id:"S",  label:"Small Business",       users:"2–5 gebruikers",    priceLabel:"€ 79,–",    monthlyPrice:79,    perUser: null,  desc:"Voor kleine teams die samen willen lezen." },
  { id:"M",  label:"Medium Business",      users:"6–10 gebruikers",   priceLabel:"€ 149,–",   monthlyPrice:149,   perUser: null,  desc:"Voor middelgrote teams met gedeelde toegang." },
  { id:"L",  label:"Large Business",       users:"11–15 gebruikers",  priceLabel:"€ 199,–",   monthlyPrice:199,   perUser: null,  desc:"Voor grotere organisaties." },
  { id:"XL", label:"Extra large Business", users:"16 of meer gebruikers", priceLabel:"Vanaf € 12,50 p.m. per gebruiker", monthlyPrice:null, perUser: 12.50, desc:"Prijs per gebruiker per maand." },
]

// Backward compat
export const PRODUCT_C_VARIANTS = BUSINESS_SIZES

// ─── Business International sizes (all editions) ─────────────────────────────
// ~45-50% toeslag op NL-pakketten; 50% discount for Wealth & Institutional segments
export const BUSINESS_INTL_SIZES = [
  { id:"S",  label:"Small",        users:"2–5 gebruikers",          yearlyPrice:1428,  perUser:null, minUsers:2,  maxUsers:5  },
  { id:"M",  label:"Medium",       users:"6–10 gebruikers",         yearlyPrice:2628,  perUser:null, minUsers:6,  maxUsers:10 },
  { id:"L",  label:"Large",        users:"11–15 gebruikers",        yearlyPrice:3468,  perUser:null, minUsers:11, maxUsers:15 },
  { id:"XL", label:"Extra Large",  users:"16 of meer gebruikers",   yearlyPrice:null,  perUser:18.50, minUsers:16, maxUsers:null },
]

// ─── Personal plans ───────────────────────────────────────────────────────────
export const PERSONAL_PLANS = [
  {
    id: "freemium",
    name: "Freemium",
    sub: "Voor professionals",
    priceLabel: "Gratis",
    priceSuffix: "",
    cta: "Maak gratis account aan",
    ctaNote: "Altijd gratis. Upgrade wanneer u wilt.",
    features: [
      "Toegang tot fondsenanalyse en marktrapporten",
      "Selectie van partnercontent",
      "Nieuwsbrieven instellen en beheren",
      "Persoonlijke omgeving met profielbeheer",
    ],
  },
  {
    id: "trial",
    name: "Pro Trial",
    sub: "10 dagen volledige toegang",
    priceLabel: "Gratis",
    priceSuffix: "10 dagen",
    cta: "Start 10 dagen Pro",
    ctaNote: "Na 10 dagen stopt uw toegang automatisch.",
    features: [
      "Volledige toegang tot alle Premium artikelen (Nederland)",
      "Alle columns, analyses en expertbijdragen",
      "Toegang via website en app",
      "Volledige controle over nieuwsbrieven",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    sub: "Volledige toegang – Nederland",
    priceLabel: "€ 648,–",
    priceSuffix: "Per jaar (excl. btw)",
    cta: "Word Pro lid",
    ctaNote: "Direct onbeperkte toegang na betaling.",
    features: [
      "Onbeperkte toegang tot alle redactionele content",
      "Exclusieve interviews, analyses en columns",
      "Volledige dekking van editie Nederland",
      "Persoonlijk account voor web en app",
    ],
  },
]