import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve("public/uploads/brand-assets");

const colors = {
  ink: "#11100E",
  paper: "#F3EFE6",
  brown: "#5B3E2A",
  celadon: "#8A9A8B",
  gold: "#BFA46A",
  text: "#2A2824",
  muted: "#8C867C",
};

const assets = [
  { name: "hero-empty-seat", w: 2400, h: 1600, type: "hero", title: "入席之前", subtitle: "空席 / 窗光 / 宣纸" },
  { name: "home-private-seat", w: 1600, h: 1200, type: "seat", title: "私人茶席", subtitle: "手与杯之间的距离" },
  { name: "home-objects-and-seat", w: 1600, h: 1200, type: "objects", title: "器物与席面", subtitle: "紫砂 / 青瓷 / 席布" },
  { name: "home-season-note", w: 1600, h: 1200, type: "note", title: "主人手记", subtitle: "纸面 / 时间 / 光" },
  { name: "tea-event-rain-white-tea-cover", w: 1600, h: 1200, type: "tea-white", title: "雨前白茶夜席", subtitle: "春席 / 白茶" },
  { name: "tea-event-yan-gu-hua-xiang-cover", w: 1600, h: 1200, type: "tea-rock", title: "岩骨花香小席", subtitle: "夏席 / 岩茶" },
  { name: "tea-event-ripe-puer-night-cover", w: 1600, h: 1200, type: "tea-puer", title: "熟普深夜席", subtitle: "冬席 / 熟普" },
  { name: "gallery-rain-white-tea-01", w: 1600, h: 1067, type: "gallery-cup", title: "白茶汤色", subtitle: "自然光" },
  { name: "gallery-rain-white-tea-02", w: 1600, h: 1067, type: "gallery-seat", title: "春席空位", subtitle: "一席六人" },
  { name: "gallery-rain-white-tea-03", w: 1600, h: 1067, type: "gallery-object", title: "白瓷与席布", subtitle: "触感" },
  { name: "gallery-yan-gu-hua-xiang-01", w: 1600, h: 1067, type: "gallery-rock", title: "岩茶小席", subtitle: "火与香" },
  { name: "gallery-yan-gu-hua-xiang-02", w: 1600, h: 1067, type: "gallery-cup", title: "茶汤入杯", subtitle: "短暂停留" },
  { name: "gallery-yan-gu-hua-xiang-03", w: 1600, h: 1067, type: "gallery-object", title: "器物之间", subtitle: "尺度" },
  { name: "gallery-ripe-puer-night-01", w: 1600, h: 1067, type: "gallery-dark", title: "熟普深夜", subtitle: "暗光" },
  { name: "gallery-ripe-puer-night-02", w: 1600, h: 1067, type: "gallery-kettle", title: "壶与水声", subtitle: "夜席" },
  { name: "gallery-ripe-puer-night-03", w: 1600, h: 1067, type: "gallery-seat-dark", title: "四人小席", subtitle: "候席" },
  { name: "object-zisha-shui-ping", w: 1400, h: 1400, type: "object-zisha", title: "紫砂水平", subtitle: "熟普 / 老茶" },
  { name: "object-celadon-cup", w: 1400, h: 1400, type: "object-celadon", title: "青瓷杯", subtitle: "白茶 / 清茶" },
  { name: "object-silver-kettle", w: 1400, h: 1400, type: "object-silver", title: "银壶", subtitle: "水线" },
  { name: "object-wood-fired-cup", w: 1400, h: 1400, type: "object-wood", title: "柴烧杯", subtitle: "火痕" },
  { name: "object-incense-holder", w: 1400, h: 1400, type: "object-incense", title: "香器", subtitle: "席前" },
  { name: "object-linen-cloth", w: 1400, h: 1400, type: "object-cloth", title: "席布", subtitle: "麻 / 纸感" },
  { name: "note-city-and-tea-cover", w: 1600, h: 1000, type: "note-city", title: "城市与茶", subtitle: "窗外 / 人声" },
  { name: "note-host-silence-cover", w: 1600, h: 1000, type: "note-host", title: "主人手记", subtitle: "不解释茶" },
  { name: "note-object-distance-cover", w: 1600, h: 1000, type: "note-object", title: "器物札记", subtitle: "距离" },
  { name: "note-spring-before-seat-cover", w: 1600, h: 1000, type: "note-season", title: "四时茶事", subtitle: "春席之前" },
  { name: "host-hands-and-seat", w: 1600, h: 1200, type: "host", title: "主人", subtitle: "手 / 杯 / 席" },
  { name: "og-share-banxi", w: 1200, h: 630, type: "og", title: "半席", subtitle: "一席茶，安放一段不被打扰的时间。" },
];

function esc(text) {
  return String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function grain(id, opacity = 0.18) {
  return `
    <filter id="${id}">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 ${opacity}"/></feComponentTransfer>
    </filter>`;
}

function background(w, h, dark = false) {
  const base = dark ? colors.ink : colors.paper;
  const wash = dark ? colors.brown : "#DFD6C5";
  return `
    <rect width="${w}" height="${h}" fill="${base}"/>
    <rect width="${w}" height="${h}" fill="${wash}" opacity="${dark ? 0.16 : 0.22}" filter="url(#grain)"/>
    <path d="M${w * 0.08},${h * 0.16} C${w * 0.32},${h * 0.03} ${w * 0.72},${h * 0.09} ${w * 0.94},${h * 0.02}" fill="none" stroke="${dark ? colors.gold : colors.celadon}" stroke-width="1.2" opacity="0.18"/>
    <path d="M${w * 0.02},${h * 0.82} C${w * 0.26},${h * 0.72} ${w * 0.62},${h * 0.93} ${w * 0.98},${h * 0.76}" fill="none" stroke="${dark ? colors.celadon : colors.brown}" stroke-width="1" opacity="0.12"/>`;
}

function cup(cx, cy, s, fill = "#EEE8DC", stroke = colors.text) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${s * 1.5}" ry="${s * 0.42}" fill="${fill}" stroke="${stroke}" stroke-width="${s * 0.045}" opacity="0.96"/>
    <path d="M${cx - s * 1.32},${cy} C${cx - s * 1.12},${cy + s * 1.3} ${cx + s * 1.12},${cy + s * 1.3} ${cx + s * 1.32},${cy} Z" fill="${fill}" stroke="${stroke}" stroke-width="${s * 0.045}" opacity="0.94"/>
    <ellipse cx="${cx}" cy="${cy - s * 0.03}" rx="${s * 1.08}" ry="${s * 0.22}" fill="${colors.brown}" opacity="0.35"/>`;
}

function kettle(cx, cy, s, dark = false) {
  const stroke = dark ? colors.paper : colors.text;
  const fill = dark ? "#2C2923" : "#D8D3C7";
  return `
    <path d="M${cx - s},${cy} C${cx - s * 0.85},${cy - s * 0.72} ${cx + s * 0.85},${cy - s * 0.72} ${cx + s},${cy} C${cx + s * 0.85},${cy + s * 0.9} ${cx - s * 0.85},${cy + s * 0.9} ${cx - s},${cy} Z" fill="${fill}" stroke="${stroke}" stroke-width="${s * 0.045}" opacity="0.9"/>
    <path d="M${cx - s * 0.72},${cy - s * 0.38} C${cx - s * 0.3},${cy - s * 1.16} ${cx + s * 0.3},${cy - s * 1.16} ${cx + s * 0.72},${cy - s * 0.38}" fill="none" stroke="${stroke}" stroke-width="${s * 0.06}" opacity="0.72"/>
    <path d="M${cx + s * 0.95},${cy - s * 0.05} C${cx + s * 1.45},${cy - s * 0.2} ${cx + s * 1.65},${cy + s * 0.08} ${cx + s * 1.86},${cy + s * 0.24}" fill="none" stroke="${stroke}" stroke-width="${s * 0.06}" opacity="0.72"/>`;
}

function tableLine(w, h, y, dark = false) {
  return `<line x1="${w * 0.12}" y1="${y}" x2="${w * 0.88}" y2="${y}" stroke="${dark ? colors.gold : colors.brown}" stroke-width="2" opacity="${dark ? 0.35 : 0.24}"/>`;
}

function label(w, h, title, subtitle, dark = false) {
  return `
    <g opacity="0.78">
      <text x="${w * 0.08}" y="${h * 0.86}" fill="${dark ? colors.paper : colors.text}" font-family="Songti SC, STSong, SimSun, serif" font-size="${Math.max(38, w * 0.037)}" letter-spacing="0">${esc(title)}</text>
      <text x="${w * 0.08}" y="${h * 0.91}" fill="${dark ? colors.muted : colors.muted}" font-family="Georgia, serif" font-size="${Math.max(18, w * 0.015)}" letter-spacing="2">${esc(subtitle)}</text>
    </g>`;
}

function objectFor(type, w, h) {
  const dark = type.includes("dark") || type === "tea-puer";
  const centerX = w * 0.55;
  const centerY = h * 0.48;
  const s = Math.min(w, h) * 0.13;
  if (type.includes("kettle") || type === "object-silver") return kettle(centerX, centerY, s * 1.15, dark);
  if (type === "object-zisha" || type === "tea-puer") return cup(centerX, centerY, s * 1.35, "#5B3E2A", dark ? colors.paper : colors.ink);
  if (type === "object-celadon") return cup(centerX, centerY, s * 1.35, "#A4B3A5", colors.ink);
  if (type === "object-wood") return cup(centerX, centerY, s * 1.35, "#9A7660", colors.ink);
  if (type === "object-incense") return `
    <rect x="${centerX - s * 0.22}" y="${centerY - s * 1.55}" width="${s * 0.44}" height="${s * 2.2}" rx="${s * 0.12}" fill="${colors.brown}" opacity="0.72"/>
    <path d="M${centerX},${centerY - s * 1.75} C${centerX - s * 0.45},${centerY - s * 2.35} ${centerX + s * 0.5},${centerY - s * 2.72} ${centerX + s * 0.05},${centerY - s * 3.2}" fill="none" stroke="${colors.muted}" stroke-width="${s * 0.04}" opacity="0.55"/>
    ${cup(centerX, centerY + s * 0.75, s * 0.9, "#DDD2C1", colors.ink)}`;
  if (type === "object-cloth") return `
    <rect x="${w * 0.26}" y="${h * 0.24}" width="${w * 0.5}" height="${h * 0.46}" fill="#D6CCBA" opacity="0.72"/>
    <path d="M${w * 0.26},${h * 0.32} H${w * 0.76} M${w * 0.34},${h * 0.24} V${h * 0.7}" stroke="${colors.muted}" stroke-width="1.2" opacity="0.28"/>
    ${cup(centerX, centerY + s * 0.1, s * 0.9, "#E9E0D0", colors.ink)}`;
  if (type.includes("seat")) return `
    ${tableLine(w, h, h * 0.55, dark)}
    ${cup(w * 0.36, h * 0.49, s * 0.82, dark ? "#DED5C7" : "#EEE8DC", dark ? colors.paper : colors.ink)}
    ${cup(w * 0.52, h * 0.50, s * 0.7, dark ? "#B7AEA0" : "#D8D1C4", dark ? colors.paper : colors.ink)}
    ${cup(w * 0.68, h * 0.49, s * 0.82, dark ? "#5B3E2A" : "#A4B3A5", dark ? colors.paper : colors.ink)}`;
  if (type.includes("rock")) return `
    ${tableLine(w, h, h * 0.58, dark)}
    ${cup(w * 0.46, h * 0.49, s, "#7B5C47", dark ? colors.paper : colors.ink)}
    <path d="M${w * 0.55},${h * 0.44} C${w * 0.66},${h * 0.36} ${w * 0.74},${h * 0.46} ${w * 0.68},${h * 0.57} C${w * 0.62},${h * 0.64} ${w * 0.51},${h * 0.58} ${w * 0.55},${h * 0.44}Z" fill="${colors.brown}" opacity="0.42"/>`;
  if (type.includes("white")) return `
    ${tableLine(w, h, h * 0.58, dark)}
    ${cup(w * 0.48, h * 0.49, s * 1.05, "#EDE7DA", colors.ink)}
    <circle cx="${w * 0.63}" cy="${h * 0.47}" r="${s * 0.28}" fill="${colors.celadon}" opacity="0.42"/>`;
  if (type === "host") return `
    <path d="M${w * 0.28},${h * 0.42} C${w * 0.39},${h * 0.36} ${w * 0.49},${h * 0.39} ${w * 0.55},${h * 0.48}" fill="none" stroke="${colors.brown}" stroke-width="${s * 0.18}" stroke-linecap="round" opacity="0.42"/>
    ${cup(w * 0.58, h * 0.52, s, "#E7DED0", colors.ink)}
    ${tableLine(w, h, h * 0.62, false)}`;
  return `
    ${tableLine(w, h, h * 0.58, dark)}
    ${cup(w * 0.5, h * 0.48, s, dark ? "#D8D1C4" : "#EEE8DC", dark ? colors.paper : colors.ink)}`;
}

function svgAsset(asset) {
  const dark = asset.type.includes("dark") || asset.type === "tea-puer";
  const { w, h } = asset;
  const isShare = asset.type === "og";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${grain("grain", dark ? 0.12 : 0.18)}</defs>
  ${background(w, h, dark)}
  <rect x="${w * 0.055}" y="${h * 0.07}" width="${w * 0.89}" height="${h * 0.78}" fill="none" stroke="${dark ? colors.gold : colors.ink}" stroke-width="1" opacity="${dark ? 0.18 : 0.1}"/>
  ${objectFor(asset.type, w, h)}
  ${isShare ? `<text x="${w * 0.08}" y="${h * 0.43}" fill="${colors.ink}" font-family="Songti SC, STSong, SimSun, serif" font-size="116">半席</text>${label(w, h, asset.title, asset.subtitle, dark)}` : ""}
</svg>`;
}

function logoSvg({ size = 800, reverse = false, compact = false } = {}) {
  const ink = reverse ? colors.paper : colors.ink;
  const seal = compact ? 32 : 70;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 800 800" role="img" aria-label="半席">
  <path d="M170 118 C120 134 122 210 130 282 C122 376 116 489 140 610 C153 676 206 700 280 690 C356 710 448 702 522 694 C622 708 678 670 688 590 C704 485 690 381 694 285 C706 195 678 126 606 120 C492 102 378 116 268 108 C232 106 199 108 170 118 Z" fill="${ink}"/>
  <path d="M246 214 C302 198 350 214 384 260 C412 202 484 184 554 212 C506 262 466 314 444 388 C428 444 432 512 464 570 C424 560 394 530 382 492 C356 540 318 570 260 578 C304 522 314 454 294 392 C272 323 230 270 184 226 C206 216 226 210 246 214 Z" fill="${reverse ? colors.ink : colors.paper}"/>
  <path d="M270 602 H530" stroke="${reverse ? colors.ink : colors.paper}" stroke-width="18" stroke-linecap="round" opacity="0.86"/>
  <text x="400" y="${compact ? 638 : 652}" text-anchor="middle" fill="${reverse ? colors.ink : colors.paper}" font-family="Songti SC, STSong, SimSun, serif" font-size="${compact ? 96 : 118}" font-weight="600" letter-spacing="6">半席</text>
  <path d="M${seal} ${seal} H${800 - seal} V${800 - seal} H${seal} Z" fill="none" stroke="${ink}" stroke-width="0"/>
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
      if (value) blocks += `<rect x="${x * unit}" y="${y * unit}" width="${unit + 0.4}" height="${unit + 0.4}" fill="${colors.ink}"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <rect width="800" height="800" fill="#FFFFFF"/>
    <g transform="translate(72 72) scale(0.82)">${blocks}</g>
    <rect x="250" y="364" width="300" height="72" fill="#FFFFFF"/>
    <text x="400" y="410" text-anchor="middle" font-family="Songti SC, STSong, SimSun, serif" font-size="28" fill="${colors.ink}">请替换为微信二维码</text>
  </svg>`;
}

async function writeFile(name, content) {
  await fs.writeFile(path.join(outDir, name), content);
}

async function convertSvg(name, svg, width, height, options = {}) {
  if (options.png === true) {
    const png = sharp(Buffer.from(svg)).resize(width, height).png({ compressionLevel: 9 });
    await png.toFile(path.join(outDir, `${name}.png`));
  }
  if (options.jpg !== false) {
    await sharp(Buffer.from(svg)).resize(width, height).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(outDir, `${name}.jpg`));
  }
  if (options.webp !== false) {
    await sharp(Buffer.from(svg)).resize(width, height).webp({ quality: 82 }).toFile(path.join(outDir, `${name}.webp`));
  }
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const logos = [
    ["logo-main", logoSvg({ size: 800 })],
    ["logo-main-reversed", logoSvg({ size: 800, reverse: true })],
    ["logo-header", logoSvg({ size: 240, compact: true })],
  ];

  for (const [name, svg] of logos) {
    await writeFile(`${name}.svg`, svg);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(outDir, `${name}.png`));
  }

  await sharp(Buffer.from(logoSvg({ size: 800 }))).resize(64, 64).png({ compressionLevel: 9 }).toFile(path.join(outDir, "favicon-64.png"));
  await sharp(Buffer.from(qrPlaceholderSvg())).png({ compressionLevel: 9 }).toFile(path.join(outDir, "wechat-qr-placeholder.png"));

  for (const asset of assets) {
    const svg = svgAsset(asset);
    await writeFile(`${asset.name}.svg`, svg);
    await convertSvg(asset.name, svg, asset.w, asset.h, { jpg: true, webp: true, png: false });
  }

  const manifest = [
    "| 文件 | 尺寸 | 用途 |",
    "|---|---:|---|",
    "| logo-main.svg / logo-main.png | 800 x 800 | Logo 主标识，透明背景 |",
    "| logo-main-reversed.svg / logo-main-reversed.png | 800 x 800 | 深色背景反白 Logo |",
    "| logo-header.svg / logo-header.png | 240 x 240 | 页眉 Logo 小图 |",
    "| wechat-qr-placeholder.png | 800 x 800 | 微信二维码占位，需替换为真实二维码 |",
    ...assets.map((asset) => `| ${asset.name}.jpg / .webp | ${asset.w} x ${asset.h} | ${asset.title} |`),
  ].join("\n");
  await writeFile("ASSET-MANIFEST.md", `${manifest}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
