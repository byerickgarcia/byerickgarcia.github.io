// util rápido
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
    menu.style.display = open ? 'none' : 'flex';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (matchMedia('(max-width: 960px)').matches) { btn.setAttribute('aria-expanded','false'); menu.style.display='none'; }
  }));
})();

// cookie (3 fallbacks) + inline seguro no botão se o JS falhar
(() => {
  const KEY='eg_consent_new', bar=$('#cookie'), ok=$('#cookieOk');
  if(!bar) return;
  const has = () => localStorage.getItem(KEY)==='1' || document.cookie.includes(KEY+'=1') || sessionStorage.getItem(KEY)==='1';
  const give = () => { try{localStorage.setItem(KEY,'1')}catch(e){}; try{document.cookie=KEY+'=1;path=/;max-age=31536000'}catch(e){}; try{sessionStorage.setItem(KEY,'1')}catch(e){}; bar.hidden=true; };
  if(!has()){ bar.hidden=false; ok.addEventListener('click', give, {passive:true}); }
})();

// formulário -> abre WhatsApp com a mensagem
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
