import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';

// Importaciones reales (ajusta las rutas según tu estructura)
import { Gallery } from '../../../components/product/gallery';
import { ProductDescription } from '../../../nextjs-commerce/components/product/product-description';
import {
  getProductBySlug,
  formatSanityProduct,
} from '../../../nextjs-commerce/lib/sanity';

// Elimino los mocks ya que usamos las importaciones reales

export async function generateMetadata({ params }, parent) {
  // En React Server Components, params ya es una promesa en Next.js 15 canary
  const resolvedParams = await params;
  const productBySlug = await getProductBySlug(resolvedParams.handle);

  if (!productBySlug) {
    return {
      title: 'Producto no encontrado',
    };
  }
  
  const formattedProduct = formatSanityProduct(productBySlug);
  const firstImage = formattedProduct.images?.[0];

  return {
    title: formattedProduct.title || 'Producto',
    description: formattedProduct.description 
      ? typeof formattedProduct.description === 'string' 
        ? formattedProduct.description.substring(0, 150) + '...'
        : JSON.stringify(formattedProduct.description).substring(0, 150) + '...'
      : 'Descripción del producto.',
    openGraph: firstImage
      ? {
          images: [
            {
              url: firstImage.src,
              width: firstImage.width || 1200,
              height: firstImage.height || 630,
              alt: firstImage.alt || formattedProduct.title,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage({ params }) {
  // En React Server Components, params ya es una promesa en Next.js 15 canary
  const resolvedParams = await params;
  const productBySlug = await getProductBySlug(resolvedParams.handle);

  if (!productBySlug) {
    notFound();
    return null;
  }

  const product = formatSanityProduct(productBySlug);

  const galleryImages = product.images?.map((image) => ({ 
    src: image.src,
    altText: image.alt || product.title || 'Imagen del producto',
  })) || [];

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description ? JSON.stringify(product.description) : undefined,
    image: galleryImages[0]?.src,
    offers: {
      '@type': 'Offer',
      price: product.priceRange?.maxVariantPrice?.amount,
      priceCurrency: product.priceRange?.maxVariantPrice?.currencyCode,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery images={galleryImages} />
            </Suspense>
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={product} />
          </div>
        </div>
        
        {product.description && Array.isArray(product.description) && product.description.length > 0 && (
          <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
            <h2 className="mb-4 text-xl font-bold">Descripción</h2>
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              <PortableText value={product.description} />
            </div>
          </div>
        )}
      </div>
    </>
  );
} 