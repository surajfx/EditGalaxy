# EditGalaxy v34 — New Home, collection pages, admin control

## Upload these files to the repo ROOT (same names, replace/add)
index.html, admin.html, sw.js, generate-index.js, generate-share-pages.js,
home-pages.js (new), home-defaults.js (new), sitemap-items.xml,
c/all-templates.html + c/ai-image-prompts.html (new folder),
.github/workflows/auto-embed.yml
No Firebase rules change needed (uses settings/home, already admin-write / public-read).

## What changed
- New Home (index.html): cards in 16:9 + social buttons + live counters. Old hero removed.
- Tap a card -> collection page: cover, title, "date by surajfx", Follow buttons, up to 5 text boxes
  and 4 pictures, category chips, then the template/prompt list.
- Static SEO page per card: c/<slug>.html (built every 30 min by the workflow, listed in sitemap).
- Opened card: trending cards below are the same big 4:5 size, one per row; a card you already opened never repeats.
- Footer like Visulora (description, social icons, Browse / Site / Legal). Cookie banner (Accept / Reject).
- Admin -> "Home Page" tab: heading, sub-text, author, footer text, social links (add any), cards
  (title/short/cover/pictures/5 text boxes each on-off, link target, chips, custom chips).

## Admin quick guide
1. Admin -> Home Page -> "Import built-in cards" (once) -> Edit to add cover pictures/text.
2. New home card -> choose what opens: all templates / all prompts / one template or prompt / any link / text only.
3. Chips = filter buttons (all, trending, ...). Tick which ones show. Custom chips open any template/prompt/link.
4. GitHub -> Actions -> run the workflow once so c/<slug>.html pages are created for new cards.
