/* ===========================================================
   BELLONI MOTORS — busca de veículos (header)
   Usa assets/search-data.js (window.BELLONI_SEARCH)
   Funciona na home e nas páginas de cada carro.
   =========================================================== */
(function(){
  const DATA = window.BELLONI_SEARCH || [];
  const BASE = location.pathname.includes("/veiculo/") ? "../" : "";
  const norm = s => (s||"").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
  const esc = s => (s||"").toString().replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));

  // monta o overlay uma vez
  const ov = document.createElement("div");
  ov.className = "search-modal";
  ov.id = "searchModal";
  ov.setAttribute("aria-hidden","true");
  ov.innerHTML = `
    <div class="search-overlay" data-sclose></div>
    <div class="search-panel" role="dialog" aria-modal="true" aria-label="Buscar veículos">
      <div class="search-bar">
        <svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <input id="searchInput" type="search" placeholder="Buscar por marca, modelo ou ano..." autocomplete="off" enterkeyhint="search">
        <button class="search-clear" id="searchClear" aria-label="Limpar" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        <button class="search-close" data-sclose aria-label="Fechar busca"><svg class="sc-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg><span class="sc-esc">ESC</span></button>
      </div>
      <div class="search-chips" id="searchChips"></div>
      <div class="search-meta" id="searchMeta"></div>
      <div class="search-results" id="searchResults"></div>
    </div>`;
  document.body.appendChild(ov);

  const input   = ov.querySelector("#searchInput");
  const results = ov.querySelector("#searchResults");
  const meta    = ov.querySelector("#searchMeta");
  const clear   = ov.querySelector("#searchClear");
  const chipsEl = ov.querySelector("#searchChips");

  // atalhos de marca (as 6 mais comuns no estoque)
  const brands = [...new Set(DATA.map(c=>c.brand).filter(Boolean))];
  const brandCount = {};
  DATA.forEach(c=>{ if(c.brand) brandCount[c.brand]=(brandCount[c.brand]||0)+1; });
  const topBrands = brands.sort((a,b)=>brandCount[b]-brandCount[a]).slice(0,6);
  chipsEl.innerHTML = topBrands.map(b=>`<button class="schip" data-q="${esc(b)}">${esc(b)}</button>`).join("");
  chipsEl.querySelectorAll(".schip").forEach(c=>c.addEventListener("click",()=>{ input.value=c.dataset.q; render(input.value); input.focus(); }));

  function render(q){
    const nq = norm(q).trim();
    const terms = nq.split(/\s+/).filter(Boolean);
    let list = DATA;
    if(terms.length){
      list = DATA.filter(c=>{
        const hay = norm(`${c.title} ${c.brand} ${c.model} ${c.year} ${c.fuel}`);
        return terms.every(t=>hay.includes(t));
      });
    }
    meta.textContent = nq
      ? `${list.length} ${list.length===1?"veículo encontrado":"veículos encontrados"}`
      : `${DATA.length} veículos no estoque`;
    results.innerHTML = list.length
      ? list.map(c=>`
        <a class="sresult" href="${BASE}${esc(c.url)}">
          <span class="sr-thumb"><img src="${BASE}${esc(c.thumb)}" alt="" loading="lazy"></span>
          <span class="sr-info">
            <span class="sr-name">${esc(c.title)}</span>
            <span class="sr-meta">${[c.year,c.km].filter(Boolean).map(esc).join(" • ")}</span>
          </span>
          <span class="sr-price">${c.price?("R$ "+esc(c.price)):"Consulte"}</span>
        </a>`).join("")
      : `<div class="sempty">Nenhum veículo encontrado para “<b>${esc(q)}</b>”.<br>Tente outra marca ou modelo, ou fale com a gente no WhatsApp.</div>`;
    clear.hidden = !q;
  }

  function open(){
    render(input.value || "");
    ov.classList.add("open");
    ov.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
    setTimeout(()=>input.focus(), 60);
  }
  function close(){
    ov.classList.remove("open");
    ov.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }

  input.addEventListener("input", ()=>render(input.value));
  clear.addEventListener("click", ()=>{ input.value=""; render(""); input.focus(); });
  ov.querySelectorAll("[data-sclose]").forEach(b=>b.addEventListener("click", close));
  addEventListener("keydown", e=>{
    if(e.key==="Escape" && ov.classList.contains("open")) close();
    // atalho "/" abre a busca
    if(e.key==="/" && !ov.classList.contains("open") && !/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName)){ e.preventDefault(); open(); }
  });

  document.querySelectorAll("[data-search-open]").forEach(b=>b.addEventListener("click", e=>{ e.preventDefault(); open(); }));
})();
