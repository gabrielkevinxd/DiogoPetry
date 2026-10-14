/* Engineer view: console estilo IOS-XR. Saída em inglês; todo o conteúdo vem de window.PROFILE. */
(function () {
  var PROMPT = 'RP/0/RSP0/CPU0:dpetry#';
  var P = window.PROFILE, EN = P.i18n.en, M = P.meta;
  var out, input, root, history = [], hIdx = 0, busy = false, firstOpen = true;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');

  var SECTIONS = ['about', 'experience', 'education', 'certifications', 'skills', 'contact'];
  var TREE = {
    show: { d: 'Show profile data', c: {
      version: { d: 'Who is behind this console' },
      'running-config': { d: 'Full profile; filter with | section <name>' },
      experience: { d: 'Career history' }, education: { d: 'Education' }, certifications: { d: 'Certifications' },
      skills: { d: 'Skills by domain' }, about: { d: 'Summary' }, contact: { d: 'Contact details' },
      mpls: { d: 'MPLS information', c: { 'traffic-eng': { d: 'MPLS-TE', c: { tunnels: { d: 'LSP state of the live topology' } } } } }
    } },
    traceroute: { d: 'Trace the career path', c: { career: { d: 'Hop-by-hop, oldest to current' } } },
    ping: { d: 'Reach out', c: { contact: { d: 'Contact details' } } },
    help: { d: 'List commands' }, clear: { d: 'Clear the screen' }, exit: { d: 'Return to the recruiter view' }
  };
  var SECTION_FILTER = {}; SECTIONS.forEach(function (s) { SECTION_FILTER[s] = { d: 'Section ' + s }; });

  /* ---------- saída ---------- */
  function line(parts, cls) {
    var d = document.createElement('div'); d.className = 'cl' + (cls ? ' ' + cls : '');
    if (typeof parts === 'string') d.textContent = parts || ' ';
    else parts.forEach(function (p) {
      if (typeof p === 'string') d.appendChild(document.createTextNode(p));
      else { var a = document.createElement(p.href ? 'a' : 'span'); a.textContent = p.t; if (p.href) { a.href = p.href; if (/^http/.test(p.href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } } if (p.c) a.className = p.c; d.appendChild(a); }
    });
    out.appendChild(d);
    return d;
  }
  function print(lines) { lines.forEach(function (l) { if (Array.isArray(l) || typeof l === 'string') line(l); else line(l.p, l.c); }); scroll(); }
  function scroll() { out.scrollTop = out.scrollHeight; var s = root.querySelector('.cli-scroll'); if (s) s.scrollTop = s.scrollHeight; }
  function echo(txt) { line([{ t: PROMPT, c: 'pr' }, ' ' + txt]); }
  function wrap(text, w, indent) {
    var words = text.split(' '), lines = [], cur = '';
    words.forEach(function (x) { if ((cur + ' ' + x).trim().length > w) { lines.push(cur); cur = indent + x; } else cur = (cur ? cur + ' ' : '') + x; });
    if (cur) lines.push(cur); return lines;
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, reduce.matches ? 0 : ms); }); }

  /* ---------- geradores de conteúdo ---------- */
  function cfg(section) {
    var o = [];
    if (section === 'about') {
      o.push('!', 'about'); EN.about.forEach(function (p) { wrap(p, 86, ' ').forEach(function (l, i) { o.push(i ? ' ' + l.trim() : ' text ' + l.trim()); }); });
      o.push(' headline ' + EN.headline, '!');
    } else if (section === 'experience') {
      M.experience.forEach(function (e) {
        var t = EN.experience[e.id];
        o.push('!', 'experience ' + e.id, ' organization ' + e.org, ' role ' + t.role, ' period ' + t.period, ' location ' + t.location,
          ' mode ' + EN.ui.mode[e.mode] + ', ' + EN.ui.employment[e.employmentType]);
        t.bullets.forEach(function (b) { wrap(b, 84, '  ').forEach(function (l, i) { o.push(i ? '  ' + l.trim() : ' description ' + l.trim()); }); });
        o.push(' tech ' + t.tech.join(', '));
      });
      o.push('!');
    } else if (section === 'education') {
      M.education.forEach(function (e) {
        var t = EN.education[e.id];
        o.push('!', 'education ' + e.id, ' institution ' + e.org, ' degree ' + t.degree);
        if (t.gloss) o.push(' ! ' + t.gloss);
        o.push(' period ' + t.period);
        if (e.credentialId) o.push(' validation ' + e.credentialId);
      });
      o.push('!');
    } else if (section === 'certifications') {
      M.certifications.forEach(function (c) {
        var t = EN.certifications[c.id];
        o.push('!', 'certification ' + c.id, ' name ' + c.name + (c.number ? ' #' + c.number : ''), ' issuer ' + c.issuer, ' issued ' + t.issuedLabel);
        if (t.expiresLabel) o.push(' valid-until ' + t.expiresLabel);
        if (t.gloss) o.push(' ! ' + t.gloss);
        if (c.fullName) o.push(' ! ' + c.fullName);
      });
      o.push('!');
    } else if (section === 'skills') {
      Object.keys(EN.skills).forEach(function (k) {
        var g = EN.skills[k]; o.push('!', 'skills ' + k + '  ! ' + g.label);
        g.items.forEach(function (i) { o.push(' ' + i); });
      });
      o.push('!');
    } else if (section === 'contact') {
      o.push('!', 'contact', ' phone ' + M.phoneFormatted, ' whatsapp ' + M.whatsapp, ' linkedin ' + M.linkedin, ' country ' + M.location.country, '!');
    }
    return o;
  }

  var COMMANDS = {
    'show version': function () {
      print([
        { p: [M.name + ' — Senior Network Engineering Profile'], c: 'hl' },
        'Role                : ' + EN.title, 'Certification       : ' + M.ccieLabel + ' (Cisco)',
        'Location            : ' + M.location.country,
        'Uptime              : ' + stat('yearsExperience') + ' ' + EN.ui.statLabels.yearsExperience,
        'Employers           : ' + stat('employers') + ' across ' + stat('countries') + ' countries',
        'Certifications      : ' + stat('certifications') + ' (' + stat('ciscoCertifications') + ' Cisco, incl. 3 courses)',
        'CCNA -> CCIE        : ' + stat('ccnaToCcieMonths') + ' months',
        'Focus               : ' + EN.domains.join(' | '), 'Headline            : ' + EN.headline
      ]);
    },
    'show running-config': function (a) {
      var sec = a.filter;
      var o = ['Building configuration...', '', '!! Last configuration change by dpetry', '!'];
      (sec ? [sec] : SECTIONS).forEach(function (s) { o = o.concat(cfg(s)); });
      o.push('end'); print(o);
    },
    'show experience': function () { COMMANDS['show running-config']({ filter: 'experience' }); },
    'show education': function () { COMMANDS['show running-config']({ filter: 'education' }); },
    'show about': function () { COMMANDS['show running-config']({ filter: 'about' }); },
    'show contact': function () { COMMANDS['show running-config']({ filter: 'contact' }); },
    'show certifications': function () {
      var o = [{ p: ['Cisco path: CCNA -> CCNP -> CCIE  (' + stat('ccnaToCcieMonths') + ' months from CCNA to CCIE)'], c: 'hl' }, '',
        pad('Name', 50) + pad('Issuer', 40) + pad('Issued', 11) + 'Valid until', '-'.repeat(112)];
      M.certifications.forEach(function (c) {
        var t = EN.certifications[c.id];
        o.push(pad(c.name + (c.number ? ' #' + c.number : ''), 50) + pad(c.issuer, 40) + pad(t.issuedLabel, 11) + (t.expiresLabel || '-'));
      });
      print(o);
    },
    'show skills': function () {
      var o = [];
      Object.keys(EN.skills).forEach(function (k) { var g = EN.skills[k]; o.push({ p: [g.label], c: 'hl' }); wrap(g.items.join(' · '), 90, ' ').forEach(function (l) { o.push(' ' + l.trim()); }); o.push(''); });
      print(o);
    },
    'show mpls traffic-eng tunnels': function () {
      var T = DP.topo, down = T.downLinks();
      var st = { up: 'up', frr: 'up (FRR bypass active)', reopt: 'up (re-optimising)', unaffected: 'up', down: 'down' }[T.state];
      print([{ p: ['Name: tunnel-te1  (Destination: PE2)'], c: 'hl' }, '  Status:', '    Admin: up   Oper: ' + st,
        '  Path: ' + (T.path.length ? T.path.join(' -> ') : 'none'), '  Failed links: ' + (down.length ? down.join(', ') : 'none'), '',
        '  (illustrative topology — select a link to cut it)']);
    },
    'traceroute career': async function () {
      var list = M.experience.slice().sort(function (a, b) { return a.start < b.start ? -1 : a.start > b.start ? 1 : 0; });
      print(['Type escape sequence to abort.', 'Tracing the route to ' + M.name + ' (' + M.ccieLabel + ')', '']);
      for (var i = 0; i < list.length; i++) {
        var e = list[i], t = EN.experience[e.id];
        await sleep(280);
        print([pad(String(i + 1), 4) + pad(e.org, 22) + pad(t.role, 42) + t.period + '  [' + t.location + ']']);
      }
      await sleep(280);
      print(['', { p: ['Trace complete. Destination reached: ' + EN.experience[M.experience[0].id].role + ' @ ' + M.experience[0].org], c: 'ok' }]);
    },
    'ping contact': async function () {
      print(['Type escape sequence to abort.', 'Sending 5, 100-byte ICMP Echos to ' + M.name + ', timeout is 2 seconds:']);
      var d = line(''); var s = '';
      for (var i = 0; i < 5; i++) { await sleep(180); s += '!'; d.textContent = s; }
      await sleep(180);
      print(['', { p: ['Phone    : ', { t: M.phoneFormatted, href: 'tel:' + M.phone }] }, { p: ['WhatsApp : ', { t: M.whatsapp, href: M.whatsapp }] },
        { p: ['LinkedIn : ', { t: M.linkedin, href: M.linkedin }] }, 'Country  : ' + M.location.country]);
    },
    help: function () { listOptions(TREE, 'Available commands:'); },
    clear: function () { out.innerHTML = ''; },
    exit: function () { DP.setView('recruiter'); }
  };
  function stat(id) { return DP.stat(id); }
  function pad(s, n) { s = String(s); return s.length >= n ? s + ' ' : s + ' '.repeat(n - s.length); }

  /* ---------- parser com prefixo único (estilo IOS) ---------- */
  function matchTok(tok, children) {
    tok = tok.toLowerCase();
    var keys = Object.keys(children), exact = keys.filter(function (k) { return k === tok; });
    if (exact.length) return exact;
    return keys.filter(function (k) { return k.indexOf(tok) === 0; });
  }
  function parse(raw) {
    var parts = raw.split('|'), toks = parts[0].trim().split(/\s+/).filter(Boolean), res = { path: [], filter: null, error: null };
    var node = { c: TREE };
    for (var i = 0; i < toks.length; i++) {
      var m = node.c ? matchTok(toks[i], node.c) : [];
      if (m.length === 1) { res.path.push(m[0]); node = node.c[m[0]]; }
      else { res.error = m.length > 1 ? 'ambiguous' : 'invalid'; res.at = i; return res; }
    }
    if (parts[1] !== undefined) {
      var f = parts[1].trim().split(/\s+/).filter(Boolean);
      if (!f.length || matchTok(f[0], { section: 1 }).length !== 1) { res.error = 'invalid'; res.at = toks.length; return res; }
      var s = f[1] ? matchTok(f[1], SECTION_FILTER) : [];
      if (s.length !== 1) { res.error = f[1] ? 'invalid' : 'incomplete'; res.at = toks.length + 2; return res; }
      res.filter = s[0];
    }
    res.node = node; return res;
  }
  function listOptions(children, title) {
    var o = [title || 'Possible completions:'];
    Object.keys(children).forEach(function (k) { o.push('  ' + pad(k, 16) + children[k].d); });
    print(o);
  }
  function optionsFor(raw) {
    var toks = raw.trim().split(/\s+/).filter(Boolean), pipe = raw.indexOf('|') >= 0;
    if (pipe) return { opts: raw.trim().endsWith('section') || /\|\s*s\w*\s*$/.test(raw) ? SECTION_FILTER : { section: { d: 'Show lines of a profile section' } }, tail: '' };
    var node = { c: TREE }, partial = '';
    var trailingSpace = /\s$/.test(raw);
    for (var i = 0; i < toks.length; i++) {
      var last = i === toks.length - 1 && !trailingSpace;
      if (last) { partial = toks[i]; break; }
      var m = node.c ? matchTok(toks[i], node.c) : [];
      if (m.length !== 1) return { opts: null };
      node = node.c[m[0]];
    }
    var cands = {};
    if (node.c) Object.keys(node.c).forEach(function (k) { if (k.indexOf(partial.toLowerCase()) === 0) cands[k] = node.c[k]; });
    if (!partial && node.c && node.c['running-config'] !== undefined) cands['|'] = { d: 'Output modifier' };
    if (!node.c && !partial) cands = { '|': { d: 'Output modifier' } };
    return { opts: cands, partial: partial, running: toks.join(' ').indexOf('running') >= 0 };
  }

  /* ---------- execução ---------- */
  async function run(raw) {
    raw = raw.trim();
    if (busy) return;
    echo(raw);
    if (!raw) return;
    if (history[history.length - 1] !== raw) history.push(raw);
    hIdx = history.length;
    if (raw === '?') { listOptions(TREE); return; }
    if (/\?$/.test(raw)) { var o = optionsFor(raw.slice(0, -1)); if (o.opts && Object.keys(o.opts).length) listOptions(o.opts); else print(['% Unrecognized command']); return; }
    var r = parse(raw);
    if (r.error === 'incomplete') { print(['% Incomplete command.']); return; }
    if (r.error) { print(['% Invalid input detected at the \'^\' marker.', ' '.repeat(PROMPT.length + 1) + raw.split(/\s+/).slice(0, r.at).join(' ').replace(/./g, ' ') + (r.at ? ' ' : '') + '^', 'Type ? for the list of commands.']); return; }
    var key = r.path.join(' ');
    var fn = COMMANDS[key];
    if (!fn) { if (r.node && r.node.c) { print(['% Incomplete command. Possible completions:']); listOptions(r.node.c, ''); } else print(['% Unrecognized command']); return; }
    if (r.filter && key !== 'show running-config') { print(['% The | section filter is available on "show running-config".']); return; }
    busy = true; root.classList.add('busy');
    try { await fn(r); } finally { busy = false; root.classList.remove('busy'); scroll(); }
  }

  function canonPipe(v) {
    var pp = v.split('|'), node = { c: TREE }, L = [];
    pp[0].trim().split(/\s+/).filter(Boolean).forEach(function (tk) { var m = node.c ? matchTok(tk, node.c) : []; if (m.length === 1) { L.push(m[0]); node = node.c[m[0]]; } else { L.push(tk); node = {}; } });
    var R = pp.slice(1).join('|').trim().split(/\s+/).filter(Boolean), r0 = R[0] ? matchTok(R[0], { section: 1 }) : [], res = L.join(' ') + ' |';
    if (r0.length === 1) { res += ' section'; if (R.length > 1 || /\s$/.test(v)) { var m2 = R[1] ? matchTok(R[1], SECTION_FILTER) : []; if (m2.length === 1) return res + ' ' + m2[0] + ' '; return res + ' ' + (R[1] || ''); } return res + ' '; }
    return res + ' ' + (R[0] || '');
  }
  function complete() {
    var v = input.value;
    if (v.indexOf('|') >= 0) {
      var cv = canonPipe(v), tail = cv.split(/\s+/).filter(Boolean), cands2 = [];
      if (/section $/.test(cv) || /section\s+\S*$/.test(cv) && !/section \S+ $/.test(cv)) {
        var part = /section\s+(\S*)$/.test(cv) ? cv.match(/section\s+(\S*)$/)[1] : '';
        cands2 = Object.keys(SECTION_FILTER).filter(function (k) { return k.indexOf(part) === 0; });
        if (cands2.length === 1) { input.value = cv.replace(/section\s*\S*$/, 'section ' + cands2[0] + ' '); return; }
        if (cands2.length && cv !== v) { input.value = cv; return; } /* 1ª Tab completa `| sec` → `| section `; a 2ª lista os filtros */
        if (cands2.length) { echo(v); line(cands2.join('   '), 'dim'); scroll(); return; }
      }
      input.value = cv; return;
    }
    var o = optionsFor(v);
    if (!o.opts) return;
    var keys = Object.keys(o.opts).filter(function (k) { return k !== '|'; });
    if (!keys.length) return;
    var partial = o.partial !== undefined ? o.partial : (v.split(/\s+/).pop() || '');
    if (v.indexOf('|') >= 0) partial = (v.split(/\s+/).pop() || '').toLowerCase();
    var cands = keys.filter(function (k) { return k.indexOf(partial.toLowerCase()) === 0; });
    if (!cands.length) return;
    var base = v.slice(0, v.length - partial.length);
    if (cands.length === 1) { input.value = base + cands[0] + ' '; return; }
    var cp = cands[0]; cands.forEach(function (k) { while (k.indexOf(cp) !== 0) cp = cp.slice(0, -1); });
    if (cp.length > partial.length) input.value = base + cp;
    else { echo(v); line(cands.join('   '), 'dim'); scroll(); }
  }

  function onKey(e) {
    if (e.key === 'Enter') { e.preventDefault(); if (busy) return; var v = input.value; input.value = ''; run(v); }
    else if (e.key === 'Escape') { input.blur(); }
    else if (e.key === 'Tab') { if (e.shiftKey) return; e.preventDefault(); complete(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hIdx > 0) { hIdx--; input.value = history[hIdx]; } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (hIdx < history.length - 1) { hIdx++; input.value = history[hIdx]; } else { hIdx = history.length; input.value = ''; } }
    else if (e.key === '?') { e.preventDefault(); var v2 = input.value, o = optionsFor(v2); echo(v2 + '?'); if (o.opts && Object.keys(o.opts).length) listOptions(o.opts); else print(['% Unrecognized command']); }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); COMMANDS.clear(); }
  }

  /* ---------- montagem ---------- */
  DP.cli = {
    mount: function (container) {
      root = container;
      var S = DP.S[DP.lang] || DP.S.en;
      root.innerHTML =
        '<div class="cli" id="cli-box">' +
        '<div class="cli-bar mono" aria-hidden="true"><span class="dots"><i></i><i></i><i></i></span><span>' + PROMPT + ' · ssh dpetry@portugal</span></div>' +
        '<div class="cli-scroll" id="cli-scroll"><div class="cli-out mono" id="cli-out" role="log" aria-live="polite" aria-relevant="additions" aria-label="' + esc(S.cliLabel) + ' output"></div>' +
        '<form class="cli-form mono" id="cli-form" autocomplete="off"><label class="pr" for="cli-in" id="cli-lbl">' + PROMPT + '</label>' +
        '<input id="cli-in" type="text" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-describedby="cli-hint" aria-label="' + esc(S.cliLabel) + '"></form></div>' +
        '<p class="cli-hint mono" id="cli-hint"></p>' +
        '<div class="cli-chips" id="cli-chips"></div></div>';
      out = root.querySelector('#cli-out'); input = root.querySelector('#cli-in');
      root.querySelector('#cli-form').addEventListener('submit', function (e) { e.preventDefault(); });
      input.addEventListener('keydown', onKey);
      root.querySelector('#cli-scroll').addEventListener('click', function () { if (!getSelection().toString()) input.focus(); });
      this.relabel();
      var chips = root.querySelector('#cli-chips');
      ['?', 'show version', 'show running-config | section experience', 'show certifications', 'traceroute career', 'show skills', 'ping contact'].forEach(function (c) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'chip mono'; b.textContent = c;
        b.addEventListener('click', function (ev) { run(c); if (ev.pointerType === 'mouse') input.focus({ preventScroll: true }); });
        chips.appendChild(b);
      });
    },
    relabel: function () {
      if (!root) return;
      var S = DP.S[DP.lang] || DP.S.en;
      root.querySelector('#cli-hint').textContent = S.cliHint;
      input.setAttribute('aria-label', S.cliLabel);
    },
    open: function () {
      if (firstOpen) {
        firstOpen = false;
        print([{ p: [M.name + ' · ' + M.ccieLabel + ' · ' + EN.title], c: 'hl' }, 'Console ready. Type ? for help — or tap a command below.', '']);
      }
      setTimeout(function () { input && input.focus({ preventScroll: true }); }, 30);
    },
    run: run
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
})();
