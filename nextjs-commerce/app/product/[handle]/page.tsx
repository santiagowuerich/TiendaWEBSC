import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PortableText } from '@portabletext/react';

import { GridTileImage } from '../../../components/grid/tile';
import Footer from '../../../components/layout/footer';
import { Gallery } from '../../../components/product/gallery';
import { ProductProvider } from '../../../components/product/product-context';
import { ProductDescription } from '../../../components/product/product-description';
import {
  getProductBySlug,
  getAllProducts,
  formatSanityProduct,
  FormattedProduct,
  SanityProductForFormatting,
  SanityProduct,
} from '../../../lib/sanity';
import Link from 'next/link';

export const revalidate = 3600;

export async function generateStaticParams() {
  const productsFromSanity = await getAllProducts();
  const formattedProducts = productsFromSanity.map((p: SanityProductForFormatting) => formatSanityProduct(p));
  return formattedProducts.map((product: FormattedProduct) => ({
    handle: product.handle,
  }));
}

interface PageProps {
  params: { handle: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const { handle } = resolvedParams;
  
  const sanityProduct = await getProductBySlug(handle);
  if (!sanityProduct) return notFound();

  const product = formatSanityProduct(sanityProduct as SanityProductForFormatting);

  const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;
  const imageUrl = firstImage?.src;

  return {
    title: product.title,
    description: product.description ? JSON.stringify(product.description) : undefined,
    openGraph: imageUrl
      ? {
          images: [
            {
              url: imageUrl,
              width: 900,
              height: 900,
              alt: product.title,
            },
          ],
        }
      : null,
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const { handle } = resolvedParams;
  
  const sanityProductRaw = await getProductBySlug(handle);
  
  console.log("LOG 1 - SANITY PRODUCT RAW:", JSON.stringify(sanityProductRaw, null, 2));
  
  if (!sanityProductRaw) {
    console.log("LOG - Producto no encontrado en Sanity para el handle:", handle);
    notFound();
    return null;
  }

  const product = formatSanityProduct(sanityProductRaw as SanityProductForFormatting);
  
  console.log("LOG 2 - FORMATTED PRODUCT DESCRIPTION:", JSON.stringify(product.description, null, 2));

  console.log("LOG 2.1 - ¿Description existe?:", !!product.description);
  console.log("LOG 2.2 - ¿Description es un array?:", Array.isArray(product.description));
  if (Array.isArray(product.description)) {
    console.log("LOG 2.3 - Longitud del array description:", product.description.length);
  }

  const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;
  const imageUrlForJsonLd = firstImage?.src;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description ? JSON.stringify(product.description) : undefined,
    image: imageUrlForJsonLd,
    offers: {
      '@type': 'Offer',
      price: product.priceRange.maxVariantPrice.amount,
      priceCurrency: product.priceRange.maxVariantPrice.currencyCode,
      availability: 'https://schema.org/InStock',
    },
  };

  const validGalleryImages = product.images.filter(img => typeof img.src === 'string' && img.src !== '') as { src: string; altText: string }[];

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10 md:py-12 lg:py-16 text-center">Cargando detalles del producto...</div>}>
      <ProductProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-12 lg:py-16">
          <div className="flex flex-col rounded-2xl bg-[#eceff0] dark:bg-black shadow-lg overflow-hidden md:flex-row">
            <div className="w-full md:w-1/2">
              <Suspense
                fallback={
                  <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
                }
              >
                <Gallery
                  images={validGalleryImages}
                />
              </Suspense>
            </div>

            <div className="w-full p-6 md:p-10 md:w-1/2">
              <Suspense fallback={null}>
                <ProductDescription product={product} />
              </Suspense>
            </div>
          </div>

          {(() => {
            if (typeof window === 'undefined') {
              console.log("LOG 3 (SSR) - VALOR DE product.description ANTES DE RENDERIZAR:", JSON.stringify(product.description, null, 2));
            }
            return null;
          })()}

          {product.description && Array.isArray(product.description) && product.description.length > 0 ? (
            <div className="mt-10 md:mt-12 rounded-xl bg-white dark:bg-neutral-900 p-6 md:p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">Descripción</h2>
              <div className="prose prose-neutral max-w-none dark:prose-invert">
                <PortableText value={product.description} />
              </div>
            </div>
          ) : (
            <div className="mt-10 md:mt-12 rounded-xl bg-red-100 dark:bg-red-900 p-6 md:p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold text-red-900 dark:text-white">No hay descripción disponible</h2>
              <p>La descripción de este producto no está disponible o no cumple con el formato requerido.</p>
              <p>Condiciones: product.description={!!product.description ? "existe" : "no existe"}, 
                 Array.isArray={Array.isArray(product.description) ? "sí" : "no"}, 
                 Length={Array.isArray(product.description) ? product.description.length : "N/A"}</p>
            </div>
          )}

          <Suspense
            fallback={
              <div className="mt-16 text-center">
                Cargando productos relacionados...
              </div>
            }
          >
            <RelatedProducts currentProductId={product.id} />
          </Suspense>
        </div>
        <Footer />
      </ProductProvider>
    </Suspense>
  );
}

async function RelatedProducts({
  currentProductId,
}: {
  currentProductId: string;
}) {
  try {
    const allSanityProducts = await getAllProducts();

    if (!allSanityProducts || !allSanityProducts.length) {
      console.error('No hay productos disponibles para RelatedProducts');
      return null;
    }
    
    const relatedProducts = allSanityProducts
      .map((p: SanityProductForFormatting) => formatSanityProduct(p))
      .filter((formattedP: FormattedProduct) => formattedP.id !== currentProductId)
      .slice(0, 4);

    if (!relatedProducts.length) return null;

    return (
      <div className="mt-16 md:mt-24">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-10 md:mb-12 text-neutral-900 dark:text-white">
          También te puede interesar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((relatedProduct: FormattedProduct) => (
            <Link
              key={relatedProduct.handle}
              href={`/product/${relatedProduct.handle}`}
              className="group overflow-hidden rounded-2xl bg-[#eceff0] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="aspect-square relative bg-[#eceff0]">
                <GridTileImage
                  alt={relatedProduct.title}
                  label={{
                    title: relatedProduct.title,
                    amount:
                      relatedProduct.priceRange.maxVariantPrice.amount,
                    currencyCode:
                      relatedProduct.priceRange.maxVariantPrice.currencyCode,
                  }}
                  src={relatedProduct.images[0]?.src || ''}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-square object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error al obtener productos relacionados:', error);
    return null;
  }
}
