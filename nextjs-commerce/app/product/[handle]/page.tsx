import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

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
  SanityProduct,
} from '../../../lib/sanity';
import Link from 'next/link';

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product: SanityProduct) => ({
    handle: product.slug,
  }));
}

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  
  const sanityProduct = await getProductBySlug(handle);
  if (!sanityProduct) return notFound();

  const product = formatSanityProduct(sanityProduct);
  const { url } = product.featuredImage || {};

  return {
    title: product.title,
    description: product.description || '',
    openGraph: url
      ? {
          images: [
            {
              url,
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
  const { handle } = await params;
  
  const sanityProduct = await getProductBySlug(handle);
  if (!sanityProduct) return notFound();

  const product = formatSanityProduct(sanityProduct);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || '',
    image: product.featuredImage.url,
    offers: {
      '@type': 'Offer',
      price: product.priceRange.maxVariantPrice.amount,
      priceCurrency: product.priceRange.maxVariantPrice.currencyCode,
      availability: 'https://schema.org/InStock',
    },
  };

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
                  images={[
                    {
                      src: product.featuredImage.url || '',
                      altText: product.title,
                    },
                  ]}
                />
              </Suspense>
            </div>

            <div className="w-full p-6 md:p-10 md:w-1/2">
              <Suspense fallback={null}>
                <ProductDescription product={product} />
              </Suspense>
            </div>
          </div>

          {/* Product Description Section - Moved Here */}
          {product.description && (
            <div className="mt-10 md:mt-12 rounded-xl bg-white dark:bg-neutral-900 p-6 md:p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">Descripción</h2>
              <div className="prose prose-neutral max-w-none dark:prose-invert">
                <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">{product.description}</p>
              </div>
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
    const allProducts = await getAllProducts();

    if (!allProducts || !allProducts.length) {
      console.error('No hay productos disponibles');
      return null;
    }

    const relatedProducts = allProducts
      .filter((product: SanityProduct) => product._id !== currentProductId)
      .slice(0, 4)
      .map((product: any) => {
        try {
          return formatSanityProduct(product);
        } catch (err) {
          console.error('Error al formatear producto:', err);
          return null;
        }
      })
      .filter(Boolean);

    if (!relatedProducts.length) return null;

    return (
      <div className="mt-16 md:mt-24">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-10 md:mb-12 text-neutral-900 dark:text-white">
          También te puede interesar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((product: FormattedProduct) => (
            <Link
              key={product.handle}
              href={`/product/${product.handle}`}
              className="group overflow-hidden rounded-2xl bg-[#eceff0] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="aspect-square relative bg-[#eceff0]">
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount:
                      product.priceRange.maxVariantPrice.amount,
                    currencyCode:
                      product.priceRange.maxVariantPrice.currencyCode,
                  }}
                  src={product.featuredImage.url || ''}
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
