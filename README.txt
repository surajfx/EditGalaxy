EditGalaxy FINAL v21 FIXED

- Preserves the V14-style UI and existing pages.
- Public Template/Prompt usage analytics use Firebase atomic increments.
- Trending uses real Use Template / Copy Prompt activity, including timestamp history.
- Analytics updates optimistically in the UI and persist to Firebase.
- Search clearing restores all cards.
- Admin authentication and existing management pages are preserved.
- This package contains only one project root; no duplicate nested v19 project.

V22: Trending ranks by recent 7-day activity first, then 24-hour activity, then total activity. Use/Copy analytics use Firebase transactions and daily counters.
