'use client';

import BranchButton from './branch-button';

export default function FloatingBranchButton() {
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