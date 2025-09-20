// atalho
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

// FAB: só aparece quando sair do herói (evita poluição no topo)
(() => {
  const fab = document.querySelector('.sticky-fab');
  const hero = document.getElementById('inicio');
  if (!fab || !hero || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(([entry]) => {
    fab.style.display = entry.isIntersecting ? 'none' : 'flex';
  }, {threshold: 0.12});
  io.observe(hero);
})();

// formulário -> WhatsApp com mensagem pronta
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
