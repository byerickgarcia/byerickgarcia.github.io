// ---------- util
const $ = (q,ctx=document)=>ctx.querySelector(q);
const $$ = (q,ctx=document)=>Array.from(ctx.querySelectorAll(q));
const yearEl = $("#year"); if(yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- menu mobile
const menuBtn = $("#menuBtn");
const menu = $("#menu");
if(menuBtn && menu){
  menuBtn.addEventListener("click", ()=>{
    const open = menu.classList.toggle("show");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    play("click");
  });
  $$("#menu a").forEach(a=>a.addEventListener("click", ()=> menu.classList.remove("show")));
}

// ---------- reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("show"); io.unobserve(e.target); }});
},{threshold: .12, rootMargin: "0px 0px -80px 0px"});
$$(".reveal").forEach(el=>io.observe(el));

// ---------- lightbox
const lb = $("#lightbox"), lbImg = $("#lbImg"), lbClose = $("#lbClose");
$$(".gallery__item").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    lbImg.src = btn.dataset.img;
    lb.classList.add("show");
    lb.setAttribute("aria-hidden","false");
    play("open");
  });
});
lbClose.addEventListener("click", ()=>{ lb.classList.remove("show"); lb.setAttribute("aria-hidden","true"); play("close"); });
lb.addEventListener("click", e=>{ if(e.target===lb) { lb.classList.remove("show"); lb.setAttribute("aria-hidden","true"); }});

// ---------- tabs
const tabs = $$(".tab");
const panes = $$(".plans");
tabs.forEach(t=>{
  t.addEventListener("click", ()=>{
    tabs.forEach(x=>x.classList.remove("is-active"));
    panes.forEach(p=>p.classList.remove("is-active"));
    t.classList.add("is-active");
    $(`.plans[data-pane="${t.dataset.tab}"]`).classList.add("is-active");
    play("hover");
  });
});

// ---------- catálogo de pacotes (valores premium)
const CATALOG = {
  fotografia: [
    { id:'foto_starter', nome:'Fotografia — Starter (R$ 1.500)', desc:'Sessão 1h • até 20 fotos editadas • Entrega digital' },
    { id:'foto_pro',     nome:'Fotografia — Pro (R$ 3.000)',     desc:'Sessão 2h • até 50 fotos editadas • Tratamento profissional' },
    { id:'foto_premium', nome:'Fotografia — Premium (R$ 5.000)', desc:'Sessão 4h • até 120 fotos editadas • Direção criativa' },
  ],
  videomaker: [
    { id:'vid_starter',  nome:'Videomaker — Starter (R$ 1.200)', desc:'2 vídeos curtos (≤60s) • Edição com legenda' },
    { id:'vid_pro',      nome:'Videomaker — Pro (R$ 2.500)',     desc:'6 curtos + 1 longo (3min) • Thumb + edição avançada' },
    { id:'vid_premium',  nome:'Videomaker — Premium (R$ 5.000)', desc:'10 curtos + 2 longos (5min) • Versões vertical & horizontal' },
  ],
  social: [
    { id:'soc_start',    nome:'Social Media — Starter (R$ 1.200/mês)', desc:'12 posts/mês • Design simples • Sem calendário' },
    { id:'soc_growth',   nome:'Social Media — Growth (R$ 2.500/mês)',  desc:'20 posts/mês + 2 Reels • Calendário básico' },
    { id:'soc_pro',      nome:'Social Media — Pro (R$ 4.500/mês)',     desc:'30 posts/mês + 4 Reels • Calendário estratégico' },
    { id:'soc_elite',    nome:'Social Media — Elite (R$ 7.000/mês)',   desc:'30 posts + 8 Reels • Sessão de fotos • Relatórios' },
  ],
  combo: [
    { id:'cmb_start',    nome:'Combo 3-em-1 — Starter (R$ 2.500)', desc:'Social: 12 posts • Foto: 20 fotos • 4 Reels • 1 vídeo longo opcional (2min) ou +2 Reels' },
    { id:'cmb_growth',   nome:'Combo 3-em-1 — Growth (R$ 4.900)',  desc:'Social: 20 posts • Foto: 50 fotos • 8 Reels • +1 vídeo longo' },
    { id:'cmb_pro',      nome:'Combo 3-em-1 — Pro (R$ 7.900)',     desc:'Social: 30 posts • Foto: 120 fotos • 12 Reels • +2 vídeos longos • Gravação 1 dia' },
    { id:'cmb_elite',    nome:'Combo 3-em-1 — Elite (R$ 12.000)',  desc:'Social: 30 posts • Foto: 200+ fotos • 20 Reels • +4 vídeos longos • Gravação 2 dias' },
  ]
};

// ---------- formulário
const selServico = $("#servico");
const selPacote = $("#pacote");
const hint = $("#pacote-hint");
function fillPackages(key){
  selPacote.innerHTML = "";
  if(!CATALOG[key]){ selPacote.disabled = true; selPacote.innerHTML = `<option>Selecione um serviço primeiro</option>`; hint.textContent=""; return; }
  CATALOG[key].forEach(p=>{
    const opt = document.createElement("option");
    opt.value = p.id; opt.textContent = p.nome; opt.dataset.desc = p.desc;
    selPacote.appendChild(opt);
  });
  selPacote.disabled = false;
  hint.textContent = CATALOG[key][0].desc;
}
selServico.addEventListener("change", e=>{ fillPackages(e.target.value); play("hover"); });
selPacote.addEventListener("change", e=>{
  const d = e.target.selectedOptions[0]?.dataset?.desc || "";
  hint.textContent = d; play("hover");
});

const form = $("#contactForm");
form?.addEventListener("submit", (e)=>{
  e.preventDefault();
  const nome = $("#nome").value.trim();
  const email = $("#email").value.trim();
  const whats = $("#whats").value.trim();
  const svc = $("#servico").value;
  const pkgOpt = $("#pacote").selectedOptions[0];
  const pkg = pkgOpt ? pkgOpt.textContent : "";
  const msg = $("#msg").value.trim();

  // valida
  let ok = true;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  $("#nome-err").textContent = nome ? "" : "Informe seu nome";
  $("#email-err").textContent = email && emailRe.test(email) ? "" : "E-mail inválido";
  $("#whats-err").textContent = whats ? "" : "Informe seu WhatsApp";
  if(!nome || !emailRe.test(email) || !whats) ok = false;
  if(!ok){ play("err"); return; }

  const texto = `Oi Erick! Cheguei pelo site e quero orçamento.

Nome: ${nome}
E-mail: ${email}
WhatsApp: ${whats}
Serviço: ${svc || '—'}
Pacote: ${pkg || '—'}
Mensagem: ${msg || '—'}`;

  const url = `https://wa.me/5543988632851?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  play("send");
  form.reset();
  $("#pacote").disabled = true;
  $("#pacote").innerHTML = `<option>Selecione um serviço primeiro</option>`;
  hint.textContent = "";
});

// ---------- som (WebAudio, sem arquivo)
let audioCtx;
let soundOn = false;
const soundToggle = $("#soundToggle");
function beep(type="sine", dur=0.05, freq=480, vol=0.05){
  if(!soundOn) return;
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.value = vol;
  o.connect(g).connect(audioCtx.destination);
  o.start();
  setTimeout(()=>{o.stop()}, dur*1000);
}
function play(ev){
  if(!soundOn) return;
  if(ev==="hover") beep("triangle", .04, 520, .035);
  if(ev==="click") beep("sine", .06, 420, .05);
  if(ev==="open") beep("triangle", .08, 560, .06);
  if(ev==="close") beep("sine", .06, 360, .05);
  if(ev==="send") { beep("sawtooth", .06, 600, .06); setTimeout(()=>beep("sine", .06, 800, .05), 80); }
  if(ev==="err") { beep("square", .08, 260, .06); setTimeout(()=>beep("square", .08, 220, .06), 80); }
}
soundToggle?.addEventListener("click", ()=>{
  soundOn = !soundOn;
  soundToggle.setAttribute("aria-pressed", soundOn ? "true":"false");
  soundToggle.title = soundOn ? "Som: ligado" : "Som: desligado";
  play("click");
});

// ---------- botões WhatsApp nos cards
$$(".whats").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const pkg = btn.dataset.pkg || "Pacote";
    const text = `Oi Erick! Gostei do pacote: ${pkg}`;
    const url = `https://wa.me/5543988632851?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    play("send");
  })
});
