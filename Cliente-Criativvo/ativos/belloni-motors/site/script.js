/* ===========================================================
   BELLONI MOTORS — interações da home
   Configuração fica em assets/config.js (window.BELLONI_CONFIG)
   =========================================================== */
const CONFIG = window.BELLONI_CONFIG || {};

/* ---------- aplica config no DOM ---------- */
(function applyConfig(){
  const waLink = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMsg)}`;
  const igLink = `https://instagram.com/${CONFIG.instagram}`;
  const telLink = `https://wa.me/${CONFIG.whatsapp}`;
  const mapLink = CONFIG.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([CONFIG.endereco, CONFIG.cidade].filter(Boolean).join(", ") || CONFIG.mapsQuery)}`;

  document.querySelectorAll("[data-wa]").forEach(el=>{ el.href = waLink; el.target="_blank"; el.rel="noopener"; });
  document.querySelectorAll("[data-ig]").forEach(el=>{ el.href = igLink; el.target="_blank"; el.rel="noopener"; });
  document.querySelectorAll("[data-tel-link]").forEach(el=>{ el.href = telLink; el.target="_blank"; el.rel="noopener"; });
  document.querySelectorAll("[data-map-link]").forEach(el=>{ el.href = mapLink; el.target="_blank"; el.rel="noopener"; });
  if(CONFIG.facebookUrl) document.querySelectorAll("[data-fb]").forEach(el=>{ el.href=CONFIG.facebookUrl; el.target="_blank"; el.rel="noopener"; });
  if(CONFIG.linkedinUrl) document.querySelectorAll("[data-li]").forEach(el=>{ el.href=CONFIG.linkedinUrl; el.target="_blank"; el.rel="noopener"; });
  if(CONFIG.googleReviewUrl) document.querySelectorAll("[data-gr]").forEach(el=>{ el.href=CONFIG.googleReviewUrl; el.target="_blank"; el.rel="noopener"; });

  const set = (sel,val)=>document.querySelectorAll(sel).forEach(e=>e.textContent=val);
  set("[data-endereco]", CONFIG.endereco);
  set("[data-cidade]", CONFIG.cidade);
  set("[data-telefone]", CONFIG.telefone);
  set("[data-horario1]", CONFIG.horario1);
  set("[data-horario2]", CONFIG.horario2);

  const map = document.querySelector("[data-map]");
  if(map){ map.src = CONFIG.mapsEmbed || `https://maps.google.com/maps?q=${encodeURIComponent(CONFIG.mapsQuery)}&t=&z=17&ie=UTF8&iwloc=&output=embed`; }
})();

/* ---------- nav: fundo ao rolar ---------- */
const nav = document.getElementById("nav");
const onScroll = ()=> nav.classList.toggle("scrolled", window.scrollY > 24);
onScroll();
window.addEventListener("scroll", onScroll, {passive:true});

/* ---------- menu mobile ---------- */
const toggle = document.getElementById("navToggle");
const menu = document.getElementById("mobileMenu");
const closeMenu = ()=>{ menu.classList.remove("open"); nav.classList.remove("menu-open"); document.body.style.overflow=""; };
toggle?.addEventListener("click", ()=>{
  const open = menu.classList.toggle("open");
  nav.classList.toggle("menu-open", open);
  document.body.style.overflow = open ? "hidden" : "";
});
menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click", closeMenu));

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
  });
},{threshold:0.12, rootMargin:"0px 0px -8% 0px"});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

/* ---------- ano atual no rodapé ---------- */
document.querySelectorAll("[data-ano]").forEach(e=>e.textContent = new Date().getFullYear());

/* ---------- showroom: expansão por scroll + slideshow ---------- */
(function(){
  const section = document.getElementById("showroom");
  const card    = document.getElementById("leCard");
  const bg      = document.getElementById("leBg");
  const tA      = document.getElementById("leTa");
  const tB      = document.getElementById("leTb");
  const hint    = document.getElementById("leHint");
  const bar     = document.getElementById("leBar");
  if(!section || !card) return;

  // --- expansão por scroll ---
  let mob = window.innerWidth < 768, raf = null;

  function applyProgress(p){
    const W = window.innerWidth, H = window.innerHeight;
    const iW = mob ? 260 : 300, iH = mob ? 340 : 400;
    const cW = iW + p*(W-iW), cH = iH + p*(H-iH);
    const radius = (1-p)*18;
    card.style.width  = cW+"px";
    card.style.height = cH+"px";
    card.style.borderRadius = radius+"px";
    card.style.left = ((W-cW)/2)+"px";
    card.style.top  = ((H-cH)/2)+"px";
    const tx = p*(mob?170:140);
    tA.style.transform = `translateX(-${tx}vw)`;
    tB.style.transform = `translateX(${tx}vw)`;
    bg.style.opacity  = 1-p;
    hint.style.opacity = p>0.1 ? 0 : 1;
    bar.style.width   = (p*100)+"%";
  }

  function onScroll(){
    raf = null;
    const scrolled = -section.getBoundingClientRect().top;
    const range = section.offsetHeight - window.innerHeight;
    applyProgress(Math.max(0, Math.min(1, scrolled/range)));
  }

  window.addEventListener("scroll", ()=>{ if(!raf) raf=requestAnimationFrame(onScroll); }, {passive:true});
  window.addEventListener("resize", ()=>{ mob=window.innerWidth<768; onScroll(); });
  onScroll();

  // --- slideshow ---
  const slides = [...document.querySelectorAll(".lp-slide")];
  const dotsWrap = document.getElementById("lojaDots");
  if(slides.length<2 || !dotsWrap) return;
  let idx=0, timer=null;
  slides.forEach((_,k)=>{
    const b=document.createElement("button");
    b.type="button"; b.setAttribute("aria-label",`Ver foto ${k+1}`);
    if(k===0) b.classList.add("on");
    b.addEventListener("click",()=>{ go(k); restart(); });
    dotsWrap.appendChild(b);
  });
  const dots=[...dotsWrap.children];
  function go(n){ idx=(n+slides.length)%slides.length; slides.forEach((s,k)=>s.classList.toggle("is-on",k===idx)); dots.forEach((d,k)=>d.classList.toggle("on",k===idx)); }
  function start(){ if(!timer) timer=setInterval(()=>go(idx+1),4000); }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }
  function restart(){ stop(); start(); }
  card.addEventListener("mouseenter",stop);
  card.addEventListener("mouseleave",start);
  new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?start():stop()),{threshold:.2}).observe(section);
})();


/* ---------- efeito 3D (tilt) nos cards de diferenciais ---------- */
if(!matchMedia("(prefers-reduced-motion: reduce)").matches && matchMedia("(hover:hover)").matches){
  document.querySelectorAll(".dif-card").forEach(card=>{
    card.addEventListener("mouseenter",()=>{ card.style.transition="transform .12s ease-out, box-shadow .4s var(--ease), border-color .4s"; });
    card.addEventListener("mousemove",e=>{
      const r=card.getBoundingClientRect();
      const px=(e.clientX-r.left)/r.width-.5;
      const py=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`rotateX(${(-py*7).toFixed(2)}deg) rotateY(${(px*9).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave",()=>{ card.style.transition=""; card.style.transform=""; });
  });
}
