/* MCUN redesign layer v2: dropdown sidebar + top bar + full new dashboard (replaces old home). Logo untouched. */
(()=>{
const P=(d,c)=>`<svg viewBox="0 0 24 24" aria-hidden="true"${c?` class="${c}"`:''}>${d}</svg>`;
const IC={
dash:'<path d="m3 11 9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
upd:'<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
hub:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
learn:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
lib:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
com:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
acc:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
chk:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
srch:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',chart:'<path d="M3 3v18h18"/><path d="M7 15v3M12 10v8M17 6v12"/>',
file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M9 14h6M9 17h4"/>',
chev:'<path d="m6 9 6 6 6-6"/>',arr:'<path d="M5 12h14M13 6l6 6-6 6"/>',bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
bolt:'<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
mark:'<path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',cap:'<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
clip:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
heart:'<path d="M20.8 4.600a5.500 5.500 0 0 0-7.800 0L12 5.700l-1-1.100a5.500 5.500 0 0 0-7.800 7.800l1 1.100L12 21.300l7.800-7.800 1-1.100a5.500 5.500 0 0 0 0-7.800z"/>',folder:'<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',hist:'<path d="M3 12a9 9 0 1 0 3-6.700L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',book:'<path d="M4 19.500A2.500 2.500 0 0 1 6.500 17H20V3H6.500A2.500 2.500 0 0 0 4 5.500z"/>',bulb:'<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.700c.600.500 1 1.300 1 2.300h6c0-1 .4-1.800 1-2.300A7 7 0 0 0 12 2z"/>',star:'<path d="m12 2 3 6.900 7.500.6-5.700 4.900 1.800 7.300L12 17.800 5.400 21.700l1.800-7.300L1.500 9.500 9 8.900z"/>',eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',flame:'<path d="M12 2s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z"/>',clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>'};
const $=s=>document.querySelector(s),T=(f,d)=>{try{const v=f();return v==null?d:v}catch(e){return d}};
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const hp=()=>location.hash.replace(/^#\/?/,'').split('/');
const full=()=>matchMedia('(min-width:1024px)').matches;
function grp(){const h=hp(),a=h[0]||'home',b=h[1]||'';
 if(a==='home')return 'dash';if(T(()=>PT.some(g=>g[0]===a),false))return a;
 if(a==='quiz'||a==='board')return b==='saved'?'lib':'hub';
 if(a==='saved')return 'lib';if(a==='inbox')return 'com';if(a==='profile'||a==='contact')return 'acc';
 if(a==='feat'){if(['progress','analytics','subjprog','chprog','history'].includes(b))return 'learn';if(b==='recent')return 'lib';
  if(['materials','dlhist','resources'].includes(b))return 'dl';if(['settings','password'].includes(b))return 'acc';
  if(['bf','qf','wrong'].includes(b))return 'hub';return 'dash'}
 return 'upd'}
/* ---------- sidebar with dropdowns ---------- */
const OPENS=new Set();const LBL={acc:'My Profile'};const SIC={hub:'cap',learn:'bkstar',lib:'mark',com:'bell'};const PLAIN={dash:'#/',lib:'#/lib',dl:'#/dl'};
const ACCSUB=[['Profile Overview','#/profile','acc',1],['Academic Info','#/profile/academic','cap',1],['Account Settings','#/feat/settings','gear'],['Change Password','#/feat/password','lock'],['Help & Support','#/contact','headset']];
const SI=l=>/important|notice/i.test(l)&&/important/i.test(l)?IC.star:/all notice/i.test(l)?IC.upd:/routine|exam/i.test(l)?IC.cal:/syllabus/i.test(l)?IC.hub:/suggest/i.test(l)?IC.bulb:/result/i.test(l)?IC.trophy:/event/i.test(l)?IC.cal:IC.file;
const HUBSUB=[['Board Questions','#/board',IC.hub],['Quiz & Exam','#/quiz',IC.trophy],['Study Resources','#/dl',IC.cap]];
const LIBSUB=[['Saved Questions','saved',IC.mark],['Bookmarked','bookmarked',IC.heart],['Collections','collections',IC.folder],['History','history',IC.hist]];
function sub(g){if(g[0]==='acc')return ACCSUB.map(i=>`<a class="mc-s" href="${i[1]}"${i[3]?' data-ex="1"':''}>${P(IC[i[2]])}<span>${E(i[0])}</span></a>`).join('');if(g[0]==='com')return COMSUB.map(i=>`<a class="mc-s" href="#/inbox" data-com="${i[0]}">${P(i[2])}<span>${E(i[1])}</span></a>`).join('');if(g[0]==='dl')return DLSUB.map(i=>`<a class="mc-s" href="#/dl" data-dl="${i[0]}">${P(i[2])}<span>${E(i[1])}</span></a>`).join('');if(g[0]==='lib')return LIBSUB.map(i=>`<a class="mc-s" href="#/lib" data-lib="${i[1]}">${P(i[2])}<span>${E(i[0])}</span></a>`).join('');if(g[0]==='hub')return HUBSUB.map(i=>`<a class="mc-s" href="${i[1]}">${P(i[2])}<span>${E(i[0])}</span></a>`).join('');return g[3].map(i=>{
 if(i[1]===0)return `<div class="mc-sl">${E(i[0])}</div>`;
 if(Array.isArray(i[1]))return `<a class="mc-s" href="#/notices" data-cat="${E(i[1][1]||'')}">${P(SI(i[0]))}<span>${E(i[0])}</span></a>`;
 return `<a class="mc-s" href="${E(i[1])}">${P(SI(i[0]))}<span>${E(i[0])}</span></a>`}).join('')}
function side(){let s=$('#mcSide');
 if(!s){s=document.createElement('aside');s.id='mcSide';document.body.prepend(s);
  s.innerHTML=`<a class="mc-brand" href="#/"><img src="logo.png" alt="MCUN"><b>MCUN</b><small>Mirpur College<br>Updates &amp; Notices</small></a><nav>`
  +PT.map(g=>PLAIN[g[0]]?`<a class="mc-i" data-g="${g[0]}" title="${E(g[2])}" href="${PLAIN[g[0]]}">${P(IC[SIC[g[0]]||g[0]])}<span>${E(g[2])}</span></a>`
   :`<div class="mc-g" data-g="${g[0]}"><button type="button" class="mc-i mc-h" title="${E(g[2])}" data-t="${g[0]}">${P(IC[SIC[g[0]]||g[0]]||'')}<span>${E(LBL[g[0]]||g[2])}</span><b class="mc-bd" hidden></b>${P(IC.chev,'mc-chev')}</button><div class="mc-sub">${sub(g)}</div></div>`).join('')
  +`</nav><div class="mc-promo"><img src="logo.png" alt=""><b>Mirpur College</b><span>Stay Connected,</span><em>Stay Informed!</em></div><div class="mc-out"><button class="mc-i" type="button" title="Logout" onclick="try{logout()}catch(e){}">${P(IC.out)}<span>Logout</span></button></div>`;
  s.addEventListener('click',e=>{
   const h=e.target.closest('.mc-h');
   if(h){const id=h.dataset.t;if(!full()){location.hash=id==='acc'?'#/profile':'#/'+id;return}const was=OPENS.has(id);was?OPENS.delete(id):OPENS.add(id);mark();if((id==='hub'||id==='com')&&!was&&hp()[0]!==(id==='com'?'inbox':id))location.hash=id==='com'?'#/inbox':'#/'+id;return}
   const cm=e.target.closest('a[data-com]');if(cm){e.preventDefault();COM.tab=cm.dataset.com;COM.page=1;COM.q='';if(hp()[0]==='inbox')T(()=>route());else location.hash='#/inbox';setTimeout(mark,30);return}
   const dk=e.target.closest('a[data-dl]');if(dk){e.preventDefault();DL.cat=dk.dataset.dl;DL.page=1;DL.q='';DL.sub='';DL.open=null;if(hp()[0]==='dl')T(()=>route());else location.hash='#/dl';setTimeout(mark,30);return}
   const lb=e.target.closest('a[data-lib]');if(lb){e.preventDefault();LB.tab=lb.dataset.lib;LB.page=1;LB.q='';if(hp()[0]==='lib')T(()=>route());else location.hash='#/lib';setTimeout(mark,30);return}
   const c=e.target.closest('a[data-cat]');
   if(c){e.preventDefault();mcCat(c.dataset.cat||null)}});
  OPENS.add(grp())}
 mark()}
function mark(){const s=$('#mcSide');if(!s)return;const g=grp();if(!mark.i){mark.i=1;OPENS.add(g)}
 s.querySelectorAll('[data-g]').forEach(a=>a.classList.toggle('on',a.dataset.g===g));
 s.querySelectorAll('.mc-g').forEach(d=>d.classList.toggle('open',OPENS.has(d.dataset.g)));
 const cur=location.hash||'#/',nt=hp()[0]==='notices';
 s.querySelectorAll('.mc-s').forEach(a=>{const c=a.dataset.cat;
  const hr=a.getAttribute('href');if(a.dataset.com!==undefined){a.classList.toggle('on',hp()[0]==='inbox'&&COM.tab===a.dataset.com);return}if(a.dataset.dl!==undefined){a.classList.toggle('on',hp()[0]==='dl'&&DL.cat===a.dataset.dl);return}if(a.dataset.lib!==undefined){a.classList.toggle('on',hp()[0]==='lib'&&LB.tab===a.dataset.lib);return}a.classList.toggle('on',c!==undefined?(nt&&(T(()=>S.cat,'')||'')===c):(a.dataset.ex!==undefined?cur===hr:(cur===hr||cur.startsWith(hr+'/'))))});
 const pr=s.querySelector('.mc-promo');if(pr&&pr.dataset.k!==(['upd','dash','com'].includes(g)?'n':'h')){pr.dataset.k=['upd','dash','com'].includes(g)?'n':'h';pr.innerHTML=!['upd','dash','com'].includes(g)?`${P(IC.trophy)}<span>Keep Learning,<br>Achieve More!</span><em>&mdash; MCUN</em>`:`<img src="logo.png" alt=""><b>Mirpur College</b><span>Stay Connected,</span><em>Stay Informed!</em>`}
 const b=s.querySelector('[data-t="com"] .mc-bd'),n=T(()=>nUnread(),0);if(b){b.textContent=n>9?'9+':n;b.hidden=!n}}
/* ---------- top bar ---------- */
function top(){const n=$('header .nav');if(!n)return;
 if(!n.querySelector('.mc-search')){const f=document.createElement('form');f.className='mc-search';
  f.innerHTML=P(IC.srch)+'<input type="search" placeholder="Search notices, topics, or anything..." aria-label="Search">';
  f.onsubmit=e=>{e.preventDefault();const v=f.querySelector('input').value.trim();
   if(hp()[0]==='lib'){LB.q=v;LB.page=1;T(()=>route());return}if(hp()[0]==='dl'){DL.q=v;DL.page=1;T(()=>route());return}if(hp()[0]==='inbox'){COM.q=v;COM.page=1;T(()=>route());return}T(()=>{S.q=v});NS.page=1;reNotices()};
  n.insertBefore(f,n.querySelector('.sp'))}
 {const i=n.querySelector('.mc-search input'),h0=hp()[0];if(i)i.placeholder=h0==='lib'?'Search in your library...':h0==='dl'?'Search for study materials...':h0==='inbox'?'Search notifications, messages...':h0==='profile'?'Search anything...':h0==='hub'?'Search for questions, quizzes, or anything...':'Search notices, topics, or anything...'}
 let w=n.querySelector('.mc-who');if(!w){w=document.createElement('div');w.className='mc-who';n.insertBefore(w,$('#meBtn'))}
 const p=T(()=>U.prof,null);w.innerHTML=p?`<b>${E(p.name)}</b><small>${E(p.dept||'')}${p.year?'-'+E(p.year):''}</small>`:''}
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){const i=$('.mc-search input');if(i){e.preventDefault();i.focus()}}});
/* ---------- new dashboard ---------- */
const ART=`<svg viewBox="0 0 420 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="mcs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ec5ff"/><stop offset="1" stop-color="#dbeafe"/></linearGradient></defs><rect width="420" height="220" fill="url(#mcs)"/><circle cx="60" cy="150" r="46" fill="#2f7d3a"/><circle cx="360" cy="140" r="54" fill="#2a6f34"/><circle cx="395" cy="95" r="34" fill="#3a8c46"/><rect x="95" y="52" width="230" height="150" fill="#b4533c"/><rect x="95" y="52" width="230" height="14" fill="#8f3f2d"/><rect x="150" y="30" width="120" height="22" rx="3" fill="#f8fafc"/><rect x="158" y="38" width="104" height="5" rx="2" fill="#1e3a8a"/><rect x="170" y="46" width="80" height="3" rx="1" fill="#1e3a8a" opacity=".5"/>${[0,1,2].map(r=>[0,1,2,3,4,5,6,7].map(c=>`<rect x="${107+c*27}" y="${76+r*38}" width="16" height="22" fill="#dbeafe" stroke="#f1f5f9" stroke-width="2"/>`).join('')).join('')}<rect x="190" y="164" width="40" height="38" fill="#7c2d1c"/><rect x="0" y="200" width="420" height="20" fill="#475569"/></svg>`;
let pl=0;
function ensure(){if(!T(()=>U.prof,null))return;T(()=>{qbLoad('boardQ');qbLoad('quiz')});
 if((QB.bq==null||QB.qz==null)&&!pl){pl=1;let k=0;const t=setInterval(()=>{if((QB.bq!=null&&QB.qz!=null)||++k>24){clearInterval(t);pl=0;if(['','home','hub','lib'].includes(hp()[0])||(hp()[0]==='profile'&&!PF.ed))T(()=>route())}},500)}}
const fd=ts=>new Date(ts).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
function ring(pc){const r=52,c=2*Math.PI*r;return `<svg viewBox="0 0 130 130" class="mcd-ring"><circle cx="65" cy="65" r="${r}" fill="none" stroke="color-mix(in srgb,#16a34a 16%,transparent)" stroke-width="14"/><circle cx="65" cy="65" r="${r}" fill="none" stroke="#16a34a" stroke-width="14" stroke-linecap="round" stroke-dasharray="${(c*pc/100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 65 65)"/><text x="65" y="74" text-anchor="middle" font-size="28" font-weight="800" fill="currentColor">${pc}%</text></svg>`}
function dashHTML(){ensure();
 const p=T(()=>U.prof,{})||{},now=Date.now(),R=T(()=>plData(),[]),posts=T(()=>S.posts.filter(x=>vis(x)&&!isExp(x)),[]);
 const bq=T(()=>bqAll().length,T(()=>QB.bq.length,0)),tc=R.reduce((a,r)=>a+r.c,0),tt=R.reduce((a,r)=>a+r.tot,0),ov=tt?Math.round(tc*100/tt):0,best=R.length?Math.max(...R.map(r=>r.pc)):0;
 const subj=T(()=>plGroup(R.filter(r=>r.sub),'sub'),[]);
 const stats=[[IC.bell,'#2563eb',posts.length,'Total Notices','#/notices'],[IC.hub,'#16a34a',bq,'Board Questions','#/board'],[IC.chk,'#7c3aed',R.length,'Quizzes Completed','#/quiz'],[IC.trophy,'#f59e0b',best+'%','Best Score','#/feat/progress']]
  .map(x=>`<a class="mcd-st" style="--c:${x[1]}" href="${x[4]}"><i>${P(x[0])}</i><div><b>${x[2]}</b><span>${x[3]}</span></div>${P(IC.chev,'mcd-go')}</a>`).join('');
 const lat=[...posts].sort((a,b)=>(b.ts||0)-(a.ts||0)).slice(0,5).map(x=>{const c=T(()=>CATS[x.cat],{n:'Notice',c:'#2563eb'});
  return `<a class="mcd-nr" style="--c:${c.c}" onclick="openPost('${E(x.id)}')"><em>${E(c.n)}</em><span>${E(x.title)}</span><small>${x.ts?fd(x.ts):''}</small></a>`}).join('')||'<p class="mcd-em">No notices yet.</p>';
 const qa=[['#/board',IC.hub,'Board Questions','#2563eb'],['#/feat/qf/practice',IC.clip,'Practice Quiz','#16a34a'],['#/board/mock',IC.file,'Model Test','#7c3aed'],['#/feat/progress',IC.chart,'My Progress','#0d9488'],['#/board/saved',IC.mark,'Saved Questions','#f59e0b'],['#/dl',IC.cap,'Study Resources','#2563eb']]
  .map(x=>`<a href="${x[0]}" style="--c:${x[3]}"><i>${P(x[1])}</i>${x[2]}</a>`).join('');
 let ex=T(()=>QB.qz.filter(z=>z.at&&z.at>now&&!z.draft).map(z=>({t:z.t||'Exam',at:z.at,u:'#/quiz'})),[]);
 if(!ex.length)ex=posts.filter(x=>x.dl&&x.dl>now).map(x=>({t:x.title,at:x.dl,u:`javascript:openPost('${E(x.id)}')`}));
 ex.sort((a,b)=>a.at-b.at);const nx=ex[0];
 const exh=nx?`<a class="mcd-ex" href="${nx.u}">${P(IC.cal)}<div><b>${E(nx.t)}</b><span>${new Date(nx.at).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'numeric',minute:'2-digit'})}</span></div></a>
  <div class="mcd-cd" data-ts="${nx.at}"><div><b>00</b>Days</div><div><b>00</b>Hours</div><div><b>00</b>Minutes</div><div><b>00</b>Seconds</div></div>`:'<p class="mcd-em">No upcoming exams scheduled.</p>';
 const top3=[...subj].sort((a,b)=>b.pc-a.pc).slice(0,3),low=subj.slice(0,3);
 const prog=R.length?`<div class="mcd-pr">${ring(ov)}<ul>${top3.map(s=>`<li>${P(IC.chk)}<span>${E(s.n)}</span><b>${s.pc}%</b></li>`).join('')||`<li><span>${R.length} quiz attempts</span></li>`}</ul></div><div class="mcd-tip">${ov>=70?'Great Progress! Keep it up! 🏆':'Keep practicing, you are getting there! 💪'}</div>`:`<div class="mcd-pr">${ring(0)}<ul><li><span>Take your first quiz to see progress</span></li></ul></div><div class="mcd-tip">Start with a Practice Quiz 🚀</div>`;
 const r0=R[0],rec=r0?`<div class="mcd-rq">${P(IC.clip)}<div><div class="mcd-ok">${P(IC.chk)}Quiz Completed Successfully!</div><p><b>${E(r0.t)}</b></p><p>Score: ${r0.c} / ${r0.tot} (${r0.pc}%)</p><p>Date: ${fd(r0.ts)}</p></div></div><a class="mcd-btn" href="#/quiz">Try Another Quiz ${P(IC.arr)}</a>`:`<p class="mcd-em">No quiz attempted yet.</p><a class="mcd-btn" href="#/quiz">Start a Quiz ${P(IC.arr)}</a>`;
 const need=low.length?`<ul class="mcd-lw">${low.map(s=>`<li><span>${E(s.n)}</span><i><u style="width:${s.pc}%"></u></i><b>${s.pc}%</b></li>`).join('')}</ul><a class="mcd-btn" href="#/feat/wrong">Revise Wrong Answers ${P(IC.arr)}</a>`:'<p class="mcd-em">Subject-wise results will appear after your quizzes.</p>';
 const box=(ic,t,l,body,cls)=>`<section class="mcd-box ${cls||''}"><h3><span>${P(ic)}${t}</span>${l?`<a href="${l}">View All ${P(IC.arr)}</a>`:''}</h3>${body}</section>`;
 return `<div class="mcd"><section class="mcd-hero"><div class="mcd-ht"><h1>Welcome Back, <em>${E(p.name||'Student')}!</em> 👋</h1><p>Keep learning, keep growing. Your academic journey with MCUN is always here to support you.</p><a class="mcd-cta" href="#/notices">Explore Now ${P(IC.arr)}</a></div><div class="mcd-art">${ART}</div></section>
 <div class="mcd-stats">${stats}</div>
 <div class="mcd-g mcd-g1">${box(IC.upd,'Latest Notices','#/notices',lat)}${box(IC.bolt,'Quick Access','',`<div class="mcd-qa">${qa}</div>`)}${box(IC.cal,'Upcoming Exams','#/quiz',exh)}</div>
 <div class="mcd-g mcd-g2">${box(IC.chart,'Your Learning Progress','#/feat/progress',prog)}${box(IC.trophy,'Recent Quiz Result','#/feat/history',rec)}${box(IC.users,'Needs Practice','#/feat/subjprog',need)}</div></div>`}

/* ---------- College Updates page ---------- */
const NS={page:1,sort:'latest'};
const KF=n=>n>=1000?(n/1000).toFixed(1).replace('.0','')+'K':String(n);
const CI={notice:IC.upd,routine:IC.cal,syllabus:IC.hub,suggestion:IC.bulb,result:IC.trophy,event:IC.cal};
function reNotices(){if(hp()[0]==='notices')T(()=>route());else location.hash='#/notices'}
window.mcCat=c=>{S.cat=c||null;NS.page=1;reNotices();setTimeout(mark,30)};
window.mcSort=v=>{NS.sort=v;NS.page=1;T(()=>route())};
window.mcPage=n=>{NS.page=n;T(()=>route());const l=document.getElementById('mcnList');l&&l.scrollIntoView({behavior:'smooth',block:'start'})};
window.mcExp=()=>{S.st=S.st==='expired'?'active':'expired';NS.page=1;T(()=>route())};
window.mcClr=()=>{S.q='';NS.page=1;T(()=>route())};
const MEGA='<svg viewBox="0 0 140 120" aria-hidden="true"><g fill="#fff"><path d="M20 52 88 22v72L20 68z"/><rect x="10" y="48" width="16" height="24" rx="5" fill="#cbd5e1"/><path d="M34 72h18l6 26a5 5 0 0 1-10 2z" fill="#e2e8f0"/><rect x="88" y="18" width="10" height="80" rx="5" fill="#e2e8f0"/></g><g stroke="#fbbf24" stroke-width="5" stroke-linecap="round"><path d="m108 28 12-10M112 52h18M108 76l12 10"/></g></svg>';
function noticesHTML(){
 const now=Date.now(),exp=S.st==='expired',cat=S.cat||null,DAYMS=864e5;
 const all=T(()=>S.posts.filter(p=>match(p)&&vis(p)),[]);
 const act=all.filter(p=>!isExp(p));
 let l=all.filter(p=>(exp?isExp(p):!isExp(p))&&(!cat||p.cat===cat));
 if(NS.sort==='oldest')l.sort((a,b)=>(a.ts||0)-(b.ts||0));
 else if(NS.sort==='deadline')l.sort((a,b)=>(a.dl||9e15)-(b.dl||9e15));
 else l.sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||(b.ts||0)-(a.ts||0));
 const tot=l.length,per=5,pages=Math.max(1,Math.ceil(tot/per)),pg=Math.min(NS.page,pages);NS.page=pg;
 const sl=l.slice((pg-1)*per,pg*per),HL=x=>T(()=>hl(x),E(x));
 const tabs=[[null,'All Notices',IC.upd],['notice','Important',IC.star],['routine','Exam Routine',IC.cal],['syllabus','Syllabus',IC.hub],['suggestion','Suggestions',IC.bulb],['result','Results',IC.trophy],['event','Events',IC.cal]]
  .map(t=>`<button type="button" class="mcn-tab${cat===t[0]?' on':''}" onclick="mcCat(${t[0]?`'${t[0]}'`:'null'})">${P(t[2])}${t[1]}</button>`).join('');
 const rows=sl.map(p=>{const c=T(()=>CATS[p.cat],{n:'Notice',c:'#2563eb'}),cv=T(()=>p.cover&&ok(p.cover.url),false),na=T(()=>cnt(p),0),ex=String(p.body||'').replace(/\s+/g,' ').slice(0,150);
  return `<article class="mcn-row" style="--c:${c.c}" onclick="openPost('${E(p.id)}')"><span class="mcn-bar"></span>
  <div class="mcn-th">${cv?`<img src="${E(p.cover.url)}" alt="" loading="lazy">`:P(CI[p.cat]||IC.upd)}</div>
  <div class="mcn-b"><div class="mcn-tg"><em>${E(c.n)}</em>${T(()=>dlBadge(p),'')}</div><h3>${HL(p.title)}</h3><p>${HL(ex)}</p>
  <div class="mcn-m"><span>${P(IC.cal)}${p.ts?fd(p.ts):''}</span>${p.views!=null?`<span>${P(IC.eye)}${KF(+p.views||0)} views</span>`:''}${na?`<span>${P(IC.file)}${na} attachment</span>`:''}</div></div>
  <span class="mcn-vd">View Details ${P(IC.arr)}</span></article>`}).join('')||`<p class="mcd-em" style="padding:22px 6px">${exp?'No expired updates.':'No updates found.'}</p>`;
 const a=Math.max(1,Math.min(pg-2,pages-4)),b=Math.min(pages,a+4);let pb='';
 for(let i=a;i<=b;i++)pb+=`<button type="button" class="${i===pg?'on':''}" onclick="mcPage(${i})">${i}</button>`;
 if(pg<pages)pb+=`<button type="button" onclick="mcPage(${pg+1})" aria-label="Next">${P(IC.arr)}</button>`;
 const imp=act.filter(p=>p.cat==='notice').sort((x,y)=>(y.ts||0)-(x.ts||0)).slice(0,3).map(p=>{const u=p.dl&&p.dl-now<=3*DAYMS;
  return `<a class="mcn-im" onclick="openPost('${E(p.id)}')"><i></i><span>${E(p.title)}</span>${u?'<em>Urgent</em>':`<small>${p.ts?fd(p.ts):''}</small>`}</a>`}).join('')||'<p class="mcd-em">No important notices.</p>';
 const ql=[[null,'Latest Notices',IC.bell],['routine','Exam Routine',IC.cal],['syllabus','Syllabus',IC.hub],['result','Results',IC.trophy]]
  .map(t=>`<a onclick="mcCat(${t[0]?`'${t[0]}'`:'null'})">${P(t[2])}${t[1]}</a>`).join('');
 const evs=act.filter(p=>p.cat==='event'),ev=evs.filter(p=>p.dl&&p.dl>now).sort((x,y)=>x.dl-y.dl)[0]||[...evs].sort((x,y)=>(y.ts||0)-(x.ts||0))[0];
 const evh=ev?(()=>{const d=new Date(ev.dl||ev.ts);return `<a class="mcn-ev" onclick="openPost('${E(ev.id)}')"><div class="mcn-dt"><small>${d.toLocaleString('en-GB',{month:'short'}).toUpperCase()}</small><b>${d.getDate()}</b></div><div><b>${E(ev.title)}</b><span>${P(IC.clock)}${ev.dl?d.toLocaleTimeString('en-GB',{hour:'numeric',minute:'2-digit',hour12:true}):fd(ev.ts)}</span></div></a>`})():'<p class="mcd-em">No upcoming events.</p>';
 const box=(ic,t,fn,body)=>`<section class="mcd-box"><h3><span>${P(ic)}${t}</span>${fn?`<a href="#/notices" onclick="${fn};return false">View All ${P(IC.arr)}</a>`:''}</h3>${body}</section>`;
 return `<div class="mcn"><section class="mcd-hero mcn-hero"><div class="mcn-mega">${MEGA}</div><div class="mcd-ht"><h1>College <em>Updates</em></h1><p>Stay updated with the latest notices, routines, and announcements of Mirpur College.</p><a class="mcd-cta" href="#/notices" onclick="document.getElementById('mcnList').scrollIntoView({behavior:'smooth'});return false">Explore All Updates ${P(IC.arr)}</a></div><div class="mcd-art">${ART}</div></section>
 <div class="mcn-ctl"><div class="mcn-tabs">${tabs}</div><div class="mcn-sort"><button type="button" class="${exp?'on':''}" onclick="mcExp()">${P(IC.clock)}Expired</button><select onchange="mcSort(this.value)" aria-label="Sort"><option value="latest"${NS.sort==='latest'?' selected':''}>Latest First</option><option value="oldest"${NS.sort==='oldest'?' selected':''}>Oldest First</option><option value="deadline"${NS.sort==='deadline'?' selected':''}>Deadline Soon</option></select></div></div>
 ${S.q?`<div class="mcn-q">Results for <b>&ldquo;${E(S.q)}&rdquo;</b><button type="button" onclick="mcClr()">Clear &times;</button></div>`:''}
 <div class="mcn-grid"><section class="mcd-box mcn-list" id="mcnList">${rows}<div class="mcn-pg"><div>${pb}</div><span>${tot?`Showing ${(pg-1)*per+1}&ndash;${Math.min(pg*per,tot)} of ${tot} updates`:''}</span></div></section>
 <aside class="mcn-side">${box(IC.flame,'Important Notices',"mcCat('notice')",imp)}${box(IC.bolt,'Quick Links','',`<div class="mcn-ql">${ql}</div>`)}${box(IC.cal,'Upcoming Events',"mcCat('event')",evh)}</aside></div></div>`}

/* ---------- Academic Hub page ---------- */
const HS={bt:'mcq'};
window.mcBt=v=>{HS.bt=v;T(()=>route())};
const PAL=['#2563eb','#7c3aed','#16a34a','#f59e0b','#0d9488','#e5484d','#db2777'];
const TIPS=['Small steps every day lead to big success.','Consistency beats intensity. Practice a little every day.','Mistakes are proof you are trying. Revise them!','Understand the concept first, memorize later.','A focused 25 minutes beats a distracted hour.'];
const CAP='<svg viewBox="0 0 140 120" aria-hidden="true"><g fill="#fff"><path d="M70 14 8 44l62 30 62-30z"/><path d="M30 62v26c0 8 18 16 40 16s40-8 40-16V62L70 80z" fill="#e2e8f0"/></g><path d="M126 48v34" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/><circle cx="126" cy="88" r="6" fill="#fbbf24"/></svg>';
function hubHTML(){ensure();
 const R=T(()=>plData(),[]),tt=R.reduce((a,r)=>a+r.tot,0),tc=R.reduce((a,r)=>a+r.c,0),ov=tt?Math.round(tc*100/tt):0,best=R.length?Math.max(...R.map(r=>r.pc)):0;
 const loaded=T(()=>QB.bq!=null,false),A=T(()=>bqAll(),[]);
 const bt=HS.bt,L=A.filter(x=>bt==='cq'?x.ty==='CQ':x.ty!=='CQ').sort((a,b)=>(b.y||0)-(a.y||0)||(b.ts||0)-(a.ts||0)).slice(0,4);
 const bqr=L.map(x=>{const sn=T(()=>BSK[x._k][1],x.sub||'Other'),c=PAL[[...String(x._k)].reduce((a,ch)=>a+ch.charCodeAt(0),0)%PAL.length],meta=[x.b,x.y].filter(Boolean).join(', ');
  return `<a class="mch-q" style="--c:${c}" href="#/board/q/${E(x.id)}"><em>${E(sn)}</em><span>${E(x.ch||x.sub||'Question')}${x.ty?' &ndash; '+E(String(x.ty).toUpperCase()):''}${meta?' ('+E(meta)+')':''}</span><i>${P(IC.arr)}</i></a>`}).join('')||`<p class="mcd-em">${loaded?'No questions yet.':'Loading questions...'}</p>`;
 const bts=[['mcq','MCQ'],['cq','CQ']].map(t=>`<button type="button" class="mcn-tab${bt===t[0]?' on':''}" onclick="mcBt('${t[0]}')">${t[1]}</button>`).join('')+`<a class="mcn-tab" href="#/feat/bf/chapter">Chapter-wise</a><a class="mcn-tab" href="#/feat/bf/board">By Board</a>`;
 const acts=[['#/board',IC.hub,'Board Questions','p'],['#/feat/qf/practice',IC.trophy,'Practice Quiz',''],['#/board/mock',IC.clip,'Model Test',''],['#/feat/progress',IC.chart,'My Progress',''],['#/feat/resources',IC.star,'Study Resources','o']]
  .map(a=>`<a class="mch-act ${a[3]}" href="${a[0]}"><i>${P(a[1])}</i><span>${a[2]} ${P(IC.arr)}</span></a>`).join('');
 const qc=[['Chapter-wise Quiz','Practice by chapter',IC.chk,'#2563eb','#/feat/qf/chapter','Start Quiz'],['Subject-wise Quiz','Practice by subject',IC.hub,'#16a34a','#/feat/qf/subject','Start Quiz'],['Model Test','Timed mock exam',IC.clock,'#7c3aed','#/board/mock','Start Test']]
  .map(q=>`<div class="mch-qz" style="--c:${q[3]}"><i>${P(q[2])}</i><b>${q[0]}</b><small>${q[1]}</small><a href="${q[4]}">${q[5]} ${P(IC.arr)}</a></div>`).join('');
 const res=[['Syllabus',IC.file,'#2563eb',"mcCat('syllabus')"],['Suggestions',IC.bulb,'#16a34a',"mcCat('suggestion')"],['Important Tips',IC.star,'#f59e0b',"mcCat('notice')"],['Study Notes',IC.file,'#7c3aed',"location.hash='#/feat/materials'"]]
  .map(r=>`<a class="mch-rs" style="--c:${r[2]}" onclick="${r[3]}">${P(r[1])}${r[0]}</a>`).join('');
 const lat=T(()=>S.posts.filter(p=>vis(p)&&!isExp(p)),[]).sort((a,b)=>(b.ts||0)-(a.ts||0)).slice(0,4).map(p=>{const c=T(()=>CATS[p.cat],{n:'Notice',c:'#2563eb'});
  return `<a class="mcd-nr mch-nr" style="--c:${c.c}" onclick="openPost('${E(p.id)}')"><em>${E(c.n)}</em><span>${E(p.title)}</span><small>${p.ts?fd(p.ts):''}</small></a>`}).join('')||'<p class="mcd-em">No updates yet.</p>';
 const box=(ic,t,l,body,cls)=>`<section class="mcd-box ${cls||''}"><h3><span>${P(ic)}${t}</span>${l?`<a href="${l}">View All ${P(IC.arr)}</a>`:''}</h3>${body}</section>`;
 const tip=TIPS[Math.floor(Date.now()/864e5)%TIPS.length];
 return `<div class="mcn"><section class="mcd-hero mcn-hero"><div class="mcn-mega">${CAP}</div><div class="mcd-ht"><h1>Academic <em>Hub</em></h1><p>Explore Board Questions, Practice Quiz, and enhance your learning journey!</p><a class="mcd-cta" href="#/board">Start Learning ${P(IC.arr)}</a></div><div class="mcd-art">${ART}</div></section>
 <div class="mch-acts">${acts}</div>
 <div class="mch-g"><div class="mch-col2">
  <div class="mch-row">${box(IC.hub,'Board Questions','#/board',`<div class="mch-tabs">${bts}</div><div class="mch-ql">${bqr}</div>`)}
  ${box(IC.trophy,'Quiz & Exam','#/quiz',`<div class="mch-tabs"><a class="mcn-tab on" href="#/quiz">All Quizzes</a><a class="mcn-tab" href="#/board/mock">Model Test</a><a class="mcn-tab" href="#/quiz">Scheduled</a></div><div class="mch-qzs">${qc}</div>`)}</div>
  <div class="mch-row">${box(IC.cap,'Study Resources','#/feat/resources',`<div class="mch-rss">${res}</div>`)}${box(IC.upd,'Latest Updates','#/notices',lat)}</div></div>
 <aside class="mch-side">${box(IC.chart,'Your Progress','#/feat/progress',`<div class="mcd-pr">${ring(ov)}<ul><li><span>Overall Progress</span></li></ul></div><ul class="mch-st"><li>${P(IC.chk)}<span>Quiz Completed</span><b>${R.length}</b></li><li>${P(IC.hub)}<span>Questions Practiced</span><b>${tt}</b></li><li>${P(IC.star)}<span>Best Score</span><b>${best}%</b></li></ul>`)}
 <section class="mch-tip"><h3>Learning Tip &#128161;</h3><p>&ldquo;${E(tip)}&rdquo;</p><small>&mdash; MCUN Team</small></section></aside></div></div>`}

/* ---------- My Library page ---------- */
const LB={tab:'saved',page:1,q:''};
window.mcLb=t=>{LB.tab=t;LB.page=1;LB.q='';T(()=>route());setTimeout(mark,30)};
window.mcLbPg=n=>{LB.page=n;T(()=>route())};
const LIBART='<svg viewBox="0 0 140 120" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M70 34c-12-10-30-12-52-8v70c22-4 40-2 52 8 12-10 30-12 52-8V26c-22-4-40-2-52 8z"/><path d="M70 34v70"/></g></svg>';
function qrow(x,saved){const sn=T(()=>BSK[x._k][1],x.sub||'Other'),cq=x.ty==='CQ',c=cq?'#7c3aed':'#2563eb';
 const t=cq&&x.st?String(x.st).slice(0,110):(x.ch||sn)+(x.ty?' ('+x.ty+')':''),ch=x.chn?'Ch. '+x.chn:(x.ch||'');
 return `<div class="mcl-r"><div class="mcl-tg" style="--c:${c}"><b>${cq?'CQ':'MCQ'}</b><span>${E(sn)}</span></div><div class="mcl-t"><h4>${E(t)}</h4><div class="mcl-m">${x.b?`<span>${P(IC.cal)}${E(x.b)}</span>`:''}${x.y?`<span>${P(IC.cal)}${E(x.y)}</span>`:''}${ch?`<span>${P(IC.book)}${E(ch)}</span>`:''}</div></div>
 <a class="mcl-v" href="#/board/q/${E(x.id)}">${P(IC.eye)}<span>View</span></a><button type="button" class="mcl-b${saved?' on':''}" aria-label="Bookmark" onclick="qbSave('${E(x.id)}')">${P(IC.mark)}</button></div>`}
function prow(p){const c=T(()=>CATS[p.cat],{n:'Notice',c:'#2563eb'}),sv=T(()=>isSv(p.id),true);
 return `<div class="mcl-r"><div class="mcl-tg" style="--c:${c.c}"><b>${E(c.n)}</b><span>Post</span></div><div class="mcl-t"><h4>${E(p.title)}</h4><div class="mcl-m"><span>${P(IC.cal)}${p.ts?fd(p.ts):''}</span></div></div>
 <a class="mcl-v" onclick="openPost('${E(p.id)}')">${P(IC.eye)}<span>View</span></a><button type="button" class="mcl-b${sv?' on':''}" aria-label="Save" onclick="toggleSave('${E(p.id)}',event);setTimeout(()=>T(()=>route()),60)">${P(IC.mark)}</button></div>`}
function libHTML(){ensure();
 const A=T(()=>bqAll(),[]),ids=T(()=>qbSaved(),[]),byId=Object.fromEntries(A.map(x=>[x.id,x]));
 const saved=[...ids].reverse().map(i=>byId[i]).filter(Boolean),book=saved.filter(x=>x.ty!=='CQ');
 const hist=T(()=>[...bqRd()].reverse(),[]).map(i=>byId[i]).filter(Boolean),posts=T(()=>sorted(savedList()),[]);
 const qf=l=>{const q=(LB.q||'').toLowerCase();return q?l.filter(x=>[x.ch,x.sub,x.b,x.y,x.st,x.ty].join(' ').toLowerCase().includes(q)):l};
 const tabs=[['saved','Saved Questions',saved.length,IC.mark],['bookmarked','Bookmarked',book.length,IC.heart],['collections','My Collections',posts.length,IC.folder],['history','History',hist.length,IC.hist]]
  .map(t=>`<button type="button" class="mcl-tab${LB.tab===t[0]?' on':''}" onclick="mcLb('${t[0]}')"><i>${P(t[3])}</i><span><b>${t[1]}</b><small>(${t[2]})</small></span></button>`).join('');
 const col=LB.tab==='collections';let src=col?(LB.q?posts.filter(p=>String(p.title).toLowerCase().includes(LB.q.toLowerCase())):posts):qf(LB.tab==='bookmarked'?book:LB.tab==='history'?hist:saved);
 const per=4,tot=src.length,pages=Math.max(1,Math.ceil(tot/per)),pg=Math.min(LB.page,pages);LB.page=pg;
 const rows=src.slice((pg-1)*per,pg*per).map(x=>col?prow(x):qrow(x,ids.includes(x.id))).join('')||`<div class="mcl-e">${P(IC.mark)}<b>Nothing here yet</b><span>${col?'Star a notice to add it here.':'Save board questions to see them here.'}</span><a class="mcd-btn" href="${col?'#/notices':'#/board'}">${col?'Browse Updates':'Find Questions'} ${P(IC.arr)}</a></div>`;
 const a=Math.max(1,Math.min(pg-2,pages-4)),b=Math.min(pages,a+4);let pb='';for(let i=a;i<=b;i++)pb+=`<button type="button" class="${i===pg?'on':''}" onclick="mcLbPg(${i})">${i}</button>`;if(pg<pages)pb+=`<button type="button" onclick="mcLbPg(${pg+1})" aria-label="Next">${P(IC.arr)}</button>`;
 const H={saved:['Saved Questions','Your saved board questions for quick revision.','saved questions',IC.mark],bookmarked:['Bookmarked Questions','Saved MCQ questions you marked as important.','bookmarked questions',IC.heart],collections:['My Collections','Notices and posts you starred.','saved posts',IC.folder],history:['History','Questions you opened recently.','viewed questions',IC.hist]}[LB.tab];
 const main=`<section class="mcd-box mcl-main"><div class="mcl-h"><i>${P(H[3])}</i><div><h3>${H[0]}</h3><p>${H[1]}</p></div></div>${rows}${tot?`<div class="mcn-pg"><div>${pb}</div><span>Showing ${(pg-1)*per+1}&ndash;${Math.min(pg*per,tot)} of ${tot} ${H[2]}</span></div>`:''}</section>`;
 const alt=LB.tab==='bookmarked'?['Recently Viewed','Questions you opened lately.',hist.slice(0,2),IC.hist,'history']:['Bookmarked Questions','Questions you marked as important.',book.slice(0,2),IC.heart,'bookmarked'];
 const second=alt[2].length?`<section class="mcd-box mcl-main"><div class="mcl-h"><i class="${alt[4]==='bookmarked'?'red':''}">${P(alt[3])}</i><div><h3>${alt[0]}</h3><p>${alt[1]}</p></div><a class="mcl-va" onclick="mcLb('${alt[4]}')">View All ${P(IC.arr)}</a></div>${alt[2].map(x=>qrow(x,ids.includes(x.id))).join('')}</section>`:'';
 const qa=[['Find Questions',IC.srch,'#2563eb',"location.hash='#/board'"],['Manage Bookmarks',IC.mark,'#16a34a',"mcLb('bookmarked')"],['View Collections',IC.folder,'#7c3aed',"mcLb('collections')"],['View History',IC.hist,'#f59e0b',"mcLb('history')"]]
  .map(q=>`<a style="--c:${q[2]}" onclick="${q[3]}">${P(q[1])}${q[0]}</a>`).join('');
 const cl=posts.slice(0,3).map(p=>{const c=T(()=>CATS[p.cat],{n:'Notice',c:'#2563eb'});return `<a class="mcl-cl" style="--c:${c.c}" onclick="openPost('${E(p.id)}')"><i>${P(CI[p.cat]||IC.upd)}</i><div><b>${E(p.title)}</b><small>${E(c.n)}</small></div></a>`}).join('')||'<p class="mcd-em">No collections yet. Star a notice to save it here.</p>';
 return `<div class="mcn"><section class="mcd-hero mcn-hero"><div class="mcn-mega mcl-bk">${LIBART}</div><div class="mcd-ht"><h1>My <em>Library</em></h1><p>Save, organize and easily access your important questions and study materials.</p></div><div class="mcl-sl">Study Smart,<br>Score High!</div><div class="mcd-art">${ART}</div></section>
 <div class="mcl-tabs">${tabs}</div>
 <div class="mch-g"><div class="mch-col2">${main}${second}</div>
 <aside class="mch-side"><section class="mcd-box"><h3><span>${P(IC.bolt)}Quick Access</span></h3><div class="mcl-qa">${qa}</div></section>
 <section class="mcd-box"><h3><span>${P(IC.folder)}Your Collections</span><a onclick="mcLb('collections')" style="cursor:pointer">View All ${P(IC.arr)}</a></h3>${cl}</section>
 <section class="mcl-cta"><h3>Organize Your Study Better!</h3><p>Save important questions and track your learning.</p><a class="mcd-btn" href="#/board">Find Questions ${P(IC.arr)}</a></section></aside></div></div>`}

/* ---------- Downloads page (replaces old Study Materials / Download History / Available Resources) ---------- */
const DL={cat:'all',page:1,q:'',sub:'',sort:'latest',open:null},DLW={};let mdlT=0;
const DLC=[['all','All Resources',IC.hub],['notes','Study Notes',IC.file],['syllabus','Syllabus',IC.clip],['suggestion','Suggestions',IC.bulb],['model','Model Papers',IC.cap],['other','Others',IC.folder]];
const DLSUB=DLC.concat([['history','Download History',IC.hist]]);
const SUBJ=[['Physics',/physics|পদার্থ/],['Chemistry',/chemistry|রসায়ন/],['Biology',/biology|জীব/],['Higher Math',/higher\s*math|h\.?\s*math|উচ্চতর/],['Math',/math|গণিত/],['ICT',/\bict\b|তথ্য ও যোগাযোগ/],['English',/english|ইংরেজি/],['Bangla',/bangla|বাংলা/],['Accounting',/accounting|হিসাব/],['Economics',/econom|অর্থনীতি/],['Statistics',/statistic|পরিসংখ্যান/],['Geography',/geograph|ভূগোল/],['History',/history|ইতিহাস/]];
const DLK={pdf:['PDF','#e5484d'],doc:['DOC','#2563eb'],ppt:['PPT','#7c3aed'],xls:['XLS','#16a34a'],img:['IMG','#0d9488'],link:['LINK','#0891b2'],file:['FILE','#64748b']};
const CLOUD='<svg viewBox="0 0 140 120" aria-hidden="true"><g fill="#fff"><circle cx="48" cy="72" r="20"/><circle cx="72" cy="54" r="26"/><circle cx="100" cy="72" r="18"/><rect x="48" y="70" width="52" height="20"/></g><g fill="none" stroke="#1d4ed8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><path d="M72 42v32M58 62l14 14 14-14"/></g></svg>';
const DOTS='<circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>';
window.mdlSet=c=>{DL.cat=c;DL.page=1;DL.q='';DL.sub='';DL.open=null};
const dlAll=()=>T(()=>S.posts.filter(p=>vis(p)&&!isExp(p)&&ptHasF(p)),[]);
function dlCat(p){const t=(String(p.title||'')+' '+String(p.body||'').slice(0,160)).toLowerCase();
 if(p.cat==='syllabus')return 'syllabus';if(p.cat==='suggestion')return 'suggestion';
 if(/model\s*(test|paper|question)|test\s*paper|question\s*bank|মডেল|প্রশ্নপত্র|প্রশ্নব্যাংক/.test(t))return 'model';
 if(/note|নোট|lecture|ল্যাকচার|chapter|অধ্যায়|guide|গাইড|sheet|শীট/.test(t))return 'notes';
 return 'other'}
const dlSubj=p=>{const t=String(p.title||'').toLowerCase(),s=SUBJ.find(x=>x[1].test(t));return s?s[0]:''};
const dlFiles=p=>T(()=>atts(FULL[p.id]||p),[]);
function dlKind(f){const t=String(f.type||''),n=String(f.name||'').toLowerCase(),u=String(f.url||'').toLowerCase(),ex=(n.match(/\.(\w{2,4})$/)||[])[1]||'';
 if(/^image\//.test(t))return 'img';
 if(ex==='pdf'||/pdf/.test(t))return 'pdf';
 if(/^docx?$/.test(ex)||/word/.test(t))return 'doc';
 if(/^pptx?$/.test(ex)||/presentation|powerpoint/.test(t))return 'ppt';
 if(/^(xlsx?|csv)$/.test(ex)||/sheet|excel/.test(t))return 'xls';
 if(/docs\.google\.com\/document/.test(u))return 'doc';
 if(/docs\.google\.com\/presentation/.test(u))return 'ppt';
 if(/docs\.google\.com\/spreadsheets/.test(u))return 'xls';
 if(t==='link'&&!/drive\.google\.com\/file/.test(u))return 'link';
 return 'file'}
function dlPK(p){const a=dlFiles(p);return a.length?dlKind(a[0]):(!(p.nf>0)&&/^https?:\/\//.test(p.link||'')?'link':'file')}
function dlGet(f,id){if(/^image\//.test(f.type)){const l=document.createElement('a');l.href=f.url;l.download=(f.name||'image')+'.jpg';document.body.appendChild(l);l.click();l.remove()}
 else{const d=T(()=>driveDl(f.url),null),l=document.createElement('a');l.href=d||f.url;l.target='_blank';l.rel='noopener noreferrer';document.body.appendChild(l);l.click();l.remove()}
 T(()=>ptTrack('mcn_dl',id));setTimeout(dlPaint,50)}
window.mdlGo=async id=>{const p=T(()=>S.posts.find(x=>x.id==id),null);if(!p)return;
 let a=dlFiles(p);if(!a.length&&!T(()=>FULL[id],null)){try{await getFull(id)}catch(e){}a=dlFiles(p)}
 if(!a.length){T(()=>openPost(id));return}
 if(a.length>1){DL.open=DL.open===id?null:id;dlPaint();return}
 dlGet(a[0],id)};
window.mdlFile=(id,i)=>{const p=T(()=>S.posts.find(x=>x.id==id),null);if(!p)return;const f=dlFiles(p)[i];if(f)dlGet(f,id)};
window.mdlCat=c=>{DL.cat=c;DL.page=1;DL.sub='';DL.open=null;dlPaint();mark()};
window.mdlSub=v=>{DL.sub=v;DL.page=1;dlPaint()};
window.mdlSort=v=>{DL.sort=v;DL.page=1;dlPaint()};
window.mdlQ=v=>{DL.q=v;DL.page=1;clearTimeout(mdlT);mdlT=setTimeout(dlPaint,160)};
window.mdlPg=n=>{DL.page=n;DL.open=null;dlPaint();const l=document.getElementById('mdlList');l&&l.scrollIntoView({behavior:'smooth',block:'start'})};
window.mdlClr=()=>{DL.q='';DL.sub='';DL.page=1;const i=$('#mdlQ');if(i)i.value='';dlPaint()};
function dlWarm(ids){ids.forEach(id=>{if(DLW[id]||T(()=>FULL[id],null))return;DLW[id]=1;Promise.resolve(T(()=>getFull(id),null)).then(()=>{if(hp()[0]==='dl')dlPaint()}).catch(()=>{})})}
function dlRow(p){const a=dlFiles(p),k=dlPK(p),K=DLK[k],n=Math.max(1,T(()=>cnt(p),1)),subj=dlSubj(p),open=DL.open===p.id&&a.length>1,
 ex=String(p.body||'').replace(/\s+/g,' ').slice(0,140),tags=[DLN2(dlCat(p)),subj,isNew(p)?'New':''].filter(Boolean).map((t,i)=>`<em class="${t==='New'?'new':''}">${E(t)}</em>`).join('');
 return `<article class="mdl-r" style="--k:${K[1]}"><div class="mdl-ft"><i>${P(IC.file)}</i><b>${K[0]}</b></div>
 <div class="mdl-t"><h4><a onclick="openPost('${E(p.id)}')">${E(p.title||'Untitled')}</a></h4>${ex?`<p>${E(ex)}</p>`:''}<div class="mdl-tags">${tags}</div></div>
 <div class="mdl-m">${p.views!=null?`<span title="Views">${P(IC.eye)}${KF(+p.views||0)}</span>`:''}<span title="Date">${P(IC.cal)}${p.ts?fd(p.ts):''}</span>${n>1?`<span title="Files">${P(IC.clip)}${n} files</span>`:''}</div>
 <div class="mdl-a"><button type="button" class="mdl-dl${open?' on':''}" onclick="mdlGo('${E(p.id)}')">${P(IC.dl)}<span>${n>1?'Choose file':'Download'}</span></button><button type="button" class="mdl-mo" title="View details" aria-label="View details" onclick="openPost('${E(p.id)}')"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" stroke="none">${DOTS}</svg></button></div>
 ${open?`<div class="mdl-fl">${a.map((f,i)=>{const kk=DLK[dlKind(f)];return `<div style="--k:${kk[1]}"><b>${kk[0]}</b><span>${E(f.name||'File '+(i+1))}</span><button type="button" onclick="mdlFile('${E(p.id)}',${i})">${P(IC.dl)}Download</button></div>`}).join('')}</div>`:''}</article>`}
const DLN2=c=>({all:'All',notes:'Study Notes',syllabus:'Syllabus',suggestion:'Suggestion',model:'Model Paper',other:'Other'}[c]||'Other');
function dlParts(){
 const A=dlAll(),hist=DL.cat==='history',cn={all:A.length};DLC.slice(1).forEach(c=>cn[c[0]]=0);A.forEach(p=>cn[dlCat(p)]++);
 const base=hist?T(()=>ptIds('mcn_dl'),[]):A.filter(p=>DL.cat==='all'||dlCat(p)===DL.cat),subs={};
 base.forEach(p=>{const s=dlSubj(p);if(s)subs[s]=(subs[s]||0)+1});if(DL.sub&&!subs[DL.sub])DL.sub='';
 const q=DL.q.trim().toLowerCase();
 let l=base.filter(p=>(!DL.sub||dlSubj(p)===DL.sub)&&(!q||(String(p.title||'')+' '+String(p.body||'')).toLowerCase().includes(q)));
 if(!hist||DL.sort!=='latest')l=[...l].sort((a,b)=>DL.sort==='oldest'?(a.ts||0)-(b.ts||0):DL.sort==='views'?(b.views||0)-(a.views||0)||(b.ts||0)-(a.ts||0):(b.pinned?1:0)-(a.pinned?1:0)||(b.ts||0)-(a.ts||0));
 const per=5,tot=l.length,pages=Math.max(1,Math.ceil(tot/per)),pg=Math.min(DL.page,pages);DL.page=pg;const sl=l.slice((pg-1)*per,pg*per);
 const tabs=DLC.map(c=>`<button type="button" class="mdl-tab${!hist&&DL.cat===c[0]?' on':''}" onclick="mdlCat('${c[0]}')"><i>${P(c[2])}</i><span><b>${c[1]}</b><small>(${cn[c[0]]})</small></span></button>`).join('');
 const a=Math.max(1,Math.min(pg-2,pages-4)),b=Math.min(pages,a+4);let pb='';for(let i=a;i<=b;i++)pb+=`<button type="button" class="${i===pg?'on':''}" onclick="mdlPg(${i})">${i}</button>`;if(pg<pages)pb+=`<button type="button" onclick="mdlPg(${pg+1})" aria-label="Next page">${P(IC.arr)}</button>`;
 const filt=!!(q||DL.sub);
 const empty=hist&&!base.length?`<div class="mcl-e">${P(IC.hist)}<b>No downloads yet</b><span>Files you download will be listed here. This list is saved on this device only.</span><a class="mcd-btn" href="#/dl" onclick="mdlCat('all');return false">Browse Resources ${P(IC.arr)}</a></div>`
  :`<div class="mcl-e">${P(IC.dl)}<b>${filt?'No matching resources':'No resources yet'}</b><span>${filt?'Try a different keyword or clear the filters.':'Study files will show up here as soon as they are posted for your class.'}</span>${filt?`<a class="mcd-btn" onclick="mdlClr()" style="cursor:pointer">Clear filters</a>`:''}</div>`;
 const head=hist?`<div class="mdl-hd">${P(IC.hist)}<div><h3>Download History</h3><p>Files you opened or downloaded on this device.</p></div></div>`:'';
 const main=head+(sl.map(dlRow).join('')||empty)+(tot?`<div class="mcn-pg"><div>${pb}</div><span>Showing ${(pg-1)*per+1}&ndash;${Math.min(pg*per,tot)} of ${tot} resource${tot>1?'s':''}</span></div>`:'');
 const views=A.reduce((s,p)=>s+(+p.views||0),0),files=A.reduce((s,p)=>s+Math.max(1,T(()=>cnt(p),1)),0),mine=T(()=>ptIds('mcn_dl').length,0);
 const st=[[IC.file,'#2563eb',A.length,'Resources'],[IC.clip,'#7c3aed',files,'Total Files'],[IC.eye,'#16a34a',KF(views),'Total Views'],[IC.dl,'#f59e0b',mine,'Your Downloads']].map(x=>`<div class="mdl-st" style="--c:${x[1]}"><i>${P(x[0])}</i><b>${x[2]}</b><span>${x[3]}</span></div>`).join('');
 const top=[...A].sort((x,y)=>(y.views||0)-(x.views||0)||(y.ts||0)-(x.ts||0)).slice(0,5);
 const pop=top.length?top.map((p,i)=>`<div class="mdl-pp"><em>${i+1}</em><a onclick="openPost('${E(p.id)}')">${E(p.title||'Untitled')}</a>${p.views!=null?`<small>${KF(+p.views||0)}</small>`:''}<button type="button" aria-label="Download ${E(p.title||'')}" onclick="mdlGo('${E(p.id)}')">${P(IC.dl)}</button></div>`).join(''):'<p class="mcd-em">Popular files will appear here.</p>';
 const side=`<section class="mcd-box"><h3><span>${P(IC.chart)}Download Statistics</span></h3><div class="mdl-sts">${st}</div></section>
 <section class="mcd-box"><h3><span>${P(IC.flame)}Popular Downloads</span>${top.length?`<a onclick="mdlSort('views');const s=document.getElementById('mdlSort');if(s)s.value='views';mdlCat('all')" style="cursor:pointer">View All ${P(IC.arr)}</a>`:''}</h3>${pop}</section>
 <section class="mcl-cta mdl-cta"><h3>Stay Updated!</h3><p>Turn on alerts to get new study materials the moment they are posted.</p><a class="mcd-btn" href="#/inbox">Turn On Alerts ${P(IC.bell)}</a></section>`;
 const so=Object.keys(subs).sort().map(s=>`<option value="${E(s)}"${DL.sub===s?' selected':''}>${E(s)} (${subs[s]})</option>`).join('');
 return {tabs,main,side,ids:sl.map(p=>p.id),subOpts:`<option value="">All Subjects</option>${so}`}}
function dlPaint(){if(!$('#mdlMain'))return;const d=dlParts();$('#mdlTabs').innerHTML=d.tabs;$('#mdlMain').innerHTML=d.main;$('#mdlSide').innerHTML=d.side;const s=$('#mdlSub');if(s)s.innerHTML=d.subOpts;const i=$('#mdlQ');if(i&&document.activeElement!==i&&i.value!==DL.q)i.value=DL.q;setTimeout(()=>dlWarm(d.ids),0)}
function dlHTML(){const d=dlParts();setTimeout(()=>dlWarm(d.ids),0);
 return `<div class="mcn mdl"><section class="mcd-hero mcn-hero"><div class="mcn-mega mcl-bk">${CLOUD}</div><div class="mcd-ht"><h1>Down<em>loads</em></h1><p>Get study materials, resources and useful files for your better preparation.</p><a class="mcd-cta" href="#/dl" onclick="document.getElementById('mdlList').scrollIntoView({behavior:'smooth'});return false">Explore Resources ${P(IC.arr)}</a></div><div class="mcl-sl">Study Smart,<br>Download Smart!</div><div class="mcd-art">${ART}</div></section>
 <div class="mdl-tabs" id="mdlTabs">${d.tabs}</div>
 <div class="mdl-bar"><label class="mdl-q">${P(IC.srch)}<input id="mdlQ" type="search" placeholder="Search resources..." value="${E(DL.q)}" oninput="mdlQ(this.value)" aria-label="Search resources"></label>
 <select id="mdlSub" onchange="mdlSub(this.value)" aria-label="Filter by subject">${d.subOpts}</select>
 <select id="mdlSort" onchange="mdlSort(this.value)" aria-label="Sort"><option value="latest"${DL.sort==='latest'?' selected':''}>Latest First</option><option value="oldest"${DL.sort==='oldest'?' selected':''}>Oldest First</option><option value="views"${DL.sort==='views'?' selected':''}>Most Viewed</option></select></div>
 <div class="mdl-grid"><section class="mcd-box mdl-main" id="mdlList"><div id="mdlMain">${d.main}</div></section><aside class="mdl-side" id="mdlSide">${d.side}</aside></div></div>`}

/* ---------- Communication page (replaces old Inbox page) ---------- */
const COM={tab:'notif',page:1,q:''};
const MAIL='<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>';
const COMSUB=[['notif','Notifications',IC.bell],['inbox','Inbox / Messages',MAIL],['ann','Announcements',IC.upd]];
const CHEVR='<svg viewBox="0 0 24 24" aria-hidden="true" class="mcm-go"><path d="m9 6 6 6-6 6"/></svg>';
const BUBBLES='<svg viewBox="0 0 140 120" aria-hidden="true"><path d="M20 24h62a12 12 0 0 1 12 12v28a12 12 0 0 1-12 12H52L34 92V76h-14a12 12 0 0 1-12-12V36a12 12 0 0 1 12-12z" fill="#fff"/><path d="M100 48h20a12 12 0 0 1 12 12v24a12 12 0 0 1-12 12h-4v14l-14-14H84a12 12 0 0 1-12-12v-6h22a12 12 0 0 0 6-1.600z" fill="#bfdbfe"/><g fill="#1d4ed8"><circle cx="30" cy="50" r="5.500"/><circle cx="51" cy="50" r="5.500"/><circle cx="72" cy="50" r="5.500"/></g></svg>';
const cmN=()=>T(()=>nList(),[]);
const cmI=()=>T(()=>[...N.inbox].sort((a,b)=>(b.ts||0)-(a.ts||0)),[]);
const cmA=()=>T(()=>S.posts.filter(p=>p.cat==='notice'&&vis(p)&&!isExp(p)).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||(b.ts||0)-(a.ts||0)),[]);
const cmF=l=>{const q=COM.q.trim().toLowerCase();return q?l.filter(x=>(String(x.title||'')+' '+String(x.body||'')).toLowerCase().includes(q)):l};
const cmNew=x=>(x.ts||0)>T(()=>N.hl,0);
function cmTime(ts){if(!ts)return '';const d=new Date(ts),t0=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime(),tm=d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true});
 return ts>=t0?'Today, '+tm:ts>=t0-864e5?'Yesterday, '+tm:d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})+' \u00b7 '+tm}
function cmAgo(ts){const m=Math.max(0,(Date.now()-(ts||0))/6e4);return m<1?'now':m<60?Math.floor(m)+'m ago':m<1440?Math.floor(m/60)+'h ago':m<10080?Math.floor(m/1440)+'d ago':new Date(ts).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}
function cmPost(x){const m=String(x.url||'').match(/#\/p\/([^/?#]+)/);return m?T(()=>S.posts.find(p=>p.id==m[1]),null):null}
function cmNRow(x){const p=cmPost(x),c=p?T(()=>CATS[p.cat],null):null,col=x.urgent?'#e5484d':c?c.c:'#2563eb',ic=x.urgent?IC.flame:p?(CI[p.cat]||IC.upd):IC.bell,nw=cmNew(x);
 return `<button type="button" class="mcm-r${nw?' new':''}" style="--c:${col}" data-u="${E(x.url||'')}"><i>${P(ic)}</i><div><b>${E(x.title||'')}</b>${x.body?`<p>${E(x.body)}</p>`:''}<small>${P(IC.clock)}${cmTime(x.ts)}</small></div>${x.urgent?'<em class="u">Urgent</em>':nw?'<em>New</em>':''}${CHEVR}</button>`}
function cmIRow(x){const nw=cmNew(x);
 return `<button type="button" class="mcm-m${nw?' new':''}" data-u="${E(x.url||'')}"><span class="mcm-av"><img src="logo.png" alt=""></span><div><b>${E(x.title||'MCUN Admin')}</b><p>${E(x.body||'')}</p></div><small>${cmAgo(x.ts)}</small>${nw?'<u></u>':''}</button>`}
function cmARow(p){return `<a class="mcm-a" onclick="openPost('${E(p.id)}')"><i>${P(IC.star)}</i><b>${E(p.title||'')}</b><small>${p.ts?new Date(p.ts).toLocaleDateString('en-US',{month:'short',day:'numeric'}):''}</small></a>`}
const cmEmpty=(ic,t,s)=>`<div class="mcl-e">${P(ic)}<b>${t}</b><span>${s}</span></div>`;
const cmCfg={notif:{t:'Latest Notifications',ic:IC.bell,l:cmN,row:cmNRow,e:['No notifications yet','New notices, results and messages from the admin will show up here.']},
 inbox:{t:'Inbox / Messages',ic:MAIL,l:cmI,row:cmIRow,e:['Your inbox is empty','Messages sent to you by the college admin will appear here.']},
 ann:{t:'Announcements',ic:IC.upd,l:cmA,row:cmARow,e:['No announcements','Important notices from the college will be listed here.']}};
function cmBox(k,full){const c=cmCfg[k],all=cmF(c.l()),per=5,tot=all.length,pages=Math.max(1,Math.ceil(tot/per)),pg=full?Math.min(COM.page,pages):1;if(full)COM.page=pg;
 const list=(full?all.slice((pg-1)*per,pg*per):all.slice(0,4)).map(c.row).join('')||cmEmpty(c.ic,c.e[0],COM.q?'Nothing matches your search.':c.e[1]);
 let pb='';if(full&&pages>1){const a=Math.max(1,Math.min(pg-2,pages-4)),b=Math.min(pages,a+4);for(let i=a;i<=b;i++)pb+=`<button type="button" class="${i===pg?'on':''}" onclick="mcmPg(${i})">${i}</button>`;if(pg<pages)pb+=`<button type="button" onclick="mcmPg(${pg+1})" aria-label="Next page">${P(IC.arr)}</button>`}
 return `<section class="mcd-box mcm-box mcm-${k}${full?' mcm-full':''}"><h3><span>${P(c.ic)}${c.t}</span>${full?'':`<a onclick="mcmTab('${k}')" style="cursor:pointer">View All ${P(IC.arr)}</a>`}</h3><div class="mcm-list">${list}</div>${full&&tot?`<div class="mcn-pg"><div>${pb}</div><span>Showing ${(pg-1)*per+1}&ndash;${Math.min(pg*per,tot)} of ${tot}</span></div>`:''}</section>`}
function cmBody(){
 const nN=cmN().length,nI=cmI().length,nA=cmA().length,unread=cmN().filter(cmNew).length,tabs=[['notif','Notifications',IC.bell,nN],['inbox','Inbox',MAIL,nI],['ann','Announcements',IC.upd,nA]].map(t=>`<button type="button" class="mcn-tab${COM.tab===t[0]?' on':''}" onclick="mcmTab('${t[0]}')">${P(t[2])}${t[1]} (${t[3]})</button>`).join('');
 const others=['notif','inbox','ann'].filter(k=>k!==COM.tab),on=T(()=>pushOK()&&pIsOn(),false);
 const qa=[[IC.bell,'#2563eb','Notifications',"mcmTab('notif')"],[MAIL,'#16a34a','Inbox',"mcmTab('inbox')"],[IC.upd,'#f59e0b','Announcements',"mcmTab('ann')"],[IC.users,'#7c3aed','Contact Admin',"location.hash='#/contact'"]].map(q=>`<a style="--c:${q[1]}" onclick="${q[3]}">${P(q[0])}${q[2]}</a>`).join('');
 return `<section class="mcd-hero mcn-hero"><div class="mcn-mega mcl-bk">${BUBBLES}</div><div class="mcd-ht"><h1>Communi<em>cation</em></h1><p>Stay connected with MCUN. Get the latest notifications, messages and announcements.</p></div><div class="mcl-sl">Stay Informed,<br>Stay Ahead!</div><div class="mcd-art">${ART}</div></section>
 <div class="mcn-ctl"><div class="mcn-tabs">${tabs}</div><div class="mcn-sort"><button type="button" onclick="mcmRead()"${unread?'':' disabled'}>${P(IC.chk)}Mark All as Read</button></div></div>
 ${COM.q?`<div class="mcn-q">Results for <b>&ldquo;${E(COM.q)}&rdquo;</b><button type="button" onclick="mcmClr()">Clear &times;</button></div>`:''}
 <div class="mcm-grid">${cmBox(COM.tab,true)}<div class="mcm-side">${others.map(k=>cmBox(k,false)).join('')}</div></div>
 <div class="mcm-bot"><section class="mcd-box mcm-qa"><h3><span>${P(IC.bolt)}Quick Access</span></h3><div class="mcm-qg">${qa}</div></section>
 <section class="mcm-al"><div><h3>Phone Alerts</h3><p>Get new notices on your phone the moment they are posted.</p><small>${E(T(()=>alertSub(),''))}</small></div>${T(()=>swBtn(),'')}<span class="mcm-alic">${P(IC.upd)}</span></section></div>`}
window.mcmHTML=()=>`<div class="mcn mcm" id="mcmRoot">${cmBody()}</div>`;
window.mcmPaint=()=>{const r=$('#mcmRoot');if(r)r.innerHTML=cmBody()};
window.mcmTab=t=>{COM.tab=t;COM.page=1;mcmPaint();mark()};
window.mcmPg=n=>{COM.page=n;mcmPaint();const b=$('.mcm-full');b&&b.scrollIntoView({behavior:'smooth',block:'start'})};
window.mcmClr=()=>{COM.q='';COM.page=1;const i=$('.mc-search input');if(i)i.value='';mcmPaint()};
window.mcmRead=()=>{const t=Math.max(0,...cmN().map(x=>x.ts||0));N.hl=Math.max(N.hl||0,t);T(()=>nMarkSeen());mcmPaint();T(()=>toast('All notifications marked as read'))};
document.addEventListener('click',e=>{const b=e.target.closest('.mcm-r[data-u],.mcm-m[data-u]');if(b&&b.dataset.u)T(()=>nOpen(b.dataset.u))});
/* ---------- My Profile page (new design) ---------- */
Object.assign(IC,{
phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
drop:'<path d="M12 2.7s7 7.1 7 12a7 7 0 0 1-14 0c0-4.9 7-12 7-12z"/>',
pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
headset:'<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 15a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z"/><path d="M18 17v1a3 3 0 0 1-3 3h-2"/>',
cam:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
bkstar:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/><path d="m12 6.5.9 1.9 2.1.3-1.5 1.5.4 2.1-1.9-1-1.9 1 .4-2.1L9 8.7l2.1-.3z"/>',
qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h3M20 17v4M17 20v.01"/>',
x:'<path d="M18 6 6 18M6 6l12 12"/>',trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>'});
const PF={ed:'',busy:false};
const BLOODS=['A+','A-','B+','B-','AB+','AB-','O+','O-'],GENS=['Male','Female','Other'];
const PTABS=[['ov','Profile Overview','#/profile',IC.acc],['ac','Academic Info','#/profile/academic',IC.cap],['st','Account Settings','#/feat/settings',IC.gear],['pw','Change Password','#/feat/password',IC.lock],['hp','Help & Support','#/contact',IC.headset]];
const pfTab=()=>{const h=hp();if(h[0]==='profile')return h[1]==='academic'?'ac':'ov';if(h[0]==='feat')return h[1]==='settings'?'st':h[1]==='password'?'pw':'ov';return 'ov'};
const pfTabs=a=>`<nav class="mcp-tabs" aria-label="Profile sections">${PTABS.map(t=>`<a class="${t[0]===a?'on':''}" href="${t[2]}"${t[0]===a?' aria-current="page"':''}>${P(t[3])}<span>${t[1]}</span></a>`).join('')}</nav>`;
const pfHero=()=>`<section class="mcp-hero"><div class="mcp-hav"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="60" fill="#f1f5ff"/><circle cx="60" cy="46" r="20" fill="#1d3fa8"/><path d="M22 104c4-20 20-30 38-30s34 10 38 30a58 58 0 0 1-76 0z" fill="#1d3fa8"/></svg></div>
 <div class="mcp-ht"><h1>My <em>Profile</em></h1><p>Manage your personal information<br>and account settings.</p></div>
 <div class="mcp-hq"><span>Dream Big,<br>Achieve Bigger!</span><svg viewBox="0 0 120 14" aria-hidden="true"><path d="M2 11C30 3 70 2 118 4" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/></svg></div>
 <div class="mcp-hart">${ART}</div></section>`;
const mcId=()=>{const p=T(()=>U.prof,{})||{};let h=0;for(const c of String(p.uid||'x'))h=(h*31+c.charCodeAt(0))>>>0;const y=new Date(T(()=>U.user.metadata.creationTime,Date.now())).getFullYear();return 'MCUN-'+y+'-'+h.toString(36).toUpperCase().padStart(4,'0').slice(-4)};
const pfDob=v=>{if(!v)return '';const d=new Date(v+'T00:00:00');return isNaN(d)?v:d.toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'})};
const pfAgo=ts=>{const s=Math.max(0,(Date.now()-ts)/1000);if(s<90)return 'Just now';if(s<3600)return Math.round(s/60)+' min ago';if(s<86400){const h=Math.round(s/3600);return h+(h===1?' hour ago':' hours ago')}if(s<2592000){const d=Math.round(s/86400);return d+(d===1?' day ago':' days ago')}return fd(ts)};
const pfRow=(ic,l,v)=>`<div class="mcp-r">${P(ic)}<span>${l}</span><i>:</i><b>${v?E(v):'<em>Not added</em>'}</b></div>`;
const pfOpt=(a,v)=>`<option value="">Select</option>`+a.map(x=>`<option${x===v?' selected':''}>${E(x)}</option>`).join('');
const pfFe=(ic,l,id,inner)=>`<div class="mcp-r mcp-fe">${P(ic)}<label for="${id}">${l}</label><i>:</i>${inner}</div>`;
const pfHead=(ic,t,k)=>`<h3><span>${P(ic)}${t}</span>${PF.ed===k?'':`<button type="button" class="mcp-edit" onclick="pfEdit('${k}')">${P(IC.pen)}Edit</button>`}</h3>`;
const pfBtns=()=>`<div class="mcp-fb"><button type="button" class="mcp-cx" onclick="pfEdit('')">Cancel</button><button class="mcp-sv" type="submit">${P(IC.chk)}Save changes</button></div>`;
function pfPersonal(p){const ed=PF.ed==='p';
 return `<section class="mcp-card mcp-info">${pfHead(IC.acc,'Personal Information','p')}${ed?`<form onsubmit="pfSave(event,'p')" autocomplete="off">
 ${pfFe(IC.acc,'Full Name','pf_name',`<input id="pf_name" required maxlength="80" value="${E(p.name)}" autocomplete="name">`)}
 ${pfFe(IC.mail,'Email','pf_mail',`<input id="pf_mail" value="${E(p.email||'')}" disabled>`)}
 ${pfFe(IC.phone,'Phone','pf_ph',`<input id="pf_ph" type="tel" inputmode="tel" maxlength="20" placeholder="01XXXXXXXXX" value="${E(p.ph||'')}" autocomplete="tel">`)}
 ${pfFe(IC.cal,'Date of Birth','pf_dob',`<input id="pf_dob" type="date" max="${new Date().toISOString().slice(0,10)}" value="${E(p.dob||'')}">`)}
 ${pfFe(IC.users,'Gender','pf_gen',`<select id="pf_gen">${pfOpt(GENS,p.gen)}</select>`)}
 ${pfFe(IC.drop,'Blood Group','pf_bg',`<select id="pf_bg">${pfOpt(BLOODS,p.bg)}</select>`)}
 ${pfFe(IC.pin,'Address','pf_addr',`<input id="pf_addr" maxlength="120" placeholder="Village/Area, District" value="${E(p.addr||'')}" autocomplete="street-address">`)}
 ${pfBtns()}</form>`:`<div class="mcp-rows">${pfRow(IC.acc,'Full Name',p.name)}${pfRow(IC.mail,'Email',p.email)}${pfRow(IC.phone,'Phone',p.ph)}${pfRow(IC.cal,'Date of Birth',pfDob(p.dob))}${pfRow(IC.users,'Gender',p.gen)}${pfRow(IC.drop,'Blood Group',p.bg)}${pfRow(IC.pin,'Address',p.addr)}</div>`}</section>`}
function pfAcad(p){const ed=PF.ed==='a';
 return `<section class="mcp-card mcp-info">${pfHead(IC.cap,'Academic Information','a')}${ed?`<form onsubmit="pfSave(event,'a')" autocomplete="off">
 ${pfFe(IC.cap,'College','pf_col',`<input id="pf_col" value="Mirpur College" disabled>`)}
 ${pfFe(IC.hub,'Department','pf_dept',`<select id="pf_dept" required>${DEPTS.map(x=>`<option${x===p.dept?' selected':''}>${E(x)}</option>`).join('')}</select>`)}
 ${pfFe(IC.clip,'Class','pf_year',`<select id="pf_year" required>${YEARS.map(x=>`<option${x===p.year?' selected':''}>${E(x)}</option>`).join('')}</select>`)}
 ${pfFe(IC.file,'Roll No','pf_roll',`<input id="pf_roll" maxlength="12" inputmode="numeric" placeholder="e.g. 123456" value="${E(p.roll||'')}">`)}
 ${pfFe(IC.cal,'Session','pf_ses',`<input id="pf_ses" maxlength="9" placeholder="e.g. 2025-2026" value="${E(p.ses||'')}">`)}
 ${pfBtns()}</form>`:`<div class="mcp-rows">${pfRow(IC.cap,'College','Mirpur College')}${pfRow(IC.hub,'Department',p.dept)}${pfRow(IC.clip,'Class',p.year)}${pfRow(IC.file,'Roll No',p.roll)}${pfRow(IC.cal,'Session',p.ses)}</div>`}</section>`}
function pfSummary(p,ver){let j='';T(()=>{j=new Date(U.user.metadata.creationTime).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'})},0);
 return `<section class="mcp-card mcp-info"><h3><span>${P(IC.chk)}Account Summary</span></h3><div class="mcp-rows">${pfRow(IC.qr,'MCUN ID',mcId())}${pfRow(IC.chk,'Status',ver?'Active · Email verified':'Email not verified')}${pfRow(IC.cal,'Joined',j)}${U.role?pfRow(IC.star,'Role',T(()=>ROLE_N[U.role],U.role)):''}</div></section>`}
function pfBadges(R){const tt=R.reduce((a,r)=>a+r.tot,0),tc=R.reduce((a,r)=>a+r.c,0),avg=tt?tc*100/tt:0,best=R.length?Math.max(...R.map(r=>r.pc)):0,sv=T(()=>savedN(),0);
 return [R.length>=1,R.length>=10,best>=80,R.length>0&&best===100,R.length>=5&&avg>=70,sv>=1].filter(Boolean).length}
function pfSide(R){const tt=R.reduce((a,r)=>a+r.tot,0),tc=R.reduce((a,r)=>a+r.c,0),avg=tt?Math.round(tc*100/tt):0,bd=pfBadges(R);
 const act=R.slice(0,4).map(r=>`<a class="mcp-ac" href="#/quiz/${E(r.id)}"><i>${P(IC.chk)}</i><div><b>Completed: ${E(r.t)}</b><small>Score: ${r.pc}%</small></div><time>${pfAgo(r.ts)}</time></a>`).join('')||`<p class="mcd-em">No activity yet — take your first quiz to see it here.</p>`;
 return `<section class="mcp-card"><h3><span>${P(IC.chart)}Quick Stats</span></h3><div class="mcp-qs">
 <a href="#/quiz" style="--c:#2563eb">${P(IC.hub)}<b>${R.length}</b><span>Quiz Done</span></a>
 <a href="#/feat/progress" style="--c:#16a34a">${P(IC.chk)}<b>${avg}%</b><span>Avg. Score</span></a>
 <a href="#/feat/progress" style="--c:#7c3aed" title="Badges: first quiz, 10 quizzes, 80%+ score, perfect score, 70%+ average (5+ quizzes), saved a question">${P(IC.trophy)}<b>${bd}</b><span>Achievements</span></a></div></section>
 <section class="mcp-card"><h3><span>${P(IC.hist)}Recent Activities</span><a class="mcp-va" href="#/feat/activity">View All ${P(IC.arr)}</a></h3><div class="mcp-acs">${act}</div></section>
 <section class="mcp-help"><div class="mcp-hi">${P(IC.headset)}</div><div><h3>Need Help?</h3><p>Contact our support team for any help.</p><a class="mcp-cs" href="#/contact">Contact Support ${P(IC.arr)}</a></div></section>`}
function pfMe(p,ver){const has=T(()=>imgOk(p.photo),false);
 return `<aside class="mcp-card mcp-me"><div class="mcp-av"><div class="mcp-avi">${T(()=>avInner(),E((p.name||'?')[0]))}</div><button class="mcp-cam" type="button" aria-label="Change photo" onclick="document.getElementById('pfFile').click()">${P(IC.cam)}</button><input type="file" id="pfFile" accept="image/*" hidden onchange="pickPhoto(this)"></div>
 <h2>${E(p.name)}</h2><span class="mcp-cls">${E(p.year||'Student')} Student</span><span class="mcp-st${ver?'':' warn'}"><i></i>${ver?'Active':'Unverified'}</span>
 ${has?`<button class="mcp-rm" type="button" onclick="rmPhoto()">${P(IC.trash)}Remove photo</button>`:''}
 <hr><div class="mcp-id">${P(IC.qr)}<span>MCUN ID</span><b>${mcId()}</b></div>
 <div class="mcp-col">${P(IC.cap)}<div><b>Mirpur College</b><small>Dhaka-1216, Bangladesh</small></div></div>
 ${U.role?`<a class="mcp-adm" href="/admin">${P(IC.gear)}<span>Admin Panel</span><em>${E(T(()=>ROLE_N[U.role],U.role))}</em></a>`:''}
 <button class="mcp-out" type="button" onclick="try{logout()}catch(e){}">${P(IC.out)}Logout</button></aside>`}
window.pProfile=function(){const p=T(()=>U.prof,null);if(!p)return window.pHome();ensure();
 const u=T(()=>U.user,null),ver=!!u&&!!(u.emailVerified||T(()=>isG(u),false)),R=T(()=>plData(),[]),tab=pfTab();
 return `<div class="mcp">${pfHero()}${pfTabs(tab)}<div class="mcp-g"><div class="mcp-c1">${pfMe(p,ver)}</div>
 <div class="mcp-c2">${tab==='ac'?pfAcad(p)+pfSummary(p,ver):pfPersonal(p)+pfAcad(p)}</div><div class="mcp-c3">${pfSide(R)}</div></div></div>`};
window.pfEdit=k=>{PF.ed=k;T(()=>route());if(k)setTimeout(()=>{const f=document.querySelector('.mcp-info form input:not([disabled]),.mcp-info form select');f&&f.focus()},30)};
window.pfSave=async function(e,k){e.preventDefault();if(PF.busy)return;
 const g=id=>{const el=document.getElementById(id);return el?String(el.value).trim():''},bad=m=>T(()=>toast(m)),p=U.prof;let n={};
 if(k==='p'){const name=g('pf_name'),ph=g('pf_ph').replace(/[\s()]/g,''),dob=g('pf_dob'),gen=g('pf_gen'),bg=g('pf_bg'),addr=g('pf_addr');
  if(!name)return bad('Please enter your name');
  if(ph&&!/^\+?[0-9-]{6,20}$/.test(ph))return bad('Please enter a valid phone number');
  if(dob&&(!/^\d{4}-\d{2}-\d{2}$/.test(dob)||dob>new Date().toISOString().slice(0,10)||dob<'1940-01-01'))return bad('Please enter a valid date of birth');
  n={name:name.slice(0,80),ph,dob,gen:GENS.includes(gen)?gen:'',bg:BLOODS.includes(bg)?bg:'',addr:addr.slice(0,120)}}
 else{const dept=g('pf_dept'),year=g('pf_year'),roll=g('pf_roll'),ses=g('pf_ses');
  if(!DEPTS.includes(dept)||!YEARS.includes(year))return bad('Select a valid department and class');
  if(roll&&!/^[A-Za-z0-9-]{1,12}$/.test(roll))return bad('Roll No can only have letters and numbers');
  if(ses&&!/^\d{4}(-\d{2,4})?$/.test(ses))return bad('Session format: 2025-2026');
  n={dept,year,roll,ses}}
 PF.busy=true;Object.assign(p,n);T(()=>writeCache());T(()=>paintMe());
 let ok=false;try{ok=await saveProf()}catch(_){}
 PF.busy=false;PF.ed='';T(()=>route());if(ok){T(()=>sheetSync());T(()=>toast('Profile updated'))}};
const OPP=window.pPortal;
window.pPortal=function(k){const r=OPP.apply(this,arguments);return (k==='settings'||k==='password')?`<div class="mcp">${pfHero()}${pfTabs(pfTab())}<div class="mcp-pane">${r}</div></div>`:r};
const OLD=window.pHome;
const OSEC=window.pSec;window.pSec=function(id){return id==='hub'?hubHTML():id==='lib'?libHTML():id==='dl'?dlHTML():id==='com'?(setTimeout(()=>{location.hash='#/inbox'},0),''):OSEC.apply(this,arguments)};
window.pHome=function(){const h=hp()[0];return h==='notices'?noticesHTML():dashHTML()};
setInterval(()=>{document.querySelectorAll('.mcd-cd[data-ts]').forEach(el=>{let d=Math.max(0,el.dataset.ts-Date.now())/1000;const v=[d/86400,d%86400/3600,d%3600/60,d%60].map(x=>String(Math.floor(x)).padStart(2,'0'));el.querySelectorAll('b').forEach((b,i)=>b.textContent=v[i])})},1000);
function all(){try{side();top()}catch(e){console.warn('redesign',e)}}
document.body.classList.add('mc');all();
try{route()}catch(e){}
new MutationObserver(all).observe($('#app'),{childList:true});
addEventListener('hashchange',()=>{OPENS.add(grp());all()});setTimeout(all,1200);setInterval(mark,15000);
})();
