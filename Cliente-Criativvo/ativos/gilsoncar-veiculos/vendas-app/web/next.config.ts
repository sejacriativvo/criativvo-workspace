import type { NextConfig } from "next";

// Content-Security-Policy: trava de onde o navegador pode carregar coisa.
// - script/style 'unsafe-inline': o Next injeta scripts/estilos inline (hidratação);
//   sem isso o app não roda. Sem origem externa de script -> bloqueia injeção de <script src> de fora.
// - img https: as fotos dos carros vêm do CDN da Shopify; data:/blob: pra imagens locais.
// - connect 'self' + supabase: o app só fala com a própria origem (e o Supabase).
// - frame-ancestors/base-uri/form-action/object-src: anti-clickjacking, anti base-tag,
//   anti sequestro de formulário e bloqueio de plugins.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

// Cabeçalhos de segurança aplicados a todas as respostas.
const securityHeaders = [
  // Anti-clickjacking: ninguém pode embutir o app num iframe.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: csp },
  // Não deixa o browser "adivinhar" o tipo de arquivo (anti MIME-sniffing).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Vaza o mínimo de referrer pra fora.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desliga APIs sensíveis que o app não usa.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Força HTTPS (a Vercel já serve em HTTPS).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Não publica source maps do client em produção: ninguém reconstrói o .tsx
  // original pelo DevTools (só sobra o JS minificado, padrão de qualquer site).
  productionBrowserSourceMaps: false,
  experimental: {
    // Cache das páginas no navegador: trocar entre abas já visitadas fica
    // instantâneo (não vai no servidor de novo). Ações chamam router.refresh()
    // pra buscar dados novos quando precisa.
    staleTimes: {
      dynamic: 120,
      static: 300,
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
