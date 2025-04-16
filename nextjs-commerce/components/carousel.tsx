// import { getCollectionProducts } from 'lib/shopify'; // Eliminado
import Link from 'next/link';
import { GridTileImage } from './grid/tile';
import { getAllProducts, formatSanityProduct } from 'lib/sanity';
import { Suspense } from 'react';

// Componente para mostrar un placeholder mientras se cargan las imágenes
function ProductPlaceholder() {
  return (
    <li className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[275px] flex-none md:w-1/3 md:max-w-[275px] animate-pulse">
      <div className="h-full w-full bg-black rounded-lg"></div>
    </li>
  );
}

// Componente para mostrar un producto en el carrusel
function ProductItem({ product, index }: { product: any; index: number }) {
  return (
          <li
      key={`${product.handle || index}`}
      className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[275px] flex-none md:w-1/3 md:max-w-[275px]"
          >
            <Link href={`/product/${product.handle}`} className="relative h-full w-full">
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode
                }}
          src={product.featuredImage.url}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          priority={index < 3} // Solo cargar con prioridad los primeros 3 productos
              />
            </Link>
          </li>
  );
}

// Componente asíncrono para cargar los productos
async function ProductCarousel() {
  const rawProducts = await getAllProducts();
  
  if (!rawProducts?.length) return null;
  
  const products = rawProducts.map(formatSanityProduct);
  // Duplicar productos para el efecto de bucle infinito
  const carouselProducts = [...products];

  return (
    <ul
      className="flex animate-carousel gap-4"
    >
      {/* Duplicar los productos para el efecto de bucle infinito */}
      {[...carouselProducts, ...carouselProducts].map((product, i) => (
        <ProductItem key={`${product.handle}-${i}`} product={product} index={i} />
      ))}
    </ul>
  );
}

// Componente principal del carrusel
export function Carousel() {
  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <Suspense fallback={
        <ul className="flex gap-4">
          {[...Array(6)].map((_, i) => (
            <ProductPlaceholder key={i} />
        ))}
      </ul>
      }>
        <ProductCarousel />
      </Suspense>
    </div>
  );
}
