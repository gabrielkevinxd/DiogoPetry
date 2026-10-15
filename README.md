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

## Versionar assets (cache)
Hosts sem `vercel.json` (ex.: nginx no Coolify) não enviam `Cache-Control`, e o navegador pode reutilizar CSS/JS antigos.
Antes de cada deploy, rode `npm run stamp` e inclua `site/index.html` no commit: ele grava `?v=<hash do conteúdo>` em CSS, JS e `data/profile.js`, então cada mudança vira uma URL nova.
O PDF do CV (`assets/cv/`) não entra no hash; se trocar o PDF, o navegador pode reter o antigo até revalidar.

## Editar o conteúdo
Todo o texto vem de `site/data/profile.js` (`window.PROFILE`; `profile.json` é a cópia idêntica) em EN / PT-PT / PT-BR.
Textos de interface (botões, status) ficam em `site/assets/js/strings.js`.
O JSON-LD e as meta tags em `index.html` são estáticos (para crawlers): atualize-os se mudar cargo, telefone etc.
Contato atual: +351 938 586 920 (também WhatsApp), eng.diogopetry@gmail.com, disponibilidade imediata (`meta.phone`, `meta.whatsapp`, `meta.email`, `meta.availability`). O telefone e o e-mail também estão no JSON-LD e no `<noscript>` de `index.html`: atualize os dois lugares.
Credenciais: `credentialUrl` de cada certificação aponta para o badge público no Credly (perfil: https://www.credly.com/users/diogo-petry/badges). MPLS Huawei (Hexa Networks) e o programa da UMinhoExec não estão no Credly e ficam sem link.
**Lacunas / pendências**:
- Descrições das experiências: textos novos do LinkedIn ainda em levantamento (não alterados nesta atualização).
- Início do Infnet: o cliente informou jan. 2021; o PDF do CV diz 15/01/2022. Confirmar com ele.
- O PDF do CV traz dados pessoais que o site não mostra (data de nascimento, nacionalidade, autorização de trabalho). Ele fica público aqui e no GitHub: gerar uma versão sem esses campos antes de publicar, se o cliente preferir.
- O PDF está em inglês e é o mesmo nos 3 idiomas.

## O que tem
- **Vista recrutador** (padrão) e **vista engenheiro** (console estilo IOS-XR: `?`, Tab, ↑/↓, `show version`, `show running-config | section experience`, `show certifications`, `traceroute career`, `show skills`, `ping contact`…).
- Topologia IP/MPLS viva: clique num enlace para derrubá-lo e veja o FRR/reconvergência.
- Seletor EN / PT-PT / PT-BR e tema claro/escuro (preferências em localStorage, sem cookies).
- "Baixar CV" baixa o PDF `site/assets/cv/DiogoPetry-CV.pdf` (link `<a download>`; também pelo comando `download cv` do console). Para trocar o CV, substitua o arquivo mantendo o nome (o `vercel.json` não aplica cache `immutable` a `/assets/cv/`). A folha A4 ATS-friendly gerada do idioma ativo continua disponível em Ctrl/Cmd+P; contato em .vcf.
- GDPR-limpo: zero cookies, zero trackers, zero requisições a terceiros (fontes self-hosted: Instrument Serif, IBM Plex Sans, JetBrains Mono — licença OFL).
- Parâmetros de URL úteis: `?lang=pt-PT&theme=dark&view=engineer`.

