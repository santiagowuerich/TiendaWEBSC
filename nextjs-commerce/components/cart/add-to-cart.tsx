'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useProduct } from 'components/product/product-context';
import { useCart } from './cart-context';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SanityProduct, ProductVariant, ProductOption } from 'lib/sanity/types';

function SubmitButton({
  availableForSale,
  inStock,
  selectedVariantId
}: {
  availableForSale: boolean;
  inStock: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale || !inStock) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Sin Stock
      </button>
    );
  }

  if (!selectedVariantId && selectedVariantId !== undefined) {
    return (
      <button
        aria-label="Por favor selecciona una opción"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Agregar al Carrito
      </button>
    );
  }

  return (
    <button
      aria-label="Agregar al carrito"
      className={clsx(buttonClasses, {
        'hover:opacity-90': true
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Agregar al Carrito
    </button>
  );
}

export function AddToCart({ product }: { product: SanityProduct }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { addCartItem } = useCart();
  const { state } = useProduct();

  const variants = product.variants || [];
  const hasVariants = variants.length > 0;
  
  // Si no hay variantes, usamos los valores del producto principal
  const defaultVariant: ProductVariant = {
    id: product._id,
    name: product.name,
    price: product.price,
    stock: product.stock
  };

  const variant = hasVariants
    ? variants.find((v) => {
        if (!product.options) return false;
        return product.options.every(
          (option: ProductOption) => state[option.name.toLowerCase()] === option.value
        );
      })
    : defaultVariant;

  const selectedVariantId = variant?.id;
  const inStock = variant ? variant.stock > 0 : product.stock > 0;

  async function handleAdd() {
    if (!variant) return;
    addCartItem(variant, product);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await handleAdd();
        });
      }}
    >
      <SubmitButton
        availableForSale={product.availableForSale}
        inStock={inStock}
        selectedVariantId={selectedVariantId}
      />
    </form>
  );
}
