import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';

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

  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-[#eceff0] hover:border-neutral-400 dark:hover:border-neutral-600 dark:bg-black',
        {
          relative: label,
          'border-2 border-neutral-500': active,
          'border-neutral-200 dark:border-neutral-800': !active
        }
      )}
    >
      {hasValidSrc ? (
        <Image
          className={clsx('relative h-full w-full object-cover aspect-square', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
          })}
          {...props}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcsGJhPQAGAwHAoFyw7AAAAABJRU5ErkJggg=="
          priority={props.priority}
          alt={props.alt || "Imagen de producto"}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#eceff0] dark:bg-neutral-900">
          <span className="text-sm text-neutral-500">Sin imagen</span>
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
