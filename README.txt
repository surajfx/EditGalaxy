EditGalaxy FINAL v17

Files:
- index.html: public site
- admin.html: Firebase email/password admin panel
- bulk_upload.html: authenticated bulk uploader

Firebase Realtime Database rules expected:
{
  "rules": {
    ".read": true,
    ".write": "auth != null && auth.uid === 'YOUR_ADMIN_UID'"
  }
}
