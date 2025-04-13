import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageByType } from 'lib/sanity';
import DynamicPage from 'components/page/dynamic-page';

export const metadata: Metadata = {
  title: 'Política de Envíos',
  description: 'Información sobre nuestras políticas de envío y entrega de productos.'
};

export default async function ShippingPage() {
  // Obtener la página de política de envíos desde Sanity
  const page = await getPageByType('shipping');
  
  // Si el cliente solicita específicamente la página pero no existe, devolver 404
  if (!page && process.env.NODE_ENV !== 'development') {
    return notFound();
  }
  
  return <DynamicPage page={page} fallbackTitle="Política de Envíos" />;
} 