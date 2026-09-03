// ============================================================
// GROUNDWORK STUDIOS — SCENE RENDERER
// Renders a driveway "transformation shot": camera stands on
// the drive looking back toward the house. The real material
// photograph fills the ground plane in perspective; everything
// behind it sits in shallow depth-of-field blur, which is what
// sells the frame as photographic rather than illustrated.
//
// BEFORE and AFTER share identical geometry, camera and props,
// so a before/after slider lines up pixel-for-pixel.
// ============================================================

const W = 1440;
const H = 900;

const HORIZON = 300; // where the ground plane begins

// Film grain + surface mottling, as an inline SVG turbulence tile. This is
// what stops the flat CSS fills reading as vector art.
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
       <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/></filter>
       <rect width="220" height="220" filter="url(#n)" opacity="0.55"/>
     </svg>`);

const MOTTLE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
       <filter id="m"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="5" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/></filter>
       <rect width="600" height="600" filter="url(#m)" opacity="0.85"/>
     </svg>`);

const HOUSES = {
  redbrick:  { wall: "#9d5b46", wallDark: "#844a37", trim: "#f2efe9", door: "#2f4739" },
  buffbrick: { wall: "#b89a75", wallDark: "#9e8260", trim: "#faf7f1", door: "#7a2f2f" },
  render:    { wall: "#ddd6c9", wallDark: "#c6bfb1", trim: "#ffffff", door: "#22384a" },
  greybrick: { wall: "#8a847d", wallDark: "#726c66", trim: "#f4f2ee", door: "#33463a" },
};

const GRADE = {
  after:  { sat: 1.08, con: 1.04, bri: 1.02, warm: "rgba(255,232,186,.34)" },
  before: { sat: 0.70, con: 0.93, bri: 0.90, warm: "rgba(176,186,192,.26)" },
};

function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

/**
 * @param {object} o
 *   surface        finished material photo (url) for the drive
 *   surfaceSize    background-size px for that texture
 *   beforeSurface  worn/cracked photo (url) used on the before frame
 *   edging         kerb texture (url) or null
 *   houseStyle     key of HOUSES
 *   houseOpts      { garage:boolean }
 *   variant        "before" | "after"
 */
function scene(o) {
  const isBefore = o.variant === "before";
  const p = HOUSES[o.houseStyle] || HOUSES.redbrick;
  const g = isBefore ? GRADE.before : GRADE.after;
  const garage = !!(o.houseOpts && o.houseOpts.garage);

  const surface     = isBefore ? (o.beforeSurface || "/images/proj-resin1-before.jpg") : o.surface;
  const surfaceSize = isBefore ? 340 : (o.surfaceSize || 220);

  const lawnTop = isBefore ? "#75815f" : "#5d8744";
  const lawnBot = isBefore ? "#667352" : "#4a7534";
  const skyTop  = isBefore ? "#93a0a8" : "#7fb0d6";
  const skyLow  = isBefore ? "#c3c9cc" : "#dbe9f0";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px;overflow:hidden;background:${skyLow}}
  /* base wash sits behind everything so a faded backdrop never reveals the body */
  .stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;
    background:linear-gradient(180deg, ${skyTop} 0%, ${skyLow} ${HORIZON - 40}px, ${lawnTop} ${HORIZON + 10}px, ${lawnBot} 100%);
    filter:saturate(${g.sat}) contrast(${g.con}) brightness(${g.bri});}

  /* ================= BACKDROP (all soft-focus) ================= */
  /* Extends well past the horizon and fades out, so the ground plane
     meets it without a visible seam. */
  .backdrop{position:absolute;left:-60px;right:-60px;top:-40px;height:${HORIZON + 210}px;
    filter:blur(${isBefore ? 7.5 : 6.5}px);
    -webkit-mask-image:linear-gradient(180deg,#000 ${HORIZON - 50}px, transparent ${HORIZON + 6}px);
            mask-image:linear-gradient(180deg,#000 ${HORIZON - 50}px, transparent ${HORIZON + 6}px);}

  .sky{position:absolute;inset:0;background:linear-gradient(${skyTop},${skyLow});}

  /* house wall across the middle distance */
  .wall{position:absolute;left:22%;right:22%;top:52px;bottom:0;
    background:linear-gradient(180deg, var(--wall), var(--wallDark));
    box-shadow:0 18px 40px rgba(0,0,0,.35);}
  .wall::after{content:"";position:absolute;inset:0;opacity:.45;
    background:
      repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 24px),
      repeating-linear-gradient(90deg, rgba(0,0,0,.12) 0 2px, transparent 2px 50px);}
  .eaves{position:absolute;left:20%;right:20%;top:36px;height:26px;
    background:linear-gradient(180deg,#4a4441,#37322f);box-shadow:0 6px 18px rgba(0,0,0,.4);}

  .winA{position:absolute;top:104px;width:140px;height:104px;
    background:linear-gradient(150deg,#cfe0e8 0%, #9fb9c6 42%, #70909f 43%, #bdd2dc 100%);
    border:9px solid var(--trim);box-shadow:0 3px 10px rgba(0,0,0,.28);}
  /* pushed to the outer edges so they never collide with the garage door */
  .winA.l{left:6%} .winA.r{right:6%}

  ${garage ? `
  .garage{position:absolute;left:50%;margin-left:-150px;top:96px;width:300px;bottom:0;
    background:linear-gradient(180deg,#7b817c,#5a605c);
    border:11px solid var(--trim);border-bottom:none;}
  .garage::after{content:"";position:absolute;inset:0;
    background:repeating-linear-gradient(180deg,rgba(255,255,255,.12) 0 7px,rgba(0,0,0,.13) 7px 17px);}
  ` : `
  .door{position:absolute;left:50%;margin-left:-54px;top:118px;width:108px;bottom:0;
    background:var(--door);border:9px solid var(--trim);border-bottom:none;}
  .door::after{content:"";position:absolute;right:16px;top:44%;width:10px;height:10px;
    border-radius:50%;background:#d8c489;}
  `}

  /* foliage / hedging either side — bokeh blobs read as planting */
  .foliage{position:absolute;left:-40px;right:-40px;top:40px;height:${HORIZON + 40}px;
    background:
      radial-gradient(150px 120px at 4% 78%,  ${isBefore ? "#5b6a52" : "#3f6b32"} 62%, transparent 63%),
      radial-gradient(120px 104px at 13% 88%, ${isBefore ? "#66755c" : "#4b7a3b"} 62%, transparent 63%),
      radial-gradient(170px 130px at 96% 76%, ${isBefore ? "#5b6a52" : "#3f6b32"} 62%, transparent 63%),
      radial-gradient(130px 110px at 87% 88%, ${isBefore ? "#66755c" : "#4b7a3b"} 62%, transparent 63%),
      radial-gradient(90px 80px at 21% 96%,   ${isBefore ? "#6d7b62" : "#568440"} 62%, transparent 63%),
      radial-gradient(96px 84px at 79% 96%,   ${isBefore ? "#6d7b62" : "#568440"} 62%, transparent 63%);}

  /* ================= GROUND PLANE ================= */
  /* Camera sits off-centre and slightly off-axis. Dead-centre symmetry is
     the single biggest tell that a frame was generated rather than shot. */
  .ground-wrap{position:absolute;left:0;right:0;top:${HORIZON}px;bottom:0;
    perspective:900px;perspective-origin:41% 0%;}
  /* long enough that the far edge resolves at the horizon, so the drive
     runs all the way up to the house instead of stopping in mid-air */
  .ground{position:absolute;left:50%;bottom:0;width:4200px;height:2600px;margin-left:-2100px;
    transform:rotateX(72deg) rotateZ(-1.6deg);transform-origin:50% 100%;
    background:linear-gradient(180deg,${lawnTop} 0%, ${lawnBot} 100%);}
  /* mown stripes + organic mottling so the grass isn't a flat green slab */
  .ground::before{content:"";position:absolute;inset:0;opacity:.30;
    background:repeating-linear-gradient(88deg, rgba(0,0,0,.14) 0 5px, transparent 5px 13px);}
  .ground::after{content:"";position:absolute;inset:0;opacity:.34;mix-blend-mode:overlay;
    background-image:url("${MOTTLE}");background-size:760px 760px;}

  .drive{position:absolute;left:50%;margin-left:-760px;width:1520px;top:0;bottom:0;
    background-image:url('${esc(surface)}');
    background-size:${surfaceSize}px ${surfaceSize}px;
    /* soft contact edge where the surface meets the grass */
    box-shadow:0 0 26px 6px rgba(24,30,20,.45);}
  /* lighting down the length of the drive + contact shadow at the house */
  .drive::after{content:"";position:absolute;inset:0;
    background:
      linear-gradient(180deg, rgba(16,18,20,.55) 0%, rgba(16,18,20,.10) 18%, rgba(0,0,0,0) 42%),
      linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(255,255,255,${isBefore ? .02 : .05}) 100%);}

  ${o.edging ? `
  .kerb{position:absolute;top:0;bottom:0;width:78px;
    background-image:url('${esc(o.edging)}');background-size:88px 88px;}
  .kerb::after{content:"";position:absolute;inset:0;
    background:linear-gradient(180deg,rgba(0,0,0,.5),rgba(0,0,0,.04));}
  .kerb.l{left:50%;margin-left:-838px}
  .kerb.r{left:50%;margin-left:760px}
  ` : ""}

  ${isBefore ? `
  /* weeds through the joints, moss, oil staining, ponding */
  .decay{position:absolute;inset:0;
    background:
      radial-gradient(60px 22px at 17% 18%, rgba(58,84,40,.80), transparent 70%),
      radial-gradient(84px 30px at 63% 27%, rgba(66,92,46,.68), transparent 70%),
      radial-gradient(50px 20px at 33% 45%, rgba(52,78,36,.78), transparent 70%),
      radial-gradient(110px 38px at 76% 52%, rgba(60,86,42,.60), transparent 70%),
      radial-gradient(70px 26px at 44% 66%, rgba(54,80,38,.66), transparent 70%),
      radial-gradient(96px 34px at 24% 78%, rgba(60,86,42,.55), transparent 70%),
      radial-gradient(300px 120px at 34% 40%, rgba(26,28,26,.34), transparent 72%),
      radial-gradient(240px 96px at 72% 66%, rgba(24,26,24,.30), transparent 72%);}
  .weeds{position:absolute;inset:0;opacity:.55;
    background:repeating-linear-gradient(90deg, transparent 0 96px, rgba(64,90,44,.55) 96px 102px),
               repeating-linear-gradient(0deg,  transparent 0 130px, rgba(64,90,44,.34) 130px 135px);}
  ` : `
  .sheen{position:absolute;inset:0;
    background:linear-gradient(104deg, rgba(255,255,255,0) 26%, rgba(255,255,255,.07) 47%, rgba(255,255,255,0) 63%);}
  `}

  /* ================= CAMERA GRADE ================= */
  /* near-field defocus: the very bottom of frame is closest to the lens */
  .nearblur{position:absolute;left:0;right:0;bottom:0;height:150px;
    backdrop-filter:blur(3px);
    -webkit-mask-image:linear-gradient(180deg,transparent,#000 78%);
            mask-image:linear-gradient(180deg,transparent,#000 78%);}
  /* atmospheric haze, feathered top AND bottom so it leaves no rectangle */
  .haze{position:absolute;left:0;right:0;top:${HORIZON - 130}px;height:280px;pointer-events:none;
    background:linear-gradient(180deg, rgba(226,236,242,0) 0%,
      rgba(226,236,242,${isBefore ? .42 : .32}) 44%, rgba(226,236,242,0) 100%);}
  .warm{position:absolute;inset:0;pointer-events:none;background:${g.warm};mix-blend-mode:soft-light;}
  .grain{position:absolute;inset:0;pointer-events:none;opacity:${isBefore ? .20 : .15};
    mix-blend-mode:overlay;background-image:url("${GRAIN}");background-size:260px 260px;}
  .vignette{position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(118% 88% at 50% 44%, transparent 46%, rgba(16,22,26,.42) 100%);}
  </style></head><body>
  <div class="stage" style="--wall:${p.wall};--wallDark:${p.wallDark};--trim:${p.trim};--door:${p.door}">

    <div class="backdrop">
      <div class="sky"></div>
      <div class="eaves"></div>
      <div class="wall">
        <div class="winA l"></div>
        <div class="winA r"></div>
        ${garage ? `<div class="garage"></div>` : `<div class="door"></div>`}
      </div>
      <div class="foliage"></div>
    </div>

    <div class="ground-wrap">
      <div class="ground">
        ${o.edging ? `<div class="kerb l"></div><div class="kerb r"></div>` : ""}
        <div class="drive">
          ${isBefore ? `<div class="decay"></div><div class="weeds"></div>` : `<div class="sheen"></div>`}
        </div>
      </div>
    </div>

    <div class="haze"></div>
    <div class="nearblur"></div>
    <div class="warm"></div>
    <div class="grain"></div>
    <div class="vignette"></div>
  </div>
  </body></html>`;
}

module.exports = { scene, W, H, HOUSES };
