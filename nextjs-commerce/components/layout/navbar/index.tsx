import LogoSquare from 'components/logo-square';
import { LogoWithText } from 'components/logo-with-text';
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
        {/* Logo y navegación - lado izquierdo */}
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-4 flex items-center"
          >
            <LogoWithText />
          </Link>
          
          {menu.length ? (
            <ul className="hidden gap-4 text-base md:flex md:items-center">
              {menu.map((item: MenuItem) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        
        {/* Búsqueda - centro */}
        <div className="hidden justify-center px-4 md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        
        {/* Espacio para elementos a la derecha */}
        <div className="flex justify-end md:w-1/3">
          {/* Espacio para futuros elementos a la derecha, si es necesario */}
        </div>
      </div>
    </nav>
  );
}
