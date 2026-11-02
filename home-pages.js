/**
 * home-pages.js
 * ----------------
 * Builds the static, search-engine-friendly page for every Home card
 * (c/<slug>.html). These pages contain the real text, pictures, byline,
 * social buttons and a list of linked templates/prompts, so Google (and
 * AdSense reviewers) see genuine content without running any JavaScript.
 * Visitors can still open the interactive library with one tap.
 */
const { DEFAULT_HOME } = require("./home-defaults.js");

const arr = x => Array.isArray(x) ? x.filter(Boolean) : (x && typeof x === "object" ? Object.values(x).filter(Boolean) : []);
const on = v => v !== false && v !== "false";
const slugify = t => String(t || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
const csv = v => String(v || "").split(",").map(t => t.trim()).filter(Boolean);
const httpUrl = u => { try { const x = new URL(String(u || "")); return /^https?:$/.test(x.protocol) ? x.href : ""; } catch (e) { return ""; } };

function normalizeHome(raw) {
  const o = raw && typeof raw === "object" ? raw : {};
  const hasCards = arr(o.cards).length > 0;
  const cards = (hasCards ? arr(o.cards) : DEFAULT_HOME.cards).map((c, i) => {
    const link = c.link && typeof c.link === "object" ? c.link : { type: "templates" };
    return {
      id: String(c.id || "c" + i), slug: slugify(c.slug || c.title) || "card-" + i, order: Number(c.order) || i + 1, on: on(c.on),
      title: String(c.title || "Untitled"), titleOn: on(c.titleOn), short: String(c.short || ""), shortOn: on(c.shortOn),
      cover: httpUrl(c.cover), coverOn: on(c.coverOn), bylineOn: on(c.bylineOn), socialOn: on(c.socialOn),
      boxes: arr(c.boxes).map(b => ({ heading: String(b.heading || ""), text: String(b.text || ""), on: on(b.on) })),
      imgs: arr(c.imgs).map(b => ({ url: httpUrl(b.url), on: on(b.on) })),
      link: { type: String(link.type || "templates"), itemType: String(link.itemType || "template"), itemId: String(link.itemId || ""), url: String(link.url || "") },
      chipsT: csv(c.chipsT), chipsP: csv(c.chipsP), startFilter: String(c.startFilter || "all"),
      custom: arr(c.custom).map(k => ({ label: String(k.label || ""), type: String(k.type || "url"), value: String(k.value || ""), on: on(k.on) })).filter(k => k.label && k.value),
      updatedAt: Number(c.updatedAt) || 0, createdAt: Number(c.createdAt) || 0,
    };
  }).filter(c => c.on).sort((a, b) => a.order - b.order);
  const social = (arr(o.social).length ? arr(o.social) : DEFAULT_HOME.social).map(x => ({
    label: String(x.label || x.platform || "Link"), platform: String(x.platform || "link"), url: httpUrl(x.url),
    on: on(x.on), card: on(x.card), primary: x.primary === true || x.primary === "true",
  })).filter(x => x.url);
  return { title: String(o.title || DEFAULT_HOME.title), author: String(o.author || DEFAULT_HOME.author), cards, social };
}

function fmtDate(ts) {
  try { return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }); }
  catch (e) { return ""; }
}

const PAGE_CSS = `
.hp-cover{aspect-ratio:16/9;border-radius:22px;overflow:hidden;background:#10121c;margin-bottom:6px}
.hp-cover img{width:100%;height:100%;object-fit:cover;display:block}
.hp-by{display:inline-flex;gap:6px;align-items:center;padding:9px 15px;border-radius:999px;background:var(--panel);border:1px solid var(--line);color:var(--muted);font-size:14px;margin:0 0 6px}
.hp-by b{color:var(--accent)}
.hp-social{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0}
.hp-btn{display:inline-block;padding:11px 18px;border-radius:999px;border:1px solid var(--line);background:var(--panel);color:#fff;text-decoration:none;font-weight:800;font-size:14px}
.hp-btn.primary{border:0;background:linear-gradient(135deg,#f58529,#dd2a7b 55%,#8134af)}
.hp-box{margin:26px 0}
.hp-box h2{margin:0 0 12px;padding-left:14px;border-left:5px solid #ff9a1f;font-size:24px;line-height:1.25}
.hp-fig{margin:20px 0}.hp-fig img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:20px;display:block}
.hp-chips{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}
.hp-chip{padding:8px 13px;border-radius:999px;border:1px solid var(--line);background:var(--panel);color:#fff;text-decoration:none;font-weight:800;font-size:13px}
.hp-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:12px}
.hp-item{display:block;color:#fff;text-decoration:none;border:1px solid var(--line);border-radius:16px;background:var(--panel);overflow:hidden}
.hp-item img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block;background:#10121c}
.hp-item span{display:block;padding:10px 12px;font-weight:800;font-size:13px}
.hp-cta{display:block;text-align:center;margin:22px 0;padding:16px;border-radius:16px;font-weight:900;text-decoration:none;color:#071018;background:linear-gradient(135deg,#8bdcff,#7b5bff)}
@media(max-width:600px){.hp-grid{grid-template-columns:1fr 1fr}}
`;

/**
 * ctx = { SITE_URL, esc, safeFilename, BASE_CSS, NAV, FOOTER, imgFor, displayTitle }
 * Returns the full HTML string, or null when this card has no page of its own.
 */
function buildCardPage(card, home, templates, prompts, ctx) {
  const t = card.link.type;
  if (t === "item" || t === "url") return null; // these cards open another page directly
  const { SITE_URL, esc, safeFilename, BASE_CSS, NAV, FOOTER, imgFor, displayTitle } = ctx;
  const slug = card.slug;
  const pageUrl = `${SITE_URL}/c/${slug}.html`;
  const libUrl = `${SITE_URL}/#c/${encodeURIComponent(slug)}`;
  const date = fmtDate(card.updatedAt || card.createdAt || Date.now());
  const paragraphs = txt => String(txt || "").split(/\n+/).map(x => x.trim()).filter(Boolean).map(x => `<p>${esc(x)}</p>`).join("");

  const boxes = card.boxes.filter(b => b.on && (b.text || b.heading));
  const imgs = card.imgs.filter(b => b.on && b.url);
  let body = "";
  if (card.coverOn && card.cover) body += `<div class="hp-cover"><img src="${esc(card.cover)}" alt="${esc(card.title)}"></div>`;
  if (card.titleOn) body += `<h1>${esc(card.title)}</h1>`;
  if (card.bylineOn) body += `<div class="hp-by"><span>${esc(date)}</span> <span>by</span> <b>${esc(home.author)}</b></div>`;
  if (card.socialOn) {
    const soc = home.social.filter(x => x.on && x.card);
    if (soc.length) body += `<div class="hp-social">${soc.map(x => `<a class="hp-btn${x.primary ? " primary" : ""}" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join("")}</div>`;
  }
  const n = Math.max(boxes.length, imgs.length);
  for (let i = 0; i < n; i++) {
    const b = boxes[i];
    if (b) body += `<section class="hp-box">${b.heading ? `<h2>${esc(b.heading)}</h2>` : ""}${paragraphs(b.text)}</section>`;
    const im = imgs[i];
    if (im) body += `<figure class="hp-fig"><img loading="lazy" src="${esc(im.url)}" alt="${esc(card.title)} — image ${i + 2}"></figure>`;
  }

  // category chips as real links into the interactive library
  const cats = t === "templates" ? card.chipsT : t === "prompts" ? card.chipsP : [];
  const chipLinks = cats.map(f => `<a class="hp-chip" href="${SITE_URL}/#c/${encodeURIComponent(slug)}/${encodeURIComponent(f)}">${esc(f.replace(/\b\w/g, m => m.toUpperCase()))}</a>`).join("");
  if (chipLinks) body += `<h2>Browse by category</h2><div class="hp-chips">${chipLinks}</div>`;
  body += `<a class="hp-cta" href="${libUrl}">Open the interactive ${t === "prompts" ? "prompt" : "template"} library →</a>`;

  // list of real item pages (genuine internal links)
  const type = t === "prompts" ? "prompt" : t === "templates" ? "template" : null;
  if (type) {
    const src = type === "template" ? templates : prompts;
    const num = x => { const v = Number(x.num ?? x.number); return Number.isFinite(v) ? v : -1; };
    const list = [...src].sort((a, b) => num(b) - num(a)).slice(0, 24);
    if (list.length) {
      body += `<h2>${type === "template" ? "Latest templates" : "Latest prompts"}</h2><div class="hp-grid">` +
        list.map(x => `<a class="hp-item" href="${SITE_URL}/${type}/${safeFilename(x.id)}.html"><img loading="lazy" src="${esc(imgFor(x))}" alt="${esc(displayTitle(x, type))}"><span>${esc(displayTitle(x, type))}</span></a>`).join("") + `</div>`;
    }
  }

  const metaDesc = (card.short || (boxes[0] && boxes[0].text) || card.title).replace(/\s+/g, " ").slice(0, 155);
  const ogImage = card.cover || `${SITE_URL}/editgalaxy-ai-icon.png`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(card.title)} | EditGalaxy</title>
<meta name="description" content="${esc(metaDesc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${pageUrl}">
<meta property="og:type" content="article">
<meta property="og:url" content="${pageUrl}">
<meta property="og:title" content="${esc(card.title)} — EditGalaxy">
<meta property="og:description" content="${esc(metaDesc)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:site_name" content="EditGalaxy">
<meta name="twitter:card" content="summary_large_image">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2083292378377205" crossorigin="anonymous"></script>
<style>${BASE_CSS}${PAGE_CSS}</style>
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

module.exports = { normalizeHome, buildCardPage };
