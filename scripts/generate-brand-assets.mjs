import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve("public/uploads/brand-assets");

const C = {
  ink: "#11100E",
  paper: "#F3EFE6",
  warm: "#5B3E2A",
  clay: "#6F4A34",
  celadon: "#8A9A8B",
  brass: "#BFA46A",
  bone: "#D8CDBB",
  ash: "#8C867C",
  text: "#2A2824",
  white: "#F8F4EA",
};

const assets = [
  { name: "hero-empty-seat", w: 2400, h: 1600, mood: "dark-seat" },
  { name: "home-private-seat", w: 1600, h: 1200, mood: "hands-cup" },
  { name: "home-objects-and-seat", w: 1600, h: 1200, mood: "objects-table" },
  { name: "home-season-note", w: 1600, h: 1200, mood: "paper-note" },
  { name: "tea-event-rain-white-tea-cover", w: 1600, h: 1200, mood: "white-tea" },
  { name: "tea-event-yan-gu-hua-xiang-cover", w: 1600, h: 1200, mood: "rock-tea" },
  { name: "tea-event-ripe-puer-night-cover", w: 1600, h: 1200, mood: "puer-night" },
  { name: "gallery-rain-white-tea-01", w: 1600, h: 1067, mood: "white-tea-close" },
  { name: "gallery-rain-white-tea-02", w: 1600, h: 1067, mood: "empty-six" },
  { name: "gallery-rain-white-tea-03", w: 1600, h: 1067, mood: "porcelain-cloth" },
  { name: "gallery-yan-gu-hua-xiang-01", w: 1600, h: 1067, mood: "rock-tea" },
  { name: "gallery-yan-gu-hua-xiang-02", w: 1600, h: 1067, mood: "hands-cup" },
  { name: "gallery-yan-gu-hua-xiang-03", w: 1600, h: 1067, mood: "objects-table" },
  { name: "gallery-ripe-puer-night-01", w: 1600, h: 1067, mood: "puer-night" },
  { name: "gallery-ripe-puer-night-02", w: 1600, h: 1067, mood: "silver-kettle-dark" },
  { name: "gallery-ripe-puer-night-03", w: 1600, h: 1067, mood: "dark-seat" },
  { name: "object-zisha-shui-ping", w: 1400, h: 1400, mood: "object-zisha" },
  { name: "object-celadon-cup", w: 1400, h: 1400, mood: "object-celadon" },
  { name: "object-silver-kettle", w: 1400, h: 1400, mood: "object-silver" },
  { name: "object-wood-fired-cup", w: 1400, h: 1400, mood: "object-wood" },
  { name: "object-incense-holder", w: 1400, h: 1400, mood: "object-incense" },
  { name: "object-linen-cloth", w: 1400, h: 1400, mood: "object-cloth" },
  { name: "note-city-and-tea-cover", w: 1600, h: 1000, mood: "city-window" },
  { name: "note-host-silence-cover", w: 1600, h: 1000, mood: "host-silence" },
  { name: "note-object-distance-cover", w: 1600, h: 1000, mood: "object-distance" },
  { name: "note-spring-before-seat-cover", w: 1600, h: 1000, mood: "spring-water" },
  { name: "host-hands-and-seat", w: 1600, h: 1200, mood: "host-hands" },
  { name: "og-share-banxi", w: 1200, h: 630, mood: "og" },
];

function esc(v) {
  return String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function defs() {
  return `<defs>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="5" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.18"/></feComponentTransfer>
    </filter>
    <filter id="fine-grain">
      <feTurbulence type="fractalNoise" baseFrequency="1.35" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.09"/></feComponentTransfer>
    </filter>
    <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="34" stdDeviation="30" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
    <filter id="small-shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000000" flood-opacity="0.28"/>
    </filter>
    <radialGradient id="vignette" cx="50%" cy="48%" r="70%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.66" stop-color="#000000" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.36"/>
    </radialGradient>
    <linearGradient id="warm-light" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#F4E6CF" stop-opacity="0.42"/>
      <stop offset="0.45" stop-color="#C8A576" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#11100E" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="paper-light" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#FAF6EC"/>
      <stop offset="0.58" stop-color="#EFE7D9"/>
      <stop offset="1" stop-color="#D6C7B1"/>
    </linearGradient>
  </defs>`;
}

function bg(w, h, tone = "dark") {
  const dark = tone === "dark";
  const fill = dark ? C.ink : C.paper;
  return `
    <rect width="${w}" height="${h}" fill="${fill}"/>
    ${dark ? `<rect width="${w}" height="${h}" fill="url(#warm-light)" opacity="0.52"/>` : `<rect width="${w}" height="${h}" fill="url(#paper-light)" opacity="0.9"/>`}
    <rect width="${w}" height="${h}" filter="url(#grain)" opacity="${dark ? 0.55 : 0.32}"/>
    <rect width="${w}" height="${h}" fill="url(#vignette)" opacity="${dark ? 0.78 : 0.28}"/>`;
}

function table(w, h, y, dark = true) {
  const fill = dark ? "#17130F" : "#DDD1BF";
  return `
    <path d="M${w * 0.04},${y} C${w * 0.23},${y - h * 0.035} ${w * 0.72},${y - h * 0.03} ${w * 0.96},${y + h * 0.005} L${w},${h} H0 Z" fill="${fill}" opacity="${dark ? 0.9 : 0.75}"/>
    <path d="M${w * 0.08},${y + h * 0.028} C${w * 0.35},${y - h * 0.004} ${w * 0.66},${y - h * 0.006} ${w * 0.92},${y + h * 0.03}" fill="none" stroke="${dark ? C.brass : C.warm}" stroke-width="1" opacity="${dark ? 0.2 : 0.22}"/>`;
}

function cup(cx, cy, s, opts = {}) {
  const fill = opts.fill ?? C.bone;
  const stroke = opts.stroke ?? "#EFE6D7";
  const tea = opts.tea ?? C.warm;
  const opacity = opts.opacity ?? 1;
  return `
    <g filter="url(#small-shadow)" opacity="${opacity}">
      <ellipse cx="${cx}" cy="${cy}" rx="${s * 1.48}" ry="${s * 0.43}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(1.2, s * 0.035)}"/>
      <path d="M${cx - s * 1.24},${cy} C${cx - s * 1.04},${cy + s * 1.34} ${cx + s * 1.04},${cy + s * 1.34} ${cx + s * 1.24},${cy} Z" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(1.2, s * 0.035)}"/>
      <ellipse cx="${cx}" cy="${cy - s * 0.035}" rx="${s * 1.03}" ry="${s * 0.21}" fill="${tea}" opacity="0.46"/>
      <ellipse cx="${cx - s * 0.25}" cy="${cy - s * 0.08}" rx="${s * 0.46}" ry="${s * 0.08}" fill="#fff" opacity="0.08"/>
    </g>`;
}

function kettle(cx, cy, s, dark = true) {
  const fill = dark ? "#2B2924" : "#BEB7AB";
  const stroke = dark ? "#D7CDBD" : C.text;
  return `
    <g filter="url(#small-shadow)">
      <path d="M${cx - s},${cy} C${cx - s * 0.88},${cy - s * 0.78} ${cx + s * 0.88},${cy - s * 0.78} ${cx + s},${cy} C${cx + s * 0.88},${cy + s * 0.92} ${cx - s * 0.88},${cy + s * 0.92} ${cx - s},${cy} Z" fill="${fill}" stroke="${stroke}" stroke-width="${s * 0.034}" opacity="0.94"/>
      <path d="M${cx - s * 0.72},${cy - s * 0.38} C${cx - s * 0.24},${cy - s * 1.24} ${cx + s * 0.24},${cy - s * 1.24} ${cx + s * 0.72},${cy - s * 0.38}" fill="none" stroke="${stroke}" stroke-width="${s * 0.052}" opacity="0.62"/>
      <path d="M${cx + s * 0.93},${cy - s * 0.04} C${cx + s * 1.42},${cy - s * 0.22} ${cx + s * 1.72},${cy + s * 0.08} ${cx + s * 1.95},${cy + s * 0.22}" fill="none" stroke="${stroke}" stroke-width="${s * 0.052}" opacity="0.7"/>
      <ellipse cx="${cx - s * 0.22}" cy="${cy - s * 0.16}" rx="${s * 0.28}" ry="${s * 0.08}" fill="#fff" opacity="0.12"/>
    </g>`;
}

function hand(cx, cy, s, rot = 0) {
  return `<g transform="rotate(${rot} ${cx} ${cy})" opacity="0.78" filter="url(#small-shadow)">
    <path d="M${cx - s * 1.7},${cy - s * 0.08} C${cx - s * 1.08},${cy - s * 0.5} ${cx - s * 0.44},${cy - s * 0.44} ${cx + s * 0.08},${cy + s * 0.12}" fill="none" stroke="#B79C82" stroke-width="${s * 0.28}" stroke-linecap="round"/>
    <path d="M${cx - s * 0.3},${cy - s * 0.24} C${cx + s * 0.2},${cy - s * 0.52} ${cx + s * 0.62},${cy - s * 0.3} ${cx + s * 0.76},${cy + s * 0.04}" fill="none" stroke="#C4AA8E" stroke-width="${s * 0.16}" stroke-linecap="round"/>
  </g>`;
}

function branch(w, h, dark = true) {
  return `<path d="M${w * 0.12},${h * 0.24} C${w * 0.34},${h * 0.15} ${w * 0.62},${h * 0.18} ${w * 0.88},${h * 0.08}" fill="none" stroke="${dark ? C.brass : C.celadon}" stroke-width="1.2" opacity="${dark ? 0.22 : 0.28}"/>`;
}

function objectStill(cx, cy, s, kind, dark = true) {
  if (kind === "zisha") return cup(cx, cy, s, { fill: C.clay, stroke: "#A9876A", tea: "#20140F" });
  if (kind === "celadon") return cup(cx, cy, s, { fill: "#9AA996", stroke: "#D9E0D3", tea: "#E5D0A4" });
  if (kind === "wood") return cup(cx, cy, s, { fill: "#8C6854", stroke: "#C6AA8A", tea: "#2A1710" });
  if (kind === "incense") return `<g filter="url(#small-shadow)">
    <rect x="${cx - s * 0.18}" y="${cy - s * 1.5}" width="${s * 0.36}" height="${s * 2.05}" rx="${s * 0.1}" fill="#69584C"/>
    <path d="M${cx},${cy - s * 1.65} C${cx - s * 0.52},${cy - s * 2.14} ${cx + s * 0.44},${cy - s * 2.48} ${cx + s * 0.04},${cy - s * 2.9}" fill="none" stroke="${dark ? "#C6BBAA" : C.ash}" stroke-width="${s * 0.035}" opacity="0.46"/>
    ${cup(cx, cy + s * 0.62, s * 0.72, { fill: dark ? "#27211C" : "#C9BCA8", stroke: dark ? "#A89B8C" : C.text, tea: "#332119" })}
  </g>`;
  if (kind === "cloth") return `<g filter="url(#small-shadow)">
    <rect x="${cx - s * 1.7}" y="${cy - s * 1.25}" width="${s * 3.4}" height="${s * 2.5}" fill="#CFC2AE" opacity="0.85"/>
    <path d="M${cx - s * 1.7},${cy - s * 0.55} H${cx + s * 1.7} M${cx - s * 0.8},${cy - s * 1.25} V${cy + s * 1.25}" stroke="#8E8275" stroke-width="1" opacity="0.22"/>
  </g>`;
  return kettle(cx, cy, s, dark);
}

function scene(asset) {
  const { w, h, mood } = asset;
  const darkMoods = new Set(["dark-seat", "puer-night", "silver-kettle-dark", "host-silence", "object-distance", "og"]);
  const dark = darkMoods.has(mood) || mood.includes("dark");
  let body = `${bg(w, h, dark ? "dark" : "paper")}${branch(w, h, dark)}`;
  const s = Math.min(w, h);

  if (mood === "dark-seat") {
    body += `${table(w, h, h * 0.58, true)}
      ${cup(w * 0.36, h * 0.53, s * 0.07, { fill: "#D9CFBE", stroke: "#F1E7D8", tea: "#A47B50" })}
      ${cup(w * 0.50, h * 0.515, s * 0.083, { fill: "#E7DED0", stroke: "#F3ECDE", tea: "#5B3E2A" })}
      ${cup(w * 0.64, h * 0.53, s * 0.07, { fill: "#B0B9A6", stroke: "#E1E5D8", tea: "#4B2E1F" })}
      <circle cx="${w * 0.50}" cy="${h * 0.16}" r="${s * 0.18}" fill="#F0D8AA" opacity="0.065"/>`;
  } else if (mood === "hands-cup" || mood === "host-hands") {
    body += `${table(w, h, h * 0.62, dark)}${hand(w * 0.38, h * 0.43, s * 0.08, -8)}${cup(w * 0.58, h * 0.52, s * 0.09, { fill: "#E3D7C7", stroke: "#FFF5E8", tea: "#7C512E" })}${kettle(w * 0.73, h * 0.46, s * 0.07, dark)}`;
  } else if (mood === "objects-table") {
    body += `${table(w, h, h * 0.6, dark)}${objectStill(w * 0.32, h * 0.50, s * 0.085, "zisha", dark)}${objectStill(w * 0.50, h * 0.49, s * 0.07, "celadon", dark)}${objectStill(w * 0.68, h * 0.48, s * 0.08, "silver", dark)}<path d="M${w * 0.24},${h * 0.68} H${w * 0.76}" stroke="${dark ? C.brass : C.warm}" stroke-width="1" opacity="0.24"/>`;
  } else if (mood === "paper-note" || mood === "city-window" || mood === "spring-water") {
    body += `<rect x="${w * 0.18}" y="${h * 0.16}" width="${w * 0.56}" height="${h * 0.58}" fill="#E9DFCF" opacity="0.78" filter="url(#small-shadow)"/>
      <path d="M${w * 0.22},${h * 0.29} H${w * 0.58} M${w * 0.22},${h * 0.39} H${w * 0.50} M${w * 0.22},${h * 0.49} H${w * 0.63}" stroke="${C.ash}" stroke-width="1.2" opacity="0.22"/>
      ${cup(w * 0.72, h * 0.58, s * 0.075, { fill: "#D9CDBA", stroke: C.white, tea: "#B98E58" })}`;
    if (mood === "city-window") body += `<rect x="${w * 0.72}" y="${h * 0.12}" width="${w * 0.12}" height="${h * 0.52}" fill="#11100E" opacity="0.12"/><path d="M${w * 0.78},${h * 0.12} V${h * 0.64}" stroke="#F5EBD9" opacity="0.36"/>`;
  } else if (mood === "white-tea" || mood === "white-tea-close") {
    body += `${table(w, h, h * 0.61, false)}${cup(w * 0.48, h * 0.50, s * 0.115, { fill: "#EFE7D8", stroke: "#FFF8ED", tea: "#C9A56D" })}<circle cx="${w * 0.64}" cy="${h * 0.42}" r="${s * 0.045}" fill="${C.celadon}" opacity="0.42"/>`;
  } else if (mood === "rock-tea") {
    body += `${table(w, h, h * 0.61, false)}${objectStill(w * 0.43, h * 0.50, s * 0.105, "zisha", false)}${cup(w * 0.61, h * 0.52, s * 0.07, { fill: "#88634E", stroke: "#D1B69A", tea: "#3A2014" })}<path d="M${w * 0.66},${h * 0.40} C${w * 0.76},${h * 0.35} ${w * 0.82},${h * 0.49} ${w * 0.74},${h * 0.58}" fill="none" stroke="${C.warm}" stroke-width="${s * 0.012}" opacity="0.32"/>`;
  } else if (mood === "puer-night") {
    body += `${table(w, h, h * 0.60, true)}${objectStill(w * 0.42, h * 0.50, s * 0.115, "zisha", true)}${cup(w * 0.62, h * 0.53, s * 0.075, { fill: "#2B211A", stroke: "#8D715B", tea: "#120907" })}<circle cx="${w * 0.68}" cy="${h * 0.26}" r="${s * 0.12}" fill="${C.brass}" opacity="0.06"/>`;
  } else if (mood === "silver-kettle-dark") {
    body += `${table(w, h, h * 0.62, true)}${kettle(w * 0.50, h * 0.49, s * 0.12, true)}${cup(w * 0.68, h * 0.58, s * 0.06, { fill: "#D2C7B9", stroke: C.white, tea: "#5B3E2A" })}`;
  } else if (mood.startsWith("object-")) {
    body += `${table(w, h, h * 0.63, dark)}<circle cx="${w * 0.5}" cy="${h * 0.47}" r="${s * 0.22}" fill="#fff" opacity="${dark ? 0.035 : 0.2}"/>`;
    const kind = mood.replace("object-", "");
    const map = { zisha: "zisha", celadon: "celadon", silver: "silver", wood: "wood", incense: "incense", cloth: "cloth" };
    body += objectStill(w * 0.50, h * 0.50, s * (kind === "cloth" ? 0.14 : 0.115), map[kind] ?? "zisha", dark);
  } else if (mood === "porcelain-cloth") {
    body += `${table(w, h, h * 0.60, false)}${objectStill(w * 0.45, h * 0.53, s * 0.11, "cloth", false)}${cup(w * 0.55, h * 0.50, s * 0.07, { fill: "#F1E9DB", stroke: "#FFF8EA", tea: "#C79A5B" })}`;
  } else if (mood === "empty-six") {
    body += `${table(w, h, h * 0.60, false)}${[0.26,0.36,0.46,0.56,0.66,0.76].map((x,i)=>cup(w*x,h*(0.52+(i%2)*0.025),s*0.045,{fill:i%2?"#D9CFBE":"#EEE5D6",stroke:"#FFF4E5",tea:"#9F7347",opacity:0.9})).join("")}`;
  } else if (mood === "host-silence") {
    body += `${table(w, h, h * 0.64, true)}${hand(w * 0.42, h * 0.47, s * 0.075, -12)}${cup(w * 0.58, h * 0.54, s * 0.08, { fill: "#D7CAB8", stroke: "#F4E7D5", tea: "#5B3E2A" })}`;
  } else if (mood === "object-distance") {
    body += `${table(w, h, h * 0.62, true)}${cup(w * 0.30, h * 0.52, s * 0.06, { fill: C.clay, stroke: "#A9876A", tea: "#1A0B07" })}${cup(w * 0.50, h * 0.50, s * 0.06, { fill: "#A2AE9E", stroke: "#DDE2D5", tea: "#7B512F" })}${kettle(w * 0.72, h * 0.48, s * 0.075, true)}`;
  } else if (mood === "og") {
    body += `${table(w, h, h * 0.63, true)}${cup(w * 0.72, h * 0.54, s * 0.07, { fill: "#D7CBB8", stroke: C.white, tea: C.warm })}
      <text x="${w * 0.10}" y="${h * 0.40}" fill="${C.white}" font-family="Songti SC, STSong, SimSun, serif" font-size="${w * 0.14}" letter-spacing="8">半席</text>
      <text x="${w * 0.105}" y="${h * 0.51}" fill="${C.ash}" font-family="Georgia, serif" font-size="${w * 0.026}" letter-spacing="4">PRIVATE TEA SALON</text>
      <line x1="${w * 0.105}" y1="${h * 0.58}" x2="${w * 0.40}" y2="${h * 0.58}" stroke="${C.brass}" stroke-width="1" opacity="0.54"/>`;
  }

  body += `<rect x="${w * 0.055}" y="${h * 0.07}" width="${w * 0.89}" height="${h * 0.78}" fill="none" stroke="${dark ? C.brass : C.text}" stroke-width="1" opacity="${dark ? 0.16 : 0.10}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs()}${body}</svg>`;
}

function logoSvg({ size = 800, reverse = false, header = false } = {}) {
  const ink = reverse ? C.white : C.ink;
  const sub = reverse ? C.bone : C.ash;
  if (header) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 240 240" role="img" aria-label="半席">
      <rect width="240" height="240" fill="none"/>
      <path d="M50 42 H190 V198 H50 Z" fill="${ink}"/>
      <text x="120" y="105" text-anchor="middle" fill="${reverse ? C.ink : C.paper}" font-family="Songti SC, STSong, SimSun, serif" font-size="66" font-weight="600">半</text>
      <text x="120" y="168" text-anchor="middle" fill="${reverse ? C.ink : C.paper}" font-family="Songti SC, STSong, SimSun, serif" font-size="66" font-weight="600">席</text>
    </svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 800 800" role="img" aria-label="半席">
    <rect width="800" height="800" fill="none"/>
    <g transform="translate(98 120)">
      <text x="0" y="260" fill="${ink}" font-family="Songti SC, STSong, SimSun, serif" font-size="210" letter-spacing="34">半席</text>
      <line x1="8" y1="330" x2="560" y2="330" stroke="${ink}" stroke-width="3" opacity="0.82"/>
      <text x="8" y="390" fill="${sub}" font-family="Georgia, serif" font-size="34" letter-spacing="9">PRIVATE TEA SALON</text>
      <text x="8" y="458" fill="${sub}" font-family="Songti SC, STSong, SimSun, serif" font-size="30" letter-spacing="6">一席茶，安放一段不被打扰的时间。</text>
      <path d="M488 112 H602 V226 H488 Z" fill="none" stroke="${ink}" stroke-width="5"/>
      <path d="M520 158 H570 M545 132 V204" stroke="${ink}" stroke-width="10" stroke-linecap="square"/>
    </g>
  </svg>`;
}

function qrPlaceholderSvg() {
  const cells = 29;
  const unit = 800 / cells;
  let blocks = "";
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const finder = (x < 7 && y < 7) || (x > 21 && y < 7) || (x < 7 && y > 21);
      const innerFinder = ((x > 1 && x < 5 && y > 1 && y < 5) || (x > 23 && x < 27 && y > 1 && y < 5) || (x > 1 && x < 5 && y > 23 && y < 27));
      const value = finder ? (innerFinder || x === 0 || y === 0 || x === 6 || y === 6 || x === 22 || y === 22 || x === 28 || y === 28) : ((x * 17 + y * 11 + x * y) % 7 < 2);
      if (value) blocks += `<rect x="${x * unit}" y="${y * unit}" width="${unit + 0.4}" height="${unit + 0.4}" fill="${C.ink}"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <rect width="800" height="800" fill="#fff"/>
    <g transform="translate(72 72) scale(0.82)">${blocks}</g>
    <rect x="236" y="360" width="328" height="80" fill="#fff"/>
    <text x="400" y="410" text-anchor="middle" font-family="Songti SC, STSong, SimSun, serif" font-size="28" fill="${C.ink}">请替换为微信二维码</text>
  </svg>`;
}

async function writeFile(name, content) {
  await fs.writeFile(path.join(outDir, name), content);
}

async function raster(svg, name, w, h) {
  await writeFile(`${name}.svg`, svg);
  await sharp(Buffer.from(svg)).resize(w, h).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(outDir, `${name}.jpg`));
  await sharp(Buffer.from(svg)).resize(w, h).webp({ quality: 86 }).toFile(path.join(outDir, `${name}.webp`));
}

async function main() {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const mainLogo = logoSvg({ size: 800 });
  const reverseLogo = logoSvg({ size: 800, reverse: true });
  const headerLogo = logoSvg({ size: 240, header: true });
  await writeFile("logo-main.svg", mainLogo);
  await writeFile("logo-main-reversed.svg", reverseLogo);
  await writeFile("logo-header.svg", headerLogo);
  await sharp(Buffer.from(mainLogo)).png({ compressionLevel: 9 }).toFile(path.join(outDir, "logo-main.png"));
  await sharp(Buffer.from(reverseLogo)).png({ compressionLevel: 9 }).toFile(path.join(outDir, "logo-main-reversed.png"));
  await sharp(Buffer.from(headerLogo)).png({ compressionLevel: 9 }).toFile(path.join(outDir, "logo-header.png"));
  await sharp(Buffer.from(headerLogo)).resize(64, 64).png({ compressionLevel: 9 }).toFile(path.join(outDir, "favicon-64.png"));
  await sharp(Buffer.from(qrPlaceholderSvg())).png({ compressionLevel: 9 }).toFile(path.join(outDir, "wechat-qr-placeholder.png"));

  for (const asset of assets) {
    await raster(scene(asset), asset.name, asset.w, asset.h);
  }

  const manifest = [
    "| 文件 | 尺寸 | 用途 |",
    "|---|---:|---|",
    "| logo-main.svg / logo-main.png | 800 x 800 | 主标识，透明背景 |",
    "| logo-main-reversed.svg / logo-main-reversed.png | 800 x 800 | 深色背景反白主标识 |",
    "| logo-header.svg / logo-header.png | 240 x 240 | 页眉小标识 |",
    "| wechat-qr-placeholder.png | 800 x 800 | 微信二维码占位，需替换真实二维码 |",
    ...assets.map((asset) => `| ${asset.name}.jpg / .webp | ${asset.w} x ${asset.h} | ${asset.mood} |`),
  ].join("\n");
  await writeFile("ASSET-MANIFEST.md", `${manifest}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
