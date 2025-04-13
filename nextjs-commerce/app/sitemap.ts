import { getAllProducts, getAllCategories, sanityClient } from '../lib/sanity';
import { MetadataRoute } from 'next';
import { SanityProduct, SanityCategory } from '../lib/sanity/types';

interface SanityPage {
  slug: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Obtener productos usando la función existente con caché
  const products = await getAllProducts();
  
  // Obtener categorías usando la función existente con caché  
  const categories = await getAllCategories();

  // Obtener páginas estáticas
  const pages = await sanityClient.fetch<SanityPage[]>(`*[_type == "page"] {
    "slug": slug.current
  }`);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tiendaweb-sc.vercel.app';

  // URLs de productos
  const productUrls = products.map((product: SanityProduct) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.8
  }));

  // URLs de categorías
  const categoryUrls = categories.map((category: SanityCategory) => ({
    url: `${baseUrl}/search?category=${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  // URLs de páginas estáticas
  const pageUrls = pages.map((page: SanityPage) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));

  // URLs fijas
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date().toISOString(), 
      changeFrequency: 'daily' as const,
      priority: 0.9
    }
  ];

  return [...staticUrls, ...productUrls, ...categoryUrls, ...pageUrls];
}
