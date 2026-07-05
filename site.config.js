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
  HERO_BEFORE_IMAGE: "/images/hero-before.jpg",
  HERO_AFTER_IMAGE:  "/images/hero-after.jpg",

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
  WHATSAPP_NUMBER:  "",
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
      beforeImage: "/images/proj-tarmac1-before.jpg",
      afterImage:  "/images/proj-tarmac1-after.jpg",
    },
    {
      title:       "Herringbone Block Paving",
      location:    "Brownsover, Rugby",
      category:    "Block Paving",
      duration:    "3 days",
      priceBand:   "£4,200–£5,000",
      description: "Classic herringbone block paving in charcoal and buff. Compacted MOT sub-base, full edging, and polymeric sand jointing to resist weeds.",
      beforeImage: "/images/proj-block1-before.jpg",
      afterImage:  "/images/proj-block1-after.jpg",
    },
    {
      title:       "Silver Resin Bound Driveway",
      location:    "Bilton, Rugby",
      category:    "Resin Bound Driveways",
      duration:    "2 days",
      priceBand:   "£3,600–£4,200",
      description: "Bespoke silver and buff aggregate resin bound driveway over a fresh tarmac base. Seamless finish, SuDS-compliant, no planning permission required.",
      beforeImage: "/images/proj-resin1-before.jpg",
      afterImage:  "/images/proj-resin1-after.jpg",
    },
    {
      title:       "Natural Sandstone Patio",
      location:    "Dunchurch, Rugby",
      category:    "Patios & Landscaping",
      duration:    "2 days",
      priceBand:   "£1,800–£2,400",
      description: "Indian sandstone patio with reclaimed brick edging and a raised planting border. Full excavation, compacted base, and proper drainage fall.",
      beforeImage: "/images/proj-patio1-before.jpg",
      afterImage:  "/images/proj-patio1-after.jpg",
    },
    {
      title:       "Tarmac & Block Kerb Driveway",
      location:    "Newbold, Rugby",
      category:    "Tarmac Driveways",
      duration:    "2 days",
      priceBand:   "£2,200–£2,800",
      description: "Tarmac driveway with contrasting block paving kerbing along both sides. Smart, clean finish that complements a red-brick 1970s semi.",
      beforeImage: "/images/proj-tarmac2-before.jpg",
      afterImage:  "/images/proj-tarmac2-after.jpg",
    },
    {
      title:       "Contemporary Block Paving",
      location:    "Long Lawford, Rugby",
      category:    "Block Paving",
      duration:    "4 days",
      priceBand:   "£5,500–£6,500",
      description: "Large contemporary block paving installation in silver-grey stretcher bond. Includes full landscaping around the edges and a new 6-metre dropped kerb.",
      beforeImage: "/images/proj-block2-before.jpg",
      afterImage:  "/images/proj-block2-after.jpg",
    },
    {
      title:       "Granite Sett Driveway",
      location:    "Clifton upon Dunsmore, Rugby",
      category:    "Natural Stone",
      duration:    "3 days",
      priceBand:   "£5,000–£6,200",
      description: "Premium natural granite sett driveway with a rumbled finish. Beautifully textured, extremely durable, and a perfect complement to the property's stone façade.",
      beforeImage: "/images/proj-stone1-before.jpg",
      afterImage:  "/images/proj-stone1-after.jpg",
    },
    {
      title:       "Porcelain Patio & Steps",
      location:    "Cawston, Rugby",
      category:    "Patios & Landscaping",
      duration:    "3 days",
      priceBand:   "£3,200–£4,000",
      description: "Large-format porcelain patio with matching steps down from the bifold doors. Non-slip finish, low-maintenance, and frost-resistant. Looks stunning year-round.",
      beforeImage: "/images/proj-patio2-before.jpg",
      afterImage:  "/images/proj-patio2-after.jpg",
    },
    {
      title:       "Caramel Resin Bound Driveway",
      location:    "Barby, Rugby",
      category:    "Resin Bound Driveways",
      duration:    "2 days",
      priceBand:   "£3,800–£4,400",
      description: "Warm caramel aggregate resin bound surface installed over a prepared concrete base. Smooth, weed-resistant finish with block paving edging for definition.",
      beforeImage: "/images/proj-resin2-before.jpg",
      afterImage:  "/images/proj-resin2-after.jpg",
    },
    {
      title:       "Limestone & Tarmac Driveway",
      location:    "Kilsby, Daventry",
      category:    "Natural Stone",
      duration:    "4 days",
      priceBand:   "£6,000–£7,200",
      description: "Sweeping curved driveway featuring natural limestone setts along the entrance and tarmac for the main body. Elegant combination with a contemporary feel.",
      beforeImage: "/images/proj-stone2-before.jpg",
      afterImage:  "/images/proj-stone2-after.jpg",
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
      a: "Call us on 01788 298618 or fill in the contact form and we'll arrange a free visit. We'll measure up, talk through your options, and give you a written quote with no obligation."
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
  WHATSAPP_ENABLED: false,

  // --- Cloudflare Analytics ---
  CF_ANALYTICS_TOKEN: "",

};

if (typeof module !== "undefined") module.exports = config;
