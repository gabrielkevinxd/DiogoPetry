/* Diogo Petry — perfil interativo. Todo o conteúdo vem de data/profile.js (window.PROFILE). */
(function () {
  var P = window.PROFILE, M = P.meta;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var LOCMAP = { en: 'en-GB', 'pt-PT': 'pt-PT', 'pt-BR': 'pt-BR' };
  var st = { expanded: { dstelecom: true }, skill: 'all', more: false, view: 'recruiter' };
  var qs = new URLSearchParams(location.search);

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function T() { return P.i18n[DP.lang]; }
  function S() { return DP.S[DP.lang]; }
  function stat(id) { return DP.stat(id); }
  function icon(name) {
    var p = {
      phone: 'M6.6 3h3l1.4 4-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4 1.4v3A2.6 2.6 0 0 1 17.4 19C9.5 18.5 5.5 14.5 5 6.6A2.6 2.6 0 0 1 6.6 3z',
      wa: 'M4 20l1.2-4.1A8 8 0 1 1 8.2 19zM9 8.5c.3 3 2.5 5.2 5.5 5.5l1.2-1.3-1.9-1-.9.7a4 4 0 0 1-2.2-2.2l.7-.9-1-1.9z',
      in: 'M5 9h3v10H5zM6.5 4.5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4zM10 9h2.9v1.4c.5-.9 1.600-1.600 3.100-1.600 3 0 3.500 2 3.500 4.500V19h-3v-5c0-1.200 0-2.600-1.700-2.600S13 12.700 13 14v5h-3z',
      copy: 'M8 8V5.500A1.500 1.500 0 0 1 9.500 4h9A1.500 1.500 0 0 1 20 5.500v9a1.500 1.500 0 0 1-1.500 1.500H16M5.500 8h9A1.500 1.500 0 0 1 16 9.500v9a1.500 1.500 0 0 1-1.500 1.500h-9A1.500 1.500 0 0 1 4 18.500v-9A1.500 1.500 0 0 1 5.500 8z',
      mail: 'M4 6h16v12H4zM4.5 7l7.5 6 7.5-6',
      vcf: 'M5 4h10l4 4v12H5zM14 4v5h5M9 14h6M9 17h4',
      pdf: 'M12 4v11m0 0l-4-4m4 4l4-4M5 19h14',
      down: 'M6 9l6 6 6-6',
      ext: 'M14 5h5v5M19 5l-8 8M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-10A1.5 1.5 0 0 1 5 18.5v-10A1.5 1.5 0 0 1 6.5 7H10'
    }[name];
    return '<svg class="ic" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="' + p + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function dayLabel(iso) { var d = new Date(iso + 'T12:00:00'); return d.toLocaleDateString(LOCMAP[DP.lang], { day: 'numeric', month: 'long', year: 'numeric' }); }
  function expById(id) { return M.experience.filter(function (e) { return e.id === id; })[0]; }
  function certById(id) { return M.certifications.filter(function (c) { return c.id === id; })[0]; }
  function cvLink(cls) {
    var u = T().ui, s = S();
    return '<a class="btn' + (cls ? ' ' + cls : '') + '" href="' + esc(M.cv.path) + '" download="' + esc(M.cv.filename) + '" data-act="cv">' + icon('pdf') + esc(u.downloadCv) + '<span class="sr-only"> (' + esc(s.pdfNote) + ')</span></a>';
  }
  function availPill(cls) { return '<span class="avail mono ' + (cls || '') + '"><i class="pip" aria-hidden="true"></i>' + esc(T().ui.availability) + '</span>'; }
  function credLink(c, cls) {
    if (!c.credentialUrl) return '';
    var u = T().ui, s = S();
    return '<a class="cred mono' + (cls ? ' ' + cls : '') + '" href="' + esc(c.credentialUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(u.credential) + '<span class="sr-only"> — ' + esc(c.name) + ' (' + esc(s.openIn) + ')</span></a>';
  }
  var CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  var SKILLS = ['listening', 'reading', 'writing', 'spokenProduction', 'spokenInteraction'];
  function renderLanguages() {
    var t = T(), u = t.ui, s = S();
    return '<ul class="langs">' + M.languages.map(function (l) {
      var x = t.languages[l.id], body;
      if (l.native) body = '<p class="lang-native mono">' + esc(u.motherTongue) + '</p>';
      else body = '<dl class="cefr">' + SKILLS.map(function (k) {
        var lv = l.cefr[k], at = CEFR.indexOf(lv) + 1;
        return '<div><dt>' + esc(u.languageSkills[k]) + '</dt><dd><b class="lv">' + esc(lv) + '</b><span class="meter" role="img" aria-label="' + esc(s.cefrScaleLabel + ': ' + lv) + '">' +
          CEFR.map(function (c, i) { return '<i' + (i < at ? ' class="on"' : '') + '></i>'; }).join('') + '</span></dd></div>';
      }).join('') + '</dl>';
      return '<li><h3 class="lang-name">' + esc(x.name) + '</h3>' + body + '</li>';
    }).join('') + '</ul><p class="sec-note cefr-note">' + esc(u.cefrNote) + '</p>';
  }
  function sec(id, num, title, inner, cls) {
    return '<section class="sec ' + (cls || '') + '" id="' + id + '" aria-labelledby="h-' + id + '"><div class="sec-label mono" aria-hidden="true"><span>' + num + '</span></div>' +
      '<div class="sec-body"><h2 class="sec-title" id="h-' + id + '">' + esc(title) + '</h2>' + inner + '</div></section>';
  }

  /* ---------------- render: vista recrutador ---------------- */
  function renderRecruiter() {
    var t = T(), u = t.ui, s = S(), h = '';
    // Hero
    var name = M.name.split(' ');
    h += '<section class="hero" id="top" aria-labelledby="h-name">' +
      '<div class="hero-id"><span class="photo"><img src="' + esc(M.photo) + '" width="815" height="815" alt="' + esc(M.name) + '" decoding="async" fetchpriority="high"></span>' +
      '<p class="kicker mono"><span class="seal">' + esc(M.ccieLabel) + '</span><span>' + esc(M.location.country) + '</span>' + availPill('kick') + '</p></div>' +
      '<h1 class="name" id="h-name">' + name.map(function (w, i) { return '<span class="mask"><span class="rise" style="--i:' + i + '">' + esc(w) + '</span></span>'; }).join(' ') + '</h1>' +
      '<p class="role-line">' + esc(t.title) + '</p>' +
      '<p class="pitch">' + esc(t.pitch[0]) + '</p><p class="pitch sub">' + esc(t.pitch[1]) + '</p>' +
      '<ul class="domains mono" aria-label="' + esc(u.pillars) + '">' + t.domains.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' +
      '<div class="cta"><a class="btn primary" href="#contact">' + esc(u.contact) + '</a>' + cvLink() +
      '<a class="btn link" href="' + esc(M.linkedin) + '" target="_blank" rel="noopener noreferrer">' + esc(u.linkedin) + '<span class="sr-only"> (' + esc(s.openIn) + ')</span></a></div></section>';

    // Ledger de números (fonte: stats)
    var ledger = ['yearsExperience', 'employers', 'countries', 'certifications'];
    h += '<section class="ledger" aria-label="' + esc(u.highlights) + '"><dl>' + ledger.map(function (id) {
      return '<div><dt>' + esc(u.statLabels[id]) + '</dt><dd class="num" data-v="' + stat(id) + '">' + stat(id) + '</dd></div>';
    }).join('') + '</dl></section>';

    // About
    var more = st.more;
    h += sec('about', '01', u.nav.about,
      '<div class="about"><p class="lede">' + esc(t.about[0]) + '</p>' +
      '<div class="about-more' + (more ? ' open' : '') + '" id="about-more"><div>' + t.about.slice(1).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div></div>' +
      '<button type="button" class="btn link small" data-act="more" aria-expanded="' + more + '" aria-controls="about-more">' + esc(more ? u.showLess : u.showMore) + icon('down') + '</button></div>' +
      '<h3 class="mono mini">' + esc(u.highlights) + '</h3>' +
      '<ol class="highlights">' + t.highlights.map(function (x, i) { return '<li><span class="mono n">0' + (i + 1) + '</span><h4>' + esc(x.title) + '</h4><p>' + esc(x.text) + '</p></li>'; }).join('') + '</ol>' +
      '<ul class="pillars mono" aria-label="' + esc(u.pillars) + '">' + t.pillars.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>');

    // Experiência = hops
    var n = M.experience.length;
    h += sec('experience', '02', u.nav.experience,
      '<p class="sec-note">' + esc(u.sectionIntro.experience) + ' — ' + esc(s.careerNote) + '</p>' +
      '<ol class="hops" id="hops"><span class="hops-line" aria-hidden="true"><i id="hops-fill"></i></span>' + M.experience.map(function (e, i) {
        var x = t.experience[e.id], open = !!st.expanded[e.id], hop = n - i;
        return '<li class="hop' + (open ? ' open' : '') + '" data-id="' + e.id + '"><span class="hop-node" aria-hidden="true"></span>' +
          '<button type="button" class="hop-head" aria-expanded="' + open + '" aria-controls="hb-' + e.id + '" id="hh-' + e.id + '">' +
          '<span class="hop-n mono">' + esc(s.hop) + ' ' + String(hop).padStart(2, '0') + (i === 0 ? ' · ' + esc(u.present) : '') + '</span>' +
          '<span class="hop-org">' + esc(e.org) + '</span><span class="hop-role">' + esc(x.role) + '</span>' +
          '<span class="hop-meta mono">' + esc(x.period) + ' · ' + esc(x.location) + '</span>' + icon('down') + '</button>' +
          '<div class="hop-body" id="hb-' + e.id + '" role="region" aria-labelledby="hh-' + e.id + '"' + (open ? '' : ' inert') + '><div>' +
          '<ul class="bullets">' + x.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
          '<p class="hop-tags mono"><span>' + esc(u.mode[e.mode]) + '</span><span>' + esc(u.employment[e.employmentType]) + '</span>' + x.tech.map(function (k) { return '<span class="tech">' + esc(k) + '</span>'; }).join('') + '</p>' +
          '</div></div></li>';
      }).join('') + '</ol>');

    // Certificações
    var trail = ['ccna', 'ccnp-enarsi', 'ccnp-encor', 'ccnp-ent'], ccie = certById('ccie'), cc = t.certifications.ccie;
    var others = ['uminho-exec', 'mpls-huawei', 'ccna-itn', 'ccna-srwe', 'intro-cyber'];
    h += sec('certifications', '03', u.nav.certifications,
      '<p class="sec-note">' + esc(u.sectionIntro.certifications) + '</p>' +
      '<div class="trailwrap"><ol class="trail">' + trail.map(function (id, i) {
        var c = certById(id), x = t.certifications[id];
        return '<li><span class="t-dot" aria-hidden="true"></span><span class="t-name">' + esc(c.name) + '</span><span class="t-date mono">' + esc(x.issuedLabel) + '</span>' +
          (c.fullName ? '<span class="t-full">' + esc(c.fullName) + '</span>' : '') + '<span class="t-until mono">' + esc(u.validUntil) + ' ' + esc(x.expiresLabel) + '</span>' + credLink(c) + '</li>';
      }).join('') + '</ol>' +
      '<div class="crown"><p class="mono crown-k">' + esc(s.crownKicker) + ' · ' + esc(ccie.issuer) + '</p>' +
      '<p class="crown-name">CCIE</p><p class="crown-no mono">#' + esc(ccie.number) + '</p>' +
      '<p class="crown-meta mono">' + esc(u.issued) + ' ' + esc(dayLabel(ccie.issuedDay)) + ' · ' + esc(u.validUntil) + ' ' + esc(cc.expiresLabel) + '</p>' +
      credLink(ccie, 'on-dark') + '<p class="crown-stat"><b class="num" data-v="' + stat('ccnaToCcieMonths') + '">' + stat('ccnaToCcieMonths') + '</b><span>' + esc(u.statLabels.ccnaToCcieMonths) + '</span></p></div></div>' +
      '<h3 class="mono mini">' + esc(s.otherCreds) + '</h3>' +
      '<ul class="ledger-rows">' + others.map(function (id) {
        var c = certById(id), x = t.certifications[id];
        return '<li><div><span class="r-name">' + esc(c.name) + '</span>' + (x.gloss ? '<span class="r-gloss">' + esc(x.gloss) + '</span>' : '') + credLink(c) + '</div><span class="r-iss">' + esc(c.issuer) + '</span><span class="r-date mono">' + esc(x.issuedLabel) + '</span></li>';
      }).join('') + '</ul>' +
      '<p class="verify"><a class="btn link small" href="' + esc(M.credly) + '" target="_blank" rel="noopener noreferrer">' + esc(u.verifyCredly) + icon('ext') + '<span class="sr-only"> (' + esc(s.openIn) + ')</span></a></p>');

    // Competências
    var keys = ['routing', 'l2', 'assurance', 'vendors', 'infra'];
    h += sec('skills', '04', u.nav.skills,
      '<div class="chips" role="group" aria-label="' + esc(u.skillsFilter) + '"><button type="button" class="chip mono" data-skill="all" aria-pressed="' + (st.skill === 'all') + '">' + esc(u.filterAll) + '</button>' +
      keys.map(function (k) { return '<button type="button" class="chip mono" data-skill="' + k + '" aria-pressed="' + (st.skill === k) + '">' + esc(t.skills[k].label) + '</button>'; }).join('') + '</div>' +
      '<div class="skillgrid">' + keys.map(function (k) {
        var g = t.skills[k];
        return '<section class="sk' + (k === 'vendors' ? ' vendors' : '') + '" data-group="' + k + '"' + (st.skill !== 'all' && st.skill !== k ? ' hidden' : '') + ' aria-label="' + esc(g.label) + '"><h3 class="mono">' + esc(g.label) + '</h3><ul>' +
          g.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></section>';
      }).join('') + '</div>');

    // Formação
    h += sec('education', '05', u.nav.education,
      '<ul class="ledger-rows edu">' + M.education.map(function (e) {
        var x = t.education[e.id];
        return '<li><div><span class="r-name">' + esc(x.degree) + '</span>' + (x.gloss ? '<span class="r-gloss">' + esc(x.gloss) + '</span>' : '') +
          (e.credentialId ? '<span class="r-gloss mono">' + esc(e.credentialId) + '</span>' : '') + '</div><span class="r-iss">' + esc(e.org) + ' · ' + esc(x.location) + '</span><span class="r-date mono">' + esc(x.period) + '</span></li>';
      }).join('') + '</ul>');

    // Idiomas
    h += sec('languages', '06', u.nav.languages, renderLanguages());

    // Contato
    h += sec('contact', '07', u.nav.contact,
      '<p class="contact-lead">' + esc(s.contactLead) + '</p>' + '<p class="contact-note">' + esc(s.contactNote) + '</p>' + availPill() +
      '<a class="phone" href="tel:' + esc(M.phone) + '" aria-label="' + esc(s.callAria + ' ' + M.phoneFormatted) + '">' + esc(M.phoneFormatted) + '</a>' +
      '<a class="mail" href="mailto:' + esc(M.email) + '" aria-label="' + esc(s.mailAria + ' ' + M.email) + '">' + esc(M.email) + '</a>' +
      '<p class="mono mini loc">' + esc(u.location) + ' · ' + esc(M.location.country) + '</p>' +
      '<div class="cta wrap"><a class="btn primary" href="tel:' + esc(M.phone) + '">' + icon('phone') + esc(u.phone) + '</a>' +
      '<a class="btn" href="' + esc(M.whatsapp) + '" target="_blank" rel="noopener noreferrer">' + icon('wa') + esc(u.whatsapp) + '<span class="sr-only"> (' + esc(s.openIn) + ')</span></a>' +
      '<a class="btn" href="mailto:' + esc(M.email) + '">' + icon('mail') + esc(u.email) + '</a>' +
      '<a class="btn" href="' + esc(M.linkedin) + '" target="_blank" rel="noopener noreferrer">' + icon('in') + esc(u.linkedin) + '<span class="sr-only"> (' + esc(s.openIn) + ')</span></a>' +
      '<button type="button" class="btn" data-act="copy">' + icon('copy') + '<span id="copy-lbl">' + esc(u.copyNumber) + '</span></button>' +
      '<button type="button" class="btn" data-act="vcf">' + icon('vcf') + esc(s.downloadVcf) + '</button>' +
      cvLink() + '</div>', 'contact');

    $('#view-recruiter').innerHTML = h;
    observeContent();
  }

  /* ---------------- render: CV de impressão (A4, ATS) ---------------- */
  function renderPrint() {
    var t = T(), u = t.ui, s = S(), h = '';
    h += '<h1>' + esc(M.name) + '</h1><p class="p-title">' + esc(t.title) + ' · ' + esc(M.ccieLabel) + '</p>';
    h += '<p class="p-contact">' + esc(M.phoneFormatted) + ' · ' + esc(M.email) + ' · ' + esc(M.linkedin.replace(/^https?:\/\//, '')) + ' · ' + esc(M.location.country) + ' · ' + esc(u.availability) + '</p>';
    h += '<p class="p-head">' + esc(t.headline) + '</p>';
    h += '<h2>' + esc(s.summary) + '</h2>' + t.about.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    h += '<h2>' + esc(u.nav.experience) + '</h2>' + M.experience.map(function (e) {
      var x = t.experience[e.id];
      return '<div class="p-item"><h3>' + esc(x.role) + ' — ' + esc(e.org) + '</h3><p class="p-meta">' + esc(x.period) + ' · ' + esc(x.location) + ' · ' + esc(u.mode[e.mode]) + ' · ' + esc(u.employment[e.employmentType]) + '</p><ul>' +
        x.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul><p class="p-meta">' + esc(x.tech.join(', ')) + '</p></div>';
    }).join('');
    h += '<h2>' + esc(u.nav.certifications) + '</h2><ul class="p-block">' + M.certifications.map(function (c) {
      var x = t.certifications[c.id];
      return '<li><strong>' + esc(c.name + (c.number ? ' #' + c.number : '')) + '</strong> — ' + esc(c.issuer) + ' · ' + esc(x.issuedLabel) + (x.expiresLabel ? ' · ' + esc(u.validUntil) + ' ' + esc(x.expiresLabel) : '') + (x.gloss ? ' (' + esc(x.gloss) + ')' : '') + '</li>';
    }).join('') + '</ul>';
    h += '<h2>' + esc(u.nav.education) + '</h2><ul class="p-block">' + M.education.map(function (e) {
      var x = t.education[e.id];
      return '<li><strong>' + esc(x.degree) + '</strong> — ' + esc(e.org) + ' · ' + esc(x.period) + (x.gloss ? ' (' + esc(x.gloss) + ')' : '') + '</li>';
    }).join('') + '</ul>';
    h += '<h2>' + esc(u.nav.languages) + '</h2><ul class="p-block">' + M.languages.map(function (l) {
      var x = t.languages[l.id];
      return '<li><strong>' + esc(x.name) + '</strong> — ' + (l.native ? esc(u.motherTongue) : SKILLS.map(function (k) { return esc(u.languageSkills[k]) + ' ' + l.cefr[k]; }).join(' · ')) + '</li>';
    }).join('') + '</ul>';
    h += '<h2>' + esc(u.nav.skills) + '</h2>' + Object.keys(t.skills).map(function (k) { var g = t.skills[k]; return '<p><strong>' + esc(g.label) + ':</strong> ' + esc(g.items.join(', ')) + '</p>'; }).join('');
    $('#print-cv').innerHTML = h;
  }

  /* ---------------- chrome: controles, status bar, HUD ---------------- */
  var NAV = ['about', 'experience', 'certifications', 'skills', 'education', 'languages', 'contact'];
  function renderChrome() {
    var t = T(), s = S();
    document.documentElement.lang = DP.lang;
    $('#skip').textContent = s.skip;
    $('#seg-view').setAttribute('aria-label', s.viewLabel);
    $('#seg-view [data-view=recruiter]').textContent = s.viewRecruiter; $('#seg-view [data-view=engineer]').textContent = s.viewEngineer;
    $('#seg-lang').setAttribute('aria-label', s.langLabel);
    $('#theme-btn').setAttribute('aria-label', s.themeLabel + ' (' + (document.documentElement.dataset.theme === 'dark' ? s.themeLight : s.themeDark) + ')');
    $$('#seg-lang [data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === DP.lang); });
    $$('#seg-view [data-view]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.view === st.view); });
    $('#plane-hint').textContent = s.topoHint; $('#restore-links').textContent = s.restore;
    $('#topo').setAttribute('aria-label', s.topoAria);
    $('#plane').setAttribute('aria-label', s.plane);
    $('#sb-nav').innerHTML = st.view === 'engineer' ? '<li class="help">' + esc(s.sbHelp) + '</li>' :
      NAV.map(function (id) { return '<li><a href="#' + id + '" data-sec="' + id + '">' + esc(t.ui.nav[id]) + '</a></li>'; }).join('');
    $('#foot').innerHTML = '<p>' + esc(t.ui.footer) + ' · ' + esc(s.privacy) + '</p><a href="#top" class="mono">↑ ' + esc(s.top) + '</a>';
    document.title = M.name + ' — ' + t.title + ' · ' + M.ccieLabel;
    var d = document.querySelector('meta[name=description]'); if (d) d.setAttribute('content', t.pitch[0]);
    $('#statusbar').setAttribute('aria-label', s.sections); $('#view-engineer').setAttribute('aria-label', s.consoleLabel);
    DP.topo.refreshLabels(); lspText(DP.topo.state, DP.topo.path);
    if (DP.cli) DP.cli.relabel();
    activeSec && setActive(activeSec);
  }
  var activeSec = null;
  function setActive(id) {
    activeSec = id;
    $$('#sb-nav a').forEach(function (a) {
      if (a.dataset.sec === id) { a.setAttribute('aria-current', 'location'); var nv = $('#sb-nav'); if (nv.scrollWidth > nv.clientWidth) nv.scrollLeft += (a.getBoundingClientRect().left - nv.getBoundingClientRect().left) - (nv.clientWidth - a.offsetWidth) / 2; }
      else a.removeAttribute('aria-current');
    });
  }
  function lspText(state, path) {
    var s = S();
    var txt = { up: s.lspUp, frr: s.lspFrr, reopt: s.lspReopt, down: s.lspDown, unaffected: s.lspUnaffected }[state];
    $('#lsp-state-text').textContent = txt; $('#sb-lsp').textContent = txt;
    $('#path-line').textContent = path.length ? path.join(' → ') : '—';
    var cls = state === 'frr' || state === 'down' ? state : state === 'reopt' ? 'reopt' : 'up';
    ['lsp-state', 'sb-left'].forEach(function (id) { var e = $('#' + id); e.dataset.state = cls; });
  }

  /* ---------------- ações ---------------- */
  function vcard() {
    var t = T();
    var L = ['BEGIN:VCARD', 'VERSION:3.0', 'N:Petry;Diogo;;;', 'FN:' + M.name, 'TITLE:' + t.title, 'TEL;TYPE=CELL:' + M.phone, 'EMAIL;TYPE=INTERNET:' + M.email, 'URL:' + M.linkedin, 'ADR;TYPE=WORK:;;;;;;' + M.location.country, 'NOTE:' + M.ccieLabel, 'END:VCARD'];
    return L.join('\r\n') + '\r\n';
  }
  function download(name, mime, text) {
    var a = document.createElement('a'), url = URL.createObjectURL(new Blob([text], { type: mime }));
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 500);
  }
  function copy(text) {
    function fb() { var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); return Promise.resolve(); }
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(fb);
    return fb();
  }
  DP.downloadCv = function () {
    var a = document.createElement('a'); a.href = M.cv.path; a.download = M.cv.filename; a.hidden = true;
    document.body.appendChild(a); a.click(); a.remove();
  };
  DP.print = function () {
    var old = document.title; document.title = M.name + ' — CV';
    var back = function () { document.title = old; window.removeEventListener('afterprint', back); };
    window.addEventListener('afterprint', back);
    window.print();
  };
  function onRecruiterClick(e) {
    var t = T(), b;
    if ((b = e.target.closest('.hop-head'))) {
      var li = b.closest('.hop'), id = li.dataset.id, open = !li.classList.contains('open');
      li.classList.toggle('open', open); st.expanded[id] = open; b.setAttribute('aria-expanded', open);
      var body = $('#hb-' + id); if (open) body.removeAttribute('inert'); else body.setAttribute('inert', '');
      requestAnimationFrame(hopProgress);
    } else if ((b = e.target.closest('[data-act]'))) {
      var a = b.dataset.act;
      if (a === 'print') DP.print();
      else if (a === 'vcf') download('Diogo-Petry.vcf', 'text/vcard;charset=utf-8', vcard());
      else if (a === 'copy') copy(M.phone).then(function () {
        var l = $('#copy-lbl'); l.textContent = t.ui.copied; $('#announce').textContent = S().copiedAnnounce;
        setTimeout(function () { var l2 = $('#copy-lbl'); if (l2) l2.textContent = T().ui.copyNumber; }, 1800);
      });
      else if (a === 'more') {
        st.more = !st.more; var box = $('#about-more'); box.classList.toggle('open', st.more);
        b.setAttribute('aria-expanded', st.more); b.firstChild.textContent = st.more ? t.ui.showLess : t.ui.showMore;
        b.classList.toggle('flip', st.more);
      }
    } else if ((b = e.target.closest('[data-skill]'))) {
      st.skill = b.dataset.skill;
      $$('[data-skill]').forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.skill === st.skill); });
      $$('.sk').forEach(function (g) { g.hidden = st.skill !== 'all' && g.dataset.group !== st.skill; });
    }
  }

  /* ---------------- idioma, tema, vista ---------------- */
  function detectLang() {
    var q = qs.get('lang'); if (q && P.meta.locales.indexOf(q) >= 0) return q;
    var s = store('dp.lang'); if (s && P.meta.locales.indexOf(s) >= 0) return s;
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < langs.length; i++) {
      var l = String(langs[i]).toLowerCase();
      if (l === 'pt-br') return 'pt-BR';
      if (l === 'pt-pt' || l === 'pt') return 'pt-PT';
      if (l.indexOf('pt') === 0) return 'pt-PT';
      if (l.indexOf('en') === 0) return 'en';
    }
    return 'en';
  }
  DP.setLang = function (lang, persist) {
    DP.lang = lang; if (persist) store('dp.lang', lang);
    renderRecruiter(); renderPrint(); renderChrome();
  };
  function setTheme(th, persist) {
    document.documentElement.dataset.theme = th; if (persist) store('dp.theme', th);
    $('#theme-btn').setAttribute('aria-pressed', th === 'dark');
    var s = S(); $('#theme-btn').setAttribute('aria-label', s.themeLabel + ' (' + (th === 'dark' ? s.themeLight : s.themeDark) + ')');
  }
  DP.setView = function (v) {
    st.view = v; document.documentElement.dataset.view = v;
    $('#view-recruiter').hidden = v === 'engineer'; $('#view-engineer').hidden = v !== 'engineer';
    if (v === 'engineer') DP.cli.open();
    renderChrome(); window.scrollTo({ top: 0 });
    if (v === 'recruiter') { observeContent(); }
  };

  /* ---------------- observadores / scroll ---------------- */
  var secObs, numObs, ticking = false;
  function observeContent() {
    if (secObs) secObs.disconnect(); if (numObs) numObs.disconnect();
    if ('IntersectionObserver' in window) {
      secObs = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) setActive(x.target.id); }); }, { rootMargin: '-35% 0px -55% 0px' });
      $$('#view-recruiter .sec').forEach(function (e) { secObs.observe(e); });
      numObs = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { countUp(x.target); numObs.unobserve(x.target); } }); }, { threshold: 0.6 });
      $$('.num').forEach(function (e) { numObs.observe(e); });
    }
    hopProgress();
  }
  function countUp(e) {
    var v = +e.dataset.v;
    if (reduce.matches) return;
    var t0 = performance.now(), D = 900;
    (function f(t) { var k = Math.min(1, (t - t0) / D), ease = 1 - Math.pow(1 - k, 3); e.textContent = Math.round(v * ease); if (k < 1) requestAnimationFrame(f); else e.textContent = v; })(t0);
  }
  function hopProgress() {
    var box = $('#hops'), fill = $('#hops-fill'); if (!box || !fill) return;
    var r = box.getBoundingClientRect(), vh = innerHeight, p = (vh * 0.6 - r.top) / r.height;
    fill.style.transform = 'scaleY(' + Math.max(0, Math.min(1, p)) + ')';
  }
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var max = document.documentElement.scrollHeight - innerHeight;
      $('#sb-progress').style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
      hopProgress();
    });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    var th = document.documentElement.dataset.theme;
    DP.lang = detectLang();
    DP.topo.onState = lspText;
    DP.topo.init();
    DP.cli.mount($('#view-engineer'));
    DP.setLang(DP.lang, false);
    setTheme(th, false);
    $('#view-recruiter').addEventListener('click', onRecruiterClick);
    $$('#seg-lang [data-lang]').forEach(function (b) { b.addEventListener('click', function () { DP.setLang(b.dataset.lang, true); }); });
    $$('#seg-view [data-view]').forEach(function (b) { b.addEventListener('click', function () { DP.setView(b.dataset.view); }); });
    $('#theme-btn').addEventListener('click', function () { setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true); });
    $('#restore-links').addEventListener('click', function () { DP.topo.restore(); });
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll);
    if (qs.get('view') === 'engineer') DP.setView('engineer');
    if (matchMedia('(prefers-color-scheme: dark)').addEventListener) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) { if (!store('dp.theme')) setTheme(e.matches ? 'dark' : 'light', false); });
    onScroll();
    document.documentElement.classList.add('ready');
  }
  boot();
})();
