'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form action="/search" className="relative w-full w-80">
      <input
        key={searchParams?.get('q')}
        type="text"
        name="q"
        placeholder="Buscar productos..."
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="w-full h-9 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-base text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="relative w-full w-80">
      <input
        placeholder="Buscar productos..."
        className="w-full h-9 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-base text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
