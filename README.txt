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

F) NOTUN FEATURE (client-side, kono extra setup lagbe na)
 - ⭐ Save: card-er ☆ ba post-page-er "Save" button. Nav-er "⭐ Saved" theke shob saved post (phone-e localStorage-e thake).
 - Porā post auto dim hoy, "New" tag lukay.

G) ARO FEATURE
 - Admin: "Schedule" (datetime) + "Draft" checkbox + 👁 Preview. Scheduled/draft post public-e dekhay na; somoy hole nijei dekhay (page reload-e).
 - View counter: protita device-e ekbar +1 (admin list-e 👁). Er jonno firestore.rules abar Publish korte hobe!
 - Home: stats strip, "শুধু Unread" ar "Deadline আছে" filter, Bangla-friendly search (ড়/য়, Bangla digit) + highlight.
 - Note: Draft post Firestore API-te technically public-read; sensitive kichu draft-e rakhben na.

H) DESIGN POLISH
 - Category emoji-r jaygay SVG icon (card, tag, featured), cover na thakle category-color gradient placeholder.
 - Dropdown-er bodole scrollable category chip. Mobile-e niche floating bottom nav (Home / Saved / Contact), purono Contact button bondho.
 - prefers-reduced-motion mene animation bondho hoy.

=== ADMIN PANEL v2 (notun feature) ===
Layout: sidebar (phone-e bottom bar) -- Dashboard | Notun Post | Sob Post | Messages | Admins | Tools
 - Dashboard: stat card + sparkline, deadline 48 ghonta warning, view analytics, recent activity.
 - Notun Post: Template, Live Preview, Draft/Schedule/Pin, "Subscriber-der notification" tick, Duplicate (Sob Post theke).
 - Sob Post: table, search/filter/sort, bulk (Pin/Unpin/Publish/Expire/Category/Delete), delete-e Undo.
 - Messages: Inbox/Unread/Starred/Archived, Reply (mail/WhatsApp), delete-e Undo.
 - Admins: Role -- Owner (emails[0]) | Admin (emails) | Editor (editors: shudhu post create/edit, delete/message/backup pare na).
 - Tools: JSON backup/import, Posts CSV, Registered Students (Year/Dept + CSV), Activity Log.
IMPORTANT: firestore.rules ABAR Publish korte hobe (notun: editors, messages flag update, logs collection). Na korle
 Editor role, message Read/Star/Archive ar Activity Log kaj korbe na. Vercel redeploy-o dao (api/notify.js Editor-ke allow kore).
Template ("Tomar template") ei device-er browser-e save thake. Push subscriber-er sonkhya Firebase theke dekha jay na.
Scheduled post auto-notify hoy na -- shomoy hole Sob Post theke bell button chapo.

H) GOOGLE LOGIN + REMEMBER ME
 - Login/Sign up page-e "Google দিয়ে ... করুন" button ar Login tab-e "মনে রাখুন" checkbox.
 - Google login chalu korte: Firebase Console -> Authentication -> Sign-in method -> Google -> Enable.
 - Site-er domain (jemon xxx.vercel.app ba nijer domain) Authentication -> Settings -> Authorized domains-e add korun.
 - Google diye prothom bar login korle Year/Department select korar screen ashe (email signup-er moto).
 - "মনে রাখুন" off thakle browser/tab bondho korle abar login lagbe. On thakle login thake.
 - Google diye notun user hole Name/Year/Department na dewa porjonto site-e dhukte pare na. "বাতিল করুন" chaple oi notun Google account Firebase theke delete hoye jay.
 - Complete screen-e Email/Password field thake na, shudhu Google account-er email dekhay.
 - Note: bhul kore tab bondho korle account Auth-e theke jay (Firestore profile chara). Porer bar dhukle abar setup screen ashe. Chaile Firebase Console -> Authentication theke muche din.

I) APP UPDATE NOTICE
 - Notun version deploy korle, ager install kora/purono user-er app-e niche "নতুন Update এসেছে! [Update]" banner ashe. "Update" chaple app nijei reload hoye notun version chalay. "পরে" chaple oi session-e ar dekhay na.
 - Eta kaj korar jonno protibar notun release deploy korar age sw.js-er V (jemon "mcn-v8") ekta bariye din (v9, v10...).
 - App khola thakle ba background theke ashle auto check hoy (protি 30 minute-o).


=== J) EMAIL VERIFICATION CODE + GOOGLE SHEET (notun) ===
Ki hoy:
 - Sign up korar por email-e 6 digit code jay. Code boshiye "Verify" chaple spinner -> Success (ba Incorrect). Code 10 min-e expire, Resend 60 sec timer-er pore.
 - Verify na kora email/password account login korle-o age code verify korte hoy.
 - Verified student-er Name/Email/Year/Dept Google Sheet-e auto add/update hoy (Dashboard sheet-o ache).
Setup (ekbar-i):
 1. Notun Google Sheet > Extensions > Apps Script > google-sheet/Code.gs-er pura code paste.
    SECRET = "CHANGE_ME..." bodle lomba random password dao. Function "setup" Run kore Allow koro.
 2. Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone > Deploy > URL copy.
 3. Vercel > Settings > Environment Variables:
       SHEET_WEBAPP_URL = <Web app URL>
       SHEET_SECRET     = <Code.gs-er SECRET-er hubohu ekoi>
    (FIREBASE_SERVICE_ACCOUNT age thekei ache -- lagbe.) Save kore Redeploy.
 4. firestore.rules abar Publish koro (users-e email_verified check + emailCodes lock).
 5. Admin Panel > Tools > Registered Students > "Google Sheet Sync" -- age-r sob student-ke ekbar Sheet-e tule dey.
 Test: Sheet-er menu MCUN > "Send test email to me". Tarpor site-e notun account khulo.
Note:
 - Email Gmail diye jay (Apps Script MailApp): free Gmail-e din-e ~100 ta, Google Workspace-e ~1500 ta. Resend-o ekta kore gone.
 - Age-r email/password user-ra next login-e ekbar code verify korbe (Google login user-der lagbe na).
 - Code.gs bodlale: Deploy > Manage deployments > Edit > New version.
 - Vercel Hobby plan-e function limit 12; ekhon 8 ta ache.

=== K) ADMIN PANEL: STUDENTS (block / remove) ===
 - Admin Panel > "Students" tab: sob student-er Name, Email, Year, Department, Status. Search + Year/Dept/Status filter.
 - Block   : Firebase account disable + session revoke + users/{uid}.blocked. Student login korte parbe na ("account block kora hoyeche" dekhabe).
 - Unblock : abar chalu.   Remove: Auth account + profile + Google Sheet row muche jay (ferano jay na).
 - Owner/Admin chara keu parbe na. Admin/Editor account ba nijeke block/remove kora jay na.
 - Dashboard-e "মোট Student" card + Year x Department chart. Google Sheet Dashboard-e Blocked count + Status = Blocked.
 - Notun file: api/user-admin.js  (Vercel-e age-r mot-i FIREBASE_SERVICE_ACCOUNT, SHEET_WEBAPP_URL, SHEET_SECRET lagbe)
 - Code.gs bodleche -> Apps Script-e paste kore Deploy > Manage deployments > Edit > New version.
 - Vercel Hobby function limit 12: ekhon 9 ta (env-check.js delete korle 8).

=== L) AUTO NOTIFICATION (student-er phone/device-e) ===
 Kivabe kaj kore:
  - Student login korle (ba site khulle) browser ekbar bhodro vabe "Notice-er alert chalu korun" jiggesh kore. Allow korle device auto subscribe hoy.
    Age Allow dewa thakle kono prompt chhara chupchap subscribe hoy. Profile-e notification ON/OFF toggle ache.
  - Admin Panel-e notun Post Publish korle ("Publish-er sathe sathe ... notification" tick thakle -- new post-e default tick) sob subscribed device-e
    notification jay, phone lock thakleo/site bondho thakleo. Tap korle oi post khule.
  - Logout korle oi device-e notification bondho. Block/Remove korle student-er sob device theke bondho.
 Setup (ekbar-i):
  1. (OPTIONAL) Firebase Console > Project settings > Cloud Messaging > niche scroll > "Web configuration" > Web Push certificates > Generate key pair.
     Dekha na gele SKIP koro -- key chhara Firebase-er default key-te-o kaj kore.
  2. (OPTIONAL) Key peley Vercel > Environment Variables: VAPID_PUBLIC_KEY = <public key>  (Redeploy korte hobe)
  3. FIREBASE_SERVICE_ACCOUNT age-r moto lagbe. Firebase Cloud Messaging API (V1) Enabled thakte hobe.
  4. Deploy. User-der app-e "Update" banner ashle ekbar Update chapte hobe (sw.js notun).
 Note:
  - iPhone (iOS 16.4+): Safari -> Share -> "Add to Home Screen" kore home screen-er app theke khulte hobe, tahole-i notification ashbe.
  - Scheduled post-e auto notification jay na (shomoy hole admin Sob Post theke bell button chapo).

=== M) ADMIN PANEL: NOTIFY (je student-ke chai take notification) ===
 Admin Panel > "Notify" tab (shudhu Owner/Admin):
  - Kake: সব Student | Year/Department | নির্দিষ্ট Student (search kore select) | শুধু আমি (Test)
  - Live count: koto jon student, koto device-e jabe (ar kotojon-er notification ON nei)
  - Title (80) + Message (240), Template button, Live Preview
  - Urgent option: notification screen-e thake (dismiss na korle jay na) + vibrate
  - Tap korle ki khulbe: Site home | ekta Post | custom https link
  - Pathanor age confirm; pathanor por delivery report (koto device-e gelo / fail)
  - Sent History (last 20) + "Reuse" button; Students tab theke student-er pashe "Notify" button-e shorashori oi student-ke
  - Block kora student-ke pathay na; mora device token auto muche; ghonta-y max 30 ta (spam thekate)
 Notun file: api/send-push.js   (Vercel function ekhon 10 ta; limit 12. env-check.js delete korle 9 ta)
 Test: prothome nijer phone-e site-er bell ON korun, tarpor Notify > "Nijer-e Test".
 Note: shudhu jader device-e bell ON ache tader-i jabe. Student-ra login korle prompt dekhe Allow korle auto ON hoy.

=== N) SITE-ER BELL = NOTIFICATION LIST (inbox) ===
 - Header-er bell tap korle notification list khole (modal). Notun hole bell-e lal number badge, list-e notun gulo highlight.
 - List-e item tap korle oi post/link khule. Upore "Phone alert ON/OFF" toggle ache.
 - Ki ki ashe: (1) notun Post publish-er notification, (2) Admin > Notify theke pathano custom notification (sobai ba shudhu target student).
   Phone alert OFF thakleo student bell-e dekhte pabe.
 - Phone-e push notification tap korle site khule ar list dekhay (custom notification), post-er notification-e oi post khule.
 - firestore.rules abar PUBLISH korte hobe (notifAll + users/{uid}/inbox rule notun). Na korle list khali dekhabe.
 - Data: notifAll (sobar jonno), users/{uid}/inbox (target student). Student Remove korle tar inbox-o muche jay.

=== O) ADMIN PANEL: MOBILE BOTTOM BAR (rotate button) + TOGGLE SWITCH ===
 - Phone/tablet (<900px): bottom bar-e main 4 ta feature duipashe (Home, Post, Posts, Inbox), majhkhane gol rotate button.
   Tap korle button ghure (grid -> X) ar baki feature (Students, Notify, Admins, Tools) popup-e dekhay. Bairey tap / Esc / kono item tap korle bondho.
   Editor-der (shudhu 3 ta feature) majhkhane button thakbe na. Desktop-e age-r moto side menu.
 - Notification option gulo toggle switch: Post form-er "Publish-er sathe sathe notification pathan" ar Notify tab-er "Urgent".

=== P) SITE: MOBILE BOTTOM BAR (rotate button) + NOTIFICATION TOGGLE ===
 - Phone (<=600px): bottom bar-e Home, Saved | majhkhane gol rotate button | Contact, Profile.
   Majhkhaner button tap korle ghure (grid -> X) ekta menu ashe:
     * Notification  -> TOGGLE switch (tap korle phone alert ON/OFF; sub-text-e ki obostha dekhay)
     * Inbox         -> notification list (notun thakle lal number)
     * Theme         -> dark/light
     * Install       -> app install (shudhu jokhon install kora jay)
 - Rotate button-e lal dot = notun notification ache.
 - Phone-e header-e shudhu logo thake (Install/Bell/Theme/Profile bar-e shorano hoyeche). Desktop/tablet-e age-r moto header.

=== Q) MAIN PAGE: EXPIRED FEATURE ===
 Deadline (Admin > Post form-er "Deadline") peye gele post "Expired" hoy. Main page-e ekhon:
  - Filter: All (N) | Active (N) | Expired (N)  -- Category select kora thakle oi category-r count dekhay.
  - "All" view-e Expired post gulo list-er niche alada "Expired" divider-er pore dekhay (greyed + "Expired" ribbon).
  - "Expired" filter chaple shudhu meyad-shesh post; "Active" chaple shudhu cholmaan post.
  - Post khulle upore lal banner: "Ei post-er meyad shesh hoyeche. Deadline chhilo: <date>".
  - Admin-e post-er deadline barale (ba muchle) post abar Active hoye jay.

=== R) SITE: PROFILE PAGE + INBOX PAGE + EKTA NOTIFICATION BUTTON ===
 - Profile ekhon popup noy, alada page: #/profile  (bottom bar-er "Profile" ba desktop header-er avatar tap korle)
     Cover + boro avatar (camera button-e photo), naam/email, Year/Dept/Verified/Joined chip,
     "Personal information" form (change korle tobei Save button chalu), Shortcuts (Saved posts, Inbox), Log out.
 - Inbox ekhon popup noy, alada page: #/inbox
     Upore "Phone alerts" switch (ON/OFF), niche Today / Yesterday / Earlier onujayi notification list; notun gulo "New" tag-shoho.
 - Notification button EKTA:
     Phone-e: rotate button-er menu-te ek row -> row tap = Inbox page khole, row-er dan-er switch tap = phone alert ON/OFF.
     Desktop: header-er bell tap = Inbox page (switch oi page-e).
 - Phone notification tap korle (custom notification) Inbox page khole.

=== S) STAFF ENTRY + EXPIRED ALADA + DEVICE LAYOUTS ===
 1. Owner/Admin/Editor login korle main site-e nijei "Admin Panel" button ashe (kono setup lagbe na -- config/admins theke role dekhe):
      Desktop/tablet: header-e "Admin" button | Phone: rotate menu-te "Admin" tile (role likha) | Profile page-e role chip + "Admin Panel" row.
    Admin Panel theke upore "Main site" (phone-e icon ba rotate menu-r "Website") chaple main website-e fera jay. Role 10 min cache hoy.
 2. Header bell ar ON hole blue hoy na (ON/OFF shudhu switch-e dekhay).
 3. Expired post shudhu "Expired" feature-e thake: Active list, search, category count, featured, ticker, Saved -- kothao dekhay na.
    Deadline shesh hole 30 sec-er moddhei nijei Active theke Expired-e chole jay. Search-e expired match thakle hint dekhay. Direct link-e post khulle banner shoho dekha jay.
 4. Device layout: Phone(<=600) 1 col + bottom bar | Tablet(601-1023) 2 col | Laptop(1024+) 3 col | Desktop(1440+) 4 col | TV(1920+) 5 col |
    phone landscape compact | touch device-e boro tap target | Profile page desktop-e 2 column. Admin-o tablet/landscape/boro screen-e adjust kora.

=== T) DESIGN: ager look-e fera ===
 Notun "flat/clean" design apnar pochondo hoyni, tai site-er design ager look-e (gradient, boro hero, stats box) fera hoyeche.
 Bakhi sob feature thake (Expired, rotate menu, Profile/Inbox page, Admin button, responsive grid ityadi).
 Admin-e shudhu phone-er layout fix rakha hoyeche: header-e role badge lukano (logout kete jachhilo), stat card 2 column, student search full-width.

=== U) SCOPE: Year + Department onujayi Admin/Editor + Publisher naam ===
 Owner Admins tab theke prottek Admin/Editor-ke Year + Department scope dite pare (default = sob Page, age-r moto):
   - Notun jon-ke add korar somoy checkbox grid; ager jon-er jonno "Scope" button -> inline editor -> Save.
   - Scope-wala Admin/Editor shudhu oi Page-er post dekhe/banay/edit kore (Post form-e shudhu tader Page select kora jay).
   - Scope-wala Admin shudhu oi Year/Dept-er student dekhe (/api/students), Block/Remove kore, Notify pathay (server-e enforce kora).
   - Scope-wala Admin Google Sheet Sync/Backup-all korte pare na. Owner kokhono restricted noy.
   - Rules-e enforce: posts create/update/delete scope-er baire hole denied; users direct read shudhu Owner/scope-chhara Admin.
   - Scope ba Page "sob" (khali grp) post scope-wala-ra chhute pare na.
 Publisher: notun post-e "Published by <naam> [Owner/Admin/Editor]" card ar post page-e dekhay (purono post-e dekhabe na).
   Naam: profile-er naam, na thakle Google naam, na thakle email-er shuru ongsho.
 DEPLOY: (1) firestore.rules Publish  (2) Vercel deploy (notun api/students.js; env-check.js soriye fela hoyeche -- ekhon 10 ta function)
 Rules test (Firebase Console > Rules > Rules Playground): scope-wala Editor -> posts create grp=[oi page] = allow; grp=[onno page] = deny; grp=[] = deny.

=== V) TARGETED NOTIFICATION + OWNER REVIEW + MOBILE INBOX ICON ===
 1. Publish-er notification SHUDHU post-e select kora Year/Department-er student-der kache jay (grp khali = sobar kache):
      - bell-er list (in-app): sobar jonno -> notifAll; select kora Page hole -> shudhu oi student-der inbox
      - phone push: shudhu oi student-der device-e. Block kora student-ke jay na.
      - Scope-wala Admin/Editor shudhu nijer scope-er post-er notification pathate pare (server-e check).
      - Post-er bell button (Posts list) ekoi API use kore -> ekoi target. Admin-e toast-e dekhay koto jon/koto device-e gelo.
 2. Admin-er student Block / Unblock / Remove ekhon Owner review kore approve korle tobei hoy:
      - Admin button chaple "request" jay (studentRequests). Owner-er Students tab-e "Review lagbe" panel (Approve / Reject),
        Dashboard-e "Review lagbe" card, Students menu-te badge, phone-e rotate button-e lal dot; Owner-er device-e push-o jay.
      - Admin nijer request-er status (Pending/Approved/Rejected) dekhe, Pending-ta Cancel korte pare.
      - Owner nijer action sathe sathe kore (approve lage na). Admin/Editor account-e kono action cholbe na.
      - Rules: users doc delete shudhu nijer ba Owner; studentRequests shudhu server.  -> firestore.rules abar PUBLISH korte hobe.
 3. Phone-er header-e ekhon Inbox (ghonta) icon ache, unread number-shoho; tap korle Inbox page.


=== W) QUIZ + BOARD QUESTION (STUDENT SIDE) ===
 Site: #/quiz (list, timer, Practice/Exam, result + review) ar #/board (Board/Sal/Subject/CQ-MCQ filter, prosno + somadhan text, Save).
 Header link + phone-e rotate menu-te Quiz ar Board tile. Board page-e Copy/Cut/Right-click/Print bondho + naam-email watermark.
 Data: collection quizzes {t,sub,mode:"Exam"|"Practice",min,neg,pages:[..],q:[{q,o:[4],a,e}],dl,at,draft,ts}
       collection boardQ {b,y,sub,ch,ty:"CQ"|"MCQ",m,pages:[..], CQ: st,p:[4],s:[4](optional) | MCQ: qz:<quizId>, ts}
       collection quizAttempts/{uid_quizId} (server rules-e Exam ekbar-i)
 DEPLOY: (1) firestore.rules Publish (2) Vercel deploy (sw.js v27 -> Student-er app-e "Update" banner ashbe).
 Note: Admin side ekhono baki; ekhon data Firebase Console theke dite hobe. Exam-er answer client-e thake (server grading pore).

=== X) ADMIN SIDE: QUIZ + BOARD (admin.html) ===
 - Notun tab "Quiz & Board" (Owner + Admin; scope-wala Admin shudhu nijer Page): Quiz form (prosno, uttor, byakkha, Mode, time, negative, deadline, schedule, Page), Board Question form (CQ text + solution, MCQ -> Quiz link), list + Edit/Delete.
 - Publish-er sathe tick thakle auto ekta Post ("Notun Quiz: ...") toiri hoy + push notification (age-r notify API, notun function lagbe na).
 - Notun tab "Q&B Dashboard": SHUDHU OWNER (UI tab lukano + firestore.rules-e quizAttempts read shudhu Owner). KPI, 7 dine attempt, Quiz/Page/Board onujayi report, Result CSV.
 - DEPLOY: firestore.rules abar Publish + Vercel deploy. Ager moto Student-er "Update" banner-er jonno sw.js V ar ekbar bariye nao (v28) jodi index.html-o bodlay.


=== Y) STUDENT QUIZ UI v2 (index.html + sw.js v29) ===
 - Quiz list: stats strip (মোট/সম্পন্ন/গড়), search, filter chip (সব/Exam/Practice/বাকি আছে), status badge (নতুন/চলছে/সম্পন্ন/সময় শেষ), score bar, skeleton loading, "চলছে" resume banner.
 - Intro screen (#/quiz/<id>): rules + stat tile + শুরু করো. Exam ekbar-i, deadline-er por start hoy na.
 - Runner: sticky header (timer + progress), boro option card (letter badge, ✓/✕ icon), Flag, bottom action bar (আগের | প্রশ্ন তালিকা | পরের/Submit),
   palette bottom-sheet (answered/flagged/current), custom Submit dialog (ক-ta baki), Exam-e answer abar tap korle muche jay, Practice-e sathe sathe ঠিক/ভুল + ব্যাখ্যা.
 - Autosave: answer/flag/timer sessionStorage-e. Refresh korle ba tab ghure abar khulle resume. Exam-er somoy shesh hoye gele save kora answer auto Submit.
 - Keyboard (desktop): 1-4 option, ←/→ prosno, F flag, Esc dialog bondho. Quiz cholar somoy phone-er bottom nav lukano thake.
 - Result: score ring (%), ঠিক/ভুল/বাকি/সময় tile, review tab (সব/ভুল/বাকি/Flagged), "তোমার উত্তর"/"সঠিক" badge.
 - Data/Firestore rules BODLAY NI -- quizAttempts-er field ager moto. Shudhu deploy + sw.js v29 (Student-er app-e "Update" banner ashbe).
 - Note: Exam attempt-e answer save hoy na, tai Exam-er review shudhu submit-er por result page-e dekha jay. Pore review chaile quizAttempts-e `ans` field + rules update lagbe.


=== Z) BOARD READER v2 + QUIZ RANDOM POOL (index.html, admin.html, sw.js v30) ===
Board Question (HSC-only):
 - Hub: bishoy grid (tomar dept onujayi: সাধারণ + Science/Arts/Commerce), "সব বিষয় দেখো" e baki gulo. Pora/Saved counter.
 - Bishoy page (#/board/<key>): ১ম পত্র / ২য় পত্র alada tab (ICT-r moto 1-patro bishoy-e tab nei), type (CQ/MCQ), odhyay chip, porikkha/board/saal filter.
 - Reader (#/board/q/<id>): উদ্দীপক box, proti part-er নম্বর (১/২/৩/৪), part-wise "উত্তর দেখো" + "সব উত্তর দেখাও", MCQ-te option tap korle ঠিক/ভুল + ব্যাখ্যা,
   Save, A−/A+ lekha-r size (mone thake), আগের/পরের, "পড়া" tick. #/board/saved = Saved prosno.
 - Purono board question (sk/pp nei) -> `sub` text theke auto bishoy dhora hoy; patro na thakle shudhu "সব" tab-e dekhay. Admin Edit korle patro bachai kore ঠিক kore nao.
Quiz random pool:
 - Quiz-e notun field `cnt` (protibar kota prosno; ফাঁকা = shob) ar `fx` (krom thik rakho). Default-e protibar prosno-r krom shuffle hoy.
 - cnt < pool hole: protibar alada prosno; age na-dekha prosno age ashe (localStorage mcn_qseen_<quizId>), pool shesh hole notun round.
 - Refresh/resume-e same drawn prosno thake (sessionStorage `ix`).
Admin:
 - Board form: পরীক্ষা (বোর্ড/নির্বাচনী/মডেল টেস্ট/কলেজ), বিষয় (HSC bishoy dropdown), পত্র, odhyay (age-r odhyay suggest hoy). Board list-e patro + porikkha dekhay.
 - Quiz form: "প্রতিবার কতটি প্রশ্ন" + "প্রশ্নের ক্রম ঠিক রাখো".
 - firestore.rules BODLAY NI (notun field allow-ei ache).
 - HSC_SUBJ list index.html ar admin.html du jayga-te ache, bodlale duto-ei bodlate hobe.


=== AA) BANGLA অংশ + CHORCHA-STYLE PRACTICE (index.html, admin.html, sw.js v31) ===
 - Board > Bangla: ১ম পত্র = সাহিত্যপাঠ + সহপাঠ, ২য় পত্র = ব্যাকরণ ও নির্মিতি. Notun "অংশ" chip row (paper tab-er niche); card/reader-e অংশ-er naam.
   Admin Board form-e notun "অংশ (বাংলা)" dropdown (field `pt`: sp | sh | bn). Purono ২য় পত্র Bangla question auto "ব্যাকরণ ও নির্মিতি" hishebe dhore.
 - Board hub: দিনের Streak, "কাস্টম মক টেস্ট" (#/board/mock: bishoy + অংশ + 10/20/30/50 prosno + Exam/Practice, Board MCQ pool theke random),
   "ভুল রিভিউ" (#/board/mistakes: Quiz/Board MCQ/Mock-e bhul hoya prosno jome, sathe ব্যাখ্যা + oigulo diye Practice). Shob data phone-er localStorage-e.
 - Mock quizAttempts-e save hoy na. Firestore rules BODLAY NI. Deploy-er por student-er app-e "Update" banner ashbe.

=== AB) QUIZ/BOARD ADMIN SIMPLIFY + STUDENT-CHOSEN EXAM (index.html, admin.html, sw.js v32) ===
 - Admin Quiz form: shudhu বিষয়, পত্র, অংশ (Bangla), অধ্যায় ১–২০ + অধ্যায়ের নাম, Mode. Title auto = বিষয় · পত্র · অংশ · অধ্যায়.
   Removed: শিরোনাম, সময়, ভুল কাটা, শেষ তারিখ, Schedule, প্রতিবার কতটি, Page checkbox (ekhon admin-er shob scope Page-e jay).
 - Admin Board form: অধ্যায় text -> অধ্যায় select (১–২০) + নাম; Page checkbox remove. Fields: chn, cn, ch ("অধ্যায় ৩: নাম").
 - Student Exam intro: prosno-songkha, somoy, negative nijei select. Practice: sobsomoy ২০টি prosno (pool-e kom thakle jotota ache).

=== AC) ADMIN PANEL: 7-GROUP STRUCTURE (admin.html, sw.js v33) ===
 Sidebar = 7 group (Dashboard, Content, Academic Hub, Students, Communication, Website, Administration). Group click -> prothom item; upore chip bar-e sub-menu.
 Academic Hub-e 3 ti pill: Dashboard | Board Question Mgmt (12) | Quiz Mgmt (11). Hash = item key (#bq-mcq, #qz-new ...). Purono #qbm, #qbd cholbe.
 Board status workflow: Draft -> Under Review -> Verified -> Published (field `stt` + `draft`). Shudhu Published student dekhe (qLive draft check).
 Owner-only: Quiz Participants/Results/Analytics, Student Activities/Learning Progress, Website group.
 Placeholder (এখনো তৈরি হয়নি): Reported Questions, Homepage Mgmt, Homepage Sections, Navigation, Footer.

=== AD) REPORTED QUESTIONS (index.html, admin.html, firestore.rules, sw.js v34) ===
 - Student: Board reader-er upore "Report" button -> karon (ভুল উত্তর / বানান / অসম্পূর্ণ / অন্য) + optional note -> qReports/{uid}_{questionId}. 1 prosno-te 1 report.
 - Admin: Academic Hub > Board Question > Reported Questions. Edit প্রশ্ন / Hide (Review-e pathay) / সমাধান / বাতিল / Delete. Open count badge menu-te.
 - FIRESTORE RULES UPDATE LAGBE: firestore.rules ta Firebase Console > Firestore > Rules-e paste kore Publish korte hobe (notun match /qReports).

=== AE) WEBSITE MANAGEMENT (index.html, admin.html, firestore.rules, sw.js v35) ===
 - Owner-only: Website group > Homepage Management (hero শিরোনাম/বিবরণ), Homepage Sections (ticker/strip/stats/category chips on-off), Navigation Management (max 3 extra link: top menu + footer), Footer Management (copyright, iPhone tip on-off).
 - Data: Firestore config/site. Student site cache kore (localStorage mcn_site), notun value ektu por dekhay.
 - FIRESTORE RULES UPDATE LAGBE: firestore.rules ta Console-e Publish korte hobe (notun match /config/site: public read, Owner write).
 - Mobile bottom nav (bnav) bodlay na; extra link shudhu top menu + footer-e.

=== AF) QUIZ PROSNO REPORT (index.html, admin.html, sw.js v36) ===
 - Quiz result review-te ar Board MCQ-er proti prosno-te "সমস্যা জানাও" button. Report doc: qReports/{uid}_{quizId-index}, kind:"quiz". Rules bodlate hobe na.
 - Admin Reported Questions-e "[Quiz]" tag + "Edit Quiz" button. Mock/ভুল রিভিউ test-e button nei.


=== AG) SERVER-SIDE EXAM GRADING (api/grade.js, admin.html, index.html, firestore.rules, sw.js v42) ===
 - Exam quiz save korle answer/byakkha quizzes doc theke soriye quizKeys/{id}-te jay (quizzes.sec=1). Student-er browser-e Submit-er age answer key pouchay na.
 - Student Submit -> POST /api/grade -> server grade kore, quizAttempts ekbar-i likhe, ঠিক uttor + byakkha ferot dey (result/review ager moto).
 - Practice quiz ager moto (answer sathe sathe dekhay). Mock test ager moto client-e.
 - Purono Exam: Admin > Academic Hub > Quiz Mgmt > All Quiz-er upore "Secure করো" button (ekbar) -> purono Exam-er answer quizKeys-e jay.
 - Edit korle admin-er form-e answer quizKeys theke ashe, save-e abar alada hoy.
 DEPLOY: (1) firestore.rules Publish (2) Vercel deploy (notun api/grade.js; function ekhon 11 ta, limit 12) (3) Admin-e "Secure করো" chapo.
 Note: Secure korar age rules Publish korle purono (unsecured) Exam kaj korbe; secure-er por notun rules-e client attempt likhte pare na, shudhu server.
 Note: quizKeys-e doc na thakle (sec=1 kintu key nei) student-er Submit "Submit hoyni" dekhabe.

=== AH) EXAM TIME-LIMIT SERVER-E CHECK (api/grade.js, index.html, firestore.rules, sw.js v43) ===
 - Secured Exam shuru korar somoy /api/grade {action:"start"} -> server examStarts/{uid_quizId}-te shuru-r somoy ar min likhe. Timer server-er baki somoy theke cholay.
 - Refresh / tab bondho kore abar shuru korleo timer reset hoy na (server-er original start-i thake). Somoy age-i shesh hole 0 nombor, Exam lock.
 - Submit-e server somoy check kore: shuru + min + 45 sec (grace) er por hole nombor 0 (late:true) -- uttor review-e dekhay kintu nombor pay na. "used" server nijei hishab kore.
 - Min-er upper limit server-e: max(60, prosno x 0.75) (client-er option-er sathe mil). Exam deadline (dl) thakle start-o server check kore.
 - DEPLOY: firestore.rules Publish (notun examStarts) + Vercel deploy. Notun function lagbe na (grade.js-ei).
 - Note: secured Exam-e start-er jonno internet lagbe. Purono (unsecured) Exam ager moto client timer; Secure kore nao (AG section).

=== AI) QUIZ ATTEMPT HISTORY (index.html, api/grade.js, firestore.rules, sw.js v44) ===
 - Proti Quiz attempt alada save hoy: users/{uid}/history/{auto} {quizId,score,correct,wrong,total,used,ts,mode}. Practice-e client likhe, Exam-e /api/grade (server).
 - Portal > My Learning > Learning History: shob attempt (notun age), 100 ta porjonto; tap korle oi Quiz-e. Purono (ei update-er age-r) attempt quizAttempts theke ekta kore dekhay.
 - Shudhu nijer history pora jay (rules: auth.uid == uid); Owner-er Dashboard quizAttempts-ei thake (ager moto).
 - Progress/Subject/Chapter page ekhono quizAttempts-er shesh attempt dhore hishab kore.
 - DEPLOY: firestore.rules Publish + Vercel deploy. Late (0 nombor, somoy-shesh) attempt history-te jay na, shudhu quizAttempts-e thake.

=== AJ) PROGRESS/ANALYTICS = SHOB ATTEMPT (index.html, sw.js v45) ===
 - My Progress, Performance Analytics, Subject-wise, Chapter-wise ekhon users/{uid}/history-r shob attempt (+ purono quizAttempts) dhore hishab kore.
   Gor % = sob attempt-er mot thik / mot prosno. Ekta Quiz bar bar dile protibar-i ganona hoy.
 - My Progress-er "Quiz sompurno" = alada Quiz-er songkha. Analytics trend = shesh 7 ta attempt (bar chart).
 - Late (0 nombor) Exam-e total=0, tai % hishabe prabhab pore na kintu sera/trend-e 0% dekhay.
 - Recent Activities-eo ekhon attempt-gulo alada dekhay. Rules/server bodlay ni, shudhu deploy + sw.js v45.

=== AK) WRONG ANSWER REVISION PAGE (index.html, sw.js v46) ===
 - Portal > Academic Hub > Quiz & Exam > Wrong Answer Revision = #/portal/wrong. Ager "ভুল রিভিউ" (#/board/mistakes) cholbe, ei page-o ekoi data (localStorage mcn_bmis) dhore.
 - Quiz/Exam Submit-er somoy bhul prosno-r sathe ekhon source jome: {sub, ch, t, z, ts}. Notun bhul gulo bishoy/odhyay onujayi filter kora jay; purono bhul "অন্যান্য"-te.
 - Page-e: stats (mot bhul, bishoy, sobcheye bhul bishoy), bishoy + odhyay chip, proti prosno-te option tap kore nijei abar try (sathe sathe ঠিক/ভুল + ব্যাখ্যা),
   "মনে আছে, সরাও", ar filter kora prosno diye "Practice করো" (max 30). Practice-e ঠিক dile ager moto auto list theke soriye jay.
 - Data shudhu oi device-er localStorage-e (max 150 ta); onno student dekhte pay na. Server/rules bodlay ni -- shudhu Vercel deploy + sw.js v46.

=== AL) WATERMARK UTHANO (index.html, sw.js v47) ===
 - Board page ar Quiz cholar somoy je naam-email watermark overlay (#qbwm) dekhato ta soriye fela hoyeche.
 - Copy / Cut / Right-click / Drag / Ctrl+P,S,C,A,U bondho ager moto-i ache (body.prot). Board hub-er notice-eo "watermark" lekha tule deya hoyeche.
 - Deploy: shudhu Vercel deploy (sw.js v47 -> "Update" banner).
