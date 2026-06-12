/* ===========================================================
   BELLONI MOTORS — página de veículo (galeria + WhatsApp)
   Config em assets/config.js (window.BELLONI_CONFIG)
   =========================================================== */
(function(){
  const C = window.BELLONI_CONFIG || {};
  const enc = encodeURIComponent;

  // ---- WhatsApp do carro ----
  const carName = document.body.dataset.car || "este veículo";
  const waNum = C.whatsapp || "";
  const carMsg = `Olá! Tenho interesse no ${carName} que vi no site da Belloni Motors. Pode me passar mais informações?`;
  document.querySelectorAll("[data-wa-car]").forEach(a=>{ a.href=`https://wa.me/${waNum}?text=${enc(carMsg)}`; a.target="_blank"; a.rel="noopener"; });
  // WhatsApp / Instagram genéricos (nav, footer, float)
  const waGen = `https://wa.me/${waNum}?text=${enc(C.whatsappMsg||"Olá! Vim pelo site da Belloni Motors.")}`;
  document.querySelectorAll("[data-wa]").forEach(a=>{ a.href=waGen; a.target="_blank"; a.rel="noopener"; });
  document.querySelectorAll("[data-ig]").forEach(a=>{ a.href=`https://instagram.com/${C.instagram||""}`; a.target="_blank"; a.rel="noopener"; });
  document.querySelectorAll("[data-ano]").forEach(e=>e.textContent=new Date().getFullYear());

  // ---- nav ----
  const nav=document.getElementById("nav");
  if(nav){ const f=()=>nav.classList.toggle("scrolled",window.scrollY>24); f(); addEventListener("scroll",f,{passive:true}); }
  const tg=document.getElementById("navToggle"), mm=document.getElementById("mobileMenu");
  tg?.addEventListener("click",()=>{ const o=mm.classList.toggle("open"); nav.classList.toggle("menu-open",o); document.body.style.overflow=o?"hidden":""; });
  mm?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{ mm.classList.remove("open"); nav.classList.remove("menu-open"); document.body.style.overflow=""; }));

  // ---- galeria: carrossel arrastável (mouse + toque) ----
  const stage=document.querySelector(".vg-main");
  const main=document.getElementById("vgMain");
  const thumbs=[...document.querySelectorAll(".vg-thumb")];
  const counter=document.getElementById("vgCounter");
  const photos=thumbs.map(t=>t.dataset.src);
  let i=0;

  // monta a faixa com todas as fotos lado a lado (reaproveita as imagens já baixadas nos thumbs)
  let track=null;
  if(stage && photos.length){
    track=document.createElement("div");
    track.className="vg-track";
    photos.forEach((src,k)=>{
      const sl=document.createElement("div"); sl.className="vg-slide";
      const im=document.createElement("img");
      im.src=src; im.alt=(main&&main.alt)||""; im.draggable=false; if(k>0) im.loading="lazy";
      sl.appendChild(im); track.appendChild(sl);
    });
    stage.insertBefore(track, stage.firstChild);
    if(main) main.remove();
  }

  const W=()=>stage?stage.clientWidth:0;  // clientWidth = sem borda; getBoundingClientRect inclui borda e causa drift
  function place(px,anim){
    if(!track) return;
    if(!anim){ track.style.transition="none"; track.style.transform=`translate3d(${px}px,0,0)`; return; }
    track.style.removeProperty("transition");
    track.getBoundingClientRect(); // força reflow: garante que a transição CSS está ativa antes do transform
    track.style.transform=`translate3d(${px}px,0,0)`;
  }
  function show(n){
    if(!photos.length) return;
    i=Math.max(0,Math.min(photos.length-1,n));
    place(-i*W(), true);
    if(counter) counter.textContent=`${i+1} / ${photos.length}`;
    thumbs.forEach((t,k)=>t.classList.toggle("active",k===i));
    thumbs[i]?.scrollIntoView({block:"nearest",inline:"center"});
    if(lb && lb.classList.contains("open")) lbImg.src=photos[i];
  }
  thumbs.forEach((t,k)=>t.addEventListener("click",()=>show(k)));
  document.querySelector(".vg-prev")?.addEventListener("click",()=>show(i-1));
  document.querySelector(".vg-next")?.addEventListener("click",()=>show(i+1));
  addEventListener("resize",()=>place(-i*W(),false));

  // ---- arrastar: a foto vizinha vai aparecendo enquanto você arrasta ----
  let down=false,dragging=false,startX=0,startY=0,moved=false,baseX=0;
  const thresh=()=>Math.max(40, W()*0.14);   // quanto precisa arrastar pra trocar
  stage?.addEventListener("dragstart",e=>e.preventDefault());   // mata o "fantasma" da imagem
  stage?.addEventListener("pointerdown",e=>{
    if(e.pointerType==="mouse" && e.button!==0) return;
    if(e.target.closest(".vg-nav,.vg-zoom")) return;            // botões funcionam normal
    down=true; dragging=false; moved=false; startX=e.clientX; startY=e.clientY; baseX=-i*W();
  });
  addEventListener("pointermove",e=>{
    if(!down) return;
    const dx=e.clientX-startX, dy=e.clientY-startY;
    if(!dragging){
      if(Math.abs(dx)>7 && Math.abs(dx)>Math.abs(dy)){ dragging=true; moved=true; stage.classList.add("dragging"); }
      else if(Math.abs(dy)>10){ down=false; return; }          // vertical => deixa a página rolar
      else return;
    }
    if(e.cancelable) e.preventDefault();
    let x=baseX+dx;
    const min=-(photos.length-1)*W(), max=0;
    if(x>max) x=max+(x-max)*0.35;                              // resistência nas bordas
    if(x<min) x=min+(x-min)*0.35;
    place(x,false);
  },{passive:false});
  function endDrag(e){
    if(!down) return;
    down=false;
    if(!dragging){ dragging=false; return; }
    dragging=false;
    stage.classList.remove("dragging");
    if(e.type==="pointercancel"){ show(i); return; }  // cancel = sempre volta pro atual
    const dx=e.clientX-startX;
    let target=i;
    if(dx<=-thresh()) target=i+1; else if(dx>=thresh()) target=i-1;
    show(target);
  }
  addEventListener("pointerup",endDrag);
  addEventListener("pointercancel",endDrag);

  // ---- lightbox ----
  const lb=document.getElementById("vgLightbox"), lbImg=document.getElementById("vgLbImg");
  function openLb(){ if(!lb)return; lbImg.src=photos[i]; lb.classList.add("open"); document.body.style.overflow="hidden"; }
  function closeLb(){ if(!lb)return; lb.classList.remove("open"); document.body.style.overflow=""; }
  stage?.addEventListener("click",e=>{ if(moved) return; if(e.target.closest(".vg-nav,.vg-zoom")) return; openLb(); });
  document.querySelector(".vg-zoom")?.addEventListener("click",openLb);
  lb?.querySelectorAll("[data-lbclose]").forEach(b=>b.addEventListener("click",closeLb));
  lb?.querySelector(".lb-prev")?.addEventListener("click",e=>{ e.stopPropagation(); show(i-1); });
  lb?.querySelector(".lb-next")?.addEventListener("click",e=>{ e.stopPropagation(); show(i+1); });
  addEventListener("keydown",e=>{
    if(lb && lb.classList.contains("open")){
      if(e.key==="Escape") closeLb();
      else if(e.key==="ArrowLeft") show(i-1);
      else if(e.key==="ArrowRight") show(i+1);
    }
  });

  show(0);

  // ---- equipamentos: "ver mais" se houver mais de 10 chips ----
  const EQUIP_LIMIT=10;
  const equipWrap=document.querySelector(".vdp-equip");
  if(equipWrap){
    const chips=[...equipWrap.querySelectorAll(".vdp-eq")];
    if(chips.length>EQUIP_LIMIT){
      const extra=chips.slice(EQUIP_LIMIT);
      extra.forEach(c=>c.classList.add("eq-hidden"));
      const btn=document.createElement("button");
      btn.className="eq-more-btn";
      btn.textContent=`Ver todos os ${chips.length} equipamentos`;
      btn.addEventListener("click",()=>{
        const open=equipWrap.classList.toggle("eq-expanded");
        extra.forEach(c=>c.classList.toggle("eq-hidden",!open));
        btn.textContent=open?`Ocultar equipamentos`:`Ver todos os ${chips.length} equipamentos`;
      });
      equipWrap.after(btn);
    }
  }
})();
