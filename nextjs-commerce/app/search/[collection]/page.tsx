import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityClient } from '../../../lib/sanity';

import Grid from '../../../components/grid';
import ProductGridItems from '../../../components/layout/product-grid-items';
import { defaultSort, sorting } from '../../../lib/constants';

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await sanityClient.fetch(
    `*[_type == "category" && slug.current == $slug][0]`,
    { slug: params.collection }
  );

  if (!collection) return notFound();

  return {
    title: collection.title,
    description: collection.description || `Productos en ${collection.title}`
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  
  const products = await sanityClient.fetch(
    `*[_type == "product" && references(*[_type == "category" && slug.current == $slug]._id)] {
      _id,
      name,
      price,
      description,
      "slug": slug.current,
      "image": images[0].asset->url
    } | order(${sortKey} ${reverse ? 'desc' : 'asc'})`,
    { slug: params.collection }
  );

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No se encontraron productos en esta categoría`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
