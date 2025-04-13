import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

interface BranchButtonProps {
  href?: string;
  className?: string;
}

export default function BranchButton({ 
  href = '/sucursales',
  className = ''
}: BranchButtonProps) {
  return (
    <div className={`rounded-full p-1 bg-green-100 ${className}`}>
      <Link 
        href={href}
        className="flex items-center justify-center gap-2 px-8 py-3 bg-green-500 text-white font-bold rounded-full transition-all duration-300 hover:bg-green-600 hover:shadow-lg"
      >
        <FaWhatsapp className="text-xl" />
        <span>Sucursales</span>
      </Link>
    </div>
  );
} 