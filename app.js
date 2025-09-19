// Utilidades simples de UX, consentimento e métricas (placeholders)
(function(){
  const $ = (s,ctx=document)=>ctx.querySelector(s);
  const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));

  // Mobile menu
  const toggle = $('.nav-toggle');
  const menu = $('#menu');
  if(toggle && menu){
    toggle.addEventListener('click', ()=>{
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.style.display = open ? 'none' : 'flex';
    });
  }

  // Ano no footer
  const y = new Date().getFullYear();
  const spanY = $('#year');
  if(spanY) spanY.textContent = y;

  // Cookie consent (LGPD)
  const cookieKey = 'eg_consent';
  const banner = document.querySelector('.cookie');
  if(banner && !localStorage.getItem(cookieKey)){
    banner.hidden = false;
    banner.querySelector('.accept').addEventListener('click', ()=>{
      localStorage.setItem(cookieKey, '1');
      banner.hidden = true;
    });
  }

  // Eventos de CTA (ex.: usar com GTM/GA4)
  window.dataLayer = window.dataLayer || [];
  $$('[data-cta]').forEach(el=>{
    el.addEventListener('click', ()=>{
      window.dataLayer.push({ event: 'cta_click', id: el.dataset.cta, page: location.pathname });
    });
  });

  // Registro do Service Worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  }
})();
