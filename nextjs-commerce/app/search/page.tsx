import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting, SortFilterItem } from 'lib/constants';
// import { getProducts } from 'lib/shopify'; // Ya no usamos Shopify
import { getAllProducts, getProductsByCategory, formatSanityProduct, getAllCategories, SanityProduct, FormattedProduct } from 'lib/sanity';
import { unstable_cache } from 'next/cache';

export const revalidate = 3600; // Revalidar cada hora

export const metadata = {
  title: 'Búsqueda',
  description: 'Busca productos en la tienda'
};

// Helper para procesar los parámetros de búsqueda (recibe un objeto normal, no una promesa)
function getSearchParams(paramsObj: Record<string, string | string[] | undefined> = {}) {
  return {
    sort: typeof paramsObj.sort === 'string' ? paramsObj.sort : undefined,
    q: typeof paramsObj.q === 'string' ? paramsObj.q : undefined,
    category: typeof paramsObj.category === 'string' ? paramsObj.category : undefined
};
}

export default async function SearchPage({ searchParams }: { 
  searchParams: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>
}) {
  // Esperamos a que searchParams se resuelva antes de usar sus propiedades
  const paramsObj = await searchParams;
  
  // Ahora procesamos el objeto normal (no la promesa)
  const params = getSearchParams(paramsObj);
  
  const { sortKey, reverse } = 
    sorting.find((item) => item.slug === params.sort) || defaultSort;

  // Obtener todas las categorías
  const categories = await getAllCategories();
  
  let categoryValue = '';
  let categoryTitle = '';
  
  if (params.category && categories) {
    const category = categories.find((c: any) => c.slug === params.category);
    if (category) {
      categoryValue = category.slug;
      categoryTitle = category.title;
    }
  }

  // Obtener productos según la categoría si se especifica
  let sanityProducts;
  if (categoryValue) {
    sanityProducts = await getProductsByCategory(categoryValue);
  } else {
    sanityProducts = await getAllProducts();
  }

  // Filtrar por término de búsqueda si existe
  let filteredProducts = sanityProducts;
  
  if (params.q) {
    const searchLower = params.q.toLowerCase();
    filteredProducts = sanityProducts.filter(
      (product: SanityProduct) => 
        product.name.toLowerCase().includes(searchLower) || 
        (product.description && product.description.toLowerCase().includes(searchLower))
    );
  }

  // Aplicar ordenamiento ANTES de formatear
  let sortedProducts: SanityProduct[] = [...filteredProducts]; // Crear copia para ordenar
  if (sortKey === 'PRICE') {
    sortedProducts.sort((a: SanityProduct, b: SanityProduct) => {
      if (reverse) {
        return b.price - a.price; // Descendente
      } else {
        return a.price - b.price; // Ascendente
      }
    });
  } else if (sortKey === 'CREATED_AT') {
    // Nota: Necesitarías el campo _createdAt de Sanity en tus consultas para ordenar por fecha
    // Asumiendo que lo tienes:
    // sortedProducts.sort((a: any, b: any) => {
    //   const dateA = new Date(a._createdAt).getTime();
    //   const dateB = new Date(b._createdAt).getTime();
    //   return reverse ? dateB - dateA : dateA - dateB;
    // });
    console.warn('Ordenamiento por CREATED_AT no implementado completamente sin _createdAt');
  }
  // Implementar otros sortKey si es necesario (BEST_SELLING, RELEVANCE requerirían más lógica o datos)

  // Formatear productos DESPUÉS de ordenar
  const products: FormattedProduct[] = sortedProducts.map(formatSanityProduct);
  const resultsText = products.length > 1 ? 'resultados' : 'resultado';

  return (
    <>
      {params.q ? (
        <p className="mb-4">
          {products.length === 0
            ? 'No hay productos que coincidan con '
            : `Mostrando ${products.length} ${resultsText} para `}
          <span className="font-bold">&quot;{params.q}&quot;</span>
        </p>
      ) : categoryTitle ? (
        <p className="mb-4">
          {products.length === 0
            ? 'No hay productos en esta categoría'
            : `Mostrando ${products.length} ${resultsText} en la categoría `}
          <span className="font-bold">&quot;{categoryTitle}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
