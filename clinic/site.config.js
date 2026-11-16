// ============================================================
// GROUNDWORK STUDIOS — CLINIC DRAFT CONCEPT
// Draft for Edgbaston Wellness Clinic. Not their live website.
// Treatments and prices live in treatments.json and only show a
// price where the clinic publishes one. Edit here, then run:
//   node build.js clinic     → this site on its own
//   (deployed as its own Cloudflare Pages project, build command: node build.js clinic)
// ============================================================

const config = {

  BUSINESS_NAME: "Edgbaston Wellness Clinic",
  LOGO_ALT:      "Edgbaston Wellness Clinic",
  DOMAIN:        "edgbaston-wellness-demo.pages.dev",

  // Draft ribbon (set to "" on a real client site)
  DEMO_NOTICE: "Draft concept by Groundwork Studios for Edgbaston Wellness Clinic. This is not their live website.",
  STUDIO_URL:  "https://www.instagram.com/groundworkstudios_/",

  // Colour themes. The visitor can switch between them with the toggle.
  DEFAULT_THEME: "navy",
  THEMES: [
    { id: "navy", label: "Navy" },
    { id: "teal", label: "Teal" },
  ],

  // Hero
  HERO_EYEBROW:     "Private medical and aesthetics clinic",
  HERO_HEADLINE:    "Expert care in the heart of Edgbaston",
  HERO_SUBHEADLINE: "Doctors, surgeons and aesthetic practitioners under one roof. Book a consultation online, or ask for a call back.",
  HERO_IMAGE:       "/images/hero.jpg",

  // Contact (real details from their website)
  PHONE:      "0121 454 8633",
  PHONE_HREF: "01214548633",
  EMAIL:      "info@edgbastonwellness.co.uk",
  ADDRESS_LINES: ["11 Greenfield Crescent", "Edgbaston, Birmingham", "B15 3AU"],
  MAP_LAT: 52.47007,
  MAP_LON: -1.92251,

  // WhatsApp: demo uses a reserved sample number, so no real message is sent.
  // Set the clinic's own number (44 + number without the 0) to go live. "" switches it off.
  WHATSAPP_NUMBER: "441632960432",
  WHATSAPP_OPTIONS: [
    { label: "Book a consultation",       hint: "Aesthetic, GP or specialist",
      message: "Hi {name}, I'd like to book a consultation. Could you tell me what is available this week?" },
    { label: "Ask about a treatment",     hint: "Prices, suitability, what to expect",
      message: "Hi {name}, I'd like to ask about [treatment]. Could someone call me back?" },
    { label: "Request a call back",       hint: "We'll phone you",
      message: "Hi {name}, please could someone call me back on [number]? The best time is [time]." },
    { label: "Change or cancel",          hint: "Already booked in",
      message: "Hi {name}, I need to change or cancel my appointment. My name is [name] and it is on [day]." },
    { label: "Something else",            hint: "Any other question",
      message: "Hi {name}, I have a question." },
  ],

  // Email sign-up on the home page. In this draft nothing is sent or stored.
  // To go live, set ACTION to the form address from the clinic's email tool
  // (Mailchimp, Brevo, etc.) and check the field names it expects.
  EMAIL_SIGNUP: {
    EYEBROW: "Stay in touch",
    HEADING: "News and offers from the clinic",
    TEXT: "Leave your email and we'll send occasional updates on treatments, seasonal offers and clinic news. No spam, and you can unsubscribe at any time.",
    CONSENT: "Yes, I'd like to receive emails from Edgbaston Wellness Clinic.",
    ACTION: "",
  },

  // Facts taken from their own website and Cliniko booking page. The clinic should confirm each.
  TRUST: [
    "Established in 2019",
    "Founded by Dr Penumaka and Dr Ganta",
    "Consultations from £25",
    "Rated 4.9/5 on Google",
  ],
  GOOGLE_RATING_NOTE: "Rating as stated on their website: to be confirmed by the clinic.",

  // The live Cliniko booking page, shown inside the Book online page.
  BOOKING_URL: "https://ihealthcare-solutions.uk1.cliniko.com/bookings",
  BOOKING_NOTE: "Demo: this is connected to the clinic's live booking system, so please only book if you are testing.",

  // Consultations as listed on their Cliniko booking page (prices include tax if applicable).
  CONSULTATIONS: [
    { name: "Aesthetic consultation with a doctor",        mins: 30, price: "£50" },
    { name: "Aesthetic consultation with a practitioner",  mins: 20, price: "£25" },
    { name: "Hydrafacial",                                 mins: 30, price: "£105" },
    { name: "Initial IV drip consultation with a doctor",  mins: 30, price: "£50" },
    { name: "Initial IV drip consultation with a practitioner", mins: 30, price: "£25" },
    { name: "GP consultation",                             mins: 15, price: "£85", note: "30 minutes £170, 45 minutes £255" },
    { name: "Iron infusion consultation",                  mins: 30, price: "£99" },
    { name: "Mole, wart and lump removal consultation",    mins: 30, price: "£85" },
    { name: "Private menopause consultation",              mins: 45, price: "£250" },
    { name: "Private urology consultation (face to face)", mins: 15, price: "£250" },
    { name: "Urology telephone consultation",              mins: 15, price: "£50" },
  ],

  // Practitioners listed on their booking page. Photos to come from the clinic.
  TEAM: [
    { name: "Miss Ruby Whitehouse", role: "Senior aesthetic practitioner" },
    { name: "Nikita V",             role: "Healthcare assistant and senior medical aesthetic practitioner" },
    { name: "Miss Mamoonah Khan",   role: "Senior aesthetic practitioner" },
  ],

  // Instagram: official embeds of public posts the clinic chose.
  INSTAGRAM_HANDLE: "edgbastonwellness",
  INSTAGRAM_POSTS: [
    "DQB6_rQCE62",
    "DKKbX_XMfjC",
    "DK4lGQFN2eo",
    "DXueVkPAEa_",
    "DYPnwN7HNM_",
  ],

  // Category cards on the home page (images are placeholders until the clinic sends its own)
  CATEGORY_IMAGES: {
    "iv-therapies":      "/images/cat-iv.jpg",
    "facial-aesthetics": "/images/cat-facial.jpg",
    "body-treatments":   "/images/cat-body.jpg",
    "hair-treatments":   "/images/cat-hair.jpg",
    "womens-health":     "/images/cat-women.jpg",
    "mens-health":       "/images/cat-men.jpg",
    "medical-services":  "/images/cat-medical.jpg",
  },
  CATEGORY_BLURBS: {
    "iv-therapies":      "IV drips, vitamin shots and iron infusions.",
    "facial-aesthetics": "Facials, skin treatments and aesthetic procedures.",
    "body-treatments":   "Body, skin and laser treatments.",
    "hair-treatments":   "Laser hair removal.",
    "womens-health":     "Menopause care, intimate wellness and screening.",
    "mens-health":       "Urology, circumcision and vasectomy.",
    "medical-services":  "GP consultations, vaccination and minor surgery.",
  },

  ABOUT_IMAGE: "/images/about.jpg",
  ABOUT_INTRO: "Established in 2019, Edgbaston Wellness Clinic was founded by Dr Penumaka and Dr Ganta. The clinic combines medical, wellness and aesthetic services under one roof.",
  ABOUT_TEXT: [
    "The clinic's motto is \"Look and feel great for life\". Their team takes a holistic approach, with doctors, surgeons and aesthetic practitioners working together.",
    "This page uses the clinic's own description. Anything clinical, such as qualifications, is for the clinic to supply and approve.",
  ],

  META_TITLE:       "Edgbaston Wellness Clinic | Private Medical and Aesthetics Clinic, Birmingham",
  META_DESCRIPTION: "Private medical and aesthetics clinic in Edgbaston, Birmingham. IV therapies, facial aesthetics, women's and men's health, GP and specialist consultations. Book online.",

};

if (typeof module !== "undefined") module.exports = config;
