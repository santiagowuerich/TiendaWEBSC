import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageByType } from 'lib/sanity';
import DynamicPage from 'components/page/dynamic-page';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Información sobre cómo protegemos y manejamos tus datos personales.'
};

export default async function PrivacyPage() {
  // Obtener la página de política de privacidad desde Sanity
  const page = await getPageByType('privacy');
  
  // Si el cliente solicita específicamente la página pero no existe, devolver 404
  if (!page && process.env.NODE_ENV !== 'development') {
    return notFound();
  }
  
  return <DynamicPage page={page} fallbackTitle="Política de Privacidad" />;
} 