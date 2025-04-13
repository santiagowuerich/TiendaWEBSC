'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from 'components/grid/tile';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  if (!images?.length) return null;

  // Filtra imágenes sin URL
  const validImages = images.filter(img => img.src);
  if (!validImages.length) return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-xl bg-[#eceff0] flex items-center justify-center">
        <span className="text-neutral-500">Imagen no disponible</span>
      </div>
    </div>
  );

  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const imageIndex = state.image ? parseInt(state.image) : 0;
  const [isLoading, setIsLoading] = useState(true);

  const [mainImage, ...otherImages] = validImages;

  const nextImageIndex = imageIndex + 1 < validImages.length ? imageIndex + 1 : 0;
  const previousImageIndex = imageIndex === 0 ? validImages.length - 1 : imageIndex - 1;

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';

  // Precarga de imágenes para navegación más fluida
  useEffect(() => {
    // Precarga la imagen anterior y siguiente
    if (validImages.length > 1) {
      const preloadImage = (src: string) => {
        if (!src) return;
        const img = new window.Image();
        img.src = src;
      };
      
      // Precarga la siguiente imagen
      if (validImages[nextImageIndex]?.src) {
        preloadImage(validImages[nextImageIndex].src);
      }
      
      // Precarga la imagen anterior
      if (validImages[previousImageIndex]?.src) {
        preloadImage(validImages[previousImageIndex].src);
      }
    }
  }, [imageIndex, nextImageIndex, previousImageIndex, validImages]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-xl bg-[#eceff0]">
        {validImages.length > 1 ? (
          <>
            <button
              aria-label="previous"
              className={`${buttonClassName} absolute left-0 top-0 z-10`}
              onClick={(event) => {
                event.stopPropagation();
                updateImage(previousImageIndex.toString());
                updateURL('image', previousImageIndex.toString());
              }}
            >
              <ArrowLeftIcon className="h-6" />
            </button>
            <button
              aria-label="next"
              className={`${buttonClassName} absolute right-0 top-0 z-10`}
              onClick={(event) => {
                event.stopPropagation();
                updateImage(nextImageIndex.toString());
                updateURL('image', nextImageIndex.toString());
              }}
            >
              <ArrowRightIcon className="h-6" />
            </button>
          </>
        ) : null}

        <div className="relative h-full w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#eceff0] dark:bg-neutral-900 animate-pulse rounded-xl">
              <span className="sr-only">Cargando imagen</span>
            </div>
          )}
          <div className="absolute inset-0 rounded-xl border border-neutral-00 dark:border-neutral-00" />
          <Image
            className={`h-full w-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={validImages[imageIndex]?.src || ''}
            alt={validImages[imageIndex]?.altText || 'Imagen de producto'}
            priority={true}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcsGJhPQAGAwHAoFyw7AAAAABJRU5ErkJggg=="
            onLoad={() => setIsLoading(false)}
          />
          </div>
      </div>

      {validImages.length > 1 ? (
        <ul className="flex items-center justify-center gap-2 overflow-auto py-1">
          {validImages.map((image, index) => {
            const isActive = index === imageIndex;
            return (
              <li key={image.src} className="h-20 w-20">
                <button
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={isActive}
                  className="h-full w-full"
                  onClick={() => {
                    updateImage(index.toString());
                    updateURL('image', index.toString());
                  }}
                >
                  <GridTileImage
                    alt={image.altText || ''}
                    src={image.src}
                    fill
                    sizes="(min-width: 1024px) 20vw, 20vw"
                    isInteractive={!isActive}
                    active={isActive}
                    priority={index < 4} // Solo priorizar las primeras 4 miniaturas
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
