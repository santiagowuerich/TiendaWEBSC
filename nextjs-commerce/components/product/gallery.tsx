'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from 'components/grid/tile';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import Image from 'next/image';
import { useState, useEffect, useTransition, useRef } from 'react';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  // Si no hay imágenes, mostrar un placeholder
  if (!images?.length) {
    console.warn('No se proporcionaron imágenes al componente Gallery');
    return (
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-xl bg-[#eceff0] flex items-center justify-center">
          <span className="text-neutral-500">Imagen no disponible</span>
        </div>
      </div>
    );
  }

  // Filtra imágenes sin URL o con URLs inválidas
  const validImages = images.filter(img => img.src && typeof img.src === 'string' && img.src.trim() !== '');
  
  // Si no hay imágenes válidas después del filtrado
  if (!validImages.length) {
    console.warn('No hay imágenes válidas para mostrar en Gallery');
    return (
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-xl bg-[#eceff0] flex items-center justify-center">
          <span className="text-neutral-500">Imagen no disponible</span>
        </div>
      </div>
    );
  }

  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const [isPending, startTransition] = useTransition();
  
  // Asegúrate de que el índice de imagen sea válido
  const initialImageIndex = state.image ? parseInt(state.image) : 0;
  const imageIndex = initialImageIndex < validImages.length ? initialImageIndex : 0;
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const currentSrc = validImages[imageIndex]?.src || '';

  const nextImageIndex = imageIndex + 1 < validImages.length ? imageIndex + 1 : 0;
  const previousImageIndex = imageIndex === 0 ? validImages.length - 1 : imageIndex - 1;

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';

  // Verificar si la imagen actual es de Sanity
  const isSanityImage = validImages[imageIndex]?.src && 
    typeof validImages[imageIndex].src === 'string' && 
    validImages[imageIndex].src.includes('cdn.sanity.io') ? true : false;

  // Función para cambiar la imagen con transición
  const changeImage = (newIndex: number) => {
    // Si aún no hemos cargado esta imagen antes, establecer isLoading a true
    if (!loadedImages.has(validImages[newIndex]?.src || '')) {
      setIsLoading(true);
    } else {
      // Si ya la cargamos antes, no mostrar el loader
      setIsLoading(false);
    }
    
    startTransition(() => {
      updateImage(newIndex.toString());
      updateURL('image', newIndex.toString());
    });
  };

  // Manejar la carga de la imagen
  const handleImageLoad = () => {
    // Marcar esta imagen como cargada
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(currentSrc);
      return newSet;
    });
    setIsLoading(false);
  };

  // Cuando cambia la imagen actual, actualizar el estado de carga
  useEffect(() => {
    // Si la imagen ya está en nuestro set de imágenes cargadas, no mostrar el loader
    if (loadedImages.has(currentSrc)) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [currentSrc, loadedImages]);

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
              aria-label="anterior"
              className={`${buttonClassName} absolute left-0 top-0 z-10`}
              onClick={(event) => {
                event.stopPropagation();
                changeImage(previousImageIndex);
              }}
            >
              <ArrowLeftIcon className="h-6" />
            </button>
            <button
              aria-label="siguiente"
              className={`${buttonClassName} absolute right-0 top-0 z-10`}
              onClick={(event) => {
                event.stopPropagation();
                changeImage(nextImageIndex);
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
          <div className="absolute inset-0 rounded-xl border-0" />
          <Image
            className={`h-full w-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={currentSrc}
            alt={validImages[imageIndex]?.altText || 'Imagen de producto'}
            priority={true}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            onLoad={handleImageLoad}
            unoptimized={isSanityImage === true}
            onError={() => {
              console.error(`Error al cargar la imagen: ${currentSrc}`);
              setIsLoading(false);
            }}
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>

      {validImages.length > 1 ? (
        <ul className="flex items-center justify-center gap-2 py-1 max-w-full">
          {validImages.slice(0, 5).map((image, index) => {
            const isActive = index === imageIndex;
            const isThumbnailSanityImage = image.src && 
              typeof image.src === 'string' && 
              image.src.includes('cdn.sanity.io') ? true : false;
              
            return (
              <li key={`thumbnail-${index}-${image.src}`} className="h-20 w-20">
                <button
                  aria-label={`Ir a imagen ${index + 1}`}
                  aria-current={isActive}
                  className="h-full w-full"
                  onClick={() => changeImage(index)}
                >
                  <GridTileImage
                    alt={image.altText || ''}
                    src={image.src}
                    fill
                    sizes="(min-width: 1024px) 20vw, 20vw"
                    isInteractive={!isActive}
                    active={isActive}
                    priority={index < 4} // Solo priorizar las primeras 4 miniaturas
                    unoptimized={isThumbnailSanityImage === true}
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
