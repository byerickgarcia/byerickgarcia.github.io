// Ano no footer
document.getElementById('year').textContent = new Date().getFullYear();

// Progress bar do scroll
const progress = document.getElementById('progress');
const onScroll = () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
  progress.style.width = (scrolled * 100) + '%';
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const hamb = document.getElementById('hamb');
const mobile = document.getElementById('mobile');
if (hamb && mobile) {
  hamb.addEventListener('click', () => {
    const open = mobile.getAttribute('aria-hidden') === 'true';
    mobile.setAttribute('aria-hidden', open ? 'false' : 'true');
    hamb.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // Fechar ao clicar em link
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobile.setAttribute('aria-hidden', 'true');
    hamb.setAttribute('aria-expanded', 'false');
  }));
}

// Reveal on scroll
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// Lightbox (teclado e clique)
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-cap');
const lbClose = lb.querySelector('.lb-close');
let galleryItems = Array.from(document.querySelectorAll('.g-item'));
let currentIndex = -1;

function openLB(index) {
  const btn = galleryItems[index];
  if (!btn) return;
  lbImg.src = btn.dataset.img;
  lbImg.alt = btn.dataset.cap || '';
  lbCap.textContent = btn.dataset.cap || '';
  currentIndex = index;
  lb.setAttribute('aria-hidden', 'false');
  lb.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLB() {
  lb.classList.remove('show');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
  currentIndex = -1;
}

galleryItems.forEach((btn, i) => {
  btn.addEventListener('click', () => openLB(i));
});

lbClose.addEventListener('click', closeLB);
lb.addEventListener('click', (e) => { if (e.target === lb) closeLB(); });
document.addEventListener('keydown', (e) => {
  if (lb.classList.contains('show')) {
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowRight') openLB(Math.min(currentIndex + 1, galleryItems.length - 1));
    if (e.key === 'ArrowLeft') openLB(Math.max(currentIndex - 1, 0));
  }
});

// Parallax leve no hero (performance safe)
const hero = document.querySelector('.hero-bg');
let raf;
window.addEventListener('mousemove', (e) => {
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const x = (e.clientX / window.innerWidth - 0.5) * 6;
    const y = (e.clientY / window.innerHeight - 0.5) * 6;
    hero.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// Form -> WhatsApp
const form = document.getElementById('contact-form');
function err(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.hidden = !msg; }
}
function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    err('nome-error',''); err('whatsapp-error',''); err('email-error','');

    const nome = document.getElementById('nome').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const email = document.getElementById('email').value.trim();
    const projeto = document.getElementById('projeto').value;
    const orcamento = document.getElementById('orcamento').value;
    const mensagem = document.getElementById('mensagem').value;

    let ok = true;
    if (!nome){ err('nome-error','Nome é obrigatório'); ok = false; }
    if (!whatsapp){ err('whatsapp-error','WhatsApp é obrigatório'); ok = false; }
    if (!email || !validEmail(email)){ err('email-error','E-mail válido é obrigatório'); ok = false; }
    if (!ok) return;

    const text = `Oi Erick! Enviei um briefing pelo site:

Nome: ${nome}
Email: ${email}
WhatsApp: ${whatsapp}
Projeto: ${projeto || 'Não especificado'}
Orçamento: ${orcamento || 'Não especificado'}
Mensagem: ${mensagem || 'Nenhuma mensagem adicional'}`;

    const url = `https://wa.me/5543988632851?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    form.reset();
  });
}
