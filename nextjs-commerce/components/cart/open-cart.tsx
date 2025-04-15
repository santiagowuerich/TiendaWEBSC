import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function OpenCart({
  className
}: {
  className?: string;
}) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-green-600 transition-colors hover:bg-green-100 dark:border-neutral-00 dark:text-green-500 dark:hover:bg-green-900">
      <ShoppingCartIcon
        className={clsx('h-5 transition-all ease-in-out hover:scale-110', className)}
      />
    </div>
  );
}
