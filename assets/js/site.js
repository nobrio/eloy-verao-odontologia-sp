/* Eloy Verão Odontologia · Unidade São Paulo · interações
   Dados usados aqui (manter atualizados): o WhatsApp da Unidade São Paulo e as mensagens prontas.
   Nunca usar o WhatsApp da unidade de Dourados (MS). */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.dataset.pronto = '1';

  const WHATSAPP = '5511964999718';
  const ABERTURA = 'Olá! Vim pelo site da Eloy Verão, Unidade São Paulo (Jardim Aricanduva).';
  const MENSAGENS = {
    geral: `${ABERTURA} Quero agendar uma avaliação.`,
    clinica: `${ABERTURA} Quero marcar uma consulta de rotina e limpeza.`,
    ortodontia: `${ABERTURA} Quero saber sobre aparelho ou alinhador para arrumar os dentes.`,
    implante: `${ABERTURA} Quero agendar uma avaliação para implante ou prótese.`,
    clareamento: `${ABERTURA} Quero saber sobre clareamento dental.`,
    harmonizacao: `${ABERTURA} Quero saber sobre harmonização orofacial com a Dra. Bruna.`,
    criancas: `${ABERTURA} Quero marcar uma consulta para uma criança.`,
  };
  const linkWhats = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

  /* Mensuração: cada clique vira um evento no dataLayer (Google Tag Manager / GA4) e no gtag, se instalados.
     Eventos: clique_whatsapp (tratamento, origem), envio_formulario (tratamento, plano), clique_telefone,
     clique_rota, clique_avaliacoes_google. Nada é enviado enquanto a tag não for instalada. */
  window.dataLayer = window.dataLayer || [];
  const medir = (evento, dados = {}) => {
    window.dataLayer.push({ event: evento, ...dados });
    if (typeof window.gtag === 'function') window.gtag('event', evento, dados);
  };

  // Cada botão abre o WhatsApp com a mensagem do seu tratamento e registra o clique
  $$('[data-wa]').forEach((a) => {
    a.href = linkWhats(MENSAGENS[a.dataset.wa] || MENSAGENS.geral);
    a.addEventListener('click', () => medir('clique_whatsapp', { tratamento: a.dataset.wa, origem: a.dataset.origem || '' }));
  });
  $$('[data-medir]').forEach((a) => a.addEventListener('click', () => medir(a.dataset.medir, { origem: a.dataset.origem || '' })));

  const ano = $('[data-ano]');
  if (ano) ano.textContent = new Date().getFullYear();

  const abreWhats = (texto) => {
    const url = linkWhats(texto);
    const aba = window.open(url, '_blank');
    if (aba) aba.opener = null;
    else window.location.href = url;
  };

  /* Menu do celular */
  const topo = $('[data-topo]');
  const botaoMenu = $('[data-menu-botao]');
  const gaveta = $('[data-gaveta]');
  const abreMenu = (abre, devolveFoco) => {
    gaveta.hidden = !abre;
    topo.classList.toggle('is-aberto', abre);
    botaoMenu.setAttribute('aria-expanded', String(abre));
    $('.sr', botaoMenu).textContent = abre ? 'Fechar o menu' : 'Abrir o menu';
    if (abre) $('a', gaveta).focus();
    else if (devolveFoco) botaoMenu.focus();
  };
  botaoMenu.addEventListener('click', () => abreMenu(botaoMenu.getAttribute('aria-expanded') !== 'true'));
  $$('a', gaveta).forEach((a) => a.addEventListener('click', () => abreMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && botaoMenu.getAttribute('aria-expanded') === 'true') abreMenu(false, true);
  });
  window.matchMedia('(min-width: 1100px)').addEventListener('change', (m) => { if (m.matches) abreMenu(false); });

  /* Topo, menu ativo e barra fixa: calculados juntos, uma vez por quadro.
     A barra aparece depois que a capa sai da tela e some no contato. */
  const capa = $('#inicio');
  const contato = $('#contato');
  const fixo = $('[data-whats-fixo]');
  const linksNav = $$('[data-nav]');
  const alvosNav = linksNav.map((l) => $(l.getAttribute('href')));
  const atualiza = () => {
    const alto = window.innerHeight;
    const meio = alto / 2;
    topo.classList.toggle('is-rolado', capa.getBoundingClientRect().bottom < 72);
    alvosNav.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      linksNav[i].setAttribute('aria-current', r.top <= meio && r.bottom > meio ? 'true' : 'false');
    });
    const visivel = capa.getBoundingClientRect().bottom < 0 && contato.getBoundingClientRect().top > alto * 0.9;
    fixo.classList.toggle('is-visivel', visivel);
    fixo.setAttribute('aria-hidden', String(!visivel));
    fixo.tabIndex = visivel ? 0 : -1;
  };
  let agendado = false;
  const aoRolar = () => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(() => { atualiza(); agendado = false; });
  };
  atualiza();
  window.addEventListener('scroll', aoRolar, { passive: true });
  window.addEventListener('resize', aoRolar);

  /* Montagem das fotos: cada foto entra e assenta nas cantoneiras quando chega à tela */
  const fotos = $$('[data-montar]');
  if (semMovimento || !('IntersectionObserver' in window)) {
    fotos.forEach((f) => f.classList.add('is-montada'));
  } else {
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-montada'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
    fotos.forEach((f) => obs.observe(f));
  }

  /* Comparador antes / depois (arrastar com o dedo ou o mouse; setas do teclado no controle) */
  $$('[data-comparar]').forEach((comp) => {
    const palco = $('[data-palco]', comp);
    const controle = $('[data-controle]', comp);
    const posiciona = (v) => palco.style.setProperty('--pos', `${v}%`);
    controle.addEventListener('input', () => posiciona(controle.value));
    const peloPonto = (x) => {
      const r = palco.getBoundingClientRect();
      const v = Math.round(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)));
      controle.value = v;
      posiciona(v);
    };
    // No toque, só arrasta quando o gesto é horizontal; a rolagem vertical continua livre.
    let arrastando = false;
    let inicio = null;
    let medido = false;
    palco.addEventListener('pointerdown', (e) => {
      if (!medido) { medir('uso_comparador', { caso: 'clareamento' }); medido = true; }
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
    palco.addEventListener('pointerup', solta);
    palco.addEventListener('pointercancel', solta);
    palco.addEventListener('click', () => controle.focus({ preventScroll: true }));
  });

  /* Pergunta sobre o convênio → mensagem pronta */
  const formPlano = $('[data-plano-form]');
  if (formPlano) {
    formPlano.addEventListener('submit', (e) => {
      e.preventDefault();
      const plano = $('[data-plano]', formPlano).value;
      let texto;
      if (plano === 'particular') texto = `${ABERTURA} Não tenho convênio e quero saber as condições para particular.`;
      else if (plano === 'outro') texto = `${ABERTURA} Meu plano não está na lista do site. Vocês atendem o meu convênio?`;
      else texto = `${ABERTURA} Tenho o plano ${plano} e quero saber se ele cobre o meu tratamento.`;
      medir('clique_whatsapp', { tratamento: 'convenio', origem: 'convenios', plano });
      abreWhats(texto);
    });
  }

  /* Formulário do contato → mensagem pronta no WhatsApp (nada é salvo).
     Sem JS, o formulário abre o WhatsApp da Unidade São Paulo sem mensagem. */
  const form = $('[data-form]');
  if (form) {
    const nome = $('#f-nome', form);
    const erroNome = $('#erro-nome', form);
    const erroInteresse = $('#erro-interesse', form);
    nome.addEventListener('input', () => {
      if (nome.value.trim()) { erroNome.hidden = true; nome.removeAttribute('aria-invalid'); }
    });
    $$('input[name=interesse]', form).forEach((r) => r.addEventListener('change', () => { erroInteresse.hidden = true; }));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const valorNome = nome.value.trim();
      const interesse = $('input[name=interesse]:checked', form);
      erroNome.hidden = !!valorNome;
      erroInteresse.hidden = !!interesse;
      if (!valorNome) nome.setAttribute('aria-invalid', 'true');
      if (!valorNome || !interesse) {
        (valorNome ? $('input[name=interesse]', form) : nome).focus();
        return;
      }
      const plano = $('#f-plano', form).value;
      const periodo = $('#f-periodo', form).value;
      const linhas = [
        `Olá! Meu nome é ${valorNome}. Vim pelo site da Eloy Verão, Unidade São Paulo (Jardim Aricanduva), e quero agendar uma avaliação.`,
        '',
        `• Procuro: ${interesse.value}`,
        `• Convênio: ${plano}`,
        `• Melhor período: ${periodo}`,
      ];
      medir('envio_formulario', { tratamento: interesse.value, plano });
      abreWhats(linhas.join('\n'));
    });
  }
})();
