/* MCUN illustration kit: inline SVG scenes for hero banners, and post-card covers.
   No external images, so it works offline and never breaks. Everything is themed with CSS variables
   (--a = accent, --b = secondary) so each page/category can recolour the same scene.
   Want a real college photo instead? Set  .hx{--hx-img:url(/college.jpg)}  in CSS (see redesign2.css). */
(function () {
  const S = (vb, inner, cls) =>
    `<svg class="${cls || 'art'}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" preserveAspectRatio="${cls&&cls.indexOf('auth')>-1?'xMidYMid meet':'xMidYMid slice'}">${inner}</svg>`;

  /* ---- reusable pieces ---- */
  const building = (x, y, s) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 150h300v10H0z" fill="rgba(0,0,0,.25)"/>
    <path d="M30 150V70h240v80z" fill="#fff" opacity=".95"/>
    <path d="M10 70 150 10l140 60z" fill="var(--a,#fbbf24)"/>
    <path d="M10 70h280v8H10z" fill="rgba(0,0,0,.18)"/>
    <g fill="#1e3a8a" opacity=".85">
      <rect x="62" y="92" width="26" height="34" rx="13"/><rect x="108" y="92" width="26" height="34" rx="13"/>
      <rect x="166" y="92" width="26" height="34" rx="13"/><rect x="212" y="92" width="26" height="34" rx="13"/>
    </g>
    <rect x="132" y="104" width="36" height="46" rx="4" fill="var(--b,#1d4ed8)"/>
    <circle cx="150" cy="44" r="11" fill="#fff"/><path d="M150 36v8l5 3" stroke="#1e3a8a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M150 10V-8" stroke="#fff" stroke-width="3"/><path d="M150-8l22 6-22 6z" fill="#ef4444"/>
  </g>`;

  const book = (x, y, r, c1, c2) => `
  <g transform="translate(${x} ${y}) rotate(${r})">
    <rect width="86" height="108" rx="8" fill="${c1}"/><rect x="8" width="78" height="108" rx="6" fill="${c2}"/>
    <rect x="22" y="22" width="46" height="6" rx="3" fill="#fff" opacity=".85"/><rect x="22" y="36" width="34" height="6" rx="3" fill="#fff" opacity=".6"/>
  </g>`;

  const grad = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;

  /* ---- hero scenes (one per page) ---- */
  const HERO = {
    dash: () => S('0 0 420 260', `
      <circle cx="320" cy="70" r="46" fill="var(--a,#fbbf24)" opacity=".9"/>
      <circle cx="320" cy="70" r="70" fill="none" stroke="#fff" opacity=".18" stroke-width="2"/>
      <path d="M40 80c18-14 40-14 58 0-8 14-50 14-58 0zM250 40c14-10 30-10 44 0-6 10-38 10-44 0z" fill="#fff" opacity=".22"/>
      ${building(112, 74, 1.0)}
      <path d="M0 232c70-18 140-18 210 0s140 18 210 0V260H0z" fill="rgba(255,255,255,.14)"/>
      <path d="M0 246c80-14 150-14 230 0s130 10 190 0V260H0z" fill="rgba(255,255,255,.2)"/>`),
    notices: () => S('0 0 420 260', `
      <g transform="translate(60 26) rotate(-4 150 100)">
        <rect width="300" height="200" rx="16" fill="#fff" opacity=".96"/>
        <rect x="14" y="14" width="272" height="172" rx="10" fill="#fef3c7"/>
        <rect x="30" y="30" width="110" height="64" rx="4" fill="#fff"/><rect x="40" y="42" width="70" height="6" rx="3" fill="#be123c"/><rect x="40" y="56" width="90" height="5" rx="2.5" fill="#cbd5e1"/><rect x="40" y="68" width="60" height="5" rx="2.5" fill="#cbd5e1"/>
        <rect x="158" y="30" width="112" height="46" rx="4" fill="#fff" transform="rotate(3 214 53)"/><rect x="170" y="42" width="60" height="6" rx="3" fill="var(--b,#f43f5e)"/><rect x="170" y="56" width="84" height="5" rx="2.5" fill="#cbd5e1"/>
        <rect x="34" y="112" width="96" height="58" rx="4" fill="#fff" transform="rotate(-2 82 141)"/><rect x="46" y="124" width="52" height="6" rx="3" fill="#0d9488"/><rect x="46" y="138" width="72" height="5" rx="2.5" fill="#cbd5e1"/>
        <rect x="150" y="100" width="120" height="72" rx="4" fill="#fff"/><rect x="162" y="112" width="64" height="6" rx="3" fill="#5b4bff"/><rect x="162" y="126" width="96" height="5" rx="2.5" fill="#cbd5e1"/><rect x="162" y="138" width="78" height="5" rx="2.5" fill="#cbd5e1"/>
        <circle cx="82" cy="30" r="7" fill="#ef4444"/><circle cx="214" cy="28" r="7" fill="#2563eb"/><circle cx="210" cy="100" r="7" fill="#16a34a"/>
      </g>
      <g transform="translate(300 150)"><circle r="44" fill="var(--a,#fde68a)"/><path d="M-18-10 14-22v44L-18 10z" fill="#9f1239"/><rect x="-26" y="-10" width="10" height="20" rx="3" fill="#9f1239"/><path d="M22-10c10 4 10 16 0 20" stroke="#9f1239" stroke-width="4" fill="none" stroke-linecap="round"/></g>`),
    hub: () => S('0 0 420 260', `
      ${book(70, 78, -10, '#6d28d9', '#8b5cf6')}${book(150, 56, 4, '#0ea5e9', '#38bdf8')}${book(232, 82, 12, '#f59e0b', '#fbbf24')}
      <g transform="translate(110 20)"><path d="M0 40 100 0l100 40-100 40z" fill="#1e1b4b"/><path d="M40 62v38c40 24 80 24 120 0V62L100 84z" fill="#312e81"/><path d="M196 44v52" stroke="var(--a,#fcd34d)" stroke-width="4"/><circle cx="196" cy="100" r="7" fill="var(--a,#fcd34d)"/></g>
      <g fill="#fff" opacity=".9"><circle cx="350" cy="60" r="4"/><circle cx="380" cy="110" r="3"/><circle cx="330" cy="190" r="5"/><path d="m350 130 5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" fill="var(--a,#fcd34d)"/></g>
      <path d="M0 236h420v24H0z" fill="rgba(255,255,255,.14)"/>`),
    lib: () => S('0 0 420 260', `
      <rect x="40" y="40" width="340" height="190" rx="10" fill="rgba(0,0,0,.2)"/>
      <rect x="40" y="110" width="340" height="8" fill="rgba(255,255,255,.35)"/><rect x="40" y="186" width="340" height="8" fill="rgba(255,255,255,.35)"/>
      ${['#fde68a|44|62', '#fb7185|28|46', '#a78bfa|34|56', '#34d399|26|50', '#60a5fa|38|64', '#fbbf24|30|48', '#f472b6|32|58', '#2dd4bf|36|54'].map((t, i) => { const [c, w, h] = t.split('|'); return `<rect x="${56 + i * 38}" y="${110 - h}" width="${w}" height="${h}" rx="4" fill="${c}"/>`; }).join('')}
      ${['#818cf8|40|58', '#f97316|30|52', '#22d3ee|34|60', '#e879f9|28|48', '#facc15|42|64', '#4ade80|30|50', '#fb7185|34|56'].map((t, i) => { const [c, w, h] = t.split('|'); return `<rect x="${64 + i * 42}" y="${186 - h}" width="${w}" height="${h}" rx="4" fill="${c}"/>`; }).join('')}
      <g transform="translate(330 30)"><path d="M0 0h54v78l-27-18L0 78z" fill="var(--a,#fef08a)"/></g>`),
    dl: () => S('0 0 420 260', `
      <g transform="translate(70 40)"><rect width="150" height="190" rx="16" fill="#fff"/><path d="M110 0l40 40h-28a12 12 0 0 1-12-12z" fill="#fed7aa"/>
        <rect x="22" y="70" width="106" height="8" rx="4" fill="#fdba74"/><rect x="22" y="92" width="86" height="8" rx="4" fill="#e2e8f0"/><rect x="22" y="112" width="96" height="8" rx="4" fill="#e2e8f0"/>
        <rect x="22" y="146" width="56" height="22" rx="11" fill="#c2410c"/></g>
      <g transform="translate(250 70)"><rect width="110" height="140" rx="14" fill="#ffedd5" transform="rotate(8 55 70)"/></g>
      <g transform="translate(300 118)"><circle r="52" fill="var(--a,#fff7ed)"/><path d="M0-24v36m-16-12 16 16 16-16" stroke="#c2410c" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-24 28h48" stroke="#c2410c" stroke-width="8" stroke-linecap="round"/></g>`),
    com: () => S('0 0 420 260', `
      <g transform="translate(60 40)"><path d="M0 24a24 24 0 0 1 24-24h170a24 24 0 0 1 24 24v80a24 24 0 0 1-24 24H70l-34 30v-30H24a24 24 0 0 1-24-24z" fill="#fff"/>
        <rect x="26" y="30" width="120" height="8" rx="4" fill="#0369a1"/><rect x="26" y="52" width="160" height="8" rx="4" fill="#bae6fd"/><rect x="26" y="74" width="96" height="8" rx="4" fill="#bae6fd"/></g>
      <g transform="translate(210 120)"><path d="M0 24a24 24 0 0 1 24-24h118a24 24 0 0 1 24 24v60a24 24 0 0 1-24 24h-12v26l-30-26H24A24 24 0 0 1 0 84z" fill="var(--a,#fde047)"/>
        <circle cx="52" cy="54" r="7" fill="#713f12"/><circle cx="83" cy="54" r="7" fill="#713f12"/><circle cx="114" cy="54" r="7" fill="#713f12"/></g>
      <g transform="translate(350 50)"><path d="M0 40a30 30 0 0 1 60 0c0 34 14 42 14 42H-14s14-8 14-42z" fill="#fff" opacity=".95"/><circle cx="30" cy="94" r="9" fill="var(--a,#fde047)"/><circle cx="50" cy="10" r="10" fill="#ef4444"/></g>`),
    pf: () => S('0 0 420 260', `
      <g transform="translate(120 36)"><circle cx="90" cy="64" r="48" fill="#fff"/><path d="M0 200c0-52 40-84 90-84s90 32 90 84z" fill="#fff"/>
        <path d="M30 56h120" stroke="#1e3a8a" stroke-width="0"/><path d="M42 40 90 18l48 22-48 22z" fill="var(--a,#93c5fd)"/><path d="M136 44v28" stroke="var(--a,#93c5fd)" stroke-width="4"/></g>
      <g transform="translate(300 92)" opacity=".95"><rect width="96" height="62" rx="10" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.4)"/><circle cx="24" cy="28" r="12" fill="#fff"/><rect x="44" y="20" width="40" height="6" rx="3" fill="#fff"/><rect x="44" y="34" width="28" height="6" rx="3" fill="#fff" opacity=".7"/></g>`)
  };

  /* ---- post-card covers (one per category) ---- */
  const COVER = {
    notice: '<path d="M64 120h120l-12 70H76z" fill="var(--c)" opacity=".18"/><g transform="translate(120 100)"><circle r="44" fill="var(--c)"/><path d="M-18-10 14-24v48L-18 10z" fill="#fff"/><rect x="-28" y="-10" width="11" height="20" rx="3" fill="#fff"/><path d="M24-10c10 4 10 16 0 20" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></g><circle cx="196" cy="56" r="7" fill="var(--c)" opacity=".5"/><circle cx="52" cy="60" r="5" fill="var(--c)" opacity=".4"/>',
    syllabus: '<g transform="translate(60 50)"><path d="M0 8h66a22 22 0 0 1 22 22v110a16 16 0 0 0-16-16H0z" fill="var(--c)"/><path d="M176 8h-66a22 22 0 0 0-22 22v110a16 16 0 0 1 16-16h72z" fill="var(--c)" opacity=".72"/><g stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"><path d="M16 36h48M16 56h40M16 76h46M112 36h48M112 56h38M112 76h44"/></g></g>',
    suggestion: '<g transform="translate(120 98)"><circle r="46" fill="var(--c)" opacity=".2"/><path d="M0-40a28 28 0 0 0-16 51c4 4 6 8 6 14h20c0-6 2-10 6-14A28 28 0 0 0 0-40z" fill="var(--c)"/><rect x="-14" y="28" width="28" height="8" rx="4" fill="var(--c)" opacity=".7"/><rect x="-9" y="40" width="18" height="7" rx="3.5" fill="var(--c)" opacity=".5"/><g stroke="var(--c)" stroke-width="5" stroke-linecap="round"><path d="M-52-6h-14M52-6h14M-38-36l-10-10M38-36l10-10"/></g></g>',
    routine: '<g transform="translate(58 46)"><rect width="124" height="112" rx="14" fill="var(--c)"/><rect y="0" width="124" height="30" rx="14" fill="#fff" opacity=".25"/><g fill="#fff"><rect x="16" y="46" width="20" height="16" rx="4"/><rect x="52" y="46" width="20" height="16" rx="4" opacity=".7"/><rect x="88" y="46" width="20" height="16" rx="4"/><rect x="16" y="74" width="20" height="16" rx="4" opacity=".7"/><rect x="52" y="74" width="20" height="16" rx="4"/><rect x="88" y="74" width="20" height="16" rx="4" opacity=".7"/></g><rect x="30" y="-10" width="8" height="22" rx="4" fill="var(--c)"/><rect x="86" y="-10" width="8" height="22" rx="4" fill="var(--c)"/></g>',
    result: '<g transform="translate(120 100)"><path d="M-36-50h72v36a36 36 0 0 1-72 0z" fill="var(--c)"/><path d="M-36-40h-18v10a20 20 0 0 0 20 20M36-40h18v10a20 20 0 0 1-20 20" fill="none" stroke="var(--c)" stroke-width="7" opacity=".7"/><rect x="-8" y="22" width="16" height="22" fill="var(--c)" opacity=".8"/><rect x="-28" y="44" width="56" height="12" rx="6" fill="var(--c)"/><path d="m0-34 6 12 13 2-9 9 2 13-12-6-12 6 2-13-9-9 13-2z" fill="#fff"/></g>',
    event: '<g transform="translate(120 96)"><path d="m0-52 12 34 36 2-28 22 10 35L0 21-30 41l10-35-28-22 36-2z" fill="var(--c)"/><circle cx="-62" cy="-30" r="6" fill="var(--c)" opacity=".5"/><circle cx="66" cy="30" r="8" fill="var(--c)" opacity=".4"/><path d="M60-46l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="var(--c)" opacity=".7"/></g>'
  };

  const bgDots = '<defs><pattern id="mcdots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="var(--c)" opacity=".22"/></pattern></defs><rect width="240" height="160" fill="url(#mcdots)"/>';

  window.mcArt = (k) => (HERO[k] ? HERO[k]() : '');
  /* cover(cat): 16:10 illustrated cover for a post that has no uploaded image. Colour comes from --c on the parent. */
  window.mcCover = (cat) =>
    `<svg class="cvart" viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">${bgDots}<circle cx="200" cy="150" r="70" fill="var(--c)" opacity=".1"/><circle cx="26" cy="20" r="46" fill="var(--c)" opacity=".08"/>${COVER[cat] || COVER.notice}</svg>`;

})();
