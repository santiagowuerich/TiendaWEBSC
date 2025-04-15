'use client';

import clsx from 'clsx';
import type { SortFilterItem } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ListItem, PathFilterItem } from '.';

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Comprobar si es la opción "Todo" y si estamos en la página de búsqueda sin parámetro de categoría
  const isTodoOption = item.title === 'Todo' && item.path === '/search';
  const isTodoActive = pathname === '/search' && !searchParams.get('category');
  
  // Verificar si está activo basado en la categoría
  const categoryParam = searchParams.get('category');
  const isCurrentCategory = item.path && item.path.includes(`?category=${categoryParam}`) && categoryParam;
  
  // Un elemento está activo si es la ruta actual, es Todo y no hay categoría, o es la categoría actual
  // Para "Todo" solo mostrar subrayado cuando está explícitamente activo
  const active = !isTodoOption && ((pathname === item.path) || isCurrentCategory) || 
                (isTodoOption && isTodoActive);
  
  // Si es la opción "Todo", no preservamos ningún parámetro de categoría
  const newParams = new URLSearchParams();
  
  // Preservar el parámetro de búsqueda (q) si existe
  const q = searchParams.get('q');
  if (q) newParams.set('q', q);
  
  // Preservar el parámetro de ordenamiento (sort) si existe
  const sort = searchParams.get('sort');
  if (sort) newParams.set('sort', sort);
  
  // Si no es la opción "Todo" y la ruta contiene un parámetro de categoría, usarlo
  if (!isTodoOption && item.path && item.path.includes('?category=')) {
    const categoryParam = item.path.split('?category=')[1];
    if (categoryParam) {
      newParams.set('category', categoryParam);
    }
  }
  
  // Siempre usar Link para permitir navegación incluso cuando está activo
  const finalPath = '/search'; // Base path siempre es /search para categorías
  
  return (
    <li className="mt-2 flex text-black dark:text-white" key={item.title}>
      <Link
        href={createUrl(finalPath, newParams)}
        className={clsx(
          'w-full text-sm font-bold no-underline hover:underline hover:underline-offset-4 dark:hover:text-neutral-100',
          {
            'underline underline-offset-4': active, // Solo aplicar subrayado cuando está activo
          }
        )}
      >
        {item.title}
      </Link>
    </li>
  );
}

function SortFilterItem({ item }: { item: SortFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get('sort') === item.slug;
  
  // Preservar todos los parámetros existentes
  const newParams = new URLSearchParams(searchParams.toString());
  
  // Actualizar o eliminar el parámetro de ordenamiento
  if (item.slug && item.slug.length) {
    newParams.set('sort', item.slug);
  } else {
    newParams.delete('sort');
  }

  // Siempre usar Link para permitir navegación
  return (
    <li className="mt-2 flex text-sm font-bold text-black dark:text-white" key={item.title}>
      <Link
        prefetch={!active ? false : undefined}
        href={createUrl(pathname, newParams)}
        className={clsx('w-full no-underline hover:underline hover:underline-offset-4', {
          'underline underline-offset-4': active, // Solo aplicar subrayado cuando está activo
        })}
      >
        {item.title}
      </Link>
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return 'path' in item ? <PathFilterItem item={item} /> : <SortFilterItem item={item} />;
}
