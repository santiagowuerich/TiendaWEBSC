import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import { Metadata } from 'next';

export const revalidate = 3600; // Revalidar cada hora

export const metadata: Metadata = {
  title: 'SC Equipamientos',
  description: 'Tienda de equipamientos de alta calidad construida con Next.js y Vercel.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
