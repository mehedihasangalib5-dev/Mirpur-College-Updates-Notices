/* MCUN redesign layer: sidebar + top bar + dashboard blocks. Reads existing app globals (PT, S, U, QB, plData, logout). */
(()=>{
const P=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const IC={
dash:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
upd:'<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
hub:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
learn:'<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
lib:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
com:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
acc:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
q:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
star:'<path d="m12 2 3 6.9 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.4 21l1.8-7.3L1.5 9.5 9 8.9z"/>',
srch:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',chart:'<path d="M3 3v18h18"/><path d="M7 15v3M12 10v8M17 6v12"/>',
file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M9 14h6M9 17h4"/>'};
const $=s=>document.querySelector(s);
function grp(){const h=location.hash.replace(/^#\/?/,'').split('/'),a=h[0]||'home',b=h[1]||'';
 if(a==='home')return 'dash';try{if(PT.some(g=>g[0]===a))return a}catch(e){}
 if(a==='quiz'||a==='board')return b==='saved'?'lib':'hub';
 if(a==='saved')return 'lib';if(a==='inbox')return 'com';if(a==='profile'||a==='contact')return 'acc';
 if(a==='feat'){if(['progress','analytics','subjprog','chprog','history'].includes(b))return 'learn';if(b==='recent')return 'lib';
  if(['materials','dlhist','resources'].includes(b))return 'dl';if(['settings','password'].includes(b))return 'acc';
  if(['bf','qf','wrong'].includes(b))return 'hub';return 'dash'}
 return 'upd'}
function side(){let s=$('#mcSide');
 if(!s){s=document.createElement('aside');s.id='mcSide';document.body.prepend(s);
  s.innerHTML=`<a class="mc-brand" href="#/"><img src="logo.png" alt="MCUN"><b>MCUN</b><small>Mirpur College<br>Updates &amp; Notices</small></a><nav>`
  +PT.map(g=>`<a class="mc-i" title="${g[2]}" data-g="${g[0]}" href="${g[0]==='dash'?'#/':'#/'+g[0]}">${P(IC[g[0]]||'')}<span>${g[2]}</span></a>`).join('')
  +`</nav><div class="mc-out"><button class="mc-i" type="button" onclick="try{logout()}catch(e){}">${P(IC.out)}<span>Logout</span></button></div>`}
 const g=grp();s.querySelectorAll('.mc-i[data-g]').forEach(a=>a.classList.toggle('on',a.dataset.g===g))}
function top(){const n=$('header .nav');if(!n)return;
 if(!n.querySelector('.mc-search')){const f=document.createElement('form');f.className='mc-search';
  f.innerHTML=P(IC.srch)+'<input type="search" placeholder="Search anything..." aria-label="Search">';
  f.onsubmit=e=>{e.preventDefault();const v=f.querySelector('input').value.trim();
   if(location.hash.replace(/^#\/?/,''))location.hash='#/';
   setTimeout(()=>{const q=document.getElementById('q');if(q){q.value=v;try{doSearch()}catch(e){}}},80)};
  n.insertBefore(f,n.querySelector('.sp'))}
 let w=n.querySelector('.mc-who');if(!w){w=document.createElement('div');w.className='mc-who';n.insertBefore(w,$('#meBtn'))}
 try{const p=U.prof;w.innerHTML=p?`<b>${String(p.name||'').replace(/</g,'&lt;')}</b><small>${p.dept||''}${p.year?'-'+p.year:''}</small>`:''}catch(e){}}
function dash(){const app=$('#app'),hero=app&&app.querySelector('.hero');if(!hero||app.querySelector('.mc-dash'))return;
 let R=[],sv=0,posts=[];try{R=plData()}catch(e){}try{sv=savedN()}catch(e){}try{posts=S.posts||[]}catch(e){}
 const tq=R.reduce((a,r)=>a+r.tot,0),best=R.length?Math.max(...R.map(r=>r.pc)):0;
 const st=[[IC.file,'#2563eb',tq,'Questions Practiced'],[IC.q,'#16a34a',R.length,'Quizzes Completed'],[IC.trophy,'#f59e0b',best+'%','Best Score'],[IC.star,'#f97316',sv,'Saved Items']]
  .map(x=>`<div class="mc-stat" style="--c:${x[1]}"><i>${P(x[0])}</i><div><b>${x[2]}</b><span>${x[3]}</span></div></div>`).join('');
 const qa=[['#/board',IC.hub,'Board Questions','#2563eb'],['#/feat/qf/practice',IC.q,'Practice Quiz','#16a34a'],['#/board/mock',IC.file,'Model Test','#6d4aff'],['#/feat/progress',IC.chart,'My Progress','#f59e0b']]
  .map(x=>`<a href="${x[0]}" style="--c:${x[3]}"><i>${P(x[1])}</i>${x[2]}</a>`).join('');
 const now=Date.now(),up=posts.filter(p=>p.dl&&p.dl>now).sort((a,b)=>a.dl-b.dl).slice(0,4);
 const cc=k=>{try{return CATS[k].c}catch(e){return '#2563eb'}};
 const dl=up.length?up.map(p=>`<a style="--c:${cc(p.cat)}" onclick="openPost('${p.id}')"><span>${String(p.title||'').replace(/</g,'&lt;').slice(0,46)}</span><em>${new Date(p.dl).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</em></a>`).join(''):'<p>No upcoming deadlines right now.</p>';
 const d=document.createElement('div');d.className='mc-dash';
 d.innerHTML=`<div class="mc-stats">${st}</div><div class="mc-two"><section class="mc-box"><h3>Quick Access</h3><div class="mc-qa">${qa}</div></section><section class="mc-box"><h3>Upcoming Deadlines<a href="#/upd">View all</a></h3><div class="mc-dl">${dl}</div></section></div>`;
 hero.after(d)}
function all(){try{side();top();dash()}catch(e){console.warn('redesign',e)}}
document.body.classList.add('mc');all();
new MutationObserver(all).observe($('#app'),{childList:true});
addEventListener('hashchange',all);setTimeout(all,1200);
})();
