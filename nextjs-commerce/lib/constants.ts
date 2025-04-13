export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Relevancia',
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: 'Más vendidos',
    slug: 'best-selling',
    sortKey: 'BEST_SELLING',
    reverse: false
  },
  {
    title: 'Más nuevos',
    slug: 'newest',
    sortKey: 'CREATED_AT',
    reverse: true
  },
  {
    title: 'Precio: Menor a Mayor',
    slug: 'price-asc',
    sortKey: 'PRICE',
    reverse: false
  },
  {
    title: 'Precio: Mayor a Menor',
    slug: 'price-desc',
    sortKey: 'PRICE',
    reverse: true
  }
];

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Título Predeterminado';
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2023-01/graphql.json';
