'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyLinkButtonProps {
  linkTienda: string;
}

export default function CopyLinkButton({ linkTienda }: CopyLinkButtonProps) {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(linkTienda);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 w-full ${
        copiado 
          ? 'bg-green-500 text-white' 
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
      }`}
    >
      {copiado ? (
        <>
          <Check size={20} />
          <span>¡Link copiado!</span>
        </>
      ) : (
        <>
          <Copy size={20} />
          <span>Copiar Link Tienda</span>
        </>
      )}
    </button>
  );
}