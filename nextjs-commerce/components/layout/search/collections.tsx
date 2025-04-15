import clsx from 'clsx';
import { Suspense } from 'react';

import { getAllCategories } from 'lib/sanity';
import FilterList from './filter';

async function CollectionList() {
  const categories = await getAllCategories();
  
  // Crear una opción "Todo" al inicio (cambiado de "Todos" a "Todo")
  const allOption = {
    handle: '',
    title: 'Todo',
    path: '/search'
  };
  
  // Transformar categorías de Sanity al formato esperado por FilterList
  const formattedCategories = categories.map((category: any) => ({
    handle: category.slug,
    title: category.title,
    path: `/search?category=${category.slug}`
  }));
  
  // Combinar la opción "Todo" con las categorías
  const finalList = [allOption, ...formattedCategories];
  
  return <FilterList list={finalList} title="Categorías" />;
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded-sm';
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700';

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
