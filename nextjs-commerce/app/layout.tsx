// import { CartProvider } from 'components/cart/cart-context';
import { Navbar } from 'components/layout/navbar';
// import { WelcomeToast } from 'components/welcome-toast';
import { GeistSans } from 'geist/font/sans';
import { Inter } from 'next/font/google';
// import { getCart } from 'lib/shopify'; // Eliminado
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';
import { baseUrl } from 'lib/utils';
import FloatingBranchButton from 'components/floating-branch-button';

// Configurar la fuente Inter
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter' // Definir variable CSS
});

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-icon.png' }
    ]
  }
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
          <Navbar />
          <main>
            {children}
            <Toaster closeButton />
          </main>
          <FloatingBranchButton />
      </body>
    </html>
  );
}
