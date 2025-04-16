import { GridTileImage } from 'components/grid/tile';
import Link from 'next/link';
import { getAllProducts, formatSanityProduct } from 'lib/sanity';
import clsx from 'clsx';
import { Suspense } from 'react';

// Define un tipo básico para el producto (ajustar según Sanity)
type SanityProductPlaceholder = {
  handle?: string; // De Shopify, mantener por si acaso?
  slug?: { current: string }; // De Sanity
  featuredImage?: { url: string }; // De Shopify
  image?: any; // De Sanity
  title?: string; // De Shopify
  name?: string; // De Sanity
  priceRange?: any; // De Shopify
  price?: number; // De Sanity
  currencyCode?: string; // De Sanity (o fijo)
};

// Renombrar para usar en el componente
type SanityProduct = ReturnType<typeof formatSanityProduct>;

// Componente de placeholder para carga
function ThreeItemGridItemPlaceholder({ size }: { size: 'full' | 'half' }) {
  return (
    <div
      className={clsx('relative aspect-square overflow-hidden rounded-2xl bg-[#eceff0] dark:bg-neutral-800 animate-pulse', {
        'md:col-span-4 md:row-span-2': size === 'full',
        'md:col-span-2 md:row-span-1': size === 'half'
      })}
    />
  );
}

function ThreeItemGridItem({
  item,
  size,
  priority
}: {
  item: SanityProduct;
  size: 'full' | 'half';
  priority?: boolean;
}) {
  return (
    <div
      className={clsx('relative aspect-square overflow-hidden rounded-2xl bg-[#eceff0] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]', {
        'md:col-span-4 md:row-span-2': size === 'full',
        'md:col-span-2 md:row-span-1': size === 'half'
      })}
    >
      <Link className="relative h-full w-full" href={`/product/${item.handle}`}>
        <GridTileImage
          src={item.featuredImage.url || ''}
          fill
          sizes={
            size === 'full'
              ? '(min-width: 768px) 66vw, 100vw'
              : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode
          }}
          className="aspect-square object-cover"
        />
      </Link>
    </div>
  );
}

// Componente asíncrono para cargar los productos
async function GridItems() {
  // Obtener productos desde Sanity
  const rawProducts = await getAllProducts();
  
  // Dar formato a los productos
  const products = rawProducts.map(formatSanityProduct);

  if (!products.length) return null;

  // Usar los primeros 3 productos si existen, o rellenar con undefined
  const [firstProduct, secondProduct, thirdProduct] = [
    products[0] || undefined,
    products[1] || undefined,
    products[2] || undefined
  ];
  
  // Si no hay al menos un producto, no mostrar nada
  if (!firstProduct) return null;

  return (
    <>
      {firstProduct && <ThreeItemGridItem size="full" item={firstProduct} priority={true} />}
      {secondProduct && <ThreeItemGridItem size="half" item={secondProduct} priority={true} />}
      {thirdProduct && <ThreeItemGridItem size="half" item={thirdProduct} />}
    </>
  );
}

// Componente principal con Suspense
export function ThreeItemGrid() {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <Suspense fallback={
        <>
          <ThreeItemGridItemPlaceholder size="full" />
          <ThreeItemGridItemPlaceholder size="half" />
          <ThreeItemGridItemPlaceholder size="half" />
        </>
      }>
        <GridItems />
      </Suspense>
    </section>
  );
}
