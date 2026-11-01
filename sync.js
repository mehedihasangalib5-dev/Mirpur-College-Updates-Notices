/* MCUN cross-device sync.
   Ek account jekono device-e login korle: Saved / Read / Board saved / Mistakes / Streak / Recent / Downloads history
   ekta device-e change korle baki sob device-e realtime-e update hoy (Firestore: users/{uid}/data/sync). */
(function(){
'use strict';
var KEYS=['mcn_saved','mcn_read','mcn_bsaved','mcn_bread','mcn_bst','mcn_bmis','mcn_recent','mcn_dl','mcn_bfs'],
 UNION={mcn_read:1,mcn_bread:1},TK='mcn_synct',UK='mcn_syncuid',
 LS=window.localStorage,set0=Storage.prototype.setItem,rem0=Storage.prototype.removeItem,
 applying=false,dirty={},timer=0,uid=null,unsub=null,pushing=false;
function lg(k){try{return LS.getItem(k)}catch(e){return null}}
function tmap(){try{return JSON.parse(lg(TK)||'{}')||{}}catch(e){return{}}}
function tsave(m){try{set0.call(LS,TK,JSON.stringify(m))}catch(e){}}
function mark(k){var m=tmap();m[k]=Date.now();tsave(m);dirty[k]=1;if(uid)sched()}
Storage.prototype.setItem=function(k,v){set0.call(this,k,v);if(this===LS&&!applying&&KEYS.indexOf(k)>-1)mark(k)};
Storage.prototype.removeItem=function(k){rem0.call(this,k);if(this===LS&&!applying&&KEYS.indexOf(k)>-1)mark(k)};
function sched(){clearTimeout(timer);timer=setTimeout(push,1500)}
async function push(){
 if(!uid||pushing)return;var ks=Object.keys(dirty);if(!ks.length)return;
 if(typeof U!=='undefined'&&U&&U.user&&U.user.emailVerified===false)return;
 pushing=true;var v={},t={},m=tmap();ks.forEach(function(k){v[k]=lg(k)||'';t[k]=m[k]||Date.now();delete dirty[k]});
 try{var s=await getSDK();await s.f.setDoc(s.f.doc(s.db,'users',uid,'data','sync'),{v:v,t:t},{merge:true})}
 catch(e){ks.forEach(function(k){dirty[k]=1});setTimeout(sched,15000)}
 pushing=false;if(Object.keys(dirty).length)sched()}
function arr(s){try{var a=JSON.parse(s);return Array.isArray(a)?a:null}catch(e){return null}}
function setLocal(k,val,t,m){applying=true;try{if(val==='')rem0.call(LS,k);else set0.call(LS,k,val)}catch(e){}applying=false;m[k]=t}
function onRemote(d){
 var v=(d&&d.v)||{},t=(d&&d.t)||{},m=tmap(),changed=false;
 KEYS.forEach(function(k){
  var rv=v[k],rt=t[k]||0,lv=lg(k),lt=m[k]||0;
  if(rv===undefined){if(lv!=null&&lv!==''){dirty[k]=1;if(!lt){m[k]=Date.now()}}return}
  var l=lv==null?'':lv;if(rv===l){m[k]=Math.max(lt,rt);return}
  var ra=arr(rv),la=arr(l);
  if(ra&&la&&(UNION[k]||!lt)){ // list: union, so nothing is lost on first merge / append-only lists
   var u=ra.slice();la.forEach(function(x){if(u.indexOf(x)<0)u.push(x)});var us=JSON.stringify(u);
   if(us!==l){setLocal(k,us,Math.max(lt,rt),m);changed=true}
   if(us!==rv){dirty[k]=1;m[k]=Date.now()}return}
  if(rt>lt){setLocal(k,rv,rt,m);changed=true}
  else if(lt>rt){dirty[k]=1}
 });
 tsave(m);if(Object.keys(dirty).length)sched();
 if(changed)refresh()}
var SAFE=/^#\/?(saved|lib|dl|profile|inbox|notices|hub)?$/;
function refresh(){try{
 var a=document.activeElement;if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))return;
 if(SAFE.test(location.hash)&&typeof route==='function')route();
 else if(typeof paintBnav==='function'){/* counts only */}
}catch(e){}}
function stop(){if(unsub){try{unsub()}catch(e){}unsub=null}uid=null}
async function start(id){
 stop();uid=id;
 var last=lg(UK);
 if(last&&last!==id){applying=true;KEYS.forEach(function(k){rem0.call(LS,k)});rem0.call(LS,TK);applying=false;dirty={}} // another account used this device before
 try{set0.call(LS,UK,id)}catch(e){}
 try{var s=await getSDK();if(uid!==id)return;
  unsub=s.f.onSnapshot(s.f.doc(s.db,'users',id,'data','sync'),function(sn){
   if(sn.metadata&&sn.metadata.hasPendingWrites)return;
   onRemote(sn.exists()?sn.data():{})},function(){})}
 catch(e){setTimeout(function(){if(uid===id)start(id)},20000)}}
setInterval(function(){
 var id=null;try{id=(typeof U!=='undefined'&&U&&U.user&&U.user.uid)||null}catch(e){}
 if(id&&id!==uid)start(id);else if(!id&&uid)stop()},1500);
window.__mcnSync={onRemote:onRemote,push:push};
})();
