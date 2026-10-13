# EditGalaxy v33 — ki ki bodlalo

## Website (index.html)
- Header e EditGalaxy logo r pase animated 🎁 **Wishes** button. Click korle https://wishverse.surajfx.in/ site er bhitorei full-screen e khole (Back button / phone back kaj kore).
- Menu: Home, Templates, Prompts, Wishes, Privacy Policy, Trust & Safety. (About/Contact/Terms/Copyright footer e gelo.)
- Card er niche #number default hidden. Admin > Site Settings theke on/off.
- "Join Our Community" hero theke gelo; protita card er Description box er niche WhatsApp + Telegram logo shoho box.
- Hero text notun (boro, simple, 3 step).
- Template: "Use Template on CapCut" er niche **Text Prompt** button (popup + Copy), Extra Button 1 & 2.
- Prompt: Extra Button 1 & 2.
- Trending (7 din): jei card e last 7×24 ghonta e beshi click/copy, shei age. 8 din purono click count hoy na.
- Template card e trending section = 5 trending template + 5 trending prompt; prompt card e o tai.
- Click tracking: ager moto navigation er age wait kore, kintu max 2.5s.

## Admin (admin.html)
- Notun **Site Settings** tab: card number, Wishes button (on/off, naam, link), How-to / Share / Video / Info / Links / Community / Trending on-off, community links.
- Template & Prompt Add/Edit: Extra Button 1, 2 (enable/disable, naam, link); Template e Text Prompt button (enable/disable, naam, text).
- Bug fix: Last 7d / 30d analytics ager shob somoy 0 dekhato (key "timestamp_random" ke number banate giye NaN hoto).

## Share pages / generator
- og:image / page image: website er moto shob image field check kore.
- Title: nam na thakle "Hindi CapCut Template #264" (age shudhu "Template #264").
- Meta description word er majhe kete jay na; "a easy" → "an easy" bhul fix.
- Category onujayi alada paragraph, text prompt thakle share page e o dekhay.
- generate-index.js ekhon settings/site o embed kore.

## ⚠ Je kaj tomake korte hobe
1. Firebase Console > Realtime Database > Rules e `firebase-rules.json` er notun `"settings"` block ta add koro (nahole Site Settings save hobe na; site default dhore cholbe).
2. Folder ta GitHub e push koro, tarpor Actions theke "Run workflow" chapo (share page r index regenerate hobe).
3. ~90 ta template (#264–#368) er database e kono preview image nei. Admin > Edit diye image link dao.
