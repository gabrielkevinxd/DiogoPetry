/* Topologia IP/MPLS ilustrativa: LSP primário, enlaces clicáveis, FRR + reconvergência.
   Ilustração genérica — não representa a rede de nenhum empregador. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var NODES = {
    PE1: { x: 52, y: 270, pe: true }, P1: { x: 160, y: 120 }, P2: { x: 160, y: 270 }, P3: { x: 160, y: 420 },
    P4: { x: 322, y: 150 }, P6: { x: 300, y: 270 }, P5: { x: 322, y: 390 }, PE2: { x: 428, y: 270, pe: true }
  };
  var LINKS = [
    ['PE1', 'P1', 2], ['PE1', 'P2', 2], ['PE1', 'P3', 3], ['P1', 'P2', 1], ['P2', 'P3', 1], ['P1', 'P4', 2],
    ['P2', 'P6', 1], ['P3', 'P5', 2], ['P4', 'P6', 1], ['P6', 'P5', 1], ['P4', 'PE2', 2], ['P6', 'PE2', 2], ['P5', 'PE2', 2]
  ].map(function (l, i) { return { id: i, a: l[0], b: l[1], w: l[2], down: false }; });
  var SRC = 'PE1', DST = 'PE2', SPEED = 150;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');

  var T = (DP.topo = { state: 'up', path: [], onState: null });
  var burstUntil = 0, svg, linkEls = {}, nodeEls = {}, packetLayer, pathEl, timers = [], packets = [], raf = 0, last = 0, visible = true, spawnAcc = 0;

  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function linkBetween(a, b) {
    for (var i = 0; i < LINKS.length; i++) { var l = LINKS[i]; if ((l.a === a && l.b === b) || (l.a === b && l.b === a)) return l; }
  }
  function neighbors(n) {
    var r = [];
    LINKS.forEach(function (l) { if (l.down) return; if (l.a === n) r.push([l.b, l.w]); else if (l.b === n) r.push([l.a, l.w]); });
    return r;
  }
  function sp(from, to) {
    var dist = {}, prev = {}, done = {}, n;
    Object.keys(NODES).forEach(function (k) { dist[k] = Infinity; });
    dist[from] = 0;
    for (;;) {
      n = null;
      Object.keys(NODES).forEach(function (k) { if (!done[k] && dist[k] < Infinity && (n === null || dist[k] < dist[n])) n = k; });
      if (n === null || n === to) break;
      done[n] = true;
      neighbors(n).forEach(function (nb) { var d = dist[n] + nb[1]; if (d < dist[nb[0]]) { dist[nb[0]] = d; prev[nb[0]] = n; } });
    }
    if (dist[to] === Infinity) return null;
    var p = [to];
    while (p[0] !== from) p.unshift(prev[p[0]]);
    return p;
  }
  function pathUsesLink(path, l) {
    for (var i = 0; i < path.length - 1; i++) if (linkBetween(path[i], path[i + 1]) === l) return i;
    return -1;
  }
  function labelFor(a, b) { return 16000 + ((linkBetween(a, b).id * 37 + b.charCodeAt(b.length - 1) * 11) % 800); }

  function build() {
    svg = document.getElementById('topo');
    svg.innerHTML = '';
    var defs = el('defs', {}, svg);
    var glow = el('filter', { id: 'glow', filterUnits: 'userSpaceOnUse', x: 0, y: 60, width: 480, height: 420 }, defs); /* userSpaceOnUse: em objectBoundingBox um caminho todo horizontal tem bbox de altura 0 e o filtro apaga a linha */
    el('feGaussianBlur', { stdDeviation: '3', result: 'b' }, glow);
    var m = el('feMerge', {}, glow); el('feMergeNode', { in: 'b' }, m); el('feMergeNode', { in: 'SourceGraphic' }, m);

    var linkLayer = el('g', { class: 'links' }, svg);
    pathEl = el('polyline', { class: 'lsp-path', fill: 'none', points: '' }, svg);
    LINKS.forEach(function (l) {
      var A = NODES[l.a], B = NODES[l.b];
      var g = el('g', { class: 'link', tabindex: '0', role: 'button', 'data-link': l.id }, linkLayer);
      el('line', { class: 'hit', x1: A.x, y1: A.y, x2: B.x, y2: B.y }, g);
      el('line', { class: 'wire', x1: A.x, y1: A.y, x2: B.x, y2: B.y }, g);
      var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
      var x = el('g', { class: 'cut-mark', transform: 'translate(' + mx + ' ' + my + ')' }, g);
      el('circle', { r: 8 }, x);
      el('path', { d: 'M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5' }, x);
      g.addEventListener('click', function () { toggle(l); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(l); } });
      linkEls[l.id] = g;
    });
    packetLayer = el('g', { class: 'packets', 'aria-hidden': 'true' }, svg);
    Object.keys(NODES).forEach(function (k) {
      var n = NODES[k];
      var g = el('g', { class: 'node' + (n.pe ? ' pe' : ''), transform: 'translate(' + n.x + ' ' + n.y + ')', 'aria-hidden': 'true' }, svg);
      if (n.pe) el('rect', { x: -17, y: -13, width: 34, height: 26, rx: 5 }, g); else el('circle', { r: 11 }, g);
      el('text', { class: 'nlabel', y: 3.5, 'text-anchor': 'middle' }, g).textContent = k;
      nodeEls[k] = g;
    });
    svg.appendChild(packetLayer); /* pacotes por cima dos nós: rótulo nunca fica cortado */
    refreshLabels();
  }

  function refreshLabels() {
    var S = DP.S[DP.lang] || DP.S.en;
    LINKS.forEach(function (l) {
      var g = linkEls[l.id];
      if (!g) return;
      g.setAttribute('aria-label', S.linkAria.replace('{a}', l.a).replace('{b}', l.b).replace('{s}', l.down ? S.linkCut : S.linkOk));
      g.setAttribute('aria-pressed', l.down ? 'true' : 'false');
      g.classList.toggle('down', l.down);
    });
  }

  function drawPath() {
    if (!T.path.length) { pathEl.setAttribute('points', ''); }
    else pathEl.setAttribute('points', T.path.map(function (n) { return NODES[n].x + ',' + NODES[n].y; }).join(' '));
    Object.keys(nodeEls).forEach(function (k) { nodeEls[k].classList.toggle('on', T.path.indexOf(k) >= 0); });
    LINKS.forEach(function (l) { linkEls[l.id].classList.toggle('on', pathUsesLink(T.path, l) >= 0); });
  }
  function setState(s) { T.state = s; if (T.onState) T.onState(s, T.path); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function settle(from) { timers.push(setTimeout(function () { if (T.state === from) setState('up'); }, 1300)); }

  function toggle(l) {
    l.down = !l.down;
    var g = linkEls[l.id];
    g.classList.add('flash');
    setTimeout(function () { g.classList.remove('flash'); }, 700);
    refreshLabels();
    clearTimers();
    var instant = reduce.matches;
    burst();
    if (l.down) {
      var idx = pathUsesLink(T.path, l);
      reroutePackets(l);
      if (idx < 0) {
        var np = sp(SRC, DST);
        if (np && (T.state === 'frr' || T.state === 'reopt')) { /* reconvergência em curso: não saltar para o melhor caminho antes do tempo */
          var cur = T.state;
          timers.push(setTimeout(function () { T.path = np; drawPath(); setState('reopt'); settle('reopt'); }, cur === 'frr' ? 1500 : 600));
          return;
        }
        T.path = np || []; drawPath();
        setState(np ? 'unaffected' : 'down');
        timers.push(setTimeout(function () { if (T.state === 'unaffected') setState('up'); }, 2400));
        return;
      }
      var plr = T.path[idx], rep = sp(plr, DST);
      if (!rep) { T.path = []; drawPath(); setState('down'); return; }
      T.path = T.path.slice(0, idx).concat(rep);
      drawPath(); setState('frr');
      timers.push(setTimeout(function () {
        var best = sp(SRC, DST);
        T.path = best || []; drawPath(); setState(best ? 'reopt' : 'down');
        if (best) settle('reopt');
      }, instant ? 1200 : 1500));
    } else {
      var best2 = sp(SRC, DST);
      if (!best2) { setState('down'); return; }
      var changed = best2.join() !== T.path.join();
      timers.push(setTimeout(function () {
        T.path = best2; drawPath(); setState(changed ? 'reopt' : 'up');
        if (changed) settle('reopt');
      }, changed && !instant ? 900 : 0));
    }
  }
  T.restore = function () {
    var any = LINKS.some(function (l) { return l.down; });
    LINKS.forEach(function (l) { l.down = false; });
    refreshLabels(); clearTimers(); burst();
    var best = sp(SRC, DST), changed = best.join() !== T.path.join();
    T.path = best; drawPath(); setState(any && changed ? 'reopt' : 'up');
    if (any && changed) settle('reopt');
  };
  T.downLinks = function () { return LINKS.filter(function (l) { return l.down; }).map(function (l) { return l.a + '-' + l.b; }); };
  T.toggleByName = function (a, b) { var l = linkBetween(a, b); if (l) toggle(l); return !!l; };
  T.refreshLabels = refreshLabels;
  T.nodes = Object.keys(NODES);

  /* ---- pacotes ---- */
  function mkPacket(route) {
    var g = el('g', { class: 'pkt' }, packetLayer);
    el('rect', { x: -17, y: -7, width: 34, height: 14, rx: 3 }, g);
    var t = el('text', { y: 3, 'text-anchor': 'middle' }, g);
    var p = { g: g, t: t, route: route, seg: 0, d: 0, dead: 0 };
    setLabel(p);
    g.setAttribute('transform', pos(p));
    packets.push(p);
  }
  function setLabel(p) { var a = p.route[p.seg], b = p.route[p.seg + 1]; if (b) p.t.textContent = labelFor(a, b); }
  function reroutePackets(down) {
    packets.forEach(function (p) {
      if (p.dead) return;
      for (var i = p.seg; i < p.route.length - 1; i++) {
        if (linkBetween(p.route[i], p.route[i + 1]) !== down) continue;
        if (i === p.seg) {
          p.dead = 1; p.g.classList.add('lost'); p.g.style.opacity = 0;
          setTimeout(function () { p.g.remove(); }, 700);
          return;
        }
        var rr = sp(p.route[p.seg + 1], DST);
        if (!rr) { p.dead = 1; p.g.remove(); return; }
        p.route = p.route.slice(0, p.seg + 1).concat(rr);
        return;
      }
    });
  }
  function pos(p) {
    var A = NODES[p.route[p.seg]], B = NODES[p.route[p.seg + 1]];
    var len = Math.hypot(B.x - A.x, B.y - A.y), t = Math.min(1, p.d / len);
    var k = Math.min(1, Math.min(p.d, len - p.d) / 22); p.g.style.opacity = Math.max(0, k * k * (3 - 2 * k)); /* some perto dos nós: rótulo nunca cobre o nome do roteador */
    return 'translate(' + (A.x + (B.x - A.x) * t) + ' ' + (A.y + (B.y - A.y) * t) + ')';
  }
  /* reduced-motion: nenhum pacote em movimento (respeita a preferência); só o caminho destacado e o texto de estado mudam */
  function burst() { if (reduce.matches) return; burstUntil = performance.now() + 3600; spawnAcc = 1; start(); }
  function active() { return visible && !document.hidden && (!reduce.matches || performance.now() < burstUntil || packets.length > 0); }
  function tick(ts) {
    raf = 0;
    if (!active()) { last = 0; return; }
    var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
    var spawning = !reduce.matches || performance.now() < burstUntil;
    spawnAcc += dt;
    if (spawning && spawnAcc > 0.85 && T.path.length > 1 && T.state !== 'down') { spawnAcc = 0; mkPacket(T.path.slice()); }
    packets = packets.filter(function (p) {
      if (p.dead) return false;
      p.d += SPEED * dt;
      for (;;) {
        var A = NODES[p.route[p.seg]], B = NODES[p.route[p.seg + 1]];
        var len = Math.hypot(B.x - A.x, B.y - A.y);
        if (p.d < len) break;
        p.d -= len; p.seg++;
        if (p.seg >= p.route.length - 1) { p.g.remove(); return false; }
        setLabel(p);
      }
      p.g.setAttribute('transform', pos(p));
      return true;
    });
    raf = requestAnimationFrame(tick);
  }
  function start() { if (!raf && active()) { last = 0; raf = requestAnimationFrame(tick); } }

  T.init = function () {
    build();
    T.path = sp(SRC, DST); drawPath(); setState('up');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) start(); }, { threshold: 0.01 }).observe(document.getElementById('plane'));
    }
    document.addEventListener('visibilitychange', start);
    var rm = function () { if (reduce.matches) { packets.forEach(function (p) { p.g.remove(); }); packets = []; last = 0; } else { burstUntil = 0; start(); } };
    if (reduce.addEventListener) reduce.addEventListener('change', rm); else reduce.addListener(rm);
    if (!reduce.matches) { mkPacket(T.path.slice()); start(); }
  };
})();
