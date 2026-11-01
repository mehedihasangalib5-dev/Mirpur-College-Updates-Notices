/* MCUN rich text: sanitize + render (student & admin) and the small editor used in the admin panel.
   Supports: bold, italic, underline, table, image (compressed, embedded). Everything saved is passed through sanitize(). */
(function(){
'use strict';
var TAGS={B:1,STRONG:1,I:1,EM:1,U:1,BR:1,P:1,DIV:1,UL:1,OL:1,LI:1,SUB:1,SUP:1,TABLE:1,THEAD:1,TBODY:1,TR:1,TD:1,TH:1,IMG:1,SPAN:1};
var DROP={SCRIPT:1,STYLE:1,IFRAME:1,OBJECT:1,EMBED:1,LINK:1,META:1,SVG:1,MATH:1,FORM:1,INPUT:1,BUTTON:1,TEXTAREA:1,SELECT:1};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function isHtml(s){return /<(b|strong|i|em|u|br|p|div|ul|ol|li|sub|sup|table|thead|tbody|tr|td|th|img|span)\b/i.test(String(s||''))}
function clean(node,out){
 Array.prototype.forEach.call(node.childNodes,function(n){
  if(n.nodeType===3){out.appendChild(document.createTextNode(n.nodeValue));return}
  if(n.nodeType!==1)return;
  var t=n.tagName.toUpperCase();
  if(DROP[t])return;
  if(!TAGS[t]){clean(n,out);return}                     /* unknown tag: keep its children only */
  if(t==='SPAN'){                                        /* browsers wrap bold/italic in styled spans */
   var st=(n.getAttribute('style')||'').toLowerCase(),w=out,k=n;
   var fw=/font-weight:\s*(bold|[6-9]00)/.test(st),fi=/font-style:\s*italic/.test(st),tu=/text-decoration[^;]*underline/.test(st);
   if(fw){var b=document.createElement('b');w.appendChild(b);w=b}
   if(fi){var i=document.createElement('i');w.appendChild(i);w=i}
   if(tu){var u=document.createElement('u');w.appendChild(u);w=u}
   clean(k,w);return}
  var el=document.createElement(t.toLowerCase());
  if(t==='IMG'){var src=n.getAttribute('src')||'';if(!/^data:image\/(png|jpe?g|gif|webp);base64,[a-z0-9+\/=]+$/i.test(src)&&!/^https:\/\//i.test(src))return;el.setAttribute('src',src);el.setAttribute('alt',(n.getAttribute('alt')||'').slice(0,100));out.appendChild(el);return}
  if(t==='TD'||t==='TH'){['colspan','rowspan'].forEach(function(a){var v=parseInt(n.getAttribute(a),10);if(v>1&&v<20)el.setAttribute(a,v)})}
  clean(n,el);out.appendChild(el)});
}
function sanitize(html){
 var doc=new DOMParser().parseFromString('<body>'+String(html||'')+'</body>','text/html'),out=document.createElement('div');
 clean(doc.body,out);
 var h=out.innerHTML.replace(/(<br>\s*)+$/i,'').replace(/^(<br>\s*)+/i,'');
 if(!out.textContent.trim()&&!out.querySelector('img,table'))return'';
 return h}
function rtx(s){if(s==null||s==='')return'';return isHtml(s)?'<span class="rt">'+sanitize(s)+'</span>':'<span class="rt rt-p">'+esc(s)+'</span>'}
function plain(s,n){s=String(s==null?'':s);if(isHtml(s)){var d=new DOMParser().parseFromString('<body>'+s+'</body>','text/html');
  d.querySelectorAll('img').forEach(function(i){i.replaceWith(' [ছবি] ')});d.querySelectorAll('br,p,div,tr,li').forEach(function(e){e.append(' ')});s=d.body.textContent}
 s=s.replace(/\s+/g,' ').trim();return n&&s.length>n?s.slice(0,n)+'…':s}
window.rtxEsc=esc;window.rtSan=sanitize;window.rtx=rtx;window.rtPlain=plain;window.rtIsHtml=isHtml;

/* ---------------- styles (shared) ---------------- */
var css='.rt{display:block;line-height:1.65;word-break:break-word}.rt-p{white-space:pre-wrap}.rt table{border-collapse:collapse;max-width:100%;margin:8px 0;display:block;overflow-x:auto}.rt td,.rt th,.rte-ed td,.rte-ed th{border:1px solid var(--line,#cbd5e1);padding:6px 10px;min-width:48px;vertical-align:top}.rt th,.rte-ed th{background:rgba(37,99,235,.08)}.rt img,.rte-ed img{max-width:100%;height:auto;border-radius:8px;margin:4px 0}.rt ul,.rt ol{margin:6px 0;padding-left:22px}'
+'.rte{border:1.5px solid var(--line,#d6dcec);border-radius:12px;background:var(--card,#fff);overflow:hidden;margin:4px 0 10px}.rte:focus-within{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.16)}'
+'.rte-tb{display:flex;flex-wrap:wrap;align-items:center;gap:4px;padding:6px;border-bottom:1px solid var(--line,#e3e8f4);background:rgba(37,99,235,.05)}'
+'.rte-tb button{border:1px solid transparent;background:transparent;color:inherit;min-width:32px;height:32px;padding:0 8px;border-radius:8px;font:inherit;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:5px}.rte-tb button:hover{background:rgba(37,99,235,.14)}.rte-tb button svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'
+'.rte-tb i{width:1px;height:20px;background:var(--line,#d6dcec);margin:0 3px}.rte-tb input{width:42px;height:30px;border:1px solid var(--line,#d6dcec);border-radius:8px;text-align:center;font:inherit;background:var(--card,#fff);color:inherit;padding:0}.rte-tb small{opacity:.7}'
+'.rte-ed{min-height:84px;max-height:420px;overflow:auto;padding:10px 12px;outline:0;line-height:1.6;word-break:break-word}.rte-ed.rte-s{min-height:44px}.rte-ed[data-empty="1"]:before{content:attr(data-ph);opacity:.45;pointer-events:none}';
var st=document.createElement('style');st.textContent=css;(document.head||document.documentElement).appendChild(st);

/* ---------------- editor ---------------- */
var IC={b:'<b>B</b>',i:'<i style="font-family:serif">I</i>',u:'<u>U</u>',
 tbl:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16"/></svg>',
 img:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-8 8"/></svg>',
 rowp:'<svg viewBox="0 0 24 24"><path d="M3 9h18v6H3zM12 18v4M10 20h4"/></svg>',colp:'<svg viewBox="0 0 24 24"><path d="M9 3v18h6V3zM18 12h4M20 10v4"/></svg>',
 del:'<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',clr:'<svg viewBox="0 0 24 24"><path d="M4 7V4h16v3M9 20h6M12 4v16M5 5l14 14"/></svg>'};
function compress(file,cb){
 var fr=new FileReader();fr.onload=function(){var im=new Image();im.onload=function(){
  var W=Math.min(900,im.width),H=Math.round(im.height*W/im.width),q=.78,url,c=document.createElement('canvas');c.width=W;c.height=H;
  var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,H);x.drawImage(im,0,0,W,H);
  url=c.toDataURL('image/jpeg',q);while(url.length>320000&&q>.4){q-=.1;url=c.toDataURL('image/jpeg',q)}
  cb(url)};im.onerror=function(){cb(null)};im.src=fr.result};fr.onerror=function(){cb(null)};fr.readAsDataURL(file)}
function build(src){
 var small=src.getAttribute('data-rt')==='s',ph=src.getAttribute('placeholder')||'',wrap=document.createElement('div');wrap.className='rte';
 wrap.innerHTML='<div class="rte-tb"><button type="button" data-c="bold" title="Bold">'+IC.b+'</button><button type="button" data-c="italic" title="Italic">'+IC.i+'</button><button type="button" data-c="underline" title="Underline">'+IC.u+'</button><i></i>'
 +'<button type="button" data-c="table" title="Table">'+IC.tbl+'</button><input class="rt-r" type="number" min="1" max="20" value="3" title="সারি (rows)" aria-label="rows"><small>×</small><input class="rt-c" type="number" min="1" max="10" value="3" title="কলাম (columns)" aria-label="columns">'
 +'<button type="button" data-c="addrow" title="Add row">'+IC.rowp+'</button><button type="button" data-c="addcol" title="Add column">'+IC.colp+'</button><button type="button" data-c="deltbl" title="Delete table">'+IC.del+'</button><i></i>'
 +'<button type="button" data-c="img" title="Image">'+IC.img+'</button><button type="button" data-c="clear" title="Clear format">'+IC.clr+'</button><input type="file" accept="image/*" hidden></div>'
 +'<div class="rte-ed'+(small?' rte-s':'')+'" contenteditable="true" data-ph="'+esc(ph)+'" data-empty="1"></div>';
 var ed=wrap.querySelector('.rte-ed'),tb=wrap.querySelector('.rte-tb'),file=wrap.querySelector('input[type=file]'),saved=null;
 function chk(){ed.setAttribute('data-empty',(!ed.textContent.trim()&&!ed.querySelector('img,table'))?'1':'0')}
 function keep(){var s=getSelection();if(s.rangeCount&&ed.contains(s.anchorNode))saved=s.getRangeAt(0).cloneRange()}
 function back(){ed.focus();if(saved){var s=getSelection();s.removeAllRanges();s.addRange(saved)}}
 ['keyup','mouseup','focus','input'].forEach(function(e){ed.addEventListener(e,function(){keep();chk()})});
 function ins(h){back();document.execCommand('insertHTML',false,h);keep();chk()}
 function cell(){var s=getSelection(),n=s.anchorNode;n=n&&(n.nodeType===1?n:n.parentNode);var c=n&&n.closest?n.closest('td,th'):null;return c&&ed.contains(c)?c:(saved&&saved.startContainer&&(function(){var p=saved.startContainer;p=p.nodeType===1?p:p.parentNode;var c2=p.closest&&p.closest('td,th');return c2&&ed.contains(c2)?c2:null})())}
 tb.addEventListener('mousedown',function(e){if(e.target.tagName!=='INPUT')e.preventDefault()});
 tb.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var c=b.getAttribute('data-c');
  if(c==='bold'||c==='italic'||c==='underline'){back();document.execCommand(c);keep();chk()}
  else if(c==='clear'){back();document.execCommand('removeFormat');keep();chk()}
  else if(c==='table'){var r=Math.min(20,Math.max(1,+tb.querySelector('.rt-r').value||3)),k=Math.min(10,Math.max(1,+tb.querySelector('.rt-c').value||3)),h='<table><tbody>';
   for(var i=0;i<r;i++){h+='<tr>';for(var j=0;j<k;j++)h+='<td><br></td>';h+='</tr>'}ins(h+'</tbody></table><br>')}
  else if(c==='addrow'){var td=cell();if(!td)return;var tr=td.parentNode,n=tr.cloneNode(true);Array.prototype.forEach.call(n.children,function(x){x.innerHTML='<br>'});tr.parentNode.insertBefore(n,tr.nextSibling)}
  else if(c==='addcol'){var td2=cell();if(!td2)return;var idx=Array.prototype.indexOf.call(td2.parentNode.children,td2),tbl=td2.closest('table');Array.prototype.forEach.call(tbl.rows,function(r2){var nc=document.createElement(r2.cells[idx]&&r2.cells[idx].tagName==='TH'?'th':'td');nc.innerHTML='<br>';r2.insertBefore(nc,r2.cells[idx+1]||null)})}
  else if(c==='deltbl'){var td3=cell();if(td3){td3.closest('table').remove();chk()}}
  else if(c==='img'){keep();file.value='';file.click()}});
 file.addEventListener('change',function(){var f=file.files&&file.files[0];if(!f)return;compress(f,function(u){if(!u){alert('ছবি পড়া যায়নি');return}ins('<img src="'+u+'" alt="">')})});
 ed.addEventListener('paste',function(e){var d=e.clipboardData;if(!d)return;var it=d.files&&d.files[0];
  if(it&&/^image\//.test(it.type)){e.preventDefault();compress(it,function(u){if(u)ins('<img src="'+u+'" alt="">')});return}
  var h=d.getData('text/html');e.preventDefault();
  if(h&&/<(table|b|strong|i|em|u|img)\b/i.test(h)){var s=sanitize(h);document.execCommand('insertHTML',false,s||esc(d.getData('text/plain')))}
  else document.execCommand('insertText',false,d.getData('text/plain'));chk()});
 ed.addEventListener('drop',function(e){var f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];if(f&&/^image\//.test(f.type)){e.preventDefault();compress(f,function(u){if(u)ins('<img src="'+u+'" alt="">')})}});
 /* behaves like the original <input>/<textarea>: el.value */
 Object.defineProperty(ed,'value',{get:function(){return sanitize(ed.innerHTML)},set:function(v){v=v==null?'':String(v);ed.innerHTML=isHtml(v)?sanitize(v):esc(v).replace(/\n/g,'<br>');chk()},configurable:true});
 return{wrap:wrap,ed:ed}}
function rtUp(root){
 (root||document).querySelectorAll('[data-rt]').forEach(function(src){
  if(src.dataset.rtDone)return;var id=src.id,b=build(src),old=src.value||src.textContent||'';
  b.ed.id=id;src.parentNode.replaceChild(b.wrap,src);b.ed.value=old})}
window.rtUp=rtUp;
})();
