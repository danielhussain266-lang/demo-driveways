// ============================================================
// GROUNDWORK STUDIOS — CLINIC DRAFT CONCEPT
// Draft for Midland Skin (Birmingham). Not their live website.
// Treatments and prices come from the clinic's own fees page
// (treatments.json). Wording is theirs and needs their approval.
//   node build.js clinic midland-skin   → this site on its own
// ============================================================

const config = {

  BUSINESS_NAME: "Midland Skin",
  LOGO_ALT:      "Midland Skin",
  DOMAIN:        "midland-skin-demo.pages.dev",
  CITY:          "Birmingham",
  POSTCODE:      "B15 3HE",

  DEMO_NOTICE: "Draft concept by Groundwork Studios for Midland Skin. This is not their live website.",
  STUDIO_URL:  "https://www.instagram.com/groundworkstudios_/",

  // Their brand: navy, gold and cream (taken from their website).
  DEFAULT_THEME: "navy",
  THEMES: [{ id: "navy", label: "Navy" }],
  PALETTE: {
    deep: "#0F2D4D", mid: "#123659", "mid-dk": "#0C2740", tint: "#E8EDF3",
    cream: "#F4F1EA", sand: "#E8E2D5", ink: "#040C14", muted: "#58616B",
    gold: "#A78854", "gold-dk": "#8A6F3E", border: "#DDD6C8",
  },

  HERO_EYEBROW:     "Private dermatology and skin surgery",
  HERO_HEADLINE:    "Consultant-led skin care in Birmingham",
  HERO_SUBHEADLINE: "Expert, consultant led care in dermatology, skin surgery, eyelid surgery, lasers and aesthetics. Fees are published, so you know the cost before you book.",
  HERO_IMAGE:       "/images/hero.jpg",
  HERO_POSITION:    "50% 22%",

  PHONE:      "0121 285 4540",
  PHONE_HREF: "01212854540",
  PHONE_NOTE: "Mon to Fri, 9am to 5pm",
  EMAIL:      "",
  ADDRESS_LINES: ["38 Harborne Road", "Birmingham", "B15 3HE"],
  MAP_LAT: 52.469598,
  MAP_LON: -1.927025,

  WHATSAPP_NUMBER: "",
  WHATSAPP_OPTIONS: [],

  // Figures. The clinic should confirm each one.
  TRUST: [
    { value: "2011",    label: "Established" },
    { value: "{count}", label: "Treatments with published fees" },
    { value: "4.9/5",   label: "Google rating, 370 reviews" },
  ],

  // The clinic takes appointments by phone and a request form, so the demo
  // shows a request form here rather than a booking widget.
  BOOKING_MODE: "request",
  BOOKING_URL:  "https://www.midlandskin.co.uk/contact-us/",
  BOOKING_NOTE: "",

  TEXT: {
    HERO_CTA: "Request an appointment",
    NAV_BOOK: "Appointments",
    CTA_TEXT: "Request an appointment and talk it through with the team, or ask for a call back.",
    CATS_HEADING: "Treatments and procedures",
    CATS_SUB: "Eight areas of care, led by consultants. Choose one to see what is involved and what it costs.",
    BOOK_EYEBROW: "How booking works",
    BOOK_HEADING: "Clear fees, clear steps",
    BOOK_LEAD: "Every treatment starts with an initial assessment. Choose the appointment that suits your concern, and you will know the cost before you book.",
    BOOK_STEPS: [
      ["Choose your initial assessment", "Pick the appointment that matches your concern."],
      ["Book and prepay", "All appointments are prepaid."],
      ["Meet your specialist", "A care plan sets out any treatment and its fees."],
    ],
    PRICE_PANEL_TITLE: "Initial assessment fees",
    PRICE_PANEL_LINK: "See all fees",
    ABOUT_EYEBROW: "About Midland Skin",
    ABOUT_HEADING: "Consultant-led care",
    ABOUT_IMG_ALT: "A consultant talking with a patient",
    ABOUT_SECTION_HEADING: "The clinic",
    VISIT_HEADING: "On Harborne Road",
    TEAM_SUB: "From the clinic's team page. Photos and full profiles to come.",
    BOOK_HERO_TEXT: "Tell us what you need and the team will confirm the right appointment. Or call the clinic.",
    BOOK_PRICES_NOTE: "Fees as published on the clinic's fees page. Prices are indicative and confirmed at your initial assessment.",
    TRUST_LABEL: "About the clinic",
    PRICES_FOOT: "Prices are indicative and confirmed at your initial assessment. All appointments and treatments are prepaid.",
    REQUEST_HEADING: "Request an appointment",
    REQUEST_TEXT: "Tell us which appointment you need and the team will be in touch to confirm. Not sure? Choose the last option and we will advise.",
  },

  // Initial assessment fees as listed on the clinic's fees page.
  CONSULTATIONS: [
    { name: "Initial dermatology assessment",                 mins: 25, price: "£275" },
    { name: "Initial extended dermatology assessment",        mins: 35, price: "£350" },
    { name: "Initial acne assessment",                        mins: 25, price: "£275" },
    { name: "Initial acne scar assessment",                   mins: 25, price: "£275" },
    { name: "Initial scar assessment",                        mins: 25, price: "£275 to £350" },
    { name: "Initial mole check / skin lesion assessment",    mins: 25, price: "£275" },
    { name: "Full body mole check",                           mins: 25, price: "£275" },
    { name: "Initial skin surgery assessment",                mins: 25, price: "£275" },
    { name: "Initial hair loss and scalp assessment",         mins: 25, price: "£350" },
    { name: "Initial laser assessment",                       mins: 25, price: "£275" },
    { name: "Initial Sofwave assessment",                     mins: 25, price: "£50" },
    { name: "Initial aesthetic assessment",                   mins: 25, price: "£275" },
    { name: "Initial oculoplastic assessment",                mins: 0,  price: "£275" },
    { name: "Children's initial dermatology assessment (0 to 11)", mins: 35, price: "£350" },
  ],

  TEAM: [
    { name: "Dr Sajjad Rajpar",        role: "Medical Director and Consultant Dermatologist" },
    { name: "Dr Tanveer Chohan",       role: "Consultant Adult and Paediatric Dermatologist" },
    { name: "Dr Eanas Bader",          role: "Consultant Dermatologist and Skin Surgeon" },
    { name: "Dr Agustin Martin-Clavijo", role: "Consultant Dermatologist and Skin Surgeon" },
    { name: "Dr Adzura Azam",          role: "Consultant Adult and Paediatric Dermatologist" },
    { name: "Dr Farah Mahmood",        role: "Consultant Dermatologist" },
    { name: "Miss Reena Kumari",       role: "Consultant Ophthalmologist and Oculoplastic Surgeon" },
    { name: "Mr Ross Elledge",         role: "Consultant Oral and Maxillofacial Surgeon" },
    { name: "Miss Maria Athanasiadou", role: "Consultant Plastic Surgeon" },
    { name: "Miss Federica D’Asta",    role: "Consultant Burns and Laser Surgeon" },
    { name: "Professor Alok Tiwari",   role: "Consultant Surgeon" },
    { name: "Dr Faisal Baig",          role: "Consultant Anaesthetist and Sedationist" },
  ],

  INSTAGRAM_HANDLE: "midland.skin",
  INSTAGRAM_POSTS: [],

  CATEGORY_IMAGES: {
    "consultations": "/images/cat-consultations.jpg",
    "acne-scars":    "/images/cat-acne-scars.jpg",
    "skin-lesions":  "/images/cat-skin-lesions.jpg",
    "skin-cancer":   "/images/cat-skin-cancer.jpg",
    "hair-loss":     "/images/cat-hair-loss.jpg",
    "lasers":        "/images/cat-lasers.jpg",
    "aesthetics":    "/images/cat-aesthetics.jpg",
    "eyelids":       "/images/cat-eyelids.jpg",
  },
  CATEGORY_BLURBS: {
    "consultations": "Initial assessments, review consultations and tests.",
    "acne-scars":    "Acne treatments, the AviClear laser and scar management.",
    "skin-lesions":  "Moles, cysts, lipomas, skin tags, warts and earlobe repair.",
    "skin-cancer":   "Biopsy, skin cancer surgery, Mohs surgery and photodynamic therapy.",
    "hair-loss":     "Assessment, injections, PRP and prescription treatments.",
    "lasers":        "Laser resurfacing, redness, pigmentation and melasma.",
    "aesthetics":    "Sofwave, wrinkle-relaxing injections, fillers and sweating treatment.",
    "eyelids":       "Eyelid lesions, blepharoplasty, ptosis and oculoplastic surgery.",
  },

  ABOUT_IMAGE: "/images/about.jpg",
  ABOUT_INTRO: "Established in 2011, Midland Skin is a consultant-led private dermatology and oculoplastic clinic in Birmingham, treating the skin, hair, nails and eyelids medically and surgically.",
  ABOUT_TEXT: [
    "Every medical skin, hair, nail or eyelid condition is assessed by a consultant dermatologist or consultant surgeon. Your plan is made after assessment, never before, and reviewed once treatment has started.",
    "From prescriptions to surgery, the clinic brings dermatologists, surgeons, a laser unit and a scar service together, with specialists to refer between when needed. Consultation fees are published, so you know the cost of your first appointment before you book.",
  ],

  EMAIL_SIGNUP: {
    EYEBROW: "Stay in touch",
    HEADING: "News from the clinic",
    TEXT: "Leave your email and we'll send occasional updates on treatments and clinic news. No spam, and you can unsubscribe at any time.",
    CONSENT: "Yes, I'd like to receive emails from Midland Skin.",
    ACTION: "",
  },

  META_TITLE:       "Midland Skin | Consultant-led Dermatology and Skin Surgery, Birmingham",
  META_DESCRIPTION: "Consultant-led private dermatology, skin surgery, lasers and eyelid surgery on Harborne Road, Birmingham. Published fees. Request an appointment.",

};

if (typeof module !== "undefined") module.exports = config;
