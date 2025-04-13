'use client';

import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

interface BranchButtonProps {
  href?: string;
  className?: string;
  floating?: boolean;
}

export default function BranchButton({ 
  href = '/Whatsapp',
  className = '',
  floating = false
}: BranchButtonProps) {
  const baseClasses = "rounded-full p-1 bg-green-100";
  const floatingClasses = floating 
    ? "fixed bottom-6 right-6 shadow-xl z-50 hover:scale-105 transition-transform duration-300" 
    : "";
  
  return (
    <div className={`${baseClasses} ${floatingClasses} ${className}`}>
      <Link 
        href={href}
        className="flex items-center justify-center gap-2 px-8 py-3 bg-green-500 text-white font-bold rounded-full transition-all duration-300 hover:bg-green-600 hover:shadow-lg"
      >
        <FaWhatsapp className="text-xl" />
        <span>WhatsApp</span>
      </Link>
    </div>
  );
} 