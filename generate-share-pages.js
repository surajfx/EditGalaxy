/**
 * generate-share-pages.js
 * -------------------------
 * EditGalaxy (surajfx.in) - Static Share Page Generator
 *
 * Ei script ta Firebase Realtime Database-er 'templates' ar 'prompts'
 * theke sob data fetch kore, PROTITA template/prompt-er jonno alada
 * static HTML page banai:
 *   /output/template/<id>.html
 *   /output/prompt/<id>.html
 *
 * Kaj ki kore:
 *   - Prottek page-e real title, real preview image niye proper
 *     Open Graph tags boshai (WhatsApp/Instagram/Twitter-e share korle
 *     sothik thumbnail + title dekhabe)
 *   - Page load hole 0.6 sec por automatic mul app-e (index.html#type/id)
 *     redirect kore, jate full interactive experience age-r moto e thake
 *   - Crawler bot (WhatsApp/Google) JS run kore na, tai sudhu static
 *     content ta dekhbe -> proper preview + SEO
 *
 * Kivabe run korbe:
 *   1. npm install firebase-admin
 *   2. serviceAccountKey.json ei folder-e rakhbo (template-cc1cb project-er)
 *   3. Terminal-e: node generate-share-pages.js
 *   4. output/template/ ar output/prompt/ folder-e sob HTML file toiri hoi jabo
 *   5. output/ folder-er content root-e copy kore GitHub-e push korle
 *      GitHub Pages automatic deploy kore dibe
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

function imgFor(x) {
  return (
    x.imageUrl || x.imageURL || x.imageLink || x.previewImage ||
    x.previewImageUrl || x.thumbnail || x.thumbnailUrl || x.thumb ||
    FALLBACK_IMAGE
  );
}

function catLabel(c) {
  const s = String(c || "General");
  return s.split(" ").map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(" ");
}

// ---------- HTML Template for one share page ----------
function buildHTML(x, type) {
  const isTemplate = type === "template";
  const rawTitle = x.title || x.name || `${isTemplate ? "Template" : "Prompt"} #${x.num || x.number || ""}`;
  const title = esc(rawTitle);
  const category = catLabel(x.category || x.cat);
  const image = imgFor(x);
  const desc = isTemplate
    ? `${title} — Free CapCut ${category} template by EditGalaxy. Tap to use instantly.`
    : `${title} — ${category} AI image prompt by EditGalaxy. Free Girl & Boy version, copy & use instantly.`;
  const id = x.id;
  const pageUrl = `${SITE_URL}/${type}/${id}.html`;
  const redirectUrl = `${SITE_URL}/index.html#${type}/${id}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — EditGalaxy</title>

<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${pageUrl}">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="${pageUrl}">
<meta property="og:title" content="${title} — EditGalaxy">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${image}">
<meta property="og:site_name" content="EditGalaxy">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title} — EditGalaxy">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${image}">

<!-- Schema.org -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "${title}",
  "image": "${image}",
  "url": "${pageUrl}",
  "author": { "@type": "Organization", "name": "EditGalaxy" }
}
</script>

<meta http-equiv="refresh" content="0.6;url=${redirectUrl}">
<style>
  body{background:#0b0f1a;color:#f0f0ff;font-family:sans-serif;margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center}
  img{max-width:320px;width:100%;border-radius:16px;margin-bottom:16px;box-shadow:0 8px 30px rgba(0,0,0,0.5)}
  h1{font-size:20px;margin:0 0 6px}
  p{color:#9aa3c9;font-size:13px;margin:0 0 20px}
  a.btn{background:linear-gradient(135deg,#4f7cff,#7b5bff);color:#fff;text-decoration:none;padding:12px 24px;border-radius:100px;font-weight:700;font-size:14px}
</style>
</head>
<body>
  <img src="${image}" alt="${title}">
  <h1>${title}</h1>
  <p>${category} · Opening EditGalaxy...</p>
  <a class="btn" href="${redirectUrl}">Open →</a>
</body>
</html>`;
}

async function generateFor(refPath, type, sitemapUrls) {
  const snap = await db.ref(refPath).once("value");
  const data = snap.val() || {};
  const items = Object.entries(data).map(([id, x]) => ({ id, ...x }));

  if (!items.length) {
    console.log(`Kono ${type} paoa jayni.`);
    return;
  }

  const outputDir = path.join(__dirname, "output", type);
  fs.mkdirSync(outputDir, { recursive: true });

  items.forEach((x) => {
    const html = buildHTML(x, type);
    const filePath = path.join(outputDir, `${x.id}.html`);
    fs.writeFileSync(filePath, html, "utf-8");
    console.log(`✔ Generated: /${type}/${x.id}.html`);
    sitemapUrls.push(`${SITE_URL}/${type}/${x.id}.html`);
  });
}

async function generate() {
  console.log("Firebase theke data fetch kora hocche...");
  const sitemapUrls = [];

  await generateFor("templates", "template", sitemapUrls);
  await generateFor("prompts", "prompt", sitemapUrls);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc></url>
${sitemapUrls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, "output", "sitemap-items.xml"), sitemap, "utf-8");

  console.log(`\nTotal ${sitemapUrls.length} ta share page generate hoise. "output/" folder check korun.`);
  process.exit(0);
}

generate().catch((err) => {
  console.error("Error hoise:", err);
  process.exit(1);
});

