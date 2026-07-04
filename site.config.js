// ============================================================
// GROUNDWORK STUDIOS — PER-CLIENT CONFIG
// Edit ONLY this file when setting up a new client.
// Run `node build.js` after editing to regenerate dist/.
// ============================================================

const config = {

  // --- Business identity ---
  BUSINESS_NAME:    "Rugby Driveways & Patios",
  TRADE:            "Driveway & Patio Specialists",
  TAGLINE:          "Quality Driveways Across Rugby & Surrounding Villages",
  YEARS_TRADING:    "5",
  SERVICE_AREA:     "Rugby & Surrounding Villages",
  DOMAIN:           "demo-driveways.pages.dev",

  // --- Hero ---
  HERO_HEADLINE:    "Rugby's Trusted Driveway Specialists",
  HERO_SUBHEADLINE: "Tarmac, block paving, resin, and natural stone driveways — installed by our own team, start to finish. No deposits. No subcontractors.",

  // --- Trust badges ---
  RATING_TEXT:      "5.0 Stars on Google",
  CUSTOMER_COUNT:   "65 Reviews",

  // --- Contact ---
  PHONE:            "01788 298618",
  PHONE_HREF:       "01788298618",
  EMAIL:            "crestadriveways@outlook.com",
  WHATSAPP_NUMBER:  "",
  WHATSAPP_MESSAGE: "Hi, I'd like a free driveway quote please",

  // --- Address (for schema) ---
  ADDRESS_STREET:   "10 Magee Close",
  ADDRESS_CITY:     "Rugby",
  ADDRESS_POSTCODE: "CV22 7DQ",

  // --- Social links ---
  FACEBOOK_URL:     "",
  INSTAGRAM_URL:    "",
  GOOGLE_MAPS_URL:  "",

  // --- Web3Forms ---
  WEB3FORMS_KEY:    "YOUR_WEB3FORMS_KEY",

  // --- Services ---
  SERVICES: [
    {
      name: "Tarmac Driveways",
      description: "Durable, low-maintenance tarmac driveways laid to a professional standard. Great for large areas and built to last for decades."
    },
    {
      name: "Block Paving",
      description: "Classic and contemporary block paving in a range of colours and patterns. Fully edged with a compacted sub-base that won't sink."
    },
    {
      name: "Resin Bound Driveways",
      description: "SuDS-compliant resin driveways in natural aggregate finishes. Smooth, weed-resistant, and planning-permission friendly."
    },
    {
      name: "Patios & Landscaping",
      description: "Natural stone, porcelain, and paving for patios, paths, and garden areas — designed and laid by our own team."
    },
    {
      name: "Natural Stone",
      description: "Premium natural stone installations for driveways and patios. Timeless kerb appeal that adds real value to your property."
    },
  ],

  // --- Opening hours ---
  HOURS: [
    { day: "Monday – Sunday", hours: "8:00am – 6:00pm" },
  ],

  // --- Schema hours (24h) ---
  OPENS_WEEKDAY:  "08:00",
  CLOSES_WEEKDAY: "18:00",
  OPENS_SAT:      "08:00",
  CLOSES_SAT:     "18:00",

  // --- Testimonials ---
  TESTIMONIALS: [
    {
      name: "Local Customer",
      location: "Rugby",
      stars: 5,
      text: "Fantastic standard achieved by this pleasant and hardworking team. Nathan and Isaac explained all aspects of work in progress. Fantastic end result at a very competitive cost."
    },
    {
      name: "Verified Google Review",
      location: "Rugby",
      stars: 5,
      text: "New block paving installed — very hard workers indeed. Would highly recommend."
    },
    {
      name: "Verified Google Review",
      location: "Rugby",
      stars: 5,
      text: "For a job of this nature, Nathan and the team ensured the area was kept mess free with minimal disruption. 100% would recommend to anyone looking for driveway installation."
    },
  ],

  // --- Gallery ---
  GALLERY: [],

  // --- FAQs ---
  FAQS: [
    {
      q: "Do you use subcontractors?",
      a: "No — every job is handled by our own team from design through to completion. You deal with us throughout, and we take full responsibility for the finished result."
    },
    {
      q: "Do you require a deposit?",
      a: "No deposits and no binding contracts. We believe the quality of our work speaks for itself — you pay on completion once you're happy."
    },
    {
      q: "What areas do you cover?",
      a: "We're based in Rugby and cover the town and all surrounding villages across Warwickshire. Get in touch to confirm we cover your postcode."
    },
    {
      q: "How long does a driveway take to install?",
      a: "Most residential driveways take 2–4 days depending on size, material, and access. We'll give you a clear timeframe at the quoting stage."
    },
    {
      q: "Do I need planning permission for a new driveway?",
      a: "Generally no — permeable surfaces like resin bound don't require planning permission. We'll advise you at the quoting stage and let you know if your situation is different."
    },
    {
      q: "How do I get a quote?",
      a: "Call us on 01788 298618 or fill in the contact form and we'll arrange a free visit. We'll measure up, talk through your options, and give you a written quote with no obligation."
    },
  ],

  // --- About ---
  ABOUT_TEXT: "Rugby Driveways & Patios is a local, owner-operated driveway company serving Rugby and the surrounding villages. We specialise in tarmac, block paving, resin bound, and natural stone driveways and patios — all installed by our own skilled team, never subcontracted. We don't ask for deposits and we don't tie you into contracts. We just do quality work and let it speak for itself.",

  // --- Meta SEO ---
  META_TITLE:       "Rugby Driveways & Patios | Tarmac, Block Paving & Resin",
  META_DESCRIPTION: "Local driveway specialists covering Rugby and surrounding villages. Tarmac, block paving, resin bound, and natural stone. No deposits. Free quotes.",

  // --- Tier / feature flags ---
  WHATSAPP_ENABLED: false,

  // --- Cloudflare Analytics ---
  CF_ANALYTICS_TOKEN: "",

};

// Do not edit below this line
if (typeof module !== "undefined") module.exports = config;
