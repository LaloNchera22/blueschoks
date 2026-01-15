"use client"

import { useCart } from "./cart-context"
import { Plus, ShoppingBag } from "lucide-react"

export default function TarjetaNueva({ product }: { product: any }) {
  const { addToCart } = useCart()

  // Lógica para imagen
  let imageSrc = null;
  if (product.media && Array.isArray(product.media) && product.media.length > 0) {
    imageSrc = product.media[0];
  } else if (product.image_url && typeof product.image_url === 'string' && product.image_url.length > 5) {
    imageSrc = product.image_url;
  } else if (product.imageUrl) {
    imageSrc = product.imageUrl;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)
  }

  return (
    <div className="group flex flex-col gap-3 w-full cursor-pointer bg-white">
      
      {/* 1. FOTO VERTICAL (Aspecto 3:4) */}
      <div className="relative w-full aspect-[3/4] bg-slate-100 rounded-[20px] overflow-hidden shadow-sm border border-slate-100">
        
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
             <ShoppingBag size={32} />
             <span className="text-[10px] font-bold mt-2">SIN FOTO</span>
          </div>
        )}

        {/* Botón Circular Flotante */}
        <button 
            onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
            }}
            className="absolute bottom-3 right-3 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20"
        >
            <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* 2. TEXTO MINIMALISTA */}
      <div className="px-1">
        <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
                {product.name}
            </h3>
            <span className="font-bold text-sm text-slate-900">
                {formatPrice(product.price || 0)}
            </span>
        </div>
      </div>
      
      {/* Botón Móvil */}
      <button 
        onClick={() => addToCart(product)}
        className="md:hidden w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold mt-2"
      >
        Agregar
      </button>

    </div>
  )
}