EditGalaxy FINAL v19 FIXED

Base: V14-style UI/functionality preserved.

Fixes in v19:
- Admin Manage Templates/Prompts lists now render correctly (missing number-sort helper fixed).
- Admin edit/save buttons remain connected to Firebase and now have explicit read-error feedback.
- Prompt/template cards use a safe internal card registry instead of inline JSON onclick payloads, fixing cards whose prompt text contains quotes/apostrophes.
- Trending filter now ranks by actual usage/copy count, with category-trending fallback.
- Every opened template and prompt detail now shows up to 10 Trending cards underneath, ranked by usage/copies.
- Search behavior from previous version preserved: clearing search restores all cards.
- Firebase authentication and analytics rules preserved.
