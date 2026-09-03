// ============================================================
// GROUNDWORK STUDIOS — RUGBY DRIVEWAYS & PATIOS CONFIG
// Demo site. Run `node build.js` after editing.
// ============================================================

const config = {

  // --- Business identity ---
  BUSINESS_NAME:    "Rugby Driveways & Patios",
  LOGO_NAME:        "Rugby Driveways",
  TRADE:            "Driveway & Patio Specialists",
  TAGLINE:          "Quality Driveways Across Rugby & Surrounding Villages",
  YEARS_TRADING:    "5",
  SERVICE_AREA:     "Rugby & Surrounding Villages",
  DOMAIN:           "demo-driveways.pages.dev",

  // --- Hero ---
  HERO_HEADLINE:    "Rugby's Trusted Driveway Specialists",
  HERO_SUBHEADLINE: "Tarmac, block paving, resin, and natural stone — installed by our own team, start to finish. No deposits. No subcontractors.",
  HERO_BEFORE_IMAGE: "/images/scenes/hero-before.jpg",
  HERO_AFTER_IMAGE:  "/images/scenes/hero-after.jpg",

  // --- Trust badges ---
  RATING_TEXT:    "Google Rating",
  RATING_SCORE:   "5.0",
  CUSTOMER_COUNT: "65 Reviews",
  TRUST_CHIPS:    ["Fully Insured", "5 Years Experience", "Free Quotes"],

  // --- Announcement bar ---
  ANNOUNCEMENT_BAR: "",

  // --- Contact ---
  PHONE:            "01632 960118",
  PHONE_HREF:       "01632960118",
  EMAIL:            "demo@groundworkstudios.co.uk",
  WHATSAPP_NUMBER:  "447700900118",
  WHATSAPP_MESSAGE: "Hi, I'd like a free driveway quote please",

  // --- Address (for schema) ---
  ADDRESS_STREET:   "1 Demo Lane",
  ADDRESS_CITY:     "Rugby",
  ADDRESS_POSTCODE: "CV21 0AA",

  // --- Social / maps ---
  FACEBOOK_URL:          "",
  INSTAGRAM_URL:         "",
  GOOGLE_MAPS_URL:       "",
  GOOGLE_MAPS_EMBED_URL: "",

  // --- Web3Forms ---
  WEB3FORMS_KEY: "YOUR_WEB3FORMS_KEY",

  // --- Services ---
  SERVICES: [
    {
      name:            "Tarmac Driveways",
      slug:            "tarmac-driveways",
      description:     "Durable, low-maintenance tarmac driveways laid to a professional standard. Great for large areas.",
      longDescription: "Tarmac is one of the most popular driveway surfaces in the UK — and for good reason. It's durable, cost-effective, and requires minimal maintenance. We lay a proper compacted sub-base before the tarmac goes down, ensuring your driveway won't sink or crack prematurely. Whether you need a small single driveway or a large estate entrance, we'll give you a smooth, clean result that lasts for decades. All our tarmac work is carried out by our own team — no subcontractors.",
      image:           "/images/svc-tarmac.jpg",
      heroImage:       "/images/svc-tarmac.jpg",
      faqs: [
        { q: "How long does tarmac take to install?", a: "Most tarmac driveways take 1–2 days for residential properties. You can drive on it within 24–48 hours of completion." },
        { q: "Does tarmac need maintaining?", a: "Very little. We recommend a seal coat every 3–5 years to keep it looking fresh and extend its lifespan. We can advise on this at the quoting stage." },
        { q: "Can you tarmac over an existing driveway?", a: "Often yes, if the existing base is in good condition. We'll assess this during the free site visit and advise accordingly." },
      ],
    },
    {
      name:            "Block Paving",
      slug:            "block-paving",
      description:     "Classic and contemporary block paving in a range of colours and patterns. Built to last.",
      longDescription: "Block paving driveways are a timeless choice that adds real kerb appeal to any property. We offer a wide range of block styles, colours, and laying patterns — from traditional herringbone to contemporary stretcher bond. Every installation starts with a properly excavated and compacted sub-base, ensuring your driveway stays level and stable for years. We also re-sand and compact all joints to prevent weed growth and movement. Your block paving is built to last.",
      image:           "/images/svc-block.jpg",
      heroImage:       "/images/svc-block.jpg",
      faqs: [
        { q: "Can you match existing block paving?", a: "We'll do our best to source a close match. Bring us a sample block and we'll advise on the best available option." },
        { q: "How do I stop weeds growing in block paving?", a: "We use a polymeric jointing sand that resists weed growth. For older driveways, we can re-sand and treat the joints." },
        { q: "Does block paving need planning permission?", a: "Generally no for residential driveways. We'll confirm this at the quoting stage." },
      ],
    },
    {
      name:            "Resin Bound Driveways",
      slug:            "resin-bound",
      description:     "SuDS-compliant resin driveways in natural aggregate finishes. Weed-resistant, smooth, and planning-permission friendly.",
      longDescription: "Resin bound driveways have become increasingly popular in recent years — and it's easy to see why. They're smooth underfoot, visually stunning, and because water drains straight through, they're SuDS-compliant and don't usually require planning permission. We mix natural aggregate with a UV-stable resin on-site and apply it to a prepared base, giving you a seamless, professional finish. Available in a wide range of natural stone colours to complement your home.",
      image:           "/images/svc-resin.jpg",
      heroImage:       "/images/svc-resin.jpg",
      faqs: [
        { q: "Is resin bound the same as resin bonded?", a: "No — resin bound uses loose aggregate mixed with resin, resulting in a smooth, permeable surface. Resin bonded uses loose chips glued to a base coat, which can shed stones over time. We install resin bound only." },
        { q: "How long does resin last?", a: "A properly installed resin bound surface typically lasts 15–25 years. UV-stable resin prevents colour fade." },
        { q: "Does resin need planning permission?", a: "Resin bound is permeable, so it typically doesn't require planning permission for front driveways. We'll confirm at the quoting stage." },
      ],
    },
    {
      name:            "Patios & Landscaping",
      slug:            "patios-landscaping",
      description:     "Natural stone, porcelain, and paving for patios, paths, and garden areas — designed and laid by our own team.",
      longDescription: "A well-designed patio transforms your outdoor space and extends your living area into the garden. We design and lay patios using natural stone, porcelain, and concrete paving in a range of sizes, colours, and finishes. We also install garden paths, steps, edging, and raised planters. Every job is planned carefully to ensure proper drainage and a level, stable surface. From a simple garden makeover to a full outdoor entertaining area, we handle it all.",
      image:           "/images/svc-patio.jpg",
      heroImage:       "/images/svc-patio.jpg",
      faqs: [
        { q: "What materials do you use for patios?", a: "We work with natural sandstone, slate, limestone, porcelain, and concrete paving. We'll recommend the best option for your budget and style at the quoting stage." },
        { q: "Can you build steps and raised planters too?", a: "Yes — we handle the full garden hardscaping project, including steps, edging, raised beds, and retaining walls." },
      ],
    },
    {
      name:            "Natural Stone",
      slug:            "natural-stone",
      description:     "Premium natural stone installations for driveways and patios. Timeless kerb appeal that adds real value.",
      longDescription: "Natural stone driveways and patios are the premium choice for homeowners who want lasting beauty and genuine character. We install sandstone, limestone, slate, and granite for driveways, paths, and patios across Rugby and the surrounding area. Natural stone is durable, ages beautifully, and adds significant value to your property. We source quality material and lay it on a proper compacted base with appropriate drainage to ensure it stays looking superb for years.",
      image:           "/images/svc-stone.jpg",
      heroImage:       "/images/svc-stone.jpg",
      faqs: [
        { q: "How do I maintain natural stone?", a: "A light clean with a patio cleaner once or twice a year keeps it looking great. We recommend sealing after installation to protect against staining." },
        { q: "Is natural stone suitable for driveways?", a: "Yes — certain natural stones like granite and hard limestone are extremely durable and well-suited to vehicle traffic. We'll recommend the right stone for your usage." },
      ],
    },
  ],

  // --- Opening hours ---
  HOURS: [
    { day: "Monday – Sunday", hours: "8:00am – 6:00pm" },
  ],

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

  // --- Portfolio items (10 realistic fictional projects) ---
  PORTFOLIO: [
    {
      title:       "Double Tarmac Driveway",
      location:    "Hillmorton, Rugby",
      category:    "Tarmac Driveways",
      duration:    "2 days",
      priceBand:   "£2,800–£3,400",
      description: "Full excavation and installation of a tarmac double driveway with block paving edging and a new dropped kerb. Clean, low-maintenance finish.",
      beforeImage: "/images/scenes/tarmac1-before.jpg",
      afterImage:  "/images/scenes/tarmac1-after.jpg",
    },
    {
      title:       "Herringbone Block Paving",
      location:    "Brownsover, Rugby",
      category:    "Block Paving",
      duration:    "3 days",
      priceBand:   "£4,200–£5,000",
      description: "Classic herringbone block paving in charcoal and buff. Compacted MOT sub-base, full edging, and polymeric sand jointing to resist weeds.",
      beforeImage: "/images/scenes/block1-before.jpg",
      afterImage:  "/images/scenes/block1-after.jpg",
    },
    {
      title:       "Silver Resin Bound Driveway",
      location:    "Bilton, Rugby",
      category:    "Resin Bound Driveways",
      duration:    "2 days",
      priceBand:   "£3,600–£4,200",
      description: "Bespoke silver and buff aggregate resin bound driveway over a fresh tarmac base. Seamless finish, SuDS-compliant, no planning permission required.",
      beforeImage: "/images/scenes/resin1-before.jpg",
      afterImage:  "/images/scenes/resin1-after.jpg",
    },
    {
      title:       "Natural Sandstone Patio",
      location:    "Dunchurch, Rugby",
      category:    "Patios & Landscaping",
      duration:    "2 days",
      priceBand:   "£1,800–£2,400",
      description: "Indian sandstone patio with reclaimed brick edging and a raised planting border. Full excavation, compacted base, and proper drainage fall.",
      beforeImage: "/images/scenes/patio1-before.jpg",
      afterImage:  "/images/scenes/patio1-after.jpg",
    },
    {
      title:       "Tarmac & Block Kerb Driveway",
      location:    "Newbold, Rugby",
      category:    "Tarmac Driveways",
      duration:    "2 days",
      priceBand:   "£2,200–£2,800",
      description: "Tarmac driveway with contrasting block paving kerbing along both sides. Smart, clean finish that complements a red-brick 1970s semi.",
      beforeImage: "/images/scenes/tarmac2-before.jpg",
      afterImage:  "/images/scenes/tarmac2-after.jpg",
    },
    {
      title:       "Contemporary Block Paving",
      location:    "Long Lawford, Rugby",
      category:    "Block Paving",
      duration:    "4 days",
      priceBand:   "£5,500–£6,500",
      description: "Large contemporary block paving installation in silver-grey stretcher bond. Includes full landscaping around the edges and a new 6-metre dropped kerb.",
      beforeImage: "/images/scenes/block2-before.jpg",
      afterImage:  "/images/scenes/block2-after.jpg",
    },
    {
      title:       "Granite Sett Driveway",
      location:    "Clifton upon Dunsmore, Rugby",
      category:    "Natural Stone",
      duration:    "3 days",
      priceBand:   "£5,000–£6,200",
      description: "Premium natural granite sett driveway with a rumbled finish. Beautifully textured, extremely durable, and a perfect complement to the property's stone façade.",
      beforeImage: "/images/scenes/stone1-before.jpg",
      afterImage:  "/images/scenes/stone1-after.jpg",
    },
    {
      title:       "Porcelain Patio & Steps",
      location:    "Cawston, Rugby",
      category:    "Patios & Landscaping",
      duration:    "3 days",
      priceBand:   "£3,200–£4,000",
      description: "Large-format porcelain patio with matching steps down from the bifold doors. Non-slip finish, low-maintenance, and frost-resistant. Looks stunning year-round.",
      beforeImage: "/images/scenes/patio2-before.jpg",
      afterImage:  "/images/scenes/patio2-after.jpg",
    },
    {
      title:       "Caramel Resin Bound Driveway",
      location:    "Barby, Rugby",
      category:    "Resin Bound Driveways",
      duration:    "2 days",
      priceBand:   "£3,800–£4,400",
      description: "Warm caramel aggregate resin bound surface installed over a prepared concrete base. Smooth, weed-resistant finish with block paving edging for definition.",
      beforeImage: "/images/scenes/resin2-before.jpg",
      afterImage:  "/images/scenes/resin2-after.jpg",
    },
    {
      title:       "Limestone & Tarmac Driveway",
      location:    "Kilsby, Daventry",
      category:    "Natural Stone",
      duration:    "4 days",
      priceBand:   "£6,000–£7,200",
      description: "Sweeping curved driveway featuring natural limestone setts along the entrance and tarmac for the main body. Elegant combination with a contemporary feel.",
      beforeImage: "/images/scenes/stone2-before.jpg",
      afterImage:  "/images/scenes/stone2-after.jpg",
    },
  ],

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
      a: "Call us or fill in the contact form and we'll arrange a free visit. We'll measure up, talk through your options, and give you a written quote with no obligation."
    },
  ],

  // --- About ---
  ABOUT_TEXT: "Rugby Driveways & Patios is a local, owner-operated driveway company serving Rugby and the surrounding villages. We specialise in tarmac, block paving, resin bound, and natural stone driveways and patios — all installed by our own skilled team, never subcontracted. We don't ask for deposits and we don't tie you into contracts. We just do quality work and let it speak for itself.",

  // --- Areas ---
  SERVICE_AREAS: [
    "Rugby", "Hillmorton", "Brownsover", "Bilton", "Dunchurch",
    "Long Lawford", "Newbold", "Clifton upon Dunsmore",
    "Cawston", "Barby", "Kilsby", "Daventry",
  ],

  // --- Portfolio stats ---
  PROJECT_COUNT: "80",

  // --- Meta SEO ---
  META_TITLE:       "Rugby Driveways & Patios | Tarmac, Block Paving & Resin",
  META_DESCRIPTION: "Local driveway specialists covering Rugby and surrounding villages. Tarmac, block paving, resin bound, and natural stone. No deposits. Free quotes.",

  // --- Tier ---
  WHATSAPP_ENABLED: true,

  // --- Cloudflare Analytics ---
  CF_ANALYTICS_TOKEN: "",

  // ==========================================================
  // SHOWCASE LAYER
  // Everything below powers the Groundwork Studios demo build.
  // DEMO_MODE labels invented figures so nothing invented is
  // ever presented to a prospect as a real trading statistic.
  // ==========================================================

  DEMO_MODE: true,

  // --- The Design Menu: what a prospect can pick from ---
  SHOWCASE: [
    { id: "ba-slider",   name: "Before / After Slider",   target: "#ba-teaser",
      blurb: "Drag-to-reveal on every project. The single most persuasive thing a driveway site can do." },
    { id: "quote-calc",  name: "Instant Quote Calculator", target: "#quote-calc",
      blurb: "Surface + area = a live price band. Captures intent before they've even called." },
    { id: "visualiser",  name: "Driveway Visualiser",      target: "#visualiser",
      blurb: "Swap finishes on a real house. Customers spend minutes here, not seconds." },
    { id: "finance",     name: "Finance Calculator",       target: "#finance",
      blurb: "Turns £4,200 into £87/month. Raises average job value without discounting." },
    { id: "whatsapp",    name: "WhatsApp Chat Widget",     target: "#whatsapp-btn",
      blurb: "Answers the five questions everyone asks, then hands over to a real chat." },
    { id: "video",       name: "Video Hero & Reels",       target: "#hero",
      blurb: "Motion in the first frame. Doubles time-on-page against a static image." },
    { id: "social-wall", name: "Live Social Wall",         target: "#social-wall",
      blurb: "Your Instagram feed, on your site, proving you're active and busy." },
    { id: "case-studies",name: "Project Case Studies",     target: "#case-studies",
      blurb: "One page per job: brief, materials, day-by-day, cost. Ranks for long-tail searches." },
    { id: "coverage",    name: "Coverage Map",             target: "#coverage",
      blurb: "Click a village, see the jobs. Answers 'do you cover me?' instantly." },
    { id: "team",        name: "Meet the Team",            target: "/team/",
      blurb: "Faces and names. Homeowners buy from people, especially for work on their home." },
    { id: "blog",        name: "Advice Hub / Blog",        target: "/advice/",
      blurb: "Articles that win Google searches months before anyone asks for a quote." },
    { id: "areas",       name: "Village Landing Pages",    target: "/areas/",
      blurb: "A page per village. This is how local trades outrank national directories." },
    { id: "guarantee",   name: "Guarantee & Accreditations", target: "/guarantee/",
      blurb: "The trust page. Removes the last objection before they pick up the phone." },
    { id: "wizard",      name: "Multi-Step Quote Wizard",  target: "/contact/",
      blurb: "Four friendly steps instead of one intimidating form. Higher completion rate." },
    { id: "dark-mode",   name: "Dark Mode",                target: "body",
      blurb: "Respects the visitor's system setting. Small detail, reads as a premium build." },
  ],

  // --- WhatsApp widget: the five questions everyone asks ---
  WHATSAPP_FAQS: [
    { q: "How much for a double driveway?",
      a: "Most double driveways in Rugby land between £2,800 and £5,000 depending on surface and groundwork. Tarmac is usually the most cost-effective; block paving and resin sit a little higher. Happy to give you an exact figure after a free 20-minute visit." },
    { q: "How long will it take?",
      a: "A typical residential driveway is 2–4 days start to finish. That includes excavation, sub-base, edging and the surface itself. We'll give you a firm timeframe in writing before we start." },
    { q: "Do you need a deposit?",
      a: "No. No deposit, no binding contract. You pay when the job's finished and you're happy with it — that's been our policy for five years." },
    { q: "Do I need planning permission?",
      a: "Usually not. Permeable surfaces like resin bound drain through, so they're exempt. If you're laying something non-permeable over a large area we'll flag it and sort the drainage design for you." },
    { q: "Do you cover my village?",
      a: "We cover Rugby town and the surrounding villages — Hillmorton, Bilton, Dunchurch, Brownsover, Newbold, Long Lawford, Cawston, Barby, Clifton and Kilsby. Send us your postcode and we'll confirm." },
    { q: "Can I see examples of your work?",
      a: "Absolutely — have a look at our portfolio for before-and-after photos of real jobs, with the materials and costs listed for each one." },
  ],

  // --- Choose Your Finish: material picker ---
  // The close-up texture photography lives here, where it belongs.
  MATERIALS: [
    { name: "Charcoal Tarmac",    swatch: "/images/svc-tarmac.jpg",  scene: "/images/scenes/tarmac1-after.jpg", service: "Tarmac Driveways",
      price: "£45–£60/m²", note: "Hard-wearing, quick to lay, best value on larger areas.",
      traits: ["Low maintenance", "2-day install", "Best value"] },
    { name: "Herringbone Block",  swatch: "/images/svc-block.jpg",   scene: "/images/scenes/block1-after.jpg",  service: "Block Paving",
      price: "£70–£95/m²", note: "The classic. Individual blocks can be lifted and relaid if needed.",
      traits: ["Repairable", "Huge colour range", "Adds kerb appeal"] },
    { name: "Silver Resin Bound", swatch: "/images/svc-resin.jpg",   scene: "/images/scenes/resin1-after.jpg",  service: "Resin Bound Driveways",
      price: "£80–£110/m²", note: "Seamless and fully permeable, so no planning permission needed.",
      traits: ["SuDS-compliant", "Weed resistant", "Smooth underfoot"] },
    { name: "Granite Setts",      swatch: "/images/svc-stone.jpg",   scene: "/images/scenes/stone1-after.jpg",  service: "Natural Stone",
      price: "£110–£140/m²", note: "Premium natural stone. Effectively lasts a lifetime.",
      traits: ["Lifetime surface", "Ages beautifully", "Adds value"] },
    { name: "Indian Sandstone",   swatch: "/images/proj-patio1-before.jpg", scene: "/images/scenes/patio1-after.jpg", service: "Patios & Landscaping",
      price: "£75–£100/m²", note: "Warm, riven natural stone — our most popular patio choice.",
      traits: ["Natural riven finish", "Frost proof", "Non-slip"] },
    { name: "Porcelain Paving",   swatch: "/images/proj-stone1-before.jpg", scene: "/images/scenes/patio2-after.jpg", service: "Patios & Landscaping",
      price: "£95–£125/m²", note: "Dead flat, colour-stable and almost impossible to stain.",
      traits: ["Stain proof", "Colour stable", "Low maintenance"] },
  ],

  // --- Finance illustration ---
  FINANCE: {
    apr: 9.9,
    terms: [24, 36, 48, 60],
    minSpend: 1500,
    note: "Illustration only. Finance subject to status and provided by an authorised third-party lender.",
  },

  // --- Live availability strip ---
  AVAILABILITY: {
    nextSurvey: "Thursday 11th September",
    nextInstall: "Week commencing 29th September",
    bookedThisMonth: 7,
    capacity: 9,
  },

  // --- Guarantee & accreditations ---
  GUARANTEE: {
    years: 10,
    headline: "10-Year Workmanship Guarantee",
    body: "Every driveway and patio we lay is covered for ten years against sinking, cracking and failure of the sub-base. It's written into your paperwork on day one, it's transferable if you sell the house, and it costs you nothing extra.",
    points: [
      { title: "Covers the groundwork, not just the surface",
        body: "Most failures start underneath. Our guarantee covers excavation depth, membrane and compacted sub-base — the parts you can't see." },
      { title: "Transferable to the next owner",
        body: "Selling within ten years? The guarantee passes with the property, which is a genuine selling point on a listing." },
      { title: "No small print about weather",
        body: "We don't exclude frost heave or standing water. If we specified it and it fails, we come back and fix it." },
    ],
  },

  ACCREDITATIONS: [
    { name: "Public Liability", detail: "£5m cover",           icon: "shield" },
    { name: "Checkatrade",      detail: "Vetted & monitored",  icon: "check"  },
    { name: "TrustMark",        detail: "Government endorsed", icon: "star"   },
    { name: "Marshalls",        detail: "Registered installer",icon: "layers" },
    { name: "Waste Carrier",    detail: "Licensed disposal",   icon: "tool"   },
    { name: "CSCS",             detail: "Carded operatives",   icon: "users"  },
  ],

  // --- The crew ---
  TEAM: [
    { name: "Nathan Reeve",   role: "Owner & Lead Installer", initials: "NR", years: 14, tone: "#2f4739",
      bio: "Started laying block paving at 19 and has run his own crew since 2020. Nathan quotes every job himself, which is why the price you're given is the price you pay.",
      fact: "Has never subcontracted a single job." },
    { name: "Isaac Reeve",    role: "Groundworks Foreman",    initials: "IR", years: 9,  tone: "#3d5a45",
      bio: "Runs the excavation and sub-base side. Isaac is the reason our driveways don't sink — he'd rather dig another 50mm than cut a corner.",
      fact: "Digs 50mm deeper than spec as standard." },
    { name: "Danny Whitmore", role: "Resin & Surfacing",      initials: "DW", years: 7,  tone: "#4a6b4f",
      bio: "Our resin specialist. Mixes and lays every resin bound surface on site, and has a genuinely obsessive eye for a clean edge.",
      fact: "Trained directly with the resin manufacturer." },
    { name: "Marek Kowalski", role: "Block Paving & Stone",   initials: "MK", years: 11, tone: "#35544a",
      bio: "Twenty years in stone between Poland and the UK. Marek handles the intricate work — circles, fans, curved edges and anything that needs cutting by eye.",
      fact: "Cuts curved edges freehand." },
    { name: "Chloe Bennett",  role: "Office & Scheduling",    initials: "CB", years: 4,  tone: "#4f5f3c",
      bio: "The person who actually answers the phone. Chloe books the surveys, sends the quotes and chases nothing — because we don't do pressure selling.",
      fact: "Answers 94% of calls on the first ring." },
  ],

  // --- Advice hub ---
  BLOG_POSTS: [
    { slug: "resin-vs-block-paving",
      title: "Resin vs Block Paving: Which Is Right for Your Home?",
      date: "2026-08-18", readMins: 6, category: "Choosing a Surface",
      image: "/images/scenes/resin1-after.jpg",
      excerpt: "The two most popular driveway surfaces in Rugby, compared honestly — including the situations where we'd talk you out of resin.",
      body: [
        ["The short answer", "If you want a seamless, modern, weed-free surface and you're not planning to dig it up again, choose resin bound. If you want something you can lift and relay, that's cheaper to repair and comes in every colour going, choose block paving. Both will outlast the next fifteen years if the base underneath is done properly — and the base is where the real difference is made."],
        ["Where resin genuinely wins", "Resin bound is permeable, so rainwater drains straight through it. That means no standing water, no planning permission for a front driveway, and no soakaway to design. It's also completely smooth, which matters more than people expect if anyone in the house uses a wheelchair, a pushchair or a mobility scooter. And because there are no joints, there's nowhere for weeds to take hold."],
        ["Where block paving wins", "Block is repairable in a way resin simply isn't. If a utility company digs up your drive, or you want to widen it in three years, blocks come up and go back down and you'd never know. Resin has to be cut and patched, and a patch will always be visible. Block also has a far wider colour and pattern range, and it's usually £10–£20/m² cheaper."],
        ["The mistake we see most", "People choose a surface before checking the base. We've been called to resin driveways laid over cracked concrete that failed inside two winters — the resin was fine, the slab underneath moved. Whatever you choose, ask the installer what's going underneath and how deep. If they can't answer in specifics, get another quote."],
        ["What we'd recommend in Rugby", "For most Rugby semis with a standard front drive, block paving gives the best balance of cost, durability and repairability. If drainage is a known problem on your street, or you want the cleanest modern look, resin is worth the extra. We'll tell you honestly which one suits your property when we come out — including when the cheaper option is the better one."],
      ] },
    { slug: "how-much-does-a-driveway-cost",
      title: "How Much Does a Driveway Really Cost in Rugby?",
      date: "2026-08-02", readMins: 7, category: "Costs & Budgeting",
      image: "/images/scenes/tarmac1-after.jpg",
      excerpt: "Real 2026 figures for a typical Rugby driveway, what drives the price up, and the three quotes you should walk away from.",
      body: [
        ["Typical figures", "A single driveway of around 30m² runs £1,800–£2,800 in tarmac, £2,400–£3,600 in block paving, and £2,800–£4,000 in resin bound. A double of around 50m² is roughly £2,800–£3,400, £4,200–£5,000 and £3,600–£4,600 respectively. Those are complete figures including excavation and disposal — not surface-only prices."],
        ["What actually moves the price", "Access is the big one. If we can't get a machine down the side of the house, everything is barrowed by hand and the labour cost roughly doubles. Depth is second: a drive that'll take a transit van needs a deeper sub-base than one for a hatchback. Then disposal — old concrete is heavy and tipping fees are real money."],
        ["The dropped kerb", "If you're converting a front garden, you'll need a dropped kerb from the council, and that's a separate cost of roughly £900–£1,500 in Warwickshire, paid to an approved contractor. Any driveway quote that doesn't mention it, when you clearly need one, hasn't been thought through."],
        ["Three quotes to walk away from", "First: any quote that asks for a large deposit up front. Second: any quote that doesn't specify sub-base depth in millimetres. Third: any quote given over the phone without someone measuring the actual driveway. All three are the same warning sign — the number isn't based on your job."],
        ["Getting a figure you can trust", "Ask for the quote in writing, itemised, with the sub-base spec included. Ask what happens if they hit something unexpected when they dig. A good installer will have a clear answer, because it happens on maybe one job in ten and they've dealt with it before."],
      ] },
    { slug: "driveway-drainage-suds",
      title: "Driveway Drainage and SuDS Rules, Explained Simply",
      date: "2026-07-14", readMins: 5, category: "Regulations",
      image: "/images/scenes/resin2-after.jpg",
      excerpt: "When you need planning permission for a driveway, when you don't, and how to stay the right side of the rules without spending more.",
      body: [
        ["The rule in one paragraph", "Since 2008, you need planning permission to lay a non-permeable surface over 5m² in your front garden, unless the water drains to a permeable area within your own boundary. Permeable surfaces — resin bound, gravel, permeable block — are exempt regardless of size. That's genuinely the whole rule."],
        ["What counts as permeable", "Resin bound is permeable. Resin bonded is not. Standard block paving is not, but permeable block paving with wider joints and a clean stone sub-base is. Tarmac is not permeable, so a tarmac front drive over 5m² needs either permission or somewhere for the water to go."],
        ["The cheap, legal way round it", "You don't have to change surface. Falling the driveway towards a border, a soakaway or a permeable strip along one edge satisfies the rule perfectly well, and usually costs less than upgrading the whole surface. We design this in as standard — it's not an extra."],
        ["Why it matters beyond the paperwork", "Rugby has a fair amount of clay subsoil, which drains slowly. A driveway that ponds will fail faster, ice over in winter and push water toward your damp course. Getting the drainage right is worth doing for your own sake, never mind the regulations."],
      ] },
    { slug: "block-paving-maintenance",
      title: "Keeping Block Paving Looking New: A Realistic Guide",
      date: "2026-06-27", readMins: 4, category: "Maintenance",
      image: "/images/scenes/block2-after.jpg",
      excerpt: "What actually keeps block paving sharp, what's a waste of a Saturday, and the one thing that does real damage.",
      body: [
        ["The one thing to avoid", "Do not attack the joints with a pressure washer on full power. It blasts out the jointing sand, which is what stops the blocks moving. Once the sand's gone the blocks rock, the edges chip, and weeds get a foothold. Wash on a wide fan, at an angle, and stay off the joints."],
        ["What actually works", "A stiff brush and a bucket of warm water with a splash of washing-up liquid removes most of what builds up over a year. For moss and algae, a proper patio cleaner left to dwell for twenty minutes does more than an hour of scrubbing. Do it in autumn before the wet season, not in spring after it."],
        ["Re-sanding", "Every three to four years, brush fresh kiln-dried or polymeric sand into the joints on a dry day and compact it in. This is the single highest-value hour of maintenance a block driveway gets, and almost nobody does it."],
        ["Sealing: worth it or not?", "Optional. A sealer deepens the colour and makes oil spills easier to lift, but it needs redoing every three to five years and a bad application looks patchy and plasticky. If your drive is a light colour or you park a leaky older car on it, seal it. Otherwise it's genuinely fine unsealed."],
      ] },
    { slug: "choosing-a-driveway-company",
      title: "How to Choose a Driveway Company Without Getting Stung",
      date: "2026-06-05", readMins: 6, category: "Buying Advice",
      image: "/images/scenes/stone1-after.jpg",
      excerpt: "Driveways attract more cowboys than almost any other trade. Here are the questions that separate the real firms from the rest.",
      body: [
        ["Why this trade specifically", "Driveways are high-value, one-off purchases where the customer can't easily judge quality, and most of the work gets buried before you see it. That combination attracts people who shouldn't be doing it. The good news is that a handful of specific questions filters them out fast."],
        ["Ask about the sub-base, in millimetres", "'We'll dig it out and put a good base in' is not an answer. You want a number — typically 150mm of compacted MOT Type 1 for a car, more for heavier vehicles — plus a mention of a geotextile membrane. Anyone doing the job properly will answer this instantly, because it's what they think about all day."],
        ["Ask who's actually turning up", "Plenty of firms quote the job and then sell it on to whoever's free. Ask directly whether the people quoting are the people laying it. If the answer is vague, the accountability is vague too."],
        ["Never pay a large deposit", "Materials for a domestic driveway are not so expensive that a working firm needs your money up front. A deposit request on a £4,000 job is the single most common feature of the horror stories. Staged payments against completed work are reasonable; a big up-front lump sum is not."],
        ["Check an old job, not a new one", "Anyone's work looks good the week it's finished. Ask to see something they laid three or four years ago. A firm that's proud of its work will have a customer nearby who's happy for you to look at the drive from the pavement."],
      ] },
  ],

  // --- Case studies (deep-dive versions of portfolio jobs) ---
  CASE_STUDIES: [
    { slug: "hillmorton-double-tarmac", portfolioTitle: "Double Tarmac Driveway",
      title: "Hillmorton: A Sinking 1970s Drive, Rebuilt in Two Days",
      client: "Mark T.", location: "Hillmorton, Rugby", surface: "Tarmac Driveways",
      duration: "2 days", cost: "£3,150", area: "52m²", completed: "October 2025",
      before: "/images/scenes/tarmac1-before.jpg", after: "/images/scenes/tarmac1-after.jpg",
      brief: "A 1970s concrete drive that had sunk badly on the left-hand side, ponding water against the garage wall every time it rained. The owners wanted it gone before winter and were worried about damp getting into the garage.",
      problem: "The original slab had been laid straight onto soft ground with almost no sub-base. Once we broke it out we found the fall ran towards the house rather than away from it — which is why water had been collecting against the wall for the best part of fifty years.",
      solution: "Full excavation to 250mm, geotextile membrane, 200mm of compacted MOT Type 1, and a re-graded fall running away from the property to a new channel drain at the garage threshold. Block paving edge restraint on both sides, then 60mm of base course and 25mm of surface course tarmac.",
      days: [
        { day: "Day 1", body: "Broke out and removed 14 tonnes of old concrete, excavated to depth, laid membrane and sub-base, compacted in layers and set the block edging." },
        { day: "Day 2", body: "Installed the channel drain, laid and rolled the tarmac in two courses, and cleaned down. Handed over at 4pm." },
      ],
      quote: "Had the double driveway done last autumn — tarmac with block edging. Neat, clean job, done in two days. Nathan was straight with us from the start on price and materials. Looks great still.",
      result: "No standing water through a full winter, and the garage wall has dried out. The channel drain added £180 to the job and solved the actual problem." },

    { slug: "brownsover-herringbone-block", portfolioTitle: "Herringbone Block Paving",
      title: "Brownsover: Herringbone Block Over a Failed Gravel Drive",
      client: "The Ashworths", location: "Brownsover, Rugby", surface: "Block Paving",
      duration: "3 days", cost: "£4,650", area: "58m²", completed: "March 2026",
      before: "/images/scenes/block1-before.jpg", after: "/images/scenes/block1-after.jpg",
      brief: "Loose gravel that had spread across the pavement and into the lawn for years. Two cars, a caravan in summer, and a client who wanted something that would still look sharp in a decade.",
      problem: "Gravel over bare earth with no membrane, so it had sunk into the subsoil and turned to mud in patches. The drive also had no edge restraint at all, which is why it kept migrating onto the footpath.",
      solution: "Excavated to 300mm to take the caravan weight, membrane, 250mm compacted Type 1, and 50mm sharp sand screed. Charcoal and buff blocks laid in a 45-degree herringbone — the strongest pattern for vehicle loading — with a double soldier course border and haunched concrete edge restraint throughout.",
      days: [
        { day: "Day 1", body: "Excavation and muck-away, membrane down, sub-base in and compacted in three passes." },
        { day: "Day 2", body: "Edge restraints set and haunched, screed laid, main herringbone field started from the garage end." },
        { day: "Day 3", body: "Cuts finished by eye around the bay window, soldier course completed, whole drive vibrated and polymeric sand brushed in." },
      ],
      quote: "New block paving installed — very hard workers indeed. Would highly recommend.",
      result: "Three cars park on it comfortably and the caravan sits on the reinforced section without rutting. No gravel on the pavement." },

    { slug: "bilton-silver-resin", portfolioTitle: "Silver Resin Bound Driveway",
      title: "Bilton: Resin Bound Over a Cracked Concrete Slab",
      client: "Dr. Fenwick", location: "Bilton, Rugby", surface: "Resin Bound Driveways",
      duration: "2 days", cost: "£3,900", area: "44m²", completed: "May 2026",
      before: "/images/scenes/resin1-before.jpg", after: "/images/scenes/resin1-after.jpg",
      brief: "A badly crazed concrete drive. The client specifically wanted a smooth, seamless surface — a family member uses a wheelchair and the existing expansion joints were a daily nuisance.",
      problem: "The concrete was cracked but structurally sound and well-drained, which meant it could stay. Digging it out would have added £900 and two days for no functional gain. The cracks did need dealing with properly, though, or they'd have telegraphed straight through the resin within a year.",
      solution: "Cut and filled every crack, then laid a 20mm binder course of open-graded asphalt across the whole slab to break the crack pattern before applying 18mm of silver and buff resin bound aggregate. Fully permeable, no planning permission required, and completely flush at the threshold.",
      days: [
        { day: "Day 1", body: "Pressure-washed and dried the slab, routed and filled the cracks, laid and rolled the binder course." },
        { day: "Day 2", body: "Mixed and trowelled the resin bound surface on site in eight batches, finished the threshold flush and left it to cure overnight." },
      ],
      quote: "For a job of this nature, Nathan and the team ensured the area was kept mess free with minimal disruption. 100% would recommend to anyone looking for driveway installation.",
      result: "Completely flat, joint-free surface from pavement to front door. Keeping the slab saved the client £900 and a day of disruption." },
  ],

  // --- Social wall ---
  SOCIAL_POSTS: [
    // Designed cards (images/social/) mixed with straight job photos —
    // which is exactly how a well-run trade feed actually looks.
    { platform: "instagram", image: "/images/social/ba-reveal.jpg", likes: 486, comments: 41, days: 1, designed: true,
      caption: "Same driveway, three days apart. 58m² of herringbone block in Brownsover — full excavation, 250mm sub-base, and a double soldier course border. Swipe to see it properly.",
      tags: ["beforeandafter", "blockpaving", "brownsover", "transformation"] },
    { platform: "instagram", image: "/images/social/review.jpg", likes: 312, comments: 19, days: 3, designed: true,
      caption: "Another five-star one in from Hillmorton. We don't chase reviews — we just do the job right and they turn up. Thanks Mark 🙏",
      tags: ["fivestar", "customerreview", "rugby", "driveways"] },
    { platform: "facebook", image: "/images/social/offer.jpg", likes: 143, comments: 33, days: 4, designed: true,
      caption: "Two install slots left in September. Free survey, written quote, no deposit to hold the date. Drop us a message or give us a ring.",
      tags: ["availability", "rugby", "driveways"] },
    { platform: "instagram", image: "/images/social/stat.jpg", likes: 401, comments: 27, days: 6, designed: true,
      caption: "80 driveways across Rugby and the villages. Five years, one crew, not a single job subcontracted. Still the thing we're proudest of.",
      tags: ["localbusiness", "rugbywarwickshire", "nosubcontractors"] },
    { platform: "instagram", image: "/images/scenes/block2-after.jpg", likes: 214, comments: 18, days: 2,
      caption: "Silver-grey stretcher bond finished in Long Lawford this afternoon. Four days, 6-metre dropped kerb, and one very happy customer. 👊",
      tags: ["blockpaving", "rugbywarwickshire", "driveways", "kerbappeal"] },
    { platform: "instagram", image: "/images/scenes/resin2-after.jpg", likes: 187, comments: 11, days: 5,
      caption: "Caramel resin bound over a prepared concrete base in Barby. Seamless, permeable, and not a weed in sight for the next fifteen years.",
      tags: ["resinbound", "resindriveway", "suds", "rugby"] },
    { platform: "facebook",  image: "/images/scenes/tarmac1-after.jpg", likes: 96, comments: 24, days: 8,
      caption: "Two-day turnaround on this Hillmorton double. Old slab was sinking towards the garage — new channel drain and a proper fall have sorted it for good. Swipe for the before!",
      tags: ["tarmac", "hillmorton", "driveways"] },
    { platform: "instagram", image: "/images/scenes/stone1-after.jpg", likes: 341, comments: 29, days: 11,
      caption: "Rumbled granite setts in Clifton upon Dunsmore. Marek cut every curve on this one freehand. Genuinely one of the nicest drives we've laid. 🪨",
      tags: ["granitesetts", "naturalstone", "craftsmanship", "driveways"] },
    { platform: "instagram", image: "/images/scenes/patio2-after.jpg", likes: 268, comments: 22, days: 15,
      caption: "Large-format porcelain and matching steps down from the bifolds in Cawston. Non-slip, frost-proof, and it'll look identical in ten years.",
      tags: ["porcelainpaving", "patio", "landscaping", "gardendesign"] },
    { platform: "facebook",  image: "/images/scenes/patio1-after.jpg", likes: 78, comments: 9, days: 19,
      caption: "Indian sandstone patio with reclaimed brick edging in Dunchurch. Proper drainage fall built in — no puddles come November.",
      tags: ["indiansandstone", "patio", "dunchurch"] },
    { platform: "instagram", image: "/images/scenes/hero-after.jpg", likes: 402, comments: 37, days: 23,
      caption: "Before and after on this Rugby semi. Same driveway, same angle, four days apart. This is why we photograph every job. 📸",
      tags: ["beforeandafter", "transformation", "driveways", "rugby"] },
    { platform: "instagram", image: "/images/scenes/stone2-after.jpg", likes: 195, comments: 14, days: 28,
      caption: "Limestone setts at the entrance, tarmac for the main sweep. Kilsby. Best of both — the look where it counts, the value where it doesn't.",
      tags: ["limestone", "driveway", "kilsby", "naturalstone"] },
    { platform: "instagram", image: "/images/scenes/tarmac2-after.jpg", likes: 156, comments: 8, days: 33,
      caption: "Tarmac with contrasting block kerbing in Newbold. Smart, clean, and it suits the red brick perfectly.",
      tags: ["tarmac", "newbold", "blockedging"] },
  ],

  // --- Village landing pages ---
  AREA_PAGES: [
    { slug: "hillmorton",  name: "Hillmorton",  jobs: 14, drive: "10 mins",
      note: "Lots of 1960s and 70s builds around Hillmorton with original concrete drives that have reached the end of their life. We've replaced a good number of them." },
    { slug: "bilton",      name: "Bilton",      jobs: 19, drive: "8 mins",
      note: "Bilton's mix of older cottages and newer estates means anything from natural stone to modern resin. Our most frequent postcode by some distance." },
    { slug: "dunchurch",   name: "Dunchurch",   jobs: 11, drive: "12 mins",
      note: "Conservation area in parts of the village, so material choice matters. We'll advise on what's appropriate before you fall in love with something that won't get approved." },
    { slug: "brownsover",  name: "Brownsover",  jobs: 16, drive: "9 mins",
      note: "Predominantly newer housing with tight driveways and shared access. We're used to working around limited access here without damaging neighbouring surfaces." },
    { slug: "long-lawford",name: "Long Lawford",jobs: 8,  drive: "14 mins",
      note: "Generous plots and wide frontages, which is why we do more large block paving installations here than anywhere else on our patch." },
    { slug: "newbold",     name: "Newbold",     jobs: 12, drive: "11 mins",
      note: "Newbold-on-Avon has a lot of red-brick semis where contrasting block edging on tarmac works particularly well. A local favourite." },
    { slug: "cawston",     name: "Cawston",     jobs: 9,  drive: "13 mins",
      note: "Newer development, so most work here is upgrading builder-standard driveways and adding patios to gardens that were left as turf." },
    { slug: "barby",       name: "Barby",       jobs: 6,  drive: "18 mins",
      note: "Village properties with longer approaches. Resin bound is popular here for the seamless look down a longer drive." },
    { slug: "clifton-upon-dunsmore", name: "Clifton upon Dunsmore", jobs: 7, drive: "12 mins",
      note: "Some lovely older stone properties in Clifton where natural granite and limestone setts are the only appropriate choice." },
    { slug: "kilsby",      name: "Kilsby",      jobs: 5,  drive: "20 mins",
      note: "Just over the Northamptonshire border and well within our patch. Larger rural plots, often combining stone entrances with tarmac sweeps." },
  ],

  // --- Video assets (generated by tools/gen-videos.js) ---
  VIDEOS: {
    hero:   { src: "/videos/hero-loop.webm",     poster: "/images/scenes/hero-after.jpg" },
    reel:   { src: "/videos/transformation.webm",poster: "/images/scenes/block1-after.jpg",
              title: "Watch a driveway go in, start to finish",
              blurb: "Four days in Brownsover, condensed into twenty seconds — excavation, sub-base, edging and the finished herringbone." },
  },

};

if (typeof module !== "undefined") module.exports = config;
