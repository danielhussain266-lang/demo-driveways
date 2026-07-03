// ============================================================
// GROUNDWORK STUDIOS — PER-CLIENT CONFIG
// Edit ONLY this file when setting up a new client.
// Run `node build.js` after editing to regenerate dist/.
// ============================================================

const config = {

  // --- Business identity ---
  BUSINESS_NAME:    "Midlands Block Paving",
  TRADE:            "Driveway & Block Paving Specialists",
  TAGLINE:          "Quality Driveways Across Coventry & Warwickshire",
  YEARS_TRADING:    "14",
  SERVICE_AREA:     "Coventry, Kenilworth & Warwickshire",
  DOMAIN:           "demo-driveways.pages.dev",

  // --- Hero ---
  HERO_HEADLINE:    "Transform Your Driveway — Built to Last",
  HERO_SUBHEADLINE: "Expert block paving, resin, and tarmac driveways across Coventry & Warwickshire. Free quotes. No pushy sales.",

  // --- Trust badges ---
  RATING_TEXT:      "5-Star Rated",
  CUSTOMER_COUNT:   "300+ Happy Customers",

  // --- Contact ---
  PHONE:            "024 7700 9123",
  PHONE_HREF:       "02477009123",
  EMAIL:            "info@midlandsblockpaving.co.uk",
  WHATSAPP_NUMBER:  "447477009123",
  WHATSAPP_MESSAGE: "Hi, I'd like a free driveway quote please",

  // --- Address (for schema) ---
  ADDRESS_STREET:   "12 Binley Road",
  ADDRESS_CITY:     "Coventry",
  ADDRESS_POSTCODE: "CV3 1JN",

  // --- Social links ---
  FACEBOOK_URL:     "https://facebook.com/midlandsblockpaving",
  INSTAGRAM_URL:    "https://instagram.com/midlandsblockpaving",
  GOOGLE_MAPS_URL:  "",

  // --- Web3Forms ---
  WEB3FORMS_KEY:    "YOUR_WEB3FORMS_KEY",

  // --- Services ---
  SERVICES: [
    {
      name: "Block Paving",
      description: "Classic and contemporary block paving in a range of colours and patterns. Fully edged, compacted sub-base, guaranteed not to sink."
    },
    {
      name: "Resin Bound Driveways",
      description: "SuDS-compliant resin driveways in natural gravel finishes. Smooth, weed-resistant, and planning-permission friendly."
    },
    {
      name: "Tarmac Driveways",
      description: "Durable tarmac surfacing for driveways and car parks. Fast installation, long-lasting results, great for large areas."
    },
    {
      name: "Patio & Paving",
      description: "Natural stone, porcelain, and concrete paving for patios, paths, and garden areas — laid to last."
    },
    {
      name: "Dropped Kerbs",
      description: "Council-approved dropped kerb applications and installations. We handle the paperwork and the groundwork."
    },
    {
      name: "Driveway Repairs",
      description: "Sunken areas, cracked blocks, drainage issues — we diagnose the cause and fix it properly, not just patch it."
    },
  ],

  // --- Opening hours ---
  HOURS: [
    { day: "Monday – Friday", hours: "7:30am – 6:00pm" },
    { day: "Saturday",        hours: "8:00am – 2:00pm" },
    { day: "Sunday",          hours: "Closed" },
  ],

  // --- Schema hours (24h) ---
  OPENS_WEEKDAY:  "07:30",
  CLOSES_WEEKDAY: "18:00",
  OPENS_SAT:      "08:00",
  CLOSES_SAT:     "14:00",

  // --- Testimonials ---
  TESTIMONIALS: [
    {
      name: "Steve Barlow",
      location: "Kenilworth",
      stars: 5,
      text: "Couldn't be happier with our new block paved driveway. The team were tidy, professional, and finished a day ahead of schedule. Already had three neighbours ask for their number."
    },
    {
      name: "Diane Hussain",
      location: "Coventry",
      stars: 5,
      text: "We had a resin driveway fitted and it looks absolutely stunning. The quote was honest and the price didn't change. Would 100% recommend Midlands Block Paving."
    },
    {
      name: "Paul & Janet Whitmore",
      location: "Leamington Spa",
      stars: 5,
      text: "Had a tarmac driveway and a new patio done at the same time. Brilliant job on both. The lads were respectful of the garden and left everything clean. Top quality work."
    },
    {
      name: "Raj Patel",
      location: "Solihull",
      stars: 5,
      text: "Got three quotes and Midlands Block Paving were the most transparent. No hidden extras. The finished driveway is exactly what we asked for — really pleased."
    },
  ],

  // --- Gallery ---
  GALLERY: [],

  // --- FAQs ---
  FAQS: [
    {
      q: "How long does a block paving driveway take?",
      a: "Most standard driveways take 2–4 days depending on size and access. We'll give you a specific timeframe when we visit for your free quote."
    },
    {
      q: "Do I need planning permission for a new driveway?",
      a: "Generally no — driveways under 5m² or made from permeable materials (like resin bound) don't need permission. We'll advise you at the quoting stage and handle any applications if needed."
    },
    {
      q: "Is resin bound suitable for sloped driveways?",
      a: "Yes, resin bound can be laid on slopes up to around 1:10 gradient. Steeper slopes may need a different surface — we'll assess yours when we visit."
    },
    {
      q: "What's the difference between resin bound and resin bonded?",
      a: "Resin bound mixes the aggregate into the resin before laying — it's SuDS compliant and smooth. Resin bonded sticks loose stone to a surface — it can shed stones over time. We use resin bound as standard."
    },
    {
      q: "How long will a tarmac driveway last?",
      a: "With a proper sub-base and good drainage, a tarmac driveway should last 20–25 years. We use commercial-grade tarmac, not domestic patch mix."
    },
    {
      q: "Do you offer a guarantee on your work?",
      a: "Yes — all our driveways come with a 5-year workmanship guarantee. If anything related to our installation fails within that period, we'll put it right at no cost to you."
    },
  ],

  // --- About ---
  ABOUT_TEXT: "Midlands Block Paving has been laying driveways across Coventry and Warwickshire since 2010. We're a family-run business — no subcontractors, no salespeople, just a skilled team who take pride in every job. We specialise in block paving, resin bound, and tarmac driveways for homeowners who want it done properly the first time. Every project starts with a free, no-obligation visit where we measure up, talk through your options honestly, and give you a fixed written quote — no surprises on the invoice.",

  // --- Meta SEO ---
  META_TITLE:       "Midlands Block Paving | Driveways Coventry & Warwickshire",
  META_DESCRIPTION: "Expert block paving, resin, and tarmac driveways across Coventry, Kenilworth & Warwickshire. Free quotes, 5-year guarantee, 300+ happy customers.",

  // --- Tier / feature flags ---
  WHATSAPP_ENABLED: false,

  // --- Cloudflare Analytics ---
  CF_ANALYTICS_TOKEN: "",

};

// Do not edit below this line
if (typeof module !== "undefined") module.exports = config;
