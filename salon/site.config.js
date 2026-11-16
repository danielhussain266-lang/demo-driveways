// ============================================================
// GROUNDWORK STUDIOS — SALON DEMO CONFIG
// Fictional salon, sample content. Edit this file to turn the
// demo into a mock-up for a real salon, then run the build:
//   node build.js          → driveways site + salon at /salon/
//   node build.js salon    → salon site on its own (own domain)
// ============================================================

const config = {

  // --- Business identity ---
  BUSINESS_NAME: "Wren & Willow Hair and Beauty",
  LOGO_NAME:     "Wren & Willow",
  LOGO_TAG:      "Hair · Beauty",
  AREA:          "Earlsdon, Coventry",
  DOMAIN:        "demo-salons.pages.dev",

  // --- Demo ribbon (set to "" to remove on a real client site) ---
  DEMO_NOTICE: "Demo website by Groundwork Studios. Sample content: this salon is not real.",
  STUDIO_URL:  "https://groundworkstudios.co.uk",
  DEMO_LINK_URL: "https://www.instagram.com/groundworkstudios_/",

  // --- Hero ---
  HERO_EYEBROW:     "Hair · Colour · Beauty in Earlsdon",
  HERO_HEADLINE:    "Great hair, booked in under a minute",
  HERO_SUBHEADLINE: "Cuts, colour, nails, brows and bridal styling from a small team who take their time. Pick a slot online, day or night.",
  HERO_IMAGE:       "/images/hero.jpg",

  // --- Trust row ---
  RATING_SCORE: "4.9",
  RATING_COUNT: "212",
  TRUST_CHIPS:  ["Free colour consultations", "Book online 24/7", "Free cancellation up to 24 hours"],

  // --- Contact (Ofcom reserved drama numbers: they never connect) ---
  PHONE:      "01632 960 432",
  PHONE_HREF: "01632960432",
  EMAIL:      "hello@wrenandwillow.example",
  INSTAGRAM_HANDLE: "wrenandwillowhair",

  // --- WhatsApp: international format, digits only (44 + number without the 0).
  // Leave WHATSAPP_NUMBER as "" to switch the button off.
  // The demo number is a reserved sample: it never reaches a real phone.
  WHATSAPP_NUMBER: "441632960432",
  WHATSAPP_OPTIONS: [
    { label: "Book an appointment",         hint: "See what's free this week",
      message: "Hi {name}, I'd like to book an appointment. Could you tell me what you have free this week?" },
    { label: "Ask about prices",            hint: "Cuts, colour, nails, brows",
      message: "Hi {name}, could you tell me the price for [service]? I'd like to know roughly how long it takes too." },
    { label: "Colour consultation",         hint: "Free chat and patch test",
      message: "Hi {name}, I'd like to arrange a free colour consultation and patch test. What day would suit?" },
    { label: "Bridal or occasion enquiry",  hint: "Weddings, proms, events",
      message: "Hi {name}, I'm enquiring about hair and make-up for an occasion. The date is [date] and there are [number] of us." },
    { label: "Change or cancel",            hint: "Already booked in",
      message: "Hi {name}, I need to change or cancel my appointment. My name is [name] and it's on [day]." },
    { label: "Something else",              hint: "Any other question",
      message: "Hi {name}, I have a question." },
  ],

  ADDRESS_STREET:   "12 Sample Street",
  ADDRESS_AREA:     "Earlsdon",
  ADDRESS_CITY:     "Coventry",
  ADDRESS_POSTCODE: "CV5 6XX",
  MAP_LAT: 52.4004,
  MAP_LON: -1.5309,

  // --- Opening hours. day: 0 = Sunday … 6 = Saturday. open/close as "HH:MM", or closed: true ---
  HOURS: [
    { day: 1, label: "Monday",    closed: true },
    { day: 2, label: "Tuesday",   open: "09:00", close: "18:00" },
    { day: 3, label: "Wednesday", open: "09:00", close: "18:00" },
    { day: 4, label: "Thursday",  open: "10:00", close: "20:00" },
    { day: 5, label: "Friday",    open: "09:00", close: "18:00" },
    { day: 6, label: "Saturday",  open: "08:30", close: "16:30" },
    { day: 0, label: "Sunday",    closed: true },
  ],

  // --- Services and prices. mins = appointment length. from: true shows "from £x" ---
  CATEGORIES: [
    {
      id: "cut", name: "Cut & Style", image: "/images/svc-cut.jpg",
      blurb: "Precision cuts and blow-dries, finished the way you'd actually wear it.",
      services: [
        { id: "cut-finish",   name: "Cut & finish",            mins: 60,  price: 42 },
        { id: "restyle",      name: "Restyle",                 mins: 75,  price: 52, note: "A bigger change, with a proper consultation first" },
        { id: "blowdry",      name: "Blow-dry",                mins: 40,  price: 26 },
        { id: "curly",        name: "Curly cut",               mins: 75,  price: 55 },
        { id: "gents",        name: "Gents cut",               mins: 30,  price: 22 },
        { id: "child",        name: "Children's cut (under 12)", mins: 30, price: 16 },
      ],
    },
    {
      id: "colour", name: "Colour", image: "/images/svc-colour.jpg",
      blurb: "Lived-in balayage, bright blondes and glossy all-over colour.",
      note: "New to colour with us? We need a quick patch test 48 hours before. It's free and takes two minutes.",
      services: [
        { id: "root",       name: "Root colour",               mins: 75,  price: 48 },
        { id: "full-col",   name: "Full head colour",          mins: 105, price: 68, from: true },
        { id: "half-foils", name: "Half head highlights",      mins: 120, price: 78, from: true },
        { id: "full-foils", name: "Full head highlights",      mins: 150, price: 98, from: true },
        { id: "balayage",   name: "Balayage",                  mins: 180, price: 125, from: true, note: "Includes toner and blow-dry" },
        { id: "toner",      name: "Toner & gloss",             mins: 45,  price: 30 },
        { id: "consult",    name: "Colour consultation",       mins: 15,  price: 0 },
      ],
    },
    {
      id: "nails", name: "Nails", image: "/images/svc-nails.jpg",
      blurb: "Gel manicures and builder gel that last, in a properly clean set-up.",
      services: [
        { id: "gel-mani",  name: "Gel manicure",               mins: 45, price: 30 },
        { id: "biab",      name: "Builder gel (BIAB)",         mins: 60, price: 38 },
        { id: "gel-pedi",  name: "Gel pedicure",               mins: 50, price: 34 },
        { id: "removal",   name: "Soak-off & tidy",            mins: 30, price: 15 },
      ],
    },
    {
      id: "brows", name: "Brows & Lashes", image: "/images/svc-brows.jpg",
      blurb: "Shaping, tinting and lifts that open up your whole face.",
      note: "Tints and lifts need a patch test 48 hours before your first appointment.",
      services: [
        { id: "brow-shape", name: "Brow shape (wax or thread)", mins: 15, price: 12 },
        { id: "brow-tint",  name: "Brow shape & tint",          mins: 30, price: 20 },
        { id: "brow-lam",   name: "Brow lamination",            mins: 45, price: 38 },
        { id: "lash-lift",  name: "Lash lift & tint",           mins: 60, price: 42 },
      ],
    },
    {
      id: "bridal", name: "Bridal & Occasion", image: "/images/svc-makeup.jpg",
      blurb: "Hair and make-up for the big days, with a trial so there are no surprises.",
      services: [
        { id: "occasion-hair", name: "Occasion hair-up",        mins: 60,  price: 48 },
        { id: "occasion-mua",  name: "Occasion make-up",        mins: 60,  price: 50 },
        { id: "bridal-trial",  name: "Bridal trial (hair & make-up)", mins: 120, price: 95 },
        { id: "bridal-chat",   name: "Wedding morning enquiry", mins: 15,  price: 0, note: "A short call to talk through your date and party size" },
      ],
    },
  ],

  // --- Team. does: category ids each person takes bookings for ---
  TEAM: [
    { id: "amelia", name: "Amelia", role: "Owner & colour specialist", does: ["cut", "colour", "bridal"],
      bio: "Fifteen years behind the chair. Balayage and blondes are her thing." },
    { id: "priya",  name: "Priya",  role: "Senior stylist",            does: ["cut", "colour", "bridal"],
      bio: "Curly-hair specialist and the calmest person you'll meet on a wedding morning." },
    { id: "jess",   name: "Jess",   role: "Stylist",                   does: ["cut", "colour"],
      bio: "Sharp bobs, soft layers and a very good head massage." },
    { id: "kayla",  name: "Kayla",  role: "Nails, brows & make-up",    does: ["nails", "brows", "bridal"],
      bio: "Neat, long-lasting gels and brows that actually suit your face." },
  ],

  // --- Sample reviews (replace with the salon's real Google reviews) ---
  REVIEWS: [
    { name: "Hannah R.", service: "Balayage",        text: "Best colour I've had in years. Amelia listened, told me honestly what would suit me, and it has grown out beautifully." },
    { name: "Simran K.", service: "Bridal hair",     text: "Priya did hair for me and four bridesmaids and kept everyone calm. Booking the trial online took about a minute." },
    { name: "Laura M.",  service: "Gel manicure",    text: "Three weeks and not a single chip. I love that I can book at 11pm when I finally remember." },
    { name: "Dee A.",    service: "Curly cut",       text: "First time anyone has cut my curls properly. I've already booked my next one before I left." },
    { name: "Megan T.",  service: "Cut & finish",    text: "Friendly, on time and exactly what I asked for. The reminder text the day before is a nice touch." },
    { name: "Aisha B.",  service: "Brow lamination", text: "Kayla is brilliant. Quick patch test, clear aftercare and my brows have never looked better." },
  ],

  // --- Gallery ---
  GALLERY: [
    { src: "/images/g1.jpg", alt: "Soft waves on long brunette hair, seen from behind",  tall: true },
    { src: "/images/g4.jpg", alt: "Lash treatment being applied in the salon" },
    { src: "/images/g2.jpg", alt: "Highlights being applied with foils",                  tall: true },
    { src: "/images/g5.jpg", alt: "Bright pink colour being painted onto blonde hair" },
    { src: "/images/g3.jpg", alt: "Blow-dry with a round brush",                          tall: true },
    { src: "/images/g9.jpg", alt: "Inside the salon: styling chairs and mirrors" },
    { src: "/images/g6.jpg", alt: "Smiling client with her hair pinned mid-style",        tall: true },
    { src: "/images/g7.jpg", alt: "Close-up of a precision cut with scissors and comb",   tall: true },
    { src: "/images/g8.jpg", alt: "Stylist blow-drying long blonde hair",                 tall: true },
  ],

  // --- About ---
  ABOUT_IMAGE: "/images/about.jpg",
  ABOUT_INTRO: "Wren & Willow is a small, independent salon in the heart of Earlsdon. Four of us, one room, no rushing.",
  ABOUT_TEXT: [
    "We opened because we wanted a salon where appointments run to time, the consultation is a real conversation, and nobody leaves with a colour they didn't ask for.",
    "Everything can be booked online in about a minute, at any time of day. You pick who you see and when, and we send a reminder the day before.",
  ],
  PROMISES: [
    { title: "A proper consultation", text: "Every colour starts with a free chat about what will suit you and what it takes to keep up." },
    { title: "Prices before you sit down", text: "Our full price list is on this site. If your hair needs more, we tell you first." },
    { title: "Book any time", text: "Online booking is open day and night. No waiting for us to pick up the phone." },
  ],

  // --- FAQs ---
  FAQS: [
    { q: "Do I need a patch test?", a: "Yes, for your first colour, tint or lash lift with us, 48 hours before. It's free and takes two minutes. Just pop in." },
    { q: "Can I change or cancel my appointment?", a: "Of course. It's free up to 24 hours before. After that we may ask for a deposit on your next booking." },
    { q: "Do you take a deposit?", a: "Only for colour appointments over two hours and bridal bookings. We'll tell you when we confirm." },
    { q: "I'm not sure what to book. What should I do?", a: "Book a free colour consultation, or leave a note with your booking. We'll text you to make sure the right time is set aside." },
  ],

  // --- Meta ---
  META_TITLE:       "Wren & Willow Hair and Beauty | Earlsdon, Coventry",
  META_DESCRIPTION: "Independent hair and beauty salon in Earlsdon, Coventry. Cuts, colour, nails, brows and bridal styling. Book online in under a minute.",

};

if (typeof module !== "undefined") module.exports = config;
