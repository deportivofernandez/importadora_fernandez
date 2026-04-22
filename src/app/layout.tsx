import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Importadora Fernández | Calzado al por Mayor",
    template: "%s | Importadora Fernández"
  },
  description: "Catálogo mayorista de calzado en Bolivia. Calidad Brasilera, Peruana y Nacional. Precios directos para distribuidores y revendedores.",
  openGraph: {
    title: "Importadora Fernández | Catálogo Mayorista",
    description: "Descubre nuestra colección de zapatos al por mayor. Precios especiales para distribuidores en Bolivia.",
    url: 'https://importadorafernandez.vercel.app',
    siteName: 'Importadora Fernández',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556048219-18ae6fd33138?q=80&w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Catálogo Importadora Fernández',
      },
    ],
    locale: 'es_BO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Importadora Fernández | Calzado al por Mayor",
    description: "Calzados de calidad al mejor precio mayorista. Envíos a toda Bolivia.",
    images: ['https://images.unsplash.com/photo-1556048219-18ae6fd33138?q=80&w=1200&h=630&fit=crop'],
  },
};

import SocialSpeedDial from '@/components/SocialSpeedDial';
import NetworkStatus from '@/components/NetworkStatus';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';

// ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <CartProvider>
          <FavoritesProvider>
            {children}
            <NetworkStatus />
            <SocialSpeedDial />
          </FavoritesProvider>
        </CartProvider>

        {/* Script para silenciar logs de desarrollo — solo en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                    const originalLog = console.log;
                    console.log = (...args) => {
                        if (typeof args[0] === 'string' && (args[0].includes('[Fast Refresh]') || args[0].includes('[HMR]'))) return;
                        originalLog.apply(console, args);
                    };
                `
            }}
          />
        )}
      </body>
    </html>
  );
}
