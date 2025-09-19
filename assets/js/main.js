// injeta header e footer em TODAS as páginas
async function inject(partial, targetId){
  const res = await fetch(partial); const html = await res.text();
  document.getElementById(targetId).innerHTML = html;
}
(async()=>{
  if(document.getElementById('header')) await inject('partials/header.html','header');
  if(document.getElementById('footer')) await inject('partials/footer.html','footer');

  // depois que o header existir, ativa o hambúrguer
  const tryEnableNav = ()=>{
    const hamb = document.getElementById('hamb');
    const nav  = document.getElementById('nav');
    if(!hamb || !nav) return;
    hamb.addEventListener('click',()=>{
      const open = nav.classList.toggle('open');
      hamb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // fecha ao clicar no link
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  };
  // pequeno atraso para garantir injeção
  setTimeout(tryEnableNav, 50);

  // ano no footer
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
})();
