// util
const $ = (s, r=document) => r.querySelector(s);

// ano no rodapé
(() => { const y = $('#year'); if (y) y.textContent = new Date().getFullYear(); })();

// menu mobile
(() => {
  const btn = $('#menuToggle'), menu = $('#menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('show');
  }, {passive:true});
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    btn.setAttribute('aria-expanded','false');
    menu.classList.remove('show');
  }, {passive:true}));
})();

// FAB aparece só após o herói
(() => {
  const fab = document.querySelector('.sticky-fab');
  const hero = document.getElementById('inicio');
  if (!fab || !hero || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(([entry]) => {
    fab.style.display = entry.isIntersecting ? 'none' : 'flex';
  }, {threshold: 0.12});
  io.observe(hero);
})();

/* ===== CONFIGURAÇÃO DE VAGAS (edite aqui quando quiser) ===== */
(() => {
  const CAP_GLOBAL = 6;   // capacidade total de clientes ativos/mês
  const OCUPADAS   = 4;   // quantas vagas já estão ocupadas

  const vagasPorPlano = {
    "Pulse Start": 2,
    "Pulse Pro": 2,
    "Authority Core": 1,
    "Authority Plus": 1,
    "Momentum VIP": 0,
    "Momentum Elite": 0
  };

  const capEl = $('#cap-counter');
  if (capEl) capEl.textContent = `${OCUPADAS}/${CAP_GLOBAL} ocupadas`;

  document.querySelectorAll('.plan').forEach(card => {
    const name = card.dataset.plan;
    const datasetSlots = Number(card.dataset.slots);
    const vagas = Number.isFinite(datasetSlots) ? datasetSlots : (vagasPorPlano[name] ?? 0);
    const numEl = card.querySelector('.slots-num');
    const cta = card.querySelector('.cta');

    if (numEl) numEl.textContent = vagas;

    if (cta) {
      if (vagas <= 0) {
        cta.textContent = 'Entrar na lista de espera';
        cta.classList.remove('primary');
        cta.classList.add('ghost');
        cta.href = `https://wa.me/5543988632851?text=Quero%20entrar%20na%20lista%20de%20espera%20do%20plano%20${encodeURIComponent(name)}`;
      } else {
        cta.textContent = 'Garantir vaga';
        cta.classList.add('primary');
        cta.href = '#'; // abriremos o modal para coletar nome/empresa e montar mensagem
      }
    }
  });
})();

/* ===== Indicador de Interesse (estimativa honesta) ===== */
(() => {
  const el = document.getElementById('liveCount');
  if (!el) return;

  // faixa base por tipo de tela
  const isMobile = matchMedia('(max-width: 960px)').matches;
  let min = isMobile ? 14 : 8;
  let max = isMobile ? 42 : 26;

  // horários de pico
  const hr = new Date().getHours();
  if ([10,11,12,18,19,20].includes(hr)) { min+=4; max+=8; }

  let current = Math.floor((min+max)/2);
  const step = () => {
    const drift = Math.floor((Math.random()*3) - 1); // -1,0,1
    current = Math.max(min, Math.min(max, current + drift));
    el.textContent = String(current);
  };
  step();
  setInterval(step, 1500 + Math.random()*1500);
})();

/* ===== Modal de Plano -> WhatsApp com mensagem pronta ===== */
(() => {
  const modal = document.getElementById('leadModal');
  const openBtns = document.querySelectorAll('.cta, .open-modal'); // botões dos cards + FAB
  const closeBtn = document.getElementById('leadClose');
  const cancelBtn = document.getElementById('leadCancel');
  const form = document.getElementById('leadForm');
  const nome = document.getElementById('leadNome');
  const emp = document.getElementById('leadEmpresa');
  const plano = document.getElementById('leadPlano');
  const msg = document.getElementById('leadMsg');
  const consent = document.getElementById('leadConsent');

  if (!modal || !form) return;

  const show = () => {
    try {
      const cache = JSON.parse(localStorage.getItem('eg_lead_cache')||'{}');
      if (cache.nome) nome.value = cache.nome;
      if (cache.empresa) emp.value = cache.empresa;
    } catch(e){}
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    modal.setAttribute('aria-modal','true');
  };

  const hide = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    modal.setAttribute('aria-modal','false');
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // se veio de um card, pré-seleciona o plano
      const card = e.currentTarget.closest('.plan');
      if (card && plano) {
        const planName = card.dataset.plan || '';
        Array.from(plano.options).forEach(o => o.selected = (o.value === planName));
      }
      show();
      e.preventDefault();
    }, {passive:false});
  });

  [closeBtn, cancelBtn].forEach(b => b && b.addEventListener('click', hide));
  modal.addEventListener('click', (e)=>{ if (e.target === modal) hide(); });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (!consent.checked) { alert('Confirme o consentimento para contato no WhatsApp.'); return; }

    // salva cache
    try{
      localStorage.setItem('eg_lead_cache', JSON.stringify({ nome: nome.value, empresa: emp.value }));
    }catch(e){}

    const dados = {
      nome: nome.value.trim(),
      empresa: emp.value.trim(),
      plano: plano.value,
      msg: msg.value.trim()
    };

    const base = `Oi Erick, meu nome é ${dados.nome}${dados.empresa ? ` (${dados.empresa})` : ''}.`;
    const escolha = `Quero garantir minha vaga no plano ${dados.plano}.`;
    const extra = dados.msg ? ` Detalhes: ${dados.msg}` : '';
    const final = encodeURIComponent(`${base} ${escolha}.${extra}`);

    window.open('https://wa.me/5543988632851?text=' + final, '_blank');
    hide();
  });
})();

/* ===== Form de contato (fallback) -> WhatsApp ===== */
(() => {
  const form = $('#form'); if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const nome = encodeURIComponent(data.get('nome')||'');
    const email = encodeURIComponent(data.get('email')||'');
    const msg = encodeURIComponent(data.get('msg')||'');
    const txt = `Oi Erick, sou ${nome} (${email}). ${msg}`;
    window.open('https://wa.me/5543988632851?text='+txt, '_blank');
  });
})();
