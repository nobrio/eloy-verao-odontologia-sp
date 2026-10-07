/* Eloy Verão Odontologia · Unidade São Paulo · interações (v4)
   Só o WhatsApp da Unidade São Paulo. Nunca o de Dourados (MS).
   Sem JS, todo link já abre o WhatsApp com uma mensagem geral; este arquivo só enriquece. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const celular = matchMedia('(max-width: 1099px)');
  const comMouse = matchMedia('(hover: hover) and (pointer: fine)');
  const temIO = 'IntersectionObserver' in window;
  if (temIO && !semMovimento) document.documentElement.classList.add('anima');

  const WHATSAPP = '5511964999718';
  const ORIGEM = 'Vim pelo site da Unidade São Paulo (Jardim Aricanduva).';
  const INTERESSES = {
    consulta: 'consulta e limpeza',
    dor: 'dor ou urgência',
    canal: 'tratamento de canal',
    ortodontia: 'aparelho ou alinhador',
    implante: 'implante ou prótese',
    clareamento: 'clareamento',
    harmonizacao: 'harmonização orofacial',
    nao_sei: 'ainda não sei',
  };
  const ROTULOS = { consulta: 'Consulta e limpeza', dor: 'Dor ou urgência', canal: 'Tratamento de canal', ortodontia: 'Aparelho ou alinhador', implante: 'Implante ou prótese', clareamento: 'Clareamento', harmonizacao: 'Harmonização orofacial', nao_sei: 'Ainda não sei' };
  const linkWhats = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

  /* Mensuração: dataLayer (GTM/GA4) e gtag, se instalados. Nunca nome nem observação. */
  window.dataLayer = window.dataLayer || [];
  const medir = (evento, dados = {}) => {
    window.dataLayer.push({ event: evento, ...dados });
    if (typeof window.gtag === 'function') window.gtag('event', evento, dados);
  };
  document.addEventListener('click', (e) => {
    const m = e.target.closest('[data-medir]');
    if (m) medir(m.dataset.medir, m.dataset.posicao ? { posicao: m.dataset.posicao } : {});
    const d = e.target.closest('[data-whats-direto]');
    if (d) medir('clique_whatsapp', { area: d.dataset.area || 'geral', posicao: d.dataset.posicao || '', tipo: 'direto' });
  });

  const ano = $('[data-ano]');
  if (ano) ano.textContent = new Date().getFullYear();

  const abreWhats = (url) => {
    const aba = window.open(url, '_blank');
    if (aba) aba.opener = null;
    else window.location.href = url;
  };

  /* Uma vez, quando entra na tela */
  const quandoVisivel = (el, fn, threshold = 0.3, rootMargin = '0px') => {
    if (!el) return;
    if (!temIO || semMovimento) { fn(); return; }
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { fn(); o.disconnect(); } }, { threshold, rootMargin });
    o.observe(el);
  };
  $$('[data-revela]').forEach((el) => quandoVisivel(el, () => el.classList.add('is-visto'), 0.2));

  /* ---------- Menu do celular ---------- */
  const topo = $('[data-topo]');
  const botaoMenu = $('[data-menu-botao]');
  const painel = $('[data-painel]');
  const abreMenu = (abre, devolveFoco) => {
    painel.hidden = !abre;
    topo.classList.toggle('is-aberto', abre);
    botaoMenu.setAttribute('aria-expanded', String(abre));
    $('[data-menu-rotulo]').textContent = abre ? 'Fechar o menu' : 'Abrir o menu';
    document.documentElement.style.overflow = abre ? 'hidden' : '';
    if (abre) $('a', painel).focus();
    else if (devolveFoco) botaoMenu.focus();
  };
  botaoMenu.addEventListener('click', () => abreMenu(botaoMenu.getAttribute('aria-expanded') !== 'true'));
  $$('nav a', painel).forEach((a) => a.addEventListener('click', () => abreMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && botaoMenu.getAttribute('aria-expanded') === 'true') abreMenu(false, true);
  });
  matchMedia('(min-width: 1100px)').addEventListener('change', (m) => { if (m.matches) abreMenu(false); });

  /* ---------- O componente de mensagem ---------- */
  const form = $('[data-form]');
  const casaForm = $('[data-casa-form]');
  const folha = $('[data-folha]');
  const folhaCorpo = $('[data-folha-corpo]');
  const nome = $('#f-nome', form);
  const obs = $('#f-obs', form);
  const erroNome = $('#erro-nome', form);
  const erroPlano = $('#erro-plano', form);
  const erroInteresse = $('#erro-interesse', form);
  const campoInteresse = $('[data-campo-interesse]', form);
  const campoPlano = $('[data-campo-plano]', form);
  const planosForm = $('[data-planos-form]', form);
  const procura = $('[data-procura]', form);
  const planoResumo = $('[data-plano-resumo]', form);
  const dor = $('[data-dor]', form);
  const previaCaixa = $('[data-previa-caixa]', form);
  const previa = $('[data-previa]', form);
  const enviar = $('[data-enviar]', form);
  const enviarTexto = $('[data-enviar-texto]', form);
  const aberto = $('[data-aberto]', form);
  const abertoTexto = $('[data-aberto-texto]', form);
  const deNovo = $('[data-abrir-de-novo]', form);
  const copiar = $('[data-copiar]', form);
  const copiarTexto = $('[data-copiar-texto]', form);
  const soAbrir = $('[data-so-abrir]', form);
  const anuncio = $('[data-anuncio]', form);
  const contador = $('[data-contador]', form);

  let modoConvenio = false; // veio de uma pergunta de convênio
  let quemAbriu = null;

  const valor = (n) => ($(`input[name="${n}"]:checked`, form) || {}).value || '';
  const marcar = (n, v) => { const r = $(`input[name="${n}"][value="${v}"]`, form); if (r) r.checked = true; };
  const desmarcar = (n) => $$(`input[name="${n}"]`, form).forEach((r) => { r.checked = false; });
  // Convênio: "Tenho convênio" + qual plano, ou "Particular", ou "Não sei / vou ver"
  const planoValor = () => { const t = valor('tipo'); return t === 'convenio' ? valor('plano') : t; };
  const textoPlano = (p) => {
    if (!p) return '';
    if (p === 'particular') return 'particular';
    if (p === 'nao_sei') return 'ainda vou confirmar';
    if (p === 'outro') return 'outro plano (não está na lista do site)';
    return p;
  };
  const rotuloPlano = (p) => (p === 'particular' ? 'Particular' : p === 'nao_sei' ? 'Não sei / vou ver' : p === 'outro' ? 'Outro plano' : p);
  const tipoPlano = (p) => (p === 'particular' ? 'particular' : p === 'nao_sei' ? 'nao_sei' : p === 'outro' ? 'outro' : p ? 'convenio' : '');

  /* Monta a mensagem exatamente no modelo combinado com a recepção (conversao.md, seção 3).
     A primeira linha é a que aparece na lista de conversas: nome + interesse. Linhas sem resposta não entram. */
  const monta = (comNome = true) => {
    const n = nome.value.trim();
    const quem = comNome && n ? `Sou ${n}` : '';
    const interesse = valor('interesse');
    let primeira;
    if (interesse === 'dor') primeira = quem ? `Olá! ${quem}, estou com dor e queria um horário o quanto antes.` : 'Olá! Estou com dor e queria um horário o quanto antes.';
    else if (interesse === 'nao_sei' || (!interesse && !modoConvenio)) primeira = quem ? `Olá! ${quem} e quero marcar uma avaliação.` : 'Olá! Quero marcar uma avaliação.';
    else if (!interesse && modoConvenio) primeira = quem ? `Olá! ${quem} e quero saber se o meu plano cobre o tratamento.` : 'Olá! Quero saber se o meu plano cobre o tratamento.';
    else primeira = quem ? `Olá! ${quem} e quero marcar: ${INTERESSES[interesse]}.` : `Olá! Quero marcar: ${INTERESSES[interesse]}.`;
    const linhas = [primeira, ORIGEM, ''];
    const para = valor('para');
    if (para === 'crianca') linhas.push('Para: uma criança');
    if (para === 'outro') linhas.push('Para: outra pessoa');
    const primeiraVez = valor('primeira');
    if (primeiraVez) linhas.push(`Primeira vez na clínica: ${primeiraVez === 'nao' ? 'não' : 'sim'}`);
    const p = planoValor();
    if (p) linhas.push(`Convênio: ${textoPlano(p)}`);
    const periodo = valor('periodo');
    if (periodo) linhas.push(`Melhor período: ${periodo}`);
    const o = obs.value.trim().replace(/\s+/g, ' ');
    if (o) linhas.push(`Obs.: ${o}`);
    if (linhas[linhas.length - 1] !== '') linhas.push('');
    linhas.push('Obrigado!');
    return linhas.join('\n');
  };

  const atualiza = () => {
    const interesse = valor('interesse');
    dor.hidden = interesse !== 'dor';
    planosForm.hidden = valor('tipo') !== 'convenio';
    const algo = nome.value.trim() || interesse || planoValor();
    previaCaixa.hidden = !algo;
    previa.textContent = monta();
    soAbrir.href = linkWhats(monta(false));
    const usados = obs.value.length;
    contador.textContent = `${usados} de 200`;
    contador.setAttribute('aria-live', usados >= 180 ? 'polite' : 'off');
  };

  const mostraProcura = (mostra) => {
    const interesse = valor('interesse');
    const ativo = mostra && interesse;
    procura.hidden = !ativo;
    campoInteresse.hidden = !!ativo;
    if (ativo) $('[data-procura-texto]', procura).textContent = ROTULOS[interesse];
  };
  const mostraPlano = (mostra) => {
    const p = planoValor();
    const ativo = mostra && p;
    planoResumo.hidden = !ativo;
    campoPlano.hidden = !!ativo;
    if (ativo) $('[data-plano-resumo-texto]', planoResumo).textContent = rotuloPlano(p);
  };
  $('[data-trocar]', form).addEventListener('click', () => {
    mostraProcura(false);
    ($('input[name="interesse"]:checked', form) || $('input[name="interesse"]', form)).focus();
  });
  $('[data-plano-trocar]', form).addEventListener('click', () => {
    mostraPlano(false);
    ($('input[name="tipo"]:checked', form) || $('input[name="tipo"]', form)).focus();
  });

  const limpaErro = (campo, erro) => { erro.hidden = true; campo.removeAttribute('aria-invalid'); };
  nome.addEventListener('input', () => { if (nome.value.trim()) limpaErro(nome, erroNome); atualiza(); });
  obs.addEventListener('input', atualiza);
  $$('input[type="radio"]', form).forEach((r) => r.addEventListener('change', () => {
    if (r.name === 'interesse') limpaErro(campoInteresse, erroInteresse);
    if (r.name === 'tipo' || r.name === 'plano') { if (planoValor()) limpaErro(campoPlano, erroPlano); }
    if (r.name === 'tipo' && r.value !== 'convenio') desmarcar('plano');
    atualiza();
  }));

  const estadoNormal = () => {
    aberto.hidden = true;
    enviar.hidden = false;
    enviar.classList.remove('is-abrindo');
    enviarTexto.textContent = 'Abrir no WhatsApp com a mensagem pronta';
  };
  // Qualquer mudança depois de abrir volta o botão ao normal (a mensagem mudou)
  form.addEventListener('input', () => { if (!aberto.hidden) estadoNormal(); });
  form.addEventListener('change', () => { if (!aberto.hidden) estadoNormal(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const n = nome.value.trim();
    const interesse = valor('interesse');
    const p = planoValor();
    const faltaInteresse = !interesse && !modoConvenio;
    erroNome.hidden = !!n;
    erroPlano.hidden = !!p;
    erroInteresse.hidden = !faltaInteresse;
    if (!n) nome.setAttribute('aria-invalid', 'true');
    if (!p) { mostraPlano(false); campoPlano.setAttribute('aria-invalid', 'true'); }
    if (faltaInteresse) { mostraProcura(false); campoInteresse.setAttribute('aria-invalid', 'true'); }
    const erros = [faltaInteresse && 'interesse', !n && 'nome', !p && 'plano'].filter(Boolean);
    if (erros.length) {
      erros.forEach((campo) => medir('erro_formulario', { campo }));
      const primeiroPlano = valor('tipo') === 'convenio' ? $('input[name="plano"]', form) : $('input[name="tipo"]', form);
      const primeiro = erros[0] === 'interesse' ? $('input[name="interesse"]', form) : erros[0] === 'nome' ? nome : primeiroPlano;
      primeiro.focus();
      return;
    }
    const texto = monta();
    const url = linkWhats(texto);
    const area = interesse || 'convenio';
    medir('envio_formulario', { area, plano_tipo: tipoPlano(p), plano: tipoPlano(p) === 'convenio' ? p : '', para: valor('para') || 'eu', primeira_vez: valor('primeira') || 'vazio', periodo: valor('periodo') });
    medir('clique_whatsapp', { area, posicao: 'formulario', tipo: 'mensagem_montada' });
    enviar.classList.add('is-abrindo');
    enviarTexto.textContent = 'Abrindo o WhatsApp…';
    abreWhats(url);
    deNovo.href = url;
    setTimeout(() => {
      enviar.hidden = true;
      enviar.classList.remove('is-abrindo');
      aberto.hidden = false;
      anuncio.textContent = 'Abrimos o WhatsApp com a sua mensagem. Falta tocar em enviar para ela chegar à recepção.';
      abertoTexto.focus({ preventScroll: true });
    }, semMovimento ? 300 : 900);
  });
  deNovo.addEventListener('click', () => medir('clique_whatsapp', { area: valor('interesse') || 'convenio', posicao: 'formulario', tipo: 'mensagem_montada' }));
  soAbrir.addEventListener('click', () => medir('clique_whatsapp', { area: valor('interesse') || 'geral', posicao: 'formulario', tipo: 'direto' }));
  copiar.addEventListener('click', async () => {
    const texto = monta();
    try { await navigator.clipboard.writeText(texto); } catch {
      const t = document.createElement('textarea'); t.value = texto; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.append(t); t.select(); try { document.execCommand('copy'); } catch { /* sem cópia */ } t.remove();
    }
    medir('copiar_mensagem', { area: valor('interesse') || 'convenio' });
    copiarTexto.textContent = 'Mensagem copiada';
    anuncio.textContent = 'Mensagem copiada.';
    setTimeout(() => { copiarTexto.textContent = 'Copiar a mensagem'; }, 2400);
  });

  /* Estado compartilhado da página: o plano escolhido em "Seu plano está aqui?" chega marcado na mensagem */
  const definePlano = (p) => {
    if (!p) return;
    if (p === 'particular' || p === 'nao_sei') { marcar('tipo', p); desmarcar('plano'); }
    else { marcar('tipo', 'convenio'); marcar('plano', p); }
    limpaErro(campoPlano, erroPlano);
    mostraPlano(true);
    atualiza();
  };

  /* Pré-preenche a partir do botão de origem (interesse e, se veio de um plano, o plano) */
  const preenche = (area, planoEscolhido) => {
    modoConvenio = area === 'convenio';
    if (area === 'criancas') { marcar('interesse', 'consulta'); marcar('para', 'crianca'); }
    else if (INTERESSES[area]) marcar('interesse', area);
    if (planoEscolhido) definePlano(planoEscolhido);
    mostraProcura(!!INTERESSES[area] || area === 'criancas');
    if (planoValor()) mostraPlano(true);
    estadoNormal();
    atualiza();
  };
  const primeiroVazio = () => (!nome.value.trim() ? nome : !planoValor() ? (valor('tipo') === 'convenio' ? $('input[name="plano"]', form) : $('input[name="tipo"]', form)) : enviar);

  /* Folha inferior no celular: o mesmo formulário é movido para dentro do <dialog> */
  const abreFolha = () => {
    folhaCorpo.append(form);
    document.documentElement.classList.add('folha-aberta');
    folha.showModal();
    folhaCorpo.scrollTop = 0;
    primeiroVazio().focus({ preventScroll: true });
    atualizaFixo();
  };
  const fechaFolha = () => { if (folha.open) folha.close(); };
  folha.addEventListener('close', () => {
    casaForm.append(form);
    document.documentElement.classList.remove('folha-aberta');
    if (quemAbriu && document.contains(quemAbriu)) quemAbriu.focus({ preventScroll: true });
    atualizaFixo();
  });
  $('[data-folha-fechar]').addEventListener('click', fechaFolha);
  // O <dialog> nativo deixa o Tab sair para a barra do navegador: o foco fica preso na folha
  const focaveis = () => $$('a[href], button, input, select, textarea, summary', folha)
    .filter((el) => !el.disabled && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden'
      && !(el.type === 'radio' && !el.checked && $$(`input[name="${el.name}"]:checked`, folha).length));
  folha.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const lista = focaveis();
    if (!lista.length) return;
    const primeiro = lista[0];
    const ultimo = lista[lista.length - 1];
    if (e.shiftKey && (document.activeElement === primeiro || !folha.contains(document.activeElement))) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && (document.activeElement === ultimo || !folha.contains(document.activeElement))) { e.preventDefault(); primeiro.focus(); }
  });
  folha.addEventListener('click', (e) => { if (e.target === folha) fechaFolha(); });

  // Delegação: vale para todo botão que abre a mensagem (inclusive os que o JS reescreve)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-contato]');
    if (!a) return;
    e.preventDefault();
    const area = a.dataset.area || 'geral';
    const posicao = a.dataset.posicao || '';
    if (botaoMenu.getAttribute('aria-expanded') === 'true') abreMenu(false);
    quemAbriu = a;
    preenche(area, a.dataset.plano);
    medir('abrir_contato', { area, posicao });
    if (celular.matches && matchMedia('(max-width: 899px)').matches) abreFolha();
    else {
      form.scrollIntoView({ behavior: semMovimento ? 'auto' : 'smooth', block: 'start' });
      setTimeout(() => primeiroVazio().focus({ preventScroll: true }), semMovimento ? 0 : 500);
    }
  });
  matchMedia('(max-width: 899px)').addEventListener('change', (m) => { if (!m.matches) fechaFolha(); });
  atualiza();

  /* ---------- Seu plano está aqui? ---------- */
  const fixo = $('[data-fixo]');
  const fixoBotao = $('[data-fixo-botao]');
  const fixoTexto = $('[data-fixo-texto]');
  const listaPlanos = $('[data-planos]');
  const resposta = $('[data-plano-resposta]');
  const anuncioPlano = $('[data-plano-anuncio]');
  const secaoPlanos = $('#convenios');
  let planoEscolhido = '';
  let planosVisivel = false;
  const respostaDe = (p) => {
    if (p === 'particular') return { titulo: 'Atendemos particular.', apoio: 'A recepção explica como funciona a primeira consulta.', botao: 'Marcar consulta pelo WhatsApp', fixo: 'Particular · Marcar consulta', area: 'geral', msg: `Olá! Quero marcar uma avaliação.\n${ORIGEM}\n\nConvênio: particular` };
    if (p === 'outro') return { titulo: 'Não achou o seu?', apoio: 'Pergunte mesmo assim: a recepção confere.', botao: 'Perguntar pelo meu plano', fixo: 'Outro plano · Perguntar', area: 'convenio', msg: `Olá! Quero saber se o meu plano cobre o tratamento.\n${ORIGEM}\n\nConvênio: outro plano (não está na lista do site)` };
    return { titulo: `${p} está na lista.`, apoio: 'A recepção confirma a cobertura para o seu tratamento.', botao: 'Perguntar se o meu plano cobre', fixo: `${p} · Perguntar se cobre`, area: 'convenio', msg: `Olá! Quero saber se o meu plano cobre o tratamento.\n${ORIGEM}\n\nConvênio: ${p}` };
  };
  const PADRAO_FIXO = { texto: 'Marcar pelo WhatsApp', area: 'geral', href: fixoBotao.getAttribute('href') };
  const fixoModoPlano = () => {
    const ativo = !!planoEscolhido && planosVisivel;
    fixo.classList.toggle('is-plano', ativo);
    if (ativo) {
      const r = respostaDe(planoEscolhido);
      fixoTexto.textContent = r.fixo;
      fixoBotao.dataset.area = r.area;
      fixoBotao.dataset.plano = planoEscolhido;
      fixoBotao.dataset.posicao = 'convenios';
      fixoBotao.href = linkWhats(r.msg);
    } else {
      fixoTexto.textContent = PADRAO_FIXO.texto;
      fixoBotao.dataset.area = PADRAO_FIXO.area;
      delete fixoBotao.dataset.plano;
      fixoBotao.dataset.posicao = 'barra-fixa';
      fixoBotao.href = PADRAO_FIXO.href;
    }
  };
  if (listaPlanos) {
    listaPlanos.addEventListener('change', (e) => {
      const r0 = e.target.closest('input[name="meu-plano"]');
      if (!r0) return;
      planoEscolhido = r0.value;
      const r = respostaDe(planoEscolhido);
      definePlano(planoEscolhido);
      $('[data-resposta-vazia]', resposta).hidden = true;
      const cheia = $('[data-resposta-cheia]', resposta);
      cheia.hidden = true;
      void cheia.offsetWidth; // reinicia a troca suave
      $('[data-resposta-titulo]', resposta).textContent = r.titulo;
      $('[data-resposta-apoio]', resposta).textContent = r.apoio;
      const b = $('[data-resposta-botao]', resposta);
      $('[data-resposta-botao-texto]', b).textContent = r.botao;
      b.dataset.area = r.area;
      b.dataset.plano = planoEscolhido;
      b.href = linkWhats(r.msg);
      cheia.hidden = false;
      anuncioPlano.textContent = `${r.titulo} ${r.apoio}`;
      fixoModoPlano();
      atualizaFixo();
    });
  }

  /* ---------- Casos: um palco, vários casos, comparador de arrastar ---------- */
  const comp = $('[data-comparar]');
  const casoPainel = $('[data-caso-painel]');
  const casoAcao = $('[data-caso-acao]');
  let casoAtual = 'clareamento';
  const medidos = new Set();
  let trocaCaso = () => {};
  if (comp) {
    const palco = $('[data-palco]', comp);
    const controle = $('[data-controle]', comp);
    const imgAntes = $('[data-img="antes"]', comp);
    const imgDepois = $('[data-img="depois"]', comp);
    const rotulo = $('[data-caso-rotulo]', comp);
    const marca = () => { if (!medidos.has(casoAtual)) { medir('uso_comparador', { caso: casoAtual }); medidos.add(casoAtual); } };
    const posiciona = (v) => palco.style.setProperty('--pos', `${v}%`);
    controle.addEventListener('input', () => { marca(); posiciona(controle.value); });
    const peloPonto = (x) => {
      const r = palco.getBoundingClientRect();
      const v = Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100));
      controle.value = Math.round(v);
      posiciona(v.toFixed(2));
    };
    let arrastando = false;
    let inicio = null;
    palco.addEventListener('pointerdown', (e) => {
      marca();
      if (e.pointerType === 'mouse') { arrastando = true; palco.setPointerCapture(e.pointerId); peloPonto(e.clientX); return; }
      inicio = { x: e.clientX, y: e.clientY, id: e.pointerId };
    });
    palco.addEventListener('pointermove', (e) => {
      if (!arrastando && inicio) {
        const dx = Math.abs(e.clientX - inicio.x);
        const dy = Math.abs(e.clientY - inicio.y);
        if (dx > 6 && dx > dy) { arrastando = true; palco.setPointerCapture(inicio.id); }
        else if (dy > 6) inicio = null;
      }
      if (arrastando) peloPonto(e.clientX);
    });
    const solta = () => { arrastando = false; inicio = null; };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => palco.addEventListener(t, solta));
    palco.addEventListener('click', () => controle.focus({ preventScroll: true }));

    const carrega = (img) => (img.complete && img.naturalWidth ? Promise.resolve() : new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); }));
    trocaCaso = async (id) => {
      const t = $(`template[data-caso-dados="${id}"]`);
      if (!t || id === casoAtual) return;
      casoAtual = id;
      $$('[data-caso]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.caso === id)));
      const d = t.dataset;
      if (!semMovimento) { palco.classList.add('is-trocando'); casoPainel.style.opacity = '0'; await new Promise((r) => setTimeout(r, 160)); }
      [[imgAntes, d.antes, d.antesSrcset, d.altAntes], [imgDepois, d.depois, d.depoisSrcset, d.altDepois]].forEach(([img, src, srcset, alt]) => {
        img.loading = 'eager';
        if (srcset) img.srcset = srcset; else img.removeAttribute('srcset');
        img.src = src;
        img.alt = alt;
      });
      // Todos os casos no mesmo palco 16:10: as imagens já vêm recortadas nessa proporção (o palco nunca muda de tamanho)
      controle.value = 50;
      posiciona(50);
      rotulo.textContent = `Comparar antes e depois: ${d.rotulo}`;
      casoPainel.replaceChildren(t.content.cloneNode(true));
      if (casoAcao && d.area) {
        casoAcao.dataset.area = d.area;
        casoAcao.href = linkWhats(`Olá! Quero marcar: ${INTERESSES[d.area]}.\n${ORIGEM}`);
      }
      await Promise.all([carrega(imgAntes), carrega(imgDepois)]);
      palco.classList.remove('is-trocando');
      casoPainel.style.opacity = '';
    };
    casoPainel.style.transition = 'opacity 300ms cubic-bezier(.16, 1, .3, 1)';
    $$('[data-caso]').forEach((b) => b.addEventListener('click', () => trocaCaso(b.dataset.caso)));
  }
  // "Ver um caso real" nos tratamentos: abre o caso certo no comparador (a âncora leva até lá)
  $$('[data-ver-caso]').forEach((a) => a.addEventListener('click', () => trocaCaso(a.dataset.verCaso)));

  /* ---------- Equipe: a fita abraça a pessoa (hover/foco no desktop; ao passar pelo centro e ao toque no celular) ---------- */
  const arcos = $$('[data-arco]');
  const abraca = (arco, replay) => {
    if (replay && arco.classList.contains('is-abracado')) { arco.classList.remove('is-abracado'); void arco.offsetWidth; }
    arco.classList.add('is-abracado');
  };
  arcos.forEach((arco) => {
    arco.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') abraca(arco); });
    arco.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') arco.classList.remove('is-abracado'); });
    arco.addEventListener('click', () => { if (!comMouse.matches) abraca(arco, true); });
  });
  if (temIO && !semMovimento) {
    const oArco = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !comMouse.matches) { abraca(e.target); oArco.unobserve(e.target); }
    }), { rootMargin: '-40% 0px -40% 0px' });
    arcos.forEach((a) => oArco.observe(a));
  }

  /* ---------- Avaliações: o trilho entra de uma vez (cards escalonados no CSS); no celular, pontos indicam a posição ---------- */
  const trilho = $('[data-trilho]');
  if (trilho) {
    quandoVisivel(trilho, () => trilho.classList.add('is-visto'), 0.15);
    const vozes = $$('.voz', trilho);
    const pontos = $$('[data-ponto]');
    const marcaPonto = (i) => pontos.forEach((p, k) => (k === i ? p.setAttribute('aria-current', 'true') : p.removeAttribute('aria-current')));
    let quadro = 0;
    trilho.addEventListener('scroll', () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const x = trilho.scrollLeft;
        let perto = 0; let menor = Infinity;
        vozes.forEach((v, i) => { const d = Math.abs(v.offsetLeft - vozes[0].offsetLeft - x); if (d < menor) { menor = d; perto = i; } });
        if (x + trilho.clientWidth >= trilho.scrollWidth - 4) perto = vozes.length - 1;
        marcaPonto(perto);
      });
    }, { passive: true });
    pontos.forEach((p) => p.addEventListener('click', () => {
      const v = vozes[Number(p.dataset.ponto)];
      if (!v) return;
      trilho.scrollTo({ left: v.offsetLeft - vozes[0].offsetLeft, behavior: semMovimento ? 'auto' : 'smooth' });
      marcaPonto(Number(p.dataset.ponto));
    }));
  }

  /* ---------- Primeira consulta: as cartas chegam em sequência ---------- */
  const cartas = $('[data-cartas]');
  quandoVisivel(cartas, () => cartas.classList.add('is-visto'), 0.12);

  /* ---------- Fechamento: o monograma se desenha de novo, pequeno ---------- */
  const mono = $('[data-monograma]');
  quandoVisivel(mono, () => mono.classList.add('is-visto'), 0.6);

  /* ---------- Topo, menu ativo e barra fixa ---------- */
  const capa = $('#inicio');
  const contato = $('#contato');
  const linksNav = $$('[data-nav]');
  const alvosNav = linksNav.map((l) => $(l.getAttribute('href')));
  let capaVisivel = true;
  let contatoVisivel = false;
  function atualizaFixo() {
    const mostra = (!capaVisivel || (planosVisivel && planoEscolhido)) && !contatoVisivel && !folha.open;
    fixo.classList.toggle('is-visivel', mostra);
    $$('a', fixo).forEach((a) => { a.tabIndex = mostra ? 0 : -1; });
    fixo.setAttribute('aria-hidden', String(!mostra));
  }
  if (temIO) {
    new IntersectionObserver(([e]) => { capaVisivel = e.isIntersecting; atualizaFixo(); }, { rootMargin: '0px 0px -35% 0px' }).observe(capa);
    new IntersectionObserver(([e]) => { contatoVisivel = e.isIntersecting; atualizaFixo(); }, { rootMargin: '0px 0px -10% 0px' }).observe(contato);
    new IntersectionObserver(([e]) => { planosVisivel = e.isIntersecting; fixoModoPlano(); atualizaFixo(); }, { rootMargin: '-20% 0px -20% 0px' }).observe(secaoPlanos);
  }
  atualizaFixo();
  let agendado = false;
  const aoRolar = () => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(() => {
      agendado = false;
      topo.classList.toggle('is-rolado', window.scrollY > 8);
      const meio = innerHeight / 3;
      alvosNav.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        linksNav[i].setAttribute('aria-current', r.top <= meio && r.bottom > meio ? 'true' : 'false');
      });
    });
  };
  aoRolar();
  addEventListener('scroll', aoRolar, { passive: true });
})();
