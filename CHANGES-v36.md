# v36 — Hide / Show for templates & prompts (on top of v35)
Upload these 6 files to the repo root (same paths):
admin.html, index.html, sw.js, generate-index.js, generate-share-pages.js, .github/workflows/auto-embed.yml

Admin -> Add Template / Add Prompt page -> "Manage" list:
  [All] [Visible] [Hidden] filter, and on every card a "Hide" / "Show" button. Edit keeps the hidden state.
Hidden items: gone from the website, search, trending, counters, direct links, sitemap and their static page
(removed by the 30-min workflow). Show them again any time - nothing is deleted.
