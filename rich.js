/* MCUN rich text v2: sanitize + render (student & admin) and the Word-like editor used in the admin panel.
   - Paste keeps formatting (bold/italic/underline/strike, colour, highlight, size, font, alignment, lists, tables, links, headings, images, Word lists).
   - Everything saved/rendered passes through sanitize() (whitelist of tags + safe inline styles only).
   - Ctrl+Shift+V = paste as plain text. */
(function(){
'use strict';
var TAGS={B:1,STRONG:1,I:1,EM:1,U:1,S:1,STRIKE:1,DEL:1,BR:1,P:1,DIV:1,UL:1,OL:1,LI:1,SUB:1,SUP:1,TABLE:1,THEAD:1,TBODY:1,TFOOT:1,TR:1,TD:1,TH:1,CAPTION:1,IMG:1,SPAN:1,H1:1,H2:1,H3:1,H4:1,H5:1,H6:1,BLOCKQUOTE:1,PRE:1,CODE:1,A:1,HR:1,MARK:1,SMALL:1,FONT:1};
var DROP={SCRIPT:1,STYLE:1,IFRAME:1,OBJECT:1,EMBED:1,LINK:1,META:1,SVG:1,MATH:1,FORM:1,INPUT:1,BUTTON:1,TEXTAREA:1,SELECT:1,OPTION:1,HEAD:1,TITLE:1,NOSCRIPT:1,TEMPLATE:1,AUDIO:1,VIDEO:1,CANVAS:1,FRAME:1,FRAMESET:1,APPLET:1,BASE:1,XML:1};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function isHtml(s){return /<(b|strong|i|em|u|br|p|div|ul|ol|li|sub|sup|table|thead|tbody|tfoot|tr|td|th|img|span|h[1-6]|blockquote|pre|code|hr|mark|small)\b|<s>|<\/s>|<a\s+href|<font\s|<strike\b|<del\b/i.test(String(s||''))}

/* ---------- colour / length helpers ---------- */
var CV=null;
function toRGBA(v){
 v=String(v||'').trim().toLowerCase();
 if(!v||/^(inherit|initial|unset|revert|currentcolor|transparent|windowtext|window|buttontext|auto|none)$/.test(v))return null;
 var m=v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
 if(m){var h=m[1];if(h.length===3)h=h.replace(/./g,'$&$&');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),1]}
 if(CV===null){try{CV=document.createElement('canvas').getContext('2d')}catch(e){CV=false}}
 if(!CV)return null;
 CV.fillStyle='#010203';CV.fillStyle=v;var r=CV.fillStyle;
 if(r==='#010203'&&v!=='#010203')return null;
 m=r.match(/^#([0-9a-f]{6})$/);
 if(m)return[parseInt(r.slice(1,3),16),parseInt(r.slice(3,5),16),parseInt(r.slice(5,7),16),1];
 m=r.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)$/);
 return m?[+m[1],+m[2],+m[3],m[4]==null?1:+m[4]]:null}
/* keeps the site's light/dark theme readable: near-black / near-white text and white backgrounds are dropped (they follow the theme) */
function okColor(v,bg){
 var c=toRGBA(v);if(!c||c[3]<0.05)return null;
 var L=(0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255,sat=Math.max(c[0],c[1],c[2])-Math.min(c[0],c[1],c[2]);
 /* Only real "accent" colours survive (red, blue, green, yellow highlight...). Greys, black/white and dark/light theme colours of the source page are dropped
    so a pasted dark-theme text never carries its dark background or light text; the site's own theme (light/dark) decides the base colours. */
 if(sat<(bg?45:55))return null;
 if(bg){if(L<0.45||L>0.93)return null}else{if(L<0.04||L>0.72)return null}
 return '#'+[c[0],c[1],c[2]].map(function(x){return('0'+Math.round(x).toString(16)).slice(-2)}).join('')}
function toPx(v){
 var m=String(v).trim().toLowerCase().match(/^(-?[\d.]+)(px|pt|em|rem|cm|mm|in)?$/);if(!m)return null;
 var n=parseFloat(m[1]),u=m[2]||'px';
 return u==='px'?n:u==='pt'?n*4/3:(u==='em'||u==='rem')?n*16:u==='cm'?n*37.8:u==='mm'?n*3.78:n*96}
var FS_KW={'xx-small':10,'x-small':12,small:13,medium:16,large:18,'x-large':24,'xx-large':32,'xxx-large':48,smaller:13,larger:20};
var FS_FONT=[10,13,16,18,24,32,48];   /* <font size=1..7> */

/* ---------- style whitelist ---------- */
function cleanStyle(st){
 var o={css:[],b:0,i:0,u:0,s:0};
 String(st||'').split(';').forEach(function(d){
  var k=d.indexOf(':');if(k<0)return;
  var p=d.slice(0,k).trim().toLowerCase(),v=d.slice(k+1).trim().replace(/\s*!important\s*$/i,'');
  if(!v||/url\(|expression|javascript:|@import|\\|[<>]/i.test(v))return;
  var lv=v.toLowerCase(),n,c,m;
  switch(p){
   case'color':c=okColor(v);if(c)o.css.push('color:'+c);break;
   case'background-color':c=okColor(v,1);if(c)o.css.push('background-color:'+c);break;
   case'background':m=v.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|\b[a-z]{3,}\b/i);c=m&&okColor(m[0],1);if(c)o.css.push('background-color:'+c);break;
   case'font-size':
    n=FS_KW[lv];
    if(n==null){m=lv.match(/^([\d.]+)%$/);n=m?parseFloat(m[1])*.16:toPx(lv)}
    if(n&&n>=8&&n<=80&&!(n>=14.5&&n<=16.5))o.css.push('font-size:'+Math.round(n)+'px');break;
   case'font-family':if(/^[\w\s,'"\u0980-\u09FF.\-]+$/.test(v)&&!/^(inherit|initial|unset)$/i.test(v)&&v.length<120)o.css.push('font-family:'+v);break;
   case'font-weight':if(/^(bold|bolder|[6-9]00)$/.test(lv))o.b=1;break;
   case'font-style':if(/^(italic|oblique)/.test(lv))o.i=1;break;
   case'text-decoration':case'text-decoration-line':if(/underline/.test(lv))o.u=1;if(/line-through/.test(lv))o.s=1;break;
   case'text-align':if(/^(left|right|center|justify)$/.test(lv))o.css.push('text-align:'+lv);break;
   case'text-indent':n=toPx(lv);if(n>0&&n<=120)o.css.push('text-indent:'+Math.round(n)+'px');break;
   case'margin-left':case'padding-left':n=toPx(lv);if(n>0&&n<=240)o.css.push('margin-left:'+Math.round(n)+'px');break;
   case'margin':{var a=lv.split(/\s+/),l=a.length===4?a[3]:(a.length===2||a.length===3)?a[1]:null;n=l&&toPx(l);if(n>0&&n<=240)o.css.push('margin-left:'+Math.round(n)+'px');break}
   case'line-height':if(/^[\d.]+$/.test(lv)){n=parseFloat(lv);if(n>=1&&n<=3)o.css.push('line-height:'+n)}else if(/^[\d.]+%$/.test(lv)){n=parseFloat(lv);if(n>=100&&n<=250)o.css.push('line-height:'+Math.round(n)+'%')}break;
   case'vertical-align':if(/^(sub|super|top|middle|bottom)$/.test(lv))o.css.push('vertical-align:'+lv);break;
   case'list-style-type':if(/^(disc|circle|square|decimal|lower-alpha|upper-alpha|lower-latin|upper-latin|lower-roman|upper-roman|bengali|none)$/.test(lv))o.css.push('list-style-type:'+lv);break;
   case'width':if(/^[\d.]+%$/.test(lv)){n=parseFloat(lv);if(n>0&&n<=100)o.css.push('width:'+Math.round(n)+'%')}else{n=toPx(lv);if(n>=20&&n<=1000)o.css.push('width:'+Math.round(n)+'px')}break;
   case'white-space':if(/^(pre|pre-wrap|pre-line)$/.test(lv))o.css.push('white-space:'+lv);break;
  }});
 return o}

/* ---------- Word "fake" lists (mso-list) -> real <ul>/<ol> ---------- */
function wordLists(root){
 var doc=root.ownerDocument,stack=[];
 Array.prototype.slice.call(root.children).forEach(function(el){
  var st=el.getAttribute('style')||'',m=/mso-list:\s*(?!none)[^;]*?level(\d+)/i.exec(st);
  if(!m||!/^(P|DIV)$/i.test(el.tagName)){stack=[];return}
  var lv=+m[1]||1,ig=el.querySelector('span[style*="mso-list"]'),bt='';
  if(ig){bt=ig.textContent;ig.parentNode.removeChild(ig)}
  var ord=/^[\s\u00a0]*(\d+|[a-z]{1,3}|[ivxlcdm]+|[\u0995-\u09B9\u09E6-\u09EF]+)[.)]/i.test(bt),
      li=doc.createElement('li');
  while(el.firstChild)li.appendChild(el.firstChild);
  while(stack.length&&stack[stack.length-1].lv>lv)stack.pop();
  var top=stack[stack.length-1];
  if(!top||top.lv<lv||top.ord!==ord){
   var l=doc.createElement(ord?'ol':'ul');
   if(top&&top.lv<lv&&top.li)top.li.appendChild(l);
   else{el.parentNode.insertBefore(l,el);if(top)stack.pop()}
   top={lv:lv,ord:ord,list:l,li:null};stack.push(top)}
  top.list.appendChild(li);top.li=li;
  el.parentNode.removeChild(el)})}

/* ---------- sanitize ---------- */
function mk(t){return document.createElement(t)}
function clean(node,out){
 Array.prototype.forEach.call(node.childNodes,function(n){
  if(n.nodeType===3){out.appendChild(document.createTextNode(n.nodeValue));return}
  if(n.nodeType!==1)return;
  var t=n.tagName.toUpperCase();
  if(DROP[t])return;
  if(!TAGS[t]){clean(n,out);return}                       /* unknown tag: keep its children only */
  var stl=n.getAttribute('style')||'',sc=cleanStyle(stl),tag=t.toLowerCase(),al=(n.getAttribute('align')||'').toLowerCase();
  if(/^(left|right|center|justify)$/.test(al)&&!/text-align/.test(sc.css.join(';')))sc.css.push('text-align:'+al);
  if(t==='BR'||t==='HR'){out.appendChild(mk(tag));return}
  if(t==='IMG'){
   var src=n.getAttribute('src')||'';
   if(!/^data:image\/(png|jpe?g|gif|webp);base64,[a-z0-9+\/=]+$/i.test(src)&&!/^https:\/\//i.test(src))return;
   var im=mk('img');im.setAttribute('src',src);im.setAttribute('alt',(n.getAttribute('alt')||'').slice(0,100));out.appendChild(im);return}
  if(t==='B'||t==='STRONG')tag=/font-weight:\s*(normal|[1-4]00|lighter)/i.test(stl)?'span':'b';   /* Google Docs wraps everything in <b style="font-weight:normal"> */
  else if(t==='I'||t==='EM')tag=/font-style:\s*normal/i.test(stl)?'span':'i';
  else if(t==='STRIKE'||t==='DEL')tag='s';
  else if(t==='FONT'){
   tag='span';
   var fc=okColor(n.getAttribute('color')||''),fz=+n.getAttribute('size'),ff=n.getAttribute('face')||'';
   if(fc)sc.css.unshift('color:'+fc);
   if(fz>=1&&fz<=7&&FS_FONT[fz-1]!==16)sc.css.unshift('font-size:'+FS_FONT[fz-1]+'px');
   if(ff&&/^[\w\s,'"\-]+$/.test(ff))sc.css.unshift('font-family:'+ff)}
  else if(t==='BLOCKQUOTE'&&/border:\s*none|border-left:\s*none/i.test(stl))tag='div';        /* browser "indent" = blockquote with margin */
  else if(t==='A'){
   var h=(n.getAttribute('href')||'').trim();
   if(!/^(https?:\/\/|mailto:|tel:)/i.test(h)){clean(n,out);return}
   var a=mk('a');a.setAttribute('href',h);a.setAttribute('target','_blank');a.setAttribute('rel','noopener noreferrer');
   if(sc.css.length)a.setAttribute('style',sc.css.join(';'));
   var wa=a;
   if(sc.b){var ab=mk('b');wa.appendChild(ab);wa=ab}
   if(sc.i){var ai=mk('i');wa.appendChild(ai);wa=ai}
   clean(n,wa);out.appendChild(a);return}
  var css=sc.css.join(';'),host,w;
  if(tag==='span'&&!css){host=out}
  else{host=mk(tag);if(css)host.setAttribute('style',css);out.appendChild(host)}
  if(tag==='td'||tag==='th'){['colspan','rowspan'].forEach(function(a){var v=parseInt(n.getAttribute(a),10);if(v>1&&v<20)host.setAttribute(a,v)})}
  if(tag==='ol'){
   var stt=parseInt(n.getAttribute('start'),10);if(stt>1&&stt<1000)host.setAttribute('start',stt);
   var ty={'1':'decimal',a:'lower-alpha',A:'upper-alpha',i:'lower-roman',I:'upper-roman'}[n.getAttribute('type')];
   if(ty&&!/list-style-type/.test(css))host.setAttribute('style',(css?css+';':'')+'list-style-type:'+ty)}
  w=host;
  if(sc.b&&tag!=='b'&&tag!=='strong'){var b=mk('b');w.appendChild(b);w=b}
  if(sc.i&&tag!=='i'){var i=mk('i');w.appendChild(i);w=i}
  if(sc.u&&tag!=='u'){var u=mk('u');w.appendChild(u);w=u}
  if(sc.s&&tag!=='s'){var s=mk('s');w.appendChild(s);w=s}
  clean(n,w)})}
function sanitize(html){
 html=String(html||'');
 var doc=new DOMParser().parseFromString('<body>'+html+'</body>','text/html'),out=document.createElement('div');
 if(/mso-list/i.test(html))wordLists(doc.body);
 clean(doc.body,out);
 var h=out.innerHTML.replace(/(<br>\s*)+$/i,'').replace(/^(<br>\s*)+/i,'');
 if(!out.textContent.trim()&&!out.querySelector('img,table,hr'))return'';
 return h}
function rtx(s){if(s==null||s==='')return'';return isHtml(s)?'<span class="rt">'+sanitize(s)+'</span>':'<span class="rt rt-p">'+esc(s)+'</span>'}
function plain(s,n){s=String(s==null?'':s);if(isHtml(s)){var d=new DOMParser().parseFromString('<body>'+s+'</body>','text/html');
  d.querySelectorAll('img').forEach(function(i){i.replaceWith(' [ছবি] ')});d.querySelectorAll('br,p,div,tr,li,h1,h2,h3,h4,h5,h6').forEach(function(e){e.append(' ')});s=d.body.textContent}
 s=s.replace(/\s+/g,' ').trim();return n&&s.length>n?s.slice(0,n)+'…':s}
function plainToHtml(t){return String(t).replace(/\r\n?/g,'\n').split('\n').map(function(l){
  return esc(l).replace(/\t/g,'&nbsp;&nbsp;&nbsp;&nbsp;').replace(/ {2,}/g,function(m){return ' '+new Array(m.length).join('&nbsp;')}).replace(/^ /,'&nbsp;')}).join('<br>')}
window.rtxEsc=esc;window.rtSan=sanitize;window.rtx=rtx;window.rtPlain=plain;window.rtIsHtml=isHtml;

/* ---------------- styles (shared by student view and editor) ---------------- */
function P(sel){return sel.split(',').map(function(x){return '.rt '+x+',.rte-ed '+x}).join(',')}
var css='.rt{display:block;line-height:1.65;word-break:break-word}.rt-p{white-space:pre-wrap}'
+P('table')+'{border-collapse:collapse;max-width:100%;margin:8px 0;display:block;overflow-x:auto}'
+P('td,th')+'{border:1px solid var(--line,#cbd5e1);padding:6px 10px;min-width:48px;vertical-align:top}'
+P('th')+'{background:rgba(37,99,235,.08)}'
+P('img')+'{max-width:100%;height:auto;border-radius:8px;margin:4px 0}'
+P('ul,ol')+'{margin:6px 0;padding-left:26px}'+P('li')+'{margin:2px 0}'
+P('p')+'{margin:.35em 0}'
+P('h1')+'{font-size:1.5em;margin:.6em 0 .3em;line-height:1.3}'+P('h2')+'{font-size:1.3em;margin:.6em 0 .3em;line-height:1.3}'+P('h3')+'{font-size:1.15em;margin:.5em 0 .25em;line-height:1.35}'+P('h4,h5,h6')+'{font-size:1em;margin:.5em 0 .25em}'
+P('blockquote')+'{margin:8px 0;padding:6px 12px;border-left:3px solid #2563eb;background:rgba(37,99,235,.06);border-radius:0 8px 8px 0}'
+P('a')+'{color:#2563eb;text-decoration:underline;word-break:break-all}'
+P('hr')+'{border:0;border-top:1px solid var(--line,#cbd5e1);margin:10px 0}'
+P('pre')+'{white-space:pre-wrap;background:rgba(127,127,127,.12);padding:8px 10px;border-radius:8px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.92em;margin:6px 0}'
+P('code')+'{font-family:ui-monospace,Menlo,Consolas,monospace;background:rgba(127,127,127,.15);padding:0 4px;border-radius:4px}'+P('pre code')+'{background:none;padding:0}'
+P('mark')+'{background:#fde68a;color:inherit;padding:0 2px;border-radius:3px}'
+'.rte{position:relative;border:1.5px solid var(--line,#d6dcec);border-radius:12px;background:var(--card,#fff);margin:4px 0 10px}.rte:focus-within{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.16)}'
+'.rte-tb{display:flex;flex-wrap:wrap;align-items:center;gap:4px;padding:6px;border-bottom:1px solid var(--line,#e3e8f4);background:rgba(37,99,235,.05);border-radius:11px 11px 0 0}'
+'.rte-r2{display:flex;flex-wrap:wrap;align-items:center;gap:4px;width:100%;padding-top:4px;border-top:1px dashed var(--line,#e3e8f4)}'
+'.rte-sm .rte-r2{display:none}.rte-sm.rte-open .rte-r2{display:flex}'
+'.rte-tb button{border:1px solid transparent;background:transparent;color:inherit;min-width:32px;height:32px;padding:0 8px;border-radius:8px;font:inherit;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:5px;position:relative}.rte-tb button:hover{background:rgba(37,99,235,.14)}.rte-tb button svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.rte-tb button.on{background:rgba(37,99,235,.2);border-color:rgba(37,99,235,.4)}'
+'.rte-tb button .bar{position:absolute;left:7px;right:7px;bottom:3px;height:3px;border-radius:2px}'
+'.rte-tb i{width:1px;height:20px;background:var(--line,#d6dcec);margin:0 3px}'
+'.rte-tb input{width:42px!important;height:30px!important;border:1px solid var(--line,#d6dcec);border-radius:8px;text-align:center;font:inherit;background:var(--card,#fff);color:inherit;padding:0!important;margin:0!important}.rte-tb small{opacity:.7}'
+'.rte-tb select{width:auto!important;max-width:118px;height:32px!important;margin:0!important;padding:0 6px!important;border:1px solid var(--line,#d6dcec);border-radius:8px;background:var(--card,#fff);color:inherit;font:inherit;font-size:13px;font-weight:600}'
+'.rte-ed{min-height:84px;max-height:480px;overflow:auto;padding:10px 12px;outline:0;line-height:1.6;word-break:break-word;resize:vertical}.rte-ed.rte-s{min-height:44px}.rte-ed[data-empty="1"]:before{content:attr(data-ph);opacity:.45;pointer-events:none}'
+'.rte-ft{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;padding:4px 12px 6px;font-size:12px;opacity:.65;border-top:1px solid var(--line,#e3e8f4)}'
+'.rte-pop{position:fixed;z-index:99999;background:var(--card,#fff);color:inherit;border:1px solid var(--line,#d6dcec);border-radius:12px;padding:10px;box-shadow:0 12px 32px rgba(0,0,0,.25);max-width:calc(100vw - 16px)}'
+'.rte-sw{display:grid;grid-template-columns:repeat(8,24px);gap:5px}.rte-sw button{width:24px;height:24px;border-radius:6px;border:1px solid rgba(0,0,0,.25);padding:0;cursor:pointer}'
+'.rte-pop .rte-row{display:flex;gap:8px;align-items:center;margin-top:8px;font-size:13px}.rte-pop .rte-row button{border:1px solid var(--line,#d6dcec);background:transparent;color:inherit;border-radius:8px;padding:4px 10px;cursor:pointer;font:inherit}.rte-pop input[type=color]{width:34px;height:26px;padding:0;border:0;background:none}'
+'.rte-sy{display:grid;grid-template-columns:repeat(9,34px);gap:3px;max-height:260px;overflow:auto}.rte-sy button{height:34px;border:1px solid var(--line,#e3e8f4);background:transparent;color:inherit;border-radius:8px;font-size:17px;cursor:pointer;padding:0}.rte-sy button:hover{background:rgba(37,99,235,.14)}';
var stl=document.createElement('style');stl.textContent=css;(document.head||document.documentElement).appendChild(stl);

/* ---------------- editor ---------------- */
function sv(d){return '<svg viewBox="0 0 24 24">'+d+'</svg>'}
var IC={b:'<b>B</b>',i:'<i style="font-family:serif">I</i>',u:'<u>U</u>',s:'<s>S</s>',sub:'x<sub style="font-size:9px">2</sub>',sup:'x<sup style="font-size:9px">2</sup>',
 undo:sv('<path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/>'),redo:sv('<path d="m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3"/>'),
 tbl:sv('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16"/>'),
 img:sv('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-8 8"/>'),
 rowp:sv('<path d="M3 9h18v6H3zM12 18v4M10 20h4"/>'),colp:sv('<path d="M9 3v18h6V3zM18 12h4M20 10v4"/>'),
 rowm:sv('<path d="M3 9h18v6H3zM10 20h4"/>'),colm:sv('<path d="M9 3v18h6V3zM18 12h4"/>'),
 del:sv('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),clr:sv('<path d="M4 7V4h16v3M9 20h6M12 4v16M5 5l14 14"/>'),
 al:sv('<path d="M3 6h18M3 10h12M3 14h18M3 18h12"/>'),ac:sv('<path d="M3 6h18M7 10h10M3 14h18M7 18h10"/>'),ar:sv('<path d="M3 6h18M9 10h12M3 14h18M9 18h12"/>'),aj:sv('<path d="M3 6h18M3 10h18M3 14h18M3 18h18"/>'),
 ul:sv('<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'),
 ol:sv('<path d="M10 6h11M10 12h11M10 18h11M4 5l1-1v5M3.5 13.5c.4-.9 2.2-.9 2.2.2 0 .9-2.2 1.4-2.2 2.3h2.3"/>'),
 ind:sv('<path d="M3 6h18M11 10h10M11 14h10M3 18h18M3 9l3 3-3 3"/>'),out:sv('<path d="M3 6h18M11 10h10M11 14h10M3 18h18M6 9l-3 3 3 3"/>'),
 link:sv('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>'),
 unlink:sv('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1M4 4l16 16"/>'),
 hr:sv('<path d="M3 12h4M10 12h4M17 12h4"/>'),
 hi:sv('<path d="m9 11-6 6v3h9l3-3M22 12l-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>')};
var FONTS=['Hind Siliguri','Arial','Times New Roman','Georgia','Verdana','Tahoma','Courier New'],SIZES=[12,14,16,18,20,24,28,32,40,48];
var COLORS=['#000001','#434343','#666666','#999999','#cccccc','#ffffff','#e5384a','#ff0000',
 '#c00000','#f97316','#ffc000','#ffff00','#92d050','#00b050','#0ea5b7','#00b0f0',
 '#0070c0','#1d5cff','#002060','#7030a0','#c026d3','#db2777','#8b5a2b','#065f46'];
var SYM='² ³ ¹ ⁰ ⁴ ⁺ ⁻ ⁿ ½ ¼ ¾ × ÷ ± ∓ ≠ ≈ ≡ ≤ ≥ < > √ ∛ ∞ ∑ ∏ ∫ ∂ ∆ ∇ π θ α β γ δ ε λ μ ρ σ τ φ ω Ω Σ Δ Φ Ψ Π Λ ° ′ ″ ∠ ⊥ ∥ ∴ ∵ → ← ↑ ↓ ↔ ⇒ ⇌ ∈ ∉ ⊂ ⊃ ∪ ∩ ∅ ℃ ℉ Å ‰ ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉ ₊ ₋ ● ○ ■ □ ✓ ✗ ★ ৳ । ॥ … – — “ ” ‘ ’ © ® ™'.split(' ');
function compress(file,cb){
 var fr=new FileReader();fr.onload=function(){var im=new Image();im.onload=function(){
  var W=Math.min(900,im.width),H=Math.round(im.height*W/im.width),q=.78,url,c=document.createElement('canvas');c.width=W;c.height=H;
  var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,H);x.drawImage(im,0,0,W,H);
  url=c.toDataURL('image/jpeg',q);while(url.length>320000&&q>.4){q-=.1;url=c.toDataURL('image/jpeg',q)}
  cb(url)};im.onerror=function(){cb(null)};im.src=fr.result};fr.onerror=function(){cb(null)};fr.readAsDataURL(file)}

var POP=null;
function closePop(){if(POP){POP.parentNode&&POP.parentNode.removeChild(POP);POP=null;document.removeEventListener('mousedown',outside,true);document.removeEventListener('touchstart',outside,true);document.removeEventListener('keydown',escKey,true);window.removeEventListener('resize',closePop)}}
function outside(e){if(POP&&!POP.contains(e.target)&&!(e.target.closest&&e.target.closest('.rte-tb button[data-pop]')))closePop()}
function escKey(e){if(e.key==='Escape')closePop()}
function openPop(btn,html,onpick){
 closePop();var p=document.createElement('div');p.className='rte-pop';p.innerHTML=html;document.body.appendChild(p);POP=p;
 var r=btn.getBoundingClientRect(),w=p.offsetWidth,h=p.offsetHeight;
 p.style.left=Math.max(8,Math.min(r.left,window.innerWidth-w-8))+'px';
 p.style.top=(r.bottom+6+h>window.innerHeight&&r.top-h-6>8?r.top-h-6:r.bottom+6)+'px';
 p.addEventListener('mousedown',function(e){if(e.target.tagName!=='INPUT')e.preventDefault()});
 p.addEventListener('click',function(e){var b=e.target.closest('button[data-v]');if(!b)return;onpick(b.getAttribute('data-v'));closePop()});
 var ci=p.querySelector('input[type=color]');if(ci)ci.addEventListener('change',function(){onpick(ci.value);closePop()});
 setTimeout(function(){if(POP!==p)return;document.addEventListener('mousedown',outside,true);document.addEventListener('touchstart',outside,true);document.addEventListener('keydown',escKey,true);window.addEventListener('resize',closePop)},0)}

function build(src){
 var small=src.getAttribute('data-rt')==='s',ph=src.getAttribute('placeholder')||'',wrap=document.createElement('div');wrap.className='rte'+(small?' rte-sm':'');
 function bt(c,t,i,x){return '<button type="button" data-c="'+c+'"'+(x||'')+' title="'+t+'" aria-label="'+t+'">'+i+'</button>'}
 function sl(k,t,o){return '<select data-s="'+k+'" title="'+t+'" aria-label="'+t+'">'+o+'</select>'}
 var r1=bt('undo','Undo (Ctrl+Z)',IC.undo)+bt('redo','Redo (Ctrl+Y)',IC.redo)+'<i></i>'
  +sl('block','Paragraph style','<option value="">Style</option><option value="p">Normal</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option>')
  +sl('font','Font','<option value="">Font</option>'+FONTS.map(function(f){return '<option value="'+f+'">'+f+'</option>'}).join(''))
  +sl('size','Font size (px)','<option value="">Size</option>'+SIZES.map(function(s){return '<option value="'+s+'">'+s+'</option>'}).join(''))+'<i></i>'
  +bt('bold','Bold (Ctrl+B)',IC.b)+bt('italic','Italic (Ctrl+I)',IC.i)+bt('underline','Underline (Ctrl+U)',IC.u)+bt('strike','Strikethrough',IC.s)+bt('sub','Subscript (H₂O)',IC.sub)+bt('sup','Superscript (x²)',IC.sup)+'<i></i>'
  +bt('fore','Text colour',IC.b.replace('<b>B</b>','A')+'<span class="bar" style="background:#e5384a"></span>',' data-pop="1"')
  +bt('back','Highlight',IC.hi+'<span class="bar" style="background:#facc15"></span>',' data-pop="1"')
  +bt('sym','Symbols (π √ ² ° ≤ …)','Ω',' data-pop="1"')
  +(small?bt('more','আরও টুল (list, table, align, link…)','⋯'):'');
 var r2=bt('alignl','Align left',IC.al)+bt('alignc','Center',IC.ac)+bt('alignr','Align right',IC.ar)+bt('alignj','Justify',IC.aj)+'<i></i>'
  +bt('ul','Bullet list',IC.ul)+bt('ol','Numbered list',IC.ol)+bt('outdent','Decrease indent',IC.out)+bt('indent','Increase indent',IC.ind)+'<i></i>'
  +bt('link','Link (Ctrl+K)',IC.link)+bt('unlink','Remove link',IC.unlink)+bt('hr','Horizontal line',IC.hr)+'<i></i>'
  +bt('table','Insert table',IC.tbl)+'<input class="rt-r" type="number" min="1" max="20" value="3" title="সারি (rows)" aria-label="rows"><small>×</small><input class="rt-c" type="number" min="1" max="10" value="3" title="কলাম (columns)" aria-label="columns">'
  +bt('addrow','Add row',IC.rowp)+bt('addcol','Add column',IC.colp)+bt('delrow','Delete row',IC.rowm)+bt('delcol','Delete column',IC.colm)+bt('deltbl','Delete table',IC.del)+'<i></i>'
  +bt('img','Image',IC.img)+bt('clear','Clear formatting',IC.clr)+'<input type="file" accept="image/*" hidden>';
 wrap.innerHTML='<div class="rte-tb">'+r1+'<div class="rte-r2">'+r2+'</div></div>'
  +'<div class="rte-ed'+(small?' rte-s':'')+'" contenteditable="true" data-ph="'+esc(ph)+'" data-empty="1"></div>'
  +(small?'':'<div class="rte-ft"><span class="rte-wc"></span><span>Paste = format সহ · Ctrl+Shift+V = শুধু text</span></div>');
 var ed=wrap.querySelector('.rte-ed'),tb=wrap.querySelector('.rte-tb'),file=wrap.querySelector('input[type=file]'),wc=wrap.querySelector('.rte-wc'),saved=null,plainNext=false,pendPx=null;
 function chk(){
  ed.setAttribute('data-empty',(!ed.textContent.trim()&&!ed.querySelector('img,table,hr'))?'1':'0');
  if(wc){var tx=ed.textContent.trim();wc.textContent='শব্দ: '+(tx?tx.split(/\s+/).length:0)+' · অক্ষর: '+tx.replace(/\s/g,'').length}}
 function keep(){var s=getSelection();if(s.rangeCount&&ed.contains(s.anchorNode))saved=s.getRangeAt(0).cloneRange()}
 function back(){ed.focus();if(saved){var s=getSelection();s.removeAllRanges();s.addRange(saved)}}
 function fixSizes(){   /* browser's fontSize=7 marker -> real px size */
  var px=pendPx;if(!px)return;var hit=false;
  ed.querySelectorAll('font[size="7"],span').forEach(function(n){
   if(n.tagName==='FONT'){var sp=document.createElement('span');sp.style.fontSize=px+'px';while(n.firstChild)sp.appendChild(n.firstChild);n.parentNode.replaceChild(sp,n);hit=true}
   else if(n.style&&n.style.fontSize==='xxx-large'){n.style.fontSize=px+'px';hit=true}});
  if(hit)pendPx=null}
 ['keyup','mouseup','touchend','focus','blur','input'].forEach(function(e){ed.addEventListener(e,function(){keep();if(e==='input')fixSizes();chk()})});
 function ins(h){back();document.execCommand('insertHTML',false,h);keep();chk()}
 function ex(cmd,val,css){back();document.execCommand('styleWithCSS',false,!!css);var ok=document.execCommand(cmd,false,val);keep();chk();return ok}
 function cell(){var s=getSelection(),n=s.anchorNode;n=n&&(n.nodeType===1?n:n.parentNode);var c=n&&n.closest?n.closest('td,th'):null;return c&&ed.contains(c)?c:(saved&&saved.startContainer&&(function(){var p=saved.startContainer;p=p.nodeType===1?p:p.parentNode;var c2=p.closest&&p.closest('td,th');return c2&&ed.contains(c2)?c2:null})())}
 function curLink(){var n=saved&&saved.startContainer;n=n&&(n.nodeType===1?n:n.parentNode);var a=n&&n.closest?n.closest('a'):null;return a&&ed.contains(a)?a:null}
 function doLink(){
  back();var txt=String(getSelection()),cur=curLink(),u=prompt('Link (URL) দিন:',cur?cur.getAttribute('href'):'https://');
  if(u===null)return;u=u.trim();back();
  if(!u){ex('unlink');return}
  if(!/^(https?:\/\/|mailto:|tel:)/i.test(u)){if(/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(u))u='https://'+u;else{alert('সঠিক link দিন (যেমন https://example.com)');return}}
  if(txt)ex('createLink',u);else ins('<a href="'+esc(u)+'">'+esc(u)+'</a>')}
 function setColor(kind,v){
  back();document.execCommand('styleWithCSS',false,true);
  if(kind==='fore'){
   if(v==='auto'){document.execCommand('foreColor',false,'#000001');
    ed.querySelectorAll('[style]').forEach(function(n){if(n.style.color==='rgb(0, 0, 1)'){n.style.removeProperty('color');if(n.tagName==='SPAN'&&!n.getAttribute('style')){while(n.firstChild)n.parentNode.insertBefore(n.firstChild,n);n.parentNode.removeChild(n)}}})}
   else document.execCommand('foreColor',false,v);
   if(v!=='auto'){var bar=tb.querySelector('[data-c=fore] .bar');if(bar)bar.style.background=v}}
  else{document.execCommand('hiliteColor',false,v==='none'?'transparent':v);if(v!=='none'){var b2=tb.querySelector('[data-c=back] .bar');if(b2)b2.style.background=v}}
  keep();chk()}
 tb.addEventListener('mousedown',function(e){if(!/^(INPUT|SELECT|OPTION)$/.test(e.target.tagName))e.preventDefault()});
 var SIMPLE={bold:'bold',italic:'italic',underline:'underline',strike:'strikeThrough',sub:'subscript',sup:'superscript',ul:'insertUnorderedList',ol:'insertOrderedList',indent:'indent',outdent:'outdent',undo:'undo',redo:'redo',unlink:'unlink',hr:'insertHorizontalRule'},
  ALIGN={alignl:'justifyLeft',alignc:'justifyCenter',alignr:'justifyRight',alignj:'justifyFull'};
 tb.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||!tb.contains(b))return;var c=b.getAttribute('data-c');
  if(SIMPLE[c])ex(SIMPLE[c]);
  else if(ALIGN[c])ex(ALIGN[c],null,true);
  else if(c==='more'){wrap.classList.toggle('rte-open')}
  else if(c==='clear'){ex('removeFormat');ex('formatBlock','<p>')}
  else if(c==='link')doLink();
  else if(c==='fore'){keep();openPop(b,'<div class="rte-sw">'+COLORS.map(function(x){return '<button type="button" data-v="'+x+'" style="background:'+(x==='#000001'?'#000':x)+'" title="'+(x==='#000001'?'Black':x)+'"></button>'}).join('')+'</div><div class="rte-row"><button type="button" data-v="auto">Auto (রঙ সরাও)</button><label>Custom <input type="color" value="#e5384a"></label></div>',function(v){setColor('fore',v==='#000001'?'#000001':v)})}
  else if(c==='back'){keep();openPop(b,'<div class="rte-sw">'+['#fef08a','#fde047','#facc15','#fed7aa','#fdba74','#fecaca','#fca5a5','#bbf7d0','#86efac','#a7f3d0','#bae6fd','#7dd3fc','#c7d2fe','#a5b4fc','#e9d5ff','#f5d0fe','#fbcfe8','#d9f99d','#e5e7eb','#d1d5db','#fde68a','#99f6e4','#bfdbfe','#fecdd3'].map(function(x){return '<button type="button" data-v="'+x+'" style="background:'+x+'" title="'+x+'"></button>'}).join('')+'</div><div class="rte-row"><button type="button" data-v="none">Highlight সরাও</button><label>Custom <input type="color" value="#facc15"></label></div>',function(v){setColor('back',v)})}
  else if(c==='sym'){keep();openPop(b,'<div class="rte-sy">'+SYM.map(function(x){return '<button type="button" data-v="'+x+'">'+esc(x)+'</button>'}).join('')+'</div>',function(v){back();document.execCommand('insertText',false,v);keep();chk()})}
  else if(c==='table'){var r=Math.min(20,Math.max(1,+tb.querySelector('.rt-r').value||3)),k=Math.min(10,Math.max(1,+tb.querySelector('.rt-c').value||3)),h='<table><tbody>';
   for(var i=0;i<r;i++){h+='<tr>';for(var j=0;j<k;j++)h+='<td><br></td>';h+='</tr>'}ins(h+'</tbody></table><br>')}
  else if(c==='addrow'){var td=cell();if(!td)return;var tr=td.parentNode,n=tr.cloneNode(true);Array.prototype.forEach.call(n.children,function(x){x.innerHTML='<br>'});tr.parentNode.insertBefore(n,tr.nextSibling);chk()}
  else if(c==='addcol'){var td2=cell();if(!td2)return;var idx=Array.prototype.indexOf.call(td2.parentNode.children,td2),tbl=td2.closest('table');Array.prototype.forEach.call(tbl.rows,function(r2){var nc=document.createElement(r2.cells[idx]&&r2.cells[idx].tagName==='TH'?'th':'td');nc.innerHTML='<br>';r2.insertBefore(nc,r2.cells[idx+1]||null)});chk()}
  else if(c==='delrow'){var td4=cell();if(!td4)return;var tb4=td4.closest('table');td4.parentNode.remove();if(!tb4.rows.length)tb4.remove();chk()}
  else if(c==='delcol'){var td5=cell();if(!td5)return;var ix=Array.prototype.indexOf.call(td5.parentNode.children,td5),tb5=td5.closest('table');Array.prototype.forEach.call(tb5.rows,function(r5){if(r5.cells[ix])r5.deleteCell(ix)});if(!tb5.rows[0]||!tb5.rows[0].cells.length)tb5.remove();chk()}
  else if(c==='deltbl'){var td3=cell();if(td3){td3.closest('table').remove();chk()}}
  else if(c==='img'){keep();file.value='';file.click()}});
 tb.addEventListener('change',function(e){var s=e.target;if(s.tagName!=='SELECT')return;var k=s.getAttribute('data-s'),v=s.value;s.selectedIndex=0;if(!v)return;
  if(k==='block')ex('formatBlock','<'+v+'>');
  else if(k==='font')ex('fontName',v,true);
  else if(k==='size'){pendPx=+v;ex('fontSize','7',true);fixSizes()}});
 file.addEventListener('change',function(){var f=file.files&&file.files[0];if(!f)return;compress(f,function(u){if(!u){alert('ছবি পড়া যায়নি');return}ins('<img src="'+u+'" alt="">')})});
 ed.addEventListener('keydown',function(e){var m=e.ctrlKey||e.metaKey,k=e.key;
  if(m&&e.shiftKey&&(k==='V'||k==='v'))plainNext=true;
  else if(m&&!e.shiftKey&&(k==='k'||k==='K')){e.preventDefault();keep();doLink()}});
 ed.addEventListener('paste',function(e){var d=e.clipboardData;if(!d)return;
  var h=d.getData('text/html'),t=d.getData('text/plain'),img=null,asPlain=plainNext;plainNext=false;
  if(d.files)for(var i=0;i<d.files.length;i++)if(/^image\//.test(d.files[i].type)){img=d.files[i];break}
  e.preventDefault();
  if(!asPlain&&h){var s=sanitize(h);
   if(s){ins(s);if(img&&!/<img\b/i.test(s)&&/<img\b/i.test(h))compress(img,function(u){if(u)ins('<img src="'+u+'" alt="">')});return}}
  if(!asPlain&&!t.trim()&&img){compress(img,function(u){if(u)ins('<img src="'+u+'" alt="">')});return}
  if(t)ins(plainToHtml(t));chk()});
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
