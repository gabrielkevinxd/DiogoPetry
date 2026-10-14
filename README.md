# Diogo Petry — perfil/CV interativo

Site estático (HTML/CSS/JS puro, sem build, sem dependências) em `site/`.

## Rodar
```
npm run dev      # http://localhost:5173  (live-reload; PORT=xxxx para trocar a porta)
```
Requer Node 18+. Dá também para abrir `site/index.html` direto no navegador (file://).

## Publicar (Vercel)
O `vercel.json` já serve `site/` como saída estática (sem build, sem dependências), com `cleanUrls`, cabeçalhos de segurança e cache longo para fontes/imagens.

**(a) Vercel via GitHub**
1. Vercel → *Add New… → Project* → *Import* este repositório.
2. Framework Preset: **Other** (build/install ficam vazios; a saída vem do `vercel.json`).
3. *Deploy*. Cada push em `main` publica em produção.

**(b) Via CLI**
```
npm i -g vercel          # uma vez (não é dependência do projeto)
vercel login
npm run deploy           # produção (vercel --prod)
npm run deploy:preview   # URL de preview (vercel)
```
Ao publicar, troque em `site/index.html` o `og:image` e o `image` do JSON-LD por URLs absolutas (ex.: `https://seu-dominio/assets/img/photo.jpg`).
Outros hosts estáticos (GitHub Pages, Netlify, Cloudflare Pages) também servem: publique a pasta `site/`.

## Editar o conteúdo
Todo o texto vem de `site/data/profile.js` (`window.PROFILE`; `profile.json` é a cópia idêntica) em EN / PT-PT / PT-BR.
Textos de interface (botões, status) ficam em `site/assets/js/strings.js`.
O JSON-LD e as meta tags em `index.html` são estáticos (para crawlers): atualize-os se mudar cargo, telefone etc.
Lacunas ainda fora da página: e-mail, idiomas, disponibilidade.

## O que tem
- **Vista recrutador** (padrão) e **vista engenheiro** (console estilo IOS-XR: `?`, Tab, ↑/↓, `show version`, `show running-config | section experience`, `show certifications`, `traceroute career`, `show skills`, `ping contact`…).
- Topologia IP/MPLS viva: clique num enlace para derrubá-lo e veja o FRR/reconvergência.
- Seletor EN / PT-PT / PT-BR e tema claro/escuro (preferências em localStorage, sem cookies).
- "Baixar CV" = folha A4 ATS-friendly gerada do idioma ativo (impressão → Salvar como PDF); contato em .vcf.
- GDPR-limpo: zero cookies, zero trackers, zero requisições a terceiros (fontes self-hosted: Instrument Serif, IBM Plex Sans, JetBrains Mono — licença OFL).
- Parâmetros de URL úteis: `?lang=pt-PT&theme=dark&view=engineer`.

