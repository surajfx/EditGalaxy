EditGalaxy FINAL v24 FIXED

Preserves the v22 UI/design and fixes only the broken search + live trending/analytics flow.

Fixes:
- AI Search now has a working scorer and search action.
- Template/Prompt section Search buttons are globally callable from HTML.
- Search supports Enter and live typing; clearing returns all cards.
- Template use analytics uses an atomic Firebase update and waits for the write before opening CapCut.
- Prompt copy analytics uses an atomic Firebase update.
- Trending is activity-based from recent use/copy data.
- Trending sections refresh live when Firebase data changes.
- Detail-page Trending refreshes immediately after a local use/copy and after Firebase sync.
- No UI redesign or data migration is performed.
