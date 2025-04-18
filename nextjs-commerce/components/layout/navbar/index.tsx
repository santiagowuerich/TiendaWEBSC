import LogoSquare from 'components/logo-square';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';
import { getAllCategories } from 'lib/sanity';

const { SITE_NAME } = process.env;

// Define un tipo para el item del menú
type MenuItem = {
  title: string;
  path: string;
};

export async function Navbar() {
  // Obtener categorías de Sanity
  const categories = await getAllCategories();
  
  // Crear el menú con las categorías dinámicas
  const menu: MenuItem[] = [
    { title: 'Todo', path: '/search' }, // Cambiar path de '/' a '/search'
  ];

  // Añadir categorías de Sanity al menú
  if (categories && categories.length > 0) {
    categories.forEach((category: any) => {
      menu.push({
        title: category.title,
        path: `/search?category=${category.slug}`
      });
    });
  }

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-lg font-semibold tracking-wide uppercase md:hidden lg:block">
              {SITE_NAME}
            </div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-base md:flex md:items-center">
              {menu.map((item: MenuItem) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300 tracking-wide"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3">
          {/* El botón del carrito ha sido eliminado */}
        </div>
      </div>
    </nav>
  );
}
