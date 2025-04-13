import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageByType } from 'lib/sanity';
import DynamicPage from 'components/page/dynamic-page';

export const metadata: Metadata = {
  title: 'Acerca de Nosotros',
  description: 'Conoce más sobre nuestra empresa y nuestra misión.'
};

export default async function AboutPage() {
  // Obtener la página acerca de desde Sanity
  const page = await getPageByType('about');
  
  // Si el cliente solicita específicamente la página pero no existe, devolver 404
  if (!page && process.env.NODE_ENV !== 'development') {
    return notFound();
  }
  
  return <DynamicPage page={page} fallbackTitle="Acerca de Nosotros" />;
} 