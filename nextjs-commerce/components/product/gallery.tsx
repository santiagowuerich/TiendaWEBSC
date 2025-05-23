'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  // Filtro inicial más robusto para imágenes válidas
  const validImages = images.filter(img => img && typeof img.src === 'string' && img.src.trim() !== '');

  if (!validImages.length) {
    return (
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-xl bg-[#eceff0] flex items-center justify-center">
        <span className="text-neutral-500">Imagen no disponible</span>
      </div>
    );
  }

  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  
  // Asegurar que imageIndex esté dentro de los límites de validImages
  let initialImageIndex = state.image ? parseInt(state.image) : 0;
  if (initialImageIndex < 0 || initialImageIndex >= validImages.length) {
    initialImageIndex = 0;
  }
  const [imageIndex, setImageIndexState] = useState(initialImageIndex);
  const [isLoading, setIsLoading] = useState(true);

  // Actualizar el imageIndex del contexto y la URL
  const setCurrentImage = (index: number) => {
    setImageIndexState(index);
    updateImage(index.toString());
    updateURL('image', index.toString());
  };

  const nextImageIndex = imageIndex + 1 < validImages.length ? imageIndex + 1 : 0;
  const previousImageIndex = imageIndex === 0 ? validImages.length - 1 : imageIndex - 1;

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center justify-center';

  const currentImageSrc = validImages[imageIndex]?.src;
  const currentImageAlt = validImages[imageIndex]?.altText || 'Imagen de producto';
  const isSanityImage = currentImageSrc?.includes('cdn.sanity.io') ?? false;

  useEffect(() => {
    // Cuando cambia el imageIndex (y por ende, currentImageSrc), reinicia isLoading.
    if (currentImageSrc) {
      setIsLoading(true);
    }
  }, [imageIndex, currentImageSrc]); // Depender de imageIndex o currentImageSrc
  
  // Efecto para precargar imágenes (opcional pero bueno para UX)
  useEffect(() => {
    if (validImages.length > 1) {
      const preload = (srcCandidate: string | undefined) => {
        if (srcCandidate) new window.Image().src = srcCandidate;
      };
      preload(validImages[nextImageIndex]?.src);
      preload(validImages[previousImageIndex]?.src);
    }
  }, [nextImageIndex, previousImageIndex, validImages]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-xl bg-[#eceff0]">
        {validImages.length > 1 && (
          <>
            <button
              aria-label="Previous Product Image"
              className={`${buttonClassName} absolute left-0 top-0 z-10`}
              onClick={() => setCurrentImage(previousImageIndex)}
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <button
              aria-label="Next Product Image"
              className={`${buttonClassName} absolute right-0 top-0 z-10`}
              onClick={() => setCurrentImage(nextImageIndex)}
            >
              <ArrowRightIcon className="h-6 w-6" />
            </button>
          </>
        )}

        <div className="relative h-full w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#eceff0] dark:bg-neutral-900 animate-pulse rounded-xl">
              <span className="sr-only">Cargando...</span>
            </div>
          )}
          <div className="absolute inset-0 rounded-xl border border-neutral-200 dark:border-neutral-00" />
          {currentImageSrc && (
            <Image
              key={currentImageSrc} // Añadir key para forzar re-renderizado si src cambia mucho
              className={`h-full w-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={currentImageSrc}
              alt={currentImageAlt}
              priority={true}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                console.error("Error al cargar imagen:", currentImageSrc);
              }}
              unoptimized={isSanityImage}
            />
          )}
          {!currentImageSrc && !isLoading && (
             <div className="flex items-center justify-center h-full w-full">
               <span className="text-neutral-500">Error al cargar imagen principal</span>
             </div>
          )}
        </div>
      </div>
      {/* Miniaturas eliminadas */}
    </div>
  );
}
