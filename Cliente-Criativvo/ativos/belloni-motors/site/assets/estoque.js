/* ===========================================================
   BELLONI MOTORS — catálogo de estoque
   Filtros recolhíveis + rascunho com botão "Aplicar"
   (a grade só muda ao Aplicar; coleções e busca são instantâneas)
   =========================================================== */
(function(){
  const DATA = (window.BELLONI_STOCK || []).slice();
  const $  = s => document.querySelector(s);
  const esc = s => (s||"").toString().replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));
  const norm = s => (s||"").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
  const brl = n => "R$ " + n.toLocaleString("pt-BR");
  const plural = n => `${n} ${n===1?"veículo":"veículos"}`;
  if(!DATA.length) return;

  // limites
  const prices = DATA.map(c=>c.price).filter(Boolean);
  const PMIN = Math.min(...prices), PMAX = Math.max(...prices);
  const years = DATA.map(c=>c.year).filter(Boolean);
  const YMIN = Math.min(...years), YMAX = Math.max(...years);
  const KMAX = Math.max(...DATA.map(c=>c.km||0));

  const count = key => { const m={}; DATA.forEach(c=>{const v=c[key]; if(v)m[v]=(m[v]||0)+1;}); return m; };
  const byBrand=count("brand"), byCat=count("category"), byFuel=count("fuel"), byTrans=count("transmission");
  const order = obj => Object.keys(obj).sort((a,b)=>obj[b]-obj[a]).filter(k=>obj[k]);

  // ---- estado: F = ativo (renderiza) | D = rascunho (sidebar) ----
  const blankSide = () => ({brand:new Set(),category:new Set(),fuel:new Set(),transmission:new Set(),priceMax:PMAX,yearMin:YMIN,kmMax:KMAX,premium:false});
  const cloneSide = s => ({brand:new Set(s.brand),category:new Set(s.category),fuel:new Set(s.fuel),transmission:new Set(s.transmission),priceMax:s.priceMax,yearMin:s.yearMin,kmMax:s.kmMax,premium:s.premium});
  const sideDirty = s => s.brand.size||s.category.size||s.fuel.size||s.transmission.size||s.premium||s.priceMax<PMAX||s.yearMin>YMIN||s.kmMax<KMAX;
  const F = { q:"", side:blankSide(), sort:"relevancia", collection:"" };
  let D = cloneSide(F.side);

  function matches(c,q,side){
    if(q){ const h=norm(`${c.title} ${c.brand} ${c.category} ${c.fuel}`); if(!norm(q).split(/\s+/).filter(Boolean).every(t=>h.includes(t))) return false; }
    if(side.brand.size && !side.brand.has(c.brand)) return false;
    if(side.category.size && !side.category.has(c.category)) return false;
    if(side.fuel.size && !side.fuel.has(c.fuel)) return false;
    if(side.transmission.size && !side.transmission.has(c.transmission)) return false;
    if(c.price && c.price>side.priceMax) return false;
    if(c.year && c.year<side.yearMin) return false;
    if(c.km && c.km>side.kmMax) return false;
    if(side.premium && !c.premium) return false;
    return true;
  }

  // ---------- COLEÇÕES (instantâneas) ----------
  const COLLECTIONS = [
    {key:"", label:"Todos"},
    {key:"suv", label:"SUVs", applySide:s=>s.category=new Set(["SUV"])},
    {key:"sedan", label:"Sedãs", applySide:s=>s.category=new Set(["Sedã"])},
    {key:"hatch", label:"Hatches", applySide:s=>s.category=new Set(["Hatch"])},
    {key:"picape", label:"Picapes", applySide:s=>s.category=new Set(["Picape"])},
    {key:"premium", label:"Premium", applySide:s=>s.premium=true},
    {key:"auto", label:"Automáticos", applySide:s=>s.transmission=new Set(["Automático"])},
    {key:"ate60", label:"Até R$ 60 mil", applySide:s=>s.priceMax=60000},
  ].filter(c=>{ if(!c.applySide) return true; const s=blankSide(); c.applySide(s); return DATA.some(x=>matches(x,"",s)); });

  const colWrap = $("#stCollections");
  if(colWrap) colWrap.innerHTML = COLLECTIONS.map(c=>`<button class="st-col" data-col="${c.key}">${esc(c.label)}</button>`).join("");
  colWrap?.querySelectorAll(".st-col").forEach(b=>b.addEventListener("click",()=>{
    const c = COLLECTIONS.find(x=>x.key===b.dataset.col);
    F.q=""; const si=$("#stSearch"); if(si)si.value="";
    const s=blankSide(); c.applySide && c.applySide(s);
    F.side=s; F.collection=c.key; D=cloneSide(s);
    syncControls(); apply();
    document.querySelector(".st-layout")?.scrollIntoView({behavior:"smooth",block:"start"});
  }));

  // ---------- SIDEBAR (rascunho, recolhível) ----------
  const chev = `<svg class="st-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
  function group(title, openByDefault, inner){
    return `<div class="st-fgroup" data-open="${openByDefault?'true':'false'}">
      <button type="button" class="st-fgroup-head"><span>${title}</span>${chev}</button>
      <div class="st-fgroup-body"><div class="st-fgroup-inner">${inner}</div></div>
    </div>`;
  }
  function checks(key, keys, counts){
    return keys.map(k=>`<label class="st-check"><input type="checkbox" data-f="${key}" value="${esc(k)}"><span class="box"></span><span class="lbl">${esc(k)}</span><span class="cnt">${counts[k]||0}</span></label>`).join("");
  }
  const side = $("#stFilters");
  if(side){
    // "Categoria" não entra aqui: já existem as coleções logo abaixo do título.
    // Todos os grupos começam recolhidos.
    side.innerHTML =
      group("Marca", false, checks("brand",order(byBrand),byBrand)) +
      group("Preço", false, `<input type="range" class="st-range" id="rPrice" min="${PMIN}" max="${PMAX}" step="1000" value="${PMAX}"><div class="st-rval">Até <span id="rPriceVal">${brl(PMAX)}</span></div>`) +
      group("Ano", false, `<input type="range" class="st-range" id="rYear" min="${YMIN}" max="${YMAX}" step="1" value="${YMIN}"><div class="st-rval">A partir de <span id="rYearVal">${YMIN}</span></div>`) +
      group("Quilometragem", false, `<input type="range" class="st-range" id="rKm" min="0" max="${KMAX}" step="5000" value="${KMAX}"><div class="st-rval">Até <span id="rKmVal">${KMAX.toLocaleString("pt-BR")} km</span></div>`) +
      group("Câmbio", false, checks("transmission",order(byTrans),byTrans)) +
      group("Combustível", false, checks("fuel",order(byFuel),byFuel));

    // recolher/expandir
    side.querySelectorAll(".st-fgroup-head").forEach(h=>h.addEventListener("click",()=>{
      const g=h.parentElement; g.setAttribute("data-open", g.getAttribute("data-open")==="true" ? "false" : "true");
    }));
    // checkboxes -> rascunho
    side.querySelectorAll('input[type=checkbox]').forEach(cb=>cb.addEventListener("change",()=>{
      const set=D[cb.dataset.f]; cb.checked?set.add(cb.value):set.delete(cb.value); refreshApply();
    }));
    // sliders -> rascunho (NÃO filtra ao arrastar)
    const rP=$("#rPrice"), rY=$("#rYear"), rK=$("#rKm");
    rP.addEventListener("input",()=>{ D.priceMax=+rP.value; $("#rPriceVal").textContent=(+rP.value>=PMAX)?"sem limite":brl(+rP.value); refreshApply(); });
    rY.addEventListener("input",()=>{ D.yearMin=+rY.value; $("#rYearVal").textContent=rY.value; refreshApply(); });
    rK.addEventListener("input",()=>{ D.kmMax=+rK.value; $("#rKmVal").textContent=(+rK.value>=KMAX)?"sem limite":(+rK.value).toLocaleString("pt-BR")+" km"; refreshApply(); });
  }

  function syncControls(){
    side?.querySelectorAll('input[type=checkbox]').forEach(cb=>cb.checked=D[cb.dataset.f].has(cb.value));
    const rP=$("#rPrice"),rY=$("#rYear"),rK=$("#rKm");
    if(rP){rP.value=D.priceMax; $("#rPriceVal").textContent=(D.priceMax>=PMAX)?"sem limite":brl(D.priceMax);}
    if(rY){rY.value=D.yearMin; $("#rYearVal").textContent=D.yearMin;}
    if(rK){rK.value=D.kmMax; $("#rKmVal").textContent=(D.kmMax>=KMAX)?"sem limite":D.kmMax.toLocaleString("pt-BR")+" km";}
    colWrap?.querySelectorAll(".st-col").forEach(b=>b.classList.toggle("active",b.dataset.col===F.collection));
    refreshApply();
  }

  // botão Aplicar mostra a prévia da contagem do rascunho
  const applyBtn=$("#stApply");
  function draftCount(){ return DATA.filter(c=>matches(c,F.q,D)).length; }
  function refreshApply(){
    if(!applyBtn) return;
    const n=draftCount();
    applyBtn.textContent = n ? `Ver ${plural(n)}` : "Nenhum veículo";
    applyBtn.disabled = false;
    applyBtn.classList.toggle("is-zero", n===0);
  }
  applyBtn?.addEventListener("click",()=>{ F.side=cloneSide(D); F.collection=""; apply(); closeDrawer(); document.querySelector(".st-layout")?.scrollIntoView({behavior:"smooth",block:"start"}); });
  $("#stSideClear")?.addEventListener("click",()=>{ D=blankSide(); F.side=blankSide(); F.collection=""; F.q=""; const si=$("#stSearch"); if(si)si.value=""; syncControls(); apply(); });

  // ---------- ORDENAÇÃO ----------
  const SORTS={ relevancia:()=>0, preco_asc:(a,b)=>(a.price||1e12)-(b.price||1e12), preco_desc:(a,b)=>(b.price||0)-(a.price||0), ano_desc:(a,b)=>(b.year||0)-(a.year||0), km_asc:(a,b)=>(a.km||1e12)-(b.km||1e12) };

  function card(c){
    const tag=c.year?`<span class="car-tag">${c.year}</span>`:"";
    const meta=[c.year,c.kmText].filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join("<i></i>");
    const pr=c.priceText?`R$ ${esc(c.priceText)}`:"Consulte";
    return `<a class="car-card" href="${esc(c.url)}" aria-label="${esc(c.title)}">
      <div class="car-thumb"><img src="${esc(c.thumb)}" alt="${esc(c.title)}" loading="lazy" onerror="this.src='assets/placeholder-car.svg';this.onerror=null">${tag}</div>
      <div class="car-body">
        <h3 class="car-name">${esc(c.title)}</h3>
        <div class="car-meta">${meta}</div>
        <div class="car-foot"><span class="car-price">${pr}</span><span class="car-cta">Ver detalhes <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span></div>
      </div></a>`;
  }

  function chips(){
    const out=[], fns=[];
    const add=(label,fn)=>{ out.push(`<button class="st-chip" data-clear>${esc(label)} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`); fns.push(fn); };
    F.side.category.forEach(v=>add(v,()=>F.side.category.delete(v)));
    F.side.brand.forEach(v=>add(v,()=>F.side.brand.delete(v)));
    F.side.fuel.forEach(v=>add(v,()=>F.side.fuel.delete(v)));
    F.side.transmission.forEach(v=>add(v,()=>F.side.transmission.delete(v)));
    if(F.side.priceMax<PMAX) add("Até "+brl(F.side.priceMax),()=>F.side.priceMax=PMAX);
    if(F.side.yearMin>YMIN) add("A partir de "+F.side.yearMin,()=>F.side.yearMin=YMIN);
    if(F.side.kmMax<KMAX) add("Até "+F.side.kmMax.toLocaleString("pt-BR")+" km",()=>F.side.kmMax=KMAX);
    if(F.side.premium) add("Premium",()=>F.side.premium=false);
    if(F.q) add('"'+F.q+'"',()=>{F.q="";const si=$("#stSearch");if(si)si.value="";});
    const wrap=$("#stChips");
    wrap.innerHTML = out.join("") + (out.length?`<button class="st-clear" id="stClearAll">Limpar tudo</button>`:"");
    wrap.querySelectorAll("[data-clear]").forEach((b,i)=>b.addEventListener("click",()=>{ fns[i](); F.collection=""; D=cloneSide(F.side); syncControls(); apply(); }));
    $("#stClearAll")?.addEventListener("click",()=>{ F.side=blankSide(); F.q=""; F.collection=""; const si=$("#stSearch"); if(si)si.value=""; D=blankSide(); syncControls(); apply(); });
  }

  function apply(){
    let list=DATA.filter(c=>matches(c,F.q,F.side));
    if(F.sort && SORTS[F.sort] && F.sort!=="relevancia") list=list.slice().sort(SORTS[F.sort]);
    $("#stGrid").innerHTML = list.length ? list.map(card).join("")
      : `<div class="st-empty"><h3>Nenhum veículo com esses filtros</h3><p>Tente afrouxar os filtros ou fale com a gente no WhatsApp que buscamos pra você.</p><button class="btn ghost" id="stReset">Limpar filtros</button></div>`;
    $("#stReset")?.addEventListener("click",()=>{ F.side=blankSide(); F.q=""; F.collection=""; const si=$("#stSearch"); if(si)si.value=""; D=blankSide(); syncControls(); apply(); });
    $("#stCount").textContent = plural(list.length);
    chips();
    colWrap?.querySelectorAll(".st-col").forEach(b=>b.classList.toggle("active",b.dataset.col===F.collection));
    refreshApply();
  }

  // ---------- busca (instantânea) + sort ----------
  $("#stSearch")?.addEventListener("input",e=>{ F.q=e.target.value; F.collection=""; apply(); });
  $("#stSort")?.addEventListener("change",e=>{ F.sort=e.target.value; apply(); });

  // ---------- drawer mobile ----------
  const drawerBtn=$("#stFilterToggle"), layout=$(".st-layout");
  function closeDrawer(){ layout?.classList.remove("filters-open"); document.body.style.overflow=""; }
  drawerBtn?.addEventListener("click",()=>{ const o=layout.classList.toggle("filters-open"); document.body.style.overflow=o?"hidden":""; });
  $("#stFilterClose")?.addEventListener("click",closeDrawer);
  $("#stFilterCloseBtn")?.addEventListener("click",closeDrawer);
  addEventListener("keydown",e=>{ if(e.key==="Escape"&&layout?.classList.contains("filters-open")) closeDrawer(); });

  // deep-link ?col= / ?cat=
  const params=new URLSearchParams(location.search);
  if(params.get("col")){ const c=COLLECTIONS.find(x=>x.key===params.get("col")); if(c&&c.applySide){ const s=blankSide(); c.applySide(s); F.side=s; F.collection=c.key; D=cloneSide(s); } }
  if(params.get("cat")){ F.side.category.add(params.get("cat")); D=cloneSide(F.side); }

  syncControls(); apply();
})();
