'use client';

import { PortableText, type PortableTextReactComponents } from '@portabletext/react';
import Footer from 'components/layout/footer';
import React from 'react';

interface PageProps {
  page: {
    title: string;
    content?: any[]; // Volver a any[] para máxima flexibilidad
    lastUpdated?: string;
  } | null;
  fallbackTitle: string;
}

// Componentes para renderizar el contenido de Portable Text (simplificado)
const components: Partial<PortableTextReactComponents> = {
  block: {
    h1: ({children}: {children?: React.ReactNode}) => <h1 className="text-4xl font-bold my-5">{children}</h1>,
    h2: ({children}: {children?: React.ReactNode}) => <h2 className="text-3xl font-bold mt-12 mb-4">{children}</h2>,
    h3: ({children}: {children?: React.ReactNode}) => <h3 className="text-2xl font-bold mt-8 mb-4">{children}</h3>,
    normal: ({children}: {children?: React.ReactNode}) => <p className="my-4">{children}</p>,
    blockquote: ({children}: {children?: React.ReactNode}) => <blockquote className="border-l-4 border-neutral-300 pl-4 italic my-6">{children}</blockquote>,
  },
  list: {
    bullet: ({children}: {children?: React.ReactNode}) => <ul className="list-disc pl-5 my-4 space-y-2">{children}</ul>,
    number: ({children}: {children?: React.ReactNode}) => <ol className="list-decimal pl-5 my-4 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({children}: {children?: React.ReactNode}) => <li>{children}</li>,
    number: ({children}: {children?: React.ReactNode}) => <li>{children}</li>,
  },
  marks: {
    strong: ({children}: {children?: React.ReactNode}) => <strong className="font-bold">{children}</strong>,
    em: ({children}: {children?: React.ReactNode}) => <em className="italic">{children}</em>,
    link: ({value, children}: {value?: {href?: string}, children?: React.ReactNode}) => {
      const href = value?.href;
      const target = (href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a 
          href={href}
          target={target} 
          rel={target === '_blank' ? 'noindex nofollow' : undefined}
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};

export default function DynamicPage({ page, fallbackTitle }: PageProps) {
  // Si no hay página configurada, mostrar contenido de respaldo
  if (!page) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-8 text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {fallbackTitle}
        </h1>
        
        <div className="prose prose-neutral dark:prose-invert">
          <p className="text-lg">
            Por favor, configure esta página en Sanity Studio.
          </p>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Formatear la fecha de última actualización
  const lastUpdatedDate = page.lastUpdated ? 
    new Date(page.lastUpdated).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
        {page.title}
      </h1>
      
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        {page.content && (
          <PortableText 
            value={page.content} 
            components={components} 
          />
        )}
        
        {lastUpdatedDate && (
          <p className="mt-12 italic text-neutral-500">
            Este documento se actualizó por última vez el {lastUpdatedDate}.
          </p>
        )}
      </div>
      
      <Footer />
    </div>
  );
} 