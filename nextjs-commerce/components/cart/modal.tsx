'use client';

import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import OpenCart from './open-cart';

// Componente simplificado que reemplaza al carrito
// En lugar de mostrar un modal con artículos, muestra un enlace a WhatsApp
export default function CartModal() {
  // Número de WhatsApp al que se enviará el mensaje
  const phoneNumber = '5493625281890'; // Número correcto +54 9 3625 281890
  
  // Mensaje genérico para WhatsApp
  const message = encodeURIComponent(
    '¡Hola! Me gustaría hacer un pedido o consultar sobre sus productos.'
  );
  
  // URL de WhatsApp con el mensaje
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <Link 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center"
    >
      <button aria-label="Contactar por WhatsApp" className="relative flex items-center justify-center rounded-md border border-neutral-200 bg-white p-2 text-black hover:bg-green-100 dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:bg-green-900">
        <ShoppingCartIcon className="h-6 w-6 transition-all ease-in-out hover:scale-110 text-green-600" />
      </button>
    </Link>
  );
}
