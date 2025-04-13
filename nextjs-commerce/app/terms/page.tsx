import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageByType } from 'lib/sanity';
import DynamicPage from 'components/page/dynamic-page';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Información sobre los términos y condiciones para el uso de nuestros servicios y productos.'
};

export default async function TermsPage() {
  // Obtener la página de términos y condiciones desde Sanity
  const page = await getPageByType('terms');
  
  // Si el cliente solicita específicamente la página pero no existe, devolver 404
  if (!page && process.env.NODE_ENV !== 'development') {
    return notFound();
  }
  
  return <DynamicPage page={page} fallbackTitle="Términos y Condiciones" />;
} 