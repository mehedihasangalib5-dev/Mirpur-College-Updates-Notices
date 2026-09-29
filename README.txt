Mirpur College Updates & Notices (Firebase) - Setup
==============================
Project: muc-network-50a06

1) Firebase Console > Build > Authentication > Sign-in method > Email/Password = ENABLE.
   Settings > Authorized domains: tomar site-er domain add koro (localhost default ache).
2) Build > Firestore Database > Create database.  Rules tab-e firestore.rules paste kore Publish.
3) Build > Storage > Get started.  Rules tab-e storage.rules paste kore Publish.
   (Note: notun project-e Storage-er jonno Blaze plan lagte pare.)
4) Site chalao (file:// e Auth kaj kore na). Options:
   - Firebase Hosting:  npm i -g firebase-tools; firebase login; firebase init hosting; firebase deploy
   - ba Netlify/Vercel/GitHub Pages-e index.html upload koro (domain Authorized domains-e dao).
   - local test: folder-e  python3 -m http.server 8000  -> http://localhost:8000
5) FIRST ADMIN (owner) set kora - ekbar-er kaj:
   a) Site-e "Login" > Sign up diye nijer account banao. Footer-e "Your UID" dekhabe (copy koro).
   b) Firestore Console > Start collection: ID = config, Document ID = admins,
      Field: ids  (type: array)  -> prothom item = tomar UID (string).
   c) Reload dao -> "Admin" button dekha jabe.
6) Aro admin: Admin Panel > Admin Management-e onno-r UID paste kore Add.
   (Sudhu array-r prothom UID = Owner admin list change korte pare.)

Pages: #/ (Home, category card click korle same page-e filter hoy)  #/contact  #/login  #/admin
Contact form-er message Firestore "messages" collection-e jay, shudhu admin dekhte pare (Admin Panel-er niche).
firestore.rules ABAR publish koro (contact rules add hoyeche).
Security ashole rules file-e - client button hide kora shudhu UI. Rules deploy na korle site open thakbe!


TELEGRAM NOTIFICATION (Contact form -> Telegram)
================================================
Contact form message Firestore-e save hoy, tarpor Cloud Function (functions/index.js) automatic Telegram-e pathay.
Bot token website-er code-e dewa hoyni (dile keu churi korte parto) - eta server-side secret.

1) Telegram-e @BotFather -> /newbot -> BOT TOKEN paben.
2) Notun bot-e ekta "Hi" pathan (group hole bot-ke group-e add korun).
3) CHAT ID: personal hole @userinfobot-ke message korun. Ba browser-e
   https://api.telegram.org/bot<TOKEN>/getUpdates  -> "chat":{"id": ...}
4) Terminal (Node 20+):
     npm i -g firebase-tools
     firebase login
     cd functions && npm install && cd ..
     firebase functions:secrets:set TELEGRAM_BOT_TOKEN
     firebase functions:secrets:set TELEGRAM_CHAT_ID
     firebase deploy --only functions
5) Blaze (pay-as-you-go) plan lagbe; chhoto site-e usually free tier-er moddhe.
6) Test: Contact form-e message pathan. Na ashle Firebase Console > Functions > Logs.
