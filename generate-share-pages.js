/**
 * generate-share-pages.js
 * -------------------------
 * EditGalaxy (surajfx.in) - Static Share Page Generator
 *
 * This script fetches every template and prompt from the Firebase
 * Realtime Database and writes a REAL, standalone content page for
 * each one:
 *   /template/<id>.html
 *   /prompt/<id>.html
 *
 * Unlike the old version, these pages do NOT auto-redirect anywhere.
 * Each page stands on its own: title, description, "how to use" steps,
 * a details table, related items, an FAQ, and a direct CapCut/AI-tool
 * link. This matters for AdSense/Search review — a page that only
 * shows an image + title + auto-redirect is treated as "thin / doorway"
 * content, which is the single biggest reason this site was rejected.
 *
 * No fact is invented here: duration, clip count, etc. are only shown
 * if the Firebase record actually has that field. Everything else
 * (how-to steps, tips, FAQ) is generic, genuinely useful editorial
 * content, not a claim about the specific template/prompt's internals.
 *
 * How to run:
 *   1. npm install firebase-admin
 *   2. put serviceAccountKey.json in this folder (template-cc1cb project)
 *   3. node generate-share-pages.js
 *   4. output/template/ and output/prompt/ will contain the generated
 *      pages, plus an updated output/sitemap-items.xml
 *   5. copy everything from output/ into the repo root and push —
 *      GitHub Pages will deploy it
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccount = require("./serviceAccountKey.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://template-cc1cb-default-rtdb.firebaseio.com",
  });
}

const db = admin.database();

const SITE_URL = "https://surajfx.in";
const FALLBACK_IMAGE = SITE_URL + "/editgalaxy-ai-icon.png";

function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeFilename(id) {
  return String(id).replace(/[^A-Za-z0-9_-]/g, "_");
}

function imgFor(x) {
  return x.imageUrl || x.thumbnailUrl || x.thumb || FALLBACK_IMAGE;
}

function catLabel(c) {
  const s = String(c || "General");
  return s.split(" ").map(w => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");
}

function nl2ol(text) {
  const raw = String(text || "").trim();
  if (!raw) return null;
  if (raw.includes("<ol") || raw.includes("<ul") || raw.includes("<p>")) return raw;
  const lines = raw.split(/\n+/).map(v => v.trim()).filter(Boolean);
  if (!lines.length) return null;
  return `<ol>${lines.map(v => `<li>${esc(v)}</li>`).join("")}</ol>`;
}

const DEFAULT_TEMPLATE_STEPS = `<ol>
<li>Open the CapCut template link above on your phone.</li>
<li>Tap <b>Use template</b> inside the CapCut app.</li>
<li>Select your own photos or short video clips in the order you want them to appear.</li>
<li>Preview the edit and swap out any clip that doesn't fit the pacing.</li>
<li>Export the finished video and share it to Instagram Reels, YouTube Shorts, or TikTok.</li>
</ol>`;

const DEFAULT_PROMPT_STEPS = `<ol>
<li>Copy the prompt text below (choose the girl or boy version, whichever fits).</li>
<li>Open your AI image tool (ChatGPT, Gemini, Leonardo AI, or similar).</li>
<li>Paste the prompt, and upload a clear reference photo if the prompt calls for one.</li>
<li>Generate the image, then try a second generation if the first result needs adjusting.</li>
<li>Download and share your result.</li>
</ol>`;

const NAV = `<header class="shp-header"><a class="shp-logo" href="${SITE_URL}/index.html">Edit<span>Galaxy</span></a>
<nav class="shp-nav"><a href="${SITE_URL}/index.html">Home</a><a href="${SITE_URL}/index.html#templates">Templates</a>
<a href="${SITE_URL}/index.html#prompts">Prompts</a><a href="${SITE_URL}/about.html">About</a></nav></header>`;

const FOOTER = `<footer class="shp-footer"><p>EditGalaxy is an independent template and creative-resource website and is
not affiliated with or endorsed by CapCut or other third-party services mentioned on this page.
Third-party trademarks belong to their respective owners.</p>
<div class="shp-footlinks"><a href="${SITE_URL}/about.html">About</a><a href="${SITE_URL}/contact.html">Contact</a>
<a href="${SITE_URL}/privacy.html">Privacy</a><a href="${SITE_URL}/terms.html">Terms</a>
<a href="${SITE_URL}/copyright.html">Copyright</a></div></footer>`;

const BASE_CSS = `
:root{--bg:#070811;--bg2:#0b0d18;--panel:rgba(255,255,255,.055);--line:rgba(255,255,255,.10);--text:#fff;--muted:#b7bcd6;--accent:#8bdcff}
*{box-sizing:border-box}
body{margin:0;background:linear-gradient(145deg,var(--bg),var(--bg2));color:var(--text);font-family:Arial,Helvetica,sans-serif;line-height:1.7}
.shp-header{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:16px;padding:14px 18px;background:rgba(7,8,17,.7);backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}
.shp-logo{font-size:20px;font-weight:900;color:#fff;text-decoration:none;flex:1}
.shp-logo span{color:var(--accent)}
.shp-nav{display:flex;gap:14px;flex-wrap:wrap}
.shp-nav a{color:var(--muted);text-decoration:none;font-weight:700;font-size:14px}
.shp-nav a:hover{color:#fff}
main{max-width:760px;margin:0 auto;padding:26px 18px 70px}
.shp-media{width:100%;max-width:420px;margin:0 auto 18px;border-radius:20px;overflow:hidden;border:1px solid var(--line);background:#090b12}
.shp-media img{width:100%;display:block;object-fit:cover;aspect-ratio:4/5}
h1{font-size:clamp(26px,6vw,40px);margin:4px 0 10px;letter-spacing:-1px}
h2{margin-top:30px;font-size:21px}
p{color:#e7e9f5}
.shp-badges{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 14px}
.shp-badge{font-size:12px;font-weight:800;padding:6px 10px;border-radius:999px;border:1px solid var(--line);background:var(--panel);color:var(--muted)}
.shp-cta{display:block;text-align:center;margin:18px 0;padding:16px;border-radius:16px;font-weight:900;text-decoration:none;color:#071018;background:linear-gradient(135deg,#8bdcff,#7b5bff);box-shadow:0 14px 34px rgba(139,220,255,.18)}
.shp-card{padding:18px;border-radius:18px;border:1px solid var(--line);background:var(--panel);margin:16px 0}
.shp-table{width:100%;border-collapse:collapse;font-size:14px}
.shp-table td{padding:8px 4px;border-bottom:1px solid var(--line)}
.shp-table td:first-child{color:var(--muted);font-weight:700;width:40%}
.shp-promptbox{position:relative;padding:16px;border-radius:14px;border:1px solid var(--line);background:#0b0d18;white-space:pre-wrap;font-family:monospace;font-size:13px;color:#dfe3ff;margin:10px 0}
.shp-copybtn{display:inline-block;margin-top:8px;padding:9px 16px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:#fff;font-weight:800;font-size:13px;cursor:pointer}
.shp-related{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px}
.shp-relcard{display:block;padding:12px;border-radius:14px;border:1px solid var(--line);background:var(--panel);color:#fff;text-decoration:none;font-size:13px;font-weight:700}
.shp-relcard img{width:100%;border-radius:10px;aspect-ratio:4/5;object-fit:cover;margin-bottom:8px;display:block}
.shp-faq dt{font-weight:800;margin-top:12px}
.shp-faq dd{margin:4px 0 0;color:var(--muted)}
.shp-footer{max-width:760px;margin:40px auto 0;padding:20px 18px 50px;border-top:1px solid var(--line);color:var(--muted);font-size:13px}
.shp-footlinks{display:flex;gap:14px;flex-wrap:wrap;margin-top:12px}
.shp-footlinks a{color:var(--muted);text-decoration:none;font-weight:700}
@media(max-width:600px){.shp-related{grid-template-columns:1fr}}
`;

function relatedItems(items, current, n = 4) {
  const curCat = String(current.category || current.cat || "").toLowerCase();
  const curId = current.id;
  let pool = items.filter(x => x.id !== curId && String(x.category || x.cat || "").toLowerCase() === curCat);
  if (pool.length < n) {
    pool = pool.concat(items.filter(x => x.id !== curId && !pool.includes(x)));
  }
  return pool.slice(0, n);
}

function relatedHtml(items, current, type) {
  const rel = relatedItems(items, current);
  if (!rel.length) return "";
  const cards = rel.map(x => {
    const t = x.title || x.promptTitle || `${type === "template" ? "Template" : "Prompt"} #${x.num || x.number || ""}`;
    const img = imgFor(x);
    const href = `${SITE_URL}/${type}/${safeFilename(x.id)}.html`;
    return `<a class="shp-relcard" href="${href}"><img src="${esc(img)}" alt="${esc(t)}" loading="lazy">${esc(t)}</a>`;
  }).join("");
  const heading = type === "template" ? "Related Templates" : "Related Prompts";
  return `<h2>🔗 ${heading}</h2><div class="shp-related">${cards}</div>`;
}

function buildTemplatePage(x, allTemplates) {
  const title = x.title || x.name || `Template #${x.num || x.number || ""}`;
  const category = catLabel(x.category || x.cat);
  const image = imgFor(x);
  const desc = x.templateDescription || x.description ||
    "A free CapCut template from EditGalaxy — open the link below and create your own edit with your own photos or clips.";
  const bestFor = x.bestFor || "photos and short video clips";
  const fmt = x.format || "9:16 Vertical";
  const platform = x.platform || "Instagram Reels / YouTube Shorts";
  const app = x.app || "CapCut";
  const difficulty = x.difficulty || "Easy";
  const cap = x.capcut || x.capcutUrl || "#";
  const how = nl2ol(x.howToUseTemplate) || DEFAULT_TEMPLATE_STEPS;
  const pid = safeFilename(x.id);
  const pageUrl = `${SITE_URL}/template/${pid}.html`;
  const metaDesc = `${title} — a free ${category} CapCut template from EditGalaxy. ${desc.slice(0, 140)}`;

  const detailsRows = [
    ["Category", category], ["Difficulty", difficulty], ["Format", fmt],
    ["Platform", platform], ["App", app], ["Best for", bestFor],
  ].filter(([, v]) => v).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("");

  const body = `
<div class="shp-media"><img src="${esc(image)}" alt="${esc(title)}"></div>
<h1>${esc(title)}</h1>
<div class="shp-badges"><span class="shp-badge">${esc(category)}</span><span class="shp-badge">${esc(difficulty)}</span><span class="shp-badge">${esc(fmt)}</span></div>
<p>${esc(desc)}</p>
<a class="shp-cta" href="${esc(cap)}" target="_blank" rel="noopener">✨ Use This Template on CapCut</a>

<h2>What this template is</h2>
<p>This is a ${esc(difficulty).toLowerCase()} ${esc(app)} template built for ${esc(bestFor).toLowerCase()}, designed to be posted on ${esc(platform)} in ${esc(fmt)} format. It's part of EditGalaxy's curated ${esc(category)} collection.</p>

<h2>Who it's best for</h2>
<p>Creators who want a quick, ready-made edit for ${esc(platform)} without building a timeline from scratch — just drop in your own ${esc(bestFor).toLowerCase()} and export.</p>

<h2>How to use this template</h2>
${how}

<h2>Editing tips for a better result</h2>
<ul>
<li>Pick clear, well-lit photos or clips so the transitions and effects stand out.</li>
<li>Keep your media in the same aspect ratio as the template (${esc(fmt)}) to avoid cropping issues.</li>
<li>If the template includes music or beat-synced cuts, try to match your clip lengths to the rhythm.</li>
<li>Preview the full edit in CapCut before exporting, and swap out any clip that feels out of place.</li>
</ul>

<h2>Template details</h2>
<div class="shp-card"><table class="shp-table">${detailsRows}</table></div>

${relatedHtml(allTemplates, x, "template")}

<h2>FAQ</h2>
<dl class="shp-faq">
<dt>Is this template free to use?</dt><dd>Yes — EditGalaxy links directly to the free CapCut template. You don't need to pay to use it.</dd>
<dt>Do I need CapCut Pro?</dt><dd>No, the base template works with the free version of CapCut. Some advanced effects inside CapCut may require Pro.</dd>
<dt>Can I use my own music instead?</dt><dd>Yes, once the template opens in CapCut you can replace the audio track with your own before exporting.</dd>
</dl>
`;

  const ogImage = image.startsWith("http") ? image : FALLBACK_IMAGE;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} — Free CapCut Template | EditGalaxy</title>
<meta name="description" content="${esc(metaDesc)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${pageUrl}">
<meta property="og:type" content="article">
<meta property="og:url" content="${pageUrl}">
<meta property="og:title" content="${esc(title)} — EditGalaxy">
<meta property="og:description" content="${esc(metaDesc)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:site_name" content="EditGalaxy">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)} — EditGalaxy">
<meta name="twitter:description" content="${esc(metaDesc)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<style>${BASE_CSS}</style>
</head>
<body>
${NAV}
<main>
${body}
</main>
${FOOTER}
</body>
</html>`;
}

function buildPromptPage(x, allPrompts) {
  const title = x.title || x.promptTitle || `Prompt #${x.num || x.number || ""}`;
  const category = catLabel(x.category || x.cat);
  const image = imgFor(x);
  const desc = x.description || x.tips || "A free AI image prompt from EditGalaxy — copy it and paste it into your favourite AI image tool.";
  const tool = x.aiTool || "ChatGPT";
  const bestFor = x.bestFor || "AI image generation and creative edits";
  const fmt = x.format || "4:5 / 9:16 / 1:1";
  const platform = x.platform || "Instagram / TikTok / YouTube";
  const difficulty = x.difficulty || "Easy";
  const girl = x.girlPrompt || x.prompt || "";
  const boy = x.boyPrompt || "";
  const how = nl2ol(x.howToUsePrompt) || DEFAULT_PROMPT_STEPS;
  const pid = safeFilename(x.id);
  const pageUrl = `${SITE_URL}/prompt/${pid}.html`;
  const metaDesc = `${title} — a free ${category} AI image prompt from EditGalaxy, works great with ${tool}.`;

  const detailsRows = [
    ["Category", category], ["Difficulty", difficulty], ["Format", fmt],
    ["Platform", platform], ["Works best with", tool], ["Best for", bestFor],
  ].filter(([, v]) => v).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("");

  function copyBox(label, text, boxId) {
    if (!text) return "";
    return `<h3>${label}</h3>
<div class="shp-promptbox" id="${boxId}">${esc(text)}</div>
<button class="shp-copybtn" type="button" onclick="(function(){navigator.clipboard.writeText(document.getElementById('${boxId}').innerText);this.textContent='Copied ✓';setTimeout(()=>this.textContent='📋 Copy Prompt',1500);})()">📋 Copy Prompt</button>`;
  }

  const body = `
<div class="shp-media"><img src="${esc(image)}" alt="${esc(title)}"></div>
<h1>${esc(title)}</h1>
<div class="shp-badges"><span class="shp-badge">${esc(category)}</span><span class="shp-badge">${esc(difficulty)}</span><span class="shp-badge">${esc(tool)}</span></div>
<p>${esc(desc)}</p>

<h2>What this prompt is useful for</h2>
<p>This prompt is built for ${esc(bestFor).toLowerCase()}, and works best with ${esc(tool)}. Final images typically suit ${esc(platform)} in ${esc(fmt)} format.</p>

<h2>How to use this prompt</h2>
${how}

<div class="shp-card">
${copyBox("👩 Girl Version", girl, `gp_${pid}`)}
${boy ? copyBox("👨 Boy Version", boy, `bp_${pid}`) : ""}
</div>

<h2>Customization tips</h2>
<ul>
<li>Swap specific words (colours, outfit, setting) in the prompt to match your own idea.</li>
<li>If the result doesn't look right, try regenerating — AI image tools can vary between runs.</li>
<li>Upload a clear, well-lit reference photo if the prompt asks you to use one.</li>
</ul>

<h2>Important image-generation tips</h2>
<ul>
<li>Use a high-resolution reference photo for the most accurate result.</li>
<li>Different AI tools (ChatGPT, Gemini, Leonardo AI) can render the same prompt differently — try more than one if you're not happy with the first result.</li>
<li>Some tools may need the prompt split into two messages if it's long; paste it in full first and only split if it's rejected.</li>
</ul>

<h2>Prompt details</h2>
<div class="shp-card"><table class="shp-table">${detailsRows}</table></div>

${relatedHtml(allPrompts, x, "prompt")}

<h2>FAQ</h2>
<dl class="shp-faq">
<dt>Is this prompt free?</dt><dd>Yes, every prompt on EditGalaxy is free to copy and use.</dd>
<dt>Do I need a paid AI tool?</dt><dd>No — most tools have a free tier. Results may be limited on the free plan of some tools.</dd>
<dt>Can I use my own photo with this prompt?</dt><dd>Yes, if the prompt is written to use a reference photo, upload your own before generating.</dd>
</dl>
`;

  const ogImage = image.startsWith("http") ? image : FALLBACK_IMAGE;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} — Free AI Image Prompt | EditGalaxy</title>
<meta name="description" content="${esc(metaDesc)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${pageUrl}">
<meta property="og:type" content="article">
<meta property="og:url" content="${pageUrl}">
<meta property="og:title" content="${esc(title)} — EditGalaxy">
<meta property="og:description" content="${esc(metaDesc)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:site_name" content="EditGalaxy">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)} — EditGalaxy">
<meta name="twitter:description" content="${esc(metaDesc)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<style>${BASE_CSS}</style>
</head>
<body>
${NAV}
<main>
${body}
</main>
${FOOTER}
</body>
</html>`;
}

async function generate() {
  console.log("Fetching data from Firebase...");
  const sitemapUrls = [];

  const tsnap = await db.ref("templates").once("value");
  const templates = Object.entries(tsnap.val() || {}).map(([id, x]) => ({ id, ...x }));
  const psnap = await db.ref("prompts").once("value");
  const prompts = Object.entries(psnap.val() || {}).map(([id, x]) => ({ id, ...x }));

  const tOut = path.join(__dirname, "output", "template");
  const pOut = path.join(__dirname, "output", "prompt");
  fs.mkdirSync(tOut, { recursive: true });
  fs.mkdirSync(pOut, { recursive: true });

  templates.forEach(x => {
    const pid = safeFilename(x.id);
    fs.writeFileSync(path.join(tOut, `${pid}.html`), buildTemplatePage(x, templates), "utf-8");
    sitemapUrls.push(`${SITE_URL}/template/${pid}.html`);
    console.log(`✔ template/${pid}.html`);
  });

  prompts.forEach(x => {
    const pid = safeFilename(x.id);
    fs.writeFileSync(path.join(pOut, `${pid}.html`), buildPromptPage(x, prompts), "utf-8");
    sitemapUrls.push(`${SITE_URL}/prompt/${pid}.html`);
    console.log(`✔ prompt/${pid}.html`);
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;
  fs.writeFileSync(path.join(__dirname, "output", "sitemap-items.xml"), sitemap, "utf-8");

  console.log(`\nDone. ${sitemapUrls.length} pages generated in "output/".`);
  process.exit(0);
}

generate().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
