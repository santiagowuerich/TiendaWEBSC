'use client';

import BranchButton from './branch-button';
import { usePathname } from 'next/navigation';

export default function FloatingBranchButton() {
  const pathname = usePathname();
  
  // Función para determinar si mostrar el botón global de WhatsApp
  const shouldShowGlobalWhatsapp = (path: string): boolean => {
    return !path.startsWith('/producto/');
  };
  
  // Si estamos en una página de producto, no renderizar el botón global
  if (!shouldShowGlobalWhatsapp(pathname)) {
    return null;
  }
  
  // Número de WhatsApp para consultas
  const whatsappNumber = '5493625281890';
  const whatsappMessage = encodeURIComponent('Hola, me gustaría conocer su catálogo');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <BranchButton 
      href={whatsappUrl} 
      floating={true} 
      className="shadow-lg"
    />
  );
} 