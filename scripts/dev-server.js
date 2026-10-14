// Servidor local sem dependências: serve site/ com live-reload (SSE).
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'site');
const PORT = Number(process.env.PORT) || 5173;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
  '.vcf': 'text/vcard; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
};
const LR = '<script>new EventSource("/__livereload").onmessage=function(){location.reload()};</script>';
const clients = new Set();

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/__livereload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write('retry: 800\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  let rel;
  try { rel = decodeURIComponent(url.pathname); } catch { res.writeHead(400); return res.end('Bad request'); }
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('404 Not found'); }
    const ext = path.extname(file).toLowerCase();
    if (ext === '.html') buf = Buffer.from(buf.toString('utf8').replace('</body>', LR + '</body>'));
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(buf);
  });
});

let timer;
try {
  fs.watch(ROOT, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => clients.forEach((c) => c.write('data: reload\n\n')), 120);
  });
} catch (e) { console.warn('live-reload indisponível:', e.message); }

server.listen(PORT, () => {
  console.log('\n  Diogo Petry — perfil interativo\n  http://localhost:' + PORT + '/\n  (live-reload ativo, Ctrl+C para sair)\n');
});
