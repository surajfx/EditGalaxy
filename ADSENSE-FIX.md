# EditGalaxy — v2 Content Pages (AdSense fix)

## Ki problem chilo
V1 share pages gulo 0.6 second por automatic redirect hoye jeto.
Google/AdSense ei dhoroner page ke "doorway / low value content"
bole reject korechilo.

## Ki fix holo
- generate-share-pages.js ekhon v2 — KONO auto redirect NAI.
- Protita template/prompt er jonno full standalone content page:
  image, title, category, original description, How-to-Use guide,
  prompt copy boxes, related links, footer.
- robots.txt fixed: admin pages crawl block + sitemap path correct.

## Next steps (apnake korte hobe)
1. `npm install firebase-admin`
2. `serviceAccountKey.json` ei folder-e rakhun
3. `node generate-share-pages.js`
4. `output/template/` and `output/prompt/` folders-er sob file
   repo-r root-er `template/` and `prompt/` folder-e copy korun
   (164 ta purano redirect file REPLACE hobe)
5. `output/sitemap-items.xml` root-e copy korun
6. Commit + push korun, GitHub Pages automatic deploy korbe
7. Search Console-e "Removals" check korun + sitemap resubmit
8. 7-10 din por Google AdSense-e abar apply korun
