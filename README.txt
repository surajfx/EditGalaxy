EditGalaxy FINAL v21 FIXED

- Preserves the V14-style UI and existing pages.
- Public Template/Prompt usage analytics use Firebase atomic increments.
- Trending uses real Use Template / Copy Prompt activity, including timestamp history.
- Analytics updates optimistically in the UI and persist to Firebase.
- Search clearing restores all cards.
- Admin authentication and existing management pages are preserved.
- This package contains only one project root; no duplicate nested v19 project.

V22: Trending ranks by recent 7-day activity first, then 24-hour activity, then total activity. Use/Copy analytics use Firebase transactions and daily counters.


V22 SEARCH/TRENDING FIXES
- Fixed missing runSectionSearch handler; number, #number, title and full-text search now work.
- Search updates live while typing; clearing the field restores the full list. Enter and Escape are supported.
- Fixed missing AI scoreItem function; AI Search now finds exact number/title matches reliably.
- Trending now shows only templates/prompts with real rolling 7-day activity; no static hardcoded trending cards.
- Trending ranking uses 7-day activity, then 24-hour activity, then total activity.
- Desktop hides the mobile floating bottom navigation; mobile navigation remains unchanged.
- Firebase content writes are restricted to the configured admin UID; public analytics increments remain allowed by validation rules.
