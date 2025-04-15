'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import type { ListItem } from '.';
import { FilterItem } from './item';

export default function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState('');
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    let foundMatch = false;
    
    list.forEach((listItem: ListItem) => {
      if (
        ('path' in listItem && pathname === listItem.path) ||
        ('slug' in listItem && searchParams.get('sort') === listItem.slug) ||
        // Comprobar si es una categoría seleccionada
        ('path' in listItem && 
         listItem.path.includes('?category=') && 
         searchParams.get('category') === listItem.path.split('=')[1])
      ) {
        setActive(listItem.title);
        foundMatch = true;
      }
    });
    
    // Si no se encontró coincidencia y hay una opción "Todos", seleccionarla
    if (!foundMatch) {
      const defaultOption = list.find(item => 
        'path' in item && item.path === '/search' && item.title === 'Todos'
      );
      
      if (defaultOption && 'title' in defaultOption) {
        setActive(defaultOption.title);
      } else if (list.length > 0 && list[0] && 'title' in list[0]) {
        // Si no hay opción "Todos", usar el primer elemento de la lista
        setActive(list[0].title);
      }
    }
  }, [pathname, list, searchParams]);

  // Determinar el texto a mostrar en el dropdown
  const displayText = active || 'Seleccionar';

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => {
          setOpenSelect(!openSelect);
        }}
        className="flex w-full items-center justify-between rounded-sm border border-black/30 px-4 py-2 text-sm dark:border-white/30"
      >
        <div>{displayText}</div>
        <ChevronDownIcon className="h-4" />
      </div>
      {openSelect && (
        <div
          onClick={() => {
            setOpenSelect(false);
          }}
          className="absolute z-40 w-full rounded-b-md bg-white p-4 shadow-md dark:bg-black"
        >
          {list.map((item: ListItem, i) => (
            <FilterItem key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
