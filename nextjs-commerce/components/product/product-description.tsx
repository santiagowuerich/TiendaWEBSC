// import { AddToCart } from 'components/cart/add-to-cart'; // Eliminado
import Price from 'components/price';
import Prose from 'components/prose';
import { FaWhatsapp } from 'react-icons/fa';
// import { Product } from 'lib/shopify/types'; // Eliminado

// Componente para el botón de WhatsApp
function WhatsAppButton({ product }: { product: any }) {
  // Formatear el mensaje con información del producto
  const message = encodeURIComponent(
    `¡Hola! Me interesa el producto "${product.title}" con precio ${product.priceRange.maxVariantPrice.amount} ${product.priceRange.maxVariantPrice.currencyCode}. ¿Está disponible?`
  );
  
  // Número de WhatsApp con código de país para Argentina
  const phoneNumber = '5493625281890'; // Número correcto +54 9 3625 281890
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  
  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center rounded-xl bg-green-600 p-5 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-green-700 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2"
    >
      <FaWhatsapp className="mr-3 text-2xl" />
      Comprar por WhatsApp
    </a>
  );
}

export function ProductDescription({ product }: { product: any }) {
  return (
    <>
      <div className="mb-8 flex flex-col border-b border-neutral-300 pb-6 dark:border-neutral-00">
        <h1 className="mb-5 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-5xl">{product.title}</h1>
        <div className="mb-4 flex items-center">
          <div className="rounded-xl bg-blue-600 px-6 py-3 text-xl font-bold text-white shadow-md">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      </div>
      
      {/* Mostrar descripción del producto */}
      {product.description ? (
        <div className="mb-10 rounded-xl bg-neutral-50 p-8 shadow-md dark:bg-neutral-900">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">Descripción</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">{product.description}</p>
          </div>
        </div>
      ) : null}
      
      {/* Botón de WhatsApp */}
      <div className="mt-10">
        <WhatsAppButton product={product} />
      </div>
    </>
  );
}
