// script.js — efeitos e interações pesadas
(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');
  if (toggle && menu){
    toggle.addEventListener('click', ()=>{
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.style.display = open ? 'none' : 'flex';
    });
  }

  const cookieKey = 'eg_consent_max';
  const cookieBar = document.getElementById('cookie');
  const btnAccept = document.getElementById('cookie-accept');
  const hasConsent = () => localStorage.getItem(cookieKey)==='1' || document.cookie.includes(cookieKey+'=1');
  const giveConsent = () => {
    try{localStorage.setItem(cookieKey,'1');}catch(e){}
    try{document.cookie=cookieKey+'=1;path=/;max-age='+(60*60*24*365);}catch(e){}
    cookieBar.style.display='none';
  };
  if (cookieBar && !hasConsent()){
    cookieBar.style.display='flex';
    btnAccept?.addEventListener('click', giveConsent);
  }

  const form = document.getElementById('form');
  if (form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const data = new FormData(form);
      const nome = encodeURIComponent(data.get('nome')||'');
      const email = encodeURIComponent(data.get('email')||'');
      const msg = encodeURIComponent(data.get('msg')||'');
      const txt = `Oi Erick, sou ${nome} (${email}). ${msg}`;
      window.open('https://wa.me/5543988632851?text='+txt, '_blank');
    });
  }

  // Partículas no Canvas
  const canvas = document.getElementById('particles');
  if (canvas && window.matchMedia('(min-width: 961px)').matches){
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    function resize(){
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w; canvas.height = h;
    }
    function rand(a,b){return Math.random()*(b-a)+a;}
    function init(){
      resize();
      particles = new Array(240).fill(0).map(()=>({x:rand(0,w), y:rand(0,h), r:rand(.5,2.2), vx:rand(-.3,.3), vy:rand(-.3,.3)}));
    }
    function step(){
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle = 'rgba(255,255,255,.7)';
      for (const p of particles){
        p.x+=p.vx; p.y+=p.vy;
        if (p.x<0||p.x>w) p.vx*=-1;
        if (p.y<0||p.y>h) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(step);
    }
    window.addEventListener('resize', resize);
    init(); step();
  }
})();
