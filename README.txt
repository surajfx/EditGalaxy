EditGalaxy final website package

Files:
- index.html: public website
- admin.html: admin panel
- about.html, contact.html, team.html, privacy.html, trust.html, terms.html, copyright.html: site information pages
- editgalaxy-ai-icon.png: AI/search button icon

ADMIN AUTHENTICATION: Create an admin user in Firebase Console > Authentication > Users using Email/Password. No admin password is stored in the HTML.

Data:
Firebase Realtime Database is used for templates, prompts and usage analytics. Media files are not uploaded to this package; add direct image/video links in the admin panel.

Template media:
- Preview thumbnail: direct image URL (recommended 4:5)
- Instagram video: Instagram Reel/Post URL
- CapCut: direct CapCut template URL
- How-to-use video: supported video/embed URL

The template description is generated automatically on the public site and is not requested in the admin form.


BULK IMPORT: Open bulk_upload.html, sign in with the same Firebase Email/Password admin user, paste Template and Instagram lists, Match & Preview, then Confirm & Add to Firebase. Only numbers with both links are added; existing numbers are skipped.


V17 AUTH/SECURITY
- index.html is intentionally unchanged from V14. Do NOT add an admin login to the public site.
- admin.html uses Firebase Email/Password Authentication.
- bulk_upload.html uses the same Firebase Authentication.
- Apply firebase-rules.json in Firebase Realtime Database > Rules. Public visitors can read templates/prompts and update only usage/copy counters; authenticated users can create/edit/delete templates/prompts.
- Keep Email/Password sign-up disabled for the public. Create admin users manually in Firebase Console.
