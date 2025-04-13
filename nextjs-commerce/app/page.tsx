import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import BranchButton from 'components/branch-button';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  // Número de WhatsApp para sucursales
  const whatsappNumber = '5493625281890';
  const whatsappMessage = encodeURIComponent('Hola, me gustaría conocer las sucursales disponibles');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      <ThreeItemGrid />
      
      {/* Sección de botón de Sucursales */}
      <div className="w-full flex justify-center my-12">
        <BranchButton href={whatsappUrl} className="mx-auto max-w-xs" />
      </div>
      
      <Carousel />
      <Footer />
    </>
  );
}
