"use client"

import { useState, useMemo } from "react"
import { useCart } from "./cart-context"
import { Plus, Minus, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string;
  name: string;
  price: number;
  media?: string[];
  image_url?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

export default function TarjetaFinal({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // 1. Lógica de Imágenes (Anti-Duplicados)
  const mediaList = useMemo(() => {
    let list: string[] = []
    if (product.media && Array.isArray(product.media) && product.media.length > 0) {
      const validUrls = product.media.filter((url: unknown): url is string => typeof url === 'string' && url.length > 5)
      list = Array.from(new Set(validUrls))
    } else if (product.image_url && typeof product.image_url === 'string') {
      list = [product.image_url]
    } else if (product.imageUrl) {
      list = [product.imageUrl]
    }
    return list
  }, [product])

  const hasMultipleImages = mediaList.length > 1
  const currentImage = mediaList.length > 0 ? mediaList[currentIndex] : null

  // 2. Navegación Carrusel
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev + 1) % mediaList.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length)
  }

  // 3. Cantidad y Agregar
  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setQuantity(prev => prev + 1)
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (quantity > 1) setQuantity(prev => prev - 1)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    for (let i = 0; i < quantity; i++) {
        addToCart(product);
    }
    setQuantity(1); // Resetear cantidad
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)
  }

  return (
    <div className="group flex flex-col gap-3 w-full select-none relative bg-white rounded-2xl">

      {/* IMAGEN + CONTROLES */}
      <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-[20px] overflow-hidden shadow-sm border border-gray-100">

        {/* Contador */}
        {hasMultipleImages && (
            <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full z-20 backdrop-blur-md">
                {currentIndex + 1} / {mediaList.length}
            </div>
        )}

        {/* Foto */}
        {currentImage ? (
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
             <ShoppingBag size={40} />
             <span className="text-xs font-bold mt-2">SIN FOTO</span>
          </div>
        )}

        {/* Flechas */}
        {hasMultipleImages && (
            <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 text-black p-2 rounded-full shadow-lg hover:bg-white z-20">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 text-black p-2 rounded-full shadow-lg hover:bg-white z-20">
                    <ChevronRight size={20} />
                </button>
            </>
        )}

        {/* --- BARRA INFERIOR (BOTONES) --- */}
        {/* Esto es lo que no se veía antes */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 z-[50]">

            {/* Selector (- 1 +) */}
            <div className="flex items-center bg-white rounded-full shadow-xl px-1 gap-1 h-11 border border-gray-100">
                <button onClick={handleDecrement} className="w-8 h-full flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-600">
                    <Minus size={16} />
                </button>
                <span className="font-bold text-sm w-5 text-center text-slate-900">{quantity}</span>
                <button onClick={handleIncrement} className="w-8 h-full flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-600">
                    <Plus size={16} />
                </button>
            </div>

            {/* Botón AGREGAR */}
            <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white rounded-full h-11 flex items-center justify-center font-bold text-xs uppercase tracking-wider shadow-xl hover:bg-gray-800 active:scale-95 transition-all gap-2"
            >
                <span>AGREGAR</span>
                <Plus size={16} className="hidden sm:block" />
            </button>
        </div>

      </div>

      {/* INFO */}
      <div className="px-1">
        <div className="flex justify-between items-start gap-3">
            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 uppercase">
                {product.name}
            </h3>
            <span className="font-black text-base text-slate-900">
                {formatPrice(product.price || 0)}
            </span>
        </div>
      </div>
    </div>
  )
}