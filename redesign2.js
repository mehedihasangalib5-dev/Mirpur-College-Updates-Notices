/* MCUN redesign layer v3 (behaviour). Loaded after redesign.js.
   - Sidebar becomes a slide-in drawer below 1024px, opened by a menu button in the header,
     so the category dropdowns stay reachable on phones and tablets.
   - Wraps the auth form (#gate) in a split-screen layout without touching the auth logic. */
(function () {
  'use strict';
  const R = document.documentElement;
  const $ = (s) => document.querySelector(s);

  /* ---------------- drawer ---------------- */
  function drawer(open) {
    R.classList.toggle('mc-drawer', open);
    const b = $('#mcMenu');
    if (b) {
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      b.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }
  function mkMenu() {
    const nav = $('header .nav');
    if (!nav || $('#mcMenu')) return;
    const b = document.createElement('button');
    b.id = 'mcMenu';
    b.type = 'button';
    b.setAttribute('aria-controls', 'mcSide');
    b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-label', 'Open menu');
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    b.addEventListener('click', () => drawer(!R.classList.contains('mc-drawer')));
    nav.insertBefore(b, nav.firstChild);
    if (!$('#mcScrim')) {
      const s = document.createElement('div');
      s.id = 'mcScrim';
      s.addEventListener('click', () => drawer(false));
      document.body.appendChild(s);
    }
  }
  /* close after choosing a destination (links and the logout button), but not when only expanding a dropdown */
  document.addEventListener('click', (e) => {
    if (!R.classList.contains('mc-drawer')) return;
    const t = e.target.closest && e.target.closest('#mcSide a, #mcSide .mc-out button');
    if (t) setTimeout(() => drawer(false), 0);
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') drawer(false); });
  addEventListener('hashchange', () => drawer(false));
  const mq = matchMedia('(min-width:1024px)');
  (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))((e) => { if (e.matches) drawer(false); });

  /* header is rebuilt by redesign.js on route changes: make sure the menu button survives */
  const app = $('#app');
  if (app) new MutationObserver(mkMenu).observe(app, { childList: true });
  mkMenu();
  setTimeout(mkMenu, 1200);
})();
