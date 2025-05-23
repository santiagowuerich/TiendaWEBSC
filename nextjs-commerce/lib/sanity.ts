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
  description?: any;
  category: string;
  categoryTitle: string;
  images: Array<{
    src: string | undefined;
    altText: string;
  }>;
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
  const products = await sanityClient.fetch(
    `*[_type == "product" && !(_id in path('drafts.**'))] { // Filtro para excluir borradores
      _id,
      name,
      "slug": slug.current,
      "category": category->slug.current,
      "categoryTitle": category->title,
      price,
      stock,
      description,
      images // Cambiado de image a images
    }`,
    {},
    { next: { revalidate: 60 } } // Mantener revalidación
  );
  return products;
}

// Función para obtener productos por categoría (sin cachedFetch y con filtro)
export async function getProductsByCategory(categorySlug: string) {
  console.log(`[DEBUG] Fetching products for category slug: ${categorySlug}`); // Log de entrada
  const products = await sanityClient.fetch(
    `*[_type == "product" && category->slug.current == $categorySlug && !(_id in path('drafts.**'))] {
      _id,
      name,
      "slug": slug.current,
      "category": category->slug.current,
      "categoryTitle": category->title,
      price,
      stock,
      description,
      images // Cambiado de image a images
    }`,
    { categorySlug },
    { next: { revalidate: 60 } } // Revalidación de 60 segundos
  );
  console.log(`[DEBUG] Found ${products.length} products for slug ${categorySlug}`); // Log de salida
  return products;
}

// Función para obtener un producto específico por slug (sin cachedFetch y con filtro)
export async function getProductBySlug(slug: string) {
  console.log(`[DEBUG] Fetching product for slug: ${slug}`); // Log de entrada
  const product = await sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug && !(_id in path('drafts.**'))][0] { // Filtro para excluir borradores
      _id,
      name,
      "slug": slug.current,
      "category": category->slug.current,
      "categoryTitle": category->title,
      price,
      stock,
      description,
      images // Cambiado de image a images
    }`,
    { slug },
    { next: { revalidate: 60 } } // Revalidación de 60 segundos
  );
  console.log(`[DEBUG] Found product for slug ${slug}:`, !!product); // Log de salida
  if (!product) return null;
  return product;
}

// SanityProduct (asumiendo que se usa como tipo de entrada para formatSanityProduct)
// Esta interfaz debería coincidir con lo que devuelve tu consulta GROQ
export interface SanityProductForFormatting {
  _id: string;
  name: string;
  slug: string; // Asumiendo que slug es un string después de la consulta
  description?: any; // Portable Text
  category?: string;
  categoryTitle?: string;
  images?: any[]; // Array de imágenes de Sanity (contienen asset._ref)
  price: number;
  // Agrega otros campos que tu consulta GROQ devuelve
}

// Función para convertir un producto de Sanity a un formato compatible con la interfaz
export function formatSanityProduct(product: SanityProductForFormatting): FormattedProduct {
  
  const processedImages = (product.images || []).map(imageSource => {
    let imageUrl = '';
    if (imageSource && imageSource.asset) {
      try {
        imageUrl = urlFor(imageSource).url(); 
        
        if (imageUrl && imageUrl.startsWith('//')) {
          imageUrl = `https:${imageUrl}`;
        }
      } catch (e) {
        console.error("Error al obtener URL de imagen con Sanity:", e, imageSource);
        imageUrl = ''; 
      }
    }
    return {
      src: imageUrl,
      altText: product.name || 'Imagen del producto' 
    };
  });

  // Verificar si hay descripción, si no existe o está vacía, crear una por defecto
  let description = product.description;
  if (!description || (Array.isArray(description) && description.length === 0)) {
    // Crear un bloque de descripción predeterminado en formato PortableText
    description = [
      {
        _type: 'block',
        style: 'normal',
        _key: 'default_description',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'default_span',
            text: 'No hay descripción disponible para este producto.',
            marks: []
          }
        ]
      }
    ];
    console.log("LOG - Se creó una descripción predeterminada porque el producto no tenía ninguna.");
  } 
  // Si la descripción es texto plano (string), convertirla al formato PortableText
  else if (typeof description === 'string') {
    // Dividir el texto por saltos de línea para mantener el formato
    const paragraphs = description.split('\n\n');
    
    // Crear un array de bloques de PortableText con cada párrafo
    description = paragraphs.map((paragraph, index) => {
      // Si el párrafo está vacío, saltar
      if (!paragraph.trim()) return null;
      
      return {
        _type: 'block',
        style: 'normal',
        _key: `converted_paragraph_${index}`,
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: `converted_span_${index}`,
            text: paragraph,
            marks: []
          }
        ]
      };
    }).filter(block => block !== null); // Eliminar bloques nulos
    
    console.log("LOG - Se convirtió la descripción de texto plano a formato PortableText.");
  }

  return {
    id: product._id,
    handle: product.slug,
    title: product.name,
    description: description, // Usar la descripción verificada
    category: product.category || 'otros',
    categoryTitle: product.categoryTitle || 'Otros',
    images: processedImages,
    priceRange: {
      maxVariantPrice: {
        amount: product.price.toString(),
        currencyCode: 'ARS' 
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