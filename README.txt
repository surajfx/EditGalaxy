EditGalaxy final website package

Files:
- index.html: public website
- admin.html: admin panel (secured with Firebase Authentication - see setup below)
- about.html, contact.html, team.html, privacy.html, trust.html, terms.html, copyright.html: site information pages
- editgalaxy-ai-icon.png: AI/search button icon

ADMIN LOGIN - ONE-TIME SETUP (do this before using admin.html):
1. Go to Firebase Console -> your project (template-cc1cb) -> Authentication -> Sign-in method
2. Enable "Email/Password" provider
3. Go to Authentication -> Users -> Add user, create an admin email + password (this is now your real admin login, not a hardcoded password)
4. Go to Realtime Database -> Rules and set write access to require login, e.g.:
   {
     "rules": {
       "templates": { ".read": true, ".write": "auth != null" },
       "prompts": { ".read": true, ".write": "auth != null" }
     }
   }
   This stops anyone from writing to your database even if they find your Firebase config (which is normal and public in any Firebase web app).
5. Open admin.html, log in with the email/password you created in step 3.

Data:
Firebase Realtime Database is used for templates, prompts and usage analytics. Media files are not uploaded to this package; add direct image/video links in the admin panel.

Template media:
- Preview thumbnail: direct image URL (recommended 4:5)
- Instagram video: Instagram Reel/Post URL
- CapCut: direct CapCut template URL
- How-to-use video: supported video/embed URL

The template description is generated automatically on the public site and is not requested in the admin form.
