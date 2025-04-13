import Link from 'next/link';

import FooterMenu from 'components/layout/footer-menu';
import LogoSquare from 'components/logo-square';
import { Suspense } from 'react';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700';

  // Definir los enlaces del footer
  const footerLinks = [
    { title: 'Inicio', path: '/' },
    { title: 'Acerca de', path: '/about' },
    { title: 'Términos y condiciones', path: '/terms' },
    { title: 'Política de envío', path: '/shipping' },
    { title: 'Política de privacidad', path: '/privacy' },
    { title: 'Preguntas frecuentes', path: '/faq' },
  ];
  
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  return (
    <footer className="text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-base md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <div>
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            <LogoSquare size="sm" />
            <span className="text-base uppercase">{SITE_NAME}</span>
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-col gap-2">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={footerLinks} />
        </Suspense>
        <div className="md:ml-auto">
          <h3 className="mb-2 text-lg font-medium text-black dark:text-white">Contacto</h3>
          <ul className="mt-4 space-y-2 text-base">
            <li>Email: scequipamiento.contacto@gmail.com</li>
            <li>
              WhatsApp: 
              <a 
                href="https://wa.me/5493625281890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                +54 9 3625 281890
              </a>
            </li>
            <li>Dirección: Jorge Luis Borges 786, Resistencia, Chaco</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
