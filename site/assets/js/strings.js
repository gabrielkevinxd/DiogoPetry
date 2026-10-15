/* Textos de interface (chrome do site). Fatos do perfil vêm sempre de data/profile.js. */
window.DP = window.DP || {};
DP.S = {
  'en': {
    skip: 'Skip to content', viewLabel: 'View', viewRecruiter: 'Recruiter view', viewEngineer: 'Engineer view',
    langLabel: 'Language', themeLabel: 'Switch theme', themeDark: 'Dark', themeLight: 'Light',
    heroKicker: 'Portugal', summary: 'Summary', careerTitle: 'Career path', careerNote: 'Each role is a hop on the path. Select one to expand it.',
    hop: 'Hop', expandRole: 'Details', trailTitle: 'Cisco certification path', trailNote: 'CCNA → CCNP → CCIE',
    crownKicker: 'Expert level', otherCreds: 'Other credentials', skillsNote: 'Grouped by domain.',
    eduTitle: 'Education', contactLead: 'Let’s talk.', contactNote: 'Reach out directly.',
    downloadVcf: 'Save contact (.vcf)', callAria: 'Call', openIn: 'opens in a new tab',
    topoAria: 'Illustrative IP/MPLS topology', topoHint: 'Illustrative topology. Select a link to cut it and watch traffic reconverge.',
    restore: 'Restore all links', lspUp: 'LSP up', lspFrr: 'BFD down · FRR bypass active', lspReopt: 'Re-optimising path',
    lspDown: 'LSP down · no path', lspUnaffected: 'Link cut · LSP unaffected', linkCut: 'cut', linkOk: 'up',
    linkAria: 'Link {a} to {b}, currently {s}. Press to toggle.', dropped: 'packet lost',
    sbHelp: '? help · Tab complete · ↑↓ history · exit', cliLabel: 'IOS-XR command line', cliTry: 'Try', cliHint: 'Type ? for help · Tab completes · ↑ ↓ history · "exit" returns to the recruiter view',
    privacy: 'No cookies · no trackers · no third-party requests', printTitle: 'Curriculum vitae',
    shown: 'Showing', top: 'Back to top', docTitle: 'Senior Network Engineer', copiedAnnounce: 'Phone number copied',
    plane: 'Network plane', sections: 'Sections', consoleLabel: 'IOS-XR console', mailAria: 'Send an email to', pdfNote: 'PDF, English', langSection: 'Languages', cefrScaleLabel: 'Level on the A1 to C2 scale', cliDownload: 'Downloading DiogoPetry-CV.pdf (English)'
  },
  'pt-PT': {
    skip: 'Saltar para o conteúdo', viewLabel: 'Vista', viewRecruiter: 'Vista de recrutador', viewEngineer: 'Vista de engenheiro',
    langLabel: 'Idioma', themeLabel: 'Alternar tema', themeDark: 'Escuro', themeLight: 'Claro',
    heroKicker: 'Portugal', summary: 'Resumo', careerTitle: 'Percurso profissional', careerNote: 'Cada função é um hop no caminho. Selecione uma para expandir.',
    hop: 'Hop', expandRole: 'Detalhes', trailTitle: 'Percurso de certificações Cisco', trailNote: 'CCNA → CCNP → CCIE',
    crownKicker: 'Nível expert', otherCreds: 'Outras credenciais', skillsNote: 'Agrupadas por domínio.',
    eduTitle: 'Formação', contactLead: 'Vamos conversar.', contactNote: 'Contacte diretamente.',
    downloadVcf: 'Guardar contacto (.vcf)', callAria: 'Ligar', openIn: 'abre num novo separador',
    topoAria: 'Topologia IP/MPLS ilustrativa', topoHint: 'Topologia ilustrativa. Selecione uma ligação para a cortar e veja o tráfego reconvergir.',
    restore: 'Repor todas as ligações', lspUp: 'LSP ativo', lspFrr: 'BFD down · bypass FRR ativo', lspReopt: 'A reotimizar o caminho',
    lspDown: 'LSP inativo · sem caminho', lspUnaffected: 'Ligação cortada · LSP não afetado', linkCut: 'cortada', linkOk: 'ativa',
    linkAria: 'Ligação {a} a {b}, atualmente {s}. Prima para alternar.', dropped: 'pacote perdido',
    sbHelp: '? ajuda · Tab completa · ↑↓ histórico · exit', cliLabel: 'Linha de comandos IOS-XR', cliTry: 'Experimente', cliHint: 'Escreva ? para ajuda · Tab completa · ↑ ↓ histórico · "exit" volta à vista de recrutador',
    privacy: 'Sem cookies · sem rastreadores · sem pedidos a terceiros', printTitle: 'Curriculum vitae',
    shown: 'A mostrar', top: 'Voltar ao topo', docTitle: 'Senior Network Engineer', copiedAnnounce: 'Número de telemóvel copiado',
    plane: 'Plano de rede', sections: 'Secções', consoleLabel: 'Consola IOS-XR', mailAria: 'Enviar e-mail para', pdfNote: 'PDF, em inglês', langSection: 'Idiomas', cefrScaleLabel: 'Nível na escala A1 a C2', cliDownload: 'A descarregar DiogoPetry-CV.pdf (inglês)'
  },
  'pt-BR': {
    skip: 'Pular para o conteúdo', viewLabel: 'Visão', viewRecruiter: 'Visão do recrutador', viewEngineer: 'Visão do engenheiro',
    langLabel: 'Idioma', themeLabel: 'Alternar tema', themeDark: 'Escuro', themeLight: 'Claro',
    heroKicker: 'Portugal', summary: 'Resumo', careerTitle: 'Trajetória profissional', careerNote: 'Cada cargo é um hop no caminho. Selecione um para expandir.',
    hop: 'Hop', expandRole: 'Detalhes', trailTitle: 'Trilha de certificações Cisco', trailNote: 'CCNA → CCNP → CCIE',
    crownKicker: 'Nível expert', otherCreds: 'Outras credenciais', skillsNote: 'Agrupadas por domínio.',
    eduTitle: 'Formação', contactLead: 'Vamos conversar.', contactNote: 'Entre em contato diretamente.',
    downloadVcf: 'Salvar contato (.vcf)', callAria: 'Ligar', openIn: 'abre em nova aba',
    topoAria: 'Topologia IP/MPLS ilustrativa', topoHint: 'Topologia ilustrativa. Selecione um enlace para derrubá-lo e veja o tráfego reconvergir.',
    restore: 'Restaurar todos os enlaces', lspUp: 'LSP ativo', lspFrr: 'BFD down · bypass FRR ativo', lspReopt: 'Reotimizando o caminho',
    lspDown: 'LSP inativo · sem caminho', lspUnaffected: 'Enlace derrubado · LSP não afetado', linkCut: 'derrubado', linkOk: 'ativo',
    linkAria: 'Enlace {a} para {b}, atualmente {s}. Pressione para alternar.', dropped: 'pacote perdido',
    sbHelp: '? ajuda · Tab completa · ↑↓ histórico · exit', cliLabel: 'Linha de comando IOS-XR', cliTry: 'Experimente', cliHint: 'Digite ? para ajuda · Tab completa · ↑ ↓ histórico · "exit" volta à visão do recrutador',
    privacy: 'Sem cookies · sem rastreadores · sem requisições a terceiros', printTitle: 'Currículo',
    shown: 'Mostrando', top: 'Voltar ao topo', docTitle: 'Senior Network Engineer', copiedAnnounce: 'Número de celular copiado',
    plane: 'Plano de rede', sections: 'Seções', consoleLabel: 'Console IOS-XR', mailAria: 'Enviar e-mail para', pdfNote: 'PDF, em inglês', langSection: 'Idiomas', cefrScaleLabel: 'Nível na escala A1 a C2', cliDownload: 'Baixando DiogoPetry-CV.pdf (inglês)'
  }
};

/* Números que dependem da data atual: calculados em runtime a partir das datas ISO de PROFILE.experience
 * (mesma fórmula documentada nos comentários de stats em data/profile.js). Os stats[] ficam só como fallback.
 *   yearsExperience   = floor(months(início mais antigo de experience -> hoje)/12)
 *   monthsCurrentRole = months(início do cargo com end = null -> hoje)
 * months(a -> b) = (anoB - anoA)*12 + (mêsB - mêsA). Os valores entre duas datas fixas não passam por aqui. */
DP.now = function () { return new Date(); };
DP.stat = function (id) {
  var P = window.PROFILE, now = DP.now(), cur = now.getFullYear() * 12 + now.getMonth();
  function m(iso) { var x = /^(\d{4})-(\d{2})$/.exec(iso || ''); return x ? (+x[1]) * 12 + (+x[2]) - 1 : null; }
  var ex = ((P.meta && P.meta.experience) || []), v = null, i;
  if (id === 'yearsExperience') {
    var starts = ex.map(function (e) { return m(e.start); }).filter(function (n) { return n !== null; });
    if (starts.length) v = Math.floor((cur - Math.min.apply(null, starts)) / 12);
  } else if (id === 'monthsCurrentRole') {
    for (i = 0; i < ex.length; i++) if (ex[i].end == null && m(ex[i].start) !== null) { v = cur - m(ex[i].start); break; }
  }
  if (v === null || isNaN(v) || v < 0) {
    var s = P.stats.filter(function (x) { return x.id === id; })[0];
    return s ? s.value : null;
  }
  return v;
};
