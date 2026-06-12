import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Fonte da marca Criativvo (wordmark "criativvo"), usada só no logotipo.
const avestiana = localFont({
  src: './fonts/AVEstiana-Black.otf',
  variable: '--font-avestiana',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GilsonCar Vendas',
  description: 'Estoque e negociação — GilsonCar Veículos',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'GilsonCar', statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${avestiana.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
