EditGalaxy FINAL v27 FIXED

Based on v26, preserving the existing UI and functionality.

Fixes:
1. Admin template/prompt edit save: uses authenticated admin set() writes and refreshed auth token; Firebase rules now grant admin write access at the templates/prompts collection while keeping public analytics child writes.
2. AI Search: always refreshes selected Firebase collection before searching; exact number/title matching preserved.
3. AI Search animation: visible loading/search animation is held for at least 650ms, with a visible ring/pulse and no-result feedback.

Admin UID in firebase-rules.json:
i3J3kuqMLtUglNE1EyC7JZCzaFi1

Apply firebase-rules.json in Firebase Realtime Database > Rules before testing admin saves.
