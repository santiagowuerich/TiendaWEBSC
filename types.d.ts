declare module 'next/navigation' {
  export function notFound(): never;
}

declare module '@portabletext/react' {
  export const PortableText: React.ComponentType<{ value: any }>;
}

// Para componentes internos del proyecto
declare module 'components/product/gallery' {
  interface GalleryProps {
    images: Array<{
      src: string;
      altText?: string;
    }>;
  }
  export const Gallery: React.ComponentType<GalleryProps>;
}

declare module 'nextjs-commerce/components/product/product-description' {
  interface ProductDescriptionProps {
    product: any;
  }
  export const ProductDescription: React.ComponentType<ProductDescriptionProps>;
}

declare module 'nextjs-commerce/lib/sanity' {
  export function getProductBySlug(slug: string): Promise<any>;
  export function formatSanityProduct(product: any): any;
} 