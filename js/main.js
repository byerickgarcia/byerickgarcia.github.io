/*
  Erick Garcia – JS Base
  - Menu mobile
  - Scroll reveal
  - Lightbox acessível
  - Âncoras com scroll suave
  - Validação do formulário + WhatsApp
*/

// ---------- helpers
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ---------- menu mobile
(() => {
  const nav = $('.nav');
  const btn = $('.menu-toggle');
  const links = $('.nav-links');
  if (!btn || !nav || !links) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    const expanded = nav.classList.contains('is-open');
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });

  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') nav.classList.remove('is-open');
  });
})();

// ---------- smooth anchors (só para a mesma página)
(() => {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const el = $(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });
})();

// ---------- scroll reveal
(() => {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(el => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
})();

// ---------- lightbox simples e acessível
(() => {
  const lb = $('#lightbox');
  if (!lb) return;

  const img = $('#lightbox-img');
  const caption = $('#lightbox-caption');
  const close = $('#lightbox-close');

  let lastFocus = null;

  window.openLightbox = (src, cap = '') => {
    lastFocus = document.activeElement;
    img.src = src;
    img.alt = cap;
    caption.textContent = cap;
    lb.classList.add('is-active');
    lb.setAttribute('aria-hidden', 'false');
    setTimeout(() => img.focus(), 50);
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = () => {
    lb.classList.remove('is-active');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };

  lb.addEventListener('click', (e) => {
    if (e.target === lb) window.closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('is-active')) window.closeLightbox();
  });
  if (close) close.addEventListener('click', window.closeLightbox);
})();

// ---------- formulário -> WhatsApp
(() => {
  const form = $('#contact-form');
  if (!form) return;

  const get = (id) => $(id);
  const showError = (id, msg) => {
    const el = get(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
  };
  const clearErrors = () => $$('.helper').forEach(h => { h.textContent = ''; h.classList.remove('is-visible'); });
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const nome = $('#nome')?.value.trim();
    const whatsapp = $('#whatsapp')?.value.trim();
    const email = $('#email')?.value.trim();
    let ok = true;

    if (!nome) { showError('#nome-error', 'Nome é obrigatório'); ok = false; }
    if (!whatsapp) { showError('#whatsapp-error', 'WhatsApp é obrigatório'); ok = false; }
    if (!email || !isEmail(email)) { showError('#email-error', 'E-mail válido é obrigatório'); ok = false; }

    if (!ok) return;

    const projeto = $('#projeto')?.value || 'Não especificado';
    const orcamento = $('#orcamento')?.value || 'Não especificado';
    const mensagem = $('#mensagem')?.value || 'Nenhuma mensagem adicional';

    const text = `Oi Erick! Enviei um briefing pelo site:

Nome: ${nome}
Email: ${email}
WhatsApp: ${whatsapp}
Projeto: ${projeto}
Orçamento: ${orcamento}
Mensagem: ${mensagem}`;

    const url = `https://wa.me/5543988632851?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    form.reset();
    alert('Briefing enviado! Abrindo o WhatsApp…');
  });
})();

// ---------- melhoria de performance (lazy nos <img> que faltarem)
(() => {
  $$('img').forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
  });
})();
