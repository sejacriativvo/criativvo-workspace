const { chromium } = require('playwright');

const url = process.argv[2];
const outputDir = process.argv[3] || '.';

if (!url) {
  console.error('Uso: node diagnostico-site.js <url> [pasta-saida]');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch();
  const results = { url, timestamp: new Date().toISOString(), issues: [], screenshots: [] };

  // Desktop
  const pageDesktop = await browser.newPage();
  await pageDesktop.setViewportSize({ width: 1440, height: 900 });

  const start = Date.now();
  try {
    await pageDesktop.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    results.issues.push({ tipo: 'CRÍTICO', desc: `Site não carregou: ${e.message}` });
    await browser.close();
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  }

  results.loadTimeMs = Date.now() - start;
  if (results.loadTimeMs > 4000) results.issues.push({ tipo: 'LENTIDÃO', desc: `Carregamento em ${(results.loadTimeMs/1000).toFixed(1)}s (ideal: abaixo de 3s)` });

  // Screenshot desktop
  const screenshotDesktop = `${outputDir}/screenshot-desktop.png`;
  await pageDesktop.screenshot({ path: screenshotDesktop, fullPage: true });
  results.screenshots.push(screenshotDesktop);

  // Links quebrados
  const links = await pageDesktop.$$eval('a[href]', els =>
    els.map(el => ({ href: el.href, text: el.innerText.trim().slice(0, 60) }))
       .filter(l => l.href && !l.href.startsWith('mailto:') && !l.href.startsWith('tel:') && !l.href.startsWith('javascript:'))
  );

  for (const link of links.slice(0, 30)) {
    try {
      const res = await pageDesktop.request.head(link.href, { timeout: 8000 });
      if (res.status() >= 400) {
        results.issues.push({ tipo: 'LINK QUEBRADO', desc: `${link.text || link.href} → status ${res.status()}` });
      }
    } catch {}
  }

  // Botões sem ação
  const buttons = await pageDesktop.$$eval('button, a.btn, [class*="btn"], [class*="button"]', els =>
    els.filter(el => !el.href && !el.onclick && !el.closest('form')).map(el => el.innerText.trim().slice(0, 60)).filter(Boolean)
  );
  if (buttons.length > 0) {
    results.issues.push({ tipo: 'BOTÕES SEM AÇÃO', desc: `Possíveis botões sem destino: ${buttons.slice(0, 5).join(', ')}` });
  }

  // Título e meta description
  const title = await pageDesktop.title();
  results.title = title;
  if (!title || title.length < 10) results.issues.push({ tipo: 'SEO', desc: 'Título da página ausente ou muito curto' });

  const metaDesc = await pageDesktop.$eval('meta[name="description"]', el => el.content).catch(() => null);
  if (!metaDesc) results.issues.push({ tipo: 'SEO', desc: 'Meta description ausente' });

  // Mobile
  const pageMobile = await browser.newPage();
  await pageMobile.setViewportSize({ width: 390, height: 844 });
  await pageMobile.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  const screenshotMobile = `${outputDir}/screenshot-mobile.png`;
  await pageMobile.screenshot({ path: screenshotMobile, fullPage: false });
  results.screenshots.push(screenshotMobile);

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})();
