EditGalaxy FINAL v29 FIXED

Based on v28, preserving the existing UI, Firebase structure, trending logic and card design.

Fixes in v29:
1. Mobile Search Enter: pressing the keyboard Enter/Search key now runs the same search as the Search button and blurs the field so the mobile keyboard closes.
2. AI Search Enter: pressing the keyboard Enter/Search key triggers AI Search and closes the keyboard.
3. Admin Edit Save: save now explicitly validates the signed-in Firebase admin UID, refreshes the auth token, performs the existing Firebase update without removing analytics/history fields, verifies the saved record, and provides a clear Saving/Saved/Failed state.
4. Edit buttons are explicitly type=button to avoid mobile/browser form-submit conflicts.

Admin UID in firebase-rules.json:
i3J3kuqMLtUglNE1EyC7JZCzaFi1

Apply firebase-rules.json in Firebase Realtime Database > Rules before testing admin saves.
