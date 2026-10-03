Mirpur College Updates & Notices - Vercel + Firebase version (Contact -> Telegram)
=======================================================================
Files: index.html (PUBLIC site) | admin.html (ADMIN panel + login, alada page)  | api/contact.js (Telegram, server-side) | firestore.rules | logo.png
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

C) FIREBASE (age-r moto)
 Email/Password enable, Firestore create, firestore.rules Publish. (Storage LAGBE NA)
 Prothom admin: sign up -> UID copy -> Firestore config/admins-e ids array-te UID.

D) TEST
 Contact form fill korun -> Telegram-e message ashbe (ar Admin Panel-eo save thakbe).

Note: Token kokhono index.html-e boshaben na - shudhu Vercel Environment Variables-e.
Site Vercel-e na thakle (file:// ba onno host) Telegram jabe na; Firestore-e save-i hobe.

FILE/IMAGE: Chobi admin panel theke upload korle auto compress hoye post-er sathe Firestore-e save hoy (post-e max ~800KB chobi).
PDF/Doc: Google Drive-e upload kore 'Anyone with the link' share kore link Admin Panel-er 'Attachment links'-e din (Nam | Link).

PAGES
 Public:  /            (Home + Contact: #/contact)   -- kono login/admin link nei
 Admin:   /admin       (ba /admin.html)              -- shudhu tumi URL jano; login korte hoy
 Admin link public site-e dewa nei. /admin bookmark kore rakho.
 Prothom admin: /admin-e Sign up -> UID copy -> Firestore config/admins -> ids array-e UID.
 Sign up bondho korte chao: prothom admin set korar por Firebase Console > Authentication > Settings > User actions > "Enable create (sign-up)" off koro.
