// Sem dependências: grava em site/index.html um ?v=<hash curto> em CSS, JS e data/profile.js.
// O hash vem do conteúdo (finais de linha normalizados), então cada deploy com mudança invalida o cache.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SITE = path.resolve(__dirname, '..', 'site');
const INDEX = path.join(SITE, 'index.html');
const ASSET = /((?:href|src)="(?:assets\/(?:css|js)\/[^"?]+|data\/[^"?]+\.js))(?:\?v=[^"]*)?"/g;

let html = fs.readFileSync(INDEX, 'utf8');
const files = [...new Set([...html.matchAll(ASSET)].map((m) => m[1].replace(/^(?:href|src)="/, '')))].sort();
if (!files.length) { console.error('stamp: nenhuma referência a CSS/JS encontrada em site/index.html'); process.exit(1); }

const h = crypto.createHash('sha1');
for (const f of files) h.update(f + '\0').update(fs.readFileSync(path.join(SITE, f), 'utf8').replace(/\r\n/g, '\n'));
const v = h.digest('hex').slice(0, 8);

html = html.replace(ASSET, (_, ref) => ref + '?v=' + v + '"');
fs.writeFileSync(INDEX, html);
console.log('stamp: v=' + v + ' em ' + files.length + ' arquivos\n  ' + files.join('\n  '));
