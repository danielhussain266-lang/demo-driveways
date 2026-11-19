// ============================================================
// GROUNDWORK STUDIOS — CLINIC DRAFT CONCEPT
// Draft for Authentic Aesthetics (Kenilworth). Not their live website.
// Treatments and prices come from the clinic's own treatment and
// pricing pages (treatments.json). Wording is theirs and needs their
// approval.
//   node build.js clinic authentic-aesthetics   → this site on its own
// ============================================================

const config = {

  BUSINESS_NAME: "Authentic Aesthetics",
  LOGO_ALT:      "Authentic Aesthetics: the best skin of your life",
  DOMAIN:        "authentic-aesthetics-demo.pages.dev",
  CITY:          "Kenilworth",
  POSTCODE:      "CV8 1LY",

  DEMO_NOTICE: "Draft concept by Groundwork Studios for Authentic Aesthetics. This is not their live website.",
  STUDIO_URL:  "https://www.instagram.com/groundworkstudios_/",

  // Their brand: charcoal with a soft pink line (from their logo).
  DEFAULT_THEME: "charcoal",
  THEMES: [{ id: "charcoal", label: "Charcoal" }],
  LOGO_HEIGHT: 62,
  PALETTE: {
    deep: "#2B2A30", mid: "#3D3B45", "mid-dk": "#26252B", tint: "#F6ECF1",
    cream: "#FAF7F5", sand: "#F0E4EA", ink: "#232126", muted: "#645F68",
    gold: "#EFC6DB", "gold-dk": "#A94E7C", border: "#E8DCE2",
  },

  HERO_EYEBROW:     "Skin clinic in Kenilworth",
  HERO_HEADLINE:    "The best skin of your life starts here",
  HERO_SUBHEADLINE: "Our mission is to give you total skin confidence. Results-driven treatments that really work, with clear, upfront pricing and no hard sell.",
  HERO_IMAGE:       "/images/hero.jpg",
  HERO_POSITION:    "50% 55%",

  PHONE:      "01926 935 835",
  PHONE_HREF: "01926935835",
  PHONE_NOTE: "Text or WhatsApp 07954 182611",
  EMAIL:      "",
  ADDRESS_LINES: ["Bank Gallery, 13 High Street", "Kenilworth", "CV8 1LY"],
  MAP_LAT: 52.34968,
  MAP_LON: -1.583333,

  // WhatsApp: demo uses a reserved sample number, so no real message is sent.
  WHATSAPP_NUMBER: "441632960432",
  WHATSAPP_OPTIONS: [
    { label: "Book a consultation",       hint: "Skincare consultation with skin analysis",
      message: "Hi {name}, I'd like to book a skincare consultation. What do you have free this week?" },
    { label: "Ask about a treatment",     hint: "Prices, suitability, what to expect",
      message: "Hi {name}, I'd like to ask about [treatment]. Could someone get back to me?" },
    { label: "Ask about a course",        hint: "Packages and payment plans",
      message: "Hi {name}, could you tell me about course packages and payment plans for [treatment]?" },
    { label: "Change or cancel",          hint: "Already booked in",
      message: "Hi {name}, I need to change or cancel my appointment. My name is [name] and it is on [day]." },
    { label: "Something else",            hint: "Any other question",
      message: "Hi {name}, I have a question." },
  ],

  // Figures. The clinic should confirm each one.
  TRUST: [
    { value: "20+ years",  label: "Combined industry experience" },
    { value: "{count}",    label: "Treatments across six areas" },
    { value: "5.0/5",      label: "Google rating, 213 reviews" },
  ],

  // Their own booking page (Timely), shown inside the Book online page.
  BOOKING_URL:  "https://authenticaesthetics.gettimely.com/#services",
  BOOKING_NOTE: "Demo: this is connected to the clinic's live booking system, so please only book if you are testing.",

  TEXT: {
    HERO_CTA: "Book a consultation",
    CATS_HEADING: "Treatments and prices",
    CATS_SUB: "Six areas of skin care, each with clear pricing. Choose one to see what is involved and what it costs.",
    BOOK_EYEBROW: "Booking, made simple",
    BOOK_HEADING: "Everything in one place",
    BOOK_LEAD: "Start with a skincare consultation and skin analysis. Pick a time that suits you, and book without leaving this site.",
    BOOK_STEPS: [
      ["Choose a consultation", "A full skin analysis, with no hard sell."],
      ["Pick a time", "Open six days a week, with late evenings."],
      ["Get your plan", "A customised plan to suit your budget and skin goals."],
    ],
    PRICE_PANEL_TITLE: "Popular treatments",
    PRICE_PANEL_LINK: "See every treatment",
    ABOUT_EYEBROW: "About the clinic",
    ABOUT_HEADING: "Total skin confidence",
    ABOUT_IMG_ALT: "Bank Gallery on Kenilworth High Street, home of Authentic Aesthetics",
    ABOUT_SECTION_HEADING: "The clinic",
    VISIT_HEADING: "On Kenilworth High Street",
    TEAM_SUB: "From the clinic's About page. Photos to come.",
    BOOK_HERO_TEXT: "Choose a consultation and a time that suits you. Your booking is made with the clinic directly.",
    BOOK_PRICES_NOTE: "Prices as listed on the clinic's pricing pages.",
    TRUST_LABEL: "About the clinic",
    PRICES_FOOT: "Prices as listed on the clinic's pricing pages. Course packages and interest-free payment plans are available.",
  },

  // Popular treatments, taken from the clinic's pricing pages.
  CONSULTATIONS: [
    { name: "Skincare consultation, with skin analysis", mins: 0, price: "£25" },
    { name: "Express HydraFacial",                       mins: 30, price: "£99" },
    { name: "Skin Health for Life HydraFacial",          mins: 0, price: "£140" },
    { name: "Microneedling, single session",             mins: 0, price: "£220" },
    { name: "Blemiderm peel",                            mins: 0, price: "£175" },
    { name: "Perfect Peel Superblend",                   mins: 0, price: "£175" },
    { name: "Mole mapping, single mole",                 mins: 0, price: "£50" },
    { name: "HydraTite full face",                       mins: 0, price: "£225" },
  ],

  HOURS: [
    ["Monday",    "10am to 8pm"],
    ["Tuesday",   "10am to 8pm"],
    ["Wednesday", "9am to 8pm"],
    ["Thursday",  "10am to 8pm"],
    ["Friday",    "9am to 8pm"],
    ["Saturday",  "10am to 4pm"],
  ],

  TEAM: [
    { name: "Zoe Myers",    role: "Owner and Director" },
    { name: "Carla Corbett", role: "Lead Aesthetician" },
    { name: "Emily Taylor", role: "Aesthetician" },
  ],

  INSTAGRAM_HANDLE: "authentic_aesthetics_clinic",
  INSTAGRAM_POSTS: [],

  // Awards shown on the clinic's own website.
  ASSURANCE: {
    EYEBROW: "Award winning",
    HEADING: "A skin clinic you can",
    HEADING_EM: "trust",
    TEXT: "Authentic Aesthetics is a winner at the Aesthetic Medicine Awards 2025, and received the 2026 Award of Excellence as Kenilworth's Skincare Clinic of the Year. At your consultation we assess your skin with a skin analysis machine, explain your options, and never recommend something you don't need.",
    LOGO_HEIGHT: 120,
    LOGOS: [
      { src: "/images/award-am.png",  alt: "Aesthetic Medicine Awards 2025 winner" },
      { src: "/images/award-e2.jpg",  alt: "Award of Excellence 2026: Kenilworth's Skincare Clinic of the Year" },
    ],
  },

  CATEGORY_IMAGES: {
    "consultations": "/images/cat-consultations.jpg",
    "facials":       "/images/cat-facials.jpg",
    "peels":         "/images/cat-peels.jpg",
    "rejuvenation":  "/images/cat-rejuvenation.jpg",
    "blemish":       "/images/cat-blemish.jpg",
    "skincare":      "/images/cat-skincare.jpg",
  },
  CATEGORY_BLURBS: {
    "consultations": "Skincare consultation with skin analysis, and mole mapping.",
    "facials":       "HydraFacial, dermaplaning and LED light therapy.",
    "peels":         "Peels for acne, pigmentation and ageing skin, and Cosmelan.",
    "rejuvenation":  "Microneedling, plasma, HydraTite and FaceSTIM.",
    "blemish":       "Advanced electrolysis for skin blemishes.",
    "skincare":      "Alumier, Mesoestetic and ZO Skin Health.",
  },

  ABOUT_IMAGE: "/images/about.jpg",
  ABOUT_INTRO: "Our mission is to give you total skin confidence so that you can be your authentic self. We believe that everyone has the right to feel great in their own skin and not have to cover it up with make up.",
  ABOUT_TEXT: [
    "With over 20 years combined industry experience, the clinic offers a professional service in a relaxed, friendly atmosphere. At your consultation they assess your skin using a skin analysis machine, discuss your treatment options, and explain the recommendations so you can have complete confidence.",
    "Should you choose to go ahead, they design a customised plan to suit your budget and skin goals, with interest-free payment plans available.",
  ],

  EMAIL_SIGNUP: {
    EYEBROW: "Stay in touch",
    HEADING: "Skin tips and news",
    TEXT: "Leave your email and we'll send occasional skin advice, offers and clinic news. No spam, and you can unsubscribe at any time.",
    CONSENT: "Yes, I'd like to receive emails from Authentic Aesthetics.",
    ACTION: "",
  },

  META_TITLE:       "Authentic Aesthetics | Skin Clinic in Kenilworth",
  META_DESCRIPTION: "Skin clinic on Kenilworth High Street. HydraFacial, peels, microneedling, plasma and more, with clear pricing and no hard sell. Book online.",

};

if (typeof module !== "undefined") module.exports = config;
