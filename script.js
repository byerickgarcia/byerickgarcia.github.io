// util curto
const $ = (s, r=document) => r.querySelector(s);

// ano
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

// sticky CTA: aparece só quando sair do herói (melhor UX no iPhone)
(() => {
  const sticky = document.querySelector('.sticky');
  const hero = document.getElementById('inicio');
  if (!sticky || !hero || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(([entry]) => {
    sticky.style.display = entry.isIntersecting ? 'none' : 'flex';
  }, { threshold: 0.15 });
  io.observe(hero);
})();

// form -> WhatsApp com mensagem pronta
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
