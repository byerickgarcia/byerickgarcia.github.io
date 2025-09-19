// ano no footer
document.getElementById('year').textContent = new Date().getFullYear();

// menu mobile
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// fade on scroll
const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target);} });
},{threshold:0.14}) : null;

document.querySelectorAll('.fade').forEach(el=>{
  if (io) io.observe(el); else el.classList.add('show');
});

// lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCap');
const lbClose = document.getElementById('lbClose');

function openLB(src, cap){
  lbImg.src = src; lbImg.alt = cap || '';
  lbCap.textContent = cap || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLB(){
  lb.classList.remove('open'); lbImg.removeAttribute('src');
  document.body.style.overflow = '';
}
lbClose.addEventListener('click', closeLB);
lb.addEventListener('click', (e)=>{ if (e.target === lb) closeLB(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && lb.classList.contains('open')) closeLB(); });

document.querySelectorAll('.gallery a').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    openLB(a.href, a.dataset.caption);
  });
});

// formulário → WhatsApp
const form = document.getElementById('form');
const servico = document.getElementById('servico');
const pacote = document.getElementById('pacote');

// catálogos de pacotes
const catalogo = {
  'Social Media': ['Starter — R$ 1.200', 'Growth — R$ 2.400', 'Pro — R$ 3.800', 'Elite — R$ 6.000'],
  'Fotografia': ['Mini — R$ 1.500', 'Essencial — R$ 2.800', 'Premium — R$ 4.800'],
  'Videomaker': ['Start — R$ 1.800', 'Plus — R$ 3.200', 'Pro — R$ 5.500'],
  'Combo 3 em 1': ['Starter — R$ 2.500', 'Growth — R$ 4.500', 'Pro — R$ 7.500', 'Elite — R$ 12.000']
};

servico.addEventListener('change', ()=> {
  const s = servico.value;
  pacote.innerHTML = '';
  if (!catalogo[s]) {
    pacote.disabled = true;
    pacote.innerHTML = '<option value="">Selecione um serviço primeiro</option>';
    return;
  }
  catalogo[s].forEach(p=>{
    const opt = document.createElement('option');
    opt.value = p; opt.textContent = p;
    pacote.appendChild(opt);
  });
  pacote.disabled = false;
});

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const zap = document.getElementById('zap').value.trim();
  const s = servico.value;
  const p = pacote.value || 'A definir';
  const msg = document.getElementById('msg').value.trim();

  const texto = `Oi Erick! Enviei um briefing pelo site:

Nome: ${nome}
E-mail: ${email}
WhatsApp: ${zap}
Serviço: ${s}
Pacote: ${p}
Mensagem: ${msg || '—'}`;

  const url = `https://wa.me/5543988632851?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  form.reset();
  pacote.disabled = true;
});
