import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Cache para almacenar resultados y evitar consultas repetidas
const CACHE_DURATION_MS = 60000; // 1 minuto de caché
const cache: {
  [key: string]: {
    data: any;
    timestamp: number;
  };
} = {};

// Interfaces para tipado
export interface SanityProduct {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  categoryTitle?: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

export interface FormattedProduct {
  id: string;
  handle: string;
  title: string;
  description?: string;
  category: string;
  categoryTitle: string;
  featuredImage: {
    url: string | undefined;
    altText: string;
  };
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    }
  }
}

// Configuración del cliente
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-01-01', // Usar una fecha reciente
  useCdn: true, // Usar CDN para lecturas en producción
  token: process.env.SANITY_API_TOKEN // Si el dataset es privado
});

// Inicializar el builder de URL para imágenes
const builder = imageUrlBuilder(sanityClient);

// Función para generar URL de imagen
export function urlFor(source: SanityImageSource) {
  if (!source) return {
    url: () => ''
  };
  return builder.image(source).auto('format').quality(80);
}

// Función de caché genérica para consultas
async function cachedFetch<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cachedItem = cache[cacheKey];

  // Si existe en caché y no ha expirado, devolver dato cacheado
  if (cachedItem && now - cachedItem.timestamp < CACHE_DURATION_MS) {
    return cachedItem.data as T;
  }

  // Realizar la consulta y almacenar en caché
  const data = await fetchFn();
  cache[cacheKey] = { data, timestamp: now };
  return data;
}

// Procesar la imagen para un producto de manera optimizada
function processProductImage(product: any) {
  try {
    let imageUrl = '';
    if (product.image && product.image.asset) {
      imageUrl = urlFor(product.image).url();
      
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `https:${imageUrl}`;
      }
    }
    
    return {
      ...product,
      imageUrl
    };
  } catch (error) {
    console.error('Error al procesar imagen para producto:', product._id, error);
    return {
      ...product,
      imageUrl: ''
    };
  }
}

// Función para obtener todas las categorías
export async function getAllCategories() {
  return cachedFetch('all-categories', async () => {
    const categories = await sanityClient.fetch(
      `*[_type == "category"] {
        _id,
        title,
        "slug": slug.current,
        description
      }`
    );
    return categories;
  });
}

// Función para obtener todos los productos
export async function getAllProducts() {
  return cachedFetch('all-products', async () => {
    const products = await sanityClient.fetch(
      `*[_type == "product"] {
        _id,
        name,
        "slug": slug.current,
        "category": category->slug.current,
        "categoryTitle": category->title,
        price,
        stock,
        description,
        image
      }`
    );
    
    // Procesar imágenes solo una vez y almacenar en caché
    return products.map(processProductImage);
  });
}

// Función para obtener productos por categoría
export async function getProductsByCategory(categorySlug: string) {
  return cachedFetch(`products-by-category-${categorySlug}`, async () => {
    const products = await sanityClient.fetch(
      `*[_type == "product" && category->slug.current == $categorySlug] {
        _id,
        name,
        "slug": slug.current,
        "category": category->slug.current,
        "categoryTitle": category->title,
        price,
        stock,
        description,
        image
      }`,
      { categorySlug }
    );
    
    return products.map(processProductImage);
  });
}

// Función para obtener un producto específico por slug
export async function getProductBySlug(slug: string) {
  return cachedFetch(`product-${slug}`, async () => {
    const product = await sanityClient.fetch(
      `*[_type == "product" && slug.current == $slug][0] {
        _id,
        name,
        "slug": slug.current,
        "category": category->slug.current,
        "categoryTitle": category->title,
        price,
        stock,
        description,
        image
      }`,
      { slug }
    );
    
    if (!product) return null;
    return processProductImage(product);
  });
}

// Función para convertir un producto de Sanity a un formato compatible con la interfaz
export function formatSanityProduct(product: SanityProduct): FormattedProduct {
  // Asegurarse de que imageUrl no sea null/undefined
  const imageUrl = product.imageUrl || '';
  
  return {
    id: product._id,
    handle: product.slug,
    title: product.name,
    description: product.description,
    category: product.category || 'otros',
    categoryTitle: product.categoryTitle || 'Otros',
    featuredImage: {
      url: imageUrl,
      altText: product.name
    },
    priceRange: {
      maxVariantPrice: {
        amount: product.price.toString(),
        currencyCode: 'ARS' // Cambiado de USD a ARS
      }
    }
  };
}

// Función para obtener una página específica por tipo
export async function getPageByType(pageType: string) {
  return cachedFetch(`page-type-${pageType}`, async () => {
    const page = await sanityClient.fetch(
      `*[_type == "page" && pageType == $pageType][0] {
        _id,
        title,
        "slug": slug.current,
        pageType,
        content,
        lastUpdated
      }`,
      { pageType }
    );
    
    return page;
  });
}

// Función para obtener una página por slug
export async function getPageBySlug(slug: string) {
  return cachedFetch(`page-slug-${slug}`, async () => {
    const page = await sanityClient.fetch(
      `*[_type == "page" && slug.current == $slug][0] {
        _id,
        title,
        "slug": slug.current,
        pageType,
        content,
        lastUpdated
      }`,
      { slug }
    );
    
    return page;
  });
}

// Función para obtener todas las páginas
export async function getAllPages() {
  return cachedFetch('all-pages', async () => {
    const pages = await sanityClient.fetch(
      `*[_type == "page"] {
        _id,
        title,
        "slug": slug.current,
        pageType
      }`
    );
    
    return pages;
  });
} 