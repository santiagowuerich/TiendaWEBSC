'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';
import { useState } from 'react';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
} & React.ComponentProps<typeof Image>) {
  // Verificar si src existe y es una URL válida
  const hasValidSrc = props.src && 
    typeof props.src === 'string' && 
    (props.src.startsWith('http') || props.src.startsWith('/'));
    
  // Estado para controlar cuando la imagen ha cargado
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={clsx(
        'group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-black',
        {
          'ring-2 ring-neutral-00': active
        }
      )}
      style={{ contain: 'paint' }} // Optimiza la capa de pintura
    >
      {hasValidSrc ? (
        <>
          <div className="h-full w-full py-[100px]">
            <Image
              className={clsx('h-full w-full object-cover rounded-lg', {
                'transition duration-300 ease-in-out group-hover:scale-105': isInteractive,
                'opacity-100': imageLoaded,
                'opacity-0': !imageLoaded
              })}
              {...props}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              priority={props.priority}
              alt={props.alt || "Imagen de producto"}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-sm text-neutral-
          00">Sin imagen</span>
        </div>
      )}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
