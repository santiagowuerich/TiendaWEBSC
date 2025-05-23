import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';

import { Gallery } from '../../components/product/gallery';
import { ProductDescription } from '../../nextjs-commerce/components/product/product-description';
import {
  getProductBySlug,
  formatSanityProduct,
} from '../../nextjs-commerce/lib/sanity';

export async function generateMetadata({ params }) {
  const awaitedParams = await Promise.resolve(params);
  const productBySlug = await getProductBySlug(awaitedParams.handle);

  if (!productBySlug) return notFound();

  const formattedProduct = formatSanityProduct(productBySlug);

  const firstImage =
    formattedProduct.images && formattedProduct.images.length > 0
      ? formattedProduct.images[0]
      : undefined;

  return {
    title: formattedProduct.title || 'Product',
    description: formattedProduct.description
      ? JSON.stringify(formattedProduct.description).substring(0, 150) + '...'
      : 'Product description',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: firstImage
      ? {
          images: [
            {
              url: firstImage.src,
              width: firstImage.width || 1200,
              height: firstImage.height || 630,
              alt: firstImage.alt || formattedProduct.title
            }
          ]
        }
      : null
  };
}

export default async function ProductPage({ params }) {
  const awaitedParams = await Promise.resolve(params);
  const productBySlug = await getProductBySlug(awaitedParams.handle);
  console.log('Debug: productBySlug (raw from Sanity):', JSON.stringify(productBySlug, null, 2));

  if (!productBySlug) {
    notFound();
    return;
  }

  const product = formatSanityProduct(productBySlug);
  console.log('Debug: formattedProduct:', JSON.stringify(product, null, 2));

  const productVariants = product.variants || [];
  const productOptions = product.options || [];

  const galleryImages =
    product.images?.map((image) => ({
      src: image.src,
      altText: image.alt || product.title || 'Product image'
    })) || [];

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description ? JSON.stringify(product.description) : undefined,
    image: galleryImages[0]?.src,
    offers: {
      '@type': 'Offer',
      price: product.priceRange.maxVariantPrice.amount,
      priceCurrency: product.priceRange.maxVariantPrice.currencyCode,
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
        
        {(() => {
          if (typeof window === 'undefined') {
            console.log("LOG 3 (SSR) - VALOR DE product.description ANTES DE RENDERIZAR:", JSON.stringify(product.description, null, 2));
          }
          return null;
        })()}

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