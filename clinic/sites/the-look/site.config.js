// ============================================================
// GROUNDWORK STUDIOS — CLINIC DRAFT CONCEPT
// Draft for The Look Beauty and Laser Clinic (Wolverhampton).
// Not their live website. Treatments and prices come from the
// salon's own price list (treatments.json). Wording is theirs and
// needs their approval.
//   node build.js clinic the-look   → this site on its own
// ============================================================

const config = {

  BUSINESS_NAME: "The Look Beauty and Laser Clinic",
  LOGO_ALT:      "The Look Professional Beauty Therapy",
  DOMAIN:        "the-look-demo.pages.dev",
  CITY:          "Wolverhampton",
  POSTCODE:      "WV1 3HG",

  DEMO_NOTICE: "Draft concept by Groundwork Studios for The Look Beauty and Laser Clinic. This is not their live website.",
  STUDIO_URL:  "https://www.instagram.com/groundworkstudios_/",

  // Their brand: deep plum and pink. Their logo is white, so it sits on a plum plate.
  DEFAULT_THEME: "plum",
  THEMES: [{ id: "plum", label: "Plum" }],
  LOGO_BG: "#4A1038",
  PALETTE: {
    deep: "#3F0F31", mid: "#7A1E5E", "mid-dk": "#5F1648", tint: "#F6E9F1",
    cream: "#FBF6F4", sand: "#F1E3E8", ink: "#251320", muted: "#6A5560",
    gold: "#E4B4C8", "gold-dk": "#A2406F", border: "#E7D6DD",
  },

  HERO_EYEBROW:     "Laser, beauty and hair",
  HERO_HEADLINE:    "Laser, nails and beauty in Wolverhampton",
  HERO_SUBHEADLINE: "Advanced medical-grade Nd:YAG laser hair removal, plus threading, waxing, facials, nails and hair. Open 7 days a week, including bank holidays.",
  HERO_IMAGE:       "/images/hero.jpg",
  HERO_POSITION:    "60% 22%",

  PHONE:      "07432 218928",
  PHONE_HREF: "07432218928",
  EMAIL:      "The.Look.Laser@gmail.com",
  ADDRESS_LINES: ["Unit 8, Wulfrun / Mander Shopping Centre", "Wolverhampton", "WV1 3HG"],
  MAP_LAT: 52.583445,
  MAP_LON: -2.127554,

  // WhatsApp: demo uses a reserved sample number, so no real message is sent.
  WHATSAPP_NUMBER: "441632960432",
  WHATSAPP_OPTIONS: [
    { label: "Book an appointment",       hint: "Laser, nails, facials, waxing and more",
      message: "Hi {name}, I'd like to book an appointment. What do you have free this week?" },
    { label: "Laser hair removal",        hint: "Areas, prices and what to expect",
      message: "Hi {name}, I'd like to ask about laser hair removal on [area]. Could someone reply with the price and availability?" },
    { label: "Ask about a treatment",     hint: "Prices and what's included",
      message: "Hi {name}, I'd like to ask about [treatment]. Could you tell me more?" },
    { label: "Change or cancel",          hint: "Already booked in",
      message: "Hi {name}, I need to change or cancel my appointment. My name is [name] and it is on [day]." },
    { label: "Something else",            hint: "Any other question",
      message: "Hi {name}, I have a question." },
  ],

  // Figures. The salon should confirm each one.
  TRUST: [
    { value: "7 days",  label: "Open every day, including bank holidays" },
    { value: "{prices}", label: "Individual prices listed" },
    { value: "4.9/5",   label: "Google rating, 1,002 reviews" },
  ],

  // The salon's own booking page, shown inside the Book online page.
  BOOKING_URL:  "https://facesconsent.com/bookings/thelooklaserclinic",
  BOOKING_NOTE: "Demo: this is connected to the salon's live booking system, so please only book if you are testing.",

  TEXT: {
    HERO_CTA: "Book an appointment",
    CTA_TEXT: "Book an appointment and talk it through with the team, or ask for a call back.",
    CATS_HEADING: "Treatments and prices",
    CATS_SUB: "Eight areas of treatment, with every price listed. Choose one to see the full list.",
    BOOK_EYEBROW: "Booking, made simple",
    BOOK_HEADING: "Everything in one place",
    BOOK_LEAD: "Look through the treatments and prices, then book a time. No bouncing between websites.",
    BOOK_STEPS: [
      ["Pick your treatment", "Laser, nails, facials, waxing, hair and more."],
      ["Choose a time", "Open 7 days a week, including bank holidays."],
      ["Come in", "Unit 8, Wulfrun / Mander Shopping Centre."],
    ],
    PRICE_PANEL_TITLE: "Popular treatments",
    PRICE_PANEL_LINK: "See every price",
    ABOUT_EYEBROW: "About the salon",
    ABOUT_HEADING: "A warm, friendly place",
    ABOUT_IMG_ALT: "The Look Laser Clinic shopfront in the Mander Centre, Wolverhampton",
    ABOUT_SECTION_HEADING: "The salon",
    VISIT_HEADING: "In the Mander Centre",
    BOOK_HERO_TEXT: "Choose a treatment and a time that suits you. Your booking is made with the salon directly.",
    BOOK_PRICES_NOTE: "Prices as listed on the salon's price list.",
    TRUST_LABEL: "About the salon",
    PRICES_FOOT: "Prices as listed on the salon's price list.",
  },

  // Popular treatments, taken from the salon's price list.
  CONSULTATIONS: [
    { name: "Eyebrow threading",                   mins: 0, price: "£4" },
    { name: "Laser hair removal: full face",       mins: 0, price: "£40" },
    { name: "Laser hair removal: full legs",       mins: 0, price: "£60" },
    { name: "HydraFacial",                         mins: 0, price: "£80" },
    { name: "Gel polish (lasts 3 weeks)",          mins: 0, price: "£20" },
    { name: "Full body massage",                   mins: 50, price: "£50" },
    { name: "Wet hair cut (straight)",             mins: 0, price: "£16" },
    { name: "Eyelash extensions: trending lashes", mins: 0, price: "£30" },
    { name: "Basic manicure",                      mins: 0, price: "£15" },
    { name: "Full legs wax",                       mins: 0, price: "£20" },
  ],

  TEAM: [],

  INSTAGRAM_HANDLE: "",
  INSTAGRAM_POSTS: [],

  CATEGORY_IMAGES: {
    "laser":            "/images/cat-laser.jpg",
    "threading-waxing": "/images/cat-threading-waxing.jpg",
    "brows-lashes":     "/images/cat-brows-lashes.jpg",
    "facials":          "/images/cat-facials.jpg",
    "massage":          "/images/cat-massage.jpg",
    "nails":            "/images/cat-nails.jpg",
    "hair":             "/images/cat-hair.jpg",
    "piercing-extras":  "/images/cat-piercing-extras.jpg",
  },
  CATEGORY_BLURBS: {
    "laser":            "Medical-grade Nd:YAG laser hair removal, face and body.",
    "threading-waxing": "Eyebrow and face threading, and waxing from head to toe.",
    "brows-lashes":     "HD brows, tinting, lash lifts and eyelash extensions.",
    "facials":          "Classic, electric and HydraFacial treatments.",
    "massage":          "Indian head, back and shoulder, and full body massage.",
    "nails":            "Gel, extensions, manicures, pedicures and toes.",
    "hair":             "Cuts, colour, highlights and conditioning.",
    "piercing-extras":  "Ear and nose piercing, and tooth gems.",
  },

  ABOUT_IMAGE: "/images/about.jpg",
  ABOUT_INTRO: "Located in the Wulfrun / Mander Shopping Centre in Wolverhampton, and open 7 days a week including bank holidays. The Look is a warm, friendly place to have all your laser, nail and beauty needs taken care of by a group of talented professionals.",
  ABOUT_TEXT: [
    "The salon offers an extensive range of beauty, nail and laser hair removal services, using advanced medical-grade Nd:YAG laser machines.",
    "It also provides electric facials, manicures, pedicures, body massage, and hair colour and cutting, using established products.",
  ],

  EMAIL_SIGNUP: {
    EYEBROW: "Stay in touch",
    HEADING: "News and offers",
    TEXT: "Leave your email and we'll send occasional news and offers from the salon. No spam, and you can unsubscribe at any time.",
    CONSENT: "Yes, I'd like to receive emails from The Look Beauty and Laser Clinic.",
    ACTION: "",
  },

  META_TITLE:       "The Look Beauty and Laser Clinic | Laser Hair Removal, Beauty and Nails, Wolverhampton",
  META_DESCRIPTION: "Laser hair removal, threading, waxing, facials, nails and hair in the Mander Centre, Wolverhampton. Every price listed. Open 7 days a week.",

};

if (typeof module !== "undefined") module.exports = config;
