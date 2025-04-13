import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageByType } from 'lib/sanity';
import DynamicPage from 'components/page/dynamic-page';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes',
  description: 'Respuestas a las preguntas más comunes sobre nuestros productos y servicios.'
};

export default async function FAQPage() {
  // Obtener la página de preguntas frecuentes desde Sanity
  const page = await getPageByType('faq');
  
  // Si el cliente solicita específicamente la página pero no existe, devolver 404
  if (!page && process.env.NODE_ENV !== 'development') {
    return notFound();
  }
  
  return <DynamicPage page={page} fallbackTitle="Preguntas Frecuentes" />;
} 