// import { AddToCart } from 'components/cart/add-to-cart'; // Eliminado
import Price from 'components/price';
import Prose from 'components/prose';
import { FaWhatsapp } from 'react-icons/fa';
// import { Product } from 'lib/shopify/types'; // Eliminado

// Función para calcular precios con recargo y cuotas
function calculateInstallmentPayments(basePrice: number) {
  const priceWithSurcharge3 = basePrice * 1.20;
  const installment3 = priceWithSurcharge3 / 3;

  const priceWithSurcharge6 = basePrice * 1.30;
  const installment6 = priceWithSurcharge6 / 6;

  return {
    installments3: {
      totalPrice: priceWithSurcharge3.toFixed(2),
      installmentPrice: installment3.toFixed(2),
    },
    installments6: {
      totalPrice: priceWithSurcharge6.toFixed(2),
      installmentPrice: installment6.toFixed(2),
    }
  };
}

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
  const basePrice = parseFloat(product.priceRange.maxVariantPrice.amount);
  const paymentOptions = calculateInstallmentPayments(basePrice);

  return (
    <>
      <div className="flex flex-col">
        <h1 className="mb-5 text-center text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-5xl">{product.title}</h1>
        
        {/* Main Price Box */}
        <div className="mb-3 w-full rounded-xl bg-blue-600 px-6 py-3 text-center text-white shadow-md">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode} // Kept for number formatting (e.g., $ symbol)
            currencyCodeClassName="hidden" // Hide the "ARS" text part from Price component
            className="text-xl font-bold" // Apply to the <p> tag rendered by Price component
          />
          <span className="mt-1 block text-xs font-normal opacity-90">Transferencia o Efectivo</span>
        </div>

        {/* Installment Options Container */}
        <div className="flex w-full flex-col space-y-3">
          {/* 3 Installments Box */}
          <div className="w-full rounded-xl bg-blue-600 px-6 py-3 text-center text-xl font-bold text-white shadow-md">
            <p> 
              3 cuotas de ${paymentOptions.installments3.installmentPrice}
            </p>
          </div>
          
          {/* 6 Installments Box */}
          <div className="w-full rounded-xl bg-blue-600 px-6 py-3 text-center text-xl font-bold text-white shadow-md">
            <p>
              6 cuotas de ${paymentOptions.installments6.installmentPrice}
            </p>
          </div>
        </div>
      </div>
      
      {/* Botón de WhatsApp */}
      <div className="mt-10">
        <WhatsAppButton product={product} />
      </div>
    </>
  );
}
