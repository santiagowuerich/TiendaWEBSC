import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import Link from 'next/link';

export default function ProductGridItems({ products }: { products: any[] }) {
  return (
    <>
      {products.map((product) => (
        <Link
          key={product.id}
          className="group animate-fadeIn rounded-xl border-0 p-3 shadow-sm transition-all duration-200 hover:shadow-md"
          href={`/product/${product.handle}`}
          prefetch={false}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                position: 'bottom'
              }}
              src={product.featuredImage?.url || ''}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
        </Link>
      ))}
    </>
  );
}
