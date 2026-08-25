EditGalaxy FINAL V18 FIXED

Based on the V17/V14 layout and functionality.

Fixes in this build:
1. Trending filters now show the most-used templates/prompts instead of requiring category='trending'.
2. Template use counter uses Firebase atomic increment and records use history.
3. Prompt copy counter uses Firebase atomic increment and records copy history.
4. Admin Edit/Save now has proper error handling and preserves analytics fields.
5. Admin template/prompt lists are sorted #400 -> #399 -> ... -> #1.
6. Search-clear behavior remains: clearing the search input restores all cards.
7. Firebase rules included in firebase-rules.json. Deploy these rules to the same Realtime Database project for public analytics writes while keeping content edits admin-authenticated.

Important: After uploading the website, deploy firebase-rules.json in Firebase Realtime Database -> Rules. GitHub Pages cannot deploy Firebase rules automatically.
