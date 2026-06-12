/* ===========================================================
   BELLONI MOTORS — carrega estoque em tempo real do Supabase
   Admin adiciona/remove no painel → reflete aqui na hora
   =========================================================== */
(function () {
  var SUPABASE_URL = 'https://uljanpwbsstxwqctmryc.supabase.co';
  var ANON_KEY     = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsamFucHdic3N0eHdxY3RtcnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODM3NTQsImV4cCI6MjA5Njc1OTc1NH0.p6cJEUpGwXeRKAnKXKbgi75Mpm0NsmpdIG93uHKGGBk';

  var C = window.BELLONI_CONFIG || {};
  var waBase = 'https://wa.me/' + (C.whatsapp || '');

  var PHOTO_MAP = {
    'peugeot 208':'MLB6829748894','chevrolet tracker':'MLB6762442584',
    'hyundai hb20':'MLB6738368544','chevrolet equinox':'MLB6448671408',
    'volkswagen crossfox':'MLB6882409088','jeep renegade':'MLB6434297956',
    'volkswagen jetta':'MLB6718115078','toyota corolla':'MLB4605176703',
    'volkswagen amarok':'MLB4665274877','bmw x1':'MLB6921722172',
    'mitsubishi lancer':'MLB6620133364','citroën c3 picasso':'MLB6487604514',
    'audi a4':'MLB4534243691','dodge journey':'MLB4511269829',
    'audi a3':'MLB6619881120','audi s2':'MLB6717655192',
    'honda cbr':'MLB4524154493'
  };
  function photoFromName(name) {
    var n = (name || '').toLowerCase();
    for (var key in PHOTO_MAP) { if (n.indexOf(key) === 0) return 'assets/carros/' + PHOTO_MAP[key] + '/01.webp'; }
    return '';
  }
  function urlFromName(name) {
    var n = (name || '').toLowerCase();
    for (var key in PHOTO_MAP) { if (n.indexOf(key) === 0) return 'veiculo/' + PHOTO_MAP[key] + '.html'; }
    return null;
  }

  function brlText(n) { return Number(n).toLocaleString('pt-BR'); }
  function brandFrom(name) { return (name || '').split(' ')[0] || ''; }
  function kmNum(raw) {
    if (!raw) return 0;
    var n = parseInt(String(raw).replace(/\D/g, ''), 10);
    return isNaN(n) ? 0 : n;
  }

  function toStock(c) {
    var price = parseFloat(c.price) || 0;
    var km    = kmNum(c.km);
    var waMsg = encodeURIComponent(
      'Olá! Tenho interesse no ' + (c.name || 'veículo') +
      ' (' + (c.year || '') + '). Vi no site da Belloni Motors.'
    );
    return {
      id:           c.id,
      title:        c.name || '',
      brand:        c.brand || brandFrom(c.name),
      year:         parseInt(c.year, 10) || 0,
      km:           km,
      kmText:       km > 0 ? km.toLocaleString('pt-BR') + ' km' : (c.km || '—'),
      price:        price,
      priceText:    brlText(price),
      fuel:         c.combustivel || '',
      transmission: c.cambio || '',
      category:     c.category || '',
      premium:      c.premium || false,
      doors:        c.doors || '',
      thumb:        c.img || photoFromName(c.name),
      url:          urlFromName(c.name) || waBase + '?text=' + waMsg,
    };
  }

  function loadEstoque() {
    var url = SUPABASE_URL +
      '/rest/v1/vehicles_public' +
      '?status=eq.available' +
      '&in_prep=eq.false' +
      '&select=id,name,brand,category,doors,premium,year,km,cambio,combustivel,price,img' +
      '&order=created_at.asc';

    fetch(url, {
      headers: { 'apikey': ANON_KEY, 'Authorization': 'Bearer ' + ANON_KEY },
    })
      .then(function (r) { return r.json(); })
      .then(function (cars) {
        if (!Array.isArray(cars) || cars.length === 0) return; // sem dados reais → mantém fallback estático
        window.BELLONI_STOCK = cars.map(toStock);
        var s = document.createElement('script');
        s.src = 'assets/estoque.js';
        document.body.appendChild(s);
      })
      .catch(function () { /* fallback estático já está ativo */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEstoque);
  } else {
    loadEstoque();
  }
})();

/* FALLBACK ESTÁTICO — substituído automaticamente quando o Supabase tiver dados reais */
window.BELLONI_STOCK = [{"id": "MLB6829748894", "title": "Peugeot 208 1.6 16v Allure Flex Aut. 5p", "brand": "Peugeot", "year": 2017, "km": 70000, "kmText": "70.000 km", "price": 56700, "priceText": "56.700", "fuel": "Flex", "transmission": "Automático", "category": "Hatch", "premium": false, "doors": "5", "thumb": "assets/carros/MLB6829748894/01.webp", "url": "veiculo/MLB6829748894.html"}, {"id": "MLB6762442584", "title": "Chevrolet Tracker 1.2 Premier Turbo Aut. 5p Automática", "brand": "Chevrolet", "year": 2022, "km": 60000, "kmText": "60.000 km", "price": 104590, "priceText": "104.590", "fuel": "Flex", "transmission": "Automático", "category": "SUV", "premium": false, "doors": "5", "thumb": "assets/carros/MLB6762442584/01.webp", "url": "veiculo/MLB6762442584.html"}, {"id": "MLB6738368544", "title": "Hyundai HB20 1.6 Comfort Plus Flex 5p", "brand": "Hyundai", "year": 2019, "km": 126000, "kmText": "126.000 km", "price": 61890, "priceText": "61.890", "fuel": "Flex", "transmission": "Manual", "category": "Hatch", "premium": false, "doors": "5", "thumb": "assets/carros/MLB6738368544/01.webp", "url": "veiculo/MLB6738368544.html"}, {"id": "MLB6448671408", "title": "Chevrolet Equinox 2.0 Premier Turbo Awd Aut. 5p", "brand": "Chevrolet", "year": 2019, "km": 40000, "kmText": "40.000 km", "price": 137990, "priceText": "137.990", "fuel": "Gasolina", "transmission": "Automático", "category": "SUV", "premium": true, "doors": "5", "thumb": "assets/carros/MLB6448671408/01.webp", "url": "veiculo/MLB6448671408.html"}, {"id": "MLB6882409088", "title": "Volkswagen CrossFox 1.6 16v Msi Total Flex I-motion 5p", "brand": "Volkswagen", "year": 2015, "km": 120000, "kmText": "120.000 km", "price": 47890, "priceText": "47.890", "fuel": "Flex", "transmission": "Automático", "category": "Hatch", "premium": false, "doors": "5", "thumb": "assets/carros/MLB6882409088/01.webp", "url": "veiculo/MLB6882409088.html"}, {"id": "MLB6434297956", "title": "Jeep Renegade 1.8 Longitude Flex Aut. 5p", "brand": "Jeep", "year": 2017, "km": 130000, "kmText": "130.000 km", "price": 69790, "priceText": "69.790", "fuel": "Flex", "transmission": "Automático", "category": "SUV", "premium": false, "doors": "5", "thumb": "assets/carros/MLB6434297956/01.webp", "url": "veiculo/MLB6434297956.html"}, {"id": "MLB6718115078", "title": "Volkswagen Jetta 2.0 Comfortline Flex 4p Automática", "brand": "Volkswagen", "year": 2013, "km": 120000, "kmText": "120.000 km", "price": 60990, "priceText": "60.990", "fuel": "Flex", "transmission": "Automático", "category": "Sedã", "premium": false, "doors": "4", "thumb": "assets/carros/MLB6718115078/01.webp", "url": "veiculo/MLB6718115078.html"}, {"id": "MLB4605176703", "title": "Toyota Corolla 1.8 Altis Premium Hybrid Flex Aut. 4p Hibrido Flex", "brand": "Toyota", "year": 2021, "km": 110000, "kmText": "110.000 km", "price": 140000, "priceText": "140.000", "fuel": "Híbrido", "transmission": "Automático", "category": "Sedã", "premium": true, "doors": "4", "thumb": "assets/carros/MLB4605176703/01.webp", "url": "veiculo/MLB4605176703.html"}, {"id": "MLB4665274877", "title": "Volkswagen Amarok 3.0 Highline Extreme Cab. Dupla V6 4x4 Aut. 4p", "brand": "Volkswagen", "year": 2018, "km": 140000, "kmText": "140.000 km", "price": 137700, "priceText": "137.700", "fuel": "Diesel", "transmission": "Automático", "category": "Picape", "premium": true, "doors": "4", "thumb": "assets/carros/MLB4665274877/01.webp", "url": "veiculo/MLB4665274877.html"}, {"id": "MLB6921722172", "title": "BMW X1 2.0 Sdrive20i M Sport Active Flex 5p", "brand": "BMW", "year": 2022, "km": 69000, "kmText": "69.000 km", "price": 226990, "priceText": "226.990", "fuel": "Flex", "transmission": "Automático", "category": "SUV", "premium": true, "doors": "5", "thumb": "assets/carros/MLB6921722172/01.webp", "url": "veiculo/MLB6921722172.html"}, {"id": "MLB6620133364", "title": "Mitsubishi Lancer 2.0 Cvt 4p", "brand": "Mitsubishi", "year": 2015, "km": 170000, "kmText": "170.000 km", "price": 58990, "priceText": "58.990", "fuel": "Gasolina", "transmission": "Automático", "category": "Sedã", "premium": false, "doors": "4", "thumb": "assets/carros/MLB6620133364/01.webp", "url": "veiculo/MLB6620133364.html"}, {"id": "MLB6487604514", "title": "Citroën C3 Picasso 1.6 16v Exclusive Flex Aut. 5p", "brand": "Citroën", "year": 2015, "km": 120000, "kmText": "120.000 km", "price": 41990, "priceText": "41.990", "fuel": "Flex", "transmission": "Automático", "category": "Minivan", "premium": false, "doors": "5", "thumb": "assets/carros/MLB6487604514/01.webp", "url": "veiculo/MLB6487604514.html"}, {"id": "MLB4534243691", "title": "Audi A4 2.0 Prestige Plus Tfsi S-tronic 4p", "brand": "Audi", "year": 2021, "km": 49000, "kmText": "49.000 km", "price": 168990, "priceText": "168.990", "fuel": "Gasolina", "transmission": "Automático", "category": "Sedã", "premium": true, "doors": "4", "thumb": "assets/carros/MLB4534243691/01.webp", "url": "veiculo/MLB4534243691.html"}, {"id": "MLB4511269829", "title": "Dodge Journey 3.6 R/t 5p", "brand": "Dodge", "year": 2018, "km": 90000, "kmText": "90.000 km", "price": 89900, "priceText": "89.900", "fuel": "Gasolina", "transmission": "Automático", "category": "Minivan", "premium": false, "doors": "5", "thumb": "assets/carros/MLB4511269829/01.webp", "url": "veiculo/MLB4511269829.html"}, {"id": "MLB6619881120", "title": "Audi A3 Sportback 2.0 Tfsi S-tronic 5p", "brand": "Audi", "year": 2011, "km": 180000, "kmText": "180.000 km", "price": 54990, "priceText": "54.990", "fuel": "Gasolina", "transmission": "Automático", "category": "Hatch", "premium": true, "doors": "5", "thumb": "assets/carros/MLB6619881120/01.webp", "url": "veiculo/MLB6619881120.html"}, {"id": "MLB6717655192", "title": "S2 Avante Quattro Porsche Edition", "brand": "Audi", "year": 1995, "km": 80000, "kmText": "80.000 km", "price": 295900, "priceText": "295.900", "fuel": "Gasolina", "transmission": "", "category": "Outro", "premium": true, "doors": "4", "thumb": "assets/carros/MLB6717655192/01.webp", "url": "veiculo/MLB6717655192.html"}, {"id": "MLB4524154493", "title": "Cbr Fireblade 1000", "brand": "Honda", "year": 2005, "km": 74000, "kmText": "74.000 km", "price": 29000, "priceText": "29.000", "fuel": "Outro", "transmission": "Manual", "category": "Moto", "premium": false, "doors": "", "thumb": "assets/carros/MLB4524154493/01.webp", "url": "veiculo/MLB4524154493.html"}];
