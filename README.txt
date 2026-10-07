Mirpur College Updates & Notices - Vercel + Firebase version (Contact -> Telegram)
=======================================================================
Files: index.html (PUBLIC site) | admin.html (ADMIN panel + email login, alada page)  | api/contact.js (Telegram, server-side) | firestore.rules | logo.png
BLAZE PLAN LAGBE NA: Auth + Firestore + Vercel - sob free. Firebase Storage/Cloud Functions ba Blaze kono kichu use hoy na.

A) TELEGRAM BOT
 1. Telegram: @BotFather -> /newbot -> BOT TOKEN.
 2. Bot-ke ekta "Hi" pathan (group hole bot-ke group-e add korun).
 3. CHAT ID: @userinfobot-ke message korun. Ba
    https://api.telegram.org/bot<TOKEN>/getUpdates -> "chat":{"id": ...}

B) VERCEL DEPLOY (free)
 1. Ei folder GitHub repo-te push korun (ba `npm i -g vercel` then `vercel` folder-er bhitor theke).
 2. vercel.com > Add New Project > repo select > Framework: Other > Deploy.
 3. Project > Settings > Environment Variables:
       TELEGRAM_BOT_TOKEN = <token>
       TELEGRAM_CHAT_ID   = <chat id>
    save kore Deployments > Redeploy (env variable redeploy chhara kaj kore na).
 4. Firebase Console > Authentication > Settings > Authorized domains:
    tomar Vercel domain (xxx.vercel.app ba custom domain) add korun.

C) FIREBASE + ADMIN ACCESS (EMAIL DIYE) -- password / sign up nei
 1. Authentication > Sign-in method:  Google = Enable   ar   Email/Password = Enable + "Email link (passwordless sign-in)" tick.
    (duto-i free. Ekta holei cholbe, duto rakhle bhalo)
 2. Authentication > Settings > Authorized domains: tomar Vercel domain add korun.
 3. Firestore create korun, firestore.rules Publish korun. (Storage LAGBE NA)
 4. PROTHOM ADMIN (Owner) -- ekbar-i, Firebase Console theke:
    Firestore Database > Start collection  config  > Document ID: admins > Field:
        emails   (type: array)   -> prothom item = tomar email (SOB CHOTO HATER AKHORE, jemon  mehedi@gmail.com)
    Save. Ei email-i Owner.
 5. /admin e jao -> "Google diye Continue" ba email likhe "Login link pathan" -> email-er link-e click -> login.
 6. Onno kaku access dite: Admin Panel > "Admin Access (Email)" > tar email likhe Add. Se nijer email diye (Google/email link) login korbe.
    Access tulte: Remove (shudhu Owner add/remove korte pare). Email add na thakle login holeo "Access nei" dekhabe.
 Note: Age UID diye admin set kora thakle (config/admins.ids) seta ekhono kaj kore -- chaile Owner email add kore UID-gulo Remove korte paro.

D) TEST
 Contact form fill korun -> Telegram-e message ashbe (ar Admin Panel-eo save thakbe).

Note: Token kokhono index.html-e boshaben na - shudhu Vercel Environment Variables-e.
Site Vercel-e na thakle (file:// ba onno host) Telegram jabe na; Firestore-e save-i hobe.

FILE/IMAGE: Chobi admin panel theke upload korle auto compress hoye post-er sathe Firestore-e save hoy (post-e max ~800KB chobi).
PDF/Doc: Google Drive-e upload kore 'Anyone with the link' share kore link Admin Panel-er 'Attachment links'-e din (Nam | Link).

PAGES
 Public:  /            (Home + Contact: #/contact)   -- kono login/admin link nei
 Admin:   /admin       (ba /admin.html)              -- shudhu tumi URL jano; allowed email diye login korte hoy
 Admin link public site-e dewa nei. /admin bookmark kore rakho.
 Admin access: upore C) section dekho (email allowlist). Kono password ba sign-up form nei.

E) PUSH NOTIFICATION (notun notice-e phone-e alert) -- free, Blaze lagbe na
 Kivabe kaj kore: visitor "🔔 Alert" button-e tap kore allow kore -> admin panel theke notun post Publish korle
 (🔔 checkbox tick thakle) sobar phone/browser-e notification jay -> tap korle sei post khule.
 Setup (ekbar-i):
 1. VAPID KEY: Firebase Console > Project settings (gear) > Cloud Messaging tab > "Web configuration" /
    "Web Push certificates" > Generate key pair > "Key pair" copy kore index.html-er
    const VAPID_KEY="PASTE_VAPID_PUBLIC_KEY_HERE" -er jaygay boshao.
 2. SERVICE ACCOUNT: Firebase Console > Project settings > Service accounts > "Generate new private key" -> .json file download hobe.
    Vercel > Project > Settings > Environment Variables:
       FIREBASE_SERVICE_ACCOUNT = <oi json file-er POURO content (paste kore)>
    (ei file kokhono GitHub/index.html-e dibe na!)
 3. Firebase Console > Build > Cloud Messaging-e "Firebase Cloud Messaging API (V1)" Enabled thakte hobe (default thake).
 4. GitHub-e push -> Vercel auto deploy (package.json-e firebase-admin ache, Vercel nijei install korbe). Env variable dile Redeploy korte hobe.
 TEST: Site-e 🔔 Alert tap -> Allow. Admin Panel-e notun post -> Publish (🔔 tick) -> phone-e alert ashbe.
 Note:
  - Android Chrome / Desktop: browser-e direct cholbe.
  - iPhone (iOS 16.4+): Safari -> Share -> "Add to Home Screen" kore HOME SCREEN-er app theke khule Alert on korte hobe (Safari tab-e hoy na).
  - Post EDIT korle default-e push jay na (checkbox tick korle jabe).
  - Notification bondho korte chaile abar 🔔 button-e tap korlei off.
